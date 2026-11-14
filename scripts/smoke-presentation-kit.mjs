#!/usr/bin/env node
/** HTTP verification of the presentation kit; does not launch a browser. */
import assert from 'node:assert/strict';
import { request } from 'node:http';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createKitServer } from './serve-presentation-kit.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
if (args.length && !(args.length === 2 && args[0] === '--report')) throw new Error('Uso: node scripts/smoke-presentation-kit.mjs [--report arquivo.json]');
const reportPath = args.length ? resolve(args[1]) : resolve(root, 'evidence/presentation-kit-http-qa.json');
const server = await createKitServer();
await new Promise((ok, fail) => { server.once('error', fail); server.listen(0, '127.0.0.1', ok); });
const port = server.address().port;
const cases = [];
function get(path, method = 'GET') {
  return new Promise((ok, fail) => {
    const req = request({hostname:'127.0.0.1', port, path, method}, res => {
      const parts=[]; res.on('data', part=>parts.push(part));
      res.on('end', ()=>ok({status:res.statusCode, headers:res.headers, body:Buffer.concat(parts)}));
      res.on('error', fail);
    });
    req.setTimeout(10000, ()=>req.destroy(new Error('HTTP timeout')));
    req.on('error', fail); req.end();
  });
}
async function check(name, fn) { try {await fn(); cases.push({name,passed:true});} catch(e) {cases.push({name,passed:false,error:String(e.message)});} }
function equalBytes(response, bytes) {assert.equal(response.status,200);assert.deepEqual(response.body,bytes);}
try {
  await check('Launcher at root is the bundled HTML', async()=>equalBytes(await get('/'), await readFile(resolve(root,'kit/COMECE_AQUI.html'))));
  await check('Every local launcher link resolves through HTTP', async()=>{
    const html=(await get('/')).body.toString();
    const hrefs=[...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1]).filter(v=>v.startsWith('ab-mission-ipe/'));
    assert.ok(hrefs.length>=10);
    for(const href of hrefs) assert.equal((await get('/'+href)).status,200,href);
  });
  await check('Presentation bytes match source file', async()=>equalBytes(await get('/ab-mission-ipe/presentation/Missao_Ipe_Apresentacao.html'),await readFile(resolve(root,'presentation/Missao_Ipe_Apresentacao.html'))));
  await check('Presentation CSP permits only bundled inline scripts and self', async()=>{
    const r=await get('/ab-mission-ipe/presentation/Missao_Ipe_Apresentacao.html');
    const csp=r.headers['content-security-policy']; assert.ok(csp.includes("script-src 'self'"));
    assert.ok(!/script-src[^;]*'unsafe-(?:inline|eval)'/.test(csp));
    const html=r.body.toString().replace(/\r\n?/g,'\n');
    for(const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)) if(m[1].trim()) assert.ok(csp.includes("'sha256-"+createHash('sha256').update(m[1]).digest('base64')+"'"));
    assert.equal(r.headers['x-content-type-options'],'nosniff');
  });
  await check('Game build index and referenced JS/CSS load', async()=>{
    const r=await get('/ab-mission-ipe/dist/index.html'); assert.equal(r.status,200);
    const urls=[...r.body.toString().matchAll(/(?:src|href)="(\.\/assets\/[^\"]+)"/g)].map(m=>m[1]); assert.ok(urls.length>=2);
    for(const url of urls) assert.equal((await get('/ab-mission-ipe/dist/'+url.slice(2))).status,200,url);
  });
  await check('Portable game bytes match previous game build', async()=>equalBytes(await get('/ab-mission-ipe/portable/Missao_Ipe_Local.html'),await readFile(resolve(root,'portable/Missao_Ipe_Local.html'))));
  await check('Base dossier PDF is served with PDF MIME', async()=>{
    const r=await get('/ab-mission-ipe/output/pdf/AB_Missao_Ipe_Dossie_Implementacao.pdf'); assert.equal(r.status,200);assert.equal(r.headers['content-type'],'application/pdf');assert.equal(r.body.subarray(0,5).toString(),'%PDF-');
  });
  await check('Study and updated research are reachable', async()=>{
    for(const path of ['output/html/AB_Missao_Ipe_Estudo_Integral.html','research/11-revisao-spaceapps-apresentacao.md','docs/12-HANDOFF-APRESENTACAO.md']) assert.equal((await get('/ab-mission-ipe/'+path)).status,200,path);
  });
  await check('HEAD preserves content length without a response body', async()=>{
    const r=await get('/','HEAD');assert.equal(r.status,200);assert.equal(r.body.length,0);assert.equal(Number(r.headers['content-length']),(await readFile(resolve(root,'kit/COMECE_AQUI.html'))).length);
  });
  await check('Mutation verbs are refused', async()=>{const r=await get('/','POST');assert.equal(r.status,405);assert.equal(r.headers.allow,'GET, HEAD');});
  await check('Plain and encoded path traversal are refused', async()=>{
    for(const path of ['/ab-mission-ipe/../README.md','/ab-mission-ipe/%2e%2e/README.md','/ab-mission-ipe/docs/%2e%2e/README.md']) assert.equal((await get(path)).status,403,path);
  });
  await check('Malformed and forbidden path bytes are refused', async()=>{
    for(const path of ['/ab-mission-ipe/%zz','/ab-mission-ipe/%00','/ab-mission-ipe/%5cREADME.md']) assert.equal((await get(path)).status,400,path);
  });
  await check('Non-published files and absent files are not exposed', async()=>{
    for(const path of ['/ab-mission-ipe/.env','/ab-mission-ipe/node_modules/package.json','/ab-mission-ipe/scripts/serve-presentation-kit.mjs','/ab-mission-ipe/output/packages/AB_Missao_Ipe_R4_Projeto_Completo_0.1.1.zip','/ab-mission-ipe/presentation/missing.html']) assert.equal((await get(path)).status,404,path);
  });
} finally {await new Promise(resolveClose=>server.close(resolveClose));}
const verifiedFiles=[];
for(const path of ['kit/COMECE_AQUI.html','scripts/serve-presentation-kit.mjs','scripts/smoke-presentation-kit.mjs','presentation/Missao_Ipe_Apresentacao.html','portable/Missao_Ipe_Local.html','dist/index.html','docs/12-HANDOFF-APRESENTACAO.md']) {
  const bytes=await readFile(resolve(root,path));verifiedFiles.push({path,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
const report={checkedAt:new Date().toISOString(),node:process.version,scope:'Native Node loopback HTTP; no browser, layout, GPU, CSP execution or offline cold start',command:'node scripts/smoke-presentation-kit.mjs',passed:cases.filter(c=>c.passed).length,failed:cases.filter(c=>!c.passed).length,verifiedFiles,cases};
await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
if(report.failed) process.exitCode=1;
