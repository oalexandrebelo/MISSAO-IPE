import { Canvas, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { BRUNO_INSTRUMENTS } from '../lab/bruno-missions.ts';
import type { BrunoConfig, BrunoConfigKey, BrunoInstrumentId, BrunoInventoryConfig, BrunoResult } from '../lab/bruno-missions.ts';
import { BrunoInstrumentMesh } from './BrunoInstrumentMesh.tsx';

interface Props {
  config: BrunoConfig | BrunoInventoryConfig;
  active: BrunoConfigKey;
  turn: number;
  onPart: (part: BrunoConfigKey) => void;
  onUnavailable: () => void;
  flightPhase?: BrunoResult['timeline'][number]['phase'];
}
function ContextListener({ onUnavailable }: Pick<Props, 'onUnavailable'>) {
  const canvas = useThree(state => state.gl.domElement);
  useEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); onUnavailable(); };
    canvas.addEventListener('webglcontextlost', lost);
    return () => canvas.removeEventListener('webglcontextlost', lost);
  }, [canvas, onUnavailable]);
  return null;
}

export function BrunoInstrumentScene({ id, turn, onUnavailable }: { id: BrunoInstrumentId; turn: number; onUnavailable: () => void }) {
  return <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [2.3, 1.6, 2.85], fov: 31 }} gl={{ antialias: true, powerPreference: 'low-power' }} aria-hidden="true">
    <ContextListener onUnavailable={onUnavailable} />
    <ambientLight intensity={1.3} />
    <directionalLight position={[3, 4, 4]} intensity={2.45} color="#ffe0b5" />
    <directionalLight position={[-3, 1, -3]} intensity={1.5} color="#97caff" />
    <group rotation={[.08, turn - .25, 0]}><BrunoInstrumentMesh id={id} /></group>
  </Canvas>;
}

export default function BrunoHangarScene({ config, active, turn, onPart, onUnavailable, flightPhase }: Props) {
  const panelWidth = 1.02;
  const batteryWidth = config.energy === 'extended' ? .68 : .38;
  const protection = config.protection === 'reinforced' ? 1.1 : .93;
  const thruster = config.propulsion === 'electric' ? .18 : .28;
  const aperture = config.payload === 'survey' ? .31 : .17;
  const antennaSize = config.navigation === 'deep-space' ? .45 : .21;
  const fairingRadius = config.launcher === 'heavy' ? 1.92 : 1.58;
  const color = (key: BrunoConfigKey, normal: string) => active === key ? '#f7cc9f' : normal;
  const loadout = 'loadout' in config ? config.loadout : null;
  const totalSlots = loadout?.reduce((total, item) => total + BRUNO_INSTRUMENTS[item.instrumentId].slots, 0) ?? 0;
  let slot = -totalSlots / 2;
  return <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [4.7, 3.1, 5.4], fov: 37 }} gl={{ antialias: true, powerPreference: 'low-power' }} aria-hidden="true">
    <ContextListener onUnavailable={onUnavailable}/>
    <ambientLight intensity={1.1}/>
    <directionalLight position={[3, 5, 4]} intensity={2.1} color="#f3dbbe"/>
    <directionalLight position={[-4, 1.5, -3]} intensity={1.2} color="#81c8e2"/>
    {!flightPhase ? <gridHelper args={[8, 16, '#456277', '#263845']} position={[0, -1.05, 0]}/> : null}
    <group rotation={[flightPhase === 'transfer' ? -.3 : 0, turn - .16, flightPhase === 'transfer' ? -.4 : 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.95, 0]} onClick={e => { e.stopPropagation(); onPart('launcher'); }}>
        <torusGeometry args={[fairingRadius, .023, 8, 72]}/>
        <meshStandardMaterial color={color('launcher', '#53646c')} roughness={.7}/>
      </mesh>
      <mesh onClick={e => { e.stopPropagation(); onPart('protection'); }}>
        <boxGeometry args={[protection, 1.08, protection]}/>
        <meshStandardMaterial color={color('protection', '#a2a9a7')} metalness={.55} roughness={.36}/>
      </mesh>
      {[-1, 1].map(side => <group key={side} position={[side * (.58 + panelWidth / 2), .09, 0]}
        onClick={e => { e.stopPropagation(); onPart('energy'); }}>
        <mesh><boxGeometry args={[panelWidth, .075, .76]}/><meshStandardMaterial color={color('energy', '#315e7c')} metalness={.5} roughness={.32}/></mesh>
        {[-.29, -.1, .1, .29].map(offset => <mesh key={offset} position={[0, .041, offset]}>
          <boxGeometry args={[panelWidth * .98, .013, .018]}/><meshStandardMaterial color="#a1becc"/>
        </mesh>)}
      </group>)}
      <mesh position={[0, -.29, protection / 2 + .035]} onClick={e => { e.stopPropagation(); onPart('energy'); }}>
        <boxGeometry args={[batteryWidth, .17, .13]}/>
        <meshStandardMaterial color={color('energy', '#678e93')} metalness={.4} roughness={.45}/>
      </mesh>
      <mesh position={[0, -.65, 0]} onClick={e => { e.stopPropagation(); onPart('propulsion'); }}>
        <cylinderGeometry args={[thruster * .7, thruster, .29, 18]}/>
        <meshStandardMaterial color={color('propulsion', config.propulsion === 'electric' ? '#53a4c4' : '#ba7562')} metalness={.43} roughness={.42}/>
      </mesh>
      {flightPhase === 'launch' || flightPhase === 'transfer' ? <mesh position={[0, -1.04, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[thruster * .66, .5, 18]}/><meshBasicMaterial color={config.propulsion === 'electric' ? '#74dcff' : '#ffc485'} transparent opacity={.8}/>
      </mesh> : null}
      <group position={[.17, .53, .05]} rotation={[0, 0, -.36]} onClick={e => { e.stopPropagation(); onPart('navigation'); }}>
        <mesh position={[0, .15, 0]}><cylinderGeometry args={[.033, .033, .32, 10]}/><meshStandardMaterial color="#bcc0ae"/></mesh>
        <mesh position={[0, .34, 0]}><cylinderGeometry args={[antennaSize, antennaSize * .65, .055, 24]}/><meshStandardMaterial color={color('navigation', '#88b5c3')} metalness={.35} roughness={.6}/></mesh>
      </group>
      {flightPhase === 'downlink' ? <group position={[.17, .95, .05]} rotation={[0, 0, -.36]}>
        {[.2, .45, .7].map(distance => <mesh key={distance} position={[0, distance, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[antennaSize + distance * .22, .015, 8, 36]}/><meshBasicMaterial color="#a8e9f1"/>
        </mesh>)}
      </group> : null}
      <group position={[0, .04, protection / 2]} onClick={e => { e.stopPropagation(); onPart('payload'); }}>
        {loadout ? <>
          <mesh position={[0, -.03, .035]}><boxGeometry args={[protection * .9, .34, .1]} /><meshStandardMaterial color={color('payload', '#345264')} metalness={.45} roughness={.53} /></mesh>
          {loadout.map((unit, index) => {
            const width = BRUNO_INSTRUMENTS[unit.instrumentId].slots;
            const x = (slot + width / 2) * .29;
            slot += width;
            return <group key={`${unit.instrumentId}-${index}`} position={[x, .035, .25]} scale={.29}>
              <BrunoInstrumentMesh id={unit.instrumentId} usesRemaining={unit.usesRemaining} />
            </group>;
          })}
        </> : <>
          <mesh position={[0, 0, .09]}><boxGeometry args={[aperture * 2.35, aperture * 1.65, .24]}/><meshStandardMaterial color={color('payload', '#c49e67')} metalness={.5} roughness={.35}/></mesh>
          <mesh position={[0, 0, .25]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[aperture * .53, aperture * .62, .13, 24]}/><meshStandardMaterial color="#335568" metalness={.62} roughness={.24}/></mesh>
        </>}
      </group>
      {flightPhase === 'acquisition' && (loadout === null || loadout.length > 0) ? <mesh position={[0, .04, protection / 2 + .9]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[.43, 1.25, 24, 1, true]}/><meshBasicMaterial color="#e4bd85" transparent opacity={.18} depthWrite={false}/>
      </mesh> : null}
    </group>
  </Canvas>;
}
