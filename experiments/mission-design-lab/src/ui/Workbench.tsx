import { useEffect, useRef, useState } from 'react';
import { CATALOG, CONFIG_KEYS, PHYSICS, getConfigTotals, getScenario } from '../core/catalog.ts';
import type { ConfigKey, MissionConfig, ScenarioId } from '../core/contracts.ts';
import { MISSION_CURRICULUM } from '../lab/mission-curriculum.ts';
import { Icon } from './Icon.tsx';
import type { IconName } from './Icon.tsx';
import { Scene } from './Scene.tsx';
import { CERRADO_FLIGHT_PATH, ScientificCommand, ScientificFlightPath, focusCockpitSection } from './ScientificCockpit.tsx';
import type { CerradoStage } from './ScientificCockpit.tsx';
import { MissionPurpose, MissionExperiment } from './MissionLearning.tsx';
import { PreflightReview } from './PreflightReview.tsx';
import { CONFIG_HINTS, CONFIG_LABELS, bits, number } from './format.ts';
import { CrewReview, useCrewReview } from './CrewReview.tsx';
import { PREDICTIONS } from './learning.ts';
import type { Prediction } from './learning.ts';
import './equipment-workbench.css';

type WorkbenchStage = Extract<CerradoStage, 'briefing' | 'assembly' | 'verification'>;

const ICONS: Record<ConfigKey, IconName> = { battery: 'battery', panel: 'sun', processing: 'chip', radio: 'signal', buffer: 'memory', policy: 'route' };
const WHY: Record<ConfigKey, string> = {
  battery: 'Mais energia armazenada aumenta a autonomia, mas também a massa. Confira a potência de descarga: uma bateria ainda carregada pode não atender ao pico de consumo.',
  panel: 'O painel maior ajuda a recuperar a energia entre operações, mas ocupa parte do limite de massa. Durante um eclipse, os dois painéis deixam de gerar.',
  processing: 'Calcular o índice a bordo reduz cada lote de 180 para 60 Mbit. Essa economia de dados exige mais potência no processamento: o pico sobe de 26 para 38 W.',
  radio: 'O rádio rápido transmite 2,5 vezes mais dados por segundo. Em troca, a potência total durante a transmissão sobe de 16 para 26 W.',
  buffer: 'A memória guarda os registros até o contato com a estação. Sem espaço para um lote completo, esse lote é perdido. Mais memória não cria tempo de transmissão.',
  policy: 'Transmitir em todos os contatos esvazia a fila mais cedo. Esperar o último contato concentra a operação em uma única oportunidade e pode deixar dados a bordo.',
};
function Gauge({ label, value, limit, unit }: { label: string; value: number; limit: number; unit: string }) {
  const exceeded = value > limit;
  return <div className={`envelope-gauge ${exceeded ? 'over-limit' : ''}`}><div><span>{label}</span><strong>{number(value)} <small>/ {number(limit)} {unit}</small></strong></div><div className="gauge-track" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={limit} aria-valuenow={Math.min(value, limit)} aria-valuetext={`${number(value)} de ${number(limit)} ${unit}${exceeded ? ', limite excedido' : ''}`}><span style={{ width: `${Math.min(100, value / limit * 100)}%` }} /></div><p>{exceeded ? <><Icon name="warning" size={13} /> Limite excedido em {number(value - limit)} {unit}</> : <>{number(limit - value)} {unit} disponíveis</>}</p></div>;
}
export interface WorkbenchProps {
  config: MissionConfig; scenarioId: ScenarioId;
  onChoice: (key: ConfigKey, value: string) => void;
  onScenario: (id: ScenarioId) => void;
  prediction: Prediction | ''; onPrediction: (value: Prediction | '') => void;
  rationale: string; onRationale: (value: string) => void;
  firstAttempt: boolean; onLaunch: () => void; onSave: () => void;
  busy: boolean; blocked: boolean; saving: boolean; onCancel: () => void;
}
export function Workbench({ config, scenarioId, onChoice, onScenario, prediction, onPrediction, rationale, onRationale, firstAttempt, onLaunch, onSave, busy, blocked, saving, onCancel }: WorkbenchProps) {
  const [active, setActive] = useState<ConfigKey>('battery');
  const [guide, setGuide] = useState(false);
  const [lastChange, setLastChange] = useState<{ key: ConfigKey; before: MissionConfig; after: MissionConfig; scenarioId: ScenarioId } | null>(null);
  const [appliedExample, setAppliedExample] = useState('');
  const [stage, setStage] = useState<WorkbenchStage>(firstAttempt ? 'briefing' : 'assembly');
  const heading = useRef<HTMLHeadingElement>(null);
  const assembly = useRef<HTMLHeadingElement>(null);
  const dossier = useRef<HTMLHeadingElement>(null);
  const briefing = useRef<HTMLDetailsElement>(null);
  const crewBrief = useRef<HTMLDetailsElement>(null);
  const predictionControl = useRef<HTMLSelectElement>(null);
  const rationaleControl = useRef<HTMLTextAreaElement>(null);
  const launchControl = useRef<HTMLButtonElement>(null);
  const cancelControl = useRef<HTMLButtonElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const scenario = getScenario(scenarioId);
  const crew = useCrewReview(JSON.stringify({ config, scenarioId, prediction, rationale }));
  const totals = getConfigTotals(config);
  const predictionReady = prediction !== '' && rationale.trim().length >= 8;
  const excess = [
    totals.massKg > scenario.maxMassKg ? 'massa' : '',
    totals.credits > scenario.budget ? 'orçamento' : '',
  ].filter(Boolean);
  const envelopeExceeded = excess.length > 0;
  const envelopeStatus = envelopeExceeded ? `Limite excedido em ${excess.join(' e ')}. A execução registra essas restrições.` : 'Massa e orçamento dentro dos limites.';
  const currentStage = busy ? 'operation' : stage;
  const selectedChoice = CATALOG[active].find(item => item.id === config[active])!;
  const inspectSubsystem = active === 'battery' || active === 'panel' ? 'energy'
    : active === 'radio' || active === 'policy' ? 'communications' : 'instrument';
  const battery = CATALOG.battery.find(v => v.id === config.battery)!;
  const panel = CATALOG.panel.find(v => v.id === config.panel)!;
  const processing = CATALOG.processing.find(v => v.id === config.processing)!;
  const radio = CATALOG.radio.find(v => v.id === config.radio)!;
  const buffer = CATALOG.buffer.find(v => v.id === config.buffer)!;
  const demandW = Math.max(((processing.totalLoadW ?? 0) - (panel.watts ?? 0) * PHYSICS.workPanelFactorPercent / 100) / (PHYSICS.dischargeEfficiencyPercent / 100), (radio.totalLoadW ?? 0) / (PHYSICS.dischargeEfficiencyPercent / 100));
  const peakRisk = demandW > (battery.maxDischargeW ?? 0);
  const currentChange = lastChange && lastChange.scenarioId === scenarioId && CONFIG_KEYS.every(key => lastChange.after[key] === config[key]) ? lastChange : null;
  const resources = (value: MissionConfig) => {
    const envelope = getConfigTotals(value);
    return [
      { label: 'Massa total', value: envelope.massKg, unit: 'kg' },
      { label: 'Orçamento usado', value: envelope.credits, unit: 'créditos' },
      { label: 'Energia armazenável', value: CATALOG.battery.find(item => item.id === value.battery)!.capacityWh!, unit: 'Wh' },
      { label: 'Geração nominal', value: CATALOG.panel.find(item => item.id === value.panel)!.watts!, unit: 'W' },
      { label: 'Memória', value: CATALOG.buffer.find(item => item.id === value.buffer)!.capacityBits! / 1_000_000, unit: 'Mbit' },
    ];
  };
  const beforeResources = currentChange ? resources(currentChange.before) : null;
  const librasContext = `Bancada do Cerrado. Sistema: ${CONFIG_LABELS[active]}. Opção selecionada: ${CATALOG[active].find(item => item.id === config[active])!.label}. ${WHY[active]} Projeto atual: ${number(totals.massKg)} quilogramas, ${number(totals.credits)} créditos, bateria de ${number(battery.capacityWh!)} watt-hora, geração nominal de ${number(panel.watts!)} watts e memória de ${bits(buffer.capacityBits!)}. Escolher uma peça atualiza o projeto, sem executar a missão. Os registros científicos históricos não mudam.`.slice(0, 900);
  useEffect(() => {
    if (busy) focusCockpitSection(cancelControl.current);
  }, [busy]);

  function goToStage(next: CerradoStage) {
    if (next === 'operation' || next === 'result') return;
    setStage(next);
    if (next === 'briefing' && briefing.current) {
      briefing.current.open = true;
      focusCockpitSection(briefing.current.querySelector('summary'));
    } else focusCockpitSection(next === 'assembly' ? assembly.current : dossier.current);
  }

  function focusPendingReview() {
    if (!predictionReady) focusCockpitSection(prediction ? rationaleControl.current : predictionControl.current);
    else if (!crew.ready && crewBrief.current) {
      crewBrief.current.open = true;
      focusCockpitSection(crewBrief.current.querySelector('input:not(:checked)'));
    } else focusCockpitSection(launchControl.current);
  }

  function choose(key: ConfigKey, value: string) {
    if (config[key] === value) return;
    setLastChange({ key, before: { ...config }, after: { ...config, [key]: value }, scenarioId });
    setStage('assembly');
    onChoice(key, value);
  }
  return <div className="scientific-cockpit cerrado-cockpit">
    <div className="page-heading workbench-heading">
      <div><p className="eyebrow">Cerrado · Observação da Terra</p><h1 id="workbench-title" ref={heading} tabIndex={-1}>Monte sua <em>missão.</em></h1><p className="page-intro">{MISSION_CURRICULUM.cerrado.question} Entregue os seis registros válidos ao solo.</p></div>
    </div>
    <ScientificFlightPath stages={CERRADO_FLIGHT_PATH} current={currentStage} onSelect={goToStage} unavailable={step => busy || step === 'operation' || step === 'result'} />
    {currentStage === 'briefing' ? <ScientificCommand title="Objetivo de voo" detail="Prepare o satélite para processar e transmitir os seis registros de vegetação.">
      <button className="button button-primary" type="button" onClick={() => goToStage('assembly')}>Ir à montagem <Icon name="arrow" /></button>
    </ScientificCommand> : currentStage === 'assembly' ? <ScientificCommand title={`${CONFIG_LABELS[active]} · ${selectedChoice.label}`} detail={WHY[active]}>
      <button className="button button-primary" type="button" onClick={() => goToStage('verification')}>Conferir projeto <Icon name="arrow" /></button>
    </ScientificCommand> : currentStage === 'verification' ? <ScientificCommand
      title={!predictionReady ? 'Previsão pendente' : !crew.ready ? `${4 - crew.roles.length} revisões da equipe pendentes` : envelopeExceeded ? 'Projeto com limites a revisar' : 'Pronto para executar'}
      detail={!predictionReady ? `Escolha sua previsão e explique por quê. ${envelopeStatus}` : `${envelopeStatus} A vista de lançamento ilustra o envelope de integração.`}
    >
      <button className="button button-primary" type="button" onClick={focusPendingReview} disabled={blocked}>{!predictionReady ? 'Ir à hipótese' : !crew.ready ? 'Revisar com a equipe' : 'Ir à confirmação'} <Icon name="arrow" /></button>
    </ScientificCommand> : <ScientificCommand title="Executando a simulação" detail="A nave abaixo mostra o projeto enviado ao simulador. A operação registrada aparece quando o cálculo terminar.">
      <button className="button button-secondary" type="button" ref={cancelControl} onClick={() => { goToStage('verification'); onCancel(); }}>Cancelar execução</button>
    </ScientificCommand>}
    {appliedExample ? <p className="context-guide applied-example-notice" role="status"><strong>Escolhas do ensaio copiadas · {appliedExample}.</strong> Revise os sistemas, registre sua previsão e execute sua tentativa.</p> : null}
    <div className="cerrado-flight-deck">
      <div className="assembly-scene scientific-cockpit-viewport scientific-focus-target" ref={scene} tabIndex={-1} role="group" aria-label={`Visualização de ${CONFIG_LABELS[active]}`} data-ipe-libras-context={librasContext}>
        <Scene compact variant="hangar" config={config} scenarioId={scenarioId}
          segment={currentStage === 'verification' || busy ? 'launch' : undefined}
          inspectSubsystem={currentStage === 'verification' || busy ? 'overview' : inspectSubsystem} />
      </div>
      <div>
        <div className="scenario-switch" role="group" aria-label="Condição da missão">
          <button type="button" aria-pressed={scenarioId === 'long-contact'} onClick={() => { setStage('assembly'); onScenario('long-contact'); }} disabled={blocked}>Contato longo <span>2 × 10 min</span></button>
          <button type="button" aria-pressed={scenarioId === 'short-contact'} onClick={() => { setStage('assembly'); onScenario('short-contact'); }} disabled={blocked}>Contato curto <span>2 × 4 min</span></button>
        </div>
        <details className="game-brief-disclosure" ref={briefing}><summary className="scientific-focus-target">Briefing científico · o que vamos aprender</summary><MissionPurpose id="cerrado" /></details>
        <details className="game-brief-disclosure" ref={crewBrief}><summary>Tripulação · jogar sozinho ou com até quatro pessoas</summary><CrewReview crew={crew} /></details>
        <button className="text-button" type="button" onClick={() => setGuide(!guide)} aria-expanded={guide}><Icon name="info" size={16} /> {guide ? 'Fechar orientação' : 'Como tomar a primeira decisão'}</button>
        {guide ? <div className="context-guide" role="region" aria-label="Orientação do hangar"><strong>O que pode impedir os dados de chegar?</strong><p>Selecione um subsistema, compare as duas opções e observe os limites do projeto. Antes de executar, registre sua previsão. No cenário curto, investigue o relatório e experimente outro projeto.</p><button className="text-button" type="button" onClick={() => setGuide(false)}>Entendi <Icon name="check" size={15} /></button></div> : null}
      </div>
    </div>
    <div className="hangar-layout" data-ipe-libras-context={librasContext}>
      <section className="hangar-systems" aria-labelledby="systems-title"><div className="systems-heading"><h2 id="systems-title" className="scientific-focus-target" ref={assembly} tabIndex={-1}>Subsistemas</h2></div><nav aria-label="Escolher subsistema">{CONFIG_KEYS.map((key, i) => <button key={key} type="button" aria-pressed={active === key} onClick={() => { setActive(key); setStage('assembly'); }} className={`system-tab ${active === key ? 'active' : ''}`}><span className="system-icon"><Icon name={ICONS[key]} size={21} /></span><span><small>0{i + 1}</small><strong>{CONFIG_LABELS[key]}</strong><em>{CATALOG[key].find(item => item.id === config[key])?.label}</em></span><Icon name="chevron" size={14} /></button>)}</nav><div className="systems-foot"><Icon name="layers" size={18} /><p><strong>64 combinações.</strong><br />Uma solução exige sistemas que funcionem juntos.</p></div></section>
      <section className="assembly-column" aria-label="Montagem e escolha dos módulos">
        <div className="module-editor"><div className="module-title"><div><p className="eyebrow">SISTEMA 0{CONFIG_KEYS.indexOf(active) + 1}</p><h2>{CONFIG_LABELS[active]}</h2></div><Icon name={ICONS[active]} size={26} /></div><p className="module-hint">{CONFIG_HINTS[active]}</p>
          {CONFIG_KEYS.map(key => <fieldset className="module-options-fieldset" hidden={active !== key} key={key} disabled={blocked}><legend className="sr-only">{CONFIG_LABELS[key]}</legend><div className="module-options">{CATALOG[key].map((choice, index) => <label key={choice.id} className={`module-option ${config[key] === choice.id ? 'selected' : ''}`}><input type="radio" name={key} value={choice.id} checked={config[key] === choice.id} onChange={() => choose(key, choice.id)} /><span className="module-option-top"><span>OPÇÃO 0{index + 1}</span><span className="selection-circle">{config[key] === choice.id ? <Icon name="check" size={13} /> : null}</span></span><strong>{choice.label}</strong><span className="module-option-description">{choice.description}</span><span className="module-facts"><b>{number(choice.massKg)} <small>kg</small></b><b>{choice.credits} <small>créditos</small></b></span></label>)}</div></fieldset>)}
          <button className="text-button equipment-inspect-link" type="button" onClick={() => focusCockpitSection(scene.current)}>{active === 'policy' ? 'Inspecionar agenda de transmissão' : 'Inspecionar esta escolha na nave'} <Icon name="arrow" size={16} /></button>
          <div className="tradeoff-note"><Icon name="route" size={19} /><div><strong>O que essa escolha muda?</strong><p>{WHY[active]}</p></div></div>
        </div>
        <section className="workbench-change" aria-label="Impacto da última escolha no Cerrado"><p role="status">{currentChange ? <><strong>Última escolha: {CONFIG_LABELS[currentChange.key]}.</strong> {CATALOG[currentChange.key].find(item => item.id === currentChange.before[currentChange.key])!.label} → {CATALOG[currentChange.key].find(item => item.id === currentChange.after[currentChange.key])!.label}. {WHY[currentChange.key]}</> : <><strong>Uma peça muda o projeto inteiro.</strong> Escolha outra opção para comparar os recursos antes e depois. A nave mostra a configuração em edição; a seleção não executa a missão.</>}</p>{beforeResources ? <dl>{resources(config).map((resource, index) => { const previous = beforeResources[index]!.value; return <div key={resource.label}><dt>{resource.label}</dt><dd><span className="equipment-before">{number(previous)} → </span><strong>{number(resource.value)} {resource.unit}</strong><small>{resource.value === previous ? 'Sem alteração' : `${resource.value > previous ? '+' : '−'}${number(Math.abs(resource.value - previous))} ${resource.unit}`}</small></dd></div>; })}</dl> : null}<p className="equipment-model-note">Este é o efeito nas capacidades do projeto. A execução verifica o efeito sobre a entrega dos registros históricos.</p></section>
        <PreflightReview config={config} scenario={scenario} />
      </section>
      <aside className="project-dossier" aria-labelledby="dossier-title"><div className="dossier-top"><span className="eyebrow">REVISÃO PRÉ-VOO</span><Icon name="satellite" size={23} /></div><h2 id="dossier-title" className="scientific-focus-target" ref={dossier} tabIndex={-1}>Checagem do projeto</h2><p className="dossier-scenario">{scenario.title} · 180 min simulados</p><Gauge label="Massa total" value={totals.massKg} limit={scenario.maxMassKg} unit="kg" /><Gauge label="Orçamento" value={totals.credits} limit={scenario.budget} unit="créditos" />
        <dl className="capacity-readings"><div><dt>Bateria / geração nominal</dt><dd>{battery.capacityWh} Wh <span>·</span> {panel.watts} W</dd></div><div><dt>Memória / dados por lote</dt><dd>{bits(buffer.capacityBits ?? 0)} <span>/</span> {bits(processing.bitsPerRecord ?? 0)}</dd></div></dl>
        {peakRisk ? <p className="preflight-risk" role="status"><Icon name="warning" size={17} /><span><strong>Atenção à potência.</strong> Há operação com demanda na bateria acima de {battery.maxDischargeW} W. Confira bateria, processamento e rádio.</span></p> : <p className="preflight-neutral"><Icon name="info" size={15} /> Massa e orçamento são só o começo. A execução verifica energia e entrega.</p>}
        <div className="prediction-block"><span className="small-label">SUA HIPÓTESE DE ENGENHARIA</span><h3>{firstAttempt ? 'Qual será o gargalo?' : 'O que você espera agora?'}</h3><p>Registre sua previsão para comparar com o relatório.</p><label htmlFor="prediction">Minha previsão</label><select id="prediction" className="scientific-focus-target" ref={predictionControl} value={prediction} onChange={event => { setStage('verification'); onPrediction(event.target.value as Prediction | ''); }} disabled={blocked}><option value="">Escolha uma hipótese</option>{PREDICTIONS.map(item => <option value={item.id} key={item.id}>{item.label}</option>)}</select><label htmlFor="rationale">Por quê?</label><textarea id="rationale" className="scientific-focus-target" ref={rationaleControl} rows={3} maxLength={1000} value={rationale} onChange={event => { setStage('verification'); onRationale(event.target.value); }} placeholder="Ex.: o contato pode ser curto para transmitir todos os dados." aria-describedby="prediction-help" disabled={blocked} /><p id="prediction-help" className="field-help">{predictionReady ? 'Hipótese pronta. Vamos colocá-la à prova.' : 'Escolha uma hipótese e escreva pelo menos 8 caracteres.'}</p></div>
        <button className="button button-primary launch-button scientific-focus-target" type="button" ref={launchControl} onClick={() => { setStage('verification'); onLaunch(); }} disabled={blocked || !predictionReady || !crew.ready}>{busy ? <><span className="loading-spinner" /> Executando missão…</> : <>{envelopeExceeded ? 'Verificar este projeto' : 'Registrar e executar'} <Icon name="arrow" /></>}</button>{envelopeExceeded ? <p className="field-help limit-help">Este projeto excede os limites. A execução vai registrar as restrições.</p> : null}{!busy ? <button className="text-button save-button" type="button" onClick={onSave} disabled={saving}><Icon name="save" size={15} /> {saving ? 'Salvando projeto…' : 'Salvar projeto neste navegador'}</button> : null}
      </aside>
    </div>
    <MissionExperiment id="cerrado" disabled={busy || blocked} onApply={trial => { if (trial.kind !== 'cerrado') return; onScenario(trial.result.scenarioId); for (const key of CONFIG_KEYS) onChoice(key, trial.result.config[key]); setActive('processing'); setStage('assembly'); setAppliedExample(trial.label); window.setTimeout(() => { heading.current?.scrollIntoView({ behavior: 'auto', block: 'start' }); heading.current?.focus({ preventScroll: true }); }, 0); }} />
    <div className="fixed-brief"><Icon name="info" size={18} /><p><strong>Sobre esta campanha:</strong> o lançador, o perfil orbital e os seis registros históricos são fixos. Capacidades, massas, créditos e agendas são parâmetros didáticos. Cada configuração muda os cálculos da missão; a visualização 3D apenas ilustra a montagem.</p></div>
  </div>;
}
