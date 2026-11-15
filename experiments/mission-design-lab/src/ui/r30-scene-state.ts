import { getScenario } from '../core/catalog.ts';
import type { MissionConfig, ScenarioId } from '../core/contracts.ts';
import { BRUNO_CHOICES } from '../lab/bruno-missions.ts';
import type { BrunoResult, BrunoSimulationConfig, BrunoTimelineEntry } from '../lab/bruno-missions.ts';
import { getExpeditionSchedule } from '../lab/scientific-expeditions.ts';
import type { ExpeditionConfig, ExpeditionId } from '../lab/scientific-expeditions.ts';

/** Read the revealed engine entry; no clock, interpolation or future result leaks. */
export function getBrunoSceneState(config: BrunoSimulationConfig, event?: BrunoTimelineEntry, result?: BrunoResult) {
  const phase = event?.phase ?? 'assembly';
  const recorded = event && result?.timeline.some(entry => entry.phase === event.phase && entry.timeS === event.timeS && entry.state === event.state);
  const blocked = event?.state === 'blocked';
  const collected = recorded && (phase === 'acquisition' || phase === 'downlink');
  const received = recorded && phase === 'downlink';
  const initialWh = BRUNO_CHOICES.energy.find(choice => choice.id === config.energy)!.capacityWh;
  const energyWh = !event ? null : recorded && phase === 'launch' ? result!.initialEnergyWh : collected ? result!.finalEnergyWh : null;
  return {
    phase, blocked, atDestination: Boolean(recorded && phase !== 'launch'), arrived: Boolean(recorded && phase !== 'launch' && !blocked),
    plume: Boolean(recorded && phase === 'launch' && !blocked),
    acquiring: Boolean(collected && phase === 'acquisition' && result!.generatedRecords > 0),
    transmitting: Boolean(received && result!.receivedRecords > 0),
    capacityWh: initialWh, energyWh, energyFraction: energyWh === null ? null : Math.max(0, Math.min(1, energyWh / initialWh)),
    generatedRecords: collected ? result!.generatedRecords : null,
    receivedRecords: received ? result!.receivedRecords : null,
    deliveredRecords: received ? result!.deliveredRecords : null,
    message: event?.message ?? 'Montagem em edição. As capacidades são escolhas; ainda não há estado de voo registrado.',
  };
}
export type BrunoSceneState = ReturnType<typeof getBrunoSceneState>;

export interface SceneSchedule {
  horizonS: number;
  lifetimeS: number;
  sunlight: readonly (readonly [number, number])[];
  jobs: readonly (readonly [number, number])[];
  contacts: readonly { start: number; end: number; permitted: boolean }[];
  launcher: 'fixed' | 'compact' | 'science';
  profile: string;
}

/** Planned windows come from the engine catalogs; a plan never claims delivery. */
export function getSceneSchedule(input: { world: 'earth'; config: MissionConfig; scenarioId?: ScenarioId } | { world: ExpeditionId; config: ExpeditionConfig }): SceneSchedule {
  if (input.world === 'earth') {
    const scenario = getScenario(input.scenarioId ?? 'long-contact');
    return {
      horizonS: scenario.horizonS, lifetimeS: scenario.horizonS, sunlight: scenario.sunlight,
      jobs: scenario.jobStartsS.map(start => [start, start + scenario.jobDurationS]),
      contacts: scenario.contacts.map(([start, end], index) => ({ start, end, permitted: input.config.policy === 'every-contact' || index === scenario.contacts.length - 1 })),
      launcher: 'fixed', profile: 'Lançador e órbita fixos neste recorte do Cerrado',
    };
  }
  const schedule = getExpeditionSchedule(input.world, input.config);
  return {
    horizonS: 10800, lifetimeS: input.config.duration === 'short' ? 7200 : 10800,
    sunlight: schedule.sunlight, jobs: schedule.jobStartsS.map(start => [start, start + schedule.jobDurationS]),
    contacts: schedule.contacts.map(([start, end]) => ({ start, end, permitted: start < (input.config.duration === 'short' ? 7200 : 10800) })),
    launcher: input.config.launch,
    profile: input.world === 'bennu' ? input.config.orbit === 'near' ? 'Sobrevoo próximo' : 'Órbita de levantamento' : input.config.orbit === 'near' ? 'Órbita terrestre conceitual (LEO)' : 'L2 conceitual',
  };
}
