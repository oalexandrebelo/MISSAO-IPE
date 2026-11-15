import assert from 'node:assert/strict';
import test from 'node:test';
import { runLearningExperiment } from '../src/lab/mission-curriculum.ts';
import { firstLearningDifference, learningDeliveryAt, learningStateAt, learningStepPath } from '../src/lab/learning-comparison.ts';

test('guided differences use the earliest actual unequal states in each mission', () => {
  for (const id of ['cerrado','bennu','telescope'] as const) {
    const experiment = runLearningExperiment(id), difference = firstLearningDifference(experiment);
    assert.ok(difference, id);
    for (const t of [...new Set(experiment.trials.flatMap(trial => trial.result.trace.map(point => point.timeS)))].filter(t => t < difference.timeS)) {
      const a = learningStateAt(experiment.trials[0], t), b = learningStateAt(experiment.trials[1], t);
      if (a && b) for (const key of ['energyWh','queueBits','downlinkedBits','loadW','solarW'] as const) assert.ok(Math.abs(a[key]-b[key]) < 1e-7);
    }
    assert.ok(difference.fields.length);
    assert.ok(difference.events.flat().every(event => event.timeS === difference.timeS));
  }
});

test('delivery snapshots never expose later records, and preserve incompatible received packets', () => {
  const [camera,spectrometer] = runLearningExperiment('telescope').trials;
  assert.deepEqual(learningDeliveryAt(spectrometer,0),{received:0,valid:0});
  assert.deepEqual(learningDeliveryAt(camera,10800),{received:6,valid:0});
  assert.deepEqual(learningDeliveryAt(spectrometer,10800),{received:6,valid:6});
  const first = spectrometer.result.observations.find(row => row.deliveredAtS !== null)!;
  assert.deepEqual(learningDeliveryAt(spectrometer,first.deliveredAtS!-1),{received:0,valid:0});
});

test('early shutdown retains its last sample and chart uses steps without manufactured states', () => {
  const trial = runLearningExperiment('cerrado').trials[1];
  assert.equal(trial.result.completedAtS,600);
  assert.equal(learningStateAt(trial,10000),trial.result.trace.at(-1));
  const path = learningStepPath(trial.result.trace,'loadW',10800,40);
  assert.ok(path.startsWith('M')); assert.ok(path.includes('H')); assert.ok(path.includes('V'));
  assert.equal(learningStepPath([],'loadW',10800,40),'');
  assert.equal(firstLearningDifference({id:'cerrado',trials:[trial,trial]}),null);
});
