import test, { after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://mission.test/', pretendToBeVisual: true });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLCanvasElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle']) Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name] });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.HTMLCanvasElement.prototype.getContext = () => null;
dom.window.matchMedia = () => ({ matches: true });
const { render, cleanup, act, screen } = await import('@testing-library/react');
const { Scene } = await import('../src/ui/Scene.tsx');
const { DEFAULT_CONFIG } = await import('../src/core/catalog.ts');
const { DEFAULT_EXPEDITION_CONFIGS } = await import('../src/lab/scientific-expeditions.ts');
afterEach(async () => act(async () => cleanup())); after(() => dom.window.close());

test('2D equivalence visibly resizes the memory and changes contact permission without requiring WebGL', async () => {
  let view;
  await act(async () => { view = render(React.createElement(Scene, { variant: 'hangar', config: { ...DEFAULT_CONFIG, buffer: 'compact' } })); });
  assert.match(document.body.textContent, /3D indisponível/);
  const small = Number(view.container.querySelector('[data-buffer-bits] rect').getAttribute('height'));
  const contacts = [...view.container.querySelectorAll('[data-window="contacts"]')];
  const widths = contacts.map(node => node.style.width);
  assert.deepEqual(contacts.map(node => node.dataset.permitted), ['true', 'true']);
  await act(async () => view.rerender(React.createElement(Scene, { variant: 'hangar', config: { ...DEFAULT_CONFIG, buffer: 'large', policy: 'last-contact' } })));
  assert.ok(Number(view.container.querySelector('[data-buffer-bits] rect').getAttribute('height')) > small);
  assert.deepEqual([...view.container.querySelectorAll('[data-window="contacts"]')].map(node => node.dataset.permitted), ['false', 'true']);
  assert.deepEqual([...view.container.querySelectorAll('[data-window="contacts"]')].map(node => node.style.width), widths);
  assert.ok(screen.getByText(/Agenda prevista, ainda sem execução/));
});

for (const world of ['bennu', 'telescope']) test(`${world}: contact and lifetime choices remain visible with the same antenna`, async () => {
  let view;
  const config = { ...DEFAULT_EXPEDITION_CONFIGS[world], ground: 'short', duration: 'full' };
  await act(async () => { view = render(React.createElement(Scene, { world, variant: 'hangar', expeditionConfig: config })); });
  const before = Number.parseFloat(view.container.querySelector('[data-window="contacts"]').style.width);
  await act(async () => view.rerender(React.createElement(Scene, { world, variant: 'hangar', expeditionConfig: { ...config, ground: 'extended', duration: 'short', orbit: 'far', launch: 'science' } })));
  assert.ok(Number.parseFloat(view.container.querySelector('[data-window="contacts"]').style.width) > before);
  assert.equal(view.container.querySelector('.scene').dataset.radioHardware, 'generic');
  assert.equal(view.container.querySelector('.r30-scene-schedule').dataset.lifetimeS, '7200');
  assert.equal(view.container.querySelector('.r30-scene-schedule').dataset.launcher, 'science');
  assert.equal([...view.container.querySelectorAll('[data-window="contacts"]')].at(-1).dataset.permitted, 'false');
  assert.match(document.body.textContent, /A agenda não garante entrega/);
});
