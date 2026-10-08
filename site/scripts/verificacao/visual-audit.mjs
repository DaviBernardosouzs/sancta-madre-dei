import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { CAMINHOS } from '../lib/caminhos.mjs';

const base = process.env.PREVIEW_URL || 'http://localhost:4183';
const out = CAMINHOS.capturas;
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
const errors = [];
const paths = [['inicio', '/'], ['leitura', '/vida-de-maria/anunciacao/'], ['galeria', '/galeria/'], ['atlas', '/maria-pelo-mundo/'], ['aparicoes', '/aparicoes/']];
try {
  for (const [device, width, height] of [['celular', 390, 844], ['tablet', 820, 1180], ['desktop', 1440, 1000]]) {
    const context = await browser.newContext({ viewport: { width, height }, colorScheme: 'light' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    for (const [name, path] of paths) {
      await page.goto(base + path);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(2200);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      results.push({ device, page: name, overflow, violations: audit.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) });
      await page.screenshot({ path: `${out}/${name}-${device}.png` });
      if (name === 'inicio') {
        for (const [scene, selector] of [['anunciacao', '[data-cena]'], ['pelicula', '[data-pelicula]'], ['manto', '[data-manto]'], ['mundo', '[data-mundo]'], ['creditos', '[data-creditos]'], ['acervo', '[aria-labelledby="leitura"]']]) {
          await page.locator(selector).scrollIntoViewIfNeeded();
          await page.waitForTimeout(250);
          await page.screenshot({ path: `${out}/${scene}-${device}.png` });
        }
      }
      if (name === 'leitura') {
        await page.locator('.leitura').scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${out}/texto-${device}.png` });
      }
    }
    await context.close();
  }
  for (const colorScheme of ['light', 'dark']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme, reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const [name, path] of paths) {
      await page.goto(base + path);
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      results.push({ device: `estatico-${colorScheme}`, page: name, violations: audit.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) });
      if (['inicio', 'leitura'].includes(name)) await page.screenshot({ path: `${out}/${name}-estatico-${colorScheme}.png` });
    }
    await context.close();
  }
} finally { await browser.close(); }
writeFileSync(`${out}/auditoria.json`, JSON.stringify({ results, errors }, null, 2));
console.log(JSON.stringify({ pages: results.length, errors, failures: results.filter(r => r.overflow || r.violations.length) }, null, 2));
if (errors.length || results.some(r => r.overflow || r.violations.length)) process.exitCode = 1;
