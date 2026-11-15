// Seven-mission synthetic HTTP verification. Production writes require --production.
// Reuses the complete R27 inventory verification, then continues its new synthetic session.
// node --experimental-strip-types scripts/verify-r28-production.mjs --origin http://127.0.0.1:4197 --admin-secret-file /tmp/ipe-r27-local-admin.txt
import { readFile, writeFile, chmod } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify, isDeepStrictEqual } from 'node:util';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { DEFAULT_CONFIG } from '../experiments/mission-design-lab/src/core/catalog.ts';
import { simulateMission } from '../experiments/mission-design-lab/src/core/engine.ts';
import { DEFAULT_EXPEDITION_CONFIGS, simulateExpedition } from '../experiments/mission-design-lab/src/lab/scientific-expeditions.ts';
import { DEFAULT_BRUNO_CONFIG, simulateBrunoMission } from '../experiments/mission-design-lab/src/lab/bruno-missions.ts';
import { runLearningExperiment, summarizeLearningTrial } from '../experiments/mission-design-lab/src/lab/mission-curriculum.ts';
import { summarizeResult } from '../server/metrics/model.mjs';

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
if (!local && (!options.production || origin !== 'https://nasa-missaoipe.alexandrebelo.com')) throw new Error('Production verification requires the official canonical origin and --production.');
const privatePath = options.private ?? '/tmp/ipe-r28-production-private.json';
const evidencePath = options.evidence ?? '/tmp/ipe-r28-production-evidence.json';
if (!/^\/(?:private\/)?tmp\/[^/]+\.json$/.test(privatePath) || privatePath === evidencePath) throw new Error('Use distinct evidence and private /tmp JSON paths.');
const inventoryPrivatePath = privatePath.replace(/\.json$/, '-inventory-r27.json');
const inventoryEvidencePath = evidencePath.replace(/\.json$/, '-inventory-r27.json');
if (new Set([privatePath, evidencePath, inventoryPrivatePath, inventoryEvidencePath]).size !== 4) throw new Error('Receipt paths must be distinct.');
const evidence = { schemaVersion: 1, release: 'R28', synthetic: true, humanLearningEvidence: false, browserInteractionEvidence: false,
  environment: local ? 'local-memory-HTTP' : 'production-private-Blob-HTTP', origin, startedAt: new Date().toISOString(), status: 'running', checks: [], missions: [], requests: 0 };
let privateReceipt = { synthetic: true, origin, startedAt: evidence.startedAt, sessions: [], requests: [], events: [], cleanupPaths: [] };
let player, snapshot;
const ledgerIds = new Set(), inventoryAttemptIds = new Set(), expectedEvents = new Map();
function check(value, code) { if (!value) throw new Error(code); evidence.checks.push(code); }
async function save() {
  await chmod(privatePath, 0o600).catch(error => { if (error.code !== 'ENOENT') throw error; });
  await writeFile(privatePath, JSON.stringify(privateReceipt, null, 2) + '\n', { mode: 0o600 });
  await writeFile(evidencePath, JSON.stringify(evidence, null, 2) + '\n');
}
async function api(action, body, auth = player?.cookie, query = {}, headers = {}) {
  const url = new URL('/api/metrics', origin);
  if (!body) { url.searchParams.set('action', action); for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value); }
  const response = await fetch(url, { method: body ? 'POST' : 'GET', redirect: 'error', signal: AbortSignal.timeout(45_000),
    headers: { 'content-type': 'application/json', origin, ...(auth ? { cookie: auth } : {}), ...headers },
    ...(body ? { body: JSON.stringify({ action, ...body }) } : {}) });
  evidence.requests++;
  evidence.lastHttp = { action, status: response.status };
  check(/no-store/.test(response.headers.get('cache-control') ?? ''), 'no_store');
  let value; try { value = await response.json(); } catch { throw new Error('non_json_response'); }
  if (typeof value?.code === 'string' && /^[A-Z_]{1,60}$/.test(value.code)) evidence.lastHttp.code = value.code;
  return { response, value };
}
const event = (kind, mission, payload) => ({ id: randomUUID(), kind, mission, at: new Date().toISOString(), payload });
function trackEvent(input, expected) {
  expectedEvents.set(input.id, { input, ...expected });
  privateReceipt.events.push(input);
  privateReceipt.cleanupPaths.push(`r21/records/${player.sessionId}/${input.kind === 'attempt' ? `attempt-${input.payload.attemptId}` : `event-${input.id}`}.json`);
}
async function sendEvents(events) { return api('events', { sessionId: player.sessionId, events }); }
async function accepted(events, label) {
  await save();
  const reply = await sendEvents(events);
  check(reply.response.status === 200 && isDeepStrictEqual(reply.value.acceptedIds, events.map(row => row.id)) && reply.value.rejected?.length === 0, label);
}
async function command(command, supplied) {
  const body = supplied ?? { sessionId: player.sessionId, requestId: randomUUID(), expectedRevision: snapshot.revision, command };
  privateReceipt.requests.push(body); await save();
  const reply = await api('inventory-command', body);
  check(reply.response.status === 200, `${command.kind}_confirmed`);
  snapshot = reply.value.snapshot;
  ledgerIds.add(reply.value.receipt.eventId);
  privateReceipt.cleanupPaths.push(`r21/records/${player.sessionId}/inventory-event-${reply.value.receipt.eventId}.json`);
  if (reply.value.attempt?.metricEvent) {
    inventoryAttemptIds.add(reply.value.attempt.attemptId);
    privateReceipt.cleanupPaths.push(`r21/records/${player.sessionId}/inventory-attempt-${reply.value.attempt.attemptId}.json`);
  }
  return { ...reply.value, body };
}
async function reloadInventory(label) {
  const reply = await api('inventory', undefined, player.cookie, { sessionId: player.sessionId });
  check(reply.response.status === 200 && isDeepStrictEqual(reply.value.snapshot, snapshot), label);
}
const telescope = { launch: 'science', orbit: 'far', duration: 'full', instrument: 'spectrometer', power: 'extended', ground: 'extended' };
const scienceFixtures = [
  { mission: 'cerrado', scenarioId: 'short-contact', novice: { ...DEFAULT_CONFIG }, repaired: { ...DEFAULT_CONFIG, battery: 'large', processing: 'index' }, decision: { key: 'battery', from: 'small', to: 'large' } },
  { mission: 'bennu', novice: { ...DEFAULT_EXPEDITION_CONFIGS.bennu }, repaired: { ...DEFAULT_EXPEDITION_CONFIGS.bennu, power: 'extended', ground: 'extended' }, decision: { key: 'power', from: 'compact', to: 'extended' } },
  { mission: 'telescope', novice: { ...DEFAULT_EXPEDITION_CONFIGS.telescope }, repaired: telescope, decision: { key: 'launch', from: 'compact', to: 'science' } },
];
const resultFor = (fixture, config) => summarizeResult(fixture.mission === 'cerrado' ? simulateMission(config, fixture.scenarioId, { trace: false }) : simulateExpedition(fixture.mission, config), fixture.mission);

try {
  await save();
  const inventoryArgs = ['--experimental-strip-types', fileURLToPath(new URL('./verify-r27-production.mjs', import.meta.url)), '--origin', origin,
    '--private', inventoryPrivatePath, '--evidence', inventoryEvidencePath,
    '--admin-secret-file', options['admin-secret-file'] ?? '/tmp/ipe-r21-admin.txt', ...(options.production ? ['--production'] : [])];
  let inventoryFailure = false;
  try { await promisify(execFile)(process.execPath, inventoryArgs, { timeout: 15 * 60_000, maxBuffer: 64_000 }); }
  catch { inventoryFailure = true; }
  const inventoryEvidence = JSON.parse(await readFile(inventoryEvidencePath, 'utf8'));
  privateReceipt = { ...JSON.parse(await readFile(inventoryPrivatePath, 'utf8')), release: 'R28', events: [] };
  evidence.inventoryVerification = inventoryEvidence;
  evidence.requests = inventoryEvidence.requests;
  check(!inventoryFailure && inventoryEvidence.status === 'passed', 'r27_inventory_baseline_passed');
  player = privateReceipt.sessions[0];
  for (const path of privateReceipt.cleanupPaths) {
    const ledger = path.match(/\/inventory-event-([a-f0-9-]+)\.json$/), attempt = path.match(/\/inventory-attempt-([a-f0-9-]+)\.json$/);
    if (ledger) ledgerIds.add(ledger[1]);
    if (attempt) inventoryAttemptIds.add(attempt[1]);
  }
  evidence.missions = [...inventoryEvidence.missions];
  const session = await api('session');
  check(session.response.status === 200 && session.value.session?.sessionId === player.sessionId && !Object.hasOwn(session.value.session, 'email'), 'same_private_session_after_inventory_stage');
  const resumed = await api('session', undefined, player.cookie, {}, { connection: 'close' });
  check(isDeepStrictEqual(resumed.value, session.value), 'session_survives_new_http_connection');
  check((await api('session', undefined, null)).value.session === null, 'missing_cookie_does_not_resume_identity');
  check((await api('inventory', undefined, `${player.cookie}x`, { sessionId: player.sessionId })).response.status === 401, 'tampered_player_cookie_denied');
  const initial = await api('inventory', undefined, player.cookie, { sessionId: player.sessionId });
  check(initial.response.status === 200 && initial.value.snapshot.inventory.balance === 25, 'same_inventory_after_session_reload');
  snapshot = initial.value.snapshot;

  for (const fixture of scienceFixtures) {
    const batch = [], results = {};
    for (const variant of ['novice', 'repaired']) {
      const config = fixture[variant], expected = resultFor(fixture, config);
      check(expected.outcome === (variant === 'repaired' ? 'success' : 'failure'), `${fixture.mission}_${variant}_fixture_outcome`);
      const input = event('attempt', fixture.mission, { attemptId: randomUUID(), status: 'completed', config, ...(fixture.scenarioId ? { scenarioId: fixture.scenarioId } : {}) });
      trackEvent(input, { result: expected, label: `${fixture.mission}_${variant}_recomputed_summary` });
      batch.push(input); results[variant] = { outcome: expected.outcome, score: expected.score.total, validRecords: expected.validRecords, receivedRecords: expected.deliveredRecords, modelVersion: expected.engineVersion };
    }
    const [a, b] = runLearningExperiment(fixture.mission).trials.map(summarizeLearningTrial);
    const answer = b.valid > a.valid ? 'more' : b.valid < a.valid ? 'less' : 'same';
    for (const [question, selected, correct, expected] of [['prediction', answer, true, answer], ['interpretation', 'missing', false, 'evidence'], ['interpretation', 'evidence', true, 'evidence']]) {
      const input = event('assessment', fixture.mission, { question, answer: selected, questionVersion: 1 });
      trackEvent(input, { result: { correct, expected }, label: `${fixture.mission}_${question}_${selected}_server_criterion` }); batch.push(input);
    }
    for (const input of [event('decision', fixture.mission, fixture.decision), event('inspection', fixture.mission, { target: 'evidence' })]) {
      trackEvent(input, { result: undefined, label: `${fixture.mission}_${input.kind}_durable` }); batch.push(input);
    }
    await accepted(batch, `${fixture.mission}_novice_and_repaired_events_accepted`);
    await accepted(batch, `${fixture.mission}_exact_retry_accepted`);
    await accepted([{ ...batch[1], id: randomUUID() }], `${fixture.mission}_same_attempt_new_event_id_idempotent`);
    const changed = { ...batch[1], id: randomUUID(), payload: { ...batch[1].payload, config: fixture.novice } };
    const conflict = await sendEvents([changed]);
    check(conflict.response.status === 200 && conflict.value.acceptedIds?.length === 0 && conflict.value.rejected?.length === 1, `${fixture.mission}_attempt_id_conflict_denied`);
    const injected = await sendEvents([{ ...batch[1], id: randomUUID(), payload: { ...batch[1].payload, attemptId: randomUUID(), score: 100 } },
      { ...batch[0], id: randomUUID(), result: { outcome: 'success', score: { total: 100 } } }]);
    check(injected.response.status === 200 && injected.value.acceptedIds?.length === 0 && injected.value.rejected?.length === 2, `${fixture.mission}_forged_score_denied`);
    evidence.missions.push({ mission: fixture.mission, ...results });
  }
  const controls = [
    { input: event('attempt', 'telescope', { attemptId: randomUUID(), status: 'completed', config: { ...telescope, instrument: 'camera' } }), result: resultFor(scienceFixtures[2], { ...telescope, instrument: 'camera' }), label: 'webb_six_received_zero_valid' },
    { input: event('attempt', 'cerrado', { attemptId: randomUUID(), status: 'cancelled', config: DEFAULT_CONFIG, scenarioId: 'short-contact' }), result: undefined, label: 'cerrado_cancel_not_scored' },
    { input: event('attempt', 'bennu', { attemptId: randomUUID(), status: 'error', config: DEFAULT_EXPEDITION_CONFIGS.bennu }), result: undefined, label: 'bennu_technical_error_not_scored' },
  ];
  check(controls[0].result.deliveredRecords === 6 && controls[0].result.validRecords === 0 && controls[0].result.score.total === 0, 'webb_transport_is_not_science_fixture');
  for (const { input, ...expected } of controls) trackEvent(input, expected);
  await accepted(controls.map(row => row.input), 'negative_controls_accepted');
  const denied = await api('events', { sessionId: player.sessionId, events: [controls[0].input] }, privateReceipt.sessions[1].cookie);
  check(denied.response.status === 409, 'other_participant_cannot_submit_science_attempt');
  await reloadInventory('science_missions_do_not_spend_or_reward_inventory');

  const iss = { ...DEFAULT_BRUNO_CONFIG, protection: 'reinforced', energy: 'extended' };
  await command({ kind: 'buy', instrumentIds: ['iss-air-quality'] });
  const unit = snapshot.inventory.items[0];
  await command({ kind: 'equip', missionId: 'iss', config: iss, itemIds: [unit.id] });
  for (const usesRemaining of [3, 2, 1]) {
    const beforeBalance = snapshot.inventory.balance;
    const launched = await command({ kind: 'launch', missionId: 'iss', config: iss });
    check(launched.attempt.config.loadout.length === 1 && launched.attempt.config.loadout[0].usesRemaining === usesRemaining, `condition_${usesRemaining}_frozen_before_wear`);
    check(isDeepStrictEqual(launched.attempt.result, simulateBrunoMission('iss', launched.attempt.config)), `condition_${usesRemaining}_result_recomputed`);
    check(snapshot.inventory.balance === beforeBalance - 2 && (snapshot.inventory.items.find(item => item.id === unit.id)?.usesRemaining ?? 0) === usesRemaining - 1, `condition_${usesRemaining}_one_fee_one_use`);
    await reloadInventory(`condition_${usesRemaining}_active_flight_survives_reload`);
    const repeated = await command(launched.body.command, launched.body);
    check(isDeepStrictEqual(repeated.receipt, launched.receipt) && isDeepStrictEqual(repeated.attempt, launched.attempt), `condition_${usesRemaining}_launch_retry_no_extra_wear`);
    const terminal = usesRemaining === 2 ? 'cancel' : 'complete';
    const finished = await command({ kind: terminal, attemptId: launched.attempt.attemptId });
    const reward = terminal === 'complete' && launched.attempt.result.outcome === 'success' ? 8 : 0;
    check(snapshot.inventory.balance === beforeBalance - 2 + reward, `condition_${usesRemaining}_terminal_reward_once`);
    const confirmed = await command(finished.body.command, finished.body);
    check(isDeepStrictEqual(confirmed.receipt, finished.receipt) && isDeepStrictEqual(confirmed.attempt.metricEvent, finished.attempt.metricEvent), `condition_${usesRemaining}_terminal_retry_same_metric`);
  }
  check(!snapshot.inventory.items.some(item => item.id === unit.id) && !snapshot.inventory.reservations.iss?.includes(unit.id), 'exhausted_unit_removed_from_stock_and_reservation');
  await reloadInventory('exhaustion_and_all_attempts_durable_after_reload');

  const ownEvents = [], cursors = new Set(); let cursor, pages = 0, profiles = 0;
  do {
    const page = await api('admin', undefined, privateReceipt.adminCookie, cursor ? { cursor } : {});
    check(page.response.status === 200 && Array.isArray(page.value.events) && Array.isArray(page.value.profiles) && typeof page.value.hasMore === 'boolean', 'private_admin_page');
    ownEvents.push(...page.value.events.filter(row => row.sessionId === player.sessionId));
    profiles += page.value.profiles.filter(row => row.sessionId === player.sessionId).length;
    pages++;
    cursor = page.value.hasMore ? page.value.cursor : null;
    check(!cursor || (typeof cursor === 'string' && !cursors.has(cursor) && pages < 500), 'pagination_progress');
    if (cursor) cursors.add(cursor);
  } while (cursor);
  check(profiles === 1, 'one_profile_for_all_seven_missions');
  const ledger = ownEvents.filter(row => row.schemaVersion === 2 && row.kind === 'inventory');
  const inventoryAttempts = ownEvents.filter(row => row.schemaVersion === 2 && row.kind === 'attempt');
  check(ledger.length === ledgerIds.size && new Set(ledger.map(row => row.id)).size === ledgerIds.size && ledger.every(row => ledgerIds.has(row.id)), 'all_inventory_ledger_records_once');
  check(inventoryAttempts.length === inventoryAttemptIds.size && new Set(inventoryAttempts.map(row => row.payload.attemptId)).size === inventoryAttemptIds.size && inventoryAttempts.every(row => inventoryAttemptIds.has(row.payload.attemptId)), 'all_inventory_attempts_once');
  for (const attempt of snapshot.attempts.filter(row => row.metricEvent)) {
    const stored = inventoryAttempts.find(row => row.payload.attemptId === attempt.attemptId);
    check(isDeepStrictEqual(stored, attempt.metricEvent), 'inventory_metric_equals_confirmed_snapshot');
  }
  const scienceEvents = ownEvents.filter(row => expectedEvents.has(row.id));
  check(scienceEvents.length === expectedEvents.size && new Set(scienceEvents.map(row => row.id)).size === expectedEvents.size, 'all_science_events_persisted_once');
  for (const expected of expectedEvents.values()) {
    const row = scienceEvents.find(value => value.id === expected.input.id);
    check(row?.schemaVersion === 1 && row.mission === expected.input.mission && isDeepStrictEqual(row.payload, expected.input.payload) && isDeepStrictEqual(row.result, expected.result), expected.label);
  }
  check(ownEvents.length === ledgerIds.size + inventoryAttemptIds.size + expectedEvents.size + 1, 'no_unexpected_records_from_rejected_events_or_retries');
  check(ownEvents.some(row => row.id === privateReceipt.legacy.id && row.legacyInventory === true && row.result.engineVersion === 'ipe-bruno-r25-v1'), 'legacy_r27_proof_preserved');
  check(new Set(evidence.missions.map(row => row.mission)).size === 7, 'seven_distinct_missions_verified');
  evidence.admin = { pages, profiles, inventoryEvents: ledger.length, authoritativeAttempts: inventoryAttempts.length, scienceEvents: scienceEvents.length, legacyAttempts: 1 };
  evidence.durability = { launchConditions: [3, 2, 1], remainingUnits: 0, cancellationConsumesUse: true };
  evidence.status = 'passed'; evidence.finishedAt = new Date().toISOString();
  privateReceipt.cleanupPaths = [...new Set(privateReceipt.cleanupPaths)];
  await save();
  console.log(JSON.stringify({ status: evidence.status, environment: evidence.environment, checks: evidence.checks.length + evidence.inventoryVerification.checks.length, requests: evidence.requests, missions: 7, evidence: evidencePath, privateReceipt: privatePath }));
} catch (error) {
  evidence.status = 'failed'; evidence.failedCheck = error instanceof Error && /^[a-zA-Z0-9_ -]{1,120}$/.test(error.message) ? error.message : 'request_or_storage_unavailable';
  evidence.finishedAt = new Date().toISOString(); await save();
  console.error(JSON.stringify({ status: evidence.status, check: evidence.failedCheck, evidence: evidencePath, privateReceipt: privatePath }));
  process.exitCode = 1;
}
