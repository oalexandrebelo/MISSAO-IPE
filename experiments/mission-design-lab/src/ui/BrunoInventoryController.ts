import { useCallback, useEffect, useRef, useState } from 'react';
import { InventoryApiError, readInventory, sendInventoryCommand } from '../metrics/inventory-client.ts';
import type { InventorySnapshot } from '../metrics/inventory-client.ts';

type Request = Parameters<typeof sendInventoryCommand>[1];
type Command = Request['command'];
type Operation = Command['kind'];

const feedback: Record<Operation, string> = {
  buy: 'Compra confirmada. As unidades estão no inventário.',
  return: 'Devolução confirmada. O crédito voltou à carteira.',
  equip: 'Carga da missão atualizada.',
  launch: 'Partida registrada. A carga e a condição do voo foram fixadas.',
  complete: 'Resultado confirmado na carteira.',
  cancel: 'Tentativa cancelada. A carteira foi atualizada.',
  reset: 'Carteira reiniciada. Seu progresso de missões permanece disponível.',
};
const unavailable = 'A carteira está indisponível. Atualize o inventário para confirmar saldo e unidades.';
const confirmationPending = 'A confirmação da operação está pendente. Tente confirmá-la antes de fazer outra alteração.';
const pendingKey = (sessionId: string) => `missao-ipe:inventory-pending:v1:${sessionId}`;

function readPendingRequest(sessionId: string): Request | null {
  try {
    const value = JSON.parse(window.sessionStorage.getItem(pendingKey(sessionId)) ?? 'null') as Partial<Request> | null;
    if (!value || typeof value.requestId !== 'string' || typeof value.expectedRevision !== 'number'
      || !Number.isSafeInteger(value.expectedRevision) || value.expectedRevision < 0
      || !value.command || !Object.hasOwn(feedback, value.command.kind)) return null;
    return { requestId: value.requestId, expectedRevision: value.expectedRevision, command: value.command };
  } catch { return null; }
}

function rememberRequest(sessionId: string, request: Request): boolean {
  try {
    window.sessionStorage.setItem(pendingKey(sessionId), JSON.stringify(request));
    return true;
  } catch { return false; }
}

function forgetRequest(sessionId: string, requestId: string) {
  try {
    if (readPendingRequest(sessionId)?.requestId === requestId) window.sessionStorage.removeItem(pendingKey(sessionId));
  } catch { /* Rechecking the same receipt is idempotent. */ }
}

export function useBrunoInventory(sessionId: string) {
  const [restoredRequest] = useState(() => readPendingRequest(sessionId));
  const current = useRef<InventorySnapshot | null>(null);
  const pending = useRef<Request | null>(restoredRequest);
  const inFlight = useRef(false);
  const mounted = useRef(false);
  const [snapshot, setSnapshot] = useState<InventorySnapshot | null>(null);
  const [busy, setBusy] = useState<Operation | 'load' | null>(restoredRequest ? null : 'load');
  const [uncertain, setUncertain] = useState<Operation | null>(restoredRequest?.command.kind ?? null);
  const [issue, setIssue] = useState(restoredRequest ? confirmationPending : '');
  const [notice, setNotice] = useState('');

  const publish = useCallback((value: InventorySnapshot | null) => {
    if (!mounted.current) return;
    const confirmed = navigator.onLine === false ? null : value;
    current.current = confirmed;
    setSnapshot(confirmed);
  }, []);

  const refresh = useCallback(async () => {
    if (inFlight.current || pending.current) return;
    inFlight.current = true;
    setBusy('load');
    setIssue('');
    publish(null);
    try { publish(await readInventory(sessionId)); }
    catch { publish(null); if (mounted.current) setIssue(unavailable); }
    finally {
      inFlight.current = false;
      if (mounted.current) setBusy(null);
    }
  }, [publish, sessionId]);

  useEffect(() => {
    mounted.current = true;
    const offline = () => { publish(null); setIssue(pending.current ? confirmationPending : unavailable); setNotice(''); };
    void refresh();
    window.addEventListener('offline', offline);
    window.addEventListener('online', refresh);
    return () => {
      mounted.current = false;
      window.removeEventListener('offline', offline);
      window.removeEventListener('online', refresh);
    };
  }, [publish, refresh]);

  const send = useCallback(async (request: Request) => {
    if (inFlight.current || navigator.onLine === false) return null;
    inFlight.current = true;
    pending.current = request;
    const saved = rememberRequest(sessionId, request);
    setBusy(request.command.kind);
    setIssue('');
    setNotice('');
    try {
      const response = await sendInventoryCommand(sessionId, request);
      pending.current = null;
      forgetRequest(sessionId, request.requestId);
      publish(response.snapshot);
      if (mounted.current) {
        setUncertain(null);
        setNotice(feedback[request.command.kind]);
      }
      return response;
    } catch (error) {
      if (!(error instanceof InventoryApiError) || error.uncertain) {
        if (!mounted.current) return null;
        publish(null);
        setUncertain(request.command.kind);
        setIssue(saved ? confirmationPending : `${confirmationPending} Mantenha esta aba aberta para recuperar o pedido.`);
      } else {
        pending.current = null;
        forgetRequest(sessionId, request.requestId);
        if (!mounted.current) return null;
        setUncertain(null);
        if (error.snapshot) publish(error.snapshot);
        else if (error.status === 401 || error.status >= 500) publish(null);
        setIssue(error.message);
      }
      return null;
    } finally {
      inFlight.current = false;
      if (mounted.current) setBusy(null);
    }
  }, [publish, sessionId]);

  const execute = useCallback((command: Command) => {
    if (!current.current || pending.current) return Promise.resolve(null);
    return send({ requestId: crypto.randomUUID(), expectedRevision: current.current.revision, command });
  }, [send]);
  const retry = useCallback(() => pending.current ? send(pending.current) : Promise.resolve(null), [send]);

  return { snapshot, busy, uncertain, issue, notice, refresh, execute, retry };
}

export type BrunoInventoryController = ReturnType<typeof useBrunoInventory>;
