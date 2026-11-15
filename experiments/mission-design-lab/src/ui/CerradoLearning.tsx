import { useId, useState } from 'react';
import { CATALOG, CONFIG_KEYS, getScenario } from '../core/catalog.ts';
import type { MissionEvent, MissionResult } from '../core/contracts.ts';
import { SCIENCE_RECORDS } from '../data/science-data.ts';
import { buildScienceReturn } from '../lab/science-return.ts';
import { getMissionVisualState } from '../lab/mission-visual-state.ts';
import type { MissionSegment } from './MissionSegments.tsx';
import { CONFIG_LABELS, bits, choiceLabel, downloadText, ndvi, number, time } from './format.ts';
import './cerrado-learning.css';

export function cerradoRecordAt(result: MissionResult, recordId: string, timeS: number) {
  const observation = result.observations.find(item => item.id === recordId);
  const events = result.events.filter(item => item.recordId === recordId && item.timeS <= timeS);
  const event = events.at(-1);
  const delivered = observation?.deliveredAtS !== null && observation?.deliveredAtS !== undefined && observation.deliveredAtS <= timeS;
  const produced = observation?.producedAtS !== null && observation?.producedAtS !== undefined && observation.producedAtS <= timeS;
  const rejected = events.some(item => item.code === 'SCIENCE_REJECTED');
  const lost = events.some(item => item.code === 'BUFFER_OVERFLOW');
  const ready = Boolean(delivered && observation?.state === 'delivered' && observation.scienceValid && observation.ndvi !== null && Number.isFinite(observation.ndvi));
  const status = ready ? 'Evidência disponível' : rejected || delivered && !observation?.scienceValid ? 'Qualidade incompatível' : lost ? 'Perdido por falta de memória' : delivered ? 'Valor indisponível' : produced ? timeS >= result.completedAtS && observation?.state === 'partial' ? 'Recepção incompleta' : 'Em memória; entrega não concluída' : 'Ainda não produzido';
  return { status, ready, value: ready ? observation!.ndvi : null, event };
}

export function CerradoEvidenceTrail({ result, timeS, selectedRecordId, onSelectRecord, onInspect }: { result: MissionResult; timeS: number; selectedRecordId?: string; onSelectRecord: (id: string) => void; onInspect: (event: MissionEvent, segment: MissionSegment) => void }) {
  const titleId = useId();
  const record = SCIENCE_RECORDS.find(item => item.id === selectedRecordId) ?? SCIENCE_RECORDS[0]!;
  const state = cerradoRecordAt(result, record.id, timeS);
  const pair = buildScienceReturn(result).pairs.find(item => item.samples.some(sample => sample.recordId === record.id))!;
  const pairReady = pair.samples.every(item => cerradoRecordAt(result, item.recordId, timeS).ready);
  const production = result.events.find(event => event.recordId === record.id && event.code === 'JOB_COMPLETE' && event.timeS <= timeS);
  const delivery = result.events.find(event => event.recordId === record.id && event.code === 'RECORD_DELIVERED' && event.timeS <= timeS);
  const next = result.events.find(event => event.recordId === record.id && event.timeS > timeS);
  return <section className="cl-evidence" aria-labelledby={titleId} id="cerrado-evidence-trail">
    <div className="cl-heading"><div><p className="eyebrow">TRILHA DA EVIDÊNCIA · T+{time(timeS)}</p><h2 id={titleId} tabIndex={-1}>Siga um dado, da pergunta ao solo.</h2></div><span className="cl-status">{state.status}</span></div>
    <p>Como o índice de vegetação mudou entre dois períodos nos três pontos amostrados? Escolha um registro para acompanhar seu caminho.</p>
    <div className="cl-records" aria-label="Escolher registro MODIS">{SCIENCE_RECORDS.map(item => <button type="button" key={item.id} aria-pressed={record.id === item.id} onClick={() => onSelectRecord(item.id)}><strong>{item.id.split('-')[0]} · {item.observationDate.split('-').reverse().join('/')}</strong><small>{cerradoRecordAt(result, item.id, timeS).status}</small></button>)}</div>
    <ol className="cl-trail">
      <li><span>01 · PERGUNTA</span><strong>Comparar o ponto {pair.point}</strong><p>Precisamos de duas observações completas e válidas do mesmo ponto.</p><a href="#science-results-title">Ver o requisito e o retorno final ↓</a></li>
      <li><span>02 · INSTRUMENTO / PROCESSAMENTO</span><strong>{choiceLabel(result.config, 'processing')}</strong><p>O CubeSat processa arquivos históricos MODIS. A rota escolhida altera carga elétrica e volume de dados.</p>{production ? <button type="button" onClick={() => onInspect(production, 'space')}>Rever produção no 3D · T+{time(production.timeS)}</button> : <small>Nenhuma produção completa deste registro até este instante.</small>}</li>
      <li><span>03 · SOLO / RECEPÇÃO</span><strong>{state.status}</strong><p>{state.ready ? `NDVI recebido: ${ndvi(state.value!)} · sem unidade.` : 'O valor fica oculto até a entrega completa e válida.'}</p>{delivery ? <button type="button" onClick={() => onInspect(delivery, 'ground')}>Rever entrega no 3D · T+{time(delivery.timeS)}</button> : state.event ? <button type="button" onClick={() => onInspect(state.event!, 'space')}>Inspecionar o último evento disponível</button> : <small>Sem evento deste registro neste instante.</small>}</li>
      <li><span>04 · INTERPRETAÇÃO</span><strong>{pairReady && pair.difference !== null ? `Variação NDVI: ${ndvi(pair.difference)}` : 'Aguardando o par completo'}</strong><p>{pairReady ? 'A diferença descreve estes dois períodos. Ela não revela a causa da mudança nem representa todo o Cerrado.' : 'Um único período não permite calcular a variação. Não completamos o par com valores do arquivo público.'}</p></li>
    </ol>
    <div className="cl-source"><p><strong>{record.id}</strong> · MOD13Q1 V6.1 · observação histórica {record.observationDate}. NDVI sem unidade; qualidade conferida pela máscara do motor. Datas históricas e relógio da simulação são distintos.</p><a href="https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf" target="_blank" rel="noreferrer">Fonte e critérios MODIS ↗</a>{next ? <button type="button" className="text-button" onClick={() => onInspect(next, next.code === 'RECORD_DELIVERED' ? 'ground' : 'space')}>Avançar para o próximo evento deste registro · T+{time(next.timeS)}</button> : null}</div>
  </section>;
}

const ATTRIBUTES = [{ key: 'capacityWh', unit: 'Wh' }, { key: 'maxDischargeW', unit: 'W de descarga' }, { key: 'watts', unit: 'W nominais' }, { key: 'bitsPerRecord', unit: 'bit por registro' }, { key: 'totalLoadW', unit: 'W de carga total' }, { key: 'rateBps', unit: 'bit/s' }, { key: 'capacityBits', unit: 'bit de memória' }, { key: 'massKg', unit: 'kg' }, { key: 'credits', unit: 'créditos' }] as const;
export function compareCerrado(a: MissionResult, b: MissionResult) {
  const changed = CONFIG_KEYS.filter(key => a.config[key] !== b.config[key]);
  const times = [...new Set([...a.trace, ...b.trace, ...a.events, ...b.events].map(item => item.timeS))].sort((x, y) => x - y);
  const signature = (result: MissionResult, at: number) => {
    const state = getMissionVisualState(result, at);
    return JSON.stringify([state.energyWh, state.queueBits, state.downlinkedBits, state.solarW, state.loadW, state.mode, state.deliveredRecordIds, result.events.filter(item => item.timeS === at).map(item => [item.code, item.recordId, item.value, item.limit])]);
  };
  const firstTimeS = times.find(at => signature(a, at) !== signature(b, at)) ?? null;
  const firstEvent = firstTimeS === null ? null : [...a.events, ...b.events].find(item => item.timeS === firstTimeS && item.severity === 'error') ?? [...a.events, ...b.events].find(item => item.timeS === firstTimeS) ?? null;
  return { changed, firstTimeS, firstEvent, scenarioChanged: a.scenarioId !== b.scenarioId };
}

export function CerradoComparisonExplanation({ a, b, onSeek }: { a: MissionResult; b: MissionResult; onSeek: (timeS: number) => void }) {
  const comparison = compareCerrado(a, b);
  return <section className="cl-comparison"><p className="eyebrow">POR QUE AS TENTATIVAS DIVERGEM?</p><h3>{comparison.firstTimeS === null ? 'Os estados observados são iguais.' : `Primeira diferença observável · T+${time(comparison.firstTimeS)}`}</h3>
    <p>{comparison.changed.length + Number(comparison.scenarioChanged) > 1 ? 'Várias escolhas mudaram. O contraste mostra o efeito conjunto; não isola uma causa única.' : comparison.changed.length ? 'Uma escolha mudou. Confira todos os atributos que ela altera antes de atribuir o resultado a um só recurso.' : comparison.scenarioChanged ? 'O calendário de contato mudou. A comparação preserva as condições de cada tentativa.' : 'Os dois lados usam as mesmas escolhas e o mesmo cenário.'} Diferenças de massa e orçamento já existem antes do primeiro evento.</p>
    {comparison.firstEvent?.code === 'PEAK_POWER' ? <p className="cl-causal"><strong>Limite instantâneo de potência:</strong> o motor registrou {number(comparison.firstEvent.value ?? 0)} W para um limite de {number(comparison.firstEvent.limit ?? 0)} W. Energia armazenada em Wh e capacidade de descarga em W são limites diferentes. Menos bits por registro não garante uma operação viável.</p> : comparison.firstEvent ? <p className="cl-causal"><strong>Evento no primeiro instante diferente:</strong> {comparison.firstEvent.message}</p> : null}
    <div className="cl-deltas">{comparison.changed.map(key => { const ca = CATALOG[key].find(item => item.id === a.config[key])!, cb = CATALOG[key].find(item => item.id === b.config[key])!; return <article key={key}><strong>{CONFIG_LABELS[key]}: {ca.label} → {cb.label}</strong><ul>{ATTRIBUTES.filter(item => ca[item.key] !== cb[item.key]).map(item => <li key={item.key}>{number(ca[item.key] ?? 0)} → {number(cb[item.key] ?? 0)} {item.unit}</li>)}</ul>{key === 'policy' ? <p>{ca.description} → {cb.description}</p> : null}</article>; })}{comparison.scenarioChanged ? <article><strong>Calendário de contatos</strong><p>A: {getScenario(a.scenarioId).contacts.map(([start, end]) => `${time(start)}–${time(end)}`).join(' / ')}</p><p>B: {getScenario(b.scenarioId).contacts.map(([start, end]) => `${time(start)}–${time(end)}`).join(' / ')}</p></article> : null}</div>
    {comparison.firstTimeS !== null ? <button type="button" className="button button-secondary" onClick={() => onSeek(comparison.firstTimeS!)}>Investigar esta diferença no 3D</button> : null}
  </section>;
}

const ROLES = [{ id: 'launch', title: 'Lançamento', question: 'A integração cabe no lançador e no orçamento? Qual margem você defenderia?' }, { id: 'space', title: 'Espaço', question: 'Qual foi o recurso crítico da nave? Qual evento sustenta sua explicação?' }, { id: 'ground', title: 'Solo', question: 'Quais registros chegaram e quais ficaram pelo caminho? O que mudaria no contato?' }, { id: 'user', title: 'Usuários científicos', question: 'O que um analista pode concluir sobre os três pontos? Que evidência ainda falta?' }] as const;
export function CerradoRoleDebrief({ result, onInspect, onSave }: { result: MissionResult; onInspect: (event: MissionEvent, segment: MissionSegment) => void; onSave: (text: string, eventId?: string) => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const id = useId(), scenario = getScenario(result.scenarioId), science = buildScienceReturn(result);
  const completed = ROLES.filter(role => (answers[role.id]?.trim().length ?? 0) >= 8).length;
  const roleEvent = (role: string) => role === 'launch' ? result.events.find(item => ['MASS_LIMIT', 'BUDGET_LIMIT', 'MISSION_START'].includes(item.code)) : role === 'space' ? result.events.find(item => ['PEAK_POWER', 'ENERGY_DEPLETED', 'RESERVE_BREACH', 'BUFFER_OVERFLOW'].includes(item.code)) ?? result.events.find(item => item.code === 'JOB_COMPLETE') : role === 'ground' ? result.events.find(item => item.code === 'RECORD_DELIVERED') ?? result.events.find(item => item.code === 'DELIVERY_SHORTFALL') : result.events.filter(item => item.code === 'RECORD_DELIVERED').at(-1) ?? result.events.at(-1);
  const evidence = (role: string) => role === 'launch' ? `${number(result.massKg)} / ${number(scenario.maxMassKg)} kg · ${result.credits} / ${scenario.budget} créditos.` : role === 'space' ? `Energia mínima ${number(result.minEnergyWh)} Wh; reserva ${number(result.reserveWh)} Wh. ${result.violations.length} restrição(ões) registrada(s).` : role === 'ground' ? `${bits(result.downlinkedBits)} recebidos; ${bits(result.queueBits)} na fila; ${bits(result.lostBits)} perdidos.` : `${science.availableComparisons} / ${science.totalComparisons} pares comparáveis; ${result.deliveredRecords} / 6 registros válidos. NDVI não identifica sozinho a causa de uma mudança.`;
  const report = () => ({ format: 'ipe-cerrado-four-role-analysis-v1', engineVersion: result.engineVersion, scienceNotice: 'Dados históricos Terra/MODIS; operação didática. Respostas da equipe não são conclusões da NASA.', scenarioId: result.scenarioId, config: result.config, outcome: result.outcome, roles: ROLES.map(role => ({ role: role.id, answer: answers[role.id] ?? '', evidence: evidence(role.id), eventId: roleEvent(role.id)?.id ?? null })), result });
  return <section className="cl-debrief" aria-labelledby={`${id}-title`}><div className="cl-heading"><div><p className="eyebrow">CONSELHO FINAL DA MISSÃO</p><h2 id={`${id}-title`}>Quatro papéis. Uma conclusão defensável.</h2></div><span>{completed} / 4 análises preenchidas</span></div><p>Uma pessoa pode assumir os quatro papéis; uma equipe negocia no mesmo dispositivo. Use o resultado desta tentativa, aponte a evidência e proponha sua próxima decisão.</p><div className="cl-roles">{ROLES.map(role => { const event = roleEvent(role.id); return <article key={role.id}><h3>{role.title}</h3><p className="cl-role-evidence">{evidence(role.id)}</p>{event ? <button className="text-button" type="button" onClick={() => onInspect(event, role.id)}>Rever evidência no 3D · T+{time(event.timeS)}</button> : <p>Nenhum evento disponível para este papel.</p>}<label htmlFor={`${id}-${role.id}`}>{role.question}</label><textarea id={`${id}-${role.id}`} rows={3} maxLength={1200} value={answers[role.id] ?? ''} onChange={event => { setAnswers(previous => ({ ...previous, [role.id]: event.target.value })); setSaved(false); }} placeholder="O evento mostra… Portanto… Ainda precisamos de…" /></article>; })}</div><div className="cl-actions"><button type="button" className="button button-primary" disabled={completed < 4 || saved} onClick={() => { ROLES.forEach(role => onSave(`[${role.title}] ${answers[role.id]!.trim()}`, roleEvent(role.id)?.id)); setSaved(true); }}>{saved ? 'Quatro análises registradas no diário' : 'Registrar as quatro análises'}</button><button type="button" className="button button-secondary" onClick={() => downloadText(JSON.stringify(report(), null, 2), 'missao-ipe-cerrado-analise-quatro-papeis.json')}>Exportar análise e evidências</button></div><p className="field-help">O diário local guarda as respostas registradas; o arquivo inclui respostas, configuração e resultado. Uma resposta preenchida não certifica aprendizagem.</p></section>;
}
