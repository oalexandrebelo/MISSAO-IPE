import assert from 'node:assert/strict';
import test from 'node:test';
import { CATALOG, CONFIG_KEYS, DEFAULT_CONFIG, getConfigTotals, getScenario, PHYSICS, SCENARIOS } from '../src/core/catalog.ts';
import type { MissionConfig, MissionResult, Scenario, ScienceRecord } from '../src/core/contracts.ts';
import { simulateMission, simulateMissionModel } from '../src/core/engine.ts';
import { cmp, q, sub, toNumber, ZERO } from '../src/core/exact.ts';
import { powerFlow } from '../src/core/power.ts';
import { enumerateConfigurations, evaluateConfigurations, hammingDistance, searchCatalog } from '../src/core/search.ts';
import { validateScienceRecord } from '../src/core/science.ts';
import { SCIENCE_RECORDS } from '../src/data/science-data.ts';

const baseline = { ...DEFAULT_CONFIG };
const witness: MissionConfig = { ...baseline, battery: 'large', processing: 'index' };
const fingerprint = (config: MissionConfig): string => CONFIG_KEYS.map(key => config[key]).join('|');
const fixture = (overrides: Partial<Scenario> = {}): Scenario => ({
  id: 'long-contact', title: 'Fixture de fronteira', description: 'Somente teste interno, fora do catálogo jogável.',
  horizonS: 6_000, sunlight: [], contacts: [], jobStartsS: [], jobDurationS: 60, budget: 100, maxMassKg: 10, ...overrides,
});

function assertConservation(result: MissionResult): void {
  const generated = BigInt(result.generatedBits);
  const downlinked = BigInt(result.downlinkedBits);
  const lost = BigInt(result.lostBits);
  const queued = BigInt(result.queueBits);
  assert.equal(generated, downlinked + lost + queued);
  assert.equal(generated, result.observations.reduce((sum, observation) => sum + BigInt(observation.generatedBits), 0n));
  assert.equal(downlinked, result.observations.reduce((sum, observation) => sum + BigInt(observation.downlinkedBits), 0n));
  assert.equal(lost, result.observations.reduce((sum, observation) => sum + BigInt(observation.lostBits), 0n));
  assert.equal(result.energyBalance.residualWh, 0, 'Internal exact ledger must close, with no eligibility epsilon.');
  const { solarWh, loadWh, conversionLossWh, spillWh } = result.energyBalance;
  const displayResidual = result.initialEnergyWh + solarWh - loadWh - conversionLossWh - spillWh - result.finalEnergyWh;
  // Output numbers are IEEE doubles; this checks serialization rounding only.
  assert.ok(Math.abs(displayResidual) <= 32 * Number.EPSILON * Math.max(1, solarWh, loadWh));
  const capacity = CATALOG.battery.find(item => item.id === result.config.battery)!.capacityWh!;
  const buffer = CATALOG.buffer.find(item => item.id === result.config.buffer)!.capacityBits!;
  let previousTime = -1;
  let previousDownlink = 0;
  for (const point of result.trace) {
    assert.ok(point.timeS > previousTime);
    assert.ok(point.timeS <= result.completedAtS);
    assert.ok(Number.isFinite(point.energyWh) && point.energyWh >= 0 && point.energyWh <= capacity);
    assert.ok(Number.isSafeInteger(point.queueBits) && point.queueBits >= 0 && point.queueBits <= buffer);
    assert.ok(Number.isSafeInteger(point.downlinkedBits) && point.downlinkedBits >= previousDownlink);
    previousTime = point.timeS;
    previousDownlink = point.downlinkedBits;
  }
  assert.equal(result.trace[0]?.timeS, 0);
  assert.equal(result.trace.at(-1)?.timeS, result.completedAtS);
  for (const observation of result.observations) {
    assert.ok(BigInt(observation.downlinkedBits) + BigInt(observation.lostBits) <= BigInt(observation.generatedBits));
    if (observation.state === 'delivered') {
      assert.equal(observation.generatedBits, observation.downlinkedBits);
      assert.equal(observation.lostBits, '0');
      assert.ok(observation.scienceValid && observation.ndvi !== null && observation.deliveredAtS !== null);
    }
  }
  assert.equal(new Set(result.events.map(event => event.id)).size, result.events.length);
}

test('catalog is exactly 64 unique six-choice tuples with independent values', () => {
  const all = enumerateConfigurations();
  assert.equal(all.length, 64);
  assert.equal(new Set(all.map(fingerprint)).size, 64);
  for (const key of CONFIG_KEYS) assert.equal(new Set(all.map(config => config[key])).size, 2);
  all[0]!.battery = 'large';
  assert.equal(enumerateConfigurations()[0]!.battery, 'small');
  assert.ok(Object.isFrozen(CATALOG) && Object.isFrozen(DEFAULT_CONFIG) && Object.isFrozen(SCENARIOS[0]!.contacts[0]));
  assert.deepEqual(getConfigTotals(baseline), { massKg: 3.05, credits: 71 });
});

test('all 64 configurations in both scenarios conserve exact bits and energy', () => {
  for (const config of enumerateConfigurations()) {
    for (const scenario of SCENARIOS) assertConservation(simulateMission(config, scenario.id));
  }
});

test('baseline long contacts succeeds, while short contacts deliver only two complete records', () => {
  const long = simulateMission(baseline, 'long-contact');
  assert.equal(long.outcome, 'success');
  assert.equal(long.deliveredRecords, 6);
  assert.equal(long.generatedBits, '1080000000');
  assert.equal(long.downlinkedBits, long.generatedBits);
  assert.equal(long.completedAtS, 10_800);
  assert.deepEqual(long.observations.map(observation => observation.deliveredAtS), [5587.5, 5775, 5962.5, 9150, 9337.5, 9525]);
  const short = simulateMission(baseline, 'short-contact');
  assert.equal(short.outcome, 'failure');
  assert.equal(short.deliveredRecords, 2);
  assert.deepEqual(short.violations, ['delivery']);
  assert.equal(short.downlinkedBits, '460800000');
  assert.equal(short.queueBits, '619200000');
  assert.equal(short.lostBits, '0');
});

test('contact service is FIFO, preserves partial records, and becomes idle when empty', () => {
  const short = simulateMission(baseline, 'short-contact');
  assert.equal(short.trace.find(point => point.timeS === 5_640)!.downlinkedBits, 230_400_000);
  assert.equal(short.trace.find(point => point.timeS === 5_640)!.mode, 'idle');
  assert.equal(short.observations[1]!.deliveredAtS, 9_135);
  assert.equal(short.observations[2]!.state, 'partial');
  assert.equal(short.observations[2]!.downlinkedBits, '100800000');
  assert.equal(short.observations[2]!.ndvi, null);
  const long = simulateMission(baseline, 'long-contact');
  const drained = long.trace.find(point => point.timeS === 9_525)!;
  assert.equal(drained.mode, 'idle');
  assert.equal(drained.loadW, 8);
  assert.equal(drained.queueBits, 0);
});

test('jobs produce only complete batches and overflow loses the entire newest batch', () => {
  const result = simulateMission({ ...baseline, buffer: 'compact' }, 'long-contact');
  assert.equal(result.generatedBits, '1080000000');
  assert.equal(result.downlinkedBits, '360000000');
  assert.equal(result.lostBits, '720000000');
  assert.equal(result.queueBits, '0');
  assert.equal(result.events.filter(event => event.code === 'BUFFER_OVERFLOW').length, 4);
  assert.deepEqual(result.observations.map(observation => observation.producedAtS), [660, 1260, 1860, 2460, 3060, 3660]);
  assert.deepEqual(result.observations.map(observation => observation.state), ['delivered', 'delivered', 'lost', 'lost', 'lost', 'lost']);
  assert.equal(result.trace.find(point => point.timeS === 600)!.queueBits, 0);
  assert.equal(result.trace.find(point => point.timeS === 660)!.queueBits, 180_000_000);
});

test('INDEX alone, FAST alone, and compact panel alone have terminal battery-side peak failures', () => {
  for (const [change, terminalAt, generated] of [
    [{ processing: 'index' }, 600, '0'],
    [{ radio: 'fast' }, 5400, '1080000000'],
    [{ panel: 'compact' }, 600, '0'],
  ] as const) {
    const result = simulateMission({ ...baseline, ...change }, 'short-contact');
    assert.equal(result.outcome, 'failure');
    assert.ok(result.violations.includes('peak-power'));
    assert.equal(result.completedAtS, terminalAt);
    assert.equal(result.generatedBits, generated);
    assert.equal(result.downlinkedBits, '0');
    assert.ok(result.events.every(event => event.timeS <= terminalAt));
    assert.equal(result.trace.at(-1)!.mode, 'terminated');
    const peak = result.events.find(event => event.code === 'PEAK_POWER')!;
    assert.ok(peak.value! > peak.limit!);
  }
  const peak = simulateMission({ ...baseline, panel: 'compact' }, 'short-contact').events.find(event => event.code === 'PEAK_POWER')!;
  assert.equal(peak.value, 1940 / 95, '19.4 W at the bus divided by 0.95, rounded only when serialized.');
});

test('static validation reports both mass and budget; equality at 3.6 kg is not rejected', () => {
  const invalid = simulateMission({ ...witness, radio: 'fast' }, 'short-contact');
  assert.equal(invalid.outcome, 'invalid');
  assert.ok(invalid.violations.includes('mass') && invalid.violations.includes('budget'));
  assert.equal(invalid.massKg, 3.75);
  assert.equal(invalid.credits, 91);
  assert.equal(invalid.deliveredRecords, 6, 'Physical diagnostics still run for statically invalid tuples.');
  const boundary = simulateMission({ ...baseline, battery: 'large', radio: 'fast', buffer: 'compact' }, 'long-contact');
  assert.equal(boundary.massKg, 3.6);
  assert.ok(!boundary.violations.includes('mass'));
});

test('battery saturation records discarded energy without exceeding capacity', () => {
  const result = simulateMissionModel(baseline, fixture({ horizonS: 3600, sunlight: [[0, 3600]] }), []);
  assert.equal(result.finalEnergyWh, 16);
  assert.equal(result.energyBalance.solarWh, 15.3);
  assert.equal(result.energyBalance.loadWh, 8);
  assert.ok(result.energyBalance.spillWh > 3.9);
  assert.equal(result.events.filter(event => event.code === 'BATTERY_FULL').length, 1);
  assertConservation(result);
});

test('charge limiter accepts at most 10 W of input and accounts for conversion and spill', () => {
  const flow = powerFlow(q(30), q(8), q(8), q(16), q(PHYSICS.maxChargeInputW), q(95, 100));
  assert.equal(toNumber(flow.chargeInput), 10);
  assert.equal(toNumber(flow.change), 9.5);
  assert.equal(toNumber(flow.loss), 0.5);
  assert.equal(toNumber(flow.spill), 12);
  assert.equal(cmp(sub(sub(sub(flow.solar, flow.load), flow.loss), flow.spill), flow.change), 0);
  const full = powerFlow(q(30), q(8), q(16), q(16), q(10), q(95, 100));
  assert.equal(toNumber(full.chargeInput), 0);
  assert.equal(toNumber(full.spill), 22);
  assert.equal(cmp(full.loss, ZERO), 0);
  const discharging = powerFlow(q(0), q(19), q(16), q(16), q(10), q(95, 100));
  assert.equal(toNumber(discharging.discharge), 20);
  assert.equal(toNumber(discharging.loss), 1);
});

test('reserve is inclusive; crossing it records a failure while keeping the later trace', () => {
  const equality = simulateMissionModel(baseline, fixture({ horizonS: 4446 }), []);
  assert.equal(equality.finalEnergyWh, 2.4);
  assert.equal(equality.outcome, 'success');
  assert.ok(!equality.violations.includes('reserve'));
  const crossed = simulateMissionModel(baseline, fixture({ horizonS: 5000 }), []);
  assert.equal(crossed.outcome, 'failure');
  assert.deepEqual(crossed.violations, ['reserve']);
  assert.equal(crossed.completedAtS, 5000);
  assert.equal(crossed.events.find(event => event.code === 'RESERVE_BREACH')!.timeS, 4446);
  assert.ok(crossed.trace.some(point => point.timeS > 4446 && point.energyWh < 2.4));
});

test('depleted energy ends operation at the exact boundary and never becomes negative', () => {
  const result = simulateMissionModel(baseline, fixture(), []);
  assert.equal(result.completedAtS, 5472);
  assert.equal(result.finalEnergyWh, 0);
  assert.equal(result.energyBalance.loadWh, 12.16);
  assert.equal(result.energyBalance.conversionLossWh, 0.64);
  assert.deepEqual(result.violations, ['reserve', 'energy-depleted']);
  assert.ok(result.trace.every(point => point.energyWh >= 0));
  assertConservation(result);
});

test('a complete job at contact start and last bit at contact end count at their exact boundaries', () => {
  const model = fixture({ horizonS: 86, sunlight: [[0, 60]], contacts: [[60, 85]], jobStartsS: [0] });
  const result = simulateMissionModel({ ...witness, radio: 'fast' }, model, [SCIENCE_RECORDS[0]!]);
  assert.equal(result.outcome, 'success');
  assert.equal(result.observations[0]!.producedAtS, 60);
  assert.equal(result.observations[0]!.deliveredAtS, 85);
  assert.equal(result.downlinkedBits, '60000000');
  assert.equal(result.trace.find(point => point.timeS === 60)!.mode, 'transmitting');
  const delivered = result.events.findIndex(event => event.code === 'RECORD_DELIVERED');
  const contactEnd = result.events.findIndex(event => event.code === 'CONTACT_END');
  assert.ok(delivered >= 0 && contactEnd > delivered);
});

test('power depletion during a transmission conserves the partially received payload', () => {
  const model = fixture({ sunlight: [[0, 60]], contacts: [[5301, 5500]], jobStartsS: [0] });
  const result = simulateMissionModel(baseline, model, [SCIENCE_RECORDS[0]!]);
  assert.equal(result.completedAtS, 5356.125);
  assert.equal(result.downlinkedBits, '52920000');
  assert.equal(result.queueBits, '127080000');
  assert.equal(result.observations[0]!.state, 'partial');
  assert.equal(result.observations[0]!.ndvi, null);
  assertConservation(result);
});

test('operational policy is chosen in advance and never opens a skipped first contact', () => {
  const result = simulateMission({ ...witness, policy: 'last-contact' }, 'short-contact');
  assert.equal(result.outcome, 'failure');
  assert.equal(result.downlinkedBits, '230400000');
  assert.equal(result.deliveredRecords, 3);
  assert.equal(result.trace.find(point => point.timeS === 5400)!.mode, 'idle');
  assert.ok(result.events.some(event => event.code === 'CONTACT_SKIPPED' && event.timeS === 5400));
});

test('six archived records pass the declared QA and both representations answer the identical NDVI question', () => {
  for (const record of SCIENCE_RECORDS) {
    const checked = validateScienceRecord(record);
    assert.equal(checked.valid, true);
    assert.deepEqual(checked.reasons, []);
    assert.equal(checked.ndvi, (record.nirInteger - record.redInteger) / (record.nirInteger + record.redInteger));
  }
  const bands = simulateMission(baseline, 'long-contact');
  const index = simulateMission(witness, 'short-contact');
  assert.equal(index.outcome, 'success');
  assert.deepEqual(bands.observations.map(observation => observation.ndvi), index.observations.map(observation => observation.ndvi));
});

test('MODLAND, usefulness, aerosol, cloud, water, snow, shadow and reliability masks all affect scientific validity', () => {
  const record = SCIENCE_RECORDS[0]!;
  const cases: [Partial<ScienceRecord>, string][] = [
    [{ viQuality: record.viQuality | 1 }, 'qa:modland'],
    [{ viQuality: (record.viQuality & ~(15 << 2)) | (15 << 2) }, 'qa:usefulness'],
    [{ viQuality: record.viQuality | (3 << 6) }, 'qa:aerosol'],
    [{ viQuality: record.viQuality | (1 << 8) }, 'qa:adjacent-cloud'],
    [{ viQuality: record.viQuality | (1 << 10) }, 'qa:mixed-cloud'],
    [{ viQuality: record.viQuality & ~(7 << 11) }, 'qa:land-water'],
    [{ viQuality: record.viQuality | (1 << 14) }, 'qa:snow-ice'],
    [{ viQuality: record.viQuality | (1 << 15) }, 'qa:shadow'],
    [{ pixelReliability: 1 }, 'qa:pixel-reliability'],
    [{ viQuality: 65535 }, 'qa:range-or-fill'],
  ];
  for (const [change, reason] of cases) {
    const checked = validateScienceRecord({ ...record, ...change });
    assert.equal(checked.valid, false);
    assert.equal(checked.ndvi, null);
    assert.ok(checked.reasons.includes(reason));
  }
});

test('invalid reflectance, denominator, scale, NDVI and dates remain invalid rather than becoming zero', () => {
  const record = SCIENCE_RECORDS[0]!;
  for (const change of [
    { redInteger: -1000 }, { nirInteger: 10001 }, { redInteger: NaN }, { nirInteger: Infinity },
    { redInteger: 0, nirInteger: 0 }, { scale: 1 }, { offset: 1 }, { ndviProduct: -0.3 },
    { ndviProduct: 0.7 }, { ndviProduct: record.ndviProduct + 0.00000000000001 },
    { observationDate: '2024-10-01' }, { compositeStart: '2024-02-30' }, { modisDate: 'A2024001' },
  ]) {
    const checked = validateScienceRecord({ ...record, ...change });
    assert.equal(checked.valid, false);
    assert.equal(checked.ndvi, null);
  }
});

test('a fully transmitted QA-rejected record cannot satisfy the science objective', () => {
  const bad = { ...SCIENCE_RECORDS[0]!, viQuality: SCIENCE_RECORDS[0]!.viQuality | (1 << 10) };
  const model = fixture({ horizonS: 300, sunlight: [[0, 60]], contacts: [[60, 300]], jobStartsS: [0] });
  const result = simulateMissionModel(baseline, model, [bad]);
  assert.equal(result.downlinkedBits, '180000000');
  assert.equal(result.deliveredRecords, 0);
  assert.equal(result.observations[0]!.state, 'invalid');
  assert.equal(result.observations[0]!.ndvi, null);
  assert.ok(result.violations.includes('science') && result.violations.includes('delivery'));
});

test('exhaustive certificate has one minimum-distance-two short-contact witness and decides every smaller design', () => {
  const long = searchCatalog(baseline, 'long-contact');
  assert.deepEqual([long.total, long.evaluated, long.invalid, long.successful, long.failed, long.indeterminate], [64, 64, 6, 17, 41, 0]);
  assert.equal(long.minimumDistance, 0);
  const short = searchCatalog(baseline, 'short-contact');
  assert.deepEqual([short.total, short.evaluated, short.invalid, short.successful, short.failed, short.indeterminate], [64, 64, 6, 9, 49, 0]);
  assert.equal(short.complete, true);
  assert.equal(short.minimumDistance, 2);
  assert.deepEqual(short.best.map(candidate => candidate.config), [witness]);
  const smaller = enumerateConfigurations().filter(config => hammingDistance(config, baseline) < 2);
  assert.equal(smaller.length, 7);
  for (const config of smaller) assert.notEqual(simulateMission(config, 'short-contact').outcome, 'success');
});

test('search order does not alter results; errors or incomplete evaluation remove the minimum certificate', () => {
  const expected = searchCatalog(baseline, 'short-contact');
  const reverse = evaluateConfigurations(baseline, 'short-contact', enumerateConfigurations().reverse(), simulateMission);
  assert.deepEqual(reverse, expected);
  const failed = evaluateConfigurations(baseline, 'short-contact', enumerateConfigurations(), (config, scenarioId) => {
    if (fingerprint(config) === fingerprint(baseline)) throw new Error('Intentional test fault.');
    return simulateMission(config, scenarioId);
  });
  assert.equal(failed.evaluated, 63);
  assert.equal(failed.indeterminate, 1);
  assert.equal(failed.complete, false);
  assert.equal(failed.minimumDistance, null);
  assert.deepEqual(failed.best, []);
  const incomplete = evaluateConfigurations(baseline, 'short-contact', enumerateConfigurations().slice(1), simulateMission);
  assert.equal(incomplete.complete, false);
  assert.equal(incomplete.minimumDistance, null);
  assert.deepEqual(incomplete.best, []);
  const duplicates = evaluateConfigurations(baseline, 'short-contact', [...enumerateConfigurations(), baseline], simulateMission);
  assert.equal(duplicates.complete, false);
  assert.equal(duplicates.minimumDistance, null);
});

test('same inputs are reproducible in this runtime and trace suppression cannot change physics', () => {
  const first = simulateMission(witness, 'short-contact');
  const second = simulateMission(witness, 'short-contact');
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  const noTrace = simulateMission(witness, 'short-contact', { trace: false });
  assert.deepEqual(noTrace, { ...first, trace: [] });
});

test('unknown choices/scenarios and malformed model clocks fail explicitly', () => {
  assert.throws(() => simulateMission({ ...baseline, panel: 'unknown' } as unknown as MissionConfig, 'long-contact'), TypeError);
  assert.throws(() => simulateMission({ ...baseline, injected: true } as unknown as MissionConfig, 'long-contact'), TypeError);
  assert.throws(() => simulateMission(null as unknown as MissionConfig, 'long-contact'), TypeError);
  assert.throws(() => getScenario('unknown' as never), RangeError);
  assert.throws(() => simulateMissionModel(baseline, fixture({ horizonS: 0 }), []), RangeError);
  assert.throws(() => simulateMissionModel(baseline, fixture({ jobStartsS: [0], contacts: [[0, 60]] }), [SCIENCE_RECORDS[0]!]), RangeError);
});
