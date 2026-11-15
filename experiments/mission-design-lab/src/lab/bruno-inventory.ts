import {
  BRUNO_INSTRUMENTS, BRUNO_INVENTORY_MODEL_VERSION, BRUNO_LAUNCHER_SLOTS, BRUNO_MISSIONS,
  simulateBrunoMission, validateBrunoConfig,
} from './bruno-missions.ts';
import type { BrunoConfig, BrunoInstrumentId, BrunoInventoryConfig, BrunoMissionId, BrunoResult } from './bruno-missions.ts';

export const BRUNO_STARTING_BALANCE = 25;
export const BRUNO_LAUNCH_FEE = 2;
export const BRUNO_SUCCESS_REWARD = 8;

export interface BrunoInventoryItem {
  readonly id: string;
  readonly instrumentId: BrunoInstrumentId;
  readonly usesRemaining: number;
}

export interface BrunoInventoryState {
  readonly version: number;
  readonly balance: number;
  readonly items: readonly BrunoInventoryItem[];
  readonly reservations: Readonly<Partial<Record<BrunoMissionId, readonly string[]>>>;
}

export type BrunoInventoryCommand =
  | { kind: 'purchase'; units: readonly Pick<BrunoInventoryItem, 'id' | 'instrumentId'>[] }
  | { kind: 'refund'; itemId: string }
  | { kind: 'equip'; missionId: BrunoMissionId; config: BrunoConfig; itemIds: readonly string[] }
  | { kind: 'launch'; missionId: BrunoMissionId; config: BrunoConfig }
  | { kind: 'reset' };

type InventoryErrorCode = 'INVALID_COMMAND' | 'INSUFFICIENT_BALANCE' | 'ITEM_NOT_FOUND'
  | 'ITEM_RESERVED' | 'ITEM_USED' | 'SLOT_LIMIT' | 'MASS_LIMIT';

export class BrunoInventoryError extends Error {
  readonly code: InventoryErrorCode;

  constructor(code: InventoryErrorCode, message: string) {
    super(message);
    this.name = 'BrunoInventoryError';
    this.code = code;
  }
}

export function createBrunoInventoryState(): BrunoInventoryState {
  return { version: 0, balance: BRUNO_STARTING_BALANCE, items: [], reservations: {} };
}

function ownedItem(state: BrunoInventoryState, itemId: string): BrunoInventoryItem {
  const item = state.items.find(entry => entry.id === itemId);
  if (!item) throw new BrunoInventoryError('ITEM_NOT_FOUND', 'A unidade não está disponível no inventário.');
  return item;
}

export function buildBrunoInventoryConfig(
  state: BrunoInventoryState, missionId: BrunoMissionId, config: BrunoConfig,
): BrunoInventoryConfig {
  if (!Object.hasOwn(BRUNO_MISSIONS, missionId) || !validateBrunoConfig(config)) {
    throw new BrunoInventoryError('INVALID_COMMAND', 'Projeto de missão inválido.');
  }
  const loadout = (state.reservations[missionId] ?? []).map(id => {
    const { instrumentId, usesRemaining } = ownedItem(state, id);
    return { instrumentId, usesRemaining };
  });
  return { ...config, payload: 'targeted', modelVersion: BRUNO_INVENTORY_MODEL_VERSION, loadout };
}

export function applyBrunoInventoryCommand(
  state: BrunoInventoryState, command: BrunoInventoryCommand,
): { state: BrunoInventoryState; result?: BrunoResult } {
  const version = state.version + 1;

  switch (command.kind) {
    case 'purchase': {
      const usedIds = new Set(state.items.map(item => item.id));
      const units: BrunoInventoryItem[] = [];
      let cost = 0;
      if (!command.units.length) throw new BrunoInventoryError('INVALID_COMMAND', 'Selecione pelo menos um instrumento.');
      for (const { id, instrumentId } of command.units) {
        if (typeof id !== 'string' || !id || usedIds.has(id) || !Object.hasOwn(BRUNO_INSTRUMENTS, instrumentId)) {
          throw new BrunoInventoryError('INVALID_COMMAND', 'Unidade de compra inválida.');
        }
        const instrument = BRUNO_INSTRUMENTS[instrumentId];
        usedIds.add(id);
        cost += instrument.priceCredits;
        units.push({ id, instrumentId, usesRemaining: instrument.durability });
      }
      if (cost > state.balance) throw new BrunoInventoryError('INSUFFICIENT_BALANCE', 'Saldo insuficiente para concluir a compra.');
      return { state: { ...state, version, balance: state.balance - cost, items: [...state.items, ...units] } };
    }
    case 'refund': {
      const item = ownedItem(state, command.itemId);
      const instrument = BRUNO_INSTRUMENTS[item.instrumentId];
      if (Object.values(state.reservations).some(ids => ids.includes(item.id))) {
        throw new BrunoInventoryError('ITEM_RESERVED', 'Retire a unidade da carga antes de devolvê-la.');
      }
      if (item.usesRemaining !== instrument.durability) {
        throw new BrunoInventoryError('ITEM_USED', 'A devolução está disponível apenas para unidades novas.');
      }
      return { state: {
        ...state, version, balance: state.balance + instrument.priceCredits,
        items: state.items.filter(entry => entry.id !== item.id),
      } };
    }
    case 'equip': {
      const { missionId, config, itemIds } = command;
      const reservations = { ...state.reservations };
      if (new Set(itemIds).size !== itemIds.length || !Object.hasOwn(BRUNO_MISSIONS, missionId) || !validateBrunoConfig(config)) {
        throw new BrunoInventoryError('INVALID_COMMAND', 'Seleção de carga inválida.');
      }
      if (!itemIds.length) {
        delete reservations[missionId];
        return { state: { ...state, version, reservations } };
      }
      const reservedElsewhere = new Set(Object.entries(reservations)
        .filter(([id]) => id !== missionId).flatMap(([, ids]) => ids));
      let slots = 0;
      for (const id of itemIds) {
        if (reservedElsewhere.has(id)) throw new BrunoInventoryError('ITEM_RESERVED', 'A unidade está em outra missão.');
        slots += BRUNO_INSTRUMENTS[ownedItem(state, id).instrumentId].slots;
      }
      const maxSlots = BRUNO_LAUNCHER_SLOTS[config.launcher];
      if (slots > maxSlots) throw new BrunoInventoryError('SLOT_LIMIT', `A carga ocupa ${slots} espaços e o lançador oferece ${maxSlots}.`);
      reservations[missionId] = [...itemIds];
      const next = { ...state, version, reservations };
      const result = simulateBrunoMission(missionId, buildBrunoInventoryConfig(next, missionId, config));
      if (result.massKg > result.maxMassKg) {
        throw new BrunoInventoryError('MASS_LIMIT', `A montagem pesa ${result.massKg} kg e o lançador suporta ${result.maxMassKg} kg neste destino.`);
      }
      return { state: next };
    }
    case 'launch': {
      const { missionId, config } = command;
      const result = simulateBrunoMission(missionId, buildBrunoInventoryConfig(state, missionId, config));
      if (result.outcome === 'invalid') return { state: { ...state, version }, result };
      if (state.balance < BRUNO_LAUNCH_FEE) {
        throw new BrunoInventoryError('INSUFFICIENT_BALANCE', `A partida exige ${BRUNO_LAUNCH_FEE} créditos de operação.`);
      }
      const equipped = new Set(state.reservations[missionId]);
      const exhausted = new Set<string>();
      const items = state.items.flatMap(item => {
        if (!equipped.has(item.id)) return [item];
        if (item.usesRemaining > 1) return [{ ...item, usesRemaining: item.usesRemaining - 1 }];
        exhausted.add(item.id);
        return [];
      });
      const reservations = { ...state.reservations };
      const remaining = [...equipped].filter(id => !exhausted.has(id));
      if (remaining.length) reservations[missionId] = remaining;
      else delete reservations[missionId];
      return { state: { version, balance: state.balance - BRUNO_LAUNCH_FEE, items, reservations }, result };
    }
    case 'reset':
      return { state: { ...createBrunoInventoryState(), version } };
    default:
      throw new BrunoInventoryError('INVALID_COMMAND', 'Operação de inventário inválida.');
  }
}
