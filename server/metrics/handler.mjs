import { createHmac, randomUUID, timingSafeEqual, createHash } from 'node:crypto';
import { InvalidInput, normalizeEvent, object, UUID } from './model.mjs';
import { StorageUnavailable } from './blob.mjs';
import { createInventoryService, InventoryConflict } from './inventory.mjs';

const PLAYER = 'ipe_player', ADMIN = 'ipe_metrics_admin';
const BODY_LIMIT = 32_768, SESSION_SECONDS = 30 * 86400, ADMIN_SECONDS = 8 * 3600;
const PRODUCTION_ORIGINS = ['https://projeto-ipe.vercel.app', 'https://missao-ipe-alexandrebelo.vercel.app', 'https://missao-ipe-git-main-alexandrebelo.vercel.app', 'https://nasa-missaoipe.alexandrebelo.com'];
class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }
const profilePath = id => `r21/records/${id}/profile.json`;
const eventPath = event => `r21/records/${event.sessionId}/${event.kind === 'attempt' ? `attempt-${event.payload.attemptId}` : `event-${event.id}`}.json`;
const publicSession = profile => ({ sessionId: profile.sessionId, name: profile.name, startedAt: profile.startedAt });

function sameSecret(a, b) {
  const digest = value => createHash('sha256').update(value).digest();
  return timingSafeEqual(digest(a), digest(b));
}
function cookieValue(req, key) {
  const raw = req.headers.cookie;
  if (typeof raw !== 'string') return null;
  return raw.split(';').map(item => item.trim()).find(item => item.startsWith(`${key}=`))?.slice(key.length + 1) ?? null;
}
function tokenFor(payload, secret) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${createHmac('sha256', secret).update(body).digest('base64url')}`;
}
function readToken(token, secret, role, now) {
  if (typeof token !== 'string' || token.length > 1024 || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token)) return null;
  const [body, signature] = token.split('.');
  if (!sameSecret(signature, createHmac('sha256', secret).update(body).digest('base64url'))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (payload.role !== role || !Number.isFinite(payload.exp) || payload.exp <= now / 1000 || (role === 'player' && !UUID.test(payload.id))) return null;
    return payload;
  } catch { return null; }
}
async function bodyOf(req) {
  if (Number(req.headers['content-length']) > BODY_LIMIT) throw new HttpError(413, 'Pedido muito grande.');
  if (!String(req.headers['content-type'] ?? '').toLowerCase().startsWith('application/json')) throw new HttpError(415, 'Envie JSON.');
  if (req.body !== undefined) {
    const serialized = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    if (Buffer.byteLength(serialized) > BODY_LIMIT) throw new HttpError(413, 'Pedido muito grande.');
    try { return JSON.parse(serialized); } catch { throw new InvalidInput('JSON inválido.'); }
  }
  const chunks = []; let size = 0;
  for await (const chunk of req) {
    size += Buffer.byteLength(chunk);
    if (size > BODY_LIMIT) throw new HttpError(413, 'Pedido muito grande.');
    chunks.push(Buffer.from(chunk));
  }
  try { return JSON.parse(Buffer.concat(chunks).toString()); } catch { throw new InvalidInput('JSON inválido.'); }
}

export function createMetricsHandler({ repository, signingSecret, adminSecret, now = Date.now, uuid = randomUUID, development = false, deploymentHost }) {
  if (typeof signingSecret !== 'string' || signingSecret.length < 32 || typeof adminSecret !== 'string' || adminSecret.length < 32) throw new Error('Configuração de métricas indisponível.');
  const origins = new Set(PRODUCTION_ORIGINS);
  const inventory = createInventoryService({ repository, now, uuid });
  if (deploymentHost && /^[a-zA-Z0-9.-]+\.vercel\.app$/.test(deploymentHost)) origins.add(`https://${deploymentHost}`);
  const limits = new Map();
  function limit(req, action) {
    // Best-effort per warm instance; this is not a distributed abuse-prevention service.
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? 'unknown').split(',')[0];
    const key = `${action}:${createHash('sha256').update(ip).digest('hex')}`;
    const windowMs = ['register', 'admin-login'].includes(action) ? 15 * 60_000 : 60_000;
    const max = action === 'register' ? 20 : action === 'admin-login' ? 10 : 120;
    const previous = limits.get(key), at = now();
    const entry = previous && previous.until > at ? previous : { count: 0, until: at + windowMs };
    if (++entry.count > max) throw new HttpError(429, 'Muitas solicitações. Aguarde e tente novamente.');
    if (limits.size >= 5000) {
      for (const [id, item] of limits) if (item.until <= at) limits.delete(id);
      if (limits.size >= 5000) limits.delete(limits.keys().next().value);
    }
    limits.set(key, entry);
  }
  function checkOrigin(req) {
    const origin = req.headers.origin;
    if (typeof origin !== 'string' || (!origins.has(origin) && !(development && /^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/.test(origin)))) throw new HttpError(403, 'Origem não autorizada.');
    if (req.headers['sec-fetch-site'] && !['same-origin', 'none'].includes(req.headers['sec-fetch-site'])) throw new HttpError(403, 'Origem não autorizada.');
  }
  function setCookie(res, key, value, age) {
    res.setHeader('Set-Cookie', `${key}=${value}; Path=/api/metrics; HttpOnly; SameSite=Strict; Max-Age=${age}${development ? '' : '; Secure'}`);
  }
  async function player(req) {
    const identity = readToken(cookieValue(req, PLAYER), signingSecret, 'player', now());
    if (!identity) return null;
    const profile = await repository.get(profilePath(identity.id));
    return profile?.type === 'profile' && profile.sessionId === identity.id ? profile : null;
  }
  async function owner(req, sessionId) {
    if (!UUID.test(sessionId)) throw new InvalidInput('Participação inválida.');
    const profile = await player(req);
    if (!profile) throw new HttpError(401, 'Sua sessão expirou. Entre novamente.');
    if (profile.sessionId !== sessionId) throw new HttpError(409, 'Outra participação está ativa neste navegador. Recarregue a página.');
    return profile;
  }
  function requireAdmin(req) {
    if (!readToken(cookieValue(req, ADMIN), signingSecret, 'admin', now())) throw new HttpError(401, 'Entre no painel privado da equipe.');
  }
  return async function handler(req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'private, no-store, max-age=0');
    res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Vary', 'Cookie');
    const send = (status, value) => { res.statusCode = status; res.end(JSON.stringify(value)); };
    try {
      if (!['GET', 'POST'].includes(req.method)) { res.setHeader('Allow', 'GET, POST'); throw new HttpError(405, 'Método não permitido.'); }
      const url = new URL(req.url, 'https://projeto-ipe.vercel.app');
      if (req.method === 'GET') {
        const action = url.searchParams.get('action');
        if (action === 'session') return send(200, { session: await player(req).then(value => value ? publicSession(value) : null) });
        if (action === 'inventory') {
          const profile = await owner(req, url.searchParams.get('sessionId'));
          limit(req, action);
          return send(200, { snapshot: await inventory.read(profile.sessionId) });
        }
        if (action === 'admin') {
          requireAdmin(req); limit(req, action);
          const cursor = url.searchParams.get('cursor');
          if (cursor && (cursor.length > 2048 || /[\x00-\x1f]/.test(cursor))) throw new InvalidInput('Cursor inválido.');
          const page = await repository.list(cursor);
          return send(200, {
            profiles: page.documents.filter(item => item.type === 'profile'),
            events: page.documents.filter(item => item.type === 'event'),
            cursor: page.cursor, hasMore: page.hasMore,
          });
        }
        throw new HttpError(404, 'Operação não encontrada.');
      }
      checkOrigin(req);
      const body = await bodyOf(req);
      if (!body || typeof body.action !== 'string') throw new InvalidInput('Ação inválida.');
      if (!['register', 'events', 'inventory-command', 'logout', 'admin-login', 'admin-logout'].includes(body.action)) throw new HttpError(404, 'Operação não encontrada.');
      limit(req, body.action);
      if (body.action === 'inventory-command') {
        object(body, ['action', 'sessionId', 'requestId', 'expectedRevision', 'command']);
        const profile = await owner(req, body.sessionId);
        return send(200, await inventory.command(profile.sessionId, { requestId: body.requestId, expectedRevision: body.expectedRevision, command: body.command }));
      }
      if (body.action === 'register') {
        object(body, ['action', 'name', 'email']);
        if (typeof body.name !== 'string' || typeof body.email !== 'string') throw new InvalidInput('Informe nome e e-mail.');
        const name = body.name.trim().normalize('NFC'), email = body.email.trim().toLowerCase();
        if (name.length < 2 || name.length > 80 || /[\x00-\x1f\x7f]/.test(name) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new InvalidInput('Revise nome e e-mail.');
        const current = await player(req);
        if (current && current.name === name && current.email === email) return send(200, publicSession(current));
        const sessionId = uuid(), startedAt = new Date(now()).toISOString();
        const profile = { schemaVersion: 1, type: 'profile', sessionId, name, email, startedAt, identity: 'self-declared', noticeVersion: 'r21-v1', expiresAt: new Date(now() + 90 * 86400_000).toISOString() };
        await repository.putIfAbsent(profilePath(sessionId), profile);
        setCookie(res, PLAYER, tokenFor({ role: 'player', id: sessionId, exp: Math.floor(now() / 1000) + SESSION_SECONDS }, signingSecret), SESSION_SECONDS);
        return send(201, publicSession(profile));
      }
      if (body.action === 'logout' || body.action === 'admin-logout') {
        if (body.action === 'logout') {
          object(body, ['action', 'sessionId']);
          if (!UUID.test(body.sessionId)) throw new InvalidInput('Participação inválida.');
          const identity = readToken(cookieValue(req, PLAYER), signingSecret, 'player', now());
          if (identity && identity.id !== body.sessionId) throw new HttpError(409, 'Outra participação está ativa neste navegador. Recarregue a página.');
        } else object(body, ['action']);
        setCookie(res, body.action === 'logout' ? PLAYER : ADMIN, '', 0); return send(200, { ok: true });
      }
      if (body.action === 'admin-login') {
        object(body, ['action', 'secret']);
        if (typeof body.secret !== 'string' || body.secret.length > 512 || !sameSecret(body.secret, adminSecret)) throw new HttpError(401, 'Acesso não autorizado.');
        setCookie(res, ADMIN, tokenFor({ role: 'admin', exp: Math.floor(now() / 1000) + ADMIN_SECONDS }, signingSecret), ADMIN_SECONDS);
        return send(200, { ok: true });
      }
      if (body.action === 'events') {
        object(body, ['action', 'sessionId', 'events']);
        if (!UUID.test(body.sessionId)) throw new InvalidInput('Participação inválida.');
        const profile = await player(req);
        if (!profile) throw new HttpError(401, 'Sua sessão expirou. Entre novamente.');
        if (profile.sessionId !== body.sessionId) throw new HttpError(409, 'Outra participação está ativa neste navegador. Recarregue a página.');
        if (!Array.isArray(body.events) || body.events.length < 1 || body.events.length > 20) throw new InvalidInput('Envie de 1 a 20 eventos.');
        const acceptedIds = [], rejected = [];
        const batchId = uuid();
        for (const [receivedOrder, input] of body.events.entries()) {
          try {
            const event = { ...normalizeEvent(input, profile.sessionId, new Date(now()).toISOString()), batchId, receivedOrder };
            // Offline R25/R26 queues remain history. They never touch the R27 wallet,
            // condition or rewards. Version-2 loadouts are refused by normalizeEvent.
            if (event.kind === 'attempt' && ['iss', 'moon', 'mars'].includes(event.mission)) event.legacyInventory = true;
            const saved = await repository.putIfAbsent(eventPath(event), event);
            if (!saved.created) {
              const existing = saved.document;
              if (existing.sessionId !== event.sessionId || existing.kind !== event.kind || existing.mission !== event.mission || JSON.stringify(existing.payload) !== JSON.stringify(event.payload)) throw new InvalidInput('Este identificador já registra outra ação.');
            }
            acceptedIds.push(event.id);
          } catch (error) {
            if (!(error instanceof InvalidInput)) throw error;
            rejected.push({ id: UUID.test(input?.id) ? input.id : null, reason: error.message });
          }
        }
        return send(200, { acceptedIds, rejected });
      }
      throw new HttpError(404, 'Operação não encontrada.');
    } catch (error) {
      if (error instanceof InventoryConflict) return send(409, { error: error.message, code: error.code, snapshot: error.snapshot });
      if (error instanceof HttpError) return send(error.status, { error: error.message });
      if (error instanceof InvalidInput) return send(400, { error: error.message });
      if (error instanceof StorageUnavailable) return send(503, { error: 'Não foi possível confirmar a gravação. Repita o mesmo pedido para conferir o recibo.', code: 'STORAGE_UNAVAILABLE' });
      return send(500, { error: 'Não foi possível concluir a operação.' });
    }
  };
}
