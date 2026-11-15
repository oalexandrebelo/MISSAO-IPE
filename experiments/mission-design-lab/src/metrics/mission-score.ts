import { getScenario } from '../core/catalog.ts';
import type { MissionResult } from '../core/contracts.ts';
import type { ExpeditionResult } from '../lab/scientific-expeditions.ts';

export const MISSION_SCORE_LIMITS = Object.freeze({ science: 60, engineering: 30, efficiency: 10 });
export const MISSION_SCORE_RUBRIC = 'r21-v1';

export interface MissionScore {
  total: number;
  science: number;
  engineering: number;
  efficiency: number;
  max: 100;
  rubricVersion: typeof MISSION_SCORE_RUBRIC;
}

interface ScoreInput {
  validRecords: number;
  requiredRecords: number;
  outcome: MissionResult['outcome'];
  massKg: number;
  maxMassKg: number;
  credits: number;
  budget: number;
}

function boundedFraction(value: number, limit: number) {
  return limit > 0 ? Math.max(0, Math.min(1, value / limit)) : 0;
}

export function calculateMissionScore(input: ScoreInput): MissionScore {
  const science = Math.round(MISSION_SCORE_LIMITS.science * boundedFraction(input.validRecords, input.requiredRecords));
  const architectureCompatible = input.outcome !== 'invalid';
  const engineering = architectureCompatible ? MISSION_SCORE_LIMITS.engineering : 0;
  const massHeadroom = boundedFraction(input.maxMassKg - input.massKg, input.maxMassKg);
  const budgetHeadroom = boundedFraction(input.budget - input.credits, input.budget);
  const efficiency = architectureCompatible ? Math.round(MISSION_SCORE_LIMITS.efficiency * (massHeadroom + budgetHeadroom) / 2) : 0;
  return { total: science + engineering + efficiency, science, engineering, efficiency, max: 100, rubricVersion: MISSION_SCORE_RUBRIC };
}

export function scoreMissionResult(result: MissionResult | ExpeditionResult): MissionScore {
  const expedition = 'expeditionId' in result;
  const { massKg, credits } = expedition ? result.totals : result;
  const { maxMassKg, budget } = expedition ? result.totals : getScenario(result.scenarioId);
  return calculateMissionScore({
    validRecords: result.deliveredRecords, requiredRecords: result.requiredRecords, outcome: result.outcome,
    massKg, maxMassKg, credits, budget,
  });
}
