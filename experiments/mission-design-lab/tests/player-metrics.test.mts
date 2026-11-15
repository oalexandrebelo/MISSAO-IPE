import test from 'node:test';
import assert from 'node:assert/strict';
import { acknowledgeMetrics, mergeMetrics, metricsKey, newMetric, readMetrics, summarizeAttempt, summarizeMetrics, writeMetrics } from '../src/metrics/player-metrics.ts';
import type { LocalMetric } from '../src/metrics/player-metrics.ts';
import { simulateMission } from '../src/core/engine.ts';
import { DEFAULT_CONFIG } from '../src/core/catalog.ts';
import { DEFAULT_EXPEDITION_CONFIGS, simulateExpedition } from '../src/lab/scientific-expeditions.ts';
const memory = () => { const values = new Map<string,string>(); return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string,value: string) => { values.set(key,value); } }; };
const session = '0a864077-3915-4a9c-a025-9929ef913827';

test('each real execution has an independent event and count even when the deterministic result is identical', () => {
  const result = simulateMission({ ...DEFAULT_CONFIG }, 'long-contact');
  const events: LocalMetric[] = [1,2].map(() => ({ event: newMetric('attempt','cerrado',{ attemptId:crypto.randomUUID(), status:'completed',config:result.config,scenarioId:result.scenarioId }), summary:summarizeAttempt(result), sync:'pending' }));
  assert.notEqual(events[0]!.event.id,events[1]!.event.id);
  assert.equal(summarizeMetrics(events).attempts,2);
  assert.equal(summarizeMetrics(events).successes,2);
  assert.equal(summarizeMetrics(events).questions,0);
});

test('closed questions count first answer, latest answer and revisions independently from mission success', () => {
  const items: LocalMetric[] = [false,true,true].map((correct,index) => ({ event:newMetric('assessment', index === 2 ? 'telescope' : 'bennu',{ question:'interpretation',questionVersion:1,answer:correct ? 'evidence':'overclaim' }), correct,sync:'pending' }));
  const s = summarizeMetrics(items);
  assert.equal(s.questions,2); assert.equal(s.firstCorrect,1); assert.equal(s.latestCorrect,2); assert.equal(s.revisions,1); assert.equal(s.successes,0);
});

test('NASA cases distinguish received packets, compatible records and failures without counting MISSION_END twice', () => {
  const bennu = summarizeAttempt(simulateExpedition('bennu',{ ...DEFAULT_EXPEDITION_CONFIGS.bennu }));
  const webb = summarizeAttempt(simulateExpedition('telescope',{ ...DEFAULT_EXPEDITION_CONFIGS.telescope,instrument:'camera',launch:'science',power:'extended',ground:'extended' }));
  assert.equal(bennu.valid,2); assert.equal(bennu.received,2);
  assert.ok(webb.valid < webb.required);
  assert.ok([...bennu.diagnostics,...webb.diagnostics].every(item => item.code !== 'MISSION_END'));
  assert.equal(new Set(bennu.diagnostics.map(item => item.code)).size,bennu.diagnostics.length);
});

test('a confirmed acknowledgement is idempotent, rejected events keep reasons, unacknowledged events stay queued', () => {
  const events: LocalMetric[] = [1,2,3].map(() => ({event:newMetric('inspection','bennu',{target:'energy'}),sync:'pending'}));
  const ack = { acceptedIds:[events[0]!.event.id],rejected:[{id:events[1]!.event.id,reason:'invalid payload'}] };
  const next = acknowledgeMetrics(events,ack);
  assert.deepEqual(next.map(item=>item.sync),['synced','rejected','pending']);
  assert.equal(next[1]!.reason,'invalid payload');
  assert.deepEqual(acknowledgeMetrics(next,ack),next);
  assert.equal(mergeMetrics(next,events)[0]!.sync,'synced');
  assert.throws(()=>acknowledgeMetrics(events,{ok:true}),/confirmou/);
});

test('versioned browser store isolates sessions, retains UUID events and rejects malformed or mismatched saved data', () => {
  const storage=memory(); const items: LocalMetric[]=[{event:newMetric('inspection','telescope',{target:'instrument'}),sync:'pending'}];
  writeMetrics(storage,session,items);
  assert.deepEqual(readMetrics(storage,session),items);
  assert.deepEqual(readMetrics(storage,crypto.randomUUID()),[]);
  storage.setItem(metricsKey(session),JSON.stringify({version:2,sessionId:session,entries:items}));
  assert.throws(()=>readMetrics(storage,session),/formato/);
  storage.setItem(metricsKey(session),JSON.stringify({version:1,sessionId:session,entries:[{...items[0],summary:{outcome:'success',received:'six'}}]}));
  assert.throws(()=>readMetrics(storage,session),/formato/);
});
