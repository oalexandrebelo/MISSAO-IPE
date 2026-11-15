/** Small reduced fractions. Only the closed model's clock/energy use BigInt. */
export interface Fraction { readonly n: bigint; readonly d: bigint; }

function gcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) { const r = a % b; a = b; b = r; }
  return a;
}

export function q(n: number | bigint, d: number | bigint = 1): Fraction {
  if (typeof n === 'number' && !Number.isSafeInteger(n)) throw new RangeError('Numerador não inteiro seguro.');
  if (typeof d === 'number' && !Number.isSafeInteger(d)) throw new RangeError('Denominador não inteiro seguro.');
  let numerator = BigInt(n);
  let denominator = BigInt(d);
  if (denominator === 0n) throw new RangeError('Denominador zero.');
  if (denominator < 0n) { numerator = -numerator; denominator = -denominator; }
  const divisor = gcd(numerator, denominator);
  return { n: numerator / divisor, d: denominator / divisor };
}
export const ZERO = q(0);
export const add = (a: Fraction, b: Fraction): Fraction => q(a.n * b.d + b.n * a.d, a.d * b.d);
export const sub = (a: Fraction, b: Fraction): Fraction => q(a.n * b.d - b.n * a.d, a.d * b.d);
export const mul = (a: Fraction, b: Fraction): Fraction => q(a.n * b.n, a.d * b.d);
export const div = (a: Fraction, b: Fraction): Fraction => q(a.n * b.d, a.d * b.n);
export const cmp = (a: Fraction, b: Fraction): number => {
  const difference = a.n * b.d - b.n * a.d;
  return difference < 0n ? -1 : difference > 0n ? 1 : 0;
};
export const min = (a: Fraction, b: Fraction): Fraction => cmp(a, b) < 0 ? a : b;
export const toNumber = (a: Fraction): number => Number(a.n) / Number(a.d);
export function floorSafe(a: Fraction): number {
  if (a.n < 0n) throw new RangeError('Contagem negativa.');
  const integer = a.n / a.d;
  if (integer > BigInt(Number.MAX_SAFE_INTEGER)) throw new RangeError('Contagem além do limite seguro.');
  return Number(integer);
}
