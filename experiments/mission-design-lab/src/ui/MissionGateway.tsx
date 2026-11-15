import { useState } from 'react';
import { MISSION_CURRICULUM } from '../lab/mission-curriculum.ts';
import type { LearningMission } from '../lab/mission-curriculum.ts';
import type { ScenarioId } from '../core/contracts.ts';
import type { ExpeditionId } from '../lab/scientific-expeditions.ts';
import { Scene } from './Scene.tsx';
import { Icon } from './Icon.tsx';
import './mission-gateway.css';

const missions: LearningMission[] = ['cerrado', 'bennu', 'telescope'];
export function MissionGateway({ onChoose, onExpedition, onLab }: { onChoose: (id: ScenarioId) => void; onExpedition: (id: ExpeditionId) => void; onLab: () => void }) {
  const [selected, setSelected] = useState<LearningMission>('cerrado');
  const [segment, setSegment] = useState<'user' | 'launch' | 'space' | 'ground'>('user');
  const mission = MISSION_CURRICULUM[selected];
  const enter = (id: LearningMission) => id === 'cerrado' ? onChoose('long-contact') : onExpedition(id);
  const segments = {
    user: { name: 'Quem precisa', title: 'A ciência começa com uma pergunta.', text: mission.beneficiary },
    launch: { name: 'Como levar', title: 'A nave precisa caber no acesso escolhido.', text: selected === 'cerrado' ? 'Neste caso, lançamento e órbita são fixos. Sua equipe trabalha dentro do limite de 3,6 kg e 86 créditos.' : 'Escolha um lançador compatível com a massa e o perfil da missão. As capacidades são envelopes didáticos, sem simular o voo do foguete.' },
    space: { name: 'O que vai operar', title: 'Um instrumento precisa de uma nave inteira.', text: selected === 'cerrado' ? 'Processar bandas ou calcular NDVI muda o volume e o pico de potência. Painéis, bateria, memória e rádio precisam sustentar essa escolha.' : selected === 'bennu' ? 'A câmera atende ao levantamento de superfície. Energia, memória e vida operacional precisam permitir as observações.' : 'O espectrômetro separa a luz em faixas. A energia deve suportar a carga e a memória precisa guardar os dados até o contato.' },
    ground: { name: 'Como volta', title: 'A descoberta só chega com os dados.', text: 'O segmento terrestre oferece as janelas de recepção. A equipe científica interpreta apenas os registros completos e válidos: uma lacuna não é zero.' },
  };
  return <section className={`mission-gateway gateway-${selected}`} aria-labelledby="gateway-title">
    <div className="gateway-top"><span>MISSÃO IPÊ / CIÊNCIA QUE CHEGA</span><span>03 MISSÕES · SOLO OU ATÉ 4 PESSOAS NO MESMO DISPOSITIVO</span></div>
    <div className="gateway-layout">
      <div className="gateway-copy" key={selected}><p className="eyebrow">{mission.discipline}</p><h1 id="gateway-title">{mission.title}</h1><p className="gateway-question">{mission.question}</p><p className="gateway-purpose">{mission.purpose}</p><div className="gateway-actions"><button className="button button-primary" type="button" onClick={() => enter(selected)}>Começar a missão <Icon name="arrow"/></button><button className="text-button" type="button" onClick={onLab}>Explorar a física</button></div><p className="gateway-learning-label">O QUE VOCÊ VAI PRATICAR</p><ul className="gateway-learning">{mission.learn.map(item => <li key={item}>{item}</li>)}</ul></div>
      <div className="gateway-window" key={`scene-${selected}`}><span className="gateway-destination" aria-hidden="true">{mission.destination}</span><Scene preview compact world={selected === 'cerrado' ? 'earth' : selected}/><p className="gateway-source">{mission.evidence}</p><p className="gateway-boundary">{mission.boundary}</p></div>
    </div>
    <div className="gateway-missions" aria-label="Escolher uma pergunta científica">{missions.map((id, i) => <article key={id} className={selected === id ? 'is-selected' : ''}><button className="gateway-select" type="button" aria-pressed={selected === id} onClick={() => { setSelected(id); setSegment('user'); }}><span>0{i + 1}</span><strong>{MISSION_CURRICULUM[id].name}</strong><small>{id === 'cerrado' ? 'Interpretar mudança' : id === 'bennu' ? 'Planejar observação' : 'Ler a luz'}</small></button><button className="gateway-enter" type="button" onClick={() => enter(id)}>{MISSION_CURRICULUM[id].cta} <span aria-hidden="true">↗</span></button></article>)}</div>
    <div className="gateway-system"><div><p className="eyebrow">UMA MISSÃO CONECTA QUATRO SEGMENTOS</p><div role="group" aria-label="Explorar os quatro segmentos">{(Object.keys(segments) as (keyof typeof segments)[]).map((id,i) => <button key={id} type="button" aria-pressed={segment === id} onClick={() => setSegment(id)}><span>0{i + 1}</span>{segments[id].name}</button>)}</div></div><div className="gateway-segment-copy" aria-live="polite"><h2>{segments[segment].title}</h2><p>{segments[segment].text}</p></div></div>
    <p className="gateway-guide"><a href="../docs/37-PROPOSTA-PEDAGOGICA-E-TECNOLOGIAS-R16.html">Conheça o propósito das três missões ↗</a> · <a href="../docs/32-GUIA-DIDATICO-MISSOES-3D.html">Guia para aprender e ensinar ↗</a></p>
  </section>;
}
