// Tradução do conteúdo: sobreposições por registro, com os campos traduzíveis de cada tipo.
//
// i18n/content/<idioma>/<colecao>[.parte].json  =>  { "<id do registro>": { campo: tradução, ..., "_src": "<hash do original>" } }
// A estrutura espelha o registro de origem, só com os campos de SCHEMA. Campos que não são
// traduzidos (ids, fontes, datas, citações no original, coordenadas) vêm sempre do registro em português.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { I18N_DIR, L, DEFAULT_LOCALE, missing, countryName } from './i18n.mjs';

const BLOCKS = ['blocks[].heading', 'blocks[].text'];
const DECISIONS = ['decisions[].authority', 'decisions[].scope', 'decisions[].document', 'decisions[].plain', 'decisions[].sourceNote'];
const PLACE = ['place.name', 'place.locality', 'place.region', 'place.coordinatesNote', 'place.coordinates.precision'];

/** Campos de texto livre que cada coleção traduz. Valores repetidos (instituições, licenças, regiões) vão pelo dicionário de interface. */
export const SCHEMA = {
  articles: ['title', 'summary', 'dogmaRank', ...BLOCKS],
  apparitions: ['title', 'summary', ...PLACE, 'people[].name', 'people[].role', ...BLOCKS, 'timeline[].text', ...DECISIONS, 'gaps[]'],
  miracles: ['title', 'summary', 'place.locality', 'event.description', 'medicalInvestigation.summary', 'medicalInvestigation.notDocumented', 'ecclesialDecision.authority', 'ecclesialDecision.document', 'ecclesialDecision.scope', ...BLOCKS],
  devotions: ['title', 'summary', 'attribution.kind', 'attribution.who', 'attribution.how', 'attribution.limits', 'promises[].text', 'promises[].attributedTo', 'promises[].origin', 'promises[].natureOfAttribution', 'promises[].limits', ...BLOCKS, 'gaps[]'],
  titles: ['title', 'summary', ...PLACE, ...BLOCKS, ...DECISIONS, 'gaps[]', 'feast.text', 'symbols[].name', 'symbols[].text'],
  shrines: ['title', 'summary', ...PLACE, ...BLOCKS, ...DECISIONS, 'gaps[]'],
  prayers: ['title', 'summary', 'text[]', 'provenance', 'rights', ...BLOCKS],
  celebrations: ['title', 'summary', 'note', 'calendar', 'date.movable'],
  sources: ['title', 'note'],
  images: ['title', 'alt', 'caption'],
  derivedImages: ['alt'],
  rosary: ['steps[]', 'stepsNote', 'cycles[].name', 'cycles[].days', 'cycles[].mysteries[].name']
};

// ---------- caminhos ----------
/** Percorre os valores de texto de um registro que casam com um padrão como "blocks[].text". */
function* walk(obj, parts, trail = []) {
  if (obj == null) return;
  if (!parts.length) { if (typeof obj === 'string' && obj.trim()) yield { path: trail, value: obj }; return; }
  const [head, ...rest] = parts;
  const isArr = head.endsWith('[]');
  const key = isArr ? head.slice(0, -2) : head;
  const next = key ? obj[key] : obj;
  const base = key ? [...trail, key] : trail;
  if (isArr) {
    if (!Array.isArray(next)) return;
    for (let i = 0; i < next.length; i++) yield* walk(next[i], rest, [...base, i]);
  } else yield* walk(next, rest, base);
}

/** Lista plana { path: ["blocks", 0, "text"], value } dos campos traduzíveis do registro. */
export function flatten(record, collection) {
  const out = [];
  for (const pat of SCHEMA[collection]) for (const e of walk(record, pat.split('.'))) out.push(e);
  return out;
}

const getAt = (o, path) => path.reduce((a, k) => (a == null ? undefined : a[k]), o);
function setAt(o, path, value) {
  let cur = o;
  for (let i = 0; i < path.length - 1; i++) { if (cur[path[i]] == null) cur[path[i]] = typeof path[i + 1] === 'number' ? [] : {}; cur = cur[path[i]]; }
  cur[path.at(-1)] = value;
}

export const hashOf = (record, collection) =>
  createHash('sha1').update(JSON.stringify(flatten(record, collection).map((e) => [e.path.join('.'), e.value]))).digest('hex').slice(0, 8);

// ---------- carga ----------
export function loadOverlays(code) {
  const dir = join(I18N_DIR, 'content', code);
  const out = {};
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir).sort()) {
    if (!f.endsWith('.json')) continue;
    const col = f.split('.')[0];
    Object.assign((out[col] ??= {}), JSON.parse(readFileSync(join(dir, f), 'utf8')));
  }
  return out;
}

/** Aplica a tradução a um registro (cópia). Marca como ausente o que faltar. */
function applyRecord(rec, col, ov, stale) {
  const copy = structuredClone(rec);
  const id = rec.id;
  if (!ov) { missing.add(`[conteúdo] ${col}/${id}: registro sem tradução`); return copy; }
  if (ov._src && ov._src !== hashOf(rec, col)) stale.push(`${col}/${id}`);
  for (const { path, value } of flatten(rec, col)) {
    const t = getAt(ov, path);
    if (typeof t !== 'string' || !t.trim()) { missing.add(`[conteúdo] ${col}/${id}: falta ${path.join('.')}`); continue; }
    setAt(copy, path, t);
  }
  return copy;
}

/** Devolve o acervo (como em loadContent) com o texto traduzido para o idioma da página. */
export function localizeContent(data, rosary) {
  if (L.code === DEFAULT_LOCALE) return { data, rosary };
  const ovs = loadOverlays(L.code);
  const stale = [];
  const out = { ...data };
  const list = (col, key = col, only = (r) => r.status === 'published' || r.status === undefined) => {
    out[key] = data[key].map((r) => (only(r) ? applyRecord(r, col, ovs[col]?.[r.id], stale) : r));
  };
  for (const col of ['articles', 'apparitions', 'miracles', 'devotions', 'titles', 'shrines', 'prayers', 'celebrations']) list(col);
  list('sources');
  list('images');
  out.derivedImages = data.derivedImages.map((r) => applyRecord(r, 'derivedImages', ovs.derivedImages?.[r.id], stale));
  // países: nome no idioma da página, a partir do código ISO
  for (const col of ['apparitions', 'miracles', 'titles', 'shrines']) {
    for (const r of out[col]) if (r.place?.iso) r.place = { ...r.place, country: countryName(r.place.iso, r.place.country) };
  }
  const rs = applyRecord({ id: 'rosario', ...rosary }, 'rosary', ovs.rosary?.rosario, stale);
  delete rs.id;
  if (stale.length) {
    const msg = `i18n [${L.code}]: ${stale.length} tradução(ões) de conteúdo desatualizada(s) (o texto em português mudou): ${stale.slice(0, 12).join(', ')}${stale.length > 12 ? ', ...' : ''}`;
    if (process.env.I18N_STRICT === '1') { console.error(msg); process.exit(1); }
    console.warn(msg);
  }
  return { data: out, rosary: rs };
}
