import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_CONFIG } from '../src/core/catalog.ts';
import type { MissionConfig } from '../src/core/contracts.ts';
import { simulateMission } from '../src/core/engine.ts';
import {
  CAMPAIGN_LEVELS, CAMPAIGN_STORAGE_KEY, assessCampaignResult, beginCampaignAttempt, cancelCampaignAttempt,
  completeCampaignAttempt, createCampaignProgress, getCampaignLevel, getNextCampaignLevel, isCampaignLevelAvailable,
  isCampaignLevelComplete, readCampaignProgress, searchCampaignCatalog, selectCampaignLevel, writeCampaignProgress,
} from '../src/campaign/index.ts';
import type { CampaignAttemptToken, CampaignLevelId, CampaignProgress } from '../src/campaign/index.ts';

const SOLUTIONS: Readonly<Record<CampaignLevelId, MissionConfig>> = {
  'first-signal': { ...DEFAULT_CONFIG },
  'memory-tradeoff': { ...DEFAULT_CONFIG, battery: 'large', processing: 'index', buffer: 'compact' },
  'narrow-window': { ...DEFAULT_CONFIG, battery: 'large', panel: 'compact', radio: 'fast' },
  'science-delivered': { ...DEFAULT_CONFIG, battery: 'large', panel: 'compact', processing: 'index' },
};
let sequence = 0;
function begin(progress: CampaignProgress, id: CampaignLevelId, config = SOLUTIONS[id]) {
  return beginCampaignAttempt(progress, id, { id: `own-attempt-${++sequence}`, config, scenarioId: getCampaignLevel(id).scenarioId, prediction: 'none', rationale: 'O projeto deve entregar os seis registros.' });
}
function finish(progress: CampaignProgress, id: CampaignLevelId, config = SOLUTIONS[id]) {
  const token = begin(progress, id, config);
  return completeCampaignAttempt(progress, token, simulateMission(config, getCampaignLevel(id).scenarioId));
}
function through(count: number): CampaignProgress {
  let progress = createCampaignProgress();
  for (const level of CAMPAIGN_LEVELS.slice(0, count)) progress = finish(progress, level.id).progress;
  return progress;
}
function memoryStorage(initial: string | null = null) {
  let text = initial;
  return { getItem(key: string) { assert.equal(key, CAMPAIGN_STORAGE_KEY); return text; }, setItem(key: string, value: string) { assert.equal(key, CAMPAIGN_STORAGE_KEY); text = value; } };
}

test('four fixed assignments use only the existing scenarios and keep all six science records', () => {
  assert.deepEqual(CAMPAIGN_LEVELS.map(level => [level.id, level.scenarioId]), [
    ['first-signal', 'long-contact'], ['memory-tradeoff', 'long-contact'], ['narrow-window', 'short-contact'], ['science-delivered', 'short-contact'],
  ]);
  const initial = CAMPAIGN_LEVELS.map(level => simulateMission(level.startingConfig, level.scenarioId));
  assert.deepEqual(initial.map(result => [result.outcome, result.deliveredRecords]), [['success', 6], ['failure', 2], ['failure', 2], ['success', 6]]);
  assert.equal(initial.every(result => result.requiredRecords === 6 && result.engineVersion === '0.1.1-rd' && result.catalogVersion === 'ipe-64-v1'), true);
  assert.equal(initial[1]!.events.some(event => event.code === 'BUFFER_OVERFLOW'), true);
  assert.equal(initial[3]!.credits, 84);
  assert.equal(Object.isFrozen(CAMPAIGN_LEVELS), true);
  assert.equal(CAMPAIGN_LEVELS.every(level => Object.isFrozen(level.startingConfig)), true);
  assert.equal(getNextCampaignLevel('science-delivered'), null);
});

test('every level has a distinct verified path, with success and 6/6 required together', () => {
  for (const level of CAMPAIGN_LEVELS) {
    const result = simulateMission(SOLUTIONS[level.id], level.scenarioId);
    const before = JSON.stringify(result);
    const assessment = assessCampaignResult(level.id, result);
    assert.equal(assessment.passed, true, level.id);
    assert.equal(assessment.engineSuccess, true);
    assert.equal(assessment.deliveredRecords, 6);
    assert.equal(result.requiredRecords, 6);
    assert.equal(JSON.stringify(result), before, 'The campaign must not mutate the engine receipt.');
  }
});

test('the final starter succeeds in the engine but does not meet the additional credit target', () => {
  const level = getCampaignLevel('science-delivered');
  const result = simulateMission(level.startingConfig, level.scenarioId);
  const assessment = assessCampaignResult(level.id, result);
  assert.equal(result.outcome, 'success');
  assert.equal(assessment.engineSuccess, true);
  assert.equal(assessment.passed, false);
  assert.deepEqual(assessment.requirements.filter(item => !item.passed).map(item => item.id), ['challenge']);
  assert.match(assessment.explanation, /motor registrou sucesso/);
  assert.equal(result.credits, 84);
});

test('valid delivery does not bypass the compact memory or band representation requested by a level', () => {
  assert.equal(assessCampaignResult('memory-tradeoff', simulateMission(DEFAULT_CONFIG, 'long-contact')).passed, false);
  const shortIndex = simulateMission({ ...DEFAULT_CONFIG, battery: 'large', processing: 'index' }, 'short-contact');
  assert.equal(shortIndex.outcome, 'success');
  assert.equal(assessCampaignResult('narrow-window', shortIndex).passed, false);
  assert.equal(assessCampaignResult('science-delivered', shortIndex).passed, false);
});

test('a short-contact level cannot be credited by a successful result from the long scenario', () => {
  const result = simulateMission(SOLUTIONS['narrow-window'], 'long-contact');
  assert.equal(result.outcome, 'success');
  const assessment = assessCampaignResult('narrow-window', result);
  assert.equal(assessment.passed, false);
  assert.equal(assessment.requirements.find(item => item.id === 'scenario')!.passed, false);
});

test('six delivered records in an invalid project never complete a level', () => {
  const config: MissionConfig = { ...DEFAULT_CONFIG, battery: 'large', processing: 'index', radio: 'fast' };
  const result = simulateMission(config, 'long-contact');
  assert.equal(result.deliveredRecords, 6);
  assert.equal(result.outcome, 'invalid');
  const progress = createCampaignProgress();
  const completed = completeCampaignAttempt(progress, begin(progress, 'first-signal', config), result);
  assert.equal(completed.assessment.passed, false);
  assert.equal(completed.progress.completions.length, 0);
  assert.equal(isCampaignLevelAvailable(completed.progress, 'memory-tradeoff'), false);
});

test('a claimed 6/6 with absent, invalid, partial or nonfinite science is not accepted by the review', () => {
  const result = simulateMission(DEFAULT_CONFIG, 'long-contact');
  for (const observations of [
    result.observations.slice(1),
    result.observations.map((item, index) => index ? item : { ...item, scienceValid: false }),
    result.observations.map((item, index) => index ? item : { ...item, state: 'partial' as const }),
    result.observations.map((item, index) => index ? item : { ...item, ndvi: NaN }),
    result.observations.map((item, index) => index ? item : result.observations[1]!),
  ]) assert.equal(assessCampaignResult('first-signal', { ...result, observations }).passed, false);
});

test('the exhaustive level solver preserves engine counts and separates additional criteria', () => {
  const expected = [
    { id: 'first-signal' as const, eligible: 17, mission: 17, rejected: 0, minimum: 0 },
    { id: 'memory-tradeoff' as const, eligible: 6, mission: 17, rejected: 11, minimum: 2 },
    { id: 'narrow-window' as const, eligible: 1, mission: 9, rejected: 8, minimum: 3 },
    { id: 'science-delivered' as const, eligible: 2, mission: 9, rejected: 7, minimum: 1 },
  ];
  for (const item of expected) {
    const level = getCampaignLevel(item.id);
    const before = JSON.stringify(level.startingConfig);
    const searched = searchCampaignCatalog(item.id, level.startingConfig);
    const result = searched.result;
    assert.equal(result.total, 64);
    assert.equal(result.evaluated, 64);
    assert.equal(result.complete, true);
    assert.equal(result.indeterminate, 0);
    assert.equal(result.successful, item.eligible);
    assert.equal(searched.missionSuccessful, item.mission);
    assert.equal(searched.rejectedByLevel, item.rejected);
    assert.equal(result.minimumDistance, item.minimum);
    assert.equal(result.successful + searched.rejectedByLevel + result.failed + result.invalid + result.indeterminate, 64);
    assert.equal(result.best.every(candidate => assessCampaignResult(item.id, candidate.result).passed), true);
    assert.equal(JSON.stringify(level.startingConfig), before);
  }
  const bands = searchCampaignCatalog('narrow-window', getCampaignLevel('narrow-window').startingConfig).result.best;
  assert.equal(bands.length, 1);
  assert.deepEqual(bands[0]!.config, SOLUTIONS['narrow-window']);
});

test('the first level is available, later levels unlock in order and replaying old levels remains available', () => {
  let progress = createCampaignProgress();
  assert.deepEqual(CAMPAIGN_LEVELS.map(level => isCampaignLevelAvailable(progress, level.id)), [true, false, false, false]);
  assert.throws(() => selectCampaignLevel(progress, 'narrow-window'), /anterior/);
  assert.throws(() => begin(progress, 'memory-tradeoff'), /disponível/);
  for (const [index, level] of CAMPAIGN_LEVELS.entries()) {
    const completed = finish(progress, level.id);
    assert.equal(completed.assessment.passed, true);
    progress = completed.progress;
    assert.equal(progress.completions.length, index + 1);
    assert.equal(isCampaignLevelComplete(progress, level.id), true);
    assert.equal(CAMPAIGN_LEVELS.slice(0, index + 2).every(item => isCampaignLevelAvailable(progress, item.id)), true);
  }
  const repeated = finish(progress, 'first-signal');
  assert.equal(repeated.progress, progress, 'A repeat must retain the original completions.');
  assert.equal(repeated.progress.completions.length, 4);
});

test('a new failure retains previous completion and never erases or unlocks unrelated levels', () => {
  const progress = through(2);
  const failedConfig = getCampaignLevel('memory-tradeoff').startingConfig;
  const completion = completeCampaignAttempt(progress, begin(progress, 'memory-tradeoff', failedConfig), simulateMission(failedConfig, 'long-contact'));
  assert.equal(completion.assessment.passed, false);
  assert.equal(completion.progress, progress);
  assert.equal(isCampaignLevelComplete(completion.progress, 'memory-tradeoff'), true);
  assert.equal(isCampaignLevelAvailable(completion.progress, 'science-delivered'), false);
});

test('launch requires an own prediction, a reason and the scenario of the selected level', () => {
  const progress = createCampaignProgress();
  const valid = { id: 'prediction-id', config: { ...DEFAULT_CONFIG }, scenarioId: 'long-contact' as const, prediction: 'none' as const, rationale: 'Cabe nos contatos e na memória.' };
  assert.throws(() => beginCampaignAttempt(progress, 'first-signal', { ...valid, rationale: 'sim' }), /previsão/);
  assert.throws(() => beginCampaignAttempt(progress, 'first-signal', { ...valid, scenarioId: 'short-contact' }), /cenário/);
  assert.throws(() => beginCampaignAttempt(progress, 'first-signal', { ...valid, id: '' }), /identificador/);
  const completed = finish(progress, 'first-signal').progress;
  assert.throws(() => beginCampaignAttempt(completed, 'first-signal', { ...valid, id: completed.completions[0]!.attemptId }), /registrada/);
});

test('replay results, history and JSON claims cannot fabricate an in-memory launch token', () => {
  const progress = createCampaignProgress();
  const result = simulateMission(DEFAULT_CONFIG, 'long-contact');
  const original = JSON.stringify(progress);
  for (const claimedToken of [{}, { own: true }, { id: 'first-signal', completed: true }]) {
    assert.throws(() => completeCampaignAttempt(progress, claimedToken as CampaignAttemptToken, result), /execução própria/);
  }
  const active = begin(progress, 'first-signal');
  assert.throws(() => completeCampaignAttempt(progress, JSON.parse(JSON.stringify(active)) as CampaignAttemptToken, result), /execução própria/);
  cancelCampaignAttempt(active);
  assert.equal(JSON.stringify(progress), original);
});

test('cancelled and consumed launch tokens cannot award progress', () => {
  const progress = createCampaignProgress();
  const result = simulateMission(DEFAULT_CONFIG, 'long-contact');
  const cancelled = begin(progress, 'first-signal');
  cancelCampaignAttempt(cancelled);
  assert.throws(() => completeCampaignAttempt(progress, cancelled, result), /execução própria/);
  const once = begin(progress, 'first-signal');
  const next = completeCampaignAttempt(progress, once, result);
  assert.equal(next.progress.completions.length, 1);
  assert.throws(() => completeCampaignAttempt(next.progress, once, result), /execução própria/);
});

test('a launch snapshots the configuration and refuses a result from a later edit', () => {
  const progress = createCampaignProgress();
  const config: MissionConfig = { ...DEFAULT_CONFIG };
  const token = begin(progress, 'first-signal', config);
  config.panel = 'compact';
  assert.throws(() => completeCampaignAttempt(progress, token, simulateMission(config, 'long-contact')), /não corresponde/);
  assert.equal(progress.completions.length, 0);
});

test('a structurally valid but altered result is recalculated before a completion can be awarded', () => {
  const progress = createCampaignProgress();
  const token = begin(progress, 'first-signal');
  const result = simulateMission(DEFAULT_CONFIG, 'long-contact');
  assert.throws(() => completeCampaignAttempt(progress, token, { ...result, finalEnergyWh: result.finalEnergyWh + 1 }), /diverge do recálculo/);
  assert.equal(progress.completions.length, 0);
});

test('a verified receipt without a trace can complete the level without inventing telemetry', () => {
  const progress = createCampaignProgress();
  const result = simulateMission(DEFAULT_CONFIG, 'long-contact', { trace: false });
  const finished = completeCampaignAttempt(progress, begin(progress, 'first-signal'), result);
  assert.equal(finished.assessment.passed, true);
  assert.equal(result.trace.length, 0);
});

test('versioned local progress round-trips all four recalculated completions and the selected level', () => {
  const progress = selectCampaignLevel(through(4), 'memory-tradeoff');
  const storage = memoryStorage();
  assert.deepEqual(writeCampaignProgress(progress, storage), { saved: true, message: null });
  const loaded = readCampaignProgress(storage);
  assert.equal(loaded.status, 'ready');
  assert.deepEqual(loaded.progress, progress);
  assert.notEqual(loaded.progress, progress);
  assert.equal(loaded.progress.completions.length, 4);
});

test('invalid, stale, oversized or unsupported progress cannot silently unlock a level', () => {
  const valid = through(2);
  const invalids = [
    '{', JSON.stringify({ ...valid, completions: [{ ...valid.completions[1] }] }),
    JSON.stringify({ ...valid, completions: [{ ...valid.completions[0], config: { ...DEFAULT_CONFIG, buffer: 'compact' } }] }),
    JSON.stringify({ ...valid, completions: valid.completions.map(entry => ({ ...entry, attemptId: 'duplicate' })) }),
    JSON.stringify({ ...valid, completions: [{ ...valid.completions[0], complete: true }] }),
    JSON.stringify({ ...createCampaignProgress(), activeLevelId: 'science-delivered' }),
    ' '.repeat(20_001),
  ];
  for (const raw of invalids) {
    const loaded = readCampaignProgress(memoryStorage(raw));
    assert.equal(loaded.status, 'invalid', raw.slice(0, 100));
    assert.equal(loaded.progress.completions.length, 0);
    assert.ok(loaded.message);
  }
  for (const field of ['schemaVersion', 'campaignVersion', 'engineVersion', 'catalogVersion']) {
    const loaded = readCampaignProgress(memoryStorage(JSON.stringify({ ...valid, [field]: 'future-version' })));
    assert.equal(loaded.status, 'unsupported');
    assert.equal(loaded.progress.completions.length, 0);
    assert.ok(loaded.message);
  }
});

test('missing storage starts a fresh campaign, and failures return messages while retaining session progress', () => {
  assert.equal(readCampaignProgress(memoryStorage()).status, 'empty');
  const unavailable = readCampaignProgress({ getItem() { throw new Error('Denied'); } });
  assert.equal(unavailable.status, 'unavailable');
  assert.ok(unavailable.message);
  const progress = through(1);
  const saved = writeCampaignProgress(progress, { setItem() { throw new Error('Quota'); } });
  assert.equal(saved.saved, false);
  assert.match(saved.message!, /continua nesta sessão/);
  assert.equal(progress.completions.length, 1);
});
