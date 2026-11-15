import test, { after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';
import { IDBFactory } from 'fake-indexeddb';
import { installMetricsApi, TEST_SESSION } from './metrics-api-fixture.mjs';

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
const { BRUNO_MISSIONS, simulateBrunoMission } = await import('../src/lab/bruno-missions.ts');
const { EXPEDITIONS } = await import('../src/lab/scientific-expeditions.ts');
const { normalizeEvent } = await import('../../../server/metrics/model.mjs');
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

test('the real App routes all six lobby choices to their mission, without recording a launch on selection', async () => {
  localStorage.clear(); globalThis.indexedDB = new IDBFactory();
  const api = installMetricsApi();
  await resume();
  for (const [label, id] of [['ISS', 'iss'], ['LUA', 'moon'], ['MARTE', 'mars'], ['CERRADO', 'cerrado'], ['BENNU', 'bennu'], ['WEBB', 'telescope']]) {
    await choose(label);
    const title = id === 'cerrado' ? 'Monte sua missão.' : BRUNO_MISSIONS[id]?.name ?? EXPEDITIONS[id].title;
    assert.ok(await screen.findByRole('heading', { name: title }));
    assert.equal(saved().filter(entry => entry.event.kind === 'attempt').length, 0, id);
    await lobby();
  }
  assert.equal(api.received.filter(event => event.kind === 'attempt').length, 0);
});

test('Bruno choices produce exact scored attempts that survive offline reload and synchronize without duplication', async () => {
  localStorage.clear(); globalThis.indexedDB = new IDBFactory();
  const api = installMetricsApi();
  const transport = globalThis.fetch;
  let offline = true;
  const serverRows = new Map();
  globalThis.fetch = async (url, options = {}) => {
    const body = options.body ? JSON.parse(options.body) : null;
    if (body?.action !== 'events') return transport(url, options);
    if (offline) return Response.json({}, { status: 503 });
    for (const event of body.events) {
      const row = normalizeEvent(event, body.sessionId, new Date().toISOString());
      serverRows.set(row.kind === 'attempt' ? row.payload.attemptId : row.id, row);
    }
    return transport(url, options);
  };
  await resume();
  const changes = {
    iss: [['Proteção', /Reforçada/]],
    moon: [['Energia', /Reserva ampliada/], ['Navegação e enlace', /Enlace direcional/]],
    mars: [['Lançador', /Maior capacidade/], ['Energia', /Reserva ampliada/], ['Proteção', /Reforçada/], ['Navegação e enlace', /Enlace direcional/]],
  };
  for (const [label, id] of [['ISS', 'iss'], ['LUA', 'moon'], ['MARTE', 'mars']]) {
    await choose(label); await click('Abrir hangar');
    for (const [part, option] of changes[id]) {
      await click(part);
      await act(async () => fireEvent.click(screen.getByRole('radio', { name: option })));
    }
    await click('Simular lançamento');
    assert.ok(await screen.findByRole('heading', { name: 'Missão concluída' }));
    const entry = saved().find(item => item.event.kind === 'attempt' && item.event.mission === id);
    assert.ok(entry);
    const result = simulateBrunoMission(id, entry.event.payload.config);
    assert.equal(result.deliveredRecords, 6);
    assert.deepEqual(entry.summary, summarizeBrunoAttempt(result));
    assert.equal(entry.sync, 'pending');
    assert.match(document.querySelector('.bruno-score').textContent, new RegExp(`^${result.score.total}/100`));
    await lobby();
  }
  const before = saved();
  const attemptIds = before.filter(entry => entry.event.kind === 'attempt').map(entry => entry.event.payload.attemptId);
  assert.equal(attemptIds.length, 3);
  assert.equal(api.received.length, 0);
  assert.equal(localStorage.getItem(metricsKey(TEST_SESSION.sessionId)).includes('@'), false);
  await act(async () => cleanup());
  offline = false;
  await resume();
  await waitFor(() => assert.ok(saved().every(entry => entry.sync === 'synced')));
  assert.equal(saved().length, before.length);
  assert.deepEqual(saved().filter(entry => entry.event.kind === 'attempt').map(entry => entry.event.payload.attemptId), attemptIds);
  const attempts = [...serverRows.values()].filter(row => row.kind === 'attempt');
  assert.equal(attempts.length, 3);
  for (const entry of saved().filter(item => item.event.kind === 'attempt')) {
    assert.deepEqual(attempts.find(row => row.payload.attemptId === entry.event.payload.attemptId).result.score, entry.summary.score);
  }
  await click('Meu progresso');
  assert.equal(document.querySelectorAll('.player-attempt-list > li').length, 3);
  assert.equal(document.querySelectorAll('.player-attempt-list .player-score').length, 3);
});

test('the normal launch countdown completes once and persists the computed result', async () => {
  localStorage.clear(); globalThis.indexedDB = new IDBFactory();
  installMetricsApi();
  dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  try {
    await resume(); await choose('ISS'); await click('Abrir hangar'); await click('Proteção');
    await act(async () => fireEvent.click(screen.getByRole('radio', { name: /Reforçada/ })));
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
