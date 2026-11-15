import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { BRUNO_MISSIONS } from '../lab/bruno-missions.ts';
import type { BrunoMissionId } from '../lab/bruno-missions.ts';
import type { MetricMission } from '../metrics/player-metrics.ts';
import { Scene } from './Scene.tsx';
import { Icon } from './Icon.tsx';
import './game-shell.css';

const DESTINATIONS: Record<BrunoMissionId, string> = { iss: 'ISS', moon: 'LUA', mars: 'MARTE', europa: 'EUROPA' };
const MISSIONS: { id: MetricMission; title: string; destination: string; question: string; lesson: string; type: string }[] = [
  ...Object.values(BRUNO_MISSIONS).map(mission => ({
    id: mission.id, title: mission.name, destination: DESTINATIONS[mission.id], question: mission.question, lesson: mission.learn,
    type: mission.id === 'europa' ? 'Engenharia · Europa Clipper' : 'Engenharia · contribuição do Bruno',
  })),
  { id: 'cerrado', title: 'O que mudou aqui?', destination: 'CERRADO', question: 'O que os registros de vegetação permitem concluir?', lesson: 'Potência × energia, NDVI e entrega dos dados.', type: 'Arquivo científico · Terra/MODIS' },
  { id: 'bennu', title: 'Ler uma superfície', destination: 'BENNU', question: 'Observar basta para fazer ciência chegar?', lesson: 'Instrumento, memória e janelas de comunicação.', type: 'Arquivo científico · OSIRIS-REx' },
  { id: 'telescope', title: 'A luz guarda pistas', destination: 'WEBB', question: 'Uma imagem responde à mesma pergunta que um espectro?', lesson: 'Compatibilidade científica e limites da evidência.', type: 'Arquivo científico · Webb/NIRSpec' },
];

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

export function GameLobby({ onChoose, onKnowledge, onShop, attempts, bestScore }: { onChoose: (id: MetricMission) => void; onKnowledge: () => void; onShop?: () => void; attempts: number; bestScore: number }) {
  const [selected, setSelected] = useState<MetricMission>('iss');
  const mission = MISSIONS.find(item => item.id === selected)!;
  return <section className={`game-lobby lobby-${selected}`} aria-labelledby="lobby-title">
    {selected !== 'europa' ? <div className="game-lobby-stage" aria-hidden="true" inert><Scene preview compact world={selected === 'bennu' ? 'bennu' : selected === 'telescope' ? 'telescope' : 'earth'}/></div> : null}
    <div className="game-lobby-intro"><p className="eyebrow">CENTRO DE COMANDO / SELEÇÃO DE MISSÃO</p><h1 id="lobby-title">Escolha seu próximo destino.</h1><div className="game-career"><span><b>{attempts.toString().padStart(2,'0')}</b> tentativas</span><span><b>{bestScore}</b> melhor pontuação / 100</span></div>{onShop ? <button className="button button-secondary" type="button" onClick={onShop}>Loja e inventário</button> : null}</div>
    <div className="game-mission-picker" role="group" aria-label="Selecionar missão">{MISSIONS.map((item, index) => <button type="button" key={item.id} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><strong>{item.destination}</strong><small>{item.title}</small></button>)}</div>
    <section className="game-mission-brief" aria-live="polite" aria-atomic="true"><p className="eyebrow">{mission.type}</p><h2>{mission.title}</h2><p>{mission.question}</p><dl><div><dt>SEU APRENDIZADO</dt><dd>{mission.lesson}</dd></div><div><dt>SEU DESAFIO</dt><dd>Projetar → executar → explicar → redesenhar.</dd></div></dl><button type="button" className="button button-primary" onClick={() => onChoose(mission.id)}>Jogar {mission.destination}<Icon name="arrow"/></button><button type="button" className="text-button" onClick={onKnowledge}>Abrir acervo e guia de ciência</button><p className="game-mission-note">ISS, Lua, Marte e Europa são exercícios de engenharia baseados em missões documentadas. Cerrado, Bennu e Webb incluem registros científicos históricos. A nave é didática.</p></section>
  </section>;
}
