import { BRUNO_MISSIONS } from '../lab/bruno-missions.ts';
import type { BrunoMissionId, BrunoResult } from '../lab/bruno-missions.ts';
import type { MissionResult } from '../core/contracts.ts';
import type { ExpeditionResult } from '../lab/scientific-expeditions.ts';
import { MISSION_SCORE_LIMITS, MISSION_SCORE_RUBRIC, scoreMissionResult } from './mission-score.ts';
import type { MissionScore } from './mission-score.ts';

const ARCHIVE_MISSIONS = ['cerrado', 'bennu', 'telescope'] as const;
export type MetricMission = typeof ARCHIVE_MISSIONS[number] | BrunoMissionId;
export function isBrunoMission(id: unknown): id is BrunoMissionId {
  return typeof id === 'string' && Object.hasOwn(BRUNO_MISSIONS, id);
}
export type MetricKind = 'attempt' | 'decision' | 'assessment' | 'inspection' | 'role_review';
export interface PlayerSession { sessionId: string; name: string; startedAt: string; }
export interface MetricEvent { id: string; kind: MetricKind; mission: MetricMission; at: string; payload: Record<string, unknown>; }
export interface AttemptSummary {
  outcome: 'success' | 'failure' | 'invalid'; received: number; valid: number; required: number;
  massKg: number; credits: number; simulatedSeconds: number; minEnergyWh: number; modelVersion: string;
  diagnostics: { code: string; message: string; timeS: number }[];
  score?: MissionScore;
}
export interface LocalMetric { event: MetricEvent; summary?: AttemptSummary; correct?: boolean; sync: 'pending' | 'synced' | 'rejected'; reason?: string; }
export const METRICS_SCHEMA = 1;
export const metricsKey = (sessionId: string) => `missao-ipe:player-metrics:v1:${sessionId}`;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
export function isPlayerSession(value: unknown): value is PlayerSession {
  return record(value) && typeof value.sessionId === 'string' && UUID.test(value.sessionId) && typeof value.name === 'string' && value.name.length > 0 && value.name.length <= 80 && typeof value.startedAt === 'string' && Number.isFinite(Date.parse(value.startedAt));
}
function validMetric(value: unknown): value is LocalMetric {
  if (!record(value) || !record(value.event)) return false;
  const event = value.event;
  if (typeof event.id !== 'string' || !UUID.test(event.id) || !['attempt','decision','assessment','inspection','role_review'].includes(String(event.kind)) || (!isBrunoMission(event.mission) && !ARCHIVE_MISSIONS.some(id => id === event.mission)) || typeof event.at !== 'string' || !Number.isFinite(Date.parse(event.at)) || !record(event.payload) || !['pending','synced','rejected'].includes(String(value.sync))) return false;
  if (value.correct !== undefined && typeof value.correct !== 'boolean') return false;
  if (value.reason !== undefined && typeof value.reason !== 'string') return false;
  if (value.summary !== undefined) {
    const s = value.summary;
    if (!record(s) || !['success','failure','invalid'].includes(String(s.outcome)) || typeof s.modelVersion !== 'string' || !Array.isArray(s.diagnostics)) return false;
    if (!['received','valid','required','massKg','credits','simulatedSeconds','minEnergyWh'].every(key => typeof s[key] === 'number' && Number.isFinite(s[key]))) return false;
    if (!s.diagnostics.every(d => record(d) && typeof d.code === 'string' && typeof d.message === 'string' && typeof d.timeS === 'number' && Number.isFinite(d.timeS))) return false;
    const score = s.score;
    if (score !== undefined) {
      if (!record(score) || score.max !== 100 || score.rubricVersion !== MISSION_SCORE_RUBRIC) return false;
      for (const [key, limit] of Object.entries(MISSION_SCORE_LIMITS)) {
        const points = score[key];
        if (typeof points !== 'number' || !Number.isInteger(points) || points < 0 || points > limit) return false;
      }
      if (score.total !== Number(score.science) + Number(score.engineering) + Number(score.efficiency)) return false;
    }
  }
  return true;
}
export function readMetrics(storage: Pick<Storage, 'getItem'>, sessionId: string): LocalMetric[] {
  const text = storage.getItem(metricsKey(sessionId));
  if (!text) return [];
  if (text.length > 4_000_000) throw new Error('O histórico local ultrapassou o limite de leitura.');
  const value: unknown = JSON.parse(text);
  if (!record(value) || value.version !== METRICS_SCHEMA || value.sessionId !== sessionId || !Array.isArray(value.entries) || value.entries.length > 10000 || !value.entries.every(validMetric)) throw new Error('O histórico local não passou pela verificação de formato.');
  return mergeMetrics([], value.entries);
}
export function mergeMetrics(a: readonly LocalMetric[], b: readonly LocalMetric[]): LocalMetric[] {
  const byId = new Map(a.map(item => [item.event.id, item]));
  for (const item of b) {
    const previous = byId.get(item.event.id);
    // An acknowledged event never becomes pending again after another tab writes.
    byId.set(item.event.id, previous?.sync === 'synced' ? previous : item);
  }
  return [...byId.values()].sort((x,y) => x.event.at.localeCompare(y.event.at));
}
export function writeMetrics(storage: Pick<Storage, 'setItem'>, sessionId: string, entries: readonly LocalMetric[]) {
  const text = JSON.stringify({ version: METRICS_SCHEMA, sessionId, entries });
  if (text.length > 4_000_000 || entries.length > 10000) throw new Error('O histórico local está cheio. Exporte seu progresso antes de continuar.');
  storage.setItem(metricsKey(sessionId), text);
}
export function newMetric(kind: MetricKind, mission: MetricMission, payload: Record<string, unknown>): MetricEvent {
  return { id: crypto.randomUUID(), kind, mission, at: new Date().toISOString(), payload };
}
export function summarizeAttempt(result: MissionResult | ExpeditionResult): AttemptSummary & { score: MissionScore } {
  const expedition = 'expeditionId' in result;
  const diagnostics = result.events.filter(event => event.severity === 'error' && event.code !== 'MISSION_END');
  const firstByCode = new Map<string, { code: string; message: string; timeS: number }>();
  for (const item of diagnostics) if (!firstByCode.has(item.code)) firstByCode.set(item.code, { code: item.code, message: item.message, timeS: item.timeS });
  return {
    outcome: result.outcome,
    received: result.observations.filter(item => item.deliveredAtS !== null).length,
    valid: result.deliveredRecords, required: result.requiredRecords,
    massKg: expedition ? result.totals.massKg : result.massKg,
    credits: expedition ? result.totals.credits : result.credits,
    simulatedSeconds: result.completedAtS, minEnergyWh: result.minEnergyWh,
    modelVersion: expedition ? result.modelVersion : result.engineVersion,
    diagnostics: [...firstByCode.values()],
    score: scoreMissionResult(result),
  };
}
export function summarizeMetrics(entries: readonly LocalMetric[]) {
  const attempts = entries.filter(item => item.event.kind === 'attempt');
  const completed = attempts.filter(item => item.summary);
  const assessments = new Map<string, LocalMetric[]>();
  for (const item of entries.filter(item => item.event.kind === 'assessment')) {
    const key = `${item.event.mission}:${item.event.payload.question}:${item.event.payload.questionVersion}`;
    const list = assessments.get(key) ?? [];
    list.push(item); assessments.set(key, list);
  }
  const questions = [...assessments.values()];
  return {
    attempts: attempts.length, completed: completed.length,
    successes: completed.filter(item => item.summary!.outcome === 'success').length,
    failures: completed.filter(item => item.summary!.outcome === 'failure').length,
    invalid: completed.filter(item => item.summary!.outcome === 'invalid').length,
    cancelled: attempts.filter(item => item.event.payload.status === 'cancelled').length,
    technicalErrors: attempts.filter(item => item.event.payload.status === 'error').length,
    decisions: entries.filter(item => item.event.kind === 'decision').length,
    inspections: entries.filter(item => item.event.kind === 'inspection').length,
    questions: questions.length, firstCorrect: questions.filter(items => items[0]!.correct === true).length,
    latestCorrect: questions.filter(items => items.at(-1)!.correct === true).length,
    revisions: questions.reduce((sum, items) => sum + items.length - 1, 0),
    pending: entries.filter(item => item.sync === 'pending').length,
    rejected: entries.filter(item => item.sync === 'rejected').length,
  };
}
export function acknowledgeMetrics(entries: readonly LocalMetric[], response: unknown): LocalMetric[] {
  if (!record(response) || !Array.isArray(response.acceptedIds) || !response.acceptedIds.every(id => typeof id === 'string') || !Array.isArray(response.rejected) || !response.rejected.every(item => record(item) && typeof item.id === 'string' && typeof item.reason === 'string')) throw new Error('O servidor não confirmou o recebimento das métricas.');
  const accepted = new Set(response.acceptedIds);
  const rejected = new Map(response.rejected.map(item => [item.id as string, item.reason as string]));
  return entries.map(item => accepted.has(item.event.id) ? { ...item, sync: 'synced' } : rejected.has(item.event.id) ? { ...item, sync: 'rejected', reason: rejected.get(item.event.id) } : item);
}

export function summarizeBrunoAttempt(result: BrunoResult): AttemptSummary & { score: MissionScore } {
  return { outcome: result.outcome, received: result.receivedRecords, valid: result.deliveredRecords, required: result.requiredRecords, massKg: result.massKg, credits: result.credits, simulatedSeconds: result.simulatedSeconds, minEnergyWh: result.minEnergyWh, modelVersion: result.modelVersion, diagnostics: result.diagnostics, score: result.score };
}
