import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = resolve(root, 'context/project-context.json');
const schedulePath = resolve(root, 'context/schedule.json');
const templatePath = resolve(root, 'context/index.template.html');
const outputPath = resolve(root, 'context/index.html');
const compiledPath = resolve(root, 'context/compiled-context.json');
const marker = '__IPE_CONTEXT_JSON__';
const [source, scheduleSource, template] = await Promise.all([
  readFile(sourcePath, 'utf8'),
  readFile(schedulePath, 'utf8'),
  readFile(templatePath, 'utf8'),
]);
if (Buffer.byteLength(source) + Buffer.byteLength(scheduleSource) > 2 * 1024 * 1024) throw new Error('O contexto excede 2 MiB.');
const data = JSON.parse(source);
const schedule = JSON.parse(scheduleSource);
if (!data || typeof data !== 'object' || Array.isArray(data) || data.version !== 1) {
  throw new Error('Contexto: contrato version: 1 obrigatório.');
}
if (!schedule || typeof schedule !== 'object' || Array.isArray(schedule)) throw new Error('Cronograma: objeto JSON obrigatório.');
for (const field of ['tasks', 'tracks', 'gates']) {
  if (!Array.isArray(schedule[field])) throw new Error(`Cronograma: ${field} deve ser array.`);
  data[field] = schedule[field];
}
if (!data.project || typeof data.project.name !== 'string' || !data.project.name.trim()) {
  throw new Error('Contexto: project.name obrigatório.');
}
for (const field of ['asOf', 'deadline']) {
  if (!Number.isFinite(Date.parse(data.project[field]))) throw new Error(`Contexto: project.${field} deve ser uma data válida.`);
}
const arrayFields = ['chapters', 'research', 'themes', 'decisions', 'insights', 'sources', 'history', 'tasks', 'tracks', 'gates'];
for (const field of arrayFields) {
  if (data[field] === undefined) data[field] = [];
  if (!Array.isArray(data[field])) throw new Error(`Contexto: ${field} deve ser array.`);
  const seen = new Set();
  for (const item of data[field]) {
    if (!item || typeof item !== 'object' || typeof item.id !== 'string' || !/^[a-zA-Z0-9_.:-]+$/.test(item.id)) {
      throw new Error(`Contexto: ID inválido em ${field}.`);
    }
    if (seen.has(item.id)) throw new Error(`Contexto: ID duplicado ${field}/${item.id}.`);
    seen.add(item.id);
  }
}
const taskIds = new Set(data.tasks.map(task => task.id));
const trackIds = new Set(data.tracks.map(track => track.id));
for (const task of data.tasks) {
  if (!['done', 'in_progress', 'blocked', 'planned'].includes(task.status)) throw new Error(`Tarefa ${task.id}: status inválido.`);
  if (!Number.isFinite(Date.parse(task.start)) || !Number.isFinite(Date.parse(task.end)) || Date.parse(task.end) <= Date.parse(task.start)) {
    throw new Error(`Tarefa ${task.id}: intervalo inválido.`);
  }
  if (!trackIds.has(task.track)) throw new Error(`Tarefa ${task.id}: trilha desconhecida.`);
  if (!Array.isArray(task.dependsOn) || task.dependsOn.some(id => !taskIds.has(id) || id === task.id)) {
    throw new Error(`Tarefa ${task.id}: dependência inválida.`);
  }
}
const visited = new Set();
const visiting = new Set();
const taskById = new Map(data.tasks.map(task => [task.id, task]));
function visit(id) {
  if (visiting.has(id)) throw new Error(`Cronograma: ciclo de dependência em ${id}.`);
  if (visited.has(id)) return;
  visiting.add(id);
  for (const dependency of taskById.get(id).dependsOn) visit(dependency);
  visiting.delete(id);
  visited.add(id);
}
for (const id of taskIds) visit(id);
if (template.split(marker).length !== 2) throw new Error('Template deve conter exatamente um marcador de contexto.');
// JSON is a script text node, not HTML. Escape HTML delimiters and JS line separators.
const safeJSON = JSON.stringify(data).replace(/[<>&\u2028\u2029]/g, char => ({
  '<': '\\u003c', '>': '\\u003e', '&': '\\u0026', '\u2028': '\\u2028', '\u2029': '\\u2029',
}[char]));
const html = template.replace(marker, safeJSON);
await mkdir(dirname(outputPath), { recursive: true });
const temporaryHTML = outputPath + '.tmp-' + process.pid;
const temporaryJSON = compiledPath + '.tmp-' + process.pid;
await Promise.all([
  writeFile(temporaryHTML, html),
  writeFile(temporaryJSON, JSON.stringify(data, null, 2) + '\n'),
]);
await rename(temporaryJSON, compiledPath);
await rename(temporaryHTML, outputPath);
console.log(JSON.stringify({
  output: 'context/index.html',
  compiled: 'context/compiled-context.json',
  bytes: Buffer.byteLength(html),
  sha256: createHash('sha256').update(html).digest('hex'),
  projectVersion: data.project.version,
  tasks: data.tasks.length,
  sources: data.sources.length,
  chapters: data.chapters.length,
  embeddedDataAndLogic: true,
  localDesignAssets: ['site.css', 'fonts/fonts.css', 'brand/missao-ipe-logo-on-light.svg', 'brand/missao-ipe-symbol.svg'],
}, null, 2));
