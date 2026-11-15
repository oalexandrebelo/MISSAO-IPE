import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import { createMetricsHandler } from '../server/metrics/handler.mjs';
import { summarizeResult } from '../server/metrics/model.mjs';
import { DEFAULT_CONFIG } from '../experiments/mission-design-lab/src/core/catalog.ts';
import { simulateMission } from '../experiments/mission-design-lab/src/core/engine.ts';
import { DEFAULT_EXPEDITION_CONFIGS, simulateExpedition } from '../experiments/mission-design-lab/src/lab/scientific-expeditions.ts';
import { DEFAULT_BRUNO_CONFIG, simulateBrunoMission } from '../experiments/mission-design-lab/src/lab/bruno-missions.ts';

test('HTTP: six real mission results survive an identical retry and paginated private reading', async t => {
  const documents = new Map();
  const repository = {
    async get(key) { return documents.get(key) ?? null; },
    async putIfAbsent(key, value) {
      if (documents.has(key)) return { created: false, document: documents.get(key) };
      documents.set(key, structuredClone(value));
      return { created: true, document: value };
    },
    async list(cursor) {
      const offset = Number(cursor ?? 0), all = [...documents.values()];
      return { documents: all.slice(offset, offset + 2), hasMore: offset + 2 < all.length, cursor: offset + 2 < all.length ? String(offset + 2) : null };
    },
  };
  const adminSecret = 'local-http-test-admin-secret-only-32-bytes';
  const server = createServer(createMetricsHandler({ repository, signingSecret: 'local-http-test-signing-secret-only-32-bytes', adminSecret }));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => { server.closeAllConnections(); server.close(); });
  const url = `http://127.0.0.1:${server.address().port}/api/metrics`;
  async function request(action, body, cookie) {
    const response = await fetch(url + (body ? '' : `?action=${action}`), {
      method: body ? 'POST' : 'GET',
      headers: { origin: 'https://nasa-missaoipe.alexandrebelo.com', 'content-type': 'application/json', ...(cookie ? { cookie } : {}) },
      ...(body ? { body: JSON.stringify({ action, ...body }) } : {}),
    });
    return { status: response.status, data: await response.json(), cookie: response.headers.get('set-cookie')?.split(';')[0] };
  }
  const player = await request('register', { name: 'Local QA only', email: 'local@example.invalid' });
  assert.equal(player.status, 201);
  const missions = ['cerrado', 'bennu', 'telescope', 'iss', 'moon', 'mars'];
  const inputs = missions.map(mission => ({ id: randomUUID(), kind: 'attempt', mission, at: new Date().toISOString(), payload: {
    attemptId: randomUUID(), status: 'completed',
    config: mission === 'cerrado' ? DEFAULT_CONFIG : mission === 'bennu' || mission === 'telescope' ? DEFAULT_EXPEDITION_CONFIGS[mission] : { ...DEFAULT_BRUNO_CONFIG, launcher: 'heavy', energy: 'extended', protection: 'reinforced', navigation: 'deep-space' },
    ...(mission === 'cerrado' ? { scenarioId: 'long-contact' } : {}),
  } }));
  const body = { sessionId: player.data.sessionId, events: inputs };
  for (let i = 0; i < 2; i++) {
    const saved = await request('events', body, player.cookie);
    assert.equal(saved.status, 200);
    assert.deepEqual(saved.data.acceptedIds, inputs.map(input => input.id));
    assert.deepEqual(saved.data.rejected, []);
  }
  assert.equal((await request('admin')).status, 401);
  assert.equal((await request('admin', undefined, player.cookie)).status, 401);
  const admin = await request('admin-login', { secret: adminSecret });
  assert.equal(admin.status, 200);
  let cursor = null, pages = 0;
  const stored = [];
  do {
    const page = await request(`admin${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`, undefined, admin.cookie);
    assert.equal(page.status, 200);
    stored.push(...page.data.events);
    cursor = page.data.hasMore ? page.data.cursor : null;
    pages++;
    assert.ok(pages < 10, 'Pagination must finish');
  } while (cursor);
  assert.ok(pages > 1);
  assert.equal(stored.length, 6);
  assert.equal(new Set(stored.map(row => row.payload.attemptId)).size, 6);
  for (const input of inputs) {
    const { mission, payload } = input;
    const result = mission === 'cerrado' ? simulateMission(payload.config, payload.scenarioId, { trace: false })
      : mission === 'bennu' || mission === 'telescope' ? simulateExpedition(mission, payload.config)
      : simulateBrunoMission(mission, payload.config);
    const row = stored.find(item => item.mission === mission);
    assert.deepEqual(row.result, summarizeResult(result, mission), mission);
    assert.equal(row.sessionId, player.data.sessionId);
    assert.equal(Object.hasOwn(row.payload, 'score'), false);
  }
});
