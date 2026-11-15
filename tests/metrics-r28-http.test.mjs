import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import { readFile, writeFile, rm, stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { createMetricsHandler } from '../server/metrics/handler.mjs';

async function verify(t, corruptScore = false) {
  const data = new Map(), versions = new Map();
  const repository = {
    async get(key) { return structuredClone(data.get(key) ?? null); },
    async getVersioned(key) { return data.has(key) ? { document: structuredClone(data.get(key)), etag: String(versions.get(key)) } : null; },
    async compareAndSwap(key, document, etag) {
      if (String(versions.get(key)) !== etag) return false;
      data.set(key, structuredClone(document)); versions.set(key, versions.get(key) + 1); return true;
    },
    async putIfAbsent(key, document) {
      if (data.has(key)) return { created: false, document: structuredClone(data.get(key)) };
      data.set(key, structuredClone(document)); versions.set(key, 1); return { created: true, document };
    },
    async list(cursor) {
      const offset = Number(cursor ?? 0), all = [...data.entries()].filter(([key]) => key.startsWith('r21/records/')).map(([, value]) => structuredClone(value));
      if (corruptScore) for (const row of all) {
        if (row.kind === 'attempt' && row.mission === 'cerrado' && row.result?.outcome === 'success') row.result.score.total = 100;
      }
      return { documents: all.slice(offset, offset + 5), hasMore: offset + 5 < all.length, cursor: offset + 5 < all.length ? String(offset + 5) : null };
    },
  };
  const adminSecret = 'r28-local-http-admin-secret-over-32-bytes';
  const handlers = [0, 1].map(() => createMetricsHandler({ repository, signingSecret: 'r28-local-http-signing-secret-over-32-bytes', adminSecret, development: true }));
  let request = 0;
  const server = createServer((req, res) => handlers[request++ % handlers.length](req, res));
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => { server.closeAllConnections(); server.close(); });
  const prefix = `/tmp/ipe-r28-http-${randomUUID()}`;
  const privatePath = `${prefix}-private.json`, evidencePath = `${prefix}-evidence.json`, secretPath = `${prefix}-admin.txt`;
  const files = [privatePath, evidencePath, secretPath, privatePath.replace(/\.json$/, '-inventory-r27.json'), evidencePath.replace(/\.json$/, '-inventory-r27.json')];
  t.after(() => Promise.all(files.map(path => rm(path, { force: true }))));
  await writeFile(secretPath, adminSecret, { mode: 0o600 });
  const args = ['--experimental-strip-types', fileURLToPath(new URL('../scripts/verify-r28-production.mjs', import.meta.url)),
    '--origin', `http://127.0.0.1:${server.address().port}`, '--private', privatePath, '--evidence', evidencePath, '--admin-secret-file', secretPath];
  let failed = false;
  try { await promisify(execFile)(process.execPath, args, { timeout: 60_000, maxBuffer: 64_000 }); }
  catch { failed = true; }
  const publicText = await readFile(evidencePath, 'utf8');
  assert.equal((await stat(privatePath)).mode & 0o777, 0o600);
  assert.equal(/(?:ipe_player=|ipe_metrics_admin=|@example\.invalid|[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12})/.test(publicText), false, 'Public evidence must not expose cookies, email or participant/event identifiers');
  assert.equal(publicText.includes(adminSecret), false);
  return { failed, evidence: JSON.parse(publicText) };
}

test('R28 runner verifies all seven missions, identity, three durability cycles and paginated persistence over HTTP', async t => {
  const { failed, evidence } = await verify(t);
  assert.equal(failed, false, evidence.failedCheck);
  assert.equal(evidence.status, 'passed');
  assert.equal(evidence.inventoryVerification.status, 'passed');
  assert.equal(evidence.missions.length, 7);
  assert.ok(evidence.admin.pages > 1);
  assert.deepEqual(evidence.durability.launchConditions, [3, 2, 1]);
  assert.equal(evidence.durability.remainingUnits, 0);
  assert.equal(evidence.admin.authoritativeAttempts, 9);
  assert.equal(evidence.admin.scienceEvents, 24);
  assert.equal(evidence.admin.inventoryEvents, 39);
  assert.equal(evidence.checks.includes('no_unexpected_records_from_rejected_events_or_retries'), true);
});

test('R28 runner rejects a persisted science score that differs from the engine', async t => {
  const { failed, evidence } = await verify(t, true);
  assert.equal(failed, true);
  assert.equal(evidence.status, 'failed');
  assert.equal(evidence.failedCheck, 'cerrado_repaired_recomputed_summary');
});
