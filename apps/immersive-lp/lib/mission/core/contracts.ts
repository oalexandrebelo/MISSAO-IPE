/** P&D específico iniciado antes do evento. Não há elegibilidade NASA estabelecida. */
export const ENGINE_VERSION = '0.1.1-rd' as const;
export const CATALOG_VERSION = 'ipe-64-v1' as const;
export const RESULT_SCHEMA_VERSION = 1 as const;
export type ScenarioId = 'long-contact' | 'short-contact';
export type ConfigKey = 'battery' | 'panel' | 'processing' | 'radio' | 'buffer' | 'policy';
export interface MissionConfig {
  battery: 'small' | 'large';
  panel: 'compact' | 'standard';
  processing: 'bands' | 'index';
  radio: 'economy' | 'fast';
  buffer: 'compact' | 'large';
  policy: 'every-contact' | 'last-contact';
}
export interface ComponentChoice {
  id: string; label: string; description: string; massKg: number; credits: number;
  capacityWh?: number; maxDischargeW?: number; watts?: number;
  rateBps?: number; capacityBits?: number; bitsPerRecord?: number; totalLoadW?: number;
}
export interface Scenario {
  id: ScenarioId; title: string; description: string; horizonS: number;
  sunlight: readonly (readonly [number, number])[];
  contacts: readonly (readonly [number, number])[];
  jobStartsS: readonly number[]; jobDurationS: number;
  budget: number; maxMassKg: number;
}
export interface ScienceRecord {
  id: string; sourceId: string; latitudeRequested: number; longitudeRequested: number;
  compositeStart: string; observationDate: string; modisDate: string;
  redInteger: number; nirInteger: number; viQuality: number; pixelReliability: number;
  ndviProduct: number; scale: number; offset: number;
}
export interface MissionEvent {
  id: string; timeS: number; code: string; severity: 'info' | 'warning' | 'error';
  rule: string; message: string; recordId?: string; value?: number; limit?: number;
}
export interface TracePoint {
  timeS: number; energyWh: number; queueBits: number; downlinkedBits: number;
  solarW: number; loadW: number; mode: string;
}
export interface ObservationResult {
  id: string; generatedBits: string; downlinkedBits: string; lostBits: string;
  state: 'not-produced' | 'queued' | 'partial' | 'delivered' | 'lost' | 'invalid';
  producedAtS: number | null; deliveredAtS: number | null;
  ndvi: number | null; expectedNdvi: number; scienceValid: boolean;
}
export interface MissionResult {
  engineVersion: string; catalogVersion: string; resultSchemaVersion: number;
  config: MissionConfig; scenarioId: ScenarioId;
  outcome: 'success' | 'failure' | 'invalid';
  completedAtS: number; massKg: number; credits: number;
  initialEnergyWh: number; finalEnergyWh: number; minEnergyWh: number; reserveWh: number;
  generatedBits: string; downlinkedBits: string; lostBits: string; queueBits: string;
  deliveredRecords: number; requiredRecords: number;
  energyBalance: { solarWh: number; loadWh: number; conversionLossWh: number; spillWh: number; residualWh: number };
  violations: readonly string[]; events: readonly MissionEvent[];
  trace: readonly TracePoint[]; observations: readonly ObservationResult[];
}
export interface SearchCandidate { config: MissionConfig; distance: number; result: MissionResult; }
export interface SearchResult {
  scenarioId: ScenarioId; baseConfig: MissionConfig; total: number; evaluated: number;
  invalid: number; successful: number; failed: number; indeterminate: number;
  complete: boolean; minimumDistance: number | null; best: readonly SearchCandidate[];
}
export interface SimulationOptions { trace?: boolean; }
