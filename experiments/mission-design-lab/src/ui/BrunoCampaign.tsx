import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { BRUNO_CHOICES, BRUNO_INSTRUMENTS, BRUNO_INVENTORY_MODEL_VERSION, BRUNO_MISSIONS, BRUNO_MODEL_VERSION, DEFAULT_BRUNO_CONFIG, simulateBrunoMission } from '../lab/bruno-missions.ts';
import type { BrunoConfig, BrunoConfigKey, BrunoDecision, BrunoMissionId, BrunoResult, BrunoSimulationConfig } from '../lab/bruno-missions.ts';
import { BRUNO_LAUNCH_FEE, BRUNO_SUCCESS_REWARD, buildBrunoInventoryConfig } from '../lab/bruno-inventory.ts';
import type { InventoryAttempt, InventoryCommandResponse } from '../metrics/inventory-client.ts';
import { canRenderWebGL } from './Scene.tsx';
import { Icon } from './Icon.tsx';
import { BRUNO_PART_LABELS as partLabels, BRUNO_PART_KEYS as partKeys, readBrunoDraft } from '../lab/bruno-flight-plan.ts';
import { BrunoFlightReview, BrunoRoleReview } from './BrunoFlightReview.tsx';
import type { BrunoRole } from './BrunoFlightReview.tsx';
import { MissionSequenceRive, type MissionSequenceStage } from './MissionSequenceRive.tsx';
import { useR26MissionAudio, R26MissionAudioControl } from './R26MissionAudioControl.tsx';
import { BrunoCondition, BrunoInventoryStatus, BrunoLoadoutEditor } from './BrunoEquipmentShop.tsx';
import type { BrunoInventoryController } from './BrunoInventoryController.ts';
import { BrunoPreviewBoundary } from './BrunoPreviewBoundary.tsx';
import './bruno-campaign.css';

const HangarScene = lazy(() => import('./BrunoHangarScene.tsx'));
const ReferenceCanvas = lazy(() => import('./OrbitalScene.tsx').then(module => ({ default: module.NASAAssetCanvas })));
const baseUrl = import.meta.env?.BASE_URL ?? './';
const references: Record<BrunoMissionId, { file: string; name: string; credit: string; url: string; size?: string }> = {
  iss: { file: 'iss-carbajal-b.glb', name: 'Estação Espacial Internacional', credit: 'NASA / Michael D. Carbajal', url: 'https://science.nasa.gov/3d-resources/international-space-station-iss-b/' },
  moon: { file: 'lro-meaney-a.glb', name: 'Lunar Reconnaissance Orbiter', credit: 'NASA / Christopher R. Meaney', url: 'https://science.nasa.gov/3d-resources/lunar-reconnaissance-orbiter-a/' },
  mars: { file: 'mars-2020-perseverance.glb', name: 'Perseverance', credit: 'NASA / JPL-Caltech', url: 'https://science.nasa.gov/3d-resources/mars-2020-perseverance-rover/' },
  europa: { file: 'europa-clipper-vtad.glb', name: 'Europa Clipper', credit: 'NASA VTAD', url: 'https://science.nasa.gov/resource/europa-clipper-3d-model/', size: '34 MiB' },
};
const steps = { briefing: 'Briefing', hangar: 'Hangar', launch: 'Operação', result: 'Relatório' } as const;
type Phase = keyof typeof steps;

const context: Record<Phase, string> = {
  briefing: 'Leia a pergunta científica e os requisitos do destino. Abra o hangar para configurar a nave.',
  hangar: 'Escolha lançador, propulsão, energia, proteção, navegação e instrumento. Confira massa, orçamento, energia e enlace antes de simular.',
  launch: 'Acompanhe os eventos calculados. Pause para inspecionar a nave, avance uma etapa ou vá ao resultado.',
  result: 'Compare registros produzidos, recebidos e válidos. Leia o primeiro limite observado e redesenhe a nave para testar outra decisão.',
};
const outcomeTitle = { success: 'Missão concluída', failure: 'Missão incompleta', invalid: 'Lançamento bloqueado' };

interface Props {
  id: BrunoMissionId;
  onBack: () => void;
  onDecision?: (id: BrunoMissionId, config: BrunoConfig, decision: BrunoDecision) => void;
  onComplete?: (result: BrunoResult) => void;
  sessionId?: string;
  onCancel?: (id: BrunoMissionId, config: BrunoConfig) => void;
  onInspect?: () => void;
  onRoleReview?: (roles: BrunoRole[]) => void;
  inventory?: BrunoInventoryController;
  onShop?: () => void;
}

function unequipped(config: BrunoConfig): BrunoSimulationConfig {
  return { ...config, payload: 'targeted', modelVersion: BRUNO_INVENTORY_MODEL_VERSION, loadout: [] };
}

function CraftView({ id, config, part, onPart, flightPhase, plan = 'B', unverified }: { id: BrunoMissionId; config: BrunoSimulationConfig; part: BrunoConfigKey; onPart: (key: BrunoConfigKey) => void; flightPhase?: BrunoResult['timeline'][number]['phase']; plan?: 'A' | 'B'; unverified?: boolean }) {
  const [available, setAvailable] = useState(false);
  const [referenceOpen, setReferenceOpen] = useState(false);
  const [referenceReady, setReferenceReady] = useState(false);
  const [referenceFailed, setReferenceFailed] = useState(false);
  const [turn, setTurn] = useState(0);
  useEffect(() => { setAvailable(canRenderWebGL()); }, []);
  const unavailable = useCallback(() => setAvailable(false), []);
  const onReferenceUnavailable = useCallback(() => setReferenceFailed(true), []);
  const onReferenceLoaded = useCallback(() => setReferenceReady(true), []);
  const reference = references[id];
  const loadout = 'loadout' in config ? config.loadout : null;
  const loadingReference = 'Carregando modelo NASA…';
  const fallback = <div className="bruno-craft-fallback">
    <div className="bruno-craft-shape" aria-hidden="true">
      <span data-part="launcher" />
      <span data-part="energy" />
      <span data-part="reserve" />
      <span data-part="protection" />
      <span data-part="navigation" />
      <span data-part="propulsion" />
      <span data-part="payload" />
    </div>
    <p>Esquema da montagem</p>
  </div>;
  return <figure className="bruno-craft" data-bruno-craft data-current-part={part} data-launcher={config.launcher}
    data-propulsion={config.propulsion} data-energy={config.energy} data-protection={config.protection}
    data-navigation={config.navigation} data-payload={config.payload} data-flight-phase={flightPhase}
    data-instruments={loadout?.map(unit => unit.instrumentId).join(' ')} data-instrument-cycles={loadout?.map(unit => unit.usesRemaining).join(' ')}>
    <div className="bruno-craft-header"><strong>{referenceOpen ? reference.name : flightPhase ? 'Nave em operação' : `Sua nave · plano ${plan}`}</strong><span>{referenceOpen ? 'Referência NASA' : BRUNO_MISSIONS[id].destination}</span></div>
    <div className="bruno-craft-stage">
      {referenceOpen ? (
        referenceFailed || !available ? <p className="bruno-craft-message">O modelo 3D está indisponível neste navegador. A fonte NASA e a montagem didática continuam disponíveis.</p>
          : <BrunoPreviewBoundary fallback={<p>Modelo NASA indisponível.</p>} onUnavailable={onReferenceUnavailable}>
            <Suspense fallback={<p className="bruno-craft-message">{loadingReference}</p>}>
              <ReferenceCanvas url={`${baseUrl}models/nasa/${reference.file}`} turn={turn} tilt={.1} onLoaded={onReferenceLoaded} onUnavailable={onReferenceUnavailable} />
            </Suspense>
            {!referenceReady ? <p className="bruno-craft-message" role="status">{loadingReference}</p> : null}
          </BrunoPreviewBoundary>
      ) : available ? <BrunoPreviewBoundary fallback={fallback} onUnavailable={unavailable}>
        <Suspense fallback={fallback}><HangarScene flightPhase={flightPhase} config={config} active={part} turn={turn} onPart={onPart} onUnavailable={unavailable}/></Suspense>
      </BrunoPreviewBoundary> : fallback}
    </div>
    <div className="bruno-craft-controls">
      {available && (!referenceOpen || (referenceReady && !referenceFailed)) ? <button className="bruno-action bruno-secondary" type="button" onClick={() => setTurn(value => (value + Math.PI / 4) % (2 * Math.PI))}>Girar vista</button> : null}
      <button hidden={Boolean(flightPhase)} className="bruno-action bruno-secondary" type="button" aria-pressed={referenceOpen} onClick={() => { setReferenceReady(false); setReferenceFailed(false); setTurn(0); setReferenceOpen(value => !value); }}>
        {referenceOpen ? 'Voltar à nave' : `Inspecionar referência NASA${reference.size ? ` · ${reference.size}` : ''}`}
      </button>
    </div>
    {!referenceOpen && loadout ? <div className="bruno-craft-loadout"><strong>Carga montada</strong>
      {unverified ? <p>Conecte-se para conferir a carga reservada.</p> : loadout.length ? <ul>{loadout.map((unit, index) => <li key={`${unit.instrumentId}-${index}`}>
        {BRUNO_INSTRUMENTS[unit.instrumentId].label} · <BrunoCondition id={unit.instrumentId} usesRemaining={unit.usesRemaining} />
      </li>)}</ul> : <p>Sem instrumentos nesta montagem.</p>}
    </div> : null}
    <figcaption>{referenceOpen ? <>Modelo publicado por {reference.credit}. Referência de contexto, em escala independente. <a href={reference.url}>Ver origem do modelo</a>.</>
      : <>Representação didática, fora de escala. {flightPhase ? 'Sistema em foco' : 'Em edição'} <strong>{partLabels[part]}</strong>. {part === 'payload' && loadout ? '' : `${config[part] === 'targeted' ? BRUNO_MISSIONS[id].instrument : BRUNO_CHOICES[part].find(choice => choice.id === config[part])?.label}.`}</>}</figcaption>
  </figure>;
}

function timeLabel(timeS: number) {
  const days = Math.floor(timeS / 86_400);
  const hours = Math.floor((timeS % 86_400) / 3600);
  return days ? `T+${days} d${hours ? ` ${hours} h` : ''}` : 'T+0';
}

function MissionReport({ id, result, onEdit, confirmed }: { id: BrunoMissionId; result: BrunoResult; onEdit: () => void; confirmed: boolean }) {
  const mission = BRUNO_MISSIONS[id];
  const counts = [
    ['Produzidos', result.generatedRecords],
    ['Recebidos', result.receivedRecords],
    ['Válidos para a pergunta', result.deliveredRecords],
  ] as const;
  const loadout = 'loadout' in result.config ? result.config.loadout : null;
  return <>
    <div className="bruno-report" data-outcome={result.outcome}>
      <dl className="bruno-report-counts">{counts.map(([label, count]) => <div key={label}><dt>{label}</dt><dd>{count}<span>/{result.requiredRecords}</span></dd></div>)}</dl>
      <div className="bruno-score"><strong>{result.score.total}<span>/100</span></strong><p>Pontos da missão</p></div>
    </div>
    {loadout?.length ? <section className="bruno-panel bruno-equipment-report" aria-labelledby="bruno-equipment-report-title">
      <h2 id="bruno-equipment-report-title">Condição dos instrumentos</h2>
      <ul className="bruno-equipment-list">{loadout.map((unit, index) => {
        const remaining = result.outcome === 'invalid' ? unit.usesRemaining : unit.usesRemaining - 1;
        return <li key={`${unit.instrumentId}-${index}`}><strong>{BRUNO_INSTRUMENTS[unit.instrumentId].label}</strong>
          <span>{unit.usesRemaining} → {remaining} ciclos{remaining === 0 ? ' · unidade esgotada' : ''}</span></li>;
      })}</ul>
      {confirmed ? <p>{result.outcome === 'invalid' ? 'Sem cobrança de operação.' : `Partida: ${BRUNO_LAUNCH_FEE} créditos.`}{result.outcome === 'success' ? ` Prêmio confirmado: ${BRUNO_SUCCESS_REWARD} créditos.` : ''}</p> : null}
    </section> : null}
    <div className="bruno-report-details">
      <section aria-labelledby="bruno-diagnostic-title" className="bruno-panel">
        <h2 id="bruno-diagnostic-title">{result.outcome === 'success' ? 'O que os dados permitem concluir' : 'O que limitou a missão'}</h2>
        {result.outcome === 'success' ? <p>{mission.evidence}</p> : <ol className="bruno-diagnostics">
          {result.diagnostics.map(diagnostic => <li key={diagnostic.code}><span>{timeLabel(diagnostic.timeS)}</span><p>{diagnostic.message}</p></li>)}
        </ol>}
        <button type="button" className="bruno-action bruno-primary" onClick={onEdit}>Redesenhar nave <Icon name="arrow" size={18}/></button>
      </section>
      <section aria-labelledby="bruno-timeline-title" className="bruno-panel">
        <h2 id="bruno-timeline-title">Linha da missão</h2>
        <ol className="bruno-timeline">{result.timeline.map(entry => <li key={entry.phase} data-state={entry.state}>
          <span>{timeLabel(entry.timeS)}</span><div><h3>{entry.title}</h3><p>{entry.message}</p></div>
        </li>)}</ol>
      </section>
    </div>
  </>;
}

export function BrunoCampaign({ id, onBack, onDecision, onComplete, sessionId, onCancel, onInspect, onRoleReview, inventory, onShop }: Props) {
  const mission = BRUNO_MISSIONS[id];
  const draftKey = sessionId ? `ipe-bruno-draft-v1:${sessionId}:${id}` : null;
  const [draft] = useState(() => {
    try { return draftKey ? readBrunoDraft(window.localStorage, draftKey) : null; } catch { return null; }
  });
  const [phase, setPhase] = useState<Phase>(draft?.phase ?? 'briefing');
  const [config, setConfig] = useState<BrunoConfig>(draft?.config ?? DEFAULT_BRUNO_CONFIG);
  const [baseline, setBaseline] = useState<BrunoSimulationConfig>(draft?.baseline ?? (inventory ? unequipped(DEFAULT_BRUNO_CONFIG) : DEFAULT_BRUNO_CONFIG));
  const [viewingA, setViewingA] = useState(false);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [storageIssue, setStorageIssue] = useState(false);
  const audio = useR26MissionAudio();
  const [part, setPart] = useState<BrunoConfigKey>('launcher');
  const [eventIndex, setEventIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [result, setResult] = useState<BrunoResult | null>(() => draft?.resultConfig ? simulateBrunoMission(id, draft.resultConfig) : null);
  const [confirmedResult, setConfirmedResult] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const pending = useRef<BrunoResult | null>(null);
  const pendingAttemptId = useRef<string | null>(null);
  const execute = inventory?.execute;
  const snapshot = inventory?.snapshot;
  const resumable = snapshot?.attempts.find(attempt => attempt.missionId === id && attempt.status === 'launched');
  const assembly = snapshot ? buildBrunoInventoryConfig(snapshot.inventory, id, config) : inventory ? null : config;
  const preview = assembly ? simulateBrunoMission(id, assembly) : null;
  const baselineResult = simulateBrunoMission(id, baseline);
  const flightConnected = !inventory || Boolean(snapshot && !inventory.busy);
  const cancellation = useRef(onCancel);
  cancellation.current = onCancel;
  useEffect(() => () => {
    if (pending.current && !pendingAttemptId.current) cancellation.current?.(id, pending.current.config);
    pending.current = null;
  }, [id]);
  useEffect(() => {
    if (!draftKey) return;
    try {
      window.localStorage.setItem(draftKey, JSON.stringify({ modelVersion: inventory ? BRUNO_INVENTORY_MODEL_VERSION : BRUNO_MODEL_VERSION, config, baseline, phase: phase === 'launch' ? 'hangar' : phase, resultConfig: result?.config ?? null }));
      setStorageIssue(false);
    } catch { setStorageIssue(true); }
  }, [draftKey, config, baseline, phase, result, Boolean(inventory)]);
  useEffect(() => { heading.current?.focus(); }, [phase]);

  const showResult = useCallback((attempt: BrunoResult, confirmed: boolean) => {
    pending.current = null;
    pendingAttemptId.current = null;
    setConfirmedResult(confirmed);
    setResult(attempt);
    setPhase('result');
    audio.play(attempt.outcome);
    if (!confirmed) onComplete?.(attempt);
  }, [onComplete, audio.play]);

  const settleAttempt = useCallback((attempt: InventoryAttempt) => {
    if (attempt.missionId !== id || attempt.status === 'launched') return;
    if (attempt.status === 'completed') showResult(attempt.result, true);
    else {
      pending.current = null;
      pendingAttemptId.current = null;
      setPhase('hangar');
    }
  }, [id, showResult]);

  useEffect(() => {
    const finished = snapshot?.attempts.find(attempt => attempt.attemptId === pendingAttemptId.current && attempt.status !== 'launched');
    if (finished) settleAttempt(finished);
  }, [snapshot, settleAttempt]);

  const complete = useCallback(() => {
    const attempt = pending.current;
    if (!attempt) return;
    const attemptId = pendingAttemptId.current;
    if (attemptId && execute) {
      setPaused(true);
      void execute({ kind: 'complete', attemptId }).then(response => {
        if (response?.attempt && pendingAttemptId.current === attemptId) settleAttempt(response.attempt);
      });
      return;
    }
    showResult(attempt, false);
  }, [execute, settleAttempt, showResult]);
  useEffect(() => {
    if (phase !== 'launch' || paused || !flightConnected) return;
    const timer = window.setTimeout(() => {
      if (eventIndex >= (pending.current?.timeline.length ?? 1) - 1) complete();
      else setEventIndex(index => index + 1);
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [eventIndex, complete, phase, paused, flightConnected]);

  function select(key: BrunoConfigKey, choice: BrunoConfig[BrunoConfigKey]) {
    if (config[key] === choice) return;
    const next = { ...config, [key]: choice };
    setConfig(next);
    setViewingA(false);
    audio.play('choice');
    onDecision?.(id, next, { key, from: config[key], to: choice });
  }
  function beginFlight(attempt: BrunoResult, attemptId: string | null = null) {
    pending.current = attempt;
    pendingAttemptId.current = attemptId;
    setEventIndex(0);
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (attempt.outcome === 'invalid' || reducedMotion) {
      if (attemptId) setPhase('launch');
      complete();
      return;
    }
    setPaused(false);
    setViewingA(false);
    audio.play('launch');
    setPhase('launch');
  }
  function acceptResponse(response: InventoryCommandResponse) {
    if (response.receipt.operation === 'equip') setViewingA(false);
    const { attempt } = response;
    if (!attempt || attempt.missionId !== id) return;
    if (attempt.status === 'launched') beginFlight(attempt.result, attempt.attemptId);
    else if (pendingAttemptId.current === attempt.attemptId || attempt.status === 'cancelled') settleAttempt(attempt);
  }
  function launch() {
    if (pending.current || !preview || !flightConnected || resumable) return;
    if (execute) void execute({ kind: 'launch', missionId: id, config }).then(response => { if (response) acceptResponse(response); });
    else beginFlight(preview);
  }
  function cancelAttempt(attemptId: string) {
    if (!execute) return;
    setPaused(true);
    void execute({ kind: 'cancel', attemptId }).then(response => {
      if (response?.attempt && response.attempt.status === 'cancelled') settleAttempt(response.attempt);
    });
  }

  const event = phase === 'launch' ? pending.current?.timeline[eventIndex] : undefined;
  const flightPart: BrunoConfigKey = event?.phase === 'downlink' ? 'navigation' : event?.phase === 'acquisition' ? 'payload' : event?.phase === 'transfer' ? 'propulsion' : 'launcher';
  const riveStage: MissionSequenceStage = phase === 'result' ? result?.outcome === 'success' ? 4 : result?.outcome === 'invalid' ? 6 : 5 : phase === 'launch' ? event?.phase === 'downlink' ? 3 : event?.phase === 'acquisition' ? 2 : 1 : 0;
  const title = phase === 'briefing' ? mission.name : phase === 'hangar' ? 'Hangar de missão'
    : phase === 'launch' ? 'Operação da missão' : outcomeTitle[result!.outcome];
  const activeChoice = BRUNO_CHOICES[part].find(option => option.id === config[part])!;
  const lowBalance = Boolean(snapshot && preview?.outcome !== 'invalid' && snapshot.inventory.balance < BRUNO_LAUNCH_FEE);
  const readout = phase === 'hangar' && preview
    ? `${partLabels[part]}. ${activeChoice.id === 'targeted' ? mission.instrument : activeChoice.label}. ${activeChoice.description} Massa: ${preview.massKg} de ${preview.maxMassKg} kg. Custo: ${preview.credits} de ${preview.budget} créditos. Energia para coleta: ${preview.acquisitionEnergyWh} Wh. Enlace: ${preview.linkCapacityMb} megabytes.`
    : phase === 'result' && result
      ? `${title}. Produzidos: ${result.generatedRecords}. Recebidos: ${result.receivedRecords}. Válidos: ${result.deliveredRecords} de ${result.requiredRecords}. Pontuação: ${result.score.total} de 100. ${result.diagnostics[0]?.message ?? mission.evidence}`
      : phase === 'briefing' ? `${mission.question} Parâmetros e registros simulados.` : `${event?.title ?? ''}. ${event?.message ?? ''}`;
  const libras = `${mission.name}. ${steps[phase]}. ${context[phase]} ${readout} ${inventory?.notice ?? ''}`.trim();
  return <section className="bruno-campaign" data-bruno-mission={id} data-stage={phase} aria-labelledby="bruno-title"
    data-ipe-libras-context={libras}>
    <div className="bruno-toolbar">
      <button type="button" className="bruno-action bruno-quiet" onClick={onBack}><Icon name="back" size={18}/> Missões</button>
      <ol className="bruno-steps" aria-label="Etapas da missão">
        {(Object.keys(steps) as Phase[]).map(step => <li aria-current={phase === step ? 'step' : undefined} key={step}>{steps[step]}</li>)}
      </ol>
      <R26MissionAudioControl audio={audio} />
    </div>
    <header className="bruno-heading">
      <p>{phase === 'briefing' ? mission.destination : mission.name}</p>
      <h1 id="bruno-title" ref={heading} tabIndex={-1}>{title}</h1>
      {phase === 'hangar' ? <p className="bruno-lead">{mission.learn}</p> : null}
    </header>
    {storageIssue ? <p role="status">Não foi possível guardar o rascunho neste aparelho. O plano continua disponível nesta tela.</p> : draftKey && phase === 'hangar' ? <p className="bruno-draft-note">Montagem guardada neste aparelho para sua participação.</p> : null}
    {phase !== 'briefing' ? <MissionSequenceRive stage={riveStage} /> : null}
    {inventory && (phase !== 'briefing' || resumable) ? <BrunoInventoryStatus controller={inventory} onResolved={acceptResponse} /> : null}
    {inventory && resumable && phase !== 'launch' ? <div className="bruno-attempt-resume">
      <p>Uma operação já foi registrada para esta missão.</p>
      <button type="button" className="bruno-action bruno-primary" disabled={!flightConnected} onClick={() => beginFlight(resumable.result, resumable.attemptId)}>Retomar operação</button>
      <button type="button" className="bruno-action bruno-secondary" disabled={!flightConnected} onClick={() => cancelAttempt(resumable.attemptId)}>Cancelar tentativa</button>
    </div> : null}
    {phase === 'briefing' ? <div className="bruno-briefing">
      <div className="bruno-briefing-copy">
        <h2>{mission.question}</h2>
        <p>{mission.briefing}</p>
        <details className="bruno-howto"><summary>Como jogar esta missão</summary><ol><li>Abra o hangar e escolha um sistema. A peça correspondente muda na nave.</li><li>Fixe um plano A, altere uma decisão e compare os recursos e registros previstos de B.</li><li>Simule, pause nos eventos e leia o motivo do resultado. Redesenhe para testar outra hipótese.</li></ol></details>
        <dl className="bruno-briefing-limits">
          <div><dt>Carga de referência</dt><dd>{mission.payloadKg} kg</dd></div>
          <div><dt>Limite para chegar</dt><dd>{mission.deadlineDays} dias</dd></div>
          <div><dt>Orçamento</dt><dd>{mission.budget} créditos</dd></div>
        </dl>
        <button type="button" className="bruno-action bruno-primary" onClick={() => setPhase('hangar')}>Abrir hangar <Icon name="arrow" size={18}/></button>
      </div>
      <section className="bruno-science" aria-labelledby="bruno-science-title">
        <h2 id="bruno-science-title">Referência científica</h2>
        <p>{mission.fact}</p>
        <p><a href={mission.source.url}>{mission.source.label}</a></p>
        <p>O prazo, a carga e as leituras do jogo pertencem à simulação didática.</p>
        {id === 'europa' ? <p>Instrumentos da carga: {mission.instrument}.</p> : <p>Cenário adaptado da contribuição de <a href="https://github.com/bruno-assis-carvalho/missao-ipe-deploy">Bruno A Carvalho</a>.</p>}
      </section>
    </div> : null}
    {phase === 'hangar' ? <div className="bruno-hangar">
      <CraftView id={id} config={viewingA ? baseline : assembly ?? unequipped(config)} plan={viewingA ? 'A' : 'B'} part={part} onPart={setPart} unverified={!viewingA && !assembly} />
      <section className="bruno-panel bruno-builder" aria-labelledby="bruno-builder-title">
        <h2 id="bruno-builder-title">Montar nave</h2>
        {comparisonOpen ? <p>Você edita o plano B. O plano A é a referência guardada.</p> : null}
        <div className="bruno-parts" aria-label="Sistemas da montagem" role="group">
          {partKeys.map(key => <button type="button" className="bruno-action bruno-secondary" key={key} aria-pressed={part === key} onClick={() => setPart(key)}>{partLabels[key]}</button>)}
        </div>
        {part === 'payload' && inventory && onShop ? <BrunoLoadoutEditor controller={inventory} missionId={id} config={config} onShop={onShop} onChanged={() => setViewingA(false)} /> : <fieldset className="bruno-choices">
          <legend>{partLabels[part]}</legend>
          {BRUNO_CHOICES[part].map(option => <label key={option.id}>
            <input type="radio" name={`bruno-${id}-${part}`} checked={config[part] === option.id} onChange={() => select(part, option.id)} />
            <span><strong>{option.id === 'targeted' ? mission.instrument : option.label}</strong><small>{option.description}</small></span>
            <span className="bruno-part-cost">{part === 'launcher' ? `até ${mission.launcherCapacity[option.id as BrunoConfig['launcher']]} kg` : `${option.massKg} kg`} · {option.credits} créditos</span>
          </label>)}
        </fieldset>}
        {preview ? <dl className="bruno-readout" aria-label="Indicadores do plano">
          <div><dt>Massa transportada</dt><dd data-limit={preview.massKg > preview.maxMassKg}>{preview.massKg} / {preview.maxMassKg} kg</dd></div>
          <div><dt>Orçamento</dt><dd data-limit={preview.credits > preview.budget}>{preview.credits} / {preview.budget} créditos</dd></div>
          <div><dt>Energia para coleta</dt><dd>{preview.acquisitionEnergyWh} Wh</dd></div>
          <div><dt>Enlace da janela</dt><dd>{preview.linkCapacityMb} MB</dd></div>
          <div><dt>Chegada estimada</dt><dd data-limit={preview.travelDays > mission.deadlineDays}>{preview.travelDays} / {mission.deadlineDays} dias</dd></div>
          <div><dt>Volume por registro</dt><dd>{preview.dataSizeMb} MB</dd></div>
          {preview.maxSlots !== undefined ? <div><dt>Encaixes da carga</dt><dd data-limit={Number(preview.usedSlots) > preview.maxSlots}>{preview.usedSlots} / {preview.maxSlots}</dd></div> : null}
        </dl> : <p>Conecte-se para calcular os indicadores com a carga reservada.</p>}
        {inventory ? <div className="bruno-wallet-note">
          <p><strong>Carga necessária:</strong> {mission.requiredInstruments.map(instrument => BRUNO_INSTRUMENTS[instrument].label).join(' e ')}.</p>
          <p><strong>Partida efetiva:</strong> {BRUNO_LAUNCH_FEE} créditos da loja e um ciclo de cada unidade equipada. Projetos bloqueados em T+0 preservam saldo e condição.</p>
          {lowBalance ? <p>Saldo insuficiente para uma partida. Abra a loja para revisar suas unidades e a carteira.</p> : null}
        </div> : null}
        <div className="bruno-shop-actions">
          {inventory && onShop && part !== 'payload' ? <button type="button" className="bruno-action bruno-secondary" onClick={onShop}>Loja e inventário</button> : null}
          <button type="button" className="bruno-action bruno-secondary" disabled={!preview} aria-expanded={comparisonOpen} onClick={() => { setComparisonOpen(value => !value); setViewingA(false); if (!comparisonOpen) onInspect?.(); }}>Revisar voo e comparar A/B</button>
          <button type="button" className="bruno-action bruno-primary" disabled={!preview || !flightConnected || !!resumable || lowBalance} onClick={launch}>Simular lançamento <Icon name="play" size={18}/></button>
        </div>
      </section>
    </div> : null}
    {phase === 'hangar' && comparisonOpen && preview ? <BrunoFlightReview a={baselineResult} b={preview} viewingA={viewingA} onView={value => { setViewingA(value); heading.current?.closest('section')?.querySelector('[data-bruno-craft]')?.scrollIntoView?.({ block: 'center', behavior: 'instant' }); }} onSave={() => { setBaseline(preview.config); setViewingA(true); }} /> : null}
    {phase === 'launch' && event && pending.current ? <div className="bruno-operations">
      <CraftView id={id} config={pending.current.config} part={flightPart} onPart={() => {}} flightPhase={event.phase} />
      <section className="bruno-panel" aria-label="Operação da missão">
        <p>Evento {eventIndex + 1} de {pending.current.timeline.length} · tempo acelerado</p>
        <div aria-live="polite"><h2>{event.title}</h2><p>{timeLabel(event.timeS)} · {event.message}</p></div>
        <p>A nave ilustra o sistema envolvido. Os tempos e registros vêm do motor didático; a trajetória não representa uma propagação orbital.</p>
        <ol className="bruno-timeline">{pending.current.timeline.map((item, index) => <li key={item.phase} aria-current={index === eventIndex ? 'step' : undefined} data-state={index <= eventIndex ? item.state : 'pending'}><span>{index < eventIndex ? 'Visto' : index === eventIndex ? 'Agora' : 'A seguir'}</span><div>{item.title}</div></li>)}</ol>
        <div className="bruno-craft-controls">
          <button className="bruno-action bruno-secondary" type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? 'Continuar operação' : 'Pausar operação'}</button>
          <button className="bruno-action bruno-secondary" type="button" disabled={eventIndex === pending.current.timeline.length - 1 && !flightConnected} onClick={() => { const attempt = pending.current; if (!attempt) return; if (eventIndex < attempt.timeline.length - 1) setEventIndex(index => Math.min(index + 1, attempt.timeline.length - 1)); else complete(); }}>Próximo evento</button>
          <button className="bruno-action bruno-secondary" type="button" disabled={!flightConnected} onClick={complete}>Ir ao resultado</button>
          {pendingAttemptId.current ? <button className="bruno-action bruno-quiet" type="button" disabled={!flightConnected} onClick={() => { if (pendingAttemptId.current) cancelAttempt(pendingAttemptId.current); }}>Cancelar tentativa</button> : null}
        </div>
      </section>
    </div> : null}
    {phase === 'result' && result ? <><MissionReport id={id} result={result} confirmed={confirmedResult} onEdit={() => { setBaseline(result.config); setComparisonOpen(true); setViewingA(false); setPhase('hangar'); }} /><BrunoRoleReview key={JSON.stringify(result.config)} result={result} onReview={onRoleReview} /></> : null}
  </section>;
}
