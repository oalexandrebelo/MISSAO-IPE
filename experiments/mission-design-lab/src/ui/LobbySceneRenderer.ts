import * as THREE from 'three';
import type { LobbyMissionId } from './LobbyScene.tsx';

const BASE = import.meta.env?.BASE_URL ?? './';
const BODIES = { iss: 'earth', cerrado: 'earth', moon: 'moon', mars: 'mars', europa: 'europa', bennu: 'bennu', telescope: 'telescope' } as const;
type Body = typeof BODIES[LobbyMissionId];
const ANGLES: Record<LobbyMissionId, number> = { iss: .12, cerrado: -.42, moon: -.15, mars: .23, europa: -.28, bennu: .3, telescope: -.25 };
const ATMOSPHERE_VERTEX = `varying vec3 worldNormal; varying vec3 worldPosition;
void main(){ vec4 p=modelMatrix*vec4(position,1.0); worldPosition=p.xyz; worldNormal=normalize(mat3(modelMatrix)*normal); gl_Position=projectionMatrix*viewMatrix*p; }`;
const ATMOSPHERE_FRAGMENT = `varying vec3 worldNormal; varying vec3 worldPosition; uniform float opacity;
void main(){ vec3 n=normalize(worldNormal); vec3 v=normalize(cameraPosition-worldPosition);
float rim=pow(1.0-abs(dot(n,v)),4.2); float sunlight=smoothstep(-.25,.7,dot(n,normalize(vec3(-8.0,6.0,4.0))));
gl_FragColor=vec4(vec3(.24,.48,.65),rim*sunlight*.38*opacity);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`;
interface Visual { group: THREE.Group; materials: { material: THREE.Material; opacity: number; transparent: boolean; depthWrite: boolean }[]; disposeModel?: () => void; }
export interface LobbySceneController { setMission: (mission: LobbyMissionId) => void; setPaused: (paused: boolean) => void; dispose: () => void; }

export function createLobbyScene(host: HTMLDivElement, initialMission: LobbyMissionId, initialPaused: boolean, onReady: (ready: boolean) => void): LobbySceneController {
  let mobile = window.innerWidth < 768;
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !mobile, powerPreference: 'low-power', stencil: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
  renderer.setClearColor(0x060c14, 0);
  const canvas = renderer.domElement;
  canvas.style.cssText = 'display:block;width:100%;height:100%;position:absolute;inset:0;pointer-events:none';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
  scene.add(new THREE.AmbientLight('#a4b8cc', .045));
  const sunlight = new THREE.DirectionalLight('#fff0db', 3.1); sunlight.position.set(-8, 6, 4); scene.add(sunlight);
  const fill = new THREE.DirectionalLight('#7590a8', .12); fill.position.set(4, 1, -6); scene.add(fill);
  const points = new Float32Array(210 * 3);
  let seed = 12419;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < points.length; i += 3) { points[i] = (random() - .5) * 50; points[i + 1] = (random() - .25) * 28; points[i + 2] = -8 - random() * 20; }
  const starsGeometry = new THREE.BufferGeometry(); starsGeometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
  const starsMaterial = new THREE.PointsMaterial({ color: '#b6c3cc', size: .027, transparent: true, opacity: .58, depthWrite: false, toneMapped: false });
  scene.add(new THREE.Points(starsGeometry, starsMaterial));
  const assets = new Map<Body, Promise<Visual>>(), loaded = new Set<Visual>();
  const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let disposed = false, failed = false, contextLost = false, paused = initialPaused, reduced = motion?.matches ?? false, visible = !document.hidden, inViewport = true;
  let mission = initialMission, selection = 0, width = 0, height = 0, frame = 0, last = 0, lastDraw = 0, angle = ANGLES[mission], drift = 0;
  let current: Visual | null = null;
  let transition: { previous: Visual | null; next: Visual; elapsed: number; from: number; to: number } | null = null;
  const canDraw = () => !disposed && !failed && !contextLost && visible && inViewport && width > 0 && height > 0;
  const moving = () => canDraw() && !paused && !reduced;

  function opacity(visual: Visual, value: number) {
    for (const original of visual.materials) {
      const material = original.material;
      const transparent = value < 1 || original.transparent;
      if (material.transparent !== transparent) { material.transparent = transparent; material.needsUpdate = true; }
      material.opacity = original.opacity * value; material.depthWrite = value < 1 ? false : original.depthWrite;
      if (material instanceof THREE.ShaderMaterial && material.uniforms.opacity) material.uniforms.opacity.value = value;
    }
  }
  function positionCamera() { camera.position.set(Math.sin(angle) * 7, .12, Math.cos(angle) * 7); camera.lookAt(0, 0, 0); }
  function render() {
    if (!canDraw()) return;
    positionCamera(); renderer.render(scene, camera);
    canvas.dataset.drawCalls = String(renderer.info.render.calls);
    canvas.dataset.triangles = String(renderer.info.render.triangles);
    canvas.dataset.dpr = String(renderer.getPixelRatio());
  }
  function finishTransition() {
    if (!transition) return;
    if (transition.previous && transition.previous !== transition.next) { transition.previous.group.visible = false; opacity(transition.previous, 1); }
    opacity(transition.next, 1); angle = transition.to; transition = null;
  }
  function tick(now: number) {
    frame = 0;
    if (!moving()) return;
    const delta = Math.min((now - last) / 1000, .05); last = now;
    if (transition) {
      transition.elapsed = Math.min(.7, transition.elapsed + delta);
      const eased = 1 - (1 - transition.elapsed / .7) ** 4;
      angle = THREE.MathUtils.lerp(transition.from, transition.to, eased);
      if (transition.previous !== transition.next) {
        if (transition.previous) opacity(transition.previous, 1 - eased);
        opacity(transition.next, eased);
      }
      if (transition.elapsed === .7) finishTransition();
    }
    drift += delta;
    if (current) {
      if (mission === 'telescope') current.group.rotation.y = Math.sin(drift * .1) * .08;
      else current.group.rotation.y += delta * .018;
    }
    if (now - lastDraw >= (mobile ? 1000 / 30 : 1000 / 60) - 1) { render(); lastDraw = now; }
    frame = window.requestAnimationFrame(tick);
  }
  function sync() {
    if (frame) { window.cancelAnimationFrame(frame); frame = 0; }
    canvas.dataset.motion = moving() ? 'running' : canDraw() ? 'static' : 'hidden';
    if (!moving()) finishTransition();
    render();
    if (moving()) { last = performance.now(); frame = window.requestAnimationFrame(tick); }
  }
  function disposeVisual(visual: Visual) {
    if (visual.disposeModel) { visual.disposeModel(); return; }
    const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>();
    visual.group.traverse(node => { if (node instanceof THREE.Mesh) { geometries.add(node.geometry); (Array.isArray(node.material) ? node.material : [node.material]).forEach(material => materials.add(material)); } });
    materials.forEach(material => { Object.values(material).forEach(value => { if (value instanceof THREE.Texture) textures.add(value); }); material.dispose(); });
    textures.forEach(texture => texture.dispose()); geometries.forEach(geometry => geometry.dispose());
  }
  async function asset(body: Body): Promise<Visual> {
    const group = new THREE.Group(); group.name = body; group.position.y = body === 'telescope' ? -.9 : -4;
    let disposeModel: (() => void) | undefined;
    if (body === 'bennu' || body === 'telescope') {
      const [{ GLTFLoader }, { DRACOLoader }] = await Promise.all([import('three/addons/loaders/GLTFLoader.js'), import('three/addons/loaders/DRACOLoader.js')]);
      const decoder = new DRACOLoader().setDecoderPath(`${BASE}models/nasa/draco/`).setWorkerLimit(1);
      let model: THREE.Group;
      try {
        model = (await new GLTFLoader().setDRACOLoader(decoder).loadAsync(`${BASE}models/nasa/${body === 'telescope' ? 'jwst-a' : 'bennu-1999-rq36'}.glb`)).scene;
        if (body === 'telescope') {
          const helpers = await import('./OrbitalScene.tsx');
          model = helpers.mergeJWSTForDisplay(model);
          disposeModel = () => helpers.disposeAsset(group);
        }
      } finally { decoder.dispose(); }
      const box = new THREE.Box3().setFromObject(model), size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      const normalized = new THREE.Group(); normalized.add(model); normalized.scale.setScalar((body === 'telescope' ? 4.4 : 7.6) / Math.max(size.x, size.y, size.z));
      // The verified GLB's gold mirror normals face +X, not +Z. Keep that
      // face toward the Webb camera, with only a small bounded idle drift.
      normalized.rotation.set(body === 'telescope' ? -.12 : .08, body === 'telescope' ? -Math.PI / 2 + ANGLES.telescope : .5, body === 'telescope' ? .04 : .05);
      group.add(normalized);
      if (body === 'telescope') { const modelFill = new THREE.PointLight('#e2e9f0', 20, 12); modelFill.position.set(1, 2, 4); group.add(modelFill); }
    } else {
      const texture = await new THREE.TextureLoader().loadAsync(`${BASE}textures/lobby/${body}.webp`);
      texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      const geometry = new THREE.SphereGeometry(3.8, mobile ? 64 : 96, mobile ? 40 : 64);
      const surface = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ map: texture, roughness: .94, metalness: 0 }));
      surface.rotation.y = body === 'earth' ? -.5 : body === 'mars' ? .4 : -.8;
      group.add(surface);
      if (body === 'earth') group.add(new THREE.Mesh(new THREE.SphereGeometry(3.845, mobile ? 64 : 96, mobile ? 40 : 64), new THREE.ShaderMaterial({ uniforms: { opacity: { value: 1 } }, vertexShader: ATMOSPHERE_VERTEX, fragmentShader: ATMOSPHERE_FRAGMENT, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })));
    }
    const unique = new Set<THREE.Material>();
    group.traverse(node => { if (node instanceof THREE.Mesh) (Array.isArray(node.material) ? node.material : [node.material]).forEach(material => unique.add(material)); });
    const visual = { group, disposeModel, materials: [...unique].map(material => ({ material, opacity: material.opacity, transparent: material.transparent, depthWrite: material.depthWrite })) };
    if (disposed) disposeVisual(visual); else { loaded.add(visual); group.visible = false; scene.add(group); }
    return visual;
  }
  function setMission(next: LobbyMissionId) {
    if (contextLost || disposed) return;
    mission = next; const token = ++selection, body = BODIES[next];
    if (current?.group.name !== body) { failed = true; sync(); onReady(false); }
    if (!assets.has(body)) assets.set(body, asset(body));
    void assets.get(body)!.then(visual => {
      if (disposed || contextLost || token !== selection) return;
      failed = false; finishTransition();
      const previous = current; current = visual; visual.group.visible = true;
      transition = { previous, next: visual, elapsed: 0, from: angle, to: ANGLES[next] };
      if (previous !== visual) opacity(visual, previous && moving() ? 0 : 1);
      if (!previous || !moving()) finishTransition();
      sync(); onReady(true);
    }).catch(() => { assets.delete(body); if (!disposed && token === selection) { failed = true; sync(); onReady(false); } });
  }
  function resize() {
    width = host.clientWidth; height = host.clientHeight;
    mobile = window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5));
    renderer.setSize(Math.max(width, 1), Math.max(height, 1), false);
    camera.aspect = Math.max(width, 1) / Math.max(height, 1); camera.updateProjectionMatrix(); sync();
  }
  const onVisibility = () => { visible = !document.hidden; sync(); };
  const onMotion = () => { reduced = motion?.matches ?? false; sync(); };
  const onLost = (event: Event) => { event.preventDefault(); contextLost = true; sync(); onReady(false); };
  const resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
  resizeObserver?.observe(host); window.addEventListener('resize', resize);
  const intersection = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => { inViewport = entries[0]?.isIntersecting ?? true; sync(); }) : null;
  intersection?.observe(host);
  document.addEventListener('visibilitychange', onVisibility); motion?.addEventListener?.('change', onMotion); canvas.addEventListener('webglcontextlost', onLost);
  resize(); setMission(initialMission);
  return {
    setMission,
    setPaused(value) { paused = value; sync(); },
    dispose() {
      if (disposed) return;
      disposed = true; selection++; if (frame) window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect(); intersection?.disconnect(); window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility); motion?.removeEventListener?.('change', onMotion); canvas.removeEventListener('webglcontextlost', onLost);
      loaded.forEach(disposeVisual); starsGeometry.dispose(); starsMaterial.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    },
  };
}
