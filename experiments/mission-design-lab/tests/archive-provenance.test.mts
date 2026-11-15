import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const scienceFile = (name: string) => new URL(`../public/data/science/${name}`, import.meta.url);
const sha256 = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');
for (const name of ['bennu-records.json', 'webb-spectrum-subset.json']) assert.deepEqual(readFileSync(scienceFile(name)), readFileSync(new URL(`../src/data/science/${name}`, import.meta.url)), `Public download must match the simulation dataset: ${name}`);

test('Webb published bins retain NASA units, uncertainty and exact source rows offline', () => {
  const raw = readFileSync(scienceFile('webb-firefly-nasa.tbl'));
  assert.equal(sha256(raw), '49a41e9eacaec33457b5c5d249bb9803da1ab0a07ea99fa2b4b5a8d0e24de687');
  const rows = raw.toString().split(/\r?\n/).flatMap((line, index) =>
    line && !line.startsWith('\\') && !line.startsWith('|')
      ? [{ line: index + 1, values: line.trim().split(/\s+/).slice(0, 5).map(Number) }]
      : []);
  assert.equal(rows.length, 95);

  const subset = JSON.parse(readFileSync(scienceFile('webb-spectrum-subset.json'), 'utf8')) as {
    sourceSha256: string; totalSourceRows: number;
    records: Array<{ id: string; value: number; unit: string; archiveFileLine: number;
      binWidthMicrometers: number; uncertaintyUnit: string;
      evidence: { kind: string; sourceRow: number; observedAt: string; uncertainty: number; wavelengthMicrometers: number };
    }>;
  };
  assert.equal(subset.sourceSha256, sha256(raw));
  assert.equal(subset.totalSourceRows, rows.length);
  assert.deepEqual(subset.records.map(record => record.evidence.sourceRow), [25, 39, 54, 58, 65, 80]);
  assert.equal(new Set(subset.records.map(record => record.id)).size, 6);
  for (const record of subset.records) {
    const source = rows[record.evidence.sourceRow - 1]!;
    const [wavelength, width, depth, positiveError, negativeError] = source.values;
    assert.equal(record.archiveFileLine, source.line);
    assert.equal(record.evidence.kind, 'spectrum');
    assert.equal(record.evidence.observedAt, '2022-07-10');
    assert.equal(record.evidence.wavelengthMicrometers, wavelength);
    assert.equal(record.binWidthMicrometers, width);
    assert.equal(record.value, depth);
    assert.equal(record.evidence.uncertainty, positiveError);
    assert.equal(positiveError, -negativeError!);
    assert.equal(record.unit, '% de luz bloqueada');
    assert.equal(record.uncertaintyUnit, 'pontos percentuais (1σ)');
  }
});

test('all 95 NASA spectrum rows agree with the pinned author reduction after fraction-to-percent conversion', () => {
  const author = readFileSync(new URL('../../../research/webb-r18/FIREFLY_REDUCTION.txt', import.meta.url));
  assert.equal(sha256(author), '83e5e45d5867f1abe6a8776469d4284daf2630f66b7f67736453d912a6bfdd27');
  const authorRows = author.toString().trim().split(/\r?\n/).slice(1).map(line => line.trim().split(/\s+/).map(Number));
  const nasaRows = readFileSync(scienceFile('webb-firefly-nasa.tbl'), 'utf8').split(/\r?\n/)
    .filter(line => line && !line.startsWith('\\') && !line.startsWith('|'))
    .map(line => line.trim().split(/\s+/).slice(0, 5).map(Number));
  assert.equal(authorRows.length, 95);
  assert.equal(nasaRows.length, authorRows.length);
  for (const [index, original] of authorRows.entries()) {
    const [wavelength, depthFraction, width, errorFraction] = original;
    const converted = [wavelength!, width!, depthFraction! * 100, errorFraction! * 100];
    // Archive ingestion/formatting may differ from one-step rounding. One last
    // displayed digit (five decimal places) is the verified source tolerance.
    converted.forEach((value, column) => assert.ok(Math.abs(nasaRows[index]![column]! - value) <= 0.00001,
      `NASA row ${index + 1}, column ${column + 1}: fraction/percentage or source mismatch`));
  }
});

test('Bennu selects six distinct published objects while retaining the seventh audit row', () => {
  const raw = readFileSync(scienceFile('bennu-table1.csv'));
  const expectedHash = 'f93100752685e4842176bc6cd128866e35c24405e6e266fbacddde70f237251e';
  assert.equal(sha256(raw), expectedHash);
  const [header, ...lines] = raw.toString().trim().split(/\r?\n/);
  const columns = header!.split(',');
  const rows = lines.map(line => Object.fromEntries(line.split(',').map((value, index) => [columns[index]!, value])));
  assert.equal(rows.length, 7);
  assert.deepEqual(rows.map(row => row.site), ['1', '2', '3', '4a', '4b', '5', '6']);
  assert.equal(rows.find(row => row.site === '4b')!.longAxisM, '0.927');

  const provenance = JSON.parse(readFileSync(scienceFile('bennu-provenance.json'), 'utf8')) as {
    derivedFiles: Array<{ file: string; sha256: string }>;
  };
  assert.equal(provenance.derivedFiles.find(file => file.file === 'bennu-table1.csv')?.sha256, expectedHash);
  const records = JSON.parse(readFileSync(scienceFile('bennu-records.json'), 'utf8')) as Array<{
    id: string; value: number; unit: string; dimensions: { longAxisM: number; shortAxisM: number; heightM: number };
    evidence: { kind: string; sourceRow: string; uncertainty: string; latitudeDeg: number; longitudeDeg: number };
  }>;
  assert.equal(records.length, 6);
  assert.equal(new Set(records.map(record => record.id)).size, 6);
  assert.deepEqual(records.map(record => record.id), ['1', '2', '3', '4a', '5', '6'].map(site => `bennu-site-${site}`));
  for (const record of records) {
    const site = record.id.replace('bennu-site-', '');
    const source = rows.find(row => row.site === site)!;
    assert.ok(source, `Missing published source for ${record.id}`);
    assert.equal(record.unit, 'm');
    assert.equal(record.value, Number(source.longAxisM));
    assert.deepEqual(record.dimensions, {
      longAxisM: Number(source.longAxisM), shortAxisM: Number(source.shortAxisM), heightM: Number(source.heightM),
    });
    assert.equal(record.evidence.kind, 'boulder');
    assert.equal(record.evidence.latitudeDeg, Number(source.latitudeDeg));
    assert.equal(record.evidence.longitudeDeg, Number(source.longitudeDeg));
    assert.ok(record.evidence.sourceRow.includes(`Site ${site} ·`));
    assert.match(record.evidence.uncertainty, /5,25 cm\/pixel/);
    assert.match(record.evidence.uncertainty, /não declarada como ±1σ/);
  }
});
