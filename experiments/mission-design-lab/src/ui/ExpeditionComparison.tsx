import { useMemo, useRef, useState } from 'react';
import { getExpeditionChoices, getExpeditionVisualState } from '../lab/scientific-expeditions.ts';
import type { ExpeditionConfigKey, ExpeditionResult } from '../lab/scientific-expeditions.ts';
import type { MissionVisualState } from '../lab/mission-visual-state.ts';
import type { SpacecraftInspection } from '../lab/spacecraft-presentation.ts';
import { ExpeditionComparisonExplanation, explainExpeditionComparison, inspectionForEvent } from './ExpeditionLearning.tsx';
import { Scene } from './Scene.tsx';
import type { MissionSegment } from './Scene.tsx';
import { bits, number, time } from './format.ts';
import './mission-comparison.css';

const LABELS: Record<ExpeditionConfigKey, string> = { launch: 'Lançamento', orbit: 'Perfil', duration: 'Duração', instrument: 'Instrumento', power: 'Energia', ground: 'Serviço de solo' };
const FOCUS: Record<ExpeditionConfigKey, { subsystem: SpacecraftInspection; segment: MissionSegment }> = {
  launch: { subsystem: 'overview', segment: 'launch' }, orbit: { subsystem: 'overview', segment: 'launch' },
  duration: { subsystem: 'overview', segment: 'space' }, instrument: { subsystem: 'instrument', segment: 'space' },
  power: { subsystem: 'energy', segment: 'space' }, ground: { subsystem: 'communications', segment: 'ground' },
};
const OUTCOME = { success: 'Missão cumprida', failure: 'Missão não cumprida', invalid: 'Projeto incompatível' };

export function ComparisonMetrics({ rows }: { rows: readonly { label: string; a: number; b: number; unit: string }[] }) {
  return <div className="table-scroll"><table className="source-table mc-resource-table"><caption>Recursos e resultado final · diferença B menos A</caption><thead><tr><th scope="col">Indicador</th><th scope="col">A</th><th scope="col">B</th><th scope="col">Diferença B − A</th></tr></thead><tbody>{rows.map(row => {
    const delta = Math.round((row.b - row.a) * 100) / 100;
    return <tr key={row.label}><th scope="row">{row.label}</th><td>{number(row.a)} {row.unit}</td><td>{number(row.b)} {row.unit}</td><td className={delta ? 'mc-delta' : 'mc-unchanged'}>{delta > 0 ? '+' : ''}{number(delta)} {row.unit}{delta === 0 ? <small> · igual</small> : null}</td></tr>;
  })}</tbody></table></div>;
}

export function ComparisonReadings({ a, b, energyScaleWh, memoryScaleBits }: { a: MissionVisualState; b: MissionVisualState; energyScaleWh: number; memoryScaleBits: number }) {
  return <div className="mc-moment" aria-label="Estados A e B no relógio comum"><p className="mc-scale">Escalas iguais nas duas vistas: 0–{number(energyScaleWh)} Wh de energia; 0–{bits(memoryScaleBits)} de memória. Os valores abaixo pertencem ao instante selecionado.</p><div className="mc-moment-grid">{([{ side: 'A', state: a }, { side: 'B', state: b }] as const).map(({ side, state }) => <article className="mc-moment-card" key={side} data-side={side} data-records={state.deliveredRecordIds.length} data-time={state.timeS}><h4>{side} · neste instante</h4><p>Vista T+{time(state.timeS)} · {state.available ? `amostra T+${time(state.sourceStateTimeS!)}` : 'sem amostra registrada'}</p><dl><div><dt>Energia armazenada</dt><dd>{state.energyWh === null ? 'Sem registro' : `${number(state.energyWh)} Wh`}</dd></div></dl>{state.energyWh !== null ? <meter aria-label={`Energia A/B · ${side}`} min={0} max={energyScaleWh} value={Math.max(0, state.energyWh)} /> : null}<dl><div><dt>Memória ocupada</dt><dd>{state.queueBits === null ? 'Sem registro' : bits(state.queueBits)}</dd></div></dl>{state.queueBits !== null ? <meter aria-label={`Memória A/B · ${side}`} min={0} max={memoryScaleBits} value={state.queueBits} /> : null}<dl><div><dt>Registros válidos no solo</dt><dd>{state.deliveredRecordIds.length}</dd></div><div><dt>Dados recebidos</dt><dd>{state.downlinkedBits === null ? 'Sem registro' : bits(state.downlinkedBits)}</dd></div></dl></article>)}</div></div>;
}

export function ExpeditionComparison({ a, b, onInspect }: { a: ExpeditionResult; b: ExpeditionResult; onInspect?: (eventId?: string) => void }) {
  const [side, setSide] = useState<'a' | 'b'>('b');
  const [cursorTime, setCursorTime] = useState(0);
  const [eventId, setEventId] = useState<string>();
  const [focus, setFocus] = useState<{ subsystem: SpacecraftInspection; segment: MissionSegment }>({ subsystem: 'overview', segment: 'space' });
  const sceneHeading = useRef<HTMLHeadingElement>(null);
  const explanation = useMemo(() => explainExpeditionComparison(a, b), [a, b]);
  const choices = getExpeditionChoices(a.expeditionId);
  const horizon = Math.max(a.horizonS, b.horizonS);
  const at = Math.min(cursorTime, horizon);
  const current = side === 'a' ? a : b;
  const av = getExpeditionVisualState(a, Math.min(at, a.completedAtS));
  const bv = getExpeditionVisualState(b, Math.min(at, b.completedAtS));
  const currentState = getExpeditionVisualState(current, Math.min(at, current.completedAtS), eventId);
  const reveal = () => { sceneHeading.current?.scrollIntoView({ behavior: 'auto', block: 'center' }); sceneHeading.current?.focus({ preventScroll: true }); };
  function inspect(timeS: number, nextSide: 'a' | 'b', nextEventId?: string) {
    const inspected = nextSide === 'a' ? a : b;
    const event = inspected.events.find(item => item.id === nextEventId && item.timeS <= timeS);
    const nextFocus = event && event.code !== 'MISSION_START' ? inspectionForEvent(event) : FOCUS[explanation.changed[0] ?? 'instrument'];
    setSide(nextSide); setCursorTime(timeS); setEventId(event?.id); setFocus(nextFocus); onInspect?.(event?.id); reveal();
  }
  function inspectChoice(key: ExpeditionConfigKey) { setFocus(FOCUS[key]); setEventId(undefined); onInspect?.(); reveal(); }
  const label = (key: ExpeditionConfigKey, result: ExpeditionResult) => choices[key].find(choice => choice.id === result.config[key])!.label;
  const completed = (result: ExpeditionResult) => result.observations.filter(record => record.deliveredAtS !== null).length;
  const contactSeconds = (result: ExpeditionResult) => result.schedule.contacts.reduce((total, [start, end]) => total + end - start, 0);

  const librasContext = `Comparação de ${a.expeditionId === 'bennu' ? 'Bennu' : 'Webb'}. A cena mostra a tentativa ${side.toUpperCase()}. Tempo comum: ${number(at)} segundos. Neste relógio, A tem ${av.deliveredRecordIds.length} registros válidos e B tem ${bv.deliveredRecordIds.length}. ${explanation.changed.length ? `Escolhas alteradas: ${explanation.changed.map(key => LABELS[key]).join(', ')}.` : 'As escolhas são iguais.'} Se várias opções mudaram, a comparação não isola uma causa. Alterne A e B e investigue o primeiro evento diferente. Depois do encerramento, cada vista conserva seu último estado. Os resultados finais abaixo permanecem separados do replay.`.slice(0, 900);
  return <section className="expedition-compare mission-comparison" data-ipe-libras-context={librasContext} aria-labelledby="exp-compare-title">
    <p className="eyebrow">REDESIGN COM EVIDÊNCIA</p><h2 id="exp-compare-title">Duas tentativas, o mesmo relógio.</h2><p>1. Escolha uma mudança. 2. Alterne A e B na mesma nave. 3. Investigue o primeiro evento diferente. Os resultados finais ficam separados do replay.</p>
    <div className="mc-changes" aria-label="Escolhas alteradas para inspecionar">{explanation.changed.map(key => <button key={key} type="button" onClick={() => inspectChoice(key)}><small>{LABELS[key]}</small><strong>{label(key, a)} → {label(key, b)}</strong><span>Ver efeito na cena ↗</span></button>)}</div>
    {explanation.changed.includes('ground') ? <p className="mc-context-note"><strong>O que muda no solo?</strong> A agenda, o tempo de contato e o custo podem mudar juntos. A antena continua igual e a taxa permanece {number(choices.ground.find(choice => choice.id === current.config.ground)!.rateBps! / 1e6)} Mbit/s. O destaque no rádio indica o sistema envolvido, não uma troca de hardware.</p> : null}
    {explanation.changed.includes('instrument') && a.expeditionId === 'telescope' ? <p className="mc-context-note"><strong>Uma imagem não responde a toda pergunta.</strong> Neste exercício, a câmera genérica não fornece o espectro exigido. Compare pacotes completos e registros válidos: receber bits não corrige a escolha do instrumento. Isso não descreve os modos reais do NIRCam.</p> : null}
    <div className="mc-viewport"><h3 ref={sceneHeading} tabIndex={-1}>Inspeção 3D · tentativa {side.toUpperCase()}</h3><div className="mc-switch" role="group" aria-label="Projeto executado visível na cena"><button type="button" aria-pressed={side === 'a'} onClick={() => { setSide('a'); setEventId(undefined); onInspect?.(); }}>Ver tentativa A</button><button type="button" aria-pressed={side === 'b'} onClick={() => { setSide('b'); setEventId(undefined); onInspect?.(); }}>Ver tentativa B</button></div>
      <label className="mc-clock" htmlFor="exp-compare-time">Tempo comum · T+{time(at)}<input id="exp-compare-time" type="range" min={0} max={horizon} step={1} value={at} onChange={event => { setCursorTime(Number(event.target.value)); setEventId(undefined); }} /></label>
      <div className="mc-clock-actions"><button type="button" className="text-button" onClick={() => { setCursorTime(0); setEventId(undefined); }}>Voltar ao início A/B</button><button type="button" className="text-button" onClick={() => { setCursorTime(Math.max(a.completedAtS, b.completedAtS)); setEventId(undefined); }}>Ver estados finais A/B</button></div>
      <div id="exp-comparison-scene"><Scene world={current.expeditionId} expeditionConfig={current.config} segment={focus.segment} inspectSubsystem={focus.subsystem} visualState={currentState} scienceRecordCount={current.requiredRecords} /></div>
      <ComparisonReadings a={av} b={bv} energyScaleWh={Math.max(a.totals.capacityWh, b.totals.capacityWh)} memoryScaleBits={Math.max(a.totals.bufferBits, b.totals.bufferBits)} />
      <p className="field-help">A e B conservam a configuração executada. Depois que uma tentativa termina, sua vista mantém o estado final. O relógio compara segundos; a posição da nave é ilustrativa.</p>
    </div>
    <ExpeditionComparisonExplanation a={a} b={b} onInspect={inspect} />
    <h3>Resultado final de cada tentativa</h3><p className="mc-final-verdict">A: <strong>{OUTCOME[a.outcome]}</strong> · B: <strong>{OUTCOME[b.outcome]}</strong>. Estes totais não mudam quando você rebobina.</p>
    <ComparisonMetrics rows={[
      { label: 'Registros cientificamente válidos', a: a.deliveredRecords, b: b.deliveredRecords, unit: 'registros' },
      { label: 'Pacotes completos recebidos', a: completed(a), b: completed(b), unit: 'pacotes' },
      { label: 'Massa do projeto', a: a.totals.massKg, b: b.totals.massKg, unit: 'kg' },
      { label: 'Custo do projeto', a: a.totals.credits, b: b.totals.credits, unit: 'créditos' },
      { label: 'Capacidade da bateria', a: a.totals.capacityWh, b: b.totals.capacityWh, unit: 'Wh' },
      { label: 'Geração nominal do painel', a: a.totals.panelW, b: b.totals.panelW, unit: 'W' },
      { label: 'Energia mínima registrada', a: a.minEnergyWh, b: b.minEnergyWh, unit: 'Wh' },
      { label: 'Tempo de contato planejado', a: contactSeconds(a), b: contactSeconds(b), unit: 's' },
      { label: 'Dados recebidos', a: a.downlinkedBits / 1e6, b: b.downlinkedBits / 1e6, unit: 'Mbit' },
      { label: 'Dados restantes na memória', a: a.queueBits / 1e6, b: b.queueBits / 1e6, unit: 'Mbit' },
      { label: 'Vida operacional planejada', a: a.horizonS / 60, b: b.horizonS / 60, unit: 'min' },
    ]} />
    <details className="mc-all-choices"><summary>Conferir todas as escolhas executadas</summary><div className="table-scroll"><table className="source-table"><caption>Arquitetura preservada das tentativas A e B</caption><thead><tr><th scope="col">Escolha</th><th scope="col">A</th><th scope="col">B</th></tr></thead><tbody>{(Object.keys(LABELS) as ExpeditionConfigKey[]).map(key => <tr key={key}><th scope="row">{LABELS[key]}</th><td>{label(key, a)}</td><td>{label(key, b)}</td></tr>)}</tbody></table></div></details>
    <p className="history-note">O sinal da diferença mostra aumento ou redução, não uma nota de qualidade. Mais capacidade pode exigir mais massa e custo. Recursos e tempos são didáticos; os valores históricos e suas incertezas não mudam com o projeto.</p>
  </section>;
}
