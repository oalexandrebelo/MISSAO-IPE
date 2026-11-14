import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_CONFIG, getScenario } from '../src/core/catalog.ts';
import { simulateMission } from '../src/core/engine.ts';
import type { MissionResult } from '../src/core/contracts.ts';
import { reviewRequirements } from '../src/lab/requirements-review.ts';
import type { RequirementId, RequirementState } from '../src/lab/requirements-review.ts';

const baseline = { ...DEFAULT_CONFIG };
const long = simulateMission(baseline, 'long-contact');
const short = simulateMission(baseline, 'short-contact');
const witness = simulateMission({ ...baseline, battery: 'large', processing: 'index' }, 'short-contact');
const invalidSix = simulateMission({ ...baseline, battery: 'large', processing: 'index', radio: 'fast' }, 'short-contact');
const peakEarly = simulateMission({ ...baseline, processing: 'index' }, 'short-contact');

function row(result: MissionResult, id: RequirementId) {
  const found = reviewRequirements(result).rows.find(item => item.id === id);
  assert.ok(found, `Missing requirement ${id}`);
  return found;
}

function states(result: MissionResult): Record<RequirementId, RequirementState> {
  return Object.fromEntries(reviewRequirements(result).rows.map(item => [item.id, item.state])) as Record<RequirementId, RequirementState>;
}

test('the default long mission meets seven existing requirements with actual limits and event references', () => {
  const review = reviewRequirements(long);
  assert.equal(long.deliveredRecords, 6);
  assert.equal(review.outcome, 'success');
  assert.equal(review.horizonCompleted, true);
  assert.equal(review.rows.length, 7);
  assert.ok(review.rows.every(item => item.state === 'met'));
  assert.ok(review.groups.every(group => group.state === 'met'));
  assert.equal(row(long, 'mass').measured, 3.05);
  assert.equal(row(long, 'mass').limit, getScenario(long.scenarioId).maxMassKg);
  assert.equal(row(long, 'budget').measured, 71);
  assert.equal(row(long, 'budget').limit, 86);
  assert.equal(row(long, 'energy').measured, long.minEnergyWh);
  assert.equal(row(long, 'energy').limit, long.reserveWh);
  assert.equal(row(long, 'delivery').measured, 6);
  assert.equal(row(long, 'delivery').limit, 6);
  assert.equal(row(long, 'delivery').evidence?.code, 'RECORD_DELIVERED');
  assert.equal(row(long, 'mass').evidence, null);
  assert.equal(row(long, 'mass').evidenceFallback, 'Configuração executada');
  for (const item of review.rows) if (item.evidence) assert.ok(long.events.includes(item.evidence));
});

test('two delivered records in the default short mission fail delivery while quality and operation stay distinct', () => {
  assert.equal(short.deliveredRecords, 2);
  const review = reviewRequirements(short);
  assert.equal(review.outcome, 'failure');
  assert.deepEqual(states(short), {
    mass: 'met', budget: 'met', energy: 'met', 'peak-power': 'met', memory: 'met', 'science-quality': 'met', delivery: 'unmet',
  });
  assert.equal(row(short, 'science-quality').measured, 6);
  assert.equal(row(short, 'delivery').margin, -4);
  assert.equal(row(short, 'delivery').evidence, short.events.find(event => event.code === 'DELIVERY_SHORTFALL'));
  assert.equal(review.groups.find(group => group.id === 'operation')?.state, 'met');
  assert.equal(review.groups.find(group => group.id === 'science')?.state, 'unmet');
});

test('the large battery and index witness fulfills short contacts without changing any campaign result', () => {
  assert.equal(witness.deliveredRecords, 6);
  assert.equal(witness.outcome, 'success');
  const before = JSON.stringify(witness);
  const review = reviewRequirements(witness);
  assert.ok(review.rows.every(item => item.state === 'met'));
  assert.equal(row(witness, 'peak-power').limit, 35);
  assert.equal(row(witness, 'energy').limit, 3.6);
  assert.equal(JSON.stringify(witness), before);
});

test('a project with six valid deliveries and invalid mass/budget retains the invalid global outcome', () => {
  assert.equal(invalidSix.deliveredRecords, 6);
  assert.equal(invalidSix.outcome, 'invalid');
  const review = reviewRequirements(invalidSix);
  assert.equal(review.outcome, 'invalid');
  assert.equal(row(invalidSix, 'mass').state, 'unmet');
  assert.equal(row(invalidSix, 'budget').state, 'unmet');
  assert.equal(row(invalidSix, 'delivery').state, 'met');
  assert.equal(row(invalidSix, 'science-quality').state, 'met');
  assert.equal(review.groups.find(group => group.id === 'design')?.state, 'unmet');
  assert.equal(review.groups.find(group => group.id === 'science')?.state, 'met');
  assert.ok(row(invalidSix, 'mass').margin! < 0);
  assert.equal(row(invalidSix, 'budget').margin, -5);
  assert.equal(row(invalidSix, 'mass').evidence?.code, 'MASS_LIMIT');
  assert.equal(row(invalidSix, 'budget').evidence?.code, 'BUDGET_LIMIT');
});

test('early peak termination preserves known failures and does not approve unobserved operation or science', () => {
  assert.equal(peakEarly.completedAtS, 600);
  const review = reviewRequirements(peakEarly);
  assert.equal(review.horizonCompleted, false);
  assert.deepEqual(states(peakEarly), {
    mass: 'met', budget: 'met', energy: 'incomplete', 'peak-power': 'unmet', memory: 'incomplete', 'science-quality': 'incomplete', delivery: 'unmet',
  });
  const peak = peakEarly.events.find(event => event.code === 'PEAK_POWER')!;
  assert.equal(row(peakEarly, 'peak-power').evidence, peak);
  assert.equal(row(peakEarly, 'peak-power').measured, peak.value, 'The rejected demand survives the zero-power terminal trace point.');
  assert.ok(row(peakEarly, 'peak-power').margin! < 0);
  assert.equal(row(peakEarly, 'science-quality').measured, 0, 'Prevalidated but unproduced inputs are not six completed scientific checks.');
  const operation = review.groups.find(group => group.id === 'operation')!;
  assert.equal(operation.unmet, 1);
  assert.equal(operation.incomplete, 2);
  assert.equal(operation.state, 'unmet');
});

test('a prematurely truncated result without failure evidence stays incomplete instead of inferring pass or a new failure', () => {
  const truncated: MissionResult = { ...peakEarly, violations: [], events: [], trace: [] };
  const review = reviewRequirements(truncated);
  assert.deepEqual(states(truncated), {
    mass: 'met', budget: 'met', energy: 'incomplete', 'peak-power': 'incomplete', memory: 'incomplete', 'science-quality': 'incomplete', delivery: 'incomplete',
  });
  assert.equal(review.outcome, peakEarly.outcome, 'The review never recomputes outcome.');
  assert.ok(review.rows.every(item => item.evidence === null));
  assert.equal(row(truncated, 'peak-power').measured, null);
  assert.equal(row(truncated, 'peak-power').margin, null);
});

test('trace-suppressed complete results retain engine checks but do not invent a numeric power peak', () => {
  const withoutTrace = simulateMission(baseline, 'long-contact', { trace: false });
  assert.deepEqual(states(withoutTrace), states(long));
  assert.equal(row(withoutTrace, 'peak-power').measured, null);
  assert.equal(row(withoutTrace, 'peak-power').margin, null);
  assert.equal(row(withoutTrace, 'memory').measured, 0);
  assert.equal(row(withoutTrace, 'energy').measured, withoutTrace.minEnergyWh);
  assert.equal(row(withoutTrace, 'peak-power').evidence?.code, 'MISSION_END');
});

test('a known reserve violation cannot turn into a pass at a rounded or recovered numeric boundary', () => {
  const crossing: MissionResult = {
    ...long, minEnergyWh: long.reserveWh, finalEnergyWh: 16, outcome: 'failure',
    violations: ['reserve'], events: long.events,
  };
  const requirement = row(crossing, 'energy');
  assert.equal(requirement.state, 'unmet');
  assert.equal(requirement.margin, 0);
  assert.equal(reviewRequirements(crossing).outcome, 'failure');
});

test('mass equality is inclusive and a genuinely greater raw value is not rounded into compliance', () => {
  const equality: MissionResult = { ...long, massKg: 3.6 };
  assert.equal(row(equality, 'mass').state, 'met');
  assert.equal(row(equality, 'mass').margin, 0);
  const above: MissionResult = { ...long, massKg: 3.6 + Number.EPSILON * 2 };
  assert.equal(row(above, 'mass').state, 'unmet');
  assert.ok(row(above, 'mass').margin! < 0);
  assert.equal(reviewRequirements(above).outcome, long.outcome, 'Diagnostic row states never rewrite the supplied engine outcome.');
});

test('actual memory loss is distinct from current queue occupancy and selects the real overflow event', () => {
  const overflow = simulateMission({ ...baseline, buffer: 'compact' }, 'long-contact');
  const requirement = row(overflow, 'memory');
  assert.equal(requirement.state, 'unmet');
  assert.equal(requirement.measured, 720);
  assert.equal(requirement.limit, 0);
  assert.equal(requirement.margin, -720);
  assert.equal(requirement.evidence, overflow.events.find(event => event.code === 'BUFFER_OVERFLOW'));
  assert.equal(overflow.queueBits, '0', 'An empty final queue does not erase lost lots.');
});

test('a rejected scientific record remains a science failure independently of delivery totals', () => {
  const rejected: MissionResult = {
    ...long, outcome: 'failure', violations: ['science'],
    observations: long.observations.map((observation, index) => index === 0 ? { ...observation, scienceValid: false, state: 'invalid', ndvi: null } : observation),
  };
  assert.equal(row(rejected, 'science-quality').state, 'unmet');
  assert.equal(row(rejected, 'science-quality').measured, 5);
  assert.equal(row(rejected, 'delivery').state, 'unmet', 'A complete-count claim cannot overrule invalid per-record evidence.');
  assert.equal(reviewRequirements(rejected).outcome, 'failure');
});

test('read-only review preserves serialized input and original evidence identities', () => {
  const before = JSON.stringify(invalidSix);
  const first = reviewRequirements(invalidSix);
  const second = reviewRequirements(invalidSix);
  assert.equal(JSON.stringify(invalidSix), before);
  assert.deepEqual(first, second);
  assert.ok(Object.isFrozen(first) && Object.isFrozen(first.rows));
  for (const requirement of first.rows) {
    assert.ok(Object.isFrozen(requirement));
    if (requirement.evidence) assert.ok(invalidSix.events.includes(requirement.evidence));
  }
});
