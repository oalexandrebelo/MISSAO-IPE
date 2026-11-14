import { CATALOG, CONFIG_KEYS } from '../core/catalog.ts';
import type { ConfigKey, MissionConfig, TracePoint } from '../core/contracts.ts';

const decimal = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });
const fourDecimals = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
const oneDecimal = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });

export const CONFIG_LABELS: Record<ConfigKey, string> = {
  battery: 'Bateria', panel: 'Painéis solares', processing: 'Processamento',
  radio: 'Rádio', buffer: 'Memória', policy: 'Plano de transmissão',
};
export const CONFIG_HINTS: Record<ConfigKey, string> = {
  battery: 'Energia guardada e potência de descarga são limites diferentes.',
  panel: 'Os painéis geram energia durante os períodos iluminados.',
  processing: 'As duas rotas respondem à mesma pergunta científica.',
  radio: 'Enviar mais rápido também exige mais potência.',
  buffer: 'Os registros aguardam contato com a estação nesta memória.',
  policy: 'O plano é fixado antes da execução da missão.',
};
export function number(value: number): string { return decimal.format(value); }
export function ndvi(value: number): string { return fourDecimals.format(value); }
export function briefNumber(value: number): string { return oneDecimal.format(value); }
export function bits(value: string | number): string { return `${briefNumber(Number(value) / 1_000_000)} Mbit`; }
export function time(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(3, '0')}:${remainder.toString().padStart(2, '0')}`;
}
export function minutes(seconds: number): string { return `${briefNumber(seconds / 60)} min`; }
export function choiceLabel(config: MissionConfig, key: ConfigKey): string {
  return CATALOG[key].find((choice) => choice.id === config[key])?.label ?? config[key];
}
export function changedChoices(before: MissionConfig, after: MissionConfig): ConfigKey[] {
  return CONFIG_KEYS.filter((key) => before[key] !== after[key]);
}
export function traceIndexAt(trace: readonly TracePoint[], at: number): number {
  let previous = 0;
  for (let index = 0; index < trace.length; index += 1) {
    if (trace[index]!.timeS > at) break;
    previous = index;
  }
  return previous;
}
export function downloadText(text: string, name: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
