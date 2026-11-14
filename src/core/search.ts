import { assertMissionConfig, CATALOG, CONFIG_KEYS, getScenario } from './catalog.ts';
import type { MissionConfig, MissionResult, ScenarioId, SearchCandidate, SearchResult } from './contracts.ts';
import { simulateMission } from './engine.ts';

const identity = (config: MissionConfig): string => CONFIG_KEYS.map(key => config[key]).join('|');

export function enumerateConfigurations(): MissionConfig[] {
  let partials: Partial<MissionConfig>[] = [{}];
  for (const key of CONFIG_KEYS) partials = partials.flatMap(partial => CATALOG[key].map(choice => ({ ...partial, [key]: choice.id })));
  return partials as MissionConfig[];
}

export function hammingDistance(a: MissionConfig, b: MissionConfig): number {
  assertMissionConfig(a);
  assertMissionConfig(b);
  return CONFIG_KEYS.reduce((distance, key) => distance + Number(a[key] !== b[key]), 0);
}

/** The only catalog solver used by the product; shares the mission engine. */
export function searchCatalog(baseConfig: MissionConfig, scenarioId: ScenarioId): SearchResult {
  return evaluateConfigurations(baseConfig, scenarioId, enumerateConfigurations(), simulateMission);
}

/** @internal Test seam: an interrupted, duplicated, missing or failed evaluation cannot certify a minimum. */
export function evaluateConfigurations(
  baseConfigInput: MissionConfig,
  scenarioId: ScenarioId,
  configurations: readonly MissionConfig[],
  evaluate: (config: MissionConfig, scenarioId: ScenarioId) => MissionResult,
): SearchResult {
  assertMissionConfig(baseConfigInput);
  getScenario(scenarioId);
  const baseConfig = { ...baseConfigInput };
  const allIds = new Set(enumerateConfigurations().map(identity));
  const seen = new Set<string>();
  const successful: SearchCandidate[] = [];
  let invalid = 0;
  let failed = 0;
  let indeterminate = 0;
  let evaluated = 0;
  for (const input of configurations) {
    try {
      assertMissionConfig(input);
      const config = { ...input };
      const id = identity(config);
      if (!allIds.has(id) || seen.has(id)) { indeterminate++; continue; }
      seen.add(id);
      const result = evaluate(config, scenarioId);
      if (result.scenarioId !== scenarioId || identity(result.config) !== id) throw new Error('Resultado não corresponde à entrada.');
      if (result.outcome === 'success') successful.push({ config, distance: hammingDistance(config, baseConfig), result });
      else if (result.outcome === 'invalid') invalid++;
      else if (result.outcome === 'failure') failed++;
      else throw new Error('Resultado indeterminado.');
      evaluated++;
    } catch {
      indeterminate++;
    }
  }
  const missing = allIds.size - seen.size;
  indeterminate += missing;
  const complete = indeterminate === 0 && evaluated === allIds.size && configurations.length === allIds.size;
  const minimumDistance = complete && successful.length > 0 ? Math.min(...successful.map(candidate => candidate.distance)) : null;
  const best = minimumDistance === null ? [] : successful.filter(candidate => candidate.distance === minimumDistance).sort((a, b) => {
    const left = identity(a.config);
    const right = identity(b.config);
    return left < right ? -1 : left > right ? 1 : 0;
  });
  return { scenarioId, baseConfig, total: allIds.size, evaluated, invalid, successful: successful.length, failed, indeterminate, complete, minimumDistance, best };
}
