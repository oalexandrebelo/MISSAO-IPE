import { BRUNO_CHOICES, BRUNO_MODEL_VERSION, validateBrunoConfig } from './bruno-missions.ts';
import type { BrunoConfig, BrunoConfigKey, BrunoResult } from './bruno-missions.ts';

export const BRUNO_PART_LABELS: Record<BrunoConfigKey, string> = {
  launcher: 'Lançador', propulsion: 'Propulsão', energy: 'Energia', protection: 'Proteção',
  navigation: 'Navegação e enlace', payload: 'Instrumento',
};
export const BRUNO_PART_KEYS = Object.keys(BRUNO_PART_LABELS) as BrunoConfigKey[];

export function describeBrunoComparison(a: BrunoResult, b: BrunoResult) {
  const changes = BRUNO_PART_KEYS.filter(key => a.config[key] !== b.config[key]).map(key => ({
    key, label: BRUNO_PART_LABELS[key],
    from: BRUNO_CHOICES[key].find(choice => choice.id === a.config[key])!.label,
    to: BRUNO_CHOICES[key].find(choice => choice.id === b.config[key])!.label,
  }));
  const delta = b.deliveredRecords - a.deliveredRecords;
  const explanation = changes.length === 0 ? 'Os planos são iguais. Altere uma peça para investigar sua consequência.'
    : `${changes.length === 1 ? 'Uma decisão mudou' : `${changes.length} decisões mudaram`}: ${Math.abs(delta)} ${Math.abs(delta) === 1 ? 'registro válido' : 'registros válidos'} ${delta >= 0 ? 'a mais' : 'a menos'}. ${changes.length > 1 ? 'Para isolar a causa, compare novamente alterando uma peça por vez.' : 'As demais escolhas permaneceram iguais.'}`;
  return { changes, explanation, rows: [
    { label: 'Massa', a: a.massKg, b: b.massKg, unit: 'kg' },
    { label: 'Custo', a: a.credits, b: b.credits, unit: 'créditos' },
    { label: 'Energia para coleta', a: a.acquisitionEnergyWh, b: b.acquisitionEnergyWh, unit: 'Wh' },
    { label: 'Enlace da janela', a: a.linkCapacityMb, b: b.linkCapacityMb, unit: 'MB' },
    { label: 'Chegada', a: a.travelDays, b: b.travelDays, unit: 'dias' },
    { label: 'Registros válidos', a: a.deliveredRecords, b: b.deliveredRecords, unit: 'de 6' },
  ] };
}

export interface BrunoDraft {
  modelVersion: string;
  config: BrunoConfig;
  baseline: BrunoConfig;
  phase: 'briefing' | 'hangar' | 'result';
  resultConfig: BrunoConfig | null;
}
export function readBrunoDraft(storage: Pick<Storage, 'getItem'>, key: string): BrunoDraft | null {
  try {
    const value = JSON.parse(storage.getItem(key) ?? 'null');
    if (!value || value.modelVersion !== BRUNO_MODEL_VERSION || !validateBrunoConfig(value.config)
      || !validateBrunoConfig(value.baseline) || !['briefing', 'hangar', 'result'].includes(value.phase)
      || (value.resultConfig !== null && !validateBrunoConfig(value.resultConfig))
      || (value.phase === 'result' && !value.resultConfig)) return null;
    return { modelVersion: BRUNO_MODEL_VERSION, config: value.config, baseline: value.baseline, phase: value.phase, resultConfig: value.resultConfig };
  } catch { return null; }
}
