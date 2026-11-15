import assert from 'node:assert/strict';
import test from 'node:test';
import { runLearningExperiment } from '../src/lab/mission-curriculum.ts';
import { calculateMissionScore } from '../src/metrics/mission-score.ts';
import { newMetric, readMetrics, summarizeAttempt, writeMetrics } from '../src/metrics/player-metrics.ts';

const compatible = { validRecords: 6, requiredRecords: 6, outcome: 'success', massKg: 3, maxMassKg: 4, credits: 75, budget: 100 } as const;

test('science, compatible architecture and remaining resources contribute integer points', () => {
  assert.deepEqual(calculateMissionScore(compatible), { total: 93, science: 60, engineering: 30, efficiency: 3, max: 100, rubricVersion: 'r21-v1' });
});

test('operational failures retain architecture credit and earn points for the valid records that arrived', () => {
  const partial = calculateMissionScore({ ...compatible, validRecords: 2, outcome: 'failure' });
  assert.equal(partial.science, 20);
  assert.equal(partial.engineering, 30);
  assert.equal(partial.total, 53);
  assert.equal(calculateMissionScore({ ...compatible, validRecords: 0, outcome: 'failure' }).total, 33);
});

test('incompatible designs receive only the science points they earned', () => {
  const score = calculateMissionScore({ ...compatible, validRecords: 3, outcome: 'invalid' });
  assert.equal(score.total, 30);
  assert.equal(score.science, 30);
  assert.equal(score.engineering, 0);
  assert.equal(score.efficiency, 0);
});

test('record counts and remaining mass and budget stay within the published point ranges', () => {
  assert.equal(calculateMissionScore({ ...compatible, validRecords: 8, massKg: 0, credits: 0 }).total, 100);
  assert.equal(calculateMissionScore({ ...compatible, validRecords: -1, massKg: 5, credits: 110 }).total, 30);
  assert.equal(calculateMissionScore({ ...compatible, requiredRecords: 0, maxMassKg: 0, budget: 0 }).total, 30);
});

test('all three mission engines score completed attempt summaries using their own limits', () => {
  const expected = { cerrado: [52, 31], bennu: [51, 90], telescope: [0, 92] };
  for (const id of ['cerrado', 'bennu', 'telescope'] as const) {
    const scores = runLearningExperiment(id).trials.map(({ result }) => summarizeAttempt(result).score);
    assert.deepEqual(scores.map(score => score.total), expected[id]);
  }
});

test('the player store preserves older unscored attempts and verifies present scores', () => {
  const trial = runLearningExperiment('cerrado').trials[0];
  const { score, ...summary } = summarizeAttempt(trial.result);
  const session = crypto.randomUUID();
  const item = { event: newMetric('attempt', 'cerrado', { status: 'completed' }), summary, sync: 'synced' } as const;
  let saved: string | null = null;
  const storage = { getItem: () => saved, setItem: (_key: string, text: string) => { saved = text; } };

  writeMetrics(storage, session, [item]);
  assert.deepEqual(readMetrics(storage, session), [item]);
  const scored = { ...item, summary: { ...summary, score } };
  writeMetrics(storage, session, [scored]);
  assert.deepEqual(readMetrics(storage, session), [scored]);
  writeMetrics(storage, session, [{ ...item, summary: { ...summary, score: { ...score, total: 101 } } }]);
  assert.throws(() => readMetrics(storage, session), /formato/);
});
