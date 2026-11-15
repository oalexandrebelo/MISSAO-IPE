import { useState } from 'react';
import type { SavedRun } from '../persistence/store.ts';
import { CONFIG_KEYS, getScenario } from '../core/catalog.ts';
import { CONFIG_LABELS, bits, choiceLabel, number, time } from './format.ts';
import { Dialog } from './Dialogs.tsx';
import { Scene } from './Scene.tsx';
import { CerradoComparisonExplanation } from './CerradoLearning.tsx';
import { getMissionVisualState } from '../lab/mission-visual-state.ts';

const status = { success: 'Missão cumprida', failure: 'Missão não cumprida', invalid: 'Projeto inválido' };
export function CompareDialog({ runs, onClose }: { runs: readonly SavedRun[]; onClose: () => void }) {
  const [aId, setAId] = useState(runs[1]?.id ?? runs[0]?.id ?? '');
  const [bId, setBId] = useState(runs[0]?.id ?? '');
  const [side, setSide] = useState<'a' | 'b'>('a');
  const [cursorTime, setCursorTime] = useState(0);
  const a = runs.find(run => run.id === aId);
  const b = runs.find(run => run.id === bId);
  const label = (run: SavedRun) => `${getScenario(run.result.scenarioId).title} · ${run.result.deliveredRecords}/6 · ${run.result.credits} cr. · ${new Date(run.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  return <Dialog title="O que mudou entre as missões?" onClose={onClose} wide>
    <p className="dialog-lead">Compare resultados calculados e escolhas registradas. Use a diferença para formular sua próxima hipótese.</p>
    <div className="compare-selectors"><label>Missão A<select value={aId} onChange={event => setAId(event.target.value)}>{runs.map(run => <option key={run.id} value={run.id}>{label(run)}</option>)}</select></label><label>Missão B<select value={bId} onChange={event => setBId(event.target.value)}>{runs.map(run => <option key={run.id} value={run.id}>{label(run)}</option>)}</select></label></div>
    {a && b ? <>
      <div className="compare-outcomes"><div><span>MISSÃO A</span><strong>{a.result.deliveredRecords}<small>/6</small></strong><p>{status[a.result.outcome]}</p></div><span aria-hidden="true">→</span><div><span>MISSÃO B</span><strong>{b.result.deliveredRecords}<small>/6</small></strong><p>{status[b.result.outcome]}</p></div></div>
      <p className="compare-note">{a.id === b.id ? 'Você selecionou a mesma execução nos dois lados.' : a.result.scenarioId !== b.result.scenarioId ? 'As condições de contato são diferentes. Uma mudança de resultado não pode ser atribuída só aos módulos.' : 'Mesma condição de contato. Observe quais escolhas mudaram e confira os eventos de cada execução.'}</p>
      <CerradoComparisonExplanation a={a.result} b={b.result} onSeek={setCursorTime} />
      <div className="cl-compare-controls"><button className="button button-secondary" type="button" aria-pressed={side === 'a'} onClick={() => setSide('a')}>Inspecionar A no 3D</button><button className="button button-secondary" type="button" aria-pressed={side === 'b'} onClick={() => setSide('b')}>Inspecionar B no 3D</button></div>
      <label className="cl-compare-clock">Relógio comum A/B · T+{time(cursorTime)}<input type="range" min={0} max={Math.max(getScenario(a.result.scenarioId).horizonS, getScenario(b.result.scenarioId).horizonS)} value={cursorTime} onChange={event => setCursorTime(Number(event.target.value))} /></label>
      <Scene config={(side === 'a' ? a : b).result.config} scenarioId={(side === 'a' ? a : b).result.scenarioId} visualState={getMissionVisualState((side === 'a' ? a : b).result, cursorTime)} />
      <p className="cl-compare-state">Vista {side.toUpperCase()} em T+{time(cursorTime)}. A: {getMissionVisualState(a.result, cursorTime).deliveredRecordIds.length} registros válidos; B: {getMissionVisualState(b.result, cursorTime).deliveredRecordIds.length}. Após o encerramento de cada tentativa, a vista conserva seu último estado conhecido. O tempo comum não usa índices de amostras.</p>
      <div className="table-scroll"><table className="source-table comparison-table"><caption>Escolhas e resultados das duas execuções</caption><thead><tr><th scope="col">Indicador</th><th scope="col">Missão A</th><th scope="col">Missão B</th></tr></thead><tbody>
        <tr><th scope="row">Cenário</th><td>{getScenario(a.result.scenarioId).title}</td><td>{getScenario(b.result.scenarioId).title}</td></tr>
        <tr><th scope="row">Massa</th><td>{number(a.result.massKg)} kg</td><td>{number(b.result.massKg)} kg</td></tr><tr><th scope="row">Orçamento</th><td>{a.result.credits} créditos</td><td>{b.result.credits} créditos</td></tr>
        <tr><th scope="row">Folga de massa</th><td>{number(getScenario(a.result.scenarioId).maxMassKg - a.result.massKg)} kg</td><td>{number(getScenario(b.result.scenarioId).maxMassKg - b.result.massKg)} kg</td></tr><tr><th scope="row">Créditos restantes</th><td>{getScenario(a.result.scenarioId).budget - a.result.credits}</td><td>{getScenario(b.result.scenarioId).budget - b.result.credits}</td></tr><tr><th scope="row">Energia acima da reserva no pior instante</th><td>{number(a.result.minEnergyWh - a.result.reserveWh)} Wh</td><td>{number(b.result.minEnergyWh - b.result.reserveWh)} Wh</td></tr><tr><th scope="row">Energia mínima</th><td>{number(a.result.minEnergyWh)} Wh</td><td>{number(b.result.minEnergyWh)} Wh</td></tr>
        <tr><th scope="row">Dados recebidos</th><td>{bits(a.result.downlinkedBits)}</td><td>{bits(b.result.downlinkedBits)}</td></tr><tr><th scope="row">Dados na fila</th><td>{bits(a.result.queueBits)}</td><td>{bits(b.result.queueBits)}</td></tr><tr><th scope="row">Dados perdidos</th><td>{bits(a.result.lostBits)}</td><td>{bits(b.result.lostBits)}</td></tr>
        {CONFIG_KEYS.map(key => <tr key={key} className={a.result.config[key] !== b.result.config[key] ? 'comparison-changed' : ''}><th scope="row">{CONFIG_LABELS[key]}{a.result.config[key] !== b.result.config[key] ? <small> · alterado</small> : null}</th><td>{choiceLabel(a.result.config, key)}</td><td>{choiceLabel(b.result.config, key)}</td></tr>)}
      </tbody></table></div><p className="history-note">Folgas são diferenças dentro do modelo; não representam probabilidade de sucesso. A entrega de seis registros só cumpre a missão quando as outras restrições também são atendidas. Múltiplas mudanças simultâneas não isolam uma causa. Consulte o diário de eventos para investigar os mecanismos.</p>
    </> : <p className="history-empty">Conclua ao menos uma missão para comparar resultados.</p>}
  </Dialog>;
}
