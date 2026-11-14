import { CATALOG_VERSION, ENGINE_VERSION, RESULT_SCHEMA_VERSION } from './contracts.ts';
import type { ComponentChoice, MissionConfig, MissionEvent, MissionResult, ObservationResult, Scenario, ScenarioId, ScienceRecord, SimulationOptions, TracePoint } from './contracts.ts';
import { assertMissionConfig, CATALOG, getConfigTotals, getScenario, PHYSICS } from './catalog.ts';
import { SCIENCE_RECORDS } from '../data/science-data.ts';
import { validateScienceRecord } from './science.ts';
import { add, cmp, div, floorSafe, min, mul, q, sub, toNumber, ZERO } from './exact.ts';
import type { Fraction } from './exact.ts';
import { powerFlow } from './power.ts';
import type { PowerFlow } from './power.ts';

type ActiveMode = 'idle' | 'processing' | 'transmitting' | 'terminated' | 'complete';
interface Packet { observationIndex: number; remainingBits: number; }
type Powers = PowerFlow;
const HOUR = q(3_600);
const ETA = q(PHYSICS.chargeEfficiencyPercent, 100);

function requireValue(component: ComponentChoice, key: keyof ComponentChoice): number {
  const value = component[key];
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) throw new Error(`Catálogo inválido: ${component.id}.${key}`);
  return value;
}
function safeSum(a: number, b: number): number {
  const sum = a + b;
  if (!Number.isSafeInteger(sum) || sum < 0) throw new RangeError('Ledger de bits fora do intervalo inteiro seguro.');
  return sum;
}
function active(time: Fraction, interval: readonly [number, number]): boolean {
  return cmp(time, q(interval[0])) >= 0 && cmp(time, q(interval[1])) < 0;
}
function validateModel(scenario: Scenario, records: readonly ScienceRecord[]): void {
  if (!Number.isSafeInteger(scenario.horizonS) || scenario.horizonS <= 0 || !Number.isSafeInteger(scenario.jobDurationS) || scenario.jobDurationS <= 0) throw new RangeError('Relógio do modelo inválido.');
  if (!Number.isFinite(scenario.budget) || scenario.budget < 0 || !Number.isFinite(scenario.maxMassKg) || scenario.maxMassKg < 0) throw new RangeError('Envelope do modelo inválido.');
  if (scenario.jobStartsS.length !== records.length || new Set(records.map(record => record.id)).size !== records.length) throw new RangeError('É necessário um trabalho por registro com ID único.');
  for (const intervals of [scenario.sunlight, scenario.contacts]) {
    let previousEnd = -1;
    for (const interval of intervals) {
      const [start, end] = interval;
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end <= start || end > scenario.horizonS || start < previousEnd) throw new RangeError('Intervalos do modelo inválidos.');
      previousEnd = end;
    }
  }
  let previousEnd = -1;
  for (const start of scenario.jobStartsS) {
    const end = start + scenario.jobDurationS;
    if (!Number.isSafeInteger(start) || start < 0 || start < previousEnd || end > scenario.horizonS) throw new RangeError('Trabalhos do modelo inválidos.');
    if (scenario.contacts.some(([a, b]) => start < b && end > a)) throw new RangeError('Este modelo fechado não permite trabalho simultâneo a contato.');
    previousEnd = end;
  }
}

/** The UI, worker, replay and exhaustive search all call this closed entry point. */
export function simulateMission(config: MissionConfig, scenarioId: ScenarioId, options: SimulationOptions = {}): MissionResult {
  return simulateMissionModel(config, getScenario(scenarioId), SCIENCE_RECORDS, options);
}

/** @internal Test seam for boundary/conservation counterexamples; never used by search or replay. */
export function simulateMissionModel(configInput: MissionConfig, scenario: Scenario, records: readonly ScienceRecord[], options: SimulationOptions = {}): MissionResult {
  assertMissionConfig(configInput);
  if (options === null || typeof options !== 'object' || (options.trace !== undefined && typeof options.trace !== 'boolean')) throw new TypeError('Opções de simulação inválidas.');
  validateModel(scenario, records);
  const config: MissionConfig = { ...configInput };
  const choice = (key: keyof MissionConfig): ComponentChoice => CATALOG[key].find(item => item.id === config[key])!;
  const capacityWh = requireValue(choice('battery'), 'capacityWh');
  const capacity = q(capacityWh);
  const maxDischarge = q(requireValue(choice('battery'), 'maxDischargeW'));
  const panelW = requireValue(choice('panel'), 'watts');
  const processingW = requireValue(choice('processing'), 'totalLoadW');
  const bitsPerRecord = requireValue(choice('processing'), 'bitsPerRecord');
  const radioW = requireValue(choice('radio'), 'totalLoadW');
  const rateBps = requireValue(choice('radio'), 'rateBps');
  const bufferBits = requireValue(choice('buffer'), 'capacityBits');
  const totals = getConfigTotals(config);
  const initialEnergy = mul(capacity, q(PHYSICS.initialChargePercent, 100));
  const reserve = mul(capacity, q(PHYSICS.reservePercent, 100));
  let energy = initialEnergy;
  let minimumEnergy = energy;
  let solarWh = ZERO;
  let loadWh = ZERO;
  let conversionLossWh = ZERO;
  let spillWh = ZERO;
  let time = ZERO;
  let generatedBits = 0;
  let downlinkedBits = 0;
  let lostBits = 0;
  let queueBits = 0;
  let partialBit = ZERO;
  let reachedEmpty = false;
  let terminated = false;
  const packets: Packet[] = [];
  const events: MissionEvent[] = [];
  const trace: TracePoint[] = [];
  const violations = new Set<string>();
  const completedJobs = new Set<number>();
  const startedJobs = new Set<number>();
  const processedBoundaries = new Set<number>();
  const scientific = records.map(validateScienceRecord);
  const observations: ObservationResult[] = records.map((record, i) => ({
    id: record.id, generatedBits: '0', downlinkedBits: '0', lostBits: '0', state: 'not-produced',
    producedAtS: null, deliveredAtS: null, ndvi: null, expectedNdvi: record.ndviProduct, scienceValid: scientific[i]!.valid,
  }));
  const emit = (code: string, severity: MissionEvent['severity'], rule: string, message: string, extra: Partial<Pick<MissionEvent, 'recordId' | 'value' | 'limit'>> = {}): void => {
    events.push({ id: `event-${events.length + 1}`, timeS: toNumber(time), code, severity, rule, message, ...extra });
  };
  const fail = (violation: string, code: string, message: string, rule: string, extra: Partial<Pick<MissionEvent, 'recordId' | 'value' | 'limit'>> = {}): void => {
    violations.add(violation);
    emit(code, 'error', rule, message, extra);
  };
  const appendTrace = (mode: ActiveMode, powers: Powers | null): void => {
    if (options.trace === false) return;
    const point: TracePoint = { timeS: toNumber(time), energyWh: toNumber(energy), queueBits, downlinkedBits, solarW: powers ? toNumber(powers.solar) : 0, loadW: powers ? toNumber(powers.load) : 0, mode };
    const last = trace.at(-1);
    if (last?.timeS === point.timeS) trace[trace.length - 1] = point;
    else trace.push(point);
  };
  const powersFor = (mode: ActiveMode): Powers => {
    const illuminated = scenario.sunlight.some(interval => active(time, interval));
    const factor = mode === 'processing' ? PHYSICS.workPanelFactorPercent : PHYSICS.idlePanelFactorPercent;
    const solar = illuminated ? q(panelW * factor, 100) : ZERO;
    const load = q(mode === 'processing' ? processingW : mode === 'transmitting' ? radioW : PHYSICS.baseLoadW);
    return powerFlow(solar, load, energy, capacity, q(PHYSICS.maxChargeInputW), ETA);
  };
  const boundaries = [...new Set([0, scenario.horizonS, ...scenario.sunlight.flat(), ...scenario.contacts.flat(), ...scenario.jobStartsS.flatMap(start => [start, start + scenario.jobDurationS])])].sort((a, b) => a - b);
  emit('MISSION_START', 'info', 'fixed-inputs', 'Execução determinística iniciada com registros MOD13 de arquivo e recursos didáticos.');
  if (totals.massKg > scenario.maxMassKg) fail('mass', 'MASS_LIMIT', 'Massa total excede o limite do lançador fixo.', 'massKg <= maxMassKg', { value: totals.massKg, limit: scenario.maxMassKg });
  if (totals.credits > scenario.budget) fail('budget', 'BUDGET_LIMIT', 'Créditos totais excedem o orçamento.', 'credits <= budget', { value: totals.credits, limit: scenario.budget });

  while (true) {
    // The previous interval is already fully integrated. A last bit and a completed
    // job at this boundary count before new modes/contacts are considered.
    for (let i = 0; i < scenario.jobStartsS.length; i++) {
      if (!completedJobs.has(i) && startedJobs.has(i) && cmp(time, q(scenario.jobStartsS[i]! + scenario.jobDurationS)) === 0) {
        completedJobs.add(i);
        const observation = observations[i]!;
        observation.producedAtS = toNumber(time);
        observation.generatedBits = String(bitsPerRecord);
        generatedBits = safeSum(generatedBits, bitsPerRecord);
        emit('JOB_COMPLETE', 'info', 'complete-batch-at-job-end', 'Trabalho concluído; lote completo produzido.', { recordId: observation.id, value: bitsPerRecord });
        if (!scientific[i]!.valid) fail('science', 'SCIENCE_REJECTED', `Registro rejeitado pela política científica: ${scientific[i]!.reasons.join(', ')}.`, 'NDVI-and-QA-valid', { recordId: observation.id });
        if (queueBits + bitsPerRecord > bufferBits) {
          lostBits = safeSum(lostBits, bitsPerRecord);
          observation.lostBits = String(bitsPerRecord);
          observation.state = 'lost';
          fail('buffer-overflow', 'BUFFER_OVERFLOW', 'O lote novo não cabe inteiro na memória e foi perdido.', 'queueBits + batchBits <= capacityBits', { recordId: observation.id, value: queueBits + bitsPerRecord, limit: bufferBits });
        } else {
          queueBits = safeSum(queueBits, bitsPerRecord);
          packets.push({ observationIndex: i, remainingBits: bitsPerRecord });
          observation.state = observation.scienceValid ? 'queued' : 'invalid';
        }
      }
    }
    if (reachedEmpty) {
      fail('energy-depleted', 'ENERGY_DEPLETED', 'Energia da bateria esgotada; a operação terminou nesta fronteira.', 'energyWh > 0 for continued operation', { value: 0, limit: 0 });
      terminated = true;
      appendTrace('terminated', null);
      break;
    }
    if (cmp(time, q(scenario.horizonS)) === 0) {
      appendTrace('complete', null);
      break;
    }
    const boundaryNumber = toNumber(time);
    if (time.d === 1n && !processedBoundaries.has(boundaryNumber)) {
      processedBoundaries.add(boundaryNumber);
      for (const [start, end] of scenario.sunlight) {
        if (end === boundaryNumber) emit('SUNLIGHT_END', 'info', 'sunlight-[start,end)', 'Início de eclipse: geração solar zero.');
        if (start === boundaryNumber) emit('SUNLIGHT_START', 'info', 'sunlight-[start,end)', 'Trecho iluminado iniciado.');
      }
      for (let i = 0; i < scenario.contacts.length; i++) {
        const [start, end] = scenario.contacts[i]!;
        if (end === boundaryNumber) emit('CONTACT_END', 'info', 'contacts-[start,end)', 'Janela encerrada; recepção parcial permanece no solo e o restante na fila.');
        if (start === boundaryNumber) {
          const permitted = config.policy === 'every-contact' || i === scenario.contacts.length - 1;
          emit(permitted ? 'CONTACT_START' : 'CONTACT_SKIPPED', 'info', 'preselected-automatic-policy', permitted ? 'Janela disponível para transmissão automática.' : 'Janela não utilizada pela política de último contato.');
        }
      }
      for (let i = 0; i < scenario.jobStartsS.length; i++) {
        if (scenario.jobStartsS[i] === boundaryNumber) {
          startedJobs.add(i);
          emit('JOB_START', 'info', 'fixed-60-second-job', 'Trabalho iniciado; nenhum bit fica disponível antes da conclusão.', { recordId: observations[i]!.id });
        }
      }
    }
    const jobActive = scenario.jobStartsS.some(start => active(time, [start, start + scenario.jobDurationS]));
    const contactIndex = scenario.contacts.findIndex(interval => active(time, interval));
    const canTransmit = contactIndex >= 0 && (config.policy === 'every-contact' || contactIndex === scenario.contacts.length - 1);
    const mode: ActiveMode = jobActive ? 'processing' : canTransmit && queueBits > 0 ? 'transmitting' : 'idle';
    const powers = powersFor(mode);
    if (cmp(powers.discharge, maxDischarge) > 0) {
      fail('peak-power', 'PEAK_POWER', 'Potência exigida na bateria excede o pico permitido; operação encerrada antes de executar este intervalo.', '(loadW - solarW) / dischargeEfficiency <= maxDischargeW', { value: toNumber(powers.discharge), limit: toNumber(maxDischarge) });
      terminated = true;
      appendTrace('terminated', null);
      break;
    }
    let next = q(boundaries.find(value => cmp(q(value), time) > 0)!);
    if (mode === 'transmitting') {
      const head = packets[0]!;
      next = min(next, add(time, div(sub(q(head.remainingBits), partialBit), q(rateBps))));
    }
    if (cmp(powers.change, ZERO) > 0 && cmp(energy, capacity) < 0) next = min(next, add(time, div(mul(sub(capacity, energy), HOUR), powers.change)));
    if (cmp(powers.discharge, ZERO) > 0) {
      next = min(next, add(time, div(mul(energy, HOUR), powers.discharge)));
      if (cmp(energy, reserve) > 0) next = min(next, add(time, div(mul(sub(energy, reserve), HOUR), powers.discharge)));
    }
    if (cmp(next, time) <= 0) throw new Error('O relógio de eventos não avançou.');
    if (cmp(energy, reserve) <= 0 && cmp(powers.discharge, ZERO) > 0 && !violations.has('reserve')) {
      fail('reserve', 'RESERVE_BREACH', 'A descarga continua abaixo da reserva; a violação fica registrada e a operação prossegue.', 'minEnergyWh >= reserveWh', { value: toNumber(energy), limit: toNumber(reserve) });
    }
    appendTrace(mode, powers);
    const duration = sub(next, time);
    const hours = div(duration, HOUR);
    const previousEnergy = energy;
    energy = add(energy, mul(powers.change, hours));
    minimumEnergy = min(minimumEnergy, energy);
    solarWh = add(solarWh, mul(powers.solar, hours));
    loadWh = add(loadWh, mul(powers.load, hours));
    conversionLossWh = add(conversionLossWh, mul(powers.loss, hours));
    spillWh = add(spillWh, mul(powers.spill, hours));
    if (cmp(energy, ZERO) < 0 || cmp(energy, capacity) > 0) throw new Error('Bateria violou os limites exatos.');
    time = next;
    if (mode === 'transmitting') {
      const potentialBits = add(partialBit, mul(q(rateBps), duration));
      const transmitted = floorSafe(potentialBits);
      partialBit = sub(potentialBits, q(transmitted));
      const packet = packets[0]!;
      if (transmitted > packet.remainingBits) throw new Error('Transmissão excedeu o pacote FIFO.');
      packet.remainingBits -= transmitted;
      queueBits -= transmitted;
      downlinkedBits = safeSum(downlinkedBits, transmitted);
      const observation = observations[packet.observationIndex]!;
      observation.downlinkedBits = String(safeSum(Number(observation.downlinkedBits), transmitted));
      if (packet.remainingBits === 0) {
        if (cmp(partialBit, ZERO) !== 0) throw new Error('Fração de bit após completar pacote.');
        packets.shift();
        observation.deliveredAtS = toNumber(time);
        observation.state = observation.scienceValid ? 'delivered' : 'invalid';
        observation.ndvi = scientific[packet.observationIndex]!.ndvi;
        emit('RECORD_DELIVERED', observation.scienceValid ? 'info' : 'warning', 'complete-reception-before-science', observation.scienceValid ? 'Lote integral recebido; NDVI e QA válidos para a pergunta científica.' : 'Lote integral recebido, mas sua ciência é inválida.', { recordId: observation.id });
        if (queueBits === 0) emit('QUEUE_EMPTY', 'info', 'empty-queue-switches-to-idle', 'Fila vazia; rádio deixa de consumir potência de transmissão.');
      } else if (transmitted > 0 && observation.scienceValid) observation.state = 'partial';
    }
    if (cmp(previousEnergy, capacity) < 0 && cmp(energy, capacity) === 0) emit('BATTERY_FULL', 'info', 'energyWh <= capacityWh', 'Bateria cheia; excedente solar posterior é contabilizado como descarte.', { value: capacityWh, limit: capacityWh });
    reachedEmpty = cmp(energy, ZERO) === 0 && cmp(powers.discharge, ZERO) > 0;
  }

  const deliveredRecords = observations.filter(observation => observation.state === 'delivered' && observation.scienceValid).length;
  if (deliveredRecords !== records.length) fail('delivery', 'DELIVERY_SHORTFALL', `${deliveredRecords} de ${records.length} registros completos e válidos chegaram ao solo.`, 'deliveredValidRecords === requiredRecords', { value: deliveredRecords, limit: records.length });
  const staticInvalid = violations.has('mass') || violations.has('budget');
  const outcome: MissionResult['outcome'] = staticInvalid ? 'invalid' : violations.size > 0 ? 'failure' : 'success';
  emit('MISSION_END', outcome === 'success' ? 'info' : 'error', 'all-constraints-and-science', terminated ? 'Missão encerrada por falha terminal de alimentação.' : outcome === 'success' ? 'Horizonte concluído com todos os requisitos satisfeitos.' : 'Horizonte concluído com violações registradas.');
  const residual = sub(sub(sub(sub(add(initialEnergy, solarWh), loadWh), conversionLossWh), spillWh), energy);
  if (cmp(residual, ZERO) !== 0) throw new Error('Ledger exato de energia não conserva.');
  if (generatedBits !== downlinkedBits + lostBits + queueBits) throw new Error('Ledger inteiro de bits não conserva.');
  return {
    engineVersion: ENGINE_VERSION, catalogVersion: CATALOG_VERSION, resultSchemaVersion: RESULT_SCHEMA_VERSION,
    config, scenarioId: scenario.id, outcome, completedAtS: toNumber(time), ...totals,
    initialEnergyWh: toNumber(initialEnergy), finalEnergyWh: toNumber(energy), minEnergyWh: toNumber(minimumEnergy), reserveWh: toNumber(reserve),
    generatedBits: String(generatedBits), downlinkedBits: String(downlinkedBits), lostBits: String(lostBits), queueBits: String(queueBits),
    deliveredRecords, requiredRecords: records.length,
    energyBalance: { solarWh: toNumber(solarWh), loadWh: toNumber(loadWh), conversionLossWh: toNumber(conversionLossWh), spillWh: toNumber(spillWh), residualWh: toNumber(residual) },
    violations: [...violations], events, trace, observations,
  };
}
