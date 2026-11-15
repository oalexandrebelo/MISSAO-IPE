import { Canvas, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import type { BrunoConfig, BrunoConfigKey } from '../lab/bruno-missions.ts';

interface Props {
  config: BrunoConfig;
  active: BrunoConfigKey;
  turn: number;
  onPart: (part: BrunoConfigKey) => void;
  onUnavailable: () => void;
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

export default function BrunoHangarScene({ config, active, turn, onPart, onUnavailable }: Props) {
  const panelWidth = 1.02;
  const batteryWidth = config.energy === 'extended' ? .68 : .38;
  const protection = config.protection === 'reinforced' ? 1.1 : .93;
  const thruster = config.propulsion === 'electric' ? .18 : .28;
  const aperture = config.payload === 'survey' ? .31 : .17;
  const antennaSize = config.navigation === 'deep-space' ? .45 : .21;
  const fairingRadius = config.launcher === 'heavy' ? 1.92 : 1.58;
  const color = (key: BrunoConfigKey, normal: string) => active === key ? '#f7cc9f' : normal;
  return <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [4.7, 3.1, 5.4], fov: 37 }} gl={{ antialias: true, powerPreference: 'low-power' }} aria-hidden="true">
    <ContextListener onUnavailable={onUnavailable}/>
    <ambientLight intensity={1.1}/>
    <directionalLight position={[3, 5, 4]} intensity={2.1} color="#f3dbbe"/>
    <directionalLight position={[-4, 1.5, -3]} intensity={1.2} color="#81c8e2"/>
    <gridHelper args={[8, 16, '#456277', '#263845']} position={[0, -1.05, 0]}/>
    <group rotation={[0, turn - .16, 0]}>
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
      <group position={[.17, .53, .05]} rotation={[0, 0, -.36]} onClick={e => { e.stopPropagation(); onPart('navigation'); }}>
        <mesh position={[0, .15, 0]}><cylinderGeometry args={[.033, .033, .32, 10]}/><meshStandardMaterial color="#bcc0ae"/></mesh>
        <mesh position={[0, .34, 0]}><cylinderGeometry args={[antennaSize, antennaSize * .65, .055, 24]}/><meshStandardMaterial color={color('navigation', '#88b5c3')} metalness={.35} roughness={.6}/></mesh>
      </group>
      <group position={[0, .04, protection / 2]} onClick={e => { e.stopPropagation(); onPart('payload'); }}>
        <mesh position={[0, 0, .09]}><boxGeometry args={[aperture * 2.35, aperture * 1.65, .24]}/><meshStandardMaterial color={color('payload', '#c49e67')} metalness={.5} roughness={.35}/></mesh>
        <mesh position={[0, 0, .25]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[aperture * .53, aperture * .62, .13, 24]}/><meshStandardMaterial color="#335568" metalness={.62} roughness={.24}/></mesh>
      </group>
    </group>
  </Canvas>;
}
