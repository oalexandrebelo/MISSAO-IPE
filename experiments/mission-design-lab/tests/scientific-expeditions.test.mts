import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_EXPEDITION_CONFIGS, EXPEDITIONS, EXPEDITION_MODEL_VERSION, getExpeditionChoices, getExpeditionPreflight,
  getExpeditionVisualState, simulateExpedition,
} from '../src/lab/scientific-expeditions.ts';
import type { ExpeditionConfig, ExpeditionId } from '../src/lab/scientific-expeditions.ts';

const viable: Record<ExpeditionId, ExpeditionConfig> = {
  bennu: { launch: 'compact', orbit: 'near', duration: 'full', instrument: 'camera', power: 'extended', ground: 'extended' },
  telescope: { launch: 'science', orbit: 'far', duration: 'full', instrument: 'spectrometer', power: 'extended', ground: 'extended' },
};

test('results identify the exact expedition model independently of the design/report format', () => {
  assert.equal(EXPEDITION_MODEL_VERSION, 'ipe-expeditions-r18-v1');
  for (const id of ['bennu', 'telescope'] as const) assert.equal(simulateExpedition(id, viable[id]).modelVersion, EXPEDITION_MODEL_VERSION);
});

test('two scientific objectives declare six immutable archive records with provenance and units', () => {
  for (const id of ['bennu', 'telescope'] as const) {
    const metadata = EXPEDITIONS[id];
    assert.equal(metadata.dataFixture.length, 6);
    assert.equal(new Set(metadata.dataFixture.map(record => record.id)).size, 6);
    assert.ok(metadata.dataFixture.every(record => Number.isFinite(record.value) && record.unit && record.evidence.sourceUrl && record.goal));
    assert.match(metadata.dataNotice, /históricos reais/i);
    assert.ok(metadata.dataFixture.every(record => record.evidence.sourceRow && record.evidence.observedAt && record.evidence.limitations));
    assert.deepEqual(Object.keys(metadata.requirements).sort(), ['ground', 'launch', 'space', 'user']);
    const choices = getExpeditionChoices(id);
    assert.equal(Object.keys(choices).length, 6);
    assert.ok(Object.values(choices).every(items => items.length === 2));
    assert.ok(Object.isFrozen(metadata));
  }
  assert.notEqual(EXPEDITIONS.bennu.objective, EXPEDITIONS.telescope.objective);
  assert.notEqual(EXPEDITIONS.bennu.dataFixture[0]!.unit, EXPEDITIONS.telescope.dataFixture[0]!.unit);
});

test('both campaigns have a viable configuration delivering six valid observations', () => {
  for (const id of ['bennu', 'telescope'] as const) {
    const result = simulateExpedition(id, viable[id]);
    assert.equal(result.outcome, 'success', `${id}: ${JSON.stringify(result.constraints)}`);
    assert.equal(result.requiredRecords, 6);
    assert.equal(result.deliveredRecords, 6);
    assert.ok(result.constraints.every(item => item.met));
    assert.equal(result.completedAtS, 10_800);
  }
});

test('results are deterministic and freeze copied input without freezing the caller config', () => {
  const config = { ...viable.bennu };
  const first = simulateExpedition('bennu', config);
  assert.deepEqual(first, simulateExpedition('bennu', config));
  assert.ok(Object.isFrozen(first));
  assert.ok(Object.isFrozen(first.config));
  assert.ok(Object.isFrozen(first.observations));
  assert.ok(!Object.isFrozen(config));
  config.ground = 'short';
  assert.equal(first.config.ground, 'extended');
});

test('preflight checks instrument, launcher reach, mass and credits without executing a mission', () => {
  const config = { ...viable.telescope, launch: 'compact' } as const;
  const preflight = getExpeditionPreflight('telescope', config);
  assert.equal(preflight.constraints.length, 4);
  assert.equal(preflight.constraints.find(item => item.id === 'launch-orbit')!.met, false);
  assert.equal(preflight.constraints.find(item => item.id === 'mass')!.met, false);
  assert.equal(preflight.constraints.find(item => item.id === 'budget')!.met, false);
  assert.ok(!Object.hasOwn(preflight, 'deliveredRecords'));
  const result = simulateExpedition('telescope', config);
  assert.deepEqual(result.totals, preflight.totals);
  assert.equal(result.outcome, 'invalid');
  assert.match(result.events.find(event => event.code === 'LAUNCH_PROFILE')!.message, /incompatível com o perfil orbital/);
});

test('Webb reports measured mass and cost against the compact launcher limits', () => {
  const config = { ...DEFAULT_EXPEDITION_CONFIGS.telescope, power: 'extended', ground: 'extended' } as const;
  const result = simulateExpedition('telescope', config);
  assert.equal(result.outcome, 'invalid');
  assert.deepEqual(result.constraints.filter(item => !item.met).map(item => item.label), ['Massa dentro do envelope', 'Custo dentro do orçamento']);
  const failures = result.events.filter(event => event.severity === 'error' && event.timeS === 0);
  assert.deepEqual(failures.map(({ code, value, limit }) => ({ code, value, limit })), [
    { code: 'MASS_LIMIT', value: 3.2, limit: 3 },
    { code: 'BUDGET_LIMIT', value: 87, limit: 80 },
  ]);
  assert.match(failures[0]!.message, /3,2 kg excede o limite de 3 kg/);
  assert.match(failures[1]!.message, /87 créditos excede o orçamento de 80 créditos/);
});

test('incompatible instruments cannot turn a full downlink into valid scientific delivery', () => {
  for (const id of ['bennu', 'telescope'] as const) {
    const config: ExpeditionConfig = { ...viable[id], launch: 'science', instrument: id === 'bennu' ? 'spectrometer' : 'camera' };
    const result = simulateExpedition(id, config);
    assert.equal(result.outcome, 'invalid');
    assert.equal(result.deliveredRecords, 0);
    assert.ok(result.observations.every(record => !record.valid));
    assert.match(result.events.find(event => event.code === 'INSTRUMENT_MISMATCH')!.message, /não atende ao objetivo científico/);
    assert.deepEqual(getExpeditionVisualState(result, result.horizonS).deliveredRecordIds, []);
  }
});

test('extending contacts fixes the didactic Bennu downlink without changing its instrument or data', () => {
  const short = simulateExpedition('bennu', { ...viable.bennu, ground: 'short' });
  const extended = simulateExpedition('bennu', viable.bennu);
  assert.equal(short.outcome, 'failure');
  assert.ok(short.deliveredRecords < 6);
  assert.equal(extended.outcome, 'success');
  assert.deepEqual(short.observations.map(record => record.value), extended.observations.map(record => record.value));
  assert.ok(short.observations.some(record => record.downlinkedBits > 0 && record.deliveredAtS === null));
});

test('a shorter operating life can miss the final observations and contact while retaining the six-record goal', () => {
  for (const id of ['bennu', 'telescope'] as const) {
    const result = simulateExpedition(id, { ...viable[id], duration: 'short' });
    assert.equal(result.horizonS, 7200);
    assert.equal(result.requiredRecords, 6);
    assert.ok(result.deliveredRecords < 6);
    assert.equal(result.outcome, 'failure');
    assert.ok(result.observations.some(record => record.producedAtS === null));
  }
});

test('near and far orbits change observation/contact agendas and the compact launcher cannot select far', () => {
  for (const id of ['bennu', 'telescope'] as const) {
    const near = simulateExpedition(id, { ...viable[id], launch: 'science', orbit: 'near' });
    const far = simulateExpedition(id, { ...viable[id], launch: 'science', orbit: 'far' });
    assert.notDeepEqual(near.schedule.contacts, far.schedule.contacts);
    assert.notDeepEqual(near.schedule.jobStartsS, far.schedule.jobStartsS);
    assert.notDeepEqual(near.schedule.sunlight, far.schedule.sunlight);
    assert.equal(simulateExpedition(id, { ...viable[id], launch: 'compact', orbit: 'far' }).outcome, 'invalid');
  }
});

test('a record appears only once completely delivered, and rewinding never reveals future science', () => {
  const result = simulateExpedition('telescope', viable.telescope);
  const first = result.observations.find(record => record.deliveredAtS !== null)!;
  const arrival = first.deliveredAtS!;
  assert.deepEqual(getExpeditionVisualState(result, arrival - 0.001).deliveredRecordIds, []);
  assert.deepEqual(getExpeditionVisualState(result, arrival).deliveredRecordIds, [first.id]);
  assert.deepEqual(getExpeditionVisualState(result, 0).deliveredRecordIds, []);
  const event = result.events.find(item => item.code === 'RECORD_DELIVERED')!;
  assert.equal(getExpeditionVisualState(result, 0, event.id).focusSubsystem, null);
  const middle = getExpeditionVisualState(result, arrival - 0.001);
  assert.ok(middle.sourceStateTimeS! < arrival);
  assert.equal(middle.energyWh, result.trace.find(point => point.timeS === middle.sourceStateTimeS)!.energyWh);
});

test('insufficient discharge power terminates operation and cannot transmit later', () => {
  const result = simulateExpedition('telescope', DEFAULT_EXPEDITION_CONFIGS.telescope);
  assert.ok(result.events.some(event => event.code === 'PEAK_POWER'));
  assert.ok(result.completedAtS < result.horizonS);
  const later = getExpeditionVisualState(result, result.horizonS);
  assert.equal(later.mode, 'terminated');
  assert.equal(later.solarW, 0);
  assert.equal(later.loadW, 0);
  assert.equal(later.transmitting, false);
});

test('a long eclipse can exhaust the compact battery, stopping work and preserving received bits', () => {
  const result = simulateExpedition('bennu', { ...DEFAULT_EXPEDITION_CONFIGS.bennu, launch: 'science', orbit: 'far' });
  assert.ok(result.events.some(event => event.code === 'ENERGY_DEPLETED'));
  assert.equal(result.finalEnergyWh, 0);
  assert.equal(result.minEnergyWh, 0);
  assert.ok(result.completedAtS < result.horizonS);
  assert.ok(result.downlinkedBits > 0);
  assert.equal(result.energyBalance.residualWh, 0);
  assert.equal(getExpeditionVisualState(result, result.completedAtS).mode, 'terminated');
  assert.equal(getExpeditionVisualState(result, result.horizonS).downlinkedBits, result.downlinkedBits);
  assert.equal(getExpeditionVisualState(result, result.horizonS).transmitting, false);
});

test('the finite catalogs conserve watt-hours and integer bits for every configuration', () => {
  for (const id of ['bennu', 'telescope'] as const) {
    const choices = getExpeditionChoices(id);
    let configs: Record<string, string>[] = [{}];
    for (const [key, items] of Object.entries(choices)) configs = configs.flatMap(config => items.map(item => ({ ...config, [key]: item.id })));
    assert.equal(configs.length, 64);
    for (const config of configs) {
      const result = simulateExpedition(id, config as unknown as ExpeditionConfig);
      const balance = result.energyBalance;
      assert.equal(balance.residualWh, 0);
      assert.equal(balance.conversionLossWh, 0, 'This explicit ideal model applies no efficiency loss.');
      const residual = result.initialEnergyWh + balance.solarWh - balance.loadWh - balance.spillWh - result.finalEnergyWh;
      assert.ok(Math.abs(residual) < 1e-12);
      assert.equal(result.generatedBits, result.downlinkedBits + result.lostBits + result.queueBits);
      assert.ok(result.trace.every(point => Number.isSafeInteger(point.queueBits) && Number.isSafeInteger(point.downlinkedBits) && point.energyWh >= 0 && point.energyWh <= result.totals.capacityWh));
      assert.equal(result.generatedBits, result.observations.reduce((sum, record) => sum + record.generatedBits, 0));
      assert.equal(result.downlinkedBits, result.observations.reduce((sum, record) => sum + record.downlinkedBits, 0));
      assert.equal(result.lostBits, result.observations.reduce((sum, record) => sum + record.lostBits, 0));
      for (const record of result.observations) {
        assert.ok(record.downlinkedBits >= 0 && record.lostBits >= 0 && record.downlinkedBits + record.lostBits <= record.generatedBits);
        if (record.deliveredAtS !== null) assert.equal(record.downlinkedBits, record.generatedBits);
      }
    }
  }
});

test('visual projection preserves simultaneous events, start/end contacts and missing trace', () => {
  const result = simulateExpedition('bennu', viable.bennu);
  const [start, end] = result.schedule.contacts[0]!;
  assert.equal(getExpeditionVisualState(result, start - 0.01).contactAvailable, false);
  assert.equal(getExpeditionVisualState(result, start).contactAvailable, true);
  assert.equal(getExpeditionVisualState(result, end).contactAvailable, false);
  assert.equal(getExpeditionVisualState(result, end).transmitting, false);
  for (const event of result.events) assert.deepEqual(getExpeditionVisualState(result, event.timeS).eventsAtTime, result.events.filter(item => item.timeS === event.timeS));
  const absent = getExpeditionVisualState({ ...result, trace: [] }, 0);
  assert.equal(absent.available, false);
  assert.equal(absent.energyWh, null);
  assert.equal(absent.sourceStateTimeS, null);
  assert.throws(() => getExpeditionVisualState(result, NaN), RangeError);
});

test('unknown campaign or extra/unknown choices are rejected before simulation', () => {
  assert.throws(() => simulateExpedition('unknown' as ExpeditionId, viable.bennu), RangeError);
  assert.throws(() => simulateExpedition('bennu', { ...viable.bennu, orbit: 'moon' } as unknown as ExpeditionConfig), TypeError);
  assert.throws(() => simulateExpedition('bennu', { ...viable.bennu, extra: true } as unknown as ExpeditionConfig), TypeError);
});
