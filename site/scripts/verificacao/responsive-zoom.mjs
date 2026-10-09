// Chromium's tabs API changes browser zoom, rather than applying a CSS transform.
import { chromium } from '@playwright/test';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CAMINHOS } from '../lib/caminhos.mjs';
const extension = mkdtempSync(join(tmpdir(), 'smd-zoom-'));
writeFileSync(join(extension, 'manifest.json'), JSON.stringify({ manifest_version: 3, name: 'Local responsive zoom audit', version: '1.0', permissions: ['tabs'], background: { service_worker: 'background.js' } }));
writeFileSync(join(extension, 'background.js'), `chrome.tabs.onUpdated.addListener((id, info, tab) => { if (info.status === 'complete' && tab.url?.startsWith('http://localhost:4173')) chrome.tabs.setZoom(id, 2); });`);
const out = `${CAMINHOS.capturas}/responsividade/zoom`;
mkdirSync(out, { recursive: true });
const context = await chromium.launchPersistentContext('', { channel: 'chromium', headless: true, viewport: null,
  args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`, '--window-size=1280,900'], reducedMotion: 'reduce', serviceWorkers: 'block' });
const results = [];
try {
  const worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
  const page = await context.newPage();
  for (const path of ['/', '/biblioteca/', '/busca/', '/galeria/', '/maria-pelo-mundo/', '/sagrada-familia/']) {
    await page.goto('http://localhost:4173' + path, { waitUntil: 'domcontentloaded', timeout: 90000 });
    const zoom = await worker.evaluate(async () => {
      const tabs = await chrome.tabs.query({});
      const tab = tabs.find(t => t.url?.startsWith('http://localhost:4173'));
      await chrome.tabs.setZoom(tab.id, 2);
      return chrome.tabs.getZoom(tab.id);
    });
    await page.locator('.menu > details > summary').click();
    await page.locator('.idioma summary').click();
    const data = await page.evaluate(() => ({ innerWidth, dpr: devicePixelRatio, overflow: document.documentElement.scrollWidth > innerWidth + 1 }));
    results.push({ path, zoom, ...data });
    await page.screenshot({ path: `${out}/${path.replaceAll('/', '') || 'inicio'}-200.png` });
  }
} finally { await context.close(); }
writeFileSync(`${out}/resultados.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
if (results.some(r => r.zoom !== 2 || r.overflow)) process.exitCode = 1;
