import { CATALOG, getScenario, PHYSICS } from '../core/catalog.ts';
import type { MissionEvent, MissionResult } from '../core/contracts.ts';

export type RequirementState = 'met' | 'unmet' | 'incomplete';
export type RequirementGroup = 'design' | 'operation' | 'science';
export type RequirementId = 'mass' | 'budget' | 'energy' | 'peak-power' | 'memory' | 'science-quality' | 'delivery';
export type RequirementUnit = 'kg' | 'créditos' | 'Wh' | 'W' | 'Mbit' | 'registros';

export interface RequirementRow {
  readonly id: RequirementId;
  readonly code: string;
  readonly group: RequirementGroup;
  readonly title: string;
  readonly rule: string;
  readonly state: RequirementState;
  /** Numbers remain unrounded. Formatting never participates in classification. */
  readonly measured: number | null;
  readonly measurementLabel: string;
  readonly limit: number;
  readonly limitLabel: string;
  readonly margin: number | null;
  readonly marginKind: 'headroom' | 'target' | 'loss';
  readonly unit: RequirementUnit;
  readonly note: string;
  /** Always the original event object, or null. This layer creates no events. */
  readonly evidence: MissionEvent | null;
  readonly evidenceLabel: string;
  readonly evidenceFallback: string;
}

export interface RequirementGroupSummary {
  readonly id: RequirementGroup;
  readonly state: RequirementState;
  readonly met: number;
  readonly unmet: number;
  readonly incomplete: number;
  readonly total: number;
}

export interface RequirementsReviewModel {
  readonly outcome: MissionResult['outcome'];
  readonly horizonS: number;
  readonly completedAtS: number;
  readonly horizonCompleted: boolean;
  readonly rows: readonly RequirementRow[];
  readonly groups: readonly RequirementGroupSummary[];
}

const decimal = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3 });
const fmt = (value: number) => decimal.format(value);

function summarize(id: RequirementGroup, rows: readonly RequirementRow[]): RequirementGroupSummary {
  const selected = rows.filter(row => row.group === id);
  const unmet = selected.filter(row => row.state === 'unmet').length;
  const incomplete = selected.filter(row => row.state === 'incomplete').length;
  return Object.freeze({
    id, state: unmet ? 'unmet' : incomplete ? 'incomplete' : 'met',
    met: selected.filter(row => row.state === 'met').length,
    unmet, incomplete, total: selected.length,
  });
}

/**
 * Read-only interpretation of the existing closed campaign result.
 * No simulation, catalog enumeration, configuration changes, or new outcome.
 * Operational pass states require the entire scenario horizon; known failures
 * remain failures when operation terminates early. Completed scientific records
 * can establish their monotonic delivery/quality targets before the horizon.
 */
export function reviewRequirements(result: MissionResult): RequirementsReviewModel {
  const scenario = getScenario(result.scenarioId);
  const horizonCompleted = result.completedAtS >= scenario.horizonS;
  const failure = (...names: string[]) => names.some(name => result.violations.includes(name));
  const event = (...codes: string[]): MissionEvent | null => result.events.find(item => codes.includes(item.code)) ?? null;
  const lastEvent = (...codes: string[]): MissionEvent | null => {
    for (let index = result.events.length - 1; index >= 0; index--) {
      const candidate = result.events[index]!;
      if (codes.includes(candidate.code)) return candidate;
    }
    return null;
  };
  const end = lastEvent('MISSION_END');
  const terminal = event('PEAK_POWER', 'ENERGY_DEPLETED') ?? end;
  const operationEvidence = horizonCompleted ? end : terminal;
  const operationState = (failed: boolean): RequirementState => failed ? 'unmet' : horizonCompleted ? 'met' : 'incomplete';
  const endedEarly = `Verificação interrompida em ${fmt(result.completedAtS / 60)} de ${fmt(scenario.horizonS / 60)} min. A ausência de violação até aqui não comprova o horizonte inteiro.`;
  const battery = CATALOG.battery.find(choice => choice.id === result.config.battery);
  const buffer = CATALOG.buffer.find(choice => choice.id === result.config.buffer);
  if (battery?.maxDischargeW === undefined || buffer?.capacityBits === undefined) {
    throw new RangeError('A configuração executada não tem limites de bateria e memória neste catálogo.');
  }
  const dischargeEfficiency = PHYSICS.dischargeEfficiencyPercent / 100;
  const peakEvent = event('PEAK_POWER');
  // A terminal trace point has zero powers; include the rejected demand carried
  // by PEAK_POWER. Trace-derived numbers describe recorded states, not a sensor.
  const demands = result.trace
    .filter(point => point.mode !== 'terminated' && point.mode !== 'complete')
    .map(point => Math.max(0, (point.loadW - point.solarW) / dischargeEfficiency));
  if (peakEvent?.value !== undefined) demands.push(peakEvent.value);
  const peakW = demands.length ? Math.max(...demands) : null;
  const maxQueueBits = result.trace.length ? Math.max(...result.trace.map(point => point.queueBits)) : null;
  const lostBits = BigInt(result.lostBits);
  const produced = result.observations.filter(observation => observation.producedAtS !== null);
  const validProduced = produced.filter(observation => observation.scienceValid).length;
  const rejectedProduced = produced.filter(observation => !observation.scienceValid).length;
  const validDeliveries = result.observations.filter(observation => observation.state === 'delivered'
    && observation.scienceValid && observation.deliveredAtS !== null
    && observation.deliveredAtS <= scenario.horizonS).length;
  const allQualityKnown = produced.length === result.requiredRecords && validProduced === result.requiredRecords;
  const allDelivered = result.deliveredRecords === result.requiredRecords && validDeliveries === result.requiredRecords;
  const qualityEvent = event('SCIENCE_REJECTED');
  const deliveryEvent = event('DELIVERY_SHORTFALL');
  const energyEvent = event('RESERVE_BREACH', 'ENERGY_DEPLETED');
  const memoryEvent = event('BUFFER_OVERFLOW');
  const massEvent = event('MASS_LIMIT');
  const budgetEvent = event('BUDGET_LIMIT');
  const massFailed = failure('mass') || massEvent !== null || result.massKg > scenario.maxMassKg;
  const budgetFailed = failure('budget') || budgetEvent !== null || result.credits > scenario.budget;
  const energyFailed = failure('reserve', 'energy-depleted') || energyEvent !== null || result.minEnergyWh < result.reserveWh;
  // The exact engine verdict is authoritative; do not rejudge a serialized
  // rational boundary using floating-point arithmetic on trace differences.
  const peakFailed = failure('peak-power') || peakEvent !== null;
  const memoryFailed = failure('buffer-overflow') || memoryEvent !== null || lostBits > 0n;
  const qualityFailed = failure('science') || qualityEvent !== null || rejectedProduced > 0;
  const deliveryFailed = failure('delivery') || deliveryEvent !== null || (horizonCompleted && !allDelivered);
  const rows: RequirementRow[] = [
    {
      id: 'mass', code: 'R01', group: 'design', title: 'Massa do projeto',
      rule: 'A configuração executada cabe no limite de massa do cenário.',
      state: massFailed ? 'unmet' : 'met', measured: result.massKg, measurementLabel: 'Massa executada',
      limit: scenario.maxMassKg, limitLabel: 'Máximo', margin: scenario.maxMassKg - result.massKg,
      marginKind: 'headroom', unit: 'kg', note: 'Verificação estática: independe da duração da operação.',
      evidence: massEvent, evidenceLabel: 'Limite de massa', evidenceFallback: 'Configuração executada',
    },
    {
      id: 'budget', code: 'R02', group: 'design', title: 'Orçamento do projeto',
      rule: 'O custo da configuração executada respeita o orçamento do cenário.',
      state: budgetFailed ? 'unmet' : 'met', measured: result.credits, measurementLabel: 'Custo executado',
      limit: scenario.budget, limitLabel: 'Máximo', margin: scenario.budget - result.credits,
      marginKind: 'headroom', unit: 'créditos', note: 'Créditos são uma unidade didática do catálogo.',
      evidence: budgetEvent, evidenceLabel: 'Limite de orçamento', evidenceFallback: 'Configuração executada',
    },
    {
      id: 'energy', code: 'R03', group: 'operation', title: 'Energia e reserva',
      rule: `Manter a bateria em ou acima da reserva durante os ${fmt(scenario.horizonS / 60)} min, sem esgotamento.`,
      state: operationState(energyFailed), measured: result.minEnergyWh, measurementLabel: 'Mínimo registrado',
      limit: result.reserveWh, limitLabel: 'Reserva mínima', margin: result.minEnergyWh - result.reserveWh,
      marginKind: 'headroom', unit: 'Wh',
      note: energyFailed ? 'A violação permanece registrada mesmo que a bateria se recupere depois.'
        : horizonCompleted ? 'Mínimo do resultado; a reserva é a regra didática vigente da campanha.' : endedEarly,
      evidence: energyEvent ?? operationEvidence, evidenceLabel: energyEvent ? 'Evento de energia' : 'Encerramento registrado',
      evidenceFallback: 'Resumo numérico da execução',
    },
    {
      id: 'peak-power', code: 'R04', group: 'operation', title: 'Potência de descarga',
      rule: `Respeitar o pico permitido na bateria durante os ${fmt(scenario.horizonS / 60)} min.`,
      state: operationState(peakFailed), measured: peakW,
      measurementLabel: peakEvent ? 'Maior demanda conhecida' : 'Pico derivado dos estados',
      limit: battery.maxDischargeW, limitLabel: 'Descarga máxima', margin: peakW === null ? null : battery.maxDischargeW - peakW,
      marginKind: 'headroom', unit: 'W',
      note: peakFailed ? 'A demanda do evento terminal inclui a potência recusada antes de executar o intervalo.'
        : !horizonCompleted ? endedEarly
        : peakW === null ? 'O motor concluiu o horizonte sem violação de pico; este resultado não expõe estados para mostrar o valor.'
        : 'Derivado de máx(0, consumo − geração) / 0,95. O estado do requisito vem do motor exato.',
      evidence: peakEvent ?? operationEvidence, evidenceLabel: peakEvent ? 'Pico excedido' : 'Encerramento registrado',
      evidenceFallback: 'Diário e resumo da execução',
    },
    {
      id: 'memory', code: 'R05', group: 'operation', title: 'Memória sem perda',
      rule: `Guardar os lotes sem descarte por falta de espaço durante os ${fmt(scenario.horizonS / 60)} min.`,
      state: operationState(memoryFailed), measured: Number(lostBits) / 1_000_000, measurementLabel: 'Dados perdidos',
      limit: 0, limitLabel: 'Perda permitida', margin: -Number(lostBits) / 1_000_000,
      marginKind: 'loss', unit: 'Mbit',
      note: `Capacidade: ${fmt(buffer.capacityBits / 1_000_000)} Mbit. ${maxQueueBits === null ? 'O resultado não expõe a maior fila.' : `Maior fila nos estados: ${fmt(maxQueueBits / 1_000_000)} Mbit.`}${!horizonCompleted && !memoryFailed ? ` ${endedEarly}` : ''}`,
      evidence: memoryEvent ?? operationEvidence, evidenceLabel: memoryEvent ? 'Lote perdido' : 'Encerramento registrado',
      evidenceFallback: 'Balanço de bits da execução',
    },
    {
      id: 'science-quality', code: 'R06', group: 'science', title: 'Qualidade dos dados de origem',
      rule: `Os ${result.requiredRecords} lotes produzidos usam dados históricos aceitos pelas regras de NDVI e QA.`,
      state: qualityFailed ? 'unmet' : allQualityKnown ? 'met' : 'incomplete',
      measured: validProduced, measurementLabel: 'Lotes produzidos com origem válida',
      limit: result.requiredRecords, limitLabel: 'Meta', margin: validProduced - result.requiredRecords,
      marginKind: 'target', unit: 'registros',
      note: 'Pré-validação do arquivo histórico; não comprova cálculo de NDVI no solo nem recepção completa. ' + (qualityFailed
        ? `${rejectedProduced} lote(s) produzido(s) com origem rejeitada; a violação científica permanece registrada.`
        : allQualityKnown ? 'Os seis lotes foram produzidos a partir de entradas aprovadas.'
        : `${produced.length} de ${result.requiredRecords} lotes foram produzidos; falta concluir os demais.`),
      evidence: qualityEvent ?? (allQualityKnown ? lastEvent('JOB_COMPLETE') : terminal),
      evidenceLabel: qualityEvent ? 'Qualidade rejeitada' : allQualityKnown ? 'Último lote produzido' : 'Encerramento registrado',
      evidenceFallback: 'Estados científicos dos registros',
    },
    {
      id: 'delivery', code: 'R07', group: 'science', title: 'Entrega científica completa',
      rule: `Receber os ${result.requiredRecords} registros inteiros e válidos até ${fmt(scenario.horizonS / 60)} min.`,
      state: deliveryFailed ? 'unmet' : allDelivered ? 'met' : 'incomplete',
      measured: result.deliveredRecords, measurementLabel: 'Recebidos inteiros e válidos',
      limit: result.requiredRecords, limitLabel: 'Meta', margin: result.deliveredRecords - result.requiredRecords,
      marginKind: 'target', unit: 'registros',
      note: deliveryFailed ? 'Lotes parciais, perdidos ou cientificamente inválidos não contam como entrega válida.'
        : allDelivered ? 'A entrega atende a esta meta; massa, orçamento e operação continuam sendo requisitos próprios.'
        : 'A execução terminou antes de produzir evidência suficiente para confirmar a meta de entrega.',
      evidence: deliveryEvent ?? (allDelivered ? lastEvent('RECORD_DELIVERED') : terminal),
      evidenceLabel: deliveryEvent ? 'Entrega incompleta' : allDelivered ? 'Última recepção completa' : 'Encerramento registrado',
      evidenceFallback: 'Contagem e estados dos registros',
    },
  ];
  const frozenRows = Object.freeze(rows.map(row => Object.freeze(row)));
  return Object.freeze({
    outcome: result.outcome, horizonS: scenario.horizonS, completedAtS: result.completedAtS, horizonCompleted,
    rows: frozenRows,
    groups: Object.freeze((['design', 'operation', 'science'] as const).map(id => summarize(id, frozenRows))),
  });
}
