import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const project = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const lockBytes = await readFile(path.join(root, 'package-lock.json'));
const lock = JSON.parse(lockBytes);
const packages = [];
for (const [installPath, locked] of Object.entries(lock.packages)) {
  if (!installPath) continue;
  let installed = null;
  let licenses = [];
  try {
    const directory = path.join(root, installPath);
    installed = JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8'));
    for (const name of await readdir(directory)) {
      if (!/^(license|licence|copying)(\.|$)/i.test(name)) continue;
      try { const bytes = await readFile(path.join(directory, name)); licenses.push({ file: `${installPath}/${name}`, bytes: bytes.length, sha256: sha(bytes) }); } catch {}
    }
  } catch {}
  packages.push({ installPath, name: installed?.name ?? installPath.split('node_modules/').at(-1), lockedVersion: locked.version, installedVersion: installed?.version ?? null, versionMatches: installed ? installed.version === locked.version : null, licenseMetadata: installed?.license ?? locked.license ?? null, dev: locked.dev === true, optional: locked.optional === true, integrityPresent: typeof locked.integrity === 'string', licenseFiles: licenses });
}
const runtimePackages = packages.filter(item => !item.dev && item.installedVersion !== null);
const sourceFiles = [];
async function walk(directory) { for (const entry of await readdir(directory, { withFileTypes: true })) { const full = path.join(directory, entry.name); if (entry.isDirectory()) await walk(full); else if (/\.(tsx?|css)$/.test(entry.name)) sourceFiles.push(full); } }
await walk(path.join(root, 'src'));
sourceFiles.push(path.join(root, 'index.html'));
const urlLiterals = [];
const networkApiMatches = [];
const remoteAssetMatches = [];
const sourceSha256 = {};
for (const full of sourceFiles.sort()) {
  const file = path.relative(root, full);
  const content = await readFile(full, 'utf8');
  sourceSha256[file] = sha(content);
  content.split('\n').forEach((line, index) => {
    for (const match of line.matchAll(/https?:\/\/[^\s"'<>`]+/g)) urlLiterals.push({ file, line: index + 1, url: match[0], commentOnly: /^\s*(?:\/\/|\*)/.test(line) });
    if (/\b(fetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon\s*\(|importScripts\s*\()/.test(line) && !/^\s*(?:\/\/|\*)/.test(line)) networkApiMatches.push({ file, line: index + 1, text: line.trim().slice(0, 300) });
    if (/(?:src|href)\s*=\s*["']https?:|url\(\s*["']?https?:|@import\s+["']https?:|(?:from\s*|import\s*\()\s*["']https?:/.test(line)) remoteAssetMatches.push({ file, line: index + 1, text: line.trim().slice(0, 300) });
  });
}
const output = { auditedAt: new Date().toISOString(), command: 'node scripts/audit-release.mjs', packageLockSha256: sha(lockBytes), project: { name: project.name, version: project.version, licenseMetadata: project.license ?? null, private: project.private, declaredRuntime: project.dependencies, declaredDevelopment: project.devDependencies }, inventory: { lockPackageEntries: packages.length, installedEntries: packages.filter(item => item.installedVersion).length, versionMismatches: packages.filter(item => item.versionMatches === false), missingLicenseMetadata: packages.filter(item => !item.licenseMetadata).map(item => item.installPath), runtimePackages }, packages, staticRuntimeScan: { filesScanned: sourceFiles.length, urlLiterals, networkApiMatches, remoteAssetMatches, sourceSha256, scope: 'Application src TS/TSX/CSS and index.html; source-code inspection, not browser/network execution', limitations: ['Regex scan is not a formal proof of all possible network behavior', 'No cold offline browser test', 'License metadata/file hashes inventory does not establish full legal compliance', 'Build tool downloads/npm bootstrap are outside runtime scope'] } };
await mkdir(path.join(root, 'evidence'), { recursive: true });
await writeFile(path.join(root, 'evidence', 'release-dependencies-network.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ packageCount: packages.length, installedCount: output.inventory.installedEntries, runtime: runtimePackages.map(({ name, installedVersion, licenseMetadata, licenseFiles }) => ({ name, installedVersion, licenseMetadata, licenseFiles })), mismatches: output.inventory.versionMismatches, missingLicenseMetadata: output.inventory.missingLicenseMetadata, filesScanned: sourceFiles.length, urlLiterals, networkApiMatches, remoteAssetMatches }, null, 2));
