import { useMemo, useRef, useState } from 'react';
import type { SavedRun } from '../persistence/store.ts';
import type { ConfigKey } from '../core/contracts.ts';
import { CATALOG, CONFIG_KEYS, getScenario } from '../core/catalog.ts';
import type { SpacecraftInspection } from '../lab/spacecraft-presentation.ts';
import { CONFIG_LABELS, choiceLabel, number, time } from './format.ts';
import { Dialog } from './Dialogs.tsx';
import { Scene } from './Scene.tsx';
import type { MissionSegment } from './Scene.tsx';
import { CerradoComparisonExplanation, compareCerrado } from './CerradoLearning.tsx';
import { inspectionForEvent } from './ExpeditionLearning.tsx';
import { ComparisonMetrics, ComparisonReadings } from './ExpeditionComparison.tsx';
import { getMissionVisualState } from '../lab/mission-visual-state.ts';
import { usePlayerMetrics } from './PlayerMetrics.tsx';
import './mission-comparison.css';

const STATUS = { success: 'Missão cumprida', failure: 'Missão não cumprida', invalid: 'Projeto inválido' };
const FOCUS: Record<ConfigKey, SpacecraftInspection> = { battery: 'energy', panel: 'energy', processing: 'instrument', buffer: 'instrument', radio: 'communications', policy: 'communications' };

function CerradoComparison({ a, b }: { a: SavedRun; b: SavedRun }) {
  const metrics = usePlayerMetrics();
  const [side, setSide] = useState<'a' | 'b'>('b');
  const [cursorTime, setCursorTime] = useState(0);
  const [eventId, setEventId] = useState<string>();
  const [inspection, setInspection] = useState<SpacecraftInspection>('overview');
  const [segment, setSegment] = useState<MissionSegment>('space');
  const sceneHeading = useRef<HTMLHeadingElement>(null);
  const comparison = useMemo(() => compareCerrado(a.result, b.result), [a.result, b.result]);
  const selected = (side === 'a' ? a : b).result;
  const av = getMissionVisualState(a.result, Math.min(cursorTime, a.result.completedAtS));
  const bv = getMissionVisualState(b.result, Math.min(cursorTime, b.result.completedAtS));
  const state = getMissionVisualState(selected, Math.min(cursorTime, selected.completedAtS), eventId);
  const reveal = () => { sceneHeading.current?.scrollIntoView({ behavior: 'auto', block: 'center' }); sceneHeading.current?.focus({ preventScroll: true }); };
  function inspectChoice(key: ConfigKey | 'contact') {
    const next = key === 'contact' ? 'communications' : FOCUS[key];
    setInspection(next); setSegment(next === 'communications' ? 'ground' : 'space'); setEventId(undefined);
    metrics.track('inspection', 'cerrado', { target: 'comparison' }); reveal();
  }
  function inspectDifference(at: number) {
    const event = comparison.firstEvent;
    const nextSide = event && a.result.events.includes(event) ? 'a' : 'b';
    const next = event && event.code !== 'MISSION_START' ? inspectionForEvent(event) : { subsystem: FOCUS[comparison.changed[0] ?? 'processing'], segment: 'space' as const };
    setSide(nextSide); setCursorTime(at); setEventId(event?.id); setInspection(next.subsystem); setSegment(next.segment);
    metrics.track('inspection', 'cerrado', { target: 'comparison', ...(event ? { eventId: event.id } : {}) }); reveal();
  }
  const capacity = (run: SavedRun) => CATALOG.battery.find(item => item.id === run.result.config.battery)!.capacityWh!;
  const memory = (run: SavedRun) => CATALOG.buffer.find(item => item.id === run.result.config.buffer)!.capacityBits!;
  const panel = (run: SavedRun) => CATALOG.panel.find(item => item.id === run.result.config.panel)!.watts!;
  const librasContext = `Comparação do Cerrado. A cena mostra a missão ${side.toUpperCase()}. Tempo comum: ${number(cursorTime)} segundos. Neste relógio, A tem ${av.deliveredRecordIds.length} registros válidos e B tem ${bv.deliveredRecordIds.length}. ${comparison.changed.length ? `Escolhas alteradas: ${comparison.changed.map(key => CONFIG_LABELS[key]).join(', ')}.` : 'Os módulos são iguais.'} ${comparison.scenarioChanged ? 'As agendas de contato também são diferentes.' : 'A condição de contato é a mesma.'} Alterne os projetos executados na cena e investigue os eventos. Mudanças simultâneas não isolam uma causa. Os resultados finais permanecem separados do replay.`.slice(0, 900);
  return <div className="mission-comparison" data-ipe-libras-context={librasContext}>
    <p className="compare-note">{a.id === b.id ? 'Você selecionou a mesma execução nos dois lados.' : comparison.scenarioChanged ? 'As condições de contato são diferentes. Uma mudança de resultado não pode ser atribuída só aos módulos.' : 'Mesma condição de contato. Observe quais escolhas mudaram e confira os eventos de cada execução.'}</p>
    <div className="mc-changes" aria-label="Escolhas alteradas para inspecionar">{comparison.changed.map(key => <button key={key} type="button" onClick={() => inspectChoice(key)}><small>{CONFIG_LABELS[key]}</small><strong>{choiceLabel(a.result.config, key)} → {choiceLabel(b.result.config, key)}</strong><span>Ver efeito na cena ↗</span></button>)}{comparison.scenarioChanged ? <button type="button" onClick={() => inspectChoice('contact')}><small>Agenda de contatos</small><strong>{getScenario(a.result.scenarioId).title} → {getScenario(b.result.scenarioId).title}</strong><span>Inspecionar comunicação ↗</span></button> : null}</div>
    <div className="mc-viewport"><h3 ref={sceneHeading} tabIndex={-1}>Inspeção 3D · missão {side.toUpperCase()}</h3><div className="mc-switch" role="group" aria-label="Projeto executado visível na cena"><button type="button" aria-pressed={side === 'a'} onClick={() => { setSide('a'); setEventId(undefined); metrics.track('inspection', 'cerrado', { target: 'comparison' }); }}>Inspecionar A no 3D</button><button type="button" aria-pressed={side === 'b'} onClick={() => { setSide('b'); setEventId(undefined); metrics.track('inspection', 'cerrado', { target: 'comparison' }); }}>Inspecionar B no 3D</button></div>
      <label className="mc-clock cl-compare-clock">Relógio comum A/B · T+{time(cursorTime)}<input type="range" min={0} max={Math.max(getScenario(a.result.scenarioId).horizonS, getScenario(b.result.scenarioId).horizonS)} value={cursorTime} onChange={event => { setCursorTime(Number(event.target.value)); setEventId(undefined); }} /></label>
      <div className="mc-clock-actions"><button type="button" className="text-button" onClick={() => { setCursorTime(0); setEventId(undefined); }}>Voltar ao início A/B</button><button type="button" className="text-button" onClick={() => { setCursorTime(Math.max(a.result.completedAtS, b.result.completedAtS)); setEventId(undefined); }}>Ver estados finais A/B</button></div>
      <Scene config={selected.config} scenarioId={selected.scenarioId} visualState={state} segment={segment} inspectSubsystem={inspection} />
      <ComparisonReadings a={av} b={bv} energyScaleWh={Math.max(capacity(a), capacity(b))} memoryScaleBits={Math.max(memory(a), memory(b))} />
      <p className="cl-compare-state">Vista {side.toUpperCase()} em T+{time(state.timeS)}. A: {av.deliveredRecordIds.length} registros válidos; B: {bv.deliveredRecordIds.length}. Após o encerramento de cada tentativa, a vista conserva seu último estado conhecido. O tempo comum não usa índices de amostras.</p>
    </div>
    <CerradoComparisonExplanation a={a.result} b={b.result} onSeek={inspectDifference} />
    <h3>Resultado final de cada tentativa</h3><div className="compare-outcomes"><div><span>MISSÃO A · FINAL</span><strong>{a.result.deliveredRecords}<small>/6</small></strong><p>{STATUS[a.result.outcome]}</p></div><span aria-hidden="true">→</span><div><span>MISSÃO B · FINAL</span><strong>{b.result.deliveredRecords}<small>/6</small></strong><p>{STATUS[b.result.outcome]}</p></div></div>
    <p className="mc-final-verdict">Estes totais permanecem iguais quando você rebobina. A nave e os indicadores do replay mostram somente o que já aconteceu no instante escolhido.</p>
    <ComparisonMetrics rows={[
      { label: 'Registros cientificamente válidos', a: a.result.deliveredRecords, b: b.result.deliveredRecords, unit: 'registros' },
      { label: 'Massa do projeto', a: a.result.massKg, b: b.result.massKg, unit: 'kg' },
      { label: 'Custo do projeto', a: a.result.credits, b: b.result.credits, unit: 'créditos' },
      { label: 'Folga de massa', a: getScenario(a.result.scenarioId).maxMassKg - a.result.massKg, b: getScenario(b.result.scenarioId).maxMassKg - b.result.massKg, unit: 'kg' },
      { label: 'Créditos restantes', a: getScenario(a.result.scenarioId).budget - a.result.credits, b: getScenario(b.result.scenarioId).budget - b.result.credits, unit: 'créditos' },
      { label: 'Capacidade da bateria', a: capacity(a), b: capacity(b), unit: 'Wh' },
      { label: 'Geração nominal do painel', a: panel(a), b: panel(b), unit: 'W' },
      { label: 'Energia mínima acima da reserva', a: a.result.minEnergyWh - a.result.reserveWh, b: b.result.minEnergyWh - b.result.reserveWh, unit: 'Wh' },
      { label: 'Dados recebidos', a: Number(a.result.downlinkedBits) / 1e6, b: Number(b.result.downlinkedBits) / 1e6, unit: 'Mbit' },
      { label: 'Dados restantes na memória', a: Number(a.result.queueBits) / 1e6, b: Number(b.result.queueBits) / 1e6, unit: 'Mbit' },
      { label: 'Dados perdidos', a: Number(a.result.lostBits) / 1e6, b: Number(b.result.lostBits) / 1e6, unit: 'Mbit' },
    ]} />
    <details className="mc-all-choices"><summary>Conferir todas as escolhas executadas</summary><div className="table-scroll"><table className="source-table comparison-table"><caption>Escolhas e cenários das duas execuções</caption><thead><tr><th scope="col">Indicador</th><th scope="col">Missão A</th><th scope="col">Missão B</th></tr></thead><tbody><tr><th scope="row">Cenário</th><td>{getScenario(a.result.scenarioId).title}</td><td>{getScenario(b.result.scenarioId).title}</td></tr>{CONFIG_KEYS.map(key => <tr key={key} className={a.result.config[key] !== b.result.config[key] ? 'comparison-changed' : ''}><th scope="row">{CONFIG_LABELS[key]}{a.result.config[key] !== b.result.config[key] ? <small> · alterado</small> : null}</th><td>{choiceLabel(a.result.config, key)}</td><td>{choiceLabel(b.result.config, key)}</td></tr>)}</tbody></table></div></details>
    <p className="history-note">O sinal da diferença indica aumento ou redução, não uma nota. Folgas são diferenças dentro do modelo; não representam probabilidade de sucesso. Seis registros só cumprem a missão quando as outras restrições também são atendidas. Múltiplas mudanças simultâneas não isolam uma causa.</p>
  </div>;
}

export function CompareDialog({ runs, onClose }: { runs: readonly SavedRun[]; onClose: () => void }) {
  const [aId, setAId] = useState(runs[1]?.id ?? runs[0]?.id ?? '');
  const [bId, setBId] = useState(runs[0]?.id ?? '');
  const a = runs.find(run => run.id === aId), b = runs.find(run => run.id === bId);
  const label = (run: SavedRun) => `${getScenario(run.result.scenarioId).title} · ${run.result.deliveredRecords}/6 · ${run.result.credits} cr. · ${new Date(run.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  return <Dialog title="O que mudou entre as missões?" onClose={onClose} wide><p className="dialog-lead">Selecione duas tentativas, toque em uma escolha alterada e compare o mesmo instante na nave. Depois, use a evidência para formular sua próxima hipótese.</p><div className="compare-selectors"><label>Missão A<select value={aId} onChange={event => setAId(event.target.value)}>{runs.map(run => <option key={run.id} value={run.id}>{label(run)}</option>)}</select></label><label>Missão B<select value={bId} onChange={event => setBId(event.target.value)}>{runs.map(run => <option key={run.id} value={run.id}>{label(run)}</option>)}</select></label></div>{a && b ? <CerradoComparison key={`${a.id}:${b.id}`} a={a} b={b} /> : <p className="history-empty">Conclua ao menos uma missão para comparar resultados.</p>}</Dialog>;
}
