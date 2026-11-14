#!/usr/bin/env node
/**
 * Static, local REA 6.7.0 analysis using the CLI verified in AB-R3A.
 * Does not install packages or execute the inspected application.
 * Usage: node tools/rea-audit.mjs [--engine DIR] [--target DIR] [--out FILE]
 */
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { constants } from 'node:fs';
import { access, lstat, mkdir, mkdtemp, open, readFile, readdir, realpath, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const expectedVersion = '6.7.0';
const releaseCommit = '27dc42d10249f0410904a75c0997842eb03b931c';
const abR3aCommit = 'e76c4aff2d97b27ae00ebefcf60f16804130edd8';
const limits = { files: 160, fileBytes: 512 * 1024, totalBytes: 2 * 1024 * 1024, outputBytes: 64 * 1024 * 1024, timeoutMs: 120_000, cliHeapMiB: 768, workerHeapMiB: 768 };
const sourceDirectories = new Set(['src', 'server', 'shared', 'scripts', 'sdk', 'tests', 'tests-ui', 'web']);
const permittedExtension = /\.(?:[cm]?[jt]sx?|html)$/i;
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

function options() {
  const result = {};
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    if (key === '--help') {
      console.log('Usage: node tools/rea-audit.mjs [--engine DIR] [--target DIR] [--out FILE]');
      console.log('Requires an already prepared rea-agents 6.7.0 runtime. No downloads occur.');
      return null;
    }
    if (!['--engine', '--target', '--out'].includes(key) || !args[i + 1] || args[i + 1].startsWith('--') || result[key]) {
      throw new Error(`Invalid or repeated option: ${key}`);
    }
    result[key] = args[++i];
  }
  return result;
}

async function findEngine(explicit) {
  const choices = explicit ? [resolve(explicit)] : [
    join(projectRoot, 'vendor/rea'),
    fileURLToPath(new URL('../../reference/rea-6.7.0/', import.meta.url)),
  ];
  for (const candidate of choices) {
    try {
      await access(join(candidate, 'scripts/rea.mjs'), constants.R_OK);
      return await realpath(candidate);
    } catch { /* Try the next documented local location. */ }
  }
  throw new Error('REA runtime is absent. Prepare rea-agents 6.7.0 separately, then pass --engine DIR. This audit never installs it.');
}

async function snapshot(target, destination) {
  const manifest = [];
  let bytes = 0;
  let visited = 0;
  async function visit(path, depth = 0) {
    if (++visited > 4096 || depth > 20) throw new Error('Source traversal limit exceeded.');
    const info = await lstat(path);
    if (info.isSymbolicLink()) throw new Error(`Symbolic link is outside this audit scope: ${relative(target, path)}`);
    if (info.isDirectory()) {
      for (const name of (await readdir(path)).sort()) {
        if (name.startsWith('.') || name === 'node_modules' || name === 'dist') continue;
        await visit(join(path, name), depth + 1);
      }
      return;
    }
    const rel = relative(target, path).split('\\').join('/');
    if (!info.isFile() || !(permittedExtension.test(rel) || rel === 'package.json' || /(?:^|\/)tsconfig(?:\.[^/]+)?\.json$/.test(rel))) return;
    if (info.size > limits.fileBytes || manifest.length >= limits.files) throw new Error('Source file size/count limit exceeded.');
    const handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW);
    let data;
    try {
      const before = await handle.stat();
      if (!before.isFile() || before.size > limits.fileBytes) throw new Error(`Source changed during snapshot: ${rel}`);
      const buffer = Buffer.alloc(before.size + 1);
      let offset = 0;
      while (offset < buffer.length) {
        const read = await handle.read(buffer, offset, buffer.length - offset, null);
        if (!read.bytesRead) break;
        offset += read.bytesRead;
      }
      const after = await handle.stat();
      if (offset !== before.size || before.ino !== after.ino || before.mtimeMs !== after.mtimeMs || before.size !== after.size) throw new Error(`Source changed during snapshot: ${rel}`);
      data = buffer.subarray(0, offset);
    } finally { await handle.close(); }
    bytes += data.length;
    if (bytes > limits.totalBytes) throw new Error('Total source byte limit exceeded.');
    const copied = join(destination, rel);
    await mkdir(dirname(copied), { recursive: true, mode: 0o700 });
    await writeFile(copied, data, { flag: 'wx', mode: 0o600 });
    manifest.push({ path: rel, bytes: data.length, sha256: sha256(data) });
  }
  for (const name of (await readdir(target)).sort()) {
    if (name.startsWith('.')) continue;
    const path = join(target, name);
    const info = await lstat(path);
    if ((info.isDirectory() || info.isSymbolicLink()) && !sourceDirectories.has(name)) continue;
    await visit(path);
  }
  if (manifest.length === 0) throw new Error('No eligible source files were found.');
  return { root: target, files: manifest, totalBytes: bytes, manifestSha256: sha256(JSON.stringify(manifest)) };
}

function execute(cli, target) {
  return new Promise((resolveRun) => {
    const env = {};
    for (const key of ['PATH', 'TMPDIR', 'TMP', 'TEMP', 'LANG', 'LC_ALL', 'TZ', 'SystemRoot']) {
      if (process.env[key]) env[key] = process.env[key];
    }
    env.NODE_OPTIONS = `--max-old-space-size=${limits.cliHeapMiB}`;
    env.REA_BUILD_COMMIT = releaseCommit;
    const args = [cli, 'analyze-javascript-application', target, '--max-heap-mb', String(limits.workerHeapMiB), '--json'];
    const child = spawn(process.execPath, args, { cwd: target, env, shell: false, detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe'] });
    const stdout = [];
    const stderr = [];
    let total = 0;
    let stopReason = null;
    let done = false;
    let killTimer;
    let startError;
    function signal(signalName) {
      if (!child.pid || done) return;
      try {
        if (process.platform === 'win32') child.kill(signalName);
        else process.kill(-child.pid, signalName);
      } catch { /* The owned process group may already have exited. */ }
    }
    function stop(reason) {
      if (done || stopReason) return;
      stopReason = reason;
      signal('SIGTERM');
      killTimer = setTimeout(() => {
        signal('SIGKILL');
        child.stdout.destroy();
        child.stderr.destroy();
      }, 2000);
    }
    const timer = setTimeout(() => stop('timeout'), limits.timeoutMs);
    const cancel = () => stop('cancelled');
    process.once('SIGINT', cancel);
    process.once('SIGTERM', cancel);
    for (const [stream, chunks] of [[child.stdout, stdout], [child.stderr, stderr]]) {
      stream.on('data', (chunk) => {
        const admitted = Math.max(0, Math.min(chunk.length, limits.outputBytes - total));
        if (admitted) chunks.push(chunk.subarray(0, admitted));
        total += chunk.length;
        if (total > limits.outputBytes) stop('output-limit');
      });
    }
    child.once('error', (error) => { startError = error.message; });
    child.once('close', (exitCode, signalName) => {
      done = true;
      clearTimeout(timer);
      clearTimeout(killTimer);
      process.removeListener('SIGINT', cancel);
      process.removeListener('SIGTERM', cancel);
      resolveRun({ exitCode, signal: signalName, stopReason, startError, stdout: Buffer.concat(stdout), stderr: Buffer.concat(stderr) });
    });
  });
}

async function main() {
  const opts = options();
  if (!opts) return;
  const target = await realpath(resolve(opts['--target'] ?? projectRoot));
  const out = resolve(opts['--out'] ?? join(projectRoot, 'audit/rea-analysis.json'));
  const engine = await findEngine(opts['--engine']);
  const packageBytes = await readFile(join(engine, 'package.json'));
  const pkg = JSON.parse(packageBytes);
  if (pkg.name !== 'rea-agents' || pkg.version !== expectedVersion) throw new Error('Expected the prepared rea-agents 6.7.0 runtime.');
  const cli = join(engine, 'scripts/rea.mjs');
  const temporary = await mkdtemp(join(tmpdir(), 'ab-et3tiv-rea-'));
  try {
    const scope = await snapshot(target, temporary);
    const startedAt = new Date().toISOString();
    const start = performance.now();
    const run = await execute(cli, temporary);
    let evidence = null;
    let parseError = null;
    try { evidence = JSON.parse(run.stdout.toString('utf8')); }
    catch { parseError = 'REA did not return complete JSON; the captured output is preserved.'; }
    const envelope = evidence?.data ?? evidence;
    const partial = envelope?.details?.partial_observation ?? envelope?.error?.details?.partial_observation;
    const observation = partial?.data ?? partial ?? envelope;
    const result = observation?.normalized_result;
    const validEvidence = observation?.operation === 'analyze_javascript_application' && typeof observation?.evidence_id === 'string';
    const successful = run.exitCode === 0 && !run.stopReason && !parseError && validEvidence && !envelope?.error;
    const report = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      method: 'Local static JavaScript/TypeScript analysis. The target application is not executed. This is not a behavioral equivalence or security guarantee.',
      engine: { package: pkg.name, version: pkg.version, releaseCommit, packageJsonSha256: sha256(packageBytes), cliSha256: sha256(await readFile(cli)), abR3aReferenceCommit: abR3aCommit },
      scope,
      limits,
      execution: { startedAt, elapsedMs: Math.round(performance.now() - start), node: process.version, exitCode: run.exitCode, signal: run.signal, stopReason: run.stopReason, startError: run.startError ?? null, status: successful ? 'completed' : 'failed-or-partial', stdoutBytes: run.stdout.length, stderrBytes: run.stderr.length, stdoutSha256: sha256(run.stdout) },
      summary: validEvidence ? { evidenceId: observation.evidence_id, statistics: result?.statistics ?? null, applicationCoverage: result?.graph?.coverage ?? null, semanticCoverage: result?.semantic_graph?.coverage ?? null } : null,
      scopeLimitations: ['Only eligible top-level source files and src, server, shared, scripts, sdk, tests, tests-ui, web are included. Dependencies, public assets, builds and other directories are excluded.', 'Process time and output are bounded; each V8 heap is bounded separately and is not a total process-family memory limit.', 'Local execution is not an operating-system network sandbox.', 'Application graph coverage and semantic coverage are separate. Partial or unknown coverage remains visible in the evidence.'],
      evidence,
      parseError,
      ...(parseError ? { unparsedStdout: run.stdout.toString('utf8') } : {}),
      stderr: run.stderr.toString('utf8'),
    };
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, JSON.stringify(report, null, 2) + '\n', { mode: 0o600 });
    console.log(JSON.stringify({ report: out, status: report.execution.status, exitCode: run.exitCode, sourceFiles: scope.files.length, statistics: report.summary?.statistics, applicationCoverage: report.summary?.applicationCoverage?.status ?? 'unavailable', semanticCoverage: report.summary?.semanticCoverage?.status ?? 'unavailable' }, null, 2));
    if (!successful) process.exitCode = 1;
  } finally { await rm(temporary, { recursive: true, force: true }); }
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
