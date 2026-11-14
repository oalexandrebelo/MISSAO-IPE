import { simulateMission } from '../core/engine.ts';
import { searchCatalog } from '../core/search.ts';
import type { MissionConfig, ScenarioId } from '../core/contracts.ts';

interface Request { requestId: number; kind: 'simulate' | 'search'; config: MissionConfig; scenarioId: ScenarioId; }
const scope = globalThis as unknown as {
  addEventListener(type: 'message', handler: (event: MessageEvent<Request>) => void): void;
  postMessage(message: unknown): void;
};
scope.addEventListener('message', (event) => {
  const { requestId, kind, config, scenarioId } = event.data;
  try {
    if (!Number.isSafeInteger(requestId) || (kind !== 'simulate' && kind !== 'search')) throw new Error('Comando de cálculo inválido.');
    const result = kind === 'simulate' ? simulateMission(config, scenarioId) : searchCatalog(config, scenarioId);
    scope.postMessage({ requestId, ok: true, result });
  } catch (error) {
    scope.postMessage({ requestId, ok: false, error: error instanceof Error ? error.message : 'Falha não classificada no cálculo.' });
  }
});
