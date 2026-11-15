import test, { after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';
import { IDBFactory } from 'fake-indexeddb';
import { installInventoryApi } from './metrics-api-fixture.mjs';
const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://mission.test', pretendToBeVisual:true });
for(const key of ['window','document','navigator','HTMLElement','HTMLCanvasElement','Element','Node','MutationObserver','getComputedStyle','localStorage']) Object.defineProperty(globalThis,key,{configurable:true,value:dom.window[key]});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
dom.window.HTMLCanvasElement.prototype.getContext=()=>null;
dom.window.matchMedia=()=>({matches:false});
dom.window.scrollTo=()=>{};
const {render,screen,fireEvent,act,cleanup,within}=await import('@testing-library/react');
const {GameTitleScreen,GameLobby}=await import('../src/ui/GameShell.tsx');
const { default: App } = await import('../src/App.tsx');
afterEach(async()=>act(async()=>cleanup()));after(()=>dom.window.close());
test('title starts the game only after a player action even when fullscreen is declined',async()=>{
 let asked=0;document.documentElement.requestFullscreen=()=>{asked++;return Promise.reject(new Error('Declined'));};
 await act(async()=>render(React.createElement(GameTitleScreen,null,React.createElement('p',null,'Entrada do jogador'))));
 assert.equal(screen.queryByText('Entrada do jogador'),null);
 assert.equal(document.activeElement,screen.getByRole('button',{name:'Iniciar jogo'}));
 assert.ok(document.querySelector('.game-title-orbit[inert]'));
 await act(async()=>fireEvent.click(screen.getByRole('button',{name:'Iniciar jogo'})));
 assert.equal(asked,1);assert.ok(screen.getByText('Entrada do jogador'));
});
test('seven mission choices change the briefing without launching; Play dispatches only the selected mission',async()=>{
 const chosen=[];await act(async()=>render(React.createElement(GameLobby,{onChoose:id=>chosen.push(id),onKnowledge:()=>{},attempts:2,bestScore:87})));
 const pairs=[['ISS','iss'],['LUA','moon'],['MARTE','mars'],['EUROPA','europa'],['CERRADO','cerrado'],['BENNU','bennu'],['WEBB','telescope']];
 for(const [label,id] of pairs){
  const picker=screen.getByRole('group',{name:'Selecionar missão'});
  const button=[...picker.querySelectorAll('button')].find(e=>e.textContent.includes(label));
  await act(async()=>fireEvent.click(button));assert.equal(button.getAttribute('aria-pressed'),'true');
  assert.equal(chosen.length,pairs.findIndex(p=>p[1]===id));
  await act(async()=>fireEvent.click(screen.getByRole('button',{name:`Jogar ${label}`})));
  assert.equal(chosen.at(-1),id);
 }
 assert.deepEqual(chosen,pairs.map(p=>p[1]));
});

test('neighbor controls wrap all destinations, and keyboard selection keeps focus in the picker', async () => {
  const launched = [];
  await act(async () => render(React.createElement(GameLobby, { onChoose: id => launched.push(id), onKnowledge() {}, attempts: 0, bestScore: 0 })));
  const previous = screen.getByRole('button', { name: 'Destino anterior · WEBB' });
  previous.focus();
  await act(async () => fireEvent.click(previous));
  assert.equal(document.activeElement, previous);
  assert.ok(screen.getByRole('heading', { name: 'WEBB' }));
  assert.ok(screen.getByRole('button', { name: 'Próximo destino · ISS' }));
  const picker = within(screen.getByRole('group', { name: 'Selecionar missão' }));
  const webb = picker.getByRole('button', { name: 'WEBB' });
  webb.focus();
  await act(async () => fireEvent.keyDown(webb, { key: 'ArrowRight' }));
  const iss = picker.getByRole('button', { name: 'ISS' });
  assert.equal(document.activeElement, iss);
  assert.equal(iss.getAttribute('aria-pressed'), 'true');
  assert.deepEqual(launched, []);
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Jogar ISS' })));
  assert.deepEqual(launched, ['iss']);
});

test('the lobby pauses its stage without changing the active mission or the other actions', async () => {
  const actions = [];
  const view = render(React.createElement(GameLobby, { onChoose() {}, onShop: () => actions.push('shop'), onKnowledge: () => actions.push('knowledge'), attempts: 1, bestScore: 92 }));
  const stage = view.container.querySelector('.game-lobby');
  assert.equal(stage.dataset.motionPaused, 'false');
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Pausar movimento' })));
  assert.equal(stage.dataset.motionPaused, 'true');
  assert.ok(screen.getByRole('button', { name: 'Jogar ISS' }));
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Retomar movimento' })));
  assert.equal(stage.dataset.motionPaused, 'false');
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Loja e inventário' })));
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Abrir acervo e guia de ciência' })));
  assert.deepEqual(actions, ['shop', 'knowledge']);
});

test('reduced motion starts static and keeps all seven destinations available', async t => {
  t.mock.method(dom.window, 'matchMedia', () => ({ matches: true }));
  const view = render(React.createElement(GameLobby, { onChoose() {}, onKnowledge() {}, attempts: 0, bestScore: 0 }));
  assert.equal(view.container.querySelector('.game-lobby').dataset.motionPaused, 'true');
  assert.equal(screen.queryByRole('button', { name: 'Pausar movimento' }), null);
  assert.equal(within(screen.getByRole('group', { name: 'Selecionar missão' })).getAllByRole('button').length, 7);
});

test('returning to the lobby keeps Webb selected after visiting progress, the shop and the archive', async t => {
  const fetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = fetch; });
  globalThis.indexedDB = new IDBFactory();
  await installInventoryApi();
  const click = name => act(async () => fireEvent.click(screen.getByRole('button', { name, exact: true })));
  await act(async () => render(React.createElement(App)));
  await click('Iniciar jogo');
  await click('Retomar jogo');
  await click('WEBB');

  for (const [destination, back] of [
    ['Meu progresso', 'Voltar às missões'],
    ['Loja e inventário', 'Voltar às missões'],
    ['Abrir acervo e guia de ciência', 'MISSÃO IPÊ, observatório'],
  ]) {
    await click(destination);
    assert.equal(screen.queryByRole('group', { name: 'Selecionar missão' }), null);
    await click(back);
    const picker = within(screen.getByRole('group', { name: 'Selecionar missão' }));
    assert.equal(picker.getByRole('button', { name: 'WEBB' }).getAttribute('aria-pressed'), 'true', destination);
    assert.ok(screen.getByRole('button', { name: 'Jogar WEBB' }));
  }
});
