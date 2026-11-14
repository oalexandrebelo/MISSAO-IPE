import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { DEFAULT_CONFIG } from '../src/core/catalog.ts';
import { simulateMission } from '../src/core/engine.ts';
import { enumerateConfigurations } from '../src/core/search.ts';
import { exportReplay, importReplay, MAX_REPLAY_BYTES, ReplayValidationError } from '../src/persistence/replay.ts';
import { hashResult, IDENTITY_VERSIONS } from '../src/persistence/identity.ts';
import { canonicalJson, parseStrictJson, sha256Canonical } from '../src/persistence/json.ts';

const run = () => simulateMission({ ...DEFAULT_CONFIG }, 'long-contact');
const envelope = async () => JSON.parse(await exportReplay(run()));

test('all 64 configurations in both scenarios survive export and independent reexecution', async () => {
  let count = 0;
  for (const config of enumerateConfigurations()) {
    for (const scenario of ['long-contact', 'short-contact'] as const) {
      const original = simulateMission(config, scenario);
      const imported = await importReplay(await exportReplay(original));
      assert.equal(imported.matchesClaim, true, `${scenario} ${JSON.stringify(config)}`);
      assert.equal(canonicalJson(imported.result), canonicalJson(original));
      count++;
    }
  }
  assert.equal(count, 128);
});

test('trace omission is explicit and roundtrips without changing the calculation', async () => {
  const result = simulateMission({ ...DEFAULT_CONFIG }, 'short-contact', { trace: false });
  const text = await exportReplay(result);
  assert.equal(JSON.parse(text).input.trace, false);
  const imported = await importReplay(text);
  assert.equal(imported.matchesClaim, true);
  assert.equal(imported.result.trace.length, 0);
});

test('canonical SHA-256 is independent of insertion order and matches standard crypto', async () => {
  assert.equal(canonicalJson({ b: 1, a: 2 }), '{"a":2,"b":1}');
  const expected = createHash('sha256').update('{"a":2,"b":1}').digest('hex');
  assert.equal(await sha256Canonical({ b: 1, a: 2 }), expected);
  assert.equal(await sha256Canonical({ a: 2, b: 1 }), expected);
  assert.notEqual(await sha256Canonical(['a', 'b']), await sha256Canonical(['b', 'a']));
});

test('editing an input or result without updating its hash is rejected', async () => {
  const changedClaim = await envelope();
  changedClaim.claimedResult.finalEnergyWh += 1;
  await assert.rejects(importReplay(JSON.stringify(changedClaim)), /Hash da alegação/);
  const changedInput = await envelope();
  changedInput.input.config.radio = 'fast';
  changedInput.claimedResult.config.radio = 'fast';
  await assert.rejects(importReplay(JSON.stringify(changedInput)), /Hash da entrada/);
  const changedHash = await envelope();
  changedHash.resultHash = '0'.repeat(64);
  await assert.rejects(importReplay(JSON.stringify(changedHash)), /Hash da alegação/);
});

test('a forged claim with a correctly recomputed hash is reported as mismatch', async () => {
  const forged = await envelope();
  const trueResult = canonicalJson(run());
  forged.claimedResult.outcome = forged.claimedResult.outcome === 'success' ? 'failure' : 'success';
  forged.claimedResult.finalEnergyWh += 1;
  forged.resultHash = await hashResult(forged.claimedResult);
  const imported = await importReplay(JSON.stringify(forged));
  assert.equal(imported.matchesClaim, false);
  assert.equal(canonicalJson(imported.result), trueResult);
  assert.equal(canonicalJson(imported.importedClaim), canonicalJson(forged.claimedResult));
});

test('unknown fields are rejected at every imported schema boundary', async () => {
  const locations = [
    (e: any) => e,
    (e: any) => e.input,
    (e: any) => e.input.config,
    (e: any) => e.claimedResult,
    (e: any) => e.claimedResult.energyBalance,
    (e: any) => e.claimedResult.events[0],
    (e: any) => e.claimedResult.trace[0],
    (e: any) => e.claimedResult.observations[0],
  ];
  for (const location of locations) {
    const data = await envelope();
    assert.ok(location(data));
    location(data).remoteUrl = 'https://example.invalid/never-fetch';
    await assert.rejects(importReplay(JSON.stringify(data)), /campo inesperado/);
  }
});

test('duplicates, decoded duplicates and pollution keys are rejected before overwrite', async () => {
  const text = await exportReplay(run());
  const attacks = [
    text.replace('{', '{"format":"forged",'),
    text.replace('"battery":', '"battery":"large","\\u0062attery":'),
    text.replace('{', '{"__proto__":{"polluted":true},'),
    text.replace('{', '{"constructor":{},'),
    text.replace('{', '{"prototype":{},'),
    text.replace('{', '{"\\u005f_proto__":{},'),
  ];
  for (const attack of attacks) await assert.rejects(importReplay(attack), ReplayValidationError);
  assert.equal(Object.hasOwn(Object.prototype, 'polluted'), false);
});

test('non-JSON syntax, nonfinite numbers and unsafe numeric integers are rejected', async () => {
  const text = await exportReplay(run());
  for (const value of ['NaN', 'Infinity', '-Infinity', '1e999', '9007199254740993', '01', '+1', 'undefined']) {
    const changed = text.replace(/"finalEnergyWh":[^,}]+/, `"finalEnergyWh":${value}`);
    await assert.rejects(importReplay(changed), ReplayValidationError, value);
  }
  for (const bad of ['', '{} trailing', '{"x":1,}', '[1,]', '/*comment*/{}', '{"x":"\\ud800"}']) {
    assert.throws(() => parseStrictJson(bad), ReplayValidationError);
  }
  for (const value of [NaN, Infinity, -Infinity]) {
    const result = run();
    result.finalEnergyWh = value;
    await assert.rejects(exportReplay(result), ReplayValidationError);
  }
});

test('size, depth, array and string limits stop excessive imports', async () => {
  await assert.rejects(importReplay(' '.repeat(MAX_REPLAY_BYTES + 1)), ReplayValidationError);
  await assert.rejects(importReplay('"' + 'é'.repeat(MAX_REPLAY_BYTES / 2) + '"'), ReplayValidationError);
  assert.throws(() => parseStrictJson('['.repeat(21) + '0' + ']'.repeat(21)), ReplayValidationError);
  assert.throws(() => parseStrictJson('[' + '0,'.repeat(8192) + '0]'), ReplayValidationError);
  assert.throws(() => parseStrictJson(JSON.stringify('x'.repeat(8193))), ReplayValidationError);
});

test('every version and scientific pack hash is pinned to this supported implementation', async () => {
  for (const key of Object.keys(IDENTITY_VERSIONS)) {
    const data = await envelope();
    data[key] = key === 'resultSchemaVersion' ? 2 : 'unsupported';
    await assert.rejects(importReplay(JSON.stringify(data)), /Versão ou pack incompatível/);
  }
  const data = await envelope();
  data.replaySchemaVersion = 2;
  await assert.rejects(importReplay(JSON.stringify(data)), /versão de replay/);
});

test('bit strings retain the maximum safe integer and reject coercion or loss', async () => {
  const data = await envelope();
  data.claimedResult.generatedBits = '9007199254740991';
  data.resultHash = await hashResult(data.claimedResult);
  const imported = await importReplay(JSON.stringify(data));
  assert.equal((imported.importedClaim as {generatedBits: string}).generatedBits, '9007199254740991');
  assert.equal(imported.matchesClaim, false);
  for (const bits of ['9007199254740992', '01', '-1', '1.0', '1e9', 180000000]) {
    const bad = await envelope();
    bad.claimedResult.generatedBits = bits;
    await assert.rejects(importReplay(JSON.stringify(bad)), /bits exigem/);
  }
});

test('an imported string resembling a URL is never fetched', async () => {
  const data = await envelope();
  data.claimedResult.events[0].message = 'https://example.invalid/untrusted-source';
  data.resultHash = await hashResult(data.claimedResult);
  const originalFetch = globalThis.fetch;
  let fetches = 0;
  globalThis.fetch = async () => { fetches++; throw new Error('Unexpected fetch'); };
  try {
    const imported = await importReplay(JSON.stringify(data));
    assert.equal(imported.matchesClaim, false);
    assert.equal(fetches, 0);
  } finally { globalThis.fetch = originalFetch; }
});
