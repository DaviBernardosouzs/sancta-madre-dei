// Núcleo de internacionalização do build.
//
// - O site é gerado uma vez por idioma (LOCALE=en node scripts/build.mjs). O português fica na
//   raiz e é o idioma de referência; os demais ficam em /en/, /es/, /fr/, /it/, /de/, /ja/, /zh/.
// - Texto de interface: `_()` usa a própria frase em português como chave do dicionário
//   (i18n/ui/<idioma>.json). Se a frase mudar, o build acusa a tradução ausente.
// - Conteúdo (artigos, aparições, títulos...): sobreposições por registro em
//   i18n/content/<idioma>/ (ver i18n-content.mjs).
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './content.mjs';

export const LOCALES = [
  { code: 'pt', lang: 'pt-BR', og: 'pt_BR', native: 'Português', short: 'PT', prefix: '', intl: 'pt-BR' },
  { code: 'en', lang: 'en', og: 'en_US', native: 'English', short: 'EN', prefix: 'en/', intl: 'en' },
  { code: 'es', lang: 'es', og: 'es_ES', native: 'Español', short: 'ES', prefix: 'es/', intl: 'es' },
  { code: 'fr', lang: 'fr', og: 'fr_FR', native: 'Français', short: 'FR', prefix: 'fr/', intl: 'fr' },
  { code: 'it', lang: 'it', og: 'it_IT', native: 'Italiano', short: 'IT', prefix: 'it/', intl: 'it' },
  { code: 'de', lang: 'de', og: 'de_DE', native: 'Deutsch', short: 'DE', prefix: 'de/', intl: 'de' },
  { code: 'ja', lang: 'ja', og: 'ja_JP', native: '日本語', short: 'JA', prefix: 'ja/', intl: 'ja' },
  { code: 'zh', lang: 'zh-Hans', og: 'zh_CN', native: '简体中文', short: 'ZH', prefix: 'zh/', intl: 'zh-Hans' }
];
export const DEFAULT_LOCALE = 'pt';
export const I18N_DIR = join(ROOT, 'i18n');

const code = process.env.LOCALE ?? DEFAULT_LOCALE;
export const L = LOCALES.find((x) => x.code === code);
if (!L) {
  console.error(`LOCALE inválido: ${code}. Use um de: ${LOCALES.map((x) => x.code).join(', ')}`);
  process.exit(1);
}
export const isCJK = L.code === 'ja' || L.code === 'zh';
export const STRICT = process.env.I18N_STRICT === '1';

const readJson = (p, fallback) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : fallback);
const dict = L.code === DEFAULT_LOCALE ? {} : readJson(join(I18N_DIR, 'ui', `${L.code}.json`), {});

export const used = new Set();
export const missing = new Set();

const fill = (s, vars) => (vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s);

function lookup(key) {
  used.add(key);
  if (L.code === DEFAULT_LOCALE) return key;
  const v = dict[key];
  if (v === undefined) { missing.add(key); return key; }
  return v;
}

/** Texto simples (quem chama aplica esc() quando for para HTML). */
export const _ = (key, vars) => {
  const v = lookup(key);
  return fill(typeof v === 'string' ? v : v.other, vars);
};
/** Nome próprio vindo dos dados (autor, cidade, instituição de origem): usa a forma do dicionário se houver; senão, o original. */
export const names = new Set();
export const proper = (v) => {
  if (!v) return v;
  names.add(v);
  if (L.code === DEFAULT_LOCALE) return v;
  const t = dict[v];
  return typeof t === 'string' ? t : v;
};

/** Texto com marcação HTML da própria frase. Os valores de vars entram como estão: escape antes. */
export const _h = _;

const rules = new Intl.PluralRules(L.intl);
/** Plural: a chave é a forma em português; a tradução é um objeto { one, other, ... }. */
export function _n(key, n, vars) {
  const v = lookup(key);
  const all = { n, ...vars };
  if (typeof v === 'string') return fill(v, all);
  return fill(v[rules.select(n)] ?? v.other, all);
}

/** Formas de plural para o navegador: { one, other, ... } (o JavaScript escolhe pela regra do idioma). */
const PT_PLURAL = { '{n} resultado(s)': { one: '{n} resultado', other: '{n} resultados' } };
export function nforms(key) {
  const v = lookup(key);
  if (L.code === DEFAULT_LOCALE && PT_PLURAL[key]) return PT_PLURAL[key];
  return typeof v === 'string' ? { other: v } : v;
}

/** Lista com conjunção correta no idioma (A, B e C). */
export const listAnd = (items) => new Intl.ListFormat(L.intl, { style: 'long', type: 'conjunction' }).format(items);

const regionNames = new Intl.DisplayNames([L.intl], { type: 'region' });
/** Nome do país no idioma da página (CLDR); no português mantém o nome do acervo. */
export function countryName(iso, fallback) {
  if (L.code === DEFAULT_LOCALE || !iso) return fallback ?? iso;
  try { return regionNames.of(String(iso).toUpperCase()) ?? fallback; } catch { return fallback ?? iso; }
}

/** Comparação alfabética no idioma da página. */
export const collator = new Intl.Collator(L.intl);

// ---------- referências bíblicas ----------
// Abreviaturas usadas no acervo (padrão da Bíblia católica em português) para cada idioma.
const BOOKS = {
  Mq: { pt: 'Mq', en: 'Mic', es: 'Miq', fr: 'Mi', it: 'Mic', de: 'Mi', ja: 'ミカ書', zh: '弥' },
  Sf: { pt: 'Sf', en: 'Zeph', es: 'Sof', fr: 'So', it: 'Sof', de: 'Zef', ja: 'ゼファニヤ書', zh: '番' },
  Zc: { pt: 'Zc', en: 'Zech', es: 'Zac', fr: 'Za', it: 'Zc', de: 'Sach', ja: 'ゼカリヤ書', zh: '亚' },
  Pr: { pt: 'Pr', en: 'Prov', es: 'Prov', fr: 'Pr', it: 'Pr', de: 'Spr', ja: '箴言', zh: '箴' },
  Jt: { pt: 'Jt', en: 'Jdt', es: 'Jdt', fr: 'Jdt', it: 'Gdt', de: 'Jdt', ja: 'ユディト記', zh: '友' },
  '2Sm': { pt: '2Sm', en: '2 Sam', es: '2 Sm', fr: '2 S', it: '2Sam', de: '2 Sam', ja: 'サムエル記下', zh: '撒下' },
  '1Cor': { pt: '1Cor', en: '1 Cor', es: '1 Cor', fr: '1 Co', it: '1Cor', de: '1 Kor', ja: 'コリント一', zh: '格前' },
  '1Tm': { pt: '1Tm', en: '1 Tim', es: '1 Tm', fr: '1 Tm', it: '1Tm', de: '1 Tim', ja: 'テモテ一', zh: '弟前' },
  Ct: { pt: 'Ct', en: 'Song', es: 'Cant', fr: 'Ct', it: 'Ct', de: 'Hld', ja: '雅歌', zh: '歌' },
  Sl: { pt: 'Sl', en: 'Ps', es: 'Sal', fr: 'Ps', it: 'Sal', de: 'Ps', ja: '詩編', zh: '诗' },
  Eclo: { pt: 'Eclo', en: 'Sir', es: 'Eclo', fr: 'Si', it: 'Sir', de: 'Sir', ja: 'シラ書', zh: '德' },
  Lc: { pt: 'Lc', en: 'Lk', es: 'Lc', fr: 'Lc', it: 'Lc', de: 'Lk', ja: 'ルカ', zh: '路' },
  Mt: { pt: 'Mt', en: 'Mt', es: 'Mt', fr: 'Mt', it: 'Mt', de: 'Mt', ja: 'マタイ', zh: '玛' },
  Mc: { pt: 'Mc', en: 'Mk', es: 'Mc', fr: 'Mc', it: 'Mc', de: 'Mk', ja: 'マルコ', zh: '谷' },
  Jo: { pt: 'Jo', en: 'Jn', es: 'Jn', fr: 'Jn', it: 'Gv', de: 'Joh', ja: 'ヨハネ', zh: '若' },
  At: { pt: 'At', en: 'Acts', es: 'Hch', fr: 'Ac', it: 'At', de: 'Apg', ja: '使徒言行録', zh: '宗' },
  '1Sm': { pt: '1Sm', en: '1 Sam', es: '1 Sm', fr: '1 S', it: '1Sam', de: '1 Sam', ja: 'サムエル記上', zh: '撒上' },
  Ap: { pt: 'Ap', en: 'Rev', es: 'Ap', fr: 'Ap', it: 'Ap', de: 'Offb', ja: 'ヨハネの黙示録', zh: '默' },
  Js: { pt: 'Js', en: 'Josh', es: 'Jos', fr: 'Jos', it: 'Gs', de: 'Jos', ja: 'ヨシュア記', zh: '苏' },
  Gn: { pt: 'Gn', en: 'Gen', es: 'Gn', fr: 'Gn', it: 'Gen', de: 'Gen', ja: '創世記', zh: '创' },
  Is: { pt: 'Is', en: 'Isa', es: 'Is', fr: 'Is', it: 'Is', de: 'Jes', ja: 'イザヤ書', zh: '依' },
  Rm: { pt: 'Rm', en: 'Rom', es: 'Rm', fr: 'Rm', it: 'Rm', de: 'Röm', ja: 'ローマ', zh: '罗' },
  Gl: { pt: 'Gl', en: 'Gal', es: 'Ga', fr: 'Ga', it: 'Gal', de: 'Gal', ja: 'ガラテヤ', zh: '迦' }
};
/** Converte "Lc 1,26-38" (padrão do acervo) para a notação do idioma ("Lk 1:26-38", "ルカ 1:26-38"...). */
export function bibleRef(ref) {
  if (L.code === DEFAULT_LOCALE) return ref;
  return String(ref).split(';').map((part) => {
    const m = part.trim().match(/^(\d?[A-Za-zÀ-ú]+)\s+(.+)$/);
    if (!m) return part.trim();
    const book = BOOKS[m[1]];
    if (!book) { missing.add(`[livro bíblico] ${m[1]}`); return part.trim(); }
    const nums = (L.code === 'en' || isCJK) ? m[2].replace(/,/g, ':') : m[2];
    const sep = isCJK ? '' : ' ';
    return `${book[L.code]}${sep}${nums}`;
  }).join('; ');
}
export const bibleRefs = (refs) => refs.map(bibleRef).join('; ');

// ---------- localização das páginas ----------
export const prefixOf = (code2) => LOCALES.find((x) => x.code === code2).prefix;

// ---------- coleta e relatório ----------
/** Registra frases que não passam por _() em tempo de render, mas precisam existir no dicionário. */
export function registerKeys(keys) { for (const k of keys) lookup(k); }

export function finishI18n({ collectTo = null } = {}) {
  if (process.env.I18N_COLLECT === '1' && L.code === DEFAULT_LOCALE) {
    const out = collectTo ?? join(I18N_DIR, '_keys.json');
    mkdirSync(I18N_DIR, { recursive: true });
    writeFileSync(out, JSON.stringify([...used].sort(), null, 1) + '\n');
    writeFileSync(join(I18N_DIR, '_names.json'), JSON.stringify([...names].sort(), null, 1) + '\n');
    console.log(`i18n: ${used.size} frases de interface coletadas em ${out.slice(ROOT.length + 1)}`);
  }
  if (missing.size) {
    const list = [...missing].sort();
    if (process.env.I18N_MISSING_OUT) writeFileSync(process.env.I18N_MISSING_OUT, JSON.stringify(list, null, 1) + '\n');
    const msg = `i18n [${L.code}]: ${list.length} frase(s) sem tradução:\n` + list.slice(0, 40).map((k) => `  - ${k.length > 110 ? k.slice(0, 107) + '...' : k}`).join('\n') + (list.length > 40 ? `\n  ... e mais ${list.length - 40}` : '');
    if (STRICT) { console.error(msg); process.exit(1); }
    console.warn(msg);
  }
}
