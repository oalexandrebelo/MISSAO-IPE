import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { describeBrunoComparison, readBrunoDraft } from '../src/lab/bruno-flight-plan.ts';
import * as missions from '../src/lab/bruno-missions.ts';
import type { BrunoInstrumentId, BrunoInventoryConfig } from '../src/lab/bruno-missions.ts';

const { DEFAULT_BRUNO_CONFIG, simulateBrunoMission } = missions;
const europaDesign = { ...DEFAULT_BRUNO_CONFIG, launcher: 'heavy', energy: 'extended',
  protection: 'reinforced', navigation: 'deep-space' } as const;
const freshEuropa = [
  { instrumentId: 'europa-mise', usesRemaining: 3 }, { instrumentId: 'europa-reason', usesRemaining: 3 },
] as const;
const plan = (loadout: BrunoInventoryConfig['loadout'], config = europaDesign): BrunoInventoryConfig =>
  ({ ...config, payload: 'targeted', modelVersion: 'ipe-bruno-r27-v2', loadout });

test('Europa cruza espectrometria e radar, e duas unidades do mesmo instrumento não suprem a outra grandeza', () => {
  const result = simulateBrunoMission('europa', plan(freshEuropa));
  assert.equal(result.outcome, 'success');
  assert.equal(result.modelVersion, 'ipe-bruno-r27-v2');
  assert.equal(result.deliveredRecords, 6);
  assert.equal(result.usedSlots, 3);
  assert.equal(result.maxSlots, 4);
  const onlyRadar = simulateBrunoMission('europa', plan([freshEuropa[1], freshEuropa[1]]));
  assert.equal(onlyRadar.outcome, 'failure');
  assert.equal(onlyRadar.deliveredRecords, 0);
  assert.ok(onlyRadar.diagnostics.some(diagnostic => diagnostic.code === 'PAYLOAD_MISMATCH'));
  assert.throws(() => simulateBrunoMission('europa', DEFAULT_BRUNO_CONFIG), RangeError);
});

test('desgaste registrado na carga aumenta a demanda por energia e pode limitar a coleta', () => {
  const fresh = simulateBrunoMission('europa', plan(freshEuropa));
  const worn = simulateBrunoMission('europa', plan(freshEuropa.map(item => ({ ...item, usesRemaining: 1 }))));
  assert.equal(fresh.generatedRecords, 6);
  assert.ok(worn.generatedRecords < fresh.generatedRecords);
  assert.ok(worn.diagnostics.some(diagnostic => diagnostic.code === 'ENERGY_WINDOW'));
});

test('validação da carga versionada exige instrumentos conhecidos e condição inteira dentro do catálogo', () => {
  assert.equal(missions.validateBrunoInventoryConfig(plan(freshEuropa)), true);
  assert.equal(missions.validateBrunoInventoryConfig(plan([{ instrumentId: 'europa-reason', usesRemaining: 4 }])), false);
  assert.equal(missions.validateBrunoInventoryConfig(plan([{ instrumentId: 'europa-mise', usesRemaining: 0 }])), false);
  assert.equal(missions.validateBrunoInventoryConfig(plan([{ instrumentId: 'europa-reason', usesRemaining: 1.5 }])), false);
  assert.equal(missions.validateBrunoInventoryConfig(plan([{ instrumentId: 'fake' as BrunoInstrumentId, usesRemaining: 3 }])), false);
  assert.equal(missions.validateBrunoSimulationConfig({ ...plan(freshEuropa), balance: 999 }), false);
});

test('carrinho é atômico; devolução reembolsa somente unidade íntegra e desocupada', async () => {
  const { applyBrunoInventoryCommand: apply, createBrunoInventoryState } = await import('../src/lab/bruno-inventory.ts');
  const initial = createBrunoInventoryState();
  const units = [{ id: 'mise-1', instrumentId: 'europa-mise' }, { id: 'reason-1', instrumentId: 'europa-reason' }] as const;
  const { state: purchased } = apply(initial, { kind: 'purchase', units });
  assert.equal(initial.balance, 25);
  assert.equal(purchased.balance, 9);
  assert.equal(purchased.version, 1);
  assert.deepEqual(purchased.items.map(item => item.id), ['mise-1', 'reason-1']);
  assert.throws(() => apply(purchased, { kind: 'purchase', units: units.map(unit => ({ ...unit, id: unit.id + '-new' })) }),
    { code: 'INSUFFICIENT_BALANCE' });
  assert.throws(() => apply(purchased, { kind: 'purchase', units }), { code: 'INVALID_COMMAND' });
  const { state: equipped } = apply(purchased, { kind: 'equip', missionId: 'europa', config: europaDesign, itemIds: ['mise-1'] });
  assert.throws(() => apply(equipped, { kind: 'refund', itemId: 'mise-1' }), { code: 'ITEM_RESERVED' });
  assert.throws(() => apply(equipped, { kind: 'equip', missionId: 'iss', config: DEFAULT_BRUNO_CONFIG, itemIds: ['mise-1'] }), { code: 'ITEM_RESERVED' });
  const { state: released } = apply(equipped, { kind: 'equip', missionId: 'europa', config: europaDesign, itemIds: [] });
  const { state: refunded } = apply(released, { kind: 'refund', itemId: 'mise-1' });
  assert.equal(refunded.balance, 17);
  assert.deepEqual(refunded.items.map(item => item.id), ['reason-1']);
});

test('equipar valida a ocupação e a massa, e a partida recusada não degrada o estoque', async () => {
  const { applyBrunoInventoryCommand: apply, createBrunoInventoryState } = await import('../src/lab/bruno-inventory.ts');
  const units = [{ id: 'mise', instrumentId: 'europa-mise' }, { id: 'reason', instrumentId: 'europa-reason' }] as const;
  const { state: purchased } = apply(createBrunoInventoryState(), { kind: 'purchase', units });
  const itemIds = units.map(unit => unit.id);
  const compact = { ...europaDesign, launcher: 'compact' } as const;
  assert.throws(() => apply(purchased, { kind: 'equip', missionId: 'europa', config: compact, itemIds }), { code: 'SLOT_LIMIT' });
  assert.throws(() => apply(purchased, { kind: 'equip', missionId: 'mars', config: compact, itemIds: ['mise'] }), { code: 'MASS_LIMIT' });
  const { state: equipped } = apply(purchased, { kind: 'equip', missionId: 'europa', config: europaDesign, itemIds });
  const { result, state } = apply(equipped, { kind: 'launch', missionId: 'europa', config: compact });
  assert.equal(result?.outcome, 'invalid');
  assert.ok(result?.diagnostics.some(diagnostic => diagnostic.code === 'SLOT_LIMIT'));
  assert.equal(state.balance, equipped.balance);
  assert.deepEqual(state.items, equipped.items);
  assert.deepEqual(state.reservations, equipped.reservations);
});

test('partida aceita congela a condição anterior e consome um ciclo sem creditar prêmio', async () => {
  const { applyBrunoInventoryCommand: apply, buildBrunoInventoryConfig, createBrunoInventoryState } = await import('../src/lab/bruno-inventory.ts');
  const { state: purchased } = apply(createBrunoInventoryState(), { kind: 'purchase', units: [{ id: 'air', instrumentId: 'iss-air-quality' }] });
  const config = { ...DEFAULT_BRUNO_CONFIG, protection: 'reinforced', energy: 'extended' } as const;
  const { state: equipped } = apply(purchased, { kind: 'equip', missionId: 'iss', config, itemIds: ['air'] });
  const frozen = buildBrunoInventoryConfig(equipped, 'iss', config);
  const first = apply(equipped, { kind: 'launch', missionId: 'iss', config });
  assert.equal(first.result?.outcome, 'success');
  assert.deepEqual(first.result?.config, frozen);
  assert.equal(frozen.loadout[0]?.usesRemaining, 3);
  assert.equal(first.state.items[0]?.usesRemaining, 2);
  assert.equal(first.state.balance, equipped.balance - 2);
  const second = apply(first.state, { kind: 'launch', missionId: 'iss', config });
  const { state: unequipped } = apply(second.state, { kind: 'equip', missionId: 'iss', config, itemIds: [] });
  assert.throws(() => apply(unequipped, { kind: 'refund', itemId: 'air' }), { code: 'ITEM_USED' });
  const { state: worn } = apply(unequipped, { kind: 'equip', missionId: 'iss', config, itemIds: ['air'] });
  const last = apply(worn, { kind: 'launch', missionId: 'iss', config });
  assert.equal(last.state.items.length, 0);
  assert.deepEqual(last.state.reservations.iss ?? [], []);
});

test('saldo esgotado bloqueia a taxa e o reinício recupera o patrimônio com versão crescente', async () => {
  const { applyBrunoInventoryCommand: apply, createBrunoInventoryState } = await import('../src/lab/bruno-inventory.ts');
  const initial = createBrunoInventoryState();
  const { state: purchased } = apply(initial, { kind: 'purchase', units: [
    { id: 'radar', instrumentId: 'europa-reason' },
    { id: 'weather', instrumentId: 'mars-meda' },
    { id: 'air', instrumentId: 'iss-air-quality' },
    { id: 'spare', instrumentId: 'iss-air-quality' },
  ] });
  const { state: equipped } = apply(purchased, {
    kind: 'equip', missionId: 'iss', config: DEFAULT_BRUNO_CONFIG, itemIds: ['air'],
  });
  assert.equal(equipped.balance, 0);
  assert.throws(() => apply(equipped, { kind: 'launch', missionId: 'iss', config: DEFAULT_BRUNO_CONFIG }),
    { code: 'INSUFFICIENT_BALANCE' });
  assert.equal(equipped.items.find(item => item.id === 'air')?.usesRemaining, 3);
  assert.deepEqual(apply(equipped, { kind: 'reset' }).state, { ...initial, version: equipped.version + 1 });
});

test('A/B distingue condição da carga e o rascunho preserva o plano versionado', () => {
  const a = simulateBrunoMission('europa', plan(freshEuropa));
  const b = simulateBrunoMission('europa', plan(freshEuropa.map(item => ({ ...item, usesRemaining: 1 }))));
  assert.deepEqual(describeBrunoComparison(a, b).changes.map(change => change.key), ['payload']);
  assert.equal(describeBrunoComparison(a, simulateBrunoMission('europa', plan([...freshEuropa].reverse()))).changes.length, 0);
  const saved = { modelVersion: 'ipe-bruno-r27-v2', config: europaDesign, baseline: a.config,
    phase: 'result', resultConfig: b.config };
  assert.deepEqual(readBrunoDraft({ getItem: () => JSON.stringify(saved) }, 'r27'), saved);
});

test('os 192 resultados R25 mantêm o JSON histórico completo', () => {
  const configs = Object.entries(missions.BRUNO_CHOICES).reduce((current, [key, choices]) =>
    current.flatMap(config => choices.map(choice => ({ ...config, [key]: choice.id }))), [DEFAULT_BRUNO_CONFIG]);
  const results = (['iss', 'moon', 'mars'] as const).flatMap(id => configs.map(config => simulateBrunoMission(id, config)));
  assert.equal(results.length, 192);
  assert.equal(createHash('sha256').update(JSON.stringify(results)).digest('hex'),
    'ac46e6b4dca77ebbd398451257d7a0341525c69d96d39b5b0590571cf72c48a8');
});
