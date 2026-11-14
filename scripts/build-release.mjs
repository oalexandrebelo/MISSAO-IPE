import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const packageJson = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
// These are public deployment identifiers, not credentials. Local builds have no commit claim.
const release = {
  name: 'PROJETO-IPÊ', version: packageJson.version,
  engineVersion: '0.1.1-rd', catalogVersion: 'ipe-64-v1', campaignVersion: 'ipe-campaign-v1',
  source: 'https://github.com/oalexandrebelo/PROJETO-IPE',
  commit: process.env.VERCEL_GIT_COMMIT_SHA || null,
  branch: process.env.VERCEL_GIT_COMMIT_REF || null,
  environment: process.env.VERCEL_ENV || 'local',
  builtAt: new Date().toISOString(),
};
await writeFile(new URL('public/release.json', root), JSON.stringify(release, null, 2) + '\n');
console.log(`Release: ${release.version}; ${release.environment}; commit ${release.commit || 'not asserted'}.`);
