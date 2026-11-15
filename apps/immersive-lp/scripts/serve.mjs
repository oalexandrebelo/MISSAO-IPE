import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve(process.env.SERVE_DIR || 'out');
const port = Number(process.env.PORT || 4177);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.ico':'image/x-icon' };
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url || '/', 'http://localhost').pathname);
    let file = resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403); res.end('Forbidden'); return; }
    const info = await stat(file);
    if (info.isDirectory()) file = resolve(file, 'index.html');
    const data = await readFile(file);
    res.setHeader('Content-Type', mime[extname(file)] || 'application/octet-stream');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-cache');
    res.writeHead(200); res.end(req.method === 'HEAD' ? undefined : data);
  } catch {
    const notFound = await readFile(resolve(root, '404.html')).catch(() => null);
    res.writeHead(404, { 'Content-Type': notFound ? mime['.html'] : 'text/plain; charset=utf-8' });
    res.end(req.method === 'HEAD' ? undefined : notFound ?? 'Not found');
  }
}).listen(port, '0.0.0.0', () => process.stdout.write(`MISSÃO IPÊ em http://localhost:${port}\n`));
