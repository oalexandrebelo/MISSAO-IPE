import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { decorateLibrasPage } from '../scripts/public-libras.mjs';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('o atalho de Libras fica em uma região de navegação identificada', () => {
  const original = '<!doctype html><html lang="pt-BR"><head><title>Missão</title></head><body><main>Missão</main></body></html>';
  const dom = new JSDOM(decorateLibrasPage(original, 'index.html'));
  assert.ok(dom.window.document.querySelector('nav[aria-label="Acessibilidade"] > a[data-ipe-libras]'));
  dom.window.close();
});

test('rotas de publicação oferecem um ponto de acesso em Libras', async () => {
  for (const path of ['index.html', 'lab/index.html', 'dashboard/index.html', 'presentation/pitch/index.html', 'docs/index.html']) {
    const dom = new JSDOM(await read(`site/${path}`), { url: `https://beta.invalid/${path}` });
    const { document } = dom.window;
    const link = document.querySelector('a[data-ipe-libras]');
    assert.ok(link, path);
    assert.equal(new URL(link.href).pathname, '/acessibilidade/guia.html');
    assert.equal(link.dataset.ipeLibras, path.split('/')[0] === 'dashboard' ? 'dashboard' : path.split('/')[0] === 'lab' ? 'lab' : 'public');
    assert.ok(!document.querySelector('script[src*="vlibras.gov.br"]'), path);
    dom.window.close();
  }
});
