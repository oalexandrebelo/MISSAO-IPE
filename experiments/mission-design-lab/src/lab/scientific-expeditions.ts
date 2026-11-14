import type { MissionEvent, TracePoint } from '../core/contracts.ts';
import { add, cmp, div, floorSafe, min, mul, q, sub, toNumber, ZERO } from '../core/exact.ts';
import type { MissionVisualState, MissionVisualSubsystem } from './mission-visual-state.ts';

export const EXPEDITION_MODEL_VERSION = 'ipe-expeditions-r14-v1' as const;
export type ExpeditionId = 'bennu' | 'telescope';
export interface ExpeditionConfig {
  launch: 'compact' | 'science'; orbit: 'near' | 'far'; duration: 'short' | 'full';
  instrument: 'camera' | 'spectrometer'; power: 'compact' | 'extended'; ground: 'short' | 'extended';
}
export type ExpeditionConfigKey = keyof ExpeditionConfig;
export interface ExpeditionChoice {
  readonly id: string; readonly label: string; readonly detail: string;
  readonly massKg: number; readonly credits: number;
  readonly capacityWh?: number; readonly watts?: number; readonly maxDischargeW?: number;
  readonly bitsPerRecord?: number; readonly totalLoadW?: number; readonly rateBps?: number;
}
export interface ExpeditionDatum {
  readonly id: string; readonly label: string; readonly goal: string; readonly syntheticLabel: string;
  readonly value: number; readonly unit: string;
}
export interface ExpeditionMetadata {
  readonly id: ExpeditionId; readonly title: string; readonly subtitle: string; readonly objective: string;
  readonly backstory: string; readonly dataNotice: string; readonly facts: readonly string[];
  readonly origins: readonly { title: string; url: string }[];
  readonly requirements: Readonly<Record<'launch' | 'space' | 'ground' | 'user', string>>;
  readonly dataFixture: readonly ExpeditionDatum[];
}
export interface ExpeditionTotals {
  readonly massKg: number; readonly credits: number; readonly maxMassKg: number; readonly budget: number;
  readonly capacityWh: number; readonly bufferBits: number; readonly panelW: number; readonly maxDischargeW: number;
}
export interface ExpeditionConstraint {
  readonly id: string; readonly label: string; readonly met: boolean;
  readonly measured: number; readonly limit: number; readonly unit: string;
}
export interface ExpeditionSchedule {
  readonly sunlight: readonly (readonly [number, number])[];
  readonly contacts: readonly (readonly [number, number])[];
  readonly jobStartsS: readonly number[]; readonly jobDurationS: number;
}
export interface ExpeditionObservation extends ExpeditionDatum {
  readonly producedAtS: number | null; readonly deliveredAtS: number | null; readonly valid: boolean;
  readonly generatedBits: number; readonly downlinkedBits: number; readonly lostBits: number;
}
export interface ExpeditionResult {
  readonly modelVersion: typeof EXPEDITION_MODEL_VERSION;
  readonly expeditionId: ExpeditionId; readonly config: Readonly<ExpeditionConfig>;
  readonly horizonS: number; readonly completedAtS: number; readonly outcome: 'success' | 'failure' | 'invalid';
  readonly totals: ExpeditionTotals; readonly constraints: readonly ExpeditionConstraint[]; readonly schedule: ExpeditionSchedule;
  readonly requiredRecords: number; readonly deliveredRecords: number;
  readonly initialEnergyWh: number; readonly finalEnergyWh: number; readonly minEnergyWh: number;
  readonly generatedBits: number; readonly downlinkedBits: number; readonly lostBits: number; readonly queueBits: number;
  readonly energyBalance: { readonly solarWh: number; readonly loadWh: number; readonly conversionLossWh: number; readonly spillWh: number; readonly residualWh: number };
  readonly events: readonly MissionEvent[]; readonly trace: readonly TracePoint[]; readonly observations: readonly ExpeditionObservation[];
}

function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}
const KEYS: readonly ExpeditionConfigKey[] = ['launch', 'orbit', 'duration', 'instrument', 'power', 'ground'];
const syntheticLabel = 'Observação sintética criada para o jogo';
const dataNotice = 'Todos os seis registros são sintéticos, em unidades didáticas: não são medições NASA. Os modelos NASA são referências geométricas. As 2 ou 3 horas representam operação após a chegada, sem simular o trajeto até o destino.';
const modelAssumptions = 'Premissas didáticas: estrutura de 1,2 kg e 15 créditos; memória de 720 Mbit; espera de 5 W; bateria começa em 80%; conversão ideal de energia de 100%, sem perdas de eficiência. Massa da estação terrestre não integra a massa da nave.';
const cameraGoal = 'Comparar a morfologia de três regiões por dois registros de imagem de cada região.';
const spectrumGoal = 'Comparar o fluxo infravermelho sintético de três faixas em duas exposições.';
const fixture = (prefix: string, labels: readonly string[], values: readonly number[], goal: string, unit: string): ExpeditionDatum[] => values.map((value, index) => ({
  id: `${prefix}-${index + 1}`, label: `${labels[index % 3]} · observação ${Math.floor(index / 3) + 1}`, value, unit, goal, syntheticLabel,
}));

export const EXPEDITIONS: Readonly<Record<ExpeditionId, ExpeditionMetadata>> = freeze({
  bennu: {
    id: 'bennu', title: 'Bennu: ler uma superfície', subtitle: 'Imagem, morfologia e entrega científica', objective: cameraGoal,
    backstory: 'Uma equipe fictícia solicita dois registros de cada região A, B e C. O índice de rugosidade é uma variável criada para comparar as vistas; não constitui mapa medido de Bennu.',
    dataNotice, facts: ['A nave Ipê é fictícia; o modelo NASA representa somente o contexto do alvo.', 'Órbitas, lançadores, massa, créditos e agendas abaixo são escolhas didáticas, sem C3 ou trajetória real.', modelAssumptions],
    origins: [{ title: 'NASA 3D Resources · 1999 RQ36 (Bennu)', url: 'https://science.nasa.gov/3d-resources/1999-rq36-asteroid/' }],
    requirements: { user: 'Receber dois registros válidos de cada uma das três regiões.', space: 'Usar câmera, energia e memória suficientes para seis registros.', launch: 'Respeitar massa, orçamento e compatibilidade do lançador com o perfil escolhido.', ground: 'Receber cada registro inteiro antes do fim da vida operacional escolhida.' },
    dataFixture: fixture('bennu', ['Região A', 'Região B', 'Região C'], [0.32, 0.61, 0.47, 0.35, 0.58, 0.49], cameraGoal, 'rugosidade didática (u.a.)'),
  },
  telescope: {
    id: 'telescope', title: 'Telescópio: ler a luz', subtitle: 'Espectro infravermelho e exposição', objective: spectrumGoal,
    backstory: 'Uma equipe fictícia pede duas exposições em três faixas infravermelhas. O fluxo foi inventado para o exercício; nenhuma diferença demonstra composição, água ou bioassinatura.',
    dataNotice, facts: ['O modelo de telescópio NASA é referência visual, não a nave simulada nem uma reprodução de seu desempenho.', 'LEO e L2 identificam perfis conceituais; o relógio começa na operação, após a chegada.', modelAssumptions],
    origins: [{ title: 'NASA 3D Resources · James Webb Space Telescope (A)', url: 'https://science.nasa.gov/3d-resources/james-webb-space-telescope-a/' }],
    requirements: { user: 'Receber dois valores válidos para cada uma das três faixas.', space: 'Usar espectrômetro; uma câmera não satisfaz este requisito.', launch: 'Escolher um lançador que suporte o perfil e os limites do projeto.', ground: 'Transmitir seis registros completos durante as janelas previstas.' },
    dataFixture: fixture('spectrum', ['Faixa 1,2 µm', 'Faixa 2,0 µm', 'Faixa 3,5 µm'], [0.82, 0.55, 0.29, 0.79, 0.57, 0.31], spectrumGoal, 'fluxo relativo (u.a.)'),
  },
});

const BASE_CHOICES: Readonly<Record<ExpeditionConfigKey, readonly ExpeditionChoice[]>> = freeze({
  launch: [
    { id: 'compact', label: 'Lançador compacto', detail: 'Envelope didático: 3 kg, 80 créditos; somente perfil próximo.', massKg: 0, credits: 8 },
    { id: 'science', label: 'Lançador científico', detail: 'Envelope didático: 4,2 kg, 115 créditos; ambos os perfis.', massKg: 0, credits: 20 },
  ],
  orbit: [
    { id: 'near', label: 'Perfil próximo', detail: 'Agenda didática próxima; não calcula trajetória de chegada.', massKg: 0, credits: 0 },
    { id: 'far', label: 'Perfil distante', detail: 'Outra agenda de observação, luz e contato; requer lançador científico.', massKg: 0, credits: 6 },
  ],
  duration: [
    { id: 'short', label: 'Vida operacional: 2 horas', detail: 'Encerra em 120 min, antes da última janela planejada.', massKg: 0, credits: 0 },
    { id: 'full', label: 'Vida operacional: 3 horas', detail: 'Permite executar a agenda completa de 180 min após chegada.', massKg: 0, credits: 4 },
  ],
  instrument: [
    { id: 'camera', label: 'Câmera de superfície', detail: '120 Mbit por registro; carga total de 22 W durante 60 s.', massKg: 0.45, credits: 12, bitsPerRecord: 120_000_000, totalLoadW: 22 },
    { id: 'spectrometer', label: 'Espectrômetro infravermelho', detail: '180 Mbit por registro; carga total de 30 W durante 60 s.', massKg: 0.75, credits: 22, bitsPerRecord: 180_000_000, totalLoadW: 30 },
  ],
  power: [
    { id: 'compact', label: 'Energia compacta', detail: '6 Wh; painel de 10 W; descarga máxima de 18 W.', massKg: 0.65, credits: 14, capacityWh: 6, watts: 10, maxDischargeW: 18 },
    { id: 'extended', label: 'Energia ampliada', detail: '24 Wh; painel de 22 W; descarga máxima de 35 W.', massKg: 1.25, credits: 26, capacityWh: 24, watts: 22, maxDischargeW: 35 },
  ],
  ground: [
    { id: 'short', label: 'Contatos curtos', detail: 'Duas janelas de 120 s; 1,2 Mbit/s; carga total de rádio 16 W.', massKg: 0, credits: 6, rateBps: 1_200_000 },
    { id: 'extended', label: 'Contatos ampliados', detail: 'Duas janelas de 500 s; mesma taxa e potência do rádio.', massKg: 0, credits: 12, rateBps: 1_200_000 },
  ],
});
export const DEFAULT_EXPEDITION_CONFIGS: Readonly<Record<ExpeditionId, Readonly<ExpeditionConfig>>> = freeze({
  bennu: { launch: 'compact', orbit: 'near', duration: 'full', instrument: 'camera', power: 'compact', ground: 'short' },
  telescope: { launch: 'compact', orbit: 'near', duration: 'full', instrument: 'spectrometer', power: 'compact', ground: 'short' },
});

export function getExpeditionChoices(id: ExpeditionId): Readonly<Record<ExpeditionConfigKey, readonly ExpeditionChoice[]>> {
  if (!Object.hasOwn(EXPEDITIONS, id)) throw new RangeError('Expedição desconhecida.');
  const labels = id === 'bennu' ? ['Sobrevoo próximo', 'Órbita de levantamento'] : ['Órbita terrestre conceitual (LEO)', 'L2 conceitual'];
  return freeze({ ...BASE_CHOICES, orbit: BASE_CHOICES.orbit.map((choice, index) => ({ ...choice, label: labels[index]! })) });
}

export function getExpeditionPreflight(id: ExpeditionId, config: ExpeditionConfig): { readonly totals: ExpeditionTotals; readonly constraints: readonly ExpeditionConstraint[] } {
  const choices = getExpeditionChoices(id);
  if (config === null || typeof config !== 'object' || Reflect.ownKeys(config).length !== KEYS.length
    || !KEYS.every(key => Object.hasOwn(config, key) && choices[key].some(choice => choice.id === config[key]))) throw new TypeError('A expedição exige exatamente seis escolhas válidas.');
  const selected = KEYS.map(key => choices[key].find(choice => choice.id === config[key])!);
  const power = choices.power.find(choice => choice.id === config.power)!;
  const totals: ExpeditionTotals = {
    massKg: (1200 + selected.reduce((sum, choice) => sum + Math.round(choice.massKg * 1000), 0)) / 1000,
    credits: 15 + selected.reduce((sum, choice) => sum + choice.credits, 0),
    maxMassKg: config.launch === 'compact' ? 3 : 4.2, budget: config.launch === 'compact' ? 80 : 115,
    capacityWh: power.capacityWh!, panelW: power.watts!, maxDischargeW: power.maxDischargeW!, bufferBits: 720_000_000,
  };
  const instrumentMet = config.instrument === (id === 'bennu' ? 'camera' : 'spectrometer');
  const reachMet = config.launch === 'science' || config.orbit === 'near';
  return freeze({ totals, constraints: [
    { id: 'instrument', label: 'Instrumento atende ao objetivo', met: instrumentMet, measured: Number(instrumentMet), limit: 1, unit: 'compatibilidade' },
    { id: 'launch-orbit', label: 'Lançador atende ao perfil', met: reachMet, measured: Number(reachMet), limit: 1, unit: 'compatibilidade' },
    { id: 'mass', label: 'Massa dentro do envelope', met: totals.massKg <= totals.maxMassKg, measured: totals.massKg, limit: totals.maxMassKg, unit: 'kg' },
    { id: 'budget', label: 'Custo dentro do orçamento', met: totals.credits <= totals.budget, measured: totals.credits, limit: totals.budget, unit: 'créditos' },
  ] });
}

function scheduleFor(id: ExpeditionId, config: ExpeditionConfig): ExpeditionSchedule {
  const far = config.orbit === 'far';
  const starts = far ? [5700, 9600] : config.ground === 'extended' ? [5100, 9000] : [5400, 9000];
  const length = config.ground === 'extended' ? 500 : 120;
  return {
    sunlight: !far ? [[0, 2700], [4500, 8100], [9900, 10_800]] : id === 'telescope' ? [[0, 10_800]] : [[0, 2400], [7200, 7800], [10_200, 10_800]],
    contacts: starts.map(start => [start, start + length] as const),
    jobStartsS: far ? [900, 1500, 2100, 6900, 7500, 8100] : [600, 1200, 1800, 6600, 7200, 7800], jobDurationS: 60,
  };
}

/** Fixed educational scenarios. Exact W·s and integer bit ledgers; ideal 100% conversion, no trajectory model. */
export function simulateExpedition(id: ExpeditionId, input: ExpeditionConfig): ExpeditionResult {
  const { totals, constraints: preflight } = getExpeditionPreflight(id, input);
  const config = { ...input }, schedule = scheduleFor(id, config), horizonS = config.duration === 'short' ? 7200 : 10_800;
  const instrument = BASE_CHOICES.instrument.find(choice => choice.id === config.instrument)!;
  const batchBits = instrument.bitsPerRecord!, rate = 1_200_000, capacity = q(totals.capacityWh * 3600);
  const initial = mul(capacity, q(4, 5));
  let energy = initial, minimum = initial, time = ZERO, solarWs = ZERO, loadWs = ZERO, spillWs = ZERO, partialBit = ZERO;
  let generatedBits = 0, downlinkedBits = 0, lostBits = 0, queueBits = 0, peakW = 0, depleted = false, peakFailed = false;
  const valid = preflight.find(item => item.id === 'instrument')!.met;
  const observations = EXPEDITIONS[id].dataFixture.map(record => ({ ...record, producedAtS: null as number | null, deliveredAtS: null as number | null, valid, generatedBits: 0, downlinkedBits: 0, lostBits: 0 }));
  const events: MissionEvent[] = [], trace: TracePoint[] = [], packets: { index: number; remaining: number }[] = [];
  const started = new Set<number>(), boundariesSeen = new Set<number>();
  const boundaries = [...new Set([0, horizonS, ...schedule.sunlight.flat(), ...schedule.contacts.flat(), ...schedule.jobStartsS.flatMap(start => [start, start + 60])])].filter(value => value >= 0 && value <= horizonS).sort((a, b) => a - b);
  const emit = (code: string, message: string, severity: MissionEvent['severity'] = 'info', extra: Partial<Pick<MissionEvent, 'recordId' | 'value' | 'limit'>> = {}) => events.push({ id: `exp-event-${events.length + 1}`, timeS: toNumber(time), code, severity, rule: `expedition:${code.toLowerCase()}`, message, ...extra });
  const active = ([start, end]: readonly [number, number]) => cmp(time, q(start)) >= 0 && cmp(time, q(end)) < 0;
  const append = (mode: string, solarW = 0, loadW = 0) => trace.push({ timeS: toNumber(time), energyWh: toNumber(div(energy, q(3600))), queueBits, downlinkedBits, solarW, loadW, mode });
  emit('MISSION_START', 'Operação didática após chegada; seis registros sintéticos e entradas fixas.');
  const staticCodes: Record<string, string> = { instrument: 'INSTRUMENT_MISMATCH', 'launch-orbit': 'LAUNCH_PROFILE', mass: 'MASS_LIMIT', budget: 'BUDGET_LIMIT' };
  for (const item of preflight) if (!item.met) emit(staticCodes[item.id]!, item.label, 'error', { value: item.measured, limit: item.limit });
  while (true) {
    const now = toNumber(time);
    for (let index = 0; index < observations.length; index++) {
      const record = observations[index]!;
      if (started.has(index) && record.producedAtS === null && cmp(time, q(schedule.jobStartsS[index]! + 60)) === 0) {
        record.producedAtS = now; record.generatedBits = batchBits; generatedBits += batchBits;
        emit('JOB_COMPLETE', 'Registro sintético produzido integralmente.', 'info', { recordId: record.id, value: batchBits });
        if (queueBits + batchBits > totals.bufferBits) {
          record.lostBits = batchBits; lostBits += batchBits;
          emit('BUFFER_OVERFLOW', 'O novo registro não cabe inteiro na memória.', 'error', { recordId: record.id, value: queueBits + batchBits, limit: totals.bufferBits });
        } else { packets.push({ index, remaining: batchBits }); queueBits += batchBits; }
      }
    }
    if (cmp(energy, ZERO) === 0) { depleted = true; emit('ENERGY_DEPLETED', 'Bateria esgotada: operação encerrada.', 'error', { value: 0, limit: 0 }); append('terminated'); break; }
    if (cmp(time, q(horizonS)) === 0) { append('complete'); break; }
    if (!boundariesSeen.has(now)) {
      boundariesSeen.add(now);
      for (const [start, end] of schedule.sunlight) {
        if (now === start) emit('SUNLIGHT_START', 'Trecho iluminado previsto iniciado.');
        if (now === end) emit('SUNLIGHT_END', 'Eclipse didático iniciado; geração solar zero.');
      }
      for (const [start, end] of schedule.contacts) {
        if (now === start) emit('CONTACT_START', 'Janela didática de recepção iniciada.');
        if (now === end) emit('CONTACT_END', 'Janela encerrada; recepção parcial não é registro completo.');
      }
      schedule.jobStartsS.forEach((start, index) => { if (now === start) { started.add(index); emit('JOB_START', 'Iniciada observação sintética de 60 s.', 'info', { recordId: observations[index]!.id }); } });
    }
    const processing = schedule.jobStartsS.some(start => active([start, start + 60]));
    const transmitting = !processing && queueBits > 0 && schedule.contacts.some(active);
    const mode = processing ? 'processing' : transmitting ? 'transmitting' : 'idle';
    const solarW = schedule.sunlight.some(active) ? totals.panelW : 0;
    const loadW = processing ? instrument.totalLoadW! : transmitting ? 16 : 5, netW = solarW - loadW;
    peakW = Math.max(peakW, -netW);
    if (-netW > totals.maxDischargeW) { peakFailed = true; emit('PEAK_POWER', 'Demanda excede a descarga máxima da bateria.', 'error', { value: -netW, limit: totals.maxDischargeW }); append('terminated'); break; }
    let next = q(boundaries.find(value => cmp(q(value), time) > 0)!);
    if (transmitting) next = min(next, add(time, div(sub(q(packets[0]!.remaining), partialBit), q(rate))));
    if (netW > 0 && cmp(energy, capacity) < 0) next = min(next, add(time, div(sub(capacity, energy), q(netW))));
    if (netW < 0) next = min(next, add(time, div(energy, q(-netW))));
    append(mode, solarW, loadW);
    const duration = sub(next, time), before = energy;
    solarWs = add(solarWs, mul(q(solarW), duration)); loadWs = add(loadWs, mul(q(loadW), duration));
    if (netW > 0 && cmp(energy, capacity) === 0) spillWs = add(spillWs, mul(q(netW), duration));
    else energy = add(energy, mul(q(netW), duration));
    minimum = min(minimum, energy); time = next;
    if (transmitting) {
      const potential = add(partialBit, mul(q(rate), duration)), sent = floorSafe(potential), packet = packets[0]!;
      partialBit = sub(potential, q(sent)); packet.remaining -= sent; queueBits -= sent; downlinkedBits += sent;
      const record = observations[packet.index]!; record.downlinkedBits += sent;
      if (packet.remaining === 0) {
        record.deliveredAtS = toNumber(time); packets.shift();
        emit('RECORD_DELIVERED', valid ? 'Registro sintético completo e instrumento compatível.' : 'Registro completo, mas instrumento incompatível com o objetivo.', valid ? 'info' : 'warning', { recordId: record.id });
        if (!queueBits) emit('QUEUE_EMPTY', 'Fila vazia; rádio retorna à espera.');
      }
    }
    if (cmp(before, capacity) < 0 && cmp(energy, capacity) === 0) emit('BATTERY_FULL', 'Bateria cheia; excedente posterior será descartado.', 'info', { value: totals.capacityWh, limit: totals.capacityWh });
  }
  const deliveredRecords = observations.filter(record => record.valid && record.deliveredAtS !== null).length;
  if (deliveredRecords < 6) emit('DELIVERY_SHORTFALL', 'Nem todos os seis registros válidos chegaram ao solo.', 'error', { value: deliveredRecords, limit: 6 });
  const constraints: ExpeditionConstraint[] = [...preflight,
    { id: 'energy', label: 'Bateria sustenta toda a vida operacional', met: !depleted && cmp(time, q(horizonS)) === 0, measured: toNumber(div(minimum, q(3600))), limit: 0, unit: 'Wh' },
    { id: 'peak-power', label: 'Descarga dentro do limite', met: !peakFailed, measured: peakW, limit: totals.maxDischargeW, unit: 'W' },
    { id: 'memory', label: 'Nenhum registro perdido por falta de memória', met: lostBits === 0, measured: lostBits, limit: 0, unit: 'bits perdidos' },
    { id: 'delivery', label: 'Seis registros válidos entregues', met: deliveredRecords === 6, measured: deliveredRecords, limit: 6, unit: 'registros' },
  ];
  const outcome = preflight.some(item => !item.met) ? 'invalid' : constraints.every(item => item.met) ? 'success' : 'failure';
  emit('MISSION_END', 'Operação encerrada; valores e evidências preservados.', outcome === 'success' ? 'info' : 'error');
  const residual = sub(sub(sub(add(initial, solarWs), loadWs), spillWs), energy);
  if (cmp(residual, ZERO) !== 0 || generatedBits !== downlinkedBits + queueBits + lostBits) throw new Error('Balanço interno da expedição não conserva.');
  return freeze({ modelVersion: EXPEDITION_MODEL_VERSION, expeditionId: id, config, horizonS, completedAtS: toNumber(time), outcome, totals, constraints, schedule, requiredRecords: 6, deliveredRecords,
    initialEnergyWh: toNumber(div(initial, q(3600))), finalEnergyWh: toNumber(div(energy, q(3600))), minEnergyWh: toNumber(div(minimum, q(3600))),
    generatedBits, downlinkedBits, lostBits, queueBits, energyBalance: { solarWh: toNumber(div(solarWs, q(3600))), loadWh: toNumber(div(loadWs, q(3600))), spillWh: toNumber(div(spillWs, q(3600))), conversionLossWh: 0, residualWh: 0 }, events, trace, observations });
}

const FOCUS: Readonly<Record<string, MissionVisualSubsystem>> = {
  SUNLIGHT_START: 'panel', SUNLIGHT_END: 'panel', BATTERY_FULL: 'battery', ENERGY_DEPLETED: 'battery', PEAK_POWER: 'battery',
  JOB_START: 'processing', JOB_COMPLETE: 'processing', INSTRUMENT_MISMATCH: 'processing', BUFFER_OVERFLOW: 'buffer',
  CONTACT_START: 'radio', CONTACT_END: 'radio', RECORD_DELIVERED: 'radio', QUEUE_EMPTY: 'radio',
};

export function getExpeditionVisualState(result: ExpeditionResult, requestedTimeS: number, selectedEventId?: string): MissionVisualState {
  if (!Number.isFinite(requestedTimeS)) throw new RangeError('O instante visual deve ser finito.');
  const timeS = Math.max(0, Math.min(result.horizonS, requestedTimeS));
  let point: TracePoint | undefined;
  for (const candidate of result.trace) if (candidate.timeS <= timeS && (!point || candidate.timeS >= point.timeS)) point = candidate;
  const active = ([start, end]: readonly [number, number]) => timeS >= start && timeS < end;
  const contactAvailable = result.schedule.contacts.some(active), eventsAtTime = result.events.filter(event => event.timeS === timeS);
  const selected = selectedEventId === undefined
    ? eventsAtTime.find(event => event.severity === 'error' && FOCUS[event.code]) ?? eventsAtTime.find(event => FOCUS[event.code])
    : result.events.find(event => event.id === selectedEventId && event.timeS <= timeS);
  return freeze({ timeS, progress: timeS / result.horizonS, sourceStateTimeS: point?.timeS ?? null, available: point !== undefined,
    energyWh: point?.energyWh ?? null, energyFraction: point ? point.energyWh / result.totals.capacityWh : null,
    queueBits: point?.queueBits ?? null, queueFraction: point ? point.queueBits / result.totals.bufferBits : null,
    downlinkedBits: point?.downlinkedBits ?? null, solarW: point?.solarW ?? null, loadW: point?.loadW ?? null,
    illuminated: result.schedule.sunlight.some(active), contactAvailable, transmitting: point?.mode === 'transmitting' && contactAvailable, mode: point?.mode ?? null,
    eventsAtTime, deliveredRecordIds: result.observations.filter(record => record.valid && record.deliveredAtS !== null && record.deliveredAtS <= timeS).map(record => record.id),
    focusSubsystem: selected ? FOCUS[selected.code] ?? null : point?.mode === 'processing' ? 'processing' : point?.mode === 'transmitting' ? 'radio' : null,
  });
}
