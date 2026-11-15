import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_CONFIG } from '../src/core/catalog.ts';
import { simulateMission } from '../src/core/engine.ts';
import { DEFAULT_EXPEDITION_CONFIGS, simulateExpedition } from '../src/lab/scientific-expeditions.ts';
import { runLearningExperiment, summarizeLearningTrial } from '../src/lab/mission-curriculum.ts';
import type { LearningMission } from '../src/lab/mission-curriculum.ts';

const ids: readonly LearningMission[] = ['cerrado', 'bennu', 'telescope'];
const expected = {
  cerrado: { labels: ['A · BANDAS', 'B · ÍNDICE'], valid: [2, 0], received: [2, 0], mbit: [460.8, 0], outcomes: ['failure', 'failure'], changed: 'processing' },
  bennu: { labels: ['A · Contatos curtos', 'B · Contatos ampliados'], valid: [2, 6], received: [2, 6], mbit: [288, 720], outcomes: ['failure', 'success'], changed: 'ground' },
  telescope: { labels: ['A · Câmera', 'B · Espectrômetro'], valid: [0, 6], received: [6, 6], mbit: [720, 1080], outcomes: ['invalid', 'success'], changed: 'instrument' },
};

test('the three controlled experiments reproduce the stated delivery pairs and physical volumes', () => {
  for (const id of ids) {
    const experiment = runLearningExperiment(id);
    const summaries = experiment.trials.map(summarizeLearningTrial);
    assert.equal(experiment.id, id);
    assert.equal(experiment.trials.length, 2);
    assert.deepEqual(experiment.trials.map(trial => trial.label), expected[id].labels);
    assert.deepEqual(summaries.map(summary => summary.valid), expected[id].valid, `${id}: valid science`);
    assert.deepEqual(summaries.map(summary => summary.received), expected[id].received, `${id}: complete packets`);
    assert.deepEqual(summaries.map(summary => summary.mbit), expected[id].mbit, `${id}: decimal Mbit`);
    assert.deepEqual(summaries.map(summary => summary.outcome), expected[id].outcomes);
    assert.ok(experiment.trials.every(trial => trial.result.requiredRecords === 6));
  }
});

test('each experiment changes exactly one declared choice and keeps its scenario fixed', () => {
  for (const id of ids) {
    const [a, b] = runLearningExperiment(id).trials;
    const before = a.result.config as unknown as Record<string, string>;
    const after = b.result.config as unknown as Record<string, string>;
    assert.deepEqual(Object.keys(before).sort(), Object.keys(after).sort());
    assert.deepEqual(Object.keys(before).filter(key => before[key] !== after[key]), [expected[id].changed]);
    if (a.kind === 'cerrado' && b.kind === 'cerrado') {
      assert.deepEqual(a.result.config, DEFAULT_CONFIG);
      assert.equal(a.result.scenarioId, 'short-contact');
      assert.equal(b.result.scenarioId, a.result.scenarioId);
      assert.equal(b.result.config.battery, 'small');
      assert.equal(b.result.completedAtS, 600);
      assert.equal(b.result.events.find(event => event.severity === 'error')?.code, 'PEAK_POWER');
    } else {
      assert.equal(a.kind, 'expedition'); assert.equal(b.kind, 'expedition');
      if (a.kind !== 'expedition' || b.kind !== 'expedition') throw new Error('Expected expedition pair');
      assert.equal(a.result.expeditionId, id); assert.equal(b.result.expeditionId, id);
      assert.equal(a.result.horizonS, b.result.horizonS);
      assert.equal(a.result.config.power, 'extended');
      assert.equal(a.result.config.duration, 'full');
      assert.equal(a.result.config.launch, id === 'bennu' ? 'compact' : 'science');
      assert.equal(a.result.config.orbit, id === 'bennu' ? 'near' : 'far');
    }
  }
});

test('a camera on the telescope transports six complete packets without producing valid spectroscopy', () => {
  const [camera, spectrometer] = runLearningExperiment('telescope').trials;
  const summary = summarizeLearningTrial(camera);
  assert.equal(summary.received, 6);
  assert.equal(summary.valid, 0);
  assert.equal(summary.outcome, 'invalid');
  assert.ok(camera.result.observations.every(observation => observation.deliveredAtS !== null));
  if (camera.kind !== 'expedition') throw new Error('Expected telescope expedition');
  assert.ok(camera.result.observations.every(observation => observation.valid === false));
  assert.equal(summarizeLearningTrial(spectrometer).valid, 6);
});

test('experiment results are identical to direct engine runs, including traces, events and science', () => {
  for (const id of ids) for (const trial of runLearningExperiment(id).trials) {
    const direct = trial.kind === 'cerrado'
      ? simulateMission(trial.result.config, trial.result.scenarioId)
      : simulateExpedition(trial.result.expeditionId, trial.result.config);
    assert.deepEqual(trial.result, direct, `${id} ${trial.label}`);
    const summary = summarizeLearningTrial(trial);
    const totals = trial.kind === 'cerrado' ? trial.result : trial.result.totals;
    assert.equal(summary.massKg, totals.massKg);
    assert.equal(summary.credits, totals.credits);
  }
});

test('running and summarizing lessons preserves defaults and produces deterministic independent results', () => {
  const defaults = structuredClone({ earth: DEFAULT_CONFIG, expeditions: DEFAULT_EXPEDITION_CONFIGS });
  const first = ids.map(runLearningExperiment);
  for (const experiment of first) experiment.trials.forEach(summarizeLearningTrial);
  const second = ids.map(runLearningExperiment);
  assert.deepEqual(first, second);
  assert.deepEqual({ earth: DEFAULT_CONFIG, expeditions: DEFAULT_EXPEDITION_CONFIGS }, defaults);
  assert.notEqual(first[0]!.trials[0].result, second[0]!.trials[0].result);
  assert.notEqual(first[0]!.trials[0].result.config, DEFAULT_CONFIG);
  for (const experiment of first) assert.notEqual(experiment.trials[0].result.config, experiment.trials[1].result.config);
});
