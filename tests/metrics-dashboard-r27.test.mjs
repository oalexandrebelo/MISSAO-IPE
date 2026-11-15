import {test} from 'node:test';
import assert from 'node:assert/strict';
import {summarize} from '../dashboard/metrics.mjs';
const event=(id,operation,before,after,extra={})=>({id,sessionId:'test',receivedAt:'2026-11-15T00:00:00Z',mission:'europa',kind:'inventory',payload:{operation,balanceBefore:before,balanceAfter:after,reward:0,...extra}});
test('inventory counts confirmed operations once and separates purchases, fees, wear and rewards',()=>{
 const bought=event('1','buy',25,9), launched=event('2','launch',9,7,{wear:[{itemId:'x',before:3,after:2},{itemId:'y',before:3,after:2}]}), complete=event('3','complete',7,15,{reward:8});
 const s=summarize([bought,launched,complete,bought,event('4','return',15,19),event('5','reset',19,25)]);
 assert.equal(s.inventory.purchases,1);assert.equal(s.inventory.spent,16);assert.equal(s.inventory.fees,2);assert.equal(s.inventory.wear,2);assert.equal(s.inventory.rewards,8);assert.equal(s.inventory.returned,4);assert.equal(s.inventory.resets,1);assert.equal(s.calculated.length,0);assert.equal(s.answered,0);
});
test('cancellation and blocked departure cannot create fictitious wear or reward in the dashboard',()=>{
 const s=summarize([event('1','launch',25,25),event('2','cancel',25,25)]);
 assert.equal(s.inventory.wear,0);assert.equal(s.inventory.rewards,0);assert.equal(s.inventory.fees,0);
});

test('same UUID in legacy and authoritative records preserves both versions and the inventory ledger',()=>{
 const base={id:'same',sessionId:'test',receivedAt:'2026-11-15T00:00:00Z',mission:'europa',kind:'attempt',payload:{attemptId:'same',status:'completed'},result:{outcome:'success',diagnostics:[]}};
 const v1={...base,schemaVersion:1},v2={...base,schemaVersion:2};
 const ledger={...event('same','complete',7,15,{reward:8}),schemaVersion:2};
 const s=summarize([v1,v2,ledger,v2,ledger]);
 assert.equal(s.attempts.length,2); assert.equal(s.inventory.events.length,1);assert.equal(s.inventory.rewards,8);
});
