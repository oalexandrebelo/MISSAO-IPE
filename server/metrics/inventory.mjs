import { createHash } from 'node:crypto';
import { applyBrunoInventoryCommand, createBrunoInventoryState, BRUNO_SUCCESS_REWARD, BrunoInventoryError } from '../../experiments/mission-design-lab/src/lab/bruno-inventory.ts';
import { validateBrunoConfig } from '../../experiments/mission-design-lab/src/lab/bruno-missions.ts';
import { InvalidInput, object, UUID, summarizeResult } from './model.mjs';
import { StorageUnavailable } from './blob.mjs';

const MISSIONS = ['iss', 'moon', 'mars', 'europa'];
const pathFor = sessionId => `r27/inventory/${sessionId}/state.json`;
// A legacy client can choose arbitrary event IDs. Its immutable paths must never
// preempt an authoritative outbox record with the same UUID.
const eventPath = event => `r21/records/${event.sessionId}/inventory-${event.kind === 'attempt' ? `attempt-${event.payload.attemptId}` : `event-${event.id}`}.json`;
export class InventoryConflict extends Error {
  constructor(code, message, snapshot) { super(message); this.code = code; this.snapshot = snapshot; }
}
export function inventorySnapshot(document) {
  return { schemaVersion: 2, revision: document.revision, inventory: document.inventory, attempts: Object.values(document.attempts) };
}

function normalizeCommand(input) {
  if (!input || typeof input.kind !== 'string') throw new InvalidInput('Comando de inventário inválido.');
  if (input.kind === 'buy') {
    object(input, ['kind', 'instrumentIds']);
    if (!Array.isArray(input.instrumentIds) || !input.instrumentIds.length || input.instrumentIds.length > 20 || input.instrumentIds.some(id => typeof id !== 'string' || id.length > 80)) throw new InvalidInput('Escolha de 1 a 20 instrumentos.');
    return { kind: 'buy', instrumentIds: [...input.instrumentIds] };
  }
  if (input.kind === 'return') {
    object(input, ['kind', 'itemId']);
    if (!UUID.test(input.itemId)) throw new InvalidInput('Unidade inválida.');
    return { kind: 'return', itemId: input.itemId };
  }
  if (input.kind === 'equip' || input.kind === 'launch') {
    object(input, input.kind === 'equip' ? ['kind', 'missionId', 'config', 'itemIds'] : ['kind', 'missionId', 'config']);
    if (!MISSIONS.includes(input.missionId) || !validateBrunoConfig(input.config)) throw new InvalidInput('Montagem ou missão inválida. Envie apenas as seis escolhas do projeto.');
    if (input.kind === 'equip' && (!Array.isArray(input.itemIds) || input.itemIds.length > 12 || input.itemIds.some(id => !UUID.test(id)) || new Set(input.itemIds).size !== input.itemIds.length)) throw new InvalidInput('Unidades da montagem inválidas.');
    const config = Object.fromEntries(['launcher', 'propulsion', 'energy', 'protection', 'navigation', 'payload'].map(key => [key, input.config[key]]));
    return { kind: input.kind, missionId: input.missionId, config, ...(input.kind === 'equip' ? { itemIds: [...input.itemIds] } : {}) };
  }
  if (input.kind === 'complete' || input.kind === 'cancel') {
    object(input, ['kind', 'attemptId']);
    if (!UUID.test(input.attemptId)) throw new InvalidInput('Tentativa inválida.');
    return { kind: input.kind, attemptId: input.attemptId };
  }
  if (input.kind === 'reset') { object(input, ['kind']); return { kind: 'reset' }; }
  throw new InvalidInput('Comando de inventário inválido.');
}

export function createInventoryService({ repository, now, uuid }) {
  async function load(sessionId) {
    if (!repository.getVersioned || !repository.compareAndSwap) throw new StorageUnavailable('Inventário transacional indisponível.');
    let saved = await repository.getVersioned(pathFor(sessionId));
    if (!saved) {
      await repository.putIfAbsent(pathFor(sessionId), { schemaVersion: 2, type: 'inventory', sessionId, revision: 0, inventory: createBrunoInventoryState(), receipts: {}, attempts: {}, outbox: [] });
      saved = await repository.getVersioned(pathFor(sessionId));
    }
    const value = saved?.document;
    if (!value || value.schemaVersion !== 2 || value.type !== 'inventory' || value.sessionId !== sessionId || !Number.isSafeInteger(value.revision) || value.revision < 0 || !value.inventory || !value.receipts || !value.attempts || !Array.isArray(value.outbox)) throw new StorageUnavailable('Formato do inventário indisponível.');
    return saved;
  }

  async function flush(sessionId) {
    const saved = await load(sessionId);
    if (!saved.document.outbox.length) return saved.document;
    for (const event of saved.document.outbox) {
      const write = await repository.putIfAbsent(eventPath(event), event);
      if (!write.created && JSON.stringify(write.document) !== JSON.stringify(event)) throw new StorageUnavailable('O recibo de uma operação diverge do registro.');
    }
    // A concurrent command may have appended more events; its ETag prevents losing them.
    await repository.compareAndSwap(pathFor(sessionId), { ...saved.document, outbox: [] }, saved.etag);
    return saved.document;
  }

  async function read(sessionId) { return inventorySnapshot(await flush(sessionId)); }

  async function command(sessionId, input) {
    object(input, ['requestId', 'expectedRevision', 'command']);
    if (!UUID.test(input.requestId) || !Number.isSafeInteger(input.expectedRevision) || input.expectedRevision < 0) throw new InvalidInput('Recibo ou versão do inventário inválidos.');
    const operation = normalizeCommand(input.command);
    const fingerprint = createHash('sha256').update(JSON.stringify({ expectedRevision: input.expectedRevision, command: operation })).digest('hex');
    const units = operation.kind === 'buy' ? operation.instrumentIds.map(instrumentId => ({ id: uuid(), instrumentId })) : null;
    const ledgerId = uuid();
    for (let retry = 0; retry < 6; retry++) {
      const saved = await load(sessionId);
      const current = saved.document;
      const snapshot = inventorySnapshot(current);
      const previous = current.receipts[input.requestId];
      if (previous) {
        if (previous.fingerprint !== fingerprint) throw new InventoryConflict('IDEMPOTENCY_CONFLICT', 'Este recibo já identifica outro pedido.', snapshot);
        const latest = await flush(sessionId);
        const { fingerprint: _fingerprint, ...receipt } = previous;
        return { snapshot: inventorySnapshot(latest), receipt, ...(previous.attemptId ? { attempt: latest.attempts[previous.attemptId] } : {}) };
      }
      if (input.expectedRevision !== current.revision) throw new InventoryConflict('VERSION_CONFLICT', 'O inventário mudou em outra aba. Revise o estado atualizado.', snapshot);
      const active = Object.values(current.attempts).filter(attempt => attempt.status === 'launched');
      const lockedItems = new Set(active.flatMap(attempt => attempt.itemIds));
      const lockedMission = active.some(attempt => attempt.missionId === operation.missionId);
      if ((operation.kind === 'reset' && active.length)
        || (['equip', 'launch'].includes(operation.kind) && lockedMission)
        || (operation.kind === 'return' && lockedItems.has(operation.itemId))
        || (operation.kind === 'equip' && operation.itemIds.some(id => lockedItems.has(id)))) throw new InventoryConflict('ACTIVE_FLIGHT', 'Há instrumentos em uma operação ativa. Conclua ou cancele essa operação primeiro.', snapshot);
      let inventory = current.inventory;
      const attempts = { ...current.attempts };
      let attempt, reward = 0;
      const at = new Date(now()).toISOString();
      try {
        if (operation.kind === 'complete' || operation.kind === 'cancel') {
          const original = attempts[operation.attemptId];
          if (!original) throw new InventoryConflict('ATTEMPT_NOT_FOUND', 'Esta tentativa não pertence à participação ativa.', snapshot);
          if (original.status !== 'launched') throw new InventoryConflict('ATTEMPT_FINALIZED', 'Esta tentativa já foi concluída ou cancelada.', snapshot);
          reward = operation.kind === 'complete' && original.result.outcome === 'success' ? BRUNO_SUCCESS_REWARD : 0;
          if (reward) inventory = { ...inventory, version: inventory.version + 1, balance: inventory.balance + reward };
          const status = operation.kind === 'complete' ? 'completed' : 'cancelled';
          const metricEvent = {
            schemaVersion: 2, type: 'event', id: original.attemptId, sessionId, kind: 'attempt', mission: original.missionId,
            at, receivedAt: at, payload: { attemptId: original.attemptId, status, config: original.config, inventoryRevision: current.revision + 1 },
            ...(status === 'completed' ? { result: summarizeResult(original.result, original.missionId) } : {}),
          };
          attempt = { ...original, status, finishedAt: at, metricEvent };
          attempts[attempt.attemptId] = attempt;
        } else {
          const domainCommand = operation.kind === 'buy' ? { kind: 'purchase', units }
            : operation.kind === 'return' ? { kind: 'refund', itemId: operation.itemId } : operation;
          const applied = applyBrunoInventoryCommand(inventory, domainCommand);
          inventory = applied.state;
          if (operation.kind === 'launch') {
            const itemIds = [...(current.inventory.reservations[operation.missionId] ?? [])];
            attempt = { attemptId: input.requestId, missionId: operation.missionId, status: 'launched', itemIds, config: applied.result.config, result: applied.result, launchedAt: at };
            attempts[attempt.attemptId] = attempt;
          }
        }
      } catch (error) {
        if (error instanceof BrunoInventoryError) throw new InventoryConflict(error.code, error.message, snapshot);
        throw error;
      }
      const wear = current.inventory.items.flatMap(item => {
        const next = inventory.items.find(candidate => candidate.id === item.id);
        const after = next?.usesRemaining ?? (operation.kind === 'launch' && attempt?.itemIds.includes(item.id) ? 0 : item.usesRemaining);
        return after < item.usesRemaining ? [{ itemId: item.id, before: item.usesRemaining, after }] : [];
      });
      const missionId = operation.missionId ?? attempt?.missionId;
      const payload = {
        operation: operation.kind, requestId: input.requestId, revision: current.revision + 1,
        ...(missionId ? { missionId } : {}), ...(attempt ? { attemptId: attempt.attemptId } : {}),
        itemIds: units?.map(unit => unit.id) ?? operation.itemIds ?? (operation.itemId ? [operation.itemId] : attempt?.itemIds ?? []),
        instrumentIds: operation.instrumentIds ?? [], balanceBefore: current.inventory.balance, balanceAfter: inventory.balance, wear, reward,
      };
      const ledger = { schemaVersion: 2, type: 'event', id: ledgerId, sessionId, kind: 'inventory', mission: missionId ?? 'inventory', at, receivedAt: at, payload };
      const receipt = { requestId: input.requestId, operation: operation.kind, revision: current.revision + 1, eventId: ledger.id, at, ...(attempt ? { attemptId: attempt.attemptId } : {}) };
      const next = { ...current, revision: current.revision + 1, inventory, attempts, receipts: { ...current.receipts, [input.requestId]: { ...receipt, fingerprint } }, outbox: [...current.outbox, ledger, ...(attempt?.metricEvent ? [attempt.metricEvent] : [])] };
      if (!await repository.compareAndSwap(pathFor(sessionId), next, saved.etag)) continue;
      const confirmed = await flush(sessionId);
      return { snapshot: inventorySnapshot(confirmed), receipt, ...(attempt ? { attempt: confirmed.attempts[attempt.attemptId] } : {}) };
    }
    throw new InventoryConflict('VERSION_CONFLICT', 'O inventário está recebendo outra operação. Revise o estado atualizado.', inventorySnapshot((await load(sessionId)).document));
  }
  return { read, command };
}
