import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { MissionConfig } from '../core/contracts.ts';
import type { SceneFocus, SceneVariant } from './Scene.tsx';
import { CONTINENTS, circlePositions, graticulePositions, randomSeries, surfacePoint } from './scene-geometry.ts';

interface OrbitalSceneProps {
  focus: SceneFocus;
  progress: number;
  config: MissionConfig;
  variant: SceneVariant;
  animating: boolean;
  active: boolean;
  reducedMotion: boolean;
  turn: number;
  onUnavailable: () => void;
}

const EARTH_RADIUS = 2.05;
const EARTH_POSITION: [number, number, number] = [-0.28, 0.48, 0];
const ORBIT_ROTATION: [number, number, number] = [0.84, 0.18, -0.38];
const WORLD_GRID = graticulePositions(EARTH_RADIUS + 0.007);
const ORBIT_POINTS = circlePositions(2.79);
const SECOND_ORBIT_POINTS = circlePositions(2.69);
const ORBIT_ACCENT = circlePositions(2.795, 45, -0.2, 0.7);
const HANGAR_RING = circlePositions(2.05);
const FOCUS_RING = circlePositions(0.145, 64);
const FOCUS_OUTER_RING = circlePositions(0.225, 64);
const STAR_POSITIONS = (() => {
  const random = randomSeries(4081);
  const points = new Float32Array(140 * 3);
  for (let index = 0; index < 140; index += 1) {
    points[index * 3] = (random() - .5) * 22;
    points[index * 3 + 1] = (random() - .5) * 17;
    points[index * 3 + 2] = -4 - random() * 5;
  }
  return points;
})();

const ATMOSPHERE_VERTEX = `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 p = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-p.xyz);
    gl_Position = projectionMatrix * p;
  }
`;
const ATMOSPHERE_FRAGMENT = `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 3.7);
    vec3 color = mix(vec3(0.15, 0.36, 0.45), vec3(0.55, 0.78, 0.85), rim);
    gl_FragColor = vec4(color, rim * 0.43);
  }
`;

/** Original canvas textures: no assets, remote requests or external geography. */
function createEarthTextures(): { surface: THREE.CanvasTexture; clouds: THREE.CanvasTexture } {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Surface canvas unavailable');
  const random = randomSeries(18421);
  const ocean = ctx.createLinearGradient(0, 0, 0, height);
  ocean.addColorStop(0, '#10212f'); ocean.addColorStop(.35, '#163341'); ocean.addColorStop(.65, '#14323e'); ocean.addColorStop(1, '#102430');
  ctx.fillStyle = ocean; ctx.fillRect(0, 0, width, height);
  // Quiet ocean grain keeps the globe tactile without suggesting measured data.
  for (let index = 0; index < 16000; index += 1) {
    ctx.fillStyle = index % 2 ? 'rgba(124,164,165,.035)' : 'rgba(0,9,19,.04)';
    ctx.fillRect(random() * width, random() * height, 2 + random() * 6, 1 + random() * 2);
  }
  ctx.save(); ctx.beginPath();
  for (const continent of CONTINENTS) {
    continent.forEach(([longitude, latitude], index) => {
      const x = (longitude + 180) / 360 * width;
      const y = (90 - latitude) / 180 * height;
      if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath();
  }
  ctx.clip();
  const land = ctx.createLinearGradient(0, 0, 0, height);
  land.addColorStop(0, '#a1b2a3'); land.addColorStop(.24, '#7d8d75'); land.addColorStop(.36, '#aca37a'); land.addColorStop(.48, '#627e69'); land.addColorStop(.59, '#68816a'); land.addColorStop(.7, '#a6a17b'); land.addColorStop(1, '#a6b6aa');
  ctx.fillStyle = land; ctx.fillRect(0, 0, width, height);
  for (let index = 0; index < 11000; index += 1) {
    ctx.fillStyle = index % 3 ? 'rgba(25,57,38,.10)' : 'rgba(222,211,166,.12)';
    const x = random() * width, y = random() * height;
    ctx.beginPath(); ctx.ellipse(x, y, 1 + random() * 7, .6 + random() * 3, random(), 0, Math.PI * 2); ctx.fill();
  }
  // Broad illustrative mountain ridges and desert tones; not a terrain dataset.
  ctx.strokeStyle = 'rgba(204,185,140,.32)'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(609, 494); ctx.bezierCurveTo(650, 559, 619, 653, 640, 784); ctx.stroke();
  ctx.strokeStyle = 'rgba(203,196,157,.2)'; ctx.lineWidth = 12;
  ctx.beginPath(); ctx.moveTo(389, 204); ctx.bezierCurveTo(410, 292, 456, 340, 488, 407); ctx.stroke();
  ctx.restore();
  ctx.fillStyle = '#a7b9b5';
  ctx.beginPath(); ctx.moveTo(0, height); ctx.lineTo(0, 958);
  for (let x = 0; x <= width; x += 34) ctx.lineTo(x, 954 + Math.sin(x * .009) * 15 + random() * 9);
  ctx.lineTo(width, height); ctx.closePath(); ctx.fill();
  const surface = new THREE.CanvasTexture(canvas);
  surface.colorSpace = THREE.SRGBColorSpace;
  surface.anisotropy = 4;

  const cloudCanvas = document.createElement('canvas');
  cloudCanvas.width = 1024; cloudCanvas.height = 512;
  const cloud = cloudCanvas.getContext('2d');
  if (!cloud) { surface.dispose(); throw new Error('Cloud canvas unavailable'); }
  for (let index = 0; index < 220; index += 1) {
    const x = random() * 1024;
    const y = 50 + random() * 400;
    const length = 15 + random() * 100;
    cloud.beginPath(); cloud.moveTo(x, y);
    cloud.bezierCurveTo(x + length * .3, y - 12, x + length * .65, y + 12, x + length, y - 8);
    cloud.strokeStyle = `rgba(220,234,231,${.035 + random() * .11})`;
    cloud.lineWidth = 1.2 + random() * 6; cloud.lineCap = 'round'; cloud.stroke();
  }
  const clouds = new THREE.CanvasTexture(cloudCanvas);
  clouds.colorSpace = THREE.SRGBColorSpace;
  return { surface, clouds };
}

function Curve({ points, color = '#9ab6ae', opacity = .35 }: { points: Float32Array; color?: string; opacity?: number }) {
  return <lineLoop><bufferGeometry><bufferAttribute attach="attributes-position" args={[points, 3]} /></bufferGeometry><lineBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} /></lineLoop>;
}

function StarField() {
  return <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[STAR_POSITIONS, 3]} /></bufferGeometry><pointsMaterial color="#d1dce2" size={.017} transparent opacity={.65} sizeAttenuation depthWrite={false} /></points>;
}

function AreaMarker({ focus }: { focus: SceneFocus }) {
  const position = useMemo(() => new THREE.Vector3(...surfacePoint(-50, -16, EARTH_RADIUS + .022)), []);
  const orientation = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize()), [position]);
  return <group position={position} quaternion={orientation}>
    <Curve points={FOCUS_RING} color="#d5f894" opacity={focus === 'science' ? .9 : .55} />
    <Curve points={FOCUS_OUTER_RING} color="#d5f894" opacity={focus === 'science' ? .42 : .16} />
    <mesh><circleGeometry args={[.029, 16]} /><meshBasicMaterial color="#d5f894" /></mesh>
    {focus === 'ground' ? <group position={[.05, -.035, .025]}><mesh><boxGeometry args={[.065, .05, .035]} /><meshBasicMaterial color="#dbe4ce" /></mesh><mesh position={[0, .045, .01]}><sphereGeometry args={[.028, 16, 8]} /><meshBasicMaterial color="#d5f894" /></mesh></group> : null}
  </group>;
}

function Earth({ animating, focus }: { animating: boolean; focus: SceneFocus }) {
  const globe = useRef<THREE.Group>(null);
  const cloudGroup = useRef<THREE.Mesh>(null);
  const textures = useMemo(createEarthTextures, []);
  useEffect(() => () => { textures.surface.dispose(); textures.clouds.dispose(); }, [textures]);
  useFrame((_, delta) => {
    if (!animating) return;
    // Only decorative drift. Model time and physical state never enter here.
    if (globe.current) globe.current.rotation.y += Math.min(delta, .05) * .009;
    if (cloudGroup.current) cloudGroup.current.rotation.y += Math.min(delta, .05) * .006;
  });
  return <group position={EARTH_POSITION}>
    <group ref={globe} rotation={[0, -.22, -.16]}>
      <mesh><sphereGeometry args={[EARTH_RADIUS, 96, 64]} /><meshStandardMaterial map={textures.surface} roughness={.97} metalness={.03} /></mesh>
      <mesh ref={cloudGroup}><sphereGeometry args={[EARTH_RADIUS + .014, 80, 48]} /><meshStandardMaterial map={textures.clouds} transparent opacity={.62} depthWrite={false} roughness={1} /></mesh>
      <lineSegments><bufferGeometry><bufferAttribute attach="attributes-position" args={[WORLD_GRID, 3]} /></bufferGeometry><lineBasicMaterial color="#a6c3bf" transparent opacity={.11} depthWrite={false} /></lineSegments>
      <AreaMarker focus={focus} />
    </group>
    <mesh><sphereGeometry args={[EARTH_RADIUS * 1.045, 80, 56]} /><shaderMaterial vertexShader={ATMOSPHERE_VERTEX} fragmentShader={ATMOSPHERE_FRAGMENT} transparent blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
  </group>;
}

function SolarWing({ side, wide }: { side: -1 | 1; wide: boolean }) {
  const width = wide ? 1.19 : .82;
  const center = side * (.55 + width / 2);
  const columns = wide ? 5 : 4;
  const cells = useMemo(() => Array.from({ length: columns * 3 }, (_, index) => ({ x: (index % columns + .5) / columns * width - width / 2, y: (Math.floor(index / columns) - 1) * .244 })), [columns, width]);
  return <group>
    <mesh position={[side * .48, .06, 0]}><boxGeometry args={[.28, .065, .065]} /><meshStandardMaterial color="#aab8bb" metalness={.72} roughness={.36} /></mesh>
    <group position={[center, .06, 0]}>
      <mesh><boxGeometry args={[width + .05, .79, .047]} /><meshStandardMaterial color="#99a8b3" metalness={.75} roughness={.32} /></mesh>
      <mesh position={[0, 0, .027]}><boxGeometry args={[width, .748, .012]} /><meshStandardMaterial color="#101e32" metalness={.5} roughness={.3} /></mesh>
      {cells.map((cell, index) => <group key={index} position={[cell.x, cell.y, .038]}>
        <mesh><boxGeometry args={[width / columns - .018, .226, .009]} /><meshStandardMaterial color={index % 3 === 0 ? '#213c57' : '#20374f'} metalness={.5} roughness={.3} /></mesh>
        <mesh position={[0, 0, .008]}><boxGeometry args={[.005, .22, .002]} /><meshBasicMaterial color="#91b2b9" transparent opacity={.55} /></mesh>
        <mesh position={[width / columns * .25, 0, .008]}><boxGeometry args={[.0025, .22, .002]} /><meshBasicMaterial color="#7b9ca7" transparent opacity={.35} /></mesh>
        <mesh position={[-width / columns * .25, 0, .008]}><boxGeometry args={[.0025, .22, .002]} /><meshBasicMaterial color="#7b9ca7" transparent opacity={.35} /></mesh>
      </group>)}
      <mesh position={[0, 0, -.029]}><boxGeometry args={[width - .03, .73, .01]} /><meshStandardMaterial color="#1d2e3b" metalness={.45} roughness={.6} /></mesh>
    </group>
  </group>;
}

function Satellite({ config }: { config: MissionConfig }) {
  const tall = config.battery === 'large';
  const bodyHeight = tall ? 1.28 : 1.1;
  const bottom = -.55 - (tall ? .18 : 0);
  return <group>
    <mesh position={[0, tall ? -.09 : 0, 0]}><boxGeometry args={[.69, bodyHeight, .65]} /><meshStandardMaterial color="#bc9658" metalness={.68} roughness={.42} /></mesh>
    {/* Gold thermal foil panels and silver structural rails. */}
    {[-1, 1].map(side => <group key={side}>
      <mesh position={[0, tall ? -.09 : 0, side * .332]}><boxGeometry args={[.59, bodyHeight - .13, .018]} /><meshStandardMaterial color={side === 1 ? '#d3af71' : '#a68a54'} metalness={.6} roughness={.49} /></mesh>
      <mesh position={[side * .354, tall ? -.09 : 0, 0]}><boxGeometry args={[.018, bodyHeight - .13, .57]} /><meshStandardMaterial color="#aa8952" metalness={.72} roughness={.4} /></mesh>
      {[-1, 1].map(z => <mesh key={z} position={[side * .35, tall ? -.09 : 0, z * .334]}><boxGeometry args={[.045, bodyHeight + .04, .045]} /><meshStandardMaterial color="#b9c2be" metalness={.78} roughness={.26} /></mesh>)}
      {[bottom, -.18, .2, .55].map(y => <mesh key={y} position={[0, y, side * .348]}><boxGeometry args={[.74, .028, .028]} /><meshStandardMaterial color="#c4c9be" metalness={.7} roughness={.28} /></mesh>)}
    </group>)}
    {[bottom, .55].map(y => <mesh key={y} position={[0, y, 0]}><boxGeometry args={[.77, .065, .73]} /><meshStandardMaterial color="#b8c1bd" metalness={.76} roughness={.25} /></mesh>)}
    {/* Foil creases: thin, irregular facets give the body a manufactured finish. */}
    {[-.42, -.05, .32].map((y, index) => <mesh key={y} position={[.06, y, .347]} rotation={[0, 0, index % 2 ? .12 : -.08]}><boxGeometry args={[.52, .012, .005]} /><meshStandardMaterial color="#e9c88c" metalness={.62} roughness={.4} /></mesh>)}
    <SolarWing side={-1} wide={config.panel === 'standard'} /><SolarWing side={1} wide={config.panel === 'standard'} />
    {/* Optical barrel faces the viewer; the fictional instrument is decorative. */}
    <group position={[0, -.15, .375]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh><cylinderGeometry args={[.146, .146, .13, 32]} /><meshStandardMaterial color="#9baeb0" metalness={.8} roughness={.24} /></mesh>
      <mesh position={[0, -.07, 0]}><cylinderGeometry args={[.119, .119, .055, 32]} /><meshStandardMaterial color="#0b1520" metalness={.56} roughness={.21} /></mesh>
      <mesh position={[0, -.1, 0]}><cylinderGeometry args={[.088, .088, .008, 32]} /><meshStandardMaterial color="#244c6d" metalness={.72} roughness={.13} emissive="#173d4d" emissiveIntensity={.22} /></mesh>
      <mesh position={[.024, -.107, -.022]}><sphereGeometry args={[.022, 12, 8]} /><meshBasicMaterial color="#a4cbdb" /></mesh>
    </group>
    <mesh position={[-.025, .33, .365]}><boxGeometry args={[.36, .16, .04]} /><meshStandardMaterial color={config.processing === 'index' ? '#91aa70' : '#667a83'} metalness={.45} roughness={.4} /></mesh>
    {config.processing === 'index' ? [-.12, -.06, 0, .06, .12].map(x => <mesh key={x} position={[x - .025, .33, .395]}><boxGeometry args={[.014, .14, .026]} /><meshStandardMaterial color="#c6d1b1" metalness={.7} roughness={.4} /></mesh>) : null}
    <mesh position={[.24, .34, .36]}><sphereGeometry args={[.023, 12, 8]} /><meshBasicMaterial color="#d5f894" /></mesh>
    <mesh position={[.368, -.08, .1]}><boxGeometry args={[.044, config.buffer === 'large' ? .35 : .17, .28]} /><meshStandardMaterial color="#4e6468" metalness={.48} roughness={.6} /></mesh>
    {config.buffer === 'large' ? [-.16, -.08, 0].map(y => <mesh key={y} position={[.397, y, .1]}><boxGeometry args={[.008, .025, .22]} /><meshStandardMaterial color="#afbab0" metalness={.6} roughness={.4} /></mesh>) : null}
    {tall ? <mesh position={[0, -.62, .359]}><boxGeometry args={[.58, .13, .035]} /><meshStandardMaterial color="#96a87b" metalness={.4} roughness={.55} /></mesh> : null}
    {/* The radio choice changes antenna geometry, never the calculated link. */}
    <mesh position={[0, .7, 0]}><cylinderGeometry args={[.019, .023, .28, 12]} /><meshStandardMaterial color="#c1cbc6" metalness={.8} roughness={.26} /></mesh>
    {config.radio === 'fast' ? <group position={[0, .83, 0]} rotation={[.12, 0, -.18]}>
      <mesh><sphereGeometry args={[.24, 32, 20, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color="#b7c6c0" metalness={.73} roughness={.34} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, .01, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.241, .008, 8, 40]} /><meshStandardMaterial color="#d0d8cb" metalness={.7} roughness={.3} /></mesh>
      <mesh position={[0, -.02, 0]}><cylinderGeometry args={[.008, .009, .24, 8]} /><meshStandardMaterial color="#e3d4ad" metalness={.6} roughness={.4} /></mesh>
    </group> : <group position={[0, .81, 0]}>
      {[-1, 1].map(side => <mesh key={side} position={[side * .13, .035, 0]} rotation={[0, 0, side * -1.19]}><cylinderGeometry args={[.008, .008, .3, 8]} /><meshStandardMaterial color="#d4dbce" metalness={.75} roughness={.24} /></mesh>)}
    </group>}
    {[-.28, .28].map(x => [-.28, .28].map(z => <mesh key={`${x}:${z}`} position={[x, .59, z]}><cylinderGeometry args={[.025, .025, .015, 8]} /><meshStandardMaterial color="#4d5c5a" metalness={.7} roughness={.4} /></mesh>))}
  </group>;
}

function OrbitingSatellite({ animating, progress, config }: { animating: boolean; progress: number; config: MissionConfig }) {
  const satellite = useRef<THREE.Group>(null);
  const time = useRef(0);
  const clampedProgress = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));
  useFrame((_, delta) => {
    if (animating) time.current += Math.min(delta, .05);
    const angle = .93 + clampedProgress * Math.PI * 2 + time.current * .018;
    if (satellite.current) satellite.current.position.set(Math.cos(angle) * 2.79, Math.sin(angle) * 2.79, 0);
  });
  return <group ref={satellite} position={[Math.cos(.93) * 2.79, Math.sin(.93) * 2.79, 0]} scale={.36} rotation={[-.35, -.35, .15]}><Satellite config={config} /></group>;
}

function OrbitWorld({ config, animating, progress, focus }: Pick<OrbitalSceneProps, 'config' | 'animating' | 'progress' | 'focus'>) {
  return <>
    <Earth focus={focus} animating={animating} />
    <group position={EARTH_POSITION} rotation={ORBIT_ROTATION}>
      <Curve points={ORBIT_POINTS} color="#a5b8aa" opacity={.36} />
      <line><bufferGeometry><bufferAttribute attach="attributes-position" args={[ORBIT_ACCENT, 3]} /></bufferGeometry><lineBasicMaterial color="#d5f894" transparent opacity={.75} depthWrite={false} /></line>
      <OrbitingSatellite animating={animating} progress={progress} config={config} />
    </group>
    <group position={EARTH_POSITION} rotation={[-.73, .45, .86]}><Curve points={SECOND_ORBIT_POINTS} color="#7494ab" opacity={.19} /></group>
  </>;
}

function HangarWorld({ config, focus, animating, turn, reducedMotion }: Pick<OrbitalSceneProps, 'config' | 'focus' | 'animating' | 'turn' | 'reducedMotion'>) {
  const satellite = useRef<THREE.Group>(null);
  const time = useRef(0);
  const rotation: [number, number, number] = focus === 'science' ? [.02, -.03 + turn, 0] : focus === 'ground' ? [.58, -.8 + turn, -.12] : [.24, -.5 + turn, -.14];
  useFrame((_, delta) => {
    if (!satellite.current) return;
    if (animating && !reducedMotion) time.current += Math.min(delta, .05);
    satellite.current.position.y = .17 + (animating && !reducedMotion ? Math.sin(time.current * .7) * .035 : 0);
  });
  return <>
    <group position={[0, .1, -.75]}><Curve points={HANGAR_RING} color="#78928b" opacity={.12} /></group>
    <group position={[0, -1.05, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, .62, 1]}><Curve points={HANGAR_RING} color="#84a19a" opacity={.2} /></group>
    <mesh position={[0, .1, -.18]} rotation={rotation}><boxGeometry args={[3.7, 1.75, .86]} /><meshBasicMaterial color="#94aea4" wireframe transparent opacity={.035} depthWrite={false} /></mesh>
    <group ref={satellite} position={[0, .17, 0]} rotation={rotation} scale={1.3}><Satellite config={config} /></group>
  </>;
}

function SceneLifecycle({ onUnavailable, active, ...state }: OrbitalSceneProps) {
  const { gl, invalidate } = useThree();
  useEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); onUnavailable(); };
    gl.domElement.addEventListener('webglcontextlost', lost);
    return () => gl.domElement.removeEventListener('webglcontextlost', lost);
  }, [gl, onUnavailable]);
  useEffect(() => { if (active) invalidate(); }, [active, state.focus, state.progress, state.config, state.turn, state.animating, invalidate]);
  return null;
}

function ResponsiveFraming({ variant }: { variant: SceneVariant }) {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    // Keep the satellite and its wings inside a narrow viewport. Wide layouts
    // retain the large globe; changing the visual zoom never changes the model.
    if (!(camera instanceof THREE.PerspectiveCamera) || !size.height) return;
    const aspect = size.width / size.height;
    camera.zoom = Math.min(1, aspect / (variant === 'hangar' ? 1.12 : 1.04));
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, variant, invalidate]);
  return null;
}

export default function OrbitalScene(props: OrbitalSceneProps) {
  const isHangar = props.variant === 'hangar';
  return <Canvas
    className="orbital-canvas"
    dpr={[1, 1.5]}
    frameloop={!props.active ? 'never' : props.animating ? 'always' : 'demand'}
    camera={{ position: isHangar ? [0, .05, 7.2] : [0, 0, 8.9], fov: isHangar ? 35 : 35, near: .1, far: 40 }}
    gl={{ antialias: true, alpha: true, powerPreference: 'low-power', stencil: false }}
    onCreated={({ gl }) => { gl.setClearColor('#0a0e14', 0); gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.12; }}
    fallback={null}
    style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
  >
    <ambientLight color="#aabfd0" intensity={isHangar ? .7 : .4} />
    <directionalLight position={[-3.5, 4.5, 5]} color="#fff2d7" intensity={isHangar ? 3.8 : 3.3} />
    <directionalLight position={[4, .5, 1]} color="#7aa7cb" intensity={isHangar ? 1.4 : .5} />
    <directionalLight position={[-2, -1, -4]} color="#a5cbc3" intensity={1.2} />
    <StarField />
    {isHangar ? <HangarWorld {...props} /> : <OrbitWorld {...props} />}
    <ResponsiveFraming variant={props.variant} />
    <SceneLifecycle {...props} />
  </Canvas>;
}
