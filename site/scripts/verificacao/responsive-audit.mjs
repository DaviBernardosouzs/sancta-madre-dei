import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { CAMINHOS } from '../lib/caminhos.mjs';

const phase = process.env.AUDIT_PHASE || 'depois';
const out = `${CAMINHOS.capturas}/responsividade/${phase}`;
mkdirSync(out, { recursive: true });
const base = process.env.PREVIEW_URL || 'http://localhost:4173';
const widths = [320, 360, 375, 390, 430, 639, 640, 767, 768, 991, 992, 1024, 1183, 1184, 1279, 1280, 1440, 1920];
const paths = ['/', '/biblioteca/', '/busca/', '/galeria/', '/aparicoes/', '/maria-pelo-mundo/', '/vida-de-maria/anunciacao/', '/oracoes/pai-nosso/', '/aprofundar/', '/sagrada-familia/', '/iconografia/', '/instalar/', '/pedidos-de-oracao/'];
const browser = await chromium.launch({ headless: true });
const results = [];
const errors = [];
async function measure(page, state) {
  const data = await page.evaluate(() => {
    const visible = el => el.checkVisibility() && el.getBoundingClientRect().width > 0;
    const controls = [...document.querySelectorAll('.topo a, .topo button, .topo summary')].filter(visible);
    const overlaps = [];
    for (let i = 0; i < controls.length; i++) for (let j = i + 1; j < controls.length; j++) {
      const a = controls[i], b = controls[j], x = a.getBoundingClientRect(), y = b.getBoundingClientRect();
      if (Math.min(x.right, y.right) - Math.max(x.left, y.left) > 1 && Math.min(x.bottom, y.bottom) - Math.max(x.top, y.top) > 1) overlaps.push([a.textContent.trim(), b.textContent.trim()]);
    }
    const outside = [...document.querySelectorAll('main h1, main h2, main h3, main p, main button, main input, main select, .topo a, .topo button, .topo summary')].filter(visible).filter(el => !el.closest('.f-pelicula__janela')).filter(el => {
      const r = el.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1;
    }).map(el => ({ tag: el.tagName, cls: el.className, text: el.textContent.trim().slice(0, 90) })).slice(0, 12);
    return { overflow: document.documentElement.scrollWidth > innerWidth + 1, overlaps, outside };
  });
  results.push({ path: new URL(page.url()).pathname, width: page.viewportSize().width, state, ...data });
}
try {
  const context = await browser.newContext({ reducedMotion: 'reduce', serviceWorkers: 'block', hasTouch: true });
  const page = await context.newPage();
  page.on('pageerror', e => errors.push(e.message));
  for (const path of paths) for (const width of widths) {
    await page.setViewportSize({ width, height: width === 768 ? 360 : 900 });
    await page.goto(base + path, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForFunction(() => document.querySelector('[data-motion-toggle]:not([hidden])'));
    await page.evaluate(() => { document.documentElement.style.fontSize = '100%'; document.querySelector('.menu__det').open = false; });
    await page.evaluate(() => document.fonts.ready);
    await measure(page, 'fechado');
    await page.locator('.menu__det').evaluate(el => el.open = true);
    await measure(page, 'menu');
    if (path === '/' && [320, 390, 768, 1440].includes(width)) await page.screenshot({ path: `${out}/inicio-${width}-menu.png` });
    if (!await page.locator('.menu__det').evaluate(el => el.open)) await page.locator('.menu__det').evaluate(el => el.open = true);
    await page.locator('.idioma').evaluate(el => el.open = true);
    await measure(page, 'idiomas');
    if (path === '/' && width === 390) await page.screenshot({ path: `${out}/inicio-390-idiomas.png` });
    await page.locator('.idioma').evaluate(el => el.open = false);
    await page.locator('.menu__det').evaluate(el => el.open = false);
    await page.evaluate(() => document.documentElement.style.fontSize = '160%');
    await page.locator('.menu__det').evaluate(el => el.open = true);
    await measure(page, 'fonte160');
    writeFileSync(`${out}/parcial.json`, JSON.stringify({ results, errors }, null, 2));
    if (['/', '/biblioteca/', '/busca/', '/galeria/'].includes(path) && [320, 768, 1440].includes(width)) await page.screenshot({ path: `${out}/${path.replaceAll('/', '') || 'inicio'}-${width}-fonte160.png` });
    await page.evaluate(() => document.documentElement.style.fontSize = '100%');
  }
  await context.close();
} finally { await browser.close(); }
const failures = results.filter(r => r.overflow || r.overlaps.length || r.outside.length);
writeFileSync(`${out}/resultados.json`, JSON.stringify({ results, errors, failures }, null, 2));
console.log(JSON.stringify({ phase, cases: results.length, errors, failures: failures.length, examples: failures.slice(0, 12) }, null, 2));
if (phase !== 'antes' && (failures.length || errors.length)) process.exitCode = 1;
