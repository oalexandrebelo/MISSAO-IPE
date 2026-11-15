import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { normalizeEvent, InvalidInput } from '../server/metrics/model.mjs';
import { BRUNO_CHOICES, DEFAULT_BRUNO_CONFIG, simulateBrunoMission } from '../experiments/mission-design-lab/src/lab/bruno-missions.ts';
const event = (mission, kind, payload) => ({ id: randomUUID(), mission, kind, at: new Date().toISOString(), payload });
const normalize = e => normalizeEvent(e, randomUUID(), new Date().toISOString());
for (const mission of ['iss','moon','mars']) {
  test(`${mission}: score and diagnostics are recomputed from the validated project`, () => {
    const config = { ...DEFAULT_BRUNO_CONFIG, launcher:'heavy', energy:'extended', protection:'reinforced', navigation:'deep-space' };
    const calculated = simulateBrunoMission(mission, config);
    const stored = normalize(event(mission,'attempt',{attemptId:randomUUID(),status:'completed',config}));
    assert.deepEqual(stored.result.score,calculated.score);
    assert.equal(stored.result.validRecords,calculated.deliveredRecords);
    assert.equal(stored.result.outcome,calculated.outcome);
    assert.deepEqual(stored.result.diagnostics,calculated.diagnostics);
    assert.throws(()=>normalize(event(mission,'attempt',{attemptId:randomUUID(),status:'completed',config,score:100})),InvalidInput);
    assert.throws(()=>normalize(event(mission,'attempt',{attemptId:randomUUID(),status:'completed',config:{...config,energy:'unlimited'}})),InvalidInput);
  });
  test(`${mission}: all six decisions validate and unknown assessments are rejected`,()=>{
    for(const [key,choices] of Object.entries(BRUNO_CHOICES)){
      const p={key,from:choices[0].id,to:choices[1].id};
      assert.deepEqual(normalize(event(mission,'decision',p)).payload,p);
      assert.throws(()=>normalize(event(mission,'decision',{...p,to:p.from})),InvalidInput);
    }
    assert.throws(()=>normalize(event(mission,'assessment',{question:'prediction',questionVersion:1,answer:'more'})),InvalidInput);
  });
}
