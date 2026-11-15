import { createMetricsHandler } from '../../../server/metrics/handler.mjs';

// A transport fixture only: all mission calculations remain the real application engine.
export const TEST_SESSION = { sessionId: '6dd12121-7b08-4ef8-ab06-1589f6d38bfa', name: 'Participante de teste', startedAt: '2026-11-15T12:00:00.000Z' };
export function installMetricsApi({ registered = true, unavailable = false } = {}) {
  let session = registered ? { ...TEST_SESSION } : null;
  const received = [];
  globalThis.fetch = async (url, options = {}) => {
    if (!String(url).startsWith('/api/metrics')) throw new Error(`Unexpected fetch in DOM fixture: ${url}`);
    if (unavailable) return new Response('{}', { status:503, headers:{'Content-Type':'application/json'} });
    const body = options.body ? JSON.parse(options.body) : null;
    if (!body) return Response.json({ session });
    if (body.action === 'register') { session = { ...TEST_SESSION, name: body.name }; return Response.json(session); }
    if (body.action === 'logout') { session = null; return Response.json({ ok:true }); }
    if (body.action === 'events') { received.push(...body.events); return Response.json({ acceptedIds:body.events.map(item => item.id), rejected:[] }); }
    throw new Error('Unsupported metrics fixture action');
  };
  return { received, getSession: () => session };
}

// Exercise inventory and scoring through the real handler, with in-memory conditional writes.
export async function installInventoryApi() {
  const records = new Map();
  const calls = [];
  const origin = 'https://projeto-ipe.vercel.app';
  let cookie;
  let loseAcknowledgement;
  let inventoryOnline = true;
  const repository = {
    async get(path) { return structuredClone(records.get(path)?.document ?? null); },
    async getVersioned(path) { return structuredClone(records.get(path) ?? null); },
    async putIfAbsent(path, document) {
      const saved = records.get(path);
      if (saved) return { created: false, document: structuredClone(saved.document) };
      records.set(path, { document: structuredClone(document), etag: '1' });
      return { created: true, document };
    },
    async compareAndSwap(path, document, etag) {
      if (records.get(path)?.etag !== etag) return false;
      records.set(path, { document: structuredClone(document), etag: String(Number(etag) + 1) });
      return true;
    },
  };
  let registerId = TEST_SESSION.sessionId;
  const handler = createMetricsHandler({ repository, signingSecret: 'local-ui-inventory-signing-secret-32', adminSecret: 'local-ui-inventory-admin-secret-32', uuid: () => {
    const id = registerId ?? crypto.randomUUID();
    registerId = undefined;
    return id;
  } });
  async function request(url, options = {}) {
    const body = options.body ? JSON.parse(options.body) : undefined;
    if (!String(url).startsWith('/api/metrics')) throw new Error(`Unexpected request: ${url}`);
    calls.push(body ?? String(url));
    if (!inventoryOnline && (body?.action === 'inventory-command' || String(url).includes('action=inventory'))) return Response.json({ error: 'Inventário fora do ar.' }, { status: 503 });
    const req = { method: options.method ?? 'GET', url, body, headers: { origin, cookie, 'content-type': 'application/json' } };
    const res = { headers: {}, setHeader(key, value) { this.headers[key.toLowerCase()] = value; }, end(text) { this.body = text; } };
    await handler(req, res);
    if (res.headers['set-cookie']) cookie = res.headers['set-cookie'].split(';')[0];
    if (loseAcknowledgement && body?.command?.kind === loseAcknowledgement && res.statusCode === 200) {
      loseAcknowledgement = undefined;
      return Response.json({ error: 'A resposta não chegou.' }, { status: 503 });
    }
    return new Response(res.body, { status: res.statusCode, headers: res.headers });
  }
  const registered = await request('/api/metrics', { method: 'POST', body: JSON.stringify({ action: 'register', name: TEST_SESSION.name, email: 'inventory@example.invalid' }) });
  if (!registered.ok) throw new Error('Fixture registration failed');
  globalThis.fetch = request;
  return {
    calls,
    async snapshot() { return (await (await request(`/api/metrics?action=inventory&sessionId=${TEST_SESSION.sessionId}`)).json()).snapshot; },
    loseNextAcknowledgement(kind) { loseAcknowledgement = kind; },
    setInventoryOnline(value) { inventoryOnline = value; },
  };
}
