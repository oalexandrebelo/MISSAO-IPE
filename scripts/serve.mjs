#!/usr/bin/env node
import { createServer } from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const portIndex = process.argv.indexOf('--port');
const port = portIndex < 0 ? 4173 : Number(process.argv[portIndex + 1]);
if (!Number.isSafeInteger(port) || port < 1024 || port > 65535) throw new Error('Escolha --port entre 1024 e 65535.');
if (!existsSync(join(root, 'index.html'))) throw new Error('dist/index.html ausente. Execute npm ci e npm run build, ou use o pacote já compilado.');
const contentTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.map': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
const csp = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; worker-src 'self'; media-src 'self' blob:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'";
const server = createServer(async (request, response) => {
  response.setHeader('Content-Security-Policy', csp);
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'no-referrer');
  response.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  if (request.method !== 'GET' && request.method !== 'HEAD') { response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return; }
  let path;
  try { path = decodeURIComponent(new URL(request.url || '/', 'http://127.0.0.1').pathname); }
  catch { response.writeHead(400); response.end('Caminho inválido.'); return; }
  if (path.includes('\0') || path.includes('\\')) { response.writeHead(400); response.end(); return; }
  const file = resolve(root, `.${path === '/' ? '/index.html' : path}`);
  if (!file.startsWith(root + sep)) { response.writeHead(403); response.end(); return; }
  try {
    const info = await stat(file);
    if (!info.isFile()) { response.writeHead(404); response.end(); return; }
    response.setHeader('Content-Type', contentTypes[extname(file)] || 'application/octet-stream');
    response.setHeader('Content-Length', info.size);
    response.setHeader('Cache-Control', path.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-store');
    response.writeHead(200);
    if (request.method === 'HEAD') { response.end(); return; }
    const stream = createReadStream(file);
    stream.on('error', () => response.destroy());
    response.on('close', () => stream.destroy());
    stream.pipe(response);
  } catch { response.writeHead(404); response.end('Arquivo não encontrado.'); }
});
server.headersTimeout = 15_000;
server.requestTimeout = 30_000;
server.listen(port, '127.0.0.1', () => process.stdout.write(`Missão Ipê local: http://127.0.0.1:${port}\nNenhuma conexão externa é necessária. Ctrl+C encerra.\n`));
server.on('error', (error) => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
