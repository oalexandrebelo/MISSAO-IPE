import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_CONFIG, getScenario } from '../src/core/catalog.ts';
import type { Scenario } from '../src/core/contracts.ts';
import { simulateMission } from '../src/core/engine.ts';
import { reviewPreflight } from '../src/lab/preflight.ts';

const long = getScenario('long-contact');
const short = getScenario('short-contact');
const near = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 1e-10, `${actual} versus ${expected}`);
const fixture = (change: Partial<Scenario>): Scenario => ({ ...long, ...change });

test('long contacts have a 1152 Mbit ideal ceiling for 1080 Mbit, without certifying energy or mission success', () => {
  const review = reviewPreflight(DEFAULT_CONFIG, long);
  assert.equal(review.transmission.ceilingBits, 1_152_000_000);
  assert.equal(review.transmission.requiredBits, 1_080_000_000);
  assert.equal(review.transmission.allowedContactSeconds, 1_200);
  assert.equal(review.transmission.status, 'within-limit');
  assert.equal(review.energy.status, 'execution-required');
  assert.equal(Object.hasOwn(review, 'outcome'), false);
  assert.equal(Object.hasOwn(review, 'deliveredRecords'), false);
});

test('short contacts offer only 460.8 Mbit for the same 1080 Mbit payload', () => {
  const review = reviewPreflight(DEFAULT_CONFIG, short);
  assert.equal(review.transmission.ceilingBits, 460_800_000);
  assert.equal(review.transmission.requiredBits, 1_080_000_000);
  assert.equal(review.transmission.status, 'limit-exceeded');
});

test('INDEX fits the short ideal data ceiling but demands more than the small battery peak limit', () => {
  const review = reviewPreflight({ ...DEFAULT_CONFIG, processing: 'index' }, short);
  assert.equal(review.transmission.requiredBits, 360_000_000);
  assert.equal(review.transmission.status, 'within-limit');
  assert.equal(review.peak.processing?.illumination, 'sunlit');
  near(review.peak.processing!.solarW, 9.9);
  near(review.peak.processing!.requiredBatteryW, 29.57894736842105);
  assert.equal(review.peak.maxDischargeW, 20);
  assert.equal(review.peak.status, 'limit-exceeded');
  assert.equal(review.energy.status, 'execution-required');
});

test('the large battery accepts the INDEX peak while accumulated energy remains unresolved', () => {
  const review = reviewPreflight({ ...DEFAULT_CONFIG, battery: 'large', processing: 'index' }, short);
  assert.equal(review.peak.maxDischargeW, 35);
  assert.equal(review.peak.status, 'within-limit');
  near(review.peak.knownRequiredW!, 29.57894736842105);
  assert.equal(review.energy.status, 'execution-required');
  assert.equal(review.energy.initialEnergyWh, 19.2);
  assert.equal(review.energy.reserveWh, 3.6);
});

test('compact memory cannot hold the six BANDAS batches before the first standard contact', () => {
  const review = reviewPreflight({ ...DEFAULT_CONFIG, buffer: 'compact' }, long);
  assert.equal(review.memory.capacityBits, 512_000_000);
  assert.equal(review.memory.requiredBeforeFirstContactBits, 1_080_000_000);
  assert.equal(review.memory.completedBeforeFirstContact, 6);
  assert.equal(review.memory.firstAllowedContactS, 5_400);
  assert.equal(review.memory.allJobsBeforeFirstContact, true);
  assert.equal(review.memory.status, 'limit-exceeded');
});

test('last-contact policy halves the standard contact ceiling and moves the memory boundary', () => {
  for (const scenario of [long, short]) {
    const every = reviewPreflight(DEFAULT_CONFIG, scenario);
    const last = reviewPreflight({ ...DEFAULT_CONFIG, policy: 'last-contact' }, scenario);
    assert.equal(last.transmission.ceilingBits, every.transmission.ceilingBits! / 2);
    assert.equal(last.transmission.allowedContactCount, 1);
    assert.equal(last.memory.firstAllowedContactS, 9_000);
  }
});

test('a batch finishing exactly at the first contact start counts in the pre-contact queue', () => {
  const review = reviewPreflight(DEFAULT_CONFIG, fixture({ contacts: [[660, 900], [9_000, 9_600]] }));
  assert.equal(review.scheduleClear, true);
  assert.equal(review.memory.completedBeforeFirstContact, 1);
  assert.equal(review.memory.requiredBeforeFirstContactBits, 180_000_000);
  assert.equal(review.memory.allJobsBeforeFirstContact, false);
});

test('interleaved agendas count only batches before the first allowed contact, never all six by default', () => {
  const scenario = fixture({ contacts: [[1_300, 1_600], [9_000, 9_600]] });
  const review = reviewPreflight({ ...DEFAULT_CONFIG, buffer: 'compact' }, scenario);
  assert.equal(review.scheduleClear, true);
  assert.equal(review.memory.completedBeforeFirstContact, 2);
  assert.equal(review.memory.requiredBeforeFirstContactBits, 360_000_000);
  assert.equal(review.memory.status, 'within-limit');
  assert.equal(review.memory.allJobsBeforeFirstContact, false);
  assert.equal(review.peak.radio, null, 'Mixed contact lighting cannot establish when a nonempty queue transmits.');
  assert.equal(review.peak.status, 'execution-required');
  const last = reviewPreflight({ ...DEFAULT_CONFIG, buffer: 'compact', policy: 'last-contact' }, scenario);
  assert.equal(last.memory.requiredBeforeFirstContactBits, 1_080_000_000);
  assert.equal(last.memory.status, 'limit-exceeded');
});

test('a fast radio in wholly illuminated contacts is not falsely checked as a radio in eclipse', () => {
  const scenario = fixture({ contacts: [[4_200, 4_800], [4_800, 5_400]] });
  const review = reviewPreflight({ ...DEFAULT_CONFIG, radio: 'fast' }, scenario);
  assert.equal(review.peak.radio?.illumination, 'sunlit');
  near(review.peak.radio!.solarW, 15.3);
  near(review.peak.radio!.requiredBatteryW, 11.263157894736842);
  assert.equal(review.peak.status, 'within-limit');
});

test('processing crossing into shadow uses the shadow demand instead of only its illuminated start', () => {
  const scenario = fixture({ sunlight: [[0, 630], [7_200, 9_000]] });
  const review = reviewPreflight(DEFAULT_CONFIG, scenario);
  assert.equal(review.peak.processing?.illumination, 'shadow');
  assert.equal(review.peak.processing?.timeS, 630);
  near(review.peak.processing!.requiredBatteryW, 27.36842105263158);
  assert.equal(review.peak.status, 'limit-exceeded');
});

test('unclear or unsupported calendars return unresolved conditions instead of fabricated numeric approvals', () => {
  const unclear = [
    fixture({ contacts: [[5_400, 6_000], [5_900, 6_400]] }),
    fixture({ contacts: [[600, 900]] }),
    fixture({ jobStartsS: [1_200, 600, 1_800, 2_400, 3_000, 3_600] }),
    fixture({ sunlight: [[0, 20_000]] }),
    fixture({ jobStartsS: [600] }),
  ];
  for (const scenario of unclear) {
    const review = reviewPreflight(DEFAULT_CONFIG, scenario);
    assert.equal(review.scheduleClear, false);
    assert.equal(review.transmission.status, 'execution-required');
    assert.equal(review.transmission.ceilingBits, null);
    assert.equal(review.memory.status, 'execution-required');
    assert.equal(review.memory.requiredBeforeFirstContactBits, null);
    assert.equal(review.peak.status, 'execution-required');
    assert.equal(review.peak.knownRequiredW, null);
  }
});

test('no allowed contact gives zero service but does not invent a first-contact memory boundary', () => {
  const review = reviewPreflight(DEFAULT_CONFIG, fixture({ contacts: [] }));
  assert.equal(review.transmission.ceilingBits, 0);
  assert.equal(review.transmission.status, 'limit-exceeded');
  assert.equal(review.memory.firstAllowedContactS, null);
  assert.equal(review.memory.status, 'execution-required');
  assert.equal(review.peak.radio, null);
});

test('reading preflight preserves its inputs and the existing engine result', () => {
  const config = Object.freeze({ ...DEFAULT_CONFIG });
  const prior = simulateMission(config, 'short-contact');
  const scenarioBefore = JSON.stringify(short);
  const configBefore = JSON.stringify(config);
  reviewPreflight(config, short);
  assert.equal(JSON.stringify(config), configBefore);
  assert.equal(JSON.stringify(short), scenarioBefore);
  assert.deepEqual(simulateMission(config, 'short-contact'), prior);
  assert.equal(prior.deliveredRecords, 2);
  assert.equal(prior.outcome, 'failure');
});
