import assert from 'node:assert/strict';
import { copyFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';

test('Vercel metrics API starts with the bundled JavaScript alone', async t => {
  const folder = await mkdtemp(join(tmpdir(), 'ipe-metrics-deployment-'));
  t.after(() => rm(folder, { force: true, recursive: true }));
  await mkdir(join(folder, 'api'));
  await mkdir(join(folder, 'server', 'metrics'), { recursive: true });
  const files = ['api/metrics.mjs', 'server/metrics/runtime.mjs'];
  await Promise.all(files.map(file => copyFile(new URL('../' + file, import.meta.url), join(folder, file))));

  process.env.BLOB_STORE_ID = 'syntheticStore';
  process.env.METRICS_SIGNING_SECRET = 'test-only-runtime-signing-' + '0'.repeat(32);
  process.env.METRICS_ADMIN_SECRET = 'test-only-runtime-admin-' + '0'.repeat(32);
  const fetch = t.mock.method(globalThis, 'fetch', () => assert.fail('Anonymous requests should not contact Blob'));
  const { default: metrics } = await import(pathToFileURL(join(folder, files[0])));
  const res = {
    headers: {},
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
    end(body) { this.body = JSON.parse(body); },
  };
  await metrics({ method: 'GET', url: '/api/metrics?action=session', headers: {} }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { session: null });
  await metrics({ method: 'GET', url: '/api/metrics?action=admin', headers: {} }, res);
  assert.equal(res.statusCode, 401);
  assert.match(res.headers['cache-control'], /private, no-store/);
  assert.equal(fetch.mock.callCount(), 0);
});
