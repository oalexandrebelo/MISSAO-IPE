#!/usr/bin/env node
import { build } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const result = await build({
  absWorkingDir: root,
  entryPoints: ['presentation/src/main.ts'],
  bundle: true,
  write: false,
  splitting: false,
  format: 'iife',
  target: 'es2022',
  minify: true,
  legalComments: 'inline',
  metafile: true,
});
const sourceFiles = ['mod13q1-A-raw.json', 'mod13q1-B-raw.json', 'mod13q1-C-raw.json'];
const embedded = {};
for (const file of sourceFiles) embedded[file] = await readFile(resolve(root, 'public/data', file), 'utf8');
const template = await readFile(resolve(root, 'presentation/src/template.html'), 'utf8');
const css = await readFile(resolve(root, 'presentation/src/styles.css'), 'utf8');
const javascript = result.outputFiles[0].text;
const html = template
  .replace('/*__PRESENTATION_CSS__*/', () => css.replace(/<\/style/gi, '<\\/style'))
  .replace('/*__PRESENTATION_DATA__*/', () => JSON.stringify(embedded).replace(/</g, '\\u003c'))
  .replace('/*__PRESENTATION_JS__*/', () => javascript.replace(/<\/script/gi, '<\\/script'));
if (/\/\*__PRESENTATION_/.test(html)) throw new Error('Marcador de build não substituído.');
const inputs = Object.keys(result.metafile.inputs);
if (inputs.some(path => path.includes('node_modules'))) throw new Error('A apresentação não deve incorporar bibliotecas externas.');
if (!inputs.includes('src/core/engine.ts') || !inputs.includes('src/core/search.ts')) throw new Error('O demonstrador precisa do motor e da busca reais.');
await mkdir(resolve(root, 'presentation'), { recursive: true });
await mkdir(resolve(root, 'evidence'), { recursive: true });
const output = 'presentation/Missao_Ipe_Apresentacao.html';
await writeFile(resolve(root, output), html);
const sha256 = createHash('sha256').update(html).digest('hex');
const receipt = {
  generatedAt: new Date().toISOString(), output, bytes: Buffer.byteLength(html), sha256,
  title: 'Missão Ipê — Ciência que chega / IPÊ — Science Delivered',
  mode: 'Self-contained local HTML; deterministic product engine bundled as IIFE on main thread',
  target: 'ES2022', pitchSlides: 7, appendixSlides: 8, totalSlides: 15,
  defaultMode: 'pitch', externalRuntimeDependencies: 0, networkRequestsRequired: 0,
  embeddedSourceFiles: sourceFiles, inputs,
  usesProductEngine: true, usesProductScienceValidator: true, usesProductCatalogSearch: true,
  automatedTimer: false, timer: 'Explicit start; pause on notes close, print, pagehide or hidden tab; never controls simulation or slides',
  navigation: 'Keyboard and buttons, overview, two display/print modes, local notes in PT/EN',
  accessibility: 'Reduced motion, labeled controls, keyboard-safe forms, modal focus trap; real-browser accessibility review remains open',
  fallback: 'No localStorage or fullscreen dependency',
  limitations: ['No real-browser visual inspection in this environment', 'Package links require the complete ZIP', 'Research prototype; event eligibility and official Resources list unresolved'],
};
await writeFile(resolve(root, 'evidence/presentation-build.json'), JSON.stringify(receipt, null, 2) + '\n');
process.stdout.write(`Apresentação: ${Buffer.byteLength(html)} bytes, 7 quadros de pitch + 8 apêndices. SHA-256 ${sha256}\n`);
