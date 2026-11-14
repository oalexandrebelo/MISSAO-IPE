import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { SCIENCE_PACK_HASH, SCIENCE_RECORDS } from '../src/data/science-data.ts';

const dataUrl = (name: string) => new URL(`../public/data/${name}`, import.meta.url);
const sha256 = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');

interface Retrieval {
  sourceId: string;
  bytes: number;
  sha256: string;
}
interface RawSubset {
  subset: { modis_date: string; band: string; data: number[] }[];
}

// The Sources screen publishes this hash. It must describe the actual served
// bytes, including trailing whitespace, rather than an unverified identifier.
test('published science package and raw files match their byte-exact provenance receipts', async () => {
  const packBytes = await readFile(dataUrl('mod13q1-research-pack.json'));
  assert.equal(sha256(packBytes), SCIENCE_PACK_HASH);
  const pack = JSON.parse(packBytes.toString('utf8')) as { retrievals: Retrieval[] };
  for (const region of ['A', 'B', 'C']) {
    const raw = await readFile(dataUrl(`mod13q1-${region}-raw.json`));
    const receipt = JSON.parse(await readFile(dataUrl(`mod13q1-${region}-retrieval.json`), 'utf8')) as Retrieval;
    assert.equal(raw.length, receipt.bytes, `Raw byte count for ${region}`);
    assert.equal(sha256(raw), receipt.sha256, `Raw SHA-256 for ${region}`);
    const packedReceipt = pack.retrievals.find(item => item.sourceId === receipt.sourceId);
    assert.ok(packedReceipt, `Package receipt for ${region}`);
    assert.equal(packedReceipt.sha256, receipt.sha256);
    assert.equal(packedReceipt.bytes, receipt.bytes);
  }
});

// This cross-checks the campaign against retained source responses. It does not
// reuse the campaign's QA implementation and does not claim source authenticity.
test('the six campaign records preserve the retained source bands, quality, NDVI and acquisition days', async () => {
  let matchedRecords = 0;
  for (const region of ['A', 'B', 'C']) {
    const raw = JSON.parse(await readFile(dataUrl(`mod13q1-${region}-raw.json`), 'utf8')) as RawSubset;
    const receipt = JSON.parse(await readFile(dataUrl(`mod13q1-${region}-retrieval.json`), 'utf8')) as Retrieval;
    const records = SCIENCE_RECORDS.filter(record => record.sourceId === receipt.sourceId);
    assert.equal(records.length, 2);
    for (const record of records) {
      const band = (name: string): number => {
        const values = raw.subset.filter(item => item.modis_date === record.modisDate && item.band === name);
        assert.equal(values.length, 1, `${record.id} / ${name}`);
        assert.equal(values[0]!.data.length, 1, 'Retained subset is one pixel, without an aggregation step');
        return values[0]!.data[0]!;
      };
      assert.equal(band('250m_16_days_red_reflectance'), record.redInteger);
      assert.equal(band('250m_16_days_NIR_reflectance'), record.nirInteger);
      assert.equal(band('250m_16_days_VI_Quality'), record.viQuality);
      assert.equal(band('250m_16_days_pixel_reliability'), record.pixelReliability);
      assert.equal(band('250m_16_days_NDVI') * 0.0001, record.ndviProduct);
      const year = Number(record.compositeStart.slice(0, 4));
      const day = band('250m_16_days_composite_day_of_the_year');
      const sourceDate = new Date(Date.UTC(year, 0, day)).toISOString().slice(0, 10);
      assert.equal(sourceDate, record.observationDate);
      matchedRecords++;
    }
  }
  assert.equal(matchedRecords, 6);
});
