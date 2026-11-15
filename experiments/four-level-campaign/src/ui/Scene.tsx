import { Component, lazy, Suspense, useCallback, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import type { MissionConfig } from '../core/contracts.ts';
import { CATALOG, CONFIG_KEYS, DEFAULT_CONFIG } from '../core/catalog.ts';
import { Icon } from './Icon.tsx';
import { CONTINENTS } from './scene-geometry.ts';
import './scene-orbit.css';

const OrbitalScene = lazy(() => import('./OrbitalScene.tsx'));
export type SceneFocus = 'science' | 'satellite' | 'ground';
export type SceneVariant = 'orbit' | 'hangar';
export interface SceneProps { compact?: boolean; progress?: number; config?: MissionConfig; variant?: SceneVariant; }

const ORBIT_VIEWS: readonly { id: SceneFocus; number: string; name: string; text: string }[] = [
  { id: 'science', number: '01', name: 'O Cerrado', text: 'A pergunta científica parte de seis registros históricos de vegetação Terra/MODIS.' },
  { id: 'satellite', number: '02', name: 'Seu CubeSat', text: 'Um satélite didático. Você decide como ele usa energia, processa e transporta os arquivos.' },
  { id: 'ground', number: '03', name: 'A estação', text: 'Cada registro precisa chegar completo ao solo e passar pela validação científica.' },
];
const HANGAR_VIEWS: readonly { id: SceneFocus; number: string; name: string; text: string }[] = [
  { id: 'satellite', number: '01', name: 'Geral', text: 'As peças acompanham as escolhas do projeto.' },
  { id: 'science', number: '02', name: 'Instrumento', text: 'Vista frontal do instrumento e do processamento.' },
  { id: 'ground', number: '03', name: 'Energia', text: 'Vista dos painéis e do módulo de bateria.' },
];

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable(); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function canRenderWebGL(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  // Check before importing R3F. Blocked contexts and jsdom get the SVG equivalent.
  try {
    const probe = document.createElement('canvas');
    probe.width = 1; probe.height = 1;
    const context = probe.getContext('webgl2', { failIfMajorPerformanceCaveat: false });
    if (!context) return false;
    // A privacy wrapper can hide the constructor or an extension while still
    // providing WebGL2. Only creation determines availability; cleanup is best effort.
    try { context.getExtension('WEBGL_lose_context')?.loseContext(); } catch { /* Context was available. */ }
    return true;
  } catch { return false; }
}

function useSceneActivity(host: RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(true);
  const [inViewport, setInViewport] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false);
  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    const motion = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const onMotion = () => setReducedMotion(motion?.matches ?? false);
    motion?.addEventListener?.('change', onMotion);
    const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(([entry]) => setInViewport(entry?.isIntersecting ?? true), { rootMargin: '80px' }) : null;
    if (host.current) observer?.observe(host.current);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      motion?.removeEventListener?.('change', onMotion);
      observer?.disconnect();
    };
  }, [host]);
  return { active: visible && inViewport, reducedMotion };
}

function globePath(points: readonly (readonly [number, number])[]) {
  return points.map(([longitude, latitude], index) => {
    const lat = latitude * Math.PI / 180;
    const lon = (longitude + 76) * Math.PI / 180;
    return `${index === 0 ? 'M' : 'L'}${(340 + Math.sin(lon) * Math.cos(lat) * 198).toFixed(1)},${(302 - Math.sin(lat) * 198).toFixed(1)}`;
  }).join(' ') + 'Z';
}

function FlatSatellite({ large, config, focus }: { large: boolean; config: MissionConfig; focus: SceneFocus }) {
  const panelWidth = config.panel === 'standard' ? 126 : 88;
  const batteryHeight = config.battery === 'large' ? 150 : 126;
  const tilt = focus === 'science' ? 0 : focus === 'ground' ? -28 : -15;
  return <g transform={large ? `translate(360 250) rotate(${tilt}) scale(1.1)` : 'translate(535 173) rotate(-19) scale(.45)'}>
    <path d={`M${-panelWidth - 56} -45h${panelWidth}v89h-${panelWidth}z M56 -45h${panelWidth}v89H56z`} fill="#1d4054" stroke="#9aadb2" strokeWidth="3" />
    {[-1, 1].map(side => <g key={side}>
      {[1, 2, 3, 4].map(column => <path key={column} d={`M${side * (56 + column * panelWidth / 5)} -44V44`} stroke="#88a4b2" strokeWidth="1" opacity=".65" />)}
      {[-15, 15].map(row => <path key={row} d={`M${side * 56} ${row}h${side * panelWidth}`} stroke="#88a4b2" strokeWidth="1" opacity=".65" />)}
      <path d={`M${side * 37} 0h${side * 19}`} stroke="#bfc8cc" strokeWidth="8" />
    </g>)}
    <path d={`M-37 -67l13 -13h74v${batteryHeight}l-13 13z`} fill="#5f5239" stroke="#b3b9b5" strokeWidth="2" />
    <path d={`M-37 -67h74v${batteryHeight}h-74z`} fill="#c7a469" stroke="#d1d6cd" strokeWidth="3" />
    <path d={`M-26 -56h52v${batteryHeight - 22}h-52z`} fill="#d6b57d" stroke="#aa864a" strokeWidth="1" />
    <path d="M-37 -21h74 M-37 23h74" stroke="#f3d6a5" strokeWidth="3" />
    <path d="M-42 -67h84 M-42 59h84" stroke="#d5d9cc" strokeWidth="6" />
    {config.battery === 'large' ? <path d="M-31 60h62v16h-62z" fill="#9cab87" stroke="#d1d6cd" strokeWidth="2" /> : null}
    <circle cx="0" cy="12" r="19" fill="#0c1722" stroke="#b9c9ca" strokeWidth="5" />
    <circle cx="0" cy="12" r="10" fill="#365d77" stroke="#68889a" strokeWidth="2" /><circle cx="-3" cy="8" r="3" fill="#c8e0eb" />
    <path d="M0 -67v-35" stroke="#ced5d5" strokeWidth="3" />
    {config.radio === 'fast' ? <path d="M-30 -108Q0 -72 30 -108Z" fill="#b2c0bd" stroke="#e0e4d5" strokeWidth="2" /> : <path d="M0 -100l-26 -14m26 14 26 -14" stroke="#d5e2d0" strokeWidth="2" />}
    <rect x="-22" y="-54" width="44" height="20" rx="2" fill={config.processing === 'index' ? '#aac875' : '#6d7e85'} />
    <rect x="39" y="-14" width="9" height={config.buffer === 'large' ? 40 : 21} rx="1" fill="#6e8586" stroke="#aebcb7" strokeWidth="1" />
    <circle cx="25" cy="-45" r="3" fill="#d5f894" />
  </g>;
}

function FlatScene({ variant, config, focus }: { variant: SceneVariant; config: MissionConfig; focus: SceneFocus }) {
  const prefix = useId().replace(/:/g, '');
  const isHangar = variant === 'hangar';
  return <div className={`orbit-flat orbit-flat-${variant}`} aria-hidden="true"><svg viewBox={isHangar ? '0 0 720 500' : '0 0 720 650'} preserveAspectRatio="xMidYMid meet">
    <defs>
      <radialGradient id={`${prefix}-ocean`} cx="32%" cy="27%" r="78%"><stop stopColor="#35545b" /><stop offset=".5" stopColor="#173342" /><stop offset="1" stopColor="#06121f" /></radialGradient>
      <radialGradient id={`${prefix}-shade`} cx="26%" cy="25%" r="77%"><stop offset=".48" stopColor="#030b13" stopOpacity="0" /><stop offset="1" stopColor="#030b13" stopOpacity=".88" /></radialGradient>
      <radialGradient id={`${prefix}-glow`}><stop offset=".84" stopColor="#8cc8d6" stopOpacity="0" /><stop offset=".93" stopColor="#91d2dc" stopOpacity=".12" /><stop offset=".955" stopColor="#9cd5df" stopOpacity=".28" /><stop offset="1" stopColor="#8cc8d6" stopOpacity="0" /></radialGradient>
      <clipPath id={`${prefix}-globe`}><circle cx="340" cy="302" r="198" /></clipPath>
      <pattern id={`${prefix}-stars`} width="190" height="170" patternUnits="userSpaceOnUse"><circle cx="23" cy="72" r=".8" fill="#c3d0d4" opacity=".6" /><circle cx="136" cy="14" r="1" fill="#aeb9c3" opacity=".4" /><circle cx="75" cy="141" r=".6" fill="#aeb9c3" opacity=".7" /></pattern>
    </defs>
    <rect width="720" height="650" fill={`url(#${prefix}-stars)`} />
    {isHangar ? <g fill="none" stroke="#819990" strokeWidth=".75">
      <ellipse cx="360" cy="250" rx="245" ry="184" strokeDasharray="2 8" opacity=".3" /><ellipse cx="360" cy="390" rx="228" ry="52" opacity=".24" />
      <path d="M125 250H595M360 76V430" strokeDasharray="4 8" opacity=".18" />
      <path d="M150 130v-24h24m372 0h24v24M150 375v24h24m372 0h24v-24" stroke="#d5f894" opacity=".6" />
    </g> : <>
      <ellipse cx="343" cy="300" rx="289" ry="134" transform="rotate(-27 343 300)" fill="none" stroke="#b5c5bb" strokeWidth=".9" opacity=".42" />
      <ellipse cx="343" cy="300" rx="267" ry="152" transform="rotate(42 343 300)" fill="none" stroke="#8aa7b8" strokeWidth=".7" opacity=".25" />
      <circle cx="340" cy="302" r="214" fill={`url(#${prefix}-glow)`} /><circle cx="340" cy="302" r="198" fill={`url(#${prefix}-ocean)`} />
      <g clipPath={`url(#${prefix}-globe)`}>
        {CONTINENTS.slice(0, 4).map((continent, index) => <path key={index} d={globePath(continent)} fill={index === 2 ? '#91a9a3' : '#778b71'} stroke="#9aa98e" strokeWidth=".6" />)}
        {[-120, -70, 0, 70, 120].map(offset => <ellipse key={offset} cx="340" cy="302" rx={Math.max(30, 198 - Math.abs(offset))} ry="198" fill="none" stroke="#abc5c3" strokeWidth=".65" opacity=".2" />)}
        {[-120, -60, 0, 60, 120].map(offset => <ellipse key={offset} cx="340" cy={302 + offset} rx="198" ry="27" fill="none" stroke="#abc5c3" strokeWidth=".65" opacity=".2" />)}
        <path d="M201 200q70 -56 131 -25t100 16M164 327q80 -22 125 4t90 9M293 403q63 7 120 -35" fill="none" stroke="#d7e8e5" strokeWidth="8" strokeLinecap="round" opacity=".13" />
        <circle cx="340" cy="302" r="198" fill={`url(#${prefix}-shade)`} />
        <circle cx="384" cy="363" r={focus === 'science' ? 25 : 16} fill="#d5f894" opacity=".1" stroke="#d5f894" strokeWidth="1" /><circle cx="384" cy="363" r="3" fill="#d5f894" />
      </g>
      <path d="M80 378C206 459 485 360 594 237" fill="none" stroke="#b6cbaf" strokeWidth=".8" opacity=".5" />
    </>}
    <FlatSatellite large={isHangar} config={config} focus={focus} />
  </svg></div>;
}

export function Scene({ compact = false, progress = 0, config = DEFAULT_CONFIG, variant = 'orbit' }: SceneProps) {
  const host = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<'3d' | '2d'>('3d');
  const [checked, setChecked] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [paused, setPaused] = useState(variant === 'hangar');
  const [focus, setFocus] = useState<SceneFocus>('satellite');
  const [turn, setTurn] = useState(0);
  const { active, reducedMotion } = useSceneActivity(host);
  const descriptionId = useId();
  const useFallback = useCallback(() => { setUnavailable(true); setMode('2d'); }, []);
  useEffect(() => { if (!canRenderWebGL()) useFallback(); setChecked(true); }, [useFallback]);
  const views = variant === 'hangar' ? HANGAR_VIEWS : ORBIT_VIEWS;
  const selected = views.find(item => item.id === focus) ?? views[0]!;
  const animating = !paused && !reducedMotion && active && mode === '3d';
  const fallback = <FlatScene variant={variant} config={config} focus={focus} />;
  const configDescription = CONFIG_KEYS.map(key => CATALOG[key].find(choice => choice.id === config[key])?.label).filter(Boolean).join('; ');
  const motionPaused = paused || reducedMotion || mode === '2d';

  return <section ref={host} className={`scene scene-orbit scene-${variant} ${compact ? 'scene-compact' : ''}`} aria-label={variant === 'hangar' ? 'Modelo visual do CubeSat' : 'Modelo visual da missão'} aria-describedby={descriptionId} data-visual-mode={checked && mode === '3d' ? '3d' : '2d'}>
    <div className="orbit-grid" aria-hidden="true" /><div className="orbit-corner orbit-corner-tl" aria-hidden="true" /><div className="orbit-corner orbit-corner-br" aria-hidden="true" />
    <div className="orbit-topline"><span className="orbit-eyebrow"><i />{variant === 'hangar' ? 'IPÊ–01 / SEU PROJETO' : 'MISSÃO IPÊ / TERRA'}</span><div className="orbit-display-tools">
      <button type="button" className="orbit-tool" onClick={() => setPaused(value => !value)} aria-label={motionPaused ? 'Retomar animação ilustrativa' : 'Pausar animação ilustrativa'} aria-pressed={motionPaused} disabled={mode === '2d' || reducedMotion} title={reducedMotion ? 'Movimento reduzido acompanha sua preferência do dispositivo' : undefined}><Icon name={motionPaused ? 'play' : 'pause'} size={13} /><span>{motionPaused ? 'Pausada' : 'Pausar'}</span></button>
      <button type="button" className="orbit-tool orbit-mode" onClick={() => setMode(value => value === '3d' ? '2d' : '3d')} aria-label={`Usar visualização ${mode === '3d' ? '2D' : '3D'}`} disabled={unavailable}><Icon name="layers" size={13} /><span>{unavailable ? '2D ativo' : mode === '3d' ? 'Ver em 2D' : 'Ver em 3D'}</span></button>
    </div></div>
    <div className="orbit-render" aria-hidden="true">{checked && mode === '3d' ? <SceneBoundary fallback={fallback} onUnavailable={useFallback}><Suspense fallback={fallback}><OrbitalScene focus={focus} progress={progress} config={config} variant={variant} animating={animating} active={active} reducedMotion={reducedMotion} turn={turn} onUnavailable={useFallback} /></Suspense></SceneBoundary> : fallback}</div>
    {variant === 'orbit' ? <div className="orbit-map-label" aria-hidden="true"><span className="orbit-map-cross" /><span>CERRADO BRASILEIRO<small>ÁREA DE INTERESSE</small></span></div> : <>
      <span className="orbit-hangar-mark" aria-hidden="true">IPÊ<span>01</span></span>
      <div className="orbit-part-label orbit-part-panel" aria-hidden="true"><span />PAINÉIS {config.panel === 'standard' ? '18 W' : '12 W'}</div>
      <div className="orbit-part-label orbit-part-battery" aria-hidden="true">BATERIA {config.battery === 'large' ? '24 Wh' : '16 Wh'}<span /></div>
    </>}
    <div className="orbit-bottom">
      <div className="orbit-viewbar" role="group" aria-label={variant === 'hangar' ? 'Vistas do CubeSat' : 'Explore a missão'}>{views.map(item => <button key={item.id} type="button" className={`orbit-view ${focus === item.id ? 'is-active' : ''}`} aria-pressed={focus === item.id} onClick={() => { setFocus(item.id); setTurn(0); }}><span>{item.number}</span>{item.name}</button>)}
        {variant === 'hangar' ? <div className="orbit-turn-controls"><button className="orbit-tool orbit-turn" type="button" aria-label="Girar satélite para a esquerda" onClick={() => setTurn(value => value - Math.PI / 6)} disabled={mode === '2d'}><Icon name="back" size={15} /></button><button className="orbit-tool orbit-turn" type="button" aria-label="Girar satélite para a direita" onClick={() => setTurn(value => value + Math.PI / 6)} disabled={mode === '2d'}><Icon name="arrow" size={15} /></button></div> : null}
      </div>
      {!compact ? <div className="orbit-explanation" aria-live="polite"><p>{selected.text}</p></div> : <p className="orbit-compact-note" aria-live="polite">{selected.text}</p>}
      <p className="orbit-caption" id={descriptionId}>{unavailable ? <span>3D indisponível · equivalente 2D ativo</span> : null}<span>Ilustração sem escala · física calculada separadamente</span></p>
    </div>
    <p className="sr-only">{variant === 'hangar' ? 'CubeSat didático com corpo dourado, painéis solares azuis, bateria, antena e instrumento. ' : 'Terra esférica com continentes aproximados, órbitas ilustrativas e um CubeSat didático. '}{configDescription}. A animação não indica altitude, posição, cobertura ou telemetria reais. Todos os controles da missão estão disponíveis fora desta ilustração.</p>
  </section>;
}
