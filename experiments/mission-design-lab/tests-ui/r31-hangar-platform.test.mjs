import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { act } from 'react';
import { JSDOM } from 'jsdom';
import * as THREE from 'three';
import { createRoot, extend } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import BrunoHangarScene from '../src/ui/BrunoHangarScene.tsx';
import OrbitalScene from '../src/ui/OrbitalScene.tsx';
import { DEFAULT_CONFIG } from '../src/core/catalog.ts';
import { DEFAULT_BRUNO_CONFIG } from '../src/lab/bruno-missions.ts';
import { DEFAULT_EXPEDITION_CONFIGS } from '../src/lab/scientific-expeditions.ts';
import { getSpacecraftPresentation } from '../src/lab/spacecraft-presentation.ts';
import { getSceneSchedule } from '../src/ui/r30-scene-state.ts';

const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://mission.test/' });
extend(THREE);
for (const name of ['window', 'document', 'navigator']) Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name] });
dom.window.matchMedia = () => ({ matches: true });
dom.window.HTMLCanvasElement.prototype.getContext = () => null;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.self = globalThis;
class TestBitmap {
  width = 512;
  height = 512;
  closed = false;
  close() { this.closed = true; }
}
globalThis.ImageBitmap = TestBitmap;
globalThis.createImageBitmap = async blob => {
  assert.equal(blob.type, 'image/png');
  return new TestBitmap();
};
after(() => dom.window.close());

const assetPath = 'public/models/kenney/structure-platform.glb';
const assetUrl = './models/kenney/structure-platform.glb';
const onUnavailable = () => assert.fail('the Kenney asset must not disable the 3D spacecraft');
const platform = scene => scene.getObjectByName('kenney-structure-platform');
const bounds = object => new THREE.Box3().setFromObject(object, true);

async function mount(t, view, width = 278, height = 184) {
  const canvas = document.createElement('canvas');
  const cameraProps = view.props.camera;
  const camera = new THREE.PerspectiveCamera(cameraProps.fov, width / height, .1, 40);
  camera.position.fromArray(cameraProps.position);
  const root = createRoot(canvas);
  await root.configure({ camera, gl: { domElement: canvas, render() {}, setSize() {}, setPixelRatio() {} }, size: { width, height }, dpr: 1, frameloop: 'never' });
  t.after(async () => act(async () => root.unmount()));
  let store;
  await act(async () => { store = root.render(view.props.children); });
  return { canvas, camera, scene: store.getState().scene, update: next => act(async () => root.render(next.props.children)) };
}

function useLocalAsset(t) {
  const requests = [];
  t.mock.method(GLTFLoader.prototype, 'loadAsync', function(url) {
    assert.equal(url, assetUrl);
    const request = readFile(assetPath).then(bytes => this.parseAsync(Uint8Array.from(bytes).buffer, ''));
    requests.push(request);
    return request;
  });
  return requests;
}

function bruno(id, options = {}) {
  return BrunoHangarScene({ missionId: id, config: { ...DEFAULT_BRUNO_CONFIG, launcher: 'heavy', energy: 'extended' }, active: 'energy', turn: Math.PI / 4, exploded: true, onPart() {}, onUnavailable, ...options });
}

function orbital(world, options = {}) {
  const input = world === 'earth' ? { world, config: DEFAULT_CONFIG } : { world, expeditionConfig: DEFAULT_EXPEDITION_CONFIGS[world] };
  const scheduleInput = world === 'earth' ? input : { world, config: input.expeditionConfig };
  return OrbitalScene({ focus: 'satellite', progress: 0, config: DEFAULT_CONFIG, variant: 'hangar', active: false, animating: false, reducedMotion: true, turn: Math.PI / 3, onUnavailable, world, presentation: getSpacecraftPresentation(input), schedule: getSceneSchedule(scheduleInput), segment: 'launch', exploded: true, ...options });
}

test('the Kenney copy matches the verified GLB and its CC0 manifest', async () => {
  const asset = await readFile(assetPath);
  const manifest = JSON.parse(await readFile('public/models/kenney/manifest.json', 'utf8'));
  assert.equal(asset.subarray(0, 4).toString(), 'glTF');
  assert.equal(asset.readUInt32LE(4), 2);
  assert.equal(asset.length, 17_200);
  assert.equal(manifest.bytes, asset.length);
  assert.equal(manifest.sha256, 'bd1b99a3adea5f4567935a234e8d57ab09af34931b43002862b08a0746075d99');
  assert.equal(createHash('sha256').update(asset).digest('hex'), manifest.sha256);
  assert.equal(manifest.author, 'Kenney');
  assert.equal(manifest.license, 'CC0-1.0');
  assert.equal(manifest.sourcePage, 'https://poly.pizza/m/ovwrUrwADe');
  const gltf = JSON.parse(asset.subarray(20, 20 + asset.readUInt32LE(12)).toString());
  assert.equal(gltf.accessors[gltf.meshes[0].primitives[0].indices].count / 3, 96);
  assert.ok([...gltf.images, ...gltf.buffers].every(item => item.uri === undefined));
  assert.equal(gltf.extensionsRequired?.length ?? 0, 0);
});

for (const [mission, world] of Object.entries({ iss: 'iss', moon: 'moon', mars: 'mars', europa: 'europa', cerrado: 'earth', bennu: 'bennu', webb: 'telescope' })) {
  const scientific = ['earth', 'bennu', 'telescope'].includes(world);
  test(`${mission} mounts the local platform below the separated spacecraft`, async t => {
    const loads = useLocalAsset(t);
    const view = await mount(t, scientific ? orbital(world) : bruno(world));
    assert.equal(loads.length, 1);
    await act(async () => { await loads[0]; });
    const model = platform(view.scene);
    assert.ok(model);
    assert.equal(view.canvas.dataset.hangarPlatform, 'kenney');
    const deck = bounds(model);
    const craft = bounds(view.scene.getObjectByName(scientific ? `ipe-spacecraft-${world}` : 'configured-bruno-spacecraft'));
    assert.ok(craft.min.y > deck.max.y, `spacecraft bottom ${craft.min.y} must clear the deck at ${deck.max.y}`);
    const launcher = view.scene.children.find(child => /^(?:planned-)?launcher-/.test(child.name));
    if (world !== 'earth') {
      assert.ok(launcher);
      const foot = bounds(launcher);
      assert.ok(Math.abs(foot.min.y - deck.max.y) < .001);
      assert.ok(foot.min.x > deck.min.x && foot.max.x < deck.max.x && foot.min.z > deck.min.z && foot.max.z < deck.max.z);
    }
    const ray = new THREE.Raycaster(new THREE.Vector3(0, 2, -.2), new THREE.Vector3(0, -1, 0));
    assert.equal(ray.intersectObject(model).length, 0);
  });
}

test('the Bruno flight scene releases the platform when the launcher is approved', async t => {
  const loads = useLocalAsset(t);
  const view = await mount(t, bruno('iss'));
  await act(async () => { await loads[0]; });
  assert.deepEqual(view.camera.position.toArray(), [.35, 1.65, 7.1]);
  const loaded = platform(view.scene);
  assert.ok(loaded);
  let mesh;
  loaded.traverse(node => { if (node instanceof THREE.Mesh) mesh = node; });
  const bitmap = mesh.material.map.image;
  const disposed = [];
  for (const resource of [mesh.geometry, mesh.material, mesh.material.map]) resource.addEventListener('dispose', () => disposed.push(resource));
  await view.update(bruno('iss', { flightEvent: { phase: 'launch', timeS: 0, state: 'ok' } }));
  assert.equal(platform(view.scene), undefined);
  assert.equal(view.canvas.dataset.hangarPlatform, undefined);
  assert.deepEqual(view.camera.position.toArray(), [0, 1.1, 6.7]);
  assert.equal(disposed.length, 3);
  assert.equal(bitmap.closed, true);
});

test('a failed request keeps the fallback deck and spacecraft in 3D', async t => {
  t.mock.method(GLTFLoader.prototype, 'loadAsync', async () => { throw new Error('model offline'); });
  const view = await mount(t, orbital('earth'));
  assert.equal(platform(view.scene), undefined);
  assert.equal(view.canvas.dataset.hangarPlatform, 'fallback');
  assert.ok(view.scene.getObjectByName('hangar-platform-fallback'));
  assert.ok(view.scene.getObjectByName('ipe-spacecraft-earth'));
});
