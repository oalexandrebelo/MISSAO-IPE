import { createMetricsHandler } from './handler.mjs';
import { createBlobRepository } from './blob.mjs';

let handler;

export default async function metrics(req, res) {
  try {
    handler ??= createMetricsHandler({
      repository: createBlobRepository({ storeId: process.env.BLOB_STORE_ID }),
      signingSecret: process.env.METRICS_SIGNING_SECRET,
      adminSecret: process.env.METRICS_ADMIN_SECRET,
      deploymentHost: process.env.VERCEL_URL,
    });
    return await handler(req, res);
  } catch {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'private, no-store');
    res.statusCode = 503;
    res.end(JSON.stringify({ error: 'O registro de participação está temporariamente indisponível.' }));
  }
}
