import { MissionScoreSummary, usePlayerMetrics } from './PlayerMetrics.tsx';
import { summarizeAttempt } from '../metrics/player-metrics.ts';
import { scoreMissionResult } from '../metrics/mission-score.ts';
import { ExpeditionEvidenceTrail, ExpeditionRoleDebrief, emptyExpeditionDebrief, inspectionForEvent } from './ExpeditionLearning.tsx';
import type { EvidenceInspection, EvidenceStep } from './ExpeditionLearning.tsx';
import type { SpacecraftInspection } from '../lab/spacecraft-presentation.ts';
import { ArchivedEvidence } from './ArchivedEvidence.tsx';
import { useEffect, useRef, useState } from 'react';
import { DEFAULT_EXPEDITION_CONFIGS, EXPEDITIONS, getExpeditionChoices, getExpeditionPreflight, getExpeditionVisualState, simulateExpedition } from '../lab/scientific-expeditions.ts';
import type { ExpeditionConfig, ExpeditionId, ExpeditionResult } from '../lab/scientific-expeditions.ts';
import { Scene } from './Scene.tsx';
import { ScientificCommand, ScientificFlightPath, focusCockpitSection } from './ScientificCockpit.tsx';
import { ExpeditionWorkbench } from './ExpeditionWorkbench.tsx';
import { ExpeditionComparison } from './ExpeditionComparison.tsx';
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
const SEGMENTS = [{ id: 'user', label: 'Usuários científicos' }, { id: 'launch', label: 'Lançamento' }, { id: 'space', label: 'Segmento espacial' }, { id: 'ground', label: 'Segmento terrestre' }] as const;
const FORMAT = 'ipe-scientific-design-v2';
const PHASE_GUIDANCE: Record<Phase, string> = {
  need: 'Comece pela pergunta científica e leia a origem dos registros. Os dados são históricos; a nave e os recursos do exercício são didáticos.',
  requirements: 'Transforme a pergunta em requisitos dos quatro segmentos: lançamento, nave, solo e usuários científicos. Uma condição atendida não compensa outra violada.',
  design: 'Na bancada, escolha um sistema, compare as opções e observe a peça destacada e os recursos. A seleção não executa a missão.',
  verify: 'Confira massa, orçamento, compatibilidade e os papéis da equipe. Registre uma previsão antes de executar. O texto da sua hipótese permanece privado.',
  operations: 'A missão já foi calculada. O replay mostra somente os estados disponíveis no instante escolhido. O resultado final é apresentado separadamente.',
  return: 'Interprete apenas os registros completos e compatíveis recebidos. Relacione o requisito, a escolha e o evento. Os valores científicos publicados não mudam com o projeto.',
};
const EVENT_GUIDANCE: Readonly<Record<string, string>> = {
  MISSION_START: 'Início da operação didática depois da chegada.', JOB_START: 'O instrumento começa a processar um registro.', JOB_COMPLETE: 'O processamento de um registro foi concluído.',
  CONTACT_START: 'Uma janela de comunicação começa.', CONTACT_END: 'A janela de comunicação terminou.', RECORD_DELIVERED: 'Um pacote completo chegou ao solo; sua validade depende do instrumento e do requisito.',
  SUNLIGHT_START: 'A nave entra no período iluminado.', SUNLIGHT_END: 'Começa um eclipse previsto; a bateria sustenta a carga.', BUFFER_OVERFLOW: 'A memória não comportou um novo registro completo.',
  PEAK_POWER: 'A potência exigida superou a descarga disponível.', ENERGY_DEPLETED: 'A energia disponível não sustenta a operação.', INSTRUMENT_MISMATCH: 'O instrumento não atende à pergunta científica.',
  MASS_LIMIT: 'A massa ultrapassa a capacidade de lançamento.', BUDGET_LIMIT: 'O projeto excede o orçamento.', LAUNCH_PROFILE: 'O lançador não atende ao perfil escolhido.',
  MISSION_END: 'A operação foi encerrada; confira o retorno científico e as restrições.',
};

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
  return <ul className="expedition-constraints">{constraints.map(condition => (
    <li className={condition.met ? '' : 'unmet'} key={condition.id}>
      <strong>{condition.met ? 'Atendido' : 'Revisar'}</strong>
      <span>{condition.label}</span>
      {condition.unit === 'compatibilidade' ? null : <span>{number(condition.measured)} / {number(condition.limit)} {condition.unit}</span>}
    </li>
  ))}</ul>;
}

export function ScientificExpedition({ id, onBack }: { id: ExpeditionId; onBack: () => void }) {
  const metrics = usePlayerMetrics();
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
  const [selectedEvidenceStep, setSelectedEvidenceStep] = useState<EvidenceStep>('question');
  const input = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const hypothesisControl = useRef<HTMLTextAreaElement>(null);
  const launchControl = useRef<HTMLButtonElement>(null);
  const crewChecks = useRef<HTMLDivElement>(null);
  const comparison = useRef<HTMLDivElement>(null);
  const crew = useCrewReview(JSON.stringify({ config, hypothesis }));
  const preflight = getExpeditionPreflight(id, config);
  const hypothesisReady = hypothesis.trim().length >= 8;
  const reviewCount = preflight.constraints.filter(item => !item.met).length;
  const checklistStatus = reviewCount === 0 ? 'Os requisitos estáticos estão atendidos.'
    : reviewCount === 1 ? '1 requisito a revisar.' : `${reviewCount} requisitos a revisar.`;
  const current = attempts.at(-1);
  const result = current?.result;
  const receivedRecords = result?.observations.filter(record => record.deliveredAtS !== null).length ?? 0;
  const outcomeLabel = result?.outcome === 'success' ? 'Missão cumprida' : result?.outcome === 'invalid' ? 'Projeto incompatível' : 'Missão não cumprida';
  const editingProject = phase === 'design' || phase === 'verify';
  const draftKey = `ipe:expedition:${id}:${metrics.session?.sessionId ?? 'standalone'}`;
  const draftMatches = result ? JSON.stringify(result.config) === JSON.stringify(config) : false;
  const visual = result ? getExpeditionVisualState(result, timeS, eventId) : undefined;
  const earlier = attempts.at(-2);
  const eventAtCursor = visual?.eventsAtTime.find(item => item.id === eventId && item.timeS <= timeS) ?? visual?.eventsAtTime.find(item => item.timeS === timeS);
  const librasContext = `${mission.title}. Etapa: ${PHASES.find(item => item.id === phase)!.label}. ${PHASE_GUIDANCE[phase]} ${phase === 'operations' && visual ? `Instante do replay: ${number(visual.timeS)} segundos. Registros válidos disponíveis: ${visual.deliveredRecordIds.length} de seis. ${visual.energyWh === null ? 'Sem estado de energia registrado.' : `Energia neste estado: ${number(visual.energyWh)} watt-hora.`} ${eventAtCursor ? `Evento neste instante: ${EVENT_GUIDANCE[eventAtCursor.code] ?? 'Condição registrada pelo motor.'}` : 'Nenhum evento selecionado neste instante.'}` : phase === 'return' && result ? `Resultado final: ${result.deliveredRecords} de seis registros válidos. Chegaram ao solo ${receivedRecords} registros. ${result.outcome === 'success' ? 'Todos os critérios da missão foram atendidos.' : 'Há requisitos não atendidos; use o diário para justificar a próxima decisão.'}` : mission.objective}`.slice(0, 900);


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
    if (config[key] === value || !choices[key].some(item => item.id === value)) return;
    metrics.track('decision', id, { key, from: config[key], to: value });
    setConfig(previous => ({ ...previous, [key]: value })); setPlaying(false);
    setNotice('');
  }
  function execute() {
    if (!hypothesisReady || !crew.ready) return;
    const next = simulateExpedition(id, config);
    metrics.track('attempt', id, { attemptId: crypto.randomUUID(), status: 'completed', config: { ...config } }, summarizeAttempt(next));
    setAttempts(previous => [...previous, { result: next, hypothesis: hypothesis.trim(), crewSize: crew.size, reviewedRoles: [...crew.roles] }]);
    setDebrief(emptyExpeditionDebrief()); setInspectSubsystem(undefined); setSelectedEvidenceRecordId(undefined); setSelectedEvidenceStep('question');
    setTimeS(0); setEventId(undefined); setSegment('space'); setPlaying(false); setReflection(''); setPhase('operations'); setNotice(metrics.session ? 'Consulte o resumo desta tentativa em Meu progresso.' : '');
  }
  function inspectTrace(inspection: EvidenceInspection) {
    const event = result?.events.find(item => item.id === inspection.eventId);
    if (!event) return;
    metrics.track('inspection', id, { target: 'evidence', eventId: event.id });
    if (inspection.recordId ?? event.recordId) setSelectedEvidenceRecordId(inspection.recordId ?? event.recordId);
    setSelectedEvidenceStep(inspection.step ?? (/CONTACT|DELIVERED|QUEUE/.test(event.code) ? 'delivery' : /JOB|BUFFER/.test(event.code) ? 'record' : 'requirement'));
    setTimeS(event.timeS); setEventId(event.id); setSegment(inspection.segment); setInspectSubsystem(inspection.subsystem); setPlaying(false); setPhase('operations');
    setNotice(`T+${time(event.timeS)} · ${event.message}${event.recordId ? ` · ${event.recordId}` : ''}. A trilha, o relógio e a cena usam o mesmo evento.`);
    window.setTimeout(() => document.getElementById('exp-operation-scene')?.scrollIntoView({ behavior: 'auto', block: 'start' }), 0);
  }
  function inspectEvidence(recordId: string) {
    const event = result?.events.find(item => item.code === 'RECORD_DELIVERED' && item.recordId === recordId);
    if (!event) return;
    metrics.track('inspection', id, { target: 'evidence', eventId: event.id });
    setSelectedEvidenceRecordId(recordId); setSelectedEvidenceStep('delivery');
    setTimeS(event.timeS); setEventId(event.id); setSegment('ground'); setInspectSubsystem('communications'); setPlaying(false); setPhase('operations');
    setNotice(`Entrega de ${recordId}. A cena destaca o rádio; os cartões em solo conservam o mesmo identificador do arquivo científico.`);
    heading.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
  function designFile() { return JSON.stringify({ format: FORMAT, expeditionId: id, config, hypothesis }, null, 2); }
  function saveDesign() {
    try {
      localStorage.setItem(draftKey, designFile());
      setNotice('Configuração e hipótese salvas neste navegador. Use Restaurar projeto salvo para reabrir.');
    }
    catch { setNotice('Não foi possível salvar no navegador. Você pode exportar o projeto.'); }
  }
  function restore(text: string) {
    try { const draft = readDesign(text, id); setConfig({ ...draft.config }); setHypothesis(draft.hypothesis); crew.setSize(1); setPhase('design'); setNotice('Projeto carregado. Revise e execute para obter um novo resultado.'); }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Projeto não importado.'); }
  }
  function restoreSavedProject() {
    try {
      const text = localStorage.getItem(draftKey);
      if (text) restore(text);
      else setNotice('Salve um projeto desta missão para poder restaurá-lo aqui.');
    } catch {
      setNotice('Não foi possível acessar o projeto salvo. Se você tem o arquivo, use Importar projeto.');
    }
  }

  function selectPhase(next: Phase) {
    setPhase(next);
    setPlaying(false);
  }
  function focusFlightCheck() {
    if (!hypothesisReady) focusCockpitSection(hypothesisControl.current);
    else if (!crew.ready) focusCockpitSection(crewChecks.current?.querySelector('input:not(:checked)') ?? null);
    else focusCockpitSection(launchControl.current);
  }
  function newAttempt() {
    selectPhase('design');
    setHypothesis('');
  }
  const comparisonAction = earlier && current ? <button className="text-button" type="button" onClick={() => focusCockpitSection(comparison.current)}>Abrir comparação A/B <Icon name="layers" size={16} /></button> : null;

  return <div className="scientific-expedition scientific-cockpit" data-ipe-libras-context={librasContext}>
    <div className="expedition-heading">
      <div><h1 ref={heading} tabIndex={-1}>{mission.title}</h1><p>{mission.objective}</p></div>
      <button className="button button-secondary" type="button" onClick={onBack}><Icon name="back" size={17} /> Escolher outra missão</button>
    </div>
    <ScientificFlightPath stages={PHASES} current={phase} onSelect={selectPhase} label="Engenharia de sistemas da missão" unavailable={step => (step === 'operations' || step === 'return') && !result} />
    {phase === 'need' ? <ScientificCommand title="Briefing científico" detail="Entregue seis registros completos e compatíveis com a pergunta da missão.">
      <button className="button button-primary" type="button" onClick={() => selectPhase('requirements')}>Definir esta missão científica <Icon name="arrow" /></button>
    </ScientificCommand> : null}
    {phase === 'requirements' ? <ScientificCommand title="Quatro segmentos, um objetivo" detail="Confira o que o lançamento, a nave, o solo e os usuários precisam demonstrar.">
      <button className="button button-primary" type="button" onClick={() => selectPhase('design')}>Projetar a arquitetura <Icon name="arrow" /></button>
    </ScientificCommand> : null}
    {phase === 'design' ? <ScientificCommand title="Montagem em edição" detail={`Selecione um sistema e compare os efeitos na nave. ${checklistStatus}`}>
      <button className="button button-primary" type="button" onClick={() => selectPhase('verify')}>Revisar para executar <Icon name="arrow" /></button>
    </ScientificCommand> : null}
    {phase === 'verify' ? <ScientificCommand
      title={!hypothesisReady ? 'Previsão pendente' : !crew.ready ? `${4 - crew.roles.length} revisões da equipe pendentes` : reviewCount > 0 ? checklistStatus : 'Pronto para executar'}
      detail={!hypothesisReady ? `Escreva o que você espera da operação. ${checklistStatus}` : !crew.ready ? checklistStatus : 'O motor verifica energia, memória e entrega durante a operação.'}
    >
      <button className="button button-primary" type="button" onClick={focusFlightCheck}>{!hypothesisReady ? 'Ir à hipótese' : !crew.ready ? 'Revisar com a equipe' : 'Ir à confirmação'} <Icon name="arrow" /></button>
      <button className="text-button" type="button" onClick={() => selectPhase('design')}>Rever escolhas</button>
    </ScientificCommand> : null}
    {phase === 'operations' && result ? <ScientificCommand title="Replay da operação" detail="A operação registrada começa após a chegada ao destino. Examine o relógio ou siga para o resultado final.">
      <button className="button button-primary" type="button" onClick={() => selectPhase('return')}>Interpretar o retorno científico <Icon name="arrow" /></button>
      <button className="text-button" type="button" onClick={() => selectPhase('design')}>Redesenhar esta missão</button>
      {comparisonAction}
    </ScientificCommand> : null}
    {phase === 'return' && result ? <ScientificCommand title="Relatório da tentativa concluída" detail="Interprete a evidência recebida e use o diário para decidir o que mudar.">
      <button className="button button-primary" type="button" onClick={newAttempt}>Criar uma nova tentativa <Icon name="arrow" /></button>
      {comparisonAction}
    </ScientificCommand> : null}

    {!editingProject && notice ? <p className="expedition-notice" role="status">{notice}</p> : null}
    {phase === 'need' ? <section className="expedition-section">
      <div className="expedition-brief-deck">
        <div className="scientific-cockpit-viewport"><Scene compact world={id} expeditionConfig={config} segment="user" scienceRecordCount={6} /></div>
        <div>
          <p className="expedition-notice"><strong>Origem e limites.</strong> {mission.dataNotice} A operação começa depois da chegada ao destino. Lançamento e órbita são verificados por regras didáticas de arquitetura.</p>
          <p className="expedition-first-terms">{id === 'bennu' ? 'Clasto significa fragmento de rocha. O eixo maior é a maior dimensão medida.' : 'Cada bin é uma pequena faixa de comprimento de onda. O espectro mostra quanta luz da estrela foi bloqueada em cada faixa.'}</p>
        </div>
      </div>
      <MissionPurpose id={id} />
      <MissionStory id={id} />
      <MissionExperiment id={id} onApply={trial => { if (trial.kind !== 'expedition') return; setConfig({ ...trial.result.config }); selectPhase('design'); setNotice('Escolhas do ensaio copiadas. Revise, registre sua hipótese e execute sua própria tentativa.'); }} />
    </section> : null}
    {phase === 'requirements' ? <section className="expedition-section">
      <h2>O que precisa ser demonstrado?</h2>
      <p>A equipe precisa entregar seis registros completos e cientificamente compatíveis, respeitando massa, orçamento, energia, memória e duração. Uma condição atendida não compensa outra violada.</p>
      <div className="expedition-requirements">{SEGMENTS.map(item => <article key={item.id}><p className="eyebrow">{item.label}</p><h3>{item.id === 'user' ? 'Evidência adequada' : item.id === 'launch' ? 'Acesso compatível' : item.id === 'space' ? 'Operação sustentável' : 'Dados recebidos'}</h3><p>{mission.requirements[item.id]}</p></article>)}</div>
      <p className="expedition-notice">A revisão é inspirada em engenharia de sistemas e estudos de alternativas da NASA. O nível CML oficial pertence ao processo de desenvolvimento de missões da agência.</p>
    </section> : null}
    {editingProject ? <>
      {phase === 'design' ? <section className="expedition-section">
        <h2 className="sr-only">Montagem da nave</h2>
        <ExpeditionWorkbench id={id} config={config} onChoice={choose} />
      </section> : <section className="expedition-section">
        <h2>Checagem de lançamento</h2>
        <p>O envelope mostra a integração da nave com o lançador selecionado. O relógio da operação começa após a chegada ao destino.</p>
        <div className="expedition-brief-deck">
          <div className="scientific-cockpit-viewport"><Scene compact world={id} expeditionConfig={config} variant="hangar" segment="launch" /></div>
          <div>
            <div className="expedition-totals"><div><span>Massa / capacidade de lançamento</span><strong>{number(preflight.totals.massKg)} / {number(preflight.totals.maxMassKg)} kg</strong></div><div><span>Orçamento</span><strong>{preflight.totals.credits} / {preflight.totals.budget} créditos</strong></div><div><span>Energia armazenável</span><strong>{number(preflight.totals.capacityWh)} Wh</strong></div><div><span>Memória</span><strong>{bits(preflight.totals.bufferBits)}</strong></div></div>
            <Conditions constraints={preflight.constraints} />
          </div>
        </div>
        <label className="expedition-hypothesis" htmlFor="exp-hypothesis">Hipótese da equipe<textarea id="exp-hypothesis" className="scientific-focus-target" ref={hypothesisControl} value={hypothesis} onChange={event => { setHypothesis(event.target.value); setNotice(''); }} rows={3} maxLength={1500} placeholder="Esperamos que… porque… O recurso mais crítico será…" /><span>Escreva pelo menos 8 caracteres. A hipótese aparece no relatório desta tentativa.</span></label>
        <div ref={crewChecks}><CrewReview crew={crew} /></div>
        <div className="expedition-actions"><button className="button button-primary scientific-focus-target" type="button" ref={launchControl} disabled={!hypothesisReady || !crew.ready} onClick={execute}>Executar missão científica <Icon name="arrow" /></button></div>
        <p className="field-help">O motor também verifica projetos incompatíveis. Receber seis registros constitui sucesso somente se todos os requisitos forem atendidos.</p>
      </section>}
      {phase === 'design' ? <details className="game-brief-disclosure"><summary>Ver requisitos da configuração</summary><Conditions constraints={preflight.constraints} /></details> : null}
      <div className="expedition-draft-tools" role="group" aria-label="Rascunho do projeto">
        <button className="text-button" type="button" onClick={saveDesign}>Salvar projeto</button>
        <button className="text-button" type="button" onClick={restoreSavedProject}>Restaurar projeto salvo</button>
        <button className="text-button" type="button" onClick={() => downloadText(designFile(), `ipe-${id}-projeto.json`)}>Exportar projeto</button>
        <button className="text-button" type="button" onClick={() => input.current?.click()}>Importar projeto</button>
      </div>
      <p className={notice ? 'expedition-notice' : 'sr-only'} role="status">{notice}</p>
    </> : null}
    {phase === 'operations' && result && visual ? <section className="expedition-section">
      <h2>Operação simulada · tentativa {attempts.length}</h2>
      <p className="expedition-replay-help"><strong>A simulação já terminou.</strong> O relógio começa em T+0 e os recursos na nave acompanham o instante selecionado.</p>
      <div className="expedition-timeline">
        <label htmlFor="exp-time">Instante da missão · T+{time(timeS)} · {visual.sourceStateTimeS === null ? 'sem amostra temporal' : `amostra T+${time(visual.sourceStateTimeS)}`}</label>
        <input id="exp-time" type="range" min={0} max={result.horizonS} step={1} value={timeS} onChange={event => { setTimeS(Number(event.target.value)); setEventId(undefined); setInspectSubsystem(undefined); setPlaying(false); }} />
        <div className="expedition-actions">
          <button className="button button-secondary" type="button" onClick={() => { if (timeS >= result.completedAtS) setTimeS(0); setInspectSubsystem(undefined); setEventId(undefined); setPlaying(!playing); }}>{playing ? 'Pausar estados registrados' : 'Reproduzir estados registrados'}</button>
          <button className="text-button" type="button" onClick={() => { setTimeS(result.completedAtS); setPlaying(false); setEventId(undefined); setInspectSubsystem(undefined); }}>Ir ao estado final</button>
        </div>
      </div>
      <div id="exp-operation-scene" className="scientific-cockpit-viewport scientific-focus-target">
        <Scene compact world={id} expeditionConfig={result.config} segment={segment} inspectSubsystem={inspectSubsystem} visualState={visual} scienceRecordCount={result.requiredRecords} />
      </div>
      <MissionSegments selected={segment} onSelect={setSegment} />
      <div className="expedition-readout">
        <div><span>Energia neste estado</span><strong>{visual.energyWh === null ? '—' : `${number(visual.energyWh)} Wh`}</strong></div>
        <div><span>Memória ocupada</span><strong>{visual.queueBits === null ? '—' : bits(visual.queueBits)}</strong></div>
        <div><span>Dados recebidos</span><strong>{visual.downlinkedBits === null ? '—' : bits(visual.downlinkedBits)}</strong></div>
        <div><span>Registros válidos disponíveis</span><strong>{visual.deliveredRecordIds.length} / {result.requiredRecords}</strong></div>
      </div>
      <p className="expedition-notice">Valores mantidos até a próxima amostra, sem interpolação. A posição 3D é conceitual. A DSN aparece como referência de engenharia.</p>
      <p>{draftMatches ? 'A configuração executada está preservada.' : 'Você editou o projeto depois desta tentativa. O replay preserva a configuração executada.'} Resultado final: <strong>{outcomeLabel}</strong>.</p>
      <MissionScoreSummary score={scoreMissionResult(result)} />
      <ExpeditionEvidenceTrail selectedEventId={eventId} selectedStep={selectedEvidenceStep} onSelectStep={setSelectedEvidenceStep} selectedRecordId={selectedEvidenceRecordId} onSelectRecord={setSelectedEvidenceRecordId} result={result} timeS={timeS} onInspect={inspectTrace} />
      <ArchivedEvidence result={result} timeS={timeS} onInspect={inspectEvidence} />
      <h3>Inspecione um evento</h3>
      <div className="expedition-events" aria-label="Eventos da missão científica">{result.events.map(event => <button key={event.id} type="button" className={`severity-${event.severity}`} aria-pressed={eventId === event.id} onClick={() => { setTimeS(event.timeS); setEventId(event.id); if (event.recordId) setSelectedEvidenceRecordId(event.recordId); setSelectedEvidenceStep(/CONTACT|DELIVERED|QUEUE/.test(event.code) ? 'delivery' : /JOB|BUFFER/.test(event.code) ? 'record' : 'requirement'); setInspectSubsystem(inspectionForEvent(event).subsystem); setSegment(inspectionForEvent(event).segment); setPlaying(false); }}><small>T+{time(event.timeS)}</small><span>{event.message}</span></button>)}</div>
      {visual.eventsAtTime.length ? <div className="stage-context" aria-live="polite"><strong>Eventos neste mesmo instante</strong><ul>{visual.eventsAtTime.map(event => <li key={event.id}>{event.message}</li>)}</ul></div> : null}
    </section> : null}
    {phase === 'return' && result && current ? <section className="expedition-section"><h2>{result.deliveredRecords} de {result.requiredRecords} registros válidos.</h2><p><strong>{outcomeLabel}.</strong> {receivedRecords} de {result.requiredRecords} registros chegaram ao solo.{receivedRecords > result.deliveredRecords ? ' Confira abaixo quais dados respondem à pergunta científica.' : ''}</p><MissionScoreSummary score={scoreMissionResult(result)} /><p>{mission.dataNotice} O quadro apresenta somente valores dos registros completos e compatíveis recebidos no resultado final. Um registro ausente não é preenchido pelo arquivo público.</p><ExpeditionEvidenceTrail selectedEventId={eventId} selectedStep={selectedEvidenceStep} onSelectStep={setSelectedEvidenceStep} selectedRecordId={selectedEvidenceRecordId} onSelectRecord={setSelectedEvidenceRecordId} result={result} timeS={result.completedAtS} onInspect={inspectTrace} /><ArchivedEvidence result={result} timeS={result.completedAtS} onInspect={inspectEvidence} /><Conditions constraints={result.constraints} /><MissionReflection id={id} valid={result.deliveredRecords} required={result.requiredRecords} /><div className="stage-context"><strong>A hipótese desta tentativa</strong><p>{current.hypothesis}</p><p>{current.crewSize === 1 ? 'Revisão individual.' : `${current.crewSize} participantes locais; ${current.reviewedRoles.length} papéis revisaram a configuração antes de executar.`}</p></div><ExpeditionRoleDebrief result={result} answers={debrief} onChange={setDebrief} onInspect={inspectTrace} /><label className="expedition-hypothesis" htmlFor="exp-reflection">Sua análise pós-missão<textarea id="exp-reflection" rows={3} maxLength={2000} value={reflection} onChange={event => setReflection(event.target.value)} placeholder="Qual requisito limitou a missão? Qual evento sustenta essa explicação? O que mudaria primeiro?" /></label><div className="expedition-actions"><button className="button button-secondary" type="button" onClick={() => downloadText(JSON.stringify({ format: 'ipe-scientific-report-v2', expeditionId: id, hypothesis: current.hypothesis, reflection, fourRoleDebrief: debrief, crewSize: current.crewSize, reviewedRoles: current.reviewedRoles, result, sources: mission.origins, dataNotice: mission.dataNotice }, null, 2), `ipe-${id}-relatorio.json`)}>Exportar relatório da missão</button></div><p className="expedition-notice">{id === 'telescope' ? 'Este exercício não realiza uma nova detecção de CO₂, água ou vida. Os seis bins ilustram uma observação publicada; interpretar a atmosfera exige o estudo completo e modelos além deste jogo.' : 'Este exercício não escolhe um local real de pouso nem certifica um mapa de Bennu. O objetivo é entregar dimensões publicadas coerentes com a pergunta; os recursos e a operação permanecem didáticos.'}</p></section> : null}
    {earlier && current && (phase === 'return' || phase === 'operations') ? <div ref={comparison} tabIndex={-1} className="scientific-focus-target" role="region" aria-label="Comparação A/B das tentativas">
      <ExpeditionComparison key={attempts.length} a={earlier.result} b={current.result} onInspect={selectedId => metrics.track('inspection', id, { target: 'comparison', ...(selectedId ? { eventId: selectedId } : {}) })} />
    </div> : null}
    <nav className="expedition-sources" aria-label="Fontes científicas e de engenharia">{mission.origins.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>)}<a href="../docs/30-ATIVOS-NASA-IMPLEMENTADOS.html" target="_blank" rel="noreferrer">Créditos dos modelos 3D ↗</a></nav>
    <input className="sr-only" ref={input} type="file" accept="application/json,.json" tabIndex={-1} aria-hidden="true" onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; if (!file) return; if (file.size > 16_000) { setNotice('Projeto excede 16 KB.'); return; } void file.text().then(restore).catch(() => setNotice('Não foi possível ler o projeto.')); }} />
  </div>;
}
