import { Component, lazy, Suspense, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { Icon } from './Icon.tsx';

const OrbitalScene = lazy(() => import('./OrbitalScene.tsx'));
export type SceneFocus = 'science' | 'satellite' | 'ground';
const HOTSPOTS: readonly { id: SceneFocus; number: string; name: string; text: string }[] = [
  { id: 'science', number: '01', name: 'A pergunta', text: 'Entregar seis índices de vegetação válidos, calculados a partir de arquivos históricos MOD13Q1.' },
  { id: 'satellite', number: '02', name: 'Seu CubeSat', text: 'Seis decisões de projeto conectam energia, processamento, armazenamento e comunicação.' },
  { id: 'ground', number: '03', name: 'A chegada', text: 'Um registro só conta quando chega completo à estação e passa pela validação científica.' },
];
class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
function FlatScene() {
  return <div className="flat-scene" aria-hidden="true">
    <div className="flat-orbit orbit-one" /><div className="flat-orbit orbit-two" />
    <div className="flat-earth"><div className="flat-land land-one" /><div className="flat-land land-two" /><span className="flat-station" /></div>
    <div className="flat-satellite"><span /><i /><span /></div>
    <div className="flat-sun" />
  </div>;
}
export function Scene({ compact = false, progress = 0 }: { compact?: boolean; progress?: number }) {
  const [mode, setMode] = useState<'3d' | '2d'>('3d');
  const [focus, setFocus] = useState<SceneFocus>('satellite');
  const [unavailable, setUnavailable] = useState(false);
  const useFallback = useCallback(() => { setUnavailable(true); setMode('2d'); }, []);
  const selected = HOTSPOTS.find((item) => item.id === focus) ?? HOTSPOTS[1];
  return <section className={`scene ${compact ? 'scene-compact' : ''}`} aria-label="Modelo visual da missão">
    <div className="scene-grid" aria-hidden="true" />
    <div className="scene-top"><span><i className="status-dot" /> SISTEMA IPÊ · DIORAMA</span><button type="button" className="scene-mode" onClick={() => setMode(mode === '3d' ? '2d' : '3d')}><Icon name="layers" size={14} /> {mode === '3d' ? 'Ver em 2D' : 'Ver em 3D'}</button></div>
    {mode === '3d' ? <SceneBoundary fallback={<FlatScene />}><Suspense fallback={<FlatScene />}><OrbitalScene focus={focus} progress={progress} onUnavailable={useFallback} /></Suspense></SceneBoundary> : <FlatScene />}
    {!compact ? <>
      <div className="hotspots" aria-label="Explore a missão">{HOTSPOTS.map((item) => <button type="button" className={`hotspot hotspot-${item.id} ${item.id === focus ? 'is-active' : ''}`} key={item.id} aria-pressed={item.id === focus} onClick={() => setFocus(item.id)}><span>{item.number}</span><b>{item.name}</b></button>)}</div>
      <div className="scene-description" aria-live="polite"><span className="scene-description-number">{selected?.number}</span><div><strong>{selected?.name}</strong><p>{selected?.text}</p></div></div>
    </> : null}
    <span className="scene-caption">{unavailable && mode === '2d' ? '3D indisponível · equivalente 2D ativo · ' : ''}Ilustração sem escala · nenhuma física calculada nesta vista</span>
  </section>;
}
