import {test} from 'node:test';
import assert from 'node:assert/strict';
import {summarize,attemptsCsv,csvCell} from '../dashboard/metrics.mjs';
const answer=(id,correct,at,sessionId='s1')=>({id,sessionId,receivedAt:at,kind:'assessment',mission:'bennu',payload:{question:'prediction',questionVersion:1},result:{correct}});
test('first answer, revisions and separate participants do not inflate accuracy',()=>{const events=[answer('1',false,'2026-01-01'),answer('2',true,'2026-01-02'),answer('3',true,'2026-01-03','s2')];const s=summarize([...events,events[0]]);assert.equal(s.answered,2);assert.equal(s.firstCorrect,1);assert.equal(s.latestCorrect,2);assert.equal(s.revisions,1);assert.equal(s.corrected,1);});
test('same-time batch preserves received order instead of random UUID order',()=>{const s=summarize([{...answer('z',false,'2026-01-01'),batchId:'b',receivedOrder:0},{...answer('a',true,'2026-01-01'),batchId:'b',receivedOrder:1}]);assert.equal(s.firstCorrect,0);assert.equal(s.latestCorrect,1);});
test('attempt identity preserves repeat plays and ignores replay duplicates and MISSION_END',()=>{const a={id:'a',sessionId:'s',receivedAt:'2026-01-01',mission:'cerrado',kind:'attempt',payload:{attemptId:'one',status:'completed'},result:{outcome:'failure',diagnostics:[{code:'POWER',severity:'error'},{code:'POWER',severity:'error'},{code:'MISSION_END',severity:'error'}]}};const s=summarize([a,a,{...a,id:'b',payload:{...a.payload,attemptId:'two'}}]);assert.equal(s.calculated.length,2);assert.equal(s.causes.length,1);assert.equal(s.causes[0].count,2);assert.equal(s.success,0);});
test('cancelled and technical executions are separate from engineering attempts',()=>{const s=summarize([{id:'a',sessionId:'s',receivedAt:'x',kind:'attempt',payload:{attemptId:'1',status:'cancelled'}},{id:'b',sessionId:'s',receivedAt:'x',kind:'attempt',payload:{attemptId:'2',status:'error'}}]);assert.equal(s.calculated.length,0);assert.equal(s.cancelled,1);assert.equal(s.technicalErrors,1);assert.equal(s.answered,0);});
test('CSV protects spreadsheet formulas and excludes email by default',()=>{assert.equal(csvCell('=HYPERLINK("x")'),'"\'=HYPERLINK(""x"")"');const e={id:'a',sessionId:'s',receivedAt:'x',mission:'bennu',kind:'attempt',payload:{attemptId:'1',status:'error'}};const csv=attemptsCsv([e],[{sessionId:'s',name:'=cmd',email:'private@example.invalid'}]);assert.ok(!csv.includes('private@example.invalid'));assert.ok(csv.includes("'=cmd"));assert.ok(attemptsCsv([e],[{sessionId:'s',email:'private@example.invalid'}],{includeEmail:true}).includes('private@example.invalid'));});

test('mission filter exposes all six selectable missions in the actual dashboard HTML', async () => {
  const {readFile} = await import('node:fs/promises');
  const {createRequire} = await import('node:module');
  const require = createRequire(new URL('../experiments/mission-design-lab/package.json', import.meta.url));
  const {JSDOM} = require('jsdom');
  const html = await readFile(new URL('../dashboard/index.html', import.meta.url), 'utf8');
  const dom = new JSDOM(html);
  const select = dom.window.document.getElementById('mission');
  assert.deepEqual([...select.options].map(option => option.value), ['all', 'iss', 'moon', 'mars', 'cerrado', 'bennu', 'telescope']);
  for (const mission of ['iss', 'moon', 'mars', 'cerrado', 'bennu', 'telescope']) { select.value = mission; assert.equal(select.selectedOptions[0].value, mission); }
  dom.window.close();
});

test('dashboard keyboard focus and sign-out survive an in-flight private refresh', async () => {
  const {readFile} = await import('node:fs/promises');
  const {createRequire} = await import('node:module');
  const {setImmediate} = await import('node:timers/promises');
  const require = createRequire(new URL('../experiments/mission-design-lab/package.json', import.meta.url));
  const {JSDOM} = require('jsdom');
  const html = await readFile(new URL('../dashboard/index.html', import.meta.url), 'utf8');
  const {window} = new JSDOM(html);
  const {document} = window;
  const originalFetch = globalThis.fetch;
  globalThis.document = document;
  globalThis.Option = window.Option;
  window.HTMLElement.prototype.scrollIntoView = () => {};
  let authorized = false;
  const person = {sessionId:'synthetic-001',name:'Pessoa teste',email:'qa@example.invalid'};
  const oneAttempt = {id:'a',sessionId:person.sessionId,receivedAt:'2026-11-15',mission:'bennu',kind:'attempt',payload:{attemptId:'example',status:'cancelled'}};
  globalThis.fetch = async (_url, init) => {
    if (init.body) {
      authorized = JSON.parse(init.body).action === 'admin-login';
      return Response.json({});
    }
    if (!authorized) return new Response(null, {status:401});
    return Response.json({profiles:[person],events:[oneAttempt],cursor:null,hasMore:false});
  };
  try {
    await import('../dashboard/dashboard.js');
    await setImmediate();
    const login = document.querySelector('#login-form button');
    login.focus();
    login.dispatchEvent(new window.SubmitEvent('submit',{bubbles:true,cancelable:true,submitter:login}));
    await setImmediate();
    assert.equal(document.activeElement.id,'mission');
    assert.equal(document.querySelector('.table-scroll').tabIndex,0);
    const inspect = document.querySelector('#attempt-rows button');
    assert.match(inspect.getAttribute('aria-label'),/^Inspecionar.+Bennu/);
    inspect.focus();
    inspect.click();
    assert.equal(document.activeElement.id,'detail-title');
    document.getElementById('close-detail').click();
    assert.equal(document.activeElement,inspect);
    const select = document.getElementById('mission');
    select.value = 'cerrado';
    select.dispatchEvent(new window.Event('change'));
    assert.match(document.getElementById('status').textContent,/0 tentativas/);
    const priorFetch=globalThis.fetch;
    let finishRefresh;
    globalThis.fetch=async (url,init)=>init.body?priorFetch(url,init):new Promise(resolve=>{finishRefresh=resolve;});
    document.getElementById('refresh').click();
    await setImmediate();
    const logout = document.getElementById('logout');
    logout.focus();
    logout.click();
    await setImmediate();
    assert.equal(document.activeElement.id,'access');
    assert.equal(document.body.textContent.includes(person.name),false);
    finishRefresh(Response.json({profiles:[person],events:[oneAttempt],cursor:null,hasMore:false}));
    await setImmediate();
    assert.equal(document.getElementById('workspace').hidden,true);
    assert.equal(document.body.textContent.includes(person.name),false);
    assert.equal(document.getElementById('sessions').textContent,'0');
  } finally {
    globalThis.fetch = originalFetch;
    delete globalThis.document;
    delete globalThis.Option;
    window.close();
  }
});
