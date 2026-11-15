import { copyFile, mkdir } from 'node:fs/promises';
// Runtime imports belong in src; publish identical, downloadable JSON snapshots.
const output = new URL('../public/data/science/', import.meta.url);
await mkdir(output, { recursive: true });
for (const name of ['bennu-records.json', 'webb-spectrum-subset.json']) {
  await copyFile(new URL(`../src/data/science/${name}`, import.meta.url), new URL(name, output));
}
