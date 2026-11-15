import { useEffect, useRef, useState } from 'react';
import { CATALOG, DEFAULT_CONFIG } from './core/catalog.ts';
import type { ConfigKey, MissionConfig, MissionResult, ScenarioId, SearchResult } from './core/contracts.ts';
import { simulateAsync, searchAsync } from './workers/client.ts';
import { DraftConflictError, listRuns, loadDraft, saveDraft, saveRun } from './persistence/store.ts';
import type { SavedRun } from './persistence/store.ts';
import { exportReplay, importReplay, MAX_REPLAY_BYTES } from './persistence/replay.ts';
import { Icon } from './ui/Icon.tsx';
import { Observatory } from './ui/Observatory.tsx';
import { Workbench } from './ui/Workbench.tsx';
import { MissionControl } from './ui/MissionControl.tsx';
import { HistoryDialog, SourcesDialog } from './ui/Dialogs.tsx';
import { JOURNAL_KEY, newEntry, readJournal } from './ui/learning.ts';
import type { LearningEntry, Prediction } from './ui/learning.ts';
import { downloadText } from './ui/format.ts';

type View = 'observatory' | 'workbench' | 'mission';
type Notice = { tone: 'info' | 'success' | 'error'; message: string };
type Busy = 'simulate' | 'search' | 'import' | null;
function message(error: unknown): string { return error instanceof Error ? error.message : 'Não foi possível concluir esta operação.'; }
function completedScenarios(journal: readonly LearningEntry[]): Set<ScenarioId> {
  const predictions = new Set<string>();
  const completed = new Set<ScenarioId>();
  for (const entry of journal) {
    if (entry.kind === 'prediction' && entry.prediction && entry.text && entry.text.length >= 8) predictions.add(`${entry.scenarioId}:${entry.id}`);
    if (entry.kind === 'completed' && entry.attemptId && predictions.has(`${entry.scenarioId}:${entry.attemptId}`)) completed.add(entry.scenarioId);
  }
  return completed;
}

export default function App() {
  const [view, setView] = useState<View>('observatory');
  const [config, setConfig] = useState<MissionConfig>({ ...DEFAULT_CONFIG });
  const [scenarioId, setScenarioId] = useState<ScenarioId>('long-contact');
  const [result, setResult] = useState<MissionResult | null>(null);
  const [resultKey, setResultKey] = useState(0);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [prediction, setPrediction] = useState<Prediction | ''>('');
  const [rationale, setRationale] = useState('');
  const [busy, setBusy] = useState<Busy>(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [dialog, setDialog] = useState<'sources' | 'history' | null>(null);
  const [runs, setRuns] = useState<SavedRun[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [journal, setJournal] = useState<LearningEntry[]>(readJournal);
  const journalRef = useRef(journal);
  const draftRevision = useRef(0);
  const historyRequest = useRef(0);
  const requestId = useRef(0);
  const userChanges = useRef(0);
  const abortController = useRef<AbortController | null>(null);
  const activeAttempt = useRef<LearningEntry | null>(null);
  const importInput = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const completed = completedScenarios(journal);

  useEffect(() => {
    let alive = true;
    const initialChanges = userChanges.current;
    const initialHistory = ++historyRequest.current;
    void Promise.allSettled([loadDraft(), listRuns()]).then(([draft, saved]) => {
      if (!alive) return;
      if (draft.status === 'fulfilled' && draft.value) {
        draftRevision.current = draft.value.revision;
        if (userChanges.current === initialChanges) { setConfig({ ...draft.value.config }); setScenarioId(draft.value.scenarioId); }
      } else if (draft.status === 'rejected') setNotice({ tone: 'info', message: 'O projeto está disponível em memória. Não foi possível ler o armazenamento local.' });
      if (saved.status === 'fulfilled') { if (initialHistory === historyRequest.current) setRuns(saved.value); }
      else setNotice({ tone: 'info', message: 'O caderno local não pôde ser lido. Você pode executar missões e exportar o resultado.' });
      setHistoryLoading(false);
    });
    return () => { alive = false; abortController.current?.abort(); };
  }, []);
  useEffect(() => { mainRef.current?.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }); }, [view]);

  function appendJournal(entry: Omit<LearningEntry, 'id' | 'recordedAt'>): LearningEntry {
    const recorded = newEntry(entry);
    const next = [...journalRef.current, recorded];
    journalRef.current = next;
    setJournal(next);
    try { localStorage.setItem(JOURNAL_KEY, JSON.stringify(next)); }
    catch { setNotice({ tone: 'info', message: 'A decisão está preservada nesta sessão, mas o diário não pôde ser salvo no navegador. Exporte-o pelo caderno.' }); }
    return recorded;
  }
  function cancelWork() {
    requestId.current += 1;
    abortController.current?.abort(); abortController.current = null;
    if (activeAttempt.current) {
      const attempt = activeAttempt.current; activeAttempt.current = null;
      appendJournal({ kind: 'cancelled', config: attempt.config, scenarioId: attempt.scenarioId, attemptId: attempt.id });
    }
    setBusy(null);
  }
  function invalidateResult() { cancelWork(); setResult(null); setSearchResult(null); }
  function navigate(next: View) {
    if (next !== view && busy) { cancelWork(); setSearchResult(null); }
    setView(next);
  }
  function resetPrediction() { setPrediction(''); setRationale(''); }
  function chooseScenario(next: ScenarioId, goToWorkbench = false) {
    if (next !== scenarioId) { userChanges.current += 1; invalidateResult(); setScenarioId(next); resetPrediction(); }
    if (goToWorkbench) navigate('workbench');
  }
  function chooseComponent(key: ConfigKey, value: string) {
    if (config[key] === value || !CATALOG[key].some((item) => item.id === value)) return;
    userChanges.current += 1; invalidateResult(); setConfig((current) => ({ ...current, [key]: value }));
  }
  async function persistResult(completedResult: MissionResult, ownerToken: number) {
    try {
      await saveRun(completedResult);
      const historyToken = ++historyRequest.current;
      const next = await listRuns();
      if (historyToken === historyRequest.current) setRuns(next);
    }
    catch (error) { if (ownerToken === requestId.current) setNotice({ tone: 'info', message: `O resultado permanece visível, mas não foi salvo no caderno. ${message(error)}` }); }
  }
  async function launch() {
    if (busy || !prediction || rationale.trim().length < 8) return;
    invalidateResult();
    userChanges.current += 1;
    const token = requestId.current;
    const frozenConfig = { ...config };
    const frozenScenario = scenarioId;
    const controller = new AbortController(); abortController.current = controller;
    setNotice(null);
    const attempt = appendJournal({ kind: 'prediction', config: frozenConfig, scenarioId: frozenScenario, prediction, text: rationale.trim() });
    activeAttempt.current = attempt; setBusy('simulate');
    try {
      const next = await simulateAsync(frozenConfig, frozenScenario, controller.signal);
      if (token !== requestId.current || controller.signal.aborted) return;
      activeAttempt.current = null; abortController.current = null;
      appendJournal({ kind: 'completed', config: frozenConfig, scenarioId: frozenScenario, attemptId: attempt.id, outcome: next.outcome });
      setResult(next); setResultKey((key) => key + 1); setBusy(null); setView('mission');
      void persistResult(next, token);
    } catch (error) {
      if (token !== requestId.current) return;
      activeAttempt.current = null; abortController.current = null; setBusy(null);
      appendJournal({ kind: controller.signal.aborted ? 'cancelled' : 'error', config: frozenConfig, scenarioId: frozenScenario, attemptId: attempt.id, text: controller.signal.aborted ? undefined : message(error) });
      if (!controller.signal.aborted) setNotice({ tone: 'error', message: `A execução não foi concluída. ${message(error)}` });
    }
  }
  async function search() {
    if (!result || busy || !completed.has(result.scenarioId)) return;
    cancelWork();
    const token = requestId.current;
    const controller = new AbortController(); abortController.current = controller;
    const frozenResult = result;
    setSearchResult(null); setBusy('search');
    appendJournal({ kind: 'help', config: frozenResult.config, scenarioId: frozenResult.scenarioId, text: 'Consulta à enumeração exaustiva de 64 configurações solicitada.' });
    try {
      const next = await searchAsync(frozenResult.config, frozenResult.scenarioId, controller.signal);
      if (token !== requestId.current || controller.signal.aborted) return;
      setSearchResult(next); setBusy(null); abortController.current = null;
    } catch (error) {
      if (token !== requestId.current) return;
      setSearchResult(null); setBusy(null); abortController.current = null;
      if (!controller.signal.aborted) setNotice({ tone: 'error', message: `A busca foi interrompida; nenhum mínimo foi certificado. ${message(error)}` });
    }
  }
  async function saveProject() {
    if (saving || historyLoading) return;
    setSaving(true);
    const token = requestId.current;
    try {
      draftRevision.current = await saveDraft({ ...config }, scenarioId, draftRevision.current);
      if (token === requestId.current) setNotice({ tone: 'success', message: 'Projeto salvo neste navegador.' });
    } catch (error) {
      setNotice({ tone: 'error', message: error instanceof DraftConflictError ? 'Outra aba alterou o rascunho. Seu projeto atual continua em memória; recarregue a página para abrir a revisão salva antes de sobrescrevê-la.' : `Não foi possível salvar o projeto. ${message(error)}` });
    } finally { setSaving(false); }
  }
  function applyCandidate(next: MissionConfig) {
    userChanges.current += 1;
    appendJournal({ kind: 'redesign', config: next, scenarioId, text: 'Alternativa do catálogo aplicada como novo projeto antes da execução.' });
    invalidateResult(); setConfig({ ...next }); resetPrediction(); setView('workbench');
    setNotice({ tone: 'info', message: 'Alternativa aplicada como um novo projeto. Registre sua previsão e execute para obter seu próprio recibo.' });
  }
  async function exportResult() {
    if (!result || exporting) return;
    const snapshot = result; setExporting(true);
    try { downloadText(await exportReplay(snapshot), `missao-ipe-${snapshot.scenarioId}-replay.json`); }
    catch (error) { setNotice({ tone: 'error', message: `Não foi possível exportar o replay. ${message(error)}` }); }
    finally { setExporting(false); }
  }
  async function importFile(file: File) {
    cancelWork(); userChanges.current += 1; setBusy('import'); setDialog(null);
    const token = requestId.current;
    try {
      if (file.size > MAX_REPLAY_BYTES) throw new Error('O arquivo ultrapassa o limite de tamanho permitido para replay.');
      const checked = await importReplay(await file.text());
      if (token !== requestId.current) return;
      setSearchResult(null); setResult(checked.result); setResultKey((key) => key + 1); setConfig({ ...checked.result.config }); setScenarioId(checked.result.scenarioId); resetPrediction(); setView('mission'); setBusy(null);
      setNotice({ tone: checked.matchesClaim ? 'success' : 'error', message: checked.matchesClaim ? 'Replay recalculado: o resultado confere com a alegação do arquivo.' : 'A alegação do arquivo diverge do motor. A tela apresenta o resultado recalculado, sem conservar a alegação importada como resultado.' });
      void persistResult(checked.result, token);
    } catch (error) { if (token === requestId.current) { setBusy(null); setNotice({ tone: 'error', message: `Replay não importado. ${message(error)}` }); } }
  }
  function openRun(run: SavedRun) {
    invalidateResult(); userChanges.current += 1;
    setConfig({ ...run.result.config }); setScenarioId(run.result.scenarioId); setResult(run.result); setResultKey((key) => key + 1); resetPrediction(); setDialog(null); setView('mission');
  }
  function exportJournal() {
    downloadText(JSON.stringify({ format: 'mission-ipe-learning-journal', version: 1, note: 'Relatos e decisões locais do usuário. Este diário não é inviolável e não demonstra aprendizagem.', entries: journalRef.current }, null, 2), 'missao-ipe-diario-de-decisoes.json');
  }

  return <div className="app-shell"><a className="skip-link" href="#main-content">Pular para o conteúdo</a><header className="site-header"><button className="brand" type="button" onClick={() => navigate('observatory')} aria-label="Missão Ipê Ciência que chega · voltar ao observatório"><span className="brand-symbol" aria-hidden="true"><i /><i /><i /><i /></span><span>missão <strong>ipê</strong><small>CIÊNCIA QUE CHEGA</small></span></button><nav className="main-nav" aria-label="Etapas da missão"><button type="button" aria-current={view === 'observatory' ? 'step' : undefined} onClick={() => navigate('observatory')}><span>01</span> Observatório</button><button type="button" aria-current={view === 'workbench' ? 'step' : undefined} onClick={() => navigate('workbench')}><span>02</span> Bancada</button><button type="button" aria-current={view === 'mission' ? 'step' : undefined} disabled={!result} onClick={() => navigate('mission')}><span>03</span> Sala de missão</button></nav><div className="header-tools"><span className="offline-badge"><i /> LOCAL · OFFLINE</span><button className="icon-button" type="button" aria-label="Abrir caderno de missões" onClick={() => setDialog('history')}><Icon name="history" /></button><button className="icon-button" type="button" aria-label="Abrir fontes e hipóteses" onClick={() => setDialog('sources')}><Icon name="book" /></button></div></header>
    {notice ? <div className={`notice notice-${notice.tone}`} role={notice.tone === 'error' ? 'alert' : 'status'}><Icon name={notice.tone === 'error' ? 'warning' : notice.tone === 'success' ? 'check' : 'info'} size={18} /><p>{notice.message}</p><button className="icon-button" type="button" onClick={() => setNotice(null)} aria-label="Dispensar aviso"><Icon name="close" size={17} /></button></div> : null}
    {busy === 'import' ? <div className="import-status" role="status"><span className="loading-spinner" /> Validando e recalculando replay…</div> : null}
    <main id="main-content" className={`main-content view-${view}`} ref={mainRef} tabIndex={-1}>{view === 'observatory' ? <Observatory onChoose={(id) => chooseScenario(id, true)} onSources={() => setDialog('sources')} completed={completed} /> : view === 'workbench' ? <Workbench config={config} scenarioId={scenarioId} onChoice={chooseComponent} onScenario={chooseScenario} prediction={prediction} onPrediction={setPrediction} rationale={rationale} onRationale={setRationale} firstAttempt={!completed.has(scenarioId)} onLaunch={() => void launch()} onSave={() => void saveProject()} busy={busy === 'simulate'} blocked={busy !== null} saving={saving || historyLoading} onCancel={() => { cancelWork(); setNotice({ tone: 'info', message: 'Execução cancelada. Sua previsão permanece no diário de decisões.' }); }} /> : result ? <MissionControl key={resultKey} result={result} searchResult={searchResult} searching={busy === 'search'} canSearch={completed.has(result.scenarioId)} onSearch={() => void search()} onCancelSearch={() => { cancelWork(); setSearchResult(null); }} onApply={applyCandidate} onRedesign={() => navigate('workbench')} onTransfer={() => chooseScenario('short-contact', true)} onExport={() => void exportResult()} exporting={exporting} onReflect={(text, eventId) => appendJournal({ kind: 'reflection', config: result.config, scenarioId: result.scenarioId, text, eventId })} /> : null}</main>
    <footer className="site-footer"><span><span className="footer-dot" /> Protótipo de pesquisa · modelo educacional</span><div><button type="button" onClick={() => setDialog('sources')}>Fontes e hipóteses</button><span>IPÊ / 2026</span></div></footer>
    {dialog === 'sources' ? <SourcesDialog onClose={() => setDialog(null)} /> : dialog === 'history' ? <HistoryDialog runs={runs} loading={historyLoading} onClose={() => setDialog(null)} onOpen={openRun} onImport={() => importInput.current?.click()} onExportJournal={exportJournal} journalCount={journal.length} /> : null}
    <input ref={importInput} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; if (file) void importFile(file); }} />
  </div>;
}
