import { BRUNO_INSTRUMENTS } from '../lab/bruno-missions.ts';
import type { BrunoInstrumentId } from '../lab/bruno-missions.ts';

type Vector = [number, number, number];
function Block({ size, color, position = [0, 0, 0], rotation = [0, 0, 0] }: { size: Vector; color: string; position?: Vector; rotation?: Vector }) {
  return <mesh position={position} rotation={rotation}>
    <boxGeometry args={size} /><meshStandardMaterial color={color} metalness={.42} roughness={.43} />
  </mesh>;
}
function Tube({ size, color, position = [0, 0, 0], rotation = [0, 0, 0] }: { size: Vector; color: string; position?: Vector; rotation?: Vector }) {
  return <mesh position={position} rotation={rotation}>
    <cylinderGeometry args={[...size, 16]} /><meshStandardMaterial color={color} metalness={.36} roughness={.46} />
  </mesh>;
}

function InstrumentHousing({ id }: { id: BrunoInstrumentId }) {
  const front: Vector = [Math.PI / 2, 0, 0];
  switch (id) {
    case 'iss-air-quality': return <>
      <Block size={[.86, .51, .48]} color="#a68a64" />
      <Block size={[.69, .32, .035]} position={[0, 0, .25]} color="#273e4a" />
      {[-.21, 0, .21].map(x => <Block key={x} size={[.055, .21, .04]} position={[x, 0, .28]} color="#b6cfd2" />)}
    </>;
    case 'lunar-neutron': return <>
      <Tube size={[.28, .32, .74]} color="#727497" />
      {[-.2, .08, .33].map(y => <Tube key={y} size={[.31, .31, .036]} position={[0, y, 0]} color="#b9c4c9" />)}
      <Tube size={[.11, .11, .13]} position={[0, .42, 0]} color="#d6a957" />
    </>;
    case 'lunar-diviner': return <>
      <Block size={[1, .43, .44]} color="#8c9caa" />
      {[-.25, .25].map(x => <group key={x} position={[x, 0, .21]}>
        <Tube size={[.16, .19, .25]} rotation={front} color="#cca76c" />
        <Tube size={[.12, .12, .04]} position={[0, 0, .14]} rotation={front} color="#1e4b66" />
      </group>)}
    </>;
    case 'mars-meda': return <>
      <Block size={[.55, .16, .36]} position={[0, -.32, 0]} color="#a39879" />
      <Tube size={[.048, .073, .72]} position={[0, .02, 0]} color="#c9c6b6" />
      <Block size={[.8, .068, .055]} position={[0, .25, 0]} color="#c9c6b6" />
      {[-.39, .39].map(x => <Tube key={x} size={[.095, .08, .16]} position={[x, .25, 0]} color="#d88566" />)}
      <Tube size={[.11, .14, .12]} position={[0, .41, 0]} color="#427a83" />
    </>;
    case 'europa-mise': return <>
      <Block size={[.85, .55, .48]} color="#1f5278" />
      <Block size={[.62, .115, .055]} position={[0, .09, .27]} color="#b2cad7" />
      <Block size={[.42, .048, .035]} position={[0, .09, .31]} color="#7147a2" />
      {[-.25, -.08, .08, .25].map(x => <Block key={x} size={[.06, .12, .38]} position={[x, .32, 0]} color="#8196ab" />)}
    </>;
    case 'europa-reason': return <>
      <Block size={[.37, .37, .34]} color="#536b83" />
      {[-.34, .34].map(angle => <group key={angle} rotation={[0, 0, angle]}>
        <Block size={[1.5, .045, .067]} color="#b9bfc9" />
        {[-.7, .7].map(x => <Block key={x} size={[.18, .1, .11]} position={[x, 0, 0]} color="#c49e67" />)}
      </group>)}
      <Tube size={[.14, .14, .15]} position={[0, 0, .22]} rotation={front} color="#ba995e" />
    </>;
    case 'bennu-ovirs': return <>
      <Block size={[.59, .21, .62]} position={[0, -.23, 0]} color="#64818c" />
      <Tube size={[.28, .16, .63]} rotation={front} color="#baa468" />
      <Tube size={[.255, .255, .09]} position={[0, 0, .34]} rotation={front} color="#95b5c8" />
      <Tube size={[.193, .19, .042]} position={[0, 0, .39]} rotation={front} color="#173b55" />
    </>;
  }
}

export function BrunoInstrumentMesh({ id, usesRemaining, selected = false, operating = false }: { id: BrunoInstrumentId; usesRemaining?: number; selected?: boolean; operating?: boolean }) {
  const { durability } = BRUNO_INSTRUMENTS[id];
  return <group name={`instrument-${id}`} userData={{ usesRemaining: usesRemaining ?? durability, operating }}>
    <InstrumentHousing id={id} />
    <Block size={[.51, .11, .075]} position={[0, -.47, .2]} color="#2b404d" />
    {Array.from({ length: durability }, (_, index) => <Block key={index}
      size={[.065, .038, .028]} position={[(index - (durability - 1) / 2) * .107, -.47, .25]}
      color={index < (usesRemaining ?? durability) ? '#eca53c' : '#526773'} />)}
    {selected ? <mesh><boxGeometry args={[id === 'europa-reason' ? 1.8 : 1.14, 1.14, .95]} /><meshBasicMaterial color="#f4d0a0" wireframe transparent opacity={.8} depthWrite={false} /></mesh> : null}
    {operating ? <mesh name="recorded-instrument-operation" position={[.3, -.35, .3]}><sphereGeometry args={[.045, 12, 8]} /><meshBasicMaterial color="#c8e8a9" /></mesh> : null}
  </group>;
}
