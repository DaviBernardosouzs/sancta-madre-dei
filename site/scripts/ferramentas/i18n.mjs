#!/usr/bin/env node
// Ferramenta de tradução do conteúdo.
//   node site/scripts/ferramentas/i18n.mjs export <colecao|all> [--out arquivo]   escreve os campos traduzíveis em português
//   node site/scripts/ferramentas/i18n.mjs import <idioma> <arquivo...>            lê traduções e grava site/i18n/content/<idioma>/
//   node site/scripts/ferramentas/i18n.mjs status                                  mostra o que falta por idioma/coleção
// Formato dos arquivos de trabalho: "@@ <colecao>/<id>", depois pares "## <caminho>" + texto (quebra de linha escrita como \n).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadContent } from '../lib/content.mjs';
import { CAMINHOS } from '../lib/caminhos.mjs';
import { flatten, hashOf, SCHEMA, loadOverlays } from '../lib/i18n-content.mjs';

const CODES = ['es', 'en', 'fr', 'it', 'de', 'ja', 'zh'];
const published = (r) => r.status === 'published' || r.status === undefined;

function records() {
  const d = loadContent();
  const rosary = JSON.parse(readFileSync(join(CAMINHOS.conteudo, 'rosary.json'), 'utf8'));
  const out = {};
  for (const col of ['articles', 'apparitions', 'miracles', 'devotions', 'titles', 'shrines', 'prayers', 'celebrations', 'sources', 'images']) out[col] = (d[col] ?? []).filter(published);
  out.derivedImages = d.derivedImages ?? [];
  out.rosary = rosary ? [{ id: 'rosario', ...rosary }] : [];
  return out;
}
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
const unesc = (s) => s.replace(/\\(n|\\)/g, (_, c) => (c === 'n' ? '\n' : '\\'));
const setAt = (o, path, v) => { let c = o; for (let i = 0; i < path.length - 1; i++) { const k = path[i]; c[k] ??= typeof path[i + 1] === 'number' ? [] : {}; c = c[k]; } c[path.at(-1)] = v; };

const [cmd, ...args] = process.argv.slice(2);
const recs = records();

if (cmd === 'export') {
  const cols = args[0] === 'all' || !args[0] ? Object.keys(recs) : [args[0]];
  const skip = new Set(args.includes('--skip') ? args[args.indexOf('--skip') + 1].split(',') : []);
  let out = '';
  for (const col of cols) for (const r of recs[col]) {
    if (skip.has(`${col}/${r.id}`)) continue;
    out += `@@ ${col}/${r.id}\n`;
    for (const e of flatten(r, col)) out += `## ${e.path.join('.')}\n${esc(e.value)}\n`;
  }
  const i = args.indexOf('--out');
  if (i >= 0) writeFileSync(args[i + 1], out); else process.stdout.write(out);
} else if (cmd === 'import') {
  const [code, ...files] = args;
  if (!CODES.includes(code)) throw new Error('idioma desconhecido: ' + code);
  const dir = join(CAMINHOS.i18n, 'content', code);
  mkdirSync(dir, { recursive: true });
  const existing = loadOverlays(code);
  const byCol = {};
  let bad = 0;
  for (const f of files) {
    let cur = null, path = null;
    for (const line of readFileSync(f, 'utf8').split('\n')) {
      if (line.startsWith('@@ ')) {
        const [col, ...rest] = line.slice(3).trim().split('/');
        const id = rest.join('/');
        const rec = recs[col]?.find((r) => r.id === id);
        if (!rec) { console.error('registro desconhecido', line); bad++; cur = null; continue; }
        cur = { col, id, rec, ov: {}, seen: new Set() }; path = null;
        (byCol[col] ??= []).push(cur);
      } else if (line.startsWith('## ') && cur) path = line.slice(3).trim();
      else if (path && cur && line !== '') { setAt(cur.ov, path.split('.').map((k) => (/^\d+$/.test(k) ? +k : k)), unesc(line)); cur.seen.add(path); path = null; }
    }
  }
  for (const [col, list] of Object.entries(byCol)) {
    const file = join(dir, `${col}.json`);
    const data = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
    for (const it of list) {
      const want = flatten(it.rec, col);
      const miss = want.filter((e) => !it.seen.has(e.path.join('.')));
      const sameShape = want.every((e) => { const t = e.path.reduce((a, k) => a?.[k], it.ov); return typeof t === 'string'; });
      if (miss.length) { console.error(`${code} ${col}/${it.id}: faltam ${miss.length} campo(s): ${miss.slice(0, 3).map((e) => e.path.join('.')).join(', ')}`); bad++; if (!sameShape) continue; }
      // placeholders de segurança: números e URLs do original precisam estar na tradução? (aviso apenas)
      it.ov._src = hashOf(it.rec, col);
      data[it.id] = it.ov;
    }
    writeFileSync(file, JSON.stringify(Object.fromEntries(Object.entries(data).sort(([a], [b]) => a.localeCompare(b))), null, 1) + '\n');
  }
  console.log(bad ? `${bad} problema(s)` : 'ok', code, Object.fromEntries(Object.entries(byCol).map(([c, l]) => [c, l.length])));
} else if (cmd === 'status') {
  for (const code of CODES) {
    const ov = loadOverlays(code); const parts = [];
    for (const col of Object.keys(recs)) {
      const have = recs[col].filter((r) => ov[col]?.[r.id] && ov[col][r.id]._src === hashOf(r, col)).length;
      parts.push(`${col} ${have}/${recs[col].length}`);
    }
    console.log(code.padEnd(3), parts.join(' · '));
  }
} else console.log('uso: export | import | status');
