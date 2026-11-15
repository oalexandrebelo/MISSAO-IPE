import { installMetricsApi, TEST_SESSION } from './metrics-api-fixture.mjs';
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';
import { IDBFactory } from 'fake-indexeddb';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://mission.test/', pretendToBeVisual: true });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLInputElement', 'HTMLTextAreaElement', 'HTMLSelectElement', 'HTMLDialogElement', 'HTMLCanvasElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle', 'localStorage', 'location']) {
  Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name], writable: true });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
// These are environment adapters, not application/physics mocks. No WebGL exists in jsdom.
dom.window.scrollTo = () => {};
dom.window.HTMLCanvasElement.prototype.getContext = () => null;
dom.window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
dom.window.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
const { render, screen, fireEvent, waitFor, cleanup, act } = await import('@testing-library/react');
const { default: App } = await import('../src/App.tsx');
const { DEFAULT_CONFIG } = await import('../src/core/catalog.ts');
const { simulateMission } = await import('../src/core/engine.ts');
const { exportReplay } = await import('../src/persistence/replay.ts');
const { createMissionStore } = await import('../src/persistence/store.ts');
const { listRuns } = createMissionStore({ databaseName: `mission-ipe-player-${TEST_SESSION.sessionId}` });
const { JOURNAL_KEY: BASE_JOURNAL_KEY } = await import('../src/ui/learning.ts');
const JOURNAL_KEY = `${BASE_JOURNAL_KEY}:${TEST_SESSION.sessionId}`;

const journal = () => JSON.parse(localStorage.getItem(JOURNAL_KEY) ?? '[]');
const button = name => screen.getByRole('button', { name });
const click = async target => { await act(async () => { fireEvent.click(typeof target === 'string' || target instanceof RegExp ? button(target) : target); }); };
const change = async (name, value) => { await act(async () => { fireEvent.change(screen.getByLabelText(name), { target: { value } }); }); };
async function mount(storage = true) {
  installMetricsApi();
  localStorage.clear();
  globalThis.indexedDB = storage ? new IDBFactory() : undefined;
  await act(async () => { render(React.createElement(App)); });
  // Wait for the real renderer's unavailable-context path. This is not visual QA.
  await click('Iniciar jogo');
  await click('Retomar jogo');
  await click('Abrir acervo e guia de ciência');
  await waitFor(() => assert.match(document.body.textContent, /3D indisponível · equivalente 2D ativo/));
}
async function predict(value = 'none') {
  await change('Minha previsão', value);
  await change('Por quê?', 'A escolha deve permitir entregar os seis registros.');
}
async function launch(delivered) {
  await click('Registrar e executar');
  await waitFor(() => assert.equal(document.querySelector('.result-number')?.textContent, `${delivered}/6`));
}
async function waitSaved(count) {
  await act(async () => {
    const deadline = Date.now() + 1_000;
    while ((await listRuns()).length !== count) {
      assert.ok(Date.now() < deadline, `Expected ${count} committed runs`);
      await new Promise(resolve => setTimeout(resolve, 5));
    }
    // Drain the application's post-commit history read while still inside act.
    await listRuns();
    await new Promise(resolve => setTimeout(resolve, 10));
  });
}
after(() => dom.window.close());

test('real React journey: prediction, long 6/6, short 2/6, certified minimum 2, applied candidate 6/6, invalid import preservation', async t => {
  t.after(async () => { await act(async () => cleanup()); });
  await mount();
  await click('Começar a missão');
  await t.test('prediction and minimum rationale are mandatory; solver is absent before a completed own attempt', async () => {
    const launchButton = button('Registrar e executar');
    assert.equal(launchButton.disabled, true);
    assert.equal(screen.queryByRole('button', { name: 'Consultar alternativas' }), null);
    await change('Por quê?', 'Explicação presente, mas ainda sem hipótese.');
    assert.equal(launchButton.disabled, true);
    await change('Minha previsão', 'none');
    await change('Por quê?', 'curta');
    assert.equal(launchButton.disabled, true);
    await click(launchButton);
    assert.equal(journal().length, 0);
    await predict();
    assert.equal(launchButton.disabled, false);
  });
  await t.test('long contact really delivers 6/6 and commits the prediction before completion', async () => {
    await launch(6);
    assert.ok(screen.getByText('Missão cumprida'));
    await waitSaved(1);
    const entries = journal();
    assert.deepEqual(entries.map(item => item.kind), ['prediction', 'completed']);
    assert.equal(entries[1].attemptId, entries[0].id);
    assert.equal(entries[1].outcome, 'success');
    const saved = (await listRuns())[0];
    assert.deepEqual(saved.result, simulateMission({ ...DEFAULT_CONFIG }, 'long-contact'));
  });
  await t.test('transfer clears prediction and real short contact delivers only 2/6', async () => {
    await click('Tentar com contato curto');
    assert.equal(screen.getByLabelText('Minha previsão').value, '');
    assert.equal(button('Registrar e executar').disabled, true);
    assert.equal(screen.queryByRole('button', { name: 'Consultar alternativas' }), null);
    await predict('contact');
    await launch(2);
    assert.ok(screen.getByText('Missão não cumprida'));
    await waitSaved(2);
    const short = (await listRuns()).find(run => run.result.scenarioId === 'short-contact');
    assert.deepEqual(short.result, simulateMission({ ...DEFAULT_CONFIG }, 'short-contact'));
    assert.equal(button('Consultar alternativas').disabled, false);
  });
  await t.test('search evaluates all 64 and certifies minimum two choices after the own attempt', async () => {
    await click('Consultar alternativas');
    await screen.findByText('Menor quantidade de escolhas alteradas: 2.');
    assert.match(document.querySelector('.search-summary').textContent, /64\/64 avaliadas/);
    assert.match(document.querySelector('.search-summary').textContent, /0 indeterminadas/);
    assert.equal(journal().at(-1).kind, 'help');
  });
  await t.test('invalid replay preserves the published result, candidate search and config', async () => {
    const banner = document.querySelector('.result-banner').textContent;
    const receipt = document.querySelector('.receipt-columns').textContent;
    const search = document.querySelector('.search-results').textContent;
    const before = await listRuns();
    await click('Abrir caderno de missões');
    assert.ok(screen.getByRole('dialog'));
    await click('Importar replay');
    // A real Node File supplies text(); jsdom does not implement File.text().
    const invalid = new File(['{"format":"unsupported"}'], 'invalid.json', { type: 'application/json' });
    await act(async () => { fireEvent.change(document.querySelector('input[type="file"]'), { target: { files: [invalid] } }); });
    await screen.findByRole('alert');
    assert.match(screen.getByRole('alert').textContent, /Replay não importado/);
    assert.equal(document.querySelector('.result-banner').textContent, banner);
    assert.equal(document.querySelector('.receipt-columns').textContent, receipt);
    assert.equal(document.querySelector('.search-results').textContent, search);
    assert.deepEqual(await listRuns(), before);
    await click('Voltar ao projeto');
    const activeConfig = Object.fromEntries([...document.querySelectorAll('input[type="radio"]:checked')].map(input => [input.name, input.value]));
    assert.deepEqual(activeConfig, DEFAULT_CONFIG);
    await click(/Sala de missão/);
    assert.equal(document.querySelector('.search-results').textContent, search);
  });
  await t.test('applying a witness requires another prediction and really executes 6/6', async () => {
    await click(screen.getAllByRole('button', { name: 'Aplicar como novo projeto' })[0]);
    assert.equal(document.querySelector('.result-banner'), null);
    assert.equal(screen.getByLabelText('Minha previsão').value, '');
    assert.equal(button('Registrar e executar').disabled, true);
    const selected = Object.fromEntries([...document.querySelectorAll('input[type="radio"]:checked')].map(input => [input.name, input.value]));
    assert.equal(Object.keys(DEFAULT_CONFIG).filter(key => selected[key] !== DEFAULT_CONFIG[key]).length, 2);
    await predict();
    await launch(6);
    assert.ok(screen.getByText('Missão cumprida'));
    await waitSaved(3);
    const candidate = (await listRuns()).find(run => run.result.scenarioId === 'short-contact' && run.result.outcome === 'success');
    assert.deepEqual(candidate.result.config, selected);
    assert.deepEqual(candidate.result, simulateMission(selected, 'short-contact'));
  });
});

test('importing a valid replay without a personal attempt keeps the solver gated', async t => {
  t.after(async () => { await act(async () => cleanup()); });
  await mount();
  const replay = await exportReplay(simulateMission({ ...DEFAULT_CONFIG }, 'short-contact'));
  await act(async () => { fireEvent.change(document.querySelector('input[type="file"]'), { target: { files: [new File([replay], 'valid.json', { type: 'application/json' })] } }); });
  await waitFor(() => assert.equal(document.querySelector('.result-number')?.textContent, '2/6'));
  assert.equal(button('Consultar alternativas').disabled, true);
  assert.equal(journal().length, 0);
  await waitSaved(1);
});

test('unavailable IndexedDB and localStorage keep the real result available and replay export enabled', async t => {
  t.after(async () => { await act(async () => cleanup()); });
  const originalSetItem = dom.window.Storage.prototype.setItem;
  try {
    await mount(false);
    dom.window.Storage.prototype.setItem = () => { throw new DOMException('Storage denied in test', 'QuotaExceededError'); };
    await click('Começar a missão');
    await predict();
    await launch(6);
    const storageNotice = await screen.findByText(/resultado permanece visível, mas não foi salvo/);
    assert.ok(storageNotice.closest('[role="status"]'));
    assert.equal(button('Exportar replay verificável').disabled, false);
    assert.equal(button('Consultar alternativas').disabled, false);
    assert.equal(journal().length, 0);
    assert.ok(screen.getByText('Missão cumprida'));
  } finally { dom.window.Storage.prototype.setItem = originalSetItem; }
});
