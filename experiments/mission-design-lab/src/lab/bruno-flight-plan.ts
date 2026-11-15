import {
  BRUNO_CHOICES, BRUNO_INSTRUMENTS, BRUNO_INVENTORY_MODEL_VERSION, BRUNO_MODEL_VERSION,
  validateBrunoConfig, validateBrunoSimulationConfig,
} from './bruno-missions.ts';
import type { BrunoConfig, BrunoConfigKey, BrunoResult, BrunoSimulationConfig } from './bruno-missions.ts';

export const BRUNO_PART_LABELS: Record<BrunoConfigKey, string> = {
  launcher: 'Lançador', propulsion: 'Propulsão', energy: 'Energia', protection: 'Proteção',
  navigation: 'Navegação e enlace', payload: 'Instrumento',
};
export const BRUNO_PART_KEYS = Object.keys(BRUNO_PART_LABELS) as BrunoConfigKey[];

function describeCargo(config: BrunoSimulationConfig) {
  if (!('loadout' in config)) {
    return { key: config.payload, label: BRUNO_CHOICES.payload.find(choice => choice.id === config.payload)!.label };
  }
  const ordered = [...config.loadout].sort((a, b) =>
    a.instrumentId.localeCompare(b.instrumentId) || a.usesRemaining - b.usesRemaining);
  return {
    key: 'carga:' + ordered.map(item => `${item.instrumentId}:${item.usesRemaining}`).join(','),
    label: ordered.map(item => {
      const instrument = BRUNO_INSTRUMENTS[item.instrumentId];
      return `${instrument.label} (${item.usesRemaining}/${instrument.durability} ciclos)`;
    }).join(' · ') || 'Sem instrumentos',
  };
}

export function describeBrunoComparison(a: BrunoResult, b: BrunoResult) {
  const cargoA = describeCargo(a.config);
  const cargoB = describeCargo(b.config);
  const changes = BRUNO_PART_KEYS
    .filter(key => key === 'payload' ? cargoA.key !== cargoB.key : a.config[key] !== b.config[key]).map(key => ({
    key, label: BRUNO_PART_LABELS[key],
      from: key === 'payload' ? cargoA.label : BRUNO_CHOICES[key].find(choice => choice.id === a.config[key])!.label,
      to: key === 'payload' ? cargoB.label : BRUNO_CHOICES[key].find(choice => choice.id === b.config[key])!.label,
    }));
  const delta = b.deliveredRecords - a.deliveredRecords;
  const changedCargo = changes.some(change => change.key === 'payload')
    && ('loadout' in a.config || 'loadout' in b.config);
  const lesson = changes.length > 1 ? 'Para isolar a causa, compare novamente alterando uma peça por vez.'
    : changedCargo ? 'Compare uma unidade por vez para separar instrumento e desgaste.' : 'As demais escolhas permaneceram iguais.';
  const explanation = changes.length === 0 ? 'Os planos são iguais. Altere uma peça para investigar sua consequência.'
    : `${changes.length === 1 ? 'Uma diferença entre planos' : `${changes.length} diferenças entre planos`}: ${Math.abs(delta)} ${Math.abs(delta) === 1 ? 'registro válido' : 'registros válidos'} ${delta >= 0 ? 'a mais' : 'a menos'}. ${lesson}`;
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
  baseline: BrunoSimulationConfig;
  phase: 'briefing' | 'hangar' | 'result';
  resultConfig: BrunoSimulationConfig | null;
}
export function readBrunoDraft(storage: Pick<Storage, 'getItem'>, key: string): BrunoDraft | null {
  try {
    const value = JSON.parse(storage.getItem(key) ?? 'null');
    if (!value || ![BRUNO_MODEL_VERSION, BRUNO_INVENTORY_MODEL_VERSION].includes(value.modelVersion)
      || !validateBrunoConfig(value.config)
      || !validateBrunoSimulationConfig(value.baseline) || !['briefing', 'hangar', 'result'].includes(value.phase)
      || (value.resultConfig !== null && !validateBrunoSimulationConfig(value.resultConfig))
      || (value.phase === 'result' && !value.resultConfig)) return null;
    return { modelVersion: value.modelVersion, config: value.config, baseline: value.baseline, phase: value.phase, resultConfig: value.resultConfig };
  } catch { return null; }
}
