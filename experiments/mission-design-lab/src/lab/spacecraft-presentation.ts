import { CATALOG, CONFIG_KEYS, getConfigTotals, getScenario } from '../core/catalog.ts';
import { CATALOG_VERSION } from '../core/contracts.ts';
import type { MissionConfig, ScenarioId } from '../core/contracts.ts';
import { EXPEDITION_MODEL_VERSION, getExpeditionChoices, getExpeditionPreflight, getExpeditionSchedule } from './scientific-expeditions.ts';
import type { ExpeditionConfig, ExpeditionId } from './scientific-expeditions.ts';

export type SpacecraftInspection = 'overview' | 'instrument' | 'energy' | 'communications';
export type SpacecraftPresentationInput =
  | { readonly world: 'earth'; readonly config: Readonly<MissionConfig>; readonly scenarioId?: ScenarioId }
  | { readonly world: ExpeditionId; readonly expeditionConfig: Readonly<ExpeditionConfig> };

export interface SpacecraftMetric { readonly name: string; readonly value: number; readonly unit: string; }
export interface SpacecraftSubsystemPresentation {
  readonly label: string; readonly principle: string; readonly effect: string;
  readonly metrics: readonly SpacecraftMetric[]; readonly massKg: number; readonly credits: number;
}
export interface SpacecraftPresentation {
  readonly world: 'earth' | ExpeditionId;
  /** Identity of the supplied configuration, not a verdict or a result hash. */
  readonly configurationKey: string;
  readonly source: { readonly label: string; readonly version: string; readonly note: string };
  readonly payload: SpacecraftSubsystemPresentation & {
    readonly id: 'bands' | 'index' | 'camera' | 'spectrometer';
    readonly kind: 'processor' | 'camera' | 'spectrometer';
    readonly bitsPerRecord: number; readonly totalLoadW: number; readonly goalCompatible: boolean;
  };
  readonly energy: SpacecraftSubsystemPresentation & {
    readonly panelW: number; readonly batteryWh: number; readonly maxDischargeW: number;
    /** Relative to the largest option in this case's catalog; not physical dimensions or cell counts. */
    readonly panelRatio: number; readonly batteryRatio: number;
  };
  readonly communications: SpacecraftSubsystemPresentation & {
    readonly radioHardware: 'economy' | 'fast' | 'generic'; readonly rateBps: number;
    readonly scheduleLabel: string;
    /** Full planned agenda, not guaranteed reception or permission to transmit in every window. */
    readonly contacts: readonly (readonly [number, number])[];
  };
  readonly storage: { readonly label: string; readonly bufferBits: number; readonly massKg: number | null; readonly credits: number | null };
  readonly totals: { readonly massKg: number; readonly credits: number };
}

function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
const metric = (name: string, value: number, unit: string): SpacecraftMetric => ({ name, value, unit });
const contactsCopy = (contacts: readonly (readonly [number, number])[]) => contacts.map(([start, end]) => [start, end] as const);
const massSum = (...values: number[]) => values.reduce((grams, value) => grams + Math.round(value * 1000), 0) / 1000;

/**
 * Presentation only: reads catalogs and preflight data without executing a mission.
 * Pass the edited config in the workbench and result.config in recorded/comparison
 * views. This function never substitutes a draft for an executed configuration.
 */
export function getSpacecraftPresentation(input: SpacecraftPresentationInput): SpacecraftPresentation {
  if (input.world === 'earth') {
    const { config } = input;
    const totals = getConfigTotals(config);
    const scenario = getScenario(input.scenarioId ?? 'long-contact');
    const payload = CATALOG.processing.find(choice => choice.id === config.processing)!;
    const battery = CATALOG.battery.find(choice => choice.id === config.battery)!;
    const panel = CATALOG.panel.find(choice => choice.id === config.panel)!;
    const radio = CATALOG.radio.find(choice => choice.id === config.radio)!;
    const policy = CATALOG.policy.find(choice => choice.id === config.policy)!;
    const buffer = CATALOG.buffer.find(choice => choice.id === config.buffer)!;
    return freeze({
      world: input.world, configurationKey: `earth:${CATALOG_VERSION}:${scenario.id}:${CONFIG_KEYS.map(key => config[key]).join('|')}`,
      source: { label: 'Catálogo didático do Cerrado', version: CATALOG_VERSION, note: 'Os arquivos Terra/MODIS são históricos reais; massa, custo e capacidades da nave são parâmetros do jogo, não especificações de hardware NASA.' },
      payload: {
        id: config.processing, kind: 'processor', label: payload.label,
        principle: 'O CubeSat processa arquivos históricos Terra/MODIS. Esta carga representa processamento de dados; não é uma câmera MODIS a bordo.',
        effect: payload.description, bitsPerRecord: payload.bitsPerRecord!, totalLoadW: payload.totalLoadW!, goalCompatible: true,
        metrics: [metric('Volume por registro', payload.bitsPerRecord! / 1_000_000, 'Mbit'), metric('Carga total durante processamento', payload.totalLoadW!, 'W')],
        massKg: payload.massKg, credits: payload.credits,
      },
      energy: {
        label: `${panel.label} · ${battery.label}`, principle: 'Painel fornece potência quando há luz; bateria guarda energia e limita a descarga. A escala do desenho compara opções, sem representar dimensões físicas.',
        effect: `${panel.description} ${battery.description}`, panelW: panel.watts!, batteryWh: battery.capacityWh!, maxDischargeW: battery.maxDischargeW!,
        panelRatio: panel.watts! / Math.max(...CATALOG.panel.map(choice => choice.watts!)),
        batteryRatio: battery.capacityWh! / Math.max(...CATALOG.battery.map(choice => choice.capacityWh!)),
        metrics: [metric('Potência nominal do painel', panel.watts!, 'W'), metric('Capacidade da bateria', battery.capacityWh!, 'Wh'), metric('Descarga máxima da bateria', battery.maxDischargeW!, 'W')],
        massKg: massSum(panel.massKg, battery.massKg), credits: panel.credits + battery.credits,
      },
      communications: {
        label: radio.label, principle: 'O rádio envia os registros durante os contatos autorizados pela política. Taxa, demanda de potência e agenda são limites diferentes.',
        effect: `${radio.description} ${policy.description}`, radioHardware: config.radio, rateBps: radio.rateBps!,
        scheduleLabel: `${scenario.title} · ${policy.label}`, contacts: contactsCopy(scenario.contacts),
        metrics: [metric('Taxa útil do rádio', radio.rateBps! / 1_000_000, 'Mbit/s'), metric('Carga total durante transmissão', radio.totalLoadW!, 'W'), metric('Janelas na agenda', scenario.contacts.length, 'janelas')],
        massKg: massSum(radio.massKg, policy.massKg), credits: radio.credits + policy.credits,
      },
      storage: { label: buffer.label, bufferBits: buffer.capacityBits!, massKg: buffer.massKg, credits: buffer.credits }, totals,
    });
  }

  const config = input.expeditionConfig;
  const choices = getExpeditionChoices(input.world);
  const preflight = getExpeditionPreflight(input.world, config);
  const schedule = getExpeditionSchedule(input.world, config);
  const payload = choices.instrument.find(choice => choice.id === config.instrument)!;
  const energy = choices.power.find(choice => choice.id === config.power)!;
  const ground = choices.ground.find(choice => choice.id === config.ground)!;
  const orbit = choices.orbit.find(choice => choice.id === config.orbit)!;
  const duration = choices.duration.find(choice => choice.id === config.duration)!;
  const goalCompatible = preflight.constraints.find(condition => condition.id === 'instrument')!.met;
  const configKeys: readonly (keyof ExpeditionConfig)[] = ['launch', 'orbit', 'duration', 'instrument', 'power', 'ground'];
  return freeze({
    world: input.world, configurationKey: `${input.world}:${EXPEDITION_MODEL_VERSION}:${configKeys.map(key => config[key]).join('|')}`,
    source: { label: 'Catálogo didático com evidência NASA', version: EXPEDITION_MODEL_VERSION, note: 'Registros científicos de arquivo são reais. Massa, energia, pacotes e contatos são parâmetros didáticos. Os modelos NASA contextualizam o alvo; não fornecem capacidades ou dimensões da nave do jogo.' },
    payload: {
      id: config.instrument, kind: config.instrument, label: payload.label,
      principle: config.instrument === 'camera' ? 'A câmera representa o tipo de observação usado no levantamento visual. O exercício processa dimensões de Bennu já publicadas; não faz uma nova medição nas imagens.' : 'O espectrômetro representa a separação da luz por comprimento de onda. O exercício processa bins publicados de WASP-39 b, com incerteza; não realiza uma nova observação do Webb.',
      effect: `${payload.detail} ${goalCompatible ? 'O instrumento atende ao objetivo deste caso.' : 'Este instrumento não atende ao objetivo deste caso, mesmo que seus dados sejam transmitidos.'}`,
      bitsPerRecord: payload.bitsPerRecord!, totalLoadW: payload.totalLoadW!, goalCompatible,
      metrics: [metric('Pacote didático por registro', payload.bitsPerRecord! / 1_000_000, 'Mbit'), metric('Carga total durante processamento', payload.totalLoadW!, 'W')],
      massKg: payload.massKg, credits: payload.credits,
    },
    energy: {
      label: energy.label, principle: 'Painel e bateria formam um único pacote de energia. Potência e capacidade orientam a comparação visual; não indicam dimensões ou quantidade real de células.',
      effect: energy.detail, panelW: energy.watts!, batteryWh: energy.capacityWh!, maxDischargeW: energy.maxDischargeW!,
      panelRatio: energy.watts! / Math.max(...choices.power.map(choice => choice.watts!)),
      batteryRatio: energy.capacityWh! / Math.max(...choices.power.map(choice => choice.capacityWh!)),
      metrics: [metric('Potência do painel', energy.watts!, 'W'), metric('Capacidade da bateria', energy.capacityWh!, 'Wh'), metric('Descarga máxima da bateria', energy.maxDischargeW!, 'W')],
      massKg: energy.massKg, credits: energy.credits,
    },
    communications: {
      label: ground.label, principle: 'As duas opções de solo usam o mesmo rádio e a mesma taxa. Mudar a duração dos contatos não aumenta a antena nem a massa da nave.',
      effect: `${ground.detail} ${duration.detail} As janelas abaixo são a agenda planejada; a vida operacional pode terminar antes de uma delas.`,
      radioHardware: 'generic', rateBps: ground.rateBps!, scheduleLabel: `${ground.label} · ${orbit.label} · ${duration.label}`,
      contacts: contactsCopy(schedule.contacts), metrics: [metric('Taxa útil do rádio', ground.rateBps! / 1_000_000, 'Mbit/s'), metric('Janelas na agenda', schedule.contacts.length, 'janelas')],
      massKg: ground.massKg, credits: ground.credits,
    },
    storage: { label: 'Memória fixa do cenário', bufferBits: preflight.totals.bufferBits, massKg: null, credits: null },
    totals: { massKg: preflight.totals.massKg, credits: preflight.totals.credits },
  });
}
