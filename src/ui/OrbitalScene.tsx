import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { SceneFocus } from './Scene.tsx';

function earthPatch(points: readonly [number, number][], color: number, globe: THREE.Group, resources: Set<THREE.BufferGeometry | THREE.Material>) {
  const shape = new THREE.Shape();
  points.forEach(([x, y], index) => { if (index === 0) shape.moveTo(x, y); else shape.lineTo(x, y); });
  shape.closePath();
  const geometry = new THREE.ShapeGeometry(shape);
  const material = new THREE.MeshStandardMaterial({ color, roughness: 1, side: THREE.DoubleSide });
  resources.add(geometry); resources.add(material);
  const patch = new THREE.Mesh(geometry, material);
  patch.rotation.x = -Math.PI / 2;
  patch.position.y = 0.146;
  globe.add(patch);
}

export default function OrbitalScene({ focus, progress, onUnavailable }: { focus: SceneFocus; progress: number; onUnavailable: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const focusRef = useRef(focus);
  const progressRef = useRef(progress);
  const [failed, setFailed] = useState(false);
  const requestDraw = useRef<() => void>(() => undefined);
  useEffect(() => { if (failed) onUnavailable(); }, [failed, onUnavailable]);
  useEffect(() => { focusRef.current = focus; requestDraw.current(); }, [focus]);
  useEffect(() => { progressRef.current = progress; requestDraw.current(); }, [progress]);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); }
    catch { setFailed(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x172a29, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    element.append(renderer.domElement);
    const resources = new Set<THREE.BufferGeometry | THREE.Material>();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60);
    camera.position.set(5.2, 4.8, 6.4);
    camera.lookAt(0, 0.3, 0);
    scene.add(new THREE.AmbientLight(0xd9e8dd, 2.2));
    const keyLight = new THREE.DirectionalLight(0xffe6a7, 4.5);
    keyLight.position.set(4, 7, 2); scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x749da7, 2.3);
    rimLight.position.set(-4, 2, -3); scene.add(rimLight);
    function material(color: number, metalness = 0, roughness = 0.8): THREE.MeshStandardMaterial {
      const result = new THREE.MeshStandardMaterial({ color, metalness, roughness }); resources.add(result); return result;
    }
    function mesh(geometry: THREE.BufferGeometry, paint: THREE.Material, target: THREE.Group | THREE.Scene, x = 0, y = 0, z = 0): THREE.Mesh {
      resources.add(geometry);
      const result = new THREE.Mesh(geometry, paint); result.position.set(x, y, z); target.add(result); return result;
    }
    const globe = new THREE.Group(); globe.position.y = -0.7; globe.rotation.y = -0.12; scene.add(globe);
    const ocean = material(0x507879, 0.1, 0.75);
    mesh(new THREE.CylinderGeometry(2.4, 2.25, 0.25, 96), ocean, globe);
    mesh(new THREE.CylinderGeometry(2.26, 2.12, 0.2, 96), material(0x263e40), globe, 0, -0.21, 0);
    earthPatch([[-1.9, 0.6], [-1.5, 1.1], [-0.9, 1.35], [-0.5, 1.2], [-0.4, 0.9], [-0.05, 0.7], [-0.2, 0.4], [-0.5, 0.3], [-0.6, 0.03], [-1.05, -0.1], [-1.12, 0.25], [-1.6, 0.2]], 0x81916b, globe, resources);
    earthPatch([[-0.9, -0.05], [-0.45, -0.1], [-0.06, -0.5], [0.1, -0.9], [-0.4, -1.25], [-0.65, -1.8], [-0.84, -1.5], [-1.03, -0.8], [-1.1, -0.4]], 0xb5aa70, globe, resources);
    earthPatch([[0.5, 1.7], [1.2, 1.5], [1.8, 0.9], [1.9, 0.3], [1.3, 0.18], [1, 0.4], [0.9, 0], [1.3, -0.5], [1.05, -1.2], [0.7, -1.4], [0.45, -0.6], [0.4, 0.4], [0.1, 0.7]], 0x8d9b76, globe, resources);
    const linePaint = new THREE.LineBasicMaterial({ color: 0x9ebbb2, transparent: true, opacity: 0.2 }); resources.add(linePaint);
    for (let radius = 0.6; radius < 2.4; radius += 0.6) {
      const points = Array.from({ length: 97 }, (_, index) => { const angle = index / 96 * Math.PI * 2; return new THREE.Vector3(Math.cos(angle) * radius, 0.153, Math.sin(angle) * radius); });
      const geometry = new THREE.BufferGeometry().setFromPoints(points); resources.add(geometry); globe.add(new THREE.Line(geometry, linePaint));
    }
    for (let angle = 0; angle < Math.PI; angle += Math.PI / 6) {
      const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2.38 * Math.cos(angle), 0.154, -2.38 * Math.sin(angle)), new THREE.Vector3(2.38 * Math.cos(angle), 0.154, 2.38 * Math.sin(angle))]);
      resources.add(geometry); globe.add(new THREE.Line(geometry, linePaint));
    }
    const orbitalGroup = new THREE.Group(); orbitalGroup.rotation.z = 0.14; scene.add(orbitalGroup);
    const ringGeometry = new THREE.BufferGeometry().setFromPoints(Array.from({ length: 161 }, (_, index) => { const angle = index / 160 * Math.PI * 2; return new THREE.Vector3(Math.cos(angle) * 3.1, 0.6, Math.sin(angle) * 2.6); }));
    const ringMaterial = new THREE.LineBasicMaterial({ color: 0xc1d0ba, transparent: true, opacity: 0.4 }); resources.add(ringGeometry); resources.add(ringMaterial); orbitalGroup.add(new THREE.Line(ringGeometry, ringMaterial));
    const cube = new THREE.Group(); orbitalGroup.add(cube);
    const gold = material(0xe0b45d, 0.55, 0.36);
    const silver = material(0xbac7bf, 0.65, 0.3);
    const panelMaterial = material(0x28465c, 0.4, 0.32);
    mesh(new THREE.BoxGeometry(0.42, 0.68, 0.42), gold, cube);
    mesh(new THREE.BoxGeometry(0.46, 0.045, 0.46), silver, cube, 0, 0.35, 0);
    mesh(new THREE.BoxGeometry(0.46, 0.045, 0.46), silver, cube, 0, -0.35, 0);
    for (const side of [-1, 1]) {
      mesh(new THREE.BoxGeometry(0.8, 0.035, 0.58), silver, cube, side * 0.7, 0.08, 0);
      mesh(new THREE.BoxGeometry(0.77, 0.04, 0.55), panelMaterial, cube, side * 0.7, 0.09, 0);
      for (let col = 0; col < 4; col += 1) mesh(new THREE.BoxGeometry(0.012, 0.006, 0.55), silver, cube, side * 0.7 - 0.29 + col * 0.195, 0.114, 0);
      mesh(new THREE.BoxGeometry(0.78, 0.006, 0.012), silver, cube, side * 0.7, 0.115, 0);
    }
    mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.38, 8), silver, cube, 0, 0.54, 0);
    const cameraGlass = material(0x182d3b, 0.7, 0.2);
    const cameraLens = mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.06, 20), cameraGlass, cube, 0, -0.13, 0.24); cameraLens.rotation.x = Math.PI / 2;
    const station = new THREE.Group(); station.position.set(-0.65, 0.19, 0.66); globe.add(station);
    mesh(new THREE.BoxGeometry(0.26, 0.13, 0.2), silver, station, 0, 0.06, 0);
    mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.23, 10), silver, station, 0, 0.18, 0);
    const dish = mesh(new THREE.SphereGeometry(0.17, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), material(0xf0e5c9), station, 0, 0.3, 0); dish.rotation.z = -0.4;
    const beaconMaterial = new THREE.MeshBasicMaterial({ color: 0xf0c362 }); resources.add(beaconMaterial);
    mesh(new THREE.SphereGeometry(0.045, 12, 8), beaconMaterial, station, 0, 0.4, 0);
    const starsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(84 * 3);
    for (let index = 0; index < 84; index += 1) {
      // Deterministic decoration. These points have no relation to the simulation.
      positions[index * 3] = Math.sin(index * 17.7) * 12;
      positions[index * 3 + 1] = 2 + (Math.cos(index * 3.1) + 1) * 5;
      positions[index * 3 + 2] = -8 - (Math.sin(index * 7.3) + 1) * 3;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xd9e0c9, size: 0.025, transparent: true, opacity: 0.6 });
    resources.add(starsGeometry); resources.add(starMaterial); scene.add(new THREE.Points(starsGeometry, starMaterial));
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = motionQuery.matches;
    let frame = 0;
    let stopped = false;
    let lastTime = 0;
    let visibleTime = 0;
    const render = (now: number) => {
      frame = 0;
      if (stopped || document.hidden) return;
      if (lastTime) visibleTime += Math.min(now - lastTime, 50);
      lastTime = now;
      const angle = -0.45 + progressRef.current * Math.PI * 2;
      cube.position.set(Math.cos(angle) * 2.65, 0.9, Math.sin(angle) * 2.25);
      cube.rotation.set(0.15, -0.38, -0.12);
      if (!reduced) cube.position.y += Math.sin(visibleTime / 2400) * 0.045;
      station.scale.setScalar(focusRef.current === 'ground' ? 1.2 : 1);
      renderer.render(scene, camera);
      if (!reduced) frame = requestAnimationFrame(render);
    };
    requestDraw.current = () => { if (!stopped && !document.hidden && !frame) frame = requestAnimationFrame(render); };
    const resize = () => {
      const width = element.clientWidth; const height = element.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); requestDraw.current();
    };
    const observer = new ResizeObserver(resize); observer.observe(element); resize();
    const visibility = () => { cancelAnimationFrame(frame); frame = 0; lastTime = 0; if (!document.hidden && !stopped) frame = requestAnimationFrame(render); };
    const changeMotion = () => { reduced = motionQuery.matches; requestDraw.current(); };
    const contextLost = (event: Event) => { event.preventDefault(); setFailed(true); };
    motionQuery.addEventListener('change', changeMotion);
    document.addEventListener('visibilitychange', visibility);
    renderer.domElement.addEventListener('webglcontextlost', contextLost);
    requestDraw.current();
    return () => {
      stopped = true; requestDraw.current = () => undefined; cancelAnimationFrame(frame); observer.disconnect();
      document.removeEventListener('visibilitychange', visibility); motionQuery.removeEventListener('change', changeMotion);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      resources.forEach((resource) => resource.dispose()); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    };
  }, []);
  return <div className="orbital-canvas" ref={host}>{failed ? <div className="scene-unavailable"><span>Visualização 3D indisponível.</span><span>Use “Ver em 2D”. Todos os controles continuam disponíveis.</span></div> : null}</div>;
}
