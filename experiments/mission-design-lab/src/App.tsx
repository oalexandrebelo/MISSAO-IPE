import { GameFullscreenControl, PlayerGateway, PlayerDashboard, PlayerSyncStatus, usePlayerMetrics } from './ui/PlayerMetrics.tsx';
import { summarizeAttempt, summarizeBrunoAttempt } from './metrics/player-metrics.ts';
import type { MetricMission } from './metrics/player-metrics.ts';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CATALOG, DEFAULT_CONFIG } from './core/catalog.ts';
import type { ConfigKey, MissionConfig, MissionResult, ScenarioId, SearchResult } from './core/contracts.ts';
import { simulateAsync, searchAsync } from './workers/client.ts';
import { createMissionStore, DraftConflictError } from './persistence/store.ts';
import type { SavedRun } from './persistence/store.ts';
import { exportReplay, importReplay, MAX_REPLAY_BYTES } from './persistence/replay.ts';
import { Icon } from './ui/Icon.tsx';
import { ScientificExpedition } from './ui/ScientificExpedition.tsx';
import type { ExpeditionId } from './lab/scientific-expeditions.ts';
import { GameTitleScreen, GameLobby } from './ui/GameShell.tsx';
import { BrunoCampaign } from './ui/BrunoCampaign.tsx';
import type { BrunoMissionId } from './lab/bruno-missions.ts';
import { Observatory } from './ui/Observatory.tsx';
import { EngineeringLab } from './ui/EngineeringLab.tsx';
import { CompareDialog } from './ui/CompareDialog.tsx';
import { Workbench } from './ui/Workbench.tsx';
import { MissionControl } from './ui/MissionControl.tsx';
import { Dialog, HistoryDialog, SourcesDialog } from './ui/Dialogs.tsx';
import { JOURNAL_KEY, newEntry, readJournal } from './ui/learning.ts';
import type { LearningEntry, Prediction } from './ui/learning.ts';
import { downloadText } from './ui/format.ts';

type View = 'observatory' | 'workbench' | 'mission' | 'lab' | 'expedition' | 'dashboard' | 'bruno' | 'knowledge';
const VIEW_LIBRAS: Record<View, string> = {
  bruno: 'Campanha de engenharia: ISS, Lua e Marte. Conheça o objetivo, monte a nave, acompanhe o lançamento e explique o resultado. Os números de engenharia são didáticos.',
  knowledge: 'Acervo de ciência e modelos NASA. Explore fontes, os quatro segmentos e os conceitos das missões.',
  observatory: 'MISSÃO IPÊ. Selecione entre seis missões: ISS, Lua, Marte, Cerrado, Bennu ou Webb. Cada caso conecta uma pergunta, decisões de engenharia, estados na nave e dados históricos com fontes verificáveis.',
  workbench: 'Bancada do Cerrado. Escolha um sistema, compare opções e veja o efeito na nave. Registre sua previsão antes de executar; o texto pessoal da previsão não é enviado ao guia.',
  mission: 'Sala da missão do Cerrado. O resumo apresenta o resultado final. O replay permite investigar cada instante e relacionar decisões, recursos e entrega científica.',
  lab: 'Laboratório de engenharia. Explore os controles didáticos e observe como recursos e condições mudam a operação. A visualização não é uma trajetória real propagada.',
  expedition: 'Missão científica. Siga necessidade, requisitos, projeto, verificação, operação e retorno científico. O guia acompanha a etapa ativa sem ler campos pessoais.',
  dashboard: 'Seu progresso. Consulte tentativas, pontuação e aprendizados. O guia oferece apenas esta orientação; dados pessoais e respostas permanecem fora da tradução.',
};

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

export default function App() { return <GameTitleScreen><PlayerGateway>{firstMission => <PlayerGame firstMission={firstMission} />}</PlayerGateway></GameTitleScreen>; }

function PlayerGame({ firstMission }: { firstMission: MetricMission | null }) {
  const metrics = usePlayerMetrics();
  const sessionId = metrics.session!.sessionId;
  const journalKey = `${JOURNAL_KEY}:${sessionId}`;
  const { listRuns, loadDraft, saveDraft, saveRun } = useMemo(() => createMissionStore({ databaseName: `mission-ipe-player-${sessionId}` }), [sessionId]);
  const [view, setView] = useState<View>(firstMission === 'cerrado' ? 'workbench' : firstMission === 'bennu' || firstMission === 'telescope' ? 'expedition' : firstMission ? 'bruno' : 'observatory');
  const [brunoId, setBrunoId] = useState<BrunoMissionId>(firstMission === 'moon' || firstMission === 'mars' ? firstMission : 'iss');
  const [menuOpen, setMenuOpen] = useState(false);
  const [expeditionId, setExpeditionId] = useState<ExpeditionId>(firstMission === 'telescope' ? 'telescope' : 'bennu');
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
  const [dialog, setDialog] = useState<'sources' | 'history' | 'compare' | null>(null);
  const [runs, setRuns] = useState<SavedRun[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [journal, setJournal] = useState<LearningEntry[]>(() => readJournal(journalKey));
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
  useEffect(() => { if (mainRef.current) mainRef.current.scrollTop = 0; mainRef.current?.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }); }, [view]);

  function appendJournal(entry: Omit<LearningEntry, 'id' | 'recordedAt'>): LearningEntry {
    const recorded = newEntry(entry);
    const next = [...journalRef.current, recorded];
    journalRef.current = next;
    setJournal(next);
    try { localStorage.setItem(journalKey, JSON.stringify(next)); }
    catch { setNotice({ tone: 'info', message: 'A decisão está preservada nesta sessão, mas o diário não pôde ser salvo no navegador. Exporte-o pelo caderno.' }); }
    return recorded;
  }
  function cancelWork() {
    requestId.current += 1;
    abortController.current?.abort(); abortController.current = null;
    if (activeAttempt.current) {
      const attempt = activeAttempt.current; activeAttempt.current = null;
      appendJournal({ kind: 'cancelled', config: attempt.config, scenarioId: attempt.scenarioId, attemptId: attempt.id });
      metrics.track('attempt', 'cerrado', { attemptId: attempt.id, status: 'cancelled', config: attempt.config, scenarioId: attempt.scenarioId });
    }
    setBusy(null);
  }
  function invalidateResult() { cancelWork(); setResult(null); setSearchResult(null); }
  function navigate(next: View) {
    if (next !== view && busy) { cancelWork(); setSearchResult(null); }
    setView(next);
  }
  function chooseMission(id: MetricMission) {
    cancelWork();
    if (id === 'cerrado') chooseScenario('long-contact', true);
    else if (id === 'bennu' || id === 'telescope') { setExpeditionId(id); navigate('expedition'); }
    else { setBrunoId(id); navigate('bruno'); }
  }
  function resetPrediction() { setPrediction(''); setRationale(''); }
  function chooseScenario(next: ScenarioId, goToWorkbench = false) {
    if (next !== scenarioId) { userChanges.current += 1; invalidateResult(); setScenarioId(next); resetPrediction(); }
    if (goToWorkbench) navigate('workbench');
  }
  function chooseComponent(key: ConfigKey, value: string) {
    if (config[key] === value || !CATALOG[key].some((item) => item.id === value)) return;
    metrics.track('decision', 'cerrado', { key, from: config[key], to: value });
    userChanges.current += 1; invalidateResult(); setConfig((current) => ({ ...current, [key]: value }));
    if (prediction) { setPrediction(''); setNotice({ tone: 'info', message: 'Projeto alterado. Revise e selecione novamente sua previsão; sua justificativa foi preservada.' }); }
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
      metrics.track('attempt', 'cerrado', { attemptId: attempt.id, status: 'completed', config: frozenConfig, scenarioId: frozenScenario }, summarizeAttempt(next));
      setResult(next); setResultKey((key) => key + 1); setBusy(null); setView('mission');
      void persistResult(next, token);
    } catch (error) {
      if (token !== requestId.current) return;
      activeAttempt.current = null; abortController.current = null; setBusy(null);
      appendJournal({ kind: controller.signal.aborted ? 'cancelled' : 'error', config: frozenConfig, scenarioId: frozenScenario, attemptId: attempt.id, text: controller.signal.aborted ? undefined : message(error) });
      metrics.track('attempt', 'cerrado', { attemptId: attempt.id, status: controller.signal.aborted ? 'cancelled' : 'error', config: frozenConfig, scenarioId: frozenScenario });
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

  return <div className="app-shell game-shell"><a className="skip-link" href="#main-content">Pular para o conteúdo</a><header className="site-header"><button className="brand" type="button" onClick={() => navigate('observatory')} aria-label="MISSÃO IPÊ, observatório"><img className="brand-logo" src="./brand/missao-ipe-logo.svg" width="1064" height="499" alt="MISSÃO IPÊ" /></button>{(view === 'workbench' || view === 'mission') ? <nav className="main-nav" aria-label="Etapas da missão"><button type="button" onClick={() => navigate('observatory')}><span>01</span> Briefing</button><button type="button" aria-current={view === 'workbench' ? 'step' : undefined} onClick={() => navigate('workbench')}><span>02</span> Projetar</button><button type="button" aria-current={view === 'mission' ? 'step' : undefined} disabled={!result} onClick={() => navigate('mission')}><span>03</span> Sala de missão</button></nav> : null}<div className="header-tools"><PlayerSyncStatus /><GameFullscreenControl /><button className="button button-secondary player-progress-button" type="button" onClick={() => navigate('dashboard')}>Meu progresso</button><button className="icon-button game-history-button" type="button" aria-label="Abrir caderno de missões" onClick={() => setDialog('history')}><Icon name="history" /></button><button className="button button-secondary game-menu-button" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>Menu</button></div></header>
    {notice ? <div className={`notice notice-${notice.tone}`} role={notice.tone === 'error' ? 'alert' : 'status'}><Icon name={notice.tone === 'error' ? 'warning' : notice.tone === 'success' ? 'check' : 'info'} size={18} /><p>{notice.message}</p><button className="icon-button" type="button" onClick={() => setNotice(null)} aria-label="Dispensar aviso"><Icon name="close" size={17} /></button></div> : null}
    {busy === 'import' ? <div className="import-status" role="status"><span className="loading-spinner" /> Validando e recalculando replay…</div> : null}
    <main id="main-content" data-ipe-libras-context={VIEW_LIBRAS[view]} className={`main-content view-${view}`} ref={mainRef} tabIndex={-1}>{view === 'dashboard' ? <PlayerDashboard onBack={() => navigate('observatory')} /> : view === 'observatory' ? <GameLobby onChoose={chooseMission} onKnowledge={() => navigate('knowledge')} attempts={metrics.entries.filter(e => e.event.kind === 'attempt').length} bestScore={Math.max(0, ...metrics.entries.map(e => e.summary?.score?.total ?? 0))} /> : view === 'bruno' ? <BrunoCampaign key={brunoId} id={brunoId} sessionId={sessionId} onCancel={(id, frozenConfig) => metrics.track('attempt', id, { attemptId: crypto.randomUUID(), status: 'cancelled', config: frozenConfig })} onInspect={() => metrics.track('inspection', brunoId, { target: 'comparison' })} onRoleReview={roles => metrics.track('role_review', brunoId, { roles, count: roles.length })} onBack={() => navigate('observatory')} onDecision={(id, _config, change) => { if (change) metrics.track('decision', id, change); }} onComplete={completedResult => metrics.track('attempt', completedResult.missionId, { attemptId: crypto.randomUUID(), status: 'completed', config: completedResult.config }, summarizeBrunoAttempt(completedResult))} /> : view === 'knowledge' ? <Observatory onChoose={(id) => chooseScenario(id, true)} onSources={() => setDialog('sources')} onLab={() => navigate('lab')} completed={completed} onExpedition={id => { cancelWork(); setExpeditionId(id); navigate('expedition'); }} /> : view === 'workbench' ? <Workbench config={config} scenarioId={scenarioId} onChoice={chooseComponent} onScenario={chooseScenario} prediction={prediction} onPrediction={setPrediction} rationale={rationale} onRationale={setRationale} firstAttempt={!completed.has(scenarioId)} onLaunch={() => void launch()} onSave={() => void saveProject()} busy={busy === 'simulate'} blocked={busy !== null} saving={saving || historyLoading} onCancel={() => { cancelWork(); setNotice({ tone: 'info', message: 'Execução cancelada. Sua previsão permanece no diário de decisões.' }); }} /> : view === 'expedition' ? <ScientificExpedition key={expeditionId} id={expeditionId} onBack={() => navigate('observatory')} /> : view === 'lab' ? <EngineeringLab onBack={() => navigate('observatory')} /> : result ? <MissionControl key={resultKey} result={result} searchResult={searchResult} searching={busy === 'search'} canSearch={completed.has(result.scenarioId)} onSearch={() => void search()} onCancelSearch={() => { cancelWork(); setSearchResult(null); }} onApply={applyCandidate} onRedesign={() => navigate('workbench')} onTransfer={() => chooseScenario('short-contact', true)} onExport={() => void exportResult()} exporting={exporting} onCompare={() => setDialog('compare')} canCompare={runs.length > 1} onReflect={(text, eventId) => appendJournal({ kind: 'reflection', config: result.config, scenarioId: result.scenarioId, text, eventId })} /> : null}</main>
    <footer className="game-hud-foot"><span>MISSÃO IPÊ · CENTRO DE COMANDO · SIMULAÇÃO DIDÁTICA</span><span>{metrics.entries.filter(e => e.event.kind === 'attempt').length} TENTATIVAS REGISTRADAS</span></footer>
    {menuOpen ? <Dialog title="Menu do jogo" onClose={() => setMenuOpen(false)}><p>Seus registros enviados continuam no painel. Voltar à seleção não apaga suas tentativas.</p><div className="game-pause-actions"><button className="button button-primary" type="button" onClick={() => setMenuOpen(false)}>Continuar jogando</button><button className="button button-secondary" type="button" onClick={() => { setMenuOpen(false); navigate('observatory'); }}>Selecionar missão</button><button className="button button-secondary" type="button" onClick={() => { setMenuOpen(false); navigate('dashboard'); }}>Meu progresso e pontuação</button><button className="button button-secondary" type="button" onClick={() => { setMenuOpen(false); navigate('lab'); }}>Laboratório de engenharia</button><button className="button button-secondary" type="button" onClick={() => { setMenuOpen(false); navigate('knowledge'); }}>Acervo e guia de ciência</button><button className="button button-secondary" type="button" onClick={() => { setMenuOpen(false); setDialog('sources'); }}>Fontes e hipóteses</button><button className="button button-secondary" type="button" onClick={() => { setMenuOpen(false); setDialog('history'); }}>Caderno do Cerrado</button></div></Dialog> : null}
    {dialog === 'compare' ? <CompareDialog runs={runs} onClose={() => setDialog(null)} /> : dialog === 'sources' ? <SourcesDialog onClose={() => setDialog(null)} /> : dialog === 'history' ? <HistoryDialog runs={runs} loading={historyLoading} onClose={() => setDialog(null)} onOpen={openRun} onImport={() => importInput.current?.click()} onExportJournal={exportJournal} journalCount={journal.length} /> : null}
    <input ref={importInput} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; if (file) void importFile(file); }} />
  </div>;
}

