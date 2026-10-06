#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const input = resolve(process.argv[2] ?? '');
if (!process.argv[2]) throw new Error('Uso: node scripts/import-dossie.mjs CAMINHO_DO_DOSSIE.md');
const markdown = readFileSync(input, 'utf8');
const articlesPath = new URL('../content/articles.json', import.meta.url);
const sourcesPath = new URL('../content/sources.json', import.meta.url);
const titlesPath = new URL('../content/titles.json', import.meta.url);
const articles = JSON.parse(readFileSync(articlesPath, 'utf8')).filter((article) => !article.id.startsWith('dossie-'));
const sources = JSON.parse(readFileSync(sourcesPath, 'utf8')).filter((source) => !source.id.startsWith('dossie-'));
const clean = (text) => text.replace(/[–—]/g, '-');
const titles = JSON.parse(readFileSync(titlesPath, 'utf8'));
const slugify = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const sourceIds = new Set(sources.map((source) => source.id));
const articleIds = new Set(articles.map((article) => article.id));
const bibliography = markdown.split('## Bibliografia e referências')[1] ?? '';
const bibliographyByCode = new Map();
for (const match of bibliography.matchAll(/^- \*\*([BS]\d{2})\*\* — \[([^\]]+)\]\((https:\/\/[^)]+)\)/gm)) bibliographyByCode.set(match[1], { title: match[2], url: match[3] });
const chapterPattern = /^## (\d+)\. (.+)\n\n\*\*Fontes deste capítulo:\*\* ([^\n]+)\n\n([\s\S]*?)(?=^## \d+\.|^## Bibliografia)/gm;
const chapters = [...markdown.matchAll(chapterPattern)];
if (chapters.length !== 32) throw new Error(`Esperados 32 capítulos; encontrados ${chapters.length}.`);
const banners = ['obra-bellini-madona','durer-porta-dourada','durer-anunciacao','durer-visitacao','durer-desposorios','durer-natividade','durer-apresentacao-jesus','durer-fuga-egito','durer-entre-doutores','obra-flandes-cana','obra-david-crucificacao','durer-pentecostes','obra-signorelli-assuncao','obra-rosario-misterios','obra-reni-imaculada','obra-david-virgem-paisagem'];

for (const chapter of chapters) {
  const number = Number(chapter[1]);
  const title = chapter[2].trim();
  const codes = [...chapter[3].matchAll(/\[([BS]\d{2})\]/g)].map((match) => match[1]);
  const statements = [...chapter[4].matchAll(/^\*\*(\d{3})\.\*\* (.+?)\s{2}$/gm)].map((match) => `${match[1]}. ${match[2].trim()}`);
  if (statements.length !== 16) throw new Error(`Capítulo ${number}: esperadas 16 afirmações; encontradas ${statements.length}.`);
  const mappedSources = codes.map((code) => `dossie-${code.toLowerCase()}`);
  for (const code of codes) {
    const id = `dossie-${code.toLowerCase()}`;
    if (sourceIds.has(id)) continue;
    const bibliographic = bibliographyByCode.get(code);
    const inline = chapter[3].match(new RegExp(`\\[${code}\\]\\((https:\\/\\/[^)]+)\\)`));
    if (!bibliographic && !inline) throw new Error(`Referência ${code} não localizada.`);
    const url = bibliographic?.url ?? inline[1];
    sources.push({ id, type: code.startsWith('B') ? 'escritura' : 'estudo', title: clean(bibliographic?.title ?? `Referência ${code} do dossiê`), institution: new URL(url).hostname.replace(/^www\./, ''), url, documentDate: null, accessedDate: '2026-10-05', note: `Referência ${code} incorporada do dossiê de pesquisa.`, supports: statements.map(clean) });
    sourceIds.add(id);
  }
  const id = `dossie-${String(number).padStart(2, '0')}`;
  if (articleIds.has(id)) continue;
  const kind = number <= 12 ? (number === 2 ? 'tradicao' : 'escritura') : number === 13 || number === 32 ? 'doutrina' : number === 31 ? 'arte' : number >= 15 && number <= 30 ? 'historia' : 'devocional';
  articles.push({ id, slug: `${String(number).padStart(2, '0')}-${slugify(title)}`, type: 'artigo', category: 'dossie', order: number, status: 'published', title: clean(`${number}. ${title}`), summary: clean(statements[0].replace(/^\d{3}\. /, '')), blocks: [{ kind, heading: 'Síntese documentada', text: statements.map(clean).join('\n\n'), sources: mappedSources }], relations: { articles: [], prayers: [], titles: [], apparitions: [], devotions: [] }, review: { state: 'pesquisa-documental', lastVerified: '2026-10-05', humanTheologicalReview: false }, banner: banners[(number - 1) % banners.length], figures: [] });
  articleIds.add(id);
}
writeFileSync(articlesPath, `${JSON.stringify(articles, null, 2)}\n`);
writeFileSync(sourcesPath, `${JSON.stringify(sources, null, 2)}\n`);
for (const title of titles) {
  title.names ??= [{ kind: 'principal', value: title.title, language: 'pt' }];
  title.titleKinds ??= title.id === 'tit-mae-de-deus' || title.id === 'tit-imaculada-conceicao'
    ? ['doutrinal'] : ['aparicao-relatada', 'invocacao'];
}
writeFileSync(titlesPath, `${JSON.stringify(titles, null, 2)}\n`);
console.log(`Dossiê importado: ${chapters.length} capítulos.`);
