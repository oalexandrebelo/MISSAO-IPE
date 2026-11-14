import { CATALOG, CONFIG_KEYS, DEFAULT_CONFIG, getConfigTotals, getScenario } from '../../src/core/catalog.ts';
import { CATALOG_VERSION, ENGINE_VERSION } from '../../src/core/contracts.ts';
import type { ConfigKey, MissionConfig, MissionResult, ScenarioId, SearchResult } from '../../src/core/contracts.ts';
import { simulateMission } from '../../src/core/engine.ts';
import { enumerateConfigurations, hammingDistance, searchCatalog } from '../../src/core/search.ts';
import { SCIENCE_RECORDS } from '../../src/data/science-data.ts';
import { validateScienceRecord } from '../../src/core/science.ts';

/** Presentation UI only. Physics, science, classifications and search come from the product core. */
const $ = <T extends HTMLElement = HTMLElement>(id: string): T => {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Elemento da apresentação ausente: ${id}`);
  return element as T;
};
const el = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, className?: string): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
};
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (name: string, attrs: Record<string, string | number> = {}, text?: string): SVGElement => {
  const element = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attrs)) element.setAttribute(key, String(value));
  if (text !== undefined) element.textContent = text;
  return element;
};
const svg = (width: number, height: number, label: string): SVGSVGElement => {
  const element = svgEl('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': label }) as SVGSVGElement;
  element.append(svgEl('title', {}, label));
  return element;
};
const num = (value: number, digits = 2) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: digits }).format(value);
const minute = (seconds: number) => `${num(seconds / 60, 2)} min`;
const dataValue = (id: string, raw: number | string, formatted: string) => {
  const element = $(id);
  element.dataset.value = String(raw);
  element.textContent = formatted;
};
const labels: Record<ConfigKey, string> = {
  battery: 'Bateria', panel: 'Painel solar', processing: 'Processamento',
  radio: 'Rádio', buffer: 'Armazenamento', policy: 'Política de contato',
};
const choiceText: Record<ConfigKey, string> = {
  battery: '16 ou 24 Wh. Descarga máxima de 20 ou 35 W.',
  panel: '12 ou 18 W nominais. A geração depende do cenário.',
  processing: 'BANDAS: 180 Mbit / 26 W. ÍNDICE: 60 Mbit / 38 W.',
  radio: '0,96 ou 2,4 Mbit/s. A taxa altera a carga.',
  buffer: '512 ou 1.536 Mbit. Lotes completos disputam espaço.',
  policy: 'Todos os contatos ou somente o último.',
};
const base: MissionConfig = { ...DEFAULT_CONFIG };
const indexOnly: MissionConfig = { ...DEFAULT_CONFIG, processing: 'index' };
const repaired: MissionConfig = { ...DEFAULT_CONFIG, battery: 'large', processing: 'index' };
const sameConfig = (a: MissionConfig, b: MissionConfig) => CONFIG_KEYS.every(key => a[key] === b[key]);
const outcomeLabels: Record<MissionResult['outcome'], string> = { success: 'Sucesso', failure: 'Falha', invalid: 'Projeto inválido' };
const observationLabels: Record<string, string> = { 'not-produced': 'Não produzido', queued: 'Na fila', partial: 'Parcial', delivered: 'Recebido', lost: 'Perdido', invalid: 'Inválido' };

const notes = [
  { pt: 'Quanta ciência chega ao chão? Missão Ipê é um jogo de decisões de missão. O objetivo é entregar seis resultados NDVI utilizáveis. O participante altera recursos e inspeciona por que a missão atende ou perde esse objetivo.', en: 'How much science actually reaches the ground? IPÊ is a mission design game. The goal is to deliver six usable NDVI results. Players change resources and inspect why a mission meets or misses its goal.', cue: 'Abertura. Apresente o resultado esperado antes de falar sobre peças ou tecnologias.' },
  { pt: 'Usamos seis registros reais do produto MOD13Q1.061, em três coordenadas próximas a Rio Verde. Eles vêm de duas composições de 2024. A missão simulada só conta um registro quando ele chega inteiro ao solo, passa pelo filtro de qualidade e tem seu NDVI conferido. A nave didática não coletou MODIS.', en: 'We use six real MOD13Q1.061 records from three requested locations near Rio Verde, in two 2024 composites. A record counts only after complete reception, accepted quality flags and a verified NDVI value. The teaching spacecraft did not acquire MODIS data.', cue: 'Clique nos quatro segmentos para explicar como o objetivo do usuário afeta a missão.' },
  { pt: 'Bateria, painel, processamento, rádio, memória e política de contato oferecem duas opções cada. São 64 combinações. Massa, créditos e potência limitam o projeto. A escolha de uma peça mais capaz precisa ser examinada junto das outras.', en: 'Battery, solar panel, processing, radio, memory and contact policy each offer two choices. This creates 64 configurations. Mass, credits and power constrain the design. A more capable component must be assessed together with the rest of the system.', cue: 'Os parâmetros são hipóteses didáticas versionadas. Não os apresente como especificações NASA.' },
  { pt: 'A configuração-base entrega seis de seis registros em dois contatos longos. Reduzindo cada contato de 600 para 240 segundos, a mesma configuração entrega apenas dois registros completos. Parte do terceiro registro chegou, mas ainda não é um resultado utilizável.', en: 'The baseline delivers all six records with two long contacts. Shortening each contact from 600 to 240 seconds leaves only two complete records. Part of a third record arrives, but it is not yet a usable scientific result.', cue: 'Peça uma hipótese de redesenho antes de abrir o próximo quadro. O gargalo aqui é entrega, não falta de energia.' },
  { pt: 'Execute a base longa, depois a base curta. Escolha só ÍNDICE: os lotes diminuem de 180 para 60 Mbit, mas a carga sobe de 26 para 38 W. A bateria pequena não consegue fornecer o pico necessário e a operação termina aos 600 segundos. Depois das duas observações, o caso de duas mudanças abre. Bateria grande mais ÍNDICE entrega seis de seis no contato curto.', en: 'Run the long baseline, then the short baseline. Choose INDEX only: batches shrink from 180 to 60 Mbit, while processing load rises from 26 to 38 watts. The small battery cannot supply the required peak power, so operation ends at 600 seconds. After both trials, the two-change case unlocks. A larger battery plus INDEX delivers all six records in the short-contact scenario.', cue: 'Ajuda do facilitador: este painel contém a solução. Durante a exploração do participante, mantenha as notas fechadas. O cronômetro não interfere na simulação.' },
  { pt: 'A busca enumera todas as 64 configurações do cenário curto. São nove sucessos, 49 falhas e seis configurações inválidas. Todas as sete configurações com zero ou uma mudança falham. Bateria grande mais ÍNDICE é a única solução com duas mudanças a partir da base, dentro deste catálogo. Ela usa 3,5 kg e 84 créditos.', en: 'The search evaluates every short-contact configuration: nine successes, 49 failures and six invalid designs. All seven configurations at distance zero or one fail. A larger battery plus INDEX is the unique solution at distance two from the baseline, within this catalog. It uses 3.5 kilograms and 84 credits.', cue: 'Ajuda do facilitador: resultado restrito ao catálogo ipe-64-v1. Não chamar de projeto espacial universalmente ótimo.' },
  { pt: 'Missão Ipê pede uma previsão, mostra evidências e exige uma justificativa para o redesenho. O protótipo já executa a missão e preserva a origem dos resultados. A próxima etapa é ensaiar no equipamento e observar pessoas. A elegibilidade temporal e a lista oficial de Resources continuam pendentes.', en: 'IPÊ asks for a prediction, shows evidence and asks players to explain their redesign. The prototype runs the mission and preserves the origin of its results. Next steps are testing on the presentation hardware and observing people. Temporal eligibility and the official challenge Resources list remain unresolved.', cue: 'O ZIP deve permanecer completo para abrir o jogo e o PDF. Nenhum envio ou endosso institucional é reivindicado.' },
  { pt: 'Cada ponto usa RED e NIR reais, com escala comum de 0,0001. O motor aplica uma política fechada de QA e confere o NDVI com tolerância de 0,0001. As datas selecionadas são 1 e 23 de setembro de 2024, dentro de composições de 16 dias. Coordenadas solicitadas não são apresentadas como centros exatos de pixel.', en: 'Each point uses real RED and NIR bands with a common scale of 0.0001. The engine applies a closed QA policy and checks NDVI within a declared 0.0001 tolerance. Selected observations are from September 1 and 23, 2024, inside 16-day composites. Requested coordinates are not claimed to be exact pixel centers.', cue: 'Clique em um dos seis registros. Os números vêm de validateScienceRecord(), o mesmo verificador do núcleo.' },
  { pt: 'O caso ÍNDICE isolado falha por potência. Aos 600 segundos a bateria ainda armazena aproximadamente 13,96 Wh. A demanda de descarga é cerca de 29,58 W e o limite é 20 W. A energia armazenada não remove esse limite instantâneo.', en: 'The INDEX-only case fails on power. At 600 seconds, the battery still stores about 13.96 watt-hours. Required battery discharge is about 29.58 watts, above its 20-watt limit. Stored energy does not remove that instantaneous limit.', cue: 'Os valores vêm do evento PEAK_POWER. Não confundir 38 W de carga total com 29,58 W exigidos na bateria após geração e perdas.' },
  { pt: 'Jogo, busca e replay compartilham a mesma função de simulação. Esta apresentação também a importa. Os controles visuais não decidem a classificação. O trace é consequência da execução e pode ser inspecionado sem alterar a física. Esta variante usa a thread principal e não depende de rede.', en: 'The game, catalog search and replay share one simulation function. This presentation imports that function too. Visual controls do not decide the classification. The trace is an output of execution and can be inspected without changing the physics. This variant runs on the main thread without a network dependency.', cue: 'O HTML não contém pontuação animada nem cópia manual das equações para produzir sucesso.' },
  { pt: 'A aprendizagem é uma hipótese. O plano formativo propõe pilotos e sessões observadas para ver se as pessoas explicam o recurso limitante e transferem a relação para outra condição. Não tivemos participantes nesta rodada. Concluir a tarefa com ajuda do solver não prova compreensão.', en: 'Learning remains a hypothesis. The formative plan proposes pilots and observed sessions to see whether people can explain the limiting resource and transfer that relationship to a different condition. No participants were studied in this round. Completing the task with solver assistance does not prove understanding.', cue: 'Não transformar as nove contagens TAP em nove pessoas. Tempo previsto de oito minutos por ciclo não foi medido.' },
  { pt: 'Os recibos documentam 51 testes de núcleo, nove contagens TAP em DOM simulado e oito casos HTTP. O oráculo independente comparou 128 configurações. O benchmark é do executor AMD EPYC, sem interface ou GPU, e não dos computadores de AB. AB-R3A registrou observações estruturais com cobertura parcial.', en: 'The receipts document 51 core tests, nine TAP counts in a simulated DOM and eight HTTP cases. An independent oracle compared 128 configurations. The benchmark belongs to the AMD EPYC executor, excludes the interface and GPU, and does not describe AB’s computers. AB-R3A reported structural observations with partial coverage.', cue: 'Separar testes executados, inferências e gates abertos. DOM simulado não é inspeção visual de navegador.' },
  { pt: 'O código específico começou antes do horário oficial local. A orientação pública menciona risco de desclassificação e a elegibilidade não está estabelecida. A lista oficial de Resources ainda precisa ser confirmada. Este material pode continuar como P&D, com cronologia preservada. Os sete quadros são um formato local de pitch, não uma certificação de submissão.', en: 'Specific development began before the official local start. Public guidance mentions a risk of disqualification, and eligibility has not been established. The official Resources list still needs confirmation. This work can continue as research with its chronology preserved. Seven slides are a local pitch format, not submission certification.', cue: 'Leia research/11-revisao-spaceapps-apresentacao.md para a revisão da rodada. IA foi usada na pesquisa, código e narrativa, não como fonte dos dados MOD13.' },
  { pt: 'As fontes separam ciência, engenharia e regras. MOD13 sustenta bandas, NDVI e qualidade. O serviço ORNL sustenta a recuperação dos registros. As referências de missão orientam segmentos e requisitos. O GO Team e a página de Resources tratam do uso competitivo. Um grupo de fontes não substitui o outro.', en: 'Sources distinguish science, engineering and rules. MOD13 supports the bands, NDVI and quality checks. ORNL supports record retrieval. Mission references inform segments and requirements. GO Team guidance and the Resources page govern competitive use. One source category cannot replace another.', cue: 'Os JSONs A, B e C estão incorporados. Links externos só precisam de rede quando o público escolhe abri-los.' },
  { pt: 'O arquivo é autocontido para apresentação e cálculo. Links de jogo, dossiê e evidências exigem o pacote completo. Navegação, notas e impressão têm controles explícitos. O cronômetro só começa por gesto e pausa quando o painel fecha ou a aba fica oculta. O ensaio visual no equipamento continua sendo uma etapa própria.', en: 'The file is self-contained for presentation and computation. Links to the game, dossier and evidence require the complete package. Navigation, notes and printing have explicit controls. The timer starts only after a deliberate action and pauses when the panel closes or the tab is hidden. Visual rehearsal on the actual hardware remains a separate step.', cue: 'Se fullscreen ou armazenamento local não estiverem disponíveis, continue com os controles da página. Nenhuma gravação é necessária para calcular.' },
];

const slides = [...document.querySelectorAll<HTMLElement>('[data-slide]')];
let mode: 'pitch' | 'explore' = 'pitch';
let current = 0;
let lastPitch = 0;
let previousFocus: HTMLElement | null = null;
let observedShort = false;
let observedIndex = false;
let currentResult: MissionResult | null = null;
let catalogResult: SearchResult | null = null;
let catalogRuns: MissionResult[] = [];
let timerElapsed = 0;
let timerStartedAt = 0;
let timerInterval: ReturnType<typeof setInterval> | undefined;
const blobUrls = new Set<string>();

const toast = (message: string) => { $('status-message').textContent = message; $('status-message').hidden = false; };
const visibleIndices = () => slides.flatMap((slide, index) => mode === 'explore' || slide.dataset.pitch === 'true' ? [index] : []);
function updateNotes() {
  const language = $('notes-language') as HTMLSelectElement;
  const note = notes[current];
  const slide = slides[current];
  if (!note || !slide) return;
  $('notes-slide-title').textContent = slide.dataset.title ?? '';
  $('notes-text').textContent = language.value === 'en' ? note.en : note.pt;
  $('notes-text').lang = language.value === 'en' ? 'en' : 'pt-BR';
  $('notes-cue').textContent = note.cue;
}
function buildOverview() {
  const container = $('overview-grid');
  container.replaceChildren();
  for (const index of visibleIndices()) {
    const button = el('button');
    button.type = 'button';
    button.dataset.goSlide = String(index);
    button.dataset.appendix = String(index >= 7);
    if (index === current) button.setAttribute('aria-current', 'page');
    button.append(el('span', index < 7 ? `PITCH ${String(index + 1).padStart(2, '0')}` : `APÊNDICE A${index - 6}`), el('strong', slides[index]!.dataset.title?.replace(/^A\d · /, '') ?? ''));
    container.append(button);
  }
  $('overview-mode-description').textContent = mode === 'pitch' ? 'Pitch de sete quadros. A exploração técnica abre pelo controle no cabeçalho.' : 'Sete quadros de pitch e oito apêndices para a conversa técnica.';
}
function setSlide(index: number, focus = false) {
  if (!Number.isInteger(index) || index < 0 || index >= slides.length) return;
  if (index >= 7 && mode === 'pitch') mode = 'explore';
  current = index;
  if (index < 7) lastPitch = index;
  const visible = visibleIndices();
  if (!visible.includes(current)) current = visible[0]!;
  const active = slides[current]!;
  slides.forEach((slide, position) => {
    slide.hidden = position !== current;
    slide.setAttribute('aria-hidden', String(position !== current));
    slide.dataset.inMode = String(visible.includes(position));
  });
  $('slides').dataset.mode = mode;
  $('mode-pitch').setAttribute('aria-pressed', String(mode === 'pitch'));
  $('mode-explore').setAttribute('aria-pressed', String(mode === 'explore'));
  const localIndex = visible.indexOf(current);
  $('slide-counter').textContent = `${String(localIndex + 1).padStart(2, '0')} / ${String(visible.length).padStart(2, '0')}`;
  $('current-slide-label').textContent = active.dataset.title ?? '';
  ($('previous-slide') as HTMLButtonElement).disabled = localIndex === 0;
  ($('next-slide') as HTMLButtonElement).disabled = localIndex === visible.length - 1;
  $('status-message').hidden = true;
  try { history.replaceState(null, '', `#${active.id}`); } catch { /* File readers can forbid history writes; navigation remains local. */ }
  updateNotes();
  buildOverview();
  if (focus) {
    const heading = active.querySelector<HTMLElement>('h1,h2');
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
  }
}
function moveSlide(delta: number) {
  const visible = visibleIndices();
  const next = visible[visible.indexOf(current) + delta];
  if (next !== undefined) setSlide(next, true);
}
function setMode(next: 'pitch' | 'explore') {
  mode = next;
  setSlide(next === 'pitch' && current >= 7 ? lastPitch : current);
}
function openOverview() {
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  buildOverview();
  $('overview-dialog').hidden = false;
  $('close-overview').focus();
}
function closeOverview() {
  $('overview-dialog').hidden = true;
  previousFocus?.focus({ preventScroll: true });
  previousFocus = null;
}
function timerDisplay() {
  const seconds = Math.floor((timerElapsed + (timerInterval !== undefined ? Date.now() - timerStartedAt : 0)) / 1000);
  $('timer-value').textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  $('timer-value').dataset.seconds = String(seconds);
}
function pauseTimer() {
  if (timerInterval !== undefined) {
    timerElapsed += Math.max(0, Date.now() - timerStartedAt);
    clearInterval(timerInterval);
    timerInterval = undefined;
  }
  $('timer-toggle').textContent = timerElapsed > 0 ? 'Retomar cronômetro' : 'Iniciar cronômetro';
  $('timer-toggle').setAttribute('aria-pressed', 'false');
  timerDisplay();
}
function toggleNotes(force?: boolean) {
  const open = force ?? $('notes-panel').hidden;
  $('notes-panel').hidden = !open;
  $('open-notes').setAttribute('aria-expanded', String(open));
  if (!open) pauseTimer();
  else updateNotes();
}
function setMetricPending(id: string) { $(id).textContent = '—'; delete $(id).dataset.value; }
function invalidateDemo() {
  currentResult = null;
  for (const id of ['demo-delivered', 'demo-bits', 'demo-queue', 'demo-energy', 'demo-load']) setMetricPending(id);
  $('demo-result').dataset.outcome = 'pending';
  $('demo-outcome').dataset.outcome = 'pending';
  $('demo-outcome').textContent = 'Configuração ainda não executada';
  $('demo-diagnosis').textContent = 'Execute para calcular o resultado das escolhas atuais.';
  $('demo-trace').replaceChildren();
  $('demo-events').replaceChildren();
  $('demo-observations').replaceChildren();
  const range = $('trace-range') as HTMLInputElement;
  range.disabled = true;
  range.min = '0'; range.max = '0'; range.value = '0';
  $('trace-time').textContent = '—';
  $('trace-detail').textContent = 'O controle lê estados calculados. Arrastar não muda a física.';
  updateEnvelope();
}
function readConfig(): MissionConfig {
  const config: Record<string, string> = {};
  for (const key of CONFIG_KEYS) config[key] = ($(`config-${key}`) as HTMLSelectElement).value;
  return config as unknown as MissionConfig;
}
function readScenario(): ScenarioId { return ($('scenario-select') as HTMLSelectElement).value as ScenarioId; }
function updateEnvelope() {
  const totals = getConfigTotals(readConfig());
  const scenario = getScenario(readScenario());
  const valid = totals.massKg <= scenario.maxMassKg && totals.credits <= scenario.budget;
  $('config-envelope').textContent = `${num(totals.massKg)} / ${num(scenario.maxMassKg)} kg · ${totals.credits} / ${scenario.budget} créditos${valid ? '' : ' · Fora do envelope'}`;
  $('config-envelope').dataset.valid = String(valid);
  $('config-envelope').style.color = valid ? '' : 'var(--red)';
}
function setConfig(config: MissionConfig, scenario: ScenarioId) {
  for (const key of CONFIG_KEYS) ($(`config-${key}`) as HTMLSelectElement).value = config[key];
  ($('scenario-select') as HTMLSelectElement).value = scenario;
  invalidateDemo();
}
function updateGate() {
  const unlocked = observedShort && observedIndex;
  ($('preset-repair') as HTMLButtonElement).disabled = !unlocked;
  ($('run-catalog') as HTMLButtonElement).disabled = !unlocked;
  $('catalog-locked').hidden = unlocked;
  $('catalog-content').hidden = !unlocked;
  $('demo-gate').dataset.shortObserved = String(observedShort);
  $('demo-gate').dataset.indexObserved = String(observedIndex);
  $('demo-gate').dataset.unlocked = String(unlocked);
  $('demo-gate').textContent = unlocked
    ? 'Duas tentativas observadas. Agora o quarto caso e a busca completa estão disponíveis.'
    : `${observedShort ? '✓' : '○'} Base curta observada · ${observedIndex ? '✓' : '○'} Só ÍNDICE observado. Execute ambos para abrir o redesenho.`;
}
function makeContacts(container: string, scenarioId: ScenarioId) {
  const scenario = getScenario(scenarioId);
  const node = svg(480, 113, `${scenario.title}: ${scenario.contacts.map(([a, b]) => `${minute(a)} a ${minute(b)}`).join('; ')}, em uma agenda didática de 180 minutos`);
  const left = 20, right = 455, y = 64;
  const x = (time: number) => left + time / scenario.horizonS * (right - left);
  const firstContact = scenario.contacts[0]!;
  node.append(svgEl('text', { x: left, y: 19, fill: '#52666d', 'font-size': 13 }, `${scenario.contacts.length} janelas × ${firstContact[1] - firstContact[0]} s`));
  node.append(svgEl('line', { x1: left, y1: y, x2: right, y2: y, stroke: '#c5cecc', 'stroke-width': 6 }));
  for (const [start, end] of scenario.contacts) {
    node.append(svgEl('rect', { x: x(start), y: y - 11, width: x(end) - x(start), height: 22, rx: 2, fill: scenarioId === 'long-contact' ? '#286f58' : '#a23c32' }));
  }
  for (const time of [0, 3600, 7200, 10800]) {
    node.append(svgEl('line', { x1: x(time), x2: x(time), y1: 75, y2: 82, stroke: '#52666d' }));
    node.append(svgEl('text', { x: x(time), y: 101, 'text-anchor': time === 0 ? 'start' : time === 10800 ? 'end' : 'middle', fill: '#52666d', 'font-size': 12 }, minute(time)));
  }
  $(container).replaceChildren(node);
}
function renderTrace(result: MissionResult) {
  const node = svg(700, 108, 'Energia da bateria em Wh ao longo dos 180 minutos do modelo didático. Use o controle para inspecionar cada estado calculado.');
  const left = 32, right = 686, top = 9, bottom = 80;
  const capacity = CATALOG.battery.find(choice => choice.id === result.config.battery)!.capacityWh!;
  const horizon = getScenario(result.scenarioId).horizonS;
  const x = (t: number) => left + t / horizon * (right - left);
  const y = (e: number) => bottom - e / capacity * (bottom - top);
  for (const energy of [0, capacity / 2, capacity]) {
    node.append(svgEl('line', { x1: left, x2: right, y1: y(energy), y2: y(energy), stroke: '#d4d9d5', 'stroke-width': .7 }));
    node.append(svgEl('text', { x: 25, y: y(energy) + 3, 'text-anchor': 'end', fill: '#52666d', 'font-size': 9 }, String(energy)));
  }
  node.append(svgEl('line', { x1: left, x2: right, y1: y(result.reserveWh), y2: y(result.reserveWh), stroke: '#a23c32', 'stroke-dasharray': '4 4', 'stroke-width': .8 }));
  node.append(svgEl('text', { x: right - 1, y: y(result.reserveWh) - 4, 'text-anchor': 'end', fill: '#a23c32', 'font-size': 9 }, `reserva ${num(result.reserveWh)} Wh`));
  const path = result.trace.map((point, index) => `${index ? 'L' : 'M'}${x(point.timeS)} ${y(point.energyWh)}`).join(' ');
  node.append(svgEl('path', { d: path, fill: 'none', stroke: '#286f58', 'stroke-width': 2.3, 'stroke-linejoin': 'round' }));
  for (const time of [0, 3600, 7200, 10800]) node.append(svgEl('text', { x: x(time), y: 103, 'text-anchor': time === 0 ? 'start' : time === 10800 ? 'end' : 'middle', fill: '#52666d', 'font-size': 10 }, minute(time)));
  node.append(svgEl('line', { id: 'trace-cursor', x1: left, x2: left, y1: top, y2: bottom, stroke: '#885500', 'stroke-width': 1, 'stroke-dasharray': '3 3' }));
  node.append(svgEl('circle', { id: 'trace-dot', cx: left, cy: y(result.initialEnergyWh), r: 3.5, fill: '#edb64c', stroke: '#0b2030', 'stroke-width': 1 }));
  $('demo-trace').replaceChildren(node);
  const range = $('trace-range') as HTMLInputElement;
  range.max = String(Math.max(0, result.trace.length - 1));
  range.disabled = result.trace.length === 0;
  range.value = range.max;
  updateTracePoint();
}
function updateTracePoint() {
  if (!currentResult) return;
  const index = Number(($('trace-range') as HTMLInputElement).value);
  const point = currentResult.trace[index];
  if (!point) return;
  const capacity = CATALOG.battery.find(choice => choice.id === currentResult!.config.battery)!.capacityWh!;
  const horizon = getScenario(currentResult.scenarioId).horizonS;
  const x = 32 + point.timeS / horizon * (686 - 32);
  const y = 80 - point.energyWh / capacity * (80 - 9);
  const cursor = document.getElementById('trace-cursor');
  cursor?.setAttribute('x1', String(x)); cursor?.setAttribute('x2', String(x));
  const dot = document.getElementById('trace-dot');
  dot?.setAttribute('cx', String(x)); dot?.setAttribute('cy', String(y));
  $('trace-time').textContent = minute(point.timeS);
  $('trace-time').dataset.value = String(point.timeS);
  $('trace-detail').textContent = `${num(point.energyWh)} Wh · carga efetiva ${num(point.loadW)} W · solar ${num(point.solarW)} W · fila ${num(point.queueBits / 1e6)} Mbit · ${point.mode}`;
}
function renderResult(result: MissionResult) {
  currentResult = result;
  $('demo-result').dataset.outcome = result.outcome;
  $('demo-outcome').dataset.outcome = result.outcome;
  $('demo-outcome').textContent = outcomeLabels[result.outcome];
  dataValue('demo-delivered', result.deliveredRecords, `${result.deliveredRecords}/${result.requiredRecords}`);
  const firstError = result.events.find(event => event.severity === 'error');
  $('demo-diagnosis').textContent = firstError ? `${minute(firstError.timeS)} · ${firstError.message}` : `Horizonte concluído. ${num(result.massKg)} kg e ${result.credits} créditos, dentro do envelope.`;
  dataValue('demo-bits', result.downlinkedBits, `${num(Number(result.downlinkedBits) / 1e6)} Mbit`);
  dataValue('demo-queue', result.queueBits, `${num(Number(result.queueBits) / 1e6)} Mbit`);
  dataValue('demo-energy', result.finalEnergyWh, `${num(result.finalEnergyWh)} Wh`);
  const load = CATALOG.processing.find(choice => choice.id === result.config.processing)!.totalLoadW!;
  dataValue('demo-load', load, `${num(load)} W`);
  const observationContainer = $('demo-observations');
  observationContainer.replaceChildren();
  result.observations.forEach((observation, index) => {
    const node = el('div');
    node.dataset.state = observation.state;
    node.title = `${observation.id}: ${observationLabels[observation.state]}. ${observation.downlinkedBits} de ${observation.generatedBits} bits recebidos. NDVI: ${observation.ndvi === null ? 'indisponível' : num(observation.ndvi, 6)}.`;
    node.append(el('b', `${String.fromCharCode(65 + Math.floor(index / 2))}${index % 2 + 1}`), el('span', observationLabels[observation.state]));
    observationContainer.append(node);
  });
  const eventContainer = $('demo-events');
  eventContainer.replaceChildren();
  result.events.forEach(event => {
    const row = el('div', undefined, 'event-row');
    row.dataset.code = event.code;
    row.dataset.time = String(event.timeS);
    row.dataset.severity = event.severity;
    const button = el('button', minute(event.timeS));
    button.type = 'button';
    button.setAttribute('aria-label', `Inspecionar ${event.code} em ${minute(event.timeS)}`);
    button.addEventListener('click', () => {
      if (!currentResult) return;
      let nearest = 0;
      currentResult.trace.forEach((point, index) => { if (point.timeS <= event.timeS) nearest = index; });
      ($('trace-range') as HTMLInputElement).value = String(nearest);
      updateTracePoint();
    });
    row.append(button, el('strong', event.code), el('p', event.message), el('code', event.rule));
    if (event.value !== undefined) row.append(el('p', `Valor: ${num(event.value, 6)}${event.limit === undefined ? '' : ` · limite: ${num(event.limit, 6)}`}`));
    eventContainer.append(row);
  });
  renderTrace(result);
  if (result.scenarioId === 'short-contact' && sameConfig(result.config, base) && result.outcome === 'failure') observedShort = true;
  if (result.scenarioId === 'short-contact' && sameConfig(result.config, indexOnly) && result.events.some(event => event.code === 'PEAK_POWER')) observedIndex = true;
  updateGate();
}
function runDemo() {
  try { renderResult(simulateMission(readConfig(), readScenario(), { trace: true })); }
  catch (error) {
    invalidateDemo();
    $('demo-outcome').dataset.outcome = 'error';
    $('demo-outcome').textContent = 'Erro de execução';
    $('demo-diagnosis').textContent = error instanceof Error ? error.message : 'Não foi possível calcular esta configuração.';
  }
}
function preset(config: MissionConfig, scenario: ScenarioId) { setConfig(config, scenario); runDemo(); }
function runCatalog() {
  if (!(observedShort && observedIndex)) return;
  const summary = $('catalog-summary');
  try {
    catalogResult = searchCatalog(base, 'short-contact');
    const configurations = enumerateConfigurations();
    catalogRuns = configurations.map(config => simulateMission(config, 'short-contact'));
    const grid = $('catalog-grid');
    grid.replaceChildren();
    catalogRuns.forEach((result, index) => {
      const button = el('button');
      button.type = 'button';
      button.dataset.configIndex = String(index);
      button.dataset.outcome = result.outcome;
      button.dataset.minimal = String(result.outcome === 'success' && hammingDistance(base, result.config) === catalogResult!.minimumDistance);
      button.setAttribute('aria-pressed', 'false');
      const configDescription = CONFIG_KEYS.map(key => CATALOG[key].find(choice => choice.id === result.config[key])!.label).join(', ');
      button.setAttribute('aria-label', `Configuração ${index + 1}. ${outcomeLabels[result.outcome]}. ${result.deliveredRecords} de 6. ${configDescription}. Carregar no demonstrador.`);
      button.title = configDescription;
      button.append(el('span', String(index + 1).padStart(2, '0')), el('b', result.outcome === 'success' ? 'S' : result.outcome === 'failure' ? 'F' : 'I'));
      button.addEventListener('click', () => {
        grid.querySelectorAll('button').forEach(cell => cell.setAttribute('aria-pressed', 'false'));
        button.setAttribute('aria-pressed', 'true');
        $('catalog-selection').textContent = `Configuração ${index + 1}: ${outcomeLabels[result.outcome]}, ${result.deliveredRecords}/6, ${num(result.massKg)} kg, ${result.credits} créditos. Carregada para execução no demonstrador.`;
        setConfig(result.config, 'short-contact');
        setSlide(4, true);
      });
      grid.append(button);
    });
    const result = catalogResult;
    Object.assign(summary.dataset, { evaluated: String(result.evaluated), successful: String(result.successful), failed: String(result.failed), invalid: String(result.invalid), indeterminate: String(result.indeterminate), complete: String(result.complete) });
    summary.textContent = `${result.evaluated}/${result.total} avaliadas · ${result.successful} sucessos · ${result.failed} falhas · ${result.invalid} inválidas · ${result.indeterminate} indeterminadas`;
    const minimum = result.complete ? result.minimumDistance : null;
    dataValue('catalog-minimum', minimum ?? '', minimum === null ? '—' : String(minimum));
    if (minimum !== null && result.best.length === 1) {
      const witness = result.best[0]!;
      const changed = CONFIG_KEYS.filter(key => witness.config[key] !== base[key]).map(key => CATALOG[key].find(choice => choice.id === witness.config[key])!.label);
      $('catalog-witness').textContent = changed.join(' + ');
      $('catalog-proof-detail').textContent = `Única solução a ${minimum} mudanças. ${witness.result.deliveredRecords}/6 registros, ${num(witness.result.massKg)} kg e ${witness.result.credits} créditos. As sete configurações a distância zero ou um não atendem ao objetivo.`;
      ($('apply-catalog-witness') as HTMLButtonElement).disabled = false;
    } else {
      $('catalog-witness').textContent = minimum === null ? 'Mínimo não certificado' : `${result.best.length} soluções empatadas a ${minimum} mudanças`;
      $('catalog-proof-detail').textContent = result.complete ? 'Confira as células do catálogo.' : 'A busca não decidiu todas as configurações.';
      ($('apply-catalog-witness') as HTMLButtonElement).disabled = true;
    }
  } catch (error) {
    summary.textContent = `Erro na busca: ${error instanceof Error ? error.message : 'resultado indisponível'}`;
    $('catalog-grid').replaceChildren();
    $('catalog-minimum').textContent = '—';
    delete $('catalog-minimum').dataset.value;
    $('catalog-witness').textContent = 'Mínimo não certificado';
    ($('apply-catalog-witness') as HTMLButtonElement).disabled = true;
  }
}
function renderScience() {
  const node = svg(540, 235, 'NDVI dos seis registros MOD13Q1.061 históricos de 2024, recalculado pelo verificador científico do motor');
  const left = 75, right = 515, top = 22;
  const x = (ndvi: number) => left + ndvi / .6 * (right - left);
  for (const value of [0, .2, .4, .6]) {
    node.append(svgEl('line', { x1: x(value), x2: x(value), y1: 10, y2: 198, stroke: '#d4d9d5' }));
    node.append(svgEl('text', { x: x(value), y: 220, 'text-anchor': 'middle', fill: '#52666d', 'font-size': 11 }, num(value, 1)));
  }
  const buttons = $('science-record-buttons');
  SCIENCE_RECORDS.forEach((record, index) => {
    const checked = validateScienceRecord(record);
    const y = top + index * 32;
    const label = `${record.id.slice(0, 1)} · ${index % 2 === 0 ? '01/09' : '23/09'}`;
    node.append(svgEl('text', { x: 63, y: y + 4, 'text-anchor': 'end', fill: '#122e3e', 'font-size': 11 }, label));
    if (checked.ndvi !== null) {
      node.append(svgEl('line', { x1: left, x2: x(checked.ndvi), y1: y, y2: y, stroke: '#d6e0d6', 'stroke-width': 3 }));
      node.append(svgEl('circle', { cx: x(checked.ndvi), cy: y, r: 5, fill: index % 2 === 0 ? '#286f58' : '#885500' }));
      node.append(svgEl('text', { x: x(checked.ndvi) + 10, y: y + 4, fill: '#122e3e', 'font-size': 11 }, num(checked.ndvi, 4)));
    }
    const button = el('button', `${record.id.slice(0, 1)}${index % 2 + 1}`);
    button.type = 'button';
    button.dataset.scienceIndex = String(index);
    button.setAttribute('aria-label', `Inspecionar registro ${record.id}`);
    button.addEventListener('click', () => selectScienceRecord(index));
    buttons.append(button);
  });
  $('science-chart').replaceChildren(node);
  selectScienceRecord(0);
}
function selectScienceRecord(index: number) {
  const record = SCIENCE_RECORDS[index];
  if (!record) return;
  const checked = validateScienceRecord(record);
  const values: [string, string][] = [
    ['Registro', record.id], ['Coord. solicitada', `${num(record.latitudeRequested)}; ${num(record.longitudeRequested)}`],
    ['Início da composição', record.compositeStart], ['Observação selecionada', record.observationDate],
    ['RED / NIR inteiros', `${record.redInteger} / ${record.nirInteger}`], ['QA / confiabilidade', `${record.viQuality} / ${record.pixelReliability}`],
    ['NDVI do produto', num(record.ndviProduct, 4)], ['NDVI recalculado', checked.ndvi === null ? 'Inválido' : num(checked.ndvi, 8)],
    ['Filtro declarado', checked.valid ? 'Aceito' : checked.reasons.join(', ')],
  ];
  const detail = $('science-record-detail');
  detail.replaceChildren();
  values.forEach(([key, value]) => detail.append(el('dt', key), el('dd', value)));
  document.querySelectorAll<HTMLElement>('[data-science-index]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.scienceIndex) === index)));
}
function renderPower(result: MissionResult) {
  const event = result.events.find(candidate => candidate.code === 'PEAK_POWER');
  if (!event || event.value === undefined || event.limit === undefined) return;
  $('power-time').textContent = `${num(event.timeS)} s`;
  $('power-energy').textContent = `A bateria ainda tem ${num(result.finalEnergyWh)} Wh quando a operação termina.`;
  $('power-detail').textContent = `A demanda de ${num(event.value)} W excede o limite de ${num(event.limit)} W na bateria pequena.`;
  const node = svg(560, 220, `Demanda de descarga ${num(event.value)} W, limite ${num(event.limit)} W. Valores do evento PEAK_POWER do modelo didático.`);
  const left = 10, right = 540, x = (watts: number) => left + watts / 40 * (right - left);
  node.append(svgEl('text', { x: left, y: 23, fill: '#52666d', 'font-size': 13 }, 'POTÊNCIA NA BATERIA · W'));
  node.append(svgEl('rect', { x: left, y: 53, width: x(event.limit) - left, height: 35, fill: '#b7c6be' }));
  node.append(svgEl('text', { x: x(event.limit) + 12, y: 76, fill: '#122e3e', 'font-size': 19, 'font-weight': 700 }, `${num(event.limit)} W · limite`));
  node.append(svgEl('rect', { x: left, y: 116, width: x(event.value) - left, height: 35, fill: '#a23c32' }));
  node.append(svgEl('text', { x: left + 12, y: 139, fill: '#ffffff', 'font-size': 19, 'font-weight': 700 }, `${num(event.value)} W · exigidos`));
  for (const value of [0, 10, 20, 30, 40]) {
    node.append(svgEl('line', { x1: x(value), x2: x(value), y1: 166, y2: 174, stroke: '#52666d' }));
    node.append(svgEl('text', { x: x(value), y: 194, 'text-anchor': value === 0 ? 'start' : value === 40 ? 'end' : 'middle', fill: '#52666d', 'font-size': 12 }, String(value)));
  }
  node.append(svgEl('line', { x1: x(event.limit), x2: x(event.limit), y1: 44, y2: 159, stroke: '#122e3e', 'stroke-dasharray': '4 4' }));
  $('power-diagram').replaceChildren(node);
}

// Initialize controls from the executable catalog, without a second copy of the engine.
for (const [index, key] of CONFIG_KEYS.entries()) {
  const group = el('div');
  const label = el('label', labels[key]);
  label.htmlFor = `config-${key}`;
  const select = el('select');
  select.id = `config-${key}`;
  select.dataset.configKey = key;
  for (const choice of CATALOG[key]) {
    const option = el('option', choice.label);
    option.value = choice.id;
    option.title = choice.description;
    select.append(option);
  }
  select.value = DEFAULT_CONFIG[key];
  select.addEventListener('change', invalidateDemo);
  group.append(label, select);
  $('config-controls').append(group);
  const summary = el('article');
  summary.append(el('span', String(index + 1).padStart(2, '0'), 'choice-number'), el('h3', labels[key]), el('p', choiceText[key]));
  $('choice-summary').append(summary);
}
$('engine-version').textContent = `${ENGINE_VERSION} · ${CATALOG_VERSION}`;
$('scenario-select').addEventListener('change', invalidateDemo);
$('demo-form').addEventListener('submit', event => { event.preventDefault(); runDemo(); });
$('preset-long').addEventListener('click', () => preset(base, 'long-contact'));
$('preset-short').addEventListener('click', () => preset(base, 'short-contact'));
$('preset-index').addEventListener('click', () => preset(indexOnly, 'short-contact'));
$('preset-repair').addEventListener('click', () => { if (observedShort && observedIndex) preset(repaired, 'short-contact'); });
$('trace-range').addEventListener('input', updateTracePoint);
$('run-catalog').addEventListener('click', runCatalog);
$('apply-catalog-witness').addEventListener('click', () => {
  const witness = catalogResult?.best[0];
  if (!witness || !catalogResult?.complete) return;
  setConfig(witness.config, 'short-contact');
  setSlide(4, true);
});
const segmentCopy: Record<string, string> = {
  launch: 'O envelope fixo admite até 3,6 kg e 86 créditos. Receber dados não anula uma restrição de lançamento.',
  space: 'A bordo, energia, potência, processamento e memória precisam funcionar juntos. Cada lote só existe depois do trabalho completo.',
  ground: 'O serviço de comunicação tem taxa e janelas finitas. Bits parciais podem chegar antes do registro completo.',
  user: 'Só conta o registro recebido por inteiro, com qualidade aceita e NDVI verificado.',
};
document.querySelectorAll<HTMLElement>('[data-segment]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll<HTMLElement>('[data-segment]').forEach(node => { node.classList.toggle('active', node === button); node.setAttribute('aria-pressed', String(node === button)); });
  $('segment-detail').textContent = segmentCopy[button.dataset.segment!] ?? '';
}));
const longResult = simulateMission(base, 'long-contact', { trace: true });
const shortResult = simulateMission(base, 'short-contact', { trace: true });
const indexResult = simulateMission(indexOnly, 'short-contact', { trace: true });
$('story-long-delivered').textContent = `${longResult.deliveredRecords}/${longResult.requiredRecords}`;
$('story-short-delivered').textContent = `${shortResult.deliveredRecords}/${shortResult.requiredRecords}`;
$('story-long-detail').textContent = `${num(Number(longResult.downlinkedBits) / 1e6)} Mbit recebidos. Os seis registros chegam completos.`;
$('story-short-detail').textContent = `${num(Number(shortResult.downlinkedBits) / 1e6)} Mbit recebidos. ${num(Number(shortResult.queueBits) / 1e6)} Mbit permanecem na fila.`;
makeContacts('long-contact-diagram', 'long-contact');
makeContacts('short-contact-diagram', 'short-contact');
renderScience();
renderPower(indexResult);
invalidateDemo();
updateGate();

$('previous-slide').addEventListener('click', () => moveSlide(-1));
$('next-slide').addEventListener('click', () => moveSlide(1));
$('mode-pitch').addEventListener('click', () => setMode('pitch'));
$('mode-explore').addEventListener('click', () => setMode('explore'));
$('explore-appendix').addEventListener('click', () => { mode = 'explore'; setSlide(7, true); });
$('open-overview').addEventListener('click', openOverview);
$('close-overview').addEventListener('click', closeOverview);
$('overview-dialog').addEventListener('click', event => { if (event.target === $('overview-dialog')) closeOverview(); });
$('open-notes').addEventListener('click', () => toggleNotes());
$('close-notes').addEventListener('click', () => { toggleNotes(false); $('open-notes').focus(); });
$('notes-language').addEventListener('change', () => {
  updateNotes();
  try { localStorage.setItem('mission-ipe-presentation-language', ($('notes-language') as HTMLSelectElement).value); } catch { /* Optional preference only. */ }
});
try {
  const language = localStorage.getItem('mission-ipe-presentation-language');
  if (language === 'pt' || language === 'en') ($('notes-language') as HTMLSelectElement).value = language;
} catch { /* The presentation and engine do not require persistence. */ }
$('timer-toggle').addEventListener('click', () => {
  if (timerInterval !== undefined) { pauseTimer(); return; }
  if ($('notes-panel').hidden || document.hidden) return;
  timerStartedAt = Date.now();
  timerInterval = setInterval(timerDisplay, 250);
  $('timer-toggle').textContent = 'Pausar cronômetro';
  $('timer-toggle').setAttribute('aria-pressed', 'true');
  timerDisplay();
});
$('timer-reset').addEventListener('click', () => { pauseTimer(); timerElapsed = 0; timerDisplay(); $('timer-toggle').textContent = 'Iniciar cronômetro'; });
document.addEventListener('visibilitychange', () => { if (document.hidden) pauseTimer(); });
window.addEventListener('pagehide', () => { pauseTimer(); for (const url of blobUrls) URL.revokeObjectURL(url); blobUrls.clear(); });
async function toggleFullscreen() {
  try {
    if (document.fullscreenElement && typeof document.exitFullscreen === 'function') await document.exitFullscreen();
    else if (typeof document.documentElement.requestFullscreen === 'function') await document.documentElement.requestFullscreen();
    else toast('Tela cheia indisponível neste visualizador. A apresentação continua com os controles da página.');
  } catch { toast('Este visualizador não permitiu tela cheia. Continue com a janela normal.'); }
}
$('fullscreen').addEventListener('click', toggleFullscreen);
document.addEventListener('fullscreenchange', () => {
  $('fullscreen').textContent = document.fullscreenElement ? 'Sair da tela cheia' : 'Tela cheia';
  $('fullscreen').setAttribute('aria-pressed', String(Boolean(document.fullscreenElement)));
});
$('print-deck').addEventListener('click', () => {
  pauseTimer();
  if (typeof window.print === 'function') window.print();
  else toast('Impressão indisponível neste visualizador. Abra o HTML em um navegador com impressão.');
});
window.addEventListener('beforeprint', pauseTimer);
document.addEventListener('click', event => {
  const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-go-slide]') : null;
  if (!target) return;
  const index = Number(target.dataset.goSlide);
  if (!Number.isInteger(index) || index < 0 || index >= slides.length) return;
  if (!$('overview-dialog').hidden) closeOverview();
  setSlide(index, true);
});
document.querySelector('.brand')?.addEventListener('click', event => { event.preventDefault(); setSlide(0); });
window.addEventListener('hashchange', () => {
  const index = slides.findIndex(slide => `#${slide.id}` === location.hash);
  if (index >= 0) setSlide(index);
});
document.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (!$('overview-dialog').hidden) {
    if (event.key === 'Escape') { event.preventDefault(); closeOverview(); return; }
    if (event.key === 'Tab') {
      const nodes = [...$('overview-dialog').querySelectorAll<HTMLElement>('button:not(:disabled),a[href],select,input,[tabindex="0"]')];
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    return;
  }
  const target = event.target instanceof Element ? event.target : null;
  if (target?.closest('input,select,textarea,[contenteditable]:not([contenteditable="false"])')) return;
  if (event.key === 'Escape') { if (!$('notes-panel').hidden) { event.preventDefault(); toggleNotes(false); } $('status-message').hidden = true; return; }
  if (target?.closest('#notes-panel')) return;
  if (event.key === 'ArrowRight' || event.key === 'PageDown' || (event.key === ' ' && !target?.closest('button,a,summary'))) { event.preventDefault(); moveSlide(1); }
  else if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); moveSlide(-1); }
  else if (event.key === 'Home') { event.preventDefault(); setSlide(visibleIndices()[0]!, true); }
  else if (event.key === 'End') { event.preventDefault(); const indices = visibleIndices(); setSlide(indices[indices.length - 1]!, true); }
  else if (event.key.toLowerCase() === 'o') { event.preventDefault(); openOverview(); }
  else if (event.key.toLowerCase() === 'n') { event.preventDefault(); toggleNotes(); }
  else if (event.key.toLowerCase() === 'f') { event.preventDefault(); void toggleFullscreen(); }
});

// Embedded source downloads preserve the original JSON text. No fetch(), innerHTML, remote assets or network path.
const embeddedSources: Record<string, string> = JSON.parse($('embedded-source-data').textContent || '{}');
document.querySelectorAll<HTMLAnchorElement>('[data-embedded-source]').forEach(anchor => anchor.addEventListener('click', event => {
  const key = anchor.dataset.embeddedSource;
  if (!key || !Object.hasOwn(embeddedSources, key)) return;
  const source = embeddedSources[key];
  if (typeof source !== 'string') return;
  event.preventDefault();
  if (typeof URL.createObjectURL !== 'function') { toast('Este visualizador não oferece download local. Abra o JSON correspondente na pasta public/data do ZIP.'); return; }
  const url = URL.createObjectURL(new Blob([source], { type: 'application/json' }));
  blobUrls.add(url);
  const download = el('a');
  download.href = url; download.download = key; download.hidden = true;
  document.body.append(download); download.click(); download.remove();
}));
timerDisplay();
const hashIndex = slides.findIndex(slide => `#${slide.id}` === location.hash);
setSlide(hashIndex >= 0 ? hashIndex : 0);
document.documentElement.dataset.presentationReady = 'true';
