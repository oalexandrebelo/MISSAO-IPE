import { CATALOG, getScenario } from '../core/catalog.ts';
import type { MissionEvent, MissionResult, TracePoint } from '../core/contracts.ts';

export type MissionVisualSubsystem = 'panel' | 'battery' | 'processing' | 'buffer' | 'radio';

export interface MissionVisualState {
  /** Requested time, clamped to the scenario horizon; never a trace index. */
  readonly timeS: number;
  readonly progress: number;
  /** The readings below belong to this recorded time, without interpolation. */
  readonly sourceStateTimeS: number | null;
  readonly available: boolean;
  readonly energyWh: number | null;
  readonly energyFraction: number | null;
  readonly queueBits: number | null;
  readonly queueFraction: number | null;
  readonly downlinkedBits: number | null;
  readonly solarW: number | null;
  readonly loadW: number | null;
  /** Scheduled conditions, independent of whether the spacecraft still operates. */
  readonly illuminated: boolean;
  readonly contactAvailable: boolean;
  readonly transmitting: boolean;
  readonly mode: string | null;
  /** All original events at timeS, in engine order; not just one per timestamp. */
  readonly eventsAtTime: readonly MissionEvent[];
  /** Complete, scientifically valid deliveries at or before timeS. */
  readonly deliveredRecordIds: readonly string[];
  /** An involved subsystem for inspection, never a claim of unique causation. */
  readonly focusSubsystem: MissionVisualSubsystem | null;
}

const EVENT_SUBSYSTEM: Readonly<Record<string, MissionVisualSubsystem>> = {
  SUNLIGHT_START: 'panel', SUNLIGHT_END: 'panel',
  BATTERY_FULL: 'battery', RESERVE_BREACH: 'battery', ENERGY_DEPLETED: 'battery', PEAK_POWER: 'battery',
  JOB_START: 'processing', JOB_COMPLETE: 'processing', SCIENCE_REJECTED: 'processing',
  BUFFER_OVERFLOW: 'buffer',
  CONTACT_START: 'radio', CONTACT_END: 'radio', CONTACT_SKIPPED: 'radio',
  RECORD_DELIVERED: 'radio', QUEUE_EMPTY: 'radio',
};

/**
 * Pure projection of a validated closed-campaign result. It does not simulate,
 * change the verdict, or infer orbital geometry. Between trace points, readings
 * retain the last recorded values; sourceStateTimeS makes that hold explicit.
 * Selected evidence can highlight an earlier event but cannot move the clock or
 * expose a future event. Missing trace readings remain null, never final totals.
 */
export function getMissionVisualState(result: MissionResult, requestedTimeS: number, selectedEventId?: string): MissionVisualState {
  if (!Number.isFinite(requestedTimeS)) throw new RangeError('O instante visual deve ser finito.');
  const scenario = getScenario(result.scenarioId);
  const timeS = Math.max(0, Math.min(scenario.horizonS, requestedTimeS));
  let point: TracePoint | null = null;
  for (const candidate of result.trace) {
    if (candidate.timeS <= timeS && (point === null || candidate.timeS >= point.timeS)) point = candidate;
  }
  const active = ([start, end]: readonly [number, number]) => timeS >= start && timeS < end;
  const contactAvailable = scenario.contacts.some(active);
  const eventsAtTime = result.events.filter(event => event.timeS === timeS);
  const selectedEvent = selectedEventId === undefined
    ? eventsAtTime.find(event => event.severity === 'error' && EVENT_SUBSYSTEM[event.code])
      ?? eventsAtTime.find(event => EVENT_SUBSYSTEM[event.code])
    : result.events.find(event => event.id === selectedEventId && event.timeS <= timeS);
  const focusSubsystem = selectedEvent
    ? EVENT_SUBSYSTEM[selectedEvent.code] ?? null
    : point?.mode === 'processing' ? 'processing' : point?.mode === 'transmitting' ? 'radio' : null;
  const batteryWh = CATALOG.battery.find(choice => choice.id === result.config.battery)!.capacityWh!;
  const bufferBits = CATALOG.buffer.find(choice => choice.id === result.config.buffer)!.capacityBits!;
  const deliveredRecordIds = result.observations
    .filter(record => record.state === 'delivered' && record.scienceValid
      && record.deliveredAtS !== null && record.deliveredAtS <= timeS)
    .map(record => record.id);

  return Object.freeze({
    timeS, progress: timeS / scenario.horizonS,
    sourceStateTimeS: point?.timeS ?? null, available: point !== null,
    energyWh: point?.energyWh ?? null, energyFraction: point ? point.energyWh / batteryWh : null,
    queueBits: point?.queueBits ?? null, queueFraction: point ? point.queueBits / bufferBits : null,
    downlinkedBits: point?.downlinkedBits ?? null,
    solarW: point?.solarW ?? null, loadW: point?.loadW ?? null,
    illuminated: scenario.sunlight.some(active), contactAvailable,
    transmitting: point?.mode === 'transmitting' && contactAvailable,
    mode: point?.mode ?? null,
    eventsAtTime: Object.freeze(eventsAtTime),
    deliveredRecordIds: Object.freeze(deliveredRecordIds),
    focusSubsystem,
  });
}
