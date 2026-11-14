#!/usr/bin/env node
import { build } from 'esbuild';
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const result = await build({
  absWorkingDir: root, entryPoints: ['src/main.tsx'], outdir: 'portable', bundle: true,
  write: false, splitting: false, format: 'iife', target: 'es2022', minify: true,
  define: { 'process.env.NODE_ENV': '"production"', 'import.meta.url': '"file:///portable/"', '__IPE_PORTABLE__': 'true' },
  legalComments: 'inline', metafile: true,
});
const javascript = result.outputFiles.filter(file => file.path.endsWith('.js')).map(file => file.text).join('\n');
const css = result.outputFiles.filter(file => file.path.endsWith('.css')).map(file => file.text).join('\n');
if (!javascript || !css) throw new Error('O pacote portátil exige JavaScript e CSS compilados.');
const resources = {};
for (const filename of await readdir(resolve(root, 'public/data'))) {
  if (filename.endsWith('.json')) resources[filename] = await readFile(resolve(root, 'public/data', filename), 'utf8');
}
// Local data links become downloads from embedded NASA source bytes; no network request.
const sourceLinks = `const sources=${JSON.stringify(resources).replace(/</g, '\\u003c')};document.addEventListener('click',event=>{const anchor=event.target instanceof Element?event.target.closest('a'):null;if(!anchor)return;const href=anchor.getAttribute('href')||'';const name=href.split('/').pop();if((href.includes('/data/')||href.startsWith('data/'))&&Object.hasOwn(sources,name)){event.preventDefault();const url=URL.createObjectURL(new Blob([sources[name]],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}});`;
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; connect-src 'none'; base-uri 'none'; form-action 'none'"><title>Missão Ipê — Ciência que chega</title><style>${css.replace(/<\/style/gi, '<\\/style')}</style></head><body><div id="root"></div><noscript>Ative JavaScript para executar este jogo local.</noscript><script>${javascript.replace(/<\/script/gi, '<\\/script')}\n${sourceLinks}</script></body></html>`;
await mkdir(resolve(root, 'portable'), { recursive: true });
await writeFile(resolve(root, 'portable/Missao_Ipe_Local.html'), html);
await writeFile(resolve(root, 'evidence/portable-build.json'), JSON.stringify({
  generatedAt: new Date().toISOString(), bytes: Buffer.byteLength(html),
  target: 'ES2022', externalRuntimeDependencies: 0, embeddedJsonFiles: Object.keys(resources),
  mode: 'file protocol uses same simulation on main thread; browser validation remains a separate gate',
  inputs: Object.keys(result.metafile.inputs).filter(path => !path.startsWith('node_modules/')),
}, null, 2) + '\n');
process.stdout.write(`HTML portátil: ${Buffer.byteLength(html)} bytes; ${Object.keys(resources).length} fontes JSON incorporadas.\n`);
