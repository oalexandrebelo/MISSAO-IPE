import type { Fraction } from './exact.ts';
import { cmp, div, min, mul, sub, ZERO, q } from './exact.ts';

export interface PowerFlow {
  solar: Fraction; load: Fraction; chargeInput: Fraction; discharge: Fraction;
  change: Fraction; loss: Fraction; spill: Fraction;
}

/** Exact instantaneous balance. Discharge is measured at the battery, before conversion. */
export function powerFlow(solar: Fraction, load: Fraction, energy: Fraction, capacity: Fraction, maxChargeInput: Fraction, efficiency: Fraction): PowerFlow {
  if (cmp(solar, ZERO) < 0 || cmp(load, ZERO) < 0 || cmp(energy, ZERO) < 0 || cmp(energy, capacity) > 0 || cmp(maxChargeInput, ZERO) < 0 || cmp(efficiency, ZERO) <= 0 || cmp(efficiency, q(1)) > 0) throw new RangeError('Entrada de potência inválida.');
  const excess = sub(solar, load);
  if (cmp(excess, ZERO) >= 0) {
    const chargeInput = cmp(energy, capacity) === 0 ? ZERO : min(excess, maxChargeInput);
    return { solar, load, chargeInput, discharge: ZERO, change: mul(chargeInput, efficiency), loss: mul(chargeInput, sub(q(1), efficiency)), spill: sub(excess, chargeInput) };
  }
  const needed = sub(load, solar);
  const discharge = div(needed, efficiency);
  return { solar, load, chargeInput: ZERO, discharge, change: sub(ZERO, discharge), loss: sub(discharge, needed), spill: ZERO };
}
