import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { request } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = 45179;
const cases = [];
let output = '';
let status = 'not-run';
const child = spawn(process.execPath, ['scripts/serve.mjs', '--port', String(port)], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
const ready = new Promise(resolve => {
  const deadline = setTimeout(() => resolve(false), 3_000);
  const append = chunk => { output += chunk; if (output.includes('Missão Ipê local:')) { clearTimeout(deadline); resolve(true); } };
  child.stdout.on('data', append);
  child.stderr.on('data', append);
  child.once('exit', () => { clearTimeout(deadline); resolve(false); });
  child.once('error', error => { output += error.message; clearTimeout(deadline); resolve(false); });
});
function probe(method, path) {
  return new Promise((resolve, reject) => {
    const call = request({ host: '127.0.0.1', port, method, path }, response => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve({ method, path, status: response.statusCode, headers: response.headers, bodyBytes: Buffer.concat(chunks).length, bodySha256: createHash('sha256').update(Buffer.concat(chunks)).digest('hex') }));
    });
    call.on('error', reject); call.setTimeout(2_000, () => call.destroy(new Error('HTTP timeout'))); call.end();
  });
}
try {
  if (!await ready) status = /EPERM|EACCES|operation not permitted/i.test(output) ? 'blocked-by-socket-permission' : 'server-did-not-start';
  else {
    const checks = [['GET', '/', 200], ['HEAD', '/', 200], ['POST', '/', 405], ['GET', '/not-present-file', 404], ['GET', '/%2e%2e%2fpackage.json', 403], ['GET', '/%00', 400], ['GET', '/%5cpackage.json', 400], ['GET', '/%', 400]];
    for (const [method, path, expected] of checks) {
      const result = await probe(method, path); cases.push({ ...result, expected });
      assert.equal(result.status, expected, `${method} ${path}`);
      assert.equal(result.headers['x-content-type-options'], 'nosniff');
      assert.ok(result.headers['content-security-policy']);
      if (method === 'HEAD') assert.equal(result.bodyBytes, 0);
    }
    status = 'passed';
  }
} catch (error) { status = 'failed'; output += `\n${error.stack}`; process.exitCode = 1; }
finally {
  child.kill();
  await mkdir(new URL('../evidence/', import.meta.url), { recursive: true });
  await writeFile(new URL('../evidence/server-http-smoke.json', import.meta.url), JSON.stringify({ checkedAt: new Date().toISOString(), command: 'node scripts/smoke-server.mjs', status, node: process.version, serverSha256: createHash('sha256').update(await readFile(new URL('./serve.mjs', import.meta.url))).digest('hex'), binding: '127.0.0.1', port, attempts: 1, output, cases, scope: 'Node HTTP service smoke only; no browser, rendering or offline claim. Permission refusal is recorded and no bypass or retry is attempted.' }, null, 2) + '\n');
}
console.log(JSON.stringify({ status, output, cases }, null, 2));
if (status !== 'passed') process.exitCode = 1;
