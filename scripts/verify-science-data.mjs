// Offline audit of immutable originals; writes nothing and fetches no URL.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { SCIENCE_PACK_HASH, SCIENCE_RECORDS } from '../src/data/science-data.ts';

const root = new URL('../public/data/', import.meta.url);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const readJson = async name => JSON.parse(await readFile(new URL(name, root), 'utf8'));
const packBytes = await readFile(new URL('mod13q1-research-pack.json', root));
assert.equal(digest(packBytes), SCIENCE_PACK_HASH, 'Hash do pack original não confere.');
const pack = JSON.parse(packBytes.toString('utf8'));
assert.equal(pack.records.length, 6);
assert.equal(SCIENCE_RECORDS.length, 6);
const seenIds = new Set();
const sources = new Map();
for (const letter of ['A', 'B', 'C']) {
  const rawBytes = await readFile(new URL(`mod13q1-${letter}-raw.json`, root));
  const raw = JSON.parse(rawBytes.toString('utf8'));
  const receipt = await readJson(`mod13q1-${letter}-retrieval.json`);
  const reference = pack.retrievals.find(item => item.sourceId === receipt.sourceId);
  assert.ok(reference, `Fonte ${letter} ausente do pack.`);
  assert.equal(digest(rawBytes), reference.sha256);
  assert.equal(digest(rawBytes), receipt.sha256);
  assert.equal(rawBytes.length, reference.bytes);
  assert.equal(rawBytes.length, receipt.bytes);
  assert.equal(receipt.url, reference.url);
  assert.equal(receipt.retrievedAt, reference.retrievedAt);
  assert.deepEqual(raw.subset, receipt.data);
  sources.set(receipt.sourceId, { raw, sha256: digest(rawBytes), retrievedAt: receipt.retrievedAt });
}
const valueOf = (raw, date, band) => {
  const matches = raw.subset.filter(item => item.modis_date === date && item.band === band);
  assert.equal(matches.length, 1, `${date}/${band}: exige uma amostra.`);
  assert.equal(matches[0].data.length, 1);
  return matches[0].data[0];
};
for (const record of SCIENCE_RECORDS) {
  assert.ok(!seenIds.has(record.id), `ID duplicado: ${record.id}`);
  seenIds.add(record.id);
  const original = pack.records.find(item => item.id === record.id);
  assert.ok(original, `Registro ${record.id} ausente no original.`);
  for (const key of Object.keys(record).filter(key => key !== 'observationDate')) assert.deepEqual(record[key], original[key], `${record.id}/${key}`);
  const source = sources.get(record.sourceId);
  assert.ok(source, `Fonte de ${record.id} ausente.`);
  const { raw } = source;
  assert.equal(raw.latitude, record.latitudeRequested);
  assert.equal(raw.longitude, record.longitudeRequested);
  const fields = {
    redInteger: '250m_16_days_red_reflectance',
    nirInteger: '250m_16_days_NIR_reflectance',
    viQuality: '250m_16_days_VI_Quality',
    pixelReliability: '250m_16_days_pixel_reliability',
  };
  for (const [field, band] of Object.entries(fields)) assert.equal(record[field], valueOf(raw, record.modisDate, band));
  assert.equal(record.ndviProduct, valueOf(raw, record.modisDate, '250m_16_days_NDVI') * record.scale + record.offset);
  const dayOfYear = valueOf(raw, record.modisDate, '250m_16_days_composite_day_of_the_year');
  assert.equal(dayOfYear, original.pixelDayOfYear);
  const year = Number(record.modisDate.slice(1, 5));
  const observationDate = new Date(Date.UTC(year, 0, dayOfYear)).toISOString().slice(0, 10);
  assert.equal(record.observationDate, observationDate, 'Data do pixel derivada do DOY original.');
  const compositeEntries = raw.subset.filter(item => item.modis_date === record.modisDate);
  assert.ok(compositeEntries.every(item => item.calendar_date === record.compositeStart));
}
console.log(JSON.stringify({
  ok: true,
  sciencePackHash: SCIENCE_PACK_HASH,
  records: SCIENCE_RECORDS.length,
  sources: [...sources].map(([sourceId, { sha256, retrievedAt }]) => ({ sourceId, sha256, retrievedAt })),
  observationDates: [...new Set(SCIENCE_RECORDS.map(record => record.observationDate))],
  note: 'Confere transformação e integridade local; não autentica origem ou elegibilidade. Nenhum original foi alterado.',
}, null, 2));
