#!/usr/bin/env node
/** Local read-only presentation kit. No dependency installation is required. */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { readFile, realpath, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MIME = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8','.pdf':'application/pdf','.svg':'image/svg+xml','.png':'image/png','.jpeg':'image/jpeg','.jpg':'image/jpeg','.map':'application/json','.woff2':'font/woff2'};
const fixedFiles = new Set(['README.md','NOTICE.md','LICENSE','kit/AI-USAGE.md',
 'presentation/Missao_Ipe_Apresentacao.html','presentation/README_APRESENTADOR.md','presentation/ROTEIRO_PT_EN.md','presentation/PITCH_EN_7_SLIDES.md',
 'portable/Missao_Ipe_Local.html','output/pdf/AB_Missao_Ipe_Dossie_Implementacao.pdf','output/html/AB_Missao_Ipe_Estudo_Integral.html']);
function allowed(name) {
 return fixedFiles.has(name)
   || /^dist\/(?:[^/]+|assets\/[^/]+|data\/[^/]+)$/.test(name)
   || /^docs\/(?:[^/]+\.md|diagrams\/[^/]+\.mmd)$/.test(name)
   || /^research\/(?:[^/]+\.md|history\/[^/]+\.md)$/.test(name)
   || /^examples\/[^/]+\.json$/.test(name)
   || /^public\/data\/[^/]+\.json$/.test(name)
   || /^evidence\/[^/]+\.(?:json|tap)$/.test(name)
   || /^licenses\/[^/]+\.txt$/.test(name)
   || /^references\/user\/[^/]+\.(?:jpeg|jpg|png|md|json)$/.test(name);
}
function cspForHtml(bytes) {
 const content = bytes.toString('utf8').replace(/\r\n?/g,'\n');
 const hashes = [...content.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)]
   .filter(match => match[1].trim()).map(match => "'sha256-" + createHash('sha256').update(match[1]).digest('base64') + "'");
 return "default-src 'none'; script-src 'self' " + [...new Set(hashes)].join(' ') + "; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; worker-src 'self' blob:; media-src 'self' blob:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'";
}
export async function createKitServer() {
 const root = await realpath(PROJECT);
 const server = createServer(async (request,response) => {
   response.setHeader('X-Content-Type-Options','nosniff');
   response.setHeader('Referrer-Policy','no-referrer');
   response.setHeader('Cross-Origin-Resource-Policy','same-origin');
   response.setHeader('Cache-Control','no-store');
   response.setHeader('Content-Security-Policy',"default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
   if (!['GET','HEAD'].includes(request.method)) {response.writeHead(405,{Allow:'GET, HEAD'});response.end();return;}
   let pathname;
   try {pathname=decodeURIComponent((request.url||'/').split('?')[0]);}
   catch {response.writeHead(400);response.end('Caminho inválido.');return;}
   if (!pathname.startsWith('/') || /[\u0000-\u001f\\]/.test(pathname)) {response.writeHead(400);response.end();return;}
   if (pathname.split('/').some(part=>part==='..'||part==='.')) {response.writeHead(403);response.end();return;}
   let name;
   if (pathname==='/'||pathname==='/COMECE_AQUI.html') name='kit/COMECE_AQUI.html';
   else if (pathname.startsWith('/ab-mission-ipe/')) {
     name=pathname.slice('/ab-mission-ipe/'.length);
     if (!allowed(name)) {response.writeHead(404);response.end('Arquivo não publicado neste servidor.');return;}
   } else {response.writeHead(404);response.end();return;}
   const file=resolve(root,name);
   if (!file.startsWith(root+sep)) {response.writeHead(403);response.end();return;}
   try {
     const actual=await realpath(file);
     if (actual!==file) {response.writeHead(403);response.end();return;}
     const info=await stat(actual);
     if (!info.isFile()) {response.writeHead(404);response.end();return;}
     let body;
     if (extname(actual)==='.html') {
       body=await readFile(actual);
       response.setHeader('Content-Security-Policy',cspForHtml(body));
     }
     response.setHeader('Content-Type',MIME[extname(actual)]||'application/octet-stream');
     response.setHeader('Content-Length',body?body.length:info.size);
     response.writeHead(200);
     if(request.method==='HEAD'){response.end();return;}
     if(body){response.end(body);return;}
     const stream=createReadStream(actual);
     stream.on('error',()=>response.destroy());
     response.on('close',()=>stream.destroy());
     stream.pipe(response);
   } catch {if(!response.headersSent){response.writeHead(404);response.end('Arquivo não encontrado.');}else response.destroy();}
 });
 server.headersTimeout=15000;
 server.requestTimeout=30000;
 return server;
}
if (process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const args=process.argv.slice(2);
 if(args.length && !(args.length===2&&args[0]==='--port')) throw new Error('Uso: node scripts/serve-presentation-kit.mjs [--port 4174]');
 const port=args.length?Number(args[1]):4174;
 if(!Number.isSafeInteger(port)||port<1024||port>65535) throw new Error('Porta deve estar entre 1024 e 65535.');
 const server=await createKitServer();
 server.on('error',error=>{process.stderr.write(error.message+'\n');process.exitCode=1;});
 server.listen(port,'127.0.0.1',()=>process.stdout.write('Missão Ipê — apresentação e jogo: http://127.0.0.1:'+port+'\nServidor somente local. Ctrl+C encerra.\n'));
}
