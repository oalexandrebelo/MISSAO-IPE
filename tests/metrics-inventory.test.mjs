import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createMetricsHandler } from '../server/metrics/handler.mjs';
import { createBlobRepository, StorageUnavailable } from '../server/metrics/blob.mjs';
import { DEFAULT_BRUNO_CONFIG, BRUNO_INSTRUMENTS, simulateBrunoMission } from '../experiments/mission-design-lab/src/lab/bruno-missions.ts';

const ORIGIN = 'https://projeto-ipe.vercel.app';
const NOW = Date.parse('2026-11-15T19:00:00.000Z');
const ISS = { ...DEFAULT_BRUNO_CONFIG, protection: 'reinforced', energy: 'extended' };
const EUROPA = { ...ISS, launcher: 'heavy', navigation: 'deep-space' };

function setup() {
  const data = new Map(), versions = new Map();
  let loseCommit = false, failProjection = false;
  const repository = {
    async get(path) { return structuredClone(data.get(path) ?? null); },
    async getVersioned(path) { return data.has(path) ? { document: structuredClone(data.get(path)), etag: String(versions.get(path)) } : null; },
    async putIfAbsent(path, document) {
      if (failProjection && path.includes('/inventory-event-')) throw new StorageUnavailable('private-token');
      if (data.has(path)) return { created: false, document: structuredClone(data.get(path)) };
      data.set(path, structuredClone(document)); versions.set(path, 1);
      return { created: true, document: structuredClone(document) };
    },
    async compareAndSwap(path, document, etag) {
      if (String(versions.get(path)) !== etag) return false;
      const changed = document.revision > data.get(path).revision;
      data.set(path, structuredClone(document)); versions.set(path, versions.get(path) + 1);
      if (loseCommit && changed) { loseCommit = false; throw new StorageUnavailable('connection lost after commit'); }
      return true;
    },
    async list() { return { documents: [...data.entries()].filter(([path]) => path.startsWith('r21/records/')).map(([, document]) => structuredClone(document)), hasMore: false, cursor: null }; },
  };
  // Separate handlers stand in for independent functions sharing only durable storage.
  const handlers = [0, 1].map(() => createMetricsHandler({ repository, now: () => NOW, signingSecret: 'r27-test-signing-secret-over-32-bytes', adminSecret: 'r27-test-admin-secret-over-32-bytes' }));
  async function request(body, player, { method = 'POST', handler = 0, headers = {}, url = '/api/metrics' } = {}) {
    const req = { method, url, body, headers: { origin: ORIGIN, 'content-type': 'application/json', cookie: player?.cookie, ...headers }, socket: { remoteAddress: 'test' } };
    const res = { headers: {}, setHeader(key, value) { this.headers[key.toLowerCase()] = value; }, end(text) { this.body = JSON.parse(text); } };
    await handlers[handler](req, res); return res;
  }
  async function register() {
    const response = await request({ action: 'register', name: 'Synthetic Player', email: `${randomUUID()}@example.invalid` });
    assert.equal(response.statusCode, 201);
    return { ...response.body, cookie: response.headers['set-cookie'].split(';')[0] };
  }
  async function read(player) {
    const response = await request(undefined, player, { method: 'GET', url: `/api/metrics?action=inventory&sessionId=${player.sessionId}` });
    assert.equal(response.statusCode, 200, JSON.stringify(response.body)); return response.body.snapshot;
  }
  function post(player, snapshot, command, requestId = randomUUID(), options) {
    return request({ action: 'inventory-command', sessionId: player.sessionId, requestId, expectedRevision: snapshot.revision, command }, player, options);
  }
  async function run(player, snapshot, command) {
    const response = await post(player, snapshot, command);
    assert.equal(response.statusCode, 200, JSON.stringify(response.body)); return response.body;
  }
  async function ready(player, missionId = 'iss', config = ISS, instrumentIds = ['iss-air-quality']) {
    let snapshot = await read(player);
    snapshot = (await run(player, snapshot, { kind: 'buy', instrumentIds })).snapshot;
    return (await run(player, snapshot, { kind: 'equip', missionId, config, itemIds: snapshot.inventory.items.map(item => item.id) })).snapshot;
  }
  return { data, repository, request, register, read, post, run, ready,
    loseNextCommit() { loseCommit = true; }, setProjectionFailure(value) { failProjection = value; } };
}

test('inventory is private and rejects cross-session, cross-origin and client condition fields', async () => {
  const s = setup(), a = await s.register(), b = await s.register();
  assert.equal((await s.request(undefined, undefined, { method: 'GET', url: `/api/metrics?action=inventory&sessionId=${a.sessionId}` })).statusCode, 401);
  assert.equal((await s.request(undefined, b, { method: 'GET', url: `/api/metrics?action=inventory&sessionId=${a.sessionId}` })).statusCode, 409);
  const snapshot = await s.read(a);
  assert.equal(snapshot.inventory.balance, 25);
  const forged = await s.post(a, snapshot, { kind: 'buy', instrumentIds: ['iss-air-quality'], usesRemaining: 99 });
  assert.equal(forged.statusCode, 400);
  assert.equal((await s.post(a, snapshot, { kind: 'reset' }, randomUUID(), { headers: { origin: 'https://evil.invalid' } })).statusCode, 403);
  const cross = await s.request({ action: 'inventory-command', sessionId: a.sessionId, expectedRevision: 0, requestId: randomUUID(), command: { kind: 'reset' } }, b);
  assert.equal(cross.statusCode, 409);
  assert.equal((await s.read(a)).revision, 0);
});

test('purchase, return and reservation are durable and idempotent, including a lost acknowledgement', async () => {
  const s = setup(), p = await s.register(), initial = await s.read(p), requestId = randomUUID();
  s.loseNextCommit();
  const first = await s.post(p, initial, { kind: 'buy', instrumentIds: ['iss-air-quality'] }, requestId);
  assert.equal(first.statusCode, 503); assert.equal(JSON.stringify(first.body).includes('private-token'), false);
  const retry = await s.post(p, initial, { kind: 'buy', instrumentIds: ['iss-air-quality'] }, requestId);
  assert.equal(retry.statusCode, 200);
  assert.equal(retry.body.snapshot.inventory.items.length, 1);
  assert.equal(retry.body.snapshot.inventory.balance, 25 - BRUNO_INSTRUMENTS['iss-air-quality'].priceCredits);
  const duplicate = await s.post(p, initial, { kind: 'buy', instrumentIds: ['iss-air-quality'] }, requestId);
  assert.deepEqual(duplicate.body.receipt, retry.body.receipt);
  assert.equal((await s.post(p, initial, { kind: 'reset' }, requestId)).body.code, 'IDEMPOTENCY_CONFLICT');
  let snapshot = retry.body.snapshot;
  const itemId = snapshot.inventory.items[0].id;
  snapshot = (await s.run(p, snapshot, { kind: 'equip', missionId: 'iss', config: ISS, itemIds: [itemId] })).snapshot;
  assert.equal((await s.post(p, snapshot, { kind: 'return', itemId })).body.code, 'ITEM_RESERVED');
  assert.equal((await s.post(p, snapshot, { kind: 'equip', missionId: 'moon', config: ISS, itemIds: [itemId] })).body.code, 'ITEM_RESERVED');
  snapshot = (await s.run(p, snapshot, { kind: 'equip', missionId: 'iss', config: ISS, itemIds: [] })).snapshot;
  snapshot = (await s.run(p, snapshot, { kind: 'return', itemId })).snapshot;
  assert.equal(snapshot.inventory.balance, 25); assert.equal(snapshot.inventory.items.length, 0);
});

test('two independent functions cannot spend or reserve the same version twice', async () => {
  const s = setup(), p = await s.register(), snapshot = await s.read(p);
  const answers = await Promise.all([0, 1].map(handler => s.post(p, snapshot, { kind: 'buy', instrumentIds: ['iss-air-quality'] }, randomUUID(), { handler })));
  assert.deepEqual(answers.map(answer => answer.statusCode).sort(), [200, 409]);
  const current = await s.read(p);
  assert.equal(current.inventory.items.length, 1);
  const itemId = current.inventory.items[0].id;
  const reserved = await Promise.all(['iss', 'moon'].map((missionId, handler) => s.post(p, current, { kind: 'equip', missionId, config: ISS, itemIds: [itemId] }, randomUUID(), { handler })));
  assert.deepEqual(reserved.map(answer => answer.statusCode).sort(), [200, 409]);
  assert.equal(Object.values((await s.read(p)).inventory.reservations).flat().length, 1);
});

test('launch freezes authoritative condition, wears once, locks units and rewards only one completion', async () => {
  const s = setup(), p = await s.register(), ready = await s.ready(p), requestId = randomUUID();
  const launched = await s.post(p, ready, { kind: 'launch', missionId: 'iss', config: ISS }, requestId);
  assert.equal(launched.statusCode, 200, JSON.stringify(launched.body));
  const { attempt } = launched.body; let { snapshot } = launched.body;
  assert.equal(attempt.result.outcome, 'success');
  assert.deepEqual(attempt.result, simulateBrunoMission('iss', attempt.config));
  assert.equal(attempt.config.loadout[0].usesRemaining, ready.inventory.items[0].usesRemaining);
  assert.equal(snapshot.inventory.items[0].usesRemaining, ready.inventory.items[0].usesRemaining - 1);
  assert.equal(snapshot.inventory.balance, ready.inventory.balance - 2);
  const retry = await s.post(p, ready, { kind: 'launch', missionId: 'iss', config: ISS }, requestId);
  assert.deepEqual(retry.body.attempt, attempt);
  assert.equal(retry.body.snapshot.inventory.items[0].usesRemaining, snapshot.inventory.items[0].usesRemaining);
  assert.equal((await s.post(p, snapshot, { kind: 'equip', missionId: 'iss', config: ISS, itemIds: [] })).body.code, 'ACTIVE_FLIGHT');
  assert.equal((await s.post(p, snapshot, { kind: 'return', itemId: attempt.itemIds[0] })).body.code, 'ACTIVE_FLIGHT');
  assert.equal((await s.post(p, snapshot, { kind: 'reset' })).body.code, 'ACTIVE_FLIGHT');
  const finals = await Promise.all([0, 1].map(handler => s.post(p, snapshot, { kind: 'complete', attemptId: attempt.attemptId }, randomUUID(), { handler })));
  assert.deepEqual(finals.map(value => value.statusCode).sort(), [200, 409]);
  snapshot = await s.read(p);
  assert.equal(snapshot.inventory.balance, ready.inventory.balance - 2 + 8);
  assert.equal(snapshot.attempts[0].status, 'completed');
  const metric = snapshot.attempts[0].metricEvent;
  assert.equal(metric.payload.status, 'completed'); assert.equal(metric.result.score.total, attempt.result.score.total);
  assert.equal([...s.data.values()].filter(value => value.kind === 'attempt' && value.schemaVersion === 2).length, 1);
  assert.equal((await s.post(p, snapshot, { kind: 'complete', attemptId: attempt.attemptId })).body.code, 'ATTEMPT_FINALIZED');
});

test('parallel launch retries share one receipt; different launch IDs cannot consume twice', async () => {
  for (const sameId of [true, false]) {
    const s = setup(), p = await s.register(), ready = await s.ready(p), id = randomUUID();
    const answers = await Promise.all([0, 1].map(handler => s.post(p, ready, { kind: 'launch', missionId: 'iss', config: ISS }, sameId ? id : randomUUID(), { handler })));
    assert.deepEqual(answers.map(answer => answer.statusCode).sort(), sameId ? [200, 200] : [200, 409]);
    if (sameId) assert.deepEqual(answers[0].body.receipt, answers[1].body.receipt);
    const state = await s.read(p);
    assert.equal(state.attempts.length, 1);
    assert.equal(state.inventory.balance, ready.inventory.balance - 2);
    assert.equal(state.inventory.items[0].usesRemaining, ready.inventory.items[0].usesRemaining - 1);
  }
});

test('the last owned use is recorded as wear to zero and cannot be forged or borrowed across participants', async () => {
  const s = setup(), p = await s.register(); let snapshot = await s.ready(p);
  const itemId = snapshot.inventory.items[0].id;
  const initialUses = snapshot.inventory.items[0].usesRemaining;
  const forged = await s.post(p, snapshot, { kind: 'launch', missionId: 'iss', config: { ...ISS, modelVersion: 'ipe-bruno-r27-v2', loadout: [{ instrumentId: 'iss-air-quality', usesRemaining: 99 }] } });
  assert.equal(forged.statusCode, 400);
  for (let uses = initialUses; uses >= 1; uses--) {
    const flight = await s.run(p, snapshot, { kind: 'launch', missionId: 'iss', config: ISS });
    assert.equal(flight.attempt.config.loadout[0].usesRemaining, uses);
    const other = await s.register();
    assert.equal((await s.post(other, await s.read(other), { kind: 'complete', attemptId: flight.attempt.attemptId })).body.code, 'ATTEMPT_NOT_FOUND');
    snapshot = (await s.run(p, flight.snapshot, { kind: 'cancel', attemptId: flight.attempt.attemptId })).snapshot;
  }
  assert.equal(snapshot.inventory.items.length, 0);
  assert.equal(snapshot.inventory.reservations.iss, undefined);
  const wear = [...s.data.values()].filter(event => event.kind === 'inventory').flatMap(event => event.payload.wear);
  assert.deepEqual(wear.filter(entry => entry.itemId === itemId).map(entry => entry.after), [2, 1, 0]);
});

test('cancel never refunds wear or awards success; reset preserves attempts, receipts and identity', async () => {
  const s = setup(), p = await s.register(), ready = await s.ready(p);
  const launch = await s.run(p, ready, { kind: 'launch', missionId: 'iss', config: ISS });
  const cancel = await s.run(p, launch.snapshot, { kind: 'cancel', attemptId: launch.attempt.attemptId });
  assert.equal(cancel.snapshot.inventory.balance, ready.inventory.balance - 2);
  assert.equal(cancel.attempt.metricEvent.result, undefined);
  assert.equal(cancel.snapshot.inventory.items[0].usesRemaining, ready.inventory.items[0].usesRemaining - 1);
  let snapshot = (await s.run(p, cancel.snapshot, { kind: 'equip', missionId: 'iss', config: ISS, itemIds: [] })).snapshot;
  assert.equal((await s.post(p, snapshot, { kind: 'return', itemId: snapshot.inventory.items[0].id })).body.code, 'ITEM_USED');
  snapshot = (await s.run(p, snapshot, { kind: 'reset' })).snapshot;
  assert.equal(snapshot.inventory.balance, 25); assert.equal(snapshot.inventory.items.length, 0);
  assert.equal(snapshot.attempts.length, 1); assert.equal(snapshot.attempts[0].status, 'cancelled');
  const retry = await s.post(p, ready, { kind: 'launch', missionId: 'iss', config: ISS }, launch.receipt.requestId);
  assert.equal(retry.statusCode, 200); assert.equal(retry.body.snapshot.inventory.items.length, 0);
  assert.equal(retry.body.attempt.status, 'cancelled');
});

test('blocked T0 consumes no use or fee, while Europa is calculated with its owned instruments', async () => {
  const s = setup(), p = await s.register();
  let ready = await s.ready(p);
  const blocked = await s.run(p, ready, { kind: 'launch', missionId: 'mars', config: { ...ISS, launcher: 'compact' } });
  assert.equal(blocked.attempt.result.outcome, 'invalid');
  assert.deepEqual(blocked.snapshot.inventory.items, ready.inventory.items);
  assert.equal(blocked.snapshot.inventory.balance, ready.inventory.balance);
  const other = await s.register();
  ready = await s.ready(other, 'europa', EUROPA, ['europa-mise', 'europa-reason']);
  const europa = await s.run(other, ready, { kind: 'launch', missionId: 'europa', config: EUROPA });
  assert.equal(europa.attempt.result.outcome, 'success');
  assert.equal(europa.attempt.config.modelVersion, 'ipe-bruno-r27-v2');
  assert.equal(europa.attempt.config.loadout.length, 2);
});

test('projection failure is recoverable and legacy IDs cannot preempt authoritative receipts', async () => {
  const s = setup(), p = await s.register(), ready = await s.ready(p), requestId = randomUUID();
  const legacy = { id: requestId, kind: 'attempt', mission: 'iss', at: new Date(NOW).toISOString(), payload: { attemptId: requestId, status: 'completed', config: ISS } };
  const old = await s.request({ action: 'events', sessionId: p.sessionId, events: [legacy] }, p);
  assert.deepEqual(old.body.acceptedIds, [requestId]);
  assert.equal([...s.data.values()].find(value => value.id === requestId && value.kind === 'attempt').legacyInventory, true);
  assert.equal((await s.read(p)).inventory.balance, ready.inventory.balance);
  s.setProjectionFailure(true);
  const first = await s.post(p, ready, { kind: 'launch', missionId: 'iss', config: ISS }, requestId);
  assert.equal(first.statusCode, 503);
  s.setProjectionFailure(false);
  const retry = await s.post(p, ready, { kind: 'launch', missionId: 'iss', config: ISS }, requestId);
  assert.equal(retry.statusCode, 200);
  const completed = await s.run(p, retry.body.snapshot, { kind: 'complete', attemptId: requestId });
  assert.equal(completed.attempt.status, 'completed');
  assert.ok([...s.data.keys()].some(key => key.endsWith(`/inventory-attempt-${requestId}.json`)));
  const forged = { ...legacy, id: randomUUID(), payload: { ...legacy.payload, attemptId: randomUUID(), config: completed.attempt.config } };
  assert.equal((await s.request({ action: 'events', sessionId: p.sessionId, events: [forged] }, p)).body.rejected.length, 1);
});

test('private Blob CAS uses origin reads and storage preconditions, never overwrites on conflict', async () => {
  const calls = [], path = `r27/inventory/${randomUUID()}/state.json`;
  const repo = createBlobRepository({ storeId: 'store_Test123', getToken: async () => 'synthetic-oidc' }, async (url, options) => {
    calls.push({ url: String(url), options });
    return options.method === 'PUT' ? new Response('{}', { status: 412 }) : new Response('{"revision":2}', { headers: { etag: '"v2"' } });
  });
  const saved = await repo.getVersioned(path);
  assert.equal(saved.etag, '"v2"');
  assert.equal(await repo.compareAndSwap(path, { revision: 3 }, saved.etag), false);
  assert.match(calls[0].url, /private\.blob\.vercel-storage\.com\/r27\/inventory\/.*\?cache=0$/);
  assert.equal(calls[1].options.headers['x-if-match'], '"v2"');
  assert.equal(calls[1].options.headers['x-allow-overwrite'], '1');
  assert.equal(calls[1].options.headers['x-vercel-blob-access'], 'private');
  await assert.rejects(() => repo.compareAndSwap(`r21/records/${randomUUID()}/profile.json`, {}, '"v2"'), StorageUnavailable);
});
