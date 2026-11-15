import test, { after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://mission.test/', pretendToBeVisual: true });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLInputElement', 'HTMLCanvasElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle', 'localStorage', 'location']) Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name], writable: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.HTMLCanvasElement.prototype.getContext = () => null;
dom.window.HTMLElement.prototype.scrollIntoView = () => {};
const { render, screen, fireEvent, within, cleanup, act } = await import('@testing-library/react');
const { ExpeditionWorkbench } = await import('../src/ui/ExpeditionWorkbench.tsx');
const { Workbench } = await import('../src/ui/Workbench.tsx');
const { DEFAULT_EXPEDITION_CONFIGS, getExpeditionChoices, getExpeditionPreflight, getExpeditionSchedule } = await import('../src/lab/scientific-expeditions.ts');
const { DEFAULT_CONFIG, CATALOG, getConfigTotals } = await import('../src/core/catalog.ts');
const numeric = value => value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
const click = async target => { await act(async () => fireEvent.click(target)); };
const category = label => within(screen.getByRole('navigation', { name: 'Escolher sistema da expedição' })).getByRole('button', { name: label });
const option = (label, value) => screen.getByRole('group', { name: label }).querySelector(`input[value="${value}"]`);
const scene = () => document.querySelector('.equipment-assembly .scene');
const resource = label => within(screen.getByRole('complementary', { name: 'Tudo precisa caber junto.' })).getByText(label, { selector: 'dt' }).nextElementSibling;

afterEach(async () => { await act(async () => cleanup()); });
after(() => dom.window.close());

for (const id of ['bennu', 'telescope']) {
  test(`${id}: energia altera a nave e mostra diferenças calculadas pelo catálogo`, async () => {
    const before = { ...DEFAULT_EXPEDITION_CONFIGS[id] };
    const choices = [];
    const onChoice = (key, value) => choices.push({ key, value });
    let view;
    await act(async () => { view = render(React.createElement(ExpeditionWorkbench, { id, config: before, onChoice })); });
    const initialKey = scene().dataset.spacecraftConfig;
    await click(category('Energia e plataforma'));
    assert.equal(scene().dataset.inspection, 'energy');
    assert.equal(scene().dataset.spacecraftConfig, initialKey, 'inspecting a category does not modify or execute the project');
    assert.equal(choices.length, 0);
    await click(option('Energia e plataforma', 'extended'));
    assert.deepEqual(choices, [{ key: 'power', value: 'extended' }]);
    const afterConfig = { ...before, power: 'extended' };
    await act(async () => view.rerender(React.createElement(ExpeditionWorkbench, { id, config: afterConfig, onChoice })));
    const a = getExpeditionPreflight(id, before).totals;
    const b = getExpeditionPreflight(id, afterConfig).totals;
    assert.equal(Number(scene().dataset.panelW), b.panelW);
    assert.equal(Number(scene().dataset.batteryWh), b.capacityWh);
    assert.equal(scene().hasAttribute('data-state-time'), false, 'a design change does not invent mission telemetry');
    for (const [label, key, unit] of [['Massa total', 'massKg', 'kg'], ['Orçamento usado', 'credits', 'créditos'], ['Energia armazenável', 'capacityWh', 'Wh'], ['Geração nominal', 'panelW', 'W']]) {
      const reading = resource(label);
      assert.equal(reading.querySelector('.equipment-before').textContent.trim(), `${numeric(a[key])} →`);
      assert.equal(reading.querySelector('strong').textContent, `${numeric(b[key])} ${unit}`);
      assert.equal(reading.querySelector('.equipment-delta').textContent, `+${numeric(b[key] - a[key])} ${unit}`);
    }
    assert.equal(resource('Memória').querySelector('.equipment-delta').textContent, 'Sem alteração');
    await click(option('Energia e plataforma', 'extended'));
    assert.equal(choices.length, 1, 'reselecting the checked choice must not create a second mutation');
    assert.equal(resource('Energia armazenável').querySelector('.equipment-before').textContent.trim(), `${numeric(a.capacityWh)} →`, 'reselecting preserves the genuine previous choice');
    await act(async () => view.rerender(React.createElement(ExpeditionWorkbench, { id, config: before, onChoice })));
    assert.equal(document.querySelector('.equipment-before'), null, 'an imported/restored configuration must not inherit a stale delta');
  });

  test(`${id}: ampliar contatos mantém hardware e taxa e usa a agenda do motor`, async () => {
    const before = { ...DEFAULT_EXPEDITION_CONFIGS[id] };
    let view;
    await act(async () => { view = render(React.createElement(ExpeditionWorkbench, { id, config: before, onChoice: () => {} })); });
    await click(category('Comunicação com o solo'));
    const hardware = scene().dataset.radioHardware;
    await click(option('Comunicação com o solo', 'extended'));
    const next = { ...before, ground: 'extended' };
    await act(async () => view.rerender(React.createElement(ExpeditionWorkbench, { id, config: next, onChoice: () => {} })));
    assert.equal(scene().dataset.inspection, 'communications');
    assert.equal(scene().dataset.radioHardware, hardware);
    const choices = getExpeditionChoices(id).ground;
    assert.equal(choices[0].rateBps, choices[1].rateBps);
    assert.match(document.querySelector('.equipment-why').textContent, /mesma antena e a mesma taxa/);
    const contacts = getExpeditionSchedule(id, next).contacts;
    const formatted = contacts.map(([start, end]) => `${numeric(start / 60)}–${numeric(end / 60)} min`).join(' · ');
    assert.equal(document.querySelector('.equipment-contact-plan p').textContent, formatted);
    assert.equal(resource('Massa total').querySelector('.equipment-delta').textContent, 'Sem alteração');
    assert.equal(resource('Orçamento usado').querySelector('.equipment-delta').textContent, `+${numeric(choices[1].credits - choices[0].credits)} créditos`);
  });
}

test('Cerrado: trocar bateria preserva recurso científico e mostra massa, custo e capacidade reais do catálogo', async () => {
  const before = { ...DEFAULT_CONFIG };
  const changes = [];
  const props = { scenarioId: 'long-contact', onChoice: (key, value) => changes.push({ key, value }), onScenario: () => {}, prediction: '', onPrediction: () => {}, rationale: '', onRationale: () => {}, firstAttempt: true, onLaunch: () => { throw new Error('changing equipment must not launch'); }, onSave: () => {}, busy: false, blocked: false, saving: false, onCancel: () => {} };
  let view;
  await act(async () => { view = render(React.createElement(Workbench, { ...props, config: before })); });
  await click(screen.getByRole('radio', { name: /Bateria 24 Wh/ }));
  const next = { ...before, battery: 'large' };
  await act(async () => view.rerender(React.createElement(Workbench, { ...props, config: next })));
  assert.deepEqual(changes, [{ key: 'battery', value: 'large' }]);
  const change = screen.getByRole('region', { name: 'Impacto da última escolha no Cerrado' });
  const a = getConfigTotals(before), b = getConfigTotals(next);
  const mass = within(change).getByText('Massa total', { selector: 'dt' }).nextElementSibling;
  assert.equal(mass.querySelector('strong').textContent, `${numeric(b.massKg)} kg`);
  assert.equal(mass.querySelector('small').textContent, `+${numeric(b.massKg - a.massKg)} kg`);
  assert.equal(Number(document.querySelector('.assembly-scene .scene').dataset.batteryWh), CATALOG.battery.find(item => item.id === next.battery).capacityWh);
  assert.equal(document.querySelector('.assembly-scene .scene').dataset.payloadId, before.processing);
  assert.equal(document.querySelector('.assembly-scene .scene').hasAttribute('data-state-time'), false);
});
