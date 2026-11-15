import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { JSDOM } from 'jsdom';

const origin = 'https://projeto-ipe-lp.vercel.app';
const readExport = path => readFile(new URL(`../apps/immersive-lp/out${path}`, import.meta.url), 'utf8');

test('guia da landing page resolve os mesmos assets no endereço Vercel e no arquivo exportado', async () => {
  const exportPath = '/acessibilidade/guia.html';
  const [page, guide] = await Promise.all([readExport('/index.html'), readExport(exportPath)]);
  const landing = new JSDOM(page, { url: origin });
  const launcher = landing.window.document.querySelector('a[data-ipe-libras]');
  assert.ok(launcher, 'Atalho de Libras ausente da landing page exportada');
  const launchUrl = new URL(launcher.href);
  assert.equal(launchUrl.href, `${origin}/acessibilidade/guia/`);
  landing.window.close();

  for (const url of [launchUrl, new URL(exportPath, origin)]) {
    const dom = new JSDOM(guide, { url });
    const { document } = dom.window;
    const stylesheet = document.querySelector('link[rel="stylesheet"][href]');
    const script = document.querySelector('script[src]');
    assert.ok(stylesheet && script, `CSS ou JavaScript ausente no guia em ${url.pathname}`);
    for (const [assetUrl, expectedPath] of [
      [stylesheet.href, '/acessibilidade/libras.css'],
      [script.src, '/acessibilidade/guia.js'],
    ]) {
      assert.equal(assetUrl, origin + expectedPath, `Asset inválido no guia em ${url.pathname}`);
      assert.ok((await readExport(expectedPath)).length > 0, `Asset não exportado: ${expectedPath}`);
    }
    dom.window.close();
  }
});
