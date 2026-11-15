import test, { after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';
import { IDBFactory } from 'fake-indexeddb';
import { installInventoryApi, installMetricsApi, TEST_SESSION } from './metrics-api-fixture.mjs';

const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://mission.test/', pretendToBeVisual: true });
for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLInputElement', 'HTMLTextAreaElement', 'HTMLSelectElement', 'HTMLDialogElement', 'HTMLCanvasElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle', 'localStorage', 'location']) {
  Object.defineProperty(globalThis, key, { configurable: true, writable: true, value: dom.window[key] });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.scrollTo = () => {};
dom.window.HTMLElement.prototype.scrollIntoView = () => {};
dom.window.HTMLCanvasElement.prototype.getContext = () => null;
dom.window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
dom.window.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
dom.window.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} });
const { render, screen, fireEvent, act, cleanup, waitFor, within } = await import('@testing-library/react');
const { default: App } = await import('../src/App.tsx');
const { metricsKey, readMetrics, summarizeBrunoAttempt } = await import('../src/metrics/player-metrics.ts');
const { BRUNO_INSTRUMENTS, BRUNO_INVENTORY_MODEL_VERSION, BRUNO_MISSIONS, simulateBrunoMission } = await import('../src/lab/bruno-missions.ts');
const { EXPEDITIONS } = await import('../src/lab/scientific-expeditions.ts');
const click = async name => act(async () => fireEvent.click(screen.getByRole('button', { name })));
const saved = () => readMetrics(localStorage, TEST_SESSION.sessionId);
afterEach(async () => act(async () => cleanup()));
after(() => dom.window.close());

async function resume() {
  await act(async () => render(React.createElement(App)));
  await click('Iniciar jogo');
  await click('Retomar jogo');
  await screen.findByRole('heading', { name: 'Escolha seu próximo destino.' });
}
async function choose(label) {
  const picker = screen.getByRole('group', { name: 'Selecionar missão' });
  await act(async () => fireEvent.click(within(picker).getByRole('button', { name: new RegExp(label) })));
  await click(`Jogar ${label}`);
}
async function lobby() { await click('Menu'); await click('Selecionar missão'); }

test('the real App routes all seven lobby choices to their mission, without recording a launch on selection', async () => {
  localStorage.clear(); globalThis.indexedDB = new IDBFactory();
  const api = installMetricsApi();
  await resume();
  for (const [label, id] of [['ISS', 'iss'], ['LUA', 'moon'], ['MARTE', 'mars'], ['EUROPA', 'europa'], ['CERRADO', 'cerrado'], ['BENNU', 'bennu'], ['WEBB', 'telescope']]) {
    await choose(label);
    const title = id === 'cerrado' ? 'Monte sua missão.' : BRUNO_MISSIONS[id]?.name ?? EXPEDITIONS[id].title;
    assert.ok(await screen.findByRole('heading', { name: title }));
    assert.equal(saved().filter(entry => entry.event.kind === 'attempt').length, 0, id);
    await lobby();
  }
  assert.equal(api.received.filter(event => event.kind === 'attempt').length, 0);
});

test('the shop selects a mission instrument from each hangar and opens on the catalog default from the lobby', async () => {
  localStorage.clear(); globalThis.indexedDB = new IDBFactory();
  installMetricsApi();
  await resume();
  const expectSelected = id => {
    const item = BRUNO_INSTRUMENTS[id];
    const catalog = screen.getByRole('group', { name: 'Catálogo de instrumentos' });
    assert.equal(within(catalog).getByRole('button', { name: `${item.label} ${item.priceCredits} créditos` }).getAttribute('aria-pressed'), 'true');
    assert.ok(screen.getByRole('heading', { name: item.label }));
  };
  for (const [mission, instrument] of [['ISS', 'iss-air-quality'], ['LUA', 'lunar-neutron'], ['MARTE', 'mars-meda'], ['EUROPA', 'europa-mise']]) {
    await choose(mission); await click('Abrir hangar'); await click('Loja e inventário');
    expectSelected(instrument);
    await click('Voltar ao hangar'); await lobby();
  }
  await click('Loja e inventário');
  expectSelected('iss-air-quality');
});

async function part(label, option) {
  await click(label);
  await act(async () => fireEvent.click(screen.getByRole('radio', { name: option })));
}
async function inspectStock(id) {
  const item = BRUNO_INSTRUMENTS[id];
  const catalog = screen.getByRole('group', { name: 'Catálogo de instrumentos' });
  await act(async () => fireEvent.click(within(catalog).getByRole('button', { name: `${item.label} ${item.priceCredits} créditos` })));
  return item;
}
async function buy(id) {
  const item = await inspectStock(id);
  await click(`Comprar ${item.label} · ${item.priceCredits} créditos`);
}

test('Europa purchases replay a lost receipt, reserve both instruments, consume condition and record one confirmed attempt', async () => {
  localStorage.clear(); globalThis.indexedDB = new IDBFactory();
  const api = await installInventoryApi();
  await resume(); await choose('EUROPA'); await click('Abrir hangar'); await click('Loja e inventário');
  await screen.findByRole('heading', { name: 'Loja e inventário' });
  assert.equal(document.querySelector('.bruno-wallet dd').textContent, '25');
  assert.equal(screen.getByRole('group', { name: 'Catálogo de instrumentos' }).querySelectorAll('button').length, 7);

  api.loseNextAcknowledgement('buy');
  await buy('europa-mise');
  assert.equal(document.querySelector('.bruno-wallet dd').textContent, 'Indisponível');
  const duplicatePurchase = screen.getByRole('button', { name: /^Comprar Espectrômetro infravermelho/ });
  assert.equal(duplicatePurchase.disabled, true);
  await click('Confirmar operação anterior');
  const purchases = api.calls.filter(call => call?.command?.kind === 'buy');
  assert.deepEqual(purchases[0], purchases[1]);
  assert.equal(document.querySelector('.bruno-wallet dd').textContent, '17');

  await buy('europa-reason');
  await buy('bennu-ovirs');
  assert.ok(screen.getByText(/Referência do acervo Bennu/));
  await click(/^Devolver Espectrômetro de superfície/);
  assert.equal(document.querySelector('.bruno-wallet dd').textContent, '9');

  await click('Voltar ao hangar');
  await click('Instrumento'); await click(/^Equipar Espectrômetro infravermelho/);
  assert.equal(screen.getByRole('button', { name: /^Equipar Radar do gelo/ }).disabled, true);
  assert.ok(screen.getByText(/A carga ocupa 3 espaços/));
  await part('Lançador', /Maior capacidade/);
  await part('Energia', /Reserva ampliada/);
  await part('Proteção', /Reforçada/);
  await part('Navegação e enlace', /Enlace direcional/);
  await click('Instrumento'); await click(/^Equipar Radar do gelo/);

  let craft = document.querySelector('[data-bruno-craft]');
  assert.match(craft.dataset.instruments, /europa-mise europa-reason/);
  assert.equal(craft.dataset.instrumentCycles, '3 3');
  assert.ok(screen.getByText('3 de 4 encaixes ocupados'));
  assert.equal(screen.getByRole('button', { name: 'Inspecionar referência NASA · 34 MiB' }).getAttribute('aria-pressed'), 'false');
  await click('Simular lançamento');
  assert.ok(await screen.findByRole('heading', { name: 'Missão concluída' }));
  assert.equal(screen.getAllByText('3 → 2 ciclos').length, 2);
  assert.ok(screen.getByText(/Partida: 2 créditos.*Prêmio confirmado: 8 créditos/));

  let attempts = saved().filter(item => item.event.kind === 'attempt');
  assert.equal(attempts.length, 1);
  const entry = attempts[0];
  assert.equal(entry.sync, 'synced');
  assert.equal(entry.event.mission, 'europa');
  assert.equal(entry.event.payload.config.modelVersion, BRUNO_INVENTORY_MODEL_VERSION);
  const result = simulateBrunoMission('europa', entry.event.payload.config);
  assert.equal(result.deliveredRecords, 6);
  assert.deepEqual(entry.summary, summarizeBrunoAttempt(result));
  assert.equal(api.calls.filter(call => call?.command?.kind === 'launch').length, 1);
  assert.equal(api.calls.filter(call => call?.command?.kind === 'complete').length, 1);
  assert.equal(api.calls.some(call => call?.events?.some(event => event.kind === 'attempt')), false);

  await click('Redesenhar nave');
  await click('Ver A no 3D');
  craft = document.querySelector('[data-bruno-craft]');
  assert.equal(craft.dataset.instrumentCycles, '3 3');
  await click('Ver B no 3D');
  assert.equal(craft.dataset.instrumentCycles, '2 2');
  await click('Loja e inventário');
  assert.equal(document.querySelector('.bruno-wallet dd').textContent, '15');
  assert.equal(screen.getByRole('button', { name: /^Devolver Radar do gelo/ }).disabled, true);
  await act(async () => fireEvent.click(screen.getByText('Recomeçar a carteira', { selector: 'summary' })));
  await click('Recomeçar carteira'); await click('Confirmar reinício');
  assert.equal(document.querySelector('.bruno-wallet dd').textContent, '25');
  assert.ok(screen.getByText('Seu inventário está vazio.'));
  const server = await api.snapshot();
  assert.equal(server.schemaVersion, 2);
  assert.equal(server.attempts.length, 1);
  assert.equal(server.attempts[0].metricEvent.schemaVersion, 2);
  assert.equal(server.attempts[0].metricEvent.id, entry.event.id);

  await act(async () => cleanup()); await resume();
  await waitFor(() => assert.equal(saved().filter(item => item.event.kind === 'attempt').length, 1));
  attempts = saved().filter(item => item.event.kind === 'attempt');
  assert.equal(attempts[0].event.id, entry.event.id);
  await click('Meu progresso');
  assert.equal(document.querySelectorAll('.player-attempt-list > li').length, 1);
  assert.equal(localStorage.getItem(metricsKey(TEST_SESSION.sessionId)).includes('@'), false);
});

test('an unavailable wallet keeps purchase and launch unavailable until a real inventory read returns', async () => {
  localStorage.clear(); globalThis.indexedDB = new IDBFactory();
  const api = await installInventoryApi();
  api.setInventoryOnline(false);
  await resume(); await click('Loja e inventário');
  assert.equal(document.querySelector('.bruno-wallet dd').textContent, 'Indisponível');
  assert.equal(screen.getByRole('button', { name: /^Comprar/ }).disabled, true);
  await click('Voltar às missões'); await choose('ISS'); await click('Abrir hangar');
  assert.equal(screen.getByRole('button', { name: 'Simular lançamento' }).disabled, true);
  assert.ok(screen.getByText(/Conecte-se para calcular os indicadores/));
  api.setInventoryOnline(true);
  await click('Atualizar inventário');
  assert.equal(screen.getByRole('button', { name: 'Simular lançamento' }).disabled, false);
  assert.equal(api.calls.some(call => call?.command?.kind === 'launch'), false);
});

test('the normal launch countdown completes once and persists the computed result', async () => {
  localStorage.clear(); globalThis.indexedDB = new IDBFactory();
  await installInventoryApi();
  dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  try {
    await resume(); await choose('ISS'); await click('Abrir hangar');
    await click('Loja e inventário'); await buy('iss-air-quality'); await click('Voltar ao hangar');
    await click('Instrumento'); await click(/^Equipar Monitor de compostos/);
    await part('Proteção', /Reforçada/);
    await click('Simular lançamento');
    assert.ok(screen.getByRole('heading', { name: 'Operação da missão' }));
    assert.equal(saved().filter(entry => entry.event.kind === 'attempt').length, 0);
    await screen.findByRole('heading', { name: 'Missão concluída' }, { timeout: 10000 });
    const attempts = saved().filter(entry => entry.event.kind === 'attempt');
    assert.equal(attempts.length, 1);
    assert.deepEqual(attempts[0].summary, summarizeBrunoAttempt(simulateBrunoMission('iss', attempts[0].event.payload.config)));
    await lobby();
    assert.equal(saved().filter(entry => entry.event.kind === 'attempt').length, 1);
  } finally {
    dom.window.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} });
  }
});
