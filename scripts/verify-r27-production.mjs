// Synthetic accounts only. Never deletes or updates an existing participant.
// Local: node --experimental-strip-types scripts/verify-r27-production.mjs --origin http://127.0.0.1:4197 --admin-secret-file /tmp/ipe-r27-local-admin.txt
// Live: add --production, use the canonical HTTPS origin and /tmp/ipe-r21-admin.txt.
import { readFile, writeFile, chmod } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { DEFAULT_BRUNO_CONFIG, simulateBrunoMission } from '../experiments/mission-design-lab/src/lab/bruno-missions.ts';

const args = process.argv.slice(2), options = {};
for (let index = 0; index < args.length; index++) {
  const key = args[index];
  if (key === '--production') options.production = true;
  else if (['--origin', '--private', '--evidence', '--admin-secret-file'].includes(key) && args[index + 1]) options[key.slice(2)] = args[++index];
  else throw new Error('Invalid runner arguments.');
}
const origin = new URL(options.origin ?? 'http://127.0.0.1:4197').origin;
const target = new URL(origin);
const local = target.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(target.hostname);
if (!local && (!options.production || target.protocol !== 'https:' || !['nasa-missaoipe.alexandrebelo.com', 'projeto-ipe.vercel.app', 'missao-ipe-alexandrebelo.vercel.app', 'missao-ipe-git-main-alexandrebelo.vercel.app'].includes(target.hostname))) throw new Error('Use an explicitly authorized canonical origin with --production.');
const privatePath = options.private ?? '/tmp/ipe-r27-production-private.json';
const evidencePath = options.evidence ?? '/tmp/ipe-r27-production-evidence.json';
if (!/^\/(?:private\/)?tmp\/[^/]+\.json$/.test(privatePath)) throw new Error('Private receipts must stay in /tmp as a JSON file.');
const privateReceipt = { synthetic: true, startedAt: new Date().toISOString(), origin, sessions: [], requests: [], cleanupPaths: [] };
const evidence = { schemaVersion: 2, synthetic: true, humanLearningEvidence: false, environment: local ? 'local-memory-HTTP' : 'production-private-Blob-HTTP', origin, startedAt: privateReceipt.startedAt, status: 'running', checks: [], missions: [], requests: 0 };
let saving = Promise.resolve();
function save() {
  const privateText = JSON.stringify(privateReceipt, null, 2) + '\n';
  const publicText = JSON.stringify(evidence, null, 2) + '\n';
  saving = saving.then(async () => {
    await chmod(privatePath, 0o600).catch(error => { if (error.code !== 'ENOENT') throw error; });
    await writeFile(privatePath, privateText, { mode: 0o600 });
    await writeFile(evidencePath, publicText);
  });
  return saving;
}
function check(value, code) { if (!value) throw new Error(code); evidence.checks.push(code); }
function cookie(response, name) {
  const header = response.headers.getSetCookie().find(value => value.startsWith(`${name}=`));
  check(header && /HttpOnly/.test(header) && /SameSite=Strict/.test(header) && (local || /Secure/.test(header)), `${name}_flags`);
  return header.split(';')[0];
}
async function api(action, body, auth, query = {}) {
  const url = new URL('/api/metrics', origin);
  if (!body) { url.searchParams.set('action', action); for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value); }
  const response = await fetch(url, { method: body ? 'POST' : 'GET', redirect: 'error', signal: AbortSignal.timeout(45_000),
    headers: { 'content-type': 'application/json', origin, ...(auth ? { cookie: auth } : {}) },
    ...(body ? { body: JSON.stringify({ action, ...body }) } : {}) });
  evidence.requests++;
  check(/no-store/.test(response.headers.get('cache-control') ?? ''), 'no_store');
  let value; try { value = await response.json(); } catch { throw new Error('non_json_response'); }
  return { response, value };
}
const expectedLedger = new Set(), expectedAttempts = new Set();
let player, snapshot;
async function command(kind, fields = {}, supplied) {
  const body = supplied ?? { sessionId: player.sessionId, requestId: randomUUID(), expectedRevision: snapshot.revision, command: { kind, ...fields } };
  privateReceipt.requests.push(body); await save();
  const result = await api('inventory-command', body, player.cookie);
  if (result.response.ok) {
    snapshot = result.value.snapshot;
    expectedLedger.add(result.value.receipt.eventId);
    privateReceipt.cleanupPaths.push(`r21/records/${player.sessionId}/inventory-event-${result.value.receipt.eventId}.json`);
    if (result.value.attempt?.metricEvent) {
      expectedAttempts.add(result.value.attempt.attemptId);
      privateReceipt.cleanupPaths.push(`r21/records/${player.sessionId}/inventory-attempt-${result.value.attempt.attemptId}.json`);
    }
  }
  return { ...result, body };
}
async function successful(kind, fields = {}) {
  const result = await command(kind, fields);
  check(result.response.status === 200, `${kind}_confirmed`); return result;
}
async function register() {
  const response = await api('register', { name: 'Teste sintético R27', email: `r27-${randomUUID()}@example.invalid` });
  check(response.response.status === 201, 'synthetic_registration');
  const session = { sessionId: response.value.sessionId, cookie: cookie(response.response, 'ipe_player') };
  privateReceipt.sessions.push(session);
  privateReceipt.cleanupPaths.push(`r21/records/${session.sessionId}/profile.json`, `r27/inventory/${session.sessionId}/state.json`);
  await save(); return session;
}
const flightConfig = { ...DEFAULT_BRUNO_CONFIG, launcher: 'heavy', energy: 'extended', protection: 'reinforced', navigation: 'deep-space' };
const fixtures = [
  { missionId: 'iss', config: { ...DEFAULT_BRUNO_CONFIG, energy: 'extended', protection: 'reinforced' }, instrumentIds: ['iss-air-quality'] },
  { missionId: 'moon', config: { ...flightConfig, protection: 'light' }, instrumentIds: ['lunar-neutron', 'lunar-diviner'] },
  { missionId: 'mars', config: flightConfig, instrumentIds: ['mars-meda'] },
  { missionId: 'europa', config: flightConfig, instrumentIds: ['europa-mise', 'europa-reason'] },
];
try {
  await save();
  check((await api('admin')).response.status === 401, 'anonymous_admin_denied');
  let secret = (await readFile(options['admin-secret-file'] ?? '/tmp/ipe-r21-admin.txt', 'utf8')).trim();
  check(secret.length >= 32, 'admin_secret_available');
  const admin = await api('admin-login', { secret }); secret = undefined;
  check(admin.response.status === 200, 'admin_login');
  privateReceipt.adminCookie = cookie(admin.response, 'ipe_metrics_admin');
  player = await register();
  snapshot = (await api('inventory', undefined, player.cookie, { sessionId: player.sessionId })).value.snapshot;
  check(snapshot?.revision === 0 && snapshot.inventory.balance === 25, 'initial_server_inventory');
  const other = await register();
  check((await api('inventory', undefined, other.cookie, { sessionId: player.sessionId })).response.status === 409, 'cross_session_read_denied');
  check((await api('inventory', undefined, undefined, { sessionId: player.sessionId })).response.status === 401, 'anonymous_inventory_denied');
  check((await api('admin', undefined, player.cookie)).response.status === 401, 'player_admin_denied');

  const baseRevision = snapshot.revision;
  const raced = [0, 1].map(() => ({ sessionId: player.sessionId, requestId: randomUUID(), expectedRevision: baseRevision, command: { kind: 'buy', instrumentIds: ['iss-air-quality'] } }));
  const results = await Promise.all(raced.map(body => command('buy', {}, body)));
  check(isDeepStrictEqual(results.map(result => result.response.status).sort(), [200, 409]), 'concurrent_purchase_single_commit');
  const winner = results.find(result => result.response.status === 200);
  const originalReceipt = winner.value.receipt;
  const retry = await command('buy', {}, winner.body);
  check(retry.response.status === 200 && isDeepStrictEqual(retry.value.receipt, originalReceipt), 'exact_retry_same_receipt');
  check(snapshot.inventory.items.length === 1 && snapshot.inventory.balance === 20, 'concurrent_purchase_single_debit');
  const reused = await command('reset', {}, { ...winner.body, command: { kind: 'reset' } });
  check(reused.response.status === 409 && reused.value.code === 'IDEMPOTENCY_CONFLICT', 'request_id_reuse_denied');
  await successful('return', { itemId: snapshot.inventory.items[0].id });
  check(snapshot.inventory.balance === 25 && !snapshot.inventory.items.length, 'fresh_return_full_refund');

  for (const fixture of fixtures) {
    await successful('reset');
    await successful('buy', { instrumentIds: fixture.instrumentIds });
    await successful('equip', { missionId: fixture.missionId, config: fixture.config, itemIds: snapshot.inventory.items.map(item => item.id) });
    const before = snapshot;
    const forged = await command('launch', {}, { sessionId: player.sessionId, requestId: randomUUID(), expectedRevision: snapshot.revision,
      command: { kind: 'launch', missionId: fixture.missionId, config: { ...fixture.config, modelVersion: 'ipe-bruno-r27-v2', loadout: [{ instrumentId: fixture.instrumentIds[0], usesRemaining: 99 }] } } });
    check(forged.response.status === 400, 'forged_condition_denied');
    const launch = await successful('launch', { missionId: fixture.missionId, config: fixture.config });
    const attempt = launch.value.attempt;
    check(attempt.result.outcome === 'success' && attempt.config.modelVersion === 'ipe-bruno-r27-v2', `${fixture.missionId}_v2_success`);
    check(isDeepStrictEqual(attempt.result, simulateBrunoMission(fixture.missionId, attempt.config)), `${fixture.missionId}_server_matches_engine`);
    check(snapshot.inventory.balance === before.inventory.balance - 2, 'launch_fee_without_reward');
    check(snapshot.inventory.items.every(item => item.usesRemaining === before.inventory.items.find(previous => previous.id === item.id).usesRemaining - 1), 'launch_wear_exactly_once');
    const repeated = await command('launch', {}, launch.body);
    check(repeated.response.status === 200 && isDeepStrictEqual(repeated.value.attempt, attempt), 'launch_retry_same_snapshot');
    const occupied = await command('reset');
    check(occupied.response.status === 409 && occupied.value.code === 'ACTIVE_FLIGHT', 'active_reset_denied');
    const forgedScore = await command('complete', {}, { sessionId: player.sessionId, requestId: randomUUID(), expectedRevision: snapshot.revision, command: { kind: 'complete', attemptId: attempt.attemptId, score: 100 } });
    check(forgedScore.response.status === 400, 'forged_score_denied');
    const completed = await successful('complete', { attemptId: attempt.attemptId });
    check(snapshot.inventory.balance === before.inventory.balance - 2 + 8, 'success_reward_only_on_complete');
    check(completed.value.attempt.metricEvent?.result?.score?.total === attempt.result.score.total, 'authoritative_metric_score');
    const repeatFinish = await command('complete', {}, completed.body);
    check(repeatFinish.response.status === 200 && isDeepStrictEqual(repeatFinish.value.attempt.metricEvent, completed.value.attempt.metricEvent), 'completed_retry_single_metric');
    check((await command('complete', { attemptId: attempt.attemptId })).value.code === 'ATTEMPT_FINALIZED', 'second_complete_denied');
    evidence.missions.push({ mission: fixture.missionId, modelVersion: attempt.result.modelVersion, outcome: attempt.result.outcome, score: attempt.result.score.total });
  }

  await successful('reset');
  await successful('buy', { instrumentIds: ['iss-air-quality'] });
  await successful('equip', { missionId: 'iss', config: fixtures[0].config, itemIds: snapshot.inventory.items.map(item => item.id) });
  const beforeCancel = snapshot;
  const cancellable = await successful('launch', { missionId: 'iss', config: fixtures[0].config });
  const cancelled = await successful('cancel', { attemptId: cancellable.value.attempt.attemptId });
  check(snapshot.inventory.balance === beforeCancel.inventory.balance - 2 && !cancelled.value.attempt.metricEvent.result, 'cancel_without_refund_or_reward');
  check(snapshot.inventory.items[0].usesRemaining === beforeCancel.inventory.items[0].usesRemaining - 1, 'cancel_keeps_wear');
  await successful('equip', { missionId: 'iss', config: fixtures[0].config, itemIds: [] });
  check((await command('return', { itemId: snapshot.inventory.items[0].id })).value.code === 'ITEM_USED', 'used_return_denied');
  const blockedBefore = snapshot;
  const blocked = await successful('launch', { missionId: 'mars', config: DEFAULT_BRUNO_CONFIG });
  check(blocked.value.attempt.result.outcome === 'invalid' && snapshot.inventory.balance === blockedBefore.inventory.balance && isDeepStrictEqual(snapshot.inventory.items, blockedBefore.inventory.items), 't0_block_without_fee_or_wear');
  await successful('complete', { attemptId: blocked.value.attempt.attemptId });
  const historicalCount = snapshot.attempts.length;
  await successful('reset');
  check(snapshot.inventory.balance === 25 && !snapshot.inventory.items.length && snapshot.attempts.length === historicalCount, 'reset_preserves_attempt_history');

  const legacy = { id: randomUUID(), kind: 'attempt', mission: 'iss', at: new Date().toISOString(), payload: { attemptId: randomUUID(), status: 'completed', config: { ...DEFAULT_BRUNO_CONFIG, protection: 'reinforced' } } };
  privateReceipt.legacy = legacy; privateReceipt.cleanupPaths.push(`r21/records/${player.sessionId}/attempt-${legacy.payload.attemptId}.json`); await save();
  const legacyReply = await api('events', { sessionId: player.sessionId, events: [legacy] }, player.cookie);
  check(legacyReply.response.status === 200 && legacyReply.value.acceptedIds.includes(legacy.id), 'offline_legacy_v1_preserved');
  const forgedLegacy = { ...legacy, id: randomUUID(), payload: { ...legacy.payload, attemptId: randomUUID(), config: cancellable.value.attempt.config } };
  check((await api('events', { sessionId: player.sessionId, events: [forgedLegacy] }, player.cookie)).value.rejected.length === 1, 'v2_bypass_via_legacy_events_denied');
  const reload = await api('inventory', undefined, player.cookie, { sessionId: player.sessionId });
  check(isDeepStrictEqual(reload.value.snapshot, snapshot), 'fresh_read_durable_snapshot');

  const ownEvents = [], seenCursors = new Set(); let cursor, pages = 0;
  do {
    const page = await api('admin', undefined, privateReceipt.adminCookie, cursor ? { cursor } : {});
    check(page.response.status === 200 && Array.isArray(page.value.events), 'private_admin_page');
    ownEvents.push(...page.value.events.filter(event => event.sessionId === player.sessionId));
    pages++;
    cursor = page.value.hasMore ? page.value.cursor : null;
    check(!cursor || (!seenCursors.has(cursor) && pages < 500), 'pagination_progress');
    if (cursor) seenCursors.add(cursor);
  } while (cursor);
  const ledger = ownEvents.filter(event => event.schemaVersion === 2 && event.kind === 'inventory');
  const finalAttempts = ownEvents.filter(event => event.schemaVersion === 2 && event.kind === 'attempt');
  check(ledger.length === expectedLedger.size && ledger.every(event => expectedLedger.has(event.id)), 'ledger_persisted_once');
  check(finalAttempts.length === expectedAttempts.size && finalAttempts.every(event => expectedAttempts.has(event.payload.attemptId)), 'attempts_persisted_once');
  check(ownEvents.some(event => event.id === legacy.id && event.legacyInventory === true && event.result.engineVersion === 'ipe-bruno-r25-v1'), 'legacy_model_distinct_in_admin');
  check(finalAttempts.filter(event => event.payload.status === 'cancelled').every(event => !event.result), 'admin_cancel_not_scored');
  evidence.admin = { pages, inventoryEvents: ledger.length, authoritativeAttempts: finalAttempts.length, legacyAttempts: 1 };
  evidence.status = 'passed'; evidence.finishedAt = new Date().toISOString();
  privateReceipt.cleanupPaths = [...new Set(privateReceipt.cleanupPaths)];
  await save();
  console.log(JSON.stringify({ status: evidence.status, environment: evidence.environment, checks: evidence.checks.length, requests: evidence.requests, evidence: evidencePath, privateReceipt: privatePath }));
} catch (error) {
  evidence.status = 'failed'; evidence.failedCheck = error instanceof Error && /^[a-zA-Z0-9_ -]{1,120}$/.test(error.message) ? error.message : 'request_or_storage_unavailable';
  evidence.finishedAt = new Date().toISOString(); await save();
  console.error(JSON.stringify({ status: 'failed', check: evidence.failedCheck, evidence: evidencePath, privateReceipt: privatePath }));
  process.exitCode = 1;
}
