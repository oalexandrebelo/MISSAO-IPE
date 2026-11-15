#!/usr/bin/env node
/** Exercise the real configuration generator and HTTP server in a temporary fixture.
 * Does not build site/, alter vercel.json or write publication evidence in the repo.
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createServer } from 'node:net';
import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { librasGuide } from './public-libras.mjs';

const project = fileURLToPath(new URL('../', import.meta.url));
const fixture = await mkdtemp(join(tmpdir(), 'ipe-planet-policy-'));
const origin = 'https://d2ol7oe51mr4n9.cloudfront.net';
const run = promisify(execFile);
let child;
try {
  await mkdir(join(fixture, 'scripts'));
  for (const name of ['package.json', 'scripts/prepare-vercel-static.mjs', 'scripts/serve-beta.mjs', 'scripts/public-libras.mjs', 'scripts/public-analytics.mjs']) await writeFile(join(fixture, name), await readFile(join(project, name)));
  const pages = ['equipe/index.html', 'dashboard/index.html', 'campanha/index.html', 'campanha/apresentacao/index.html', 'campanha/research/index.html', 'campanha/apresentacao/PROJETO-IPE-Pitch.pptx', 'campanha/kit/schema.prisma', 'index.html', 'planet-jumping.html', 'lab/index.html', 'game/index.html', 'presentation/Missao_Ipe_Apresentacao.html', 'presentation/pitch/index.html', 'architecture/index.html', 'context/index.html', 'context/research-library.html', 'docs/index.html', librasGuide];
  const portal = await readFile(join(project, 'web/planet-jumping.html'), 'utf8');
  for (const file of pages) {
    const destination = join(fixture, 'site', file);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, file === 'planet-jumping.html' ? portal : '<!doctype html><title>Local fixture</title><script>window.localPolicyFixture=true;</script>');
  }
  await run(process.execPath, ['scripts/prepare-vercel-static.mjs'], { cwd: fixture, timeout: 5000 });
  const config = JSON.parse(await readFile(join(fixture, 'vercel.json'), 'utf8'));
  const staticConfig = JSON.parse(await readFile(join(fixture, '.vercel/deploy-config.json'), 'utf8'));
  assert.deepEqual(config.headers, staticConfig.headers);
  assert.deepEqual(config.redirects, staticConfig.redirects);
  const { version } = JSON.parse(await readFile(join(fixture, 'package.json'), 'utf8'));
  assert.equal(JSON.parse(await readFile(join(fixture, '.vercel/upload-manifest.json'), 'utf8')).version, version);
  const policiesFor = route => config.headers.filter(rule => rule.source.includes('(') ? new RegExp(`^${rule.source}$`).test(route) : rule.source === route).flatMap(rule => rule.headers).filter(header => header.key.toLowerCase() === 'content-security-policy');
  for (const route of ['/', '/lab/index.html', '/game/index.html', '/campanha/index.html', '/planet-jumping.html', '/planet-jumpingXhtml', '/other/planet-jumping.html', '/planet-jumping.html/extra']) {
    const policies = policiesFor(route); assert.equal(policies.length, 1, route);
    assert.equal(policies[0].value.includes(origin), route === '/planet-jumping.html', route);
  }
  const portalCsp = policiesFor('/planet-jumping.html')[0].value;
  const globalCsp = policiesFor('/lab/index.html')[0].value;
  const portalScript = portal.match(/<script>([\s\S]*?)<\/script>/)[1];
  const hash = `'sha256-${createHash('sha256').update(portalScript).digest('base64')}'`;
  assert.ok(portalCsp.includes(hash)); assert.ok(!globalCsp.includes(hash));
  const directives = new Map(portalCsp.split(';').map(part => { const [key,...values] = part.trim().split(/\s+/); return [key,values]; }));
  assert.deepEqual(directives.get('img-src'), ["'self'", 'data:', 'blob:', origin]);
  assert.deepEqual(directives.get('media-src'), ["'self'", 'blob:', origin]);
  assert.deepEqual(directives.get('connect-src'), ["'self'", 'blob:', 'https://cloudflareinsights.com']);
  assert.deepEqual(directives.get('script-src').filter(value => value.startsWith('https:')), ['https://static.cloudflareinsights.com']);
  for (const [key,values] of directives) if (!['img-src', 'media-src', 'script-src', 'connect-src'].includes(key)) assert.ok(!values.some(value => value.startsWith('https:')), key);
  assert.deepEqual(globalCsp.match(/https?:\/\/[^;\s]+/g), ['https://static.cloudflareinsights.com', 'https://cloudflareinsights.com']);
  for (const route of ['/equipe', '/equipe/index.html', '/dashboard', '/dashboard/index.html', '/acessibilidade/libras.js', '/api', '/api/metrics']) {
    const policies = policiesFor(route); assert.equal(policies.length, 1, route);
    assert.doesNotMatch(policies[0].value, /https?:\/\//, route);
  }
  assert.deepEqual(policiesFor(`/${librasGuide}`).map(policy => policy.value), ["frame-ancestors 'self'; sandbox allow-scripts"]);
  console.log('PASS Generated Vercel and static-upload policies isolate the exact portal path, media origin and inline hash');

  const reservation = createServer();
  await new Promise((resolve,reject) => { reservation.once('error',reject); reservation.listen(0,'127.0.0.1',resolve); });
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  child = spawn(process.execPath, ['scripts/serve-beta.mjs','--port',String(port)], { cwd:fixture, stdio:['ignore','pipe','pipe'] });
  await new Promise((resolve,reject) => {
    const timeout = setTimeout(() => reject(new Error('Fixture server did not start')),5000);
    child.stdout.once('data',() => { clearTimeout(timeout); resolve(); });
    child.once('error',error => { clearTimeout(timeout); reject(error); });
    child.once('exit',code => { clearTimeout(timeout); reject(new Error(`Fixture server exited: ${code}`)); });
  });
  const local = `http://127.0.0.1:${port}`;
  for (const route of ['/', '/lab/index.html', '/game/index.html', '/campanha/index.html', '/planet-jumping.html', '/planet-jumping.html?test=1', '/equipe/index.html', '/dashboard/index.html', `/${librasGuide}`]) {
    const response = await fetch(local+route,{method:'HEAD',signal:AbortSignal.timeout(5000)});
    assert.equal(response.status,200,route);
    assert.equal(response.headers.get('content-security-policy'),policiesFor(route.split('?')[0])[0].value,route);
    assert.equal(response.headers.get('x-content-type-options'),'nosniff');
    assert.equal(response.headers.get('cache-control'),'no-store');
    assert.equal((await response.arrayBuffer()).byteLength,0);
  }
  for (const route of ['/planet-jumpingXhtml', '/other/planet-jumping.html', '/planet-jumping.html/extra']) {
    const response = await fetch(local+route,{signal:AbortSignal.timeout(5000)});
    assert.equal(response.status,404,route);assert.equal(response.headers.get('content-security-policy'),globalCsp,route);
    await response.arrayBuffer();
  }
  const redirect = await fetch(local+'/planet-jumping',{redirect:'manual',signal:AbortSignal.timeout(5000)});
  assert.equal(redirect.status,307);assert.equal(redirect.headers.get('location'),'/planet-jumping.html');
  assert.equal(redirect.headers.get('content-security-policy'),globalCsp);await redirect.arrayBuffer();
  console.log('PASS Real local HTTP applies route-specific CSP, preserves game restrictions, query strings, HEAD and negative routes');
  console.log('2 policy checks passed in an isolated fixture; no build or global evidence generated.');
} finally {
  if (child && child.exitCode === null) {
    const exited = new Promise(resolve => child.once('exit',resolve));child.kill('SIGTERM');
    await Promise.race([exited,new Promise(resolve => setTimeout(resolve,2000))]);
    if (child.exitCode === null) child.kill('SIGKILL');
  }
  await rm(fixture,{recursive:true,force:true});
}
