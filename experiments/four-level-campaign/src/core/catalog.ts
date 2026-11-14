import type { ComponentChoice, ConfigKey, MissionConfig, Scenario, ScenarioId } from './contracts.ts';

export const BASE_MASS_KG = 1.2;
export const BASE_CREDITS = 20;
export const CONFIG_KEYS: readonly ConfigKey[] = Object.freeze(['battery', 'panel', 'processing', 'radio', 'buffer', 'policy']);

function choices(items: ComponentChoice[]): readonly ComponentChoice[] {
  return Object.freeze(items.map(item => Object.freeze(item)));
}

/** Educational assumptions, not a hardware specification or a NASA calibration. */
export const CATALOG: Readonly<Record<ConfigKey, readonly ComponentChoice[]>> = Object.freeze({
  battery: choices([
    { id: 'small', label: 'Bateria 16 Wh', description: '16 Wh; descarga máxima na bateria de 20 W; carga limitada a 10 W de entrada.', massKg: 0.6, credits: 12, capacityWh: 16, maxDischargeW: 20 },
    { id: 'large', label: 'Bateria 24 Wh', description: '24 Wh; descarga máxima na bateria de 35 W; carga limitada a 10 W de entrada.', massKg: 1, credits: 19, capacityWh: 24, maxDischargeW: 35 },
  ]),
  panel: choices([
    { id: 'compact', label: 'Painel 12 W', description: 'Potência nominal de 12 W; fatores didáticos de iluminação e orientação.', massKg: 0.25, credits: 10, watts: 12 },
    { id: 'standard', label: 'Painel 18 W', description: 'Potência nominal de 18 W; fatores didáticos de iluminação e orientação.', massKg: 0.55, credits: 16, watts: 18 },
  ]),
  processing: choices([
    { id: 'bands', label: 'BANDAS R/NIR', description: '180 Mbit por lote; 26 W totais durante 60 s; NDVI calculado no solo após recepção completa.', massKg: 0.35, credits: 8, bitsPerRecord: 180_000_000, totalLoadW: 26 },
    { id: 'index', label: 'ÍNDICE NDVI', description: '60 Mbit por lote; 38 W totais durante 60 s; mesma pergunta e máscara científica.', massKg: 0.4, credits: 14, bitsPerRecord: 60_000_000, totalLoadW: 38 },
  ]),
  radio: choices([
    { id: 'economy', label: 'Rádio econômico', description: '960.000 bit/s de serviço útil; 16 W totais durante transmissão.', massKg: 0.2, credits: 10, rateBps: 960_000, totalLoadW: 16 },
    { id: 'fast', label: 'Rádio rápido', description: '2.400.000 bit/s de serviço útil; 26 W totais durante transmissão.', massKg: 0.45, credits: 17, rateBps: 2_400_000, totalLoadW: 26 },
  ]),
  buffer: choices([
    { id: 'compact', label: 'Memória 512 Mbit', description: '512.000.000 bits; um lote só entra completo; falta de espaço perde o lote novo.', massKg: 0.05, credits: 2, capacityBits: 512_000_000 },
    { id: 'large', label: 'Memória 1.536 Mbit', description: '1.536.000.000 bits; transmissão FIFO, inclusive lotes parciais entre contatos.', massKg: 0.15, credits: 5, capacityBits: 1_536_000_000 },
  ]),
  policy: choices([
    { id: 'every-contact', label: 'Todos os contatos', description: 'Transmite automaticamente em cada janela disponível até esvaziar a fila.', massKg: 0, credits: 0 },
    { id: 'last-contact', label: 'Último contato', description: 'Reserva a transmissão para a última janela; escolha feita antes da execução.', massKg: 0, credits: 0 },
  ]),
});

export const DEFAULT_CONFIG: Readonly<MissionConfig> = Object.freeze({
  battery: 'small', panel: 'standard', processing: 'bands', radio: 'economy', buffer: 'large', policy: 'every-contact',
});

function freezeScenario(scenario: Scenario): Scenario {
  return Object.freeze({ ...scenario,
    sunlight: Object.freeze(scenario.sunlight.map(interval => Object.freeze([...interval] as [number, number]))),
    contacts: Object.freeze(scenario.contacts.map(interval => Object.freeze([...interval] as [number, number]))),
    jobStartsS: Object.freeze([...scenario.jobStartsS]),
  });
}
const scenarioBase = {
  horizonS: 10_800, sunlight: [[0, 5_400], [7_200, 9_000]] as const,
  jobStartsS: [600, 1_200, 1_800, 2_400, 3_000, 3_600], jobDurationS: 60,
  budget: 86, maxMassKg: 3.6,
};
export const SCENARIOS: readonly Scenario[] = Object.freeze([
  freezeScenario({ ...scenarioBase, id: 'long-contact', title: 'Contatos longos', description: 'Duas janelas de 600 s em uma missão simulada de 180 min.', contacts: [[5_400, 6_000], [9_000, 9_600]] }),
  freezeScenario({ ...scenarioBase, id: 'short-contact', title: 'Contatos curtos', description: 'Mesma pergunta NDVI e mesmos seis registros; duas janelas de 240 s.', contacts: [[5_400, 5_640], [9_000, 9_240]] }),
]);

export function getScenario(id: ScenarioId): Scenario {
  const scenario = SCENARIOS.find(candidate => candidate.id === id);
  if (!scenario) throw new RangeError(`Cenário desconhecido: ${String(id)}`);
  return scenario;
}

export function assertMissionConfig(config: unknown): asserts config is MissionConfig {
  if (config === null || typeof config !== 'object' || Array.isArray(config)) throw new TypeError('Configuração deve ser um objeto.');
  const proto = Object.getPrototypeOf(config);
  if (proto !== Object.prototype && proto !== null) throw new TypeError('Protótipo de configuração não permitido.');
  if (Reflect.ownKeys(config).length !== CONFIG_KEYS.length) throw new TypeError('Configuração exige exatamente seis escolhas.');
  for (const key of CONFIG_KEYS) {
    if (!Object.hasOwn(config, key) || !CATALOG[key].some(choice => choice.id === (config as MissionConfig)[key])) {
      throw new TypeError(`Escolha inválida: ${key}`);
    }
  }
}

export function getConfigTotals(config: MissionConfig): { massKg: number; credits: number } {
  assertMissionConfig(config);
  let massGrams = 1_200;
  let credits = BASE_CREDITS;
  for (const key of CONFIG_KEYS) {
    const choice = CATALOG[key].find(item => item.id === config[key])!;
    massGrams += Math.round(choice.massKg * 1_000);
    credits += choice.credits;
  }
  return { massKg: massGrams / 1_000, credits };
}

export const PHYSICS = Object.freeze({
  initialChargePercent: 80, reservePercent: 15, chargeEfficiencyPercent: 95,
  dischargeEfficiencyPercent: 95, maxChargeInputW: 10, baseLoadW: 8,
  workPanelFactorPercent: 55, idlePanelFactorPercent: 85,
});
