import { assertMissionConfig, CATALOG, PHYSICS } from '../core/catalog.ts';
import type { ComponentChoice, ConfigKey, MissionConfig, Scenario } from '../core/contracts.ts';
import { SCIENCE_RECORDS } from '../data/science-data.ts';

export type PreflightStatus = 'within-limit' | 'limit-exceeded' | 'execution-required';
export type Illumination = 'sunlit' | 'shadow';

export interface PeakReference {
  requiredBatteryW: number;
  loadW: number;
  solarW: number;
  illumination: Illumination;
  timeS: number;
}

export interface PreflightReviewData {
  scheduleClear: boolean;
  requiredRecords: number;
  transmission: {
    status: PreflightStatus;
    requiredBits: number;
    ceilingBits: number | null;
    allowedContactSeconds: number | null;
    allowedContactCount: number | null;
    rateBps: number;
  };
  memory: {
    status: PreflightStatus;
    capacityBits: number;
    requiredBeforeFirstContactBits: number | null;
    completedBeforeFirstContact: number | null;
    firstAllowedContactS: number | null;
    allJobsBeforeFirstContact: boolean;
  };
  peak: {
    status: PreflightStatus;
    knownRequiredW: number | null;
    maxDischargeW: number;
    processing: PeakReference | null;
    radio: PeakReference | null;
    scopeComplete: boolean;
  };
  energy: {
    status: 'execution-required';
    initialEnergyWh: number;
    reserveWh: number;
  };
}

type Interval = readonly [number, number];

function value(choice: ComponentChoice, key: keyof ComponentChoice): number {
  const result = choice[key];
  if (typeof result !== 'number' || !Number.isFinite(result) || result < 0) {
    throw new TypeError(`Parâmetro de catálogo inválido: ${choice.id}.${key}`);
  }
  return result;
}

function intervalsClear(intervals: readonly Interval[], horizonS: number): boolean {
  if (!Array.isArray(intervals)) return false;
  let previousEnd = -1;
  for (const interval of intervals) {
    if (!Array.isArray(interval) || interval.length !== 2) return false;
    const [start, end] = interval;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end <= start || end > horizonS || start < previousEnd) return false;
    previousEnd = end;
  }
  return true;
}

/** Deliberately bounded to the campaign's six jobs and its non-overlapping modes. */
function scheduleClear(scenario: Scenario, requiredRecords: number): boolean {
  if (!Number.isSafeInteger(scenario.horizonS) || scenario.horizonS <= 0
    || !Number.isSafeInteger(scenario.jobDurationS) || scenario.jobDurationS <= 0
    || !Array.isArray(scenario.jobStartsS) || scenario.jobStartsS.length !== requiredRecords
    || !intervalsClear(scenario.contacts, scenario.horizonS)
    || !intervalsClear(scenario.sunlight, scenario.horizonS)) return false;
  let previousEnd = -1;
  for (const start of scenario.jobStartsS) {
    const end = start + scenario.jobDurationS;
    if (!Number.isSafeInteger(start) || start < 0 || start < previousEnd || !Number.isSafeInteger(end) || end > scenario.horizonS) return false;
    if (scenario.contacts.some(([a, b]) => start < b && end > a)) return false;
    previousEnd = end;
  }
  return true;
}

function illuminatedSegments([start, end]: Interval, sunlight: readonly Interval[]) {
  const boundaries = [...new Set([start, end, ...sunlight.flat().filter(time => time > start && time < end)])].sort((a, b) => a - b);
  return boundaries.slice(0, -1).map(timeS => ({
    timeS,
    illumination: sunlight.some(([a, b]) => timeS >= a && timeS < b) ? 'sunlit' as const : 'shadow' as const,
  }));
}

function peakReference(loadW: number, panelW: number, factorPercent: number, illumination: Illumination, timeS: number): PeakReference {
  const solarW = illumination === 'sunlit' ? panelW * factorPercent / 100 : 0;
  return {
    loadW, solarW, illumination, timeS,
    requiredBatteryW: Math.max(0, loadW - solarW) / (PHYSICS.dischargeEfficiencyPercent / 100),
  };
}

/**
 * Necessary, explicitly scoped arithmetic from the catalog and planned agenda.
 * This module never runs the mission engine or the catalog solver, integrates
 * energy, predicts packet delivery, or assigns a mission outcome.
 */
export function reviewPreflight(config: MissionConfig, scenario: Scenario): PreflightReviewData {
  assertMissionConfig(config);
  const choice = (key: ConfigKey) => CATALOG[key].find(item => item.id === config[key])!;
  const bitsPerRecord = value(choice('processing'), 'bitsPerRecord');
  const rateBps = value(choice('radio'), 'rateBps');
  const capacityBits = value(choice('buffer'), 'capacityBits');
  const batteryWh = value(choice('battery'), 'capacityWh');
  const maxDischargeW = value(choice('battery'), 'maxDischargeW');
  const panelW = value(choice('panel'), 'watts');
  const requiredRecords = SCIENCE_RECORDS.length;
  const requiredBits = requiredRecords * bitsPerRecord;
  const clear = scheduleClear(scenario, requiredRecords);
  const result: PreflightReviewData = {
    scheduleClear: clear,
    requiredRecords,
    transmission: { status: 'execution-required', requiredBits, ceilingBits: null, allowedContactSeconds: null, allowedContactCount: null, rateBps },
    memory: { status: 'execution-required', capacityBits, requiredBeforeFirstContactBits: null, completedBeforeFirstContact: null, firstAllowedContactS: null, allJobsBeforeFirstContact: false },
    peak: { status: 'execution-required', knownRequiredW: null, maxDischargeW, processing: null, radio: null, scopeComplete: false },
    energy: { status: 'execution-required', initialEnergyWh: batteryWh * PHYSICS.initialChargePercent / 100, reserveWh: batteryWh * PHYSICS.reservePercent / 100 },
  };
  if (!clear) return result;

  const allowedContacts = config.policy === 'every-contact' ? scenario.contacts : scenario.contacts.slice(-1);
  const allowedContactSeconds = allowedContacts.reduce((sum, [start, end]) => sum + end - start, 0);
  const ceilingBits = allowedContactSeconds * rateBps;
  if (Number.isSafeInteger(ceilingBits) && Number.isSafeInteger(requiredBits)) {
    result.transmission = {
      status: requiredBits <= ceilingBits ? 'within-limit' : 'limit-exceeded',
      requiredBits, ceilingBits, allowedContactSeconds, allowedContactCount: allowedContacts.length, rateBps,
    };
  }

  const jobEnds = scenario.jobStartsS.map(start => start + scenario.jobDurationS);
  const firstContact = allowedContacts[0];
  if (firstContact) {
    // No allowed downlink precedes this boundary. Do not count later jobs:
    // a future interleaved agenda need not store the entire mission at once.
    const completedBeforeFirstContact = jobEnds.filter(end => end <= firstContact[0]).length;
    const requiredBeforeFirstContactBits = completedBeforeFirstContact * bitsPerRecord;
    result.memory = {
      status: requiredBeforeFirstContactBits <= capacityBits ? 'within-limit' : 'limit-exceeded',
      capacityBits, requiredBeforeFirstContactBits, completedBeforeFirstContact,
      firstAllowedContactS: firstContact[0],
      allJobsBeforeFirstContact: completedBeforeFirstContact === scenario.jobStartsS.length,
    };
  }

  const processingReferences = scenario.jobStartsS.flatMap(start => illuminatedSegments([start, start + scenario.jobDurationS], scenario.sunlight)
    .map(segment => peakReference(value(choice('processing'), 'totalLoadW'), panelW, PHYSICS.workPanelFactorPercent, segment.illumination, segment.timeS)));
  const processing = processingReferences.reduce<PeakReference | null>((maximum, reference) => !maximum || reference.requiredBatteryW > maximum.requiredBatteryW ? reference : maximum, null);

  // A contact before every job cannot transmit a scientific packet. Among
  // potentially useful contacts, mixed illumination may occur only after the
  // queue is empty. Do not label that hypothetical demand as a violated limit.
  const usableContacts = allowedContacts.filter(([start]) => jobEnds.some(end => end <= start));
  const radioSegments = usableContacts.flatMap(interval => illuminatedSegments(interval, scenario.sunlight));
  const firstRadioSegment = radioSegments[0];
  const uniformRadioIllumination = firstRadioSegment && radioSegments.every(segment => segment.illumination === firstRadioSegment.illumination);
  const radio = uniformRadioIllumination
    ? peakReference(value(choice('radio'), 'totalLoadW'), panelW, PHYSICS.idlePanelFactorPercent, firstRadioSegment.illumination, firstRadioSegment.timeS)
    : null;
  const references = [processing, radio].filter((reference): reference is PeakReference => reference !== null);
  const knownRequiredW = references.length ? Math.max(...references.map(reference => reference.requiredBatteryW)) : null;
  const scopeComplete = processing !== null && radio !== null;
  const status: PreflightStatus = knownRequiredW !== null && knownRequiredW > maxDischargeW
    ? 'limit-exceeded'
    : scopeComplete ? 'within-limit' : 'execution-required';
  result.peak = { status, knownRequiredW, maxDischargeW, processing, radio, scopeComplete };
  return result;
}
