import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://mission.test/', pretendToBeVisual: true });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLInputElement', 'HTMLTextAreaElement', 'HTMLSelectElement', 'HTMLDialogElement', 'HTMLCanvasElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle', 'localStorage', 'location']) Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name], writable: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.HTMLElement.prototype.scrollIntoView = () => {};
dom.window.HTMLCanvasElement.prototype.getContext = () => null;
const { render, screen, fireEvent, cleanup, act, within } = await import('@testing-library/react');
const { simulateExpedition } = await import('../src/lab/scientific-expeditions.ts');
const { runLearningExperiment } = await import('../src/lab/mission-curriculum.ts');
const { ScientificExpedition } = await import('../src/ui/ScientificExpedition.tsx');
const { ExpeditionEvidenceTrail, ExpeditionComparisonExplanation, ExpeditionRoleDebrief, expeditionRecordStatus, explainExpeditionComparison, emptyExpeditionDebrief } = await import('../src/ui/ExpeditionLearning.tsx');
const viable = { bennu: { launch: 'compact', orbit: 'near', duration: 'full', instrument: 'camera', power: 'extended', ground: 'extended' }, telescope: { launch: 'science', orbit: 'far', duration: 'full', instrument: 'spectrometer', power: 'extended', ground: 'extended' } };
const click = async (name) => { await act(async () => fireEvent.click(typeof name === 'string' || name instanceof RegExp ? screen.getByRole('button', { name }) : name)); };
const change = async (label, value) => {
  const navigation = screen.queryByRole('navigation', { name: 'Escolher sistema da expedição' });
  const category = navigation && within(navigation).queryByRole('button', { name: label });
  if (category) {
    await click(category);
    const options = screen.getByRole('group', { name: label });
    const radio = [...options.querySelectorAll('input[type="radio"]')].find(input => input.value === value);
    assert.ok(radio, `Equipment option ${value} must be available in the selected category`);
    await click(radio);
    return;
  }
  await act(async () => fireEvent.change(screen.getByLabelText(label, { selector: 'input, select, textarea' }), { target: { value } }));
};
const clear = async () => { await act(async () => cleanup()); };
after(() => dom.window.close());

test('R19 evidence states preserve time, delivery validity, exact measurements and record event identity in both missions', async t => {
  for (const id of ['bennu', 'telescope']) await t.test(id, async sub => {
    sub.after(clear);
    const result = simulateExpedition(id, viable[id]);
    const first = result.observations[0], last = result.observations.at(-1);
    assert.equal(expeditionRecordStatus(first, 0), 'not-yet');
    assert.equal(expeditionRecordStatus(first, first.producedAtS), 'incomplete');
    assert.equal(expeditionRecordStatus(first, first.deliveredAtS), 'valid');
    const inspections = [];
    let view;
    await act(async () => { view = render(React.createElement(ExpeditionEvidenceTrail, { result, timeS: 0, onInspect: item => inspections.push(item) })); });
    assert.match(document.querySelector('.exp-trace-measure').textContent, /indisponível/);
    await act(async () => view.rerender(React.createElement(ExpeditionEvidenceTrail, { result, timeS: first.deliveredAtS, onInspect: item => inspections.push(item) })));
    assert.ok(document.querySelector('.exp-trace-measure').textContent.includes(first.value.toLocaleString('pt-BR', { maximumFractionDigits: 5 })));
    await click(within(document.querySelector('.exp-trace-steps')).getByRole('button', { name: /04 · Solo/ }));
    const delivered = result.events.find(event => event.code === 'RECORD_DELIVERED' && event.recordId === first.id);
    assert.deepEqual(inspections.at(-1), { eventId: delivered.id, segment: 'ground', subsystem: 'communications', recordId: first.id, step: 'delivery' });
    await click(within(document.querySelector('.exp-record-picker')).getByRole('button', { name: new RegExp(last.id) }));
    assert.match(document.querySelector('.exp-trace-measure').textContent, /indisponível/);
    await click(within(document.querySelector('.exp-trace-steps')).getByRole('button', { name: /04 · Solo/ }));
    assert.ok(result.events.find(event => event.id === inspections.at(-1).eventId).timeS <= first.deliveredAtS, 'A future delivery must not be selected implicitly');
  });
});

test('R19 incompatible completed Webb records remain unavailable as scientific evidence', async t => {
  t.after(clear);
  const result = simulateExpedition('telescope', { ...viable.telescope, instrument: 'camera' });
  assert.equal(result.observations.filter(record => record.deliveredAtS !== null).length, 6);
  assert.equal(expeditionRecordStatus(result.observations[0], result.completedAtS), 'incompatible');
  await act(async () => render(React.createElement(ExpeditionEvidenceTrail, { result, timeS: result.completedAtS, onInspect() {} })));
  assert.match(document.querySelector('.exp-status').textContent, /instrumento incompatível/);
  assert.match(document.querySelector('.exp-trace-measure').textContent, /indisponível/);
});

test('R19 A/B explains composite ground choices and identifies real first divergence without editing results', async t => {
  t.after(clear);
  const [a, b] = runLearningExperiment('bennu').trials.map(trial => trial.result);
  const before = JSON.stringify([a, b]);
  const comparison = explainExpeditionComparison(a, b);
  assert.deepEqual(comparison.changed, ['ground']);
  assert.equal(comparison.first.timeS, 5100);
  assert.match(comparison.explanation, /duração, início do contato e custo juntos/);
  assert.ok(comparison.differences[0].attributes.some(attribute => attribute.includes('120 → 500 s')));
  const inspections = [];
  await act(async () => render(React.createElement(ExpeditionComparisonExplanation, { a, b, onInspect: (...args) => inspections.push(args) })));
  await click('Investigar B no 3D');
  assert.equal(inspections[0][0], 5100);
  assert.equal(b.events.find(event => event.id === inspections[0][2]).code, 'CONTACT_START');
  assert.equal(JSON.stringify([a, b]), before);
  const [camera, spectrometer] = runLearningExperiment('telescope').trials.map(trial => trial.result);
  const webb = explainExpeditionComparison(camera, spectrometer);
  assert.equal(webb.first.timeS, 0);
  assert.equal(webb.first.aEvent.code, 'INSTRUMENT_MISMATCH');
  assert.match(webb.explanation, /validade científica são critérios distintos/);
  assert.equal(explainExpeditionComparison(b, b).first, undefined);
  const freeB = simulateExpedition('bennu', { ...b.config, duration: 'short', orbit: 'far', launch: 'science' });
  assert.match(explainExpeditionComparison(a, freeB).explanation, /não isola uma causa única/);
});

test('R19 four role conclusions preserve explicit event and record references without grading knowledge', async t => {
  t.after(clear);
  const result = simulateExpedition('bennu', viable.bennu);
  let saved = emptyExpeditionDebrief();
  const inspections = [];
  function Harness() { const [answers, setAnswers] = React.useState(saved); return React.createElement(ExpeditionRoleDebrief, { result, answers, onChange(next) { saved = next; setAnswers(next); }, onInspect: next => inspections.push(next) }); }
  await act(async () => render(React.createElement(Harness)));
  for (const role of ['Lançamento', 'Espaço', 'Solo', 'Usuários']) {
    await click(new RegExp(`0[1-4] · ${role}`));
    await change('Registro citado', result.observations[0].id);
    await change('Nosso parecer: conclusão, evidência e próximo passo', `Parecer de ${role}: o registro chegou completo, mas a origem exige espectroscopia.`);
    await click('Rever evidência deste papel no 3D');
    assert.ok(result.events.some(event => event.id === inspections.at(-1).eventId));
  }
  assert.match(document.querySelector('.exp-status').textContent, /4\/4/);
  for (const answer of Object.values(saved)) { assert.ok(answer.conclusion.length > 8); assert.equal(answer.recordId, result.observations[0].id); assert.ok(result.events.some(event => event.id === answer.eventId)); }
  assert.match(document.querySelector('.exp-role-panel').textContent, /não avalia compreensão/);
});

test('R19 real mission export carries four-role analysis and resets it only after new execution', async t => {
  t.after(clear);
  let exported;
  const oldCreate = URL.createObjectURL, oldRevoke = URL.revokeObjectURL, oldClick = dom.window.HTMLAnchorElement.prototype.click;
  URL.createObjectURL = blob => { exported = blob; return 'blob:mission-report'; }; URL.revokeObjectURL = () => {}; dom.window.HTMLAnchorElement.prototype.click = () => {};
  t.after(() => { URL.createObjectURL = oldCreate; URL.revokeObjectURL = oldRevoke; dom.window.HTMLAnchorElement.prototype.click = oldClick; });
  await act(async () => render(React.createElement(ScientificExpedition, { id: 'bennu', onBack() {} })));
  await click('Definir esta missão científica'); await click('Projetar a arquitetura');
  await change(/^Energia e plataforma/, 'extended'); await change(/^Comunicação com o solo/, 'extended');
  await click('Revisar para executar'); await change(/^Hipótese da equipe/, 'Os seis registros devem chegar nos contatos ampliados.'); await click('Executar missão científica');
  await click('Interpretar o retorno científico');
  await click(screen.getAllByRole('button', { name: 'Rever esta entrega no 3D' }).at(-1));
  assert.equal(within(document.querySelector('.exp-record-picker')).getByRole('button', { pressed: true }).textContent.startsWith('bennu-site-6'), true);
  assert.match(within(document.querySelector('.exp-trace-steps')).getByRole('button', { pressed: true }).textContent, /04 · Solo/);
  assert.match(document.querySelector('.exp-trace-detail').textContent, /comprova a recepção completa/);
  await click(within(document.querySelector('.exp-trace-steps')).getByRole('button', { name: /05 · Conclusão/ }));
  assert.match(within(document.querySelector('.exp-trace-steps')).getByRole('button', { pressed: true }).textContent, /05 · Conclusão/);
  assert.equal(within(document.querySelector('.exp-record-picker')).getByRole('button', { pressed: true }).textContent.startsWith('bennu-site-6'), true);
  await click('Interpretar o retorno científico');
  await change('Nosso parecer: conclusão, evidência e próximo passo', 'Os tamanhos permitem comparação, mas não determinam a composição.');
  await change('Registro citado', 'bennu-site-1');
  await click('Exportar relatório da missão');
  const report = JSON.parse(await exported.text());
  assert.match(report.fourRoleDebrief.user.conclusion, /não determinam/);
  assert.ok(report.result.events.some(event => event.id === report.fourRoleDebrief.user.eventId));
  await click('Criar uma nova tentativa'); await click('Revisar para executar'); await change(/^Hipótese da equipe/, 'Vou repetir para conferir o mesmo resultado.'); await click('Executar missão científica'); await click('Interpretar o retorno científico');
  assert.equal(screen.getByLabelText('Nosso parecer: conclusão, evidência e próximo passo').value, '');
  assert.match(document.querySelector('.exp-role-debrief .exp-status').textContent, /0\/4/);
});
