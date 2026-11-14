import { build } from 'esbuild';
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const temporary = path.join(root, '.test-ui-cache');
await mkdir(temporary, { recursive: true });
await mkdir(path.join(root, 'evidence'), { recursive: true });
try {
  const entries = (await readdir(path.join(root, 'tests-ui'))).filter(name => name.endsWith('.test.mjs'));
  await build({ entryPoints: entries.map(name => path.join(root, 'tests-ui', name)), outdir: temporary, bundle: true, packages: 'external', platform: 'node', format: 'esm', jsx: 'automatic', target: 'node24', logLevel: 'warning' });
  const start = new Date().toISOString();
  const result = spawnSync(process.execPath, ['--test', '--test-concurrency=1', '--test-reporter=tap', ...entries.map(name => path.join(temporary, name.replace(/\.mjs$/, '.js')))], { cwd: root, encoding: 'utf8', timeout: 60_000 });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  process.stdout.write(output);
  await writeFile(path.join(root, 'evidence', 'ui-dom-test.tap'), output);
  await writeFile(path.join(root, 'evidence', 'ui-dom-test.json'), JSON.stringify({ startedAt: start, finishedAt: new Date().toISOString(), command: 'node scripts/test-ui.mjs', node: process.version, exitCode: result.status, signal: result.signal, error: result.error?.message ?? null, environment: 'jsdom; simulated DOM, not a browser', engine: 'real core engine and catalog search; no score or physics mocks', storage: 'fake-indexeddb; not browser durability', unavailableApis: ['WebGL context returns null', 'scrollTo no-op', 'HTMLDialogElement showModal/close open-attribute shim'], limitations: ['No real Worker execution', 'No browser rendering, layout, focus trap or accessibility-tree validation', 'No GPU/FPS measurement', 'No cold offline browser validation'] }, null, 2) + '\n');
  process.exitCode = result.status ?? 1;
} finally {
  await rm(temporary, { recursive: true, force: true });
}
