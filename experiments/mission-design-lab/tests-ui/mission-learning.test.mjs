import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://mission.test/', pretendToBeVisual: true });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLInputElement', 'HTMLCanvasElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle', 'localStorage', 'location']) Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name], writable: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.scrollTo = () => {};
dom.window.HTMLElement.prototype.scrollIntoView = () => {};
// Use the real scene's accessible 2D fallback; no WebGL or engine mocks.
dom.window.HTMLCanvasElement.prototype.getContext = () => null;
const { render, screen, fireEvent, cleanup, act, within } = await import('@testing-library/react');
const { MissionExperiment, MissionReflection } = await import('../src/ui/MissionLearning.tsx');
const { MISSION_CURRICULUM, runLearningExperiment } = await import('../src/lab/mission-curriculum.ts');
const { getMissionVisualState } = await import('../src/lab/mission-visual-state.ts');
const { getExpeditionVisualState } = await import('../src/lab/scientific-expeditions.ts');
const { getSpacecraftPresentation } = await import('../src/lab/spacecraft-presentation.ts');

const ids = ['cerrado', 'bennu', 'telescope'];
const numeric = value => value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
const button = name => screen.getByRole('button', { name });
const click = async target => { await act(async () => fireEvent.click(typeof target === 'string' || target instanceof RegExp ? button(target) : target)); };
const cleanupView = async () => { await act(async () => cleanup()); };
const scene = () => document.querySelector('.learning-experiment .scene');
const clock = () => screen.getByRole('slider', { name: /^Mesmo relógio/ });
const seek = async at => { await act(async () => fireEvent.change(clock(), { target: { value: String(at) } })); };
const cells = label => within(screen.getByRole('row', { name: new RegExp(`^${label}`) })).getAllByRole('cell').map(cell => cell.textContent);
const readout = label => within(scene().querySelector('.orbit-recorded-state')).getByText(label).parentElement.querySelector('strong').textContent;
after(() => dom.window.close());

async function mountExperiment(id, onApply = () => {}, disabled = false) {
  await act(async () => render(React.createElement(MissionExperiment, { id, onApply, disabled })));
  await click('Investigar esta escolha');
}

async function predictAndRun(prediction) {
  await click(screen.getByRole('radio', { name: prediction }));
  await click('Executar os dois ensaios');
}

function assertScene(trial, at) {
  const state = trial.kind === 'cerrado' ? getMissionVisualState(trial.result, at) : getExpeditionVisualState(trial.result, at);
  const presentation = trial.kind === 'cerrado'
    ? getSpacecraftPresentation({ world: 'earth', config: trial.result.config, scenarioId: trial.result.scenarioId })
    : getSpacecraftPresentation({ world: trial.result.expeditionId, expeditionConfig: trial.result.config });
  assert.equal(scene().dataset.visualMode, '2d');
  assert.equal(scene().dataset.missionWorld, trial.kind === 'cerrado' ? 'earth' : trial.result.expeditionId);
  assert.equal(scene().dataset.spacecraftConfig, presentation.configurationKey);
  assert.equal(Number(scene().dataset.stateTime), state.timeS);
  assert.equal(readout('Bateria'), `${numeric(state.energyWh)} Wh`);
  assert.equal(readout('Memória ocupada'), `${numeric(state.queueBits / 1e6)} Mbit`);
  assert.equal(readout('Geração / consumo'), `${numeric(state.solarW)} W / ${numeric(state.loadW)} W`);
  assert.equal(readout('Recepção em solo'), `${state.deliveredRecordIds.length} / 6 registros válidos`);
  assert.ok(scene().querySelector('.orbit-state-heading').textContent.includes(`Último estado: ${numeric(state.sourceStateTimeS)} s`));
}

test('a guided experiment requires a prediction before exposing final results or an executed scene', async t => {
  t.after(cleanupView);
  const applied = [];
  await act(async () => render(React.createElement(MissionExperiment, { id: 'bennu', onApply: trial => applied.push(trial) })));
  assert.equal(button('Investigar esta escolha').getAttribute('aria-expanded'), 'false');
  assert.equal(screen.queryByRole('table'), null);
  assert.equal(scene(), null);
  await click('Investigar esta escolha');
  assert.equal(button('Fechar experimento').getAttribute('aria-expanded'), 'true');
  assert.equal(button('Executar os dois ensaios').disabled, true);
  await click('Executar os dois ensaios');
  assert.equal(screen.queryByRole('table'), null);
  assert.equal(scene(), null);
  await click(screen.getByRole('radio', { name: 'B entrega mais' }));
  assert.equal(button('Executar os dois ensaios').disabled, false);
  assert.equal(scene(), null);
  await click('Executar os dois ensaios');
  assert.ok(screen.getByRole('table', { name: /Resultados finais dos ensaios/ }));
  assert.match(screen.getByRole('status').textContent, /Sua previsão combina/);
  assert.deepEqual(applied, []);
});

test('each lesson shows real final totals separately from the clock and switches executed A/B configurations without seeking', async t => {
  const expectations = {
    cerrado: { received: ['2 / 6', '0 / 6'], valid: ['2 / 6', '0 / 6'], mbit: ['460,8 Mbit', '0 Mbit'], outcome: ['Não', 'Não'], prediction: 'B entrega mais' },
    bennu: { received: ['2 / 6', '6 / 6'], valid: ['2 / 6', '6 / 6'], mbit: ['288 Mbit', '720 Mbit'], outcome: ['Não', 'Sim'], prediction: 'B entrega menos' },
    telescope: { received: ['6 / 6', '6 / 6'], valid: ['0 / 6', '6 / 6'], mbit: ['720 Mbit', '1.080 Mbit'], outcome: ['Projeto incompatível', 'Sim'], prediction: 'B entrega menos' },
  };
  for (const id of ids) await t.test(id, async sub => {
    sub.after(cleanupView);
    const applied = []; const experiment = runLearningExperiment(id); const expected = expectations[id];
    localStorage.clear(); localStorage.setItem('existing-project', 'unchanged');
    await mountExperiment(id, trial => applied.push(trial));
    await predictAndRun(expected.prediction);
    assert.match(screen.getByRole('status').textContent, /O resultado convida a rever a previsão/);
    assert.deepEqual(cells('Registros completos recebidos'), expected.received);
    assert.deepEqual(cells('Registros cientificamente válidos'), expected.valid);
    assert.deepEqual(cells('Dados recebidos'), expected.mbit);
    assert.deepEqual(cells('Atende à missão'), expected.outcome);
    assert.equal(clock().value, '0');
    assertScene(experiment.trials[0], 0);
    assert.equal(readout('Recepção em solo'), '0 / 6 registros válidos');
    await seek(9300);
    assertScene(experiment.trials[0], 9300);
    await click(experiment.trials[1].label);
    assert.equal(button(experiment.trials[1].label).getAttribute('aria-pressed'), 'true');
    assert.equal(button(experiment.trials[0].label).getAttribute('aria-pressed'), 'false');
    assert.equal(clock().value, '9300');
    assertScene(experiment.trials[1], 9300);
    if (id === 'cerrado') {
      assert.equal(readout('Recepção em solo'), '0 / 6 registros válidos');
      assert.match(scene().textContent, /Último estado: 600 s/);
    }
    await click('Ver final do ensaio');
    assertScene(experiment.trials[1], 10800);
    await click(experiment.trials[0].label);
    assert.equal(clock().value, '10800');
    assertScene(experiment.trials[0], 10800);
    await click('Voltar ao início do ensaio');
    assertScene(experiment.trials[0], 0);
    assert.equal(readout('Recepção em solo'), '0 / 6 registros válidos');
    assert.deepEqual(cells('Registros cientificamente válidos'), expected.valid);
    assert.deepEqual(applied, []);
    assert.deepEqual(Object.entries(localStorage), [['existing-project', 'unchanged']]);
  });
});

test('applying explicitly passes the selected trial once, including a failed choice, without saving or rerunning a project', async t => {
  t.after(cleanupView);
  const applied = []; const expected = runLearningExperiment('cerrado');
  localStorage.clear();
  await mountExperiment('cerrado', trial => applied.push(trial));
  await predictAndRun('B entrega menos');
  await click(expected.trials[1].label); await seek(700);
  assert.deepEqual(applied, []);
  await click('Usar B como ponto de partida');
  assert.equal(applied.length, 1); assert.deepEqual(applied[0], expected.trials[1]);
  assert.equal(applied[0].result.outcome, 'failure');
  assert.equal(clock().value, '700');
  await click(expected.trials[0].label);
  assert.equal(applied.length, 1);
  await click('Usar A como ponto de partida');
  assert.equal(applied.length, 2); assert.deepEqual(applied[1], expected.trials[0]);
  assert.equal(localStorage.length, 0);
  await click('Refazer minha previsão');
  assert.equal(scene(), null); assert.equal(screen.queryByRole('table'), null);
  assert.equal(button('Executar os dois ensaios').disabled, true);
  assert.ok(screen.getAllByRole('radio').every(radio => !radio.checked));
  assert.equal(applied.length, 2);
});

test('a disabled experiment cannot run even when a prediction was selected before disabling', async t => {
  t.after(cleanupView);
  const applied = []; const onApply = trial => applied.push(trial);
  let view;
  await act(async () => { view = render(React.createElement(MissionExperiment, { id: 'bennu', onApply })); });
  await click('Investigar esta escolha'); await click(screen.getByRole('radio', { name: 'B entrega mais' }));
  await act(async () => view.rerender(React.createElement(MissionExperiment, { id: 'bennu', onApply, disabled: true })));
  assert.equal(button('Executar os dois ensaios').disabled, true);
  assert.equal(screen.getByRole('radio', { name: 'B entrega mais' }).closest('fieldset').disabled, true);
  await click('Executar os dois ensaios');
  assert.equal(scene(), null); assert.deepEqual(applied, []);
});

test('reflection preserves missing evidence at zero valid records and rejects fabricated interpretations in all missions', async t => {
  for (const id of ids) await t.test(id, async sub => {
    sub.after(cleanupView); const lesson = MISSION_CURRICULUM[id];
    await act(async () => render(React.createElement(MissionReflection, { id, valid: 0, required: 6 })));
    assert.ok(screen.getByText(/0 de 6 registros válidos nesta tentativa/));
    assert.ok(screen.getByText(/O conjunto está incompleto: uma lacuna deve permanecer visível/));
    assert.equal(screen.queryByRole('status'), null);
    for (const interpretation of [lesson.overclaim, lesson.missing]) {
      await click(screen.getByRole('radio', { name: interpretation }));
      const feedback = screen.getByRole('status').textContent;
      assert.match(feedback, /Reveja o alcance dos dados/);
      assert.ok(feedback.includes(lesson.boundary));
      assert.doesNotMatch(feedback, /Essa interpretação respeita/);
    }
    await click(screen.getByRole('radio', { name: lesson.conclusion }));
    assert.match(screen.getByRole('status').textContent, /Essa interpretação respeita a evidência/);
    assert.ok(screen.getByText(/0 de 6 registros válidos nesta tentativa/));
    assert.ok(screen.getByText(/uma lacuna deve permanecer visível/));
    assert.equal(screen.queryByText(/O conjunto chegou;/), null);
    assert.ok(screen.getByText(/sem nota de aprendizagem ou certificação/));
  });
});

test('a complete reflection reports receipt without claiming causal or molecular discovery', async t => {
  t.after(cleanupView);
  await act(async () => render(React.createElement(MissionReflection, { id: 'telescope', valid: 6, required: 6 })));
  assert.ok(screen.getByText(/6 de 6 registros válidos nesta tentativa/));
  assert.ok(screen.getByText(/O conjunto chegou; agora é preciso respeitar o alcance da evidência/));
  await click(screen.getByRole('radio', { name: MISSION_CURRICULUM.telescope.overclaim }));
  assert.match(screen.getByRole('status').textContent, /Os valores não detectam água ou vida/);
});
