import type { SpacecraftPresentation, SpacecraftInspection } from '../lab/spacecraft-presentation.ts';
import type { MissionVisualState } from '../lab/mission-visual-state.ts';
import './spacecraft-inspector.css';

export const INSPECTIONS: readonly { id: SpacecraftInspection; label: string }[] = [
  { id: 'overview', label: 'Nave completa' }, { id: 'instrument', label: 'Carga científica' },
  { id: 'energy', label: 'Energia' }, { id: 'communications', label: 'Comunicação' },
];
const numeric = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

export function SpacecraftInspector({ presentation, inspection, state }: { presentation: SpacecraftPresentation; inspection: SpacecraftInspection; state?: MissionVisualState }) {
  const parts = [{ id: 'instrument', part: presentation.payload }, { id: 'energy', part: presentation.energy }, { id: 'communications', part: presentation.communications }];
  const visible = inspection === 'overview' ? parts : parts.filter(item => item.id === inspection);
  return <div className={`spacecraft-inspector ${inspection === 'overview' ? 'inspector-overview' : ''}`} aria-label="Escolhas representadas na nave">
    <p className="inspector-intro">{state ? 'Montagem da tentativa executada. ' : 'Montagem do projeto em edição. '}Selecione uma peça na cena ou use os botões para entender sua função.</p>
    <div className="inspector-parts">{visible.map(({ id, part }) => <article key={id} data-inspector-part={id}>
      <p className="inspector-kicker">{id === 'instrument' ? '01 / O que produz a evidência' : id === 'energy' ? '02 / O que sustenta a operação' : '03 / O que faz os dados chegarem'}</p>
      <h3>{part.label}</h3>{id === 'instrument' && !presentation.payload.goalCompatible ? <p className="inspector-incompatible">Esta carga não atende ao objetivo científico desta missão.</p> : null}<p>{part.principle}</p>
      <dl>{part.metrics.map(metric => <div key={metric.name}><dt>{metric.name}</dt><dd>{numeric(metric.value)} <small>{metric.unit}</small></dd></div>)}</dl>
      {inspection !== 'overview' ? <><strong className="inspector-effect-title">O que esta escolha muda?</strong><p>{part.effect}</p><p className="inspector-cost">Contribuição desta escolha: {numeric(part.massKg)} kg · {numeric(part.credits)} créditos {id === 'communications' && presentation.world !== 'earth' ? 'no serviço de solo; os contatos não acrescentam massa à nave.' : 'no projeto.'}</p></> : null}
    </article>)}</div>
    {inspection === 'communications' ? <div className="inspector-contact"><strong>{presentation.communications.scheduleLabel}</strong><ol>{presentation.communications.contacts.map(([start, end], index) => <li key={start}>Contato {index + 1}: T+{numeric(start / 60)} a {numeric(end / 60)} min · {numeric(end - start)} s previstos</li>)}</ol><p>Janela disponível não significa rádio transmitindo: é preciso ter dados na memória e a nave permanecer operante.</p></div> : null}
    {state ? <p className="inspector-state-note">{!state.available ? 'Este replay não tem amostras: a montagem é conhecida, mas as leituras temporais estão indisponíveis.' : `No instante selecionado: ${state.illuminated ? 'trecho iluminado' : 'eclipse'}, ${state.transmitting ? 'enlace transmitindo' : state.contactAvailable ? 'janela disponível sem transmissão' : 'sem contato'}. As luzes e indicadores mostram o estado registrado.`}</p> : <p className="inspector-state-note">Aqui você vê capacidades escolhidas. O estado da bateria e a entrega científica só são demonstrados depois da execução.</p>}
    <p className="inspector-boundary">Peças e dimensões são uma representação didática. Os parâmetros vêm do catálogo do jogo; os modelos NASA contextualizam a missão.</p>
  </div>;
}

/** Same configuration and recorded state as the WebGL craft; no hidden simulation. */
export function FlatConfiguredCraft({ presentation: p, inspection, exploded, state }: { presentation: SpacecraftPresentation; inspection: SpacecraftInspection; exploded: boolean; state?: MissionVisualState }) {
  const wing = 86 + p.energy.panelRatio * 70;
  const batteryCells = Math.max(1, Math.ceil(Math.max(0, Math.min(1, p.energy.batteryRatio)) * 4));
  const highlight = (part: SpacecraftInspection) => inspection === part ? '#e5f6a0' : '#90a5b3';
  const energy = state?.available ? state.energyFraction : null;
  const active = state?.available && state.transmitting;
  const payloadOffset = exploded ? 56 : 0;
  const batteryOffset = exploded ? 62 : 0;
  return <div className="orbit-flat configured-flat" aria-hidden="true"><svg viewBox="0 0 720 420">
    <ellipse cx="360" cy="320" rx="210" ry="32" fill="#050b12" opacity=".5"/>
    <path d="M70 215H650M360 60V350" stroke="#486170" strokeDasharray="3 9" opacity=".3"/>
    {[-1, 1].map(side => <g key={side} transform={`translate(${360 + side * (58 + wing / 2)} 187)`}>
      <rect x={-wing / 2} y="-48" width={wing} height="96" rx="3" fill={state?.available && !state.illuminated ? '#101b27' : '#254c71'} stroke={highlight('energy')} strokeWidth="2"/>
      {[1, 2, 3, 4].map(c => <path key={c} d={`M${-wing / 2 + wing * c / 5} -46V46`} stroke="#91a5bc" opacity=".5"/>)}
      <path d={`M${-wing / 2} -16H${wing / 2}M${-wing / 2} 16H${wing / 2}`} stroke="#91a5bc" opacity=".5"/>
    </g>)}
    <path d="M302 128L322 108H424V256L404 276H302Z" fill="#796344" stroke="#d7c5a6" strokeWidth="2"/>
    <rect x="302" y="128" width="102" height="148" rx="4" fill="#b89c68" stroke="#ead9ad" strokeWidth="2"/>
    <rect x="316" y="141" width="74" height="119" fill="#34424a" stroke="#718a96"/>
    <g transform={`translate(353 ${237 + batteryOffset})`}>
      <rect x="-46" y="-19" width="92" height="38" rx="4" fill="#1c3337" stroke={highlight('energy')} strokeWidth="3"/>
      {Array.from({length: batteryCells}, (_,i) => <rect key={i} x={-39 + i * 80 / batteryCells} y="-12" width={68 / batteryCells} height="24" rx="3" fill={energy === null ? '#5e7480' : i / batteryCells < energy ? '#b8dba3' : '#263b46'}/>)}
    </g>
    <g transform={`translate(${353 - payloadOffset} 180)`}>
      {p.payload.kind === 'camera' ? <><circle r="28" fill="#1b2939" stroke={highlight('instrument')} strokeWidth="4"/><circle r="17" fill="#6b9cac"/><circle r="8" fill="#13202c"/></> : p.payload.kind === 'spectrometer' ? <><rect x="-35" y="-25" width="70" height="50" rx="5" fill="#282839" stroke={highlight('instrument')} strokeWidth="3"/><path d="M-25 0H-9L4-15L17 0L4 15L-9 0" stroke="#d8bc90" fill="none"/><path d="M17 0L32-15M17 0H32M17 0L32 15" stroke="#baafe7"/></> : <><rect x="-34" y="-27" width="68" height="54" fill="#315c53" stroke={highlight('instrument')} strokeWidth="3"/>{p.payload.id === 'index' ? <><rect x="-14" y="-14" width="28" height="28" fill="#bdcc92"/><path d="M-25-20H25M-25 20H25" stroke="#a6c5b4"/></> : <><rect x="-24" y="-15" width="18" height="30" fill="#b5c7bd"/><rect x="6" y="-15" width="18" height="30" fill="#b5c7bd"/></>}</>}
    </g>
    <g transform={`translate(${410 + (exploded ? 55 : 0)} 110)`}>
      <path d="M0 20V-22M-32-32L0-22L32-32" fill="none" stroke={highlight('communications')} strokeWidth="4"/>
      {p.communications.radioHardware !== 'economy' ? <path d="M-28-45Q0-5 28-45Z" fill="#bfcad0" stroke={highlight('communications')} strokeWidth="2"/> : null}
      <circle cx="0" cy="-22" r="5" fill={active ? '#a6eafa' : '#89989c'}/>
      {active ? [1,2,3].map(i => <path key={i} d={`M${-i*12} ${-45-i*12}Q0 ${-58-i*12} ${i*12} ${-45-i*12}`} fill="none" stroke="#a6eafa" opacity={1-i*.18} strokeWidth="2"/>) : null}
    </g>
    {exploded ? <path d="M297 180H324M353 258V277M439 110H456" stroke="#d9e0c6" strokeDasharray="3 5"/> : null}
    <text x="360" y="380" textAnchor="middle" fill="#bdcbd2" fontSize="14">{p.payload.label} · {p.energy.panelW} W / {p.energy.batteryWh} Wh · {numeric(p.communications.rateBps/1e6)} Mbit/s</text>
  </svg></div>;
}
