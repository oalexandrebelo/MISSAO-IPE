import type { MissionConfig, ScenarioId } from '../core/contracts.ts';

export type Prediction = 'energy' | 'peak' | 'memory' | 'contact' | 'envelope' | 'none';
export const PREDICTIONS: readonly { id: Prediction; label: string }[] = [
  { id: 'energy', label: 'Energia acumulada' }, { id: 'peak', label: 'Potência de pico' },
  { id: 'memory', label: 'Memória disponível' }, { id: 'contact', label: 'Tempo para transmitir' },
  { id: 'envelope', label: 'Massa ou créditos' }, { id: 'none', label: 'A missão deve funcionar' },
];
export interface LearningEntry {
  id: string;
  recordedAt: string;
  kind: 'prediction' | 'completed' | 'cancelled' | 'error' | 'reflection' | 'help' | 'redesign';
  scenarioId: ScenarioId;
  config: MissionConfig;
  attemptId?: string;
  prediction?: Prediction;
  text?: string;
  outcome?: string;
  eventId?: string;
}
export const JOURNAL_KEY = 'mission-ipe:learning:v1';
const CONFIG_VALUES = {
  battery: ['small', 'large'], panel: ['compact', 'standard'], processing: ['bands', 'index'],
  radio: ['economy', 'fast'], buffer: ['compact', 'large'], policy: ['every-contact', 'last-contact'],
} as const;
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value); }
function isEntry(value: unknown): value is LearningEntry {
  if (!isRecord(value) || !isRecord(value.config)) return false;
  const config = value.config;
  return typeof value.id === 'string' && typeof value.recordedAt === 'string'
    && ['prediction', 'completed', 'cancelled', 'error', 'reflection', 'help', 'redesign'].includes(String(value.kind))
    && ['long-contact', 'short-contact'].includes(String(value.scenarioId))
    && Object.entries(CONFIG_VALUES).every(([key, values]) => (values as readonly unknown[]).includes(config[key]))
    && (value.text === undefined || typeof value.text === 'string')
    && (value.attemptId === undefined || typeof value.attemptId === 'string')
    && (value.prediction === undefined || PREDICTIONS.some((item) => item.id === value.prediction));
}
export function readJournal(key = JOURNAL_KEY): LearningEntry[] {
  try {
    const text = localStorage.getItem(key);
    if (!text || text.length > 2_000_000) return [];
    const value: unknown = JSON.parse(text);
    return Array.isArray(value) && value.every(isEntry) ? value : [];
  } catch { return []; }
}
export function newEntry(entry: Omit<LearningEntry, 'id' | 'recordedAt'>): LearningEntry {
  return { ...entry, config: { ...entry.config }, id: crypto.randomUUID(), recordedAt: new Date().toISOString() };
}
