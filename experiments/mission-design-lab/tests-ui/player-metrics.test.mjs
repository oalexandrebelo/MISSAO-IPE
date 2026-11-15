import test, { after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';
import { IDBFactory } from 'fake-indexeddb';
import { installMetricsApi, TEST_SESSION } from './metrics-api-fixture.mjs';
const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'https://mission.test/',pretendToBeVisual:true});
for(const name of ['window','document','navigator','HTMLElement','HTMLInputElement','HTMLTextAreaElement','HTMLSelectElement','HTMLDialogElement','HTMLCanvasElement','Element','Node','MutationObserver','getComputedStyle','localStorage','location'])Object.defineProperty(globalThis,name,{configurable:true,value:dom.window[name],writable:true});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
dom.window.scrollTo=()=>{};dom.window.HTMLElement.prototype.scrollIntoView=()=>{};dom.window.HTMLCanvasElement.prototype.getContext=()=>null;
dom.window.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};dom.window.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
const {render,screen,fireEvent,waitFor,cleanup,act}=await import('@testing-library/react');
const {default:App}=await import('../src/App.tsx');
const {PlayerGateway,PlayerDashboard,usePlayerMetrics}=await import('../src/ui/PlayerMetrics.tsx');
const {metricsKey,writeMetrics,summarizeBrunoAttempt}=await import('../src/metrics/player-metrics.ts');
const {DEFAULT_BRUNO_CONFIG,simulateBrunoMission}=await import('../src/lab/bruno-missions.ts');
const {EXPEDITIONS}=await import('../src/lab/scientific-expeditions.ts');
const click=async name=>act(async()=>fireEvent.click(screen.getByRole('button',{name})));
const change=async(label,value)=>act(async()=>fireEvent.change(screen.getByLabelText(label),{target:{value}}));
afterEach(async()=>act(async()=>cleanup()));after(()=>dom.window.close());

async function mount({resume=true,...options}={}) {
  localStorage.clear();
  globalThis.indexedDB=new IDBFactory();
  const api=installMetricsApi(options);
  await act(async()=>render(React.createElement(App)));
  await click('Iniciar jogo');
  if(resume && api.getSession()) await click('Retomar jogo');
  return api;
}

async function chooseMission(mission) {
  await act(async()=>fireEvent.click(screen.getByRole('radio',{name:mission})));
  await click('Continuar');
}

async function completeEntry(mission) {
  await change('Seu nome','Teste participante');
  await click('Continuar');
  await change('Seu e-mail','participant@example.invalid');
  await click('Continuar');
  await chooseMission(mission);
}

test('sequential entry preserves answers, starts Cerrado even when fullscreen is declined, and stores the own attempt',async()=>{
 const api=await mount({registered:false});
 const originalFullscreen=document.documentElement.requestFullscreen;
 let calls=0;
 document.documentElement.requestFullscreen=()=>{
   calls++;
   assert.equal(api.getSession(),null);
   return Promise.reject(new Error('Fullscreen declined in fixture'));
 };
 try {
   assert.ok(await screen.findByRole('heading',{name:'Como podemos chamar você?'}));
   assert.equal(screen.queryByLabelText('Seu e-mail'),null);
   await change('Seu nome','Teste participante');
   await click('Continuar');
   assert.equal(document.activeElement,screen.getByRole('heading',{name:'Qual é o seu e-mail?'}));
   await change('Seu e-mail','participant@example.invalid');
   await click('Voltar');
   assert.equal(screen.getByLabelText('Seu nome').value,'Teste participante');
   await click('Continuar');
   assert.equal(screen.getByLabelText('Seu e-mail').value,'participant@example.invalid');
   await click('Continuar');
   await chooseMission('Cerrado');
   await click('Voltar');
   assert.equal(screen.getByRole('radio',{name:'Cerrado'}).checked,true);
   await click('Continuar');
   assert.equal(api.getSession(),null);
   assert.equal(calls,0);
   await click('Play');
   assert.equal(calls,1);
   await screen.findByRole('heading',{name:'Monte sua missão.'});
 } finally {
   if(originalFullscreen) document.documentElement.requestFullscreen=originalFullscreen;
   else delete document.documentElement.requestFullscreen;
 }
 await change('Minha previsão','none');await change('Por quê?','Os recursos devem permitir transmitir as observações.');await click('Registrar e executar');
 await waitFor(()=>assert.equal(document.querySelector('.result-number')?.textContent,'6/6'));
 const resultScore = document.querySelector('.player-score')?.textContent;
 assert.match(resultScore ?? '',/Pontuação da tentativa · \d+ de 100 pontos/);
 assert.match(resultScore ?? '',/Ciência válida: 60 de 60/);
 await click('Meu progresso');
 assert.ok(screen.getByRole('heading',{name:'Cada tentativa deixa uma evidência.'}));
 assert.match(document.querySelector('.player-attempt-list').textContent,/6 pacotes completos · 6\/6 registros válidos/);
 assert.equal(document.querySelector('.player-attempt-list .player-score')?.textContent,resultScore);
 await waitFor(()=>assert.equal(api.received.filter(item=>item.kind==='attempt').length,1));
 const uploaded=api.received.find(item=>item.kind==='attempt');
 assert.equal(uploaded.payload.status,'completed');assert.equal(uploaded.payload.scenarioId,'long-contact');assert.equal(Object.hasOwn(uploaded,'summary'),false);
 assert.equal(JSON.stringify(api.received).includes('participant@example.invalid'),false);
 assert.equal(localStorage.getItem(metricsKey(TEST_SESSION.sessionId)).includes('participant@example.invalid'),false);
});

test('Bennu and Webb each open their mission directly when fullscreen is unavailable',async()=>{
 for(const [mission,key] of [['Bennu','bennu'],['Webb','telescope']]) {
   const api=await mount({registered:false});
   await completeEntry(mission);
   assert.equal(api.getSession(),null);
   await click('Play');
   assert.ok(await screen.findByRole('heading',{name:EXPEDITIONS[key].title}));
   assert.ok(screen.getByRole('button',{name:'Definir esta missão científica'}));
   assert.equal(screen.queryByRole('button',{name:'Entrar em tela cheia'}),null);
   await act(async()=>cleanup());
 }
});

test('a restored session requests fullscreen only after Retomar and follows browser fullscreen changes',async()=>{
 await mount({resume:false});
 const root=document.documentElement;
 let current=null;
 let requests=0;
 const update=element=>{
   current=element;
   document.dispatchEvent(new dom.window.Event('fullscreenchange'));
 };
 Object.defineProperty(document,'fullscreenElement',{configurable:true,get:()=>current});
 root.requestFullscreen=async()=>{requests++;update(root);};
 document.exitFullscreen=async()=>update(null);
 try {
   assert.ok(screen.getByRole('button',{name:'Retomar jogo'}));
   assert.equal(screen.queryByRole('button',{name:'Meu progresso'}),null);
   assert.equal(requests,0);
   await click('Retomar jogo');
   assert.equal(requests,1);
   assert.ok(screen.getByRole('button',{name:'Sair da tela cheia'}));
   await click('Sair da tela cheia');
   assert.ok(screen.getByRole('button',{name:'Entrar em tela cheia'}));
   await click('Entrar em tela cheia');
   assert.equal(requests,2);
   await act(async()=>update(null));
   assert.ok(screen.getByRole('button',{name:'Entrar em tela cheia'}));
 } finally {
   delete root.requestFullscreen;
   delete document.exitFullscreen;
   delete document.fullscreenElement;
 }
});

test('network failure does not silently create a player or promise that metrics were saved',async()=>{
 await mount({registered:false,unavailable:true});
 assert.ok(await screen.findByRole('alert'));
 assert.equal(screen.queryByRole('button',{name:'Começar a missão'}),null);
 await completeEntry('Cerrado');
 await click('Play');
 assert.match(screen.getByRole('alert').textContent,/Não foi possível conectar/);
 assert.equal(screen.queryByRole('button',{name:'Meu progresso'}),null);
});

test('the exit confirmation can be cancelled with Escape and gives focus back to the exit button', async () => {
  await mount();
  await click('Meu progresso');
  const trigger = screen.getByRole('button',{name:'Encerrar participação neste aparelho'});
  trigger.focus();
  await click('Encerrar participação neste aparelho');
  const dialog = screen.getByRole('dialog',{name:'Encerrar participação?'});
  assert.ok(screen.getByRole('button',{name:'Continuar jogando'}));
  screen.getByRole('button',{name:'Continuar jogando'}).focus();
  await act(async()=>fireEvent(dialog,new dom.window.Event('cancel',{cancelable:true})));
  assert.equal(screen.queryByRole('dialog',{name:'Encerrar participação?'}),null);
  assert.equal(document.activeElement,trigger);
  await click('Encerrar participação neste aparelho');
  await click('Confirmar encerramento');
  assert.equal(document.activeElement,screen.getByLabelText('Seu nome'));
  assert.equal(screen.getByLabelText('Seu nome').value,'');
});

test('failed upload remains pending and retries the same UUID without result/identity payload',async()=>{
 localStorage.clear(); let fail=true;let sent=[];
 globalThis.fetch=async(url,options={})=>{if(!options.body)return Response.json({session:TEST_SESSION});const body=JSON.parse(options.body);sent.push(body);if(fail)return new Response('{}',{status:503});return Response.json({acceptedIds:body.events.map(item=>item.id),rejected:[]});};
 function Probe(){const metrics=usePlayerMetrics();return React.createElement('div',null,React.createElement('button',{onClick:()=>metrics.track('decision','bennu',{key:'power',from:'compact',to:'extended'})},'Change'),React.createElement('button',{onClick:metrics.retry},'Retry'),React.createElement('span',null,JSON.stringify(metrics.entries.map(item=>item.sync))),React.createElement('p',null,metrics.issue));}
 await act(async()=>render(React.createElement(PlayerGateway,null,()=>React.createElement(Probe))));await click('Retomar jogo');await screen.findByRole('button',{name:'Change'});await click('Change');
 await waitFor(()=>assert.match(document.body.textContent,/pending/));
 assert.equal(sent.length,1);assert.equal(sent[0].sessionId,TEST_SESSION.sessionId);const id=sent[0].events[0].id;fail=false;await click('Retry');
 await waitFor(()=>assert.match(document.body.textContent,/synced/));assert.equal(sent[1].events[0].id,id);
 const stored=JSON.parse(localStorage.getItem(metricsKey(TEST_SESSION.sessionId)));assert.equal(stored.entries.length,1);assert.equal(stored.entries[0].sync,'synced');
});

test('expired or replaced owner can leave the old UI without reassigning pending events or clearing another cookie',async()=>{
 for(const status of [401,409]){
  localStorage.clear();const posted=[];
  globalThis.fetch=async(url,options={})=>{if(!options.body)return Response.json({session:TEST_SESSION});const body=JSON.parse(options.body);posted.push(body);return new Response('{}',{status});};
  function Probe(){const metrics=usePlayerMetrics();return React.createElement('div',null,React.createElement('button',{onClick:()=>metrics.track('inspection','bennu',{target:'energy'})},'Inspect'),React.createElement('button',{onClick:()=>void metrics.logout()},'Leave'));}
  await act(async()=>render(React.createElement(PlayerGateway,null,()=>React.createElement(Probe))));await click('Retomar jogo');await screen.findByRole('button',{name:'Inspect'});await click('Inspect');await click('Leave');
  assert.ok(await screen.findByRole('heading',{name:'Como podemos chamar você?'}));
  assert.equal(posted.find(body=>body.action==='events').sessionId,TEST_SESSION.sessionId);
  assert.equal(posted.find(body=>body.action==='logout').sessionId,TEST_SESSION.sessionId);
  assert.equal(JSON.parse(localStorage.getItem(metricsKey(TEST_SESSION.sessionId))).entries[0].sync,'pending');
  await act(async()=>cleanup());
 }
});

test('progress summarizes all seven missions and preserves first/latest Bruno scores without inventing assessments',async()=>{
 localStorage.clear(); installMetricsApi();
 const entries=[];
 const scores=new Map();
 for(const mission of ['iss','moon','mars']) {
   const results=[DEFAULT_BRUNO_CONFIG,{...DEFAULT_BRUNO_CONFIG,launcher:'heavy',energy:'extended',protection:'reinforced',navigation:'deep-space'}].map(config=>simulateBrunoMission(mission,config));
   scores.set(mission,results.map(result=>result.score.total));
   for(const result of results) entries.push({event:{id:crypto.randomUUID(),kind:'attempt',mission,at:new Date(Date.UTC(2026,0,1,0,entries.length)).toISOString(),payload:{attemptId:crypto.randomUUID(),status:'completed',config:result.config}},summary:summarizeBrunoAttempt(result),sync:'synced'});
 }
 writeMetrics(localStorage,TEST_SESSION.sessionId,entries);
 await act(async()=>render(React.createElement(PlayerGateway,null,()=>React.createElement(PlayerDashboard,{onBack(){}}))));
 await click('Retomar jogo');
 const cards=[...document.querySelectorAll('.player-mission-progress > article')];
 assert.equal(cards.length,7);
 for(const name of ['Cerrado','Bennu','Webb','ISS','Lua','Marte','Europa']) assert.ok(cards.some(card=>card.querySelector('h2').textContent===name));
 for(const [mission,name] of [['iss','ISS'],['moon','Lua'],['mars','Marte']]) {
   const card=cards.find(card=>card.querySelector('h2').textContent===name);
   const [first,last]=scores.get(mission);
   assert.ok(card.textContent.includes(`Primeira pontuação: ${first} de 100. Última pontuação: ${last} de 100.`));
   assert.match(card.textContent,/Avaliação de aprendizagem ainda não disponível nesta missão/);
   assert.doesNotMatch(card.textContent,/0 corretas|0 \/ 0/);
 }
 assert.equal(document.querySelector('.player-stat-grid article:nth-child(3) strong').textContent,'Sem respostas');
});
