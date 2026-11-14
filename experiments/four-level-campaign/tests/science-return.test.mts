import assert from 'node:assert/strict';
import test from 'node:test';
import type { MissionConfig, ObservationResult } from '../src/core/contracts.ts';
import { simulateMission } from '../src/core/engine.ts';
import { SCIENCE_RECORDS } from '../src/data/science-data.ts';
import { buildScienceReturn } from '../src/lab/science-return.ts';

const values = [0.2271, 0.3764, 0.4387, 0.2857, 0.2880, 0.2564] as const;
function completeObservations(): ObservationResult[] {
  return SCIENCE_RECORDS.map((record, index) => ({
    id: record.id, generatedBits: '180000000', downlinkedBits: '180000000', lostBits: '0',
    state: 'delivered', producedAtS: 660 + index * 600, deliveredAtS: 6000 + index * 200,
    ndvi: values[index]!, expectedNdvi: 0.9999, scienceValid: true,
  }));
}

test('pairs use source IDs and historical metadata, while values come only from delivered results', () => {
  const observations = completeObservations();
  const unknown = { ...observations[0]!, id: 'UNKNOWN', ndvi: 0.9 };
  const summary = buildScienceReturn({ observations: [unknown, ...[...observations].reverse()] });
  assert.deepEqual(summary.pairs.map(pair => pair.point), ['A', 'B', 'C']);
  assert.deepEqual(summary.pairs.map(pair => [pair.latitude, pair.longitude]), [[-17.75, -50.98], [-17.85, -50.98], [-17.85, -50.88]]);
  assert.equal(summary.availableComparisons, 3);
  assert.equal(summary.availableValues, 6);
  for (const pair of summary.pairs) {
    assert.deepEqual(pair.samples.map(sample => sample.observationDate), ['2024-09-01', '2024-09-23']);
    assert.deepEqual(pair.samples.map(sample => sample.compositeStart), ['2024-08-28', '2024-09-13']);
    for (const sample of pair.samples) assert.equal(sample.ndvi, observations.find(observation => observation.id === sample.recordId)!.ndvi);
  }
  // A later NDVI of .3764 must not be overwritten by the source product .3763.
  assert.equal(summary.pairs[0]!.samples[1].ndvi, 0.3764);
  assert.ok(Math.abs(summary.pairs[0]!.difference! - 0.1493) < 1e-12);
  assert.ok(Math.abs(summary.pairs[1]!.difference! - (-0.1530)) < 1e-12);
});

test('partial science retains individual delivered cells and withholds incomplete-pair differences', () => {
  const all = completeObservations();
  const observations = [all[0]!, all[1]!, all[2]!, { ...all[3]!, state: 'partial' as const, ndvi: 0.99 }, { ...all[4]!, state: 'lost' as const }, { ...all[5]!, state: 'queued' as const }];
  const summary = buildScienceReturn({ observations });
  assert.equal(summary.availableComparisons, 1);
  assert.equal(summary.totalComparisons, 3);
  assert.equal(summary.availableValues, 3);
  assert.equal(summary.pairs[1]!.samples[0].ndvi, 0.4387);
  assert.equal(summary.pairs[1]!.samples[1].ndvi, null);
  assert.equal(summary.pairs[1]!.difference, null);
  assert.equal(summary.pairs[2]!.difference, null);
  assert.equal(summary.pairs[1]!.samples[1].status, 'partial');
  assert.equal(summary.pairs[2]!.samples[0].status, 'lost');
});

test('every undelivered, unvalidated or nonfinite value is withheld even when a numeric claim is present', () => {
  const modifications: Partial<ObservationResult>[] = [
    ...(['not-produced', 'queued', 'partial', 'lost', 'invalid'] as const).map(state => ({ state, ndvi: 0.5 })),
    { state: 'delivered', scienceValid: false, ndvi: 0.5 },
    ...[null, NaN, Infinity, -Infinity].map(ndvi => ({ ndvi })),
  ];
  for (const modification of modifications) {
    const observations = completeObservations();
    observations[0] = { ...observations[0]!, ...modification };
    const summary = buildScienceReturn({ observations });
    assert.equal(summary.pairs[0]!.samples[0].ndvi, null, JSON.stringify(modification));
    assert.equal(summary.pairs[0]!.difference, null);
    assert.equal(summary.availableComparisons, 2);
  }
});

test('zero is a delivered NDVI; missing or duplicated identifiers cannot supply a science value', () => {
  const observations = completeObservations();
  observations[0] = { ...observations[0]!, ndvi: 0 };
  observations[1] = { ...observations[1]!, ndvi: 0 };
  const zero = buildScienceReturn({ observations });
  assert.equal(zero.pairs[0]!.samples[0].ndvi, 0);
  assert.equal(zero.pairs[0]!.difference, 0);
  assert.equal(zero.availableComparisons, 3);
  const missing = buildScienceReturn({ observations: observations.slice(1) });
  assert.equal(missing.pairs[0]!.samples[0].ndvi, null);
  assert.equal(missing.pairs[0]!.samples[0].status, 'missing');
  const duplicate = buildScienceReturn({ observations: [...observations, observations[0]!] });
  assert.equal(duplicate.pairs[0]!.samples[0].ndvi, null);
  assert.equal(duplicate.pairs[0]!.samples[0].status, 'unavailable');
  assert.equal(duplicate.availableComparisons, 2);
});

test('the real short-contact baseline yields one comparison without changing the six-record goal', () => {
  const config: MissionConfig = { battery: 'small', panel: 'standard', processing: 'bands', radio: 'economy', buffer: 'large', policy: 'every-contact' };
  const result = simulateMission(config, 'short-contact');
  const before = JSON.stringify(result);
  const summary = buildScienceReturn(result);
  assert.equal(summary.availableComparisons, 1);
  assert.equal(summary.pairs[0]!.samples.every(sample => sample.status === 'ready'), true);
  assert.equal(summary.pairs[1]!.difference, null);
  assert.equal(summary.pairs[2]!.difference, null);
  assert.equal(result.requiredRecords, 6);
  assert.equal(JSON.stringify(result), before);
});
