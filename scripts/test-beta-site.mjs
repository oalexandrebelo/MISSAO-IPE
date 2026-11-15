#!/usr/bin/env node
/**
 * Independent publication and HTTP checks for site/. No browser or old core suite.
 * Uses the release server in a bounded child process on an available loopback port.
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile, readdir, lstat, mkdir } from 'node:fs/promises';
import { createServer } from 'node:net';
import { get as httpGet } from 'node:http';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM, VirtualConsole } from 'jsdom';
import * as ts from 'typescript/unstable/ast';
import { API } from 'typescript/unstable/sync';
import { decorateLibrasPage, librasGuide, librasScope } from './public-libras.mjs';
import { decorateAnalyticsPage } from './public-analytics.mjs';

const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const site = path.join(root, 'site');
const startedAt = new Date().toISOString();
const checks = [];
const observations = {};
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const slash = value => value.split(path.sep).join('/');
const textExtensions = new Set(['.html', '.js', '.mjs', '.css', '.json', '.md', '.txt', '.mmd', '.prisma', '.svg', '.py']);
const safeResearchEvidence = new Set(['research/evidence/validate-evi3-research.py', 'research/evidence/evi3-validation.json', 'research/evidence/resources-retrieval-20261114.json']);
const expectedData = ['cmr-mod13q1-granule-2.json', 'cmr-mod13q1-granules.json', 'mod13q1-A-raw.json', 'mod13q1-A-retrieval.json', 'mod13q1-B-raw.json', 'mod13q1-B-retrieval.json', 'mod13q1-C-raw.json', 'mod13q1-C-retrieval.json', 'mod13q1-bands.json', 'mod13q1-research-pack.json'];
const mimeByExtension = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.md': 'text/plain', '.txt': 'text/plain', '.mmd': 'text/plain', '.prisma': 'text/plain', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.webp': 'image/webp', '.glb': 'model/gltf-binary', '.wasm': 'application/wasm', '.riv': 'application/octet-stream' };
let files = [];
const bytesByFile = new Map();
const documents = new Map();
const references = [];
const remoteReferences = [];
const officialOrigin = 'https://nasa-missaoipe.alexandrebelo.com';
const landingFiles = new Set();
const portalOrigin = 'https://d2ol7oe51mr4n9.cloudfront.net';
const portalAssetBase = `${portalOrigin}/user_38xzZboKViGWJOttwIXH07lWA1P/`;
const portalAssets = new Map([
  ['3c83091e-4046-4fd6-adbb-2edb728be79a.mp4', 'video'],
  ['fc3ded42-e845-41f3-a830-5cab512d79cd.mp4', 'video'],
  ['b30f64d9-1637-477a-83df-d0fc6461a422.mp4', 'video'],
  ['5fc5651c-3b5d-4171-b507-87f7e635d1b4.mp4', 'video'],
  ['d6fb8b6b-c15e-4aaa-9cf7-45bbb5e33372.jpg', 'img'],
  ['eb7e0f53-50cd-4af5-abc4-8b9a52cdc01b.svg', 'img'],
].map(([file, kind]) => [portalAssetBase + file, kind]));
const gameDependencies = [];
let manifest;
let vercel;
let origin;
let child;
let serverLog = '';

function scrub(value) { return String(value).replaceAll(root, '<project>'); }
async function check(name, run) {
  const start = performance.now();
  try {
    const detail = await run();
    checks.push({ name, status: 'passed', durationMs: Number((performance.now() - start).toFixed(3)), ...(detail === undefined ? {} : { detail }) });
    process.stdout.write(`PASS ${name}\n`);
  } catch (error) {
    checks.push({ name, status: 'failed', durationMs: Number((performance.now() - start).toFixed(3)), error: scrub(error.message) });
    process.stderr.write(`FAIL ${name}: ${scrub(error.message)}\n`);
  }
}

async function inventory(folder) {
  const found = [];
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const filename = path.join(folder, entry.name);
    const relative = slash(path.relative(site, filename));
    const info = await lstat(filename);
    assert.equal(info.isSymbolicLink(), false, `Symlink público não permitido: ${relative}`);
    if (entry.isDirectory()) found.push(...await inventory(filename));
    else if (entry.isFile()) found.push(relative);
  }
  return found.sort();
}

function parseHtml(filename) {
  const virtualConsole = new VirtualConsole();
  const dom = new JSDOM(bytesByFile.get(filename).toString('utf8'), { url: `https://beta.invalid/${filename}`, virtualConsole });
  documents.set(filename, dom);
  return dom.window.document;
}

function resolveReference(source, value, kind) {
  if (!value || /^(?:data:|blob:|mailto:|tel:)/i.test(value)) return;
  assert.doesNotMatch(value, /^\s*(?:javascript|vbscript):/i, `Protocolo executável em ${source}`);
  const url = new URL(value, `https://beta.invalid/${source}`);
  if (url.origin !== 'https://beta.invalid' && (url.origin !== officialOrigin || !landingFiles.has(source))) {
    if (kind !== 'navigation') {
      assert.ok(source === 'planet-jumping.html' && portalAssets.get(url.href) === kind, `Recurso remoto de runtime não autorizado em ${source}: ${kind} · ${url.href}`);
      remoteReferences.push({ source, url: url.href, kind });
    }
    return;
  }
  const pathname = decodeURIComponent(url.pathname);
  const rewrite = vercel.rewrites?.find(rule => rule.source === pathname || vercel.trailingSlash === false && `${rule.source}/` === pathname);
  const target = (rewrite?.destination ?? pathname).replace(/^\//, '') || 'index.html';
  const filename = target.endsWith('/') ? `${target}index.html` : target;
  assert.ok(bytesByFile.has(filename), `Referência local ausente: ${source} → ${filename} (${kind})`);
  if (url.hash && filename.endsWith('.html')) {
    const document = documents.get(filename)?.window.document || parseHtml(filename);
    const id = decodeURIComponent(url.hash.slice(1));
    assert.ok(document.getElementById(id) || document.querySelector(`[name="${id.replaceAll('"', '\\"')}"]`), `Âncora ausente: ${source} → ${filename}#${id}`);
  }
  references.push({ source, target: filename, requestPath: url.pathname + url.search, kind, ...(url.hash ? { fragment: decodeURIComponent(url.hash.slice(1)) } : {}) });
}

function inspectCss(source, css) {
  for (const match of css.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gi)) {
    const value = match[2].trim();
    if (value.startsWith('#')) continue;
    resolveReference(source, value, 'css-resource');
  }
  for (const match of css.matchAll(/@import\s+(?:url\([^)]*\)|["']([^"']+)["'])/gi)) {
    if (match[1]) resolveReference(source, match[1], 'css-import');
  }
}

function inspectHtml(source, document) {
  for (const anchor of document.querySelectorAll('a[href]')) resolveReference(source, anchor.getAttribute('href'), 'navigation');
  for (const element of document.querySelectorAll('script[src],img[src],iframe[src],audio[src],video[src],source[src],input[type="image"][src]')) resolveReference(source, element.getAttribute('src'), element.tagName.toLowerCase());
  for (const element of document.querySelectorAll('link[href]')) {
    const rel = element.getAttribute('rel') || '';
    if (/stylesheet|modulepreload|preload|icon|manifest|prefetch/i.test(rel)) resolveReference(source, element.getAttribute('href'), `link-${rel}`);
  }
  for (const element of document.querySelectorAll('image[href],use[href]')) {
    const value = element.getAttribute('href');
    if (!value?.startsWith('#')) resolveReference(source, value, 'svg-resource');
  }
  for (const element of document.querySelectorAll('[poster]')) resolveReference(source, element.getAttribute('poster'), 'poster');
  for (const element of document.querySelectorAll('[srcset]')) {
    const sourceSet = element.getAttribute('srcset');
    if (!sourceSet || sourceSet.startsWith('data:')) continue;
    for (const candidate of sourceSet.split(',')) {
      const match = candidate.trim().match(/^(\S+)(?:\s+\d+(?:\.\d+)?[wx])?$/);
      assert.ok(match, `srcset inválido em ${source}`);
      resolveReference(source, match[1], 'srcset');
    }
  }
  for (const style of document.querySelectorAll('style')) inspectCss(source, style.textContent);
  for (const element of document.querySelectorAll('[style]')) inspectCss(source, element.getAttribute('style'));
}

function privateFindings(filename, text) {
  const found = [];
  const locate = (rule, regex, accept = () => true) => {
    for (const match of text.matchAll(regex)) {
      if (!accept(match)) continue;
      found.push({ path: filename, rule, line: text.slice(0, match.index).split('\n').length });
    }
  };
  locate('personal-or-executor-absolute-path', /\/(?:Users|home|workspace)\/[A-Za-z0-9._-]+(?:\/[^\s<>"']*)?/g, match => {
    // Emscripten's virtual HOME in the official Rive runtime is not a host path.
    const virtualRiveHome = /^lab\/assets\/rive-[A-Za-z0-9_-]+\.js$/.test(filename)
      && match[0] === '/home/web_user' && text.slice(match.index - 6, match.index) === 'HOME:`';
    return !virtualRiveHome;
  });
  locate('windows-personal-path', /\b[A-Za-z]:\\{1,2}(?:Users|Documents and Settings)\\{1,2}[A-Za-z0-9._-]+/g);
  locate('private-hostname', /\bAB-PCSRV\b|https?:\/\/(?!localhost(?::|\/))[A-Za-z][A-Za-z0-9_-]*:(?:\d{2,5})(?:\/|\b)|https?:\/\/[A-Za-z0-9_.-]+\.(?:local|lan|internal)(?::\d+)?/gi);
  locate('valid-private-ipv4', /(?<![\d.])(?:\d{1,3}\.){3}\d{1,3}(?![\d.])/g, match => {
    const octets = match[0].split('.').map(Number);
    return octets.every(value => value >= 0 && value <= 255) && (octets[0] === 10 || octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31 || octets[0] === 192 && octets[1] === 168 || octets[0] === 169 && octets[1] === 254);
  });
  locate('private-ipv6-url', /https?:\/\/\[(?:f[cd][0-9a-f]{2}|fe80):[0-9a-f:]+\]/gi);
  locate('private-key-marker', /-----BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/g);
  locate('credential-signature', /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{30,}|sk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{24,}|AKIA[0-9A-Z]{16})\b/g);
  return found;
}

function inspectGameModule(filename, ast) {
  const add = (value, kind) => {
    resolveReference(filename, value, kind);
    const target = references.at(-1)?.target;
    gameDependencies.push({ source: filename, specifier: value, target, kind });
  };
  const string = node => node && (node.kind === ts.SyntaxKind.StringLiteral || node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) ? node.text : null;
  const visit = node => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
      const value = string(node.moduleSpecifier);
      assert.ok(value?.startsWith('.') || value?.startsWith('/'), `Import não local no jogo: ${filename}`);
      add(value, 'module-import');
    }
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      const value = string(node.arguments[0]);
      assert.ok(value, `Import dinâmico não literal exige inspeção: ${filename}`);
      add(value, 'dynamic-import');
    }
    if (ts.isNewExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'URL' && node.arguments?.length) {
      const value = string(node.arguments[0]);
      const base = node.arguments[1]?.getText(ast);
      if (value && base === 'import.meta.url') add(value, 'module-url');
    }
    node.forEachChild(visit);
  };
  visit(ast);
}

async function startServer() {
  const reservation = createServer();
  await new Promise((resolve, reject) => { reservation.once('error', reject); reservation.listen(0, '127.0.0.1', resolve); });
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  child = spawn(process.execPath, ['scripts/serve-beta.mjs', '--port', String(port)], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
  child.stdout.on('data', bytes => { serverLog += bytes.toString(); });
  child.stderr.on('data', bytes => { serverLog += bytes.toString(); });
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Servidor local não iniciou em cinco segundos')), 5_000);
    const poll = setInterval(() => {
      if (serverLog.includes(`http://127.0.0.1:${port}/`)) { clearTimeout(timeout); clearInterval(poll); resolve(); }
      else if (child.exitCode !== null) { clearTimeout(timeout); clearInterval(poll); reject(new Error(`Servidor local encerrou: ${scrub(serverLog)}`)); }
    }, 10);
    child.once('error', error => { clearTimeout(timeout); clearInterval(poll); reject(error); });
  });
  origin = `http://127.0.0.1:${port}`;
}

async function fetchLocal(route, options = {}) {
  assert.ok(origin, 'Servidor local indisponível');
  assert.ok(route.startsWith('/') && !route.startsWith('//'), 'Somente rotas do servidor local são permitidas');
  return fetch(origin + route, { redirect: 'manual', signal: AbortSignal.timeout(5_000), ...options });
}

function matchingHeaderRules(pathname) {
  return vercel.headers.filter(rule => rule.source.includes('(') ? new RegExp(`^${rule.source}$`).test(pathname) : rule.source === pathname);
}
function configuredHeaders(pathname) {
  return Object.fromEntries(matchingHeaderRules(pathname).flatMap(rule => rule.headers.map(header => [header.key.toLowerCase(), header.value])));
}

async function run() {
  files = await inventory(site);
  for (const filename of files) bytesByFile.set(filename, await readFile(path.join(site, filename)));
  manifest = JSON.parse(bytesByFile.get('publication-manifest.json').toString('utf8'));
  for (const file of manifest.files) if (file.category === 'immersive-landing') landingFiles.add(file.path);
  vercel = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'));
  observations.inputs = { manifest: { path: 'site/publication-manifest.json', sha256: digest(bytesByFile.get('publication-manifest.json')) }, vercelConfig: { path: 'vercel.json', sha256: digest(await readFile(path.join(root, 'vercel.json'))) } };

  await check('manifesto pronto e todos os arquivos públicos correspondem aos hashes declarados', async () => {
    assert.equal(manifest.publicationReady, true);
    assert.deepEqual(manifest.missingRequired, []);
    assert.equal(manifest.project, 'PROJETO-IPE');
    assert.equal(manifest.version, '0.12.0-beta.1');
    assert.equal(manifest.edition, 'R21-judging-pitch-and-private-metrics');
    assert.equal(manifest.files.length, manifest.fileCount);
    assert.deepEqual(manifest.files.map(file => file.path).sort(), files.filter(file => file !== 'publication-manifest.json').sort());
    for (const filename of ['presentation/pitch/index.html', 'presentation/pitch/pitch.css', 'presentation/pitch/pitch.js', 'docs/51-QA-INICIANTE-E-HANDOFF-R20.html', 'docs/52-PITCH-ALEXANDRE-BELO-R20.html', 'docs/48-HANDOFF-DOIS-DEVS-R19.html', 'docs/49-ROTEIRO-APRESENTACAO-MVP-R19.html', 'lab/data/science/bennu-records.json', 'lab/data/science/webb-spectrum-subset.json', 'docs/45-DADOS-REAIS-BENNU-WEBB-R18.html', 'docs/46-HANDOFF-DOIS-DEVS-R18.html', 'brand/missao-ipe-logo.svg', 'brand/brand-provenance-r17.json', 'docs/43-HANDOFF-GERAL-R17.html', 'docs/44-HISTORIAS-REAIS-E-LIMITES-DIDATICOS.html', 'research/nasa-mission-stories-r17.json', 'planet-jumping.html', 'research/technology-opportunities-r16.json', 'lab/index.html', 'campanha/index.html', 'campanha/research/index.html', 'campanha/apresentacao/index.html', 'campanha/apresentacao/PROJETO-IPE-Pitch.pptx', 'campanha/kit/schema.prisma', 'campanha/release.json', ...['35-REVISAO-PRS-E-DIRECAO-R16', '36-PORTAL-PLANET-JUMPING', '37-PROPOSTA-PEDAGOGICA-E-TECNOLOGIAS-R16', '38-HANDOFF-R16'].flatMap(name => [`docs/${name}.html`, `docs/${name}.md`])]) {
      assert.ok(bytesByFile.has(filename), `Entrega integrada ausente: ${filename}`);
    }
    for (const file of manifest.files) {
      assert.ok(!file.path.startsWith('/') && !file.path.split('/').includes('..'));
      const bytes = bytesByFile.get(file.path);
      assert.equal(bytes.length, file.bytes, `Tamanho diverge: ${file.path}`);
      assert.equal(digest(bytes), file.sha256, `Hash diverge: ${file.path}`);
      assert.ok(file.category && file.source && file.transformation, `Proveniência incompleta: ${file.path}`);
    }
    observations.publication = { publicationReady: true, fileCount: files.length, manifestedFiles: manifest.files.length, bytes: [...bytesByFile.values()].reduce((sum, bytes) => sum + bytes.length, 0), releaseTarget: manifest.releaseTarget };
  });

  await check('allowlist exclui estado local, fontes privadas, logs integrais e source maps', async () => {
    const blocked = files.filter(filename => /(?:^|\/)(?:\.git|\.vercel|node_modules|src|tools|repository-sources|references\/user)(?:\/|$)|(?:^|\/)\.env(?:\.|$)|\.map$|ab-r3a-analysis\.json$/.test(filename) || filename.startsWith('research/evidence/') && !safeResearchEvidence.has(filename));
    assert.deepEqual(blocked, []);
    observations.excludedClasses = manifest.excludedClasses;
    observations.allowedResearchEvidence = files.filter(filename => filename.startsWith('research/evidence/'));
  });

  await check('texto público sem assinaturas de credencial, caminhos privados ou endpoints internos válidos', async () => {
    const findings = [];
    let inspected = 0;
    for (const filename of files) {
      if (!textExtensions.has(path.extname(filename)) && !/^(?:LICENSE|NOTICE)(?:[-.].*)?$/.test(path.basename(filename))) continue;
      inspected++;
      findings.push(...privateFindings(filename, bytesByFile.get(filename).toString('utf8')));
    }
    observations.publicTextAudit = { inspectedFiles: inspected, findings, method: 'Boundary-aware credential signatures; valid IPv4 octets and private/link-local ranges; private path/host patterns. Loopback instructions and formatted non-IP numbers are not treated as secrets.', pdfLimit: 'PDF binary integrity checked. Historical R4 PDF/text were separately cleared by coordination; this scanner does not extract PDF text or certify comprehensive security.' };
    assert.deepEqual(findings, []);
  });

  await check('projeções públicas de recibos identificam a seleção sem sobrescrever os originais', async () => {
    const projections = manifest.files.filter(file => file.category === 'public-evidence-projection');
    assert.ok(projections.length >= 7);
    for (const file of projections) {
      const projected = JSON.parse(bytesByFile.get(file.path));
      assert.equal(projected.publication.edition, 'R6-public-projection');
      assert.equal(projected.publication.originalSource, file.source);
      assert.equal(projected.publication.originalSha256, digest(await readFile(path.join(root, file.source))));
      assert.match(projected.publication.note, /not the complete internal receipt/);
    }
    observations.publicProjections = projections.map(file => ({ path: file.path, originalSource: file.source, originalSha256: file.sourceSha256 }));
  });

  await check('portal conecta beta, contexto e plano e distingue pesquisa de implementação', async () => {
    const landing = parseHtml('index.html');
    assert.ok(landingFiles.has('index.html'), 'A raiz deve usar a LP exportada');
    assert.ok(manifest.routeEntrypoints.includes('/documentacao'));
    assert.equal(landing.documentElement.lang, 'pt-BR');
    assert.equal(landing.querySelector('link[rel="canonical"]')?.getAttribute('href'), `${officialOrigin}/`);
    const landingDestinations = [...landing.querySelectorAll('a[href]')].map(link => new URL(link.getAttribute('href'), officialOrigin).href);
    for (const route of ['/lab/index.html', '/documentacao']) assert.ok(landingDestinations.includes(officialOrigin + route), `Destino ausente na LP: ${route}`);
    const chunks = [...landing.querySelectorAll('script[src]')].map(script => script.getAttribute('src')).filter(src => src.startsWith('/_next/static/'));
    assert.ok(chunks.length > 0, 'A LP deve carregar seus módulos Next no próprio domínio');
    for (const chunk of chunks) assert.ok(landingFiles.has(chunk.slice(1)), `Módulo LP ausente: ${chunk}`);
    assert.equal(landing.querySelectorAll('form').length, 0);
    const document = parseHtml('documentation.html');
    const text = document.body.textContent;
    assert.equal(document.documentElement.lang, 'pt-BR');
    assert.match(document.title, /IPÊ/i);
    for (const pattern of [/beta/i, /Cerrado/i, /planejad|propost/i, /NASA/, /elegibilidade/i]) assert.match(text, pattern);
    const destinations = [...document.querySelectorAll('a[href]')].map(link => new URL(link.getAttribute('href'), 'https://beta.invalid/').pathname);
    for (const href of ['/lab/index.html', '/campanha/index.html', '/context/index.html', '/context/research-library.html', '/docs/index.html', '/presentation/pitch/index.html']) assert.ok(destinations.includes(href), `Destino principal ausente: ${href}`);
    assert.equal(document.querySelectorAll('form').length, 0, 'Portal não deve introduzir coleta de dados nesta rodada');
    assert.match(document.querySelector('.brand img')?.getAttribute('src') || '', /missao-ipe-logo-on-light\.svg$/);
    const logo = new JSDOM(bytesByFile.get('brand/missao-ipe-logo.svg').toString('utf8'), { contentType: 'image/svg+xml' }).window.document;
    assert.ok(logo.querySelectorAll('path').length > 0, 'Marca vetorial sem contornos');
    assert.equal(logo.querySelectorAll('image,foreignObject,script').length, 0, 'Marca deve ser SVG real sem bitmap ou código incorporado');
    assert.ok(destinations.includes('/docs/82-FLUXO-MOVEL-PERSISTENCIA-E-HANDOFF-R33.html'), 'Guia da dupla deve estar acessível pelo portal');
    const library = JSON.parse(bytesByFile.get('context/research-library-index.json'));
    for (const source of ['docs/25-HANDOFF-DOIS-DEVS.md', 'docs/24-OPORTUNIDADES-ESTUDOS.md', 'experiments/mission-design-lab/docs/GUIA-DIDATICO-R9.md', 'references/estudos/SMARTCITY-KIT-HISTORICO.md']) {
      assert.ok(library.documents.some(entry => entry.source === source), `Contexto ausente da biblioteca: ${source}`);
    }
    observations.portal = { language: 'pt-BR', beta: true, forms: 0, landing: '/', documentaryHub: '/documentacao', localLandingChunks: chunks.length };
  });

  await check('links locais resolvem e somente Planet Jumping permite as seis mídias externas fornecidas', async () => {
    for (const filename of files.filter(file => file.endsWith('.html'))) {
      const document = documents.get(filename)?.window.document || parseHtml(filename);
      inspectHtml(filename, document);
    }
    for (const filename of files.filter(file => file.endsWith('.css'))) inspectCss(filename, bytesByFile.get(filename).toString('utf8'));
    assert.deepEqual([...new Set(remoteReferences.map(reference => reference.url))].sort(), [...portalAssets.keys()].sort());
    for (const [url, kind] of portalAssets) {
      assert.throws(() => resolveReference('lab/index.html', url, kind), /não autorizado/);
      assert.throws(() => resolveReference('planet-jumping.html', url, 'script'), /não autorizado/);
    }
    assert.throws(() => resolveReference('planet-jumping.html', `${portalOrigin}/different-file.mp4`, 'video'), /não autorizado/);
    assert.equal(manifest.requiredRuntimeNetworkServices, 2);
    assert.equal(manifest.runtimeNetworkRequirements.measuredMissionLab.requiredServices, 1);
    assert.equal(manifest.runtimeNetworkRequirements.measuredMissionLab.endpoint, '/api/metrics');
    assert.ok(manifest.routeEntrypoints.includes('/dashboard/index.html'));
    assert.equal(manifest.runtimeNetworkRequirements.missionGames.requiredServices, 0);
    assert.equal(manifest.runtimeNetworkRequirements.experiments.length, 1);
    assert.equal(manifest.runtimeNetworkRequirements.experiments[0].route, '/planet-jumping.html');
    assert.equal(manifest.runtimeNetworkRequirements.experiments[0].mediaOrigin, portalOrigin);
    assert.equal(manifest.runtimeNetworkRequirements.experiments[0].mediaFiles, 6);
    assert.ok(manifest.routeEntrypoints.includes('/planet-jumping.html'));
    assert.ok(manifest.routeEntrypoints.includes('/presentation/pitch/index.html'));
    assert.equal(manifest.runtimeNetworkRequirements.presentations.requiredServices, 0);
    observations.localReferences = { count: references.length, uniqueTargets: new Set(references.map(reference => reference.target)).size, entries: references };
    observations.externalRuntimeMedia = { requests: remoteReferences, uniqueUrls: 6, scope: 'Only the standalone Planet Jumping experiment; mission games retain local runtime assets.', externalFetchPerformed: false };
  });

  await check('acervo visual publica imagens locais com crédito, dimensões e integridade', async () => {
    const media = JSON.parse(bytesByFile.get('media/manifest.json'));
    assert.ok(media.images.length >= 4, 'Acervo visual incompleto');
    for (const image of media.images) {
      assert.match(image.file, /^[a-z0-9-]+\.(?:jpg|jpeg|png|webp)$/i);
      const bytes = bytesByFile.get(`media/${image.file}`);
      assert.ok(bytes, `Imagem ausente: ${image.file}`);
      assert.equal(digest(bytes), image.sha256, `Imagem alterada sem atualizar procedência: ${image.file}`);
      assert.ok(image.alt && image.caption && image.credit && image.sourceUrl);
      assert.ok(Number.isInteger(image.width) && image.width > 0 && Number.isInteger(image.height) && image.height > 0);
    }
    assert.doesNotMatch(bytesByFile.get('mission-visuals.js').toString('utf8'), /__IPE_NASA_MEDIA__/);
    observations.visualCollection = { images: media.images.length, local: true, integrity: true };
  });

  await check('imports compilados, chunks dinâmicos e Workers resolvem dentro de game/, lab/ e campanha/', async () => {
    const runtimeRoots = ['game', 'lab', 'campanha'];
    const modules = files.filter(filename => /^(?:game|lab|campanha)\/assets\/[^/]+\.js$/.test(filename));
    assert.ok(modules.length >= 3);
    for (const runtime of runtimeRoots) assert.ok(modules.some(filename => filename.startsWith(`${runtime}/assets/`)), `JavaScript compilado ausente: ${runtime}`);
    const api = new API({ cwd: root });
    const snapshot = api.updateSnapshot({ openFiles: modules.map(filename => path.join(site, filename)) });
    try {
      for (const filename of modules) {
        const absolute = path.join(site, filename);
        const program = snapshot.getDefaultProjectForFile(absolute)?.program;
        const ast = program?.getSourceFile(absolute);
        assert.ok(ast, `AST compilada indisponível: ${filename}`);
        assert.equal(program.getSyntacticDiagnostics(absolute).length, 0, `JavaScript compilado não pôde ser lido: ${filename}`);
        inspectGameModule(filename, ast);
      }
    } finally { snapshot.dispose(); api.close(); }
    const worker = gameDependencies.find(dependency => /mission\.worker-[^/]+\.js$/.test(dependency.target || ''));
    assert.ok(worker, 'Worker compilado não foi identificado no grafo de new URL/import');
    for (const runtime of runtimeRoots) assert.ok(gameDependencies.some(dependency => dependency.source.startsWith(`${runtime}/`) && new RegExp(`^${runtime}/assets/mission\\.worker-[^/]+\\.js$`).test(dependency.target || '')), `Worker compilado ausente: ${runtime}`);
    for (const dependency of gameDependencies) {
      assert.ok(runtimeRoots.includes(dependency.source.split('/')[0]));
      assert.equal(dependency.target?.split('/')[0], dependency.source.split('/')[0], `Dependência cruza aplicações: ${dependency.source} → ${dependency.target}`);
    }
    observations.gameModuleGraph = { modules: modules.length, worker: worker.target, dependencies: gameDependencies };
  });

  await check('runtime, apresentação e dados preservam os artefatos já verificados', async () => {
    const preserved = [];
    const relocated = new Set();
    for (const file of manifest.files.filter(file => ['game-runtime', 'mission-lab-runtime', 'four-level-campaign-runtime', 'portable-game', 'presentation-runtime', 'interactive-pitch-runtime', 'scientific-source', 'replay-example', 'historical-base-R4-reviewed', 'immersive-landing', 'public-portal'].includes(file.category))) {
      const original = await readFile(path.join(root, file.source));
      let actual = bytesByFile.get(file.path);
      let expected = original;
      if (file.libras) expected = decorateLibrasPage(expected.toString('utf8'), file.path);
      if (file.analytics) expected = decorateAnalyticsPage(expected.toString('utf8'), file.path);
      if (file.category === 'immersive-landing' && file.path.endsWith('.html')) {
        const restored = actual.toString('utf8').replace(/<script\b([^>]*) src="\/(_next\/ipe-inline-([a-f0-9]{24})\.js)"><\/script>/g, (_, attributes, filename, hash) => {
          assert.doesNotMatch(attributes, /\b(?:async|defer)\b|\btype\s*=\s*["'](?:importmap|application\/(?:ld\+)?json|text\/plain)["']/i);
          const script = bytesByFile.get(filename);
          assert.ok(script, `Script local da LP ausente: ${filename}`);
          assert.equal(digest(script).slice(0, 24), hash);
          relocated.add(filename);
          return `<script${attributes}>${script.toString('utf8')}</script>`;
        });
        actual = Buffer.from(restored);
      }
      assert.equal(digest(actual), digest(expected), `Cópia alterou artefato ou ordem dos scripts fora da composição declarada: ${file.path}`);
      preserved.push({ path: file.path, source: file.source, sha256: digest(original), ...(file.libras && { libras: file.libras }), ...(file.analytics && { analytics: file.analytics }) });
    }
    assert.ok(relocated.size > 0, 'O bootstrap do export da LP deve estar em arquivos locais');
    assert.deepEqual([...relocated].sort(), manifest.files.filter(file => file.category === 'landing-script').map(file => file.path).sort());
    observations.landingScripts = { localFiles: relocated.size, byteExactInOriginalOrder: true };
    for (const runtime of ['lab', 'campanha']) assert.ok(preserved.some(file => file.path === `${runtime}/index.html`), `Runtime não incluído na conferência de preservação: ${runtime}`);
    const presentationReceipt = JSON.parse(await readFile(path.join(root, 'evidence/presentation-qa.json'), 'utf8'));
    assert.equal(digest(await readFile(path.join(root, 'presentation/Missao_Ipe_Apresentacao.html'))), presentationReceipt.observations.artifact.sha256);
    for (const name of expectedData) {
      assert.ok(bytesByFile.has(`game/data/${name}`));
      assert.ok(bytesByFile.has(`public/data/${name}`));
      assert.equal(digest(bytesByFile.get(`game/data/${name}`)), digest(bytesByFile.get(`public/data/${name}`)));
      assert.ok(bytesByFile.has(`campanha/data/${name}`));
      assert.equal(digest(bytesByFile.get(`campanha/data/${name}`)), digest(bytesByFile.get(`public/data/${name}`)), `Dado científico divergente na campanha: ${name}`);
    }
    observations.preservedArtifacts = preserved;
    observations.scientificFilesPerLocation = expectedData.length;
  });

  await check('Libras está disponível nas páginas e o guia isola cadastro e painel', async () => {
    const coverage = { public: 0, lab: 0, dashboard: 0 };
    for (const [filename, dom] of documents) {
      const scope = librasScope(filename);
      if (!scope) continue;
      const document = dom.window.document;
      const link = document.querySelector('a[data-ipe-libras]');
      assert.ok(link, `Acesso em Libras ausente: ${filename}`);
      assert.equal(link.dataset.ipeLibras, scope);
      assert.equal(new URL(link.href).pathname, `/${librasGuide}`);
      assert.ok(document.querySelector('script[src$="/acessibilidade/libras.js"],script[src^="acessibilidade/libras.js"]'), filename);
      if (landingFiles.has(filename)) {
        assert.equal(document.querySelectorAll('a[data-ipe-libras]').length, 1, `Link Libras duplicado na LP: ${filename}`);
        assert.equal(document.querySelectorAll('script[src$="/acessibilidade/libras.js"]').length, 1, `Script Libras duplicado na LP: ${filename}`);
      }
      assert.equal(document.querySelector('script[src*="vlibras.gov.br"]'), null, filename);
      coverage[scope]++;
    }
    assert.equal(coverage.lab, 1);
    assert.equal(coverage.dashboard, 1);
    assert.equal(coverage.public + 3, files.filter(file => file.endsWith('.html')).length);
    assert.equal(manifest.runtimeNetworkRequirements.libras.requiredServices, 0);
    const guide = documents.get(librasGuide).window.document;
    assert.match(guide.querySelector('meta[http-equiv="Content-Security-Policy"]').getAttribute('content'), /frame-src https:\/\/vlibras\.gov\.br\/app\/unity\//);
    observations.libras = coverage;
  });

  await check('mapa e planos existem como artefatos reais com fontes relativas e estado declarado', async () => {
    for (const file of ['architecture/index.html', 'architecture/model.json', 'architecture/map.mmd', 'docs/13-ARQUITETURA-ARCHIFY.md', 'docs/14-BETA-DEPLOY.md', 'docs/15-PLANO-RELEASE.md', 'docs/16-OPORTUNIDADES-BETA.md']) assert.ok(bytesByFile.has(file), `Entrega obrigatória ausente: ${file}`);
    const model = JSON.parse(bytesByFile.get('architecture/model.json'));
    assert.ok(Object.keys(model).length > 0);
    assert.ok(bytesByFile.get('architecture/map.mmd').length > 100);
    const architectureText = (documents.get('architecture/index.html')?.window.document || parseHtml('architecture/index.html')).body.textContent;
    assert.match(architectureText, /Archify/i);
    assert.match(architectureText, /(?:propost|oportunidad|planejad|pendente)/i);
    const releasePlan = bytesByFile.get('docs/15-PLANO-RELEASE.md').toString('utf8');
    assert.match(releasePlan, /08h00|08h BRT/);
    assert.match(releasePlan, /rollback/i);
    assert.match(releasePlan, /não agenda trabalho futuro/i);
    assert.match(releasePlan, /Elegibilidade temporal/);
    observations.architecture = { modelTopLevelKeys: Object.keys(model), modelSha256: digest(bytesByFile.get('architecture/model.json')), mapSha256: digest(bytesByFile.get('architecture/map.mmd')) };
  });

  await check('configuração Vercel restringe publicação a site/ e permite scripts inline por hashes explícitos', async () => {
    assert.equal(vercel.outputDirectory, 'site');
    assert.equal(vercel.buildCommand, 'npm run build:release');
    for (const command of [
      'npm --prefix experiments/mission-design-lab ci --ignore-scripts --no-audit --no-fund',
      'npm --prefix experiments/four-level-campaign ci --ignore-scripts --no-audit --no-fund',
      'npx --yes pnpm@11.25.0 --dir apps/immersive-lp install --frozen-lockfile',
    ]) assert.ok(vercel.installCommand.includes(command), `Instalação ausente: ${command}`);
    const workspacePackage = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
    assert.ok(workspacePackage.scripts['build:release'].includes('npx --yes pnpm@11.25.0 --dir apps/immersive-lp build'));
    assert.equal(vercel.cleanUrls, false);
    assert.equal(vercel.trailingSlash, false);
    const common = Object.fromEntries(vercel.headers.find(rule => rule.source === '/(.*)').headers.map(header => [header.key.toLowerCase(), header.value]));
    assert.equal(common['x-content-type-options'], 'nosniff');
    assert.equal(configuredHeaders('/lab/index.html')['x-frame-options'], 'DENY');
    const guideHeaders = configuredHeaders(`/${librasGuide}`);
    assert.equal(guideHeaders['x-frame-options'], 'SAMEORIGIN');
    assert.equal(guideHeaders['content-security-policy'], "frame-ancestors 'self'; sandbox allow-scripts");
    assert.ok(common['referrer-policy']);
    assert.equal(common['content-security-policy'], undefined, 'CSP deve usar matchers exclusivos por rota');
    const csp = configuredHeaders('/lab/index.html')['content-security-policy'];
    assert.ok(csp);
    const scriptDirective = csp.split(';').find(part => part.trim().startsWith('script-src '));
    const connectDirective = csp.split(';').find(part => part.trim().startsWith('connect-src '));
    const remoteSources = value => value?.match(/https?:[^;\s]*/g) ?? [];
    const analyticsScriptOrigin = 'https://static.cloudflareinsights.com';
    const analyticsConnectOrigin = 'https://cloudflareinsights.com';
    assert.ok(scriptDirective?.includes("'self'"));
    assert.doesNotMatch(scriptDirective, /'unsafe-inline'|'unsafe-eval'/);
    assert.deepEqual(remoteSources(scriptDirective), [analyticsScriptOrigin]);
    assert.deepEqual(remoteSources(connectDirective), [analyticsConnectOrigin]);
    assert.ok(scriptDirective.includes("'wasm-unsafe-eval'"), 'Draco local requer compilação WebAssembly; eval JavaScript continua bloqueado');
    assert.match(csp, /script-src-attr\s+'none'/);
    assert.match(csp, /worker-src\s+'self'/);
    assert.match(csp, /object-src\s+'none'/);
    assert.deepEqual(remoteSources(csp), [analyticsScriptOrigin, analyticsConnectOrigin]);
    const portalCsp = configuredHeaders('/planet-jumping.html')['content-security-policy'];
    const directives = new Map(portalCsp.split(';').map(part => { const [name, ...values] = part.trim().split(/\s+/); return [name, values]; }));
    assert.deepEqual(directives.get('img-src'), ["'self'", 'data:', 'blob:', portalOrigin]);
    assert.deepEqual(directives.get('media-src'), ["'self'", 'blob:', portalOrigin]);
    assert.deepEqual(remoteSources(directives.get('script-src').join(' ')), [analyticsScriptOrigin]);
    assert.deepEqual(directives.get('connect-src'), ["'self'", 'blob:', analyticsConnectOrigin]);
    for (const [name, values] of directives) if (!['img-src', 'media-src', 'script-src', 'connect-src'].includes(name)) assert.deepEqual(remoteSources(values.join(' ')), [], `Origem remota indevida no portal: ${name}`);
    const privatePaths = ['/equipe', '/equipe/index.html', '/dashboard', '/dashboard/index.html', '/acessibilidade/libras.js', '/api', '/api/metrics', `/${librasGuide}`];
    for (const pathname of ['/', '/lab/index.html', '/game/index.html', '/campanha/index.html', '/planet-jumping.html', '/planet-jumpingXhtml', '/planet-jumping.html/extra', '/other/planet-jumping.html', ...privatePaths]) {
      const policies = matchingHeaderRules(pathname).flatMap(rule => rule.headers).filter(header => header.key.toLowerCase() === 'content-security-policy');
      assert.equal(policies.length, 1, `Mais de uma CSP ou ausência de política: ${pathname}`);
      assert.equal(policies[0].value.includes(portalOrigin), pathname === '/planet-jumping.html', `Exceção externa indevida: ${pathname}`);
      if (privatePaths.includes(pathname)) assert.deepEqual(remoteSources(policies[0].value), [], `Origem remota em rota privada: ${pathname}`);
      assert.equal(configuredHeaders(pathname)['x-frame-options'], pathname === `/${librasGuide}` ? 'SAMEORIGIN' : 'DENY');
    }
    let checkedScripts = 0;
    for (const [filename, dom] of documents) {
      const document = dom.window.document;
      const documentScriptDirective = configuredHeaders(`/${filename}`)['content-security-policy'].split(';').find(part => part.trim().startsWith('script-src '));
      for (const element of document.querySelectorAll('*')) for (const attr of element.attributes) assert.ok(!/^on[a-z]+$/i.test(attr.name), `Handler HTML inline bloqueado pela CSP em ${filename}`);
      for (const script of document.querySelectorAll('script:not([src])')) {
        if (/^(?:application\/(?:ld\+)?json|text\/plain)$/i.test(script.type) || !script.textContent.trim()) continue;
        assert.ok(!landingFiles.has(filename), `Script executável inline na LP: ${filename}`);
        const hash = createHash('sha256').update(script.textContent).digest('base64');
        assert.ok(documentScriptDirective.includes(`'sha256-${hash}'`), `Hash inline ausente da CSP: ${filename}`);
        if (filename === 'planet-jumping.html') assert.ok(!scriptDirective.includes(`'sha256-${hash}'`), 'Script do experimento não deve ampliar os hashes autorizados nos jogos');
        checkedScripts++;
      }
    }
    observations.configuredHeaders = { common, defaultCsp: csp, planetJumpingCsp: portalCsp, checkedInlineScripts: checkedScripts, assetCacheRule: vercel.headers.find(rule => rule.source === '/game/assets/(.*)'), limitation: 'Static configuration and local server. Does not prove Vercel applied these headers or a browser enforced CSP.' };
  });

  await check('modelos NASA e decodificador local preservam bytes, créditos e referências', async () => {
    const base = 'lab/models/nasa/';
    const assets = JSON.parse(bytesByFile.get(`${base}manifest.json`).toString());
    assert.equal(assets.models.length, 4);
    let total = 0;
    for (const asset of [...assets.models, ...assets.decoder.files]) {
      const bytes = bytesByFile.get(base + asset.file);
      assert.ok(bytes, `Ativo local ausente: ${asset.file}`);
      assert.equal(bytes.length, asset.bytes);
      assert.equal(digest(bytes), asset.sha256);
      if (asset.file.endsWith('.glb')) {
        assert.equal(bytes.toString('ascii', 0, 4), 'glTF');
        assert.equal(bytes.readUInt32LE(4), 2);
        assert.equal(bytes.readUInt32LE(8), bytes.length);
        assert.match(asset.sourceUrl, /^https:\/\/science\.nasa\.gov\//);
        assert.ok(asset.credit);
        const jsonLength = bytes.readUInt32LE(12);
        const gltf = JSON.parse(bytes.toString('utf8', 20, 20 + jsonLength));
        assert.ok([...(gltf.buffers || []), ...(gltf.images || [])].every(item => !item.uri), 'GLB deve ser autocontido');
        total += bytes.length;
      }
    }
    assert.equal(total, assets.totalModelBytes);
    observations.nasaAssets = { models: 4, modelBytes: total, decoderFiles: assets.decoder.files.length, browserRendered: false };
  });

  await check('iluminação CC0 do hangar é local e preserva origem e integridade', async () => {
    const base = 'lab/environments/polyhaven/';
    const manifest = JSON.parse(bytesByFile.get(`${base}manifest.json`).toString());
    const bytes = bytesByFile.get(`${base}studio-small-01-1k.hdr`);
    assert.ok(bytes, 'HDRI ausente da distribuição');
    assert.equal(bytes.length, manifest.bytes);
    assert.equal(digest(bytes), manifest.sha256);
    assert.match(bytes.toString('ascii', 0, 256), /-Y 512 \+X 1024/);
    assert.equal(manifest.license, 'CC0-1.0');
    assert.equal(manifest.author, 'Greg Zaal');
    assert.equal(manifest.sourcePage, 'https://polyhaven.com/a/studio_small_01');
    observations.hangarEnvironment = { bytes: bytes.length, sha256: manifest.sha256, resolution: manifest.resolution, license: manifest.license, rendered: false };
  });

  await check('plataforma Kenney CC0 é local, íntegra e não exige arquivos externos', async () => {
    const base = 'lab/models/kenney/';
    const manifest = JSON.parse(bytesByFile.get(`${base}manifest.json`).toString());
    const bytes = bytesByFile.get(`${base}structure-platform.glb`);
    assert.ok(bytes, 'Plataforma ausente da distribuição');
    assert.equal(bytes.length, 17200);
    assert.equal(bytes.length, manifest.bytes);
    assert.equal(digest(bytes), manifest.sha256);
    assert.equal(bytes.toString('ascii', 0, 4), 'glTF');
    assert.equal(bytes.readUInt32LE(4), 2);
    assert.equal(bytes.readUInt32LE(8), bytes.length);
    const gltf = JSON.parse(bytes.toString('utf8', 20, 20 + bytes.readUInt32LE(12)).trim());
    assert.ok((gltf.buffers ?? []).every(item => !item.uri));
    assert.ok((gltf.images ?? []).every(item => !item.uri && item.bufferView !== undefined));
    assert.equal(manifest.author, 'Kenney');
    assert.equal(manifest.license, 'CC0-1.0');
    assert.equal(manifest.triangles, 96);
    observations.hangarPlatform = { bytes: bytes.length, sha256: manifest.sha256, triangles: 96, license: manifest.license, rendered: false };
  });

  await check('servidor de release inicia apenas em loopback para os testes HTTP', async () => {
    await startServer();
    for (const [route, file] of [['/', 'index.html'], ['/documentacao', 'documentation.html'], ['/creditos', 'creditos/index.html']]) {
      const response = await fetchLocal(route);
      assert.equal(response.status, 200, route);
      assert.equal(response.headers.get('location'), null, route);
      assert.equal(digest(Buffer.from(await response.arrayBuffer())), digest(bytesByFile.get(file)), route);
    }
    observations.http = { server: 'scripts/serve-beta.mjs', originClass: '127.0.0.1 loopback; temporary port', realBrowser: false, publicDeploymentTested: false };
  });

  await check('HTTP entrega todos os arquivos publicados com bytes e MIME esperados', async () => {
    const verified = [];
    for (const filename of files) {
      const requestPath = '/' + filename.split('/').map(encodeURIComponent).join('/');
      const response = await fetchLocal(requestPath);
      assert.equal(response.status, 200, `HTTP não entregou ${filename}`);
      const body = Buffer.from(await response.arrayBuffer());
      assert.equal(digest(body), digest(bytesByFile.get(filename)), `Bytes HTTP divergentes: ${filename}`);
      const expectedMime = mimeByExtension[path.extname(filename)] || 'application/octet-stream';
      assert.ok((response.headers.get('content-type') || '').startsWith(expectedMime), `MIME divergente: ${filename}`);
      assert.equal(Number(response.headers.get('content-length')), body.length);
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
      verified.push({ path: filename, status: response.status, bytes: body.length, sha256: digest(body), contentType: response.headers.get('content-type') });
    }
    observations.httpFiles = verified;
  });

  await check('rotas dos links, atalhos, HEAD e cabeçalhos correspondem ao servidor configurado', async () => {
    const paths = [...new Set(references.map(reference => reference.requestPath))];
    for (const requestPath of paths) {
      const response = await fetchLocal(requestPath, { method: 'HEAD' });
      const url = new URL(requestPath, origin);
      const alias = vercel.rewrites?.find(rule => vercel.trailingSlash === false && `${rule.source}/` === url.pathname);
      assert.equal(response.status, alias ? 308 : 200, `HEAD de link falhou: ${requestPath}`);
      if (alias) {
        const destination = alias.source + url.search;
        assert.equal(response.headers.get('location'), destination);
        const canonical = await fetchLocal(destination, { method: 'HEAD' });
        assert.equal(canonical.status, 200, destination);
        assert.equal((await canonical.arrayBuffer()).byteLength, 0);
      }
      assert.equal((await response.arrayBuffer()).byteLength, 0);
    }
    // Inspect configured headers independently, even if an earlier CSP assertion failed.
    const commonRule = vercel.headers.find(rule => rule.source === '/(.*)');
    assert.ok(commonRule, 'Cabeçalhos comuns não configurados');
    for (const route of ['/', '/documentacao', '/creditos', '/planet-jumping.html', '/game/index.html', '/lab/index.html', '/campanha/index.html', '/campanha/research/index.html', '/campanha/apresentacao/index.html', `/${librasGuide}`]) {
      const response = await fetchLocal(route, { method: 'HEAD' });
      assert.equal(response.status, 200, `HEAD da aplicação falhou: ${route}`);
      assert.equal((await response.arrayBuffer()).byteLength, 0);
      for (const [name, value] of Object.entries(configuredHeaders(route))) {
        if (name === 'cache-control') continue; // The local server deliberately uses no-store; production cache is a separate route policy.
        assert.equal(response.headers.get(name), value, `Cabeçalho local divergente: ${route} · ${name}`);
      }
    }
    const presentationUrl = 'https://missao-ipe-central-ab.alexandrebelo.chatgpt.site/';
    for (const source of ['/pitch', '/apresentacao']) assert.ok(vercel.redirects.some(redirect => redirect.source === source && !redirect.has && redirect.destination === presentationUrl && redirect.permanent === false));
    assert.equal(vercel.redirects.some(redirect => redirect.source === '/' && !redirect.has), false);
    assert.deepEqual(vercel.rewrites?.find(rule => rule.source === '/documentacao'), { source: '/documentacao', destination: '/documentation.html' });
    assert.deepEqual(vercel.rewrites?.find(rule => rule.source === '/creditos'), { source: '/creditos', destination: '/creditos/index.html' });
    const documentaryAlias = await fetchLocal('/documentacao/?origem=qa');
    assert.equal(documentaryAlias.status, 308);
    assert.equal(documentaryAlias.headers.get('location'), '/documentacao?origem=qa');
    for (const [area, destination] of Object.entries({ jogo: 'https://nasa-missaoipe.alexandrebelo.com/lab/index.html', pitch: presentationUrl, painel: 'https://nasa-missaoipe.alexandrebelo.com/dashboard/index.html', docs: 'https://nasa-missaoipe.alexandrebelo.com/docs/index.html' })) {
      assert.ok(vercel.redirects.some(redirect => redirect.source === '/' && redirect.has?.some(condition => condition.type === 'host' && condition.value === `${area}.nasa-missaoipe.alexandrebelo.com`) && redirect.destination === destination), `Destino do subdomínio divergente: ${area}`);
    }
    assert.ok(vercel.redirects.some(redirect => redirect.source === '/planet-jumping' && redirect.destination === '/planet-jumping.html' && redirect.permanent === false));
    for (const source of ['/campanha', '/campanha/research', '/campanha/apresentacao']) assert.ok(vercel.redirects.some(redirect => redirect.source === source && redirect.destination === `${source}/index.html` && redirect.permanent === false), `Redirecionamento explícito da campanha ausente: ${source}`);
    const redirects = [];
    for (const redirect of vercel.redirects.filter(r => !r.has)) {
      const result = await fetchLocal(redirect.source);
      assert.equal(result.status, 307);
      assert.equal(result.headers.get('location'), redirect.destination);
      const head = await fetchLocal(redirect.source, { method: 'HEAD' });
      assert.equal(head.status, 307);
      assert.equal(head.headers.get('location'), redirect.destination);
      assert.equal((await head.arrayBuffer()).byteLength, 0);
      if (redirect.destination.startsWith('/')) {
        const destination = await fetchLocal(redirect.destination, { method: 'HEAD' });
        assert.equal(destination.status, 200);
        assert.equal((await destination.arrayBuffer()).byteLength, 0);
      } else assert.equal(redirect.destination, presentationUrl, 'Destino externo não previsto.');
      redirects.push({ source: redirect.source, destination: redirect.destination, status: result.status });
    }
    for (const redirect of vercel.redirects.filter(r => r.has)) {
      const host = redirect.has.find(condition => condition.type === 'host').value;
      const source = redirect.source === '/:path*' ? '/lab/index.html' : redirect.source;
      // Node fetch replaces Host; use native HTTP to exercise the actual host rule.
      const response = await new Promise((resolve, reject) => {
        const request = httpGet(origin + source, { headers: { Host: host } }, res => { res.resume(); resolve(res); });
        request.setTimeout(5000, () => request.destroy(new Error('Host redirect timed out')));
        request.on('error', reject);
      });
      assert.equal(response.statusCode, 307, `${host}${source}`);
      assert.equal(response.headers.location, redirect.destination.replace('/:path*', source));
    }
    observations.httpRoutes = { linkedRoutesChecked: paths.length, redirects, cacheLimit: 'Local server uses no-store. Production asset-cache rule is inspected, not exercised here.' };
  });

  await check('ausências e métodos não viram páginas de sucesso por fallback', async () => {
    for (const route of ['/missing-beta-artifact.js', '/game/data/missing.json', '/.env', '/.git/config', '/src/core/engine.ts']) {
      const response = await fetchLocal(route);
      assert.ok(response.status === 400 || response.status === 404, `Rota não pública respondeu sucesso: ${route}`);
    }
    const post = await fetchLocal('/', { method: 'POST' });
    assert.equal(post.status, 405);
    assert.equal(post.headers.get('allow'), 'GET, HEAD');
    observations.httpNegativeCases = 6;
  });

  await check('snapshot público não mudou durante a checagem e núcleo mantém hashes históricos', async () => {
    assert.deepEqual(await inventory(site), files);
    for (const filename of files) assert.equal(digest(await readFile(path.join(site, filename))), digest(bytesByFile.get(filename)), `Arquivo mudou durante QA: ${filename}`);
    const baseline = JSON.parse(await readFile(path.join(root, 'evidence/final-validation.json'), 'utf8'));
    const selected = baseline.sourceHashes.filter(item => item.path.startsWith('src/core/') || item.path === 'src/data/science-data.ts');
    for (const source of selected) assert.equal(digest(await readFile(path.join(root, source.path))), source.sha256, `Núcleo alterado: ${source.path}`);
    observations.preservedCoreHashes = selected;
  });
}

try { await run(); }
catch (error) { checks.push({ name: 'preparação da checagem', status: 'failed', error: scrub(error.message) }); process.stderr.write(`FAIL preparação: ${scrub(error.message)}\n`); }
finally {
  for (const dom of documents.values()) dom.window.close();
  if (child && child.exitCode === null) {
    const stopped = new Promise(resolve => child.once('exit', resolve));
    child.kill('SIGTERM');
    await Promise.race([stopped, new Promise(resolve => setTimeout(resolve, 4_000))]);
    if (child.exitCode === null) child.kill('SIGKILL');
  }
  const failed = checks.filter(check => check.status === 'failed').length;
  const harness = await readFile(fileURLToPath(import.meta.url));
  const receipt = {
    startedAt, finishedAt: new Date().toISOString(), command: 'node scripts/test-beta-site.mjs', node: process.version,
    status: failed ? 'failed' : 'passed-with-explicit-limits', checksPassed: checks.length - failed, checksFailed: failed,
    environment: 'Static document/AST inspection and real HTTP against the local release server. No browser, screenshot, GPU, Worker execution or external request.',
    harness: { path: 'scripts/test-beta-site.mjs', bytes: harness.length, sha256: digest(harness) },
    limitations: ['No real-browser layout, focus, accessibility-tree, CSP enforcement, FPS or cold-offline qualification', 'Worker and module files are delivered and resolved; this check does not execute a real browser Worker', 'Private-data pattern scan is scoped and may not detect every secret; historical PDF privacy review belongs to coordination', 'Local HTTP does not prove public Vercel routing, headers, cache or access policy', 'No old Node/DOM/HTTP suite was rerun; preserved hashes support reuse of historical evidence', 'No deployment, issue, future scheduled work or competitive eligibility decision is performed by this script'],
    observations, checks,
  };
  await mkdir(path.join(root, 'evidence'), { recursive: true });
  await writeFile(path.join(root, 'evidence/beta-site-qa.json'), JSON.stringify(receipt, null, 2) + '\n');
  process.stdout.write(`${receipt.checksPassed}/${checks.length} verificações aprovadas; ${failed} falhas.\n`);
  process.exitCode = failed ? 1 : 0;
}
