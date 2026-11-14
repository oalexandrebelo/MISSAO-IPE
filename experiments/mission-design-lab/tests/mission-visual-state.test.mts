import assert from 'node:assert/strict';
import test from 'node:test';
import { CATALOG, DEFAULT_CONFIG, getScenario } from '../src/core/catalog.ts';
import type { MissionResult } from '../src/core/contracts.ts';
import { simulateMission, simulateMissionModel } from '../src/core/engine.ts';
import { SCIENCE_RECORDS } from '../src/data/science-data.ts';
import { getMissionVisualState } from '../src/lab/mission-visual-state.ts';

const long = simulateMission({ ...DEFAULT_CONFIG }, 'long-contact');
const short = simulateMission({ ...DEFAULT_CONFIG }, 'short-contact');
const witness = simulateMission({ ...DEFAULT_CONFIG, battery: 'large', processing: 'index' }, 'short-contact');
const terminated = simulateMission({ ...DEFAULT_CONFIG, processing: 'index' }, 'short-contact');

test('an intermediate time holds the preceding recorded state without interpolation or look-ahead', () => {
  const point = long.trace.find(item => item.timeS === 600)!;
  const state = getMissionVisualState(long, 659.75);
  assert.equal(state.available, true);
  assert.equal(state.timeS, 659.75);
  assert.equal(state.sourceStateTimeS, 600);
  assert.equal(state.progress, 659.75 / 10_800);
  assert.equal(state.energyWh, point.energyWh);
  assert.equal(state.queueBits, point.queueBits);
  assert.equal(state.downlinkedBits, point.downlinkedBits);
  assert.equal(state.solarW, point.solarW);
  assert.equal(state.loadW, point.loadW);
  assert.equal(state.mode, 'processing');
  assert.deepEqual(state.eventsAtTime, []);
  assert.deepEqual(state.deliveredRecordIds, []);
});

test('fractions use the executed battery and memory capacities from the catalog', () => {
  for (const result of [long, witness]) {
    const state = getMissionVisualState(result, 3660);
    const battery = CATALOG.battery.find(item => item.id === result.config.battery)!;
    const buffer = CATALOG.buffer.find(item => item.id === result.config.buffer)!;
    assert.equal(state.energyFraction, state.energyWh! / battery.capacityWh!);
    assert.equal(state.queueFraction, state.queueBits! / buffer.capacityBits!);
  }
  assert.equal(getMissionVisualState(long, 3660).queueBits, 1_080_000_000);
  assert.equal(getMissionVisualState(witness, 3660).queueBits, 360_000_000);
});

test('sunlight and contact boundaries are start-inclusive and end-exclusive', () => {
  const boundaries = [
    [5399.999, true, false], [5400, false, true], [5639.999, false, true],
    [5640, false, false], [7199.999, false, false], [7200, true, false],
    [8999.999, true, false], [9000, false, true], [9240, false, false],
  ] as const;
  for (const [timeS, illuminated, contactAvailable] of boundaries) {
    const state = getMissionVisualState(short, timeS);
    assert.equal(state.illuminated, illuminated, `sunlight at ${timeS}`);
    assert.equal(state.contactAvailable, contactAvailable, `contact at ${timeS}`);
  }
  assert.equal(getMissionVisualState(short, 5400).solarW, 0);
  assert.ok(getMissionVisualState(short, 7200).solarW! > 0);
  assert.equal(getMissionVisualState(short, 5400).transmitting, true);
  assert.equal(getMissionVisualState(short, 5640).transmitting, false);
});

test('an available window is not a transmission when policy skips it or the queue is empty', () => {
  const skipped = simulateMission({ ...DEFAULT_CONFIG, policy: 'last-contact' }, 'short-contact');
  const state = getMissionVisualState(skipped, 5400);
  assert.equal(state.contactAvailable, true);
  assert.equal(state.mode, 'idle');
  assert.equal(state.transmitting, false);
  const empty = getMissionVisualState(witness, 9200);
  assert.equal(empty.contactAvailable, true);
  assert.equal(empty.queueBits, 0);
  assert.equal(empty.transmitting, false);
});

test('fractional reception times expose a record only at its complete valid delivery', () => {
  const first = long.observations[0]!;
  assert.equal(first.deliveredAtS, 5587.5);
  const before = getMissionVisualState(long, 5587.499);
  assert.equal(before.sourceStateTimeS, 5400);
  assert.deepEqual(before.deliveredRecordIds, []);
  const arrived = getMissionVisualState(long, 5587.5);
  assert.equal(arrived.sourceStateTimeS, 5587.5);
  assert.equal(arrived.downlinkedBits, 180_000_000);
  assert.deepEqual(arrived.deliveredRecordIds, [first.id]);
  assert.ok(arrived.eventsAtTime.some(event => event.code === 'RECORD_DELIVERED' && event.recordId === first.id));
});

test('closing a contact preserves partial reception without promoting it to delivered science', () => {
  const endFirst = getMissionVisualState(short, 5640);
  assert.equal(endFirst.downlinkedBits, 230_400_000);
  assert.equal(endFirst.queueBits, 849_600_000);
  assert.deepEqual(endFirst.deliveredRecordIds, [short.observations[0]!.id]);
  assert.equal(endFirst.transmitting, false);
  const endSecond = getMissionVisualState(short, 9240);
  assert.equal(endSecond.downlinkedBits, 460_800_000);
  assert.deepEqual(endSecond.deliveredRecordIds, short.observations.slice(0, 2).map(item => item.id));
  assert.equal(short.observations[2]!.state, 'partial');
  assert.ok(!endSecond.deliveredRecordIds.includes(short.observations[2]!.id));
});

test('terminal states stay terminal even during a later illuminated or contact interval', () => {
  assert.equal(terminated.completedAtS, 600);
  for (const timeS of [600, 7200, 9000]) {
    const state = getMissionVisualState(terminated, timeS);
    assert.equal(state.sourceStateTimeS, 600);
    assert.equal(state.mode, 'terminated');
    assert.equal(state.solarW, 0);
    assert.equal(state.loadW, 0);
    assert.equal(state.transmitting, false);
    assert.deepEqual(state.deliveredRecordIds, []);
  }
  assert.equal(getMissionVisualState(terminated, 7200).illuminated, true);
  assert.equal(getMissionVisualState(terminated, 9000).contactAvailable, true);
});

test('all simultaneous events survive in original order, including a terminal boundary', () => {
  for (const [result, timeS] of [[long, 5400], [terminated, 600]] as const) {
    const expected = result.events.filter(event => event.timeS === timeS);
    assert.ok(expected.length > 1);
    const actual = getMissionVisualState(result, timeS).eventsAtTime;
    assert.deepEqual(actual, expected);
    actual.forEach((event, index) => assert.equal(event, expected[index]));
  }
});

test('selected evidence highlights an involved subsystem without moving time or leaking future events', () => {
  const eclipse = long.events.find(event => event.code === 'SUNLIGHT_END')!;
  assert.equal(getMissionVisualState(long, 100, eclipse.id).focusSubsystem, null);
  const selected = getMissionVisualState(long, 5400, eclipse.id);
  assert.equal(selected.timeS, 5400);
  assert.equal(selected.focusSubsystem, 'panel');
  const peak = terminated.events.find(event => event.code === 'PEAK_POWER')!;
  assert.equal(getMissionVisualState(terminated, 600, peak.id).focusSubsystem, 'battery');
  const shortfall = short.events.find(event => event.code === 'DELIVERY_SHORTFALL')!;
  assert.equal(getMissionVisualState(short, shortfall.timeS, shortfall.id).focusSubsystem, null);
  assert.deepEqual(getMissionVisualState(long, 100, eclipse.id).eventsAtTime, []);
});

test('completely received but scientifically rejected records are not valid deliveries', () => {
  const records = SCIENCE_RECORDS.map((record, index) => index === 0 ? { ...record, viQuality: record.viQuality | (1 << 10) } : record);
  const result = simulateMissionModel({ ...DEFAULT_CONFIG }, getScenario('long-contact'), records);
  assert.equal(result.observations[0]!.state, 'invalid');
  assert.equal(result.observations[0]!.deliveredAtS, 5587.5);
  const state = getMissionVisualState(result, 10_800);
  assert.equal(state.deliveredRecordIds.length, 5);
  assert.ok(!state.deliveredRecordIds.includes(result.observations[0]!.id));
});

test('missing trace yields unavailable readings, not final totals or fabricated zero measurements', () => {
  const noTrace = simulateMission({ ...DEFAULT_CONFIG }, 'long-contact', { trace: false });
  const state = getMissionVisualState(noTrace, 5400);
  assert.equal(state.available, false);
  assert.equal(state.sourceStateTimeS, null);
  for (const key of ['energyWh', 'energyFraction', 'queueBits', 'queueFraction', 'downlinkedBits', 'solarW', 'loadW', 'mode'] as const) assert.equal(state[key], null);
  assert.equal(state.transmitting, false);
  assert.deepEqual(state.deliveredRecordIds, []);
  assert.deepEqual(state.eventsAtTime, noTrace.events.filter(event => event.timeS === 5400));
  const futureOnly: MissionResult = { ...long, trace: long.trace.filter(point => point.timeS > 100) };
  assert.equal(getMissionVisualState(futureOnly, 100).available, false);
});

test('finite requests clamp to the scenario horizon and nonfinite requests are rejected', () => {
  assert.equal(getMissionVisualState(long, -10).timeS, 0);
  assert.equal(getMissionVisualState(long, 20_000).timeS, 10_800);
  assert.equal(getMissionVisualState(long, 20_000).progress, 1);
  for (const value of [NaN, Infinity, -Infinity]) assert.throws(() => getMissionVisualState(long, value), RangeError);
});

test('each state remains an exact projection of its own trace and never mutates the result', () => {
  for (const result of [long, short, witness, terminated]) {
    const before = JSON.stringify(result);
    for (const point of result.trace) {
      const state = getMissionVisualState(result, point.timeS);
      assert.equal(state.sourceStateTimeS, point.timeS);
      for (const key of ['energyWh', 'queueBits', 'downlinkedBits', 'solarW', 'loadW', 'mode'] as const) assert.equal(state[key], point[key]);
      assert.ok(state.energyFraction! >= 0 && state.energyFraction! <= 1);
      assert.ok(state.queueFraction! >= 0 && state.queueFraction! <= 1);
      assert.ok(state.deliveredRecordIds.every(id => result.observations.some(record => record.id === id && record.deliveredAtS !== null && record.deliveredAtS <= state.timeS)));
    }
    assert.equal(JSON.stringify(result), before);
  }
});
