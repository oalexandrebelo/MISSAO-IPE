import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const root = new URL('../', import.meta.url);
const [hostScript, guideScript, guideHtml] = await Promise.all([
  readFile(new URL('apps/immersive-lp/public/acessibilidade/libras.js', root), 'utf8'),
  readFile(new URL('apps/immersive-lp/public/acessibilidade/guia.js', root), 'utf8'),
  readFile(new URL('apps/immersive-lp/public/acessibilidade/guia.html', root), 'utf8'),
]);
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
function host(scope = 'lab', html = '') {
  const dom = new JSDOM(`<!doctype html><body>${html}<nav><a data-ipe-libras="${scope}" href="/acessibilidade/guia.html">Libras</a></nav></body>`, { url: 'https://mission.invalid/lab/', runScripts: 'outside-only', pretendToBeVisual: true });
  dom.window.eval(hostScript);
  const { document } = dom.window;
  const launcher = document.querySelector('[data-ipe-libras]');
  function open() {
    launcher.click();
    const frame = document.querySelector('iframe'); const messages = [];
    frame.contentWindow.postMessage = message => messages.push(message);
    frame.dispatchEvent(new dom.window.Event('load'));
    const ready = () => dom.window.dispatchEvent(new dom.window.MessageEvent('message', { origin: 'null', source: frame.contentWindow, data: { type: 'ipe-libras:ready' } }));
    return { frame, messages, ready };
  }
  return { dom, window: dom.window, document, launcher, open };
}
function button(document, label) { return [...document.querySelectorAll('button')].find(node => node.textContent === label); }

test('Libras opt-in opens a non-modal companion and close removes the external frame and observers', async t => {
  const app = host('lab', '<main data-ipe-libras-context="Escolha sua missão."><button id="game-action">Jogar</button></main>');
  t.after(() => app.dom.window.close());
  assert.equal(app.document.querySelector('iframe'), null);
  assert.equal(app.document.querySelector('script[src*="vlibras"]'), null);
  const { frame, messages, ready } = app.open(); ready();
  assert.equal(app.document.querySelector('dialog, [aria-modal="true"]'), null);
  assert.equal(frame.getAttribute('sandbox'), 'allow-scripts');
  assert.equal(app.window.sessionStorage.getItem('ipe:libras:continuous'), 'on');
  let clicked = false; app.document.querySelector('#game-action').onclick = () => { clicked = true; };
  app.document.querySelector('#game-action').click(); assert.equal(clicked, true);
  await wait(730);
  assert.ok(messages.some(message => message.type === 'ipe-libras:update' && message.passage === 'Escolha sua missão.'));
  button(app.document, 'Fechar').click(); const count = messages.length;
  assert.equal(app.document.querySelector('iframe'), null);
  assert.equal(app.window.sessionStorage.getItem('ipe:libras:continuous'), 'off');
  app.document.querySelector('main').setAttribute('data-ipe-libras-context', 'Depois de fechar.'); await wait(730);
  assert.equal(messages.length, count);
});

test('game context is read from approved attributes only; rapid changes coalesce and pause stops updates', async t => {
  const app = host('lab', '<main data-ipe-libras-context="Missão científica."><section id="context" data-ipe-libras-context="Instrumento científico."><span>Nome secreto e nome@example.invalid</span><textarea>Hipótese pessoal</textarea></section></main>');
  t.after(() => app.dom.window.close());
  const { messages, ready } = app.open(); ready(); await wait(730);
  const context = app.document.querySelector('#context');
  app.document.querySelector('main').setAttribute('data-ipe-libras-context', 'Contexto amplo da missão.');
  context.setAttribute('data-ipe-libras-context', 'Bateria de 16 Wh.');
  context.setAttribute('data-ipe-libras-context', 'Bateria de 24 Wh.'); await wait(730);
  assert.equal(messages.at(-1).passage, 'Bateria de 24 Wh.');
  assert.ok(!JSON.stringify(messages).includes('secreto'));
  assert.ok(!JSON.stringify(messages).includes('example.invalid'));
  assert.ok(!JSON.stringify(messages).includes('Hipótese'));
  button(app.document, 'Pausar tradução').click(); const updates = () => messages.filter(message => message.type === 'ipe-libras:update'); const pausedCount = updates().length;
  context.setAttribute('data-ipe-libras-context', 'Comunicação ampliada.'); await wait(730);
  assert.equal(updates().length, pausedCount);
  button(app.document, 'Continuar tradução').click(); await wait(730);
  assert.equal(updates().at(-1).passage, 'Comunicação ampliada.');
  const count = updates().length; button(app.document, 'Repetir trecho').click(); await wait(50);
  assert.equal(updates().length, count + 1); assert.equal(updates().at(-1).repeat, true);
});

test('the companion receives fresh game context while replay keeps changing it', async t => {
  const app = host('lab', '<main data-ipe-libras-context="Começar replay."></main>');
  t.after(() => app.dom.window.close());
  const { messages, ready } = app.open(); ready(); await wait(730);
  messages.length = 0;
  const context = app.document.querySelector('main');
  for (let step = 1; step <= 5; step++) {
    context.setAttribute('data-ipe-libras-context', `Trecho ${step} do replay.`);
    await wait(500);
  }
  assert.ok(messages.some(message => message.type === 'ipe-libras:update' && message.passage.includes('do replay.')), 'replay updates must arrive without a break in mutations');
  await wait(730);
  assert.equal(messages.at(-1).passage, 'Trecho 5 do replay.');
});

test('private dashboard never captures participant rows and public navigation excludes private fields', async t => {
  const dashboard = host('dashboard', '<main><h1>Participantes</h1><p>segredo@example.invalid</p></main>');
  const publicPage = host('public', '<main><h1>Missão Ipê</h1><p id="intro">Ciência acessível.</p><div data-private><p id="private">senha-secreta</p></div><form><input value="email-secreto"></form></main>');
  t.after(() => { dashboard.dom.window.close(); publicPage.dom.window.close(); });
  const a = dashboard.open(); a.ready(); const b = publicPage.open(); b.ready(); await wait(730);
  dashboard.document.querySelector('p').click(); publicPage.document.querySelector('#private').click(); await wait(730);
  assert.doesNotMatch(JSON.stringify(a.messages), /segredo@example/);
  assert.doesNotMatch(JSON.stringify(b.messages), /senha-secreta|email-secreto/);
  publicPage.document.querySelector('#intro').click(); await wait(730);
  assert.equal(b.messages.at(-1).passage, 'Ciência acessível.');
});

test('only the sandboxed companion may acknowledge readiness', async t => {
  const app = host('lab', '<main data-ipe-libras-context="Energia."></main>');
  t.after(() => app.dom.window.close());
  const { messages, frame } = app.open();
  for (const event of [{ origin: 'https://evil.invalid', source: frame.contentWindow }, { origin: 'null', source: app.window }]) app.window.dispatchEvent(new app.window.MessageEvent('message', { ...event, data: { type: 'ipe-libras:ready' } }));
  await wait(730); assert.equal(messages.filter(message => message.type === 'ipe-libras:update').length, 0);
});

function companion() {
  const dom = new JSDOM(guideHtml, { url: 'https://mission.invalid/acessibilidade/guia.html', runScripts: 'outside-only', pretendToBeVisual: true });
  const messages = [], translations = [], plays = []; let opens = 0;
  const parent = { postMessage: message => messages.push(message) };
  Object.defineProperty(dom.window, 'parent', { value: parent }); Object.defineProperty(dom.window, 'origin', { value: 'null' });
  dom.window.VLibras = { Widget: function () {} }; dom.window.VLibrasWidget = { open: () => { opens++; } };
  dom.window.vlibras = { isLoaded: true, status: 'idle', translate: async passage => { translations.push(passage); return `GLOSS ${passage}`; }, play: gloss => { if (gloss) plays.push(gloss); dom.window.vlibras.status = 'playing'; }, pause: () => { dom.window.vlibras.status = 'paused'; }, stop: () => {} };
  dom.window.eval(guideScript);
  const send = (data, origin = 'https://mission.invalid', source = parent) => dom.window.dispatchEvent(new dom.window.MessageEvent('message', { origin, source, data }));
  return { dom, window: dom.window, messages, translations, plays, send, opens: () => opens };
}

test('companion uses official translate/play API and preserves current phrase while keeping the latest pending context', async t => {
  const app = companion(); t.after(() => app.dom.window.close());
  app.send({ type: 'ipe-libras:init', passage: 'Não deve abrir.' }, 'https://evil.invalid');
  assert.equal(app.window.document.querySelector('script[src*="vlibras.gov.br"]'), null);
  app.send({ type: 'ipe-libras:init', passage: 'Instrumento.' });
  app.window.document.querySelector('script[src*="vlibras.gov.br"]').dispatchEvent(new app.window.Event('load'));
  await wait(550); assert.equal(app.opens(), 1); assert.deepEqual(app.plays, ['GLOSS Instrumento.']);
  app.send({ type: 'ipe-libras:update', passage: 'Bateria.' }); app.send({ type: 'ipe-libras:update', passage: 'Comunicação.' });
  await wait(1700); assert.equal(app.plays.length, 1, 'a new decision does not interrupt the current signs');
  app.window.vlibras.status = 'idle'; await wait(450);
  assert.deepEqual(app.translations, ['Instrumento.', 'Comunicação.']);
  assert.equal(app.messages.some(message => message.type === 'ipe-libras:ready'), true);
});

test('returning to the current passage drops the outdated pending translation', async t => {
  const app = companion(); t.after(() => app.dom.window.close());
  app.send({ type: 'ipe-libras:init', passage: 'Bateria A.' });
  await wait(550);
  assert.deepEqual(app.plays, ['GLOSS Bateria A.']);
  app.send({ type: 'ipe-libras:update', passage: 'Bateria B.' });
  app.send({ type: 'ipe-libras:update', passage: 'Bateria A.' });
  app.window.vlibras.status = 'idle'; await wait(1850);
  assert.deepEqual(app.plays, ['GLOSS Bateria A.']);
});

test('companion pause prevents translation; a failed service never plays untranslated Portuguese as gloss', async t => {
  const app = companion(); t.after(() => app.dom.window.close());
  app.send({ type: 'ipe-libras:init', passage: 'Instrumento.', paused: true }); await wait(450);
  assert.equal(app.translations.length, 0);
  app.window.vlibras.translate = async () => undefined;
  app.send({ type: 'ipe-libras:pause', paused: false }); await wait(450);
  assert.equal(app.plays.length, 0);
  assert.match(app.messages.at(-1).message, /tradução não respondeu/);
  assert.equal(app.window.document.querySelector('#ipe-libras-retry').hidden, false);
});
