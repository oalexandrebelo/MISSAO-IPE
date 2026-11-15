import { usePlayerMetrics } from './PlayerMetrics.tsx';
import { Component, lazy, Suspense, useCallback, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import type { MissionVisualState } from '../lab/mission-visual-state.ts';
import { getSpacecraftPresentation } from '../lab/spacecraft-presentation.ts';
import type { SpacecraftInspection } from '../lab/spacecraft-presentation.ts';
import { DEFAULT_EXPEDITION_CONFIGS } from '../lab/scientific-expeditions.ts';
import type { ExpeditionConfig } from '../lab/scientific-expeditions.ts';
import { FlatConfiguredCraft, INSPECTIONS, SpacecraftInspector } from './SpacecraftInspector.tsx';
import type { MissionConfig, ScenarioId } from '../core/contracts.ts';
import { CATALOG, CONFIG_KEYS, DEFAULT_CONFIG } from '../core/catalog.ts';
import { Icon } from './Icon.tsx';
import { CONTINENTS } from './scene-geometry.ts';
import './scene-orbit.css';
import './spacecraft-immersion.css';

const OrbitalScene = lazy(() => import('./OrbitalScene.tsx'));
export type SceneFocus = 'science' | 'satellite' | 'ground';
export type SceneVariant = 'orbit' | 'hangar';
export type MissionWorld = 'earth' | 'bennu' | 'telescope';
export type MissionSegment = 'space' | 'ground' | 'launch' | 'user';
export interface SceneProps { preview?: boolean; compact?: boolean; progress?: number; config?: MissionConfig; variant?: SceneVariant; visualState?: MissionVisualState; segment?: MissionSegment; world?: MissionWorld; scienceRecordCount?: number; expeditionConfig?: ExpeditionConfig; scenarioId?: ScenarioId; inspectSubsystem?: SpacecraftInspection; }

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

export function canRenderWebGL(): boolean {
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

function FlatSatellite({ large, config, focus, visualState }: { large: boolean; config: MissionConfig; focus: SceneFocus; visualState?: MissionVisualState }) {
  const panelWidth = config.panel === 'standard' ? 126 : 88;
  const batteryHeight = config.battery === 'large' ? 150 : 126;
  const tilt = focus === 'science' ? 0 : focus === 'ground' ? -28 : -15;
  return <g transform={large ? `translate(360 250) rotate(${tilt}) scale(1.1)` : 'translate(535 173) rotate(-19) scale(.45)'}>
    <path d={`M${-panelWidth - 56} -45h${panelWidth}v89h-${panelWidth}z M56 -45h${panelWidth}v89H56z`} fill={visualState ? visualState.illuminated ? "#315c79" : "#101a28" : "#1d4054"} stroke={visualState?.focusSubsystem === "panel" ? "#f0bf82" : "#9aadb2"} strokeWidth="3" />
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
    <rect x="-22" y="-54" width="44" height="20" rx="2" fill={visualState?.mode?.includes("processing") ? "#efb77b" : config.processing === 'index' ? '#aac875' : '#6d7e85'} />
    <rect x="39" y="-14" width="9" height={config.buffer === 'large' ? 40 : 21} rx="1" fill={visualState?.focusSubsystem === "buffer" ? "#edbd88" : "#6e8586"} stroke="#aebcb7" strokeWidth="1" />
    <circle cx="25" cy="-45" r="3" fill={visualState?.transmitting ? '#a9e8ff' : '#d5f894'} />
    {visualState?.available ? <g>
      <rect x="-22" y="44" width="44" height="6" fill="#182b35" /><rect x="-22" y="44" width={44 * (visualState.energyFraction ?? 0)} height="6" fill="#a8d5a0" />
      <rect x="39" y="-14" width="9" height={(config.buffer === 'large' ? 40 : 21) * (visualState.queueFraction ?? 0)} fill="#efbd86" />
    </g> : null}
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

const SEGMENT_NAMES: Record<MissionSegment, string> = { user: 'USUÁRIO CIENTÍFICO', launch: 'INTEGRAÇÃO / LANÇAMENTO', space: 'SEGMENTO ESPACIAL', ground: 'SEGMENTO DE SOLO' };
const SUBSYSTEM_NAMES = { panel: 'Painéis solares', battery: 'Bateria', processing: 'Processamento', buffer: 'Memória', radio: 'Rádio' };
function formatValue(value: number | null, unit: string) { return value === null ? 'Sem estado registrado' : `${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ${unit}`; }


function RecordedState({ state, scienceRecordCount }: { state: MissionVisualState; scienceRecordCount: number }) {
  return <div className="orbit-recorded-state" aria-label="Estado registrado da missão">
    <div className="orbit-state-heading"><strong>Instante {formatValue(state.timeS, 's')}</strong><span>{state.available ? `Último estado: ${formatValue(state.sourceStateTimeS, 's')}` : 'Nenhum estado do motor disponível'}</span></div>
    {state.available ? <><div className="orbit-resource-grid">
      <div><span>Bateria</span><strong>{formatValue(state.energyWh, 'Wh')}</strong><meter min="0" max="1" value={state.energyFraction ?? 0} aria-label="Fração de energia na bateria"/></div>
      <div><span>Memória ocupada</span><strong>{formatValue(state.queueBits === null ? null : state.queueBits / 1000000, 'Mbit')}</strong><meter min="0" max="1" value={state.queueFraction ?? 0} aria-label="Fração de ocupação da memória"/></div>
      <div><span>Geração / consumo</span><strong>{formatValue(state.solarW, 'W')} / {formatValue(state.loadW, 'W')}</strong><small>{state.illuminated ? 'Trecho iluminado' : 'Eclipse na agenda'}</small></div>
      <div><span>Recepção em solo</span><strong>{state.deliveredRecordIds.length} / {scienceRecordCount} registros válidos</strong><small>{state.transmitting ? 'Transmissão registrada' : state.contactAvailable ? 'Contato disponível · sem transmissão' : 'Sem contato neste instante'}</small></div>
    </div><p className="orbit-state-note">{state.focusSubsystem ? `Destaque: ${SUBSYSTEM_NAMES[state.focusSubsystem]}. ` : ''}O estado é mantido até o próximo ponto registrado; não há interpolação de recursos. A posição orbital é ilustrativa.</p></> : <p className="orbit-state-note">Sem valores inventados: execute uma configuração válida para inspecionar seus estados. A geometria continua apenas conceitual.</p>}
  </div>;
}

export function Scene({ preview = false, compact = false, progress = 0, config = DEFAULT_CONFIG, variant = 'orbit', visualState, segment, world = 'earth', scienceRecordCount = 6, expeditionConfig, scenarioId, inspectSubsystem }: SceneProps) {
  const metrics = usePlayerMetrics();
  function inspectManually(next: SpacecraftInspection) {
    if (next === 'energy' || next === 'communications' || next === 'instrument') metrics.track('inspection', world === 'earth' ? 'cerrado' : world, { target: next });
    setInspection(next); setTurn(0);
  }
  const host = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<'3d' | '2d'>('3d');
  const [checked, setChecked] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [paused, setPaused] = useState(variant === 'hangar');
  const [focus, setFocus] = useState<SceneFocus>('satellite');
  const [turn, setTurn] = useState(0);
  const [inspection, setInspection] = useState<SpacecraftInspection>('overview');
  const [exploded, setExploded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const presentation = getSpacecraftPresentation(world === 'earth' ? { world, config, scenarioId } : { world, expeditionConfig: expeditionConfig ?? DEFAULT_EXPEDITION_CONFIGS[world] });
  const previousPresentation = useRef(presentation);

  useEffect(() => {
    const before = previousPresentation.current;
    setTurn(0);
    if (before.payload.id !== presentation.payload.id || before.storage.bufferBits !== presentation.storage.bufferBits) setInspection('instrument');
    else if (before.energy.panelW !== presentation.energy.panelW || before.energy.batteryWh !== presentation.energy.batteryWh) setInspection('energy');
    else if (JSON.stringify(before.communications) !== JSON.stringify(presentation.communications)) setInspection('communications');
    previousPresentation.current = presentation;
  }, [presentation.configurationKey]);
  useEffect(() => {
    const system = visualState?.focusSubsystem;
    const eventInspection = system === 'radio' ? 'communications' : system === 'panel' || system === 'battery' ? 'energy' : system === 'processing' || system === 'buffer' ? 'instrument' : undefined;
    const next = inspectSubsystem ?? eventInspection;
    if (next) { setInspection(next); setTurn(0); }
  }, [inspectSubsystem, visualState?.timeS, visualState?.focusSubsystem, presentation.configurationKey]);
  useEffect(() => {
    if (!expanded) return;
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setExpanded(false); };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [expanded]);
  const { active, reducedMotion } = useSceneActivity(host);
  const descriptionId = useId();
  const useFallback = useCallback(() => { setUnavailable(true); setMode('2d'); }, []);
  useEffect(() => { if (!canRenderWebGL()) useFallback(); setChecked(true); }, [useFallback]);
  const views = world !== 'earth' ? [{ id: 'science' as const, number: '01', name: 'Ciência', text: '' }, { id: 'satellite' as const, number: '02', name: 'Nave didática', text: '' }, { id: 'ground' as const, number: '03', name: 'Solo', text: '' }] : variant === 'hangar' ? HANGAR_VIEWS : ORBIT_VIEWS;
  const selected = views.find(item => item.id === focus) ?? views[0]!;
  const selectedText = world === 'earth' ? selected.text : `${world === 'bennu' ? 'Bennu' : 'JWST'}: modelo NASA de referência em um exercício baseado em documentação científica. Os parâmetros didáticos não são telemetria NASA; a geometria não calcula a missão.`;
  const recorded = visualState !== undefined;
  const configured = !preview && (variant === 'hangar' || recorded || !!segment || world !== 'earth');
  const animating = !recorded && !segment && !paused && !reducedMotion && active && mode === '3d';
  const fallback = configured ? <FlatConfiguredCraft presentation={presentation} inspection={inspection} exploded={exploded} state={visualState}/> : preview && world !== 'earth' ? <div className="orbit-flat" aria-hidden="true"><svg viewBox="0 0 720 500"><g transform="translate(360 225)">{world === 'bennu' ? <><path d="M-145-60L-70-140L55-150L145-55L155 75L45 140L-90 115L-155 25Z" fill="#716b61" stroke="#c9b89b" strokeWidth="2"/><path d="M-70-140L0-10L145-55M-145-60L0-10L45 140M-90 115L0-10L155 75" fill="none" stroke="#a99b84"/></> : <><path d="M-150 70L-20-80L115-40L150 70L0 145Z" fill="#657b90" stroke="#c0d0dd"/>{[-1,0,1].map(x=><path key={x} d="M-42-24L0-48L42-24V24L0 48L-42 24Z" transform={`translate(${x*74} ${x===0?-53:0})`} fill="#c4a469" stroke="#f1d9a6" strokeWidth="3"/>)}</>}</g><text x="360" y="430" textAnchor="middle" fill="#becdd3" fontSize="15">{world === 'bennu' ? 'Bennu' : 'Webb'} · esquema 2D de referência</text></svg></div> : <FlatScene variant={variant} config={config} focus={focus} />;
  const configDescription = world !== 'earth' ? `${presentation.payload.label}; ${presentation.energy.label}; ${presentation.communications.label}` : CONFIG_KEYS.map(key => CATALOG[key].find(choice => choice.id === config[key])?.label).filter(Boolean).join('; ');
  const motionPaused = recorded || !!segment || paused || reducedMotion || mode === '2d';
  const focusLabel = inspection === 'instrument' ? presentation.payload.label : inspection === 'energy' ? presentation.energy.label : inspection === 'communications' ? presentation.communications.label : 'Uma nave, decisões conectadas';
  const firstContact = presentation.communications.contacts[0];
  const plannedContactMinutes = presentation.communications.contacts.reduce((minutes, [start, end]) => minutes + (end - start) / 60, 0);
  const focusDetail = inspection === 'instrument' ? `${presentation.payload.totalLoadW.toLocaleString('pt-BR')} W durante o trabalho · ${(presentation.payload.bitsPerRecord / 1e6).toLocaleString('pt-BR')} Mbit por registro didático.` : inspection === 'energy' ? `${presentation.energy.panelW.toLocaleString('pt-BR')} W de geração nominal · ${presentation.energy.batteryWh.toLocaleString('pt-BR')} Wh armazenáveis. Potência e energia são limites diferentes.` : inspection === 'communications' ? `${(presentation.communications.rateBps / 1e6).toLocaleString('pt-BR')} Mbit/s durante uma janela autorizada. Produzir dados não garante que eles cheguem.` : 'Toque em uma peça ou escolha um sistema abaixo. O destaque mostra onde a decisão atua.';


  return <section ref={host} className={`scene scene-orbit scene-${variant} ${compact ? 'scene-compact' : ''} ${recorded ? 'scene-recorded' : ''} ${configured ? 'scene-configured' : ''} ${expanded ? 'scene-expanded' : ''}`} aria-label={world === 'earth' && variant === 'hangar' ? 'Modelo visual do CubeSat' : 'Modelo visual da missão'} aria-describedby={descriptionId} data-visual-mode={checked && mode === '3d' ? '3d' : '2d'} data-mission-world={world} data-spacecraft-config={presentation.configurationKey} data-payload-id={presentation.payload.id} data-panel-w={presentation.energy.panelW} data-battery-wh={presentation.energy.batteryWh} data-radio-hardware={presentation.communications.radioHardware} data-inspection={inspection} data-exploded={exploded} data-state-time={visualState?.timeS} data-focus-subsystem={visualState?.focusSubsystem ?? undefined}>
    <div className="orbit-grid" aria-hidden="true" /><div className="orbit-corner orbit-corner-tl" aria-hidden="true" /><div className="orbit-corner orbit-corner-br" aria-hidden="true" />
    <div className="orbit-topline"><span className="orbit-eyebrow"><i />{segment ? SEGMENT_NAMES[segment] : world === 'bennu' ? 'MISSÃO DIDÁTICA / BENNU' : world === 'telescope' ? 'OBSERVATÓRIO DIDÁTICO / REFERÊNCIA JWST' : variant === 'hangar' ? 'LAB–01 / SEU PROJETO' : 'MISSÃO IPÊ / TERRA'}</span><div className="orbit-display-tools">
      <button type="button" className="orbit-tool" onClick={() => setPaused(value => !value)} aria-label={recorded || segment ? 'Visualização estática do instante selecionado' : motionPaused ? 'Retomar animação ilustrativa' : 'Pausar animação ilustrativa'} aria-pressed={motionPaused} disabled={recorded || !!segment || mode === '2d' || reducedMotion} title={reducedMotion ? 'Movimento reduzido acompanha sua preferência do dispositivo' : undefined}><Icon name={motionPaused ? 'play' : 'pause'} size={13} /><span>{recorded ? 'Tempo registrado' : segment ? 'Vista estática' : motionPaused ? 'Pausada' : 'Pausar'}</span></button>
      {configured ? <button type="button" className="orbit-tool orbit-expand" aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? 'Reduzir cena' : 'Ampliar cena'}</button> : null}
      <button type="button" className="orbit-tool orbit-mode" onClick={() => setMode(value => value === '3d' ? '2d' : '3d')} disabled={unavailable}><Icon name="layers" size={13} /><span>{unavailable ? '2D ativo' : mode === '3d' ? 'Ver em 2D' : 'Ver em 3D'}</span></button>
    </div></div>
    <div className="orbit-render" aria-hidden="true">{checked && mode === '3d' ? <SceneBoundary fallback={fallback} onUnavailable={useFallback}><Suspense fallback={fallback}><OrbitalScene presentation={configured ? presentation : undefined} inspection={inspection} exploded={exploded} onInspect={configured ? inspectManually : undefined} focus={focus} progress={visualState?.progress ?? progress} visualState={visualState} segment={segment} world={world} scienceRecordCount={scienceRecordCount} config={config} variant={variant} animating={animating} active={active} reducedMotion={reducedMotion} turn={turn} onUnavailable={useFallback} /></Suspense></SceneBoundary> : fallback}</div>
    {world === 'earth' && variant === 'orbit' && (!segment || segment === 'user') ? <div className="orbit-map-label" aria-hidden="true"><span className="orbit-map-cross" /><span>CERRADO BRASILEIRO<small>ÁREA DE INTERESSE</small></span></div> : world === 'earth' && variant === 'hangar' ? <>
      <span className="orbit-hangar-mark" aria-hidden="true">LAB<span>01</span></span>
      <div className="orbit-part-label orbit-part-panel" aria-hidden="true"><span />PAINÉIS {config.panel === 'standard' ? '18 W' : '12 W'}</div>
      <div className="orbit-part-label orbit-part-battery" aria-hidden="true">BATERIA {config.battery === 'large' ? '24 Wh' : '16 Wh'}<span /></div>
    </> : null}
    <div className="orbit-bottom">
      {preview ? <div className="spacecraft-view-tools"><button type="button" aria-label="Girar destino à esquerda" onClick={() => setTurn(value => value - Math.PI / 6)} disabled={mode === '2d'}>↶ Girar</button><button type="button" aria-label="Girar destino à direita" onClick={() => setTurn(value => value + Math.PI / 6)} disabled={mode === '2d'}>Girar ↷</button></div> : configured ? <><div className="spacecraft-inspection-controls" role="group" aria-label="Inspecionar os sistemas da nave">{INSPECTIONS.map(item => <button key={item.id} type="button" aria-pressed={inspection === item.id} onClick={() => { inspectManually(item.id); setTurn(0); }}>{item.label}</button>)}</div><div className="spacecraft-view-tools"><button type="button" aria-pressed={exploded} onClick={() => setExploded(value => !value)}>{exploded ? 'Reunir componentes' : 'Separar componentes'}</button><button type="button" aria-label="Girar nave à esquerda" onClick={() => setTurn(value => value - Math.PI / 6)} disabled={mode === '2d'}>↶ Girar</button><button type="button" aria-label="Girar nave à direita" onClick={() => setTurn(value => value + Math.PI / 6)} disabled={mode === '2d'}>Girar ↷</button><button type="button" onClick={() => { setInspection('overview'); setExploded(false); setTurn(0); }}>Restaurar montagem</button></div></> : <div className="orbit-viewbar" role="group" aria-label="Explore a missão">{views.map(item => <button key={item.id} type="button" className={`orbit-view ${focus === item.id ? 'is-active' : ''}`} aria-pressed={focus === item.id} onClick={() => { setFocus(item.id); setTurn(0); }}><span>{item.number}</span>{item.name}</button>)}
      </div>}
      {configured ? <div className="orbit-focus-brief" aria-live="polite"><span>{inspection === 'overview' ? 'EXPLORE A MONTAGEM' : 'SISTEMA EM FOCO'}</span><strong>{focusLabel}</strong><p>{focusDetail}</p>
        {inspection === 'communications' && world !== 'earth' && firstContact ? <p>Mesma antena e taxa nas duas opções de solo; a escolha muda a agenda e o custo. Primeiro contato: T+{formatValue(firstContact[0] / 60, 'min')} a T+{formatValue(firstContact[1] / 60, 'min')}. Total planejado: {formatValue(plannedContactMinutes, 'min')}; a entrega depende de haver dados e a nave continuar operante.</p> : null}
        {inspection === 'instrument' && visualState?.available ? <p>{visualState.mode?.includes('processing') ? 'Neste instante: processando registros.' : 'Neste instante: instrumento sem processamento registrado.'} O brilho de operação acompanha esse estado, não a seleção da peça.</p> : null}
        {visualState?.focusSubsystem ? <small>Evento selecionado: {SUBSYSTEM_NAMES[visualState.focusSubsystem]}. O destaque identifica o sistema envolvido; a causa é explicada na trilha da missão.</small> : null}</div> : null}
      {configured ? <p className="orbit-visual-key">Contorno claro: peça em inspeção, não uma falha. Enlace azul: transmissão registrada. Os segmentos da bateria comparam capacidade; não contam células reais.</p> : null}
      {!configured ? !compact ? <div className="orbit-explanation" aria-live="polite"><p>{selectedText}</p></div> : <p className="orbit-compact-note" aria-live="polite">{selectedText}</p> : null}
      <p className="orbit-caption" id={descriptionId}>{unavailable ? <span>3D indisponível · equivalente 2D ativo</span> : null}<span>{recorded ? 'Recursos do motor · posição ilustrativa sem escala' : 'Ilustração sem escala · física calculada separadamente'}</span></p>
    </div>
    {configured ? compact && variant === 'hangar' ? <details className="spacecraft-inspector-disclosure"><summary>Capacidades e função deste sistema</summary><SpacecraftInspector presentation={presentation} inspection={inspection} state={visualState}/></details> : <SpacecraftInspector presentation={presentation} inspection={inspection} state={visualState}/> : null}
    {visualState ? <RecordedState state={visualState} scienceRecordCount={scienceRecordCount}/> : null}
    {world !== 'earth' && !preview ? <p className="orbit-model-credit">Referência visual NASA · {world === 'bennu' ? 'Bennu: Christopher R. Meaney' : 'JWST: Goddard Space Flight Center'}. Exercício didático baseado em missão documentada; sem escala física. <a href={world === 'bennu' ? 'https://science.nasa.gov/3d-resources/1999-rq36-asteroid/' : 'https://science.nasa.gov/3d-resources/james-webb-space-telescope-a/'} target="_blank" rel="noopener noreferrer">Fonte do modelo</a></p> : null}
    <p className="sr-only">{world !== 'earth' ? `Modelo NASA de referência ${world === 'bennu' ? 'Bennu' : 'JWST'}, em modelo didático baseado em documentação científica; parâmetros não são telemetria NASA. ` : variant === 'hangar' ? 'CubeSat didático com corpo dourado, painéis solares azuis, bateria, antena e instrumento. ' : 'Terra esférica com continentes aproximados, órbitas ilustrativas e um CubeSat didático. '}{configDescription}. A animação não indica altitude, posição, cobertura ou telemetria reais. Todos os controles da missão estão disponíveis fora desta ilustração.</p>
  </section>;
}
