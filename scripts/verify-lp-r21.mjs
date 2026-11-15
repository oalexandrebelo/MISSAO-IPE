import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const [deploymentId, sourceCommit, output = 'evidence/production-lp-r21.json'] = process.argv.slice(2);
if (!deploymentId?.startsWith('dpl_') || !/^[a-f0-9]{40}$/.test(sourceCommit ?? '')) throw new Error('Informe deployment ID e commit completos, conferidos na Vercel.');
const base = 'https://projeto-ipe-lp.vercel.app';
const checks = [];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
for (const [path, expected] of [['/', 200], ['/creditos/', 200], ['/verificacao-rota-inexistente/', 404], ['/acessibilidade/guia/', 200], ['/acessibilidade/libras.js', 200], ['/acessibilidade/libras.css', 200], ['/acessibilidade/guia.js', 200]]) {
  const response = await fetch(new URL(path, base), { redirect: 'error', signal: AbortSignal.timeout(30000) });
  const bytes = Buffer.from(await response.arrayBuffer());
  const html = bytes.toString();
  const row = { path, status: response.status, expected, sha256: hash(bytes), passed: response.status === expected };
  if (path === '/' || path === '/creditos/' || expected === 404) {
    row.librasLink = /data-ipe-libras="public"[^>]*href="\/acessibilidade\/guia\/"/.test(html);
    row.passed &&= row.librasLink;
  }
  if (path === '/') {
    row.pitchLink = html.includes('https://projeto-ipe.vercel.app/presentation/pitch/index.html');
    row.passed &&= row.pitchLink;
  }
  if (path.startsWith('/acessibilidade/')) {
    const file = path.endsWith('/') ? '/acessibilidade/guia.html' : path;
    row.matchesLocal = hash(await readFile(new URL(`../apps/immersive-lp/public${file}`, import.meta.url))) === row.sha256;
    row.passed &&= row.matchesLocal;
    if (path.endsWith('/')) {
      const csp = response.headers.get('content-security-policy') ?? '';
      row.isolated = csp.includes("frame-ancestors 'self'") && csp.includes('sandbox allow-scripts') && response.headers.get('x-frame-options') === 'SAMEORIGIN';
      row.assetsResolve = ['libras.css', 'guia.js'].every(name => html.includes(`="/acessibilidade/${name}"`));
      row.passed &&= row.isolated && row.assetsResolve;
    }
  }
  checks.push(row);
}
const receipt = { verifiedAt: new Date().toISOString(), deploymentId, sourceCommit, alias: base, status: checks.every(row => row.passed) ? 'passed' : 'failed', checks, limits: ['Deployment ID and source SHA must be confirmed separately against the hosting API.', 'HTTP checks do not certify visual layout, human accessibility or external VLibras availability.'] };
await writeFile(output, JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify({ status: receipt.status, checks: checks.length, failures: checks.filter(row => !row.passed) }));
if (receipt.status !== 'passed') process.exitCode = 1;
