import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { BRUNO_MISSIONS } from '../lab/bruno-missions.ts';
import type { BrunoMissionId } from '../lab/bruno-missions.ts';
import type { MetricMission } from '../metrics/player-metrics.ts';
import { Scene } from './Scene.tsx';
import { Icon } from './Icon.tsx';
import './game-shell.css';

const DESTINATIONS: Record<BrunoMissionId, string> = { iss: 'ISS', moon: 'LUA', mars: 'MARTE', europa: 'EUROPA' };
type LobbyMission = { id: MetricMission; title: string; destination: string; question: string; lesson: string; type: string };
const MISSIONS: LobbyMission[] = [
  ...Object.values(BRUNO_MISSIONS).map(mission => ({
    id: mission.id, title: mission.name, destination: DESTINATIONS[mission.id], question: mission.question, lesson: mission.learn,
    type: mission.id === 'europa' ? 'Engenharia · Europa Clipper' : 'Engenharia · contribuição do Bruno',
  })),
  { id: 'cerrado', title: 'O que mudou aqui?', destination: 'CERRADO', question: 'O que os registros de vegetação permitem concluir?', lesson: 'Potência × energia, NDVI e entrega dos dados.', type: 'Arquivo científico · Terra/MODIS' },
  { id: 'bennu', title: 'Ler uma superfície', destination: 'BENNU', question: 'Observar basta para fazer ciência chegar?', lesson: 'Instrumento, memória e janelas de comunicação.', type: 'Arquivo científico · OSIRIS-REx' },
  { id: 'telescope', title: 'A luz guarda pistas', destination: 'WEBB', question: 'Uma imagem responde à mesma pergunta que um espectro?', lesson: 'Compatibilidade científica e limites da evidência.', type: 'Arquivo científico · Webb/NIRSpec' },
];
const LobbyScene = lazy(() => import('./LobbyScene.tsx'));
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const THUMBNAILS: Partial<Record<MetricMission, string>> = { iss: 'earth', moon: 'moon', mars: 'mars', europa: 'europa', cerrado: 'earth' };
const textures = `${import.meta.env?.BASE_URL ?? './'}textures/lobby/`;

export function GameTitleScreen({ children }: { children: ReactNode }) {
  const [started, setStarted] = useState(false);
  const [help, setHelp] = useState(false);
  const start = useRef<HTMLButtonElement>(null);
  useEffect(() => { start.current?.focus({ preventScroll: true }); }, []);
  if (started) return children;
  return <main className="game-title-screen" data-ipe-libras-context={`MISSÃO IPÊ. Jogo de design de missões espaciais. ${MISSIONS.length} missões para projetar, executar e aprender. Pressione Iniciar jogo. Depois informe nome e e-mail, escolha uma missão e dê Play. As escolhas têm consequências nos recursos e na nave. Você pode usar os controles por teclado ou toque.`}>
    <div className="game-title-orbit" aria-hidden="true" inert><Scene preview compact world="earth" /></div>
    <div className="game-title-shade" aria-hidden="true" />
    <header className="game-title-brand"><img src="./brand/missao-ipe-logo.svg" width="1064" height="499" alt="MISSÃO IPÊ" /><span>SIMULADOR DE ENGENHARIA ESPACIAL</span></header>
    <section className="game-title-copy" aria-labelledby="start-title"><p className="eyebrow">SEU PRÓXIMO DESTINO COMEÇA COM UMA ESCOLHA.</p><h1 id="start-title">Projete.<br/>Lance.<br/><em>Descubra.</em></h1><p>{MISSIONS.length} missões. Uma tripulação. A ciência precisa chegar.</p><div className="game-title-actions"><button ref={start} className="button button-primary" type="button" onClick={() => { if (document.documentElement.requestFullscreen) void document.documentElement.requestFullscreen().catch(() => {}); setStarted(true); }}><Icon name="play"/>Iniciar jogo</button><button className="button button-secondary" type="button" aria-expanded={help} onClick={() => setHelp(!help)}>Como jogar</button></div>{help ? <ol className="game-title-help"><li>Escolha uma missão e conheça a pergunta.</li><li>Monte a nave e equipe os instrumentos.</li><li>Execute, investigue o resultado e tente de novo.</li><li>Acompanhe pontos e tentativas no seu painel.</li></ol> : null}</section>
    <footer className="game-title-status"><span>01 JOGADOR / ATÉ 04 NO MESMO DISPOSITIVO</span><span>TOQUE · TECLADO · MOUSE</span><span>MISSÃO IPÊ · BETA</span></footer>
  </main>;
}

function LobbyNeighbor({ mission, previous, onSelect }: { mission: LobbyMission; previous?: boolean; onSelect: () => void }) {
  const thumbnail = THUMBNAILS[mission.id];
  return <button type="button" className="game-lobby-neighbor" data-side={previous ? 'previous' : 'next'}
    aria-label={`${previous ? 'Destino anterior' : 'Próximo destino'} · ${mission.destination}`} onClick={onSelect}>
    <span className="game-neighbor-art" data-mission={mission.id} aria-hidden="true">
      {thumbnail ? <img key={thumbnail} src={`${textures}${thumbnail}.webp`} alt="" width={256} height={128} loading="lazy" decoding="async" onError={event => { event.currentTarget.hidden = true; }} /> : null}
    </span>
    <span className="game-neighbor-label">
      <small>{previous ? 'Anterior' : 'Próximo'}</small>
      <strong>{mission.destination}</strong>
    </span>
    <Icon name={previous ? 'back' : 'arrow'} size={16} />
  </button>;
}

export function GameLobby({ onChoose, onKnowledge, onShop, attempts, bestScore }: { onChoose: (id: MetricMission) => void; onKnowledge: () => void; onShop?: () => void; attempts: number; bestScore: number }) {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== 'undefined' && Boolean(window.matchMedia?.(REDUCED_MOTION).matches));
  const picker = useRef<Array<HTMLButtonElement | null>>([]);
  const motionPaused = paused || reducedMotion;
  const mission = MISSIONS[selected]!;
  const previous = (selected + MISSIONS.length - 1) % MISSIONS.length;
  const next = (selected + 1) % MISSIONS.length;

  useEffect(() => {
    const preference = window.matchMedia?.(REDUCED_MOTION);
    if (!preference) return;
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener?.('change', update);
    return () => preference.removeEventListener?.('change', update);
  }, []);

  function movePicker(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const target = (index + (event.key === 'ArrowLeft' ? -1 : 1) + MISSIONS.length) % MISSIONS.length;
    setSelected(target);
    picker.current[target]?.focus();
  }

  return <section className="game-lobby" data-destination={mission.id} data-motion-paused={motionPaused} aria-labelledby="lobby-title"
    data-ipe-libras-context={`Escolha seu próximo destino. ${mission.destination}. ${mission.title}. ${mission.type}. ${mission.question} Você vai aprender. ${mission.lesson} Use Destino anterior, Próximo destino ou o seletor de sete missões. Jogar abre a missão selecionada.`}>
    <div className="game-lobby-stage" aria-hidden="true" inert>
      <Suspense fallback={null}><LobbyScene missionId={mission.id} paused={motionPaused} /></Suspense>
    </div>
    <div className="game-lobby-shade" aria-hidden="true" />
    <h1 className="sr-only" id="lobby-title">Escolha seu próximo destino.</h1>
    <div className="game-lobby-controls">
      <p className="game-career"><span><strong>{attempts}</strong> {attempts === 1 ? 'tentativa' : 'tentativas'}</span><span><strong>{bestScore}/100</strong> melhor pontuação</span></p>
      {!reducedMotion ? <button type="button" className="game-lobby-motion" onClick={() => setPaused(value => !value)}>
        <Icon name={paused ? 'play' : 'pause'} size={16} />{paused ? 'Retomar movimento' : 'Pausar movimento'}
      </button> : null}
    </div>
    <div className="game-lobby-hero">
      <section className="game-mission-brief" aria-labelledby="lobby-destination">
        <div className="game-mission-description" aria-live="polite" aria-atomic="true">
          <div className="game-mission-reveal" key={mission.id}>
            <p className="game-mission-name">{mission.title}</p>
            <h2 id="lobby-destination">{mission.destination}</h2>
            <p className="game-mission-question">{mission.question}</p>
            <p className="game-mission-lesson"><strong>Você vai aprender</strong> · {mission.lesson}</p>
          </div>
        </div>
        <button type="button" className="button button-primary game-mission-play" onClick={() => onChoose(mission.id)}>
          Jogar {mission.destination}<Icon name="arrow" size={18} />
        </button>
      </section>
      <LobbyNeighbor mission={MISSIONS[previous]!} previous onSelect={() => setSelected(previous)} />
      <LobbyNeighbor mission={MISSIONS[next]!} onSelect={() => setSelected(next)} />
    </div>
    <div className="game-lobby-navigation">
      <div className="game-mission-picker" role="group" aria-label="Selecionar missão">
        {MISSIONS.map((item, index) => <button type="button" key={item.id} aria-pressed={selected === index}
          ref={button => { picker.current[index] = button; }} onClick={() => setSelected(index)} onKeyDown={event => movePicker(event, index)}>{item.destination}</button>)}
      </div>
      <div className="game-lobby-links">
        {onShop ? <button className="text-button" type="button" onClick={onShop}>Loja e inventário</button> : null}
        <button className="text-button" type="button" onClick={onKnowledge}>Abrir acervo e guia de ciência</button>
      </div>
      <p className="game-lobby-credit"><span>{mission.type}</span><a href="../docs/75-LOBBY-IMERSIVO-E-HANDOFF-R29.html">Cena ilustrativa · fontes NASA</a></p>
    </div>
  </section>;
}
