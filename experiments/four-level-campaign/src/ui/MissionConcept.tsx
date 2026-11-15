import { useId } from 'react';
import { Icon } from './Icon.tsx';
import './mission-concept.css';

const STEPS = [
  { title: 'Preparar', text: 'Escolher sistemas e plano de transmissão.' },
  { title: 'Processar arquivos', text: 'Ler os registros históricos Terra/MODIS.' },
  { title: 'Guardar entre contatos', text: 'Manter os registros na memória até poder enviar.' },
  { title: 'Entregar e validar no solo', text: 'Receber cada registro inteiro e conferir a ciência.' },
] as const;

export function MissionConcept({ onSources }: { onSources: () => void }) {
  const titleId = useId();
  return <section className="mc-concept" aria-labelledby={titleId}>
    <div className="mc-heading"><div><p className="mc-eyebrow">A MISSÃO ANTES DAS PEÇAS</p><h2 id={titleId}>Uma pergunta. Um caminho até a resposta.</h2></div><button type="button" className="mc-sources" onClick={onSources}>Dados e premissas <Icon name="arrow" size={16} /></button></div>
    <div className="mc-cards">
      <article className="mc-card"><span className="mc-card-label"><Icon name="globe" size={17} /> QUEM INVESTIGA</span><h3>Você analisa arquivos de vegetação Terra/MODIS.</h3><p className="mc-question">Como o índice de vegetação mudou entre dois períodos nos três pontos?</p><p className="mc-small">Atividade educacional; A, B e C identificam os três pontos do recorte histórico.</p></article>
      <article className="mc-card"><span className="mc-card-label"><Icon name="check" size={17} /> O QUE PRECISA CHEGAR</span><h3>Seis registros completos e válidos.</h3><p>Dois períodos em cada ponto. O objetivo exige entrega validada no solo e respeito aos limites do projeto.</p><dl className="mc-limits"><div><dt>Massa</dt><dd>3,6 <small>kg</small></dd></div><div><dt>Orçamento</dt><dd>86 <small>créditos</small></dd></div><div><dt>Duração</dt><dd>180 <small>min</small></dd></div></dl></article>
      <article className="mc-card"><span className="mc-card-label"><Icon name="route" size={17} /> CONDIÇÕES PREVISTAS</span><h3>Sombra e intervalos sem contato fazem parte.</h3><p>O projeto precisa atravessar o eclipse e esperar pelas janelas de transmissão. Essas condições são previstas; falhas de potência e perda de dados são problemas diferentes.</p></article>
    </div>
    <ol className="mc-flow" aria-label="Caminho dos arquivos até a entrega científica">{STEPS.map((step, index) => <li key={step.title}><span className="mc-step-number" aria-hidden="true">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>
    <p className="mc-simulation"><Icon name="info" size={16} /><span><strong>SIMULAÇÃO</strong> O CubeSat do exercício é um modelo didático que processa e transporta arquivos históricos. Ele não adquire novas observações MODIS durante os 180 minutos.</span></p>
  </section>;
}
