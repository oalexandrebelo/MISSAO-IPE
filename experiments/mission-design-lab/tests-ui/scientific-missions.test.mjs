import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';
import { IDBFactory } from 'fake-indexeddb';
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://mission.test/', pretendToBeVisual: true });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLInputElement', 'HTMLTextAreaElement', 'HTMLSelectElement', 'HTMLDialogElement', 'HTMLCanvasElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle', 'localStorage', 'location']) Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name], writable: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
// Only unavailable browser APIs are adapted; mission calculation and validation are real.
dom.window.scrollTo = () => {};
dom.window.HTMLElement.prototype.scrollIntoView = () => {};
dom.window.HTMLCanvasElement.prototype.getContext = () => null;
dom.window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
dom.window.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
const { render, screen, fireEvent, waitFor, cleanup, act, within } = await import('@testing-library/react');
const { default: App } = await import('../src/App.tsx');
const { simulateExpedition, getExpeditionVisualState, EXPEDITIONS } = await import('../src/lab/scientific-expeditions.ts');
const { DEFAULT_CONFIG } = await import('../src/core/catalog.ts');
const { simulateMission } = await import('../src/core/engine.ts');
const { exportReplay } = await import('../src/persistence/replay.ts');
const { number } = await import('../src/ui/format.ts');
const VIABLE = {
  bennu: { launch: 'compact', orbit: 'near', duration: 'full', instrument: 'camera', power: 'extended', ground: 'extended' },
  telescope: { launch: 'science', orbit: 'far', duration: 'full', instrument: 'spectrometer', power: 'extended', ground: 'extended' },
};
const LABELS = { launch: /^Veículo de lançamento/, orbit: /^Perfil orbital/, instrument: /^Instrumento científico/, power: /^Energia e plataforma/, ground: /^Comunicação com o solo/, duration: /^Vida operacional do recorte/ };
const CREW_LABELS = [/Ciência e usuários/, /Nave e recursos/, /Lançamento e trajetória/, /Solo e operações/];
const button = name => screen.getByRole('button', { name });
const click = async target => { await act(async () => fireEvent.click(typeof target === 'string' || target instanceof RegExp ? button(target) : target)); };
const change = async (label, value) => { await act(async () => fireEvent.change(screen.getByLabelText(label, { selector: 'input, select, textarea' }), { target: { value } })); };
const cleanupView = async () => { await act(async () => cleanup()); };
async function mount() {
  localStorage.clear(); globalThis.indexedDB = new IDBFactory();
  await act(async () => render(React.createElement(App)));
  await waitFor(() => assert.match(document.body.textContent, /3D indisponível · equivalente 2D ativo/));
}
async function openDesign(id, config = VIABLE[id]) {
  await click(id === 'bennu' ? 'Explorar missão Bennu' : 'Projetar telescópio científico');
  assert.ok(screen.getByRole('heading', { name: EXPEDITIONS[id].title }));
  await click('Definir esta missão científica'); await click('Projetar a arquitetura');
  for (const [key, value] of Object.entries(config)) await change(LABELS[key], value);
}
async function execute(hypothesis = 'O instrumento responde ao objetivo e os contatos ampliados permitem receber os seis registros.') {
  await click('Revisar para executar'); await change(/^Hipótese da equipe/, hypothesis); await click('Executar missão científica');
  await waitFor(() => assert.ok(document.querySelector('.expedition-readout')));
}
const mainScene = () => document.querySelector('.scientific-expedition .scene[data-state-time]');
const currentCount = () => within(document.querySelector('.expedition-readout')).getByText('Registros válidos disponíveis').parentElement.querySelector('strong').textContent;
function assertSceneAt(result, at, scene = mainScene()) {
  const expected = getExpeditionVisualState(result, at);
  assert.equal(Number(scene.dataset.stateTime), expected.timeS);
  assert.ok(scene.querySelector('.orbit-state-heading').textContent.includes(`Último estado: ${number(expected.sourceStateTimeS)} s`));
  assert.equal(within(scene).getByText('Recepção em solo').parentElement.querySelector('strong').textContent, `${expected.deliveredRecordIds.length} / 6 registros válidos`);
  assert.equal(within(scene).getByText('Bateria').parentElement.querySelector('strong').textContent, `${number(expected.energyWh)} Wh`);
}
async function importDesign(text) {
  await act(async () => fireEvent.change(document.querySelector('.scientific-expedition input[type="file"]'), { target: { files: [new File([text], 'projeto.json', { type: 'application/json' })] } }));
}
after(() => dom.window.close());

test('hub exposes all three missions; Cerrado rewind excludes future delivery; NASA fallback never claims GPU loading', async t => {
  t.after(cleanupView); await mount();
  for (const name of ['Projetar missão do Cerrado', 'Explorar missão Bennu', 'Projetar telescópio científico']) assert.ok(button(name));
  await click('Projetar missão do Cerrado'); await change('Minha previsão', 'none'); await change('Por quê?', 'O contato longo deve permitir entregar os seis registros completos.'); await click('Registrar e executar');
  await waitFor(() => assert.equal(document.querySelector('.result-number')?.textContent, '6/6'));
  const result = simulateMission({ ...DEFAULT_CONFIG }, 'long-contact');
  await change('Estado registrado da missão', '0');
  assert.match(document.querySelector('.no-events').textContent, /Selecione um evento/);
  assert.doesNotMatch(document.querySelector('.no-events').textContent, /Nenhum evento foi retornado/);
  const scene = document.querySelector('.mission-stage .scene');
  assert.equal(scene.dataset.stateTime, '0');
  assert.equal(within(scene).getByText('Recepção em solo').parentElement.querySelector('strong').textContent, '0 / 6 registros válidos');
  assert.equal(document.querySelector('.result-number').textContent, '6/6', 'The separately labelled final report remains unchanged');
  assert.ok(screen.getByRole('region', { name: 'Resultado final da tentativa' }));
  assert.match(document.querySelector('.result-final-label').textContent, /instante anterior/);
  await change('Estado registrado da missão', String(result.trace.length - 1));
  assert.equal(Number(scene.dataset.stateTime), result.trace.at(-1).timeS);
  assert.equal(within(scene).getByText('Recepção em solo').parentElement.querySelector('strong').textContent, '6 / 6 registros válidos');
  await click('MISSÃO IPÊ, observatório'); await click('Explorar modelos NASA em 3D');
  const library = await screen.findByRole('region', { name: 'Modelos NASA de referência' });
  await waitFor(() => assert.match(library.textContent, /Esquema 2D · descrição equivalente disponível/));
  for (const name of ['Antena DSN de 70 m', 'Asteroide Bennu', 'CubeSat genérico 2RU', 'Telescópio James Webb']) {
    await click(within(library).getByRole('button', { name }));
    assert.equal(library.querySelector('[data-model-loaded]').dataset.modelLoaded, 'false');
    assert.equal(library.querySelector('[data-visual-mode]').dataset.visualMode, '2d');
    assert.equal(within(library).getByRole('button', { name: 'Girar à esquerda' }).disabled, true);
    assert.match(within(library).getByRole('link', { name: /Fonte NASA/ }).href, /^https:\/\/science\.nasa\.gov\/3d-resources\/.+/);
    assert.doesNotMatch(library.textContent, /Modelo NASA carregado/);
  }
});

test('both new scientific missions execute viable inputs and reject incompatible instruments as science', async t => {
  for (const id of ['bennu', 'telescope']) await t.test(id, async sub => {
    sub.after(cleanupView); await mount(); await openDesign(id);
    const valid = simulateExpedition(id, VIABLE[id]); assert.equal(valid.outcome, 'success');
    await execute(); assert.equal(currentCount(), '0 / 6'); assertSceneAt(valid, 0);
    assert.match(document.querySelector('.expedition-replay-help').textContent, /A simulação já terminou/);
    assert.equal(document.querySelectorAll('.archive-record.is-received').length, 0);
    assert.equal(document.querySelectorAll('.archive-point').length, 0);
    assert.doesNotMatch(mainScene().textContent, /MODIS|PAINÉIS 18 W|O Cerrado/);
    await click('Ir ao estado final'); assert.equal(currentCount(), '6 / 6'); assertSceneAt(valid, valid.completedAtS);
    assert.equal(document.querySelectorAll('.archive-record.is-received').length, 6);
    if (id === 'telescope') assert.equal(document.querySelectorAll('.archive-point').length, 6);
    await click(screen.getAllByRole('button', { name: 'Rever esta entrega no 3D' })[0]);
    assert.equal(Number(mainScene().dataset.stateTime), valid.observations[0].deliveredAtS);
    assert.equal(document.querySelectorAll('.archive-record.is-received').length, 1);
    if (id === 'telescope') assert.equal(document.querySelectorAll('.archive-point').length, 1);
    await change(/^Instante da missão/, '0'); assert.equal(currentCount(), '0 / 6'); assertSceneAt(valid, 0);
    assert.equal(document.querySelectorAll('.archive-record.is-received').length, 0);
    await click('Interpretar o retorno científico'); assert.ok(screen.getByRole('heading', { name: '6 de 6 registros válidos.' }));
    assert.equal(document.querySelectorAll('.archive-record.is-received').length, 6);
    for (const record of valid.observations) assert.ok(document.querySelector(`[data-record-id="${record.id}"] .archive-value`).textContent.includes(record.value.toLocaleString('pt-BR', { maximumFractionDigits: 5 })));
    assert.match(document.querySelector('.archive-evidence').textContent, /ARQUIVO CIENTÍFICO REAL/);
    await click('Criar uma nova tentativa');
    const wrong = { ...VIABLE[id], launch: 'science', instrument: id === 'bennu' ? 'spectrometer' : 'camera' };
    await change(LABELS.launch, wrong.launch); await change(LABELS.instrument, wrong.instrument);
    const condition = [...document.querySelectorAll('.expedition-constraints li')].find(item => item.textContent.includes('Instrumento atende ao objetivo'));
    assert.match(condition.textContent, /^Revisar/);
    await execute('Quero verificar se receber arquivos basta quando o instrumento não responde à pergunta.');
    const invalid = simulateExpedition(id, wrong); assert.equal(invalid.outcome, 'invalid'); assert.equal(invalid.deliveredRecords, 0);
    await click('Ir ao estado final'); assert.equal(currentCount(), '0 / 6'); assertSceneAt(invalid, invalid.completedAtS);
    await click('Interpretar o retorno científico'); assert.ok(screen.getByRole('heading', { name: '0 de 6 registros válidos.' }));
    assert.equal(document.querySelectorAll('.archive-record.is-received').length, 0);
    assert.ok([...document.querySelectorAll('.archive-value')].every(node => node.textContent.startsWith('—')));
  });
});

test('four-person review gates execution and resets after changing a hypothesis or a component', async t => {
  t.after(cleanupView); await mount(); await openDesign('bennu'); await click('Revisar para executar');
  await change(/^Hipótese da equipe/, 'Os seis registros devem caber nas janelas ampliadas.'); await change('Participantes neste dispositivo', '4');
  const launch = () => button('Executar missão científica'); assert.equal(launch().disabled, true);
  for (const [index, label] of CREW_LABELS.entries()) { await click(screen.getByLabelText(label)); assert.equal(launch().disabled, index < 3); }
  await change(/^Hipótese da equipe/, 'A energia ampliada deve sustentar observação e transmissão nos contatos.');
  assert.equal(launch().disabled, true); assert.ok(CREW_LABELS.every(label => !screen.getByLabelText(label).checked));
  await change(/^Hipótese da equipe/, 'Os seis registros devem caber nas janelas ampliadas.');
  assert.equal(launch().disabled, true, 'Returning to a previous hypothesis must not resurrect reviews');
  await change(/^Hipótese da equipe/, 'A energia ampliada deve sustentar observação e transmissão nos contatos.');
  for (const label of CREW_LABELS) await click(screen.getByLabelText(label));
  await click('Rever escolhas'); await change(LABELS.ground, 'short'); await click('Revisar para executar');
  assert.equal(launch().disabled, true); assert.ok(CREW_LABELS.every(label => !screen.getByLabelText(label).checked));
  await click('Rever escolhas'); await change(LABELS.ground, 'extended'); await click('Revisar para executar');
  assert.equal(launch().disabled, true, 'Restoring an earlier configuration must require new review');
  for (const label of CREW_LABELS) await click(screen.getByLabelText(label));
  await click(launch()); await click('Interpretar o retorno científico');
  assert.ok(screen.getByText('4 participantes locais; 4 papéis revisaram a configuração antes de executar.'));
  assert.match(document.body.textContent, /A energia ampliada deve sustentar observação e transmissão nos contatos/);
});

test('saved project and rejected import preserve the result; A/B redesign shares a clock in seconds', async t => {
  t.after(cleanupView); await mount(); await openDesign('bennu');
  const hypothesis = 'Os contatos ampliados devem entregar o conjunto inteiro sem alterar o instrumento.';
  await execute(hypothesis); await click('Ir ao estado final');
  const first = simulateExpedition('bennu', VIABLE.bennu);
  await click('Redesenhar esta missão'); await click('Salvar projeto');
  const saved = JSON.parse(localStorage.getItem('ipe:expedition:bennu'));
  assert.deepEqual(saved.config, VIABLE.bennu); assert.equal(saved.hypothesis, hypothesis);
  await importDesign(JSON.stringify({ ...saved, format: 'ipe-scientific-design-v1' }));
  await waitFor(() => assert.match(document.querySelector('.expedition-notice').textContent, /R18 usa novos dados reais/));
  for (const [key, value] of Object.entries(VIABLE.bennu)) assert.equal(screen.getByLabelText(LABELS[key]).value, value);
  await importDesign(JSON.stringify({ ...saved, config: { ...saved.config, instrument: 'inventado' } }));
  await waitFor(() => assert.notEqual(document.querySelector('.expedition-notice').textContent, 'Projeto salvo neste navegador.'));
  for (const [key, value] of Object.entries(VIABLE.bennu)) assert.equal(screen.getByLabelText(LABELS[key]).value, value);
  await click(/^05\s*·\s*Operação$/); assert.equal(currentCount(), '6 / 6'); assertSceneAt(first, first.completedAtS);
  await click('Redesenhar esta missão'); await change(LABELS.ground, 'short'); await click('Restaurar projeto salvo');
  assert.equal(screen.getByLabelText(LABELS.ground).value, 'extended');
  await click('Revisar para executar'); assert.equal(screen.getByLabelText(/^Hipótese da equipe/).value, hypothesis);
  await click('Rever escolhas'); await change(LABELS.ground, 'short');
  const second = simulateExpedition('bennu', { ...VIABLE.bennu, ground: 'short' });
  await execute('A janela menor pode limitar a recepção mesmo com a mesma nave e a mesma energia.');
  const comparison = document.querySelector('.expedition-compare'); assert.ok(comparison);
  await change(/^Tempo comum/, '4500'); await click('Ver tentativa A'); assertSceneAt(first, 4500, comparison.querySelector('.scene'));
  await click('Ver tentativa B'); assertSceneAt(second, 4500, comparison.querySelector('.scene'));
  assert.equal(screen.getByLabelText(/^Tempo comum/).value, '4500'); assert.notEqual(first.deliveredRecords, second.deliveredRecords);
  const row = within(comparison).getByRole('row', { name: /Registros válidos no final/ });
  assert.deepEqual([...row.querySelectorAll('td')].map(node => node.textContent), [`${first.deliveredRecords} / 6`, `${second.deliveredRecords} / 6`]);
});

test('a new pair of short attempts resets an older long comparison clock and selects the newest attempt', async t => {
  t.after(cleanupView); await mount(); await openDesign('bennu');
  await execute(); await click('Redesenhar esta missão'); await execute();
  await change(/^Tempo comum/, '10000'); await click('Ver tentativa A');
  await click('Redesenhar esta missão'); await change(LABELS.duration, 'short'); await execute();
  // One older full-length attempt still permits inspecting 10,000 seconds.
  await change(/^Tempo comum/, '10000'); await click('Ver tentativa A');
  await click('Redesenhar esta missão'); await execute();
  const comparison = document.querySelector('.expedition-compare');
  const clock = within(comparison).getByLabelText(/^Tempo comum/);
  assert.equal(clock.max, '7200');
  assert.equal(clock.value, '0');
  assert.match(clock.parentElement.textContent, /T\+000:00/);
  assert.equal(within(comparison).getByRole('button', { name: 'Ver tentativa B' }).getAttribute('aria-pressed'), 'true');
  assert.equal(within(comparison).getByRole('button', { name: 'Ver tentativa A' }).getAttribute('aria-pressed'), 'false');
  const current = simulateExpedition('bennu', { ...VIABLE.bennu, duration: 'short' });
  assertSceneAt(current, 0, comparison.querySelector('.scene'));
});

test('a valid replay without trace preserves final science and labels temporal readings unavailable', async t => {
  t.after(cleanupView); await mount();
  const result = simulateMission({ ...DEFAULT_CONFIG }, 'long-contact', { trace: false });
  const replay = await exportReplay(result);
  await click('Abrir caderno de missões'); await click('Importar replay');
  await act(async () => fireEvent.change(document.querySelector('input[type="file"]'), {
    target: { files: [new File([replay], 'sem-amostras.json', { type: 'application/json' })] },
  }));
  await waitFor(() => assert.match(document.body.textContent, /Replay recalculado: o resultado confere/));
  assert.equal(document.querySelector('.result-number').textContent, '6/6');
  await click(/Terrestre/);
  const stage = document.querySelector('.mission-stage');
  assert.equal(stage.querySelector('.small-label').textContent, 'Sem estado temporal');
  assert.match(stage.querySelector('.stage-context').textContent, /Nenhuma amostra temporal disponível/);
  assert.doesNotMatch(stage.querySelector('.stage-context').textContent, /0 Mbit recebidos|Amostra em T\+000:00/);
  assert.match(document.querySelector('.empty-trace').textContent, /não tem estados temporais/);
  assert.equal(document.querySelector('.result-number').textContent, '6/6', 'Missing trace does not erase the verified final result.');
});


test('expedition design choices focus the relevant system while manual inspection remains available', async t => {
  for (const id of ['bennu', 'telescope']) await t.test(id, async sub => {
    sub.after(cleanupView); await mount(); await openDesign(id);
    const craft = () => document.querySelector('.expedition-design .scene');
    await change(LABELS.instrument, id === 'bennu' ? 'spectrometer' : 'camera');
    assert.equal(craft().dataset.inspection, 'instrument');
    assert.match(document.querySelector('.expedition-choice-effect').textContent, /instrumento/);
    await change(LABELS.power, 'compact');
    assert.equal(craft().dataset.inspection, 'energy');
    await click(within(craft()).getByRole('button', { name: 'Nave completa', exact: true }));
    assert.equal(craft().dataset.inspection, 'overview');
    await change(LABELS.ground, 'short');
    assert.equal(craft().dataset.inspection, 'communications');
    assert.match(document.querySelector('.expedition-choice-effect').textContent, /mesma antena e a mesma taxa/);
    assert.equal(document.querySelector('.expedition-readout'), null, 'Changing a component does not execute a mission');
  });
});

test('the beginner can return from a guided Cerrado example to the edited hangar without executing it', async t => {
  t.after(cleanupView); await mount(); await click('Projetar missão do Cerrado');
  await click('Investigar esta escolha'); await click(screen.getByRole('radio', { name: 'B entrega menos' }));
  await click('Executar os dois ensaios');
  await click('Usar A como ponto de partida');
  await waitFor(() => assert.equal(document.activeElement.id, 'workbench-title'));
  assert.match(document.querySelector('.applied-example-notice').textContent, /Escolhas do ensaio copiadas/);
  assert.equal(document.querySelector('.result-banner'), null, 'The example is a draft, not a saved or executed personal attempt');
  assert.equal(screen.getByLabelText('Minha previsão').value, '');
});
