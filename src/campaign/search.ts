import { assertMissionConfig, CONFIG_KEYS } from '../core/catalog.ts';
import type { MissionConfig, SearchCandidate, SearchResult } from '../core/contracts.ts';
import { simulateMission } from '../core/engine.ts';
import { enumerateConfigurations, hammingDistance } from '../core/search.ts';
import { assessCampaignResult } from './assessment.ts';
import { getCampaignLevel } from './levels.ts';
import type { CampaignLevelId } from './levels.ts';

export interface CampaignSearchResult {
  /** successful/best/minimumDistance concern the level; failed still concerns the engine. */
  readonly result: SearchResult;
  readonly rejectedByLevel: number;
  readonly missionSuccessful: number;
}

/** The App exposes this read-only solver only after the player's own attempt in this level. */
export function searchCampaignCatalog(levelId: CampaignLevelId, input: MissionConfig): CampaignSearchResult {
  assertMissionConfig(input);
  const level = getCampaignLevel(levelId);
  const baseConfig = { ...input };
  const successful: SearchCandidate[] = [];
  let invalid = 0;
  let failed = 0;
  let indeterminate = 0;
  let rejectedByLevel = 0;
  let missionSuccessful = 0;
  let evaluated = 0;
  const configurations = enumerateConfigurations();
  for (const config of configurations) {
    try {
      const result = simulateMission(config, level.scenarioId);
      if (result.outcome === 'invalid') invalid++;
      else if (result.outcome === 'failure') failed++;
      else if (result.outcome === 'success') {
        missionSuccessful++;
        if (assessCampaignResult(levelId, result).passed) successful.push({ config, distance: hammingDistance(config, baseConfig), result });
        else rejectedByLevel++;
      } else throw new Error('Resultado indeterminado.');
      evaluated++;
    } catch { indeterminate++; }
  }
  const complete = indeterminate === 0 && evaluated === configurations.length;
  const minimumDistance = complete && successful.length ? Math.min(...successful.map(item => item.distance)) : null;
  const identity = (config: MissionConfig) => CONFIG_KEYS.map(key => config[key]).join('|');
  const best = minimumDistance === null ? [] : successful.filter(item => item.distance === minimumDistance).sort((left, right) => {
    const a = identity(left.config);
    const b = identity(right.config);
    return a < b ? -1 : a > b ? 1 : 0;
  });
  return {
    result: { scenarioId: level.scenarioId, baseConfig, total: configurations.length, evaluated, invalid, successful: successful.length,
      failed, indeterminate, complete, minimumDistance, best },
    rejectedByLevel, missionSuccessful,
  };
}
