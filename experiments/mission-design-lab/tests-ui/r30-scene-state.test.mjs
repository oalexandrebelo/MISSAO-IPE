import test from 'node:test';
import assert from 'node:assert/strict';
import { getBrunoSceneState, getSceneSchedule } from '../src/ui/r30-scene-state.ts';
import { BRUNO_MISSIONS, BRUNO_INVENTORY_MODEL_VERSION, DEFAULT_BRUNO_CONFIG, simulateBrunoMission } from '../src/lab/bruno-missions.ts';
import { DEFAULT_CONFIG, getScenario } from '../src/core/catalog.ts';
import { DEFAULT_EXPEDITION_CONFIGS, getExpeditionSchedule } from '../src/lab/scientific-expeditions.ts';

function configFor(id) {
  return { ...DEFAULT_BRUNO_CONFIG, launcher: id === 'iss' ? 'compact' : 'heavy', energy: 'extended', protection: id === 'moon' ? 'light' : 'reinforced', navigation: id === 'iss' ? 'local' : 'deep-space', modelVersion: BRUNO_INVENTORY_MODEL_VERSION, loadout: BRUNO_MISSIONS[id].requiredInstruments.map(instrumentId => ({ instrumentId, usesRemaining: 3 })) };
}

test('assembly shows capacity without claiming energy, operation or future deliveries', () => {
  const config = configFor('iss'), result = simulateBrunoMission('iss', config);
  const state = getBrunoSceneState(config, undefined, result);
  assert.equal(state.capacityWh, 640); assert.equal(state.energyWh, null);
  assert.equal(state.generatedRecords, null); assert.equal(state.receivedRecords, null); assert.equal(state.deliveredRecords, null);
  assert.equal(state.plume, false); assert.equal(state.acquiring, false); assert.equal(state.transmitting, false);
  assert.equal(state.atDestination, false);
});

for (const id of ['iss', 'moon', 'mars', 'europa']) test(`${id}: revealed engine entries govern arrival, collection and reception separately`, () => {
  const config = configFor(id), result = simulateBrunoMission(id, config);
  assert.equal(result.timeline.length, 4);
  const [launch, transfer, acquisition, downlink] = result.timeline.map(event => getBrunoSceneState(config, event, result));
  assert.equal(launch.plume, true); assert.equal(launch.atDestination, false); assert.equal(launch.generatedRecords, null);
  assert.equal(launch.energyWh, result.initialEnergyWh);
  assert.equal(transfer.arrived, true); assert.equal(transfer.acquiring, false); assert.equal(transfer.energyWh, null, 'no invented intermediate battery reading');
  assert.equal(acquisition.generatedRecords, result.generatedRecords); assert.equal(acquisition.energyWh, result.finalEnergyWh);
  assert.equal(acquisition.receivedRecords, null); assert.equal(acquisition.deliveredRecords, null); assert.equal(acquisition.transmitting, false);
  assert.equal(downlink.receivedRecords, result.receivedRecords); assert.equal(downlink.deliveredRecords, result.deliveredRecords);
  assert.equal(downlink.transmitting, result.receivedRecords > 0);
});

test('a blocked launch never ignites, arrives or reveals a later collection', () => {
  const config = { ...configFor('europa'), launcher: 'compact' }, result = simulateBrunoMission('europa', config);
  assert.equal(result.outcome, 'invalid'); assert.equal(result.timeline.length, 1);
  const state = getBrunoSceneState(config, result.timeline[0], result);
  assert.equal(state.blocked, true); assert.equal(state.plume, false); assert.equal(state.arrived, false);
  assert.equal(state.generatedRecords, null); assert.equal(state.deliveredRecords, null);
});

test('received but scientifically invalid data still transmits; empty cargo does not emit acquisition', () => {
  const config = { ...configFor('iss'), protection: 'light' }, result = simulateBrunoMission('iss', config);
  assert.equal(result.deliveredRecords, 0); assert.ok(result.receivedRecords > 0);
  assert.equal(getBrunoSceneState(config, result.timeline.at(-1), result).transmitting, true);
  const empty = { ...configFor('iss'), loadout: [] }, emptyResult = simulateBrunoMission('iss', empty);
  const state = getBrunoSceneState(empty, emptyResult.timeline.find(event => event.phase === 'acquisition'), emptyResult);
  assert.equal(state.generatedRecords, 0); assert.equal(state.acquiring, false);
});

test('a phase without a matching engine entry cannot reveal counts or light an effect', () => {
  const config = configFor('iss'), result = simulateBrunoMission('iss', config);
  const event = { ...result.timeline.at(-1), timeS: 1 };
  const state = getBrunoSceneState(config, event, result);
  assert.equal(state.receivedRecords, null); assert.equal(state.transmitting, false); assert.equal(state.arrived, false);
});

test('Cerrado contact policy changes permission, while scenario changes actual scheduled width', () => {
  const all = getSceneSchedule({ world: 'earth', config: DEFAULT_CONFIG });
  const last = getSceneSchedule({ world: 'earth', config: { ...DEFAULT_CONFIG, policy: 'last-contact' } });
  assert.deepEqual(all.contacts.map(window => [window.start, window.end]), getScenario('long-contact').contacts);
  assert.deepEqual(last.contacts.map(window => window.permitted), [false, true]);
  assert.deepEqual(last.jobs, all.jobs);
  const short = getSceneSchedule({ world: 'earth', config: DEFAULT_CONFIG, scenarioId: 'short-contact' });
  assert.deepEqual(short.contacts.map(window => window.end - window.start), [240, 240]);
  assert.deepEqual(all.contacts.map(window => window.end - window.start), [600, 600]);
  assert.equal(short.launcher, 'fixed');
});

for (const world of ['bennu', 'telescope']) test(`${world}: near/far, contact duration and lifetime remain planned engine windows`, () => {
  for (const orbit of ['near', 'far']) for (const ground of ['short', 'extended']) {
    const config = { ...DEFAULT_EXPEDITION_CONFIGS[world], launch: 'science', orbit, ground, duration: 'short' };
    const expected = getExpeditionSchedule(world, config), actual = getSceneSchedule({ world, config });
    assert.deepEqual(actual.contacts.map(window => [window.start, window.end]), expected.contacts);
    assert.deepEqual(actual.jobs, expected.jobStartsS.map(start => [start, start + expected.jobDurationS]));
    assert.deepEqual(actual.sunlight, expected.sunlight);
    assert.equal(actual.lifetimeS, 7200); assert.equal(actual.horizonS, 10800);
    assert.equal(actual.contacts.at(-1).permitted, false);
    assert.equal(getSceneSchedule({ world, config: { ...config, duration: 'full' } }).contacts.at(-1).permitted, true);
  }
});
