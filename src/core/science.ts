import type { ScienceRecord } from './contracts.ts';

/**
 * Closed MOD13Q1.061 policy. Bit meanings: MOD13 C6.1 User Guide, tables 1/4/5.
 * Selection thresholds below are the game's declared policy, not NASA certification.
 * https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf
 */
export const SCIENCE_POLICY = Object.freeze({
  product: 'MOD13Q1.061', scale: 0.0001, offset: 0, ndviTolerance: 0.0001,
  reflectanceMin: 0, reflectanceMax: 10_000,
  modland: 0, usefulness: Object.freeze([0, 1, 2]), pixelReliability: 0,
  aerosol: Object.freeze([0, 1, 2]), landWater: 1,
  rejectedFlags: Object.freeze([8, 10, 14, 15]),
});

function validDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export function validateScienceRecord(record: ScienceRecord): { valid: boolean; reasons: string[]; ndvi: number | null } {
  const reasons: string[] = [];
  if (record === null || typeof record !== 'object') return { valid: false, reasons: ['record-shape'], ndvi: null };
  for (const name of ['id', 'sourceId'] as const) {
    if (typeof record[name] !== 'string' || record[name].length === 0) reasons.push(`metadata:${name}`);
  }
  for (const [name, min, max] of [['latitudeRequested', -90, 90], ['longitudeRequested', -180, 180]] as const) {
    if (!Number.isFinite(record[name]) || record[name] < min || record[name] > max) reasons.push(`metadata:${name}`);
  }
  const datesValid = validDate(record.compositeStart) && validDate(record.observationDate);
  if (!datesValid) reasons.push('metadata:dates');
  else {
    const composite = Date.parse(`${record.compositeStart}T00:00:00.000Z`);
    const observation = Date.parse(`${record.observationDate}T00:00:00.000Z`);
    if (observation < composite || observation >= composite + 16 * 86_400_000) reasons.push('metadata:observation-outside-composite');
    const year = record.compositeStart.slice(0, 4);
    const day = 1 + (composite - Date.parse(`${year}-01-01T00:00:00.000Z`)) / 86_400_000;
    if (record.modisDate !== `A${year}${String(day).padStart(3, '0')}`) reasons.push('metadata:modis-date');
  }
  if (record.scale !== SCIENCE_POLICY.scale || record.offset !== SCIENCE_POLICY.offset) reasons.push('reflectance:scale-offset');
  let bandsValid = true;
  for (const name of ['redInteger', 'nirInteger'] as const) {
    if (!Number.isSafeInteger(record[name]) || record[name] < 0 || record[name] > 10_000) {
      reasons.push(`reflectance:${name}`);
      bandsValid = false;
    }
  }
  if (!Number.isSafeInteger(record.viQuality) || record.viQuality < 0 || record.viQuality >= 65_535) reasons.push('qa:range-or-fill');
  else {
    const qa = record.viQuality;
    if ((qa & 0b11) !== SCIENCE_POLICY.modland) reasons.push('qa:modland');
    if (!SCIENCE_POLICY.usefulness.includes((qa >>> 2) & 0b1111)) reasons.push('qa:usefulness');
    if (!SCIENCE_POLICY.aerosol.includes((qa >>> 6) & 0b11)) reasons.push('qa:aerosol');
    if (((qa >>> 11) & 0b111) !== SCIENCE_POLICY.landWater) reasons.push('qa:land-water');
    for (const [bit, reason] of [[8, 'adjacent-cloud'], [10, 'mixed-cloud'], [14, 'snow-ice'], [15, 'shadow']] as const) {
      if ((qa & (1 << bit)) !== 0) reasons.push(`qa:${reason}`);
    }
  }
  if (record.pixelReliability !== SCIENCE_POLICY.pixelReliability) reasons.push('qa:pixel-reliability');

  const sum = record.nirInteger + record.redInteger;
  if (bandsValid && sum === 0) reasons.push('ndvi:zero-denominator');
  const computed = bandsValid && sum > 0 ? (record.nirInteger - record.redInteger) / sum : null;
  const product = record.ndviProduct;
  if (!Number.isFinite(product) || product < -0.2 || product > 1) reasons.push('ndvi:product-range-or-fill');
  else {
    // Accept the two exact IEEE representations produced by the documented scale
    // operation. This is a quantization rule, never an arbitrary success epsilon.
    const storedInteger = Math.round(product * 10_000);
    if (product !== storedInteger / 10_000 && product !== storedInteger * SCIENCE_POLICY.scale) reasons.push('ndvi:product-quantization');
    if (computed !== null) {
      // The guide specifies the product scale, not a truncation algorithm for
      // reconstructing it from the quantized bands. Check the declared scientific
      // tolerance inclusively, with safe integer arithmetic and no float epsilon:
      // abs((NIR-RED)/(NIR+RED) - storedInteger/10000) <= 1/10000.
      const discrepancyNumerator = Math.abs((record.nirInteger - record.redInteger) * 10_000 - storedInteger * sum);
      if (discrepancyNumerator > sum) reasons.push('ndvi:product-disagreement');
    }
  }
  const valid = reasons.length === 0;
  return { valid, reasons, ndvi: valid ? computed : null };
}
