import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://mission.test/', pretendToBeVisual: true });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLCanvasElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle']) {
  Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name], writable: true });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.HTMLCanvasElement.prototype.getContext = () => null;
const { render, cleanup, fireEvent } = await import('@testing-library/react');
const { BrunoCampaign } = await import('../src/ui/BrunoCampaign.tsx');
after(() => dom.window.close());

test('briefing da ISS percorre a tentativa e redesenha um resultado em resposta à escolha', t => {
  t.after(cleanup);
  const runs = [], choices = [];
  dom.window.matchMedia = () => ({ matches: false });
  const screen = render(React.createElement(BrunoCampaign, {
    id: 'iss', onBack() {},
    onComplete(result) { runs.push(result); },
    onDecision(id, config, decision) { choices.push({ id, config, decision }); },
  }));
  assert.ok(screen.getByRole('heading', { name: 'Pulso Orbital' }));
  fireEvent.click(screen.getByRole('button', { name: 'Abrir hangar' }));
  assert.equal(document.activeElement, screen.getByRole('heading', { name: 'Hangar de missão' }));
  assert.ok(screen.getByText('Esquema da montagem'));
  fireEvent.click(screen.getByRole('button', { name: 'Simular lançamento' }));
  fireEvent.click(screen.getByRole('button', { name: 'Ir ao resultado' }));
  assert.equal(runs.length, 1);
  assert.equal(runs[0].deliveredRecords, 0);
  assert.match(screen.getByRole('heading', { level: 1 }).textContent, /Missão incompleta/);
  assert.match(screen.getByText(/A vibração do transporte/).textContent, /calibração/);
  fireEvent.click(screen.getByRole('button', { name: 'Redesenhar nave' }));
  fireEvent.click(screen.getByRole('button', { name: 'Proteção' }));
  fireEvent.click(screen.getByRole('radio', { name: /Reforçada/ }));
  assert.deepEqual(choices.map(choice => [choice.id, choice.decision]), [['iss', { key: 'protection', from: 'light', to: 'reinforced' }]]);
  assert.equal(screen.container.querySelector('[data-bruno-craft]')?.getAttribute('data-protection'), 'reinforced');
  fireEvent.click(screen.getByRole('button', { name: 'Simular lançamento' }));
  fireEvent.click(screen.getByRole('button', { name: 'Ir ao resultado' }));
  assert.equal(runs.length, 2);
  assert.equal(runs[1].deliveredRecords, 6);
  assert.ok(screen.getByRole('heading', { name: 'Missão concluída' }));
});

test('Marte bloqueia o lançamento incompatível; Lua pula a espera com movimento reduzido', t => {
  t.after(cleanup);
  dom.window.matchMedia = () => ({ matches: true });
  const runs = [];
  const renderMission = id => render(React.createElement(BrunoCampaign, {
    id, onBack() {}, onComplete: result => runs.push(result),
  }));
  for (const id of ['mars', 'moon']) {
    const screen = renderMission(id);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir hangar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Simular lançamento' }));
    assert.equal(screen.queryByRole('button', { name: 'Ir ao resultado' }), null);
    assert.ok(screen.getByRole('heading', { name: id === 'mars' ? 'Lançamento bloqueado' : 'Missão incompleta' }));
    screen.unmount();
  }
  assert.deepEqual(runs.map(result => result.missionId), ['mars', 'moon']);
  assert.equal(runs[0].simulatedSeconds, 0);
  assert.ok(runs[1].simulatedSeconds > 0);
});

test('A/B troca a nave sem modificar B; rascunho retoma por participação sem pontuar novamente', t => {
  t.after(cleanup);
  dom.window.localStorage.clear();
  dom.window.matchMedia = () => ({ matches: true });
  const runs = [], inspections = [], roles = [];
  const props = { id: 'iss', sessionId: 'player-a', onBack() {}, onComplete: r => runs.push(r), onInspect: () => inspections.push(true), onRoleReview: r => roles.push(r) };
  let screen = render(React.createElement(BrunoCampaign, props));
  fireEvent.click(screen.getByRole('button', { name: 'Abrir hangar' }));
  fireEvent.click(screen.getByRole('button', { name: 'Proteção' }));
  fireEvent.click(screen.getByRole('radio', { name: /Reforçada/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Revisar voo e comparar A/B' }));
  assert.equal(inspections.length, 1);
  fireEvent.click(screen.getByRole('button', { name: 'Ver A no 3D' }));
  assert.equal(screen.container.querySelector('[data-bruno-craft]').getAttribute('data-protection'), 'light');
  assert.equal(screen.getByRole('radio', { name: /Reforçada/ }).checked, true);
  fireEvent.click(screen.getByRole('button', { name: 'Revisar voo e comparar A/B' }));
  assert.equal(screen.container.querySelector('[data-bruno-craft]').getAttribute('data-protection'), 'reinforced');
  fireEvent.click(screen.getByRole('button', { name: 'Simular lançamento' }));
  fireEvent.click(screen.getByRole('button', { name: 'Marcar como revisado: Segmento terrestre' }));
  assert.deepEqual(roles, [['ground']]);
  assert.equal(runs.length, 1);
  screen.unmount();
  screen = render(React.createElement(BrunoCampaign, props));
  assert.ok(screen.getByRole('heading', { name: 'Missão concluída' }));
  assert.equal(runs.length, 1, 'retomar relatório não cria tentativa');
  screen.unmount();
  screen = render(React.createElement(BrunoCampaign, { ...props, sessionId: 'player-b' }));
  assert.ok(screen.getByRole('button', { name: 'Abrir hangar' }));
});

test('operação percorre eventos reais, permite pausa e registra saída como cancelamento', t => {
  t.after(cleanup);
  dom.window.matchMedia = () => ({ matches: false });
  const runs = [], cancelled = [];
  const screen = render(React.createElement(BrunoCampaign, { id: 'moon', onBack() {}, onComplete: r => runs.push(r), onCancel: (id, config) => cancelled.push({ id, config }) }));
  fireEvent.click(screen.getByRole('button', { name: 'Abrir hangar' }));
  fireEvent.click(screen.getByRole('button', { name: 'Simular lançamento' }));
  fireEvent.click(screen.getByRole('button', { name: 'Pausar operação' }));
  assert.ok(screen.getByRole('button', { name: 'Continuar operação', pressed: true }));
  fireEvent.click(screen.getByRole('button', { name: 'Próximo evento' }));
  assert.equal(screen.container.querySelector('[data-bruno-craft]').getAttribute('data-flight-phase'), 'transfer');
  fireEvent.click(screen.getByRole('button', { name: 'Próximo evento' }));
  assert.equal(screen.container.querySelector('[data-bruno-craft]').getAttribute('data-flight-phase'), 'acquisition');
  screen.unmount();
  assert.equal(runs.length, 0);
  assert.equal(cancelled.length, 1);
  assert.equal(cancelled[0].id, 'moon');
});
