#!/usr/bin/env node
// Gera o site em todos os idiomas: português primeiro (limpa a saída e copia os arquivos
// compartilhados), depois os demais. Use --app para a versão do aplicativo Android.
// Para um só idioma: LOCALE=en node scripts/build.mjs
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { LOCALES, DEFAULT_LOCALE } from './lib/i18n.mjs';

const only = (process.env.LOCALES ?? '').split(',').filter(Boolean);
const order = [DEFAULT_LOCALE, ...LOCALES.map((l) => l.code).filter((c) => c !== DEFAULT_LOCALE)].filter((c) => !only.length || only.includes(c) || c === DEFAULT_LOCALE);
const build = fileURLToPath(new URL('./build.mjs', import.meta.url));
const extra = process.argv.slice(2);
for (const code of order) {
  const r = spawnSync(process.execPath, [build, ...extra], { stdio: 'inherit', env: { ...process.env, LOCALE: code } });
  if (r.status !== 0) { console.error(`\nFalha ao gerar o idioma "${code}".`); process.exit(r.status ?? 1); }
}
console.log(`\nTodos os idiomas gerados: ${order.join(', ')}.`);
