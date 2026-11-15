import { readFile, writeFile, mkdir, readdir, lstat } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { librasGuide } from './public-libras.mjs';
import { allowPublicAnalytics, analyticsPrivateRoutes } from './public-analytics.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const site = resolve(root, 'site');
const { version } = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
const files = [];
async function walk(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const path = resolve(folder, entry.name);
    if ((await lstat(path)).isSymbolicLink()) throw new Error(`Symlink proibido na publicação: ${relative(site, path)}`);
    if (entry.isDirectory()) await walk(path);
    else if (entry.isFile()) files.push(path);
  }
}
await walk(site);
files.sort();
const required = ['equipe/index.html', 'dashboard/index.html', 'campanha/index.html', 'campanha/apresentacao/index.html', 'campanha/research/index.html', 'campanha/apresentacao/PROJETO-IPE-Pitch.pptx', 'campanha/kit/schema.prisma', 'index.html', 'planet-jumping.html', 'lab/index.html', 'game/index.html', 'presentation/Missao_Ipe_Apresentacao.html', 'presentation/pitch/index.html', 'architecture/index.html', 'context/index.html', 'context/research-library.html', 'docs/index.html', librasGuide];
for (const file of required) await readFile(resolve(site, file));
const inlineHashes = new Set();
const portalHashes = new Set();
let executableScripts = 0;
for (const path of files.filter(f => f.endsWith('.html'))) {
  const html = await readFile(path, 'utf8');
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (/\bsrc\s*=/i.test(match[1]) || /\btype\s*=\s*["'](?:application\/(?:ld\+)?json|text\/plain)["']/i.test(match[1])) continue;
    if (match[2].trim()) {
      const hashes = relative(site, path) === 'planet-jumping.html' ? portalHashes : inlineHashes;
      hashes.add(`'sha256-${createHash('sha256').update(match[2], 'utf8').digest('base64')}'`);
      executableScripts++;
    }
  }
}
const portalOrigin = 'https://d2ol7oe51mr4n9.cloudfront.net';
const guidePattern = librasGuide.replaceAll('.', '\\.');
const policy = (hashes, externalMedia = false) => [
  "default-src 'self'", `script-src 'self' ${externalMedia ? '' : "'wasm-unsafe-eval' "}${[...hashes].sort().join(' ')}`,
  "script-src-attr 'none'", "style-src 'self' 'unsafe-inline'", `img-src 'self' data: blob:${externalMedia ? ` ${portalOrigin}` : ''}`,
  "font-src 'self' data:", "connect-src 'self' blob:", "worker-src 'self' blob:", "frame-src 'self'",
  `media-src 'self' blob:${externalMedia ? ` ${portalOrigin}` : ''}`, "object-src 'none'", "base-uri 'none'",
  "frame-ancestors 'none'", "form-action 'none'"
].join('; ');
const privateCsp = policy(inlineHashes);
const csp = allowPublicAnalytics(privateCsp), portalCsp = allowPublicAnalytics(policy(portalHashes, true));
if (Math.max(Buffer.byteLength(csp), Buffer.byteLength(portalCsp)) > 12_000) throw new Error('CSP excede o limite local de 12KB; dividir política por rota.');
const routeConfig = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  cleanUrls: false,
  trailingSlash: false,
  redirects: [
    { source: '/campanha/research', destination: '/campanha/research/index.html', permanent: false },
    { source: '/campanha/apresentacao', destination: '/campanha/apresentacao/index.html', permanent: false },
    { source: '/campanha', destination: '/campanha/index.html', permanent: false },
    { source: '/game', destination: '/game/index.html', permanent: false },
    { source: '/jogar', destination: '/lab/index.html', permanent: false },
    { source: '/lab', destination: '/lab/index.html', permanent: false },
    { source: '/planet-jumping', destination: '/planet-jumping.html', permanent: false },
    { source: '/architecture', destination: '/architecture/index.html', permanent: false },
    { source: '/arquitetura', destination: '/architecture/index.html', permanent: false },
    { source: '/pitch', destination: '/presentation/pitch/index.html', permanent: false },
    { source: '/equipe', destination: '/equipe/index.html', permanent: false },
    { source: '/dashboard', destination: '/dashboard/index.html', permanent: false },
    { source: '/apresentacao', destination: '/presentation/Missao_Ipe_Apresentacao.html', permanent: false },
    { source: '/docs', destination: '/docs/index.html', permanent: false },
    { source: '/documentacao', destination: '/docs/index.html', permanent: false },
    { source: '/contexto', destination: '/context/index.html', permanent: false },
    { source: '/cronograma', destination: '/context/index.html', permanent: false },
    { source: '/estudo', destination: '/context/research-library.html', permanent: false }
  ],
  headers: [
    { source: '/(.*)', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }
    ] },
    // The VLibras guide declares its resource policy in HTML, for both hosts.
    { source: `/((?!planet-jumping\\.html$|${analyticsPrivateRoutes}).*)`, headers: [{ key: 'X-Frame-Options', value: 'DENY' }, { key: 'Content-Security-Policy', value: csp }] },
    { source: `/((?!${guidePattern}$)${analyticsPrivateRoutes}.*)`, headers: [{ key: 'X-Frame-Options', value: 'DENY' }, { key: 'Content-Security-Policy', value: privateCsp }] },
    { source: '/planet-jumping.html', headers: [{ key: 'X-Frame-Options', value: 'DENY' }, { key: 'Content-Security-Policy', value: portalCsp }] },
    { source: `/${librasGuide}`, headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }, { key: 'Content-Security-Policy', value: "frame-ancestors 'self'; sandbox allow-scripts" }] },
    { source: '/game/assets/(.*)', headers: [ { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' } ] },
    { source: '/api/(.*)', headers: [ { key: 'Cache-Control', value: 'private, no-store, max-age=0' }, { key: 'Vercel-CDN-Cache-Control', value: 'no-store' } ] },
    { source: '/dashboard/(.*)', headers: [ { key: 'Cache-Control', value: 'private, no-store, max-age=0' }, { key: 'X-Robots-Tag', value: 'noindex, nofollow' } ] }
  ]
};
const config = { ...routeConfig, framework: null, buildCommand: 'npm run build:release', installCommand: 'npm --prefix experiments/mission-design-lab ci --ignore-scripts --no-audit --no-fund && npm --prefix experiments/four-level-campaign ci --ignore-scripts --no-audit --no-fund', outputDirectory: 'site', functions: { 'api/metrics.mjs': { maxDuration: 60 } } };
await writeFile(resolve(root, 'vercel.json'), JSON.stringify(config, null, 2) + '\n');
await mkdir(resolve(root, '.vercel'), { recursive: true });
const staticConfigPath = resolve(root, '.vercel/deploy-config.json');
await writeFile(staticConfigPath, JSON.stringify(routeConfig, null, 2) + '\n');
const upload = [];
for (const path of [...files, staticConfigPath]) {
  const buffer = await readFile(path);
  upload.push({ file: path === staticConfigPath ? 'vercel.json' : relative(site, path).replaceAll('\\', '/'), source: relative(root, path).replaceAll('\\', '/'), size: buffer.length, sha: createHash('sha1').update(buffer).digest('hex'), sha256: createHash('sha256').update(buffer).digest('hex') });
}
await writeFile(resolve(root, '.vercel/upload-manifest.json'), JSON.stringify({ version, files: upload }, null, 2) + '\n');
console.log(JSON.stringify({ files: upload.length, bytes: upload.reduce((a,f)=>a+f.size,0), executableInlineScripts: executableScripts, uniqueInlineHashes: inlineHashes.size + portalHashes.size, cspBytes: Buffer.byteLength(csp), portalCspBytes: Buffer.byteLength(portalCsp), config: 'vercel.json', uploadManifest: '.vercel/upload-manifest.json' }, null, 2));
