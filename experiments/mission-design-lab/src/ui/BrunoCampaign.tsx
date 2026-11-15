import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { Ref } from 'react';
import { BRUNO_CHOICES, BRUNO_INSTRUMENTS, BRUNO_INVENTORY_MODEL_VERSION, BRUNO_LAUNCHER_SLOTS, BRUNO_MISSIONS, BRUNO_MODEL_VERSION, DEFAULT_BRUNO_CONFIG, simulateBrunoMission } from '../lab/bruno-missions.ts';
import type { BrunoConfig, BrunoConfigKey, BrunoDecision, BrunoMissionId, BrunoResult, BrunoSimulationConfig, BrunoTimelineEntry } from '../lab/bruno-missions.ts';
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
import { getBrunoSceneState } from './r30-scene-state.ts';
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
const phaseLabels = { briefing: 'Briefing', hangar: 'Hangar', launch: 'Operação', result: 'Relatório' } as const;
type Phase = keyof typeof phaseLabels;
const flightSteps = [
  ['launch', 'Lançamento'], ['transfer', 'Transferência'], ['acquisition', 'Coleta'], ['downlink', 'Recepção'],
] as const;
const stepStatus = {
  done: 'Concluída', current: 'Atual', pending: 'Pendente', blocked: 'Bloqueada', limited: 'Com limite', skipped: 'Não executada',
} as const;

const diagnosticActions: Partial<Record<string, { label: string; part: BrunoConfigKey; action: string }>> = {
  MASS_LIMIT: { label: 'Massa', part: 'launcher', action: 'Rever lançador' },
  SLOT_LIMIT: { label: 'Encaixes', part: 'launcher', action: 'Rever encaixes' },
  ARRIVAL_WINDOW: { label: 'Prazo', part: 'propulsion', action: 'Rever propulsão' },
  ENTRY_PROTECTION: { label: 'Entrada', part: 'protection', action: 'Rever proteção' },
  CALIBRATION_LOST: { label: 'Calibração', part: 'protection', action: 'Rever proteção' },
  PAYLOAD_MISMATCH: { label: 'Instrumentos', part: 'payload', action: 'Rever instrumentos' },
  ENERGY_WINDOW: { label: 'Energia para coleta', part: 'energy', action: 'Rever energia' },
  CONTACT_CAPACITY: { label: 'Janela de contato', part: 'navigation', action: 'Rever enlace' },
};

const context: Record<Phase, string> = {
  briefing: 'Leia a pergunta científica e os requisitos do destino. Abra o hangar para configurar a nave.',
  hangar: 'Comece pela carga de instrumentos. Os outros sistemas já têm uma opção inicial. Confira os limites antes de simular.',
  launch: 'Acompanhe os eventos calculados. Pause para inspecionar a nave, avance uma etapa ou vá ao resultado.',
  result: 'Compare registros produzidos, recebidos e válidos. Leia o primeiro limite observado e redesenhe a nave para testar outra decisão.',
};
const outcomeTitle = { success: 'Missão concluída', failure: 'Missão incompleta', invalid: 'Lançamento bloqueado' };
const checkIntro = 'Se executar este plano, o simulador prevê estes efeitos.';

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

function MissionSteps({ phase, observed }: { phase: Phase; observed: readonly BrunoTimelineEntry[] }) {
  const current = phase === 'launch' ? observed.at(-1)?.phase ?? 'launch' : phase;
  const ended = phase === 'result' || observed.some(entry => entry.state === 'blocked');
  function renderStep(key: string, label: string, status: keyof typeof stepStatus) {
    return <li key={key} aria-current={key === current ? 'step' : undefined} data-status={status}>
      <strong>{label}</strong><span>{stepStatus[status]}</span>
    </li>;
  }
  return <ol role="list" className="bruno-steps" aria-label="Etapas da missão">
    {renderStep('briefing', 'Briefing', phase === 'briefing' ? 'current' : 'done')}
    {renderStep('hangar', 'Hangar', phase === 'briefing' ? 'pending' : phase === 'hangar' ? 'current' : 'done')}
    {flightSteps.map(([key, label]) => {
      const entry = observed.find(item => item.phase === key);
      if (!entry) return renderStep(key, label, ended ? 'skipped' : 'pending');
      if (entry.state === 'blocked') return renderStep(key, label, 'blocked');
      if (entry.state === 'warning') return renderStep(key, label, 'limited');
      return renderStep(key, label, key === current ? 'current' : 'done');
    })}
    {renderStep('result', 'Relatório', phase === 'result' ? 'current' : 'pending')}
  </ol>;
}

function CraftView({ id, config, part, onPart, flightEvent, flightResult, paused, plan, unverified, figureRef, referenceOpen = false, onReferenceToggle, onEditSystem, prioritizeOptions, prediction }: {
  id: BrunoMissionId; config: BrunoSimulationConfig; part: BrunoConfigKey; onPart: (key: BrunoConfigKey) => void;
  flightEvent?: BrunoTimelineEntry; flightResult?: BrunoResult; paused?: boolean; plan?: 'A' | 'B'; unverified?: boolean;
  figureRef?: Ref<HTMLElement>; referenceOpen?: boolean; onReferenceToggle?: (open: boolean) => void;
  onEditSystem?: () => void; prioritizeOptions?: boolean; prediction?: string;
}) {
  const [available, setAvailable] = useState(false);
  const [referenceReady, setReferenceReady] = useState(false);
  const [referenceFailed, setReferenceFailed] = useState(false);
  const [turn, setTurn] = useState(0);
  const [exploded, setExploded] = useState(false);
  useEffect(() => { setAvailable(canRenderWebGL()); }, []);
  const unavailable = useCallback(() => setAvailable(false), []);
  const onReferenceUnavailable = useCallback(() => setReferenceFailed(true), []);
  const onReferenceLoaded = useCallback(() => setReferenceReady(true), []);
  const reference = references[id];
  const loadout = 'loadout' in config ? config.loadout : null;
  const flightPhase = flightEvent?.phase;
  const flightState = getBrunoSceneState(config, flightEvent, flightResult);
  const title = referenceOpen ? reference.name : flightPhase ? 'Nave em operação' : plan ? `Sua nave · plano ${plan}` : 'Sua nave';
  const option = part === 'payload' && loadout
    ? unverified ? 'Carga ainda não verificada' : loadout.map(unit => BRUNO_INSTRUMENTS[unit.instrumentId].label).join(' e ') || 'Sem instrumentos'
    : config[part] === 'targeted' ? BRUNO_MISSIONS[id].instrument : BRUNO_CHOICES[part].find(choice => choice.id === config[part])?.label;
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
  return <figure ref={figureRef} id={figureRef ? 'bruno-craft-view' : undefined} tabIndex={figureRef ? -1 : undefined} aria-label={figureRef ? 'Vista da nave' : undefined}
    aria-describedby={figureRef ? referenceOpen ? 'bruno-craft-caption' : 'bruno-craft-selection bruno-craft-caption' : undefined}
    className="bruno-craft" data-bruno-craft data-current-part={part} data-launcher={config.launcher}
    data-propulsion={config.propulsion} data-energy={config.energy} data-protection={config.protection}
    data-navigation={config.navigation} data-payload={config.payload} data-flight-phase={flightPhase} data-exploded={exploded}
    data-arrived={flightState.arrived} data-acquiring={flightState.acquiring} data-transmitting={flightState.transmitting}
    data-instruments={loadout?.map(unit => unit.instrumentId).join(' ')} data-instrument-cycles={loadout?.map(unit => unit.usesRemaining).join(' ')}>
    <div className="bruno-craft-header">
      <strong>{title}</strong>
      {onEditSystem ? <button className={`bruno-action ${prioritizeOptions ? 'bruno-primary' : 'bruno-secondary'} bruno-craft-options`} type="button" aria-controls="bruno-system-controls" onClick={onEditSystem}>Ir às opções <Icon name="arrow" size={16} /></button> : null}
      <span>{referenceOpen ? 'Referência NASA' : BRUNO_MISSIONS[id].destination}</span>
    </div>
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
        <Suspense fallback={fallback}><HangarScene missionId={id} flightPhase={flightPhase} flightEvent={flightEvent} flightResult={flightResult} paused={paused} exploded={exploded} config={config} active={part} turn={turn} onPart={onPart} onUnavailable={unavailable}/></Suspense>
      </BrunoPreviewBoundary> : fallback}
    </div>
    {!referenceOpen ? <p id={figureRef ? 'bruno-craft-selection' : undefined} className="bruno-craft-selection">
      <strong>{partLabels[part]} · {option}</strong>
      {prediction ? <span>Previsto · {prediction}</span> : null}
      {flightState.energyWh !== null ? <span>Reserva no evento · {flightState.energyWh} Wh</span> : null}
    </p> : null}
    <div className="bruno-craft-controls bruno-craft-tools">
      {available && (!referenceOpen || (referenceReady && !referenceFailed)) ? <button className="bruno-action bruno-secondary" type="button" onClick={() => setTurn(value => (value + Math.PI / 4) % (2 * Math.PI))}>Girar vista</button> : null}
      {!referenceOpen && !flightPhase ? <button className="bruno-action bruno-secondary" type="button" aria-pressed={exploded} onClick={() => setExploded(value => !value)}>{exploded ? 'Reunir componentes' : 'Separar componentes'}</button> : null}
    </div>
    {!referenceOpen && loadout && (unverified || loadout.length > 0) ? <details className="bruno-craft-loadout bruno-disclosure">
      <summary>{unverified ? 'Carga ainda não verificada' : 'Carga montada e condição'}</summary>
      {unverified ? <p>Conecte-se para conferir a carga reservada.</p> : <ul>{loadout.map((unit, index) => <li key={`${unit.instrumentId}-${index}`}>
        {BRUNO_INSTRUMENTS[unit.instrumentId].label} · <BrunoCondition id={unit.instrumentId} usesRemaining={unit.usesRemaining} />
      </li>)}</ul>}
    </details> : null}
    <figcaption>
      <span id={figureRef ? 'bruno-craft-caption' : undefined}>{referenceOpen ? <>Modelo publicado por {reference.credit}, em escala independente. <a href={reference.url}>Ver origem do modelo</a>.</> : 'Modelo didático fora de escala.'}</span>
      {onReferenceToggle ? <button className="bruno-action bruno-quiet bruno-reference-toggle" type="button" aria-pressed={referenceOpen} onClick={() => { setReferenceReady(false); setReferenceFailed(false); setTurn(0); onReferenceToggle(!referenceOpen); }}>
        {referenceOpen ? 'Voltar à nave' : `Inspecionar referência NASA${reference.size ? ` · ${reference.size}` : ''}`}
      </button> : null}
    </figcaption>
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
    {confirmed ? <p className="bruno-report-saved" role="status">Tentativa registrada. Veja o resultado em Meu progresso.</p> : null}
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
  const [referenceOpen, setReferenceOpen] = useState(false);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [storageIssue, setStorageIssue] = useState(false);
  const audio = useR26MissionAudio();
  const [part, setPart] = useState<BrunoConfigKey>('launcher');
  const [eventIndex, setEventIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [result, setResult] = useState<BrunoResult | null>(() => draft?.resultConfig ? simulateBrunoMission(id, draft.resultConfig) : null);
  const [confirmedResult, setConfirmedResult] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const craft = useRef<HTMLElement>(null);
  const systemControls = useRef<Partial<Record<BrunoConfigKey, HTMLButtonElement | null>>>({});
  const pending = useRef<BrunoResult | null>(null);
  const pendingAttemptId = useRef<string | null>(null);
  const execute = inventory?.execute;
  const snapshot = inventory?.snapshot;
  const resumable = snapshot?.attempts.find(attempt => attempt.missionId === id && attempt.status === 'launched');
  const inventoryAssembly = snapshot ? buildBrunoInventoryConfig(snapshot.inventory, id, config) : null;
  const assembly = inventoryAssembly ?? (inventory ? null : config);
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

  function showPlan(viewA: boolean) {
    setViewingA(viewA);
    setReferenceOpen(false);
  }
  function select(key: BrunoConfigKey, choice: BrunoConfig[BrunoConfigKey]) {
    if (config[key] === choice) return;
    const next = { ...config, [key]: choice };
    setConfig(next);
    showPlan(false);
    audio.play('choice');
    onDecision?.(id, next, { key, from: config[key], to: choice });
  }
  function focusSystem(key: BrunoConfigKey) {
    setPart(key);
    showPlan(false);
    systemControls.current[key]?.focus();
  }
  function inspectPlan(viewA: boolean) {
    showPlan(viewA);
    craft.current?.focus({ preventScroll: true });
    craft.current?.scrollIntoView?.({ block: 'center', behavior: 'instant' });
  }
  function beginFlight(attempt: BrunoResult, attemptId: string | null = null) {
    pending.current = attempt;
    pendingAttemptId.current = attemptId;
    setEventIndex(0);
    setReferenceOpen(false);
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
    if (response.receipt.operation === 'equip') showPlan(false);
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

  const activeFlight = phase === 'launch' ? pending.current : null;
  const observed = activeFlight ? activeFlight.timeline.slice(0, eventIndex + 1) : phase === 'result' ? result?.timeline ?? [] : [];
  const event = activeFlight?.timeline[eventIndex];
  const flightPart: BrunoConfigKey = event?.phase === 'downlink' ? 'navigation' : event?.phase === 'acquisition' ? 'payload' : event?.phase === 'transfer' ? 'propulsion' : 'launcher';
  const riveStage: MissionSequenceStage = phase === 'result' ? result?.outcome === 'success' ? 4 : result?.outcome === 'invalid' ? 6 : 5 : phase === 'launch' ? event?.phase === 'downlink' ? 3 : event?.phase === 'acquisition' ? 2 : 1 : 0;
  const title = phase === 'briefing' ? mission.name : phase === 'hangar' ? 'Hangar de missão'
    : phase === 'launch' ? 'Operação da missão' : outcomeTitle[result!.outcome];
  const activeChoice = BRUNO_CHOICES[part].find(option => option.id === config[part])!;
  const partIndex = partKeys.indexOf(part);
  const nextPart = partKeys[partIndex + 1];
  const loadout = inventoryAssembly?.loadout;
  const dataVolume = preview?.dataSizeMb ? `${preview.dataSizeMb} MB por registro` : '';
  const systemPrediction = preview ? {
    launcher: { summary: `${preview.maxMassKg} kg de capacidade`, detail: `A montagem pesa ${preview.massKg} kg${preview.maxSlots === undefined ? '.' : ` e o lançador oferece ${preview.maxSlots} encaixes.`}` },
    propulsion: { summary: `chegada em ${preview.travelDays} dias`, detail: `O prazo é de ${mission.deadlineDays} dias.` },
    energy: { summary: `bateria de ${preview.initialEnergyWh} Wh`, detail: `Restam ${preview.acquisitionEnergyWh} Wh para coleta após o consumo previsto.` },
    protection: { summary: `proteção de ${activeChoice.massKg} kg`, detail: mission.insulationSavingWh > 0 ? `Restam ${preview.acquisitionEnergyWh} Wh para coleta.` : '' },
    navigation: { summary: `janela de ${preview.linkCapacityMb} MB`, detail: dataVolume ? `Cada registro ocupa ${preview.dataSizeMb} MB.` : '' },
    payload: {
      summary: preview.maxSlots === undefined ? dataVolume : `${preview.usedSlots} de ${preview.maxSlots} encaixes ocupados`,
      detail: preview.maxSlots === undefined ? '' : dataVolume ? `Cada registro ocupa ${preview.dataSizeMb} MB.` : 'Equipe instrumentos para produzir registros.',
    },
  }[part] : null;
  const systemReadout = systemPrediction ? `${systemPrediction.summary}. ${systemPrediction.detail}`.trim() : '';
  const predictionLabel = comparisonOpen ? 'Previsão do plano B' : 'Previsão da montagem';
  const lowBalance = Boolean(snapshot && preview?.outcome !== 'invalid' && snapshot.inventory.balance < BRUNO_LAUNCH_FEE);
  const missing = loadout ? mission.requiredInstruments.filter(needed => !loadout.some(unit => unit.instrumentId === needed)) : [];
  const reservedElsewhere = Object.entries(snapshot?.inventory.reservations ?? {}).filter(([missionId]) => missionId !== id).flatMap(([, units]) => units);
  const toBuy = missing.filter(needed => !snapshot?.inventory.items.some(unit => unit.instrumentId === needed && !reservedElsewhere.includes(unit.id)));
  const showInstrumentGuide = phase === 'hangar' && !resumable && missing.length > 0;
  const showShopShortcut = showInstrumentGuide && Boolean(onShop) && toBuy.length > 0;
  const neededSlots = mission.requiredInstruments.reduce((total, instrument) => total + BRUNO_INSTRUMENTS[instrument].slots, 0);
  const launcherSlots = BRUNO_LAUNCHER_SLOTS[config.launcher];
  const missingWarning = preview && loadout?.length === 0 && preview.outcome !== 'invalid'
    ? `Uma partida sem instrumentos custa ${BRUNO_LAUNCH_FEE} créditos e produz zero registros.` : '';
  const instrumentGuide = toBuy.length > 0
    ? `Compre ${toBuy.map(instrument => BRUNO_INSTRUMENTS[instrument].label).join(' e ')}.`
    : missing.length ? `Equipe ${missing.map(instrument => BRUNO_INSTRUMENTS[instrument].label).join(' e ')} em Instrumento.` : '';
  const requiredSlotsMessage = missing.length > 0 && neededSlots > launcherSlots
    ? `A carga da missão precisa de ${neededSlots} encaixes. O lançador atual tem ${launcherSlots}.` : '';
  const checks = preview?.diagnostics.filter(diagnostic => missing.length === 0 || !['PAYLOAD_MISSING', 'PAYLOAD_MISMATCH'].includes(diagnostic.code)) ?? [];
  const budgetPart = checks.some(check => check.code === 'BUDGET_LIMIT') ? partKeys.find(key => {
    if (key === 'payload' && loadout) return false;
    const selected = BRUNO_CHOICES[key].find(choice => choice.id === config[key]);
    return selected && BRUNO_CHOICES[key].some(choice => choice.credits < selected.credits);
  }) ?? 'launcher' : 'launcher';
  const selectedLabel = part === 'payload' && loadout
    ? loadout.map(unit => BRUNO_INSTRUMENTS[unit.instrumentId].label).join(' e ') || 'Sem instrumentos'
    : activeChoice.id === 'targeted' ? mission.instrument : activeChoice.label;
  const preflightStatus = !preview ? 'Conecte-se para calcular os indicadores com a carga reservada.' : preview.outcome === 'invalid'
    ? 'Bloqueio previsto em T+0. Corrija os limites iniciais para avaliar as próximas etapas.'
    : `${comparisonOpen ? 'Plano B' : 'A montagem'} prevê ${preview.deliveredRecords} de ${preview.requiredRecords} registros válidos.`;
  const readout = phase === 'hangar'
    ? preview ? `${partLabels[part]}. ${selectedLabel}. ${predictionLabel}. ${systemReadout} Orçamento: ${preview.credits} de ${preview.budget} créditos.` : preflightStatus
    : phase === 'result' && result
      ? `${title}. Produzidos: ${result.generatedRecords}. Recebidos: ${result.receivedRecords}. Válidos: ${result.deliveredRecords} de ${result.requiredRecords}. Pontuação: ${result.score.total} de 100. ${result.diagnostics[0]?.message ?? mission.evidence}`
      : phase === 'briefing' ? `${mission.question} Parâmetros e registros simulados.` : `${event?.title ?? ''}. ${event?.message ?? ''}`;
  const libras = `${mission.name}. ${phaseLabels[phase]}. ${context[phase]} ${phase === 'hangar' ? `${instrumentGuide} ${requiredSlotsMessage} ${checks[0] ? `${checkIntro} ${checks[0].message}` : ''}` : ''} ${readout} ${inventory?.notice ?? ''}`.trim();
  const inventoryStatus = inventory ? <BrunoInventoryStatus controller={inventory} onResolved={acceptResponse} /> : null;
  return <section className="bruno-campaign" data-bruno-mission={id} data-stage={phase} aria-labelledby="bruno-title"
    data-ipe-libras-context={libras}>
    <div className="bruno-toolbar">
      <button type="button" className="bruno-action bruno-quiet" onClick={onBack}><Icon name="back" size={18}/> Missões</button>
      <R26MissionAudioControl audio={audio} />
    </div>
    <MissionSteps phase={phase} observed={observed} />
    <header className="bruno-heading">
      <p>{phase === 'briefing' ? mission.destination : mission.name}</p>
      <h1 id="bruno-title" ref={heading} tabIndex={-1}>{title}</h1>
    </header>
    {inventory && resumable && phase !== 'launch' ? <div className="bruno-attempt-resume">
      <p>Uma operação já foi registrada para esta missão.</p>
      <button type="button" className="bruno-action bruno-primary" disabled={!flightConnected} onClick={() => beginFlight(resumable.result, resumable.attemptId)}>Retomar operação</button>
      <button type="button" className="bruno-action bruno-secondary" disabled={!flightConnected} onClick={() => cancelAttempt(resumable.attemptId)}>Cancelar tentativa</button>
      {phase === 'briefing' ? inventoryStatus : null}
    </div> : null}
    {phase === 'briefing' ? <div className="bruno-briefing">
      <div className="bruno-briefing-copy">
        <h2>{mission.question}</h2>
        <p>{mission.briefing}</p>
        <details className="bruno-howto"><summary>Como jogar esta missão</summary><ol><li>{inventory ? 'Abra o hangar, compre os instrumentos na loja e use Equipar em Instrumento.' : 'Abra o hangar e escolha o instrumento.'}</li><li>Os outros sistemas já têm uma opção inicial. Quando quiser comparar uma mudança, use Revisar voo e comparar A/B.</li><li>Simule o lançamento e acompanhe o que chegou à Terra. A tentativa aparece em Meu progresso.</li></ol></details>
        <dl className="bruno-briefing-limits">
          <div><dt>Carga de referência</dt><dd>{mission.payloadKg} kg</dd></div>
          <div><dt>Limite para chegar</dt><dd>{mission.deadlineDays} dias</dd></div>
          <div><dt>Orçamento do projeto</dt><dd>{mission.budget} créditos</dd></div>
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
      {showInstrumentGuide ? <div className="bruno-instrument-guide" role="group" aria-label="Próximo passo no hangar">
        <p><strong>{instrumentGuide}</strong>{requiredSlotsMessage ? <span>{requiredSlotsMessage}</span> : null}</p>
        {showShopShortcut ? <button type="button" className="bruno-action bruno-primary" onClick={onShop}>Loja e inventário</button>
          : <button type="button" className="bruno-action bruno-primary" onClick={() => focusSystem('payload')}>Abrir instrumentos</button>}
      </div> : null}
      <CraftView id={id} config={viewingA ? baseline : assembly ?? unequipped(config)} plan={comparisonOpen ? viewingA ? 'A' : 'B' : undefined} part={part} onPart={setPart} unverified={!viewingA && !assembly} figureRef={craft} referenceOpen={referenceOpen} onReferenceToggle={setReferenceOpen}
        onEditSystem={() => focusSystem(part)} prioritizeOptions={!showInstrumentGuide} prediction={viewingA ? undefined : systemPrediction?.summary} />
      <section className="bruno-panel bruno-builder" aria-labelledby="bruno-builder-title">
        <h2 id="bruno-builder-title">Montar nave</h2>
        {comparisonOpen ? <p>Você edita o plano B. O plano A é a referência guardada.</p> : null}
        <div className="bruno-parts" id="bruno-system-controls" aria-label="Sistemas da montagem" role="group">
          {partKeys.map(key => <button type="button" className="bruno-action bruno-secondary" key={key} ref={button => { systemControls.current[key] = button; }} aria-pressed={part === key} onClick={() => focusSystem(key)}>{partLabels[key]}</button>)}
        </div>
        {part === 'payload' && inventory ? <BrunoLoadoutEditor controller={inventory} missionId={id} config={config} onShop={showShopShortcut ? undefined : onShop} onChanged={() => showPlan(false)} /> : <fieldset className="bruno-choices">
          <legend>{partLabels[part]}</legend>
          {BRUNO_CHOICES[part].map(option => <label key={option.id}>
            <input type="radio" name={`bruno-${id}-${part}`} checked={config[part] === option.id} onChange={() => select(part, option.id)} />
            <span><strong>{option.id === 'targeted' ? mission.instrument : option.label}</strong><small>{option.description}</small></span>
            <span className="bruno-part-cost">{part === 'launcher' ? `até ${mission.launcherCapacity[option.id as BrunoConfig['launcher']]} kg` : `${option.massKg} kg`} · {option.credits} créditos</span>
          </label>)}
        </fieldset>}
        <p className="bruno-system-readout" role="status">{systemReadout ? <><strong>{predictionLabel}</strong> · {systemReadout}</> : null}</p>
        <div className="bruno-system-actions">
          <button className="bruno-action bruno-secondary" type="button" aria-controls="bruno-craft-view" onClick={() => inspectPlan(false)}>Ver esta escolha na nave</button>
          {nextPart ? <button className="bruno-action bruno-quiet" type="button" onClick={() => focusSystem(nextPart)}>Próximo sistema<span className="sr-only"> · {partLabels[nextPart]}</span><Icon name="arrow" size={16} /></button> : null}
        </div>
        <section className="bruno-preflight" aria-labelledby="bruno-preflight-title">
          <h3 id="bruno-preflight-title">Verificação antes de lançar</h3>
          <p id="bruno-preflight-status" data-outcome={preview?.outcome}>{preflightStatus}</p>
          {checks.length > 0 ? <p>{checkIntro}</p> : null}
          {checks.length || missing.length ? <ul className="bruno-preflight-issues" role="list">
            {missing.length ? <li><div><strong>Instrumentos pendentes</strong><p>{instrumentGuide}{toBuy.length > 0 ? ' Volte ao hangar e use Equipar em Instrumento.' : ''}</p></div></li> : null}
            {requiredSlotsMessage && !checks.some(check => check.code === 'SLOT_LIMIT') ? <li>
              <div><strong>Encaixes necessários</strong><p>{requiredSlotsMessage}</p></div>
              <button type="button" className="bruno-action bruno-quiet" onClick={() => focusSystem('launcher')}>Rever encaixes</button>
            </li> : null}
            {checks.map(check => {
              const remedy = check.code === 'BUDGET_LIMIT'
                ? { label: 'Orçamento do projeto', action: 'Rever custo', part: budgetPart }
                : diagnosticActions[check.code];
              return <li key={check.code}>
                <div>{remedy ? <strong>{remedy.label}</strong> : null}<p>{check.message}</p></div>
                {remedy ? <button type="button" className="bruno-action bruno-quiet" onClick={() => focusSystem(remedy.part)}>{remedy.action}</button> : null}
              </li>;
            })}
          </ul> : null}
          {preview ? <details className="bruno-disclosure"><summary>{comparisonOpen ? 'Indicadores do plano B' : 'Indicadores da montagem'}</summary>
            <dl className="bruno-readout" aria-label="Indicadores do plano">
              <div><dt>Massa transportada</dt><dd data-limit={preview.massKg > preview.maxMassKg}>{preview.massKg} / {preview.maxMassKg} kg</dd></div>
              <div><dt>Orçamento do projeto</dt><dd data-limit={preview.credits > preview.budget}>{preview.credits} / {preview.budget} créditos</dd></div>
              <div><dt>Energia para coleta</dt><dd>{preview.acquisitionEnergyWh} Wh</dd></div>
              <div><dt>Enlace da janela</dt><dd>{preview.linkCapacityMb} MB</dd></div>
              <div><dt>Chegada estimada</dt><dd data-limit={preview.travelDays > mission.deadlineDays}>{preview.travelDays} / {mission.deadlineDays} dias</dd></div>
              <div><dt>Volume por registro</dt><dd>{preview.dataSizeMb} MB</dd></div>
              {preview.maxSlots !== undefined ? <div><dt>Encaixes da carga</dt><dd data-limit={Number(preview.usedSlots) > preview.maxSlots}>{preview.usedSlots} / {preview.maxSlots}</dd></div> : null}
            </dl>
          </details> : null}
        </section>
        {inventory ? <div className="bruno-wallet-note">
          <p>O orçamento limita a montagem. Cada partida aprovada usa {BRUNO_LAUNCH_FEE} créditos da carteira e um ciclo por unidade equipada.</p>
          {lowBalance ? <p>Saldo insuficiente para uma partida. Abra a loja para revisar suas unidades e a carteira.</p> : null}
          {missingWarning ? <p className="bruno-launch-warning" id="bruno-launch-warning">{missingWarning}</p> : null}
        </div> : null}
        {inventoryStatus}
        <div className="bruno-shop-actions">
          {inventory && onShop && !showShopShortcut && part !== 'payload' ? <button type="button" className="bruno-action bruno-secondary" onClick={onShop}>Loja e inventário</button> : null}
          <button type="button" className="bruno-action bruno-secondary" disabled={!preview} aria-expanded={comparisonOpen} onClick={() => { setComparisonOpen(value => !value); showPlan(false); if (!comparisonOpen) onInspect?.(); }}>Revisar voo e comparar A/B</button>
          <button type="button" className={`bruno-action ${showInstrumentGuide ? 'bruno-secondary' : 'bruno-primary'}`} aria-describedby={missingWarning ? 'bruno-launch-warning' : 'bruno-preflight-status'} disabled={!preview || !flightConnected || !!resumable || lowBalance} onClick={launch}>Simular lançamento <Icon name="play" size={18}/></button>
        </div>
      </section>
    </div> : null}
    {phase === 'hangar' && comparisonOpen && preview ? <BrunoFlightReview a={baselineResult} b={preview} viewingA={viewingA} onView={inspectPlan} onSave={() => { setBaseline(preview.config); showPlan(true); }} /> : null}
    {phase === 'launch' && event && activeFlight ? <div className="bruno-operations">
      <section className="bruno-panel bruno-operation-panel" aria-label="Operação da missão">
        <div aria-live="polite" data-state={event.state}>
          <p className="bruno-operation-time">{timeLabel(event.timeS)} · tempo acelerado</p>
          <h2>{event.title}</h2><p>{event.message}</p>
          {activeFlight.diagnostics.filter(diagnostic => diagnostic.timeS === event.timeS).map(diagnostic => <p className="bruno-operation-cause" key={diagnostic.code}>{diagnostic.message}</p>)}
        </div>
        {inventoryStatus}
        <div className="bruno-craft-controls">
          <button className="bruno-action bruno-secondary" type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? 'Continuar operação' : 'Pausar operação'}</button>
          <button className="bruno-action bruno-secondary" type="button" disabled={eventIndex === activeFlight.timeline.length - 1 && !flightConnected} onClick={() => { const attempt = pending.current; if (!attempt) return; if (eventIndex < attempt.timeline.length - 1) setEventIndex(index => Math.min(index + 1, attempt.timeline.length - 1)); else complete(); }}>Próximo evento</button>
          <button className="bruno-action bruno-secondary" type="button" disabled={!flightConnected} onClick={complete}>Ir ao resultado</button>
          {pendingAttemptId.current ? <button className="bruno-action bruno-quiet" type="button" disabled={!flightConnected} onClick={() => { if (pendingAttemptId.current) cancelAttempt(pendingAttemptId.current); }}>Cancelar tentativa</button> : null}
        </div>
      </section>
      <CraftView id={id} config={activeFlight.config} part={flightPart} onPart={() => {}} flightEvent={event} flightResult={activeFlight} paused={paused} />
    </div> : null}
    {phase === 'result' && result ? <>{inventoryStatus}<MissionReport id={id} result={result} confirmed={confirmedResult} onEdit={() => { setBaseline(result.config); setComparisonOpen(true); setViewingA(false); setPhase('hangar'); }} /><BrunoRoleReview key={JSON.stringify(result.config)} result={result} onReview={onRoleReview} /></> : null}
    {phase !== 'briefing' ? <details className="bruno-disclosure bruno-sequence-disclosure"><summary>Animação das etapas</summary><MissionSequenceRive stage={riveStage} /></details> : null}
    {storageIssue ? <p role="status">Não foi possível guardar o rascunho neste aparelho. O plano continua disponível nesta tela.</p> : draftKey && phase === 'hangar' ? <p className="bruno-draft-note">Montagem guardada neste aparelho para sua participação.</p> : null}
  </section>;
}
