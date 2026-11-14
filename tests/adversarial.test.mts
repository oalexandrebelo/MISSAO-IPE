/** Independent adversarial review: literal specification constants, no production arithmetic helpers. */
import test from 'node:test';
import assert from 'node:assert/strict';
import type { MissionConfig, ScenarioId } from '../src/core/contracts.ts';
import { simulateMission } from '../src/core/engine.ts';
import { evaluateConfigurations, searchCatalog } from '../src/core/search.ts';
import { validateScienceRecord } from '../src/core/science.ts';
import { SCIENCE_RECORDS } from '../src/data/science-data.ts';
import { canonicalJson } from '../src/persistence/json.ts';
import { exportReplay, importReplay } from '../src/persistence/replay.ts';
import { hashResult } from '../src/persistence/identity.ts';
import { simulateAsync, searchAsync } from '../src/workers/client.ts';

const keys = ['battery','panel','processing','radio','buffer','policy'] as const;
const baseline: MissionConfig = {battery:'small',panel:'standard',processing:'bands',radio:'economy',buffer:'large',policy:'every-contact'};
const choices = [['small','large'],['compact','standard'],['bands','index'],['economy','fast'],['compact','large'],['every-contact','last-contact']];
const independentDomain = (): MissionConfig[] => Array.from({length:64},(_,mask)=>Object.fromEntries(keys.map((k,i)=>{
  const option=choices[i]?.[(mask>>i)&1];assert.ok(option);return [k,option];
})) as unknown as MissionConfig);
const distance = (a: MissionConfig,b: MissionConfig) => keys.filter(k=>a[k]!==b[k]).length;
const signature = (c: MissionConfig) => keys.map(k=>c[k]).join('|');

/** Fixed 1-second sampling with analytic empty-queue substep. Not an event integrator.
 * All production/contact boundaries are integer seconds in this CLOSED catalog.
 * Numeric comparison tolerance below applies to this oracle's floats only, never mission decisions.
 */
function independentOracle(c: MissionConfig, scenario: ScenarioId) {
  const capacity = c.battery==='small'?16:24, peak=c.battery==='small'?20:35;
  const panel=c.panel==='compact'?12:18, jobLoad=c.processing==='bands'?26:38;
  const batch=c.processing==='bands'?180000000:60000000, rate=c.radio==='economy'?960000:2400000;
  const radioLoad=c.radio==='economy'?16:26, buffer=c.buffer==='compact'?512000000:1536000000;
  const grams=1200+(c.battery==='small'?600:1000)+(c.panel==='compact'?250:550)+(c.processing==='bands'?350:400)+(c.radio==='economy'?200:450)+(c.buffer==='compact'?50:150);
  const credits=20+(c.battery==='small'?12:19)+(c.panel==='compact'?10:16)+(c.processing==='bands'?8:14)+(c.radio==='economy'?10:17)+(c.buffer==='compact'?2:5);
  const window=scenario==='long-contact'?600:240;
  let energy=capacity*0.8, minimum=energy, generated=0, received=0, lost=0, queue=0, terminal=false, completedAtS=10800;
  for(let t=0;t<10800;t++) {
    const work=t>=600 && t<3660 && t%600<60;
    const sun=t<5400||(t>=7200&&t<9000);
    const contact=(c.policy==='every-contact'&&t>=5400&&t<5400+window)||(t>=9000&&t<9000+window);
    const transmit=contact&&queue>0;
    const solar=sun?panel*(work?0.55:0.85):0;
    const txTime=transmit?Math.min(1,queue/rate):0;
    const segments=txTime>0?[[txTime,radioLoad,true],[1-txTime,8,false]]:[[1,work?jobLoad:8,false]];
    let elapsed=0;
    for(const [duration,load,isTx] of segments) {
      if(!duration) continue;
      const discharge=Math.max(0,Number(load)-solar)/0.95;
      if(discharge>peak) {terminal=true;completedAtS=t+elapsed;break;}
      const dt=Math.min(Number(duration),discharge>0?energy*3600/discharge:Infinity);
      if(isTx) {const n=Math.min(queue,Math.floor(dt*rate));queue-=n;received+=n;}
      energy=discharge>0?Math.max(0,energy-discharge*dt/3600):Math.min(capacity,energy+Math.min(10,solar-Number(load))*0.95*dt/3600);
      minimum=Math.min(minimum,energy); elapsed+=dt;
      if(dt<Number(duration)) {terminal=true;completedAtS=t+elapsed;break;}
    }
    if(terminal) break;
    if([660,1260,1860,2460,3060,3660].includes(t+1)) {
      generated+=batch;
      if(queue+batch>buffer) lost+=batch;else queue+=batch;
    }
  }
  const delivered=Math.floor(received/batch);
  const outcome=grams>3600||credits>86?'invalid':terminal||minimum<capacity*0.15||lost>0||delivered!==6?'failure':'success';
  return {outcome,grams,credits,generated,received,lost,queue,delivered,energy,minimum,completedAtS};
}

function near(actual:number,expected:number,message:string) {assert.ok(Math.abs(actual-expected)<1e-8,`${message}: ${actual} vs ${expected}`);}

test('independent 1-second oracle checks the complete 64 by 2 domain and envelope', () => {
  for(const scenario of ['long-contact','short-contact'] as const) for(const c of independentDomain()) {
    const expected=independentOracle(c,scenario), actual=simulateMission(c,scenario), label=`${scenario} ${signature(c)}`;
    assert.equal(actual.outcome,expected.outcome,label);
    assert.equal(actual.massKg*1000,expected.grams,label);
    assert.equal(actual.credits,expected.credits,label);
    assert.equal(actual.generatedBits,String(expected.generated),label);
    assert.equal(actual.downlinkedBits,String(expected.received),label);
    assert.equal(actual.lostBits,String(expected.lost),label);
    assert.equal(actual.queueBits,String(expected.queue),label);
    assert.equal(actual.deliveredRecords,expected.delivered,label);
    near(actual.finalEnergyWh,expected.energy,label+' energy');
    near(actual.minEnergyWh,expected.minimum,label+' minimum energy');
    near(actual.completedAtS,expected.completedAtS,label+' completedAtS');
    assert.equal(BigInt(actual.generatedBits),BigInt(actual.downlinkedBits)+BigInt(actual.lostBits)+BigInt(actual.queueBits));
    assert.equal(actual.observations.reduce((n,o)=>n+BigInt(o.generatedBits),0n),BigInt(actual.generatedBits));
    assert.equal(actual.observations.reduce((n,o)=>n+BigInt(o.downlinkedBits),0n),BigInt(actual.downlinkedBits));
  }
});

test('minimum and all smaller alternatives come from the independent oracle in four orders', () => {
  const domain=independentDomain();
  for(const scenario of ['long-contact','short-contact'] as const) {
    const winners=domain.filter(c=>independentOracle(c,scenario).outcome==='success');
    const minimum=Math.min(...winners.map(c=>distance(c,baseline)));
    const witness=winners.filter(c=>distance(c,baseline)===minimum).map(signature).sort();
    const reference=searchCatalog(baseline,scenario);
    assert.equal(reference.minimumDistance,minimum);
    assert.deepEqual(reference.best.map(c=>signature(c.config)).sort(),witness);
    assert.equal(reference.successful,winners.length);
    for(const order of [domain,[...domain].reverse(),domain.map((_,i)=>{const c=domain[(i*17)%64];assert.ok(c);return c;}),domain.map((_,i)=>{const c=domain[i^(i>>1)];assert.ok(c);return c;})]) {
      const result=evaluateConfigurations(baseline,scenario,order,simulateMission);
      assert.equal(canonicalJson(result),canonicalJson(reference));
    }
    for(const c of domain.filter(c=>distance(c,baseline)<minimum)) assert.notEqual(independentOracle(c,scenario).outcome,'success');
  }
});

test('scientific tolerance is inclusive and symmetric for positive and negative NDVI', () => {
  const record=SCIENCE_RECORDS[0];assert.ok(record);
  for(const [redInteger,nirInteger,ndviProduct] of [[9999,10000,0.0001],[10000,9999,-0.0001],[5000,5000,0.0001],[5000,5000,-0.0001],[4999,5001,0.0001],[5001,4999,-0.0001]] as const) {
    const r=validateScienceRecord({...record,redInteger,nirInteger,ndviProduct});
    assert.equal(r.valid,true,JSON.stringify({redInteger,nirInteger,ndviProduct,reasons:r.reasons}));
  }
  for(const [redInteger,nirInteger] of [[4999,5000],[5000,4999]] as const) {
    const r=validateScienceRecord({...record,redInteger,nirInteger,ndviProduct:0});
    assert.equal(r.valid,false,'error 1/9999 exceeds scientific tolerance');
    assert.ok(r.reasons.includes('ndvi:product-disagreement'));
  }
});

test('recomputed hashes never hide altered receipt metadata or observation accounting', async () => {
  const original=simulateMission(baseline,'long-contact');
  const mutations=[
    (r:any)=>{r.observations[0].id='different-archive-id';},
    (r:any)=>{r.observations[0].expectedNdvi+=0.0001;},
    (r:any)=>{r.events[0].timeS=1;},
    (r:any)=>{r.observations[0].downlinkedBits='0';r.observations[1].downlinkedBits='360000000';},
    (r:any)=>{r.trace[0].mode='forged-mode';},
    (r:any)=>{r.requiredRecords=0;},
  ];
  for(const mutate of mutations) {
    const envelope=JSON.parse(await exportReplay(original));
    mutate(envelope.claimedResult);envelope.resultHash=await hashResult(envelope.claimedResult);
    const imported=await importReplay(JSON.stringify(envelope));
    assert.equal(imported.matchesClaim,false);
    assert.equal(canonicalJson(imported.result),canonicalJson(original));
  }
});

class FakeWorker {
  static instances:FakeWorker[]=[];
  listeners:Record<string,((event:any)=>void)[]>={};
  message:any;terminated=false;
  constructor(..._args:unknown[]){FakeWorker.instances.push(this);}
  addEventListener(type:string,callback:(event:any)=>void){(this.listeners[type]??=[]).push(callback);}
  postMessage(value:any){this.message=value;}
  terminate(){this.terminated=true;}
  emit(type:string,data?:unknown){for(const listener of this.listeners[type]??[]) listener({data});}
}
const tick=()=>new Promise<void>(resolve=>setImmediate(resolve));

test('Worker bridge isolates concurrent jobs, ignores foreign IDs and cannot revive cancellation', async () => {
  const previous=Object.getOwnPropertyDescriptor(globalThis,'Worker');
  Object.defineProperty(globalThis,'Worker',{value:FakeWorker,configurable:true,writable:true});
  try {
    const a=new AbortController(), b=new AbortController();
    const config={...baseline};const first=simulateAsync(config,'long-contact',a.signal);
    const firstRejected=assert.rejects(first,{name:'AbortError'});
    const second=searchAsync(baseline,'short-contact',b.signal);
    const [wa,wb]=FakeWorker.instances.slice(-2);assert.ok(wa);assert.ok(wb);
    config.battery='large';assert.equal(wa.message.config.battery,'small');
    let settled=false;void second.then(()=>{settled=true;});
    wb.emit('message',{requestId:wa.message.requestId,ok:true,result:{forged:true}});
    await tick();assert.equal(settled,false);
    a.abort();await firstRejected;assert.equal(wa.terminated,true);
    wa.emit('message',{requestId:wa.message.requestId,ok:true,result:simulateMission(baseline,'long-contact')});
    const expected=searchCatalog(baseline,'short-contact');
    wb.emit('message',{requestId:wb.message.requestId,ok:true,result:expected});
    assert.equal(canonicalJson(await second),canonicalJson(expected));assert.equal(wb.terminated,true);
    const before=FakeWorker.instances.length;
    await assert.rejects(simulateAsync(baseline,'long-contact',a.signal),{name:'AbortError'});
    assert.equal(FakeWorker.instances.length,before);
  } finally {
    if(previous) Object.defineProperty(globalThis,'Worker',previous);else Reflect.deleteProperty(globalThis,'Worker');
  }
});

test('Worker bridge rejects malformed and mismatched successful responses', async () => {
  const previous=Object.getOwnPropertyDescriptor(globalThis,'Worker');
  Object.defineProperty(globalThis,'Worker',{value:FakeWorker,configurable:true,writable:true});
  try {
    for(const forged of [{},simulateMission(baseline,'short-contact'),simulateMission({...baseline,battery:'large'},'long-contact')]) {
      const pending=simulateAsync(baseline,'long-contact');
      const rejected=assert.rejects(pending,Error);
      const worker=FakeWorker.instances.at(-1)!;
      worker.emit('message',{requestId:worker.message.requestId,ok:true,result:forged});
      await rejected;assert.equal(worker.terminated,true);
    }
    const validSearch=searchCatalog(baseline,'short-contact');
    for(const forged of [
      {},searchCatalog(baseline,'long-contact'),
      {...validSearch,complete:false},
      {...validSearch,successful:validSearch.successful+1},
      {...validSearch,minimumDistance:3},
      {...validSearch,best:[...validSearch.best,...validSearch.best]},
    ]) {
      const pending=searchAsync(baseline,'short-contact');
      const rejected=assert.rejects(pending,Error);
      const worker=FakeWorker.instances.at(-1)!;
      worker.emit('message',{requestId:worker.message.requestId,ok:true,result:forged});
      await rejected;assert.equal(worker.terminated,true);
    }
  } finally {
    if(previous) Object.defineProperty(globalThis,'Worker',previous);else Reflect.deleteProperty(globalThis,'Worker');
  }
});

test('null Worker response rejects the job without throwing from its event listener', async () => {
  const previous=Object.getOwnPropertyDescriptor(globalThis,'Worker');
  Object.defineProperty(globalThis,'Worker',{value:FakeWorker,configurable:true,writable:true});
  const aborter=new AbortController();
  try {
    const pending=simulateAsync(baseline,'long-contact',aborter.signal);
    // Attach before dispatch to prevent unhandled-rejection noise in the counterexample.
    const observed=pending.then(()=>({resolved:true}),error=>({resolved:false,error}));
    const worker=FakeWorker.instances.at(-1)!;
    let threw:unknown;
    try {worker.emit('message',null);}catch(error){threw=error;}
    if(threw) aborter.abort();
    const result=await observed;
    assert.equal(threw,undefined,'malformed message must be rejected through finish, not escape its callback');
    assert.equal(result.resolved,false);
    assert.equal(worker.terminated,true);
  } finally {
    aborter.abort();
    if(previous) Object.defineProperty(globalThis,'Worker',previous);else Reflect.deleteProperty(globalThis,'Worker');
  }
});

test('compiled scientific pack rejects accidental mutation of provenance metadata', () => {
  assert.equal(Object.isFrozen(SCIENCE_RECORDS),true,'scientific record array must be immutable at runtime');
  for(const record of SCIENCE_RECORDS) {
    assert.equal(Object.isFrozen(record),true,'each compiled record must be immutable at runtime');
    const sourceId=record.sourceId;
    assert.throws(()=>{record.sourceId='unverified-source';},TypeError);
    assert.equal(record.sourceId,sourceId);
  }
});
