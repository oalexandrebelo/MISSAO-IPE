import assert from 'node:assert/strict';
import test from 'node:test';
import { CATALOG, DEFAULT_CONFIG, getConfigTotals, getScenario } from '../src/core/catalog.ts';
import { CATALOG_VERSION } from '../src/core/contracts.ts';
import { simulateMission } from '../src/core/engine.ts';
import {
  DEFAULT_EXPEDITION_CONFIGS, EXPEDITION_MODEL_VERSION, getExpeditionChoices,
  getExpeditionPreflight, getExpeditionSchedule, simulateExpedition,
} from '../src/lab/scientific-expeditions.ts';
import type { ExpeditionId } from '../src/lab/scientific-expeditions.ts';
import { getSpacecraftPresentation } from '../src/lab/spacecraft-presentation.ts';

test('Cerrado scientific load is historical-file processing, never a MODIS camera', () => {
  for (const processing of ['bands', 'index'] as const) {
    const presentation = getSpacecraftPresentation({ world: 'earth', config: { ...DEFAULT_CONFIG, processing } });
    const choice = CATALOG.processing.find(item => item.id === processing)!;
    assert.equal(presentation.payload.kind, 'processor');
    assert.equal(presentation.payload.id, processing);
    assert.equal(presentation.payload.label, choice.label);
    assert.equal(presentation.payload.bitsPerRecord, choice.bitsPerRecord);
    assert.equal(presentation.payload.totalLoadW, choice.totalLoadW);
    assert.equal(presentation.payload.massKg, choice.massKg);
    assert.equal(presentation.payload.credits, choice.credits);
    assert.equal(presentation.payload.goalCompatible, true);
    assert.match(presentation.payload.principle, /arquivos históricos/);
    assert.equal(presentation.source.version, CATALOG_VERSION);
  }
});

test('changing Cerrado panels or battery changes only the corresponding catalog values and relative size', () => {
  const base = getSpacecraftPresentation({ world: 'earth', config: { ...DEFAULT_CONFIG } });
  const panel = getSpacecraftPresentation({ world: 'earth', config: { ...DEFAULT_CONFIG, panel: 'compact' } });
  const battery = getSpacecraftPresentation({ world: 'earth', config: { ...DEFAULT_CONFIG, battery: 'large' } });
  assert.ok(panel.energy.panelW < base.energy.panelW);
  assert.ok(panel.energy.panelRatio < base.energy.panelRatio);
  assert.equal(panel.energy.batteryWh, base.energy.batteryWh);
  assert.ok(battery.energy.batteryWh > base.energy.batteryWh);
  assert.ok(battery.energy.batteryRatio > base.energy.batteryRatio);
  assert.equal(battery.energy.panelW, base.energy.panelW);
  assert.deepEqual(panel.payload, base.payload);
  assert.deepEqual(battery.communications, base.communications);
});

test('Cerrado radio changes hardware/rate while contact scenario and policy remain separate', () => {
  const base = getSpacecraftPresentation({ world: 'earth', config: { ...DEFAULT_CONFIG } });
  const faster = getSpacecraftPresentation({ world: 'earth', config: { ...DEFAULT_CONFIG, radio: 'fast' } });
  const shorter = getSpacecraftPresentation({ world: 'earth', config: { ...DEFAULT_CONFIG, policy: 'last-contact' }, scenarioId: 'short-contact' });
  assert.equal(base.communications.radioHardware, 'economy');
  assert.equal(faster.communications.radioHardware, 'fast');
  assert.equal(faster.communications.rateBps, CATALOG.radio.find(item => item.id === 'fast')!.rateBps);
  assert.deepEqual(base.communications.contacts, getScenario('long-contact').contacts);
  assert.deepEqual(shorter.communications.contacts, getScenario('short-contact').contacts);
  assert.equal(shorter.communications.radioHardware, base.communications.radioHardware);
  assert.equal(shorter.communications.rateBps, base.communications.rateBps);
  assert.match(shorter.communications.scheduleLabel, /Último contato/);
  assert.notEqual(base.configurationKey, shorter.configurationKey);
});

test('Cerrado memory and combined subsystem costs come from the selected components', () => {
  const config = { ...DEFAULT_CONFIG, buffer: 'compact' as const, battery: 'large' as const, radio: 'fast' as const };
  const presentation = getSpacecraftPresentation({ world: 'earth', config });
  const battery = CATALOG.battery.find(item => item.id === config.battery)!;
  const panel = CATALOG.panel.find(item => item.id === config.panel)!;
  const buffer = CATALOG.buffer.find(item => item.id === config.buffer)!;
  assert.equal(presentation.energy.massKg, (Math.round(battery.massKg * 1000) + Math.round(panel.massKg * 1000)) / 1000);
  assert.equal(presentation.energy.credits, battery.credits + panel.credits);
  assert.equal(presentation.storage.bufferBits, buffer.capacityBits);
  assert.equal(presentation.storage.massKg, buffer.massKg);
  assert.equal(presentation.storage.credits, buffer.credits);
  assert.deepEqual(presentation.totals, getConfigTotals(config));
});

test('expeditions render the instrument actually chosen, including an incompatible instrument', () => {
  for (const world of ['bennu', 'telescope'] as const) {
    for (const instrument of ['camera', 'spectrometer'] as const) {
      const config = { ...DEFAULT_EXPEDITION_CONFIGS[world], instrument };
      const presentation = getSpacecraftPresentation({ world, expeditionConfig: config });
      const choice = getExpeditionChoices(world).instrument.find(item => item.id === instrument)!;
      assert.equal(presentation.payload.kind, instrument);
      assert.equal(presentation.payload.id, instrument);
      assert.equal(presentation.payload.bitsPerRecord, choice.bitsPerRecord);
      assert.equal(presentation.payload.totalLoadW, choice.totalLoadW);
      assert.equal(presentation.payload.goalCompatible, getExpeditionPreflight(world, config).constraints.find(item => item.id === 'instrument')!.met);
      assert.equal(presentation.source.version, EXPEDITION_MODEL_VERSION);
    }
  }
});

test('instrument explanations stay in the selected mission and explain incompatible choices', () => {
  for (const world of ['bennu', 'telescope'] as const) {
    for (const instrument of ['camera', 'spectrometer'] as const) {
      const { payload } = getSpacecraftPresentation({
        world, expeditionConfig: { ...DEFAULT_EXPEDITION_CONFIGS[world], instrument },
      });
      assert.match(payload.principle, world === 'bennu' ? /Bennu/ : /WASP-39 b/);
      assert.doesNotMatch(payload.principle, world === 'bennu' ? /WASP-39|Webb/ : /Bennu/);
      if (!payload.goalCompatible) assert.match(payload.principle, /não atende/);
    }
  }
});

test('expedition energy is one package: capacities scale but package mass/credits are not counted twice', () => {
  for (const world of ['bennu', 'telescope'] as const) {
    const compact = getSpacecraftPresentation({ world, expeditionConfig: { ...DEFAULT_EXPEDITION_CONFIGS[world], power: 'compact' } });
    const extended = getSpacecraftPresentation({ world, expeditionConfig: { ...DEFAULT_EXPEDITION_CONFIGS[world], power: 'extended' } });
    const choice = getExpeditionChoices(world).power.find(item => item.id === 'extended')!;
    assert.equal(extended.energy.panelW, choice.watts);
    assert.equal(extended.energy.batteryWh, choice.capacityWh);
    assert.equal(extended.energy.maxDischargeW, choice.maxDischargeW);
    assert.equal(extended.energy.massKg, choice.massKg);
    assert.equal(extended.energy.credits, choice.credits);
    assert.ok(extended.energy.panelRatio > compact.energy.panelRatio);
    assert.ok(extended.energy.batteryRatio > compact.energy.batteryRatio);
    assert.equal(extended.energy.panelRatio, 1);
    assert.equal(extended.energy.batteryRatio, 1);
  }
});

test('longer expedition contacts keep the same radio and bitrate without inventing spacecraft mass', () => {
  for (const world of ['bennu', 'telescope'] as const) {
    const shortConfig = { ...DEFAULT_EXPEDITION_CONFIGS[world], ground: 'short' as const };
    const longConfig = { ...shortConfig, ground: 'extended' as const };
    const short = getSpacecraftPresentation({ world, expeditionConfig: shortConfig });
    const long = getSpacecraftPresentation({ world, expeditionConfig: longConfig });
    assert.equal(short.communications.radioHardware, 'generic');
    assert.equal(long.communications.radioHardware, short.communications.radioHardware);
    assert.equal(long.communications.rateBps, short.communications.rateBps);
    assert.equal(long.communications.massKg, 0);
    assert.equal(short.totals.massKg, long.totals.massKg);
    assert.deepEqual(short.communications.contacts, getExpeditionSchedule(world, shortConfig).contacts);
    assert.deepEqual(long.communications.contacts, getExpeditionSchedule(world, longConfig).contacts);
    assert.notEqual(short.communications.credits, long.communications.credits);
    assert.deepEqual(short.energy, long.energy);
  }
});

test('presentation retains planned contact times and labels the chosen short lifetime honestly', () => {
  const config = { ...DEFAULT_EXPEDITION_CONFIGS.telescope, launch: 'science' as const, orbit: 'far' as const, duration: 'short' as const };
  const presentation = getSpacecraftPresentation({ world: 'telescope', expeditionConfig: config });
  assert.deepEqual(presentation.communications.contacts, getExpeditionSchedule('telescope', config).contacts);
  assert.match(presentation.communications.scheduleLabel, /L2 conceitual/);
  assert.match(presentation.communications.effect, /120 min|2 horas/);
  assert.ok(presentation.communications.contacts.some(([start]) => start > 7200));
});

test('an executed presentation remains tied to its frozen result when a draft is edited', () => {
  const draft = { ...DEFAULT_EXPEDITION_CONFIGS.bennu };
  const result = simulateExpedition('bennu', draft);
  const before = JSON.stringify(result);
  const executed = getSpacecraftPresentation({ world: 'bennu', expeditionConfig: result.config });
  draft.instrument = 'spectrometer'; draft.power = 'extended';
  const edited = getSpacecraftPresentation({ world: 'bennu', expeditionConfig: draft });
  assert.equal(executed.payload.kind, 'camera');
  assert.equal(edited.payload.kind, 'spectrometer');
  assert.notEqual(executed.configurationKey, edited.configurationKey);
  assert.deepEqual(executed, getSpacecraftPresentation({ world: 'bennu', expeditionConfig: result.config }));
  assert.equal(JSON.stringify(result), before);
});

test('presentation does not freeze caller inputs, mutate engine results, or depend on input property order', () => {
  const config = { ...DEFAULT_CONFIG };
  const result = simulateMission(config, 'long-contact');
  const before = JSON.stringify(result);
  const a = getSpacecraftPresentation({ world: 'earth', config: result.config });
  const b = getSpacecraftPresentation({ world: 'earth', config: { policy: config.policy, buffer: config.buffer, radio: config.radio, processing: config.processing, panel: config.panel, battery: config.battery } });
  assert.equal(a.configurationKey, b.configurationKey);
  assert.equal(JSON.stringify(result), before);
  assert.ok(!Object.isFrozen(config));
  assert.ok(Object.isFrozen(a));
  assert.ok(Object.isFrozen(a.energy.metrics));
  assert.ok(Object.isFrozen(a.communications.contacts));
});

test('every two-choice expedition catalog produces finite metrics and ratios within the catalog maximum', () => {
  for (const world of ['bennu', 'telescope'] as ExpeditionId[]) {
    const choices = getExpeditionChoices(world);
    for (const [key, options] of Object.entries(choices)) for (const option of options) {
      const config = { ...DEFAULT_EXPEDITION_CONFIGS[world], [key]: option.id };
      const presentation = getSpacecraftPresentation({ world, expeditionConfig: config });
      for (const part of [presentation.payload, presentation.energy, presentation.communications]) assert.ok(part.metrics.every(metric => Number.isFinite(metric.value) && metric.unit && metric.name));
      assert.ok(presentation.energy.panelRatio > 0 && presentation.energy.panelRatio <= 1);
      assert.ok(presentation.energy.batteryRatio > 0 && presentation.energy.batteryRatio <= 1);
      const { massKg, credits } = getExpeditionPreflight(world, config).totals;
      assert.deepEqual(presentation.totals, { massKg, credits });
    }
  }
});
