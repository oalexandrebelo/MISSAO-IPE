import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
const [deploymentId, sourceCommit, output = 'evidence/production-r21.json'] = process.argv.slice(2);
if (!deploymentId?.startsWith('dpl_') || !/^[a-f0-9]{40}$/.test(sourceCommit ?? '')) throw new Error('Informe deployment ID e commit completos, conferidos na Vercel.');
const base = 'https://projeto-ipe.vercel.app';
const get = path => fetch(`${base}/${path}`, { redirect: 'error', signal: AbortSignal.timeout(30000) });
const response = await get('publication-manifest.json');
if (response.status !== 200) throw new Error(`Manifesto HTTP ${response.status}`);
const manifest = await response.json();
if (manifest.project !== 'PROJETO-IPE' || manifest.version !== '0.12.0-beta.1' || manifest.edition !== 'R21-judging-pitch-and-private-metrics') throw new Error('A versão pública não é a R21 esperada.');
for (const path of ['acessibilidade/guia.html', 'acessibilidade/libras.js', 'docs/56-ACESSIBILIDADE-E-LIBRAS-R21.html', 'docs/57-KIT-PRE-BANCA-R21.html', 'equipe/index.html', 'dashboard/index.html', 'dashboard/dashboard.js', 'dashboard/metrics.mjs', 'docs/53-PITCH-JURADOS-E-FALA-R21.html', 'docs/54-METRICAS-E-HANDOFF-R21.html', 'docs/55-PAINEL-E-ACESSOS-R21.html', 'presentation/pitch/index.html', 'presentation/pitch/pitch.css', 'presentation/pitch/pitch.js', 'docs/51-QA-INICIANTE-E-HANDOFF-R20.html', 'docs/52-PITCH-ALEXANDRE-BELO-R20.html', 'docs/48-HANDOFF-DOIS-DEVS-R19.html', 'docs/49-ROTEIRO-APRESENTACAO-MVP-R19.html', 'docs/47-OPORTUNIDADES-NASA-PARA-DOIS-DEVS-R18.html', 'research/nasa-opportunities-r18.json', 'docs/45-DADOS-REAIS-BENNU-WEBB-R18.html', 'docs/46-HANDOFF-DOIS-DEVS-R18.html', 'lab/data/science/bennu-records.json', 'lab/data/science/bennu-table1.csv', 'lab/data/science/webb-spectrum-subset.json', 'lab/data/science/webb-firefly-nasa.tbl', 'brand/missao-ipe-logo.svg', 'docs/43-HANDOFF-GERAL-R17.html', 'docs/44-HISTORIAS-REAIS-E-LIMITES-DIDATICOS.html', 'research/nasa-mission-stories-r17.json', 'lab/index.html', 'campanha/index.html', 'planet-jumping.html', 'docs/35-REVISAO-PRS-E-DIRECAO-R16.html', 'docs/36-PORTAL-PLANET-JUMPING.html', 'docs/37-PROPOSTA-PEDAGOGICA-E-TECNOLOGIAS-R16.html', 'docs/38-HANDOFF-R16.html', 'docs/39-ATIVOS-DA-PR-E-APLICACOES.html', 'research/technology-opportunities-r16.json', 'research/pr-assets-r16.json']) if (!manifest.files.some(file => file.path === path)) throw new Error(`Artefato obrigatório ausente: ${path}`);
const libraryResponse = await get('context/research-library-index.json');
const library = await libraryResponse.json();
if (libraryResponse.status !== 200 || library.documentCount < 119) throw new Error('Biblioteca incompleta.');
const pitchRedirect = await fetch(`${base}/pitch`, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
const pitchLocation = pitchRedirect.headers.get('location');
if (pitchRedirect.status !== 307 || !pitchLocation || new URL(pitchLocation, base).pathname !== '/presentation/pitch/index.html') throw new Error('A rota /pitch não aponta para a apresentação canônica.');
const results = [], pending = [...manifest.files];
await Promise.all(Array.from({ length: 6 }, async () => {
  while (pending.length) {
    const file = pending.shift();
    if (file.path.startsWith('/') || file.path.includes('..')) throw new Error('Caminho inválido no manifesto.');
    const r = await get(file.path);
    const bytes = Buffer.from(await r.arrayBuffer());
    const hash = createHash('sha256').update(bytes).digest('hex');
    const csp = r.headers.get('content-security-policy') ?? '';
    let policyAndMimePass = true;
    if (file.path.endsWith('.glb') && !r.headers.get('content-type')?.includes('model/gltf-binary')) policyAndMimePass = false;
    if (file.path.endsWith('.wasm') && !r.headers.get('content-type')?.includes('application/wasm')) policyAndMimePass = false;
    if (file.path.endsWith('.html')) {
      const isGuide = file.path === 'acessibilidade/guia.html';
      if (isGuide) {
        if (!csp.includes("frame-ancestors 'self'") || !csp.includes('sandbox allow-scripts') || r.headers.get('x-frame-options') !== 'SAMEORIGIN' || !bytes.toString().includes('https://vlibras.gov.br/app/')) policyAndMimePass = false;
      } else if ((csp.match(/default-src/g) ?? []).length !== 1 || !bytes.toString().includes('data-ipe-libras')) policyAndMimePass = false;
      const isPortal = file.path === 'planet-jumping.html';
      if (isPortal !== csp.includes('https://d2ol7oe51mr4n9.cloudfront.net')) policyAndMimePass = false;
      if (!isPortal && !isGuide && (!csp.includes("'wasm-unsafe-eval'") || !csp.includes("connect-src 'self' blob:"))) policyAndMimePass = false;
      if (isPortal && (!csp.includes("media-src 'self' blob: https://d2ol7oe51mr4n9.cloudfront.net") || !csp.includes("connect-src 'self' blob:"))) policyAndMimePass = false;
      for (const match of bytes.toString().matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
        if (/\bsrc\s*=/.test(match[1]) || /type=["'](?:application\/(?:ld\+)?json|text\/plain)["']/.test(match[1]) || !match[2].trim()) continue;
        if (!csp.includes(`'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`)) policyAndMimePass = false;
      }
    }
    results.push({ path: file.path, status: r.status, bytes: bytes.length, sha256: hash, hashMatches: hash === file.sha256, policyAndMimePass, contentType: r.headers.get('content-type') });
  }
}));
results.sort((a,b) => a.path.localeCompare(b.path));
const failures = results.filter(r => r.status !== 200 || !r.hashMatches || !r.policyAndMimePass);
const receipt = { verifiedAt: new Date().toISOString(), base, access: 'Public; no cookies or authorization headers', deploymentId, sourceCommit, version: manifest.version, edition: manifest.edition, status: failures.length ? 'failed' : 'passed', filesChecked: results.length, documents: library.documentCount, pitchRedirect: { status: pitchRedirect.status, destination: pitchLocation }, failures, checks: results, limits: ['Deployment ID and source SHA must be confirmed separately against the hosting API.', 'HTTP byte and policy checks do not execute the browser or certify external CDN availability, physical-device performance or learning outcomes.'] };
await writeFile(output, JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify({ status: receipt.status, filesChecked: results.length, documents: library.documentCount, failures }));
if (failures.length) process.exitCode = 1;
