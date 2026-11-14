import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import { DEFAULT_CONFIG } from '../src/core/catalog.ts';
import { simulateMission } from '../src/core/engine.ts';
import { createMissionStore, DraftConflictError, StorageIntegrityError } from '../src/persistence/store.ts';
import { canonicalJson } from '../src/persistence/json.ts';

const run = () => simulateMission({ ...DEFAULT_CONFIG }, 'long-contact');
function fixture() {
  const indexedDB = new IDBFactory();
  const databaseName = 'test-mission';
  return { indexedDB, databaseName, first: createMissionStore({ indexedDB, databaseName }), second: createMissionStore({ indexedDB, databaseName }) };
}
async function rawWrite(factory: IDBFactory, name: string, action: (store: globalThis.IDBObjectStore) => void): Promise<void> {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const open = factory.open(name);
    open.onsuccess = () => resolve(open.result);
    open.onerror = () => reject(open.error);
  });
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('runs', 'readwrite');
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error);
      action(tx.objectStore('runs'));
    });
  } finally { db.close(); }
}

test('simultaneous identical writes are idempotent across independent connections', async () => {
  const { first, second } = fixture();
  const result = run();
  const ids = await Promise.all([first.saveRun(result), second.saveRun(result), first.saveRun(result)]);
  assert.equal(new Set(ids).size, 1);
  assert.match(ids[0]!, /^run-[a-f0-9]{64}$/);
  const saved = await second.listRuns();
  assert.equal(saved.length, 1);
  assert.equal(canonicalJson(saved[0]!.result), canonicalJson(result));
  assert.match(saved[0]!.inputHash, /^[a-f0-9]{64}$/);
  assert.match(saved[0]!.resultHash, /^[a-f0-9]{64}$/);
  await second.saveRun(result);
  assert.equal((await first.listRuns())[0]!.createdAt, saved[0]!.createdAt);
  await first.deleteRun(ids[0]!);
  await second.deleteRun(ids[0]!);
  assert.deepEqual(await first.listRuns(), []);
});

test('a save snapshots its input before asynchronous hashes and opens', async () => {
  const { first } = fixture();
  const result = run();
  const original = canonicalJson(result);
  const pending = first.saveRun(result);
  result.config.battery = result.config.battery === 'small' ? 'large' : 'small';
  result.finalEnergyWh = 0;
  await pending;
  assert.equal(canonicalJson((await first.listRuns())[0]!.result), original);
});

test('a distinct result is retained as distinct evidence under the same input hash', async () => {
  const { first } = fixture();
  const original = run();
  const altered = structuredClone(original);
  altered.outcome = original.outcome === 'success' ? 'failure' : 'success';
  assert.notEqual(await first.saveRun(original), await first.saveRun(altered));
  const saved = await first.listRuns();
  assert.equal(saved.length, 2);
  assert.equal(saved[0]!.inputHash, saved[1]!.inputHash);
  assert.notEqual(saved[0]!.resultHash, saved[1]!.resultHash);
});

test('two tabs cannot both commit a draft at the same revision', async () => {
  const { first, second } = fixture();
  assert.equal(await first.loadDraft(), null);
  const candidates = await Promise.allSettled([
    first.saveDraft({ ...DEFAULT_CONFIG }, 'long-contact', 0),
    second.saveDraft({ ...DEFAULT_CONFIG, radio: 'fast' }, 'short-contact', 0),
  ]);
  assert.equal(candidates.filter(item => item.status === 'fulfilled').length, 1);
  const rejection = candidates.find(item => item.status === 'rejected');
  assert.ok(rejection && rejection.status === 'rejected');
  assert.ok(rejection.reason instanceof DraftConflictError);
  assert.equal(rejection.reason.expectedRevision, 0);
  assert.equal(rejection.reason.currentRevision, 1);
  const committed = await first.loadDraft();
  assert.equal(committed?.revision, 1);
  assert.deepEqual(await second.loadDraft(), committed);
  await assert.rejects(first.saveDraft({ ...DEFAULT_CONFIG }, 'short-contact', 0), DraftConflictError);
  assert.deepEqual(await second.loadDraft(), committed);
  assert.equal(await second.saveDraft({ ...DEFAULT_CONFIG }, 'short-contact', 1), 2);
  assert.equal((await first.loadDraft())?.revision, 2);
});

test('request success followed by transaction abort is rejected and rolled back', async () => {
  const { first } = fixture();
  await first.listRuns();
  const originalAdd = IDBObjectStore.prototype.add;
  let requestSucceeded = false;
  IDBObjectStore.prototype.add = function (value: unknown, key?: IDBValidKey) {
    const request = originalAdd.call(this, value, key);
    request.addEventListener('success', () => {
      requestSucceeded = true;
      this.transaction.abort();
    });
    return request;
  };
  try {
    await assert.rejects(first.saveRun(run()), { name: 'AbortError' });
    assert.equal(requestSucceeded, true, 'the request succeeded before the transaction failed');
  } finally { IDBObjectStore.prototype.add = originalAdd; }
  assert.deepEqual(await first.listRuns(), []);
});

test('quota failure is visible and preserves the previous committed draft', async () => {
  const { first, second } = fixture();
  await first.saveDraft({ ...DEFAULT_CONFIG }, 'long-contact', 0);
  const prior = await first.loadDraft();
  const originalPut = IDBObjectStore.prototype.put;
  IDBObjectStore.prototype.put = function () { throw new DOMException('Injected quota exhaustion', 'QuotaExceededError'); };
  try {
    await assert.rejects(second.saveDraft({ ...DEFAULT_CONFIG }, 'short-contact', 1), { name: 'QuotaExceededError' });
  } finally { IDBObjectStore.prototype.put = originalPut; }
  assert.deepEqual(await first.loadDraft(), prior);
});

test('an asynchronous request error aborts a write and reaches the caller', async () => {
  const { first } = fixture();
  const originalAdd = IDBObjectStore.prototype.add;
  IDBObjectStore.prototype.add = function (value: unknown, key?: IDBValidKey) {
    const firstRequest = originalAdd.call(this, value, key);
    originalAdd.call(this, value, key); // second request violates the real unique primary key
    return firstRequest;
  };
  try { await assert.rejects(first.saveRun(run()), { name: 'ConstraintError' }); }
  finally { IDBObjectStore.prototype.add = originalAdd; }
  assert.deepEqual(await first.listRuns(), []);
});

test('stored corruption is detected instead of silently deleting or trusting the run', async () => {
  const { first, indexedDB, databaseName } = fixture();
  await first.saveRun(run());
  const saved = (await first.listRuns())[0]!;
  saved.result.finalEnergyWh += 1;
  await rawWrite(indexedDB, databaseName, store => { store.put(saved); });
  await assert.rejects(first.listRuns(), StorageIntegrityError);
});

test('draft revision and domain validation rejects invalid writes without mutation', async () => {
  const { first } = fixture();
  for (const revision of [-1, 0.5, Number.MAX_SAFE_INTEGER, Infinity, NaN]) {
    await assert.rejects(first.saveDraft({ ...DEFAULT_CONFIG }, 'long-contact', revision), RangeError);
  }
  await assert.rejects(first.saveDraft({ ...DEFAULT_CONFIG, extra: 'x' } as never, 'long-contact', 0));
  assert.equal(await first.loadDraft(), null);
});
