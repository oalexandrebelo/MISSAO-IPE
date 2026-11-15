import { ExpeditionEvidenceTrail, ExpeditionComparisonExplanation, ExpeditionRoleDebrief, emptyExpeditionDebrief, inspectionForEvent } from './ExpeditionLearning.tsx';
import type { EvidenceInspection } from './ExpeditionLearning.tsx';
import type { SpacecraftInspection } from '../lab/spacecraft-presentation.ts';
import { ArchivedEvidence } from './ArchivedEvidence.tsx';
import { useEffect, useRef, useState } from 'react';
import { DEFAULT_EXPEDITION_CONFIGS, EXPEDITIONS, getExpeditionChoices, getExpeditionPreflight, getExpeditionVisualState, simulateExpedition } from '../lab/scientific-expeditions.ts';
import type { ExpeditionConfig, ExpeditionId, ExpeditionResult } from '../lab/scientific-expeditions.ts';
import { Scene } from './Scene.tsx';
import { MissionSegments } from './MissionSegments.tsx';
import type { MissionSegment } from './MissionSegments.tsx';
import { MissionStory } from './MissionStories.tsx';
import { MissionPurpose, MissionExperiment, MissionReflection } from './MissionLearning.tsx';
import { CrewReview, useCrewReview } from './CrewReview.tsx';
import { Icon } from './Icon.tsx';
import { bits, downloadText, number, time } from './format.ts';

type Phase = 'need' | 'requirements' | 'design' | 'verify' | 'operations' | 'return';
const PHASES: readonly { id: Phase; label: string }[] = [
  { id: 'need', label: 'Necessidade' }, { id: 'requirements', label: 'Requisitos' }, { id: 'design', label: 'Projeto' },
  { id: 'verify', label: 'Verificação' }, { id: 'operations', label: 'Operação' }, { id: 'return', label: 'Retorno científico' },
];
const LABELS: Record<keyof ExpeditionConfig, string> = { launch: 'Veículo de lançamento', orbit: 'Perfil orbital', instrument: 'Instrumento científico', power: 'Energia e plataforma', ground: 'Comunicação com o solo', duration: 'Vida operacional do recorte' };
const KEYS = ['launch', 'orbit', 'instrument', 'power', 'ground', 'duration'] as const;
const SEGMENTS = [{ id: 'user', label: 'Usuários científicos' }, { id: 'launch', label: 'Lançamento' }, { id: 'space', label: 'Segmento espacial' }, { id: 'ground', label: 'Segmento terrestre' }] as const;
const FORMAT = 'ipe-scientific-design-v2';
interface Attempt { result: ExpeditionResult; hypothesis: string; crewSize: number; reviewedRoles: string[]; }

function readDesign(text: string, id: ExpeditionId) {
  if (text.length > 16_000) throw new Error('Projeto excede 16 KB.');
  const value: unknown = JSON.parse(text);
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Projeto inválido.');
  const input = value as Record<string, unknown>;
  if (input.format !== FORMAT) throw new Error('Projeto de outra edição. A R18 usa novos dados reais; recrie e revise a hipótese para evitar reinterpretar medidas sintéticas antigas.');
  if (Object.keys(input).length !== 4 || !['format', 'expeditionId', 'config', 'hypothesis'].every(key => Object.hasOwn(input, key)) || input.format !== FORMAT || input.expeditionId !== id || typeof input.hypothesis !== 'string' || input.hypothesis.length > 1500) throw new Error('Arquivo de projeto incompatível com esta missão.');
  getExpeditionPreflight(id, input.config as ExpeditionConfig);
  return { config: input.config as ExpeditionConfig, hypothesis: input.hypothesis };
}
function Conditions({ constraints }: { constraints: ReturnType<typeof getExpeditionPreflight>['constraints'] }) {
  return <ul className="expedition-constraints">{constraints.map(condition => <li className={condition.met ? '' : 'unmet'} key={condition.id}><strong>{condition.met ? 'Atendido' : 'Revisar'}</strong><span>{condition.label}</span><span>{typeof condition.measured === 'number' ? number(condition.measured) : String(condition.measured)} / {typeof condition.limit === 'number' ? number(condition.limit) : String(condition.limit)} {condition.unit}</span></li>)}</ul>;
}

export function ScientificExpedition({ id, onBack }: { id: ExpeditionId; onBack: () => void }) {
  const mission = EXPEDITIONS[id];
  const choices = getExpeditionChoices(id);
  const [config, setConfig] = useState<ExpeditionConfig>({ ...DEFAULT_EXPEDITION_CONFIGS[id] });
  const [phase, setPhase] = useState<Phase>('need');
  const [hypothesis, setHypothesis] = useState('');
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [timeS, setTimeS] = useState(0);
  const [eventId, setEventId] = useState<string>();
  const [segment, setSegment] = useState<MissionSegment>('space');
  const [playing, setPlaying] = useState(false);
  const [notice, setNotice] = useState('');
  const [reflection, setReflection] = useState('');
  const [debrief, setDebrief] = useState(emptyExpeditionDebrief);
  const [inspectSubsystem, setInspectSubsystem] = useState<SpacecraftInspection>();
  const [selectedEvidenceRecordId, setSelectedEvidenceRecordId] = useState<string>();
  const [compareEventId, setCompareEventId] = useState<string>();
  const [compareInspection, setCompareInspection] = useState<SpacecraftInspection>();
  const [compareSegment, setCompareSegment] = useState<MissionSegment>('space');
  const [compareSide, setCompareSide] = useState<'a' | 'b'>('b');
  const [compareTime, setCompareTime] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const crew = useCrewReview(JSON.stringify({ config, hypothesis }));
  const preflight = getExpeditionPreflight(id, config);
  const current = attempts.at(-1);
  const result = current?.result;
  const draftMatches = result ? JSON.stringify(result.config) === JSON.stringify(config) : false;
  const visual = result ? getExpeditionVisualState(result, timeS, eventId) : undefined;
  const earlier = attempts.at(-2);
  const comparison = earlier && current ? compareSide === 'a' ? earlier : current : null;
  const compareHorizon = earlier && current ? Math.max(earlier.result.horizonS, current.result.horizonS) : 0;

  useEffect(() => { heading.current?.focus(); }, [phase]);
  useEffect(() => {
    if (!playing || !result) return;
    const stop = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener('visibilitychange', stop);
    const timer = window.setTimeout(() => {
      const next = result.trace.find(point => point.timeS > timeS);
      if (!next || document.hidden) setPlaying(false);
      else { setTimeS(next.timeS); setEventId(undefined); setInspectSubsystem(undefined); }
    }, 700);
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', stop); };
  }, [playing, result, timeS]);

  function choose(key: keyof ExpeditionConfig, value: string) {
    setConfig(previous => ({ ...previous, [key]: value })); setPlaying(false);
    setNotice(result ? 'Projeto alterado. A tentativa anterior continua preservada; revise sua hipótese antes de executar novamente.' : 'Projeto alterado. Observe a nave e revise sua hipótese antes de executar.');
  }
  function execute() {
    if (hypothesis.trim().length < 8 || !crew.ready) return;
    const next = simulateExpedition(id, config);
    setAttempts(previous => [...previous, { result: next, hypothesis: hypothesis.trim(), crewSize: crew.size, reviewedRoles: [...crew.roles] }]);
    setCompareTime(0); setCompareSide('b'); setCompareEventId(undefined); setCompareInspection(undefined); setCompareSegment('space'); setDebrief(emptyExpeditionDebrief()); setInspectSubsystem(undefined); setSelectedEvidenceRecordId(undefined);
    setTimeS(0); setEventId(undefined); setPlaying(false); setReflection(''); setPhase('operations'); setNotice('Tentativa registrada. A cena acompanha os estados calculados; selecione um evento para investigar.');
  }
  function inspectTrace(inspection: EvidenceInspection) {
    const event = result?.events.find(item => item.id === inspection.eventId);
    if (!event) return;
    if (inspection.recordId ?? event.recordId) setSelectedEvidenceRecordId(inspection.recordId ?? event.recordId);
    setTimeS(event.timeS); setEventId(event.id); setSegment(inspection.segment); setInspectSubsystem(inspection.subsystem); setPlaying(false); setPhase('operations');
    setNotice(`T+${time(event.timeS)} · ${event.message}${event.recordId ? ` · ${event.recordId}` : ''}. A trilha, o relógio e a cena usam o mesmo evento.`);
    window.setTimeout(() => document.getElementById('exp-operation-scene')?.scrollIntoView({ behavior: 'auto', block: 'start' }), 0);
  }
  function inspectComparison(at: number, side: 'a' | 'b', selectedId?: string) {
    setCompareTime(at); setCompareSide(side); setCompareEventId(selectedId);
    const selectedResult = side === 'a' ? earlier?.result : current?.result;
    const event = selectedResult?.events.find(item => item.id === selectedId);
    const inspection = event ? inspectionForEvent(event) : { subsystem: 'overview' as const, segment: 'space' as const };
    setCompareInspection(inspection.subsystem); setCompareSegment(inspection.segment);
    window.setTimeout(() => document.getElementById('exp-comparison-scene')?.scrollIntoView({ behavior: 'auto', block: 'start' }), 0);
  }
  function inspectEvidence(recordId: string) {
    const event = result?.events.find(item => item.code === 'RECORD_DELIVERED' && item.recordId === recordId);
    if (!event) return;
    setSelectedEvidenceRecordId(recordId);
    setTimeS(event.timeS); setEventId(event.id); setSegment('ground'); setInspectSubsystem('communications'); setPlaying(false); setPhase('operations');
    setNotice(`Entrega de ${recordId}. A cena destaca o rádio; os cartões em solo conservam o mesmo identificador do arquivo científico.`);
    heading.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
  function designFile() { return JSON.stringify({ format: FORMAT, expeditionId: id, config, hypothesis }, null, 2); }
  function saveDesign() {
    try { localStorage.setItem(`ipe:expedition:${id}`, designFile()); setNotice('Projeto salvo neste navegador.'); }
    catch { setNotice('Não foi possível salvar no navegador. Você pode exportar o projeto.'); }
  }
  function restore(text: string) {
    try { const draft = readDesign(text, id); setConfig({ ...draft.config }); setHypothesis(draft.hypothesis); crew.setSize(1); setPhase('design'); setNotice('Projeto carregado. Revise e execute para obter um novo resultado.'); }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Projeto não importado.'); }
  }
  const choiceLabel = (key: keyof ExpeditionConfig, value: string) => choices[key].find(choice => choice.id === value)?.label ?? value;

  return <div className="scientific-expedition">
    <div className="expedition-heading"><div><p className="eyebrow">CASO {id === 'bennu' ? '02 · GEOLOGIA PLANETÁRIA' : '03 · ASTRONOMIA'}</p><h1 ref={heading} tabIndex={-1}>{mission.title}</h1><p>{mission.objective}</p></div><button className="button button-secondary" type="button" onClick={onBack}><Icon name="back" size={17} /> Escolher outra missão</button></div>
    <nav className="expedition-steps" aria-label="Engenharia de sistemas da missão">{PHASES.map((item, index) => <button key={item.id} type="button" aria-current={phase === item.id ? 'step' : undefined} disabled={(item.id === 'operations' || item.id === 'return') && !result} onClick={() => { setPhase(item.id); setPlaying(false); }}><span>0{index + 1} · </span>{item.label}</button>)}</nav>
    {notice ? <p className="expedition-notice" role="status">{notice}</p> : null}
    {phase === 'need' ? <section className="expedition-section"><p className="eyebrow">01 / PARTIR DA NECESSIDADE CIENTÍFICA</p><h2>A pergunta orienta todas as decisões.</h2><MissionPurpose id={id} /><MissionStory id={id} /><MissionExperiment id={id} onApply={trial => { if (trial.kind !== 'expedition') return; setConfig({ ...trial.result.config }); setPhase('design'); setNotice('Escolhas do ensaio copiadas. Revise, registre sua hipótese e execute sua própria tentativa.'); }} /><Scene world={id} expeditionConfig={config} segment="user" scienceRecordCount={6} /><div className="expedition-notice"><strong>Origem e limites.</strong> {mission.dataNotice} A operação começa depois da chegada ao destino. Lançamento e órbita são escolhas de arquitetura verificadas por regras didáticas; não calculamos uma trajetória real.</div><div className="expedition-actions"><button className="button button-primary" type="button" onClick={() => setPhase('requirements')}>Definir esta missão científica <Icon name="arrow" /></button></div></section> : null}
    {phase === 'requirements' ? <section className="expedition-section"><p className="eyebrow">02 / CONVERTER A PERGUNTA EM CRITÉRIOS</p><h2>O que precisa ser demonstrado?</h2><p>A equipe precisa entregar seis registros completos e cientificamente compatíveis, respeitando massa, orçamento, energia, memória e duração. Uma condição atendida não compensa outra violada.</p><div className="expedition-requirements">{SEGMENTS.map(item => <article key={item.id}><p className="eyebrow">{item.label}</p><h3>{item.id === 'user' ? 'Evidência adequada' : item.id === 'launch' ? 'Acesso compatível' : item.id === 'space' ? 'Operação sustentável' : 'Dados recebidos'}</h3><p>{mission.requirements[item.id]}</p></article>)}</div><p className="expedition-notice">O processo segue necessidade → requisitos → projeto → verificação → operação → interpretação. A revisão é inspirada em engenharia de sistemas e estudos de alternativas da NASA; não atribui um nível CML oficial ao projeto.</p><button className="button button-primary" type="button" onClick={() => setPhase('design')}>Projetar a arquitetura <Icon name="arrow" /></button></section> : null}
    {phase === 'design' || phase === 'verify' ? <>
      {phase === 'design' ? <section className="expedition-section"><p className="eyebrow">03 / FAZER CONCESSÕES CONSCIENTES</p><h2>Seis escolhas que precisam funcionar juntas.</h2><div className="expedition-design"><div className="expedition-controls">{KEYS.map(key => <label key={key} htmlFor={`exp-${key}`}>{LABELS[key]}<select className="expedition-select" id={`exp-${key}`} value={config[key]} onChange={event => choose(key, event.target.value)}>{choices[key].map(choice => <option key={choice.id} value={choice.id}>{choice.label}</option>)}</select><span>{choices[key].find(choice => choice.id === config[key])?.detail}</span></label>)}</div><Scene world={id} expeditionConfig={config} variant="hangar" segment="launch" scienceRecordCount={6} /></div></section> : <section className="expedition-section"><p className="eyebrow">04 / VERIFICAR ANTES DE OPERAR</p><h2>O projeto responde aos requisitos?</h2><p>Esta revisão verifica o envelope e as escolhas da configuração. A execução ainda precisa demonstrar energia, recepção e prazo.</p></section>}
      <div className="expedition-totals"><div><span>Massa / capacidade de lançamento</span><strong>{number(preflight.totals.massKg)} / {number(preflight.totals.maxMassKg)} kg</strong></div><div><span>Orçamento</span><strong>{preflight.totals.credits} / {preflight.totals.budget} créditos</strong></div><div><span>Energia armazenável</span><strong>{number(preflight.totals.capacityWh)} Wh</strong></div><div><span>Memória</span><strong>{bits(preflight.totals.bufferBits)}</strong></div></div>
      <Conditions constraints={preflight.constraints} />
      <div className="expedition-draft-tools"><button className="text-button" type="button" onClick={saveDesign}>Salvar projeto</button><button className="text-button" type="button" onClick={() => { try { const text = localStorage.getItem(`ipe:expedition:${id}`); if (text) restore(text); else setNotice('Não há projeto salvo para este caso.'); } catch { setNotice('O armazenamento não está disponível.'); } }}>Restaurar projeto salvo</button><button className="text-button" type="button" onClick={() => downloadText(designFile(), `ipe-${id}-projeto.json`)}>Exportar projeto</button><button className="text-button" type="button" onClick={() => input.current?.click()}>Importar projeto</button></div>
      {phase === 'design' ? <button className="button button-primary" type="button" onClick={() => setPhase('verify')}>Revisar para executar <Icon name="arrow" /></button> : <><label className="expedition-hypothesis" htmlFor="exp-hypothesis">Hipótese da equipe<textarea id="exp-hypothesis" value={hypothesis} onChange={event => setHypothesis(event.target.value)} rows={3} maxLength={1500} placeholder="Esperamos que… porque… O recurso mais crítico será…" /><span>Explique sua previsão em pelo menos 8 caracteres. Ela será preservada com a tentativa.</span></label><CrewReview crew={crew} /><div className="expedition-actions"><button className="button button-secondary" type="button" onClick={() => setPhase('design')}>Rever escolhas</button><button className="button button-primary" type="button" disabled={hypothesis.trim().length < 8 || !crew.ready} onClick={execute}>Executar missão científica <Icon name="arrow" /></button></div><p className="field-help">Projetos incompatíveis podem ser verificados pelo motor. Receber seis registros só constitui sucesso se todos os requisitos forem atendidos.</p></>}
    </> : null}
    {phase === 'operations' && result && visual ? <section className="expedition-section"><p className="eyebrow">05 / EXECUÇÃO REGISTRADA · TENTATIVA {attempts.length}</p><h2>Uma decisão deixa um rastro.</h2><p>{draftMatches ? 'A configuração executada está preservada.' : 'Você editou o projeto depois desta tentativa. Esta cena apresenta a configuração antiga; execute novamente para avaliar a nova.'} O resultado final é <strong>{result.outcome === 'success' ? 'missão cumprida' : result.outcome === 'invalid' ? 'projeto incompatível' : 'missão não cumprida'}</strong>. Volte aos eventos para investigar.</p><MissionSegments selected={segment} onSelect={setSegment} /><div id="exp-operation-scene"><Scene world={id} expeditionConfig={result.config} segment={segment} inspectSubsystem={inspectSubsystem} visualState={visual} scienceRecordCount={result.requiredRecords} /></div><div className="expedition-timeline"><label htmlFor="exp-time">Instante da missão · T+{time(timeS)} · amostra T+{time(visual.sourceStateTimeS ?? 0)}</label><input id="exp-time" type="range" min={0} max={result.horizonS} step={1} value={timeS} onChange={event => { setTimeS(Number(event.target.value)); setEventId(undefined); setInspectSubsystem(undefined); setPlaying(false); }} /><div className="expedition-actions"><button className="button button-secondary" type="button" onClick={() => { if (timeS >= result.completedAtS) setTimeS(0); setInspectSubsystem(undefined); setEventId(undefined); setPlaying(!playing); }}>{playing ? 'Pausar estados registrados' : 'Reproduzir estados registrados'}</button><button className="text-button" type="button" onClick={() => { setTimeS(result.completedAtS); setPlaying(false); setEventId(undefined); setInspectSubsystem(undefined); }}>Ir ao estado final</button></div></div><div className="expedition-readout"><div><span>Energia neste estado</span><strong>{number(visual.energyWh ?? 0)} Wh</strong></div><div><span>Memória ocupada</span><strong>{bits(visual.queueBits ?? 0)}</strong></div><div><span>Dados recebidos</span><strong>{bits(visual.downlinkedBits ?? 0)}</strong></div><div><span>Registros válidos disponíveis</span><strong>{visual.deliveredRecordIds.length} / {result.requiredRecords}</strong></div></div><p className="expedition-notice">Valores mantidos até a próxima amostra, sem interpolação. A posição 3D é conceitual; os estados de recursos vêm do cálculo didático. A DSN aparece como referência de engenharia, não como reserva real de antena.</p><ExpeditionEvidenceTrail selectedRecordId={selectedEvidenceRecordId} onSelectRecord={setSelectedEvidenceRecordId} result={result} timeS={timeS} onInspect={inspectTrace} /><ArchivedEvidence result={result} timeS={timeS} onInspect={inspectEvidence} /><h3>Inspecione um evento</h3><div className="expedition-events" aria-label="Eventos da missão científica">{result.events.map(event => <button key={event.id} type="button" className={`severity-${event.severity}`} aria-pressed={eventId === event.id} onClick={() => { setTimeS(event.timeS); setEventId(event.id); if (event.recordId) setSelectedEvidenceRecordId(event.recordId); setInspectSubsystem(inspectionForEvent(event).subsystem); setSegment(inspectionForEvent(event).segment); setPlaying(false); }}><small>T+{time(event.timeS)}</small><span>{event.message}</span></button>)}</div>{visual.eventsAtTime.length ? <div className="stage-context" aria-live="polite"><strong>Eventos neste mesmo instante</strong><ul>{visual.eventsAtTime.map(event => <li key={event.id}>{event.message}</li>)}</ul></div> : null}<div className="expedition-actions"><button className="button button-primary" type="button" onClick={() => { setPhase('return'); setPlaying(false); }}>Interpretar o retorno científico <Icon name="arrow" /></button><button className="button button-secondary" type="button" onClick={() => { setPhase('design'); setPlaying(false); }}>Redesenhar esta missão</button></div></section> : null}
    {phase === 'return' && result && current ? <section className="expedition-section"><p className="eyebrow">06 / O SEGMENTO DE USUÁRIOS RECEBE A EVIDÊNCIA</p><h2>{result.deliveredRecords} de {result.requiredRecords} registros válidos.</h2><p>{mission.dataNotice} O quadro apresenta somente valores dos registros completos e compatíveis recebidos no resultado final. Um registro ausente não é preenchido pelo arquivo público.</p><ExpeditionEvidenceTrail selectedRecordId={selectedEvidenceRecordId} onSelectRecord={setSelectedEvidenceRecordId} result={result} timeS={result.completedAtS} onInspect={inspectTrace} /><ArchivedEvidence result={result} timeS={result.completedAtS} onInspect={inspectEvidence} /><Conditions constraints={result.constraints} /><MissionReflection id={id} valid={result.deliveredRecords} required={result.requiredRecords} /><div className="stage-context"><strong>A hipótese desta tentativa</strong><p>{current.hypothesis}</p><p>{current.crewSize === 1 ? 'Revisão individual.' : `${current.crewSize} participantes locais; ${current.reviewedRoles.length} papéis revisaram a configuração antes de executar.`}</p></div><ExpeditionRoleDebrief result={result} answers={debrief} onChange={setDebrief} onInspect={inspectTrace} /><label className="expedition-hypothesis" htmlFor="exp-reflection">Sua análise pós-missão<textarea id="exp-reflection" rows={3} maxLength={2000} value={reflection} onChange={event => setReflection(event.target.value)} placeholder="Qual requisito limitou a missão? Qual evento sustenta essa explicação? O que mudaria primeiro?" /></label><div className="expedition-actions"><button className="button button-primary" type="button" onClick={() => { setPhase('design'); setHypothesis(''); }}>Criar uma nova tentativa <Icon name="arrow" /></button><button className="button button-secondary" type="button" onClick={() => downloadText(JSON.stringify({ format: 'ipe-scientific-report-v2', expeditionId: id, hypothesis: current.hypothesis, reflection, fourRoleDebrief: debrief, crewSize: current.crewSize, reviewedRoles: current.reviewedRoles, result, sources: mission.origins, dataNotice: mission.dataNotice }, null, 2), `ipe-${id}-relatorio.json`)}>Exportar relatório da missão</button></div><p className="expedition-notice">{id === 'telescope' ? 'Este exercício não realiza uma nova detecção de CO₂, água ou vida. Os seis bins ilustram uma observação publicada; interpretar a atmosfera exige o estudo completo e modelos além deste jogo.' : 'Este exercício não escolhe um local real de pouso nem certifica um mapa de Bennu. O objetivo é entregar dimensões publicadas coerentes com a pergunta; os recursos e a operação permanecem didáticos.'}</p></section> : null}
    {earlier && current && comparison && (phase === 'return' || phase === 'operations') ? <section className="expedition-compare" aria-labelledby="exp-compare-title"><p className="eyebrow">REDESIGN COM EVIDÊNCIA</p><h2 id="exp-compare-title">Duas tentativas, o mesmo relógio.</h2><p>Compare as duas últimas execuções. Mudanças simultâneas não isolam uma causa; duração ou órbita diferentes também alteram o contexto.</p><ExpeditionComparisonExplanation a={earlier.result} b={current.result} onInspect={inspectComparison} /><div className="expedition-actions"><button type="button" className="button button-secondary" aria-pressed={compareSide === 'a'} onClick={() => { setCompareSide('a'); setCompareEventId(undefined); setCompareInspection(undefined); }}>Ver tentativa A</button><button type="button" className="button button-secondary" aria-pressed={compareSide === 'b'} onClick={() => { setCompareSide('b'); setCompareEventId(undefined); setCompareInspection(undefined); }}>Ver tentativa B</button></div><label htmlFor="exp-compare-time">Tempo comum · T+{time(compareTime)}<input id="exp-compare-time" type="range" min={0} max={compareHorizon} step={1} value={compareTime} onChange={event => { setCompareTime(Number(event.target.value)); setCompareEventId(undefined); setCompareInspection(undefined); }} /></label><div id="exp-comparison-scene"><Scene world={id} expeditionConfig={comparison.result.config} segment={compareSegment} inspectSubsystem={compareInspection} visualState={getExpeditionVisualState(comparison.result, Math.min(compareTime, comparison.result.completedAtS), compareEventId)} scienceRecordCount={comparison.result.requiredRecords} /></div><p>Após o encerramento de uma tentativa, sua vista conserva o estado final. O tempo é comparado em segundos, nunca pelo índice das amostras.</p><div className="table-scroll"><table className="source-table"><caption>Escolhas e retorno das duas últimas tentativas</caption><thead><tr><th scope="col">Indicador</th><th scope="col">A</th><th scope="col">B</th></tr></thead><tbody>{KEYS.map(key => <tr key={key}><th scope="row">{LABELS[key]}</th><td>{choiceLabel(key, earlier.result.config[key])}</td><td>{choiceLabel(key, current.result.config[key])}</td></tr>)}<tr><th scope="row">Registros válidos no final</th><td>{earlier.result.deliveredRecords} / 6</td><td>{current.result.deliveredRecords} / 6</td></tr><tr><th scope="row">Resultado final</th><td>{earlier.result.outcome}</td><td>{current.result.outcome}</td></tr></tbody></table></div></section> : null}
    <nav className="expedition-sources" aria-label="Fontes científicas e de engenharia">{mission.origins.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>)}<a href="../docs/30-ATIVOS-NASA-IMPLEMENTADOS.html" target="_blank" rel="noreferrer">Créditos dos modelos 3D ↗</a></nav>
    <input className="sr-only" ref={input} type="file" accept="application/json,.json" tabIndex={-1} aria-hidden="true" onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; if (!file) return; if (file.size > 16_000) { setNotice('Projeto excede 16 KB.'); return; } void file.text().then(restore).catch(() => setNotice('Não foi possível ler o projeto.')); }} />
  </div>;
}
