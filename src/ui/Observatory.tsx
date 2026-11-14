import { SCENARIOS } from '../core/catalog.ts';
import type { ScenarioId } from '../core/contracts.ts';
import { Icon } from './Icon.tsx';
import { Scene } from './Scene.tsx';
import { minutes } from './format.ts';

export function Observatory({ onChoose, onSources, completed }: { onChoose: (id: ScenarioId) => void; onSources: () => void; completed: ReadonlySet<ScenarioId> }) {
  return <>
    <div className="observatory-hero">
      <section className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-line" /> LABORATÓRIO DE MISSÕES · 001</p>
        <h1>Ciência boa<br />é ciência que<br /><em>chega.</em></h1>
        <p className="hero-lead">Entre a pergunta e a resposta, existe uma missão inteira.</p>
        <p className="hero-description">Projete um pequeno satélite para levar seis registros de vegetação até a estação. Energia, memória e tempo de contato: cada escolha muda o que consegue chegar.</p>
        <button className="button button-primary hero-button" type="button" onClick={() => onChoose('long-contact')}>Começar a missão <Icon name="arrow" /></button>
        <div className="hero-footnote"><span><Icon name="globe" size={16} /> Arquivos científicos reais</span><span><Icon name="satellite" size={16} /> Engenharia educacional</span></div>
      </section>
      <Scene />
    </div>
    <section className="conditions-section" aria-labelledby="conditions-title">
      <div className="section-heading"><div><p className="eyebrow">UM OBJETIVO, DUAS CONDIÇÕES</p><h2 id="conditions-title">O que muda quando o tempo diminui?</h2></div><span className="section-note">A pergunta científica continua a mesma.</span></div>
      <div className="condition-grid">{SCENARIOS.map((scenario, index) => <article className={`condition-card condition-${index}`} key={scenario.id}>
        <div className="condition-number">0{index + 1}</div>
        <div className="condition-content"><div className="condition-kicker">{index === 0 ? 'EXPLORAÇÃO' : 'TRANSFERÊNCIA'}{completed.has(scenario.id) ? <span><Icon name="check" size={13} /> Tentativa registrada</span> : null}</div><h3>{index === 0 ? 'Uma janela para aprender.' : 'Menos tempo. Outra decisão.'}</h3><p>{scenario.description}</p><div className="condition-facts"><span><Icon name="signal" size={15} /> {scenario.contacts.length} contatos de {minutes((scenario.contacts[0]?.[1] ?? 0) - (scenario.contacts[0]?.[0] ?? 0))}</span><span><Icon name="route" size={15} /> {minutes(scenario.horizonS)} de missão</span></div></div>
        <button type="button" className="circle-button" onClick={() => onChoose(scenario.id)} aria-label={`Projetar missão: ${scenario.title}`}><Icon name="arrow" /></button>
      </article>)}</div>
    </section>
    <section className="science-strip"><div className="science-emblem" aria-hidden="true"><span /><span /><span /></div><div><p className="eyebrow">POR TRÁS DOS SEIS REGISTROS</p><h3>Uma pergunta sobre a vegetação do Cerrado.</h3><p>O índice NDVI compara o vermelho e o infravermelho próximo. Aqui, você transporta e processa arquivos históricos — o CubeSat não observa a Terra em tempo real.</p></div><button className="text-button" type="button" onClick={onSources}>Conhecer os dados <Icon name="arrow" size={17} /></button></section>
  </>;
}
