import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://mission.test/' });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLCanvasElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle']) {
  Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name], writable: true });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.HTMLCanvasElement.prototype.getContext = () => null;
dom.window.matchMedia = () => ({ matches: false });
const { render, cleanup, fireEvent, within } = await import('@testing-library/react');
const { BrunoCampaign } = await import('../src/ui/BrunoCampaign.tsx');
after(() => dom.window.close());

function openHangar(id) {
  const page = render(React.createElement(BrunoCampaign, { id, onBack() {} }));
  fireEvent.click(page.getByRole('button', { name: 'Abrir hangar' }));
  return page;
}

test('a verificação encaminha a pendência de massa, prazo e proteção ao sistema certo', t => {
  t.after(cleanup);
  const page = openHangar('mars');
  const checklist = within(page.getByRole('region', { name: 'Verificação antes de lançar' }));
  assert.ok(checklist.getByText(/Se executar este plano/));
  assert.match(checklist.getByText(/montagem pesa/).textContent, /450 kg/);
  assert.equal(checklist.queryByRole('button', { name: 'Rever proteção' }), null, 'o motor ainda não avaliou a chegada');
  fireEvent.click(checklist.getByRole('button', { name: 'Rever lançador' }));
  assert.equal(document.activeElement, page.getByRole('button', { name: 'Lançador', pressed: true }));
  fireEvent.click(page.getByRole('radio', { name: /Maior capacidade/ }));
  assert.equal(checklist.queryByText(/montagem pesa/), null);
  fireEvent.click(page.getByRole('button', { name: 'Propulsão', exact: true }));
  fireEvent.click(page.getByRole('radio', { name: /Elétrica/ }));
  assert.match(checklist.getByText(/ultrapassou o limite/).textContent, /232 dias/);
  fireEvent.click(checklist.getByRole('button', { name: 'Rever propulsão' }));
  assert.equal(document.activeElement, page.getByRole('button', { name: 'Propulsão', pressed: true }));
  fireEvent.click(checklist.getByRole('button', { name: 'Rever proteção' }));
  assert.equal(document.activeElement, page.getByRole('button', { name: 'Proteção', pressed: true }));
  assert.equal(page.getByRole('button', { name: 'Simular lançamento' }).disabled, false, 'a previsão permite testar as consequências');
});

test('a escolha na montagem só move o foco à nave quando o jogador pede a inspeção', t => {
  t.after(cleanup);
  const scrolls = [];
  const prototype = dom.window.HTMLElement.prototype;
  const previous = prototype.scrollIntoView;
  prototype.scrollIntoView = function () { scrolls.push(this); };
  t.after(() => { if (previous) prototype.scrollIntoView = previous; else delete prototype.scrollIntoView; });
  const page = openHangar('iss');
  const craft = page.container.querySelector('[data-bruno-craft]');
  fireEvent.click(page.getByRole('button', { name: 'Proteção' }));
  const choice = page.getByRole('radio', { name: /Reforçada/ });
  choice.focus();
  fireEvent.click(choice);
  assert.equal(document.activeElement, choice);
  assert.deepEqual(scrolls, []);
  fireEvent.click(page.getByRole('button', { name: 'Inspecionar referência NASA' }));
  fireEvent.click(page.getByRole('button', { name: 'Ver esta escolha na nave' }));
  assert.equal(document.activeElement, craft);
  assert.deepEqual(scrolls, [craft]);
  assert.ok(within(craft).getByText('Sua nave · plano B'));
  assert.equal(craft.dataset.protection, 'reinforced');
});

test('a régua só revela a transferência interrompida ao chegar a ela e marca as operações sem execução', t => {
  t.after(cleanup);
  const page = openHangar('mars');
  fireEvent.click(page.getByRole('radio', { name: /Maior capacidade/ }));
  fireEvent.click(page.getByRole('button', { name: 'Simular lançamento' }));
  fireEvent.click(page.getByRole('button', { name: 'Pausar operação' }));
  const phases = page.getByRole('list', { name: 'Etapas da missão' });
  const getStep = name => within(phases).getByText(name, { exact: true }).closest('li');
  assert.equal(getStep('Lançamento').getAttribute('aria-current'), 'step');
  assert.match(getStep('Transferência').textContent, /Pendente/);
  assert.equal(page.queryByText('Chegada interrompida'), null);
  fireEvent.click(page.getByRole('button', { name: 'Próximo evento' }));
  assert.equal(getStep('Transferência').getAttribute('aria-current'), 'step');
  assert.match(getStep('Transferência').textContent, /Bloqueada/);
  assert.match(getStep('Lançamento').textContent, /Concluída/);
  for (const stage of ['Coleta', 'Recepção']) assert.match(getStep(stage).textContent, /Não executada/);
  assert.equal(page.container.querySelector('[data-bruno-craft]').dataset.arrived, 'false');
  assert.match(page.getByText(/módulo vulnerável/).textContent, /entrada atmosférica/);
  fireEvent.click(page.getByRole('button', { name: 'Ir ao resultado' }));
  assert.equal(getStep('Relatório').getAttribute('aria-current'), 'step');
  assert.match(getStep('Transferência').textContent, /Bloqueada/);
  assert.match(getStep('Coleta').textContent, /Não executada/);
});

test('coleta parcial não recebe selo de conclusão nem antecipa os dados no solo', t => {
  t.after(cleanup);
  const page = openHangar('moon');
  fireEvent.click(page.getByRole('button', { name: 'Simular lançamento' }));
  fireEvent.click(page.getByRole('button', { name: 'Pausar operação' }));
  fireEvent.click(page.getByRole('button', { name: 'Próximo evento' }));
  fireEvent.click(page.getByRole('button', { name: 'Próximo evento' }));
  const phases = within(page.getByRole('list', { name: 'Etapas da missão' }));
  const collection = phases.getByText('Coleta', { exact: true }).closest('li');
  const reception = phases.getByText('Recepção', { exact: true }).closest('li');
  assert.equal(collection.getAttribute('aria-current'), 'step');
  assert.match(collection.textContent, /Com limite/);
  assert.match(reception.textContent, /Pendente/);
  assert.equal(page.container.querySelector('[data-bruno-craft]').dataset.transmitting, 'false');
  assert.equal(page.queryByText(/recebidos · .* válidos para a pergunta/), null);
  fireEvent.click(page.getByRole('button', { name: 'Próximo evento' }));
  assert.equal(reception.getAttribute('aria-current'), 'step');
  assert.match(reception.textContent, /Com limite/);
  assert.match(page.getByText(/recebidos · .* válidos para a pergunta/).textContent, /1 recebidos · 1 válidos/);
  assert.equal(page.container.querySelector('[data-bruno-craft]').dataset.transmitting, 'true');
});

test('um bloqueio em T+0 mantém as etapas de voo posteriores como não executadas', t => {
  t.after(cleanup);
  const page = openHangar('mars');
  const phases = within(page.getByRole('list', { name: 'Etapas da missão' }));
  const launchStep = phases.getByText('Lançamento', { exact: true }).closest('li');
  assert.match(launchStep.textContent, /Pendente/);
  fireEvent.click(page.getByRole('button', { name: 'Simular lançamento' }));
  assert.ok(page.getByRole('heading', { name: 'Lançamento bloqueado' }));
  assert.match(launchStep.textContent, /Bloqueada/);
  for (const stage of ['Transferência', 'Coleta', 'Recepção']) {
    assert.match(phases.getByText(stage, { exact: true }).closest('li').textContent, /Não executada/);
  }
});
