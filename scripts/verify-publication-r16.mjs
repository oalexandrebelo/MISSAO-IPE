import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
const [deploymentId, sourceCommit, output = 'evidence/production-r16.json'] = process.argv.slice(2);
if (!deploymentId?.startsWith('dpl_') || !/^[a-f0-9]{40}$/.test(sourceCommit ?? '')) throw new Error('Informe deployment ID e commit completos, conferidos na Vercel.');
const base = 'https://projeto-ipe.vercel.app';
const get = path => fetch(`${base}/${path}`, { redirect: 'error', signal: AbortSignal.timeout(30000) });
const response = await get('publication-manifest.json');
if (response.status !== 200) throw new Error(`Manifesto HTTP ${response.status}`);
const manifest = await response.json();
if (manifest.project !== 'PROJETO-IPE' || manifest.version !== '0.7.0-beta.1' || manifest.edition !== 'R16-purpose-and-discovery-plus-four-level-campaign') throw new Error('A versão pública não é a R16 esperada.');
for (const path of ['lab/index.html', 'campanha/index.html', 'planet-jumping.html', 'docs/35-REVISAO-PRS-E-DIRECAO-R16.html', 'docs/36-PORTAL-PLANET-JUMPING.html', 'docs/37-PROPOSTA-PEDAGOGICA-E-TECNOLOGIAS-R16.html', 'docs/38-HANDOFF-R16.html', 'docs/39-ATIVOS-DA-PR-E-APLICACOES.html', 'research/technology-opportunities-r16.json', 'research/pr-assets-r16.json']) if (!manifest.files.some(file => file.path === path)) throw new Error(`Artefato obrigatório ausente: ${path}`);
const libraryResponse = await get('context/research-library-index.json');
const library = await libraryResponse.json();
if (libraryResponse.status !== 200 || library.documentCount !== 98) throw new Error('Biblioteca incompleta.');
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
      if ((csp.match(/default-src/g) ?? []).length !== 1) policyAndMimePass = false;
      const isPortal = file.path === 'planet-jumping.html';
      if (isPortal !== csp.includes('https://d2ol7oe51mr4n9.cloudfront.net')) policyAndMimePass = false;
      if (!isPortal && (!csp.includes("'wasm-unsafe-eval'") || !csp.includes("connect-src 'self' blob:"))) policyAndMimePass = false;
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
const receipt = { verifiedAt: new Date().toISOString(), base, access: 'Public; no cookies or authorization headers', deploymentId, sourceCommit, version: manifest.version, edition: manifest.edition, status: failures.length ? 'failed' : 'passed', filesChecked: results.length, documents: library.documentCount, failures, checks: results, limits: ['Deployment ID and source SHA must be confirmed separately against the hosting API.', 'HTTP byte and policy checks do not execute the browser or certify external CDN availability, physical-device performance or learning outcomes.'] };
await writeFile(output, JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify({ status: receipt.status, filesChecked: results.length, documents: library.documentCount, failures }));
if (failures.length) process.exitCode = 1;
