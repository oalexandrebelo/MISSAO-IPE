#!/usr/bin/env node
/**
 * QA independente do HTML compilado. Executa JavaScript real em jsdom;
 * não inicia navegador, servidor, Worker ou conexão de rede.
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM, VirtualConsole } from 'jsdom';
import { CATALOG, CONFIG_KEYS, DEFAULT_CONFIG, SCENARIOS } from '../src/core/catalog.ts';
import { simulateMission } from '../src/core/engine.ts';
import { searchCatalog } from '../src/core/search.ts';
import { SCIENCE_RECORDS } from '../src/data/science-data.ts';

const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const artifact = path.join(root, 'presentation/Missao_Ipe_Apresentacao.html');
const startedAt = new Date().toISOString();
const checks = [];
const observations = {};
const openDocuments = [];
const contexts = [];
const fingerprint = bytes => createHash('sha256').update(bytes).digest('hex');
let html;

async function check(name, callback) {
  const start = performance.now();
  try {
    const detail = await callback();
    checks.push({ name, status: 'passed', durationMs: Number((performance.now() - start).toFixed(3)), ...(detail === undefined ? {} : { detail }) });
    process.stdout.write(`PASS ${name}\n`);
  } catch (error) {
    checks.push({ name, status: 'failed', durationMs: Number((performance.now() - start).toFixed(3)), error: error.stack || String(error) });
    process.stderr.write(`FAIL ${name}: ${error.message}\n`);
  }
}

async function settle(callback, description = 'condição do DOM') {
  const end = performance.now() + 1_500;
  do {
    if (callback()) return;
    await new Promise(resolve => setTimeout(resolve, 5));
  } while (performance.now() < end);
  assert.ok(callback(), `Tempo esgotado aguardando ${description}`);
}

async function mount() {
  const errors = [];
  const networkAttempts = [];
  const intervals = new Map();
  const nativeCalls = { print: 0, fullscreen: 0, exitFullscreen: 0 };
  let intervalId = 1;
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  virtualConsole.on('error', (...args) => errors.push(args.map(String).join(' ')));
  const dom = new JSDOM(html, {
    url: pathToFileURL(artifact).href,
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole,
    beforeParse(window) {
      const deny = kind => (...args) => { networkAttempts.push({ kind, args: args.map(String) }); throw new Error(`Rede não permitida nesta checagem: ${kind}`); };
      window.fetch = deny('fetch');
      window.XMLHttpRequest = deny('XMLHttpRequest');
      window.WebSocket = deny('WebSocket');
      window.EventSource = deny('EventSource');
      window.navigator.sendBeacon = deny('sendBeacon');
      // Somente adaptadores de APIs nativas ausentes, nunca física/score.
      window.scrollTo = () => {};
      window.HTMLElement.prototype.scrollIntoView = () => {};
      window.print = () => { nativeCalls.print++; };
      Object.defineProperty(window.document, 'fullscreenElement', { configurable: true, writable: true, value: null });
      window.HTMLElement.prototype.requestFullscreen = async function () { nativeCalls.fullscreen++; window.document.fullscreenElement = this; window.document.dispatchEvent(new window.Event('fullscreenchange')); };
      window.document.exitFullscreen = async () => { nativeCalls.exitFullscreen++; window.document.fullscreenElement = null; window.document.dispatchEvent(new window.Event('fullscreenchange')); };
      window.setInterval = (callback, milliseconds, ...args) => { const id = intervalId++; intervals.set(id, { callback: () => callback(...args), milliseconds }); return id; };
      window.clearInterval = id => intervals.delete(id);
    },
  });
  openDocuments.push(dom);
  await new Promise(resolve => setTimeout(resolve, 0));
  const context = { dom, window: dom.window, document: dom.window.document, errors, networkAttempts, intervals, nativeCalls };
  contexts.push(context);
  return context;
}

function required(document, selector) {
  const element = document.querySelector(selector);
  assert.ok(element, `Elemento ausente: ${selector}`);
  return element;
}

function click(context, selector) { required(context.document, selector).click(); }
function change(context, selector, value) {
  const element = required(context.document, selector);
  element.value = value;
  element.dispatchEvent(new context.window.Event('change', { bubbles: true }));
}
function key(context, value, target = context.document.body) {
  const event = new context.window.KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
}
function activeSlides(context) { return [...context.document.querySelectorAll('section[data-slide]')].filter(slide => !slide.hidden); }
function activeSlide(context) {
  const active = activeSlides(context);
  assert.equal(active.length, 1, 'Exatamente um quadro deve estar ativo');
  assert.equal(active[0].getAttribute('aria-hidden'), 'false');
  for (const slide of context.document.querySelectorAll('section[data-slide]')) {
    if (slide !== active[0]) assert.equal(slide.getAttribute('aria-hidden'), 'true', 'Quadro inativo deve conservar aria-hidden=true');
  }
  return active[0];
}

function go(context, index) {
  click(context, '#open-overview');
  assert.equal(required(context.document, '#overview-dialog').hidden, false);
  click(context, `#overview-dialog [data-go-slide="${index}"]`);
  assert.equal(required(context.document, '#overview-dialog').hidden, true);
  assert.equal(activeSlide(context), context.document.querySelectorAll('section[data-slide]')[index]);
}

function assertConfig(context, expected) {
  const config = Object.fromEntries(CONFIG_KEYS.map(name => [name, required(context.document, `select[data-config-key="${name}"]`).value]));
  assert.deepEqual(config, expected);
}

async function assertRun(context, config, scenarioId) {
  const expected = simulateMission({ ...config }, scenarioId);
  await settle(() => required(context.document, '#demo-outcome').dataset.outcome === expected.outcome, 'resultado do núcleo no DOM');
  assertConfig(context, config);
  assert.equal(required(context.document, '#scenario-select').value, scenarioId);
  assert.equal(required(context.document, '#demo-delivered').textContent.replace(/\s/g, ''), `${expected.deliveredRecords}/6`);
  assert.equal(Number(required(context.document, '#demo-delivered').dataset.value), expected.deliveredRecords);
  assert.equal(required(context.document, '#demo-bits').dataset.value, expected.downlinkedBits);
  assert.equal(required(context.document, '#demo-queue').dataset.value, expected.queueBits);
  const energy = Number(required(context.document, '#demo-energy').dataset.value);
  assert.ok(Number.isFinite(energy) && Math.abs(energy - expected.finalEnergyWh) < 1e-9, 'Energia final exibida deve vir do resultado real');
  const events = [...context.document.querySelectorAll('#demo-events [data-code][data-time]')];
  assert.ok(events.length > 0, 'Resultado deve oferecer ao menos um evento inspecionável');
  assert.deepEqual(events.map(event => ({ code: event.dataset.code, timeS: Number(event.dataset.time) })), expected.events.map(event => ({ code: event.code, timeS: event.timeS })));
  const outcome = required(context.document, '#demo-outcome');
  assert.equal(outcome.dataset.outcome, expected.outcome);
  return expected;
}

async function runChecks() {
  html = await readFile(artifact, 'utf8');
  observations.artifact = { path: path.relative(root, artifact), bytes: Buffer.byteLength(html), sha256: fingerprint(html) };
  await check('artefato compilado autocontido: nenhum recurso remoto obrigatório ou API de rede', async () => {
    const staticDom = new JSDOM(html);
    try {
      const document = staticDom.window.document;
      assert.equal(document.documentElement.lang, 'pt-BR');
      assert.equal(document.querySelectorAll('script[src], link[rel="stylesheet"][href], iframe, object, embed').length, 0);
      const embeddedAssets = [...document.querySelectorAll('[src], [srcset], video[poster], source[srcset]')];
      for (const element of embeddedAssets) {
        for (const attribute of ['src', 'srcset', 'poster']) {
          const value = element.getAttribute(attribute);
          if (value) assert.match(value, /^(?:data:|blob:)/, `Asset não incorporado: ${attribute}=${value}`);
        }
      }
      const scripts = [...document.querySelectorAll('script')].map(script => script.textContent).join('\n');
      const styles = [...document.querySelectorAll('style')].map(style => style.textContent).join('\n');
      assert.doesNotMatch(scripts, /\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|\bEventSource\b|\bsendBeacon\s*\(|\bimportScripts\s*\(/);
      assert.doesNotMatch(scripts, /\.innerHTML\s*=|\.outerHTML\s*=|\.insertAdjacentHTML\s*\(|\bdocument\.write\s*\(/);
      assert.doesNotMatch(styles, /@import\b|url\(\s*["']?(?:https?:)?\/\//i);
      const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.content || '';
      assert.match(csp, /connect-src\s+'none'/);
      observations.runtimeDependencies = { externalAssets: 0, networkApisFound: 0, csp, externalReferenceLinks: document.querySelectorAll('a[href^="https://"],a[href^="http://"]').length };
    } finally { staticDom.window.close(); }
  });

  await check('recibo do build corresponde ao HTML testado e inclui os módulos do núcleo real', async () => {
    const build = JSON.parse(await readFile(path.join(root, 'evidence/presentation-build.json'), 'utf8'));
    assert.equal(build.sha256, observations.artifact.sha256);
    assert.equal(build.bytes, observations.artifact.bytes);
    assert.equal(build.pitchSlides, 7);
    assert.equal(build.totalSlides, 15);
    for (const source of ['src/core/catalog.ts', 'src/core/engine.ts', 'src/core/search.ts', 'src/core/science.ts', 'src/data/science-data.ts']) assert.ok(build.inputs.includes(source), `Módulo do núcleo ausente do build: ${source}`);
    observations.buildReceipt = { path: 'evidence/presentation-build.json', generatedAt: build.generatedAt, sha256: build.sha256 };
  });

  await check('IDs únicos e todos os links internos/relativos resolvidos no diretório do pacote', async () => {
    const staticDom = new JSDOM(html);
    try {
      const document = staticDom.window.document;
      const ids = [...document.querySelectorAll('[id]')].map(node => node.id);
      assert.equal(ids.length, new Set(ids).size, 'IDs duplicados prejudicam navegação e referências');
      const localLinks = [];
      const hashLinks = [];
      for (const anchor of document.querySelectorAll('a[href]')) {
        const href = anchor.getAttribute('href');
        assert.doesNotMatch(href, /^\s*(?:javascript|vbscript):/i);
        if (href.startsWith('#')) {
          const id = decodeURIComponent(href.slice(1));
          assert.ok(id && document.getElementById(id), `Âncora não resolvida: ${href}`);
          hashLinks.push(href);
        } else if (!/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(href) && !href.startsWith('//')) {
          const target = path.resolve(path.dirname(artifact), decodeURIComponent(href.split(/[?#]/)[0]));
          assert.ok(target.startsWith(root + path.sep), `Link sai da raiz preservada do projeto: ${href}`);
          const ownReceipt = target === path.join(root, 'evidence/presentation-qa.json');
          if (!ownReceipt) assert.ok((await stat(target)).isFile(), `Arquivo vinculado ausente: ${href}`);
          localLinks.push({ href, target: path.relative(root, target), ...(ownReceipt ? { producedByThisCommand: true } : {}) });
        }
      }
      observations.linkAudit = { uniqueIds: ids.length, internalAnchors: hashLinks, localFiles: localLinks };
    } finally { staticDom.window.close(); }
  });

  await check('fontes do apêndice possuem identidade e links explícitos', async () => {
    const context = await mount();
    const expected = ['mod13', 'ornl', 'mission', 'cubesat', 'rules', 'resources'];
    const sourceIds = [];
    for (const name of expected) {
      const row = required(context.document, `#fonte-${name}[data-source-id]`);
      assert.ok(row.dataset.sourceId.trim());
      assert.ok(row.querySelector('a[href^="https://"]'), `Fonte ${name} sem link HTTPS explícito`);
      sourceIds.push(row.dataset.sourceId);
    }
    assert.equal(new Set(sourceIds).size, sourceIds.length);
    observations.sourceIds = sourceIds;
  });

  await check('três JSONs de fonte incorporados preservam os bytes dos originais locais', async () => {
    const context = await mount();
    const sourceData = required(context.document, '#embedded-source-data');
    assert.equal(sourceData.type, 'application/json');
    const embedded = JSON.parse(sourceData.textContent);
    const names = ['mod13q1-A-raw.json', 'mod13q1-B-raw.json', 'mod13q1-C-raw.json'];
    assert.deepEqual(Object.keys(embedded).sort(), names);
    const files = [];
    for (const name of names) {
      const original = await readFile(path.join(root, 'public/data', name), 'utf8');
      assert.equal(embedded[name], original, `Os bytes da fonte ${name} mudaram na incorporação`);
      assert.ok(context.document.querySelector(`[data-embedded-source="${name}"]`));
      files.push({ name, bytes: Buffer.byteLength(original), sha256: fingerprint(original) });
    }
    observations.embeddedSources = files;
  });

  await check('CSS de impressão seleciona apenas os quadros do modo ativo', async () => {
    const context = await mount();
    const printRules = [...context.document.styleSheets].flatMap(sheet => [...sheet.cssRules]).filter(rule => rule.type === 4 && rule.conditionText === 'print');
    assert.equal(printRules.length, 1);
    const rules = [...printRules[0].cssRules];
    const visible = rules.find(rule => rule.selectorText === '.slide[data-in-mode=true]');
    const hidden = rules.find(rule => rule.selectorText === '.slide[data-in-mode=false]');
    assert.equal(visible?.style.getPropertyValue('display'), 'flex');
    assert.equal(visible?.style.getPropertyPriority('display'), 'important');
    assert.equal(hidden?.style.getPropertyValue('display'), 'none');
    assert.equal(hidden?.style.getPropertyPriority('display'), 'important');
    observations.printMode = 'Regras CSS por data-in-mode verificadas; paginação/impressão nativa não executada.';
  });

  await check('pitch inicial contém sete quadros; navegação, limites e contador concordam', async () => {
    const context = await mount();
    const slides = [...context.document.querySelectorAll('section[data-slide]')];
    const pitch = slides.filter(slide => slide.dataset.pitch === 'true');
    assert.equal(pitch.length, 7);
    assert.equal(required(context.document, '#slides').dataset.mode, 'pitch');
    assert.equal(required(context.document, '#mode-pitch').getAttribute('aria-pressed'), 'true');
    assert.equal(required(context.document, '#mode-explore').getAttribute('aria-pressed'), 'false');
    assert.equal(slides.filter(slide => slide.dataset.inMode === 'true').length, 7);
    assert.equal(activeSlide(context), pitch[0]);
    assert.match(required(context.document, '#slide-counter').textContent, /01\s*\/\s*07/);
    assert.equal(required(context.document, '#previous-slide').disabled, true);
    for (let index = 1; index < pitch.length; index++) {
      click(context, '#next-slide');
      assert.equal(activeSlide(context), pitch[index]);
      assert.match(required(context.document, '#slide-counter').textContent, new RegExp(`0${index + 1}\\s*\\/\\s*07`));
    }
    assert.equal(required(context.document, '#next-slide').disabled, true);
    click(context, '#next-slide');
    assert.equal(activeSlide(context), pitch.at(-1));
    key(context, 'Home');
    assert.equal(activeSlide(context), pitch[0]);
    key(context, 'ArrowRight');
    assert.equal(activeSlide(context), pitch[1]);
    key(context, 'ArrowLeft');
    assert.equal(activeSlide(context), pitch[0]);
    key(context, 'End');
    assert.equal(activeSlide(context), pitch.at(-1));
    observations.slideCounts = { pitch: pitch.length, exploration: slides.length, appendix: slides.length - pitch.length };
  });

  await check('modo Exploração inclui apêndices e retorna ao pitch com contador consistente', async () => {
    const context = await mount();
    click(context, '#mode-explore');
    const slides = [...context.document.querySelectorAll('section[data-slide]')];
    assert.equal(slides.length, 15);
    assert.equal(required(context.document, '#slides').dataset.mode, 'explore');
    assert.equal(required(context.document, '#mode-explore').getAttribute('aria-pressed'), 'true');
    assert.equal(slides.filter(slide => slide.dataset.inMode === 'true').length, 15);
    key(context, 'End');
    assert.equal(activeSlide(context), slides.at(-1));
    assert.match(required(context.document, '#slide-counter').textContent, /15\s*\/\s*15/);
    click(context, '#mode-pitch');
    assert.equal(required(context.document, '#slides').dataset.mode, 'pitch');
    assert.equal(activeSlide(context).dataset.pitch, 'true');
    assert.match(required(context.document, '#slide-counter').textContent, /0[1-7]\s*\/\s*07/);
    assert.equal(slides.filter(slide => slide.dataset.inMode === 'true').length, 7);
  });

  await check('visão geral, notas, impressão e tela cheia têm handlers conectados', async () => {
    const context = await mount();
    go(context, 4);
    const notes = required(context.document, '#notes-panel');
    const before = notes.hidden;
    click(context, '#open-notes');
    assert.notEqual(notes.hidden, before);
    click(context, '#open-notes');
    assert.equal(notes.hidden, before);
    click(context, '#print-deck');
    assert.equal(context.nativeCalls.print, 1);
    click(context, '#fullscreen');
    await settle(() => context.nativeCalls.fullscreen === 1);
    assert.ok(context.document.fullscreenElement);
    click(context, '#fullscreen');
    await settle(() => context.nativeCalls.exitFullscreen === 1);
    assert.equal(context.document.fullscreenElement, null);
    observations.nativeControls = 'Somente chamada/estado em adaptadores: não qualifica fullscreen, impressão ou foco nativos.';
  });

  await check('notas PT/EN e cronômetro exigem ação e pausam ao fechar, ocultar ou imprimir', async () => {
    const context = await mount();
    go(context, 4);
    const slide = activeSlide(context);
    let clock = Date.now();
    context.window.Date.now = () => clock;
    assert.equal(context.intervals.size, 0);
    assert.equal(required(context.document, '#timer-value').textContent, '00:00');
    click(context, '#open-notes');
    const portuguese = required(context.document, '#notes-text').textContent;
    assert.ok(portuguese.length > 50);
    change(context, '#notes-language', 'en');
    const english = required(context.document, '#notes-text');
    assert.equal(english.lang, 'en');
    assert.ok(english.textContent.length > 50);
    assert.notEqual(english.textContent, portuguese);
    assert.match(required(context.document, '#notes-cue').textContent, /Ajuda do facilitador/);
    click(context, '#timer-toggle');
    assert.equal(context.intervals.size, 1);
    clock += 61_000;
    [...context.intervals.values()][0].callback();
    assert.equal(required(context.document, '#timer-value').textContent, '01:01');
    assert.equal(activeSlide(context), slide);
    assert.equal(required(context.document, '#demo-outcome').dataset.outcome, 'pending');
    assert.equal(required(context.document, '#preset-repair').disabled, true);
    click(context, '#close-notes');
    assert.equal(context.intervals.size, 0);
    assert.equal(required(context.document, '#timer-toggle').getAttribute('aria-pressed'), 'false');
    click(context, '#open-notes');
    click(context, '#timer-toggle');
    assert.equal(context.intervals.size, 1);
    Object.defineProperty(context.document, 'hidden', { configurable: true, value: true });
    context.document.dispatchEvent(new context.window.Event('visibilitychange'));
    assert.equal(context.intervals.size, 0);
    Object.defineProperty(context.document, 'hidden', { configurable: true, value: false });
    click(context, '#timer-toggle');
    assert.equal(context.intervals.size, 1);
    click(context, '#print-deck');
    assert.equal(context.intervals.size, 0);
    click(context, '#timer-reset');
    assert.equal(required(context.document, '#timer-value').textContent, '00:00');
    assert.equal(activeSlide(context), slide);
    assert.equal(required(context.document, '#demo-outcome').dataset.outcome, 'pending');
    observations.timer = { initiallyRunning: false, explicitStart: true, controlledElapsedSeconds: 61, pausedOnClose: true, pausedOnHidden: true, pausedOnPrint: true, automaticDecisions: 0 };
  });

  await check('atalhos respeitam campos e diálogo; intervalos não executam decisões ou navegam', async () => {
    const context = await mount();
    go(context, 4);
    const slide = activeSlide(context);
    const counter = required(context.document, '#slide-counter').textContent;
    const pending = required(context.document, '#demo-outcome').dataset.outcome;
    const samples = [required(context.document, '#scenario-select'), required(context.document, 'select[data-config-key]')];
    for (const tag of ['input', 'textarea', 'div']) {
      const element = context.document.createElement(tag);
      if (tag === 'div') element.setAttribute('contenteditable', 'true');
      slide.append(element);
      samples.push(element);
    }
    for (const element of samples) {
      for (const value of ['ArrowRight', 'ArrowLeft', 'Home', 'End', ' ', 'PageDown', 'PageUp']) {
        const event = key(context, value, element);
        assert.equal(activeSlide(context), slide, `Atalho ${value} capturado em ${element.tagName}`);
        assert.equal(event.defaultPrevented, false, `Evento ${value} deve permanecer do campo ${element.tagName}`);
      }
    }
    click(context, '#open-overview');
    key(context, 'ArrowRight', required(context.document, '#overview-dialog [data-go-slide]'));
    assert.equal(activeSlide(context), slide);
    click(context, '#close-overview');
    for (const interval of context.intervals.values()) for (let count = 0; count < 3; count++) interval.callback();
    assert.equal(required(context.document, '#slide-counter').textContent, counter);
    assert.equal(required(context.document, '#demo-outcome').dataset.outcome, pending);
    assert.equal(required(context.document, '#preset-repair').disabled, true);
    observations.initialControlledIntervals = context.intervals.size;
  });

  await check('seis escolhas binárias e dois cenários correspondem ao catálogo real', async () => {
    const context = await mount();
    go(context, 4);
    const controls = [...context.document.querySelectorAll('select[data-config-key]')];
    assert.equal(controls.length, 6);
    assert.deepEqual(controls.map(element => element.dataset.configKey).sort(), [...CONFIG_KEYS].sort());
    for (const control of controls) assert.deepEqual([...control.options].map(option => option.value).sort(), CATALOG[control.dataset.configKey].map(choice => choice.id).sort());
    assert.deepEqual([...required(context.document, '#scenario-select').options].map(option => option.value).sort(), SCENARIOS.map(item => item.id).sort());
    assertConfig(context, DEFAULT_CONFIG);
    observations.controls = { configKeys: CONFIG_KEYS, scenarios: SCENARIOS.map(item => item.id) };
  });

  await check('segmentos e seis registros científicos respondem a seleção com fonte e valores identificáveis', async () => {
    const context = await mount();
    go(context, 1);
    const segmentButtons = [...context.document.querySelectorAll('[data-segment]')];
    assert.equal(segmentButtons.length, 4);
    const descriptions = new Set();
    for (const button of segmentButtons) {
      button.click();
      assert.equal(button.getAttribute('aria-pressed'), 'true');
      assert.equal(segmentButtons.filter(item => item.getAttribute('aria-pressed') === 'true').length, 1);
      descriptions.add(required(context.document, '#segment-detail').textContent);
    }
    assert.equal(descriptions.size, 4);
    click(context, '#mode-explore');
    go(context, 7);
    const records = [...context.document.querySelectorAll('#science-record-buttons button[data-science-index]')];
    assert.equal(records.length, SCIENCE_RECORDS.length);
    for (const [index, button] of records.entries()) {
      button.click();
      assert.equal(button.getAttribute('aria-pressed'), 'true');
      const text = required(context.document, '#science-record-detail').textContent;
      const record = SCIENCE_RECORDS[index];
      for (const value of [record.id, record.compositeStart, record.observationDate, String(record.redInteger), String(record.nirInteger)]) assert.ok(text.includes(value), `Registro ${record.id} não expõe ${value}`);
    }
    observations.scientificSelection = { records: records.length, ids: SCIENCE_RECORDS.map(record => record.id), segments: segmentButtons.map(button => button.dataset.segment) };
  });

  const demo = await mount();
  go(demo, 4);
  await check('reparo e catálogo permanecem fechados antes dos dois conflitos observados', async () => {
    for (const selector of ['#preset-repair', '#run-catalog']) assert.equal(required(demo.document, selector).disabled, true);
    click(demo, '#preset-repair');
    click(demo, '#run-catalog');
    assert.equal(required(demo.document, '#demo-outcome').dataset.outcome, 'pending');
    assert.equal(demo.document.querySelectorAll('#catalog-grid button[data-config-index]').length, 0);
    go(demo, 5);
    go(demo, 4);
    assert.equal(required(demo.document, '#preset-repair').disabled, true);
  });

  await check('base longa entrega 6/6 calculados pelo núcleo incorporado', async () => {
    click(demo, '#preset-long');
    const result = await assertRun(demo, DEFAULT_CONFIG, 'long-contact');
    assert.equal(result.deliveredRecords, 6);
    assert.equal(result.downlinkedBits, '1080000000');
    assert.equal(required(demo.document, '#preset-repair').disabled, true);
    observations.longBase = { outcome: result.outcome, deliveredRecords: result.deliveredRecords, downlinkedBits: result.downlinkedBits };
  });

  await check('base curta entrega 2/6 por contato, sem confundir falha de entrega e de potência', async () => {
    click(demo, '#preset-short');
    const result = await assertRun(demo, DEFAULT_CONFIG, 'short-contact');
    assert.equal(result.deliveredRecords, 2);
    assert.equal(result.downlinkedBits, '460800000');
    assert.deepEqual(result.violations, ['delivery']);
    assert.equal(demo.document.querySelectorAll('#demo-events [data-code="PEAK_POWER"]').length, 0);
    assert.equal(required(demo.document, '#preset-repair').disabled, true);
    assert.equal(required(demo.document, '#run-catalog').disabled, true);
    observations.shortBase = { outcome: result.outcome, deliveredRecords: result.deliveredRecords, downlinkedBits: result.downlinkedBits, violations: result.violations };
  });

  await check('ÍNDICE isolado falha por potência aos 600 s e só então libera a revelação', async () => {
    click(demo, '#preset-index');
    const result = await assertRun(demo, { ...DEFAULT_CONFIG, processing: 'index' }, 'short-contact');
    assert.equal(result.outcome, 'failure');
    assert.equal(result.completedAtS, 600);
    assert.ok(result.violations.includes('peak-power'));
    const event = required(demo.document, '#demo-events [data-code="PEAK_POWER"]');
    assert.equal(Number(event.dataset.time), 600);
    assert.equal(required(demo.document, '#preset-repair').disabled, false);
    assert.equal(required(demo.document, '#run-catalog').disabled, false);
    observations.indexOnly = { outcome: result.outcome, deliveredRecords: result.deliveredRecords, completedAtS: result.completedAtS, violations: result.violations };
  });

  await check('reparo explícito bateria grande + ÍNDICE entrega 6/6 e não modifica o núcleo', async () => {
    click(demo, '#preset-repair');
    const result = await assertRun(demo, { ...DEFAULT_CONFIG, battery: 'large', processing: 'index' }, 'short-contact');
    assert.equal(result.deliveredRecords, 6);
    assert.equal(result.downlinkedBits, '360000000');
    assert.equal(result.massKg, 3.5);
    assert.equal(result.credits, 84);
    observations.repaired = { outcome: result.outcome, deliveredRecords: result.deliveredRecords, downlinkedBits: result.downlinkedBits, massKg: result.massKg, credits: result.credits };
  });

  await check('trace e botões de evento inspecionam estados sem recalcular ou alterar o resultado', async () => {
    const expected = simulateMission({ ...DEFAULT_CONFIG, battery: 'large', processing: 'index' }, 'short-contact');
    const range = required(demo.document, '#trace-range');
    assert.equal(range.disabled, false);
    assert.equal(Number(range.max), expected.trace.length - 1);
    const metricsBefore = ['demo-delivered', 'demo-bits', 'demo-queue', 'demo-energy'].map(id => required(demo.document, `#${id}`).dataset.value);
    for (const index of [0, expected.trace.length - 1]) {
      range.value = String(index);
      range.dispatchEvent(new demo.window.Event('input', { bubbles: true }));
      assert.equal(Number(required(demo.document, '#trace-time').dataset.value), expected.trace[index].timeS);
    }
    const eventRow = required(demo.document, '#demo-events [data-code="JOB_START"]');
    eventRow.querySelector('button').click();
    assert.ok(Number(required(demo.document, '#trace-time').dataset.value) <= Number(eventRow.dataset.time));
    assert.deepEqual(['demo-delivered', 'demo-bits', 'demo-queue', 'demo-energy'].map(id => required(demo.document, `#${id}`).dataset.value), metricsBefore);
    observations.traceInspection = { tracePoints: expected.trace.length, firstTimeS: expected.trace[0].timeS, lastTimeS: expected.trace.at(-1).timeS, resultUnchanged: true };
  });

  await check('gate reconhece execuções manuais equivalentes e não simples troca dos seletores', async () => {
    const context = await mount();
    go(context, 4);
    change(context, '#scenario-select', 'short-contact');
    assert.equal(required(context.document, '#preset-repair').disabled, true);
    click(context, '#run-demo');
    await assertRun(context, DEFAULT_CONFIG, 'short-contact');
    assert.equal(required(context.document, '#preset-repair').disabled, true);
    change(context, 'select[data-config-key="processing"]', 'index');
    assert.equal(required(context.document, '#demo-outcome').dataset.outcome, 'pending');
    assert.equal(required(context.document, '#preset-repair').disabled, true);
    click(context, '#run-demo');
    await assertRun(context, { ...DEFAULT_CONFIG, processing: 'index' }, 'short-contact');
    assert.equal(required(context.document, '#preset-repair').disabled, false);
    assert.equal(required(context.document, '#run-catalog').disabled, false);
    observations.manualGate = { equivalentToPresets: true, unlockedBySelectionOnly: false };
  });

  await check('controles manuais recalculam uma combinação diferente com o núcleo real', async () => {
    const context = await mount();
    go(context, 4);
    const config = Object.fromEntries(CONFIG_KEYS.map(name => [name, CATALOG[name].find(choice => choice.id !== DEFAULT_CONFIG[name]).id]));
    for (const name of CONFIG_KEYS) change(context, `select[data-config-key="${name}"]`, config[name]);
    change(context, '#scenario-select', 'short-contact');
    click(context, '#run-demo');
    const result = await assertRun(context, config, 'short-contact');
    assert.equal(required(context.document, '#preset-repair').disabled, true, 'Outra combinação não deve simular observação dos casos do gate');
    observations.manualCombination = { config, outcome: result.outcome, deliveredRecords: result.deliveredRecords, massKg: result.massKg, credits: result.credits };
  });

  await check('catálogo interativo enumera 64 casos e certifica mínimo 2 apenas no domínio declarado', async () => {
    go(demo, 5);
    click(demo, '#run-catalog');
    await settle(() => demo.document.querySelectorAll('#catalog-grid button[data-config-index]').length === 64, '64 células do catálogo');
    const cells = [...demo.document.querySelectorAll('#catalog-grid button[data-config-index]')];
    assert.equal(new Set(cells.map(cell => cell.dataset.configIndex)).size, 64);
    const expected = searchCatalog({ ...DEFAULT_CONFIG }, 'short-contact');
    assert.equal(expected.evaluated, 64);
    assert.equal(expected.minimumDistance, 2);
    assert.equal(expected.best.length, 1);
    assert.match(required(demo.document, '#catalog-minimum').textContent, /2/);
    assert.match(required(demo.document, '#catalog-summary').textContent, /64/);
    assert.equal(Number(required(demo.document, '#catalog-minimum').dataset.value), expected.minimumDistance);
    const summary = required(demo.document, '#catalog-summary');
    for (const key of ['evaluated', 'successful', 'failed', 'invalid', 'indeterminate']) assert.equal(Number(summary.dataset[key]), expected[key]);
    assert.equal(summary.dataset.complete, 'true');
    assert.equal(cells.filter(cell => cell.dataset.outcome === 'success').length, 9);
    assert.equal(cells.filter(cell => cell.dataset.outcome === 'failure').length, 49);
    assert.equal(cells.filter(cell => cell.dataset.outcome === 'invalid').length, 6);
    assert.equal(cells.filter(cell => cell.dataset.minimal === 'true').length, 1);
    observations.catalog = { evaluated: expected.evaluated, total: expected.total, successful: expected.successful, failed: expected.failed, invalid: expected.invalid, indeterminate: expected.indeterminate, minimumDistance: expected.minimumDistance, bestCount: expected.best.length };
  });

  await check('seleção no catálogo e aplicação da testemunha carregam projeto pendente, sem execução automática', async () => {
    const repaired = { ...DEFAULT_CONFIG, battery: 'large', processing: 'index' };
    click(demo, '#catalog-grid button[data-minimal="true"]');
    assert.equal(activeSlide(demo).id, 'quadro-05');
    assertConfig(demo, repaired);
    assert.equal(required(demo.document, '#demo-outcome').dataset.outcome, 'pending');
    assert.equal(required(demo.document, '#demo-delivered').dataset.value, undefined);
    click(demo, '#run-demo');
    await assertRun(demo, repaired, 'short-contact');
    go(demo, 5);
    click(demo, '#apply-catalog-witness');
    assert.equal(activeSlide(demo).id, 'quadro-05');
    assertConfig(demo, repaired);
    assert.equal(required(demo.document, '#demo-outcome').dataset.outcome, 'pending');
    observations.catalogSelection = { loadsConfiguration: true, executesAutomatically: false, explicitExecutionDelivered: 6 };
  });

  await check('núcleo e fontes científicas preservam os hashes do gate anterior', async () => {
    const baseline = JSON.parse(await readFile(path.join(root, 'evidence/final-validation.json'), 'utf8'));
    const selected = baseline.sourceHashes.filter(item => item.path.startsWith('src/core/') || item.path === 'src/data/science-data.ts');
    assert.ok(selected.length >= 8);
    const hashes = [];
    for (const item of selected) {
      const current = fingerprint(await readFile(path.join(root, item.path)));
      assert.equal(current, item.sha256, `Mudança do núcleo exigiria nova decisão de regressão: ${item.path}`);
      hashes.push({ path: item.path, sha256: current });
    }
    observations.preservedCore = hashes;
  });

  await check('execuções DOM não geram erro JavaScript nem tentam conexão de rede', async () => {
    for (const context of contexts) {
      assert.deepEqual(context.errors, []);
      assert.deepEqual(context.networkAttempts, []);
    }
    observations.domInstances = contexts.length;
    observations.networkAttempts = 0;
  });
}

try { await runChecks(); }
catch (error) { checks.push({ name: 'preparação da checagem', status: 'failed', error: error.stack || String(error) }); process.stderr.write(`${error.stack}\n`); }
finally {
  for (const dom of openDocuments) dom.window.close();
  const failed = checks.filter(item => item.status === 'failed').length;
  const harnessBytes = await readFile(fileURLToPath(import.meta.url));
  const receipt = {
    startedAt, finishedAt: new Date().toISOString(), command: 'node scripts/test-presentation.mjs', node: process.version,
    status: failed === 0 ? 'passed-with-explicit-limits' : 'failed', checksPassed: checks.length - failed, checksFailed: failed,
    environment: 'jsdom; DOM simulado, sem navegador real, HTTP, Worker, GPU ou acesso de rede',
    engine: 'HTML compilado com núcleo real; expectativas comparadas à API original e aos casos publicados. Não é novo oráculo físico independente.',
    nativeAdapters: ['scrollTo/scrollIntoView sem efeito visual', 'print registra somente chamada', 'fullscreen simulado por atributos', 'setInterval controlado pelo teste', 'Date.now controlado somente no teste do cronômetro'],
    limitations: ['Não verifica layout, contraste, responsividade, foco nativo ou árvore de acessibilidade', 'Não verifica impressão/PDF nativa ou tela cheia real', 'Não valida abertura fria offline, file: ou persistência em navegador', 'Não repete os 51 testes Node, 9 contagens DOM e 8 casos HTTP anteriores', 'Não estabelece elegibilidade, conformidade de submissão ou aprendizagem'],
    harness: { path: 'scripts/test-presentation.mjs', bytes: harnessBytes.length, sha256: fingerprint(harnessBytes) },
    observations, checks,
  };
  await mkdir(path.join(root, 'evidence'), { recursive: true });
  await writeFile(path.join(root, 'evidence/presentation-qa.json'), JSON.stringify(receipt, null, 2) + '\n');
  process.stdout.write(`${receipt.checksPassed}/${checks.length} verificações aprovadas; ${failed} falhas.\n`);
  process.exitCode = failed ? 1 : 0;
}
