import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { BRUNO_INSTRUMENTS, BRUNO_LAUNCHER_SLOTS, BRUNO_MISSIONS } from '../lab/bruno-missions.ts';
import type { BrunoConfig, BrunoInstrumentId, BrunoMissionId } from '../lab/bruno-missions.ts';
import { applyBrunoInventoryCommand, BRUNO_STARTING_BALANCE } from '../lab/bruno-inventory.ts';
import type { InventoryCommandResponse } from '../metrics/inventory-client.ts';
import type { BrunoInventoryController } from './BrunoInventoryController.ts';
import { canRenderWebGL } from './Scene.tsx';
import { BrunoPreviewBoundary } from './BrunoPreviewBoundary.tsx';
import { Dialog } from './Dialogs.tsx';
import { Icon } from './Icon.tsx';
import './bruno-equipment.css';

const InstrumentScene = lazy(() => import('./BrunoHangarScene.tsx').then(module => ({ default: module.BrunoInstrumentScene })));
const instruments = Object.entries(BRUNO_INSTRUMENTS) as [BrunoInstrumentId, typeof BRUNO_INSTRUMENTS[BrunoInstrumentId]][];
const MAX_PURCHASE_UNITS = 20;
type Equipment = NonNullable<BrunoInventoryController['snapshot']>['inventory'];

function reservedFor(state: Equipment, itemId: string) {
  return (Object.keys(state.reservations) as BrunoMissionId[]).find(id => state.reservations[id]?.includes(itemId));
}

export function BrunoCondition({ id, usesRemaining }: { id: BrunoInstrumentId; usesRemaining: number }) {
  const { durability, label } = BRUNO_INSTRUMENTS[id];
  return <span className="bruno-condition" data-exhausted={usesRemaining === 0}>
    <meter min={0} max={durability} value={usesRemaining} aria-label={`Ciclos disponíveis · ${label}`} />
    <span>{usesRemaining} de {durability} ciclos{usesRemaining === 0 ? ' · esgotado' : ''}</span>
  </span>;
}

export function BrunoInventoryStatus({ controller, onResolved }: { controller: BrunoInventoryController; onResolved?: (response: InventoryCommandResponse) => void }) {
  const { snapshot, busy, uncertain, issue, notice } = controller;
  return <div className="bruno-inventory-status" data-inventory-state={uncertain ? 'pending' : snapshot ? 'connected' : 'unavailable'}>
    <p role="status">{busy === 'load' ? 'Consultando carteira e inventário…' : busy ? 'Confirmando operação…' : notice}</p>
    {issue ? <p role="alert">{issue}</p> : null}
    {uncertain ? <button className="bruno-action bruno-secondary" type="button" disabled={!!busy} onClick={() => void controller.retry().then(response => { if (response) onResolved?.(response); })}>Confirmar operação anterior</button>
      : !snapshot && !busy ? <button className="bruno-action bruno-secondary" type="button" onClick={() => void controller.refresh()}>Atualizar inventário</button> : null}
  </div>;
}

function InstrumentPreview({ id }: { id: BrunoInstrumentId }) {
  const [available, setAvailable] = useState(false);
  const [turn, setTurn] = useState(0);
  useEffect(() => { setAvailable(canRenderWebGL()); }, []);
  const unavailable = useCallback(() => setAvailable(false), []);
  return <figure className="bruno-instrument-preview" data-instrument={id}>
    {available ? <div className="bruno-instrument-stage"><BrunoPreviewBoundary fallback={<p>Prévia 3D indisponível.</p>} onUnavailable={unavailable}>
      <Suspense fallback={<p role="status">Carregando instrumento 3D…</p>}><InstrumentScene id={id} turn={turn} onUnavailable={unavailable} /></Suspense>
    </BrunoPreviewBoundary></div> : null}
    <figcaption>{available ? 'Instrumento didático, fora de escala.' : 'A ficha abaixo descreve o instrumento. Prévia 3D indisponível.'}</figcaption>
    {available ? <button type="button" className="bruno-action bruno-secondary" onClick={() => setTurn(value => (value + Math.PI / 4) % (2 * Math.PI))}>Girar instrumento <Icon name="route" size={16} /></button> : null}
  </figure>;
}

export function BrunoEquipmentShop({ controller, onBack, backLabel, missionId }: { controller: BrunoInventoryController; onBack: () => void; backLabel: string; missionId?: BrunoMissionId }) {
  const [selected, setSelected] = useState<BrunoInstrumentId>(() => {
    const required: readonly BrunoInstrumentId[] = missionId ? BRUNO_MISSIONS[missionId].requiredInstruments : [];
    return instruments.find(([id]) => required.includes(id))?.[0] ?? instruments[0]![0];
  });
  const [quantity, setQuantity] = useState(1);
  const [confirmReset, setConfirmReset] = useState(false);
  const stockTitle = useRef<HTMLHeadingElement>(null);
  const { snapshot, busy, uncertain } = controller;
  const gear = BRUNO_INSTRUMENTS[selected];
  const state = snapshot?.inventory;
  const active = snapshot?.attempts.filter(attempt => attempt.status === 'launched') ?? [];
  const available = !!state && !busy && !uncertain;
  const maxQuantity = state ? Math.min(MAX_PURCHASE_UNITS, Math.floor(state.balance / gear.priceCredits)) : 0;
  const orderQuantity = state ? Math.min(quantity, Math.max(1, maxQuantity)) : quantity;
  const totalCredits = orderQuantity * gear.priceCredits;
  const canBuy = available && maxQuantity > 0;
  return <section className="bruno-campaign bruno-shop" aria-labelledby="bruno-shop-title" data-ipe-libras-context="Loja e inventário. Escolha um instrumento e a quantidade. Confira os encaixes e o total em créditos antes de comprar. No hangar, reserve e equipe as unidades para a missão. Cada partida efetiva consome um ciclo.">
    <button type="button" className="bruno-action bruno-quiet" onClick={onBack}><Icon name="back" size={18}/>{backLabel}</button>
    <header className="bruno-shop-header">
      <div><h1 id="bruno-shop-title">Loja e inventário</h1><p>Depois de comprar, volte ao hangar. Em Instrumento, use Equipar para montar cada unidade na nave.</p></div>
      <dl className="bruno-wallet" aria-label="Carteira da loja"><dt>Créditos da loja</dt><dd>{state ? state.balance : 'Indisponível'}</dd></dl>
    </header>
    <BrunoInventoryStatus controller={controller} onResolved={response => { if (response.receipt.operation === 'buy') setQuantity(1); }} />
    <div className="bruno-shop-catalogue">
      <section aria-labelledby="bruno-catalogue-title">
        <h2 id="bruno-catalogue-title">Instrumentos</h2>
        <div className="bruno-instrument-picker" role="group" aria-label="Catálogo de instrumentos">
          {instruments.map(([id, equipment]) => <button key={id} type="button" className="bruno-action bruno-secondary" aria-pressed={id === selected} aria-controls="bruno-instrument-detail" onClick={() => { if (id !== selected) { setSelected(id); setQuantity(1); } }}>
            <strong>{equipment.label}</strong>{' '}<span>{equipment.priceCredits} créditos</span>
          </button>)}
        </div>
      </section>
      <section className="bruno-panel bruno-instrument-detail" id="bruno-instrument-detail" aria-labelledby="bruno-instrument-title">
        <h2 id="bruno-instrument-title">{gear.label}</h2>
        <InstrumentPreview id={selected} />
        <p>{gear.description}</p>
        <dl className="bruno-instrument-spec"><div><dt>Massa</dt><dd>{gear.massKg} kg</dd></div><div><dt>Encaixes</dt><dd>{gear.slots}</dd></div><div><dt>Ciclos de fábrica</dt><dd>{gear.durability}</dd></div></dl>
        <p>{gear.missions.includes('bennu') ? 'Referência do acervo Bennu. Use para comparar cargas nas missões de engenharia. A peça não atende às perguntas dessas missões e não altera a investigação histórica de Bennu.' : `Indicado para ${gear.missions.map(id => id === 'bennu' ? 'Bennu' : BRUNO_MISSIONS[id].name).join(', ')}.`}</p>
        <a href={gear.source.url}>{gear.source.label}</a>
        <div className="bruno-shop-actions">
          <label>Quantidade{' '}
            <select className="bruno-action bruno-secondary" value={orderQuantity} disabled={!canBuy}
              onChange={event => setQuantity(Number(event.target.value) || 1)}>
              {Array.from({ length: Math.max(orderQuantity, maxQuantity) }, (_, index) =>
                <option key={index + 1} value={index + 1}>{index + 1}</option>)}
            </select>
          </label>
          <button type="button" className="bruno-action bruno-primary" disabled={!canBuy}
            onClick={() => void controller.execute({ kind: 'buy', instrumentIds: Array.from({ length: orderQuantity }, () => selected) })
              .then(response => { if (response) setQuantity(1); })}>
            Comprar {gear.label}{orderQuantity > 1 ? ` (${orderQuantity} unidades)` : ''} · {totalCredits} créditos
          </button>
        </div>
        {state && maxQuantity === 0 ? <p>Créditos insuficientes para este instrumento.</p> : null}
      </section>
    </div>
    <section className="bruno-panel bruno-owned-stock" aria-labelledby="bruno-stock-title">
      <h2 id="bruno-stock-title" ref={stockTitle} tabIndex={-1}>Suas unidades</h2>
      <p>Unidades intactas e livres de reserva podem ser devolvidas pelo preço de compra.</p>
      {state && !state.items.length ? <p>Seu inventário está vazio.</p> : null}
      {state?.items.length ? <ul role="list" className="bruno-equipment-list">{state.items.map((unit, index) => {
        const item = BRUNO_INSTRUMENTS[unit.instrumentId];
        const reservation = reservedFor(state, unit.id);
        const eligible = !reservation && unit.usesRemaining === item.durability;
        return <li key={unit.id}>
          <div><strong>{item.label} <small>· unidade {index + 1}</small></strong><p>{reservation ? `Reserva de ${BRUNO_MISSIONS[reservation].name}` : 'Livre para equipar'}{unit.usesRemaining < item.durability ? ' · Unidade usada' : ''}</p><BrunoCondition id={unit.instrumentId} usesRemaining={unit.usesRemaining}/></div>
          <button type="button" className="bruno-action bruno-secondary" disabled={!available || !eligible} aria-label={`Devolver ${item.label}, unidade ${index + 1}`}
            onClick={() => void controller.execute({ kind: 'return', itemId: unit.id }).then(response => { if (response) stockTitle.current?.focus(); })}>Devolver</button>
        </li>;
      })}</ul> : null}
      <details className="bruno-wallet-reset"><summary>Recomeçar a carteira</summary>
        <p>Recupere {BRUNO_STARTING_BALANCE} créditos. As unidades compradas e as reservas serão removidas. Seu histórico de missões permanece disponível.</p>
        {active.length ? <p>Conclua ou cancele primeiro {active.map(attempt => BRUNO_MISSIONS[attempt.missionId].name).join(', ')}.</p> : null}
        <button type="button" className="bruno-action bruno-secondary" disabled={!available || active.length > 0} onClick={() => setConfirmReset(true)}>Recomeçar carteira</button>
      </details>
    </section>
    {confirmReset ? <Dialog title="Recomeçar carteira?" onClose={() => setConfirmReset(false)}>
      <p>O saldo volta a {BRUNO_STARTING_BALANCE} créditos e todas as unidades e reservas são removidas. A participação e as tentativas ficam registradas.</p>
      <div className="bruno-shop-actions"><button type="button" className="button button-secondary" onClick={() => setConfirmReset(false)}>Voltar ao inventário</button>
        <button type="button" className="button button-primary" disabled={!available || active.length > 0} onClick={() => { setConfirmReset(false); void controller.execute({ kind: 'reset' }); }}>Confirmar reinício</button></div>
    </Dialog> : null}
  </section>;
}

export function BrunoLoadoutEditor({ controller, missionId, config, onShop, onChanged }: { controller: BrunoInventoryController; missionId: BrunoMissionId; config: BrunoConfig; onShop?: () => void; onChanged: () => void }) {
  const state = controller.snapshot?.inventory;
  const selected = state?.reservations[missionId] ?? [];
  const used = state?.items.filter(item => selected.includes(item.id)).reduce((sum, item) => sum + BRUNO_INSTRUMENTS[item.instrumentId].slots, 0) ?? 0;
  const capacity = BRUNO_LAUNCHER_SLOTS[config.launcher];
  const locked = controller.snapshot?.attempts.some(attempt => attempt.status === 'launched' && attempt.missionId === missionId);
  return <section className="bruno-loadout" aria-labelledby="bruno-loadout-title">
    <div className="bruno-loadout-heading"><h3 id="bruno-loadout-title">Carga de instrumentos</h3>{onShop ? <button type="button" className="bruno-action bruno-secondary" onClick={onShop}>Loja e inventário</button> : null}</div>
    {state ? <p><strong>{used} de {capacity} encaixes ocupados</strong>. Equipar reserva a unidade para esta missão.</p> : null}
    {locked ? <p>A tentativa em andamento mantém a carga reservada.</p> : null}
    {state && !state.items.length ? <p>Compre instrumentos na loja para equipar sua nave.</p> : null}
    {state?.items.length ? <ul role="list" className="bruno-equipment-list">{state.items.map((unit, index) => {
      const item = BRUNO_INSTRUMENTS[unit.instrumentId];
      const equipped = selected.includes(unit.id);
      const other = reservedFor(state, unit.id);
      const itemIds = equipped ? selected.filter(id => id !== unit.id) : [...selected, unit.id];
      const command = { kind: 'equip', missionId, config, itemIds } as const;
      let reason = '';
      if (!locked) {
        try { applyBrunoInventoryCommand(state, command); }
        catch (error) { reason = error instanceof Error ? error.message : 'Carga incompatível com esta montagem.'; }
      }
      return <li key={unit.id} data-equipped={equipped}>
        <div><strong>{item.label} <small>· unidade {index + 1}</small></strong><p>{equipped ? 'Equipada para esta missão' : other ? `Reservada para ${BRUNO_MISSIONS[other].name}` : `${item.slots} encaixe${item.slots === 1 ? '' : 's'} · ${item.massKg} kg`}</p>
          <BrunoCondition id={unit.instrumentId} usesRemaining={unit.usesRemaining} />{reason ? <p className="bruno-equipment-reason">{reason}</p> : null}</div>
        <button type="button" className="bruno-action bruno-secondary" disabled={!!controller.busy || !!locked || !!reason} aria-label={`${equipped ? 'Remover' : 'Equipar'} ${item.label}, unidade ${index + 1}`}
          onClick={() => void controller.execute(command).then(response => { if (response) onChanged(); })}>{equipped ? 'Remover' : 'Equipar'}</button>
      </li>;
    })}</ul> : null}
    {selected.length > 1 ? <button type="button" className="bruno-action bruno-quiet" disabled={!!controller.busy || !!locked} onClick={() => void controller.execute({ kind: 'equip', missionId, config, itemIds: [] }).then(response => { if (response) onChanged(); })}>Liberar toda a carga</button> : null}
  </section>;
}
