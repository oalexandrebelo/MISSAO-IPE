/**
 * Independent educational models. These functions do not import, configure, or
 * execute the campaign engine. Units are part of each public field name.
 *
 * Primary references are linked in EngineeringLab.tsx. Floating-point results
 * describe idealized continuous physics, not the campaign's exact ledger.
 */
export const LAB_CONSTANTS = Object.freeze({
  earthMeanRadiusKm: 6_371,
  earthMuKm3S2: 398_600.435507,
  solarIrradianceAt1AuWm2: 1_361,
  standardGravityMs2: 9.80665,
  speedOfLightMs: 299_792_458,
  batteryDischargeEfficiency: 0.95,
  transmitGainDbi: 3,
  receiveGainDbi: 20,
});

function finite(name: string, value: number): void {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be a finite number.`);
}

function nonnegative(name: string, value: number): void {
  finite(name, value);
  if (value < 0) throw new RangeError(`${name} must be nonnegative.`);
}

function positive(name: string, value: number): void {
  finite(name, value);
  if (value <= 0) throw new RangeError(`${name} must be positive.`);
}

function representable<T extends Record<string, number>>(result: T): Readonly<T> {
  if (Object.values(result).some(value => !Number.isFinite(value))) {
    throw new RangeError('The result exceeds the supported numeric range.');
  }
  return Object.freeze(result);
}

/** Circular, two-body Earth orbit; maximum eclipse for beta = 0, cylindrical shadow. */
export function circularLeo(altitudeKm: number) {
  finite('altitudeKm', altitudeKm);
  if (altitudeKm < 200 || altitudeKm > 2_000) {
    throw new RangeError('This LEO laboratory supports altitudeKm from 200 to 2000.');
  }
  const radiusKm = LAB_CONSTANTS.earthMeanRadiusKm + altitudeKm;
  const velocityKmS = Math.sqrt(LAB_CONSTANTS.earthMuKm3S2 / radiusKm);
  const periodS = 2 * Math.PI * radiusKm / velocityKmS;
  const eclipseHalfAngleRad = Math.asin(LAB_CONSTANTS.earthMeanRadiusKm / radiusKm);
  const eclipseFraction = eclipseHalfAngleRad / Math.PI;
  const eclipseS = periodS * eclipseFraction;
  return representable({
    altitudeKm, radiusKm, velocityKmS, periodS, eclipseHalfAngleRad,
    eclipseFraction, eclipseS, sunlightS: periodS - eclipseS,
  });
}

export interface SolarInput {
  areaM2: number;
  efficiency: number;
  incidenceDeg: number;
  distanceAu: number;
}

/** Incidence is measured from the illuminated panel's normal, from 0 to 90 degrees. */
export function solarPower({ areaM2, efficiency, incidenceDeg, distanceAu }: SolarInput) {
  nonnegative('areaM2', areaM2);
  finite('efficiency', efficiency);
  finite('incidenceDeg', incidenceDeg);
  positive('distanceAu', distanceAu);
  if (efficiency < 0 || efficiency > 1) throw new RangeError('efficiency must be between 0 and 1.');
  if (incidenceDeg < 0 || incidenceDeg > 90) throw new RangeError('incidenceDeg must be between 0 and 90.');
  const projection = incidenceDeg === 90 ? 0 : Math.cos(incidenceDeg * Math.PI / 180);
  const irradianceWm2 = LAB_CONSTANTS.solarIrradianceAt1AuWm2 / distanceAu ** 2;
  const projectedAreaM2 = areaM2 * projection;
  const incidentW = irradianceWm2 * projectedAreaM2;
  // Panel conversion happens once. The battery's efficiency is a separate model.
  const electricW = incidentW * efficiency;
  return representable({ irradianceWm2, projectedAreaM2, incidentW, electricW, projection });
}

export interface EclipseBatteryInput {
  loadW: number;
  eclipseS: number;
  reserveFraction: number;
}

/** Full battery at eclipse entry; reserve is a fraction of nominal energy capacity. */
export function eclipseBattery({ loadW, eclipseS, reserveFraction }: EclipseBatteryInput) {
  nonnegative('loadW', loadW);
  nonnegative('eclipseS', eclipseS);
  finite('reserveFraction', reserveFraction);
  if (reserveFraction < 0 || reserveFraction >= 1) {
    throw new RangeError('reserveFraction must be at least 0 and less than 1.');
  }
  const busEnergyWh = loadW * (eclipseS / 3_600);
  const withdrawnEnergyWh = busEnergyWh / LAB_CONSTANTS.batteryDischargeEfficiency;
  const minimumCapacityWh = withdrawnEnergyWh / (1 - reserveFraction);
  const reserveEnergyWh = minimumCapacityWh * reserveFraction;
  return representable({ busEnergyWh, withdrawnEnergyWh, minimumCapacityWh, reserveEnergyWh });
}

export interface RocketInput {
  dryMassKg: number;
  propellantMassKg: number;
  specificImpulseS: number;
}

/** Tsiolkovsky: constant equivalent exhaust velocity, all propellant consumed, no losses. */
export function idealRocket({ dryMassKg, propellantMassKg, specificImpulseS }: RocketInput) {
  positive('dryMassKg', dryMassKg);
  nonnegative('propellantMassKg', propellantMassKg);
  positive('specificImpulseS', specificImpulseS);
  const initialMassKg = dryMassKg + propellantMassKg;
  const massRatio = initialMassKg / dryMassKg;
  const exhaustVelocityMs = LAB_CONSTANTS.standardGravityMs2 * specificImpulseS;
  // log1p preserves small propellant increments that 1 + mp/md could round away.
  const deltaVMs = exhaustVelocityMs * Math.log1p(propellantMassKg / dryMassKg);
  const propellantFraction = propellantMassKg / initialMassKg;
  return representable({ initialMassKg, massRatio, exhaustVelocityMs, deltaVMs, propellantFraction });
}

export interface RadioInput {
  transmitPowerW: number;
  frequencyGhz: number;
  distanceKm: number;
}

/** Ideal Friis far-field link; fixed dBi gains, aligned antennas and matched polarization. */
export function idealRadioLink({ transmitPowerW, frequencyGhz, distanceKm }: RadioInput) {
  positive('transmitPowerW', transmitPowerW);
  positive('frequencyGhz', frequencyGhz);
  positive('distanceKm', distanceKm);
  const frequencyHz = frequencyGhz * 1e9;
  const distanceM = distanceKm * 1_000;
  const wavelengthM = LAB_CONSTANTS.speedOfLightMs / frequencyHz;
  // The logarithmic form avoids squaring large distances before taking their log.
  const freeSpaceLossDb = 20 * (
    Math.log10(4 * Math.PI) + Math.log10(distanceM) - Math.log10(wavelengthM)
  );
  const transmitDbm = 10 * Math.log10(transmitPowerW) + 30;
  const receivedDbm = transmitDbm + LAB_CONSTANTS.transmitGainDbi + LAB_CONSTANTS.receiveGainDbi - freeSpaceLossDb;
  const receivedW = 10 ** ((receivedDbm - 30) / 10);
  const oneWayLatencyS = distanceM / LAB_CONSTANTS.speedOfLightMs;
  return representable({
    wavelengthM, freeSpaceLossDb, transmitDbm, receivedDbm, receivedW,
    oneWayLatencyS, roundTripLatencyS: oneWayLatencyS * 2,
  });
}
