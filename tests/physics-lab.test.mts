import assert from 'node:assert/strict';
import test from 'node:test';
import { circularLeo, eclipseBattery, idealRadioLink, idealRocket, LAB_CONSTANTS, solarPower } from '../src/lab/physics.ts';

function near(actual: number, expected: number, tolerance: number): void {
  assert.ok(Number.isFinite(actual), `Expected a finite result, got ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} differs from ${expected} by more than ${tolerance}`);
}

const panel = { areaM2: 1, efficiency: 0.3, incidenceDeg: 0, distanceAu: 1 };
const battery = { loadW: 10, eclipseS: 360, reserveFraction: 0.2 };
const rocket = { dryMassKg: 10, propellantMassKg: 10, specificImpulseS: 300 };
const radio = { transmitPowerW: 2, frequencyGhz: 2.2, distanceKm: 1_000 };

test('500 km circular Earth reference uses the declared mean radius and JPL gravitational parameter', () => {
  const result = circularLeo(500);
  assert.equal(result.radiusKm, 6_871);
  near(result.velocityKmS, 7.616560746, 1e-9);
  near(result.periodS, 5_668.144414, 1e-6);
  near(result.eclipseS, 2_141.523158, 1e-6);
  near(result.sunlightS + result.eclipseS, result.periodS, 1e-12);
  assert.ok(result.eclipseFraction > 0 && result.eclipseFraction < 0.5);
});

test('across the LEO domain, higher orbits are slower and longer; shadow intersections remain on Earth tangents', () => {
  let previous = circularLeo(200);
  for (let altitude = 210; altitude <= 2_000; altitude += 10) {
    const current = circularLeo(altitude);
    assert.ok(current.velocityKmS < previous.velocityKmS);
    assert.ok(current.periodS > previous.periodS);
    assert.ok(current.eclipseFraction < previous.eclipseFraction);
    // Independent geometric and dimensional invariants, not rounded display values.
    near(current.radiusKm * Math.sin(current.eclipseHalfAngleRad), LAB_CONSTANTS.earthMeanRadiusKm, 1e-10);
    near(current.velocityKmS * current.periodS, 2 * Math.PI * current.radiusKm, 1e-9);
    near(current.velocityKmS ** 2 * current.radiusKm, LAB_CONSTANTS.earthMuKm3S2, 1e-9);
    previous = current;
  }
});

test('both LEO boundaries are inclusive and values immediately beyond the domain fail', () => {
  assert.equal(circularLeo(200).altitudeKm, 200);
  assert.equal(circularLeo(2_000).altitudeKm, 2_000);
  for (const altitude of [199.999999, 2_000.000001, 0, -1]) {
    assert.throws(() => circularLeo(altitude), RangeError);
  }
  for (const altitude of [NaN, Infinity, -Infinity]) assert.throws(() => circularLeo(altitude), TypeError);
});

test('solar reference separates incident and electrical power and applies efficiency exactly once', () => {
  const result = solarPower(panel);
  assert.equal(result.irradianceWm2, 1_361);
  assert.equal(result.projectedAreaM2, 1);
  assert.equal(result.incidentW, 1_361);
  near(result.electricW, 408.3, 1e-12);
  near(solarPower({ ...panel, areaM2: 0.05 }).electricW, 20.415, 1e-12);
  const perfect = solarPower({ ...panel, efficiency: 1 });
  assert.equal(perfect.electricW, perfect.incidentW);
});

test('solar area and efficiency scale linearly, distance follows inverse square, 60 degrees halves the projection', () => {
  const reference = solarPower(panel);
  near(solarPower({ ...panel, areaM2: 2 }).electricW, reference.electricW * 2, 1e-12);
  near(solarPower({ ...panel, efficiency: 0.6 }).electricW, reference.electricW * 2, 1e-12);
  near(solarPower({ ...panel, distanceAu: 2 }).electricW, reference.electricW / 4, 1e-12);
  near(solarPower({ ...panel, incidenceDeg: 60 }).electricW, reference.electricW / 2, 1e-12);
  assert.equal(solarPower({ ...panel, efficiency: 0.6 }).incidentW, reference.incidentW);
});

test('solar physical zero boundaries produce exactly zero, including an edge-on panel', () => {
  assert.equal(solarPower({ ...panel, areaM2: 0 }).electricW, 0);
  assert.equal(solarPower({ ...panel, efficiency: 0 }).electricW, 0);
  const edge = solarPower({ ...panel, incidenceDeg: 90 });
  assert.equal(edge.projection, 0);
  assert.equal(edge.projectedAreaM2, 0);
  assert.equal(edge.incidentW, 0);
  assert.equal(edge.electricW, 0);
  assert.ok(solarPower({ ...panel, incidenceDeg: 89.999 }).electricW > 0);
});

test('solar rejects nonphysical parameters and nonfinite inputs for every field', () => {
  for (const change of [{ areaM2: -0.01 }, { efficiency: -0.01 }, { efficiency: 1.00001 }, { incidenceDeg: -1 }, { incidenceDeg: 90.00001 }, { distanceAu: 0 }, { distanceAu: -1 }]) {
    assert.throws(() => solarPower({ ...panel, ...change }), RangeError);
  }
  for (const key of Object.keys(panel)) for (const invalid of [NaN, Infinity, -Infinity]) {
    assert.throws(() => solarPower({ ...panel, [key]: invalid }), TypeError);
  }
});

test('eclipse capacity accounts separately for bus energy, discharge loss and nominal-capacity reserve', () => {
  const result = eclipseBattery(battery);
  assert.equal(result.busEnergyWh, 1);
  near(result.withdrawnEnergyWh, 1.0526315789473684, 1e-14);
  near(result.minimumCapacityWh, 1.3157894736842104, 1e-14);
  near(result.reserveEnergyWh, 0.2631578947368421, 1e-14);
  near(result.minimumCapacityWh - result.withdrawnEnergyWh, result.reserveEnergyWh, 1e-14);
  near((result.minimumCapacityWh - result.reserveEnergyWh) * 0.95, result.busEnergyWh, 1e-14);
  assert.notEqual(result.minimumCapacityWh, result.withdrawnEnergyWh * 1.2, 'A 20% reserve is not a 20% markup on consumption.');
});

test('battery zero-load, zero-duration, zero-reserve boundaries and approaching full reserve are well-defined', () => {
  assert.equal(eclipseBattery({ ...battery, loadW: 0 }).minimumCapacityWh, 0);
  assert.equal(eclipseBattery({ ...battery, eclipseS: 0 }).minimumCapacityWh, 0);
  const noReserve = eclipseBattery({ ...battery, reserveFraction: 0 });
  assert.equal(noReserve.minimumCapacityWh, noReserve.withdrawnEnergyWh);
  const highReserve = eclipseBattery({ ...battery, reserveFraction: 0.999 });
  near(highReserve.minimumCapacityWh, noReserve.withdrawnEnergyWh * 1_000, 1e-9);
  near(eclipseBattery({ ...battery, loadW: 20 }).minimumCapacityWh, 2 * eclipseBattery(battery).minimumCapacityWh, 1e-12);
  near(eclipseBattery({ ...battery, eclipseS: 720 }).minimumCapacityWh, 2 * eclipseBattery(battery).minimumCapacityWh, 1e-12);
});

test('battery rejects a 100% reserve, negative energy drivers and nonfinite fields', () => {
  for (const change of [{ loadW: -1 }, { eclipseS: -1 }, { reserveFraction: -0.01 }, { reserveFraction: 1 }, { reserveFraction: 1.01 }]) {
    assert.throws(() => eclipseBattery({ ...battery, ...change }), RangeError);
  }
  for (const key of Object.keys(battery)) for (const invalid of [NaN, Infinity, -Infinity]) {
    assert.throws(() => eclipseBattery({ ...battery, [key]: invalid }), TypeError);
  }
});

test('Tsiolkovsky reference, scale invariance and logarithmic fuel tradeoff hold', () => {
  const reference = idealRocket(rocket);
  assert.equal(reference.massRatio, 2);
  assert.equal(reference.propellantFraction, 0.5);
  // Reference evaluated independently with 60-digit Decimal arithmetic.
  near(reference.deltaVMs, 2_039.2355394714563, 1e-9);
  near(idealRocket({ ...rocket, dryMassKg: 100, propellantMassKg: 100 }).deltaVMs, reference.deltaVMs, 1e-12);
  near(idealRocket({ ...rocket, specificImpulseS: 600 }).deltaVMs, reference.deltaVMs * 2, 1e-12);
  const moreFuel = idealRocket({ ...rocket, propellantMassKg: 20 });
  assert.ok(moreFuel.deltaVMs > reference.deltaVMs && moreFuel.deltaVMs < reference.deltaVMs * 2);
  assert.ok(idealRocket({ ...rocket, dryMassKg: 20 }).deltaVMs < reference.deltaVMs);
});

test('zero and tiny propellant do not manufacture delta-v or lose small increments', () => {
  const empty = idealRocket({ ...rocket, propellantMassKg: 0 });
  assert.equal(empty.deltaVMs, 0);
  assert.equal(empty.massRatio, 1);
  assert.equal(empty.initialMassKg, rocket.dryMassKg);
  const tiny = idealRocket({ ...rocket, propellantMassKg: 1e-16 });
  assert.ok(tiny.deltaVMs > 0, 'log1p retains the positive fuel increment below relative machine epsilon.');
  near(tiny.deltaVMs, 2.941995e-14, 1e-28);
});

test('rocket rejects zero dry mass, nonpositive Isp, negative propellant and nonfinite fields', () => {
  for (const change of [{ dryMassKg: 0 }, { dryMassKg: -1 }, { propellantMassKg: -1 }, { specificImpulseS: 0 }, { specificImpulseS: -1 }]) {
    assert.throws(() => idealRocket({ ...rocket, ...change }), RangeError);
  }
  for (const key of Object.keys(rocket)) for (const invalid of [NaN, Infinity, -Infinity]) {
    assert.throws(() => idealRocket({ ...rocket, [key]: invalid }), TypeError);
  }
});

test('Friis benchmark uses fixed 3 and 20 dBi gains with GHz/km conversion and one-way light time', () => {
  const result = idealRadioLink(radio);
  // Independent 60-digit Decimal benchmark; c is exact, pi supplied to 59 digits.
  near(result.freeSpaceLossDb, 159.2962368383275, 1e-9);
  near(result.receivedDbm, -103.28593688168769, 1e-9);
  near(result.oneWayLatencyS, 0.0033356409519815205, 1e-15);
  near(result.roundTripLatencyS, 0.006671281903963041, 1e-15);
  near(result.wavelengthM, 0.1362692990909091, 1e-15);
  const linearFriis = 2 * 10 ** (3 / 10) * 100 * (0.1362692990909091 / (4 * Math.PI * 1_000_000)) ** 2;
  near(result.receivedW, linearFriis, 1e-27);
});

test('Friis power doubles with Pt, quarters with distance or frequency, and only distance changes latency', () => {
  const base = idealRadioLink(radio);
  const doublePower = idealRadioLink({ ...radio, transmitPowerW: 4 });
  const doubleDistance = idealRadioLink({ ...radio, distanceKm: 2_000 });
  const doubleFrequency = idealRadioLink({ ...radio, frequencyGhz: 4.4 });
  near(doublePower.receivedW / base.receivedW, 2, 1e-13);
  near(doubleDistance.receivedW / base.receivedW, 0.25, 1e-14);
  near(doubleFrequency.receivedW / base.receivedW, 0.25, 1e-14);
  near(doublePower.receivedDbm - base.receivedDbm, 3.010299956639812, 1e-12);
  near(doubleDistance.receivedDbm - base.receivedDbm, -6.020599913279624, 1e-12);
  assert.equal(doubleDistance.oneWayLatencyS, 2 * base.oneWayLatencyS);
  assert.equal(doubleFrequency.oneWayLatencyS, base.oneWayLatencyS);
  assert.equal(doublePower.oneWayLatencyS, base.oneWayLatencyS);
  assert.equal(LAB_CONSTANTS.transmitGainDbi, 3);
  assert.equal(LAB_CONSTANTS.receiveGainDbi, 20);
});

test('radio rejects singular zero distances, zero frequency and nonpositive transmitting power', () => {
  for (const key of Object.keys(radio)) {
    for (const invalid of [0, -1]) assert.throws(() => idealRadioLink({ ...radio, [key]: invalid }), RangeError);
    for (const invalid of [NaN, Infinity, -Infinity]) assert.throws(() => idealRadioLink({ ...radio, [key]: invalid }), TypeError);
  }
});

test('numeric overflow fails explicitly instead of leaking NaN or infinity into the interface', () => {
  assert.throws(() => solarPower({ ...panel, distanceAu: Number.MIN_VALUE }), RangeError);
  assert.throws(() => eclipseBattery({ ...battery, loadW: Number.MAX_VALUE, eclipseS: Number.MAX_VALUE }), RangeError);
  assert.throws(() => idealRocket({ ...rocket, dryMassKg: Number.MAX_VALUE, propellantMassKg: Number.MAX_VALUE }), RangeError);
  assert.throws(() => idealRadioLink({ ...radio, frequencyGhz: Number.MAX_VALUE }), RangeError);
});

test('model calls preserve their inputs and return immutable independent results', () => {
  const input = Object.freeze({ ...panel });
  const result = solarPower(input);
  assert.deepEqual(input, panel);
  assert.ok(Object.isFrozen(result));
  assert.ok(Object.isFrozen(LAB_CONSTANTS));
  assert.notEqual(result, solarPower(input));
});
