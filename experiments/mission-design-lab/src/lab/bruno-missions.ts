import { calculateMissionScore } from '../metrics/mission-score.ts';
import type { MissionScore } from '../metrics/mission-score.ts';

export type BrunoMissionId = 'iss' | 'moon' | 'mars';
export const BRUNO_MODEL_VERSION = 'ipe-bruno-r25-v1';

export const BRUNO_CHOICES = {
  launcher: [
    { id: 'compact', label: 'Compacto', description: 'Menor custo e menor limite de massa transportada.', massKg: 0, credits: 9 },
    { id: 'heavy', label: 'Maior capacidade', description: 'Leva uma montagem mais pesada e ocupa mais do orçamento.', massKg: 0, credits: 20 },
  ],
  propulsion: [
    { id: 'chemical', label: 'Química', description: 'A transferência é mais rápida e o conjunto é mais pesado.', massKg: 24, credits: 5, travelFactor: 1, supportWh: 62 },
    { id: 'electric', label: 'Elétrica', description: 'Conjunto mais leve, com transferência mais longa no exercício.', massKg: 15, credits: 8, travelFactor: 1.25, supportWh: 84 },
  ],
  energy: [
    { id: 'standard', label: 'Reserva padrão', description: 'Banco mais leve com 360 Wh no início da janela crítica.', massKg: 18, credits: 5, capacityWh: 360 },
    { id: 'extended', label: 'Reserva ampliada', description: 'Mais massa para iniciar a janela crítica com 640 Wh.', massKg: 36, credits: 10, capacityWh: 640 },
  ],
  protection: [
    { id: 'light', label: 'Leve', description: 'Conserva margem de massa. Observe o requisito de chegada no briefing.', massKg: 9, credits: 3 },
    { id: 'reinforced', label: 'Reforçada', description: 'Absorve vibração e inclui proteção térmica com custo e massa maiores.', massKg: 29, credits: 8 },
  ],
  navigation: [
    { id: 'local', label: 'Enlace local', description: 'Pacote de orientação com antena leve. O volume disponível depende do destino.', massKg: 8, credits: 3 },
    { id: 'deep-space', label: 'Enlace direcional', description: 'A antena precisa de apontamento e aumenta o volume entregue na janela.', massKg: 21, credits: 8 },
  ],
  payload: [
    { id: 'targeted', label: 'Instrumento da missão', description: 'Registros compactos com a grandeza solicitada no briefing.', massKg: 10, credits: 7 },
    { id: 'survey', label: 'Câmera de reconhecimento', description: 'Imagens para situar o alvo. Cada registro ocupa mais espaço.', massKg: 26, credits: 5 },
  ],
} as const;

export type BrunoConfigKey = keyof typeof BRUNO_CHOICES;
export type BrunoConfig = { readonly [K in BrunoConfigKey]: (typeof BRUNO_CHOICES)[K][number]['id'] };
export type BrunoDecision = { key: BrunoConfigKey; from: BrunoConfig[BrunoConfigKey]; to: BrunoConfig[BrunoConfigKey] };
const keys = Object.keys(BRUNO_CHOICES) as BrunoConfigKey[];

export const DEFAULT_BRUNO_CONFIG: BrunoConfig = Object.freeze({
  launcher: 'compact', propulsion: 'chemical', energy: 'standard', protection: 'light',
  navigation: 'local', payload: 'targeted',
});

const HOUR_S = 3600;
const DAY_S = 24 * HOUR_S;
const REQUIRED_RECORDS = 6;

export const BRUNO_MISSIONS = {
  iss: {
    id: 'iss', name: 'Pulso Orbital', destination: 'Estação Espacial Internacional',
    question: 'Como medir mudanças na composição do ar após a entrega de um monitor à tripulação?',
    learn: 'Preserve a calibração do monitor e entregue seis leituras de compostos voláteis.',
    briefing: 'A tripulação precisa de leituras do ar em horários diferentes. Transporte o monitor sem perder a calibração durante a viagem.',
    fact: 'A NASA usa monitores da qualidade do ar na ISS para detectar e quantificar compostos orgânicos voláteis.',
    source: { label: 'NASA · Monitoramento do ar da ISS', url: 'https://www.nasa.gov/directorates/esdmd/hhp/toxicology-and-environmental-chemistry/' },
    instrument: 'Monitor de compostos voláteis',
    evidence: 'Seis leituras comparáveis para acompanhar variações. A causa de uma variação exige outras evidências.',
    payloadKg: 120, budget: 49, operationCredits: 4, baseDays: 30, deadlineDays: 40,
    launcherCapacity: { compact: 260, heavy: 470 }, supportWh: 165, insulationSavingWh: 0,
    recordEnergyWh: 18, contactMb: { local: 54, 'deep-space': 76 }, recordMb: { targeted: 5, survey: 10 },
  },
  moon: {
    id: 'moon', name: 'Eco Lunar', destination: 'Polo Sul da Lua',
    question: 'Que regiões frias e com indícios de hidrogênio merecem uma investigação de gelo?',
    learn: 'Planeje a reserva para a sombra e faça os mapas chegarem na janela de contato.',
    briefing: 'Combine temperatura e indícios de hidrogênio em seis setores do polo sul. Passagens em sombra reduzem a energia disponível para coletar os dados.',
    fact: 'No LRO, Diviner mede temperaturas. LEND mapeia a distribuição de hidrogênio a partir de nêutrons.',
    source: { label: 'NASA · Diviner e LEND no LRO', url: 'https://science.nasa.gov/mission/lro/spacecraft-and-instruments/' },
    instrument: 'Conjunto térmico e de nêutrons',
    evidence: 'Seis cruzamentos de temperatura e hidrogênio ajudam a priorizar setores. Confirmar gelo requer evidência adicional.',
    payloadKg: 240, budget: 57, operationCredits: 7, baseDays: 48, deadlineDays: 64,
    launcherCapacity: { compact: 365, heavy: 540 }, supportWh: 212, insulationSavingWh: 48,
    recordEnergyWh: 27, contactMb: { local: 12, 'deep-space': 64 }, recordMb: { targeted: 8, survey: 12 },
  },
  mars: {
    id: 'mars', name: 'Horizonte Rubro', destination: 'Cratera Jezero, Marte',
    question: 'Como medir vento, temperatura e poeira durante uma frente marciana?',
    learn: 'Chegue a tempo, proteja o módulo na entrada e envie as medições meteorológicas.',
    briefing: 'A janela de observação da frente de poeira é curta. A estação precisa chegar à superfície com proteção de entrada, reserva e enlace.',
    fact: 'Em Jezero, o MEDA do Perseverance mede variáveis meteorológicas e monitora partículas de poeira.',
    source: { label: 'NASA · Instrumentos do Perseverance e MEDA', url: 'https://science.nasa.gov/mission/mars-2020-perseverance/science-instruments/' },
    instrument: 'Estação meteorológica de superfície',
    evidence: 'Seis amostras descrevem a variação do tempo local. Previsões para outras regiões exigem outras observações.',
    payloadKg: 460, budget: 74, operationCredits: 12, baseDays: 210, deadlineDays: 232,
    launcherCapacity: { compact: 450, heavy: 680 }, supportWh: 288, insulationSavingWh: 20,
    recordEnergyWh: 36, contactMb: { local: 16, 'deep-space': 76 }, recordMb: { targeted: 9, survey: 15 },
  },
} as const satisfies Record<BrunoMissionId, { id: BrunoMissionId; name: string; destination: string; question: string; learn: string; [field: string]: unknown }>;

export interface BrunoDiagnostic { code: string; message: string; timeS: number; severity: 'error'; }
export interface BrunoTimelineEntry {
  phase: 'launch' | 'transfer' | 'acquisition' | 'downlink';
  timeS: number;
  title: string;
  message: string;
  state: 'ok' | 'warning' | 'blocked';
}
export interface BrunoResult {
  missionId: BrunoMissionId;
  config: BrunoConfig;
  outcome: 'success' | 'failure' | 'invalid';
  receivedRecords: number;
  deliveredRecords: number;
  generatedRecords: number;
  requiredRecords: number;
  massKg: number;
  maxMassKg: number;
  credits: number;
  budget: number;
  initialEnergyWh: number;
  minEnergyWh: number;
  finalEnergyWh: number;
  generatedBits: number;
  downlinkedBits: number;
  lostBits: number;
  queueBits: number;
  dataSizeMb: number;
  linkCapacityMb: number;
  acquisitionEnergyWh: number;
  travelDays: number;
  simulatedSeconds: number;
  modelVersion: typeof BRUNO_MODEL_VERSION;
  score: MissionScore;
  diagnostics: BrunoDiagnostic[];
  timeline: BrunoTimelineEntry[];
}

export function validateBrunoConfig(value: unknown): value is BrunoConfig {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const config = value as Record<string, unknown>;
  return Object.keys(config).length === keys.length && keys.every(key =>
    Object.hasOwn(config, key) && BRUNO_CHOICES[key].some(option => config[key] === option.id));
}

export function simulateBrunoMission(id: BrunoMissionId, config: BrunoConfig): BrunoResult {
  if (!Object.hasOwn(BRUNO_MISSIONS, id) || !validateBrunoConfig(config)) throw new RangeError('Projeto de missão inválido.');
  const mission = BRUNO_MISSIONS[id];
  const parts = keys.map(key => BRUNO_CHOICES[key].find(option => option.id === config[key])!);
  const propulsion = BRUNO_CHOICES.propulsion.find(option => option.id === config.propulsion)!;
  const power = BRUNO_CHOICES.energy.find(option => option.id === config.energy)!;
  const massKg = mission.payloadKg + parts.reduce((total, part) => total + part.massKg, 0);
  const credits = mission.operationCredits + parts.reduce((total, part) => total + part.credits, 0);
  const maxMassKg = mission.launcherCapacity[config.launcher];
  const travelDays = Math.ceil(mission.baseDays * propulsion.travelFactor * (1 + Math.max(0, massKg - 320) / 5000));
  const reinforced = config.protection === 'reinforced';
  const supportWh = mission.supportWh + propulsion.supportWh - (reinforced ? mission.insulationSavingWh : 0);
  const acquisitionEnergyWh = Math.max(0, power.capacityWh - supportWh);
  const linkCapacityMb = mission.contactMb[config.navigation];
  const dataSizeMb = mission.recordMb[config.payload];
  const recordEnergyWh = mission.recordEnergyWh - (config.payload === 'survey' ? 4 : 0);
  let generatedRecords = 0, receivedRecords = 0, deliveredRecords = 0, minEnergyWh: number = power.capacityWh;
  const diagnostics: BrunoDiagnostic[] = [];
  const timeline: BrunoTimelineEntry[] = [];
  function diagnose(code: string, message: string, timeS: number) {
    diagnostics.push({ code, message, timeS, severity: 'error' });
  }
  if (massKg > maxMassKg) diagnose('MASS_LIMIT', `A montagem pesa ${massKg} kg e este lançador suporta ${maxMassKg} kg neste destino.`, 0);
  if (credits > mission.budget) diagnose('BUDGET_LIMIT', `O plano custa ${credits} créditos para um orçamento de ${mission.budget}.`, 0);
  const launchBlocked = diagnostics.length > 0;
  timeline.push({ phase: 'launch', timeS: 0, title: 'Verificação de lançamento', message: launchBlocked ? 'O projeto ficou no hangar.' : `Montagem de ${massKg} kg aprovada para a transferência.`, state: launchBlocked ? 'blocked' : 'ok' });

  if (!launchBlocked) {
    const arrival = travelDays * DAY_S;
    if (travelDays > mission.deadlineDays) diagnose('ARRIVAL_WINDOW', `A chegada em ${travelDays} dias ultrapassou o limite de ${mission.deadlineDays} dias do briefing.`, arrival);
    if (id === 'mars' && !reinforced) diagnose('ENTRY_PROTECTION', 'A proteção leve deixou o módulo vulnerável na entrada atmosférica. A estação não chegou operacional à superfície.', arrival);
    const arrivalBlocked = diagnostics.length > 0;
    timeline.push({ phase: 'transfer', timeS: arrival, title: arrivalBlocked ? 'Chegada interrompida' : 'Chegada ao destino', message: `Transferência didática de ${travelDays} dias.`, state: arrivalBlocked ? 'blocked' : 'ok' });

    if (!arrivalBlocked) {
      const acquisition = arrival + 6 * HOUR_S;
      const downlink = arrival + 9 * HOUR_S;
      generatedRecords = Math.min(REQUIRED_RECORDS, Math.floor(acquisitionEnergyWh / recordEnergyWh));
      minEnergyWh = acquisitionEnergyWh - generatedRecords * recordEnergyWh;
      receivedRecords = Math.min(generatedRecords, Math.floor(linkCapacityMb / dataSizeMb));
      const calibrationLost = id === 'iss' && !reinforced;
      if (calibrationLost) diagnose('CALIBRATION_LOST', 'A vibração do transporte deixou o monitor sem referência de calibração. As leituras recebidas não são comparáveis.', arrival);
      if (config.payload === 'survey') diagnose('PAYLOAD_MISMATCH', 'As imagens situam o alvo. A pergunta do briefing exige a grandeza medida pelo instrumento da missão.', acquisition);
      if (generatedRecords < REQUIRED_RECORDS) diagnose('ENERGY_WINDOW', `A janela deixou ${acquisitionEnergyWh} Wh para coleta. Cada registro exige ${recordEnergyWh} Wh, limitando a coleta a ${generatedRecords} de ${REQUIRED_RECORDS} registros.`, acquisition);
      if (receivedRecords < generatedRecords) diagnose('CONTACT_CAPACITY', `O enlace levou ${receivedRecords} de ${generatedRecords} registros de ${dataSizeMb} MB. A janela comportou ${linkCapacityMb} MB.`, downlink);
      deliveredRecords = calibrationLost || config.payload === 'survey' ? 0 : receivedRecords;
      timeline.push({ phase: 'acquisition', timeS: acquisition, title: 'Coleta', message: `${generatedRecords} registros produzidos a bordo.`, state: generatedRecords === REQUIRED_RECORDS ? 'ok' : 'warning' });
      timeline.push({ phase: 'downlink', timeS: downlink, title: 'Recepção e validação', message: `${receivedRecords} recebidos · ${deliveredRecords} válidos para a pergunta.`, state: deliveredRecords === REQUIRED_RECORDS ? 'ok' : 'warning' });
    }
  }

  const outcome = launchBlocked ? 'invalid' : deliveredRecords === REQUIRED_RECORDS ? 'success' : 'failure';
  return {
    missionId: id, config: { ...config }, outcome,
    receivedRecords, deliveredRecords, generatedRecords, requiredRecords: REQUIRED_RECORDS,
    massKg, maxMassKg, credits, budget: mission.budget, travelDays, acquisitionEnergyWh, linkCapacityMb, dataSizeMb,
    initialEnergyWh: power.capacityWh, minEnergyWh, finalEnergyWh: minEnergyWh,
    generatedBits: generatedRecords * dataSizeMb * 8_000_000, downlinkedBits: receivedRecords * dataSizeMb * 8_000_000,
    lostBits: 0, queueBits: (generatedRecords - receivedRecords) * dataSizeMb * 8_000_000,
    simulatedSeconds: timeline.at(-1)!.timeS, modelVersion: BRUNO_MODEL_VERSION,
    score: calculateMissionScore({ validRecords: deliveredRecords, requiredRecords: REQUIRED_RECORDS, outcome, massKg, maxMassKg, credits, budget: mission.budget }),
    diagnostics, timeline,
  };
}
