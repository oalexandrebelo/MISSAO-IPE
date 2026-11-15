import test from 'node:test';
import assert from 'node:assert/strict';
import { simulateMission } from '../lib/mission/core/engine.ts';
import { DEFAULT_CONFIG } from '../lib/mission/core/catalog.ts';

test('a configuração base entrega 6/6 com contatos longos', () => {
  const result = simulateMission(DEFAULT_CONFIG, 'long-contact');
  assert.equal(result.deliveredRecords, 6); assert.equal(result.outcome, 'success');
});
test('a mesma nave entrega 2/6 com contatos curtos', () => {
  const result = simulateMission(DEFAULT_CONFIG, 'short-contact');
  assert.equal(result.deliveredRecords, 2); assert.equal(result.outcome, 'failure');
});
test('bateria maior e processamento a bordo recuperam 6/6 dentro dos limites', () => {
  const result = simulateMission({ ...DEFAULT_CONFIG, battery:'large', processing:'index' }, 'short-contact');
  assert.equal(result.deliveredRecords, 6); assert.equal(result.outcome, 'success');
  assert.ok(result.credits <= 86); assert.ok(result.massKg <= 3.6); assert.ok(result.minEnergyWh >= result.reserveWh);
});
test('resultado recalculado é determinístico e conserva o balanço de energia', () => {
  const a = simulateMission(DEFAULT_CONFIG, 'short-contact');
  const b = simulateMission(DEFAULT_CONFIG, 'short-contact');
  assert.deepEqual(a,b); assert.ok(Math.abs(a.energyBalance.residualWh) < 1e-8);
});
