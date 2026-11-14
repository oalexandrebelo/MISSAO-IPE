import type { MissionConfig, MissionResult, ScenarioId } from '../core/contracts.ts';
import { identifyResult } from './identity.ts';
import { canonicalJson, parseStrictJson } from './json.ts';
import { assertHash, assertMissionConfig, assertMissionResult, assertScenarioId, objectWithKeys } from './validation.ts';

export const DATABASE_NAME = 'mission-ipe-research-v1';
export const DATABASE_VERSION = 1;
export interface SavedRun { id: string; createdAt: string; result: MissionResult; inputHash: string; resultHash: string; }
export interface MissionDraft { config: MissionConfig; scenarioId: ScenarioId; revision: number; }
export interface MissionStore {
  saveRun(result: MissionResult): Promise<string>;
  listRuns(): Promise<SavedRun[]>;
  deleteRun(id: string): Promise<void>;
  saveDraft(config: MissionConfig, scenarioId: ScenarioId, expectedRevision: number): Promise<number>;
  loadDraft(): Promise<MissionDraft | null>;
}
export class DraftConflictError extends Error {
  readonly code = 'DRAFT_CONFLICT';
  readonly expectedRevision: number;
  readonly currentRevision: number;
  constructor(expectedRevision: number, currentRevision: number) {
    super(`Rascunho alterado em outra aba (revisão ${currentRevision}); recarregue antes de salvar.`);
    this.name = 'DraftConflictError';
    this.expectedRevision = expectedRevision;
    this.currentRevision = currentRevision;
  }
}
export class StorageIntegrityError extends Error {
  readonly code = 'STORAGE_INTEGRITY';
  constructor(message: string) { super(message); this.name = 'StorageIntegrityError'; }
}

function openDatabase(factory: IDBFactory | undefined, name: string): Promise<IDBDatabase> {
  if (!factory) return Promise.reject(new Error('IndexedDB indisponível; a execução continua somente em memória.'));
  return new Promise((resolve, reject) => {
    let cancelled = false;
    const request = factory.open(name, DATABASE_VERSION);
    request.onblocked = () => { cancelled = true; reject(new Error('Banco bloqueado por outra aba; feche-a e tente novamente.')); };
    request.onerror = () => reject(request.error ?? new Error('Não foi possível abrir o banco local.'));
    request.onupgradeneeded = () => {
      if (cancelled) { request.transaction?.abort(); return; }
      const db = request.result;
      const runs = db.createObjectStore('runs', { keyPath: 'id' });
      runs.createIndex('byIdentity', ['inputHash', 'resultHash'], { unique: true });
      runs.createIndex('byCreatedAt', 'createdAt');
      db.createObjectStore('drafts', { keyPath: 'id' });
    };
    request.onsuccess = () => {
      const db = request.result;
      if (cancelled) { db.close(); return; }
      db.onversionchange = () => db.close();
      resolve(db);
    };
  });
}

/** Schedules IDB requests synchronously and resolves only on transaction.complete. */
async function transaction<T>(
  db: IDBDatabase, storeName: string, mode: IDBTransactionMode,
  schedule: (store: IDBObjectStore, setResult: (value: T) => void, fail: (reason: unknown) => void) => void,
): Promise<T> {
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      let result: T;
      let failure: unknown;
      const fail = (reason: unknown) => {
        failure ??= reason;
        try { tx.abort(); } catch { reject(failure); }
      };
      tx.oncomplete = () => resolve(result);
      tx.onerror = event => {
        const requestError = (event.target as IDBRequest | null)?.error;
        failure ??= requestError ?? tx.error;
      };
      tx.onabort = () => reject(failure ?? tx.error ?? new DOMException('Transação local cancelada.', 'AbortError'));
      try { schedule(tx.objectStore(storeName), value => { result = value; }, fail); }
      catch (error) { fail(error); }
    });
  } finally { db.close(); }
}

function snapshotResult(result: MissionResult): MissionResult {
  const snapshot = parseStrictJson(canonicalJson(result));
  assertMissionResult(snapshot);
  return snapshot;
}
function validateDraft(value: unknown): MissionDraft {
  const draft = objectWithKeys(value, ['id', 'config', 'scenarioId', 'revision'], [], 'draft');
  if (draft.id !== 'active' || !Number.isSafeInteger(draft.revision) || (draft.revision as number) < 1) throw new StorageIntegrityError('Revisão de rascunho inválida.');
  assertMissionConfig(draft.config);
  assertScenarioId(draft.scenarioId);
  return { config: draft.config, scenarioId: draft.scenarioId, revision: draft.revision as number };
}
function validRunId(id: unknown): asserts id is string {
  if (typeof id !== 'string' || !/^run-[a-f0-9]{64}$/.test(id)) throw new StorageIntegrityError('ID de execução inválido.');
}
async function validateSavedRun(value: unknown): Promise<SavedRun> {
  const run = objectWithKeys(value, ['id', 'createdAt', 'result', 'inputHash', 'resultHash'], [], 'savedRun');
  validRunId(run.id);
  assertHash(run.inputHash, 'inputHash');
  assertHash(run.resultHash, 'resultHash');
  if (typeof run.createdAt !== 'string' || !Number.isFinite(Date.parse(run.createdAt)) || new Date(run.createdAt).toISOString() !== run.createdAt) throw new StorageIntegrityError('Data de gravação inválida.');
  assertMissionResult(run.result);
  const identity = await identifyResult(run.result);
  if (identity.id !== run.id || identity.inputHash !== run.inputHash || identity.resultHash !== run.resultHash) throw new StorageIntegrityError('A execução local não confere com seus hashes.');
  return run as unknown as SavedRun;
}

/** Separate instances use separate connections; readwrite transaction scheduling provides cross-tab CAS. */
export function createMissionStore(options: { indexedDB?: IDBFactory; databaseName?: string } = {}): MissionStore {
  const open = () => openDatabase(options.indexedDB ?? globalThis.indexedDB, options.databaseName ?? DATABASE_NAME);
  return {
    async saveRun(result) {
      const snapshot = snapshotResult(result);
      // Crypto must finish before opening a transaction; an awaited crypto call can close an IDB transaction.
      const { id, inputHash, resultHash } = await identifyResult(snapshot);
      const row: SavedRun = { id, createdAt: new Date().toISOString(), result: snapshot, inputHash, resultHash };
      return transaction<string>(await open(), 'runs', 'readwrite', (store, setResult, fail) => {
        const existing = store.get(id);
        existing.onsuccess = () => {
          try {
            if (existing.result !== undefined) {
              // Do not overwrite the timestamp or silently repair corrupted evidence.
              const prior = existing.result as SavedRun;
              if (prior.inputHash !== inputHash || prior.resultHash !== resultHash || canonicalJson(prior.result) !== canonicalJson(snapshot)) throw new StorageIntegrityError('ID já presente com conteúdo diferente.');
            } else store.add(row);
            setResult(id);
          } catch (error) { fail(error); }
        };
      });
    },
    async listRuns() {
      const rows = await transaction<unknown[]>(await open(), 'runs', 'readonly', (store, setResult) => {
        const request = store.getAll();
        request.onsuccess = () => setResult(request.result);
      });
      const validated = await Promise.all(rows.map(validateSavedRun));
      return validated.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id));
    },
    async deleteRun(id) {
      validRunId(id);
      await transaction<void>(await open(), 'runs', 'readwrite', store => { store.delete(id); });
    },
    async saveDraft(config, scenarioId, expectedRevision) {
      const snapshot = parseStrictJson(canonicalJson(config));
      assertMissionConfig(snapshot);
      assertScenarioId(scenarioId);
      if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 0 || expectedRevision === Number.MAX_SAFE_INTEGER) throw new RangeError('expectedRevision deve ser um inteiro seguro não negativo com espaço para incremento.');
      return transaction<number>(await open(), 'drafts', 'readwrite', (store, setResult, fail) => {
        const request = store.get('active');
        request.onsuccess = () => {
          try {
            const current = request.result === undefined ? null : validateDraft(request.result);
            const currentRevision = current?.revision ?? 0;
            if (currentRevision !== expectedRevision) throw new DraftConflictError(expectedRevision, currentRevision);
            const revision = currentRevision + 1;
            store.put({ id: 'active', config: snapshot, scenarioId, revision });
            setResult(revision);
          } catch (error) { fail(error); }
        };
      });
    },
    async loadDraft() {
      return transaction<MissionDraft | null>(await open(), 'drafts', 'readonly', (store, setResult, fail) => {
        const request = store.get('active');
        request.onsuccess = () => {
          try { setResult(request.result === undefined ? null : validateDraft(request.result)); }
          catch (error) { fail(error); }
        };
      });
    },
  };
}

const defaultStore = createMissionStore();
export const saveRun = defaultStore.saveRun;
export const listRuns = defaultStore.listRuns;
export const deleteRun = defaultStore.deleteRun;
export const saveDraft = defaultStore.saveDraft;
export const loadDraft = defaultStore.loadDraft;
