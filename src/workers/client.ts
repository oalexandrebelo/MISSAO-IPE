import type { MissionConfig, MissionResult, ScenarioId, SearchResult } from '../core/contracts.ts';
import { CONFIG_KEYS } from '../core/catalog.ts';
import { assertMissionConfig, assertMissionResult, objectWithKeys } from '../persistence/validation.ts';
declare const __IPE_PORTABLE__: boolean | undefined;

type JobKind = 'simulate' | 'search';
type JobResult<K extends JobKind> = K extends 'simulate' ? MissionResult : SearchResult;
let nextRequestId = 0;

function sameConfig(a: MissionConfig, b: MissionConfig): boolean {
  return CONFIG_KEYS.every(key => a[key] === b[key]);
}
function checkedResult<K extends JobKind>(kind: K, value: unknown, config: MissionConfig, scenarioId: ScenarioId): JobResult<K> {
  if (kind === 'simulate') {
    assertMissionResult(value);
    if (value.scenarioId !== scenarioId || !sameConfig(value.config, config)) throw new Error('Resposta não corresponde à entrada da missão.');
    return value as JobResult<K>;
  }
  const search = objectWithKeys(value, ['scenarioId', 'baseConfig', 'total', 'evaluated', 'invalid', 'successful', 'failed', 'indeterminate', 'complete', 'minimumDistance', 'best'], [], 'search');
  assertMissionConfig(search.baseConfig);
  if (search.scenarioId !== scenarioId || !sameConfig(search.baseConfig, config) || search.total !== 64 || typeof search.complete !== 'boolean') throw new Error('Identidade de busca inválida.');
  for (const field of ['evaluated', 'invalid', 'successful', 'failed', 'indeterminate'] as const) {
    const count = search[field];
    if (typeof count !== 'number' || !Number.isSafeInteger(count) || count < 0 || count > (field === 'indeterminate' ? 128 : 64)) throw new Error('Contagem de busca inválida.');
  }
  const evaluated = search.evaluated as number;
  const successful = search.successful as number;
  if (evaluated !== (search.invalid as number) + successful + (search.failed as number)) throw new Error('Contabilidade de busca inconsistente.');
  if (!Array.isArray(search.best) || search.best.length > successful) throw new Error('Testemunhas de busca inválidas.');
  const distance = search.minimumDistance;
  if (distance !== null && (typeof distance !== 'number' || !Number.isSafeInteger(distance) || distance < 0 || distance > CONFIG_KEYS.length)) throw new Error('Distância de busca inválida.');
  if (search.complete) {
    if (evaluated !== 64 || search.indeterminate !== 0 || (successful > 0) !== (distance !== null) || (successful > 0 && search.best.length === 0)) throw new Error('Certificação de busca inconsistente.');
  } else if (distance !== null || search.best.length !== 0) throw new Error('Busca incompleta não pode certificar mínimo.');
  const witnesses = new Set<string>();
  for (const item of search.best) {
    const candidate = objectWithKeys(item, ['config', 'distance', 'result'], [], 'candidate');
    assertMissionConfig(candidate.config);
    assertMissionResult(candidate.result);
    const candidateConfig = candidate.config;
    const identity = CONFIG_KEYS.map(key => candidateConfig[key]).join('|');
    const changed = CONFIG_KEYS.reduce((n, key) => n + Number(config[key] !== candidateConfig[key]), 0);
    if (witnesses.has(identity) || candidate.distance !== distance || changed !== distance || candidate.result.outcome !== 'success' || candidate.result.scenarioId !== scenarioId || !sameConfig(candidate.result.config, candidate.config)) throw new Error('Testemunha de busca inconsistente.');
    witnesses.add(identity);
  }
  return value as JobResult<K>;
}

/** Each job owns a worker. Aborting terminates computation and discards its result. */
async function runJob<K extends JobKind>(kind: K, config: MissionConfig, scenarioId: ScenarioId, signal?: AbortSignal): Promise<JobResult<K>> {
  if (signal?.aborted) throw new DOMException('Execução cancelada.', 'AbortError');
  const frozenConfig = { ...config };
  if ((typeof __IPE_PORTABLE__ !== 'undefined' && __IPE_PORTABLE__) || typeof Worker === 'undefined' || (typeof location !== 'undefined' && location.protocol === 'file:')) {
    // Portable file, headless verification, or a browser without Workers. Same physics.
    const implementation = kind === 'simulate'
      ? (await import('../core/engine.ts')).simulateMission
      : (await import('../core/search.ts')).searchCatalog;
    if (signal?.aborted) throw new DOMException('Execução cancelada.', 'AbortError');
    const result = implementation(frozenConfig, scenarioId);
    if (signal?.aborted) throw new DOMException('Execução cancelada.', 'AbortError');
    return checkedResult(kind, result, frozenConfig, scenarioId);
  }
  const requestId = ++nextRequestId;
  return new Promise<JobResult<K>>((resolve, reject) => {
    const worker = new Worker(new URL('./mission.worker.ts', import.meta.url), { type: 'module', name: `ipe-${kind}-${requestId}` });
    let settled = false;
    const finish = (error?: Error, value?: JobResult<K>) => {
      if (settled) return;
      settled = true;
      clearTimeout(deadline);
      signal?.removeEventListener('abort', abort);
      worker.terminate();
      if (error) reject(error); else resolve(value as JobResult<K>);
    };
    const abort = () => finish(new DOMException('Execução cancelada.', 'AbortError'));
    // This is a responsiveness limit, never a successful/failed mission classification.
    const deadline = setTimeout(() => finish(new Error('O cálculo ultrapassou 15 segundos. Nenhum resultado foi certificado.')), 15_000);
    signal?.addEventListener('abort', abort, { once: true });
    worker.addEventListener('message', (event: MessageEvent) => {
      try {
        const data: unknown = event.data;
        if (data === null || typeof data !== 'object' || Array.isArray(data)) throw new Error('Resposta do processo de cálculo malformada.');
        const message = data as Record<string, unknown>;
        if (!Number.isSafeInteger(message.requestId) || typeof message.ok !== 'boolean') throw new Error('Envelope do processo de cálculo inválido.');
        if (message.requestId !== requestId) return;
        if (message.ok) finish(undefined, checkedResult(kind, message.result, frozenConfig, scenarioId));
        else finish(new Error(typeof message.error === 'string' ? message.error.slice(0, 1_000) : 'Não foi possível concluir a execução.'));
      } catch (error) {
        finish(error instanceof Error ? error : new Error('Resposta de cálculo inválida.'));
      }
    });
    worker.addEventListener('error', () => finish(new Error('O processo de cálculo falhou. O resultado anterior não foi reutilizado.')));
    worker.addEventListener('messageerror', () => finish(new Error('A resposta do processo de cálculo é inválida.')));
    if (signal?.aborted) { abort(); return; }
    worker.postMessage({ requestId, kind, config: frozenConfig, scenarioId });
  });
}

export function simulateAsync(config: MissionConfig, scenarioId: ScenarioId, signal?: AbortSignal): Promise<MissionResult> {
  return runJob('simulate', config, scenarioId, signal);
}
export function searchAsync(config: MissionConfig, scenarioId: ScenarioId, signal?: AbortSignal): Promise<SearchResult> {
  return runJob('search', config, scenarioId, signal);
}
