import { SCENARIOS } from '../core/catalog.ts';
import type { ScenarioId } from '../core/contracts.ts';
import { Icon } from './Icon.tsx';
import { Scene } from './Scene.tsx';
import { MissionConcept } from './MissionConcept.tsx';
import { minutes } from './format.ts';

export function Observatory({ onChoose, onSources, onLab, completed }: { onChoose: (id: ScenarioId) => void; onSources: () => void; onLab: () => void; completed: ReadonlySet<ScenarioId> }) {
  return <>
    <div className="mission-kicker"><span><i /> CENTRO DE PROJETO DE MISSÕES</span><span>BRASIL · TERRA · ÓRBITA BAIXA</span></div>
    <div className="observatory-hero">
      <section className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-line" /> SUA PRIMEIRA MISSÃO COMEÇA AQUI</p>
        <h1>O espaço é grande.<br />Seus recursos,<br /><em>limitados.</em></h1>
        <p className="hero-lead">Projete uma missão. Faça a ciência chegar.</p>
        <p className="hero-description">Monte seu CubeSat, equilibre seis sistemas e entregue dados sobre o Cerrado. No caminho, descubra o que cada decisão custa — e o que ela torna possível.</p>
        <div className="hero-actions"><button className="button button-primary hero-button" type="button" onClick={() => onChoose('long-contact')}>Começar a missão <Icon name="arrow" /></button><button className="button button-secondary" type="button" onClick={onLab}><Icon name="spark" size={17} /> Explorar a física</button></div>
        <div className="hero-footnote"><span><Icon name="globe" size={16} /> Dados históricos NASA</span><span><Icon name="satellite" size={16} /> Engenharia na prática</span><span><Icon name="play" size={14} /> No seu ritmo</span></div>
      </section>
      <div className="hero-observatory"><Scene /><div className="orbit-caption-bar"><span><i /> IPÊ-01 <small>CUBESAT EDUCACIONAL</small></span><span>TERRA <small>VISUALIZAÇÃO CONCEITUAL</small></span></div></div>
    </div>
    <div className="mission-spec-strip" aria-label="Objetivos e limites da missão"><div><span>OBJETIVO CIENTÍFICO</span><strong>06 <small>registros válidos na Terra</small></strong></div><div><span>MASSA MÁXIMA</span><strong>3,6 <small>kg</small></strong></div><div><span>ORÇAMENTO</span><strong>86 <small>créditos</small></strong></div><div><span>HORIZONTE SIMULADO</span><strong>180 <small>minutos</small></strong></div></div>
    <MissionConcept onSources={onSources} />
    <section className="conditions-section" aria-labelledby="conditions-title">
      <div className="section-heading"><div><p className="eyebrow">ESCOLHA O SEU DESAFIO</p><h2 id="conditions-title">A mesma ciência. Novas decisões.</h2></div><span className="section-note">Comece pelo cenário 01. Leve o que aprendeu para o 02.</span></div>
      <div className="condition-grid">{SCENARIOS.map((scenario, index) => <article className={`condition-card condition-${index}`} key={scenario.id}>
        <div className="condition-number">0{index + 1}<span>{index === 0 ? 'EXPLORAR' : 'SUPERAR'}</span></div>
        <div className="condition-content"><div className="condition-kicker">{index === 0 ? 'PRIMEIRA MISSÃO' : 'DESAFIO DE ENGENHARIA'}{completed.has(scenario.id) ? <span><Icon name="check" size={13} /> Tentativa registrada</span> : null}</div><h3>{index === 0 ? 'Uma janela para aprender.' : 'O tempo ficou menor.'}</h3><p>{index === 0 ? 'Configure seus sistemas e acompanhe os dados até a estação. Cada recurso tem um papel.' : 'Você tem menos tempo de transmissão. Redesenhe a missão sem ultrapassar os limites.'}</p><div className="condition-facts"><span><Icon name="signal" size={15} /> 2 contatos de {minutes((scenario.contacts[0]?.[1] ?? 0) - (scenario.contacts[0]?.[0] ?? 0))}</span><span><Icon name="route" size={15} /> Mesmo objetivo: 6 registros</span></div></div>
        <button type="button" className="circle-button" onClick={() => onChoose(scenario.id)} aria-label={`Projetar missão: ${scenario.title}`}><Icon name="arrow" /></button>
      </article>)}</div>
    </section>
    <section className="learning-path" aria-labelledby="path-title"><div><p className="eyebrow">COMO JOGAR</p><h2 id="path-title">Uma escolha.<br />Uma consequência.</h2></div><ol><li><b>01</b><div><h3>Projete</h3><p>Escolha os módulos e acompanhe massa e orçamento.</p></div></li><li><b>02</b><div><h3>Faça uma previsão</h3><p>Qual sistema pode limitar a entrega de ciência?</p></div></li><li><b>03</b><div><h3>Execute e investigue</h3><p>Explore energia, memória e contatos na linha do tempo.</p></div></li><li><b>04</b><div><h3>Redesenhe</h3><p>Compare alternativas e teste sua próxima hipótese.</p></div></li></ol></section>
    <section className="science-strip"><div className="science-emblem" aria-hidden="true"><span /><span /><span /></div><div><p className="eyebrow">DO CERRADO PARA A ÓRBITA. DA ÓRBITA PARA A CIÊNCIA.</p><h3>Uma pergunta real sobre a vegetação.</h3><p>Os seis registros vêm do arquivo Terra/MODIS. O CubeSat é um modelo didático de processamento e entrega: as datas históricas dos dados são independentes dos 180 minutos da simulação.</p></div><button className="text-button" type="button" onClick={onSources}>Explorar dados e fontes <Icon name="arrow" size={17} /></button></section>
  </>;
}
