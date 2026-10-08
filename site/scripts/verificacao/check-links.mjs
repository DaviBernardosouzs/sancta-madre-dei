#!/usr/bin/env node
// Verifica em dist/: links internos, âncoras, imagens, ausência de rascunhos, travessões e metadados básicos.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { loadContent } from '../lib/content.mjs';
import { CAMINHOS } from '../lib/caminhos.mjs';

const DIST = CAMINHOS.saida();
const BASE = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');
const files = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); } })(DIST);

const problems = [];
const idsOf = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const cache = new Map(files.map((f) => [f, readFileSync(f, 'utf8')]));
const resolve = (url) => {
  const clean = decodeURIComponent(url.split('#')[0].split('?')[0]).slice(BASE.length - 1);
  const p = join(DIST, clean);
  if (existsSync(p) && statSync(p).isDirectory()) return join(p, 'index.html');
  return p;
};

for (const [file, html] of cache) {
  const rel = file.slice(DIST.length);
  if (!rel.endsWith('404.html')) {
    if (!/<title>[^<]{5,}<\/title>/.test(html)) problems.push(`${rel}: sem <title>`);
    if (!/<meta name="description" content="[^"]{20,}"/.test(html)) problems.push(`${rel}: sem meta description`);
    if ((html.match(/<h1[\s>]/g) ?? []).length !== 1) problems.push(`${rel}: deve ter exatamente um h1`);
    if (!/<html lang="pt-BR">/.test(html)) problems.push(`${rel}: sem lang`);
  }
  const DECORATIVA = ['abertura__bruma', 'passagem__arte', 'heroi__ceu', 'ambiente__arte', 'faixa-oracao__arte', 'aria-hidden="true"'];
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (tag.includes('data-lb-img')) continue; // preenchida por JS ao abrir a obra
    if (!/\salt="/.test(tag)) { problems.push(`${rel}: imagem sem atributo alt`); continue; }
    if (/\salt=""/.test(tag)) {
      const contexto = html.slice(Math.max(0, m.index - 400), m.index);
      if (!DECORATIVA.some((c) => contexto.includes(c))) problems.push(`${rel}: imagem com alt vazio fora de contêiner decorativo`);
    }
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) problems.push(`${rel}: imagem sem width/height (evita salto de layout)`);
    const ss = tag.match(/\ssrcset="([^"]+)"/);
    if (ss) for (const part of ss[1].split(',')) {
      const u = part.trim().split(/\s+/)[0];
      if (u.startsWith(BASE) && !existsSync(resolve(u))) problems.push(`${rel}: arquivo de srcset ausente ${u}`);
    }
  }
  if (/[—–]/.test(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ''))) problems.push(`${rel}: contém travessão (em-dash/en-dash)`);
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const u = m[1];
    if (/^(https?:|mailto:|data:)/.test(u)) continue;
    if (u.startsWith('#')) { if (u.length > 1 && !idsOf(html).has(u.slice(1))) problems.push(`${rel}: âncora ausente ${u}`); continue; }
    if (!u.startsWith(BASE)) { problems.push(`${rel}: link fora da base ${u}`); continue; }
    const target = resolve(u);
    if (!existsSync(target)) { problems.push(`${rel}: link quebrado ${u}`); continue; }
    const hash = u.split('#')[1];
    if (hash && target.endsWith('.html') && !idsOf(readFileSync(target, 'utf8')).has(hash)) problems.push(`${rel}: âncora ausente ${u}`);
  }
}

// rascunhos nunca podem vazar para o HTML, o sitemap ou o robots
const data = loadContent();
const drafts = ['apparitions', 'miracles', 'devotions', 'titles', 'prayers', 'articles'].flatMap((c) => data[c].filter((r) => r.status !== 'published'));
const surfaces = [...cache.values(), readFileSync(join(DIST, 'sitemap.xml'), 'utf8')].join('\n');
for (const d of drafts) {
  if (surfaces.includes(d.id) || surfaces.includes(`/${d.slug}/`)) problems.push(`rascunho vazou: ${d.id}`);
}

console.log(`${files.length} páginas verificadas.`);
if (problems.length) { console.error('Problemas:\n' + problems.map((p) => ` - ${p}`).join('\n')); process.exit(1); }
console.log('Links, âncoras, imagens, metadados, h1, travessões e rascunhos: sem problemas.');
