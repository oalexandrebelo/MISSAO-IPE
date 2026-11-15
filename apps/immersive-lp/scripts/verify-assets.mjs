import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const manifest = JSON.parse(await readFile('docs/assets-manifest.json','utf8'));
for (const file of manifest.files) {
  const bytes = await readFile(file.path);
  if (bytes.length !== file.bytes || createHash('sha256').update(bytes).digest('hex') !== file.sha256) throw new Error(`Asset inconsistente: ${file.path}`);
}
const pkg = JSON.parse(await readFile('package.json','utf8'));
for (const name of Object.keys({...pkg.dependencies,...pkg.devDependencies})) {
  if (/^(three|@react-three\/|framer-motion|lottie|@radix-ui\/|shadcn)/.test(name)) throw new Error(`Dependência fora do briefing: ${name}`);
}
console.log(`${manifest.files.length} assets conferidos por tamanho e SHA-256; stack sem bibliotecas proibidas.`);
