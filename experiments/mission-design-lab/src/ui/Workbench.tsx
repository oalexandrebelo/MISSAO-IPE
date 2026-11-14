import { useState } from 'react';
import { CATALOG, CONFIG_KEYS, PHYSICS, getConfigTotals, getScenario } from '../core/catalog.ts';
import type { ConfigKey, MissionConfig, ScenarioId } from '../core/contracts.ts';
import { Icon } from './Icon.tsx';
import type { IconName } from './Icon.tsx';
import { Scene } from './Scene.tsx';
import { PreflightReview } from './PreflightReview.tsx';
import { CONFIG_HINTS, CONFIG_LABELS, bits, number } from './format.ts';
import { CrewReview, useCrewReview } from './CrewReview.tsx';
import { PREDICTIONS } from './learning.ts';
import type { Prediction } from './learning.ts';

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
  const scenario = getScenario(scenarioId);
  const crew = useCrewReview(JSON.stringify({ config, scenarioId, prediction, rationale }));
  const totals = getConfigTotals(config);
  const predictionReady = prediction !== '' && rationale.trim().length >= 8;
  const envelopeExceeded = totals.massKg > scenario.maxMassKg || totals.credits > scenario.budget;
  const battery = CATALOG.battery.find(v => v.id === config.battery)!;
  const panel = CATALOG.panel.find(v => v.id === config.panel)!;
  const processing = CATALOG.processing.find(v => v.id === config.processing)!;
  const radio = CATALOG.radio.find(v => v.id === config.radio)!;
  const buffer = CATALOG.buffer.find(v => v.id === config.buffer)!;
  const demandW = Math.max(((processing.totalLoadW ?? 0) - (panel.watts ?? 0) * PHYSICS.workPanelFactorPercent / 100) / (PHYSICS.dischargeEfficiencyPercent / 100), (radio.totalLoadW ?? 0) / (PHYSICS.dischargeEfficiencyPercent / 100));
  const peakRisk = demandW > (battery.maxDischargeW ?? 0);
  return <>
    <div className="page-heading workbench-heading"><div><p className="eyebrow">02 / HANGAR DE PROJETO</p><h1>Monte sua <em>missão.</em></h1><p className="page-intro">Seis decisões. Um objetivo: entregar seis registros válidos à Terra.</p></div><div className="scenario-switch" aria-label="Condição da missão"><button type="button" aria-pressed={scenarioId === 'long-contact'} onClick={() => onScenario('long-contact')} disabled={blocked}>Contato longo <span>2 × 10 min</span></button><button type="button" aria-pressed={scenarioId === 'short-contact'} onClick={() => onScenario('short-contact')} disabled={blocked}>Contato curto <span>2 × 4 min</span></button></div></div>
    <div className="hangar-toolbar"><span><i /> IPÊ-01 <b>PROJETO EM EDIÇÃO</b></span><button className="text-button" type="button" onClick={() => setGuide(!guide)} aria-expanded={guide}><Icon name="info" size={16} /> {guide ? 'Fechar orientação' : 'Como tomar a primeira decisão'}</button></div>
    {guide ? <div className="context-guide" role="region" aria-label="Orientação do hangar"><strong>Comece com uma pergunta: o que pode impedir os dados de chegar?</strong><p>Selecione um sistema à esquerda, compare as duas opções e observe os limites à direita. A primeira configuração já permite explorar o cenário longo. Antes de executar, registre sua previsão. No cenário curto, investigue o relatório e experimente outro projeto.</p><button className="text-button" onClick={() => setGuide(false)}>Entendi <Icon name="check" size={15} /></button></div> : null}
    <CrewReview crew={crew} />
    <div className="hangar-layout">
      <section className="hangar-systems" aria-labelledby="systems-title"><div className="systems-heading"><h2 id="systems-title">Subsistemas</h2><span>06</span></div><nav aria-label="Escolher subsistema">{CONFIG_KEYS.map((key, i) => <button key={key} type="button" aria-pressed={active === key} onClick={() => setActive(key)} className={`system-tab ${active === key ? 'active' : ''}`}><span className="system-icon"><Icon name={ICONS[key]} size={21} /></span><span><small>0{i + 1}</small><strong>{CONFIG_LABELS[key]}</strong><em>{CATALOG[key].find(item => item.id === config[key])?.label}</em></span><Icon name="chevron" size={14} /></button>)}</nav><div className="systems-foot"><Icon name="layers" size={18} /><p><strong>64 combinações.</strong><br />Uma solução exige sistemas que funcionem juntos.</p></div></section>
      <section className="assembly-column" aria-label="Montagem e escolha dos módulos"><div className="assembly-scene"><Scene compact variant="hangar" config={config} scenarioId={scenarioId} inspectSubsystem={active === 'battery' || active === 'panel' ? 'energy' : active === 'radio' || active === 'policy' ? 'communications' : 'instrument'} /></div>
        <div className="module-editor"><div className="module-title"><div><p className="eyebrow">SISTEMA 0{CONFIG_KEYS.indexOf(active) + 1}</p><h2>{CONFIG_LABELS[active]}</h2></div><Icon name={ICONS[active]} size={26} /></div><p className="module-hint">{CONFIG_HINTS[active]}</p>
          {CONFIG_KEYS.map(key => <fieldset className="module-options-fieldset" hidden={active !== key} key={key} disabled={blocked}><legend className="sr-only">{CONFIG_LABELS[key]}</legend><div className="module-options">{CATALOG[key].map((choice, index) => <label key={choice.id} className={`module-option ${config[key] === choice.id ? 'selected' : ''}`}><input type="radio" name={key} value={choice.id} checked={config[key] === choice.id} onChange={() => onChoice(key, choice.id)} /><span className="module-option-top"><span>OPÇÃO 0{index + 1}</span><span className="selection-circle">{config[key] === choice.id ? <Icon name="check" size={13} /> : null}</span></span><strong>{choice.label}</strong><span className="module-option-description">{choice.description}</span><span className="module-facts"><b>{number(choice.massKg)} <small>kg</small></b><b>{choice.credits} <small>créditos</small></b></span></label>)}</div></fieldset>)}
          <div className="tradeoff-note"><Icon name="route" size={19} /><div><strong>O que essa escolha muda?</strong><p>{WHY[active]}</p></div></div>
        </div>
        <PreflightReview config={config} scenario={scenario} />
      </section>
      <aside className="project-dossier" aria-labelledby="dossier-title"><div className="dossier-top"><span className="eyebrow">REVISÃO PRÉ-VOO</span><Icon name="satellite" size={23} /></div><h2 id="dossier-title">Tudo precisa<br /><em>caber junto.</em></h2><p className="dossier-scenario">{scenario.title} · 180 min simulados</p><Gauge label="Massa total" value={totals.massKg} limit={scenario.maxMassKg} unit="kg" /><Gauge label="Orçamento" value={totals.credits} limit={scenario.budget} unit="créditos" />
        <dl className="capacity-readings"><div><dt>Bateria / geração nominal</dt><dd>{battery.capacityWh} Wh <span>·</span> {panel.watts} W</dd></div><div><dt>Memória / dados por lote</dt><dd>{bits(buffer.capacityBits ?? 0)} <span>/</span> {bits(processing.bitsPerRecord ?? 0)}</dd></div></dl>
        {peakRisk ? <p className="preflight-risk" role="status"><Icon name="warning" size={17} /><span><strong>Atenção à potência.</strong> Há operação com demanda na bateria acima de {battery.maxDischargeW} W. Confira bateria, processamento e rádio.</span></p> : <p className="preflight-neutral"><Icon name="info" size={15} /> Massa e orçamento são só o começo. A execução verifica energia e entrega.</p>}
        <div className="prediction-block"><span className="small-label">SUA HIPÓTESE DE ENGENHARIA</span><h3>{firstAttempt ? 'Qual será o gargalo?' : 'O que você espera agora?'}</h3><p>Registre sua previsão para comparar com o relatório.</p><label htmlFor="prediction">Minha previsão</label><select id="prediction" value={prediction} onChange={(event) => onPrediction(event.target.value as Prediction | '')} disabled={blocked}><option value="">Escolha uma hipótese</option>{PREDICTIONS.map(item => <option value={item.id} key={item.id}>{item.label}</option>)}</select><label htmlFor="rationale">Por quê?</label><textarea id="rationale" rows={3} maxLength={1000} value={rationale} onChange={event => onRationale(event.target.value)} placeholder="Ex.: o contato pode ser curto para transmitir todos os dados." aria-describedby="prediction-help" disabled={blocked} /><p id="prediction-help" className="field-help">{predictionReady ? 'Hipótese pronta. Vamos colocá-la à prova.' : 'Escolha uma hipótese e escreva pelo menos 8 caracteres.'}</p></div>
        <button className="button button-primary launch-button" type="button" onClick={onLaunch} disabled={blocked || !predictionReady || !crew.ready}>{busy ? <><span className="loading-spinner" /> Executando missão…</> : <>{envelopeExceeded ? 'Verificar este projeto' : 'Registrar e executar'} <Icon name="arrow" /></>}</button>{envelopeExceeded ? <p className="field-help limit-help">Este projeto excede os limites. A execução vai registrar as restrições.</p> : null}{busy ? <button className="text-button cancel-button" type="button" onClick={onCancel}>Cancelar execução</button> : <button className="text-button save-button" type="button" onClick={onSave} disabled={saving}><Icon name="save" size={15} /> {saving ? 'Salvando projeto…' : 'Salvar projeto neste navegador'}</button>}
      </aside>
    </div>
    <div className="fixed-brief"><Icon name="info" size={18} /><p><strong>Sobre esta campanha:</strong> o lançador, o perfil orbital e os seis registros históricos são fixos. Capacidades, massas, créditos e agendas são parâmetros didáticos. Cada configuração muda os cálculos da missão; a visualização 3D apenas ilustra a montagem.</p></div>
  </>;
}
