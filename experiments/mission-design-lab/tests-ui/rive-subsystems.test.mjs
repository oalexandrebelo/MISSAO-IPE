import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://mission.test/', pretendToBeVisual: true });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLDialogElement', 'HTMLCanvasElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle']) {
  Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name], writable: true });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.HTMLCanvasElement.prototype.getContext = () => null;
dom.window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
dom.window.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
const { render, cleanup, act, fireEvent } = await import('@testing-library/react');
const { Scene } = await import('../src/ui/Scene.tsx');
const { advanceArtwork, updateArtwork } = await import('../src/ui/RiveSubsystems.tsx');
const { CompareDialog } = await import('../src/ui/CompareDialog.tsx');
const { ExpeditionComparison } = await import('../src/ui/ExpeditionComparison.tsx');
const { DEFAULT_CONFIG } = await import('../src/core/catalog.ts');
const { DEFAULT_EXPEDITION_CONFIGS, getExpeditionVisualState, simulateExpedition } = await import('../src/lab/scientific-expeditions.ts');
const { runLearningExperiment } = await import('../src/lab/mission-curriculum.ts');
after(() => dom.window.close());

function inputs(canvas) {
  assert.ok(canvas, 'A configured scene should wire the optional Rive canvas');
  return [canvas.dataset.payloadAlternate, canvas.dataset.powerExpanded, canvas.dataset.batteryExpanded, canvas.dataset.linkExpanded];
}

test('the three mission workbenches update the Rive inputs from their project choices', async t => {
  t.after(() => act(async () => cleanup()));
  const cases = [
    { world: 'earth', field: 'config', baseline: DEFAULT_CONFIG, expected: ['false', 'true', 'false', 'false'], changes: [['processing', 'index', [0]], ['battery', 'large', [2]], ['radio', 'fast', [3]]] },
    { world: 'bennu', field: 'expeditionConfig', baseline: DEFAULT_EXPEDITION_CONFIGS.bennu, expected: ['false', 'false', 'false', 'false'], changes: [['instrument', 'spectrometer', [0]], ['power', 'extended', [1, 2]], ['ground', 'extended', [3]]] },
    { world: 'telescope', field: 'expeditionConfig', baseline: { ...DEFAULT_EXPEDITION_CONFIGS.telescope, instrument: 'camera' }, expected: ['false', 'false', 'false', 'false'], changes: [['instrument', 'spectrometer', [0]], ['power', 'extended', [1, 2]], ['ground', 'extended', [3]]] },
  ];
  for (const { world, field, baseline, expected, changes } of cases) {
    const config = { ...baseline };
    const scene = () => React.createElement(Scene, { variant: 'hangar', world, [field]: { ...config } });
    const view = render(scene());
    const canvas = view.container.querySelector('[data-ipe-rive]');
    assert.deepEqual(inputs(canvas), expected, world);
    for (const [key, value, signals] of changes) {
      config[key] = value;
      for (const signal of signals) expected[signal] = 'true';
      await act(async () => view.rerender(scene()));
      assert.equal(view.container.querySelector('[data-ipe-rive]'), canvas);
      assert.deepEqual(inputs(canvas), expected, world + ' ' + key);
    }
    assert.equal(canvas.closest('figure').hidden, true, 'The assembly stays in its existing 2D fallback without Canvas2D');
    assert.ok(view.container.querySelector('.configured-flat svg'));
    view.unmount();
  }
});

test('Cerrado maps all four panel and battery combinations from its actual 18 W and 16 Wh default', async t => {
  t.after(() => act(async () => cleanup()));
  const view = render(React.createElement(Scene, { variant: 'hangar' }));
  const canvas = view.container.querySelector('[data-ipe-rive]');
  const base = view.container.querySelector('.scene');
  assert.equal(base.dataset.panelW, '18');
  assert.equal(base.dataset.batteryWh, '16');
  assert.deepEqual(inputs(canvas).slice(1, 3), ['true', 'false']);
  const variants = [
    [{ battery: 'large' }, ['true', 'true']],
    [{ panel: 'compact', battery: 'large' }, ['false', 'true']],
    [{ panel: 'compact', battery: 'small' }, ['false', 'false']],
    [{ panel: 'standard', battery: 'small' }, ['true', 'false']],
  ];
  for (const [change, expected] of variants) {
    await act(async () => view.rerender(React.createElement(Scene, { variant: 'hangar', config: { ...DEFAULT_CONFIG, ...change } })));
    assert.equal(view.container.querySelector('[data-ipe-rive]'), canvas);
    assert.deepEqual(inputs(canvas).slice(1, 3), expected);
  }
});

test('comparison maps A/B to the executed architectures, independently of instrument compatibility', async t => {
  t.after(() => act(async () => cleanup()));
  const cases = [
    { id: 'cerrado', aInputs: ['false', 'true', 'false', 'false'], bInputs: ['true', 'true', 'false', 'false'] },
    { id: 'bennu', aInputs: ['false', 'true', 'true', 'false'], bInputs: ['false', 'true', 'true', 'true'] },
    { id: 'telescope', aInputs: ['false', 'true', 'true', 'true'], bInputs: ['true', 'true', 'true', 'true'] },
  ];
  for (const { id, aInputs, bInputs } of cases) {
    const [a, b] = runLearningExperiment(id).trials.map(trial => trial.result);
    const saved = (letter, result) => ({ id: letter, result, createdAt: '2026-11-15T00:00:00Z', inputHash: letter, resultHash: letter });
    const view = render(id === 'cerrado' ? React.createElement(CompareDialog, { runs: [saved('B', b), saved('A', a)], onClose() {} }) : React.createElement(ExpeditionComparison, { a, b }));
    const canvas = view.container.querySelector('[data-ipe-rive]');
    assert.deepEqual(inputs(canvas), bInputs, id + ' B');
    const switchToA = view.getByRole('button', { name: id === 'cerrado' ? 'Inspecionar A no 3D' : 'Ver tentativa A' });
    await act(async () => fireEvent.click(switchToA));
    assert.equal(view.container.querySelector('[data-ipe-rive]'), canvas);
    assert.deepEqual(inputs(canvas), aInputs, id + ' A');
    view.unmount();
  }
});

test('a replay uses the recorded configuration across time changes and keeps its canvas', async t => {
  t.after(() => act(async () => cleanup()));
  const result = simulateExpedition('bennu', { ...DEFAULT_EXPEDITION_CONFIGS.bennu, power: 'extended', ground: 'extended' });
  const scene = timeS => React.createElement(Scene, { variant: 'orbit', world: 'bennu', expeditionConfig: result.config, visualState: getExpeditionVisualState(result, timeS) });
  const view = render(scene(0));
  const canvas = view.container.querySelector('[data-ipe-rive]');
  assert.deepEqual(inputs(canvas), ['false', 'true', 'true', 'true']);
  await act(async () => view.rerender(scene(2_200)));
  assert.equal(view.container.querySelector('[data-ipe-rive]'), canvas);
  assert.deepEqual(inputs(canvas), ['false', 'true', 'true', 'true']);
});

test('Rive plays its startup and choice windows in engine time and pauses outside the scene', t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const calls = [];
  const rive = {
    isPlaying: false,
    play() { this.isPlaying = true; calls.push('play'); this.startRendering(); },
    pause() { this.isPlaying = false; calls.push('pause'); },
    startRendering() { calls.push('start'); },
    stopRendering() { calls.push('stop'); },
    drawFrame() { calls.push('reset-clock'); },
  };
  const inputs = { payloadAlternate: { value: false }, powerExpanded: { value: false }, batteryExpanded: { value: false }, linkExpanded: { value: false } };
  const artwork = { rive, inputs, remainingSeconds: 3.2 };
  const state = { active: true, payloadAlternate: false, powerExpanded: true, batteryExpanded: false, linkExpanded: false };
  updateArtwork(artwork, state);
  t.mock.timers.tick(10_000);
  assert.equal(rive.isPlaying, true, 'wall time cannot freeze the splash before it has rendered');
  advanceArtwork(artwork, 2.6);
  assert.equal(rive.isPlaying, true);
  advanceArtwork(artwork, .65);
  assert.equal(calls.at(-1), 'pause');
  assert.equal(rive.isPlaying, false);
  updateArtwork(artwork, { ...state, batteryExpanded: true });
  assert.equal(inputs.batteryExpanded.value, true);
  advanceArtwork(artwork, .4);
  assert.equal(rive.isPlaying, true);
  updateArtwork(artwork, { ...state, batteryExpanded: true, payloadAlternate: true });
  advanceArtwork(artwork, .4);
  assert.equal(rive.isPlaying, true, 'a newer choice gets its full transition window');
  advanceArtwork(artwork, .21);
  assert.equal(rive.isPlaying, false);
  updateArtwork(artwork, state);
  updateArtwork(artwork, { ...state, active: false });
  assert.deepEqual(calls.slice(-2), ['pause', 'stop']);
  advanceArtwork(artwork, 8);
  assert.equal(artwork.remainingSeconds, .6, 'frames are not advanced while the scene is inactive');
  updateArtwork(artwork, state);
  assert.deepEqual(calls.slice(-3), ['reset-clock', 'play', 'start']);
});

test('the scene uses the newest entry from each viewport observation', async t => {
  const previous = globalThis.IntersectionObserver;
  let observe;
  globalThis.IntersectionObserver = class {
    constructor(callback) { observe = callback; }
    observe() {}
    disconnect() {}
  };
  t.after(async () => { await act(async () => cleanup()); globalThis.IntersectionObserver = previous; });
  const view = render(React.createElement(Scene, { variant: 'hangar' }));
  await act(async () => observe([{ isIntersecting: false }, { isIntersecting: true }]));
  assert.equal(view.container.querySelector('.rive-subsystems').dataset.riveActive, 'true');
});

test('starting and switching to reduced motion retains the static equipment illustration', async t => {
  const previous = dom.window.matchMedia;
  const listeners = new Set();
  const motion = { matches: true, addEventListener(_type, listener) { listeners.add(listener); }, removeEventListener(_type, listener) { listeners.delete(listener); } };
  dom.window.matchMedia = () => motion;
  t.after(async () => { await act(async () => cleanup()); dom.window.matchMedia = previous; });
  const view = render(React.createElement(Scene, { variant: 'hangar' }));
  assert.equal(view.container.querySelector('[data-ipe-rive]'), null);
  assert.ok(view.container.querySelector('.configured-flat svg'));
  await act(async () => { motion.matches = false; listeners.forEach(listener => listener()); });
  assert.ok(view.container.querySelector('[data-ipe-rive]'));
  await act(async () => { motion.matches = true; listeners.forEach(listener => listener()); });
  assert.equal(view.container.querySelector('[data-ipe-rive]'), null);
  assert.ok(view.container.querySelector('.configured-flat svg'));
});
