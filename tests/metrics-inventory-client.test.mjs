import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readInventory, sendInventoryCommand, InventoryApiError } from '../experiments/mission-design-lab/src/metrics/inventory-client.ts';

const snapshot = { schemaVersion: 2, revision: 0, inventory: { version: 0, balance: 25, items: [], reservations: {} }, attempts: [] };

test('inventory client reads only the authenticated server snapshot without local fallback', async t => {
  const sessionId = randomUUID(), calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => { calls.push({ url, options }); return Response.json({ snapshot }); });
  assert.deepEqual(await readInventory(sessionId), snapshot);
  assert.equal(calls[0].url, `/api/metrics?action=inventory&sessionId=${sessionId}`);
  assert.equal(calls[0].options.credentials, 'same-origin'); assert.equal(calls[0].options.cache, 'no-store');
});

test('uncertain mutations are not automatically repeated and preserve their receipt identity', async t => {
  const request = { requestId: randomUUID(), expectedRevision: 0, command: { kind: 'reset' } };
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (_url, options) => { calls.push(JSON.parse(options.body)); throw new TypeError('connection lost'); });
  await assert.rejects(() => sendInventoryCommand(randomUUID(), request), error => error instanceof InventoryApiError && error.uncertain && error.status === 0);
  assert.equal(calls.length, 1); assert.equal(calls[0].requestId, request.requestId); assert.equal(calls[0].expectedRevision, 0);
});

test('a version conflict supplies the current snapshot and malformed receipts stay uncertain', async t => {
  const request = { requestId: randomUUID(), expectedRevision: 0, command: { kind: 'reset' } };
  const changed = { ...snapshot, revision: 1 };
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ error: 'Revisar', code: 'VERSION_CONFLICT', snapshot: changed }, { status: 409 }));
  await assert.rejects(() => sendInventoryCommand(randomUUID(), request), error => error instanceof InventoryApiError && !error.uncertain && error.snapshot.revision === 1);
  fetch.mock.mockImplementation(async () => Response.json({ snapshot: changed, receipt: { requestId: randomUUID(), revision: 1, operation: 'reset' } }));
  await assert.rejects(() => sendInventoryCommand(randomUUID(), request), error => error instanceof InventoryApiError && error.uncertain && error.code === 'INVALID_RECEIPT');
  fetch.mock.mockImplementation(async () => Response.json(null, { status: 503 }));
  await assert.rejects(() => sendInventoryCommand(randomUUID(), request), error => error instanceof InventoryApiError && error.uncertain && error.code === 'INVALID_RESPONSE');
});
