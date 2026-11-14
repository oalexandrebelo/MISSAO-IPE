import type { MissionResult } from '../core/contracts.ts';
import { simulateMission } from '../core/engine.ts';
import { IDENTITY_VERSIONS, hashInput, hashResult, identifyResult } from './identity.ts';
import { canonicalJson, invalid, parseStrictJson } from './json.ts';
import { assertHash, assertMissionConfig, assertMissionResult, assertScenarioId, objectWithKeys } from './validation.ts';

export { ReplayValidationError, MAX_REPLAY_BYTES } from './json.ts';
export const REPLAY_FORMAT = 'mission-ipe-replay' as const;
export const REPLAY_SCHEMA_VERSION = 1 as const;

export async function exportReplay(result: MissionResult): Promise<string> {
  // Snapshot before hashing: UI changes during an await cannot alter this receipt.
  const snapshot = parseStrictJson(canonicalJson(result));
  assertMissionResult(snapshot);
  const { input, inputHash, resultHash } = await identifyResult(snapshot);
  return canonicalJson({
    format: REPLAY_FORMAT, replaySchemaVersion: REPLAY_SCHEMA_VERSION,
    ...IDENTITY_VERSIONS, input, inputHash, resultHash, claimedResult: snapshot,
  });
}

/** Hashes prove content integrity, not authorship. Reexecution tests this model's consistency. */
export async function importReplay(text: string): Promise<{ result: MissionResult; matchesClaim: boolean; importedClaim: unknown }> {
  const envelope = objectWithKeys(parseStrictJson(text), [
    'format', 'replaySchemaVersion', ...Object.keys(IDENTITY_VERSIONS),
    'input', 'inputHash', 'resultHash', 'claimedResult',
  ], [], 'replay');
  if (envelope.format !== REPLAY_FORMAT || envelope.replaySchemaVersion !== REPLAY_SCHEMA_VERSION) invalid('Formato ou versão de replay não suportado.');
  for (const [key, version] of Object.entries(IDENTITY_VERSIONS)) if (envelope[key] !== version) invalid(`Versão ou pack incompatível: ${key}.`);
  assertHash(envelope.inputHash, 'inputHash');
  assertHash(envelope.resultHash, 'resultHash');
  const input = objectWithKeys(envelope.input, ['config', 'scenarioId', 'trace'], [], 'input');
  assertMissionConfig(input.config);
  assertScenarioId(input.scenarioId);
  if (typeof input.trace !== 'boolean') invalid('trace: booleano esperado.');
  assertMissionResult(envelope.claimedResult);
  const claim = envelope.claimedResult;
  if (claim.scenarioId !== input.scenarioId || canonicalJson(claim.config) !== canonicalJson(input.config)) invalid('Entrada e alegação divergem.');
  const expectedInputHash = await hashInput({ config: input.config, scenarioId: input.scenarioId, trace: input.trace });
  if (envelope.inputHash !== expectedInputHash) invalid('Hash da entrada não confere.');
  if (envelope.resultHash !== await hashResult(claim)) invalid('Hash da alegação não confere.');
  // No URL, source, script or imported trace is executed or fetched.
  const result = simulateMission(input.config, input.scenarioId, { trace: input.trace });
  assertMissionResult(result);
  const matchesClaim = envelope.resultHash === await hashResult(result);
  return { result, matchesClaim, importedClaim: claim };
}
