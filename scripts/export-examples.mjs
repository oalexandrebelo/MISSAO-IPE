#!/usr/bin/env node
// Research artefacts, not a new browser replay format or an authenticity claim.
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { DEFAULT_CONFIG, CONFIG_KEYS } from '../src/core/catalog.ts';
import { ENGINE_VERSION, CATALOG_VERSION } from '../src/core/contracts.ts';
import { simulateMission } from '../src/core/engine.ts';
import { enumerateConfigurations, searchCatalog } from '../src/core/search.ts';
import { exportReplay } from '../src/persistence/replay.ts';
import { SCIENCE_PACK_HASH } from '../src/data/science-data.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const examples = resolve(root, 'examples');
await mkdir(examples, { recursive: true });
const written = [];
for (const [name, scenarioId, config] of [
  ['01-long-base', 'long-contact', DEFAULT_CONFIG],
  ['02-short-base', 'short-contact', DEFAULT_CONFIG],
  ['03-short-repaired', 'short-contact', { ...DEFAULT_CONFIG, battery: 'large', processing: 'index' }],
]) {
  const result = simulateMission(config, scenarioId);
  const content = await exportReplay(result);
  const path = `examples/${name}.json`;
  await writeFile(resolve(root, path), content+'\n');
  written.push({ path, outcome: result.outcome, deliveredRecords: result.deliveredRecords,
    sha256: createHash('sha256').update(content+'\n').digest('hex') });
}
const configurations = enumerateConfigurations();
const scenarios = ['long-contact', 'short-contact'].map(scenarioId => {
  const search = searchCatalog(DEFAULT_CONFIG, scenarioId);
  return { scenarioId, search, rows: configurations.map(config => {
    const result = simulateMission(config, scenarioId, { trace: false });
    return { config, distanceFromBase: CONFIG_KEYS.reduce((n,key) => n+Number(config[key] !== DEFAULT_CONFIG[key]),0),
      outcome: result.outcome, deliveredRecords: result.deliveredRecords,
      massKg: result.massKg, credits: result.credits, completedAtS: result.completedAtS,
      generatedBits: result.generatedBits, downlinkedBits: result.downlinkedBits,
      queueBits: result.queueBits, lostBits: result.lostBits,
      minEnergyWh: result.minEnergyWh, finalEnergyWh: result.finalEnergyWh,
      violations: result.violations };
  }) };
});
const report = { generatedAt: new Date().toISOString(), engineVersion: ENGINE_VERSION,
  catalogVersion: CATALOG_VERSION, sciencePackHash: SCIENCE_PACK_HASH,
  kind: 'research-enumeration-not-a-browser-search-certificate',
  limits: 'Results from this engine; independent verification is recorded separately in adversarial-review.json. Hashes do not authenticate an author or certify flight validity.',
  examples: written, scenarios };
await mkdir(resolve(root, 'evidence'), { recursive: true });
await writeFile(resolve(root, 'evidence/catalog-enumeration.json'), JSON.stringify(report,null,2)+'\n');
process.stdout.write(JSON.stringify({ examples: written, scenarios: scenarios.map(s => ({ scenarioId: s.scenarioId, rows: s.rows.length, minimumDistance: s.search.minimumDistance })) },null,2)+'\n');
