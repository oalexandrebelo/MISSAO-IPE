import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat, realpath, readFile } from 'node:fs/promises';
import { extname, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../site/', import.meta.url));
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--port')) {
  throw new Error('Uso: node scripts/serve-beta.mjs [--port 4175]');
}
const port = args.length ? Number(args[1]) : 4175;
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Porta deve ser um inteiro entre 1024 e 65535.');
const canonicalRoot = await realpath(root).catch(() => { throw new Error('site/ ausente. Execute npm run build:beta.'); });
await stat(resolve(canonicalRoot, 'index.html'));
const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const headerRules = config.headers.map(rule => ({ ...rule, pattern: rule.source.includes('(') ? new RegExp(`^${rule.source}$`) : null }));
function headersFor(pathname) {
  return Object.fromEntries(headerRules.filter(rule => rule.source === pathname || rule.pattern?.test(pathname)).flatMap(rule => rule.headers.map(header => [header.key, header.value])));
}
const redirects = new Map(config.redirects.map(r => [r.source, r.destination]));
// Explicit localhost-only QA mode. Production always uses the private Blob adapter.
let metrics;
if (process.env.IPE_METRICS_TEST === '1') {
  const { createMetricsHandler } = await import('../server/metrics/handler.mjs');
  const records = new Map();
  const repository = {
    get: async key => records.get(key) ?? null,
    putIfAbsent: async (key, document) => {
      if (records.has(key)) return { created: false, document: records.get(key) };
      records.set(key, document); return { created: true, document };
    },
    list: async cursor => { const offset = Number(cursor ?? 0); const all = [...records.values()]; const end = offset + 100; return { documents: all.slice(offset, end), cursor: end < all.length ? String(end) : null, hasMore: end < all.length }; },
  };
  metrics = createMetricsHandler({ repository, development: true, signingSecret: 'localhost-test-signing-secret-not-for-production', adminSecret: 'localhost-test-admin-secret-not-for-production' });
}
const mime = new Map(Object.entries({
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.md': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.mmd': 'text/plain; charset=utf-8',
  '.prisma': 'text/plain; charset=utf-8', '.yaml': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
  '.glb': 'model/gltf-binary', '.wasm': 'application/wasm', '.riv': 'application/octet-stream', '.pdf': 'application/pdf', '.zip': 'application/zip'
}));
const server = http.createServer(async (req, res) => {
  let pathname = '/';
  if (metrics && req.url?.split('?')[0] === '/api/metrics') return metrics(req, res);
  const finish = (status, body, extra = {}) => {
    const bytes = Buffer.byteLength(body);
    res.writeHead(status, { ...headersFor(pathname), 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8', 'Content-Length': bytes, ...extra });
    res.end(req.method === 'HEAD' ? undefined : body);
  };
  if (!['GET', 'HEAD'].includes(req.method)) return finish(405, 'Método não permitido.\n', { Allow: 'GET, HEAD' });
  try { pathname = decodeURIComponent((req.url || '/').split('?')[0]); }
  catch { return finish(400, 'Caminho inválido.\n'); }
  if (!pathname.startsWith('/') || /[\x00-\x1f\\]/.test(pathname) || pathname.split('/').some(s => s.startsWith('.'))) return finish(400, 'Caminho inválido.\n');
  if (redirects.has(pathname)) return finish(307, 'Redirecionando.\n', { Location: redirects.get(pathname) });
  const requested = resolve(canonicalRoot, '.' + pathname, pathname.endsWith('/') ? 'index.html' : '');
  try {
    const actual = await realpath(requested);
    const rel = relative(canonicalRoot, actual);
    if (rel.startsWith('..') || isAbsolute(rel)) return finish(403, 'Acesso recusado.\n');
    const info = await stat(actual);
    if (!info.isFile()) return finish(404, 'Arquivo não encontrado.\n');
    res.writeHead(200, { ...headersFor(pathname), 'Cache-Control': 'no-store', 'Content-Type': mime.get(extname(actual).toLowerCase()) || 'application/octet-stream', 'Content-Length': info.size });
    if (req.method === 'HEAD') return res.end();
    const stream = createReadStream(actual);
    stream.on('error', () => res.destroy());
    res.on('close', () => stream.destroy());
    stream.pipe(res);
  } catch (error) {
    finish(error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 404 : 500, 'Arquivo indisponível.\n');
  }
});
server.requestTimeout = 15_000;
server.headersTimeout = 10_000;
server.keepAliveTimeout = 3_000;
server.listen(port, '127.0.0.1', () => console.log(`AB-NASA-TEAM-IPE BETA: http://127.0.0.1:${port}/`));
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => server.close(() => process.exit(0)));
