import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const missingPath = '/rota-inexistente/';
const orbitVideo = 'https://d8j0ntlcm91z4.cloudfront.net/**';

test('a rota inexistente local mantém a imagem e a navegação com movimento habilitado', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const requests: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).hostname === 'd8j0ntlcm91z4.cloudfront.net') requests.push(request.url());
  });
  const response = await page.goto(missingPath);
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Página fora de órbita');
  await expect(page.locator('.planet img')).toBeVisible();
  await expect(page.locator('video')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /reproduzir vídeo/i })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Jogo', exact: true })).toHaveAttribute('href', /\/lab\/index\.html$/);
  await expect(page.getByRole('link', { name: 'Pesquisa' })).toHaveAttribute('href', /\/research-library\.html$/);
  await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/oalexandrebelo/MISSAO-IPE');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => innerWidth));

  if (testInfo.project.name === 'mobile') {
    const menu = page.getByRole('button', { name: 'Abrir menu' });
    await menu.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog').getByRole('link', { name: /Três casos NASA/ })).toHaveAttribute('href', '/#jornada');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(menu).toBeFocused();
  }

  const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(audit.violations.map(violation => violation.id)).toEqual([]);
  expect(requests).toEqual([]);
  await page.getByRole('link', { name: 'Voltar ao início', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('O espaço é só');
  await expect(page.getByRole('link', { name: 'Abrir roteiro da demonstração' })).toHaveAttribute('href', /\/49-ROTEIRO-APRESENTACAO-MVP-R19\.html$/);
});

test('a imagem local e o retorno permanecem ao falhar o vídeo na LP autônoma', async ({ page, request, baseURL }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const standalone = 'https://projeto-ipe-lp.vercel.app';
  await page.route(`${standalone}/**`, async route => {
    const url = new URL(route.request().url());
    const local = new URL(url.pathname + url.search, baseURL);
    await route.fulfill({ response: await request.get(local.href) });
  });
  await page.route(orbitVideo, route => route.abort());
  await page.goto(`${standalone}${missingPath}`);
  await expect(page.getByRole('button', { name: 'Tentar reproduzir vídeo' })).toBeVisible();
  await expect(page.locator('video')).toHaveAttribute('data-visible', 'false');
  await expect(page.locator('.planet img')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Voltar ao início', exact: true })).toBeVisible();
});
