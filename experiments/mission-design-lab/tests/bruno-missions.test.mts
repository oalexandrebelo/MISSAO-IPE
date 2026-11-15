import assert from 'node:assert/strict';
import test from 'node:test';
import { BRUNO_CHOICES, BRUNO_MISSIONS, DEFAULT_BRUNO_CONFIG, simulateBrunoMission, validateBrunoConfig } from '../src/lab/bruno-missions.ts';
import type { BrunoConfig, BrunoMissionId } from '../src/lab/bruno-missions.ts';

const iss = { ...DEFAULT_BRUNO_CONFIG, protection: 'reinforced' } satisfies BrunoConfig;
const moon = { ...iss, energy: 'extended', navigation: 'deep-space' } satisfies BrunoConfig;
const mars = { ...moon, launcher: 'heavy' } satisfies BrunoConfig;

test('valida as seis decisões no cliente e no recálculo servidor', () => {
  assert.equal(validateBrunoConfig(DEFAULT_BRUNO_CONFIG), true);
  assert.equal(validateBrunoConfig({ ...iss, payload: 'unknown' }), false);
  assert.equal(validateBrunoConfig({ ...iss, score: 100 }), false);
  assert.equal(validateBrunoConfig({ launcher: 'compact' }), false);
  assert.equal(validateBrunoConfig(null), false);
  assert.throws(() => simulateBrunoMission('iss', { ...iss, launcher: 'unknown' } as unknown as BrunoConfig), RangeError);
});

test('na ISS, a perda da calibração invalida as leituras recebidas', () => {
  const first = simulateBrunoMission('iss', DEFAULT_BRUNO_CONFIG);
  const redesigned = simulateBrunoMission('iss', iss);
  assert.equal(first.outcome, 'failure');
  assert.equal(first.receivedRecords, 6);
  assert.equal(first.deliveredRecords, 0);
  assert.equal(first.diagnostics[0]?.code, 'CALIBRATION_LOST');
  assert.equal(redesigned.outcome, 'success');
  assert.equal(redesigned.deliveredRecords, 6);
  assert.ok(redesigned.massKg > first.massKg && redesigned.credits > first.credits);
});

test('na Lua, energia insuficiente e enlace curto limitam etapas diferentes', () => {
  const weakEnergy = simulateBrunoMission('moon', { ...moon, energy: 'standard' });
  assert.equal(weakEnergy.outcome, 'failure');
  assert.ok(weakEnergy.diagnostics.some(diagnostic => diagnostic.code === 'ENERGY_WINDOW'));
  assert.ok(weakEnergy.generatedRecords < weakEnergy.requiredRecords);
  const weakLink = simulateBrunoMission('moon', { ...moon, navigation: 'local' });
  assert.equal(weakLink.outcome, 'failure');
  assert.equal(weakLink.generatedRecords, weakLink.requiredRecords);
  assert.ok(weakLink.receivedRecords < weakLink.generatedRecords);
  assert.ok(weakLink.diagnostics.some(diagnostic => diagnostic.code === 'CONTACT_CAPACITY'));
  assert.equal(simulateBrunoMission('moon', moon).outcome, 'success');
});

test('em Marte, capacidade, proteção de entrada e janela são limites verificáveis', () => {
  const heavyPayload = simulateBrunoMission('mars', { ...mars, launcher: 'compact' });
  assert.equal(heavyPayload.outcome, 'invalid');
  assert.equal(heavyPayload.diagnostics[0]?.code, 'MASS_LIMIT');
  assert.equal(heavyPayload.simulatedSeconds, 0);
  assert.equal(simulateBrunoMission('mars', { ...mars, protection: 'light' }).diagnostics[0]?.code, 'ENTRY_PROTECTION');
  assert.equal(simulateBrunoMission('mars', { ...mars, propulsion: 'electric' }).diagnostics[0]?.code, 'ARRIVAL_WINDOW');
  assert.equal(simulateBrunoMission('mars', mars).outcome, 'success');
});

test('todos os projetos conservam dados, cronologia e pontuação determinística', () => {
  const keys = Object.keys(BRUNO_CHOICES) as (keyof BrunoConfig)[];
  const configs = keys.reduce<BrunoConfig[]>((current, key) =>
    current.flatMap(config => BRUNO_CHOICES[key].map(option => ({ ...config, [key]: option.id }))), [DEFAULT_BRUNO_CONFIG]);
  for (const mission of Object.keys(BRUNO_MISSIONS) as BrunoMissionId[]) {
    const results = configs.map(config => {
      const result = simulateBrunoMission(mission, config);
      assert.deepEqual(result, simulateBrunoMission(mission, { ...config }));
      assert.ok(0 <= result.deliveredRecords && result.deliveredRecords <= result.receivedRecords);
      assert.ok(result.receivedRecords <= result.generatedRecords && result.generatedRecords <= result.requiredRecords);
      assert.ok(result.minEnergyWh >= 0 && result.minEnergyWh <= result.initialEnergyWh);
      assert.ok(0 <= result.score.total && result.score.total <= 100);
      assert.ok(result.timeline.every((entry, i) => entry.timeS >= (result.timeline[i - 1]?.timeS ?? 0)));
      assert.equal(result.timeline.at(-1)?.timeS, result.simulatedSeconds);
      return result;
    });
    assert.ok(results.some(r => r.outcome === 'success'), mission);
    assert.ok(results.some(r => r.outcome !== 'success'), mission);
  }
});
