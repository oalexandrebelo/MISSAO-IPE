import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { BRUNO_CHOICES, BRUNO_MISSIONS, DEFAULT_BRUNO_CONFIG, simulateBrunoMission } from '../lab/bruno-missions.ts';
import type { BrunoConfig, BrunoConfigKey, BrunoDecision, BrunoMissionId, BrunoResult } from '../lab/bruno-missions.ts';
import { canRenderWebGL } from './Scene.tsx';
import { Icon } from './Icon.tsx';
import './bruno-campaign.css';

const HangarScene = lazy(() => import('./BrunoHangarScene.tsx'));
const ReferenceCanvas = lazy(() => import('./OrbitalScene.tsx').then(module => ({ default: module.NASAAssetCanvas })));
const baseUrl = import.meta.env?.BASE_URL ?? './';
const references = {
  iss: { file: 'iss-carbajal-b.glb', name: 'Estação Espacial Internacional', credit: 'NASA / Michael D. Carbajal', url: 'https://science.nasa.gov/3d-resources/international-space-station-iss-b/' },
  moon: { file: 'lro-meaney-a.glb', name: 'Lunar Reconnaissance Orbiter', credit: 'NASA / Christopher R. Meaney', url: 'https://science.nasa.gov/3d-resources/lunar-reconnaissance-orbiter-a/' },
  mars: { file: 'mars-2020-perseverance.glb', name: 'Perseverance', credit: 'NASA / JPL-Caltech', url: 'https://science.nasa.gov/3d-resources/mars-2020-perseverance-rover/' },
} as const;
const partLabels: Record<BrunoConfigKey, string> = {
  launcher: 'Lançador', propulsion: 'Propulsão', energy: 'Energia', protection: 'Proteção',
  navigation: 'Navegação e enlace', payload: 'Instrumento',
};
const partKeys = Object.keys(partLabels) as BrunoConfigKey[];
const steps = { briefing: 'Briefing', hangar: 'Hangar', launch: 'Lançamento', result: 'Relatório' } as const;
type Phase = keyof typeof steps;

const context: Record<Phase, string> = {
  briefing: 'Leia a pergunta científica e os requisitos do destino. Abra o hangar para configurar a nave.',
  hangar: 'Escolha lançador, propulsão, energia, proteção, navegação e instrumento. Confira massa, orçamento, energia e enlace antes de simular.',
  launch: 'A tentativa está em execução. Você pode seguir diretamente para o resultado.',
  result: 'Compare registros produzidos, recebidos e válidos. Leia o primeiro limite observado e redesenhe a nave para testar outra decisão.',
};
const outcomeTitle = { success: 'Missão concluída', failure: 'Missão incompleta', invalid: 'Lançamento bloqueado' };

interface Props {
  id: BrunoMissionId;
  onBack: () => void;
  onDecision?: (id: BrunoMissionId, config: BrunoConfig, decision: BrunoDecision) => void;
  onComplete?: (result: BrunoResult) => void;
}

class PreviewBoundary extends Component<{ children: ReactNode; fallback: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable(); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function CraftView({ id, config, part, onPart }: { id: BrunoMissionId; config: BrunoConfig; part: BrunoConfigKey; onPart: (key: BrunoConfigKey) => void }) {
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
    data-navigation={config.navigation} data-payload={config.payload}>
    <div className="bruno-craft-header"><strong>{referenceOpen ? reference.name : 'Sua nave'}</strong><span>{referenceOpen ? 'Referência NASA' : BRUNO_MISSIONS[id].destination}</span></div>
    <div className="bruno-craft-stage">
      {referenceOpen ? (
        referenceFailed || !available ? <p className="bruno-craft-message">O modelo 3D está indisponível neste navegador. A fonte NASA e a montagem didática continuam disponíveis.</p>
          : <PreviewBoundary fallback={<p>Modelo NASA indisponível.</p>} onUnavailable={onReferenceUnavailable}>
            <Suspense fallback={<p className="bruno-craft-message">{loadingReference}</p>}>
              <ReferenceCanvas url={`${baseUrl}models/nasa/${reference.file}`} turn={turn} tilt={.1} onLoaded={onReferenceLoaded} onUnavailable={onReferenceUnavailable} />
            </Suspense>
            {!referenceReady ? <p className="bruno-craft-message" role="status">{loadingReference}</p> : null}
          </PreviewBoundary>
      ) : available ? <PreviewBoundary fallback={fallback} onUnavailable={unavailable}>
        <Suspense fallback={fallback}><HangarScene config={config} active={part} turn={turn} onPart={onPart} onUnavailable={unavailable}/></Suspense>
      </PreviewBoundary> : fallback}
    </div>
    <div className="bruno-craft-controls">
      {available && (!referenceOpen || (referenceReady && !referenceFailed)) ? <button className="bruno-action bruno-secondary" type="button" onClick={() => setTurn(value => (value + Math.PI / 4) % (2 * Math.PI))}>Girar vista</button> : null}
      <button className="bruno-action bruno-secondary" type="button" aria-pressed={referenceOpen} onClick={() => { setReferenceReady(false); setReferenceFailed(false); setTurn(0); setReferenceOpen(value => !value); }}>
        {referenceOpen ? 'Voltar à nave' : 'Inspecionar referência NASA'}
      </button>
    </div>
    <figcaption>{referenceOpen ? <>Modelo publicado por {reference.credit}. Referência de contexto, em escala independente. <a href={reference.url}>Ver origem do modelo</a>.</>
      : <>Representação didática, fora de escala. Em edição <strong>{partLabels[part]}</strong>.</>}</figcaption>
  </figure>;
}

function timeLabel(timeS: number) {
  const days = Math.floor(timeS / 86_400);
  const hours = Math.floor((timeS % 86_400) / 3600);
  return days ? `T+${days} d${hours ? ` ${hours} h` : ''}` : 'T+0';
}

function MissionReport({ id, result, onEdit }: { id: BrunoMissionId; result: BrunoResult; onEdit: () => void }) {
  const mission = BRUNO_MISSIONS[id];
  const counts = [
    ['Produzidos', result.generatedRecords],
    ['Recebidos', result.receivedRecords],
    ['Válidos para a pergunta', result.deliveredRecords],
  ] as const;
  return <>
    <div className="bruno-report" data-outcome={result.outcome}>
      <dl className="bruno-report-counts">{counts.map(([label, count]) => <div key={label}><dt>{label}</dt><dd>{count}<span>/{result.requiredRecords}</span></dd></div>)}</dl>
      <div className="bruno-score"><strong>{result.score.total}<span>/100</span></strong><p>Pontos da missão</p></div>
    </div>
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

export function BrunoCampaign({ id, onBack, onDecision, onComplete }: Props) {
  const mission = BRUNO_MISSIONS[id];
  const [phase, setPhase] = useState<Phase>('briefing');
  const [config, setConfig] = useState<BrunoConfig>(DEFAULT_BRUNO_CONFIG);
  const [part, setPart] = useState<BrunoConfigKey>('launcher');
  const [count, setCount] = useState(3);
  const [result, setResult] = useState<BrunoResult | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const pending = useRef<BrunoResult | null>(null);
  const preview = simulateBrunoMission(id, config);
  useEffect(() => { heading.current?.focus(); }, [phase]);

  const complete = useCallback(() => {
    const attempt = pending.current;
    if (!attempt) return;
    pending.current = null;
    setResult(attempt);
    setPhase('result');
    onComplete?.(attempt);
  }, [onComplete]);
  useEffect(() => {
    if (phase !== 'launch') return;
    const timer = window.setTimeout(() => {
      if (count <= 1) complete();
      else setCount(count - 1);
    }, 850);
    return () => window.clearTimeout(timer);
  }, [count, complete, phase]);

  function select(key: BrunoConfigKey, choice: BrunoConfig[BrunoConfigKey]) {
    if (config[key] === choice) return;
    const next = { ...config, [key]: choice };
    setConfig(next);
    onDecision?.(id, next, { key, from: config[key], to: choice });
  }
  function launch() {
    if (pending.current) return;
    pending.current = preview;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (preview.outcome === 'invalid' || reducedMotion) { complete(); return; }
    setCount(3);
    setPhase('launch');
  }

  const title = phase === 'briefing' ? mission.name : phase === 'hangar' ? 'Hangar de missão'
    : phase === 'launch' ? 'Transferência iniciada' : outcomeTitle[result!.outcome];
  const activeChoice = BRUNO_CHOICES[part].find(option => option.id === config[part])!;
  const readout = phase === 'hangar'
    ? `${partLabels[part]}. ${activeChoice.id === 'targeted' ? mission.instrument : activeChoice.label}. ${activeChoice.description} Massa: ${preview.massKg} de ${preview.maxMassKg} kg. Custo: ${preview.credits} de ${preview.budget} créditos. Energia para coleta: ${preview.acquisitionEnergyWh} Wh. Enlace: ${preview.linkCapacityMb} megabytes.`
    : phase === 'result' && result
      ? `${title}. Produzidos: ${result.generatedRecords}. Recebidos: ${result.receivedRecords}. Válidos: ${result.deliveredRecords} de ${result.requiredRecords}. Pontuação: ${result.score.total} de 100. ${result.diagnostics[0]?.message ?? mission.evidence}`
      : phase === 'briefing' ? `${mission.question} Parâmetros e registros simulados.` : '';
  const libras = `${mission.name}. ${steps[phase]}. ${context[phase]} ${readout}`.trim();
  return <section className="bruno-campaign" data-bruno-mission={id} data-stage={phase} aria-labelledby="bruno-title"
    data-ipe-libras-context={libras}>
    <div className="bruno-toolbar">
      <button type="button" className="bruno-action bruno-quiet" onClick={onBack}><Icon name="back" size={18}/> Missões</button>
      <ol className="bruno-steps" aria-label="Etapas da missão">
        {(Object.keys(steps) as Phase[]).map(step => <li aria-current={phase === step ? 'step' : undefined} key={step}>{steps[step]}</li>)}
      </ol>
    </div>
    <header className="bruno-heading">
      <p>{phase === 'briefing' ? mission.destination : mission.name}</p>
      <h1 id="bruno-title" ref={heading} tabIndex={-1}>{title}</h1>
      {phase === 'hangar' ? <p className="bruno-lead">{mission.learn}</p> : null}
    </header>
    {phase === 'briefing' ? <div className="bruno-briefing">
      <div className="bruno-briefing-copy">
        <h2>{mission.question}</h2>
        <p>{mission.briefing}</p>
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
        <p>Cenário adaptado da contribuição de <a href="https://github.com/brunoassiscarvalho/missao-ipe">Bruno A Carvalho</a>.</p>
      </section>
    </div> : null}
    {phase === 'hangar' ? <div className="bruno-hangar">
      <CraftView id={id} config={config} part={part} onPart={setPart} />
      <section className="bruno-panel bruno-builder" aria-labelledby="bruno-builder-title">
        <h2 id="bruno-builder-title">Montar nave</h2>
        <div className="bruno-parts" aria-label="Sistemas da montagem" role="group">
          {partKeys.map(key => <button type="button" className="bruno-action bruno-secondary" key={key} aria-pressed={part === key} onClick={() => setPart(key)}>{partLabels[key]}</button>)}
        </div>
        <fieldset className="bruno-choices">
          <legend>{partLabels[part]}</legend>
          {BRUNO_CHOICES[part].map(option => <label key={option.id}>
            <input type="radio" name={`bruno-${id}-${part}`} checked={config[part] === option.id} onChange={() => select(part, option.id)} />
            <span><strong>{option.id === 'targeted' ? mission.instrument : option.label}</strong><small>{option.description}</small></span>
            <span className="bruno-part-cost">{part === 'launcher' ? `até ${mission.launcherCapacity[option.id as BrunoConfig['launcher']]} kg` : `${option.massKg} kg`} · {option.credits} créditos</span>
          </label>)}
        </fieldset>
        <dl className="bruno-readout" aria-label="Indicadores do plano">
          <div><dt>Massa transportada</dt><dd data-limit={preview.massKg > preview.maxMassKg}>{preview.massKg} / {preview.maxMassKg} kg</dd></div>
          <div><dt>Orçamento</dt><dd data-limit={preview.credits > preview.budget}>{preview.credits} / {preview.budget} créditos</dd></div>
          <div><dt>Energia para coleta</dt><dd>{preview.acquisitionEnergyWh} Wh</dd></div>
          <div><dt>Enlace da janela</dt><dd>{preview.linkCapacityMb} MB</dd></div>
          <div><dt>Chegada estimada</dt><dd data-limit={preview.travelDays > mission.deadlineDays}>{preview.travelDays} / {mission.deadlineDays} dias</dd></div>
          <div><dt>Volume por registro</dt><dd>{preview.dataSizeMb} MB</dd></div>
        </dl>
        <button type="button" className="bruno-action bruno-primary" onClick={launch}>Simular lançamento <Icon name="play" size={18}/></button>
      </section>
    </div> : null}
    {phase === 'launch' ? <div className="bruno-launch">
      <div className="bruno-launch-orbit" aria-hidden="true" />
      <div><p className="bruno-count" aria-live="polite">T−{count}</p><p>Executando o plano para {mission.destination}.</p></div>
      <button className="bruno-action bruno-secondary" type="button" onClick={complete}>Ir ao resultado</button>
    </div> : null}
    {phase === 'result' && result ? <MissionReport id={id} result={result} onEdit={() => setPhase('hangar')} /> : null}
  </section>;
}
