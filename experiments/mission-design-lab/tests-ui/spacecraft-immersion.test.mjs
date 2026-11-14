import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';
import { IDBFactory } from 'fake-indexeddb';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://mission.test/', pretendToBeVisual: true });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLInputElement', 'HTMLTextAreaElement', 'HTMLSelectElement', 'HTMLDialogElement', 'HTMLCanvasElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle', 'localStorage', 'location']) Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name], writable: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
// Exercise the actual app, catalogs and engines; adapt unavailable browser APIs only.
dom.window.scrollTo = () => {};
dom.window.HTMLElement.prototype.scrollIntoView = () => {};
dom.window.HTMLCanvasElement.prototype.getContext = () => null;
dom.window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
dom.window.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
const { render, screen, fireEvent, waitFor, cleanup, act, within } = await import('@testing-library/react');
const { default: App } = await import('../src/App.tsx');
const { CATALOG, DEFAULT_CONFIG } = await import('../src/core/catalog.ts');
const { simulateMission } = await import('../src/core/engine.ts');
const { exportReplay } = await import('../src/persistence/replay.ts');
const { getExpeditionChoices, getExpeditionVisualState, simulateExpedition } = await import('../src/lab/scientific-expeditions.ts');
const { getSpacecraftPresentation } = await import('../src/lab/spacecraft-presentation.ts');
const VIABLE = {
  bennu: { launch: 'compact', orbit: 'near', duration: 'full', instrument: 'camera', power: 'extended', ground: 'extended' },
  telescope: { launch: 'science', orbit: 'far', duration: 'full', instrument: 'spectrometer', power: 'extended', ground: 'extended' },
};
const LABELS = { launch: /^Veículo de lançamento/, orbit: /^Perfil orbital/, instrument: /^Instrumento científico/, power: /^Energia e plataforma/, ground: /^Comunicação com o solo/, duration: /^Vida operacional do recorte/ };
const button = name => screen.getByRole('button', { name });
const click = async target => { await act(async () => fireEvent.click(typeof target === 'string' || target instanceof RegExp ? button(target) : target)); };
const change = async (label, value) => { await act(async () => fireEvent.change(screen.getByLabelText(label, { selector: 'input, select, textarea' }), { target: { value } })); };
const cleanupView = async () => { await act(async () => cleanup()); };
const designScene = () => document.querySelector('.assembly-scene .scene, .scientific-expedition .expedition-section .scene');
const operationScene = () => document.querySelector('.scientific-expedition .expedition-section .scene[data-state-time]');
const inspector = scene => scene.querySelector('.spacecraft-inspector');
const metric = (scene, name) => within(inspector(scene)).getByText(name, { selector: 'dt' }).nextElementSibling.textContent.trim();
const numeric = value => value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
const validCount = scene => within(scene).getByText('Recepção em solo').parentElement.querySelector('strong').textContent;

async function mount() {
  localStorage.clear(); globalThis.indexedDB = new IDBFactory();
  await act(async () => render(React.createElement(App)));
  await waitFor(() => assert.match(document.body.textContent, /3D indisponível · equivalente 2D ativo/));
}
async function openDesign(id, config = VIABLE[id]) {
  await click(id === 'bennu' ? 'Explorar missão Bennu' : 'Projetar telescópio científico');
  await click('Definir esta missão científica'); await click('Projetar a arquitetura');
  for (const [key, value] of Object.entries(config)) await change(LABELS[key], value);
}
async function execute() {
  await click('Revisar para executar');
  await change(/^Hipótese da equipe/, 'O instrumento e a energia precisam sustentar as observações até os contatos de solo.');
  await click('Executar missão científica');
  await waitFor(() => assert.ok(document.querySelector('.expedition-readout')));
}
async function earthChoice(key, label, value) {
  const navigation = screen.getByRole('navigation', { name: 'Escolher subsistema' });
  await click(within(navigation).getByRole('button', { name: label }));
  const selected = CATALOG[key].find(choice => choice.id === value);
  await click(screen.getByRole('radio', { name: new RegExp(selected.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }));
  return selected;
}
function assertNoTelemetry(scene) {
  assert.equal(scene.querySelector('.orbit-recorded-state'), null);
  assert.equal(scene.hasAttribute('data-state-time'), false);
  assert.match(inspector(scene).textContent, /capacidades escolhidas/);
  assert.match(inspector(scene).textContent, /só são demonstrados depois da execução/);
}
function assertExecutedConfig(scene, world, config) {
  const p = getSpacecraftPresentation({ world, expeditionConfig: config });
  assert.equal(scene.dataset.spacecraftConfig, p.configurationKey);
  assert.equal(scene.dataset.payloadId, config.instrument);
  assert.equal(Number(scene.dataset.panelW), p.energy.panelW);
  assert.equal(Number(scene.dataset.batteryWh), p.energy.batteryWh);
  assert.equal(scene.dataset.radioHardware, 'generic');
  assert.match(inspector(scene).textContent, /Montagem da tentativa executada/);
}
function assertReadingsAt(scene, result, at) {
  const state = getExpeditionVisualState(result, at);
  const recorded = within(scene.querySelector('.orbit-recorded-state'));
  const reading = label => recorded.getByText(label).parentElement.querySelector('strong').textContent;
  assert.equal(Number(scene.dataset.stateTime), state.timeS);
  assert.equal(reading('Bateria'), `${numeric(state.energyWh)} Wh`);
  assert.equal(reading('Memória ocupada'), `${numeric(state.queueBits / 1e6)} Mbit`);
  assert.equal(reading('Geração / consumo'), `${numeric(state.solarW)} W / ${numeric(state.loadW)} W`);
  assert.equal(validCount(scene), `${state.deliveredRecordIds.length} / 6 registros válidos`);
  assert.ok(scene.querySelector('.orbit-state-heading').textContent.includes(`Último estado: ${numeric(state.sourceStateTimeS)} s`));
}
after(() => dom.window.close());

test('Cerrado assembly explains the selected processor, energy and radio without inventing telemetry', async t => {
  t.after(cleanupView); await mount(); await click('Projetar missão do Cerrado');
  const scene = designScene(); const original = scene.dataset.spacecraftConfig;
  const payload = await earthChoice('processing', /Processamento/, 'index');
  assert.equal(scene.dataset.payloadId, 'index'); assert.notEqual(scene.dataset.spacecraftConfig, original);
  assert.equal(scene.dataset.inspection, 'instrument');
  assert.match(inspector(scene).textContent, /processa arquivos históricos Terra\/MODIS/);
  assert.match(inspector(scene).textContent, /não é uma câmera MODIS a bordo/);
  assert.equal(metric(scene, 'Volume por registro'), `${numeric(payload.bitsPerRecord / 1e6)} Mbit`);
  assert.equal(metric(scene, 'Carga total durante processamento'), `${payload.totalLoadW} W`);
  assert.ok(inspector(scene).textContent.includes(payload.description));
  const panel = await earthChoice('panel', /Painéis solares/, 'compact');
  const battery = await earthChoice('battery', /Bateria/, 'large');
  assert.equal(scene.dataset.inspection, 'energy');
  assert.equal(Number(scene.dataset.panelW), panel.watts); assert.equal(Number(scene.dataset.batteryWh), battery.capacityWh);
  assert.equal(metric(scene, 'Capacidade da bateria'), `${battery.capacityWh} Wh`);
  assert.ok(inspector(scene).textContent.includes(panel.description));
  const radio = await earthChoice('radio', /Rádio/, 'fast');
  assert.equal(scene.dataset.inspection, 'communications'); assert.equal(scene.dataset.radioHardware, 'fast');
  assert.equal(metric(scene, 'Taxa útil do rádio'), `${numeric(radio.rateBps / 1e6)} Mbit/s`);
  assert.ok(inspector(scene).textContent.includes(radio.description));
  await click(/^Contato curto/);
  assert.deepEqual([...scene.querySelectorAll('.inspector-contact li')].map(node => node.textContent), ['Contato 1: T+90 a 94 min · 240 s previstos', 'Contato 2: T+150 a 154 min · 240 s previstos']);
  assertNoTelemetry(scene);
});

test('Bennu and telescope render actual instruments and power choices while contact changes preserve radio hardware', async t => {
  for (const id of ['bennu', 'telescope']) await t.test(id, async sub => {
    sub.after(cleanupView); await mount();
    const config = { ...VIABLE[id], power: 'compact', ground: 'short' };
    await openDesign(id, config); const scene = designScene(); const choices = getExpeditionChoices(id);
    await click(within(scene).getByRole('button', { name: 'Carga científica' }));
    assert.equal(scene.dataset.payloadId, config.instrument);
    assert.match(inspector(scene).textContent, /sintétic/); assert.doesNotMatch(inspector(scene).textContent, /MODIS|NDVI/);
    const wrong = id === 'bennu' ? 'spectrometer' : 'camera';
    await change(LABELS.instrument, wrong);
    assert.equal(scene.dataset.payloadId, wrong); assert.match(inspector(scene).textContent, /não atende ao objetivo científico/);
    const payload = choices.instrument.find(choice => choice.id === wrong);
    assert.equal(metric(scene, 'Volume por registro'), `${payload.bitsPerRecord / 1e6} Mbit`);
    await change(LABELS.instrument, config.instrument);
    assert.doesNotMatch(inspector(scene).textContent, /não atende ao objetivo científico/);
    await change(LABELS.power, 'extended');
    const energy = choices.power.find(choice => choice.id === 'extended');
    assert.equal(scene.dataset.inspection, 'energy'); assert.equal(Number(scene.dataset.panelW), energy.watts);
    assert.equal(Number(scene.dataset.batteryWh), energy.capacityWh);
    assert.equal(metric(scene, 'Capacidade da bateria'), `${energy.capacityWh} Wh`);
    await click(within(scene).getByRole('button', { name: 'Comunicação' }));
    const radio = scene.dataset.radioHardware; const rate = metric(scene, 'Taxa útil do rádio');
    assert.ok([...scene.querySelectorAll('.inspector-contact li')].every(node => /120 s previstos/.test(node.textContent)));
    const shortConfiguration = scene.dataset.spacecraftConfig;
    await change(LABELS.ground, 'extended');
    assert.notEqual(scene.dataset.spacecraftConfig, shortConfiguration);
    assert.equal(scene.dataset.radioHardware, radio); assert.equal(radio, 'generic');
    assert.equal(metric(scene, 'Taxa útil do rádio'), rate);
    assert.ok([...scene.querySelectorAll('.inspector-contact li')].every(node => /500 s previstos/.test(node.textContent)));
    assert.match(inspector(scene).textContent, /mesmo rádio e a mesma taxa/);
    assert.match(inspector(scene).textContent, /não aumenta a antena nem a massa/);
    assert.match(inspector(scene).textContent, /serviço de solo/);
    assert.match(inspector(scene).textContent, /contatos não acrescentam massa à nave/);
    assertNoTelemetry(scene);
  });
});

test('inspection, exploded assembly and restore remain usable in the real 2D fallback', async t => {
  t.after(cleanupView); await mount(); await openDesign('bennu'); const scene = designScene();
  assert.equal(scene.dataset.visualMode, '2d'); assert.ok(scene.querySelector('.configured-flat svg'));
  for (const [name, part] of [['Carga científica', 'instrument'], ['Energia', 'energy'], ['Comunicação', 'communications']]) {
    await click(within(scene).getByRole('button', { name }));
    assert.equal(scene.dataset.inspection, part);
    assert.equal(within(scene).getByRole('button', { name }).getAttribute('aria-pressed'), 'true');
    assert.deepEqual([...scene.querySelectorAll('[data-inspector-part]')].map(node => node.dataset.inspectorPart), [part]);
  }
  await click(within(scene).getByRole('button', { name: 'Separar componentes' }));
  assert.equal(scene.dataset.exploded, 'true');
  assert.equal(within(scene).getByRole('button', { name: 'Reunir componentes' }).getAttribute('aria-pressed'), 'true');
  assert.equal(within(scene).getByRole('button', { name: 'Girar nave à esquerda' }).disabled, true);
  assert.equal(within(scene).getByRole('button', { name: 'Girar nave à direita' }).disabled, true);
  await click(within(scene).getByRole('button', { name: 'Restaurar montagem' }));
  assert.equal(scene.dataset.exploded, 'false'); assert.equal(scene.dataset.inspection, 'overview');
  assert.equal(within(scene).getByRole('button', { name: 'Nave completa' }).getAttribute('aria-pressed'), 'true');
  assert.equal(scene.querySelectorAll('[data-inspector-part]').length, 3); assertNoTelemetry(scene);
});

test('edited drafts never replace executed assembly; A/B keeps each input and receives no future records', async t => {
  for (const id of ['bennu', 'telescope']) await t.test(id, async sub => {
    sub.after(cleanupView); await mount(); await openDesign(id); await execute();
    const first = simulateExpedition(id, VIABLE[id]); const firstKey = operationScene().dataset.spacecraftConfig;
    assert.equal(first.outcome, 'success'); assertExecutedConfig(operationScene(), id, first.config);
    assertReadingsAt(operationScene(), first, 0);
    assert.equal(validCount(operationScene()), '0 / 6 registros válidos');
    await click('Ir ao estado final'); assert.equal(validCount(operationScene()), '6 / 6 registros válidos');
    const firstDelivery = Math.min(...first.observations.map(record => record.deliveredAtS));
    await change(/^Instante da missão/, String(firstDelivery - 1));
    assertReadingsAt(operationScene(), first, firstDelivery - 1);
    assert.equal(validCount(operationScene()), '0 / 6 registros válidos');
    await click('Ir ao estado final');
    await click('Redesenhar esta missão');
    const secondConfig = { ...VIABLE[id], power: 'compact', ground: 'short', instrument: id === 'bennu' ? 'spectrometer' : 'camera' };
    for (const key of ['power', 'ground', 'instrument']) await change(LABELS[key], secondConfig[key]);
    const editedKey = designScene().dataset.spacecraftConfig; assert.notEqual(editedKey, firstKey);
    await click(/^05\s*·\s*Operação$/);
    assert.equal(operationScene().dataset.spacecraftConfig, firstKey); assertExecutedConfig(operationScene(), id, first.config);
    assert.match(document.body.textContent, /Você editou o projeto depois desta tentativa/);
    assert.equal(validCount(operationScene()), '6 / 6 registros válidos');
    await click('Redesenhar esta missão'); await execute();
    const comparison = document.querySelector('.expedition-compare'); assert.ok(comparison);
    assert.equal(operationScene().dataset.spacecraftConfig, editedKey); assertExecutedConfig(operationScene(), id, secondConfig);
    assert.equal(validCount(operationScene()), '0 / 6 registros válidos');
    await click(within(comparison).getByRole('button', { name: 'Ver tentativa A' }));
    assertExecutedConfig(comparison.querySelector('.scene'), id, first.config);
    assertReadingsAt(comparison.querySelector('.scene'), first, 0);
    assert.equal(comparison.querySelector('.scene').dataset.spacecraftConfig, firstKey);
    assert.equal(validCount(comparison.querySelector('.scene')), '0 / 6 registros válidos');
    await click(within(comparison).getByRole('button', { name: 'Ver tentativa B' }));
    assertExecutedConfig(comparison.querySelector('.scene'), id, secondConfig);
    assert.equal(comparison.querySelector('.scene').dataset.spacecraftConfig, editedKey);
    assert.equal(validCount(comparison.querySelector('.scene')), '0 / 6 registros válidos');
    assert.deepEqual(first.config, VIABLE[id]);
  });
});

test('a valid imported replay without trace retains its assembly but does not fabricate resource readings', async t => {
  t.after(cleanupView);
  const config = { ...DEFAULT_CONFIG, battery: 'large', processing: 'index' };
  const result = simulateMission(config, 'long-contact', { trace: false });
  const replay = await exportReplay(result);
  await mount();
  await click('Abrir caderno de missões'); await click('Importar replay');
  await act(async () => fireEvent.change(document.querySelector('input[type="file"]'), { target: { files: [new File([replay], 'sem-amostras.json', { type: 'application/json' })] } }));
  await waitFor(() => assert.match(document.body.textContent, /Replay recalculado: o resultado confere/));
  const scene = document.querySelector('.mission-stage .scene');
  assert.equal(scene.dataset.payloadId, 'index'); assert.equal(scene.dataset.batteryWh, '24');
  assert.equal(scene.dataset.spacecraftConfig, getSpacecraftPresentation({ world: 'earth', config, scenarioId: 'long-contact' }).configurationKey);
  assert.match(scene.textContent, /Nenhum estado do motor disponível/);
  assert.match(inspector(scene).textContent, /a montagem é conhecida, mas as leituras temporais estão indisponíveis/);
  assert.equal(scene.querySelectorAll('[role="meter"]').length, 0);
  assert.equal(within(scene).queryByText('Recepção em solo'), null);
  assert.doesNotMatch(inspector(scene).textContent, /No instante selecionado:/);
  assert.equal(document.querySelector('.result-number').textContent, `${result.deliveredRecords}/${result.requiredRecords}`);
});
