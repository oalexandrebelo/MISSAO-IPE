import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { BRUNO_INSTRUMENTS } from '../lab/bruno-missions.ts';
import type { BrunoConfigKey, BrunoInstrumentId, BrunoMissionId, BrunoResult, BrunoSimulationConfig, BrunoTimelineEntry } from '../lab/bruno-missions.ts';
import { BrunoInstrumentMesh } from './BrunoInstrumentMesh.tsx';
import { NASAAsset } from './OrbitalScene.tsx';
import { getBrunoSceneState } from './r30-scene-state.ts';
import { HangarEnvironment } from './HangarEnvironment.tsx';
import { HANGAR_DECK_Y, HangarPlatform } from './HangarPlatform.tsx';

interface Props {
  config: BrunoSimulationConfig; active: BrunoConfigKey; turn: number;
  onPart: (part: BrunoConfigKey) => void; onUnavailable: () => void;
  missionId?: BrunoMissionId; paused?: boolean; exploded?: boolean; activeInstrumentId?: BrunoInstrumentId;
  flightPhase?: BrunoTimelineEntry['phase']; flightEvent?: BrunoTimelineEntry; flightResult?: BrunoResult;
}
const BASE = import.meta.env?.BASE_URL ?? './';
const HANGAR_CAMERA: [number, number, number] = [.35, 1.65, 7.1];
const FLIGHT_CAMERA: [number, number, number] = [0, 1.1, 6.7];

function ContextListener({ onUnavailable, hangar }: Pick<Props, 'onUnavailable'> & { hangar?: boolean }) {
  const { gl, camera, size, setDpr, setFrameloop, invalidate } = useThree();
  useEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); onUnavailable(); };
    let inView = true;
    const sync = () => { setFrameloop(document.hidden || !inView ? 'never' : 'demand'); if (!document.hidden && inView) invalidate(); };
    const quality = () => { setDpr(Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1 : 1.5)); sync(); };
    const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => { inView = entries.at(-1)?.isIntersecting ?? true; sync(); }) : null;
    observer?.observe(gl.domElement); gl.domElement.addEventListener('webglcontextlost', lost);
    document.addEventListener('visibilitychange', sync); window.addEventListener('resize', quality); quality();
    return () => { observer?.disconnect(); gl.domElement.removeEventListener('webglcontextlost', lost); document.removeEventListener('visibilitychange', sync); window.removeEventListener('resize', quality); };
  }, [gl, setDpr, setFrameloop, invalidate, onUnavailable]);
  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    if (hangar !== undefined) camera.position.fromArray(hangar ? HANGAR_CAMERA : FLIGHT_CAMERA);
    camera.zoom = Math.min(1, size.width / Math.max(size.height, 1) / (hangar ? 1.32 : 1.15));
    camera.lookAt(0, hangar ? -.36 : 0, 0); camera.updateProjectionMatrix(); invalidate();
  }, [camera, size.width, size.height, hangar, invalidate]);
  return null;
}

function Guide({ from, to, color = '#759db3' }: { from: [number, number, number]; to: [number, number, number]; color?: string }) {
  const points = useMemo(() => new Float32Array([...from, ...to]), [from[0], from[1], from[2], to[0], to[1], to[2]]);
  return <line><bufferGeometry><bufferAttribute attach="attributes-position" args={[points, 3]} /></bufferGeometry><lineBasicMaterial color={color} transparent opacity={.6} /></line>;
}

function Planet({ body }: { body: 'earth' | 'moon' | 'mars' | 'europa' }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const { invalidate } = useThree();
  useEffect(() => {
    let disposed = false; let loaded: THREE.Texture | undefined;
    setTexture(null);
    new THREE.TextureLoader().load(`${BASE}textures/lobby/${body}.webp`, map => {
      if (disposed) { map.dispose(); return; }
      loaded = map; map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 2; setTexture(map); invalidate();
    }, undefined, () => { /* The colored sphere remains a decorative fallback. */ });
    return () => { disposed = true; loaded?.dispose(); };
  }, [body, invalidate]);
  return <mesh position={[-1.9, -.8, -3.6]} rotation={[.12, body === 'earth' ? -.8 : .35, -.18]}>
    <sphereGeometry args={[2.35, 64, 40]} /><meshStandardMaterial map={texture} color={texture ? '#ffffff' : body === 'mars' ? '#ae735b' : body === 'earth' ? '#315b70' : '#a6a49a'} roughness={1} />
  </mesh>;
}

/** A didactic envelope, not the dimensions or ascent of a named real launcher. */
function Launcher({ heavy, highlighted, firing, grounded }: { heavy: boolean; highlighted: boolean; firing: boolean; grounded: boolean }) {
  const radius = heavy ? .28 : .21;
  return <group name={`launcher-${heavy ? 'heavy' : 'compact'}`} position={[-1.95, grounded ? HANGAR_DECK_Y + 1.07 : -.05, -.8]} rotation={[0, 0, grounded ? 0 : -.08]}>
    <mesh><cylinderGeometry args={[radius, radius, 1.8, 24]} /><meshStandardMaterial color={highlighted ? '#f5ca91' : '#c6d0d1'} metalness={.35} roughness={.5} /></mesh>
    <mesh position={[0, 1.05, 0]}><coneGeometry args={[radius, .55, 24]} /><meshStandardMaterial color="#c0cbd0" metalness={.4} roughness={.5} /></mesh>
    {heavy ? [-1, 1].map(side => <mesh key={side} position={[side * .36, -.25, 0]}><cylinderGeometry args={[.13, .16, 1.3, 16]} /><meshStandardMaterial color="#9aaab4" metalness={.4} roughness={.5} /></mesh>) : null}
    <mesh position={[0, -.96, 0]}><cylinderGeometry args={[radius * .65, radius * 1.05, .22, 16]} /><meshStandardMaterial color="#566a78" /></mesh>
    {firing ? <mesh name="authorized-launch-plume" position={[0, -1.4, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[radius * .8, .65, 20]} /><meshBasicMaterial color="#ffd294" transparent opacity={.78} depthWrite={false} /></mesh> : null}
  </group>;
}

function Assembly({ config, active, turn, onPart, paused, exploded = false, activeInstrumentId, flightEvent, flightResult }: Props) {
  const state = getBrunoSceneState(config, flightEvent, flightResult);
  const group = useRef<THREE.Group>(null), initialized = useRef(false);
  const { invalidate, frameloop } = useThree();
  const [reduced, setReduced] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  useEffect(() => { const media = window.matchMedia?.('(prefers-reduced-motion: reduce)'); const change = () => setReduced(media?.matches ?? false); media?.addEventListener?.('change', change); return () => media?.removeEventListener?.('change', change); }, []);
  const target = useMemo(() => new THREE.Quaternion().setFromEuler(new THREE.Euler(active === 'energy' ? .24 : .06, turn + (active === 'payload' ? -.12 : -.42), state.phase === 'transfer' ? -.18 : .02)), [active, turn, state.phase]);
  useEffect(() => { if (group.current && (!initialized.current || reduced || paused || frameloop === 'never')) group.current.quaternion.copy(target); initialized.current = true; invalidate(); }, [target, reduced, paused, frameloop, invalidate]);
  useFrame((_, delta) => { if (!group.current || reduced || paused || group.current.quaternion.angleTo(target) < .0005) return; group.current.quaternion.slerp(target, 1 - Math.exp(-12 * Math.min(delta, .05))); invalidate(); });
  const color = (key: BrunoConfigKey, normal: string) => active === key ? '#f7cc9f' : normal;
  const inspect = (part: BrunoConfigKey) => ({ onClick: (event: { stopPropagation: () => void }) => { event.stopPropagation(); onPart(part); } });
  const width = config.energy === 'extended' ? .82 : .46;
  const batteryY = exploded ? -1.2 : -.4, payloadZ = exploded ? 1.25 : .8;
  const protection = config.protection === 'reinforced' ? 1.1 : .93;
  const aperture = config.payload === 'survey' ? .31 : .17, dish = config.navigation === 'deep-space' ? .43 : .2;
  const loadout = 'loadout' in config ? config.loadout : null;
  let slot = -(loadout?.reduce((total, item) => total + BRUNO_INSTRUMENTS[item.instrumentId].slots, 0) ?? 0) / 2;
  return <group ref={group} name="configured-bruno-spacecraft" userData={{ phase: state.phase, conceptual: true }} position={[.45, .15, .2]} scale={state.phase === 'assembly' && !exploded ? 1.12 : 1}>
    <mesh {...inspect('protection')}><boxGeometry args={[.88, 1.08, .88]} /><meshStandardMaterial color="#ad916a" metalness={.55} roughness={.42} /></mesh>
    {[-1, 1].map(side => <group key={side}>
      <mesh position={[side * (protection / 2 + (exploded ? .3 : 0)), 0, 0]} {...inspect('protection')}><boxGeometry args={[config.protection === 'reinforced' ? .14 : .045, 1.18, protection]} /><meshStandardMaterial color={color('protection', '#a8b8bd')} metalness={.55} roughness={.38} /></mesh>
      {config.protection === 'reinforced' ? <mesh position={[side * (protection / 2 + (exploded ? .3 : 0)), 0, protection / 2 + .02]}><boxGeometry args={[.15, .85, .055]} /><meshStandardMaterial color="#9f7857" roughness={.7} /></mesh> : null}
      <group position={[side * (1.1 + (exploded ? .45 : 0)), .1, -.13]} {...inspect('energy')}>
        <mesh><boxGeometry args={[1.02, .74, .055]} /><meshStandardMaterial color={color('energy', '#6b899d')} metalness={.55} roughness={.4} /></mesh>
        {[-.3, 0, .3].map(x => [-.17, .17].map(y => <mesh key={`${x}:${y}`} position={[x, y, .04]}><boxGeometry args={[.28, .3, .018]} /><meshStandardMaterial color="#204a6c" metalness={.35} roughness={.4} /></mesh>))}
      </group>
      {exploded ? <Guide from={[side * .48, .1, -.13]} to={[side * 1.1, .1, -.13]} /> : null}
    </group>)}
    {exploded ? <Guide from={[0, -.4, .52]} to={[0, batteryY, .7]} /> : null}
    <group name={`battery-${state.capacityWh}wh`} position={[0, batteryY, exploded ? .7 : .52]} {...inspect('energy')}>
      <mesh><boxGeometry args={[width, .26, .22]} /><meshStandardMaterial color={color('energy', '#5b7f85')} metalness={.4} roughness={.4} /></mesh>
      {Array.from({ length: config.energy === 'extended' ? 4 : 2 }, (_, index) => <mesh key={index} position={[-width / 2 + .11 + index * .19, 0, .12]}><boxGeometry args={[.12, .15, .025]} /><meshStandardMaterial color="#afc5bd" roughness={.5} /></mesh>)}
      {state.energyFraction !== null ? <mesh name="recorded-energy" position={[-width / 2 + width * state.energyFraction / 2, -.1, .14]}><boxGeometry args={[Math.max(.002, width * state.energyFraction), .035, .025]} /><meshBasicMaterial color="#d1e8ab" /></mesh> : null}
    </group>
    <group position={[0, exploded ? -1.22 : -.72, -.1]} {...inspect('propulsion')}>
      <mesh><cylinderGeometry args={[config.propulsion === 'electric' ? .13 : .21, config.propulsion === 'electric' ? .18 : .31, .31, 24, 1, true]} /><meshStandardMaterial color={color('propulsion', '#778d9d')} metalness={.65} roughness={.35} side={THREE.DoubleSide} /></mesh>
      {state.plume ? <mesh name="authorized-propulsion" position={[0, -.4, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[config.propulsion === 'electric' ? .1 : .2, config.propulsion === 'electric' ? .65 : .45, 20]} /><meshBasicMaterial color={config.propulsion === 'electric' ? '#82ddff' : '#ffc382'} transparent opacity={.7} depthWrite={false} /></mesh> : null}
    </group>
    <group position={[.06, exploded ? 1.08 : .65, 0]} rotation={[.3, 0, -.25]} {...inspect('navigation')}>
      <mesh><cylinderGeometry args={[.025, .035, .32, 12]} /><meshStandardMaterial color="#b9c6cd" /></mesh>
      <mesh position={[0, .2, 0]} rotation={[-Math.PI / 2, 0, 0]}><sphereGeometry args={[dish, 28, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color={color('navigation', '#a7becb')} metalness={.6} roughness={.35} side={THREE.DoubleSide} /></mesh>
      {state.transmitting ? [1, 2, 3].map(index => <mesh name="recorded-downlink-wave" key={index} position={[0, .2, .25 + index * .22]}><torusGeometry args={[dish + index * .08, .014, 8, 32]} /><meshBasicMaterial color="#a4e3f2" transparent opacity={1 - index * .18} /></mesh>) : null}
    </group>
    {exploded ? <Guide from={[0, .02, .45]} to={[0, .02, payloadZ]} /> : null}
    <group name="equipped-science-payload" position={[0, .04, payloadZ]} {...inspect('payload')}>
      {loadout ? <>
        <mesh position={[0, -.05, -.12]}><boxGeometry args={[Math.max(.6, (loadout.reduce((sum, item) => sum + BRUNO_INSTRUMENTS[item.instrumentId].slots, 0)) * .34), .32, .08]} /><meshStandardMaterial color="#3c586a" metalness={.4} roughness={.5} /></mesh>
        {loadout.map((unit, index) => { const slots = BRUNO_INSTRUMENTS[unit.instrumentId].slots; const x = (slot + slots / 2) * .34; slot += slots; return <group key={`${unit.instrumentId}-${index}`} position={[x, .02, 0]} scale={.36}><BrunoInstrumentMesh id={unit.instrumentId} usesRemaining={unit.usesRemaining} selected={active === 'payload' && (!activeInstrumentId || activeInstrumentId === unit.instrumentId)} operating={state.acquiring} /></group>; })}
      </> : <>
        <mesh><boxGeometry args={[aperture * 2.35, aperture * 1.65, .24]} /><meshStandardMaterial color={color('payload', '#c49e67')} metalness={.5} roughness={.35} /></mesh>
        <mesh position={[0, 0, .18]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[aperture * .53, aperture * .62, .13, 24]} /><meshStandardMaterial color="#335568" metalness={.62} roughness={.24} /></mesh>
      </>}
      {state.acquiring ? <mesh name="recorded-acquisition" position={[0, 0, .7]} rotation={[-Math.PI / 2, 0, 0]}><coneGeometry args={[.36, 1, 24, 1, true]} /><meshBasicMaterial color="#e4bd85" transparent opacity={.16} depthWrite={false} /></mesh> : null}
    </group>
    {state.generatedRecords !== null ? <group name="recorded-data-onboard" position={[.56, -.26, .55]}>{Array.from({ length: state.generatedRecords - (state.receivedRecords ?? 0) }, (_, index) => <mesh key={index} position={[.07, index * .09, 0]}><boxGeometry args={[.14, .055, .15]} /><meshBasicMaterial color="#d7b77f" /></mesh>)}</group> : null}
    {state.blocked ? <mesh name="recorded-blocked-stage"><boxGeometry args={[3.8, 2.5, 2.2]} /><meshBasicMaterial color="#df9a84" wireframe transparent opacity={.45} /></mesh> : null}
  </group>;
}

export function BrunoInstrumentScene({ id, turn, onUnavailable }: { id: BrunoInstrumentId; turn: number; onUnavailable: () => void }) {
  return <Canvas frameloop="demand" dpr={1} camera={{ position: [2.3, 1.6, 2.85], fov: 31 }} gl={{ antialias: true, powerPreference: 'low-power' }} aria-hidden="true">
    <ContextListener onUnavailable={onUnavailable} /><HangarEnvironment /><ambientLight intensity={1.1} /><directionalLight position={[3, 4, 4]} intensity={2.6} color="#ffe0b5" /><directionalLight position={[-3, 1, -3]} intensity={1.2} color="#97caff" />
    <group rotation={[.08, turn - .25, 0]}><BrunoInstrumentMesh id={id} /></group>
  </Canvas>;
}

export default function BrunoHangarScene(props: Props) {
  const { config, active, flightEvent, flightResult, missionId = 'iss' } = props;
  const state = getBrunoSceneState(config, flightEvent, flightResult);
  const hangar = state.phase === 'assembly' || state.blocked && state.phase === 'launch';
  return <Canvas frameloop="demand" dpr={1} camera={{ position: hangar ? HANGAR_CAMERA : FLIGHT_CAMERA, fov: 38 }} gl={{ antialias: true, alpha: true, powerPreference: 'low-power', stencil: false }} aria-hidden="true">
    <ContextListener onUnavailable={props.onUnavailable} hangar={hangar} /><ambientLight intensity={.55} />
    {hangar ? <HangarEnvironment /> : null}
    <directionalLight position={[-3, 5, 4]} intensity={3.1} color="#fff0d9" /><directionalLight position={[4, 1, -3]} intensity={1.1} color="#81c8e2" />
    {hangar ? <HangarPlatform /> : <Planet body={state.atDestination ? missionId === 'iss' ? 'earth' : missionId : 'earth'} />}
    {state.arrived && missionId === 'iss' ? <group position={[-1.8, .8, -1.9]} scale={.42} rotation={[.16, -.4, .1]}><NASAAsset url={`${BASE}models/nasa/iss-carbajal-b.glb`} onUnavailable={props.onUnavailable} /></group> : null}
    {state.phase === 'assembly' || state.phase === 'launch' ? <Launcher heavy={config.launcher === 'heavy'} highlighted={active === 'launcher'} firing={state.plume} grounded={hangar} /> : null}
    <Assembly {...props} />
    {state.transmitting ? <Guide from={[.45, 1.1, .3]} to={[-1.6, -1.1, 1]} color="#a4e3f2" /> : null}
    {state.receivedRecords !== null ? <group name="recorded-ground-reception" position={[-1.5, -1.25, .9]}>
      <mesh><boxGeometry args={[1.1, .1, .55]} /><meshStandardMaterial color="#324e61" /></mesh>
      {Array.from({ length: state.receivedRecords }, (_, index) => <mesh key={index} position={[(index - 2.5) * .15, .14, 0]}><boxGeometry args={[.1, .17, .2]} /><meshBasicMaterial color={index < (state.deliveredRecords ?? 0) ? '#c7dfa9' : '#c1a27f'} /></mesh>)}
    </group> : null}
  </Canvas>;
}
