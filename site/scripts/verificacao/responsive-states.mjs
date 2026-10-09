import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { CAMINHOS } from '../lib/caminhos.mjs';
const base = process.env.PREVIEW_URL || 'http://localhost:4173';
const out = `${CAMINHOS.capturas}/responsividade/estados`;
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const checks = [];

async function check(page, state) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  checks.push({ path: new URL(page.url()).pathname, viewport: page.viewportSize(), state, overflow });
  writeFileSync(`${out}/parcial.json`, JSON.stringify(checks, null, 2));
}
async function menu(page) { if (!await page.locator('.menu__det').evaluate(el => el.open)) await page.locator('.menu > details > summary').click(); }
try {
  const context = await browser.newContext({ hasTouch: true, reducedMotion: 'reduce', serviceWorkers: 'block' });
  const page = await context.newPage();
  for (const lang of ['pt', 'en', 'es', 'fr', 'it', 'de', 'ja', 'zh']) for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width === 768 ? 360 : 900 });
    await page.goto(`${base}/${lang === 'pt' ? '' : lang + '/'}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.evaluate(() => document.fonts.ready);
    await menu(page);
    await page.locator('[data-fonte="0"]').tap();
    for (let n = 0; n < 6; n++) await page.locator('[data-fonte="10"]').tap();
    assert.equal(await page.evaluate(() => document.documentElement.style.fontSize), '160%');
    await page.locator('.idioma summary').tap();
    await check(page, `${lang}: menu, idiomas e fonte160`);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.idioma').evaluate(el => el.open), false);
    assert.equal(await page.locator('.menu__det').evaluate(el => el.open), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.menu__det').evaluate(el => el.open), false);
    assert.equal(await page.locator('.menu > details > summary').evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => !!document.activeElement.closest('.menu__painel')), false);
    await check(page, `${lang}: fechado, fonte160`);
    if (['pt', 'de', 'ja', 'zh'].includes(lang) && [320, 1440].includes(width)) await page.screenshot({ path: `${out}/${lang}-${width}-fonte160.png` });
  }
  for (const [width, height] of [[320,900],[360,800],[375,800],[390,844],[430,900],[768,360],[1024,768],[1280,900],[1440,900],[1920,1080]]) {
    await page.setViewportSize({ width, height });
    await page.goto(base + '/galeria/', { waitUntil: 'domcontentloaded', timeout: 90000 });
    const opener = page.locator('[data-lightbox]').first();
    await opener.focus(); await page.keyboard.press('Enter');
    await page.locator('#lb[open]').waitFor();
    assert.equal(await page.locator('.lb__in').evaluate(el => getComputedStyle(el).display), 'grid', 'Modal styled on mobile');
    assert.equal(await page.locator('#lb').evaluate(el => getComputedStyle(el).padding), '0px', 'Modal must fill viewport');
    assert.equal(await page.locator('[data-lb-fechar]').evaluate(el => el.getBoundingClientRect().height >= 44), true, 'Modal close touch target');
    assert.equal(await page.locator('#lb').evaluate(el => {
      const image = el.querySelector('.lb__img img').getBoundingClientRect();
      const frame = el.querySelector('.lb__img').getBoundingClientRect();
      const legend = el.querySelector('.lb__legenda').getBoundingClientRect();
      const nav = el.querySelector('.lb__nav').getBoundingClientRect();
      const intersects = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;
      return image.bottom <= frame.bottom + 1 && image.right <= frame.right + 1 && !intersects(image, legend) && !intersects(image, nav);
    }), true, 'Image must fit its frame without covering caption or navigation');
    await check(page, 'modal, fonte160');
    await page.locator('[data-lb-prox]').tap();
    await page.locator('[data-lb-ant]').tap();
    if ([320,768,1440].includes(width)) await page.screenshot({ path: `${out}/modal-${width}.png` });
    await page.keyboard.press('Escape');
    assert.equal(await opener.evaluate(el => el === document.activeElement), true);
  }
  for (const path of ['/biblioteca/#imagens', '/busca/?q=maria', '/sagrada-familia/#etapas', '/iconografia/', '/aprofundar/', '/oracoes/pai-nosso/']) {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(base + path, { waitUntil: 'domcontentloaded', timeout: 90000 });
    if (path.includes('biblioteca')) await page.locator('.creditos .fonte').first().scrollIntoViewIfNeeded();
    if (path.includes('busca')) await page.locator('.filtros').scrollIntoViewIfNeeded();
    if (path.includes('pai-nosso')) { await page.locator('[data-leitura-toggle]').tap(); await page.keyboard.press('Escape'); }
    await check(page, 'conteúdo, fonte160');
    await page.screenshot({ path: `${out}/conteudo-${new URL(page.url()).pathname.replaceAll('/', '')}.png` });
  }
  await context.close();
  for (const reducedMotion of ['reduce', 'no-preference']) {
    const c = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion, serviceWorkers: 'block' });
    const p = await c.newPage(); await p.goto(base); await p.waitForTimeout(5500);
    await menu(p);
    if (reducedMotion === 'reduce') assert.equal(await p.locator('[data-motion-toggle]').isDisabled(), true);
    else {
      await check(p, 'animações ativadas');
      await p.locator('[data-motion-toggle]').click();
    }
    await check(p, `movimento: ${reducedMotion}`);
    await p.keyboard.press('Escape');
    for (const selector of ['[data-cena]', '[data-pelicula]', '[data-manto]', '[data-mundo]', '[data-creditos]']) {
      await p.locator(selector).scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
      await check(p, `${reducedMotion}: ${selector}`);
      await p.screenshot({ path: `${out}/${reducedMotion}-${selector.replaceAll(/[^a-z-]/g,'')}.png` });
    }
    await c.close();
  }
} finally { await browser.close(); }
writeFileSync(`${out}/resultados.json`, JSON.stringify(checks, null, 2));
console.log(JSON.stringify({ cases: checks.length, failures: checks.filter(c => c.overflow) }, null, 2));
if (checks.some(c => c.overflow)) process.exitCode = 1;
