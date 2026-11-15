import { useId, useState } from 'react';
import { EXPEDITIONS, getExpeditionChoices, getExpeditionVisualState } from '../lab/scientific-expeditions.ts';
import type { ExpeditionObservation, ExpeditionResult } from '../lab/scientific-expeditions.ts';
import type { MissionEvent } from '../core/contracts.ts';
import type { SpacecraftInspection } from '../lab/spacecraft-presentation.ts';
import type { MissionSegment } from './Scene.tsx';
import { bits, number, time } from './format.ts';
import './expedition-learning.css';

export type EvidenceStep = 'question' | 'requirement' | 'record' | 'delivery' | 'interpretation';
export type EvidenceInspection = { eventId: string; segment: MissionSegment; subsystem: SpacecraftInspection; recordId?: string; step?: EvidenceStep };
export const EXPEDITION_ROLES = ['launch', 'space', 'ground', 'user'] as const;
export type ExpeditionRole = typeof EXPEDITION_ROLES[number];
export type ExpeditionDebriefAnswers = Record<ExpeditionRole, { conclusion: string; eventId: string; recordId: string }>;
export const emptyExpeditionDebrief = (): ExpeditionDebriefAnswers => Object.fromEntries(EXPEDITION_ROLES.map(role => [role, { conclusion: '', eventId: '', recordId: '' }])) as ExpeditionDebriefAnswers;

export function expeditionRecordStatus(record: ExpeditionObservation, timeS: number) {
  if (record.deliveredAtS !== null && record.deliveredAtS <= timeS) return record.valid ? 'valid' : 'incompatible';
  if (record.producedAtS === null || record.producedAtS > timeS) return 'not-yet';
  return 'incomplete';
}
const measurement = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 5 });
const STATUS = { valid: 'Evidência válida no solo', incompatible: 'Recebido, instrumento incompatível', 'not-yet': 'Ainda não produzido', incomplete: 'Produzido, entrega incompleta' };

export function inspectionForEvent(event: MissionEvent): EvidenceInspection {
  if (/CONTACT|DELIVERED|QUEUE/.test(event.code)) return { eventId: event.id, segment: 'ground', subsystem: 'communications' };
  if (/ENERGY|POWER|SUNLIGHT/.test(event.code)) return { eventId: event.id, segment: 'space', subsystem: 'energy' };
  if (/JOB|INSTRUMENT|BUFFER/.test(event.code)) return { eventId: event.id, segment: 'space', subsystem: 'instrument' };
  return { eventId: event.id, segment: 'launch', subsystem: 'overview' };
}

export function ExpeditionEvidenceTrail({ result, timeS, onInspect, selectedRecordId, onSelectRecord, selectedStep, onSelectStep, selectedEventId }: { result: ExpeditionResult; timeS: number; onInspect: (inspection: EvidenceInspection) => void; selectedRecordId?: string; onSelectRecord?: (id: string) => void; selectedStep?: EvidenceStep; onSelectStep?: (step: EvidenceStep) => void; selectedEventId?: string }) {
  const id = useId();
  const [localRecordId, setLocalRecordId] = useState(result.observations[0]!.id);
  const recordId = selectedRecordId ?? localRecordId;
  function setRecordId(id: string) { setLocalRecordId(id); onSelectRecord?.(id); }
  const [localStep, setLocalStep] = useState<EvidenceStep>('question');
  const step = selectedStep ?? localStep;
  function setStep(next: EvidenceStep) { setLocalStep(next); onSelectStep?.(next); }
  const mission = EXPEDITIONS[result.expeditionId];
  const record = result.observations.find(item => item.id === recordId) ?? result.observations[0]!;
  const status = expeditionRecordStatus(record, timeS);
  const produced = result.events.find(event => event.code === 'JOB_COMPLETE' && event.recordId === record.id && event.timeS <= timeS);
  const delivered = result.events.find(event => event.code === 'RECORD_DELIVERED' && event.recordId === record.id && event.timeS <= timeS);
  const instrument = result.events.find(event => event.code === 'INSTRUMENT_MISMATCH') ?? result.events.find(event => event.code === 'JOB_START' && event.recordId === record.id && event.timeS <= timeS);
  const latest = [...result.events].reverse().find(event => event.recordId === record.id && event.timeS <= timeS);
  const start = result.events[0]!;
  const steps: { id: EvidenceStep; title: string; label: string; detail: string; event: MissionEvent; segment: MissionSegment; subsystem: SpacecraftInspection }[] = [
    { id: 'question', title: '01 · Pergunta', label: 'O que queremos saber?', detail: mission.objective, event: start, segment: 'user', subsystem: 'overview' },
    { id: 'requirement', title: '02 · Requisito', label: result.expeditionId === 'bennu' ? 'Câmera + escala' : 'Espectrômetro + incerteza', detail: mission.requirements.space, event: instrument ?? start, segment: 'space', subsystem: 'instrument' },
    { id: 'record', title: '03 · Registro', label: record.id, detail: `${record.evidence.quantity}. ${STATUS[status]}.`, event: produced ?? latest ?? start, segment: 'space', subsystem: 'instrument' },
    { id: 'delivery', title: '04 · Solo', label: delivered ? 'Pacote recebido' : 'A entrega ainda falta', detail: delivered ? `O evento ${delivered.id} comprova a recepção completa em T+${time(delivered.timeS)}. ${record.valid ? 'O instrumento também atende ao requisito.' : 'Receber bits não corrige a incompatibilidade instrumental.'}` : 'O valor do arquivo fica oculto até existir uma entrega completa e compatível nesta tentativa.', event: delivered ?? latest ?? start, segment: 'ground', subsystem: 'communications' },
    { id: 'interpretation', title: '05 · Conclusão', label: status === 'valid' ? 'Evidência disponível' : 'Conclusão limitada', detail: record.evidence.limitations, event: delivered ?? latest ?? start, segment: 'user', subsystem: 'overview' },
  ];
  const active = steps.find(item => item.id === step) ?? steps[0]!;
  const inspectedEvent = result.events.find(event => event.id === selectedEventId && event.timeS <= timeS) ?? active.event;
  return <section className="exp-learning exp-evidence-trail" aria-labelledby={`${id}-title`}>
    <div className="exp-learning-heading"><div><p className="eyebrow">SIGA UM REGISTRO · DA PERGUNTA AO SOLO</p><h3 id={`${id}-title`}>Cada evidência tem um caminho.</h3></div><span className={`exp-status is-${status}`}>{STATUS[status]}</span></div>
    <p>Escolha um registro e toque em uma etapa. A cena acompanha o componente e um evento já ocorrido até T+{time(timeS)}.</p>
    <div className="exp-record-picker" aria-label="Registro da trilha">{result.observations.map(item => <button key={item.id} type="button" aria-pressed={record.id === item.id} onClick={() => setRecordId(item.id)}><span>{item.id}</span><small>{STATUS[expeditionRecordStatus(item, timeS)]}</small></button>)}</div>
    <ol className="exp-trace-steps">{steps.map(item => <li key={item.id}><button type="button" aria-pressed={step === item.id} onClick={() => { setStep(item.id); onInspect({ eventId: item.event.id, segment: item.segment, subsystem: item.subsystem, recordId: record.id, step: item.id }); }}><small>{item.title}</small><strong>{item.label}</strong></button></li>)}</ol>
    <div className="exp-trace-detail" aria-live="polite"><div><p className="eyebrow">{active.title} · {record.id}</p><p>{active.detail}</p><p className="exp-trace-measure">{status === 'valid' ? `${measurement(record.value)} ${record.unit}` : 'Medida ainda indisponível nesta tentativa'}</p>{status === 'valid' ? <p>{typeof record.evidence.uncertainty === 'number' ? `Incerteza publicada: ± ${measurement(record.evidence.uncertainty)} pontos percentuais (1σ).` : record.evidence.uncertainty}</p> : null}</div><div><p><strong>Evento selecionável</strong><br />{inspectedEvent.id} · T+{time(inspectedEvent.timeS)}<br />{inspectedEvent.message}</p><a href={record.evidence.sourceUrl} target="_blank" rel="noreferrer">Consultar fonte histórica ↗</a><p className="field-help">Linha {record.evidence.sourceRow} · {record.evidence.observedAt}. A fonte externa já existe; a disponibilidade no jogo depende da sua operação.</p></div></div>
  </section>;
}

const CHOICE_NAMES = { launch: 'Lançamento', orbit: 'Perfil', duration: 'Duração', instrument: 'Instrumento', power: 'Energia', ground: 'Serviço de solo' };
export function explainExpeditionComparison(a: ExpeditionResult, b: ExpeditionResult) {
  const choices = getExpeditionChoices(a.expeditionId);
  const changed = (Object.keys(CHOICE_NAMES) as (keyof typeof CHOICE_NAMES)[]).filter(key => a.config[key] !== b.config[key]);
  const differences = changed.map(key => {
    const before = choices[key].find(choice => choice.id === a.config[key])!;
    const after = choices[key].find(choice => choice.id === b.config[key])!;
    const attributes = [`${before.label} → ${after.label}`, `massa da opção: ${number(before.massKg)} → ${number(after.massKg)} kg`, `custo da opção: ${before.credits} → ${after.credits} créditos`];
    if (key === 'ground' || key === 'orbit') attributes.push(`primeira janela: T+${time(a.schedule.contacts[0]![0])} → T+${time(b.schedule.contacts[0]![0])}`, `duração da janela: ${a.schedule.contacts[0]![1] - a.schedule.contacts[0]![0]} → ${b.schedule.contacts[0]![1] - b.schedule.contacts[0]![0]} s`);
    if (key === 'instrument') attributes.push(`pacote: ${bits(before.bitsPerRecord!)} → ${bits(after.bitsPerRecord!)}`, `carga em processamento: ${before.totalLoadW} → ${after.totalLoadW} W`);
    if (key === 'power') attributes.push(`bateria: ${before.capacityWh} → ${after.capacityWh} Wh`, `painel: ${before.watts} → ${after.watts} W`, `descarga máxima: ${before.maxDischargeW} → ${after.maxDischargeW} W`);
    return { key, label: CHOICE_NAMES[key], attributes };
  });
  const times = [...new Set([...a.trace, ...b.trace, ...a.events, ...b.events].map(item => item.timeS))].sort((x, y) => x - y);
  let first: { timeS: number; reason: string; aEvent?: MissionEvent; bEvent?: MissionEvent } | undefined;
  for (const timeS of times) {
    const av = getExpeditionVisualState(a, Math.min(timeS, a.completedAtS));
    const bv = getExpeditionVisualState(b, Math.min(timeS, b.completedAtS));
    const ae = a.events.filter(event => event.timeS === timeS);
    const be = b.events.filter(event => event.timeS === timeS);
    const onlyA = ae.find(event => !be.some(other => other.code === event.code && other.recordId === event.recordId));
    const onlyB = be.find(event => !ae.some(other => other.code === event.code && other.recordId === event.recordId));
    const fields = [['energyWh', 'energia armazenada'], ['solarW', 'geração solar'], ['loadW', 'carga elétrica'], ['queueBits', 'memória ocupada'], ['downlinkedBits', 'dados recebidos']] as const;
    const stateDifference = fields.find(([key]) => av[key] !== bv[key]);
    if (onlyA || onlyB || stateDifference) {
      first = { timeS, reason: onlyB ? `B: ${onlyB.message}` : onlyA ? `A: ${onlyA.message}` : `O primeiro estado registrado diferente é ${stateDifference![1]}.`, aEvent: onlyA ?? ae[0], bEvent: onlyB ?? be[0] }; break;
    }
  }
  return { changed, differences, first, explanation: !changed.length ? 'As escolhas são iguais. O motor determinístico deve reproduzir os mesmos estados.' : changed.length > 1 ? 'Mais de uma escolha mudou. O contraste mostra diferenças, mas não isola uma causa única.' : changed[0] === 'ground' ? 'Você comparou dois serviços de solo. O pacote pode alterar duração, início do contato e custo juntos; a taxa continua 1,2 Mbit/s.' : changed[0] === 'instrument' ? 'Instrumentos mudam compatibilidade, massa, custo, consumo e volume do pacote juntos. Entrega completa e validade científica são critérios distintos.' : 'Uma opção mudou, mas seus atributos podem variar juntos. Confira o conjunto de diferenças antes de atribuir uma causa.' };
}

export function ExpeditionComparisonExplanation({ a, b, onInspect }: { a: ExpeditionResult; b: ExpeditionResult; onInspect: (timeS: number, side: 'a' | 'b', eventId?: string) => void }) {
  const explanation = explainExpeditionComparison(a, b);
  const completed = (result: ExpeditionResult) => result.observations.filter(record => record.deliveredAtS !== null).length;
  return <section className="exp-learning exp-causal-comparison" aria-label="Explicação da comparação A/B"><p className="eyebrow">A MESMA PERGUNTA · DUAS DECISÕES</p><h3>O que mudou — e quando apareceu?</h3><p>{explanation.explanation}</p><div className="exp-ab-outcomes"><div><small>TENTATIVA A</small><strong>{a.deliveredRecords}/{a.requiredRecords} válidos</strong><span>{completed(a)} pacotes completos · {number(a.totals.massKg)} kg · {a.totals.credits} créditos</span></div><span className="exp-ab-arrow" aria-hidden="true">→</span><div><small>TENTATIVA B</small><strong>{b.deliveredRecords}/{b.requiredRecords} válidos</strong><span>{completed(b)} pacotes completos · {number(b.totals.massKg)} kg · {b.totals.credits} créditos</span></div></div>
    {explanation.first ? <div className="exp-first-difference"><p><strong>Primeira diferença observável · T+{time(explanation.first.timeS)}</strong><br />{explanation.first.reason} Diferenças em T+0 representam a arquitetura ou a verificação inicial.</p><div className="expedition-actions"><button type="button" className="button button-secondary" onClick={() => onInspect(explanation.first!.timeS, 'a', explanation.first!.aEvent?.id)}>Investigar A no 3D</button><button type="button" className="button button-secondary" onClick={() => onInspect(explanation.first!.timeS, 'b', explanation.first!.bEvent?.id)}>Investigar B no 3D</button></div></div> : <p>Não há diferença nos estados registrados.</p>}
    {explanation.differences.map(item => <details key={item.key}><summary>{item.label} · atributos que mudam juntos</summary><ul>{item.attributes.map(value => <li key={value}>{value}</li>)}</ul></details>)}<p className="field-help">Comparação entre estados executados, no mesmo T+, sem interpolação. Depois do encerramento, cada tentativa conserva seu último estado. Esses recursos são do catálogo didático.</p>
  </section>;
}

export function ExpeditionRoleDebrief({ result, answers, onChange, onInspect }: { result: ExpeditionResult; answers: ExpeditionDebriefAnswers; onChange: (answers: ExpeditionDebriefAnswers) => void; onInspect: (inspection: EvidenceInspection) => void }) {
  const [role, setRole] = useState<ExpeditionRole>('user');
  const id = useId();
  const mission = EXPEDITIONS[result.expeditionId];
  const received = result.observations.filter(record => record.deliveredAtS !== null);
  const firstFailure = result.events.find(event => event.severity === 'error');
  const roles = {
    launch: { label: '01 · Lançamento', question: 'A missão cabe no veículo e no orçamento?', finding: `${number(result.totals.massKg)} / ${number(result.totals.maxMassKg)} kg · ${result.totals.credits} / ${result.totals.budget} créditos. ${result.constraints.filter(item => ['mass', 'budget', 'launch-orbit'].includes(item.id)).every(item => item.met) ? 'O envelope didático foi atendido.' : 'Há requisito de arquitetura não atendido.'}`, event: result.events.find(event => /MASS_LIMIT|BUDGET_LIMIT|LAUNCH_PROFILE/.test(event.code)) ?? result.events[0]! },
    space: { label: '02 · Espaço', question: 'A nave conseguiu sustentar o instrumento?', finding: `Energia mínima registrada: ${number(result.minEnergyWh)} Wh. ${result.constraints.find(item => item.id === 'instrument')?.met ? 'Instrumento compatível.' : 'Instrumento incompatível com o objetivo.'} ${firstFailure ? `Revise: ${firstFailure.message}` : 'Revise o processamento e a margem antes de ampliar a missão.'}`, event: result.events.find(event => /PEAK_POWER|ENERGY_DEPLETED|INSTRUMENT_MISMATCH/.test(event.code)) ?? result.events.find(event => event.code === 'JOB_START') ?? result.events[0]! },
    ground: { label: '03 · Solo', question: 'O que realmente chegou inteiro?', finding: `${received.length} pacotes completos; ${result.deliveredRecords} cientificamente válidos. ${bits(result.queueBits)} ficaram em memória; ${bits(result.lostBits)} foram perdidos.`, event: result.events.find(event => event.code === 'RECORD_DELIVERED') ?? result.events.find(event => event.code === 'CONTACT_START') ?? result.events.at(-1)! },
    user: { label: '04 · Usuários', question: result.expeditionId === 'bennu' ? 'O geólogo pode comparar tamanhos? O que falta para discutir a origem?' : 'O estudante pode ler o espectro? O que falta para interpretar a atmosfera?', finding: `${result.deliveredRecords} de ${result.requiredRecords} registros válidos sustentam o recorte. ${result.expeditionId === 'bennu' ? 'Tamanho sozinho não demonstra composição. São necessárias também as análises de imagem e espectro do estudo.' : 'Seis bins não refazem uma detecção molecular. A conclusão depende da análise publicada e do espectro completo.'}`, event: result.events.filter(event => event.code === 'RECORD_DELIVERED').at(-1) ?? result.events.at(-1)! },
  };
  const selected = roles[role];
  const answer = answers[role];
  const evidenceEvent = result.events.find(event => event.id === answer.eventId) ?? selected.event;
  const completed = EXPEDITION_ROLES.filter(key => answers[key].conclusion.trim().length >= 8).length;
  return <section className="exp-learning exp-role-debrief" aria-labelledby={`${id}-title`}><div className="exp-learning-heading"><div><p className="eyebrow">CONSELHO FINAL DA MISSÃO</p><h3 id={`${id}-title`}>Quatro papéis. Uma conclusão defensável.</h3></div><span className="exp-status">{completed}/4 pareceres registrados</span></div><p>Uma pessoa pode assumir todos os papéis; a equipe pode discutir no mesmo dispositivo. Use um evento e diga qual evidência ainda falta.</p><div className="exp-role-tabs">{EXPEDITION_ROLES.map(key => <button key={key} type="button" aria-pressed={role === key} onClick={() => setRole(key)}>{roles[key].label}{answers[key].conclusion.trim().length >= 8 ? ' ✓' : ''}</button>)}</div><div className="exp-role-panel"><h4>{selected.question}</h4><p>{selected.finding}</p><p className="field-help">Requisito: {mission.requirements[role]}</p><div className="exp-role-inputs"><label htmlFor={`${id}-event`}>Evento que sustenta o parecer<select id={`${id}-event`} value={evidenceEvent.id} onChange={event => onChange({ ...answers, [role]: { ...answer, eventId: event.target.value } })}>{result.events.map(event => <option key={event.id} value={event.id}>T+{time(event.timeS)} · {event.message}{event.recordId ? ` · ${event.recordId}` : ''}</option>)}</select></label><label htmlFor={`${id}-record`}>Registro citado<select id={`${id}-record`} value={answer.recordId} onChange={event => onChange({ ...answers, [role]: { ...answer, recordId: event.target.value, eventId: answer.eventId || selected.event.id } })}><option value="">Não se aplica / ainda não escolhido</option>{result.observations.map(record => <option key={record.id} value={record.id}>{record.id} · {STATUS[expeditionRecordStatus(record, result.completedAtS)]}</option>)}</select></label></div><button type="button" className="text-button" onClick={() => { const inspection = inspectionForEvent(evidenceEvent); onInspect({ ...inspection, segment: role }); }}>Rever evidência deste papel no 3D</button><label className="exp-role-conclusion" htmlFor={`${id}-conclusion`}>Nosso parecer: conclusão, evidência e próximo passo<textarea id={`${id}-conclusion`} rows={3} maxLength={1200} value={answer.conclusion} onChange={event => onChange({ ...answers, [role]: { ...answer, conclusion: event.target.value, eventId: answer.eventId || selected.event.id } })} placeholder="Concluímos… porque o evento… mostra… Ainda falta… Nossa próxima decisão será…" /></label><p className="field-help">Pareceres acompanham o relatório exportado. O contador registra preenchimento; não avalia compreensão ou certifica a conclusão.</p></div></section>;
}
