import { createReadStream, createWriteStream } from 'node:fs';
import { readFile, mkdir, lstat, realpath, rename, rm } from 'node:fs/promises';
import { resolve, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomUUID } from 'node:crypto';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createGunzip } from 'node:zlib';

const root = await realpath(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
const manifest = JSON.parse(await readFile(resolve(root, 'recovery/archive-manifest.json'), 'utf8'));
if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.archives)) throw new Error('Manifesto de recuperação inválido');
async function safePath(name) {
  if (typeof name !== 'string' || !name || name.includes('\\')) throw new Error('Caminho inválido');
  const path = resolve(root, name), rel = relative(root, path);
  if (!rel || rel.startsWith(`..${sep}`) || rel === '..') throw new Error('Caminho fora do projeto');
  let cursor = root;
  for (const part of rel.split(sep)) {
    cursor = resolve(cursor, part);
    try { if ((await lstat(cursor)).isSymbolicLink()) throw new Error(`Link simbólico recusado: ${name}`); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  return path;
}
async function digest(path) {
  const hash = createHash('sha256'); let bytes = 0;
  for await (const chunk of createReadStream(path)) { hash.update(chunk); bytes += chunk.length; }
  return { bytes, sha256: hash.digest('hex') };
}
function assertExpected(actual, expected, name) {
  if (!Number.isSafeInteger(expected.bytes) || expected.bytes < 0 || expected.bytes > 2 ** 31 || !/^[a-f0-9]{64}$/.test(expected.sha256)) throw new Error(`Metadados inválidos: ${name}`);
  if (actual.bytes !== expected.bytes || actual.sha256 !== expected.sha256) throw new Error(`Integridade divergente: ${name}`);
}
for (const archive of manifest.archives) {
  if (!['gzip', 'concat'].includes(archive.mode) || !Array.isArray(archive.sources) || !archive.sources.length) throw new Error('Contrato do arquivo inválido');
  const paths = [];
  for (const source of archive.sources) {
    const path = await safePath(source.path); assertExpected(await digest(path), source, source.path); paths.push(path);
  }
  const target = await safePath(archive.target);
  let existing = false;
  try { assertExpected(await digest(target), archive, archive.target); existing = true; }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  await mkdir(dirname(target), { recursive: true });
  const temporary = `${target}.${randomUUID()}.tmp`;
  const hash = createHash('sha256'); let bytes = 0;
  const guard = new Transform({ transform(chunk, encoding, callback) {
    bytes += chunk.length;
    if (bytes > archive.bytes) return callback(new Error('Saída excede tamanho declarado'));
    hash.update(chunk); callback(null, chunk);
  }});
  async function* sourceBytes() { for (const path of paths) yield* createReadStream(path); }
  try {
    const streams = [Readable.from(sourceBytes())];
    if (archive.mode === 'gzip') streams.push(createGunzip());
    streams.push(guard, createWriteStream(temporary, { flags: 'wx', mode: 0o600 }));
    await pipeline(...streams);
    assertExpected({ bytes, sha256: hash.digest('hex') }, archive, archive.target);
    if (existing) await rm(temporary); else await rename(temporary, target);
    console.log(JSON.stringify({ archive: archive.name, target: archive.target, bytes, status: existing ? 'verified-existing-and-roundtrip' : 'restored-and-verified' }));
  } catch (error) { await rm(temporary, { force: true }); throw error; }
}
