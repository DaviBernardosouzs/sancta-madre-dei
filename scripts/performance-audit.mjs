import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';

const chrome = await launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'] });
const results = [];
try {
  for (const path of ['/', '/vida-de-maria/anunciacao/']) {
    const { lhr } = await lighthouse((process.env.PREVIEW_URL || 'http://localhost:4183') + path, { port: chrome.port, output: 'json', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
    results.push({ path, scores: Object.fromEntries(Object.entries(lhr.categories).map(([k, v]) => [k, v.score])), metrics: Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'cumulative-layout-shift', 'total-blocking-time', 'speed-index'].map(k => [k, lhr.audits[k].numericValue])), diagnostics: Object.fromEntries(Object.entries(lhr.audits).filter(([key]) => ['lcp-breakdown-insight', 'lcp-discovery-insight', 'network-requests'].includes(key))), opportunities: Object.entries(lhr.audits).filter(([, a]) => a.score !== null && a.score < 1 && a.details?.type === 'opportunity').map(([id, a]) => ({ id, title: a.title, value: a.displayValue })) });
  }
  writeFileSync('docs/capturas/desempenho.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results.map(({diagnostics, ...rest}) => rest), null, 2));
} finally { await chrome.kill(); }
