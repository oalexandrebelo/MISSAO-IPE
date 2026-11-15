import test, { after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import React, { useState } from 'react';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://mission.test/', pretendToBeVisual: true });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLInputElement', 'HTMLTextAreaElement', 'HTMLSelectElement', 'HTMLCanvasElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle', 'localStorage', 'location']) {
  Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name], writable: true });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.HTMLCanvasElement.prototype.getContext = () => null;
dom.window.HTMLElement.prototype.scrollIntoView = () => {};

const { render, screen, fireEvent, within, cleanup, act } = await import('@testing-library/react');
const { Workbench } = await import('../src/ui/Workbench.tsx');
const { MissionControl } = await import('../src/ui/MissionControl.tsx');
const { ScientificExpedition } = await import('../src/ui/ScientificExpedition.tsx');
const { DEFAULT_CONFIG } = await import('../src/core/catalog.ts');
const { simulateMission } = await import('../src/core/engine.ts');
const { simulateExpedition } = await import('../src/lab/scientific-expeditions.ts');

afterEach(cleanup);
after(() => dom.window.close());
const noop = () => {};
const button = name => screen.getByRole('button', { name });
const click = async target => { await act(async () => fireEvent.click(typeof target === 'string' ? button(target) : target)); };
const change = async (name, value) => { await act(async () => fireEvent.change(screen.getByLabelText(name), { target: { value } })); };
const flightStage = () => document.querySelector('.scientific-flight-path [aria-current="step"]')?.textContent;
const command = () => document.querySelector('.scientific-command [role="status"]')?.textContent;

function CerradoHarness() {
  const [config, setConfig] = useState({ ...DEFAULT_CONFIG });
  const [prediction, setPrediction] = useState('');
  const [rationale, setRationale] = useState('');
  const [busy, setBusy] = useState(false);
  return React.createElement(Workbench, {
    config, scenarioId: 'long-contact', onChoice: (key, value) => setConfig({ ...config, [key]: value }), onScenario: noop,
    prediction, onPrediction: setPrediction, rationale, onRationale: setRationale,
    firstAttempt: true, onLaunch: () => setBusy(true), onSave: noop, busy, blocked: busy, saving: false, onCancel: () => setBusy(false),
  });
}

test('Cerrado cockpit directs choices, prediction and cancellation to real controls', async () => {
  render(React.createElement(CerradoHarness));
  assert.match(flightStage(), /Briefing/);
  assert.equal(button('Registrar e executar').disabled, true);
  await click('Ir à montagem');
  assert.match(flightStage(), /Montagem/);
  assert.equal(document.activeElement.id, 'systems-title');
  await click(screen.getByRole('radio', { name: /Bateria 24 Wh/ }));
  const scene = document.querySelector('.assembly-scene .scene');
  assert.equal(scene.dataset.inspection, 'energy');
  assert.equal(scene.dataset.batteryWh, '24');
  await click('Inspecionar esta escolha na nave');
  assert.equal(document.activeElement.getAttribute('aria-label'), 'Visualização de Bateria');
  await click('Conferir projeto');
  assert.match(flightStage(), /Checagem/);
  assert.match(command(), /Previsão pendente/);
  assert.equal(document.activeElement.id, 'dossier-title');
  assert.match(scene.querySelector('.orbit-eyebrow').textContent, /lançamento/i);
  await click('Ir à hipótese');
  assert.equal(document.activeElement.id, 'prediction');
  await change('Minha previsão', 'none');
  await change('Por quê?', 'O contato longo permite entregar os registros.');
  assert.match(command(), /Pronto para executar/);
  await click('Registrar e executar');
  assert.match(flightStage(), /Operação/);
  assert.equal(scene.hasAttribute('data-state-time'), false, 'execution in progress has no completed samples yet');
  assert.equal(document.activeElement, button('Cancelar execução'));
  await click('Cancelar execução');
  assert.match(flightStage(), /Checagem/);
  assert.equal(screen.getByLabelText('Minha previsão').value, 'none');
});

test('Cerrado result separates the completed report from a replay at T+0', async () => {
  const result = simulateMission({ ...DEFAULT_CONFIG }, 'long-contact');
  render(React.createElement(MissionControl, {
    result, searchResult: null, searching: false, canSearch: true, onSearch: noop, onCancelSearch: noop,
    onApply: noop, onRedesign: noop, onTransfer: noop, onExport: noop, exporting: false,
    onReflect: noop, onCompare: noop, canCompare: true,
  }));
  assert.match(flightStage(), /Resultado/);
  await click('Rever operação desde o início');
  const scene = document.querySelector('.mission-stage .scene');
  assert.equal(document.activeElement.id, 'stage-title');
  assert.match(flightStage(), /Operação/);
  assert.equal(scene.dataset.stateTime, '0');
  assert.equal(within(scene).getByText('Recepção em solo').parentElement.querySelector('strong').textContent, '0 / 6 registros válidos');
  await click('Voltar ao resultado');
  assert.match(flightStage(), /Resultado/);
  assert.equal(document.activeElement.getAttribute('aria-label'), 'Resultado final da tentativa');
  assert.equal(document.querySelector('.result-number').textContent, '6/6');
  assert.equal(button('Comparar missões').disabled, false);
});

for (const id of ['bennu', 'telescope']) {
  test(`${id}: montagem e checagem levam à operação em T+0 e ao resultado do motor`, async () => {
    render(React.createElement(ScientificExpedition, { id, onBack: noop }));
    assert.match(flightStage(), /Necessidade/);
    assert.equal(document.querySelector('.expedition-brief-deck .scene').dataset.missionWorld, id);
    await click('Definir esta missão científica');
    assert.match(flightStage(), /Requisitos/);
    await click('Projetar a arquitetura');
    assert.match(flightStage(), /Projeto/);
    await click('Ir às opções');
    assert.equal(document.activeElement.textContent, 'Instrumento científico');
    const config = id === 'bennu'
      ? { launch: 'compact', orbit: 'near', duration: 'full', instrument: 'camera', power: 'extended', ground: 'extended' }
      : { launch: 'science', orbit: 'far', duration: 'full', instrument: 'camera', power: 'extended', ground: 'extended' };
    const systems = screen.getByRole('navigation', { name: 'Escolher sistema da expedição' });
    for (const [key, label] of [['power', 'Energia e plataforma'], ['ground', 'Comunicação com o solo'], ['launch', 'Veículo de lançamento'], ['orbit', 'Perfil orbital'], ['duration', 'Vida operacional do recorte'], ['instrument', 'Instrumento científico']]) {
      await click(within(systems).getByRole('button', { name: label }));
      await click(screen.getByRole('group', { name: label }).querySelector(`input[value="${config[key]}"]`));
    }
    assert.equal(document.querySelector('.equipment-assembly .scene').dataset.payloadId, config.instrument);
    const expected = simulateExpedition(id, config);
    await click('Revisar para executar');
    assert.match(flightStage(), /Verificação/);
    assert.match(command(), /Previsão pendente/);
    const launchScene = document.querySelector('.expedition-brief-deck .scene');
    assert.match(launchScene.querySelector('.orbit-eyebrow').textContent, /lançamento/i);
    assert.equal(launchScene.hasAttribute('data-state-time'), false, 'launch review is a preview of the integration envelope');
    assert.equal(button('Executar missão científica').disabled, true);
    await click('Ir à hipótese');
    assert.equal(document.activeElement.id, 'exp-hypothesis');
    await change(/Hipótese da equipe/, 'A escolha do instrumento deve definir a validade da evidência.');
    assert.match(command(), id === 'bennu' ? /Pronto para executar/ : /requisito.*a revisar/i);
    assert.equal(button('Executar missão científica').disabled, false);
    await click('Ir à confirmação');
    assert.equal(document.activeElement, button('Executar missão científica'));
    await click('Executar missão científica');
    assert.match(flightStage(), /Operação/);
    assert.equal(document.querySelector('#exp-operation-scene .scene').dataset.stateTime, '0');
    await click('Ir ao estado final');
    assert.equal(Number(document.querySelector('#exp-operation-scene .scene').dataset.stateTime), expected.completedAtS);
    await click('Interpretar o retorno científico');
    assert.match(flightStage(), /Retorno científico/);
    assert.ok(screen.getByRole('heading', { name: `${expected.deliveredRecords} de 6 registros válidos.` }));
    assert.equal(document.querySelector('.archive-count').textContent, `${expected.deliveredRecords} / 6 válidos disponíveis`);
    assert.equal(screen.queryByRole('button', { name: 'Abrir comparação A/B' }), null, 'a single attempt cannot populate both sides');
    await click('Criar uma nova tentativa');
    await click(within(screen.getByRole('navigation', { name: 'Escolher sistema da expedição' })).getByRole('button', { name: 'Comunicação com o solo' }));
    await click(screen.getByRole('group', { name: 'Comunicação com o solo' }).querySelector('input[value="short"]'));
    await click('Revisar para executar');
    await change(/Hipótese da equipe/, 'O tempo disponível para transmissão mudou no segundo projeto.');
    await click('Executar missão científica');
    await click('Abrir comparação A/B');
    const comparison = screen.getByRole('region', { name: 'Comparação A/B das tentativas' });
    assert.equal(document.activeElement, comparison);
    assert.ok(within(comparison).getByRole('button', { name: 'Ver tentativa A' }));
    assert.ok(within(comparison).getByRole('button', { name: 'Ver tentativa B' }));
  });
}
