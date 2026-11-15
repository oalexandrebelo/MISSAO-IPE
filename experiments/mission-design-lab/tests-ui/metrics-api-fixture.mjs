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
