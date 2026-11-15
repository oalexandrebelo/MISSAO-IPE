import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { MissionVisualState } from '../lab/mission-visual-state.ts';
import type { SpacecraftInspection, SpacecraftPresentation } from '../lab/spacecraft-presentation.ts';
export type { SpacecraftInspection } from '../lab/spacecraft-presentation.ts';

export interface ConfiguredSpacecraftProps {
  presentation: SpacecraftPresentation;
  visualState?: MissionVisualState;
  inspection?: SpacecraftInspection;
  exploded?: boolean;
  turn?: number;
  reducedMotion?: boolean;
  onInspect?: (inspection: SpacecraftInspection) => void;
}
const COPPER = '#bd8d56';
const SILVER = '#b5c6cc';
const BLUE = '#315976';
const ACTIVE = '#b6e8ff';
const SELECTED = '#f2c18c';
const fraction = (value: number | null | undefined) => Math.max(0, Math.min(1, value ?? 0));

function Guide({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const points = useMemo(() => new Float32Array([...from, ...to]), [from[0], from[1], from[2], to[0], to[1], to[2]]);
  return <line><bufferGeometry><bufferAttribute attach="attributes-position" args={[points, 3]}/></bufferGeometry><lineBasicMaterial color="#7398ac" transparent opacity={.45}/></line>;
}
function Selection({ size, active }: { size: [number, number, number]; active: boolean }) {
  return active ? <mesh><boxGeometry args={size}/><meshBasicMaterial color={SELECTED} wireframe transparent opacity={.75} depthWrite={false}/></mesh> : null;
}
function PanelWing({ side, ratio, separated, illuminated, active }: { side: -1 | 1; ratio: number; separated: boolean; illuminated: boolean; active: boolean }) {
  // Relative catalog ratios guide a conceptual surface, never physical dimensions.
  const factor = Math.sqrt(fraction(ratio));
  const width = 1.14 * factor, height = .93 * factor;
  const center = side * (.6 + width / 2 + (separated ? .36 : 0));
  const cells = useMemo(() => Array.from({ length: 15 }, (_, i) => [((i % 5) + .5) * width / 5 - width / 2, (Math.floor(i / 5) - 1) * height / 3] as const), [width, height]);
  return <>
    <mesh position={[side * .51, .05, -.02]}><boxGeometry args={[.28, .06, .06]}/><meshStandardMaterial color={SILVER} metalness={.7} roughness={.38}/></mesh>
    {separated ? <Guide from={[side * .6,.05,0]} to={[center,.05,0]}/> : null}
    <group position={[center,.05,0]}>
      <mesh><boxGeometry args={[width + .07, height + .07, .055]}/><meshStandardMaterial color={active ? SELECTED : SILVER} metalness={.65} roughness={.38}/></mesh>
      {cells.map(([x,y],i)=><group key={i} position={[x,y,.038]}>
        <mesh><boxGeometry args={[width / 5 - .018,height / 3 - .018,.016]}/><meshStandardMaterial color={illuminated ? '#315d87' : '#162d49'} emissive={illuminated ? '#2c739b' : '#000000'} emissiveIntensity={illuminated ? .5 : 0} metalness={.4} roughness={.34}/></mesh>
        <mesh position={[0,0,.012]}><boxGeometry args={[.004,height / 3 - .025,.002]}/><meshBasicMaterial color="#99c4d7" transparent opacity={.65}/></mesh>
      </group>)}
      <Selection size={[width + .15,height + .15,.13]} active={active}/>
    </group>
  </>;
}
function Payload({ kind, id, active, processing }: { kind: SpacecraftPresentation['payload']['kind']; id: string; active: boolean; processing: boolean }) {
  if (kind === 'processor') return <group>
    <mesh><boxGeometry args={[.75,.67,.25]}/><meshStandardMaterial color={active ? '#c8bea6' : '#8ba2a9'} metalness={.6} roughness={.35}/></mesh>
    <mesh position={[0,0,.15]}><boxGeometry args={[.67,.59,.04]}/><meshStandardMaterial color="#244c49" metalness={.25} roughness={.62}/></mesh>
    {[-.24,-.08,.08,.24].map(x=><mesh key={x} position={[x,-.34,.12]}><boxGeometry args={[.07,.07,.045]}/><meshStandardMaterial color="#d8b975" metalness={.65} roughness={.35}/></mesh>)}
    {[-.22,0,.22].map(y=><mesh key={y} position={[0,y,.177]}><boxGeometry args={[.59,.012,.008]}/><meshStandardMaterial color="#b4a26a" metalness={.6} roughness={.5}/></mesh>)}
    {id === 'index' ? <group position={[0,.03,.21]}>
      <mesh><boxGeometry args={[.33,.32,.09]}/><meshStandardMaterial color="#a7c29a" emissive="#829b5e" emissiveIntensity={processing ? .85 : 0} metalness={.4} roughness={.4}/></mesh>
      {[-.12,-.06,0,.06,.12].map(x=><mesh key={x} position={[x,0,.07]}><boxGeometry args={[.018,.29,.07]}/><meshStandardMaterial color="#c4cfbd" metalness={.72} roughness={.3}/></mesh>)}
    </group> : [-.18,.18].map((x,i)=><mesh key={x} position={[x,.03,.22]}><boxGeometry args={[.22,.28,.09]}/><meshStandardMaterial color={i ? '#9ba4cc' : '#bc8e7c'} emissive={i ? '#737bb2' : '#9f5e49'} emissiveIntensity={processing ? .8 : 0} metalness={.35} roughness={.45}/></mesh>)}
    <mesh position={[0,-.22,.21]}><boxGeometry args={[.39,.1,.06]}/><meshStandardMaterial color="#182a35" emissive={processing ? '#c28e4d' : '#000000'} emissiveIntensity={processing ? .45 : 0}/></mesh>
    <Selection size={[.88,.83,.62]} active={active}/>
  </group>;
  if (kind === 'spectrometer') return <group>
    <mesh><boxGeometry args={[.72,.57,.58]}/><meshStandardMaterial color={active ? '#c9b38e' : '#889ba8'} metalness={.58} roughness={.38}/></mesh>
    <mesh position={[0,.02,.31]}><boxGeometry args={[.51,.39,.04]}/><meshStandardMaterial color="#152638" roughness={.4}/></mesh>
    <mesh position={[0,.03,.34]}><boxGeometry args={[.045,.28,.028]}/><meshBasicMaterial color={processing ? '#ccefff' : '#5c90ab'}/></mesh>
    {/* Channel colors identify the instrument; they are not a measured spectrum. */}
    {['#7c9cdd','#7bbdc5','#d9b57d'].map((color,i)=><mesh key={color} position={[-.19+i*.19,-.17,.35]}><boxGeometry args={[.11,.04,.025]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={processing ? .9 : .08}/></mesh>)}
    <Selection size={[.85,.69,.72]} active={active}/>
  </group>;
  return <group>
    <mesh><boxGeometry args={[.64,.58,.44]}/><meshStandardMaterial color={active ? '#d3b987' : COPPER} metalness={.58} roughness={.43}/></mesh>
    <group position={[0,.03,.27]} rotation={[-Math.PI / 2,0,0]}>
      <mesh><cylinderGeometry args={[.235,.235,.24,36]}/><meshStandardMaterial color={SILVER} metalness={.78} roughness={.23}/></mesh>
      <mesh position={[0,-.13,0]}><cylinderGeometry args={[.187,.187,.028,36]}/><meshStandardMaterial color="#091c31" metalness={.4} roughness={.17}/></mesh>
      <mesh position={[0,-.15,0]}><cylinderGeometry args={[.143,.143,.009,32]}/><meshStandardMaterial color={BLUE} emissive={processing ? '#5bb4d1' : '#173b58'} emissiveIntensity={processing ? .85 : .12} metalness={.72} roughness={.12}/></mesh>
    </group>
    <Selection size={[.79,.72,.87]} active={active}/>
  </group>;
}
function Battery({ ratio, energyFraction, active, available }: { ratio: number; energyFraction: number; active: boolean; available: boolean }) {
  // Capacity segments are visual units, not a count of physical battery cells.
  const cells = Math.max(1, Math.ceil(fraction(ratio) * 4));
  return <group>
    <mesh><boxGeometry args={[.77,.23,.5]}/><meshStandardMaterial color={active ? '#b8c9a5' : '#687e75'} metalness={.4} roughness={.55}/></mesh>
    {Array.from({length:cells},(_,i)=><group key={i} position={[-.255+i*.17,.16,0]}>
      <mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.067,.067,.39,16]}/><meshStandardMaterial color="#acbcb0" metalness={.7} roughness={.3}/></mesh>
      <mesh position={[0,0,.21]}><boxGeometry args={[.055,.06,.035]}/><meshStandardMaterial color="#d7b171" metalness={.65} roughness={.4}/></mesh>
    </group>)}
    {available ? <><mesh position={[0,-.02,.26]}><boxGeometry args={[.61,.07,.018]}/><meshBasicMaterial color="#132d37"/></mesh><mesh position={[-.305+.305*energyFraction,-.02,.275]}><boxGeometry args={[Math.max(.001,.61*energyFraction),.05,.012]}/><meshBasicMaterial color="#bddda3"/></mesh></> : null}
    <Selection size={[.9,.55,.63]} active={active}/>
  </group>;
}
function Radio({ hardware, transmitting, active }: { hardware: SpacecraftPresentation['communications']['radioHardware']; transmitting: boolean; active: boolean }) {
  return <group>
    <mesh position={[0,-.1,0]}><boxGeometry args={[.34,.24,.29]}/><meshStandardMaterial color={active ? '#a8c4d7' : '#637e91'} metalness={.55} roughness={.35}/></mesh>
    <mesh position={[0,.17,0]}><cylinderGeometry args={[.018,.025,.35,12]}/><meshStandardMaterial color={SILVER} metalness={.8} roughness={.26}/></mesh>
    {hardware === 'economy' ? [-1,1].map(side=><mesh key={side} position={[side*.14,.34,0]} rotation={[0,0,side*-1.16]}><cylinderGeometry args={[.009,.009,.32,10]}/><meshStandardMaterial color={SILVER} metalness={.7} roughness={.3}/></mesh>) : <group position={[0,.35,0]} rotation={[.24,0,-.16]}>
      <mesh><sphereGeometry args={[hardware === 'fast' ? .29 : .24,32,20,0,Math.PI*2,Math.PI/2,Math.PI/2]}/><meshStandardMaterial color={active ? '#d0dfeb' : '#adbfc9'} metalness={.65} roughness={.3} side={THREE.DoubleSide}/></mesh>
      <mesh position={[0,-.04,0]}><cylinderGeometry args={[.009,.009,.27,8]}/><meshStandardMaterial color="#e7c490"/></mesh>
    </group>}
    {transmitting ? <mesh position={[0,.58,.02]}><sphereGeometry args={[.045,16,10]}/><meshBasicMaterial color={ACTIVE}/></mesh> : null}
    <Selection size={[.74,1,.68]} active={active}/>
  </group>;
}

/** Original didactic spacecraft. It only consumes catalog presentation + recorded state. */
export function ConfiguredSpacecraft({ presentation, visualState, inspection = 'overview', exploded = false, turn = 0, reducedMotion = true, onInspect }: ConfiguredSpacecraftProps) {
  const [hovered,setHovered] = useState<SpacecraftInspection | null>(null);
  const available = visualState?.available === true;
  const subsystem = available ? visualState.focusSubsystem : null;
  const involved = subsystem === 'radio' ? 'communications' : subsystem === 'panel' || subsystem === 'battery' ? 'energy' : subsystem === 'processing' || subsystem === 'buffer' ? 'instrument' : null;
  const active = (part: SpacecraftInspection) => inspection === part || hovered === part || (inspection === 'overview' && involved === part);
  const processing = available && visualState.mode === 'processing';
  const transmitting = available && visualState.transmitting;
  const rotation: [number,number,number] = inspection === 'instrument' ? [.02,-.12+turn,0] : inspection === 'energy' ? [.28,.45+turn,-.05] : inspection === 'communications' ? [.48,-.36+turn,-.03] : [.18,-.38+turn,.04];
  const craft = useRef<THREE.Group>(null);
  const initialized = useRef(false);
  const destination = useMemo(() => new THREE.Euler(...rotation), [rotation[0], rotation[1], rotation[2]]);
  const target = useMemo(() => new THREE.Quaternion().setFromEuler(destination), [destination]);
  const { invalidate, frameloop } = useThree();
  useEffect(() => {
    if (!craft.current) return;
    if (!initialized.current || reducedMotion || frameloop === 'never') craft.current.quaternion.copy(target);
    initialized.current = true;
    invalidate();
  }, [target, reducedMotion, frameloop, invalidate]);
  useFrame((_, delta) => {
    if (!craft.current || reducedMotion || craft.current.quaternion.angleTo(target) < .0005) return;
    craft.current.quaternion.slerp(target, 1 - Math.exp(-12 * Math.min(delta, .05)));
    invalidate();
  });
  const interact = (part: SpacecraftInspection) => onInspect ? {
    onClick: (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onInspect(part); },
    onPointerOver: (event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); setHovered(part); },
    onPointerOut: () => setHovered(null),
  } : {};
  const payloadZ = exploded ? 1.05 : .54;
  const batteryY = exploded ? -1.12 : -.53;
  const radioY = exploded ? 1.28 : .72;
  return <group ref={craft} name={`ipe-spacecraft-${presentation.world}`} userData={{ configurationKey: presentation.configurationKey, conceptual: true }}>
    <group>
      <mesh><boxGeometry args={[.86,1.12,.68]}/><meshStandardMaterial color={COPPER} metalness={.6} roughness={.4}/></mesh>
      {[-1,1].map(side=><group key={side}><mesh position={[side*.44,0,0]}><boxGeometry args={[.055,1.25,.76]}/><meshStandardMaterial color={SILVER} metalness={.72} roughness={.3}/></mesh>{[-.58,.58].map(y=><mesh key={y} position={[0,y,side*.36]}><boxGeometry args={[.94,.06,.05]}/><meshStandardMaterial color={SILVER} metalness={.7} roughness={.3}/></mesh>)}</group>)}
      <mesh position={[0,.34,.36]}><boxGeometry args={[.63,.22,.025]}/><meshStandardMaterial color="#dcc392" metalness={.6} roughness={.42}/></mesh>
      <mesh position={[.46,-.18,.03]}><boxGeometry args={[.04,.38,.4]}/><meshStandardMaterial color="#324d5c" metalness={.35} roughness={.55}/></mesh>
      {available ? <mesh position={[.488,-.37+.19*fraction(visualState.queueFraction),.03]}><boxGeometry args={[.016,Math.max(.002,.38*fraction(visualState.queueFraction)),.34]}/><meshBasicMaterial color="#dba976"/></mesh> : null}
    </group>
    <group name="energy-system" {...interact('energy')}>
      <PanelWing side={-1} ratio={presentation.energy.panelRatio} separated={exploded} illuminated={available && visualState.illuminated} active={active('energy')}/>
      <PanelWing side={1} ratio={presentation.energy.panelRatio} separated={exploded} illuminated={available && visualState.illuminated} active={active('energy')}/>
      {exploded ? <Guide from={[0,-.53,.3]} to={[0,batteryY,.3]}/> : null}
      <group position={[0,batteryY,.3]}><Battery ratio={presentation.energy.batteryRatio} energyFraction={fraction(visualState?.energyFraction)} available={available} active={active('energy')}/></group>
    </group>
    <group name={`payload-${presentation.payload.kind}-${presentation.payload.id}`} {...interact('instrument')}>
      {exploded ? <Guide from={[0,.02,.5]} to={[0,.02,payloadZ]}/> : null}
      <group position={[0,.02,payloadZ]}><Payload kind={presentation.payload.kind} id={presentation.payload.id} active={active('instrument')} processing={processing}/></group>
    </group>
    <group name={`communications-${presentation.communications.radioHardware}`} {...interact('communications')}>
      {exploded ? <Guide from={[0,.7,-.05]} to={[0,radioY,-.05]}/> : null}
      <group position={[0,radioY,-.05]}><Radio hardware={presentation.communications.radioHardware} transmitting={transmitting} active={active('communications')}/></group>
    </group>
  </group>;
}
