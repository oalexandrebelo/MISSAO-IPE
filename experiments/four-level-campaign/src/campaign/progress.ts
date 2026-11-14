import { assertMissionConfig, CONFIG_KEYS } from '../core/catalog.ts';
import { CATALOG_VERSION, ENGINE_VERSION } from '../core/contracts.ts';
import type { MissionConfig, MissionResult, ScenarioId } from '../core/contracts.ts';
import { simulateMission } from '../core/engine.ts';
import { canonicalJson } from '../persistence/json.ts';
import { assertMissionResult } from '../persistence/validation.ts';
import { assessCampaignResult } from './assessment.ts';
import type { CampaignAssessment } from './assessment.ts';
import { CAMPAIGN_LEVELS, CAMPAIGN_SCHEMA_VERSION, CAMPAIGN_STORAGE_KEY, CAMPAIGN_VERSION, getCampaignLevel, isCampaignLevelId } from './levels.ts';
import type { CampaignLevelId } from './levels.ts';

export interface CampaignCompletion {
  readonly levelId: CampaignLevelId;
  readonly attemptId: string;
  readonly completedAt: string;
  readonly config: Readonly<MissionConfig>;
}

export interface CampaignProgress {
  readonly schemaVersion: typeof CAMPAIGN_SCHEMA_VERSION;
  readonly campaignVersion: typeof CAMPAIGN_VERSION;
  readonly engineVersion: typeof ENGINE_VERSION;
  readonly catalogVersion: typeof CATALOG_VERSION;
  readonly activeLevelId: CampaignLevelId;
  readonly completions: readonly CampaignCompletion[];
}

export interface CampaignLoadResult {
  readonly progress: CampaignProgress;
  readonly status: 'empty' | 'ready' | 'unavailable' | 'invalid' | 'unsupported';
  readonly message: string | null;
}

export interface CampaignSaveResult { readonly saved: boolean; readonly message: string | null; }
export interface CampaignAttemptInput {
  readonly id: string;
  readonly config: MissionConfig;
  readonly scenarioId: ScenarioId;
  readonly prediction: 'energy' | 'peak' | 'memory' | 'contact' | 'envelope' | 'none';
  readonly rationale: string;
}

const attemptBrand: unique symbol = Symbol('own-campaign-attempt');
/** An in-memory capability. JSON, replays and saved runs cannot reconstruct it. */
export interface CampaignAttemptToken { readonly [attemptBrand]: true; }
interface AttemptSnapshot { levelId: CampaignLevelId; id: string; config: MissionConfig; scenarioId: ScenarioId; }
const activeAttempts = new WeakMap<CampaignAttemptToken, AttemptSnapshot>();
const VALID_PREDICTIONS = ['energy', 'peak', 'memory', 'contact', 'envelope', 'none'];
const MAX_STORAGE_BYTES = 20_000;

export function createCampaignProgress(): CampaignProgress {
  return { schemaVersion: CAMPAIGN_SCHEMA_VERSION, campaignVersion: CAMPAIGN_VERSION, engineVersion: ENGINE_VERSION,
    catalogVersion: CATALOG_VERSION, activeLevelId: 'first-signal', completions: [] };
}

export function isCampaignLevelComplete(progress: CampaignProgress, id: CampaignLevelId): boolean {
  return progress.completions.some(item => item.levelId === id);
}

export function isCampaignLevelAvailable(progress: CampaignProgress, id: CampaignLevelId): boolean {
  const level = getCampaignLevel(id);
  return CAMPAIGN_LEVELS.slice(0, level.number - 1).every(item => isCampaignLevelComplete(progress, item.id));
}

export function selectCampaignLevel(progress: CampaignProgress, id: CampaignLevelId): CampaignProgress {
  if (!isCampaignLevelAvailable(progress, id)) throw new Error('Conclua o nível anterior para abrir este desafio.');
  return { ...progress, activeLevelId: id };
}

/** Call only when App starts the player's own predicted launch, never on replay or history. */
export function beginCampaignAttempt(progress: CampaignProgress, levelId: CampaignLevelId, input: CampaignAttemptInput): CampaignAttemptToken {
  const level = getCampaignLevel(levelId);
  if (!isCampaignLevelAvailable(progress, levelId)) throw new Error('Este nível ainda não está disponível.');
  assertMissionConfig(input.config);
  if (input.scenarioId !== level.scenarioId) throw new Error('O cenário não corresponde ao nível escolhido.');
  if (typeof input.id !== 'string' || !input.id.trim() || input.id.length > 128) throw new Error('A tentativa precisa de um identificador próprio.');
  if (progress.completions.some(item => item.attemptId === input.id)) throw new Error('Esta tentativa já foi registrada.');
  if (!VALID_PREDICTIONS.includes(input.prediction) || typeof input.rationale !== 'string' || input.rationale.trim().length < 8) throw new Error('Registre uma previsão e sua justificativa antes de executar.');
  const token: CampaignAttemptToken = Object.freeze({ [attemptBrand]: true as const });
  activeAttempts.set(token, { levelId, id: input.id, config: { ...input.config }, scenarioId: input.scenarioId });
  return token;
}

export function cancelCampaignAttempt(token: CampaignAttemptToken | null | undefined): void {
  if (token) activeAttempts.delete(token);
}

/** Consume the launch capability, recalculate its inputs and grant only verified completion. */
export function completeCampaignAttempt(progress: CampaignProgress, token: CampaignAttemptToken, result: MissionResult): { progress: CampaignProgress; assessment: CampaignAssessment } {
  const attempt = activeAttempts.get(token);
  if (!attempt) throw new Error('Só uma execução própria e ativa pode registrar progresso na campanha.');
  activeAttempts.delete(token);
  if (!isCampaignLevelAvailable(progress, attempt.levelId)) throw new Error('Este nível ainda não está disponível.');
  assertMissionResult(result);
  if (result.scenarioId !== attempt.scenarioId || CONFIG_KEYS.some(key => result.config[key] !== attempt.config[key])) throw new Error('O resultado não corresponde ao projeto que iniciou esta tentativa.');
  const verified = simulateMission(attempt.config, attempt.scenarioId, { trace: result.trace.length > 0 });
  if (canonicalJson(result) !== canonicalJson(verified)) throw new Error('O resultado diverge do recálculo da tentativa.');
  const assessment = assessCampaignResult(attempt.levelId, verified);
  if (!assessment.passed || isCampaignLevelComplete(progress, attempt.levelId)) return { progress, assessment };
  const completion: CampaignCompletion = { levelId: attempt.levelId, attemptId: attempt.id, completedAt: new Date().toISOString(), config: { ...attempt.config } };
  return { progress: { ...progress, activeLevelId: attempt.levelId, completions: [...progress.completions, completion] }, assessment };
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value); }
function exactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean { return Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key)); }

/** Restored local progress is checked against the current campaign and recalculated engine. */
function parseProgress(value: unknown): CampaignProgress {
  if (!isRecord(value) || !exactKeys(value, ['schemaVersion', 'campaignVersion', 'engineVersion', 'catalogVersion', 'activeLevelId', 'completions'])
    || !isCampaignLevelId(value.activeLevelId) || !Array.isArray(value.completions) || value.completions.length > CAMPAIGN_LEVELS.length) throw new Error('Estrutura de campanha inválida.');
  const completions: CampaignCompletion[] = [];
  const ids = new Set<string>();
  for (const [index, entry] of value.completions.entries()) {
    if (!isRecord(entry) || !exactKeys(entry, ['levelId', 'attemptId', 'completedAt', 'config']) || entry.levelId !== CAMPAIGN_LEVELS[index]?.id
      || typeof entry.attemptId !== 'string' || !entry.attemptId.trim() || entry.attemptId.length > 128 || ids.has(entry.attemptId)
      || typeof entry.completedAt !== 'string' || !Number.isFinite(Date.parse(entry.completedAt))) throw new Error('Conclusão de campanha inválida.');
    assertMissionConfig(entry.config);
    const level = CAMPAIGN_LEVELS[index]!;
    const verified = simulateMission(entry.config, level.scenarioId, { trace: false });
    if (!assessCampaignResult(level.id, verified).passed) throw new Error('O projeto salvo não conclui este nível.');
    ids.add(entry.attemptId);
    completions.push({ levelId: level.id, attemptId: entry.attemptId, completedAt: entry.completedAt, config: { ...entry.config } });
  }
  const progress: CampaignProgress = { ...createCampaignProgress(), activeLevelId: value.activeLevelId, completions };
  if (!isCampaignLevelAvailable(progress, progress.activeLevelId)) throw new Error('O nível salvo ainda não está disponível.');
  return progress;
}

export function readCampaignProgress(storage?: Pick<Storage, 'getItem'>): CampaignLoadResult {
  const fresh = createCampaignProgress();
  let raw: string | null;
  try { raw = (storage ?? globalThis.localStorage).getItem(CAMPAIGN_STORAGE_KEY); }
  catch { return { progress: fresh, status: 'unavailable', message: 'O progresso da campanha não pôde ser lido neste navegador. Você pode jogar nesta sessão.' }; }
  if (raw === null) return { progress: fresh, status: 'empty', message: null };
  try {
    if (raw.length > MAX_STORAGE_BYTES) throw new Error('Armazenamento excede o limite.');
    const value: unknown = JSON.parse(raw);
    if (isRecord(value) && (value.schemaVersion !== CAMPAIGN_SCHEMA_VERSION || value.campaignVersion !== CAMPAIGN_VERSION
      || value.engineVersion !== ENGINE_VERSION || value.catalogVersion !== CATALOG_VERSION)) return { progress: fresh, status: 'unsupported', message: 'O progresso salvo pertence a outra versão. Esta campanha começou no primeiro nível.' };
    return { progress: parseProgress(value), status: 'ready', message: null };
  } catch { return { progress: fresh, status: 'invalid', message: 'O progresso salvo não pôde ser validado. A campanha está disponível a partir do primeiro nível.' }; }
}

export function writeCampaignProgress(progress: CampaignProgress, storage?: Pick<Storage, 'setItem'>): CampaignSaveResult {
  try {
    (storage ?? globalThis.localStorage).setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(progress));
    return { saved: true, message: null };
  } catch { return { saved: false, message: 'Seu progresso continua nesta sessão, mas não pôde ser salvo no navegador.' }; }
}
