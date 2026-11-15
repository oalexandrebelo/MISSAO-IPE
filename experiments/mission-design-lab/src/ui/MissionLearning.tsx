import { useId, useState } from 'react';
import { MISSION_CURRICULUM, runLearningExperiment, summarizeLearningTrial } from '../lab/mission-curriculum.ts';
import type { LearningExperiment, LearningMission, LearningTrial } from '../lab/mission-curriculum.ts';
import { getMissionVisualState } from '../lab/mission-visual-state.ts';
import { getExpeditionVisualState } from '../lab/scientific-expeditions.ts';
import { Scene } from './Scene.tsx';
import { number, time } from './format.ts';
import './mission-learning.css';

export function MissionPurpose({ id }: { id: LearningMission }) {
  const lesson = MISSION_CURRICULUM[id];
  return <section className="mission-purpose" aria-label="Propósito e aprendizagem desta missão"><div><p className="eyebrow">POR QUE ESTA MISSÃO EXISTE</p><h2>{lesson.title}</h2><p>{lesson.beneficiary}</p><strong>{lesson.purpose}</strong></div><div><p className="eyebrow">AO FINAL, VOCÊ VAI PRATICAR</p><ol>{lesson.learn.map(item => <li key={item}>{item}</li>)}</ol><a href={lesson.source} target="_blank" rel="noreferrer">Explore a ciência na NASA ↗</a></div></section>;
}

export function MissionExperiment({ id, onApply, disabled = false }: { id: LearningMission; onApply: (trial: LearningTrial) => void; disabled?: boolean }) {
  const lesson = MISSION_CURRICULUM[id];
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [prediction, setPrediction] = useState('');
  const [experiment, setExperiment] = useState<LearningExperiment | null>(null);
  const [side, setSide] = useState<0 | 1>(0);
  const [at, setAt] = useState(0);
  const trial = experiment?.trials[side];
  const snapshots = experiment?.trials.map(summarizeLearningTrial);
  const difference = snapshots ? snapshots[1]!.valid - snapshots[0]!.valid : 0;
  const expected = difference > 0 ? 'more' : difference < 0 ? 'less' : 'same';
  const horizon = trial?.kind === 'expedition' ? trial.result.horizonS : 10800;
  const state = trial ? trial.kind === 'cerrado' ? getMissionVisualState(trial.result, at) : getExpeditionVisualState(trial.result, at) : undefined;
  const keyEvent = trial?.result.events.find(event => event.severity === 'error') ?? trial?.result.events.find(event => event.code.includes('CONTACT'));
  return <section className="learning-experiment" aria-labelledby={`${uid}-title`}>
    <div className="experiment-heading"><div><p className="eyebrow">EXPERIMENTO GUIADO · UMA ESCOLHA POR VEZ</p><h2 id={`${uid}-title`}>{lesson.experiment}</h2></div><button className="button button-secondary" type="button" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Fechar experimento' : 'Investigar esta escolha'}</button></div>
    {open ? <div className="experiment-body"><p>{lesson.prediction}</p><p className="field-help">{lesson.changed} São duas configurações de exemplo, independentes do seu projeto atual.</p>
      <fieldset disabled={disabled || experiment !== null}><legend>Faça uma previsão sobre os registros válidos de B em relação a A</legend><div className="experiment-predictions">{[{ value: 'more', text: 'B entrega mais' }, { value: 'same', text: 'B entrega o mesmo' }, { value: 'less', text: 'B entrega menos' }].map(option => <label key={option.value}><input type="radio" name={`${uid}-prediction`} value={option.value} checked={prediction === option.value} onChange={() => setPrediction(option.value)}/>{option.text}</label>)}</div></fieldset>
      {!experiment ? <button className="button button-primary" type="button" disabled={!prediction || disabled} onClick={() => { setExperiment(runLearningExperiment(id)); setSide(0); setAt(0); }}>Executar os dois ensaios</button> : <>
        <div className="experiment-feedback" role="status"><strong>{prediction === expected ? 'Sua previsão combina com este resultado.' : 'O resultado convida a rever a previsão.'}</strong><p>{lesson.explanation}</p></div>
        <div className="table-scroll"><table className="source-table"><caption>Resultados finais dos ensaios — independentes do instante visualizado abaixo</caption><thead><tr><th scope="col">Evidência</th>{experiment.trials.map(item => <th key={item.label} scope="col">{item.label}</th>)}</tr></thead><tbody>
          <tr><th scope="row">Registros completos recebidos</th>{snapshots!.map((s,i) => <td key={i}>{s.received} / 6</td>)}</tr>
          <tr><th scope="row">Registros cientificamente válidos</th>{snapshots!.map((s,i) => <td key={i}>{s.valid} / 6</td>)}</tr>
          <tr><th scope="row">Dados recebidos</th>{snapshots!.map((s,i) => <td key={i}>{number(s.mbit)} Mbit</td>)}</tr>
          <tr><th scope="row">Massa / orçamento usado</th>{snapshots!.map((s,i) => <td key={i}>{number(s.massKg)} kg / {s.credits} créditos</td>)}</tr>
          <tr><th scope="row">Atende à missão?</th>{snapshots!.map((s,i) => <td key={i}>{s.outcome === 'success' ? 'Sim' : s.outcome === 'invalid' ? 'Projeto incompatível' : 'Não'}</td>)}</tr>
        </tbody></table></div>
        <div className="experiment-actions" role="group" aria-label="Inspecionar ensaio guiado">{experiment.trials.map((item, index) => <button key={item.label} className="button button-secondary" type="button" aria-pressed={side === index} onClick={() => setSide(index as 0 | 1)}>{item.label}</button>)}</div>
        {trial && state ? <><label className="experiment-time" htmlFor={`${uid}-time`}>Mesmo relógio · T+{time(at)}<input id={`${uid}-time`} type="range" min={0} max={horizon} step={1} value={at} onChange={event => setAt(Number(event.target.value))}/></label><div className="experiment-actions"><button className="text-button" type="button" onClick={() => setAt(0)}>Voltar ao início do ensaio</button>{keyEvent ? <button className="text-button" type="button" onClick={() => setAt(keyEvent.timeS)}>Ver evento chave · T+{time(keyEvent.timeS)}</button> : null}<button className="text-button" type="button" onClick={() => setAt(horizon)}>Ver final do ensaio</button></div>
          <Scene key={trial.kind === 'cerrado' ? 'cerrado' : trial.result.expeditionId} world={trial.kind === 'cerrado' ? 'earth' : trial.result.expeditionId} config={trial.kind === 'cerrado' ? trial.result.config : undefined} scenarioId={trial.kind === 'cerrado' ? trial.result.scenarioId : undefined} expeditionConfig={trial.kind === 'expedition' ? trial.result.config : undefined} visualState={state} segment="space"/>
          <p className="experiment-evidence">{keyEvent ? `Evento para investigar: ${keyEvent.message}` : 'Compare as leituras e os registros disponíveis.'} A cena conserva o último estado registrado; o fim antecipado de uma operação não cria novos dados.</p>
          <button className="button button-primary" type="button" disabled={disabled} onClick={() => onApply(trial)}>Usar {side === 0 ? 'A' : 'B'} como ponto de partida</button>
        </> : null}
        <p className="field-help">Aplicar copia as escolhas para o projeto, inclusive as que falham. Você ainda precisa justificar e executar sua própria tentativa. Este experimento não salva uma missão no caderno.</p>
        <button className="text-button" type="button" onClick={() => { setExperiment(null); setPrediction(''); setAt(0); }}>Refazer minha previsão</button>
      </>}
    </div> : null}
  </section>;
}

export function MissionReflection({ id, valid, required }: { id: LearningMission; valid: number; required: number }) {
  const lesson = MISSION_CURRICULUM[id];
  const uid = useId();
  const [choice, setChoice] = useState('');
  return <section className="mission-reflection" aria-labelledby={`${uid}-title`}><p className="eyebrow">DE VOLTA À PERGUNTA CIENTÍFICA</p><h2 id={`${uid}-title`}>O que você pode afirmar?</h2><p>{valid} de {required} registros válidos nesta tentativa. {valid < required ? 'O conjunto está incompleto: uma lacuna deve permanecer visível na análise.' : 'O conjunto chegou; agora é preciso respeitar o alcance da evidência.'}</p><fieldset><legend>Escolha uma interpretação defensável</legend>{[{id:'overclaim',text:lesson.overclaim},{id:'evidence',text:lesson.conclusion},{id:'missing',text:lesson.missing}].map(option => <label key={option.id}><input type="radio" name={`${uid}-conclusion`} checked={choice === option.id} onChange={() => setChoice(option.id)}/><span>{option.text}</span></label>)}</fieldset>{choice ? <p className="reflection-response" role="status">{choice === 'evidence' ? 'Essa interpretação respeita a evidência. Cite um evento da tentativa, explique uma escolha e registre uma limitação no seu relatório.' : 'Reveja o alcance dos dados: receber, medir e explicar uma causa são etapas diferentes. ' + lesson.boundary}</p> : null}<p className="field-help">Exercício de reflexão, sem nota de aprendizagem ou certificação. Use sua análise no relatório da missão.</p></section>;
}
