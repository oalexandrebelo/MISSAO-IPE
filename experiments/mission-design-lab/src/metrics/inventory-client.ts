import type { BrunoConfig, BrunoMissionId, BrunoResult } from '../lab/bruno-missions.ts';
import type { createBrunoInventoryState } from '../lab/bruno-inventory.ts';
import type { MetricEvent } from './player-metrics.ts';

type InventoryState = ReturnType<typeof createBrunoInventoryState>;
export interface InventoryAttempt {
  attemptId: string;
  missionId: BrunoMissionId;
  status: 'launched' | 'completed' | 'cancelled';
  itemIds: string[];
  config: BrunoResult['config'];
  result: BrunoResult;
  launchedAt: string;
  finishedAt?: string;
  metricEvent?: MetricEvent;
}
export interface InventorySnapshot {
  schemaVersion: 2;
  revision: number;
  inventory: InventoryState;
  attempts: InventoryAttempt[];
}
export type InventoryCommand =
  | { kind: 'buy'; instrumentIds: InventoryState['items'][number]['instrumentId'][] }
  | { kind: 'return'; itemId: string }
  | { kind: 'equip'; missionId: BrunoMissionId; config: BrunoConfig; itemIds: string[] }
  | { kind: 'launch'; missionId: BrunoMissionId; config: BrunoConfig }
  | { kind: 'complete' | 'cancel'; attemptId: string }
  | { kind: 'reset' };
export interface InventoryRequest { requestId: string; expectedRevision: number; command: InventoryCommand }
export interface InventoryReceipt {
  requestId: string; operation: InventoryCommand['kind']; revision: number; eventId: string; at: string; attemptId?: string;
}
export interface InventoryCommandResponse { snapshot: InventorySnapshot; receipt: InventoryReceipt; attempt?: InventoryAttempt }
export class InventoryApiError extends Error {
  status: number;
  code: string;
  snapshot?: InventorySnapshot;
  uncertain: boolean;
  constructor(message: string, status: number, code: string, snapshot?: InventorySnapshot, uncertain = false) {
    super(message); this.status = status; this.code = code; this.snapshot = snapshot; this.uncertain = uncertain;
  }
}

function validSnapshot(value: unknown): value is InventorySnapshot {
  if (!value || typeof value !== 'object') return false;
  const snapshot = value as InventorySnapshot;
  return snapshot.schemaVersion === 2 && Number.isSafeInteger(snapshot.revision) && snapshot.revision >= 0
    && !!snapshot.inventory && Number.isSafeInteger(snapshot.inventory.version) && Number.isSafeInteger(snapshot.inventory.balance) && snapshot.inventory.balance >= 0
    && Array.isArray(snapshot.inventory.items) && snapshot.inventory.items.every(item => typeof item.id === 'string' && typeof item.instrumentId === 'string' && Number.isInteger(item.usesRemaining) && item.usesRemaining > 0)
    && !!snapshot.inventory.reservations && typeof snapshot.inventory.reservations === 'object' && !Array.isArray(snapshot.inventory.reservations)
    && Array.isArray(snapshot.attempts) && snapshot.attempts.every(attempt => typeof attempt.attemptId === 'string' && ['launched', 'completed', 'cancelled'].includes(attempt.status) && !!attempt.result);
}

async function request(url: string, body?: Record<string, unknown>) {
  let response: Response;
  try {
    response = await fetch(url, { method: body ? 'POST' : 'GET', credentials: 'same-origin', cache: 'no-store',
      signal: AbortSignal.timeout(25_000), ...(body ? { headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : {}) });
  } catch {
    throw new InventoryApiError(body ? 'A resposta não chegou. Repita o mesmo pedido para confirmar se foi registrado.' : 'Não foi possível consultar o inventário. Tente novamente.', 0, 'NETWORK_UNAVAILABLE', undefined, Boolean(body));
  }
  let value;
  try { value = await response.json(); }
  catch { throw new InventoryApiError('O servidor não confirmou o estado do inventário.', response.status, 'INVALID_RESPONSE', undefined, Boolean(body)); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new InventoryApiError('O servidor não confirmou o estado do inventário.', response.status, 'INVALID_RESPONSE', undefined, Boolean(body));
  if (!response.ok) throw new InventoryApiError(typeof value.error === 'string' ? value.error : 'Não foi possível concluir a operação.', response.status,
    typeof value.code === 'string' ? value.code : 'REQUEST_FAILED', validSnapshot(value.snapshot) ? value.snapshot : undefined, Boolean(body && response.status >= 500));
  if (!validSnapshot(value.snapshot)) throw new InventoryApiError('O servidor devolveu um inventário inválido.', response.status, 'INVALID_RESPONSE', undefined, Boolean(body));
  return value;
}

export async function readInventory(sessionId: string): Promise<InventorySnapshot> {
  const value = await request(`/api/metrics?${new URLSearchParams({ action: 'inventory', sessionId })}`);
  return value.snapshot;
}

// The caller keeps requestId AND expectedRevision after an uncertain response. Never retry
// a mutation automatically with a new ID: that would be a new purchase or launch.
export async function sendInventoryCommand(sessionId: string, command: InventoryRequest): Promise<InventoryCommandResponse> {
  const value = await request('/api/metrics', { action: 'inventory-command', sessionId, ...command });
  if (!value.receipt || value.receipt.requestId !== command.requestId || value.receipt.operation !== command.command.kind
    || !Number.isSafeInteger(value.receipt.revision) || value.receipt.revision > value.snapshot.revision) throw new InventoryApiError('O servidor não confirmou o recibo deste pedido.', 200, 'INVALID_RECEIPT', value.snapshot, true);
  return value;
}
