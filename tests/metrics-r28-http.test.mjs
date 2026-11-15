import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import { readFileSync, renameSync, writeFileSync } from 'node:fs';
import { mkdtemp, readFile, writeFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { createMetricsHandler } from '../server/metrics/handler.mjs';

async function verify(t, corruptScore = false) {
  const directory = await mkdtemp(join(tmpdir(), 'ipe-http-storage-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const database = join(directory, 'records.json');
  const read = () => JSON.parse(readFileSync(database, 'utf8'));
  // Synchronous read/compare + atomic replace keeps the fixture CAS within one HTTP process.
  function write(data) {
    const next = database + '.new';
    writeFileSync(next, JSON.stringify(data), { mode: 0o600 });
    renameSync(next, database);
  }
  write({});
  const repository = () => ({
    async get(key) { return read()[key]?.document ?? null; },
    async getVersioned(key) { return read()[key] ?? null; },
    async compareAndSwap(key, document, etag) {
      const data = read();
      if (data[key]?.etag !== etag) return false;
      data[key] = { document, etag: String(Number(etag) + 1) };
      write(data);
      return true;
    },
    async putIfAbsent(key, document) {
      const data = read();
      if (data[key]) return { created: false, document: data[key].document };
      data[key] = { document, etag: '1' };
      write(data);
      return { created: true, document };
    },
    async list(cursor) {
      const offset = Number(cursor ?? 0), all = Object.entries(read()).filter(([key]) => key.startsWith('r21/records/')).map(([, value]) => value.document);
      if (corruptScore) for (const row of all) {
        if (row.kind === 'attempt' && row.mission === 'cerrado' && row.result?.outcome === 'success') row.result.score.total = 100;
      }
      return { documents: all.slice(offset, offset + 5), hasMore: offset + 5 < all.length, cursor: offset + 5 < all.length ? String(offset + 5) : null };
    },
  });
  const adminSecret = 'r28-local-http-admin-secret-over-32-bytes';
  async function start() {
    const handlers = [0, 1].map(() => createMetricsHandler({ repository: repository(), signingSecret: 'r28-local-http-signing-secret-over-32-bytes', adminSecret, development: true }));
    let requestIndex = 0;
    const server = createServer((req, res) => handlers[requestIndex++ % handlers.length](req, res));
    server.listen(0, '127.0.0.1'); await once(server, 'listening');
    return server;
  }
  const stop = server => new Promise(resolve => {
    server.close(resolve);
    server.closeAllConnections();
  });
  let server = await start();
  t.after(() => stop(server));
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
  if (!failed) {
    const { sessions: [player], adminCookie, requests } = JSON.parse(await readFile(privatePath, 'utf8'));
    const completion = requests.findLast(request => request.sessionId === player.sessionId && request.command.kind === 'complete');
    const { fingerprint, ...receipt } = read()[`r27/inventory/${player.sessionId}/state.json`].document.receipts[completion.requestId];
    async function api(action, cookie, query = {}, body) {
      const origin = `http://127.0.0.1:${server.address().port}`;
      const url = `${origin}/api/metrics?${new URLSearchParams({ action, ...query })}`;
      const response = await fetch(url, {
        method: body ? 'POST' : 'GET',
        headers: { origin, cookie, ...(body && { 'content-type': 'application/json' }) },
        ...(body && { body: JSON.stringify({ action, ...body }) }),
      });
      assert.equal(response.status, 200, action);
      return response.json();
    }
    async function checkpoint() {
      const { session } = await api('session', player.cookie);
      const { snapshot } = await api('inventory', player.cookie, { sessionId: player.sessionId });
      const events = [], seen = new Set();
      let cursor;
      do {
        assert.ok(!seen.has(cursor), 'The admin cursor must advance');
        seen.add(cursor);
        const page = await api('admin', adminCookie, cursor ? { cursor } : {});
        events.push(...page.events.filter(event => event.sessionId === player.sessionId));
        cursor = page.hasMore ? page.cursor : null;
      } while (cursor);
      return { session, snapshot, events };
    }
    const before = await checkpoint();
    assert.equal(before.session.sessionId, player.sessionId);
    assert.deepEqual([...new Set(before.events.filter(event => event.kind === 'attempt' && event.result?.outcome === 'success').map(event => event.mission))].sort(),
      ['bennu', 'cerrado', 'europa', 'iss', 'mars', 'moon', 'telescope']);
    await stop(server);
    server = await start();
    assert.deepEqual(await checkpoint(), before, 'A fresh HTTP server must recover the profile, inventory and exact scores from disk');
    const replay = await api('inventory-command', player.cookie, {}, completion);
    assert.deepEqual(replay.receipt, receipt);
    assert.deepEqual(replay.snapshot, before.snapshot);
    assert.deepEqual(await checkpoint(), before, 'Retrying after restart must not add a reward, wear or event');
  }
  return { failed, evidence: JSON.parse(publicText) };
}

test('R28 runner verifies seven missions and restores scores, inventory and receipts after restarting the disk-backed HTTP server', async t => {
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
