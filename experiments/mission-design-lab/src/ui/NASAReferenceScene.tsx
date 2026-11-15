import { Component, lazy, Suspense, useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { canRenderWebGL } from './Scene.tsx';
import './scene-orbit.css';

const NASAAssetCanvas = lazy(() => import('./OrbitalScene.tsx').then(module => ({ default: module.NASAAssetCanvas })));
const ASSET_BASE = import.meta.env?.BASE_URL ?? './';
export type NASAReferenceId = 'dsn' | 'bennu' | 'cubesat' | 'jwst';
const REFERENCES: Record<NASAReferenceId, { name: string; file: string; credit: string; purpose: string; limit: string; source: string }> = {
  dsn: { name: 'Antena DSN de 70 m', file: 'dsn-70m.glb', credit: 'NASA / Ames Research Center', purpose: 'Inspecionar a estrutura de uma antena para comunicação com missões de espaço profundo.', limit: 'Referência de engenharia: não representa a estação da campanha Cerrado, nem uma reserva ou disponibilidade real da DSN.', source: 'https://science.nasa.gov/3d-resources/70-meter-dish/' },
  bennu: { name: 'Asteroide Bennu', file: 'bennu-1999-rq36.glb', credit: 'NASA / Christopher R. Meaney', purpose: 'Reconhecer a forma de Bennu ao estudar o reconhecimento de superfície documentado pela missão OSIRIS-REx.', limit: 'O modelo fornece geometria de referência. Não fornece gravidade, trajetória, resultado científico ou navegação de proximidade.', source: 'https://science.nasa.gov/3d-resources/1999-rq36-asteroid/' },
  cubesat: { name: 'CubeSat genérico 2RU', file: 'cubesat-generic-2ru.glb', credit: 'NASA / Christopher R. Meaney', purpose: 'Comparar estrutura e organização de um pequeno satélite com a representação própria do Ipê.', limit: 'Este ativo NASA é uma referência distinta do CubeSat didático do jogo. Suas dimensões visuais não definem os parâmetros do motor.', source: 'https://science.nasa.gov/3d-resources/cubesat-2-ru-generic/' },
  jwst: { name: 'Telescópio James Webb', file: 'jwst-a.glb', credit: 'NASA / Goddard Space Flight Center', purpose: 'Observar o espelho, o escudo solar e a organização de um observatório espacial.', limit: 'Referência visual para um exercício baseado na ciência documentada do Webb. Os parâmetros didáticos não são telemetria NASA; o jogo não reproduz as operações ou os resultados reais do observatório.', source: 'https://science.nasa.gov/3d-resources/james-webb-space-telescope-a/' },
};
class ReferenceBoundary extends Component<{ children: ReactNode; fallback: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable(); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
function ReferenceDiagram({ asset }: { asset: NASAReferenceId }) {
  return <svg className="nasa-reference-diagram" viewBox="0 0 680 400" role="img" aria-label={`Esquema 2D próprio: ${REFERENCES[asset].name}. Geometria simplificada, sem escala.`}>
    <g transform="translate(340 195)" stroke="#9fbac9" strokeWidth="2" fill="none">
      <ellipse cy="115" rx="205" ry="35" stroke="#2d485b"/>
      {asset === 'bennu' ? <><path d="M-125-65L-25-138L105-78L144 42L25 119L-107 78L-145-10Z" fill="#6f6c64"/><path d="M-125-65L-22-20L-25-138M-22-20L105-78L72 47L144 42M72 47L25 119L-22-20L-107 78M-145-10L-22-20L72 47" stroke="#948e81"/></> : asset === 'dsn' ? <><path d="M-110-98Q-118 70 72 72Z" fill="#8a9da6"/><path d="M-31 28L30-68M-31 70V134M-94 134H29" strokeWidth="10"/><circle cx="35" cy="-72" r="8" fill="#dbad75"/></> : asset === 'cubesat' ? <><path d="M-55-85H40V105H-55ZM40-85L76-110V80L40 105M-55-85L-19-110H76" fill="#ae8950"/><path d="M-55-20H40M-55 42H40M-22-85V105M-12-85V-130M-12-125L-49-140M-12-125L25-140"/><circle cy="32" cx="-7" r="21" fill="#16394f"/></> : <><path d="M-180 40L-20-80L130-33L185 70L15 136Z" fill="#6f8795"/><path d="M-58-55L-29-108H31L62-55L31-3H-29Z" fill="#c8a56a" stroke="#f2d3a0"/><path d="M2-108V-3M-44-82L47-29M47-82L-44-29" stroke="#aa8d55"/></>}
    </g><text x="340" y="370" textAnchor="middle" fill="#afc2cf" fontSize="15">Esquema 2D próprio · modelo NASA não representado em escala</text>
  </svg>;
}
export function NASAReferenceScene({ asset: initialAsset = 'dsn' }: { asset?: NASAReferenceId }) {
  const [asset, setAsset] = useState<NASAReferenceId>(initialAsset);
  const [mode, setMode] = useState<'3d' | '2d'>('2d');
  const [supported, setSupported] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [turn, setTurn] = useState(.3);
  const [tilt, setTilt] = useState(.1);
  useEffect(() => { const available = canRenderWebGL(); setSupported(available); if (available) setMode('3d'); }, []);
  const unavailable = useCallback(() => { setFailed(true); setMode('2d'); setLoaded(false); }, []);
  const ready = useCallback(() => setLoaded(true), []);
  const reference = REFERENCES[asset];
  const fallback = <ReferenceDiagram asset={asset}/>;
  const choose = (id: NASAReferenceId) => { if (id === asset && !failed) return; setAsset(id); setTurn(.3); setTilt(.1); setLoaded(false); setFailed(false); if (supported) setMode('3d'); };
  return <section className="nasa-reference" aria-label="Modelos NASA de referência">
    <div className="nasa-reference-heading"><div><p className="nasa-reference-eyebrow">Acervo oficial / inspeção visual</p><h3>Engenharia para observar de perto.</h3></div><p>Arquivos locais do NASA 3D Resources, com origem e créditos. Estes modelos não calculam a missão.</p></div>
    <div className="nasa-reference-tabs" role="group" aria-label="Escolher modelo NASA">{(Object.keys(REFERENCES) as NASAReferenceId[]).map(id => <button type="button" key={id} aria-pressed={asset === id} onClick={() => choose(id)}>{REFERENCES[id].name}</button>)}</div>
    <div className="nasa-reference-stage" data-model-id={asset} data-model-loaded={loaded} data-visual-mode={mode}>
      {mode === '3d' ? <ReferenceBoundary key={asset} fallback={fallback} onUnavailable={unavailable}><Suspense fallback={fallback}><NASAAssetCanvas url={`${ASSET_BASE}models/nasa/${reference.file}`} turn={turn} tilt={tilt} onLoaded={ready} onUnavailable={unavailable}/></Suspense></ReferenceBoundary> : fallback}
      <p className="nasa-model-status" role="status">{failed ? 'Modelo 3D indisponível · esquema 2D ativo' : mode === '2d' ? 'Esquema 2D · descrição equivalente disponível' : loaded ? 'Modelo NASA carregado · vista estática' : 'Carregando modelo NASA local…'}</p>
    </div>
    <div className="nasa-reference-controls" role="group" aria-label="Controlar a vista do modelo">
      <button type="button" disabled={mode !== '3d'} onClick={() => setTurn(v => v - Math.PI / 6)}>Girar à esquerda</button>
      <button type="button" disabled={mode !== '3d'} onClick={() => setTurn(v => v + Math.PI / 6)}>Girar à direita</button>
      <button type="button" disabled={mode !== '3d'} onClick={() => setTilt(v => Math.max(-Math.PI / 3, v - Math.PI / 12))}>Ver de cima</button>
      <button type="button" disabled={mode !== '3d'} onClick={() => { setTurn(.3); setTilt(.1); }}>Restaurar vista</button>
      <button type="button" disabled={!supported || failed} onClick={() => { setLoaded(false); setMode(v => v === '3d' ? '2d' : '3d'); }}>{mode === '3d' ? 'Usar esquema 2D' : 'Carregar modelo 3D'}</button>
    </div>
    <div className="nasa-reference-description"><div><h4>{reference.name}</h4><p>{reference.purpose}</p><p>{reference.limit}</p></div><p className="nasa-reference-credit"><strong>Crédito</strong>{reference.credit}<br/><a href={reference.source} target="_blank" rel="noopener noreferrer">Fonte NASA ↗</a><br/><a href={`${ASSET_BASE}models/nasa/manifest.json`}>Procedência dos arquivos</a></p></div>
  </section>;
}
