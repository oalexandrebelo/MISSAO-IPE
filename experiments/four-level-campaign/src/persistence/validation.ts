import { CATALOG_VERSION, ENGINE_VERSION, RESULT_SCHEMA_VERSION } from '../core/contracts.ts';
import type { MissionConfig, MissionResult, ScenarioId } from '../core/contracts.ts';
import { canonicalJson, invalid } from './json.ts';

export function objectWithKeys(value: unknown, required: readonly string[], optional: readonly string[] = [], path = 'objeto'): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) invalid(`${path}: objeto esperado.`);
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) invalid(`${path}: protótipo inválido.`);
  const record = value as Record<string, unknown>;
  const allowed = new Set([...required, ...optional]);
  for (const key of Object.keys(record)) if (!allowed.has(key)) invalid(`${path}: campo inesperado ${key}.`);
  for (const key of required) if (!Object.hasOwn(record, key)) invalid(`${path}: campo ausente ${key}.`);
  return record;
}

function member(value: unknown, allowed: readonly unknown[], path: string): void {
  if (!allowed.includes(value)) invalid(`${path}: valor não permitido.`);
}
export function assertScenarioId(value: unknown): asserts value is ScenarioId {
  member(value, ['long-contact', 'short-contact'], 'scenarioId');
}
export function assertMissionConfig(value: unknown): asserts value is MissionConfig {
  const config = objectWithKeys(value, ['battery', 'panel', 'processing', 'radio', 'buffer', 'policy'], [], 'config');
  member(config.battery, ['small', 'large'], 'battery');
  member(config.panel, ['compact', 'standard'], 'panel');
  member(config.processing, ['bands', 'index'], 'processing');
  member(config.radio, ['economy', 'fast'], 'radio');
  member(config.buffer, ['compact', 'large'], 'buffer');
  member(config.policy, ['every-contact', 'last-contact'], 'policy');
}
function finite(value: unknown, path: string, min = 0, max = Number.MAX_SAFE_INTEGER): void {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) invalid(`${path}: número finito fora do intervalo.`);
}
function integer(value: unknown, path: string, max = Number.MAX_SAFE_INTEGER): void {
  finite(value, path, 0, max);
  if (!Number.isSafeInteger(value)) invalid(`${path}: inteiro seguro esperado.`);
}
function text(value: unknown, path: string, max = 2048): void {
  if (typeof value !== 'string' || !value.length || value.length > max) invalid(`${path}: string inválida.`);
}
function bits(value: unknown, path: string): void {
  if (typeof value !== 'string' || !/^(0|[1-9]\d{0,15})$/.test(value) || BigInt(value) > BigInt(Number.MAX_SAFE_INTEGER)) invalid(`${path}: bits exigem string decimal de inteiro seguro.`);
}
function array(value: unknown, path: string, max: number): unknown[] {
  if (!Array.isArray(value) || value.length > max) invalid(`${path}: array excede o limite.`);
  return value;
}
function bool(value: unknown, path: string): void { if (typeof value !== 'boolean') invalid(`${path}: booleano esperado.`); }
function nullableFinite(value: unknown, path: string, min = 0, max = Number.MAX_SAFE_INTEGER): void {
  if (value !== null) finite(value, path, min, max);
}
export function assertHash(value: unknown, path: string): asserts value is string {
  if (typeof value !== 'string' || !/^[a-f0-9]{64}$/.test(value)) invalid(`${path}: SHA-256 inválido.`);
}

/** Structural validation only. A valid imported claim still must be recomputed. */
export function assertMissionResult(value: unknown): asserts value is MissionResult {
  // Also rejects accessors, symbols, cycles, nonfinite numbers and oversized data.
  canonicalJson(value);
  const result = objectWithKeys(value, [
    'engineVersion', 'catalogVersion', 'resultSchemaVersion', 'config', 'scenarioId', 'outcome',
    'completedAtS', 'massKg', 'credits', 'initialEnergyWh', 'finalEnergyWh', 'minEnergyWh', 'reserveWh',
    'generatedBits', 'downlinkedBits', 'lostBits', 'queueBits', 'deliveredRecords', 'requiredRecords',
    'energyBalance', 'violations', 'events', 'trace', 'observations',
  ], [], 'result');
  if (result.engineVersion !== ENGINE_VERSION || result.catalogVersion !== CATALOG_VERSION || result.resultSchemaVersion !== RESULT_SCHEMA_VERSION) invalid('Versão de motor, catálogo ou resultado não suportada.');
  assertMissionConfig(result.config);
  assertScenarioId(result.scenarioId);
  member(result.outcome, ['success', 'failure', 'invalid'], 'outcome');
  for (const key of ['completedAtS', 'massKg', 'initialEnergyWh', 'finalEnergyWh', 'minEnergyWh', 'reserveWh']) finite(result[key], key);
  for (const key of ['credits', 'deliveredRecords', 'requiredRecords']) integer(result[key], key);
  for (const key of ['generatedBits', 'downlinkedBits', 'lostBits', 'queueBits']) bits(result[key], key);
  const balance = objectWithKeys(result.energyBalance, ['solarWh', 'loadWh', 'conversionLossWh', 'spillWh', 'residualWh'], [], 'energyBalance');
  for (const key of ['solarWh', 'loadWh', 'conversionLossWh', 'spillWh']) finite(balance[key], key);
  finite(balance.residualWh, 'residualWh', -Number.MAX_SAFE_INTEGER);
  for (const violation of array(result.violations, 'violations', 128)) text(violation, 'violation');
  const eventIds = new Set<unknown>();
  for (const item of array(result.events, 'events', 2048)) {
    const event = objectWithKeys(item, ['id', 'timeS', 'code', 'severity', 'rule', 'message'], ['recordId', 'value', 'limit'], 'event');
    for (const key of ['id', 'code', 'rule', 'message']) text(event[key], key);
    if (eventIds.has(event.id)) invalid('ID de evento duplicado.');
    eventIds.add(event.id);
    finite(event.timeS, 'timeS');
    member(event.severity, ['info', 'warning', 'error'], 'severity');
    if (Object.hasOwn(event, 'recordId')) text(event.recordId, 'recordId', 128);
    for (const key of ['value', 'limit']) if (Object.hasOwn(event, key)) finite(event[key], key, -Number.MAX_SAFE_INTEGER);
  }
  for (const item of array(result.trace, 'trace', 4096)) {
    const point = objectWithKeys(item, ['timeS', 'energyWh', 'queueBits', 'downlinkedBits', 'solarW', 'loadW', 'mode'], [], 'tracePoint');
    for (const key of ['timeS', 'energyWh', 'solarW', 'loadW']) finite(point[key], key);
    for (const key of ['queueBits', 'downlinkedBits']) integer(point[key], key);
    text(point.mode, 'mode', 64);
  }
  const observationIds = new Set<unknown>();
  for (const item of array(result.observations, 'observations', 6)) {
    const observation = objectWithKeys(item, ['id', 'generatedBits', 'downlinkedBits', 'lostBits', 'state', 'producedAtS', 'deliveredAtS', 'ndvi', 'expectedNdvi', 'scienceValid'], [], 'observation');
    text(observation.id, 'observationId', 128);
    if (observationIds.has(observation.id)) invalid('ID de observação duplicado.');
    observationIds.add(observation.id);
    for (const key of ['generatedBits', 'downlinkedBits', 'lostBits']) bits(observation[key], key);
    member(observation.state, ['not-produced', 'queued', 'partial', 'delivered', 'lost', 'invalid'], 'state');
    nullableFinite(observation.producedAtS, 'producedAtS');
    nullableFinite(observation.deliveredAtS, 'deliveredAtS');
    nullableFinite(observation.ndvi, 'ndvi', -1, 1);
    finite(observation.expectedNdvi, 'expectedNdvi', -1, 1);
    bool(observation.scienceValid, 'scienceValid');
  }
}
