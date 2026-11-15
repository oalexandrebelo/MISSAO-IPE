import { readFile } from 'node:fs/promises';
// Native REST adapter, verified against vercel/storage main on 2026-11-15.
// API 13: src/api.ts, helpers.ts, put.ts, put-helpers.ts, list.ts and get.ts.
const API = 'https://vercel.com/api/blob';
const PREFIX = 'r21/records/';
export class StorageUnavailable extends Error {}
export async function currentManagedOidcToken() {
  // The request context is supplied by the Vercel runtime, not req.headers or user JSON.
  // This follows @vercel/oidc's get-context.ts and token-source precedence.
  const context = globalThis[Symbol.for('@vercel/request-context')]?.get?.();
  const requestToken = context?.headers?.['x-vercel-oidc-token'];
  const token = requestToken ?? (process.env.VERCEL_OIDC_TOKEN_FILE ? await readFile(process.env.VERCEL_OIDC_TOKEN_FILE, 'utf8') : process.env.VERCEL_OIDC_TOKEN);
  if (typeof token !== 'string' || !token.trim()) throw new StorageUnavailable('Identidade temporária indisponível.');
  return token.trim();
}
export function createBlobRepository({ storeId: configuredStoreId, getToken = currentManagedOidcToken }, fetcher = fetch) {
  const storeId = configuredStoreId?.startsWith('store_') ? configuredStoreId.slice(6) : configuredStoreId;
  if (!/^[a-zA-Z0-9]+$/.test(storeId ?? '')) throw new StorageUnavailable('Armazenamento indisponível.');
  const origin = `https://${storeId.toLowerCase()}.private.blob.vercel-storage.com`;
  const safePath = path => {
    if (typeof path !== 'string' || !/^(?:r21\/(?:records|revoked)\/[a-f0-9-]+\/(?:profile|(?:inventory-)?event-[a-f0-9-]+|(?:inventory-)?attempt-[a-f0-9-]+)|r27\/inventory\/[a-f0-9-]+\/state)\.json$/.test(path)) throw new StorageUnavailable('Caminho inválido.');
    return path;
  };
  async function call(url, options = {}) {
    try {
      // Read afresh for every operation: production OIDC tokens rotate.
      const token = await getToken();
      if (typeof token !== 'string' || !token.trim()) throw new StorageUnavailable('Identidade temporária indisponível.');
      const headers = { authorization: `Bearer ${token}`, 'x-api-version': '13', 'x-vercel-blob-store-id': storeId };
      return await fetcher(url, { ...options, redirect: 'error', signal: AbortSignal.timeout(12_000), headers: { ...headers, ...options.headers } });
    }
    catch { throw new StorageUnavailable('Armazenamento temporariamente indisponível.'); }
  }
  async function get(path) {
    const response = await call(`${origin}/${safePath(path)}?cache=0`);
    if (response.status === 404) return null;
    if (!response.ok) throw new StorageUnavailable('Não foi possível ler o registro.');
    try { return await response.json(); } catch { throw new StorageUnavailable('Registro indisponível.'); }
  }
  return {
    get,
    async getVersioned(path) {
      const response = await call(`${origin}/${safePath(path)}?cache=0`);
      if (response.status === 404) return null;
      const etag = response.headers.get('etag');
      if (!response.ok || !etag) throw new StorageUnavailable('Não foi possível ler a versão do inventário.');
      try { return { document: await response.json(), etag }; }
      catch { throw new StorageUnavailable('Inventário indisponível.'); }
    },
    async compareAndSwap(path, document, etag) {
      if (!path.startsWith('r27/inventory/') || typeof etag !== 'string' || !etag || /[\r\n]/.test(etag)) throw new StorageUnavailable('Versão inválida.');
      // Vercel's official put-helpers.ts maps ifMatch to x-if-match. Private cache=0 reads
      // bypass the CDN; this compare is enforced by storage, not a warm-instance mutex.
      const response = await call(`${API}/?${new URLSearchParams({ pathname: safePath(path) })}`, {
        method: 'PUT', headers: { 'content-type': 'application/json', 'x-content-type': 'application/json', 'x-vercel-blob-access': 'private', 'x-add-random-suffix': '0', 'x-allow-overwrite': '1', 'x-if-match': etag, 'x-cache-control-max-age': '60', 'x-ttl-days': '90' }, body: JSON.stringify(document),
      });
      if (response.status === 412) return false;
      if (!response.ok) throw new StorageUnavailable('Não foi possível confirmar a versão do inventário.');
      return true;
    },
    async putIfAbsent(path, document) {
      const response = await call(`${API}/?${new URLSearchParams({ pathname: safePath(path) })}`, { method: 'PUT', headers: { 'content-type': 'application/json', 'x-content-type': 'application/json', 'x-vercel-blob-access': 'private', 'x-add-random-suffix': '0', 'x-allow-overwrite': '0', 'x-cache-control-max-age': '60', 'x-ttl-days': '90' }, body: JSON.stringify(document) });
      if (response.ok) return { created: true, document };
      // A lost acknowledgement or an existing immutable path is resolved by reading it.
      if ([400, 409, 412].includes(response.status)) { const existing = await get(path); if (existing) return { created: false, document: existing }; }
      throw new StorageUnavailable('Não foi possível salvar o registro.');
    },
    async list(cursor) {
      const search = new URLSearchParams({ prefix: PREFIX, limit: '100' });
      if (cursor) search.set('cursor', cursor);
      const response = await call(`${API}?${search}`);
      if (!response.ok) throw new StorageUnavailable('Não foi possível ler o painel.');
      const listing = await response.json();
      if (!Array.isArray(listing.blobs) || typeof listing.hasMore !== 'boolean' || (listing.hasMore && typeof listing.cursor !== 'string')) throw new StorageUnavailable('Página inválida.');
      const documents = [];
      const pending = [...listing.blobs];
      await Promise.all(Array.from({ length: Math.min(8, pending.length) }, async () => {
        while (pending.length) {
          const blob = pending.shift();
          // Never follow a URL returned in a listing: construct the exact private origin.
          const document = await get(blob.pathname);
          if (document) documents.push(document);
        }
      }));
      return { documents, cursor: listing.hasMore ? listing.cursor : null, hasMore: listing.hasMore };
    },
  };
}
