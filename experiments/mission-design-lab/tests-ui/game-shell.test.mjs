import test, { after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://mission.test', pretendToBeVisual:true });
for(const key of ['window','document','navigator','HTMLElement','HTMLCanvasElement','Element','Node','MutationObserver','getComputedStyle']) Object.defineProperty(globalThis,key,{configurable:true,value:dom.window[key]});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
dom.window.HTMLCanvasElement.prototype.getContext=()=>null;
const {render,screen,fireEvent,act,cleanup}=await import('@testing-library/react');
const {GameTitleScreen,GameLobby}=await import('../src/ui/GameShell.tsx');
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
test('six mission choices change the briefing without launching; Play dispatches only the selected mission',async()=>{
 const chosen=[];await act(async()=>render(React.createElement(GameLobby,{onChoose:id=>chosen.push(id),onKnowledge:()=>{},attempts:2,bestScore:87})));
 const pairs=[['ISS','iss'],['LUA','moon'],['MARTE','mars'],['CERRADO','cerrado'],['BENNU','bennu'],['WEBB','telescope']];
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
