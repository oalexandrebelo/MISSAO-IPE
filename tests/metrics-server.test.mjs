import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createMetricsHandler } from '../server/metrics/handler.mjs';
import { createBlobRepository, currentManagedOidcToken, StorageUnavailable } from '../server/metrics/blob.mjs';
import { normalizeEvent, summarizeResult } from '../server/metrics/model.mjs';
import { DEFAULT_CONFIG } from '../experiments/mission-design-lab/src/core/catalog.ts';
import { simulateMission } from '../experiments/mission-design-lab/src/core/engine.ts';
import { simulateExpedition } from '../experiments/mission-design-lab/src/lab/scientific-expeditions.ts';

const ORIGIN = 'https://projeto-ipe.vercel.app';
const SIGNING = 'signing-test-secret-32-bytes-and-more';
const ADMIN = 'admin-test-secret-32-bytes-and-more';
const NOW = Date.parse('2026-11-15T12:00:00.000Z');
const baseExpedition = { launch: 'science', orbit: 'far', duration: 'full', instrument: 'spectrometer', power: 'extended', ground: 'extended' };
function setup() {
  const data = new Map(); let clock = NOW;
  const repository = {
    async get(key) { return data.get(key) ?? null; },
    async putIfAbsent(key, value) { if (data.has(key)) return { created: false, document: data.get(key) }; data.set(key, structuredClone(value)); return { created: true, document: value }; },
    async list(cursor) { const all = [...data.values()]; const offset = Number(cursor ?? 0), documents = all.slice(offset, offset + 2); return { documents, hasMore: offset + 2 < all.length, cursor: offset + 2 < all.length ? String(offset + 2) : null }; },
  };
  const handler = createMetricsHandler({ repository, signingSecret: SIGNING, adminSecret: ADMIN, now: () => clock });
  async function request(method, body, cookie, options = {}) {
    const headers = { origin: ORIGIN, 'content-type': 'application/json', cookie, ...options.headers };
    const req = { method, url: options.url ?? '/api/metrics', headers, body, socket: { remoteAddress: 'test' } };
    const response = { headers: {}, setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, end(text) { this.body = JSON.parse(text); } };
    await handler(req, response);
    return response;
  }
  async function register(name = 'Player Test', email = 'player@example.invalid') {
    const response = await request('POST', { action: 'register', name, email });
    assert.equal(response.statusCode, 201);
    return { ...response.body, cookie: response.headers['set-cookie'].split(';')[0] };
  }
  return { data, repository, request, register, advance: ms => clock += ms };
}
function event(kind, mission, payload, id = randomUUID()) { return { id, kind, mission, at: new Date(NOW).toISOString(), payload }; }
function attempt(mission, config, scenarioId) { return event('attempt', mission, { attemptId: randomUUID(), status: 'completed', config, ...(scenarioId ? { scenarioId } : {}) }); }

test('registration sets private session cookie and rejects public reading of all players', async () => {
  const s = setup(); const p = await s.register();
  assert.match(p.cookie, /^ipe_player=/);
  const registration = await s.request('POST', { action: 'register', name: 'Second Test', email: 'second@example.invalid' });
  assert.match(registration.headers['set-cookie'], /HttpOnly; SameSite=Strict; Max-Age=2592000; Secure/);
  const privateRead = await s.request('GET', undefined, p.cookie, { url: '/api/metrics?action=admin' });
  assert.equal(privateRead.statusCode, 401);
  const own = await s.request('GET', undefined, p.cookie, { url: '/api/metrics?action=session' });
  assert.equal(own.body.session.sessionId, p.sessionId);
  assert.equal(own.body.session.email, undefined);
  assert.match(own.headers['cache-control'], /no-store/);
  assert.equal(own.headers['access-control-allow-origin'], undefined);
});

test('custom mission origin registers players while sibling origins stay unauthorized', async () => {
  const s = setup();
  const body = { action: 'register', name: 'Domain Test', email: 'domain@example.invalid' };
  const response = await s.request('POST', body, undefined, { headers: { origin: 'https://nasa-missaoipe.alexandrebelo.com', 'sec-fetch-site': 'same-origin' } });
  assert.equal(response.statusCode, 201);
  assert.match(response.headers['set-cookie'], /HttpOnly; SameSite=Strict; Max-Age=2592000; Secure/);
  assert.equal((await s.request('POST', body, undefined, { headers: { origin: 'https://unrelated.alexandrebelo.com' } })).statusCode, 403);
});

test('same email in another browser does not grant an existing identity or history', async () => {
  const s = setup(), a = await s.register(), b = await s.register();
  assert.notEqual(a.sessionId, b.sessionId);
  const input = event('inspection', 'bennu', { target: 'evidence', eventId: 'exp-event-3' });
  await s.request('POST', { action: 'events', sessionId: b.sessionId, events: [input] }, b.cookie);
  const stored = [...s.data.values()].find(value => value.type === 'event');
  assert.equal(stored.sessionId, b.sessionId);
  assert.notEqual(stored.sessionId, a.sessionId);
  const injection = await s.request('POST', { action: 'events', sessionId: b.sessionId, events: [{ ...input, sessionId: a.sessionId }] }, b.cookie);
  assert.equal(injection.body.acceptedIds.length, 0);
});

test('old tab cannot assign its queued attempts to a newly registered player or log that player out', async () => {
  const s = setup(), a = await s.register('Player A', 'a@example.invalid'), b = await s.register('Player B', 'b@example.invalid');
  const input = attempt('cerrado', { ...DEFAULT_CONFIG }, 'long-contact');
  const wrongOwner = await s.request('POST', { action: 'events', sessionId: a.sessionId, events: [input] }, b.cookie);
  assert.equal(wrongOwner.statusCode, 409);
  assert.equal(wrongOwner.body.acceptedIds, undefined);
  assert.equal([...s.data.values()].filter(row => row.type === 'event').length, 0);
  const wrongLogout = await s.request('POST', { action: 'logout', sessionId: a.sessionId }, b.cookie);
  assert.equal(wrongLogout.statusCode, 409);
  assert.equal(wrongLogout.headers['set-cookie'], undefined);
  const missingOwner = await s.request('POST', { action: 'events', events: [input] }, b.cookie);
  assert.equal(missingOwner.statusCode, 400);
  const accepted = await s.request('POST', { action: 'events', sessionId: b.sessionId, events: [input] }, b.cookie);
  assert.deepEqual(accepted.body.acceptedIds, [input.id]);
  assert.equal([...s.data.values()].find(row => row.type === 'event').sessionId, b.sessionId);
  const ownLogout = await s.request('POST', { action: 'logout', sessionId: b.sessionId }, b.cookie);
  assert.equal(ownLogout.statusCode, 200);
  assert.match(ownLogout.headers['set-cookie'], /Max-Age=0/);
});

test('same-millisecond batch keeps first answer order independently of random UUID sorting', async () => {
  const s = setup(), p = await s.register();
  const first = event('assessment', 'bennu', { question: 'interpretation', answer: 'missing', questionVersion: 1 }, 'ffffffff-ffff-4fff-8fff-ffffffffffff');
  const second = event('assessment', 'bennu', { question: 'interpretation', answer: 'evidence', questionVersion: 1 }, '00000000-0000-4000-8000-000000000000');
  await s.request('POST', { action: 'events', sessionId: p.sessionId, events: [first, second] }, p.cookie);
  const saved = [...s.data.values()].filter(row => row.type === 'event');
  assert.equal(saved[0].receivedAt, saved[1].receivedAt);
  assert.equal(saved[0].batchId, saved[1].batchId);
  assert.deepEqual(saved.map(row => row.receivedOrder), [0, 1]);
  assert.deepEqual(saved.map(row => row.result.correct), [false, true]);
});

test('three mission scores are recalculated from exact existing engine configurations', async () => {
  const s = setup(), p = await s.register();
  const bennu = { ...baseExpedition, launch: 'compact', orbit: 'near', instrument: 'camera', ground: 'short' };
  const inputs = [attempt('cerrado', { ...DEFAULT_CONFIG }, 'long-contact'), attempt('bennu', bennu), attempt('telescope', baseExpedition)];
  const response = await s.request('POST', { action: 'events', sessionId: p.sessionId, events: inputs }, p.cookie);
  assert.deepEqual(response.body.acceptedIds, inputs.map(input => input.id));
  const stored = [...s.data.values()].filter(value => value.type === 'event');
  const results = [simulateMission(DEFAULT_CONFIG, 'long-contact'), simulateExpedition('bennu', bennu), simulateExpedition('telescope', baseExpedition)];
  stored.forEach((row, i) => {
    assert.deepEqual(row.result, summarizeResult(results[i], inputs[i].mission));
    assert.equal(row.result.diagnostics.some(item => item.code === 'MISSION_END'), false);
    assert.equal(row.receivedAt, new Date(NOW).toISOString());
    assert.equal(row.payload.config.injected, undefined);
  });
  assert.deepEqual(stored.map(row => row.result.validRecords), [6, 2, 6]);
});

test('forged scores, extra fields and invalid config do not get stored', async () => {
  const s = setup(), p = await s.register();
  const input = attempt('cerrado', { ...DEFAULT_CONFIG }, 'short-contact');
  const response = await s.request('POST', { action: 'events', sessionId: p.sessionId, events: [
    { ...input, result: { outcome: 'success', validRecords: 6 } },
    { ...input, id: randomUUID(), payload: { ...input.payload, score: 100 } },
    { ...input, id: randomUUID(), payload: { ...input.payload, config: { ...DEFAULT_CONFIG, battery: 'nuclear' } } },
  ] }, p.cookie);
  assert.equal(response.body.rejected.length, 3);
  assert.equal([...s.data.values()].filter(row => row.type === 'event').length, 0);
});

test('retry is idempotent, attempt ID is stable across event UUID retries, real repeated play is distinct', async () => {
  const s = setup(), p = await s.register();
  const one = attempt('cerrado', { ...DEFAULT_CONFIG }, 'short-contact');
  for (const input of [one, one, { ...one, id: randomUUID() }]) assert.equal((await s.request('POST', { action: 'events', sessionId: p.sessionId, events: [input] }, p.cookie)).body.acceptedIds.length, 1);
  const second = attempt('cerrado', { ...DEFAULT_CONFIG }, 'short-contact');
  await s.request('POST', { action: 'events', sessionId: p.sessionId, events: [second] }, p.cookie);
  assert.equal([...s.data.values()].filter(row => row.kind === 'attempt').length, 2);
  const changed = { ...one, payload: { ...one.payload, config: { ...DEFAULT_CONFIG, battery: 'large' } } };
  assert.equal((await s.request('POST', { action: 'events', sessionId: p.sessionId, events: [changed] }, p.cookie)).body.rejected.length, 1);
});

test('assessment correctness is computed from guided engines and interpretation key, not supplied score', () => {
  for (const [mission, expected] of [['cerrado', 'less'], ['bennu', 'more'], ['telescope', 'more']]) {
    const normalized = normalizeEvent(event('assessment', mission, { question: 'prediction', answer: expected, questionVersion: 1 }), randomUUID(), new Date(NOW).toISOString());
    assert.deepEqual(normalized.result, { correct: true, expected });
    const interpretation = normalizeEvent(event('assessment', mission, { question: 'interpretation', answer: 'missing', questionVersion: 1 }), randomUUID(), new Date(NOW).toISOString());
    assert.deepEqual(interpretation.result, { correct: false, expected: 'evidence' });
  }
});

test('Webb distinguishes six received packets from zero compatible scientific records', async () => {
  const s = setup(), p = await s.register();
  const input = attempt('telescope', { ...baseExpedition, instrument: 'camera' });
  const response = await s.request('POST', { action: 'events', sessionId: p.sessionId, events: [input] }, p.cookie);
  assert.deepEqual(response.body.acceptedIds, [input.id]);
  const stored = [...s.data.values()].find(row => row.type === 'event');
  assert.equal(stored.result.deliveredRecords, 6);
  assert.equal(stored.result.validRecords, 0);
  assert.notEqual(stored.result.outcome, 'success');
  assert.equal(stored.result.diagnostics.some(item => item.code === 'INSTRUMENT_MISMATCH'), true);
});

test('admin login is separate, paginated, secret-free and rejects forged or expired cookies', async () => {
  const s = setup(), p = await s.register();
  assert.equal((await s.request('POST', { action: 'admin-login', secret: 'wrong' })).statusCode, 401);
  await s.request('POST', { action: 'events', sessionId: p.sessionId, events: [attempt('telescope', baseExpedition), event('assessment', 'telescope', { question: 'interpretation', answer: 'evidence', questionVersion: 1 })] }, p.cookie);
  const login = await s.request('POST', { action: 'admin-login', secret: ADMIN });
  const cookie = login.headers['set-cookie'].split(';')[0];
  const page = await s.request('GET', undefined, cookie, { url: '/api/metrics?action=admin' });
  assert.equal(page.statusCode, 200); assert.equal(page.body.hasMore, true);
  const next = await s.request('GET', undefined, cookie, { url: `/api/metrics?action=admin&cursor=${page.body.cursor}` });
  assert.equal(next.body.hasMore, false);
  assert.equal(page.body.profiles[0].email, 'player@example.invalid');
  assert.equal(JSON.stringify(page.body).includes(SIGNING), false);
  assert.equal((await s.request('GET', undefined, cookie + 'a', { url: '/api/metrics?action=admin' })).statusCode, 401);
  s.advance(9 * 3600_000);
  assert.equal((await s.request('GET', undefined, cookie, { url: '/api/metrics?action=admin' })).statusCode, 401);
});

test('origin, body size, batch caps and missing owner fail closed', async () => {
  const s = setup();
  assert.equal((await s.request('POST', { action: 'register', name: 'Test User', email: 'test@example.invalid' }, undefined, { headers: { origin: 'https://evil.example' } })).statusCode, 403);
  assert.equal((await s.request('POST', { action: 'register', name: 'Test User', email: 'test@example.invalid' }, undefined, { headers: { origin: undefined } })).statusCode, 403);
  assert.equal((await s.request('POST', { action: 'events', sessionId: randomUUID(), events: [] })).statusCode, 401);
  assert.equal((await s.request('POST', { action: 'register', name: 'x'.repeat(40_000), email: 'test@example.invalid' })).statusCode, 413);
  const p = await s.register();
  assert.equal((await s.request('POST', { action: 'events', sessionId: p.sessionId, events: Array(21).fill({}) }, p.cookie)).statusCode, 400);
});

test('unavailable storage never returns a false acknowledgement and retries stay safe', async () => {
  const s = setup(), p = await s.register();
  const original = s.repository.putIfAbsent;
  s.repository.putIfAbsent = async () => { throw new StorageUnavailable('secret-token-must-not-leak'); };
  const input = attempt('bennu', { ...baseExpedition, instrument: 'camera' });
  const failed = await s.request('POST', { action: 'events', sessionId: p.sessionId, events: [input] }, p.cookie);
  assert.equal(failed.statusCode, 503); assert.equal(failed.body.acceptedIds, undefined);
  assert.equal(JSON.stringify(failed.body).includes('secret-token'), false);
  s.repository.putIfAbsent = original;
  assert.deepEqual((await s.request('POST', { action: 'events', sessionId: p.sessionId, events: [input] }, p.cookie)).body.acceptedIds, [input.id]);
});

test('Blob adapter requests private immutable storage, exact origin reads, and bounded pagination', async () => {
  const calls = [], path = `r21/records/${randomUUID()}/profile.json`, document = { type: 'profile', sessionId: randomUUID() };
  const repo = createBlobRepository({ storeId: 'store_abc123', getToken: async () => 'managed-test-oidc-token' }, async (url, options) => {
    calls.push({ url: String(url), ...options });
    if (options.method === 'PUT') return new Response('{}', { status: 200 });
    if (String(url).includes('/api/blob?')) return new Response(JSON.stringify({ blobs: [{ pathname: path, url: 'https://evil.example/steal' }], hasMore: false }));
    return new Response(JSON.stringify(document));
  });
  await repo.putIfAbsent(path, document); const page = await repo.list();
  assert.equal(calls[0].headers['x-vercel-blob-access'], 'private');
  assert.equal(calls[0].headers['x-allow-overwrite'], '0');
  assert.equal(calls[0].headers['x-ttl-days'], '90');
  assert.equal(calls[0].headers['x-api-version'], '13');
  assert.equal(calls.some(call => call.url.startsWith('https://evil.example')), false);
  assert.equal(calls[2].url, `https://abc123.private.blob.vercel-storage.com/${path}?cache=0`);
  assert.equal(calls.every(call => call.redirect === 'error'), true);
  assert.deepEqual(page.documents, [document]);
  await assert.rejects(() => repo.get('https://evil.example/secret'), StorageUnavailable);
});

test('Blob lost acknowledgement is recovered without overwrite on the next delivery', async () => {
  const path = `r21/records/${randomUUID()}/event-${randomUUID()}.json`, document = { id: randomUUID(), type: 'event' };
  let durable = null, writes = 0;
  const repo = createBlobRepository({ storeId: 'store_abc123', getToken: async () => 'managed-test-oidc-token' }, async (url, options) => {
    if (options.method === 'PUT') {
      writes++;
      if (!durable) { durable = JSON.parse(options.body); throw new TypeError('connection reset after commit'); }
      return new Response(JSON.stringify({ error: { code: 'bad_request', message: 'already exists' } }), { status: 400 });
    }
    return new Response(JSON.stringify(durable));
  });
  await assert.rejects(() => repo.putIfAbsent(path, document), StorageUnavailable);
  const retried = await repo.putIfAbsent(path, document);
  assert.deepEqual(retried, { created: false, document });
  assert.equal(writes, 2);
});

test('Blob storage denial is not mistaken for success or exposed as a service secret', async () => {
  const path = `r21/records/${randomUUID()}/profile.json`;
  const repo = createBlobRepository({ storeId: 'store_abc123', getToken: async () => 'managed-test-oidc-token' }, async () => new Response(JSON.stringify({ error: 'private-storage-token-in-message' }), { status: 403 }));
  await assert.rejects(() => repo.get(path), error => error instanceof StorageUnavailable && !error.message.includes('token'));
  await assert.rejects(() => repo.putIfAbsent(path, {}), StorageUnavailable);
  await assert.rejects(() => repo.list(), StorageUnavailable);
});

test('OIDC credentials rotate between calls and store prefix normalization preserves API casing', async () => {
  let current = 'first-managed-token'; const seen = [];
  const repo = createBlobRepository({ storeId: 'store_AbC123', getToken: async () => current }, async (url, options) => {
    seen.push({ url: String(url), headers: options.headers });
    return new Response('{}');
  });
  const path = `r21/records/${randomUUID()}/profile.json`;
  await repo.get(path); current = 'second-managed-token'; await repo.get(path);
  assert.deepEqual(seen.map(call => call.headers.authorization), ['Bearer first-managed-token', 'Bearer second-managed-token']);
  assert.equal(seen[0].headers['x-vercel-blob-store-id'], 'AbC123');
  assert.equal(seen[0].url.startsWith('https://abc123.private.blob.vercel-storage.com/'), true);
});

test('managed OIDC reader uses runtime context then fresh environment without caching', async () => {
  const key = Symbol.for('@vercel/request-context'), originalContext = globalThis[key];
  const originalEnv = process.env.VERCEL_OIDC_TOKEN, originalFile = process.env.VERCEL_OIDC_TOKEN_FILE;
  try {
    delete process.env.VERCEL_OIDC_TOKEN_FILE;
    process.env.VERCEL_OIDC_TOKEN = 'environment-token';
    let current = 'runtime-token-one';
    globalThis[key] = { get: () => ({ headers: { 'x-vercel-oidc-token': current } }) };
    assert.equal(await currentManagedOidcToken(), 'runtime-token-one');
    current = 'runtime-token-two'; assert.equal(await currentManagedOidcToken(), 'runtime-token-two');
    delete globalThis[key]; assert.equal(await currentManagedOidcToken(), 'environment-token');
    process.env.VERCEL_OIDC_TOKEN = 'rotated-environment-token'; assert.equal(await currentManagedOidcToken(), 'rotated-environment-token');
    delete process.env.VERCEL_OIDC_TOKEN; await assert.rejects(() => currentManagedOidcToken(), StorageUnavailable);
  } finally {
    if (originalContext === undefined) delete globalThis[key]; else globalThis[key] = originalContext;
    if (originalEnv === undefined) delete process.env.VERCEL_OIDC_TOKEN; else process.env.VERCEL_OIDC_TOKEN = originalEnv;
    if (originalFile === undefined) delete process.env.VERCEL_OIDC_TOKEN_FILE; else process.env.VERCEL_OIDC_TOKEN_FILE = originalFile;
  }
});
