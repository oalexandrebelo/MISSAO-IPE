// Synthetic HTTP verification only; never records evidence of human learning.
// Run: node --experimental-strip-types scripts/verify-metrics-r21.mjs <origin> [receipt.json]
// Before cleanup, inspect provider retention with: ... --retention <receipt.json>
import { readFile, writeFile } from 'node:fs/promises';
import { randomUUID, createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { DEFAULT_CONFIG } from '../experiments/mission-design-lab/src/core/catalog.ts';
import { simulateMission } from '../experiments/mission-design-lab/src/core/engine.ts';
import { simulateExpedition } from '../experiments/mission-design-lab/src/lab/scientific-expeditions.ts';
import { summarizeResult } from '../server/metrics/model.mjs';
import { currentManagedOidcToken } from '../server/metrics/blob.mjs';

const ORIGINS = new Set(['https://projeto-ipe.vercel.app', 'https://missao-ipe-alexandrebelo.vercel.app', 'https://missao-ipe-git-main-alexandrebelo.vercel.app']);
const STORE = 'Uweg6c1o54WMNryh';
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
const fixtures = [
  { mission: 'cerrado', config: { ...DEFAULT_CONFIG }, scenarioId: 'long-contact' },
  { mission: 'bennu', config: { launch: 'compact', orbit: 'near', duration: 'full', instrument: 'camera', power: 'extended', ground: 'short' } },
  { mission: 'telescope', config: { launch: 'science', orbit: 'far', duration: 'full', instrument: 'spectrometer', power: 'extended', ground: 'extended' } },
];
const expectedResults = fixtures.map(row => summarizeResult(row.mission === 'cerrado' ? simulateMission(row.config, row.scenarioId) : simulateExpedition(row.mission, row.config), row.mission));
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
class CheckFailed extends Error { constructor(code) { super(code); } }
function requireCheck(value, code) { if (!value) throw new CheckFailed(code); }
async function save(path, receipt) { await writeFile(path, JSON.stringify(receipt, null, 2) + '\n', { mode: 0o600 }); }

async function verifyRetention(path) {
  const receipt = JSON.parse(await readFile(path, 'utf8'));
  requireCheck(receipt.synthetic === true && UUID.test(receipt.sessionId) && receipt.cleanupPaths?.length === 4, 'invalid_receipt');
  const prefix = `r21/records/${receipt.sessionId}/`;
  requireCheck(new Set(receipt.cleanupPaths).size === 4 && receipt.cleanupPaths.every(item => item === `${prefix}profile.json` || (item.startsWith(prefix) && /^attempt-[a-f0-9-]{36}\.json$/.test(item.slice(prefix.length)))), 'invalid_cleanup_scope');
  const result = [];
  for (const pathname of receipt.cleanupPaths) {
    // OIDC only. No fallback to a static Blob read-write token.
    const token = await currentManagedOidcToken();
    const response = await fetch(`https://vercel.com/api/blob?${new URLSearchParams({ url: pathname })}`, {
      redirect: 'error', signal: AbortSignal.timeout(30_000),
      headers: { authorization: `Bearer ${token}`, 'x-api-version': '13', 'x-vercel-blob-store-id': STORE },
    });
    requireCheck(response.ok, 'provider_metadata_unavailable');
    const data = await response.json();
    const ttlDays = (Date.parse(data.expiresAt) - Date.parse(data.uploadedAt)) / 86400_000;
    // Blob evaluates expiration daily at UTC midnight: a 90-day TTL can span 90–91 days.
    requireCheck(data.pathname === pathname && Number.isFinite(ttlDays) && ttlDays >= 90 - 0.01 && ttlDays <= 91 + 0.01, 'provider_retention_not_90_day_policy');
    result.push({ pathname, uploadedAt: data.uploadedAt, expiresAt: data.expiresAt, ttlDays });
  }
  receipt.retention = { status: 'verified_provider_metadata', checkedAt: new Date().toISOString(), records: result };
  await save(path, receipt);
  console.log(JSON.stringify({ status: 'passed', check: 'provider_retention_90_days', records: result.length, receipt: path }));
}

async function smoke(origin, receiptPath) {
  const receipt = { schemaVersion: 1, synthetic: true, evidenceType: 'production-http-engineering-smoke', humanLearningEvidence: false, startedAt: new Date().toISOString(), origin, status: 'running', checks: [], cleanupPaths: [], retention: { status: 'not_verified', requestedDays: 90, note: 'Application expiresAt and the PUT request are not proof of provider TTL. Run --retention before cleanup.' } };
  let playerCookie, adminCookie, sessionId;
  const check = (value, code) => { requireCheck(value, code); receipt.checks.push(code); };
  async function api(action, body, cookie) {
    const url = new URL('/api/metrics', origin);
    if (!body) url.searchParams.set('action', action);
    const response = await fetch(url, { method: body ? 'POST' : 'GET', redirect: 'error', signal: AbortSignal.timeout(30_000), headers: { 'content-type': 'application/json', origin, ...(cookie ? { cookie } : {}) }, ...(body ? { body: JSON.stringify({ action, ...body }) } : {}) });
    const data = await response.json();
    check(/no-store/.test(response.headers.get('cache-control') ?? ''), `${action}_no_store`);
    return { response, data };
  }
  function captureCookie(response, name) {
    const header = response.headers.getSetCookie().find(item => item.startsWith(`${name}=`));
    requireCheck(header && /; HttpOnly(?:;|$)/i.test(header) && /; Secure(?:;|$)/i.test(header) && /; SameSite=Strict(?:;|$)/i.test(header) && /; Path=\/api\/metrics(?:;|$)/i.test(header), `${name}_cookie_flags`);
    receipt.checks.push(`${name}_cookie_flags`);
    return header.split(';')[0];
  }
  try {
    requireCheck(ORIGINS.has(origin), 'origin_not_allowlisted');
    let adminSecret = (await readFile('/tmp/ipe-r21-admin.txt', 'utf8')).trim();
    requireCheck(adminSecret.length >= 32 && adminSecret.length <= 512, 'admin_secret_file_invalid');
    await save(receiptPath, receipt);
    const denied = await api('admin');
    check(denied.response.status === 401, 'anonymous_admin_denied');
    const login = await api('admin-login', { secret: adminSecret });
    adminSecret = undefined;
    check(login.response.status === 200, 'admin_login');
    adminCookie = captureCookie(login.response, 'ipe_metrics_admin');
    const storageRead = await api('admin', undefined, adminCookie);
    check(storageRead.response.status === 200 && Array.isArray(storageRead.data.profiles) && Array.isArray(storageRead.data.events), 'private_storage_read_before_any_registration');
    const registration = await api('register', { name: 'Teste automatizado R21', email: `qa-r21-${randomUUID()}@example.invalid` });
    check(registration.response.status === 201 && UUID.test(registration.data.sessionId), 'synthetic_registration');
    sessionId = registration.data.sessionId;
    receipt.sessionId = sessionId;
    receipt.cleanupPaths = [`r21/records/${sessionId}/profile.json`];
    await save(receiptPath, receipt);
    playerCookie = captureCookie(registration.response, 'ipe_player');
    const own = await api('session', undefined, playerCookie);
    check(own.data.session?.sessionId === sessionId && own.data.session?.email === undefined, 'session_has_no_email');
    const playerDenied = await api('admin', undefined, playerCookie);
    check(playerDenied.response.status === 401, 'player_cannot_read_team_panel');
    const events = fixtures.map(row => ({ id: randomUUID(), kind: 'attempt', mission: row.mission, at: new Date().toISOString(), payload: { attemptId: randomUUID(), status: 'completed', config: row.config, ...(row.scenarioId ? { scenarioId: row.scenarioId } : {}) } }));
    receipt.cleanupPaths.push(...events.map(row => `r21/records/${sessionId}/attempt-${row.payload.attemptId}.json`));
    // Record exact cleanup scope before the first event write, including a partial failure.
    await save(receiptPath, receipt);
    for (const [label, batch] of [['three_attempts_accepted', events], ['same_event_retry_accepted', events], ['same_attempt_new_event_id_accepted', [{ ...events[0], id: randomUUID() }]]]) {
      const sent = await api('events', { sessionId, events: batch }, playerCookie);
      check(sent.response.status === 200 && isDeepStrictEqual(sent.data.acceptedIds, batch.map(row => row.id)) && sent.data.rejected?.length === 0, label);
    }
    const badOwner = await api('events', { sessionId: randomUUID(), events: [events[0]] }, playerCookie);
    check(badOwner.response.status === 409 && !badOwner.data.acceptedIds, 'cross_tab_owner_mismatch_denied');
    const ownEvents = new Map(), ownProfiles = new Map(), cursors = new Set();
    let cursor, pages = 0;
    do {
      const url = new URL('/api/metrics', origin);
      url.searchParams.set('action', 'admin');
      if (cursor) url.searchParams.set('cursor', cursor);
      const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(30_000), headers: { cookie: adminCookie } });
      requireCheck(response.status === 200 && /no-store/.test(response.headers.get('cache-control') ?? ''), 'admin_page_unavailable');
      const page = await response.json();
      requireCheck(Array.isArray(page.profiles) && Array.isArray(page.events) && typeof page.hasMore === 'boolean', 'admin_page_schema');
      for (const row of page.profiles) if (row.sessionId === sessionId) ownProfiles.set(row.sessionId, row);
      for (const row of page.events) if (row.sessionId === sessionId) ownEvents.set(row.payload?.attemptId ?? row.id, row);
      // Other players' data are never copied to the receipt or console.
      cursor = page.hasMore ? page.cursor : null;
      requireCheck(!cursor || (typeof cursor === 'string' && !cursors.has(cursor)), 'admin_cursor_repeated');
      if (cursor) cursors.add(cursor);
      requireCheck(++pages < 100 || !cursor, 'admin_pagination_limit_not_complete');
    } while (cursor);
    check(ownProfiles.size === 1 && ownEvents.size === 3, 'exactly_one_profile_three_attempts_after_retries');
    receipt.adminPagesVisited = pages;
    receipt.attempts = events.map((event, index) => {
      const stored = ownEvents.get(event.payload.attemptId);
      check(stored?.id === event.id && stored?.mission === event.mission && isDeepStrictEqual(stored?.result, expectedResults[index]), `${event.mission}_server_recomputation_exact`);
      return { mission: event.mission, attemptId: event.payload.attemptId, eventId: event.id, configSha256: digest(event.payload.config), summary: stored.result };
    });
    check(isDeepStrictEqual(receipt.attempts.map(row => row.summary.validRecords), [6, 2, 6]), 'scientific_records_6_2_6');
    const profile = ownProfiles.get(sessionId);
    check(Math.abs(Date.parse(profile.expiresAt) - Date.parse(profile.startedAt) - 90 * 86400_000) < 1000, 'application_expiry_declared_90_days');
    receipt.status = 'passed';
  } catch (error) {
    receipt.status = 'failed';
    receipt.failure = error instanceof CheckFailed ? error.message : 'request_or_local_io_failed';
    process.exitCode = 1;
  } finally {
    // Logout clears these test-browser cookies; deletion remains a separate scoped operation.
    if (playerCookie && sessionId) try { const response = await api('logout', { sessionId }, playerCookie); requireCheck(response.response.status === 200, 'player_logout'); } catch { receipt.logoutIncomplete = true; }
    if (adminCookie) try { const response = await api('admin-logout', {}, adminCookie); requireCheck(response.response.status === 200, 'admin_logout'); } catch { receipt.logoutIncomplete = true; }
    receipt.completedAt = new Date().toISOString();
    await save(receiptPath, receipt);
    console.log(JSON.stringify({ status: receipt.status, checks: receipt.checks.length, createdObjectPaths: receipt.cleanupPaths.length, receipt: receiptPath, ...(receipt.failure ? { failure: receipt.failure } : {}) }));
  }
}

const [argument, pathArgument] = process.argv.slice(2);
try {
  if (argument === '--dry-run') {
    requireCheck(isDeepStrictEqual(expectedResults.map(row => row.validRecords), [6, 2, 6]), 'fixtures_changed');
    console.log(JSON.stringify({ status: 'passed', networkRequests: 0, fixtures: fixtures.map((row, index) => ({ mission: row.mission, outcome: expectedResults[index].outcome, validRecords: expectedResults[index].validRecords })) }));
  } else if (argument === '--retention') {
    requireCheck(Boolean(pathArgument), 'receipt_path_required');
    await verifyRetention(pathArgument);
  } else {
    requireCheck(ORIGINS.has(argument), 'usage_requires_allowlisted_origin');
    await smoke(argument, pathArgument ?? '/tmp/ipe-r21-metrics-smoke.json');
  }
} catch (error) {
  console.error(JSON.stringify({ status: 'failed', failure: error instanceof CheckFailed ? error.message : 'request_or_local_io_failed' }));
  process.exitCode = 1;
}
