import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('a página completa não causa erros e mantém os assets locais', async ({ page }) => {
  const errors: string[] = []; const badAssets: string[] = []; const external: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400) badAssets.push(`${r.status()} ${r.url()}`); });
  page.on('request', r => { if (new URL(r.url()).origin !== 'http://127.0.0.1:4177') external.push(r.url()); });
  await page.goto('/'); await expect(page.getByRole('heading', { level:1 })).toContainText('O espaço é só');
  const hero = page.locator('.hero-actions');
  const play = hero.getByRole('link', { name:'Jogar agora', exact:true });
  const documentation = hero.getByRole('link', { name:'Documentação', exact:true });
  await expect(play).toHaveAttribute('href', 'https://nasa-missaoipe.alexandrebelo.com/lab/index.html');
  await expect(documentation).toHaveAttribute('href', 'https://nasa-missaoipe.alexandrebelo.com/documentacao');
  await expect(play).toBeInViewport(); await expect(documentation).toBeInViewport();
  await page.locator('#laboratorio').scrollIntoViewIfNeeded(); await expect(page.getByRole('button', {name:'Redesenhar',exact:true})).toBeVisible();
  await page.locator('.site-footer').scrollIntoViewIfNeeded();
  await expect(page.getByRole('link',{name:'Fontes e créditos'})).toBeVisible();
  await expect(page.locator('.site-footer').getByRole('link', { name:'Documentação' })).toHaveAttribute('href', 'https://nasa-missaoipe.alexandrebelo.com/documentacao');
  expect(errors).toEqual([]); expect(badAssets).toEqual([]); expect(external).toEqual([]);
});

test('o laboratório calcula a falha, o redesenho e exporta o resultado real', async ({ page }) => {
  await page.goto('/'); await page.locator('#laboratorio').scrollIntoViewIfNeeded();
  const result = page.locator('.lab-result'); await expect(result).toContainText('2/6');
  await page.getByRole('button',{name:'Redesenhar',exact:true}).click(); await expect(result).toContainText('6/6');
  await expect(page.locator('.lab-metrics')).toContainText('84 / 86');
  const download = page.waitForEvent('download'); await page.getByRole('button',{name:'Baixar resultado'}).click();
  const file = await download; expect(file.suggestedFilename()).toBe('ipe-short-contact-redesenho.json');
  const stream = await file.createReadStream(); const chunks = []; for await (const chunk of stream!) chunks.push(chunk);
  const json = JSON.parse(Buffer.concat(chunks).toString()); expect(json.deliveredRecords).toBe(6); expect(json.outcome).toBe('success');
  await page.getByRole('button',{name:'Configuração base',exact:true}).click(); await expect(result).toContainText('2/6');
  await page.getByRole('button',{name:'Contatos longos',exact:true}).click(); await expect(result).toContainText('6/6');
});

test('os quatro segmentos funcionam com clique e teclado', async ({ page }) => {
  await page.goto('/'); const tab = page.getByRole('tab',{name:/Espaço/}); await tab.scrollIntoViewIfNeeded();
  await expect(tab).toHaveAttribute('aria-selected','true'); await tab.focus(); await tab.press('ArrowRight');
  await expect(page.getByRole('tab',{name:/Solo/})).toHaveAttribute('aria-selected','true');
  await expect(page.getByRole('tabpanel')).toContainText('Observar não é o mesmo que entregar');
  await page.getByRole('tab',{name:/Solo/}).press('End');
  await expect(page.getByRole('tabpanel')).toContainText('A descoberta depende de quem interpreta');
  await page.getByRole('tab',{name:/Lançamento/}).click(); await expect(page.getByRole('tabpanel')).toContainText('Capacidade de carga');
});

test('três casos distinguem fatos e exercício e levam à campanha disponível', async ({ page }) => {
  await page.goto('/');
  const question = page.locator('summary').filter({hasText:'Quais missões estão disponíveis?'});
  await question.click(); await expect(question.locator('..')).toContainText('Primeiro sinal');
  await expect(page.locator('.level-card')).toHaveCount(3);
  const bennu = page.locator('.level-card').filter({has:page.getByRole('heading',{name:'Bennu / OSIRIS-REx',exact:true})});
  await bennu.locator('summary').click(); await expect(bennu).toContainText('Seis eixos maiores de rochas e clastos');
  await expect(bennu.getByRole('link',{name:/rochas de Bennu/})).toHaveAttribute('href','https://ntrs.nasa.gov/citations/20205007912');
  await expect(page.getByRole('link',{name:/Jogue a campanha:/})).toHaveAttribute('href','https://nasa-missaoipe.alexandrebelo.com/campanha/index.html');
  await expect(page.getByRole('link',{name:'MISSÃO IPÊ — início'}).locator('img')).toHaveAttribute('src','/brand/missao-ipe-logo.svg');
  await expect(page.getByRole('link',{name:'GitHub',exact:true})).toHaveAttribute('href','https://github.com/oalexandrebelo/MISSAO-IPE');
});

test('movimento reduzido e o controle de pausa preservam a leitura', async ({ page }) => {
  await page.goto('/'); await expect(page.locator('html')).toHaveAttribute('data-motion','off');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await page.getByRole('button',{name:'Ativar animações',exact:true}).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion','on');
  await page.getByRole('button',{name:'Pausar animações',exact:true}).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion','off');
  const activeAnimations = await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length);
  expect(activeAnimations).toBe(0);
});

test('filme abre, carrega o player, fecha por Escape e devolve foco', async ({ page }) => {
  const errors:string[] = []; page.on('pageerror', e=>errors.push(e.message));
  await page.goto('/'); const trigger = page.getByRole('button',{name:/Veja a missão/}); await trigger.click();
  await expect(page.getByRole('dialog',{name:'Da órbita, para a vida.'})).toBeVisible();
  await expect(page.getByRole('button',{name:/Play|Reproduzir/i}).first()).toBeVisible();
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).not.toBeVisible(); await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});

test('layout não transborda em três larguras e todos os links locais resolvem', async ({ page }) => {
  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({width,height:900}); await page.goto('/');
    await page.locator('#jornada').scrollIntoViewIfNeeded();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow,`overflow em ${width}px`).toBe(false);
  }
  const anchors = await page.locator('a[href^="#"]').evaluateAll(items => items.map(a => a.getAttribute('href')!));
  for (const href of new Set(anchors)) expect(await page.locator(href).count()).toBeGreaterThan(0);
  // Focusing a control in a short viewport must scroll the document, never the clipped hero.
  await page.setViewportSize({width:976,height:510}); await page.goto('/');
  const motionControl = page.getByRole('button',{name:'Ativar animações',exact:true});
  await motionControl.scrollIntoViewIfNeeded(); await motionControl.focus();
  expect(await page.locator('.hero').evaluate(el=>el.scrollTop)).toBe(0);
  await page.goto('/creditos/'); await expect(page.getByRole('heading',{level:1})).toContainText('Uma missão');
});

test('auditoria WCAG A/AA na página e no laboratório', async ({ page }) => {
  await page.goto('/'); await page.locator('#laboratorio').scrollIntoViewIfNeeded(); await expect(page.locator('.lab-console')).toBeVisible();
  const results = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(results.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
});

test('navegação responsiva mantém o foco e os destinos', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'desktop') { await page.goto('/'); const navigation = page.getByRole('navigation',{name:'Navegação principal'}); await expect(navigation.getByRole('link',{name:'Documentação'})).toHaveAttribute('href', 'https://nasa-missaoipe.alexandrebelo.com/documentacao'); await expect(page.getByRole('button',{name:'Abrir menu'})).not.toBeVisible(); return; }
  await page.goto('/'); const trigger = page.getByRole('button',{name:'Abrir menu'}); await trigger.click();
  await expect(page.getByRole('dialog',{name:'Navegação'})).toBeVisible();
  const navigation = page.getByRole('navigation',{name:'Navegação no celular'});
  await expect(navigation.getByRole('link',{name:'Jogar o beta'})).toHaveAttribute('href', 'https://nasa-missaoipe.alexandrebelo.com/lab/index.html');
  await expect(navigation.getByRole('link',{name:'Documentação'})).toHaveAttribute('href', 'https://nasa-missaoipe.alexandrebelo.com/documentacao');
  await page.keyboard.press('Escape'); await expect(trigger).toBeFocused();
  await trigger.click(); await page.getByRole('navigation',{name:'Navegação no celular'}).getByRole('link',{name:/Três casos NASA/}).click();
  await expect(page.getByRole('dialog')).not.toBeVisible(); await expect(page).toHaveURL(/#jornada$/);
});
