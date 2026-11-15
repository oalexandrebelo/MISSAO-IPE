import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { allowPublicAnalytics, analyticsAsset, analyticsPrivateRoutes, decorateAnalyticsPage } from '../scripts/public-analytics.mjs';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const runtime = await read(`web/${analyticsAsset}`);
const host = 'https://nasa-missaoipe.alexandrebelo.com';
const html = '<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src-attr \'none\'; frame-src \'self\'"></head><body><main>Missão</main></body></html>';
const domAt = path => new JSDOM(html, { url: path, runScripts: 'outside-only' });

test('o builder inclui somente o carregador local nas páginas públicas', () => {
  for (const path of ['index.html', 'lab/index.html', 'presentation/pitch/index.html', 'docs/index.html']) {
    const dom = new JSDOM(decorateAnalyticsPage(html, path));
    assert.equal(dom.window.document.querySelector('script').getAttribute('src'), `/${analyticsAsset}`, path);
    assert.equal(dom.window.document.querySelector('script[data-cf-beacon]'), null);
    assert.match(dom.window.document.querySelector('meta').content, /script-src 'self' https:\/\/static.cloudflareinsights.com/);
    dom.window.close();
  }
  for (const path of ['equipe/index.html', 'dashboard/index.html', 'acessibilidade/guia.html', 'api/metrics.html', 'assets/code.js']) {
    assert.equal(decorateAnalyticsPage(html, path), html, path);
  }
});

test('o beacon não carrega fora do domínio oficial nem em páginas privadas', () => {
  for (const url of ['http://localhost/lab/index.html', 'https://projeto-ipe.vercel.app/', 'https://projeto-ipe-lp.vercel.app/', 'https://nasa-missaoipe.alexandrebelo.com.evil.invalid/', ...['/equipe', '/equipe/index.html', '/dashboard/index.html', '/acessibilidade/guia.html', '/api/metrics'].map(path => host + path)]) {
    const dom = domAt(url);
    dom.window.eval(runtime);
    assert.equal(dom.window.document.querySelector('script'), null, url);
    assert.equal(dom.window.document.documentElement.dataset.ipeAnalytics, 'inactive');
    dom.window.close();
  }
});

test('o carregador não lê campos, cookies ou armazenamento e não envia eventos personalizados', () => {
  const dom = domAt(host + '/lab/index.html');
  const { window } = dom;
  for (const property of ['localStorage', 'sessionStorage']) Object.defineProperty(window, property, { get() { throw new Error(`Leitura privada: ${property}`); } });
  Object.defineProperty(window.document, 'cookie', { get() { throw new Error('Leitura de cookies'); } });
  window.document.body.insertAdjacentHTML('beforeend', '<input name="name" value="Dado privado"><input name="email" value="privado@example.invalid">');
  Object.defineProperty(window.HTMLInputElement.prototype, 'value', { get() { throw new Error('Leitura de campo'); } });
  window.fetch = () => assert.fail('O carregador não envia eventos próprios');
  window.navigator.sendBeacon = () => assert.fail('O carregador não envia eventos próprios');
  window.eval(runtime);
  window.eval(runtime);
  const scripts = window.document.querySelectorAll('script[data-cf-beacon]');
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].type, 'module');
  assert.equal(scripts[0].src, 'https://static.cloudflareinsights.com/beacon.min.js');
  assert.deepEqual(JSON.parse(scripts[0].dataset.cfBeacon), { token: 'a31b0ab2eefb433781b0c28ea2ecd9bc', spa: false });
  assert.equal(window.document.documentElement.dataset.ipeAnalytics, 'loading');
  scripts[0].dispatchEvent(new window.Event('load'));
  assert.equal(window.document.documentElement.dataset.ipeAnalytics, 'script-loaded');
  let warning = '';
  window.console.warn = message => { warning = message; };
  scripts[0].dispatchEvent(new window.Event('error'));
  assert.equal(window.document.documentElement.dataset.ipeAnalytics, 'unavailable');
  assert.match(warning, /indisponíveis/);
  dom.window.close();
});

test('um iframe não pode ativar o beacon', () => {
  const dom = domAt(host + '/lab/index.html');
  const frame = dom.window.document.createElement('iframe');
  dom.window.document.body.append(frame);
  frame.contentWindow.eval(runtime);
  assert.equal(frame.contentDocument.querySelector('script'), null);
  dom.window.close();
});

test('CSP preserva restrições e abre só as duas origens oficiais nas rotas públicas', async () => {
  const base = "default-src 'self'; script-src 'self' 'sha256-example'; script-src-attr 'none'; connect-src 'self' blob:; frame-src 'self'; object-src 'none'";
  const result = allowPublicAnalytics(base);
  assert.equal(allowPublicAnalytics(result), result);
  assert.match(result, /script-src 'self' 'sha256-example' https:\/\/static.cloudflareinsights.com;/);
  assert.match(result, /connect-src 'self' blob: https:\/\/cloudflareinsights.com;/);
  assert.match(result, /script-src-attr 'none'/);
  assert.match(result, /frame-src 'self'; object-src 'none'/);
  const publicRule = new RegExp(`^/((?!planet-jumping\\.html$|${analyticsPrivateRoutes}).*)$`);
  const privateRule = new RegExp(`^/((?!acessibilidade/guia\\.html$)${analyticsPrivateRoutes}.*)$`);
  for (const path of ['/lab/index.html', '/docs/index.html', '/presentation/pitch/index.html']) assert.ok(publicRule.test(path));
  for (const path of ['/equipe', '/equipe/index.html', '/dashboard/index.html', '/api/metrics']) {
    assert.equal(publicRule.test(path), false);
    assert.equal(privateRule.test(path), true);
  }
  assert.equal(publicRule.test('/acessibilidade/guia.html'), false);
  assert.equal(privateRule.test('/acessibilidade/guia.html'), false);
  const builder = await read('scripts/build-beta-site.mjs');
  assert.match(builder, /bytes = decorateAnalyticsPage\(bytes.toString\(\), target\)/);
  assert.ok(builder.includes('await copy(`web/${analyticsAsset}`, analyticsAsset'));
  const preparation = await read('scripts/prepare-vercel-static.mjs');
  assert.match(preparation, /const privateCsp = policy\(inlineHashes\)/);
  assert.match(preparation, /csp = allowPublicAnalytics\(privateCsp\)/);
});
