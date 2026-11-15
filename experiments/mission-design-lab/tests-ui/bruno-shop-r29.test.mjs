import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';
import { installInventoryApi, TEST_SESSION } from './metrics-api-fixture.mjs';

const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://mission.test/', pretendToBeVisual: true });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLCanvasElement', 'Element', 'Node', 'MutationObserver', 'localStorage', 'location']) {
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value: dom.window[name] });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.HTMLCanvasElement.prototype.getContext = () => null;
const { render, screen, fireEvent, act, cleanup, waitFor, within } = await import('@testing-library/react');
const { BrunoEquipmentShop } = await import('../src/ui/BrunoEquipmentShop.tsx');
const { useBrunoInventory } = await import('../src/ui/BrunoInventoryController.ts');
after(() => dom.window.close());

function Shop() {
  const controller = useBrunoInventory(TEST_SESSION.sessionId);
  return React.createElement(BrunoEquipmentShop, { controller, onBack() {}, backLabel: 'Voltar às missões' });
}

test('a loja confirma várias unidades em um pedido e recupera o mesmo recibo sem repetir a compra', async t => {
  t.after(() => act(async () => cleanup()));
  const api = await installInventoryApi();
  await act(async () => render(React.createElement(Shop)));
  const select = () => screen.getByRole('combobox', { name: 'Quantidade' });
  const selectCount = value => act(async () => fireEvent.change(select(), { target: { value } }));
  const click = name => act(async () => fireEvent.click(screen.getByRole('button', { name })));
  const catalog = screen.getByRole('group', { name: 'Catálogo de instrumentos' });
  const chooseGear = name => act(async () => fireEvent.click(within(catalog).getByRole('button', { name })));
  const buy = () => screen.getByRole('button', { name: /^Comprar Monitor de compostos voláteis/ });
  await waitFor(() => assert.equal(document.querySelector('.bruno-wallet dd').textContent, '25'));
  assert.deepEqual([...select().options].map(option => option.value), ['1', '2', '3', '4', '5']);

  await selectCount('3');
  await chooseGear(/^Radar do gelo/);
  assert.equal(select().value, '1');
  await chooseGear(/^Monitor de compostos voláteis/);
  await selectCount('3');
  assert.match(buy().textContent, /15 créditos/);
  api.loseNextAcknowledgement('buy');
  await act(async () => fireEvent.click(buy()));
  assert.equal(select().disabled, true);
  assert.equal(buy().disabled, true);
  const beforeRetry = api.calls.filter(call => call?.command?.kind === 'buy');
  assert.equal(beforeRetry.length, 1);
  assert.deepEqual(beforeRetry[0].command.instrumentIds, ['iss-air-quality', 'iss-air-quality', 'iss-air-quality']);

  await click('Confirmar operação anterior');
  const purchases = api.calls.filter(call => call?.command?.kind === 'buy');
  assert.deepEqual(purchases, [beforeRetry[0], beforeRetry[0]]);
  const stock = (await api.snapshot()).inventory;
  assert.equal(stock.balance, 10);
  assert.equal(stock.items.length, 3);
  assert.equal(new Set(stock.items.map(item => item.id)).size, 3);
  assert.deepEqual(stock.reservations, {});
  assert.deepEqual([...select().options].map(option => option.value), ['1', '2']);
  assert.equal(select().value, '1');
  assert.match(buy().textContent, /5 créditos/);
});
