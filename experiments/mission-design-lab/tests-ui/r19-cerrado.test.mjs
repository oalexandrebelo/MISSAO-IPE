import test, { after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://mission.test/', pretendToBeVisual: true });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLInputElement', 'HTMLCanvasElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle', 'localStorage', 'location']) Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name], writable: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.scrollTo = () => {};
dom.window.HTMLElement.prototype.scrollIntoView = () => {};
dom.window.HTMLCanvasElement.prototype.getContext = () => null;
const { render, screen, fireEvent, cleanup, act } = await import('@testing-library/react');
const { CerradoEvidenceTrail, CerradoRoleDebrief, CerradoComparisonExplanation, cerradoRecordAt, compareCerrado } = await import('../src/ui/CerradoLearning.tsx');
const { runLearningExperiment } = await import('../src/lab/mission-curriculum.ts');
const { SCIENCE_RECORDS } = await import('../src/data/science-data.ts');
const { simulateMission } = await import('../src/core/engine.ts');
const { DEFAULT_CONFIG } = await import('../src/core/catalog.ts');
const trials = runLearningExperiment('cerrado').trials;
const result = simulateMission({ ...DEFAULT_CONFIG }, 'long-contact');
afterEach(async () => { await act(async () => cleanup()); });
after(() => dom.window.close());

test('Cerrado trace withholds historical values until that exact record is delivered and hides future events', async () => {
  const record = result.observations.find(item => item.state === 'delivered' && item.scienceValid);
  assert.ok(record && record.deliveredAtS !== null);
  assert.equal(cerradoRecordAt(result, record.id, record.deliveredAtS - 1).value, null);
  assert.equal(cerradoRecordAt(result, record.id, record.deliveredAtS).value, record.ndvi);
  assert.equal(cerradoRecordAt(result, record.id, 0).status, 'Ainda não produzido');
  let inspected;
  const props = { result, timeS: 0, selectedRecordId: record.id, onSelectRecord: () => {}, onInspect: (...args) => { inspected = args; } };
  const view = render(React.createElement(CerradoEvidenceTrail, props));
  assert.equal(screen.queryByText(/NDVI recebido:/), null);
  assert.equal(screen.queryByRole('button', { name: /Rever entrega/ }), null);
  view.rerender(React.createElement(CerradoEvidenceTrail, { ...props, timeS: record.deliveredAtS }));
  fireEvent.click(screen.getByRole('button', { name: /Rever entrega no 3D/ }));
  assert.equal(inspected[0].recordId, record.id);
  assert.equal(inspected[0].code, 'RECORD_DELIVERED');
  assert.equal(inspected[0].timeS, record.deliveredAtS);
  assert.equal(inspected[1], 'ground');
});

test('a different record does not inherit an available value and an incomplete pair cannot show a difference', () => {
  const record = result.observations.find(item => item.state === 'delivered');
  const other = SCIENCE_RECORDS.find(item => item.id !== record.id && item.id.startsWith(record.id[0]));
  const altered = { ...result, observations: result.observations.map(item => item.id === other.id ? { ...item, state: 'partial', deliveredAtS: null, ndvi: null } : item) };
  render(React.createElement(CerradoEvidenceTrail, { result: altered, timeS: result.completedAtS, selectedRecordId: record.id, onSelectRecord: () => {}, onInspect: () => {} }));
  assert.ok(screen.getByText('Aguardando o par completo'));
  assert.equal(screen.queryByText(/Variação NDVI:/), null);
  assert.equal(cerradoRecordAt(altered, other.id, result.completedAtS).ready, false);
});

test('Cerrado A/B locates the measured power divergence at 600 seconds and lists all changed module attributes', () => {
  const comparison = compareCerrado(trials[0].result, trials[1].result);
  assert.equal(comparison.firstTimeS, 600);
  assert.equal(comparison.firstEvent.code, 'PEAK_POWER');
  assert.deepEqual(comparison.changed, ['processing']);
  let sought;
  render(React.createElement(CerradoComparisonExplanation, { a: trials[0].result, b: trials[1].result, onSeek: value => { sought = value; } }));
  assert.ok(screen.getByText(/Limite instantâneo de potência/));
  assert.ok(screen.getByText(/W de carga total/));
  assert.ok(screen.getByText(/bit por registro/));
  fireEvent.click(screen.getByRole('button', { name: 'Investigar esta diferença no 3D' }));
  assert.equal(sought, 600);
  assert.equal(compareCerrado(trials[0].result, trials[0].result).firstTimeS, null);
});

test('four-role analysis registers all four answers with existing event IDs and exports the same executed result', () => {
  const saved = [], downloaded = [];
  let payload;
  const oldCreate = URL.createObjectURL, oldRevoke = URL.revokeObjectURL;
  URL.createObjectURL = blob => { payload = blob; return 'blob:analysis'; };
  URL.revokeObjectURL = () => {};
  const oldClick = dom.window.HTMLAnchorElement.prototype.click;
  dom.window.HTMLAnchorElement.prototype.click = function () { downloaded.push(this.download); };
  try {
    render(React.createElement(CerradoRoleDebrief, { result, onInspect: () => {}, onSave: (...args) => saved.push(args) }));
    const save = screen.getByRole('button', { name: 'Registrar as quatro análises' });
    assert.equal(save.disabled, true);
    for (const input of screen.getAllByRole('textbox')) fireEvent.change(input, { target: { value: 'O evento sustenta esta conclusão e precisamos rever o limite.' } });
    fireEvent.click(save);
    assert.equal(saved.length, 4);
    assert.ok(saved.every(([, eventId]) => result.events.some(event => event.id === eventId)));
    fireEvent.click(screen.getByRole('button', { name: 'Exportar análise e evidências' }));
    assert.deepEqual(downloaded, ['missao-ipe-cerrado-analise-quatro-papeis.json']);
    assert.ok(payload);
    return payload.text().then(text => {
      const report = JSON.parse(text);
      assert.equal(report.roles.length, 4);
      assert.equal(report.roles[3].role, 'user');
      assert.deepEqual(report.result, result);
      assert.ok(report.roles.every(role => role.answer.length > 8));
    });
  } finally {
    URL.createObjectURL = oldCreate; URL.revokeObjectURL = oldRevoke;
    dom.window.HTMLAnchorElement.prototype.click = oldClick;
  }
});

test('the final scientific table returns to the same record delivery in the main 3D replay', async () => {
  const { MissionControl } = await import('../src/ui/MissionControl.tsx');
  const target = result.observations.find(item => item.state === 'delivered' && item.scienceValid);
  await act(async () => render(React.createElement(MissionControl, {
    result, searchResult: null, searching: false, canSearch: false,
    onSearch() {}, onCancelSearch() {}, onApply() {}, onRedesign() {}, onTransfer() {},
    onExport() {}, exporting: false, onReflect() {}, onCompare() {}, canCompare: false,
  })));
  await act(async () => fireEvent.click(screen.getByRole('button', { name: `Seguir ${target.id} na trilha e no 3D` })));
  const scene = document.querySelector('.mission-stage .scene');
  assert.equal(Number(scene.dataset.stateTime), target.deliveredAtS);
  assert.equal(scene.dataset.visualMode, '2d');
  assert.ok(document.getElementById('cerrado-evidence-trail').textContent.includes(target.id));
  assert.ok(document.getElementById('cerrado-evidence-trail').textContent.includes('NDVI recebido:'));
  assert.equal(document.activeElement.id, 'stage-title');
});
