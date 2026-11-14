import type { MissionResult, ObservationResult, ScienceRecord } from '../core/contracts.ts';
import { SCIENCE_RECORDS } from '../data/science-data.ts';

export type ScienceReturnStatus = 'ready' | 'missing' | 'unavailable' | Exclude<ObservationResult['state'], 'delivered'>;
export interface ReturnedScienceSample {
  readonly recordId: string;
  readonly observationDate: string;
  readonly compositeStart: string;
  readonly ndvi: number | null;
  readonly status: ScienceReturnStatus;
}
export interface ScienceReturnPair {
  readonly point: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly samples: readonly [ReturnedScienceSample, ReturnedScienceSample];
  /** Signed difference, later minus earlier. It is not a percentage. */
  readonly difference: number | null;
}
export interface ScienceReturnSummary {
  readonly pairs: readonly ScienceReturnPair[];
  readonly availableComparisons: number;
  readonly totalComparisons: number;
  readonly availableValues: number;
}

// The source pack defines point identity and chronological order. Results can
// arrive in a different order, so array positions never match result to source.
const pointRecords = new Map<string, ScienceRecord[]>();
for (const record of SCIENCE_RECORDS) {
  const key = `${record.latitudeRequested}|${record.longitudeRequested}`;
  const group = pointRecords.get(key) ?? [];
  group.push(record);
  pointRecords.set(key, group);
}
const POINTS = Array.from(pointRecords.values(), (records, index) => {
  const ordered = [...records].sort((a, b) => a.observationDate.localeCompare(b.observationDate) || a.compositeStart.localeCompare(b.compositeStart) || a.id.localeCompare(b.id));
  const first = ordered[0], second = ordered[1];
  if (ordered.length !== 2 || !first || !second) throw new Error('The science-return view requires two source records per point.');
  return { point: String.fromCharCode(65 + index), first, second };
});

function returnedSample(record: ScienceRecord, matches: readonly ObservationResult[]): ReturnedScienceSample {
  const metadata = { recordId: record.id, observationDate: record.observationDate, compositeStart: record.compositeStart };
  if (matches.length === 0) return { ...metadata, ndvi: null, status: 'missing' };
  // Conflicting duplicate identifiers cannot establish a unique delivered value.
  if (matches.length !== 1) return { ...metadata, ndvi: null, status: 'unavailable' };
  const observation = matches[0]!;
  if (observation.state !== 'delivered') return { ...metadata, ndvi: null, status: observation.state };
  if (!observation.scienceValid) return { ...metadata, ndvi: null, status: 'invalid' };
  if (observation.ndvi === null || !Number.isFinite(observation.ndvi)) return { ...metadata, ndvi: null, status: 'unavailable' };
  // Never substitute expectedNdvi, source ndviProduct, or a recalculation from
  // source bands. This value belongs to the actual BANDAS/ÍNDICE execution.
  return { ...metadata, ndvi: observation.ndvi, status: 'ready' };
}

/** Read-only presentation of delivered science; it does not judge mission success. */
export function buildScienceReturn(result: Pick<MissionResult, 'observations'>): ScienceReturnSummary {
  const byId = new Map<string, ObservationResult[]>();
  for (const observation of result.observations) {
    const group = byId.get(observation.id) ?? [];
    group.push(observation);
    byId.set(observation.id, group);
  }
  const pairs: ScienceReturnPair[] = POINTS.map(({ point, first, second }) => {
    const earlier = returnedSample(first, byId.get(first.id) ?? []);
    const later = returnedSample(second, byId.get(second.id) ?? []);
    return {
      point, latitude: first.latitudeRequested, longitude: first.longitudeRequested,
      samples: [earlier, later],
      difference: earlier.ndvi !== null && later.ndvi !== null ? later.ndvi - earlier.ndvi : null,
    };
  });
  return {
    pairs,
    availableComparisons: pairs.filter(pair => pair.difference !== null).length,
    totalComparisons: pairs.length,
    availableValues: pairs.reduce((count, pair) => count + pair.samples.filter(sample => sample.ndvi !== null).length, 0),
  };
}
