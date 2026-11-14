/** A deliberately small, versioned JSON dialect. No imported value is executable. */
export const CANONICALIZATION_VERSION = 'ipe-json-v1' as const;
export const MAX_REPLAY_BYTES = 1_048_576;
export const MAX_JSON_DEPTH = 20;
const MAX_NODES = 60_000;
const MAX_STRING_LENGTH = 8_192;
const FORBIDDEN_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

export class ReplayValidationError extends Error {
  readonly code = 'INVALID_REPLAY';
  constructor(message: string) {
    super(message);
    this.name = 'ReplayValidationError';
  }
}

export function invalid(message: string): never {
  throw new ReplayValidationError(message);
}

function checkString(value: string): void {
  if (value.length > MAX_STRING_LENGTH) invalid('String excede o limite do formato.');
  // Unpaired UTF-16 surrogates do not have a unique UTF-8 representation.
  for (let i = 0; i < value.length; i++) {
    const c = value.charCodeAt(i);
    if (c >= 0xd800 && c <= 0xdbff) {
      const next = value.charCodeAt(++i);
      if (!(next >= 0xdc00 && next <= 0xdfff)) invalid('Unicode inválido.');
    } else if (c >= 0xdc00 && c <= 0xdfff) invalid('Unicode inválido.');
  }
}

/** Unlike JSON.parse alone, rejects duplicate decoded keys before any overwrite. */
export function parseStrictJson(text: string): unknown {
  if (typeof text !== 'string' || text.length > MAX_REPLAY_BYTES ||
      new TextEncoder().encode(text).byteLength > MAX_REPLAY_BYTES) invalid('Replay excede 1 MiB.');
  let position = 0;
  let nodes = 0;
  const whitespace = () => { while (/[\u0020\t\r\n]/.test(text[position] ?? '\u0000')) position++; };
  const string = (): string => {
    const start = position++;
    while (position < text.length) {
      const ch = text[position++];
      if (ch === '"') {
        let decoded: unknown;
        try { decoded = JSON.parse(text.slice(start, position)); }
        catch { return invalid('String JSON inválida.'); }
        if (typeof decoded !== 'string') invalid('String JSON inválida.');
        checkString(decoded);
        return decoded;
      }
      if (ch === '\\') position++;
    }
    return invalid('String JSON não terminada.');
  };
  const value = (depth: number): unknown => {
    if (++nodes > MAX_NODES || depth > MAX_JSON_DEPTH) invalid('Estrutura JSON excede os limites.');
    whitespace();
    const ch = text[position];
    if (ch === '"') return string();
    if (ch === '{') {
      position++;
      const object: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
      const keys = new Set<string>();
      whitespace();
      if (text[position] === '}') { position++; return object; }
      while (true) {
        whitespace();
        if (text[position] !== '"') invalid('Chave JSON inválida.');
        const key = string();
        if (FORBIDDEN_KEYS.has(key)) invalid(`Chave proibida: ${key}.`);
        if (keys.has(key)) invalid(`Chave duplicada: ${key}.`);
        keys.add(key);
        whitespace();
        if (text[position++] !== ':') invalid('Objeto JSON inválido.');
        object[key] = value(depth + 1);
        whitespace();
        const delimiter = text[position++];
        if (delimiter === '}') return object;
        if (delimiter !== ',') invalid('Objeto JSON inválido.');
      }
    }
    if (ch === '[') {
      position++;
      const array: unknown[] = [];
      whitespace();
      if (text[position] === ']') { position++; return array; }
      while (true) {
        if (array.length >= 8_192) invalid('Array excede o limite do formato.');
        array.push(value(depth + 1));
        whitespace();
        const delimiter = text[position++];
        if (delimiter === ']') return array;
        if (delimiter !== ',') invalid('Array JSON inválido.');
      }
    }
    for (const [token, result] of [['true', true], ['false', false], ['null', null]] as const) {
      if (text.startsWith(token, position)) { position += token.length; return result; }
    }
    const match = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(text.slice(position));
    if (!match) return invalid('Valor JSON inválido; somente números finitos são aceitos.');
    position += match[0].length;
    const number = Number(match[0]);
    if (!Number.isFinite(number) || Math.abs(number) > Number.MAX_SAFE_INTEGER) invalid('Número fora do intervalo seguro.');
    return number;
  };
  const result = value(0);
  whitespace();
  if (position !== text.length) invalid('Conteúdo extra depois do JSON.');
  return result;
}

/** Sorted object keys, preserved array order, JSON number representation, UTF-8. */
export function canonicalJson(value: unknown): string {
  let nodes = 0;
  const encode = (item: unknown, depth: number): string => {
    if (++nodes > MAX_NODES || depth > MAX_JSON_DEPTH) invalid('Estrutura excede os limites.');
    if (item === null) return 'null';
    if (typeof item === 'string') { checkString(item); return JSON.stringify(item); }
    if (typeof item === 'boolean') return String(item);
    if (typeof item === 'number') {
      if (!Number.isFinite(item) || Math.abs(item) > Number.MAX_SAFE_INTEGER) invalid('Número fora do intervalo seguro.');
      return JSON.stringify(item);
    }
    if (Array.isArray(item)) {
      if (item.length > 8_192 || Object.keys(item).length !== item.length || Object.getOwnPropertySymbols(item).length) invalid('Array inválido.');
      const elements: string[] = [];
      for (let i = 0; i < item.length; i++) {
        const descriptor = Object.getOwnPropertyDescriptor(item, String(i));
        if (!descriptor || !('value' in descriptor)) invalid('Array esparso ou com acessor não é aceito.');
        elements.push(encode(descriptor.value, depth + 1));
      }
      return '[' + elements.join(',') + ']';
    }
    if (typeof item !== 'object' || !item) return invalid('Valor não serializável.');
    const prototype = Object.getPrototypeOf(item);
    if (prototype !== Object.prototype && prototype !== null) invalid('Objeto JSON inválido.');
    if (Object.getOwnPropertySymbols(item).length) invalid('Chaves simbólicas não são aceitas.');
    return '{' + Object.keys(item).sort().map(key => {
      if (FORBIDDEN_KEYS.has(key)) invalid(`Chave proibida: ${key}.`);
      checkString(key);
      const descriptor = Object.getOwnPropertyDescriptor(item, key);
      if (!descriptor || !('value' in descriptor)) invalid('Acessores não são aceitos.');
      return JSON.stringify(key) + ':' + encode(descriptor.value, depth + 1);
    }).join(',') + '}';
  };
  const encoded = encode(value, 0);
  if (new TextEncoder().encode(encoded).byteLength > MAX_REPLAY_BYTES) invalid('Conteúdo excede 1 MiB.');
  return encoded;
}

export async function sha256Canonical(value: unknown): Promise<string> {
  if (!globalThis.crypto?.subtle) throw new Error('SHA-256 indisponível; use HTTPS ou localhost.');
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonicalJson(value)));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}
