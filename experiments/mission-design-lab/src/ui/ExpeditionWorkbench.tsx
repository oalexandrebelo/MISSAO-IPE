import { useRef, useState } from 'react';
import { getExpeditionChoices, getExpeditionPreflight, getExpeditionSchedule } from '../lab/scientific-expeditions.ts';
import type { ExpeditionConfig, ExpeditionConfigKey, ExpeditionId } from '../lab/scientific-expeditions.ts';
import type { SpacecraftInspection } from '../lab/spacecraft-presentation.ts';
import { Icon } from './Icon.tsx';
import type { IconName } from './Icon.tsx';
import { Scene } from './Scene.tsx';
import { focusCockpitSection } from './ScientificCockpit.tsx';
import { bits, number } from './format.ts';
import './equipment-workbench.css';

const SYSTEMS: readonly { key: ExpeditionConfigKey; label: string; short: string; icon: IconName; inspection: SpacecraftInspection; why: string }[] = [
  { key: 'instrument', label: 'Instrumento científico', short: 'Instrumento', icon: 'search', inspection: 'instrument', why: 'Observe a peça na frente da nave. O instrumento precisa produzir o tipo de evidência que responde à pergunta científica.' },
  { key: 'power', label: 'Energia e plataforma', short: 'Energia', icon: 'battery', inspection: 'energy', why: 'Observe painéis e bateria. W mede potência; Wh mede energia armazenável. Ampliar o conjunto aumenta capacidade, massa e custo.' },
  { key: 'ground', label: 'Comunicação com o solo', short: 'Comunicação', icon: 'signal', inspection: 'communications', why: 'O rádio fica em destaque, mantendo a mesma antena e a mesma taxa. O serviço de solo muda o início e a duração dos contatos, além do custo.' },
  { key: 'launch', label: 'Veículo de lançamento', short: 'Lançamento', icon: 'satellite', inspection: 'overview', why: 'O acesso define capacidade de massa, orçamento e perfis permitidos. A nave mantém suas peças; a cena representa o envelope de integração, sem simular um lançamento real.' },
  { key: 'orbit', label: 'Perfil orbital', short: 'Perfil orbital', icon: 'globe', inspection: 'overview', why: 'O perfil muda a agenda de luz, observação e contato. A montagem continua a mesma; compare o efeito ao longo do replay depois de executar.' },
  { key: 'duration', label: 'Vida operacional do recorte', short: 'Duração', icon: 'history', inspection: 'overview', why: 'O prazo define até quando os registros podem chegar. Ele não muda a geometria da nave. Uma operação de duas horas termina antes da última janela planejada.' },
];

interface Change { key: ExpeditionConfigKey; before: ExpeditionConfig; after: ExpeditionConfig; }
export interface ExpeditionWorkbenchProps {
  id: ExpeditionId;
  config: ExpeditionConfig;
  onChoice: (key: ExpeditionConfigKey, value: string) => void;
  onReview: () => void;
}

export function ExpeditionWorkbench({ id, config, onChoice, onReview }: ExpeditionWorkbenchProps) {
  const [active, setActive] = useState<ExpeditionConfigKey>('instrument');
  const [inspectionRequest, setInspectionRequest] = useState({ sequence: 0, agenda: false });
  const sceneRef = useRef<HTMLDivElement>(null);
  const optionsHeading = useRef<HTMLHeadingElement>(null);
  const [change, setChange] = useState<Change | null>(null);
  const system = SYSTEMS.find(item => item.key === active)!;
  const agendaChoice = active === 'ground' || active === 'orbit' || active === 'duration';
  const choices = getExpeditionChoices(id);
  const preflight = getExpeditionPreflight(id, config);
  const totals = preflight.totals;
  const schedule = getExpeditionSchedule(id, config);
  const currentChange = change && SYSTEMS.every(({ key }) => change.after[key] === config[key]) ? change : null;
  const before = currentChange ? getExpeditionPreflight(id, currentChange.before).totals : null;
  const label = (key: ExpeditionConfigKey, value: string) => choices[key].find(item => item.id === value)!.label;
  const resources = [
    { label: 'Massa total', value: totals.massKg, previous: before?.massKg, unit: 'kg', limit: totals.maxMassKg },
    { label: 'Orçamento usado', value: totals.credits, previous: before?.credits, unit: 'créditos', limit: totals.budget },
    { label: 'Energia armazenável', value: totals.capacityWh, previous: before?.capacityWh, unit: 'Wh' },
    { label: 'Geração nominal', value: totals.panelW, previous: before?.panelW, unit: 'W' },
    { label: 'Memória', value: totals.bufferBits / 1_000_000, previous: before ? before.bufferBits / 1_000_000 : undefined, unit: 'Mbit' },
  ];
  const librasContext = `Bancada de ${id === 'bennu' ? 'Bennu' : 'Webb'}. Sistema: ${system.label}. Opção selecionada: ${label(active, config[active])}. ${system.why} Projeto atual: ${number(totals.massKg)} quilogramas, ${number(totals.credits)} créditos, ${number(totals.capacityWh)} watt-hora, geração nominal de ${number(totals.panelW)} watts e ${bits(totals.bufferBits)} de memória. ${agendaChoice ? 'A seleção muda a agenda. O modelo destaca a função relacionada, sem trocar a peça.' : 'A seleção destaca a peça no modelo didático.'} Escolher não executa uma missão nem altera os dados históricos.`.slice(0, 900);
  function choose(key: ExpeditionConfigKey, value: string) {
    if (config[key] === value) return;
    setChange({ key, before: { ...config }, after: { ...config, [key]: value } });
    onChoice(key, value);
  }
  function requestInspection(agenda = false) {
    setInspectionRequest(previous => ({ sequence: previous.sequence + 1, agenda }));
  }
  return <div className="equipment-workbench" data-ipe-libras-context={librasContext} aria-label="Bancada de equipamentos da expedição">
    <div className="equipment-layout">
      <nav className="equipment-systems" aria-label="Escolher sistema da expedição">{SYSTEMS.map(item => <button type="button" key={item.key} aria-label={item.label} aria-pressed={active === item.key} onClick={() => { setActive(item.key); requestInspection(); }}><Icon name={item.icon} size={20} /><span><strong>{item.short}</strong><small>{label(item.key, config[item.key])}</small></span><Icon name="chevron" size={14} /></button>)}</nav>
      <div className="equipment-assembly">
        <div className="equipment-scene-wrap scientific-cockpit-viewport scientific-focus-target" role="group" ref={sceneRef} tabIndex={-1} aria-label={`Visualização de ${system.label}`}>
          <div className="equipment-scene-label"><strong>Editando · {system.label}</strong><button className="text-button" type="button" onClick={() => focusCockpitSection(optionsHeading.current)}>Ir às opções <Icon name="arrow" size={16} /></button></div>
          <Scene compact world={id} expeditionConfig={config} variant="hangar" segment={active === 'launch' || active === 'orbit' ? 'launch' : 'space'}
            inspectSubsystem={inspectionRequest.agenda ? 'communications' : system.inspection} inspectionRequest={inspectionRequest.sequence} scienceRecordCount={6} />
        </div>
        <div className="equipment-editor">
          <h3 className="scientific-focus-target" ref={optionsHeading} tabIndex={-1}>{system.label}</h3><p className="equipment-why">{system.why}</p>
          {SYSTEMS.map(item => <fieldset hidden={active !== item.key} key={item.key} className="equipment-choices"><legend className="sr-only">{item.label}</legend><div className="equipment-choice-grid">{choices[item.key].map(choice => <label key={choice.id} className={`equipment-choice ${config[item.key] === choice.id ? 'is-selected' : ''}`}><span className="equipment-choice-heading"><input type="radio" name={`equipment-${id}-${item.key}`} value={choice.id} checked={config[item.key] === choice.id} onChange={() => choose(item.key, choice.id)} /><strong>{choice.label}</strong><span className="equipment-selected">{config[item.key] === choice.id ? 'Selecionado' : 'Selecionar'}</span></span><span>{choice.detail}</span><span className="equipment-choice-facts"><b>{number(choice.massKg)} kg{choice.massKg === 0 ? ' na nave' : ''}</b><b>{number(choice.credits)} créditos</b></span></label>)}</div></fieldset>)}
          <div className="equipment-step-actions">
            <button type="button" className="text-button equipment-inspect-link" onClick={() => { requestInspection(agendaChoice); focusCockpitSection(sceneRef.current); }}>{agendaChoice ? 'Inspecionar agenda e função na nave' : 'Inspecionar esta escolha na nave'} <Icon name="arrow" size={16} /></button>
            <button className="button button-secondary button-small" type="button" onClick={onReview}>Seguir para checagem <Icon name="arrow" size={16} /></button>
          </div>
          <p className="equipment-learning"><Icon name="book" size={17} /><span>{id === 'bennu' ? 'Você investiga dimensões de rochas publicadas. A câmera representa a cadeia de imagem; o tamanho sozinho não demonstra composição.' : 'Você investiga seis faixas de um espectro publicado. O espectrômetro atende à pergunta; a câmera genérica deste exercício não o substitui.'}</span></p>
        </div>
      </div>
      <aside className="equipment-resources" aria-labelledby={`equipment-resources-${id}`}>
        <p className="eyebrow">AS DECISÕES SE CONECTAM</p><h3 id={`equipment-resources-${id}`}>Tudo precisa caber junto.</h3>
        <p className="equipment-last-change" role="status">{currentChange ? <><strong>Última escolha: {SYSTEMS.find(item => item.key === currentChange.key)!.short}.</strong> {label(currentChange.key, currentChange.before[currentChange.key])} → {label(currentChange.key, currentChange.after[currentChange.key])}. Veja o antes e o depois abaixo.</> : 'Selecione uma opção diferente para ver o antes e o depois dos recursos. A seleção não executa a missão.'}</p>
        <dl className="equipment-resource-list">{resources.map(resource => <div key={resource.label} className={resource.limit !== undefined && resource.value > resource.limit ? 'is-over-limit' : ''}><dt>{resource.label}</dt><dd>{resource.previous !== undefined ? <span className="equipment-before">{number(resource.previous)} → </span> : null}<strong>{number(resource.value)} {resource.unit}</strong>{resource.limit !== undefined ? <small>Limite: {number(resource.limit)} {resource.unit}{resource.value > resource.limit ? ' · excedido' : ''}</small> : null}{resource.previous !== undefined ? <small className="equipment-delta">{resource.value === resource.previous ? 'Sem alteração' : `${resource.value > resource.previous ? '+' : '−'}${number(Math.abs(resource.value - resource.previous))} ${resource.unit}`}</small> : null}</dd></div>)}</dl>
        <div className="equipment-contact-plan"><strong>Plano de contato</strong><p>{schedule.contacts.map(([start, end]) => `${number(start / 60)}–${number(end / 60)} min`).join(' · ')}</p><p>Taxa do rádio: {bits(choices.ground.find(item => item.id === config.ground)!.rateBps!)}/s. Janelas planejadas; a execução verifica quanto chega antes do prazo.</p></div>
        <p className="equipment-preflight">{preflight.constraints.every(item => item.met) ? 'Os critérios estáticos estão atendidos. Execute para testar energia, memória e entrega.' : `${preflight.constraints.filter(item => !item.met).length} requisito(s) ainda não atendido(s). Revise a lista de verificação antes de executar.`}</p>
        <p className="equipment-model-note">Nave, capacidades e créditos didáticos. Os dados científicos históricos mantêm seus valores e fontes.</p>
      </aside>
    </div>
  </div>;
}
