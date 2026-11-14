#!/usr/bin/env node
/** Independent contract and DOM verification of the R8 context hub.
 * This is not native-browser, visual, accessibility or learning-effect evidence.
 * Runs authored HTML with external resources/network disabled and reports its own checks.
 */
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import jsdom from 'jsdom';

const { JSDOM, VirtualConsole, requestInterceptor } = jsdom;

const root = fileURLToPath(new URL('../', import.meta.url));
const htmlPath = resolve(root, 'context/index.html');
const dataPath = resolve(root, 'context/compiled-context.json');
const startedAt = new Date().toISOString();
const checks = [];
const observations = {};
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const key = 'ipe.context.personal.v1';
const html = await readFile(htmlPath, 'utf8');
const rawData = await readFile(dataPath, 'utf8');
const data = JSON.parse(rawData);
const tasks = data.tasks;
const windows = [];
const maxImportBytes = 256 * 1024;
const statuses = new Set(['done', 'in_progress', 'blocked', 'planned']);
const views = ['overview', 'schedule', 'context', 'research', 'theme', 'insights', 'history', 'sources'];

async function check(name, action) {
  const at = performance.now();
  try {
    const detail = await action();
    checks.push({ name, status: 'passed', durationMs: Number((performance.now() - at).toFixed(3)), ...(detail === undefined ? {} : { detail }) });
    process.stdout.write(`PASS ${name}\n`);
  } catch (error) {
    checks.push({ name, status: 'failed', durationMs: Number((performance.now() - at).toFixed(3)), error: String(error.message).replaceAll(root, '<project>/') });
    process.stderr.write(`FAIL ${name}: ${String(error.message).replaceAll(root, '<project>/')}\n`);
  }
}

const settle = () => new Promise(resolve => setTimeout(resolve, 15));
function selected(document, name) {
  const element = document.querySelector(`[data-testid="${name}"]`) || document.getElementById(name);
  assert.ok(element, `Missing interaction: ${name}`);
  return element;
}
function visible(element) { return !element.closest('[hidden]') && !(element.closest('dialog') && !element.closest('dialog').open); }
function taskIds(document) {
  return [...new Set([...document.querySelectorAll('#schedule-lanes-container button[data-task-id], #schedule-list-container button[data-task-id]')].filter(visible).map(element => element.dataset.taskId))].sort();
}
function filter(window, id, value, event = 'change') {
  const element = selected(window.document, id);
  element.value = value;
  element.dispatchEvent(new window.Event(event, { bubbles: true }));
}
function go(window, view) { selected(window.document, `nav-${view}`).click(); }
function clearFilters(window) {
  for (const id of ['status-filter', 'track-filter', 'window-filter']) {
    const element = selected(window.document, id);
    const option = [...element.options].find(option => option.value === '' || option.value === 'all');
    assert.ok(option, `Missing all option in ${id}`);
    filter(window, id, option.value);
  }
  filter(window, 'task-search', '', 'input');
}
function state(window) { return window.localStorage.getItem(key); }

async function boot({ storage = {}, documentHtml = html, clock = data.project.asOf, storageDenied = false, hash = '' } = {}) {
  const errors = [];
  const downloads = [];
  const requested = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(String(error.message)));
  const dom = new JSDOM(documentHtml, {
    url: 'https://ipe.test/context/index.html' + hash, runScripts: 'dangerously',
    resources: { interceptors: [requestInterceptor(async request => {
      // Read only the exact local design assets; no external network is permitted.
      const url = new URL(request.url);
      const localAssets = new Map([
        ['/fonts/fonts.css', ['fonts/fonts.css', 'text/css']],
        ['/brand/projeto-ipe-logo.svg', ['brand/projeto-ipe-logo.svg', 'image/svg+xml']],
        ['/brand/projeto-ipe-symbol.svg', ['brand/projeto-ipe-symbol.svg', 'image/svg+xml']],
      ]);
      const asset = url.origin === 'https://ipe.test' && localAssets.get(url.pathname);
      if (asset) return new Response(await readFile(resolve(root, 'experiments/mission-design-lab/public', asset[0])), { headers: { 'Content-Type': asset[1] } });
      requested.push(request.url);
      return new Response('Network prohibited in standalone verification', { status: 503 });
    })] },
    pretendToBeVisual: true, virtualConsole,
    beforeParse(window) {
      const RealDate = window.Date;
      window.Date = class FixedDate extends RealDate {
        constructor(...args) { super(...(args.length ? args : [clock])); }
        static now() { return new RealDate(clock).getTime(); }
      };
      window.matchMedia = query => ({ matches: query.includes('reduced-motion'), media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
      window.Element.prototype.scrollIntoView = function () {};
      window.scrollTo = () => {};
      window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
      window.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new window.Event('close')); };
      window.confirm = () => true;
      window.print = () => {};
      window.URL.createObjectURL = blob => { downloads.push(blob); return `blob:https://ipe.test/test-${downloads.length}`; };
      window.URL.revokeObjectURL = () => {};
      const anchorClick = window.HTMLAnchorElement.prototype.click;
      window.HTMLAnchorElement.prototype.click = function () {
        if (this.download || this.href.startsWith('blob:')) return;
        return anchorClick.call(this);
      };
      window.fetch = (...args) => { requested.push(String(args[0])); return Promise.reject(new Error('Network disabled')); };
      // jsdom 31 interceptors do not govern synchronous XHR; prohibit that API explicitly.
      const OriginalXHR = window.XMLHttpRequest;
      window.XMLHttpRequest = class NoNetworkXHR extends OriginalXHR {
        open(method, url) { requested.push(String(url)); throw new window.DOMException('Network disabled', 'NetworkError'); }
      };
      window.WebSocket = class NoNetworkSocket {
        constructor(url) { requested.push(String(url)); throw new window.DOMException('Network disabled', 'NetworkError'); }
      };
      window.EventSource = class NoNetworkEventSource {
        constructor(url) { requested.push(String(url)); throw new window.DOMException('Network disabled', 'NetworkError'); }
      };
      window.navigator.sendBeacon = url => { requested.push(String(url)); return false; };
      window.addEventListener('error', event => errors.push(event.message));
      window.addEventListener('unhandledrejection', event => errors.push(String(event.reason)));
      for (const [name, value] of Object.entries(storage)) window.localStorage.setItem(name, value);
      if (storageDenied) Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new window.DOMException('Denied in QA fixture', 'SecurityError'); } });
    },
  });
  windows.push(dom.window);
  await settle();
  return { dom, window: dom.window, document: dom.window.document, errors, downloads, requested };
}
async function importText(window, text) {
  const file = new window.File([text], 'personal-checklist.json', { type: 'application/json' });
  Object.defineProperty(file, 'text', { value: async () => text });
  const input = selected(window.document, 'import-local');
  Object.defineProperty(input, 'files', { configurable: true, value: [file] });
  input.dispatchEvent(new window.Event('change', { bubbles: true }));
  await settle();
}
async function blobText(window, blob) {
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
}

let app;
let officialInitial;
try {
  await check('modelo mantém versão, prazo BRT e oito temas sem confundir planejamento com conclusão', () => {
    assert.equal(data.version, 1);
    assert.equal(data.project.name, 'AB-NASA-TEAM-IPE');
    assert.equal(data.project.timezone, 'America/Sao_Paulo');
    assert.equal(new Date(data.project.deadline).toISOString(), '2026-11-15T11:00:00.000Z');
    assert.ok(Number.isFinite(Date.parse(data.project.asOf)));
    assert.equal(data.themes.length, 8);
    assert.ok(tasks.length > 0);
    const brazilDeadline = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(data.project.deadline));
    assert.equal(brazilDeadline, '08:00');
    observations.model = { tasks: tasks.length, themes: data.themes.length, sources: data.sources.length, asOf: data.project.asOf, deadline: data.project.deadline, timezone: data.project.timezone };
  });

  await check('tarefas e gates formam DAG válido; concluídas possuem aceite e evidência', () => {
    const ids = new Set(tasks.map(task => task.id));
    assert.equal(ids.size, tasks.length, 'Duplicate task IDs');
    const tracks = new Set(data.tracks.map(track => track.id));
    assert.equal(tracks.size, data.tracks.length);
    for (const task of tasks) {
      assert.ok(statuses.has(task.status), `Unknown status: ${task.id}`);
      assert.ok(tracks.has(task.track), `Unknown track: ${task.id}`);
      assert.ok(task.title && task.owner && task.description);
      assert.ok(Number.isFinite(Date.parse(task.start)) && Number.isFinite(Date.parse(task.end)));
      assert.ok(Date.parse(task.end) >= Date.parse(task.start), `Negative time interval: ${task.id}`);
      assert.equal(new Set(task.dependsOn).size, task.dependsOn.length, `Repeated dependency: ${task.id}`);
      for (const dependency of task.dependsOn) assert.ok(ids.has(dependency) && dependency !== task.id, `Missing/self dependency: ${task.id} → ${dependency}`);
      if (task.status === 'done') {
        assert.ok(task.acceptance.length && task.evidence.length, `Done without receipt/acceptance: ${task.id}`);
        for (const dependency of task.dependsOn) assert.equal(tasks.find(task => task.id === dependency).status, 'done', `Done task depends on unfinished task: ${task.id}`);
      }
    }
    const visited = new Set(), visiting = new Set();
    function visit(id) {
      assert.ok(!visiting.has(id), `Dependency cycle: ${id}`);
      if (visited.has(id)) return;
      visiting.add(id);
      for (const parent of tasks.find(task => task.id === id).dependsOn) visit(parent);
      visiting.delete(id); visited.add(id);
    }
    for (const task of tasks) visit(task.id);
    for (const gate of data.gates) {
      assert.ok(statuses.has(gate.status) && gate.criterion && gate.taskIds.length);
      for (const id of gate.taskIds) assert.ok(ids.has(id), `Gate without task: ${gate.id} → ${id}`);
      if (gate.status === 'done') for (const id of gate.taskIds) assert.equal(tasks.find(task => task.id === id).status, 'done');
    }
    return { vertices: ids.size, dependencies: tasks.reduce((sum, task) => sum + task.dependsOn.length, 0), gates: data.gates.length };
  });

  await check('referências da pesquisa resolvem para fontes identificadas e URLs não executáveis', () => {
    const ids = new Set(data.sources.map(source => source.id));
    assert.equal(ids.size, data.sources.length, 'Duplicate source IDs');
    for (const source of data.sources) {
      assert.ok(source.id && source.title && source.publisher && source.note, 'Incomplete source record');
      assert.ok(['primary', 'project'].includes(source.kind), `Unknown source kind: ${source.id}`);
      const url = new URL(source.url, 'https://ipe.test/context/index.html');
      assert.equal(url.protocol, 'https:', `Invalid source protocol: ${source.id}`);
      assert.equal(url.username + url.password, '', `Credentialed source URL: ${source.id}`);
      if (source.kind === 'primary') assert.notEqual(url.origin, 'https://ipe.test', `Primary source lacks public origin: ${source.id}`);
    }
    for (const group of ['chapters', 'decisions', 'insights', 'history']) for (const item of data[group]) {
      for (const id of item.evidenceIds) assert.ok(ids.has(id), `Missing evidence source ${group}/${item.id} → ${id}`);
    }
    for (const item of data.research) for (const id of item.sourceIds) assert.ok(ids.has(id), `Missing research source: ${item.id} → ${id}`);
    return { sources: ids.size, sourceReferencesResolved: true };
  });

  await check('HTML embarca o modelo completo e não inclui scripts/handlers de terceiros', () => {
    const dom = new JSDOM(html); windows.push(dom.window);
    const document = dom.window.document;
    const embedded = [...document.querySelectorAll('script[type="application/json"]')].map(script => JSON.parse(script.textContent)).find(value => value?.project?.name === 'AB-NASA-TEAM-IPE');
    assert.deepEqual(embedded, data);
    assert.equal(document.documentElement.lang, 'pt-BR');
    assert.equal(document.querySelectorAll('script[src],iframe,link[rel="stylesheet"][href^="http"],link[rel="preload"][href^="http"]').length, 0);
    for (const element of document.querySelectorAll('*')) for (const attribute of element.attributes) assert.ok(!/^on[a-z]+$/i.test(attribute.name), `Inline handler: ${attribute.name}`);
    for (const anchor of document.querySelectorAll('a[href]')) assert.doesNotMatch(anchor.getAttribute('href'), /^\s*(javascript|data|vbscript):/i);
  });

  app = await boot();
  await check('inicialização com recursos locais, sem rede externa nem exceções DOM', () => {
    assert.deepEqual(app.errors, []);
    assert.deepEqual(app.requested, []);
    officialInitial = selected(app.document, 'official-progress').textContent;
    assert.ok(officialInitial.trim());
    assert.ok(selected(app.document, 'personal-progress').textContent.trim());
  });

  await check('navegação troca cada painel e mantém o conteúdo acessível no DOM', () => {
    for (const view of views) {
      go(app.window, view);
      const panel = app.document.getElementById(`view-${view}`);
      assert.ok(panel && !panel.hidden, `Panel inaccessible: ${view}`);
      const activePanels = views.map(id => app.document.getElementById(`view-${id}`)).filter(panel => panel && !panel.hidden);
      assert.equal(activePanels.length, 1);
      assert.equal(selected(app.document, `nav-${view}`).getAttribute('aria-selected'), 'true');
    }
  });

  await check('links diretos possuem destino semântico e abrem a seção correta em nova sessão', async () => {
    for (const view of views) {
      const fresh = await boot({ hash: '#' + view });
      const target = fresh.document.getElementById(view);
      assert.ok(target && /^H[1-6]$/.test(target.tagName), `Fragment lacks heading: ${view}`);
      assert.equal(target.closest('[role="tabpanel"]').id, `view-${view}`);
      assert.ok(visible(target), `Deep link opens hidden content: ${view}`);
      assert.equal(selected(fresh.document, `nav-${view}`).getAttribute('aria-selected'), 'true');
      assert.equal(fresh.window.location.hash, '#' + view);
      assert.deepEqual(fresh.errors, []); assert.deepEqual(fresh.requested, []);
    }
  });

  await check('teclado muda a aba selecionada e mantém uma única parada de tabulação', () => {
    go(app.window, 'overview');
    let tab = selected(app.document, 'nav-overview');
    tab.focus();
    tab.dispatchEvent(new app.window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    assert.equal(selected(app.document, 'nav-schedule').getAttribute('aria-selected'), 'true');
    tab = selected(app.document, 'nav-schedule');
    tab.dispatchEvent(new app.window.KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    assert.equal(selected(app.document, 'nav-sources').getAttribute('aria-selected'), 'true');
    selected(app.document, 'nav-sources').dispatchEvent(new app.window.KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    assert.equal(selected(app.document, 'nav-overview').getAttribute('aria-selected'), 'true');
    assert.equal(views.filter(view => selected(app.document, `nav-${view}`).tabIndex === 0).length, 1);
  });

  await check('janela até o release recorta o conjunto sem excluir o backlog do projeto', () => {
    go(app.window, 'schedule'); clearFilters(app.window);
    filter(app.window, 'window-filter', 'release');
    assert.deepEqual(taskIds(app.document), tasks.filter(task => Date.parse(task.start) < Date.parse(data.project.deadline)).map(task => task.id).sort());
    filter(app.window, 'window-filter', 'all');
    assert.deepEqual(taskIds(app.document), tasks.map(task => task.id).sort());
  });

  await check('cronograma filtra status e trilha em conjunto, sem tarefas de outro grupo', () => {
    go(app.window, 'schedule'); clearFilters(app.window);
    assert.deepEqual(taskIds(app.document), tasks.map(task => task.id).sort());
    const target = tasks.find(task => task.status === 'planned') || tasks[0];
    filter(app.window, 'status-filter', target.status);
    filter(app.window, 'track-filter', target.track);
    assert.deepEqual(taskIds(app.document), tasks.filter(task => task.status === target.status && task.track === target.track).map(task => task.id).sort());
    assert.ok(selected(app.document, 'task-count').textContent.trim());
  });

  await check('busca vazia tem estado explícito; limpar filtros recupera as tarefas', () => {
    clearFilters(app.window);
    filter(app.window, 'task-search', 'zzzz-nenhuma-tarefa-existe-92817', 'input');
    assert.deepEqual(taskIds(app.document), []);
    assert.match(app.document.getElementById('view-schedule').textContent, /nenhum|nenhuma|0 tarefa/i);
    clearFilters(app.window);
    assert.deepEqual(taskIds(app.document), tasks.map(task => task.id).sort());
  });

  await check('alternar lista e trilhas preserva o conjunto filtrado e a identidade das tarefas', () => {
    const target = tasks.find(task => task.status === 'blocked') || tasks[0];
    filter(app.window, 'status-filter', target.status);
    const expected = tasks.filter(task => task.status === target.status).map(task => task.id).sort();
    selected(app.document, 'schedule-list').click();
    assert.deepEqual(taskIds(app.document), expected);
    selected(app.document, 'schedule-lanes').click();
    assert.deepEqual(taskIds(app.document), expected);
    clearFilters(app.window);
  });

  await check('detalhe da tarefa informa descrição, aceite e dependências resolvidas', () => {
    const task = tasks.find(task => task.dependsOn.length > 0 && task.acceptance.length > 0) || tasks[0];
    const button = [...app.document.querySelectorAll('button[data-task-id]')].find(element => element.dataset.taskId === task.id && visible(element));
    assert.ok(button); button.click();
    const dialog = selected(app.document, 'task-dialog');
    assert.equal(dialog.open, true);
    assert.match(selected(app.document, 'task-dialog-title').textContent, new RegExp(task.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.ok(dialog.textContent.includes(task.description));
    for (const criterion of task.acceptance) assert.ok(dialog.textContent.includes(criterion));
    for (const id of task.dependsOn) assert.ok(dialog.textContent.includes(id) || dialog.textContent.includes(tasks.find(task => task.id === id).title));
  });

  await check('marcação pessoal altera somente estado local e preserva o progresso oficial', () => {
    const checkbox = selected(app.document, 'dialog-check');
    checkbox.checked = true; checkbox.dispatchEvent(new app.window.Event('change', { bubbles: true }));
    assert.ok(state(app.window));
    assert.equal(selected(app.document, 'official-progress').textContent, officialInitial);
    assert.match(selected(app.document, 'personal-progress').textContent, /1/);
    selected(app.document, 'close-task-dialog').click();
    assert.equal(selected(app.document, 'task-dialog').open, false);
    observations.officialProgress = officialInitial;
  });

  await check('marcações pessoais persistem em nova sessão sem concluir tarefas oficiais', async () => {
    const fresh = await boot({ storage: { [key]: state(app.window), unrelated: 'preserve-me' } });
    assert.deepEqual(fresh.errors, []);
    assert.match(selected(fresh.document, 'personal-progress').textContent, /1/);
    assert.equal(selected(fresh.document, 'official-progress').textContent, officialInitial);
    observations.personalStorageKey = key;
  });

  await check('exportação contém somente contrato público de checklist e IDs conhecidos', async () => {
    selected(app.document, 'export-local').click();
    assert.equal(app.downloads.length, 1);
    const exported = JSON.parse(await blobText(app.window, app.downloads[0]));
    assert.deepEqual(Object.keys(exported).sort(), ['checkedTaskIds', 'exportedAt', 'project', 'version']);
    assert.equal(exported.version, 1); assert.equal(exported.project, 'AB-NASA-TEAM-IPE');
    assert.ok(Number.isFinite(Date.parse(exported.exportedAt)));
    assert.equal(exported.checkedTaskIds.length, 1);
    assert.ok(tasks.some(task => task.id === exported.checkedTaskIds[0]));
  });

  await check('importação válida substitui marcações, sem alterar estado oficial', async () => {
    const ids = tasks.slice(0, 2).map(task => task.id);
    await importText(app.window, JSON.stringify({ version: 1, project: 'AB-NASA-TEAM-IPE', exportedAt: data.project.asOf, checkedTaskIds: ids }));
    const stored = JSON.parse(state(app.window));
    assert.deepEqual([...stored.checkedTaskIds].sort(), ids.sort());
    assert.equal(selected(app.document, 'official-progress').textContent, officialInitial);
  });

  await check('importações inválidas são rejeitadas atomicamente e informam o erro', async () => {
    const before = state(app.window);
    const valid = { version: 1, project: 'AB-NASA-TEAM-IPE', exportedAt: data.project.asOf, checkedTaskIds: [tasks[0].id] };
    const badPayloads = [
      '{broken-json',
      JSON.stringify({ ...valid, version: 2 }),
      JSON.stringify({ ...valid, project: 'outro-projeto' }),
      JSON.stringify({ ...valid, checkedTaskIds: ['unknown-task'] }),
      JSON.stringify({ ...valid, checkedTaskIds: [tasks[0].id, tasks[0].id] }),
      JSON.stringify({ ...valid, checkedTaskIds: 'not-an-array' }),
      JSON.stringify({ ...valid, injected: '<img src=x onerror=alert(1)>' }),
      JSON.stringify({ ...valid, checkedTaskIds: [tasks[0].id, {}] }),
      ' '.repeat(maxImportBytes + 1),
    ];
    for (let i = 0; i < badPayloads.length; i++) {
      await importText(app.window, badPayloads[i]);
      assert.equal(state(app.window), before, `Partial mutation on rejected payload ${i}`);
      assert.ok(selected(app.document, 'live-message').textContent.trim(), `Silent rejection on payload ${i}`);
    }
    return { rejectedPayloads: badPayloads.length, byteLimit: maxImportBytes };
  });

  await check('reset remove só a checklist desta aplicação', () => {
    app.window.localStorage.setItem('unrelated', 'preserve-me');
    selected(app.document, 'reset-local').click();
    assert.equal(app.window.localStorage.getItem('unrelated'), 'preserve-me');
    const saved = state(app.window);
    assert.ok(saved === null || JSON.parse(saved).checkedTaskIds.length === 0);
    assert.equal(selected(app.document, 'official-progress').textContent, officialInitial);
  });

  await check('armazenamento indisponível não impede leitura do contexto ou cronograma', async () => {
    const denied = await boot({ storageDenied: true });
    assert.deepEqual(denied.errors, []);
    go(denied.window, 'schedule'); clearFilters(denied.window);
    assert.deepEqual(taskIds(denied.document), tasks.map(task => task.id).sort());
    assert.equal(selected(denied.document, 'official-progress').textContent, officialInitial);
  });

  await check('JSON pessoal corrompido não contamina o estado oficial nem quebra a inicialização', async () => {
    const corrupted = await boot({ storage: { [key]: '{not-json' } });
    assert.deepEqual(corrupted.errors, []);
    assert.equal(selected(corrupted.document, 'official-progress').textContent, officialInitial);
    assert.match(selected(corrupted.document, 'personal-progress').textContent, /0/);
  });

  await check('passagem do prazo não conclui tarefas automaticamente', async () => {
    const future = await boot({ clock: '2026-11-16T14:00:00Z' });
    assert.deepEqual(future.errors, []);
    assert.equal(selected(future.document, 'official-progress').textContent, officialInitial);
    assert.match(future.document.body.textContent, /prazo.*(?:encerrado|vencido|atingido)|(?:encerrado|vencido|atingido).*prazo|alvo.*(?:passou|atingido|encerrado)/i);
    go(future.window, 'schedule'); clearFilters(future.window);
    filter(future.window, 'status-filter', 'planned');
    assert.deepEqual(taskIds(future.document), tasks.filter(task => task.status === 'planned').map(task => task.id).sort());
  });

  await check('pesquisa, contexto e fontes possuem busca com retorno vazio e recuperação', () => {
    for (const [view, id, containerId, countId] of [['context', 'knowledge-search', 'context-chapters', 'context-count'], ['research', 'research-search', 'research-entries', 'research-count'], ['sources', 'source-search', 'source-entries', 'source-count']]) {
      go(app.window, view);
      const entries = [...selected(app.document, containerId).querySelectorAll('[data-search]')];
      assert.ok(entries.length > 0, `Content missing: ${view}`);
      filter(app.window, id, 'zzzz-nenhum-resultado-92817', 'input');
      assert.match(selected(app.document, countId).textContent, /^0 de \d+/i, `Missing empty state in ${view}`);
      assert.ok(entries.every(element => element.hidden), `Search leaked unmatched entries: ${view}`);
      filter(app.window, id, '', 'input');
      assert.ok(entries.every(element => !element.hidden), `Content not restored: ${view}`);
      assert.match(selected(app.document, countId).textContent, new RegExp(`^${entries.length} de ${entries.length}`));
    }
  });

  await check('nenhuma interação testada acessou rede ou produziu exceção assíncrona', () => {
    assert.deepEqual(app.errors, []); assert.deepEqual(app.requested, []);
    observations.artifact = { path: 'context/index.html', bytes: Buffer.byteLength(html), sha256: sha256(html) };
    observations.data = { path: 'context/compiled-context.json', bytes: Buffer.byteLength(rawData), sha256: sha256(rawData) };
  });
} finally {
  for (const window of windows) window.close();
  const report = {
    schemaVersion: 1, edition: 'R8', startedAt, finishedAt: new Date().toISOString(),
    status: checks.some(check => check.status === 'failed') ? 'failed' : 'passed',
    summary: { total: checks.length, passed: checks.filter(check => check.status === 'passed').length, failed: checks.filter(check => check.status === 'failed').length },
    scope: 'Data contracts and authored HTML in jsdom; exact local design assets loaded from disk, external network disabled; storage/import/export and navigation behavior. No real-browser execution.',
    limitations: ['No visual or native-focus qualification', 'No screen-reader or print-engine observation', 'No device performance or cold-offline benchmark', 'No human learning study', 'No deployment evidence produced by this script'],
    observations, checks,
  };
  await mkdir(resolve(root, 'evidence'), { recursive: true });
  await writeFile(resolve(root, 'evidence/context-qa-r8.json'), JSON.stringify(report, null, 2) + '\n');
  process.stdout.write(JSON.stringify({ ...report.summary, status: report.status, receipt: 'evidence/context-qa-r8.json' }) + '\n');
  if (report.status !== 'passed') process.exitCode = 1;
}
