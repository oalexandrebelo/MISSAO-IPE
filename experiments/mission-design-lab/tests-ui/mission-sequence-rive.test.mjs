import test, { after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><body></body>', { pretendToBeVisual: true });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLCanvasElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle']) {
  Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name], writable: true });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.matchMedia = () => ({ matches: true });
const { render, cleanup } = await import('@testing-library/react');
const { MissionSequenceRive } = await import('../src/ui/MissionSequenceRive.tsx');
afterEach(cleanup);
after(() => dom.window.close());

test('the mission sequence gives all stages and outcomes in HTML with reduced motion', t => {
  const canvasContext = t.mock.method(dom.window.HTMLCanvasElement.prototype, 'getContext', () => null);
  const view = render(React.createElement(MissionSequenceRive, { stage: 0 }));
  const steps = view.getByRole('list', { name: 'Etapas da simulação' });
  assert.deepEqual(Array.from(steps.children, child => child.textContent), ['Decisão', 'Lançamento', 'Coleta', 'Recepção']);
  const canvas = view.container.querySelector('canvas');
  const expectations = [
    [0, 'Decisão'], [1, 'Lançamento'], [2, 'Coleta'], [3, 'Recepção'],
    [4, 'Recepção', 'Missão concluída'], [5, undefined, 'Missão incompleta'], [6, 'Decisão', 'Lançamento bloqueado'], [0, 'Decisão'],
  ];
  for (const [stage, step, result] of expectations) {
    view.rerender(React.createElement(MissionSequenceRive, { stage }));
    assert.equal(steps.querySelector('[aria-current="step"]')?.textContent, step);
    assert.equal(view.container.querySelector('figcaption')?.textContent, result);
    assert.equal(canvas.hidden, true);
  }
  assert.equal(canvasContext.mock.callCount(), 0);
});

test('the HTML progression stays available when Canvas2D is unavailable', () => {
  dom.window.matchMedia = () => ({ matches: false });
  dom.window.HTMLCanvasElement.prototype.getContext = () => null;
  const view = render(React.createElement(MissionSequenceRive, { stage: 3 }));
  assert.equal(view.getByRole('list', { name: 'Etapas da simulação' }).querySelector('[aria-current="step"]')?.textContent, 'Recepção');
  assert.equal(view.container.querySelector('canvas').dataset.missionRive, 'static');
});
