import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { build } from 'esbuild';
import { JSDOM } from 'jsdom';

// Use real Three scene/material/texture objects; only GPU creation and image I/O
// are controlled here. These checks do not claim browser rendering or FPS proof.
const root = fileURLToPath(new URL('../', import.meta.url));
const temporary = await mkdtemp(join(root, '.test-lobby-r29-'));
after(async () => { delete globalThis.__lobbyTest; await rm(temporary, { recursive: true, force: true }); });
const output = join(temporary, 'renderer.mjs');
await build({ entryPoints: [join(root, 'src/ui/LobbySceneRenderer.ts')], outfile: output, bundle: true, packages: 'external', platform: 'node', format: 'esm', jsx: 'automatic', logLevel: 'silent', plugins: [{
  name: 'controlled-gpu', setup(builder) {
    builder.onResolve({ filter: /^three$/ }, args => args.namespace === 'controlled-gpu' ? { path: 'three', external: true } : { path: 'three', namespace: 'controlled-gpu' });
    builder.onLoad({ filter: /.*/, namespace: 'controlled-gpu' }, () => ({ contents: `
      export * from 'three';
      import { Texture } from 'three';
      export class WebGLRenderer {
        constructor(){ this.domElement=document.createElement('canvas'); this.capabilities={getMaxAnisotropy:()=>4}; this.info={render:{calls:0,triangles:0}}; this.draws=0; globalThis.__lobbyTest.renderers.push(this); }
        setPixelRatio(value){this.dpr=value} getPixelRatio(){return this.dpr} setClearColor(){} setSize(){}
        render(scene){this.scene=scene;this.draws++} dispose(){this.disposed=true} forceContextLoss(){this.lost=true}
      }
      export class TextureLoader {
        loadAsync(url){return new Promise((resolve,reject)=>{ const texture=new Texture();let disposed=0;texture.addEventListener('dispose',()=>disposed++);globalThis.__lobbyTest.requests.push({url,texture,resolve:()=>resolve(texture),reject,disposed:()=>disposed}); });}
      }
    ` }));
  },
}] });
const { createLobbyScene } = await import(pathToFileURL(output).href);
const flush = async () => { await new Promise(resolve => setImmediate(resolve)); };

function environment(t, { reduced = false, viewport = 1200 } = {}) {
  const dom = new JSDOM('<!doctype html><div id="scene"></div>', { pretendToBeVisual: true });
  const { window } = dom;
  const driver = { renderers: [], requests: [] };
  globalThis.__lobbyTest = driver;
  globalThis.window = window; globalThis.document = window.document;
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: viewport });
  Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 2 });
  const media = new window.EventTarget(); media.matches = reduced;
  window.matchMedia = () => media;
  let hidden = false;
  Object.defineProperty(window.document, 'hidden', { get: () => hidden });
  const frames = new Map(); let nextFrame = 0;
  window.requestAnimationFrame = callback => { const id = ++nextFrame; frames.set(id, callback); return id; };
  window.cancelAnimationFrame = id => frames.delete(id);
  let resizeCallback, intersectionCallback;
  globalThis.ResizeObserver = class { constructor(callback) { resizeCallback = callback; } observe() {} disconnect() {} };
  globalThis.IntersectionObserver = class { constructor(callback) { intersectionCallback = callback; } observe() {} disconnect() {} };
  const host = window.document.getElementById('scene');
  let height = 900;
  Object.defineProperties(host, { clientWidth: { get: () => window.innerWidth }, clientHeight: { get: () => height } });
  let controller;
  const ready = [];
  t.after(() => { controller?.dispose(); dom.window.close(); delete globalThis.ResizeObserver; delete globalThis.IntersectionObserver; });
  return {
    driver, frames, host, ready,
    start(mission = 'iss', paused = false) { controller = createLobbyScene(host, mission, paused, value => ready.push(value)); return controller; },
    setHidden(value) { hidden = value; window.document.dispatchEvent(new window.Event('visibilitychange')); },
    setReduced(value) { media.matches = value; media.dispatchEvent(new window.Event('change')); },
    setVisible(value) { intersectionCallback([{ isIntersecting: value }]); },
    resize(width, nextHeight = height) { Object.defineProperty(window, 'innerWidth', { value: width }); height = nextHeight; resizeCallback(); },
    loseContext() { driver.renderers[0].domElement.dispatchEvent(new window.Event('webglcontextlost', { cancelable: true })); },
  };
}

test('only the selected texture loads; late responses cannot replace the selected destination', async t => {
  const e = environment(t), controller = e.start();
  assert.deepEqual(e.driver.requests.map(request => request.url), ['./textures/lobby/earth.webp']);
  e.driver.requests[0].resolve(); await flush();
  assert.equal(e.ready.at(-1), true);
  controller.setMission('moon'); assert.equal(e.ready.at(-1), false);
  controller.setMission('mars');
  e.driver.requests[1].resolve(); await flush();
  assert.equal(e.ready.at(-1), false);
  e.driver.requests[2].resolve(); await flush();
  assert.equal(e.ready.at(-1), true);
  controller.setMission('cerrado'); await flush();
  assert.equal(e.driver.requests.length, 3, 'ISS and Cerrado share their Earth texture');
  controller.setPaused(true);
  const bodies = e.driver.renderers[0].scene.children.filter(node => ['earth', 'moon', 'mars'].includes(node.name));
  assert.deepEqual(bodies.filter(body => body.visible).map(body => body.name), ['earth']);
});

test('pause, reduced motion, hidden tabs, offscreen and zero-height stages suspend the single animation loop', async t => {
  const e = environment(t, { reduced: true }), controller = e.start();
  e.driver.requests[0].resolve(); await flush();
  assert.equal(e.frames.size, 0);
  e.setReduced(false); assert.equal(e.frames.size, 1);
  controller.setPaused(true); assert.equal(e.frames.size, 0);
  controller.setMission('moon'); e.driver.requests[1].resolve(); await flush();
  assert.equal(e.ready.at(-1), true); assert.equal(e.frames.size, 0, 'selection still renders while paused');
  controller.setPaused(false); assert.equal(e.frames.size, 1);
  e.setHidden(true); assert.equal(e.frames.size, 0);
  e.setHidden(false); assert.equal(e.frames.size, 1);
  e.setVisible(false); assert.equal(e.frames.size, 0);
  e.setVisible(true); assert.equal(e.frames.size, 1);
  e.resize(1200, 0); assert.equal(e.frames.size, 0);
  e.resize(1200, 900); assert.equal(e.frames.size, 1);
});

test('mobile resize caps DPR at one and context loss cannot be cleared by a late asset or another mission', async t => {
  const e = environment(t), controller = e.start();
  const renderer = e.driver.renderers[0];
  assert.equal(renderer.getPixelRatio(), 1.5);
  e.resize(390); assert.equal(renderer.getPixelRatio(), 1);
  e.loseContext(); assert.equal(e.ready.at(-1), false); assert.equal(e.frames.size, 0);
  e.driver.requests[0].resolve(); await flush();
  assert.equal(e.ready.at(-1), false);
  controller.setMission('europa'); await flush();
  assert.equal(e.driver.requests.length, 1); assert.equal(e.frames.size, 0);
});

test('unmount releases pending and loaded textures, the renderer and scheduled work', async t => {
  const e = environment(t), controller = e.start();
  e.driver.requests[0].resolve(); await flush();
  controller.setMission('moon');
  controller.dispose();
  e.driver.requests[1].resolve(); await flush();
  assert.deepEqual(e.driver.requests.map(request => request.disposed()), [1, 1]);
  assert.equal(e.driver.renderers[0].disposed, true);
  assert.equal(e.driver.renderers[0].lost, true);
  assert.equal(e.frames.size, 0); assert.equal(e.host.querySelector('canvas'), null);
});
