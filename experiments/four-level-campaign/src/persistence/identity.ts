import { CATALOG_VERSION, ENGINE_VERSION, RESULT_SCHEMA_VERSION } from '../core/contracts.ts';
import type { MissionConfig, MissionResult, ScenarioId } from '../core/contracts.ts';
import { SCIENCE_PACK_HASH } from '../data/science-data.ts';
import { CANONICALIZATION_VERSION, sha256Canonical } from './json.ts';
import { assertMissionResult } from './validation.ts';

export interface ReplayInput { config: MissionConfig; scenarioId: ScenarioId; trace: boolean; }
export const IDENTITY_VERSIONS = Object.freeze({
  canonicalization: CANONICALIZATION_VERSION,
  engineVersion: ENGINE_VERSION,
  catalogVersion: CATALOG_VERSION,
  resultSchemaVersion: RESULT_SCHEMA_VERSION,
  sciencePackHash: SCIENCE_PACK_HASH,
});
export function hashInput(input: ReplayInput): Promise<string> {
  return sha256Canonical({ kind: 'mission-ipe-input-v1', ...IDENTITY_VERSIONS, input });
}
export function hashResult(result: MissionResult): Promise<string> {
  return sha256Canonical({ kind: 'mission-ipe-result-v1', ...IDENTITY_VERSIONS, result });
}
export async function identifyResult(result: MissionResult): Promise<{id: string; inputHash: string; resultHash: string; input: ReplayInput}> {
  assertMissionResult(result);
  const input: ReplayInput = { config: result.config, scenarioId: result.scenarioId, trace: result.trace.length > 0 };
  const [inputHash, resultHash] = await Promise.all([hashInput(input), hashResult(result)]);
  const id = 'run-' + await sha256Canonical({ kind: 'mission-ipe-run-v1', inputHash, resultHash });
  return { id, inputHash, resultHash, input };
}
