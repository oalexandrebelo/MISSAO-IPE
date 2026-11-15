import assert from 'node:assert/strict';
import test from 'node:test';
import { describeBrunoComparison, readBrunoDraft } from '../src/lab/bruno-flight-plan.ts';
import { BRUNO_MODEL_VERSION, DEFAULT_BRUNO_CONFIG, simulateBrunoMission } from '../src/lab/bruno-missions.ts';

test('A/B explica a calibração da ISS sem confundir entrega com validade', () => {
  const a = simulateBrunoMission('iss', DEFAULT_BRUNO_CONFIG);
  const b = simulateBrunoMission('iss', { ...DEFAULT_BRUNO_CONFIG, protection: 'reinforced' });
  const comparison = describeBrunoComparison(a, b);
  assert.equal(a.receivedRecords, b.receivedRecords);
  assert.deepEqual(comparison.changes.map(c => c.key), ['protection']);
  assert.match(comparison.explanation, /6 registros válidos a mais/);
  assert.equal(comparison.rows.find(r => r.label === 'Massa')!.b - a.massKg, 20);
  assert.match(describeBrunoComparison(a, a).explanation, /iguais/);
  assert.match(describeBrunoComparison(a, simulateBrunoMission('iss', { ...b.config, energy: 'extended' })).explanation, /isolar a causa/);
});

test('rascunhos aceitam somente configuração e versão válidas e descartam score e dados extras', () => {
  const value = { modelVersion: BRUNO_MODEL_VERSION, config: DEFAULT_BRUNO_CONFIG, baseline: DEFAULT_BRUNO_CONFIG, phase: 'hangar', resultConfig: null };
  const read = (data: unknown) => readBrunoDraft({ getItem: () => JSON.stringify(data) }, 'test');
  assert.deepEqual(read({ ...value, email: 'ignored', score: 999 }), value);
  assert.equal(read({ ...value, modelVersion: 'old' }), null);
  assert.equal(read({ ...value, phase: 'result' }), null);
  assert.equal(read({ ...value, config: { ...DEFAULT_BRUNO_CONFIG, launcher: 'fake' } }), null);
  assert.equal(readBrunoDraft({ getItem: () => '{' }, 'test'), null);
  assert.equal(readBrunoDraft({ getItem: () => { throw new Error('unavailable'); } }, 'test'), null);
});
