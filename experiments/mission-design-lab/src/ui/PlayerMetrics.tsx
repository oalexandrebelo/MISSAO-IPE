import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { acknowledgeMetrics, isBrunoMission, isPlayerSession, mergeMetrics, metricsKey, newMetric, readMetrics, summarizeMetrics, writeMetrics } from '../metrics/player-metrics.ts';
import type { AttemptSummary, LocalMetric, MetricEvent, MetricKind, MetricMission, PlayerSession } from '../metrics/player-metrics.ts';
import { BRUNO_MISSIONS } from '../lab/bruno-missions.ts';
import { MISSION_SCORE_LIMITS } from '../metrics/mission-score.ts';
import type { MissionScore } from '../metrics/mission-score.ts';
import { Dialog } from './Dialogs.tsx';
import { Icon } from './Icon.tsx';
import './player-metrics.css';

interface MetricContext {
  session: PlayerSession | null; entries: readonly LocalMetric[]; issue: string; syncing: boolean;
  track: (kind: MetricKind, mission: MetricMission, payload: Record<string, unknown>, summary?: AttemptSummary, correct?: boolean) => void;
  recordConfirmedAttempts: (attempts: readonly { event: MetricEvent; summary?: AttemptSummary }[]) => void;
  retry: () => void; logout: () => Promise<void>;
}
const Metrics = createContext<MetricContext>({ session: null, entries: [], issue: '', syncing: false, track: () => {}, recordConfirmedAttempts: () => {}, retry: () => {}, logout: async () => {} });
export const usePlayerMetrics = () => useContext(Metrics);
class MetricsApiError extends Error {
  constructor(readonly status: number, message: string) { super(message); }
}
async function api(action: string, body?: Record<string, unknown>) {
  const response = await fetch(body ? '/api/metrics' : `/api/metrics?action=${action}`, { method: body ? 'POST' : 'GET', credentials: 'same-origin', cache: 'no-store', headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify({ action, ...body }) : undefined, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new MetricsApiError(response.status, response.status === 401 ? 'Sua participação expirou. Exporte o progresso e encerre esta participação antes de entrar novamente.' : response.status === 409 ? 'Outra participação está ativa neste navegador. Recarregue a página; estes eventos não foram atribuídos a outra pessoa.' : 'Não foi possível conectar ao painel da equipe. Tente novamente.');
  return response.json() as Promise<unknown>;
}
const ENTRY_STEPS = [
  { label: 'Nome', title: 'Como podemos chamar você?', story: 'Toda missão começa com uma pessoa disposta a fazer uma pergunta. Primeiro, apresente-se à tripulação.' },
  { label: 'E-mail', title: 'Qual é o seu e-mail?', story: 'Uma missão deixa vestígios de cada decisão. Seu e-mail ajuda a equipe a reconhecer o registro da sua participação.' },
  { label: 'Tipo', title: 'Que tipo de missão você quer projetar?', story: 'Escolha um desafio de engenharia ou uma investigação com registros científicos históricos.' },
  { label: 'Play', title: 'Tudo pronto para começar.', story: 'Monte o projeto, teste sua hipótese e siga os dados até a Terra. O que chegar é a evidência da sua tentativa.' },
] as const;
const MISSION_NAMES: Record<MetricMission, string> = { cerrado: 'Cerrado', bennu: 'Bennu', telescope: 'Webb', iss: 'ISS', moon: 'Lua', mars: 'Marte', europa: 'Europa' };
const MISSION_LESSONS: Record<MetricMission, string> = {
  cerrado: 'Potência, energia e leitura de lacunas na vegetação.',
  bennu: 'Produzir dados é diferente de entregá-los.',
  telescope: 'Instrumento, espectro e incerteza precisam corresponder à pergunta.',
  iss: 'Proteção da calibração e validade das leituras do ar.',
  moon: 'Reserva de energia na sombra e capacidade de entrega dos mapas.',
  mars: 'Capacidade do lançador, prazo de chegada e proteção de entrada.',
  europa: BRUNO_MISSIONS.europa.learn,
};
const ENTRY_MISSIONS: { id: MetricMission; objective: string }[] = [
  ...Object.values(BRUNO_MISSIONS).map(mission => ({ id: mission.id, objective: mission.learn })),
  { id: 'cerrado', objective: 'Envie seis registros históricos de vegetação para comparar dois períodos.' },
  { id: 'bennu', objective: 'Leve ao solo as medidas dos blocos rochosos do asteroide.' },
  { id: 'telescope', objective: 'Escolha um instrumento para recuperar os registros do espectro de luz.' },
];

function canEnterFullscreen() {
  return document.fullscreenEnabled !== false && typeof document.documentElement.requestFullscreen === 'function';
}

async function setGameFullscreen(enabled: boolean) {
  try {
    if (enabled && !document.fullscreenElement && canEnterFullscreen()) await document.documentElement.requestFullscreen();
    if (!enabled && document.fullscreenElement) await document.exitFullscreen();
  } catch { /* The viewport layout remains available when the browser declines. */ }
}

export function GameFullscreenControl() {
  const [fullscreen, setFullscreen] = useState(() => Boolean(document.fullscreenElement));
  useEffect(() => {
    const update = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', update);
    update();
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);
  if (!fullscreen && !canEnterFullscreen()) return null;
  const label = fullscreen ? 'Sair da tela cheia' : 'Entrar em tela cheia';
  return <button className={`icon-button player-fullscreen-toggle${fullscreen ? ' is-fullscreen' : ''}`} type="button" aria-label={label} title={label} onClick={() => void setGameFullscreen(!fullscreen)}><span className="player-fullscreen-mark" aria-hidden="true" /></button>;
}

export function PlayerGateway({ children }: { children: (firstMission: MetricMission | null) => ReactNode }) {
  const [session, setSession] = useState<PlayerSession | null>(null);
  const [started, setStarted] = useState(false);
  const [checking, setChecking] = useState(true);
  const [issue, setIssue] = useState('');
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mission, setMission] = useState<MetricMission | null>(null);
  const [entering, setEntering] = useState(false);
  const nameInput = useRef<HTMLInputElement>(null);
  const stepTitle = useRef<HTMLHeadingElement>(null);
  const retryButton = useRef<HTMLButtonElement>(null);
  const focusEntry = useRef<'step' | 'name' | null>(null);
  const registrationInFlight = useRef(false);
  async function resume() {
    const retrying = document.activeElement === retryButton.current;
    setChecking(true);
    try {
      const value = await api('session');
      const candidate = value && typeof value === 'object' && 'session' in value ? value.session : undefined;
      if (candidate !== null && !isPlayerSession(candidate)) throw new Error('A resposta da participação não pôde ser validada.');
      if (retrying && document.activeElement === retryButton.current) focusEntry.current = 'step';
      setIssue('');
      setSession(candidate);
    } catch (error) { setIssue(error instanceof Error ? error.message : 'Não foi possível verificar sua participação.'); }
    finally { setChecking(false); }
  }
  useEffect(() => { void resume(); }, []);
  useEffect(() => {
    if (checking || started || !focusEntry.current) return;
    const target = focusEntry.current === 'name' ? nameInput.current : stepTitle.current;
    focusEntry.current = null;
    target?.focus();
  }, [checking, session, started, step]);
  function goTo(next: number) {
    focusEntry.current = 'step';
    setStep(next);
  }
  async function play() {
    if (checking || registrationInFlight.current || (!session && !mission)) return;
    void setGameFullscreen(true);
    if (session) { setStarted(true); return; }
    registrationInFlight.current = true;
    setEntering(true); setIssue('');
    try {
      const value = await api('register', { name: name.trim(), email: email.trim() });
      if (!isPlayerSession(value)) throw new Error('A participação não foi confirmada. Tente novamente.');
      setSession(value); setName(''); setEmail(''); setStarted(true);
    } catch (error) { setIssue(error instanceof Error ? error.message : 'Não foi possível iniciar sua participação.'); }
    finally { registrationInFlight.current = false; setEntering(false); }
  }
  function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (checking || entering || !event.currentTarget.reportValidity()) return;
    if (step === 0 && name.trim().length < 2 && nameInput.current) {
      nameInput.current.setCustomValidity('Informe pelo menos dois caracteres para o nome.');
      nameInput.current.reportValidity();
      return;
    }
    if (step === 3) void play();
    else goTo(step + 1);
  }
  if (session && started) return <SessionMetrics key={session.sessionId} session={session} onLogout={() => {
    void setGameFullscreen(false);
    focusEntry.current = 'name';
    setName('');
    setEmail('');
    setMission(null);
    setStep(0);
    setStarted(false);
    setSession(null);
  }}>{children(mission)}</SessionMetrics>;
  const current = ENTRY_STEPS[step]!;
  const busy = checking || entering;
  const librasContext = session ? 'Entrada da MISSÃO IPÊ. Uma participação está disponível neste navegador. Use Retomar jogo para voltar às missões. Nome, e-mail e registros pessoais não são enviados ao guia de Libras.' : `Entrada da MISSÃO IPÊ. Etapa ${step + 1} de quatro: ${current.label}. ${current.title} ${current.story} ${step === 1 ? 'O e-mail informado ficará no painel privado da equipe.' : step === 2 ? `Escolha entre ${ENTRY_MISSIONS.map(mission => MISSION_NAMES[mission.id]).join(', ')}. Cada missão pede uma evidência diferente.` : step === 3 ? 'Play registra a participação e inicia a missão escolhida.' : 'Use Continuar para avançar.'} O guia traduz esta orientação, sem receber o conteúdo dos campos.`;
  return <main className="player-entry" data-ipe-libras-context={librasContext.slice(0, 900)}>
    <a href="https://missao-ipe-central-ab.alexandrebelo.chatgpt.site/" className="player-entry-brand" aria-label="MISSÃO IPÊ, apresentação"><img src="./brand/missao-ipe-logo.svg" width="178" height="84" alt="MISSÃO IPÊ" /></a>
    <div className="player-entry-layout">
      <div className="player-entry-story">
        <h1>A ciência precisa <em>chegar.</em></h1>
        <p>{session ? 'Sua participação está pronta neste navegador. Retome para voltar às missões e ao seu progresso.' : current.story}</p>
      </div>
      <section className="player-entry-form" aria-labelledby="player-entry-title">
        {!session ? <p className="player-entry-step" id="player-entry-step">Etapa {step + 1} de {ENTRY_STEPS.length} · {current.label}</p> : null}
        <h2 ref={stepTitle} id="player-entry-title" tabIndex={-1} aria-describedby={!session ? 'player-entry-step' : undefined}>{session ? 'Quer retomar o jogo?' : current.title}</h2>
        {session ? <button className="button button-primary" type="button" onClick={() => void play()}><Icon name="play" size={17} />Retomar jogo</button> : <form onSubmit={submit}>
          {step === 0 ? <label htmlFor="player-name">Seu nome<input ref={nameInput} id="player-name" name="name" autoComplete="name" required minLength={2} maxLength={80} value={name} onChange={event => { event.currentTarget.setCustomValidity(''); setName(event.currentTarget.value); }} /></label> : null}
          {step === 1 ? <>
            <label htmlFor="player-email">Seu e-mail<input id="player-email" name="email" type="email" autoComplete="email" aria-describedby="player-email-help" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} /></label>
            <p id="player-email-help" className="player-data-note">O e-mail fica no painel privado da equipe MISSÃO IPÊ, junto ao registro da sua participação.</p>
          </> : null}
          {step === 2 ? <fieldset className="player-entry-missions">
            <legend className="sr-only">Tipo de missão</legend>
            {ENTRY_MISSIONS.map(({ id, objective }) => <label key={id} className="player-entry-mission">
              <input name="mission" type="radio" value={id} required checked={mission === id} aria-labelledby={`player-mission-${id}`} aria-describedby={`player-mission-${id}-objective`} onChange={() => setMission(id)} />
              <span><strong id={`player-mission-${id}`}>{MISSION_NAMES[id]}</strong><span id={`player-mission-${id}-objective`}>{objective}</span></span>
            </label>)}
          </fieldset> : null}
          {step === 3 && mission ? <>
            <p className="player-entry-confirmation"><strong>{MISSION_NAMES[mission]}</strong> · {ENTRY_MISSIONS.find(item => item.id === mission)!.objective}</p>
            <p className="player-data-note">Ao dar Play, seu nome, e-mail e ações de jogo entram no painel privado da equipe para analisar tentativas, dificuldades e respostas. A equipe usa esses dados apenas para essa análise. O histórico desta participação fica vinculado a este navegador.</p>
          </> : null}
          <div className="player-entry-actions">
            {step > 0 ? <button className="button button-secondary" type="button" aria-disabled={entering} onClick={() => { if (!entering) goTo(step - 1); }}><Icon name="back" size={16} />Voltar</button> : null}
            <button className="button button-primary" aria-disabled={busy} type="submit">{step === 3 ? <><Icon name="play" size={17} />Play</> : <>Continuar<Icon name="arrow" size={17} /></>}</button>
          </div>
        </form>}
        <p className="player-entry-status" role="status">{checking ? 'Verificando sua participação…' : entering ? 'Iniciando…' : ''}</p>
        <div className="player-entry-error" role="alert">{issue ? <p>{issue}</p> : null}</div>
        {issue ? <button ref={retryButton} className="text-button" type="button" aria-disabled={busy} onClick={() => { if (!busy) void resume(); }}>Verificar conexão novamente</button> : null}
      </section>
    </div>
  </main>;
}
function SessionMetrics({ session, onLogout, children }: { session: PlayerSession; onLogout: () => void; children: ReactNode }) {
  const [entries, setEntries] = useState<LocalMetric[]>([]);
  const entriesRef = useRef<LocalMetric[]>([]);
  const [issue, setIssue] = useState('');
  const [syncing, setSyncing] = useState(false);
  const sending = useRef(false);
  const active = useRef(true);
  function commit(next: LocalMetric[]) {
    entriesRef.current = next; setEntries(next);
    try { writeMetrics(localStorage, session.sessionId, next); }
    catch { setIssue('O navegador não guardou o progresso. Esta aba ainda mantém os dados; confira o envio antes de fechá-la.'); }
  }
  async function flush() {
    if (sending.current || !active.current) return;
    const pending = entriesRef.current.filter(item => item.sync === 'pending').slice(0,20);
    if (!pending.length) return;
    sending.current = true; setSyncing(true);
    try {
      const response = await api('events', { sessionId: session.sessionId, events: pending.map(item => item.event) });
      if (!active.current) return;
      commit(acknowledgeMetrics(entriesRef.current, response)); setIssue('');
    } catch (error) { if (active.current) setIssue(error instanceof Error ? error.message : 'Envio pendente. Seus eventos permanecem na fila deste navegador.'); }
    finally { sending.current = false; if (active.current) setSyncing(false); }
  }
  useEffect(() => {
    active.current = true;
    try { const saved = readMetrics(localStorage, session.sessionId); entriesRef.current = saved; setEntries(saved); }
    catch { setIssue('O histórico local não pôde ser lido. Os registros já recebidos pela equipe continuam no painel privado.'); }
    const syncStorage = (event: StorageEvent) => {
      if (event.key !== metricsKey(session.sessionId)) return;
      try { const next = mergeMetrics(entriesRef.current, readMetrics(localStorage, session.sessionId)); entriesRef.current = next; setEntries(next); } catch { setIssue('Outra aba alterou o histórico em um formato inválido.'); }
    };
    const online = () => void flush();
    window.addEventListener('storage', syncStorage); window.addEventListener('online', online);
    const timer = window.setInterval(() => void flush(), 5000);
    void flush();
    return () => { active.current = false; clearInterval(timer); window.removeEventListener('storage', syncStorage); window.removeEventListener('online', online); };
  }, [session.sessionId]);
  function knownEntries() {
    try { return mergeMetrics(entriesRef.current, readMetrics(localStorage, session.sessionId)); }
    catch { return entriesRef.current; }
  }
  function track(kind: MetricKind, mission: MetricMission, payload: Record<string, unknown>, summary?: AttemptSummary, correct?: boolean) {
    const known = knownEntries();
    if (kind === 'assessment') {
      const last = known.filter(item => item.event.kind === kind && item.event.mission === mission && item.event.payload.question === payload.question && item.event.payload.questionVersion === payload.questionVersion).at(-1);
      if (last?.event.payload.answer === payload.answer) return;
    }
    const event = newMetric(kind, mission, payload);
    commit([...known, { event, summary, correct, sync: 'pending' }]);
    void flush();
  }
  function recordConfirmedAttempts(attempts: readonly { event: MetricEvent; summary?: AttemptSummary }[]) {
    const known = knownEntries();
    const acknowledged = new Set(known.filter(item => item.sync === 'synced').map(item => item.event.id));
    const next = attempts.filter(({ event }) => !acknowledged.has(event.id));
    if (next.length) commit(mergeMetrics(known, next.map(item => ({ ...item, sync: 'synced' }))));
  }
  async function logout() {
    try { await api('logout', { sessionId: session.sessionId }); onLogout(); }
    catch (error) {
      if (error instanceof MetricsApiError && (error.status === 401 || error.status === 409)) { onLogout(); return; }
      setIssue(error instanceof Error ? error.message : 'Não foi possível encerrar a participação.');
    }
  }
  return <Metrics.Provider value={{ session, entries, issue, syncing, track, recordConfirmedAttempts, retry: () => void flush(), logout }}>{children}</Metrics.Provider>;
}
export function MissionScoreSummary({ score }: { score: MissionScore }) {
  return <div className="player-score">
    <p><strong>Pontuação da tentativa</strong> · {score.total} de {score.max} pontos</p>
    <ul>
      <li>Ciência válida: {score.science} de {MISSION_SCORE_LIMITS.science}</li>
      <li>Projeto compatível: {score.engineering} de {MISSION_SCORE_LIMITS.engineering}</li>
      <li>Folga em massa e orçamento: {score.efficiency} de {MISSION_SCORE_LIMITS.efficiency}</li>
    </ul>
    <small>Os pontos avaliam o resultado desta simulação.</small>
  </div>;
}
export function PlayerSyncStatus() {
  const metrics = usePlayerMetrics();
  const pending = metrics.entries.filter(item => item.sync === 'pending').length;
  const rejected = metrics.entries.some(item => item.sync === 'rejected');
  return <span className="player-sync" role="status">{metrics.syncing ? 'Enviando progresso…' : rejected ? 'Revisar envio no progresso' : pending ? `${pending} registro${pending === 1 ? '' : 's'} pendente${pending === 1 ? '' : 's'}` : metrics.entries.length ? 'Progresso enviado' : 'Pronto para sua primeira tentativa'}</span>;
}
export function PlayerDashboard({ onBack }: { onBack: () => void }) {
  const metrics = usePlayerMetrics();
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [ending, setEnding] = useState(false);
  const totals = summarizeMetrics(metrics.entries);
  const attempts = metrics.entries.filter(item => item.event.kind === 'attempt');
  const destinations = Object.keys(MISSION_NAMES) as MetricMission[];
  const completedDestinations = new Set(attempts.filter(item => item.sync === 'synced' && item.event.payload.status === 'completed' && item.summary?.outcome === 'success').map(item => item.event.mission));
  const answerGroups = new Map<string, LocalMetric[]>();
  for (const item of metrics.entries.filter(entry => entry.event.kind === 'assessment')) {
    const key = `${item.event.mission}:${item.event.payload.question}:${item.event.payload.questionVersion}`;
    answerGroups.set(key, [...(answerGroups.get(key) ?? []), item]);
  }
  function exportProgress() {
    const blob = new Blob([JSON.stringify({ version: 1, note: 'Progresso local desta participação; não comprova aprendizagem.', sessionId: metrics.session?.sessionId, entries: metrics.entries },null,2)], { type:'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href=url; link.download='missao-ipe-meu-progresso.json'; link.click(); URL.revokeObjectURL(url);
  }
  return <section className="player-dashboard" aria-labelledby="player-progress-title"><div className="player-dashboard-heading"><div><p className="eyebrow">MEU PROGRESSO · {metrics.session?.name}</p><h1 id="player-progress-title">Cada tentativa deixa uma evidência.</h1><p>Resultados calculados pelo jogo e respostas a perguntas com critério explícito. Uma missão cumprida não certifica aprendizagem.</p></div><button className="button button-secondary" onClick={onBack}>Voltar às missões</button></div><div className="player-stat-grid"><article><strong>{totals.attempts}</strong><span>Tentativas próprias</span><small>{totals.cancelled} canceladas · {totals.technicalErrors} interrupções técnicas</small></article><article><strong>{totals.successes} / {totals.completed}</strong><span>Missões cumpridas</span><small>{totals.failures} não cumpridas · {totals.invalid} projetos incompatíveis</small></article><article><strong>{totals.questions ? `${totals.firstCorrect} / ${totals.questions}` : 'Sem respostas'}</strong><span>Primeiras respostas corretas</span><small>{totals.questions ? `${totals.latestCorrect} corretas na última resposta · ${totals.revisions} revisões` : 'Avaliações disponíveis em Cerrado, Bennu e Webb.'}</small></article><article><strong>{totals.inspections}</strong><span>Inspeções de evidências e nave</span><small>{totals.decisions} mudanças de configuração</small></article></div><section className="player-campaign-milestone" aria-labelledby="player-campaign-title">
      <p className="eyebrow">EXPEDIÇÃO PELOS SETE DESTINOS</p>
      <h2 id="player-campaign-title">{completedDestinations.size} de {destinations.length} destinos cumpridos</h2>
      <progress value={completedDestinations.size} max={destinations.length} aria-label="Destinos com missão cumprida e registro confirmado" />
      <p>{completedDestinations.size === destinations.length ? 'Você completou uma missão em cada destino. Compare suas escolhas, explique os resultados e tente uma arquitetura diferente.' : 'Cada destino avança com uma tentativa própria bem-sucedida e confirmada pelo servidor. Repetir o mesmo destino não aumenta este total.'}</p>
      <ul>{destinations.map(id => <li key={id} data-complete={completedDestinations.has(id)}><strong>{MISSION_NAMES[id]}</strong><span>{completedDestinations.has(id) ? 'Cumprido · confirmado' : 'A concluir e confirmar'}</span></li>)}</ul>
      <p className="field-help">Este marco não concede créditos extras nem bloqueia missões. A pontuação descreve o resultado da simulação; a aprendizagem é discutida no relatório.</p>
    </section><div className="player-mission-progress">{(Object.keys(MISSION_NAMES) as MetricMission[]).map(id => { const selected = metrics.entries.filter(item => item.event.mission === id); const s = summarizeMetrics(selected); const completed = selected.filter(item => item.event.kind === 'attempt' && item.summary); const first = completed[0]?.summary; const latest = completed.at(-1)?.summary; const roleReview = selected.filter(item => item.event.kind === 'role_review').at(-1); return <article key={id}><h2>{MISSION_NAMES[id]}</h2><p>{s.completed ? `${s.successes} de ${s.completed} tentativas concluídas cumpriram a missão.` : 'Sua primeira tentativa ainda não foi executada.'}</p>{latest ? <><strong>{latest.valid} / {latest.required} registros válidos</strong><p>{latest.received} pacotes completos na última tentativa.{latest.score ? ` Pontuação: ${latest.score.total} de ${latest.score.max}.` : ''}</p>{first?.score && latest.score ? <p>Primeira pontuação: {first.score.total} de {first.score.max}. Última pontuação: {latest.score.total} de {latest.score.max}.</p> : null}</> : null}{roleReview ? <p>{isBrunoMission(id) ? 'Segmentos marcados como revisados' : 'Último registro de pareceres'}: {Number(roleReview.event.payload.count)} / 4, sem nota automática.</p> : null}<p className="field-help">Aprendizado praticado: {MISSION_LESSONS[id]}</p>{isBrunoMission(id) ? <p className="field-help">Avaliação de aprendizagem ainda não disponível nesta missão. A pontuação descreve a simulação.</p> : null}</article>; })}</div><section className="player-metrics-sync" aria-label="Envio do progresso"><h2>Seu registro na equipe</h2><p>{metrics.syncing ? 'Enviando…' : `${metrics.entries.filter(item => item.sync === 'synced').length} eventos confirmados pelo servidor; ${totals.pending} pendentes; ${totals.rejected} recusados.`}</p>{!confirmEnd && metrics.issue ? <p role="alert">{metrics.issue}</p> : null}{totals.rejected ? <p>Eventos recusados não entram no painel da equipe. O arquivo de progresso conserva os motivos para revisão.</p> : null}<div className="player-actions"><button className="button button-secondary" aria-disabled={metrics.syncing || totals.pending === 0} onClick={() => { if (!metrics.syncing && totals.pending > 0) metrics.retry(); }}>Tentar envio novamente</button><button className="button button-secondary" onClick={exportProgress} disabled={!metrics.entries.length}>Exportar meu progresso</button><button className="text-button" aria-haspopup="dialog" onClick={() => setConfirmEnd(true)}>Encerrar participação neste aparelho</button></div>
    {confirmEnd ? <Dialog title="Encerrar participação?" onClose={() => setConfirmEnd(false)}><p>{totals.pending ? `Há ${totals.pending} eventos ainda não enviados. Exporte o progresso antes de encerrar; eles não serão enviados com a identidade de outra pessoa.` : 'Os dados já enviados continuam disponíveis à equipe. Uma nova entrada começa outra participação.'}</p>
      <div role="alert">{metrics.issue}</div>
      <div className="player-actions">
        <button className="button button-secondary" onClick={() => setConfirmEnd(false)}>Continuar jogando</button>
        <button className="button button-secondary" aria-disabled={ending} onClick={async () => {
          if (ending) return;
          setEnding(true);
          try { await metrics.logout(); } finally { setEnding(false); }
        }}>Confirmar encerramento</button>
      </div>
    </Dialog> : null}<p className="field-help">Este resumo lê os registros desta participação neste navegador. O painel privado da equipe recebe os eventos confirmados de todos os aparelhos. Ensaios guiados, buscas automáticas e replays não contam como tentativas suas. Sem login, digitar o mesmo e-mail em outro aparelho inicia outra participação.</p></section><section className="player-question-results" aria-labelledby="player-questions-title"><h2 id="player-questions-title">O que você respondeu — e revisou</h2>{answerGroups.size ? <div className="table-scroll" role="region" aria-labelledby="player-questions-title" tabIndex={0}><table className="source-table"><thead><tr><th scope="col">Pergunta</th><th scope="col">Primeira resposta</th><th scope="col">Última resposta</th><th scope="col">Revisões</th></tr></thead><tbody>{[...answerGroups].map(([key,answers]) => <tr key={key}><th scope="row">{MISSION_NAMES[answers[0]!.event.mission]} · {answers[0]!.event.payload.question === 'prediction' ? 'Previsão A/B' : 'Interpretação científica'}</th><td>{answers[0]!.correct ? 'Compatível com o critério' : 'Não correspondeu ao critério'}</td><td>{answers.at(-1)!.correct ? 'Compatível com o critério' : 'Não correspondeu ao critério'}</td><td>{answers.length - 1}</td></tr>)}</tbody></table></div> : <p>Faça uma previsão no experimento guiado ou interprete a evidência ao concluir sua missão. Só respostas que você deu entram neste resumo.</p>}<p className="field-help">Previsões são conferidas com os dois ensaios calculados. Interpretações são conferidas com o alcance da evidência indicado no exercício. Uma mesma pergunta conta uma vez; mudanças posteriores aparecem como revisões.</p></section><h2>O que aconteceu em cada tentativa</h2><p>A nota de cada simulação combina até 60 pontos por registros válidos, 30 pela compatibilidade do projeto e até 10 pela folga em massa e orçamento.</p>{attempts.length ? <ol className="player-attempt-list">{[...attempts].reverse().map((item,index) => <li key={item.event.id}><div><strong>{MISSION_NAMES[item.event.mission]} · tentativa {attempts.length-index}</strong><span>{new Date(item.event.at).toLocaleString('pt-BR')} · {item.summary ? item.summary.outcome === 'success' ? 'Missão cumprida' : item.summary.outcome === 'invalid' ? 'Projeto incompatível' : 'Missão não cumprida' : item.event.payload.status === 'cancelled' ? 'Cancelada' : 'Interrupção técnica'}</span></div>{item.summary ? <><p>{item.summary.received} pacotes completos · {item.summary.valid}/{item.summary.required} registros válidos · {item.summary.massKg.toLocaleString('pt-BR')} kg · {item.summary.credits} créditos.</p>{item.summary.score ? <MissionScoreSummary score={item.summary.score} /> : null}{item.summary.diagnostics.length ? <ul>{item.summary.diagnostics.map(d => <li key={d.code}><strong>T+{Math.round(d.timeS)} s</strong> — {d.message}</li>)}</ul> : <p>Os requisitos do modelo foram atendidos nesta execução.</p>}</> : <p>A operação não produziu um resultado concluído. Isso não é contado como erro de engenharia.</p>}<small>{item.sync === 'synced' ? 'Recebido pela equipe' : item.sync === 'rejected' ? `Recusado: ${item.reason}` : 'Aguardando envio'}</small></li>)}</ol> : <p className="player-empty">Comece por uma missão. Ao executar seu projeto, o resultado aparecerá aqui automaticamente.</p>}</section>;
}
