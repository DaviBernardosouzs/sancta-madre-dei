import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const FILES = {
  sources: 'sources.json',
  apparitions: 'apparitions.json',
  miracles: 'miracles.json',
  devotions: 'devotions.json',
  titles: 'titles.json',
  prayers: 'prayers.json',
  articles: 'articles.json',
  shrines: 'shrines.json',
  celebrations: 'celebrations.json',
  curasLourdes: 'curas-lourdes.json',
  images: 'images.json'
};

export function loadContent(dir = join(ROOT, 'content')) {
  const data = {};
  for (const [key, file] of Object.entries(FILES)) {
    data[key] = JSON.parse(readFileSync(join(dir, file), 'utf8'));
  }
  // images.json: { images: [...], derived: [...] }
  data.derivedImages = data.images.derived ?? [];
  data.images = data.images.images;
  return data;
}

export const BLOCK_KINDS = {
  escritura: 'Relato bíblico',
  doutrina: 'Doutrina da Igreja',
  historia: 'Informação histórica documentada',
  tradicao: 'Tradição cristã',
  apocrifo: 'Narrativa apócrifa',
  devocional: 'Relato devocional',
  liturgia: 'Liturgia e calendário',
  arte: 'Arte e iconografia',
  decisao: 'Decisão eclesial',
  'revelacao-privada': 'Revelação privada (relato)',
  relato: 'Relato',
  aberta: 'Questão ainda não esclarecida',
  nota: 'Nota editorial'
};

export const DECISION_KINDS = {
  'reconhecimento-da-aparicao': 'Reconhecimento da aparição',
  'autorizacao-de-culto': 'Autorização de culto',
  'aprovacao-de-devocao': 'Aprovação de devoção ou de imagem',
  'nihil-obstat': 'Nihil obstat',
  'reconhecimento-de-milagre': 'Reconhecimento de milagre específico',
  'avaliacao-medica': 'Avaliação médica de cura inexplicada',
  'padroeira': 'Proclamação de padroeira',
  'coroacao': 'Coroação pontifícia',
  'titulo-de-basilica': 'Título de basílica ou de santuário',
  'liturgico': 'Disposição litúrgica (missa, ofício ou festa próprios)',
  'canonizacao-beatificacao': 'Beatificação ou canonização relacionada',
  'declaracao-negativa': 'Declaração negativa ou restritiva',
  'outra': 'Outra decisão'
};

export const TITLE_KINDS = {
  doutrinal: 'Título doutrinal',
  invocacao: 'Invocação devocional',
  'aparicao-relatada': 'Aparição relatada',
  'imagem-encontrada': 'Imagem encontrada',
  'imagem-venerada': 'Imagem ou ícone venerado',
  padroeira: 'Padroeira de uma localidade ou país',
  santuario: 'Santuário',
  'acontecimento-extraordinario': 'Acontecimento extraordinário associado a uma imagem'
};

export const MACRO_REGIONS = ['América Latina', 'América do Norte', 'Europa', 'Ásia', 'África', 'Oceania'];
export const RANKS = { solenidade: 'Solenidade', festa: 'Festa', memoria: 'Memória', 'memoria-facultativa': 'Memória facultativa', devocional: 'Celebração devocional ou local' };

export const AUTHORITY_LEVELS = {
  diocesano: 'Bispo diocesano',
  'conferencia-episcopal': 'Conferência episcopal',
  'santa-se': 'Santa Sé / Dicastério',
  papal: 'Papa'
};

const COLLECTIONS = ['apparitions', 'miracles', 'devotions', 'titles', 'prayers', 'articles', 'shrines', 'celebrations'];
const REL_TARGET = {
  apparitions: 'apparitions',
  miracles: 'miracles',
  devotions: 'devotions',
  titles: 'titles',
  prayers: 'prayers',
  articles: 'articles',
  shrines: 'shrines',
  celebrations: 'celebrations'
};
const ISO = { dia: /^\d{4}-\d{2}-\d{2}$/, mes: /^\d{4}-\d{2}$/, ano: /^\d{4}$/, aproximada: /^.{3,}$/ };
const FORBIDDEN_PHRASES = [/reconhecid[oa]s? pelo vaticano/i, /aprovad[oa]s? pelo vaticano/i, /oficialmente aprovad[oa]/i];

export const isPublished = (r) => r.status === 'published';
export const publicOnly = (list) => list.filter(isPublished);

function allText(record) {
  const parts = [record.title, record.summary];
  for (const b of record.blocks ?? []) parts.push(b.heading, b.text);
  for (const t of record.text ?? []) parts.push(t);
  return parts.filter(Boolean).join('\n');
}


const validDecisions = (w, rec, sourceIds, err) => {
  for (const d of rec.decisions ?? []) {
    const dw = `${w} decisão ${d.id}`;
    for (const f of ['id', 'date', 'datePrecision', 'authority', 'authorityLevel', 'scope', 'document', 'documentSourceId', 'plain']) if (!d[f]) err(dw, `campo obrigatório ausente: ${f}`);
    if (!AUTHORITY_LEVELS[d.authorityLevel]) err(dw, `authorityLevel inválido: ${d.authorityLevel}`);
    if (!(d.kinds?.length > 0) || d.kinds.some((k) => !DECISION_KINDS[k])) err(dw, 'kinds inválidos');
    if (d.documentSourceId && !sourceIds.has(d.documentSourceId)) err(dw, `fonte inexistente: ${d.documentSourceId}`);
    if (d.date && !ISO[d.datePrecision]?.test(d.date)) err(dw, 'data incompatível com a precisão');
    if (!(d.sources?.length > 0)) err(dw, 'decisão exige ao menos uma fonte');
    for (const sid of d.sources ?? []) if (!sourceIds.has(sid)) err(dw, `fonte inexistente: ${sid}`);
  }
};

/** Valida o acervo inteiro. Retorna lista de erros (strings); vazia = ok. */
export function validateContent(data) {
  const errors = [];
  const err = (where, msg) => errors.push(`${where}: ${msg}`);

  const sourceIds = new Set();
  for (const s of data.sources) {
    const w = `fonte ${s.id}`;
    for (const f of ['id', 'type', 'title', 'institution', 'url', 'accessedDate']) if (!s[f]) err(w, `campo obrigatório ausente: ${f}`);
    if (sourceIds.has(s.id)) err(w, 'id duplicado');
    sourceIds.add(s.id);
    if (s.url && !/^https:\/\//.test(s.url)) err(w, 'url deve ser https');
    if (!Array.isArray(s.supports) || s.supports.length === 0) err(w, 'fonte deve registrar a(s) afirmação(ões) que sustenta (supports)');
  }

  const imageIds = new Set();
  const manifestPath = join(ROOT, 'src', 'assets', 'img', 'obras', 'manifest.json');
  const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : null;
  for (const img of data.images) {
    const w = `imagem ${img.id}`;
    const req = ['id', 'slug', 'kind', 'title', 'author', 'dateText', 'institution', 'origin', 'originUrl', 'license', 'licenseUrl', 'retrievedDate', 'rightsNote', 'alt', 'caption', 'source', 'focus'];
    if (img.source?.type === 'met') req.push('accession', 'creditLine');
    for (const f of req) if (!img[f]) err(w, `crédito incompleto: ${f}`);
    if (imageIds.has(img.id)) err(w, 'id duplicado');
    imageIds.add(img.id);
    if (img.originUrl && !/^https:\/\//.test(img.originUrl)) err(w, 'originUrl deve ser https');
    if (img.source?.type === 'met' && !img.source.objectId) err(w, 'source.objectId ausente');
    if (!img.focus?.desktop || !img.focus?.mobile) err(w, 'focus.desktop e focus.mobile obrigatórios (ponto focal em %)');
    for (const rid of img.related ?? []) if (!data.articles.concat(data.apparitions, data.devotions, data.titles, data.prayers, data.shrines).some((r) => r.id === rid)) err(w, `related inexistente: ${rid}`);
    if (!manifest?.[img.id]) err(w, 'variantes não geradas (rode node scripts/prepare-images.mjs)');
    else for (const wd of manifest[img.id].widths) if (!existsSync(join(ROOT, 'src', 'assets', 'img', 'obras', `${img.id}-${wd}.webp`))) err(w, `variante ausente: ${wd}`);
  }
  for (const d of data.derivedImages) {
    if (!imageIds.has(d.from)) err(`recorte ${d.id}`, `obra de origem inexistente: ${d.from}`);
    if (!d.alt) err(`recorte ${d.id}`, 'alt ausente');
    if (!manifest?.[d.id]) err(`recorte ${d.id}`, 'variantes não geradas');
  }

  const byId = {};
  const slugs = {};
  for (const col of COLLECTIONS) {
    slugs[col] = new Set();
    for (const r of data[col]) {
      const w = `${col}/${r.id ?? '?'}`;
      if (!r.id) err(w, 'sem id');
      if (byId[r.id]) err(w, 'id duplicado');
      byId[r.id] = { col, record: r };
      if (!r.slug || !/^[a-z0-9-]+$/.test(r.slug)) err(w, 'slug inválido');
      if (slugs[col].has(r.slug) && col !== 'articles') err(w, 'slug duplicado');
      slugs[col].add(r.slug);
      if (!['published', 'draft'].includes(r.status)) err(w, 'status deve ser published ou draft');
    }
  }
  const slugKey = new Set();
  for (const a of data.articles) {
    const k = `${a.category}/${a.slug}`;
    if (slugKey.has(k)) errors.push(`articles/${a.id}: slug duplicado na categoria`);
    slugKey.add(k);
  }

  for (const col of COLLECTIONS) {
    for (const r of data[col]) {
      const w = `${col}/${r.id}`;
      const pub = isPublished(r);

      for (const sid of r.sources ?? []) if (!sourceIds.has(sid)) err(w, `fonte inexistente: ${sid}`);

      if (pub) {
        if (!r.title || !r.summary) err(w, 'registro publicado precisa de título e resumo');
        if (!r.review?.lastVerified || !ISO.dia.test(r.review.lastVerified)) err(w, 'registro publicado precisa de review.lastVerified (AAAA-MM-DD)');
        if (!r.review?.state) err(w, 'registro publicado precisa de review.state');
        if (r.review?.humanTheologicalReview === undefined) err(w, 'declare review.humanTheologicalReview (true/false)');
        for (const re of FORBIDDEN_PHRASES) if (re.test(allText(r))) err(w, `expressão proibida (${re}): identifique a autoridade exata`);
      }

      for (const [i, b] of (r.blocks ?? []).entries()) {
        const bw = `${w} bloco ${i + 1}`;
        if (!BLOCK_KINDS[b.kind]) err(bw, `kind inválido: ${b.kind}`);
        if (!b.text) err(bw, 'texto vazio');
        for (const sid of b.sources ?? []) if (!sourceIds.has(sid)) err(bw, `fonte inexistente: ${sid}`);
        if (pub && !['nota', 'aberta'].includes(b.kind) && !(b.sources?.length > 0)) err(bw, `bloco "${b.kind}" publicado exige fonte`);
      }

      // relações
      for (const [relKey, ids] of Object.entries(r.relations ?? {})) {
        const target = REL_TARGET[relKey];
        if (!target) { err(w, `relação desconhecida: ${relKey}`); continue; }
        for (const id of ids) {
          const t = byId[id];
          if (!t || t.col !== target) err(w, `relação ${relKey} aponta para id inexistente: ${id}`);
          else if (pub && !isPublished(t.record)) err(w, `registro publicado referencia rascunho: ${id}`);
        }
      }

      for (const fg of r.figures ?? []) if (!imageIds.has(fg.id)) err(w, `figura inexistente no registro de créditos: ${fg.id}`);
      if (r.banner && !imageIds.has(r.banner)) err(w, `banner inexistente no registro de créditos: ${r.banner}`);
      for (const iid of r.imageIds ?? []) if (!imageIds.has(iid)) err(w, `imagem inexistente no registro de créditos: ${iid}`);
    }
  }

  // aparições
  for (const a of data.apparitions) {
    const w = `apparitions/${a.id}`;
    if (a.place?.coordinates) {
      const c = a.place.coordinates;
      if (!c.verified || !c.sourceId || !sourceIds.has(c.sourceId) || !c.precision) err(w, 'coordenadas exigem verified=true, sourceId e precision');
    }
    if (!isPublished(a)) continue;
    if (!a.place?.name || !a.place?.country) err(w, 'local obrigatório');
    if (!a.period?.start || !ISO[a.period.precision]?.test(a.period.start)) err(w, 'período inválido ou sem precisão');
    if (!(a.decisions?.length > 0) && a.noDecisionDocumented !== true) err(w, 'aparição publicada precisa de decisão documentada (ou noDecisionDocumented=true explícito)');
    validDecisions(w, a, sourceIds, err);
  }

  // país por código ISO (seleção no atlas)
  for (const col of ['apparitions', 'titles', 'shrines']) {
    for (const r of data[col]) {
      if (r.place?.country && !/^[A-Z]{2}$/.test(r.place.iso ?? '')) err(`${col}/${r.id}`, 'place.iso (código ISO 3166-1 alfa-2) obrigatório quando há país');
    }
  }

  // coordenadas de qualquer registro com lugar
  for (const col of ['titles', 'shrines']) {
    for (const r of data[col]) {
      const c = r.place?.coordinates;
      if (c && (!c.verified || !c.sourceId || !sourceIds.has(c.sourceId) || !c.precision)) err(`${col}/${r.id}`, 'coordenadas exigem verified=true, sourceId existente e precision');
    }
  }

  // títulos marianos
  for (const t of data.titles) {
    if (!isPublished(t)) continue;
    const w = `titles/${t.id}`;
    if (!(t.names?.length > 0) || t.names[0].kind !== 'principal') err(w, 'names deve começar pelo nome principal (kind=principal)');
    if (!(t.titleKinds?.length > 0) || t.titleKinds.some((k) => !TITLE_KINDS[k])) err(w, 'titleKinds ausente ou inválido');
    if (t.place?.country && !MACRO_REGIONS.includes(t.place.macro)) err(w, `place.macro inválido: ${t.place.macro}`);
    if (t.period && !ISO[t.period.precision]?.test(t.period.start ?? '')) err(w, 'period inválido ou sem precisão');
    if (t.feast) {
      for (const sid of t.feast.sources ?? []) if (!sourceIds.has(sid)) err(w, `fonte inexistente em feast: ${sid}`);
      if (!(t.feast.sources?.length > 0)) err(w, 'feast exige fonte');
      if (!['universal', 'continental', 'nacional', 'local'].includes(t.feast.scope)) err(w, 'feast.scope inválido');
    }
    for (const [i, sy] of (t.symbols ?? []).entries()) {
      if (!sy.name || !sy.text || !(sy.sources?.length > 0)) err(`${w} símbolo ${i + 1}`, 'símbolo exige nome, texto e fonte');
      for (const sid of sy.sources ?? []) if (!sourceIds.has(sid)) err(`${w} símbolo ${i + 1}`, `fonte inexistente: ${sid}`);
    }
    validDecisions(w, t, sourceIds, err);
  }

  // fotos e retratos ligados a títulos e santuários precisam existir no registro de imagens
  for (const col of ['titles', 'shrines']) for (const r of data[col]) for (const f of ['photo', 'portrait']) {
    if (r[f] && !imageIds.has(r[f])) err(`${col}/${r.id}`, `${f} aponta para imagem inexistente: ${r[f]}`);
  }

  // santuários
  for (const sh of data.shrines) {
    if (!isPublished(sh)) continue;
    const w = `shrines/${sh.id}`;
    if (!sh.place?.country || !MACRO_REGIONS.includes(sh.place.macro)) err(w, 'place.country e place.macro obrigatórios');
    if (sh.officialUrl && !/^https:\/\//.test(sh.officialUrl)) err(w, 'officialUrl deve ser https');
    validDecisions(w, sh, sourceIds, err);
  }

  // celebrações
  for (const c of data.celebrations) {
    const w = `celebrations/${c.id}`;
    if (!isPublished(c)) continue;
    const d = c.date ?? {};
    if (!((Number.isInteger(d.month) && Number.isInteger(d.day)) || d.movable)) err(w, 'date exige month/day ou movable');
    if (!RANKS[c.rank]) err(w, `rank inválido: ${c.rank}`);
    if (!['universal', 'continental', 'nacional', 'local'].includes(c.scope)) err(w, 'scope inválido');
    if (!(c.sources?.length > 0)) err(w, 'celebração exige fonte');
    for (const sid of c.sources ?? []) if (!sourceIds.has(sid)) err(w, `fonte inexistente: ${sid}`);
  }

  // lista de curas reconhecidas de Lourdes (dados da lista oficial; sem fichas individuais)
  const curaIds = new Set();
  for (const c of data.curasLourdes) {
    const w = `curas-lourdes/${c.id}`;
    if (curaIds.has(c.id)) err(w, 'id duplicado'); curaIds.add(c.id);
    for (const f of ['name', 'place', 'country', 'recognitionDate', 'datePrecision', 'sourceId']) if (!c[f]) err(w, `campo obrigatório ausente: ${f}`);
    if (c.recognitionDate && !ISO[c.datePrecision]?.test(c.recognitionDate)) err(w, 'data incompatível com a precisão');
    if (c.sourceId && !sourceIds.has(c.sourceId)) err(w, `fonte inexistente: ${c.sourceId}`);
  }

  // milagres
  for (const m of data.miracles) {
    if (!isPublished(m)) continue;
    const w = `miracles/${m.id}`;
    const e = m.ecclesialDecision ?? {};
    for (const f of ['authority', 'date', 'document']) if (!e[f]) err(w, `milagre publicado exige ecclesialDecision.${f}`);
    if (!(e.sources?.length > 0)) err(w, 'milagre publicado exige fonte da decisão eclesiástica');
    for (const sid of e.sources ?? []) if (!sourceIds.has(sid)) err(w, `fonte inexistente: ${sid}`);
    if (!m.event?.description || !m.event?.date) err(w, 'milagre publicado exige evento com data');
    if (!m.medicalInvestigation?.summary && !m.medicalInvestigation?.notDocumented) err(w, 'registre a investigação médica ou declare medicalInvestigation.notDocumented');
    if (!m.sources?.length) err(w, 'milagre publicado exige fontes');
    if (/interrompa|abandone o tratamento|dispens(e|ar) (o )?m[eé]dico/i.test(allText(m))) err(w, 'não pode orientar a interromper tratamento médico');
  }

  // devoções
  for (const d of data.devotions) {
    if (!isPublished(d)) continue;
    const w = `devotions/${d.id}`;
    for (const [i, p] of (d.promises ?? []).entries()) {
      for (const f of ['text', 'attributedTo', 'origin', 'natureOfAttribution', 'limits']) if (!p[f]) err(`${w} promessa ${i + 1}`, `campo obrigatório ausente: ${f}`);
      if (!(p.sources?.length > 0)) err(`${w} promessa ${i + 1}`, 'promessa exige fonte');
      for (const sid of p.sources ?? []) if (!sourceIds.has(sid)) err(`${w} promessa ${i + 1}`, `fonte inexistente: ${sid}`);
      if (/garant(e|ia|ida)|infal[ií]vel|certamente (ser[aá]|obter)/i.test(p.text + (p.guidance ?? ''))) err(`${w} promessa ${i + 1}`, 'evite linguagem de garantia automática');
    }
    if (d.nature === 'mensagem-atribuida' && !d.attribution) err(w, 'mensagem atribuída exige attribution');
  }

  // orações
  for (const p of data.prayers) {
    if (!isPublished(p)) continue;
    const w = `prayers/${p.id}`;
    if (!(p.text?.length > 0)) err(w, 'texto da oração ausente');
    if (!p.provenance) err(w, 'procedência ausente');
    if (!p.rights) err(w, 'situação de direitos ausente');
    if (!(p.sources?.length > 0)) err(w, 'fonte ausente');
  }

  return errors;
}

/** Subconjunto público: somente publicados; relações já validadas para não vazar rascunhos. */
export function buildPublicCatalog(data) {
  return {
    sources: data.sources,
    apparitions: publicOnly(data.apparitions),
    miracles: publicOnly(data.miracles),
    devotions: publicOnly(data.devotions),
    titles: publicOnly(data.titles),
    prayers: publicOnly(data.prayers),
    articles: publicOnly(data.articles),
    curasLourdes: data.curasLourdes,
    shrines: publicOnly(data.shrines),
    celebrations: publicOnly(data.celebrations),
    images: data.images,
    derivedImages: data.derivedImages
  };
}

export function draftCounts(data) {
  const out = {};
  for (const c of COLLECTIONS) out[c] = data[c].filter((r) => !isPublished(r)).length;
  return out;
}
