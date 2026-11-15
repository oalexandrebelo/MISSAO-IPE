import test, { after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';
import { installMetricsApi } from './metrics-api-fixture.mjs';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://mission.test/', pretendToBeVisual: true });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLInputElement', 'HTMLTextAreaElement', 'HTMLSelectElement', 'HTMLDialogElement', 'HTMLCanvasElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle', 'localStorage', 'location']) Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name], writable: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.HTMLCanvasElement.prototype.getContext = () => null;
dom.window.HTMLElement.prototype.scrollIntoView = () => {};
dom.window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
dom.window.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
const { render, screen, fireEvent, within, cleanup, act, waitFor } = await import('@testing-library/react');
const { PlayerGateway } = await import('../src/ui/PlayerMetrics.tsx');
const { ExpeditionWorkbench } = await import('../src/ui/ExpeditionWorkbench.tsx');
const { Workbench } = await import('../src/ui/Workbench.tsx');
const { ScientificExpedition } = await import('../src/ui/ScientificExpedition.tsx');
const { ExpeditionComparison } = await import('../src/ui/ExpeditionComparison.tsx');
const { CompareDialog } = await import('../src/ui/CompareDialog.tsx');
const { MissionControl } = await import('../src/ui/MissionControl.tsx');
const { DEFAULT_EXPEDITION_CONFIGS, simulateExpedition } = await import('../src/lab/scientific-expeditions.ts');
const { DEFAULT_CONFIG } = await import('../src/core/catalog.ts');
const { simulateMission } = await import('../src/core/engine.ts');

const PRIVATE = 'PRIVATE_LIBRAS_SENTINEL';
const click = async name => { await act(async () => fireEvent.click(typeof name === 'string' || name instanceof RegExp ? screen.getByRole('button', { name }) : name)); };
const value = node => node.getAttribute('data-ipe-libras-context');
const allContexts = () => [...document.querySelectorAll('[data-ipe-libras-context]')].map(value);
function safeContexts() {
  assert.ok(allContexts().length);
  for (const text of allContexts()) {
    assert.ok(text.length > 0 && text.length <= 900, 'each explicit context is bounded');
    assert.ok(!text.includes(PRIVATE), 'personal input and arbitrary messages must not enter the translation context');
  }
}
afterEach(async () => { await act(async () => cleanup()); localStorage.clear(); });
after(() => dom.window.close());

test('Libras no cadastro acompanha as quatro etapas sem ler nome ou e-mail', async () => {
  installMetricsApi({ registered: false });
  await act(async () => render(React.createElement(PlayerGateway, { children: () => React.createElement('p', null, 'Jogo') })));
  await waitFor(() => assert.equal(screen.getByRole('button', { name: 'Continuar' }).getAttribute('aria-disabled'), 'false'));
  const entry = document.querySelector('.player-entry');
  assert.match(value(entry), /Etapa 1 de quatro: Nome/);
  await act(async () => fireEvent.change(screen.getByRole('textbox', { name: 'Seu nome' }), { target: { value: PRIVATE } }));
  safeContexts();
  await act(async () => fireEvent.submit(document.querySelector('form')));
  assert.match(value(entry), /Etapa 2 de quatro: E-mail/);
  await act(async () => fireEvent.change(screen.getByRole('textbox', { name: 'Seu e-mail' }), { target: { value: `${PRIVATE}@example.invalid` } }));
  safeContexts();
  await act(async () => fireEvent.submit(document.querySelector('form')));
  assert.match(value(entry), /Etapa 3 de quatro: Tipo/);
  await click(screen.getByRole('radio', { name: 'Webb' }));
  await act(async () => fireEvent.submit(document.querySelector('form')));
  assert.match(value(entry), /Etapa 4 de quatro: Play/);
  safeContexts();
});

test('Libras da bancada do Cerrado segue a categoria sem incluir a hipótese digitada', async () => {
  const props = { config: { ...DEFAULT_CONFIG }, scenarioId: 'long-contact', onChoice() {}, onScenario() {}, prediction: 'energy', onPrediction() {}, rationale: PRIVATE, onRationale() {}, firstAttempt: true, onLaunch() {}, onSave() {}, busy: false, blocked: false, saving: false, onCancel() {} };
  await act(async () => render(React.createElement(Workbench, props)));
  assert.match(value(document.querySelector('.hangar-layout')), /Sistema: Bateria/);
  await click(within(screen.getByRole('navigation', { name: 'Escolher subsistema' })).getByRole('button', { name: /Processamento/ }));
  assert.match(value(document.querySelector('.hangar-layout')), /Sistema: Processamento/);
  assert.match(value(document.querySelector('.hangar-layout')), /180 para 60 Mbit/);
  safeContexts();
});

for (const id of ['bennu', 'telescope']) {
  test(`Libras da bancada ${id} lê seleção e recursos do projeto atualizado`, async () => {
    const config = { ...DEFAULT_EXPEDITION_CONFIGS[id] };
    let view;
    await act(async () => { view = render(React.createElement(ExpeditionWorkbench, { id, config, onChoice() {} })); });
    await click(within(screen.getByRole('navigation', { name: 'Escolher sistema da expedição' })).getByRole('button', { name: 'Energia e plataforma' }));
    assert.match(value(document.querySelector('.equipment-workbench')), /Energia compacta/);
    await act(async () => view.rerender(React.createElement(ExpeditionWorkbench, { id, config: { ...config, power: 'extended' }, onChoice() {} })));
    assert.match(value(document.querySelector('.equipment-workbench')), /Energia ampliada/);
    assert.match(value(document.querySelector('.equipment-workbench')), /24 watt-hora/);
    safeContexts();
  });
}

test('Libras da expedição acompanha fase e replay sem hipótese, reflexão ou eventos futuros', async () => {
  await act(async () => render(React.createElement(ScientificExpedition, { id: 'bennu', onBack() {} })));
  const root = () => document.querySelector('.scientific-expedition');
  assert.match(value(root()), /Etapa: Necessidade/);
  await click('Definir esta missão científica');
  assert.match(value(root()), /Etapa: Requisitos/);
  await click('Projetar a arquitetura');
  assert.match(value(root()), /Etapa: Projeto/);
  await click('Revisar para executar');
  assert.match(value(root()), /Etapa: Verificação/);
  await act(async () => fireEvent.change(screen.getByLabelText(/^Hipótese da equipe/), { target: { value: PRIVATE } }));
  safeContexts();
  await click('Executar missão científica');
  assert.match(value(root()), /Instante do replay: 0 segundos/);
  assert.match(value(root()), /Registros válidos disponíveis: 0 de seis/);
  assert.ok(!value(root()).includes('Um pacote completo chegou ao solo'));
  await click('Ir ao estado final');
  assert.match(value(root()), /Registros válidos disponíveis: 2 de seis/);
  await act(async () => fireEvent.change(document.getElementById('exp-time'), { target: { value: '0' } }));
  assert.match(value(root()), /Registros válidos disponíveis: 0 de seis/);
  await click('Interpretar o retorno científico');
  await act(async () => fireEvent.change(screen.getByLabelText(/^Sua análise pós-missão/), { target: { value: PRIVATE } }));
  assert.match(value(root()), /Resultado final: 2 de seis registros válidos/);
  safeContexts();
});

test('Libras no relatório do Cerrado não reutiliza texto arbitrário de um replay importado', async () => {
  const original = simulateMission(DEFAULT_CONFIG, 'long-contact');
  const result = { ...original, events: original.events.map(event => ({ ...event, message: PRIVATE })) };
  const props = { result, searchResult: null, searching: false, canSearch: false, onSearch() {}, onCancelSearch() {}, onApply() {}, onRedesign() {}, onTransfer() {}, onExport() {}, exporting: false, onReflect() {}, onCompare() {}, canCompare: false };
  await act(async () => render(React.createElement(MissionControl, props)));
  safeContexts();
  assert.match(value(document.querySelector('.result-banner')), /Resultado final do Cerrado/);
  await act(async () => fireEvent.change(document.getElementById('trace-range'), { target: { value: '0' } }));
  assert.match(value(document.querySelector('.mission-stage')), /Instante: 0 segundos/);
  assert.match(value(document.querySelector('.mission-stage')), /0 registros válidos disponíveis/);
  safeContexts();
});

test('Libras das duas comparações acompanha lado e tempo comum sem confundir total final', async () => {
  const a = simulateExpedition('bennu', DEFAULT_EXPEDITION_CONFIGS.bennu);
  const b = simulateExpedition('bennu', { ...DEFAULT_EXPEDITION_CONFIGS.bennu, ground: 'extended' });
  await act(async () => render(React.createElement(ExpeditionComparison, { a, b })));
  assert.match(value(document.querySelector('.mission-comparison')), /tentativa B/);
  assert.match(value(document.querySelector('.mission-comparison')), /A tem 0 registros válidos e B tem 0/);
  await click('Ver tentativa A');
  assert.match(value(document.querySelector('.mission-comparison')), /tentativa A/);
  await click('Ver estados finais A/B');
  assert.match(value(document.querySelector('.mission-comparison')), /A tem 2 registros válidos e B tem 6/);
  await click('Voltar ao início A/B');
  assert.match(value(document.querySelector('.mission-comparison')), /A tem 0 registros válidos e B tem 0/);
  safeContexts();
  await act(async () => cleanup());
  const ca = simulateMission(DEFAULT_CONFIG, 'long-contact');
  const cb = simulateMission({ ...DEFAULT_CONFIG, battery: 'large' }, 'long-contact');
  const saved = (id, result) => ({ id, result, createdAt: '2026-11-15T00:00:00Z', inputHash: id, resultHash: id });
  await act(async () => render(React.createElement(CompareDialog, { runs: [saved('B', cb), saved('A', ca)], onClose() {} })));
  assert.match(value(document.querySelector('.mission-comparison')), /missão B/);
  await click('Inspecionar A no 3D');
  assert.match(value(document.querySelector('.mission-comparison')), /missão A/);
  await click('Voltar ao início A/B');
  assert.match(value(document.querySelector('.mission-comparison')), /A tem 0 registros válidos e B tem 0/);
  safeContexts();
});
