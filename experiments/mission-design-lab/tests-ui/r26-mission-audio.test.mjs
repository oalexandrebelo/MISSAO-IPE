import test, { after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://mission.test/', pretendToBeVisual: true });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLCanvasElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle']) {
  Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name], writable: true });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.HTMLCanvasElement.prototype.getContext = () => null;
dom.window.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} });
const { render, cleanup, act, fireEvent } = await import('@testing-library/react');
const { createR26MissionAudio, r26CueSamples } = await import('../src/ui/R26MissionAudio.ts');
const { useR26MissionAudio, R26MissionAudioControl } = await import('../src/ui/R26MissionAudioControl.tsx');
const { BrunoCampaign } = await import('../src/ui/BrunoCampaign.tsx');

class AudioContextDouble {
  static instances = [];
  state = 'suspended'; currentTime = 1; sampleRate = 48_000;
  destination = {}; sources = []; gains = []; resumes = 0; closes = 0;
  constructor() { AudioContextDouble.instances.push(this); }
  resume() { this.resumes++; this.state = 'running'; return Promise.resolve(); }
  close() { this.closes++; this.state = 'closed'; return Promise.resolve(); }
  createBuffer(_channels, length) {
    return { data: new Float32Array(length), copyToChannel(samples) { this.data.set(samples); } };
  }
  createBufferSource() {
    const source = { starts: 0, stops: [], disconnected: false, buffer: null, onended: null,
      connect() {}, disconnect() { this.disconnected = true; },
      start() { this.starts++; }, stop(time = 0) { this.stops.push(time); } };
    this.sources.push(source); return source;
  }
  createGain() {
    const gain = { disconnected: false, gain: { value: 1, ramps: [],
      cancelScheduledValues() { this.ramps = []; },
      setValueAtTime(value) { this.value = value; },
      linearRampToValueAtTime(value, time) { this.ramps.push([value, time]); } },
      connect() {}, disconnect() { this.disconnected = true; } };
    this.gains.push(gain); return gain;
  }
}

beforeEach(() => {
  AudioContextDouble.instances = [];
  dom.window.AudioContext = AudioContextDouble;
  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
});
after(() => dom.window.close());

test('no context or sound exists until the player opts in; mute stops and closes it', async t => {
  const audio = createR26MissionAudio(); t.after(() => audio.dispose());
  assert.equal(audio.play('success'), false);
  assert.equal(AudioContextDouble.instances.length, 0);
  assert.equal(await audio.enable(), true);
  const context = AudioContextDouble.instances[0];
  assert.equal(context.resumes, 1);
  assert.equal(audio.play('launch'), true);
  assert.equal(context.sources.length, 1);
  audio.mute();
  assert.equal(context.gains[0].gain.value, 0);
  assert.ok(context.sources[0].stops.length);
  assert.equal(context.sources[0].disconnected, true);
  assert.equal(context.closes, 1);
  assert.equal(audio.play('success'), false);
});

test('an unavailable or rejected audio context leaves gameplay silent without throwing', async t => {
  const audio = createR26MissionAudio(); t.after(() => audio.dispose());
  dom.window.AudioContext = undefined;
  assert.equal(await audio.enable(), false);
  dom.window.AudioContext = class extends AudioContextDouble { resume() { return Promise.reject(new Error('denied')); } };
  assert.equal(await audio.enable(), false);
  assert.equal(AudioContextDouble.instances.at(-1).closes, 1);
  assert.equal(audio.play('choice'), false);
});

test('a late resume cannot undo mute or disposal', async () => {
  let resolveResume;
  dom.window.AudioContext = class extends AudioContextDouble {
    resume() { return new Promise(resolve => { resolveResume = () => { this.state = 'running'; resolve(); }; }); }
  };
  const audio = createR26MissionAudio();
  const enabling = audio.enable();
  audio.dispose();
  resolveResume();
  assert.equal(await enabling, false);
  assert.equal(audio.play('success'), false);
  assert.equal(AudioContextDouble.instances[0].closes, 1);
});

test('hidden pages stop queued cues and never replay them when visible again', async t => {
  const audio = createR26MissionAudio(); t.after(() => audio.dispose());
  await audio.enable(); audio.play('success');
  const context = AudioContextDouble.instances[0];
  Object.defineProperty(document, 'hidden', { configurable: true, value: true });
  document.dispatchEvent(new dom.window.Event('visibilitychange'));
  assert.equal(context.sources[0].disconnected, true);
  assert.equal(audio.play('failure'), false);
  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
  document.dispatchEvent(new dom.window.Event('visibilitychange'));
  assert.equal(context.sources.length, 1);
  context.currentTime += 1;
  assert.equal(audio.play('choice'), true);
});

test('rapid inputs stay bounded and duplicate cues are suppressed', async t => {
  const audio = createR26MissionAudio(); t.after(() => audio.dispose());
  await audio.enable();
  const context = AudioContextDouble.instances[0];
  assert.equal(audio.play('choice'), true);
  assert.equal(audio.play('choice'), false);
  for (let i = 0; i < 80; i++) {
    audio.play(i % 2 ? 'failure' : 'success');
    assert.ok(context.sources.filter(source => !source.disconnected).length <= 2);
  }
  const remaining = context.sources.filter(source => !source.disconnected);
  remaining.forEach(source => source.onended());
  assert.equal(context.sources.filter(source => !source.disconnected).length, 0);
});

test('the actual synthesized PCM is short, finite, quiet and starts and ends at zero', () => {
  const fingerprints = new Set();
  for (const rate of [44_100, 48_000]) for (const cue of ['choice', 'launch', 'success', 'failure', 'invalid']) {
    const samples = r26CueSamples(cue, rate);
    const peak = samples.reduce((value, sample) => Math.max(value, Math.abs(sample)), 0);
    const mean = samples.reduce((value, sample) => value + sample, 0) / samples.length;
    assert.ok(samples.every(Number.isFinite), cue);
    assert.ok(peak > .01 && peak < .06, cue + ' signal and headroom');
    assert.ok(Math.abs(mean) < .001, cue + ' negligible DC');
    assert.ok(samples.length / rate < .4, cue + ' short duration');
    assert.equal(samples[0], 0);
    assert.equal(samples.at(-1), 0);
    fingerprints.add(`${rate}:${samples.length}:${peak}`);
  }
  assert.equal(fingerprints.size, 10);
});

test('the control exposes consent and unsupported feedback, independently of reduced motion', async t => {
  t.after(() => act(async () => cleanup()));
  function Harness() { const audio = useR26MissionAudio(); return React.createElement(R26MissionAudioControl, { audio }); }
  const view = render(React.createElement(Harness));
  const button = view.getByRole('button', { name: 'Sons da missão: desligados' });
  assert.equal(button.getAttribute('aria-pressed'), 'false');
  await act(async () => fireEvent.click(button));
  assert.equal(button.getAttribute('aria-pressed'), 'true');
  assert.equal(AudioContextDouble.instances[0].sources.length, 1);
  await act(async () => fireEvent.click(button));
  assert.equal(button.getAttribute('aria-pressed'), 'false');
  dom.window.AudioContext = undefined;
  await act(async () => fireEvent.click(button));
  assert.match(view.getByRole('status').textContent, /não liberou o áudio/);
  assert.equal(button.getAttribute('aria-pressed'), 'false');
});

test('turning the control off while audio is starting cannot be undone by a delayed browser reply', async t => {
  t.after(() => act(async () => cleanup()));
  let resolveResume;
  dom.window.AudioContext = class extends AudioContextDouble {
    resume() { return new Promise(resolve => { resolveResume = () => { this.state = 'running'; resolve(); }; }); }
  };
  function Harness() { const audio = useR26MissionAudio(); return React.createElement(R26MissionAudioControl, { audio }); }
  const view = render(React.createElement(Harness));
  const button = view.getByRole('button', { name: 'Sons da missão: desligados' });
  await act(async () => fireEvent.click(button));
  assert.match(button.textContent, /ativando/);
  await act(async () => fireEvent.click(button));
  await act(async () => resolveResume());
  assert.equal(button.getAttribute('aria-pressed'), 'false');
  assert.match(button.textContent, /desligados/);
  assert.equal(AudioContextDouble.instances[0].sources.length, 0);
});

test('campaign cues follow the real success, failure and invalid results with reduced motion', async t => {
  t.after(() => act(async () => cleanup()));
  for (const [id, expected, redesign] of [['iss', 'failure', false], ['iss', 'success', true], ['mars', 'invalid', false]]) {
    let result;
    const before = AudioContextDouble.instances.length;
    const view = render(React.createElement(BrunoCampaign, { id, onBack() {}, onComplete(value) { result = value; } }));
    assert.equal(view.getByRole('button', { name: 'Sons da missão: desligados' }).getAttribute('aria-pressed'), 'false');
    assert.equal(AudioContextDouble.instances.length, before);
    await act(async () => fireEvent.click(view.getByRole('button', { name: 'Sons da missão: desligados' })));
    const context = AudioContextDouble.instances.at(-1);
    await act(async () => fireEvent.click(view.getByRole('button', { name: /Abrir hangar/ })));
    if (redesign) {
      await act(async () => fireEvent.click(view.getByRole('button', { name: 'Proteção', exact: true })));
      context.currentTime += 1;
      await act(async () => fireEvent.click(view.getByRole('radio', { name: /Reforçada/ })));
      assert.deepEqual(context.sources.at(-1).buffer.data, r26CueSamples('choice', context.sampleRate));
    }
    context.currentTime += 1;
    await act(async () => fireEvent.click(view.getByRole('button', { name: /Simular lançamento/ })));
    assert.equal(result.outcome, expected);
    assert.deepEqual(context.sources.at(-1).buffer.data, r26CueSamples(result.outcome, context.sampleRate));
    view.unmount();
    assert.equal(context.closes, 1);
  }
});
