import { readFile, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
const original = await readFile('lib/fonts.ts');
try {
  await writeFile('lib/fonts.ts', await readFile('lib/fonts.offline.ts'));
  const result = await new Promise((resolve, reject) => { const child = spawn('pnpm', ['build'], { stdio:'inherit', shell:process.platform === 'win32' }); child.on('error', reject); child.on('exit', code => resolve(code ?? 1)); });
  process.exitCode = Number(result);
} finally { await writeFile('lib/fonts.ts', original); }
