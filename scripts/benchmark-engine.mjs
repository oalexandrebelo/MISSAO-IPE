import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import os from 'node:os';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { DEFAULT_CONFIG } from '../src/core/catalog.ts';
import { ENGINE_VERSION, CATALOG_VERSION } from '../src/core/contracts.ts';
import { searchCatalog } from '../src/core/search.ts';
import { simulateMission } from '../src/core/engine.ts';
import { SCIENCE_PACK_HASH } from '../src/data/science-data.ts';

const warmup = 30;
const sampleCount = 200;
const percentile = (sorted, p) => sorted[Math.max(0, Math.ceil(sorted.length * p) - 1)];
const workloads = [];
for (const scenarioId of ['long-contact', 'short-contact']) {
  for (const kind of ['single-mission', 'exhaustive-64']) {
    const run = () => kind === 'single-mission' ? simulateMission({ ...DEFAULT_CONFIG }, scenarioId) : searchCatalog({ ...DEFAULT_CONFIG }, scenarioId);
    for (let i = 0; i < warmup; i += 1) run();
    const samplesMs = [];
    let result;
    for (let i = 0; i < sampleCount; i += 1) {
      const start = performance.now();
      result = run();
      samplesMs.push(performance.now() - start);
    }
    const sorted = [...samplesMs].sort((a, b) => a - b);
    if (kind === 'exhaustive-64') {
      assert.equal(result.total, 64);
      assert.equal(result.evaluated, 64);
      assert.equal(result.complete, true);
      assert.equal(result.indeterminate, 0);
      assert.equal(result.minimumDistance, scenarioId === 'long-contact' ? 0 : 2);
    } else assert.equal(result.deliveredRecords, scenarioId === 'long-contact' ? 6 : 2);
    workloads.push({ kind, scenarioId, warmup, sampleCount, trace: true, p50Ms: percentile(sorted, .5), p95Ms: percentile(sorted, .95), minMs: sorted[0], maxMs: sorted.at(-1), meanMs: samplesMs.reduce((a, b) => a + b, 0) / sampleCount, result: kind === 'exhaustive-64' ? { evaluated: result.evaluated, invalid: result.invalid, successful: result.successful, failed: result.failed, indeterminate: result.indeterminate, minimumDistance: result.minimumDistance } : { outcome: result.outcome, deliveredRecords: result.deliveredRecords, tracePoints: result.trace.length }, samplesMs });
  }
}
const sourceFiles = ['src/core/engine.ts', 'src/core/exact.ts', 'src/core/power.ts', 'src/core/science.ts', 'src/core/catalog.ts', 'src/core/contracts.ts', 'src/core/search.ts', 'src/data/science-data.ts'];
const sourceSha256 = Object.fromEntries(await Promise.all(sourceFiles.map(async file => [file, createHash('sha256').update(await readFile(new URL(`../${file}`, import.meta.url))).digest('hex')])));
const evidence = { measuredAt: new Date().toISOString(), command: 'node scripts/benchmark-engine.mjs', engineVersion: ENGINE_VERSION, catalogVersion: CATALOG_VERSION, sciencePackHash: SCIENCE_PACK_HASH, environment: { node: process.version, v8: process.versions.v8, platform: os.platform(), release: os.release(), arch: os.arch(), cpuModel: os.cpus()[0]?.model, logicalCpus: os.cpus().length, availableParallelism: os.availableParallelism(), totalMemoryBytes: os.totalmem(), processMemoryAfterBytes: process.memoryUsage(), loadAverageAtEnd: os.loadavg() }, protocol: { clock: 'node:perf_hooks performance.now; milliseconds', percentile: 'nearest rank, ceil(N*p)-1 in ascending samples', invocation: 'synchronous real core; sequential samples; default trace included', excludes: ['Module loading/Node startup', 'Worker messaging/startup', 'React render', 'GPU/rendering/FPS', 'Persistence/replay hashes', 'Cold offline browser startup'], caveat: 'Shared executor measurements; no CPU pinning or thermal/power control. Not a benchmark of AB hardware or a browser guarantee.' }, sourceSha256, workloads };
await mkdir(new URL('../evidence/', import.meta.url), { recursive: true });
await writeFile(new URL('../evidence/engine-benchmark.json', import.meta.url), JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify({ engineVersion: ENGINE_VERSION, sampleCount, warmup, workloads: workloads.map(({ samplesMs, ...item }) => item) }, null, 2));
