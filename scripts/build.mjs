#!/usr/bin/env node
// Gera o site de um idioma (LOCALE=pt|en|es|fr|it|de|ja|zh; padrão pt). Para todos: node scripts/build-all.mjs
import { mkdirSync, writeFileSync, rmSync, cpSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  ROOT, loadContent, validateContent, buildPublicCatalog, draftCounts,
  BLOCK_KINDS, DECISION_KINDS, AUTHORITY_LEVELS, TITLE_KINDS, MACRO_REGIONS, RANKS
} from './lib/content.mjs';
import { project, MAP } from './lib/mapa.mjs';
import { esc, paragraphs, fmtDate, fmtPeriod, fmtDayMonth, monthName, monthHeading, normalize, sortKey } from './lib/format.mjs';
import {
  L, LOCALES, DEFAULT_LOCALE, isCJK, _, _h, _n, nforms, listAnd, bibleRef, bibleRefs, collator, countryName,
  registerKeys, finishI18n, prefixOf, missing, proper
} from './lib/i18n.mjs';
import { localizeContent } from './lib/i18n-content.mjs';
import { finalizeSite } from './lib/site.mjs';

// APP=1 gera a versão empacotada no aplicativo Android (Capacitor): links
// explícitos para index.html, imagens até 1280 px e saída separada do site.
const APP = process.env.APP === '1' || process.argv.includes('--app');
const OUT = join(ROOT, process.env.OUT_DIR ?? (APP ? 'dist-app' : 'dist'));
const BASE = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');
const SITE_URL = (process.env.SITE_URL ?? 'http://localhost:4173').replace(/\/$/, '');
const SITE = 'Sancta Mater Dei';
const PREFIX = L.prefix;

/** Link de página no idioma `code` (padrão: o da página que está sendo gerada). */
const hrefIn = (code, p = '') => {
  const full = prefixOf(code) + p;
  if (!APP) return BASE + full;
  // O servidor local do Capacitor responde a pastas com o index.html da raiz,
  // então no app cada link de página aponta para o arquivo index.html.
  const i = full.indexOf('#');
  const path = i < 0 ? full : full.slice(0, i);
  const hash = i < 0 ? '' : full.slice(i);
  return BASE + path + (path === '' || path.endsWith('/') ? 'index.html' : '') + hash;
};
const href = (p = '') => hrefIn(L.code, p);
/** Arquivos compartilhados entre idiomas (estilos, scripts, fontes, imagens): sempre na raiz. */
const asset = (p = '') => BASE + p;

// ---------- carga e validação ----------
const rawPt = loadContent();
const errors = validateContent(rawPt);
if (errors.length) {
  console.error(`\nValidação do acervo falhou (${errors.length} erro(s)):\n` + errors.map((e) => ` - ${e}`).join('\n'));
  process.exit(1);
}
const rosaryPt = JSON.parse(readFileSync(join(ROOT, 'content', 'rosary.json'), 'utf8'));
const { data: raw, rosary } = localizeContent(rawPt, rosaryPt);
const cat = buildPublicCatalog(raw);
const drafts = draftCounts(rawPt);
const srcById = Object.fromEntries(cat.sources.map((s) => [s.id, s]));

// ---------- rótulos (as chaves são as frases em português; o dicionário do idioma traduz) ----------
const TYPE_LABEL = {
  aparicao: 'Aparição', milagre: 'Milagre', devocao: 'Devoção', titulo: 'Título mariano', oracao: 'Oração',
  artigo: 'Artigo', santuario: 'Santuário', celebracao: 'Celebração'
};
const CAT_LABEL = { vida: 'A vida de Maria', fe: 'Maria na fé católica', dossie: 'Dossiê de pesquisa', milagres: 'Milagres', promessas: 'Promessas e devoções' };
const SCOPE_L = { universal: 'Igreja universal', continental: 'Âmbito continental', nacional: 'Âmbito nacional', local: 'Âmbito local' };
const SCOPE_LC = { universal: 'igreja universal', continental: 'âmbito continental', nacional: 'âmbito nacional', local: 'âmbito local' };
const SRC_TYPE = {
  magisterio: 'Santa Sé e Magistério', catecismo: 'Catecismo e Compêndio', escritura: 'Sagrada Escritura',
  apocrifo: 'Textos apócrifos (fora do cânon bíblico)',
  'decreto-diocesano': 'Decretos e comunicações diocesanas', santuario: 'Documentação de santuários e custódias',
  legislacao: 'Legislação civil (não eclesial)', 'noticia-oficial': 'Notícias oficiais (apoio)', estudo: 'Estudos, enciclopédias, museus e acervos'
};
registerKeys([
  ...Object.values(TYPE_LABEL), ...Object.values(CAT_LABEL), ...Object.values(SCOPE_L), ...Object.values(SCOPE_LC), ...Object.values(SRC_TYPE),
  ...Object.values(BLOCK_KINDS), ...Object.values(DECISION_KINDS), ...Object.values(TITLE_KINDS), ...MACRO_REGIONS,
  ...Object.values(RANKS), ...Object.values(AUTHORITY_LEVELS)
]);
/** Valor de dado que é nome próprio (autor, cidade): se o idioma não tiver forma própria, vale o original. Em japonês e chinês exige transliteração. */
const _p = proper;
/** Nome do idioma de uma citação (código ISO) escrito no idioma da página. */
const langName = (code) => { try { return new Intl.DisplayNames([L.intl], { type: 'language' }).of(code) ?? code; } catch { return code; } };
/** Palavras de um texto, para animar título por título: japonês e chinês não têm espaços. */
const segmenter = isCJK ? new Intl.Segmenter(L.intl, { granularity: 'word' }) : null;
const wordsOf = (text) => (segmenter ? [...segmenter.segment(text)].map((s) => s.segment).filter((s) => s.trim()) : text.split(' '));
const JOIN = isCJK ? '' : ' ';

// índices de registros públicos
const pubById = {};
const urlOf = {};
for (const a of cat.apparitions) { pubById[a.id] = a; urlOf[a.id] = href(`aparicoes/${a.slug}/`); }
for (const m of cat.miracles) { pubById[m.id] = m; urlOf[m.id] = href(`milagres/${m.slug}/`); }
for (const d of cat.devotions) { pubById[d.id] = d; urlOf[d.id] = href(`devocoes/${d.slug}/`); }
for (const t of cat.titles) { pubById[t.id] = t; urlOf[t.id] = href(`titulos/${t.slug}/`); }
for (const p of cat.prayers) { pubById[p.id] = p; urlOf[p.id] = href(`oracoes/${p.slug}/`); }
for (const sh of cat.shrines) { pubById[sh.id] = sh; urlOf[sh.id] = href(`santuarios/${sh.slug}/`); }
for (const c of cat.celebrations) { pubById[c.id] = c; urlOf[c.id] = href(`calendario/`) + `#${c.id}`; }
const ART_DIR = { vida: 'vida-de-maria', fe: 'fe-catolica', dossie: 'dossie', milagres: 'milagres', promessas: 'promessas' };
for (const a of cat.articles) { pubById[a.id] = a; urlOf[a.id] = href(`${ART_DIR[a.category]}/${a.slug}/`); }

// ---------- componentes ----------
const NAV = [
  ['vida-de-maria/', 'A vida de Maria'],
  ['fe-catolica/', 'Fé católica'],
  ['aparicoes/', 'Aparições'],
  ['milagres/', 'Milagres'],
  ['promessas/', 'Devoções'],
  ['titulos/', 'Títulos marianos'],
  ['maria-pelo-mundo/', 'Maria pelo mundo'],
  ['oracoes/', 'Orações'],
  ['dossie/', 'Dossiê'],
  ['biblioteca/', 'Biblioteca'],
  ['sobre/', 'Sobre']
];
const UTIL = [['galeria/', 'Galeria'], ['cronologia/', 'Cronologia'], ['santuarios/', 'Santuários'], ['calendario/', 'Calendário'], ['busca/', 'Busca']];

const MANIFEST = JSON.parse(readFileSync(join(ROOT, 'src', 'assets', 'img', 'obras', 'manifest.json'), 'utf8'));
const APP_MAX_W = 1280;
if (APP) {
  // telas de celular não precisam das variantes de 1800 px; reduz o pacote pela metade
  for (const m of Object.values(MANIFEST)) {
    if (!Array.isArray(m.widths)) continue;
    const kept = m.widths.filter((w) => w <= APP_MAX_W);
    m.widths = kept.length ? kept : [Math.min(...m.widths)];
  }
}
const imageById = Object.fromEntries(cat.images.map((i) => [i.id, i]));
const derivedById = Object.fromEntries(cat.derivedImages.map((d) => [d.id, d]));
const ORNAMENTO = `<div class="ornamento" data-rule aria-hidden="true"><svg viewBox="0 0 32 32"><path fill="currentColor" d="M16 2l2.4 11.6L30 16l-11.6 2.4L16 30l-2.4-11.6L2 16l11.6-2.4z"/></svg></div>`;

const fileOf = (id, w) => asset(`assets/img/obras/${id.replace(':', '-')}-${w}.webp`);
const srcsetOf = (id) => MANIFEST[id].widths.map((w) => `${fileOf(id, w)} ${w}w`).join(', ');
const midOf = (id) => MANIFEST[id].widths.find((w) => w >= 800) ?? MANIFEST[id].widths.at(-1);
/** Ponto focal por obra: preserva rostos e mãos em qualquer enquadramento. */
const focusStyle = (id) => {
  const f = imageById[id]?.focus ?? { desktop: [50, 30], mobile: [50, 30] };
  return `--fx:${f.desktop[0]}%;--fy:${f.desktop[1]}%;--fxm:${f.mobile[0]}%;--fym:${f.mobile[1]}%`;
};
function img(id, { sizes, eager = false, low = false, alt, cls = '' } = {}) {
  const m = MANIFEST[id];
  const text = alt ?? imageById[id]?.alt ?? derivedById[id]?.alt ?? '';
  return `<img${cls ? ` class="${cls}"` : ''} src="${fileOf(id, midOf(id))}" srcset="${srcsetOf(id)}" sizes="${sizes}" width="${m.width}" height="${m.height}" alt="${esc(text)}" ${low ? 'fetchpriority="low" decoding="async"' : eager ? 'fetchpriority="high" decoding="sync"' : 'loading="lazy" decoding="async"'}>`;
}

// metadados de imagens: valores repetidos vão pelo dicionário; datas e origens seguem padrões
const imgDate = (s) => {
  if (!s) return '';
  if (/^[\d\s\-–./:,]+$/.test(s)) return s;
  const m = s.match(/^cerca de (.+)$/);
  if (m) return _('cerca de {x}', { x: m[1] });
  return _(s);
};
const imgOrigin = (s) => {
  const m = s.match(/^The Metropolitan Museum of Art, Open Access, objeto (\d+)$/);
  if (m) return _('The Metropolitan Museum of Art, Open Access, objeto {id}', { id: m[1] });
  const w = s.match(/^Wikimedia Commons, (.+)$/);
  if (w) return _('Wikimedia Commons, {file}', { file: w[1] });
  return _(s);
};
const creditText = (im) => im.institution
  ? _('Autoria: {author}. Acervo: {institution}. Licença: {license}.', { author: _p(im.author), institution: _(im.institution), license: _(im.license) })
  : _('Autoria: {author}. Licença: {license}.', { author: _p(im.author), license: _(im.license) });
const originLink = (im) => `<a href="${esc(im.originUrl)}" rel="noopener">${esc(_('Origem'))}</a>`;
const seeWork = (id) => esc(_('Ver a obra inteira'));

/** Figura com autoria, origem e licença sempre visíveis. */
function figure(id, { eager = false, cls = '', sizes = '(min-width: 62rem) 30rem, 90vw' } = {}) {
  const im = imageById[id];
  const m = MANIFEST[id];
  return `<figure class="fig ${cls}">
  <div class="quadro" style="--ar:${m.ratio};${focusStyle(id)}">${img(id, { sizes, eager })}</div>
  <figcaption class="legenda">${esc(im.caption)}<span class="legenda__credito">${esc(creditText(im))} ${originLink(im)}</span></figcaption>
</figure>`;
}

/** Abertura de página: título e obra inteira lado a lado, sobre uma bruma de pigmentos da própria pintura. */
function abertura(id, head, { compacta = false } = {}) {
  const im = imageById[id];
  const m = MANIFEST[id];
  return `<header class="abertura${compacta ? ' abertura--compacta' : ''}" style="--ar:${m.ratio};${focusStyle(id)}" data-capa>
  <div class="abertura__bruma" aria-hidden="true">${img(`${id}:bruma`, { sizes: '100vw', alt: '', low: true })}</div>
  <div class="abertura__veu" aria-hidden="true"></div>
  <div class="miolo abertura__grade">
    <div class="abertura__texto">${head}</div>
    <figure class="abertura__obra">
      <a class="abertura__moldura" href="${fileOf(id, m.widths.at(-1))}" data-lightbox="${id}" aria-label="${esc(_('Ampliar a obra: {title}', { title: im.title }))}"><span class="quadro">${img(id, { sizes: compacta ? '(min-width: 62rem) 14rem, 60vw' : '(min-width: 62rem) 25rem, (min-width: 48rem) 38vw, min(65vw, 15rem)', eager: true, alt: im.alt })}</span></a>
      <figcaption class="legenda"><span class="abertura__titulo">${esc(im.caption)}</span><span class="legenda__credito">${esc(creditText(im))} ${originLink(im)}</span>${im.kind === 'obra' ? `<a class="link-obra" href="${href('galeria/')}#${im.id}" data-lightbox="${im.id}">${seeWork()}</a>` : ''}</figcaption>
    </figure>
  </div>
</header>`;
}

/** Cartela de título (páginas sem obra própria): fundo noturno com estrelas, como a abertura de uma cena. */
function cartela(body) {
  const sp = splitHead(body);
  if (!sp.head) return body;
  return `<header class="cartela" data-cartela>
  <canvas class="f-estrelas" data-estrelas aria-hidden="true"></canvas>
  <div class="cartela__luz" aria-hidden="true"></div>
  <div class="miolo cartela__in">${sp.head}</div>
</header>${sp.body}`;
}

/** Separa do corpo da página o bloco de cabeçalho (migalhas, título e resumo) para a abertura. */
function splitHead(body) {
  let head = '';
  const crumbsM = body.match(/<nav class="trilha"[\s\S]*?<\/nav>/);
  if (crumbsM) { head += crumbsM[0]; body = body.replace(crumbsM[0], ''); }
  const hdr = body.match(/<header>[\s\S]*?<\/header>/);
  if (hdr) { head += hdr[0].replace(/^<header>|<\/header>$/g, ''); body = body.replace(hdr[0], ''); }
  else {
    const m = body.match(/<h1[^>]*>[\s\S]*?<\/h1>\s*(<p class="lede"[^>]*>[\s\S]*?<\/p>)?/);
    if (m) { head += m[0]; body = body.replace(m[0], ''); }
  }
  return { head, body };
}

const LB = `<dialog class="lb" id="lb" aria-labelledby="lb-titulo">
  <div class="lb__in">
    <div class="lb__barra"><p data-lb-contagem></p><button type="button" data-lb-fechar>${esc(_('Fechar'))}</button></div>
    <div class="lb__palco">
      <div class="lb__img"><img data-lb-img alt=""></div>
      <div class="lb__legenda">
        <h2 id="lb-titulo" data-lb-titulo></h2>
        <p data-lb-meta></p>
        <p data-lb-alt></p>
        <p class="lb__cred" data-lb-cred></p>
        <p><a data-lb-link rel="noopener">${esc(_('Página da obra no acervo de origem'))}</a></p>
      </div>
    </div>
    <div class="lb__nav"><button type="button" data-lb-ant>${esc(_('Obra anterior'))}</button><button type="button" data-lb-prox>${esc(_('Próxima obra'))}</button></div>
  </div>
</dialog>`;

/** Textos que o JavaScript do navegador precisa (as chaves são as mesmas frases em português). */
const CLIENT_KEYS = {
  leituraSair: 'Sair do modo de leitura',
  leituraEntrar: 'Modo de leitura sem distrações',
  emLugar: 'em {lugar}',
  pelomundo: 'pelo mundo',
  lbLicenca: 'Licença: {licenca}',
  lbAcesso: 'Número de acesso: {acesso}',
  lbOrigem: 'Origem: {origem}',
  lbContagem: 'Obra {n} de {total}',
  movSistema: 'Movimento reduzido pelo sistema',
  movAtivar: 'Ativar animações',
  movLer: 'Ler sem animações',
  retomar: 'Retomar o céu estrelado',
  pausar: 'Pausar o céu estrelado'
};
const CLIENT_PLURAL = { resultados: '{n} resultado(s)' };
const clientStrings = () => JSON.stringify({
  lang: L.lang,
  t: Object.fromEntries(Object.entries(CLIENT_KEYS).map(([k, v]) => [k, _(v)])),
  n: Object.fromEntries(Object.entries(CLIENT_PLURAL).map(([k, v]) => [k, nforms(v)]))
});

const GLOBE = `<svg class="idioma__icone" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 12h18M12 2.8c2.6 2.4 4 5.7 4 9.2s-1.4 6.8-4 9.2c-2.6-2.4-4-5.7-4-9.2s1.4-6.8 4-9.2z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;

function langSwitcher(path) {
  const items = LOCALES.map((x) => `<li><a href="${hrefIn(x.code, path)}" hreflang="${x.lang}" lang="${x.lang}" data-idioma="${x.code}"${x.code === L.code ? ' aria-current="true"' : ''}>${esc(x.native)}</a></li>`).join('');
  return `<details class="idioma" data-idioma-menu><summary aria-label="${esc(_('Idioma: {idioma}', { idioma: L.native }))}">${GLOBE}<span>${L.short}</span></summary><ul>${items}</ul></details>`;
}

function layout({ title, description, path, body, section = '', jsonLd = null, art = null, home = false, ogImage = null, alternates = true }) {
  const full = path === '' ? `${SITE}, ${_('Santa Mãe de Deus')}` : `${title} | ${SITE}`;
  const nav = NAV.map(([p, label]) => `<li><a href="${href(p)}"${p === section ? ' aria-current="page"' : ''}>${esc(_(label))}</a></li>`).join('');
  const util = UTIL.map(([p, label]) => `<a href="${href(p)}"${p === section ? ' aria-current="page"' : ''}>${esc(_(label))}</a>`).join('');
  const og = ogImage ?? (art ? art.id : 'obra-bellini-madona');
  const lcpId = home ? 'obra-bellini-madona' : art?.id ?? null;
  const lcpSizes = home ? '(min-width: 62rem) min(36vw, 32rem), (min-width: 48rem) 44vw, min(78vw, 34svh)' : art?.fina ? '(min-width: 62rem) 14rem, 60vw' : '(min-width: 62rem) 25rem, (min-width: 48rem) 38vw, min(65vw, 15rem)';
  const alts = alternates ? LOCALES.map((x) => `<link rel="alternate" hreflang="${x.lang}" href="${SITE_URL}${hrefIn(x.code, path)}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${SITE_URL}${hrefIn(DEFAULT_LOCALE, path)}">\n` + LOCALES.filter((x) => x.code !== L.code).map((x) => `<meta property="og:locale:alternate" content="${x.og}">`).join('\n') : '';
  const targets = alternates ? JSON.stringify(Object.fromEntries(LOCALES.map((x) => [x.code, hrefIn(x.code, path)]))) : '{}';
  return `<!doctype html>
<html lang="${L.lang}" data-locale="${L.code}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#f8f1e1" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0f1530" media="(prefers-color-scheme: dark)">
<link rel="canonical" href="${SITE_URL}${href(path)}">
${alts}
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="${L.og}">
<meta property="og:image" content="${SITE_URL}${fileOf(og, MANIFEST[og].widths.includes(1280) ? 1280 : midOf(og))}">
<link rel="icon" href="${asset('assets/icone.svg')}" type="image/svg+xml">
<link rel="preload" href="${asset('assets/fonts/cormorant-garamond-latin-500-normal.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${asset('assets/fonts/atkinson-hyperlegible-latin-400-normal.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${asset('assets/style.css')}">
<link rel="stylesheet" href="${asset('assets/cinematic.css')}">
<link rel="stylesheet" href="${asset('assets/filme.css')}">
${lcpId ? `<link rel="preload" as="image" type="image/webp" href="${fileOf(lcpId, midOf(lcpId))}" imagesrcset="${srcsetOf(lcpId)}" imagesizes="${lcpSizes}" fetchpriority="high">` : ''}
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
<script>(function(d){var h=d.documentElement;h.classList.add('js');try{var s=localStorage.getItem('smd-fonte');if(s)h.style.fontSize=s+'%'}catch(e){}try{if(localStorage.getItem('smd-movimento')==='off')h.classList.add('sem-movimento')}catch(e){}if(!h.classList.contains('sem-movimento')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){h.classList.add('anim');setTimeout(function(){if(!h.classList.contains('f-ok'))h.classList.add('anim-off')},3500)}})(document)</script>
<script>(function(d){var A=${targets},c=d.documentElement.getAttribute('data-locale'),s=null;function go(l){if(A[l])location.replace(A[l]+location.search+location.hash)}try{s=localStorage.getItem('smd-lang')}catch(e){}if(s){if(c==='pt'&&s!=='pt')go(s);return}if(c!=='pt'||navigator.webdriver||/bot|crawl|spider|lighthouse|headless/i.test(navigator.userAgent))return;var ls=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||''],p=null,i,t;for(i=0;i<ls.length&&!p;i++){t=String(ls[i]).toLowerCase().split('-')[0];if(t==='pt'||A[t])p=t}if(!p)p='en';if(p!=='pt')go(p)})(document)</script>
<script>window.SMD=${clientStrings()}</script>
</head>
<body${home ? ' class="inicio"' : ''}>
<a class="skip" href="#conteudo">${esc(_('Ir para o conteúdo'))}</a>
<header class="topo${home ? ' topo--sobre' : ''}">
  <div class="miolo">
    <div class="topo__linha">
      <a class="marca" href="${href()}"><span class="marca__nome" translate="no">Sancta Mater Dei</span><span class="marca__sub">${esc(_('Santa Mãe de Deus'))}</span></a>
      <div class="utilidades"><button class="movimento-ctl" type="button" data-motion-toggle aria-pressed="false" hidden>${esc(_('Ler sem animações'))}</button>
        <span class="utilidades__links">${util}</span>
        ${alternates ? langSwitcher(path) : ''}
        <div class="texto-ctl" role="group" aria-label="${esc(_('Tamanho do texto'))}">
          <button type="button" data-fonte="-10" aria-label="${esc(_('Diminuir o texto'))}">A-</button>
          <button type="button" data-fonte="0" aria-label="${esc(_('Tamanho padrão do texto'))}">A</button>
          <button type="button" data-fonte="10" aria-label="${esc(_('Aumentar o texto'))}">A+</button>
        </div>
      </div>
    </div>
    <nav class="menu" aria-label="${esc(_('Principal'))}">
      <details class="menu__det">
        <summary>${esc(_('Menu'))}</summary>
        <ul>${nav}${UTIL.map(([p, label]) => `<li class="menu__extra"><a href="${href(p)}"${p === section ? ' aria-current="page"' : ''}>${esc(_(label))}</a></li>`).join('')}</ul>
      </details>
    </nav>
    <script>if(!matchMedia('(min-width: 62rem)').matches){var d=document.querySelector('.menu__det');if(d)d.removeAttribute('open')}</script>
  </div>
</header>
<main id="conteudo" tabindex="-1"${art ? ' class="com-abertura"' : home ? '' : ' class="com-cartela"'}>
${art ? (() => { const sp = splitHead(body); return abertura(art.id, sp.head, { compacta: !!art.fina }) + sp.body; })() : home ? body : cartela(body)}
</main>
<footer class="rodape">
  <div class="miolo rodape__in">
    <p class="rodape__marca">Sancta Mater Dei</p>
    <p>${_h('Projeto pessoal, independente, gratuito e sem fins lucrativos. <strong>Não é um órgão oficial da Igreja Católica</strong> e não substitui o ensino do Magistério nem a orientação de um pároco ou de um diretor espiritual.')}</p>
    <p>${_h('O conteúdo passou por pesquisa documental, mas ainda não por revisão teológica humana. Encontrou um erro? <a href="{link}">Veja como pedir uma correção</a>.', { link: href('sobre/#correcoes') })}</p>
    ${L.code === DEFAULT_LOCALE ? '' : `<p lang="${L.lang}">${esc(_('Esta é uma tradução do texto de referência em português. Ela ainda não passou por revisão de falantes nativos nem por revisão teológica.'))}</p>`}
    <p class="rodape__peq">${_h('Sem anúncios, sem rastreamento e sem cadastro. <a href="{galeria}">Galeria de obras</a> · <a href="{fontes}">Fontes e créditos</a> · <a href="{sobre}">Sobre e metodologia</a> · <a href="{priv}">Privacidade</a>', { galeria: href('galeria/'), fontes: href('biblioteca/'), sobre: href('sobre/'), priv: href('privacidade/') })}</p>
    <p class="rodape__tex">${esc(_('As obras vêm do acervo Open Access do The Metropolitan Museum of Art (CC0) e do Wikimedia Commons; o crédito de cada uma está junto à imagem e na Biblioteca. A textura de tela do fundo foi gerada pelo projeto.'))}</p>
    ${alternates ? `<nav class="rodape__idiomas" aria-label="${esc(_('Idioma'))}" translate="no">${LOCALES.map((x) => `<a href="${hrefIn(x.code, path)}" hreflang="${x.lang}" lang="${x.lang}" data-idioma="${x.code}"${x.code === L.code ? ' aria-current="true"' : ''}>${esc(x.native)}</a>`).join(' · ')}</nav>` : ''}
  </div>
</footer>
${LB}
<script src="${asset('assets/vendor/gsap.min.js')}" fetchpriority="low" defer></script>
<script src="${asset('assets/vendor/ScrollTrigger.min.js')}" fetchpriority="low" defer></script>
<script src="${asset('assets/filtro.js')}" defer></script>
<script src="${asset('assets/filme.js')}" defer></script>
<script src="${asset('assets/app.js')}" defer data-obras="${asset(`assets/obras.${L.code}.json`)}" data-galeria="${href('galeria/')}"></script>
</body>
</html>
`;
}

function emit(path, html) {
  const dir = path === '' ? join(OUT, PREFIX) : join(OUT, PREFIX, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  emitted.push(path);
}
const emitted = [];

const crumbs = (items) =>
  `<nav class="trilha" aria-label="${esc(_('Você está em'))}"><ol>${items
    .map(([label, p], i) => (i === items.length - 1 ? `<li aria-current="page">${esc(label)}</li>` : `<li><a href="${href(p)}">${esc(label)}</a></li>`))
    .join('')}</ol></nav>`;
const HOME = () => _('Início');

const sourcesLine = (ids = []) =>
  ids.length
    ? `<p class="bloco__fontes">${_h('Fontes: {lista}', { lista: ids.map((id) => `<a href="${href('biblioteca/')}#fonte-${id}">${esc(srcById[id].title)}</a>`).join('; ') })}</p>`
    : `<p class="bloco__fontes bloco__fontes--nenhuma">${esc(_('Sem fonte específica: nota editorial do projeto.'))}</p>`;

const blockId = (i) => `b${i + 1}`;
function renderBlocks(blocks = [], figures = []) {
  return blocks
    .map((b, i) => {
      const html = `<section class="bloco bloco--${b.kind}" data-reveal="rise"${b.heading ? ` aria-labelledby="${blockId(i)}"` : ''}>
  <p class="bloco__rotulo"><span class="sr-only">${esc(_('Tipo de conteúdo: '))}</span>${esc(_(BLOCK_KINDS[b.kind]))}</p>
  ${b.heading ? `<h2 class="bloco__titulo" id="${blockId(i)}">${esc(b.heading)}</h2>` : ''}
  ${paragraphs(b.text)}
  ${sourcesLine(b.sources)}
</section>`;
      const figs = figures.filter((f) => f.after === i).map((f) => figure(f.id, { cls: `fig--leitura${MANIFEST[f.id].ratio < 1 ? ' fig--retrato' : ''}`, sizes: '(min-width: 62rem) 40rem, 94vw' })).join('\n');
      return html + (figs ? '\n' + figs : '');
    })
    .join('\n');
}
const tocOf = (blocks = []) => blocks.map((b, i) => (b.heading ? `<li><a href="#${blockId(i)}">${esc(b.heading)}</a></li>` : '')).join('');

const reviewLine = (r) =>
  `<p class="verificacao">${_h('Última verificação documental: <time datetime="{iso}">{data}</time> · Revisão teológica humana: {estado}.', { iso: r.lastVerified, data: esc(fmtDate(r.lastVerified, 'dia')), estado: esc(r.humanTheologicalReview ? _('realizada') : _('ainda não realizada')) })}</p>`;

function relatedBlock(record) {
  const rel = record.relations ?? {};
  const groups = [
    ['apparitions', 'Aparições'], ['miracles', 'Milagres'], ['devotions', 'Devoções'],
    ['titles', 'Títulos marianos'], ['shrines', 'Santuários'], ['celebrations', 'Celebrações'], ['prayers', 'Orações'], ['articles', 'Para continuar']
  ];
  const parts = groups
    .map(([k, label]) => {
      const items = (rel[k] ?? []).filter((id) => pubById[id]);
      if (!items.length) return '';
      return `<div><h3>${esc(_(label))}</h3><ul>${items.map((id) => `<li><a href="${urlOf[id]}">${esc(pubById[id].title)}</a></li>`).join('')}</ul></div>`;
    })
    .join('');
  return parts ? `<aside class="relacionados" aria-labelledby="rel-t"><h2 id="rel-t">${esc(_('Relacionados'))}</h2><div class="relacionados__grade">${parts}</div></aside>` : '';
}

function decisionTable(a) {
  const list = [...a.decisions].sort((x, y) => sortKey(x.date) - sortKey(y.date));
  return list
    .map((d) => {
      const src = srcById[d.documentSourceId];
      const kinds = listAnd(d.kinds.map((k) => _(DECISION_KINDS[k])));
      return `<article class="decisao" aria-labelledby="${d.id}-t">
  <p class="decisao__tipo">${esc(_('Decisão eclesial documentada: {tipos}', { tipos: kinds }))}</p>
  <h3 id="${d.id}-t">${esc(_('{data}. {autoridade}', { data: fmtDate(d.date, d.datePrecision), autoridade: d.authority }))}</h3>
  <dl>
    <div><dt>${esc(_('Autoridade'))}</dt><dd>${esc(_('{autoridade} ({nivel})', { autoridade: d.authority, nivel: _(AUTHORITY_LEVELS[d.authorityLevel]) }))}</dd></div>
    <div><dt>${esc(_('Alcance e limites'))}</dt><dd>${esc(d.scope)}</dd></div>
    <div><dt>${esc(_('Documento'))}</dt><dd>${esc(d.document)}</dd></div>
    ${d.quote ? `<div><dt>${esc(_('Trecho citado ({idioma})', { idioma: langName(d.quoteLang ?? 'pt') }))}</dt><dd><q lang="${esc(d.quoteLang ?? 'pt')}">${esc(d.quote)}</q></dd></div>` : ''}
    <div><dt>${esc(_('Fonte consultada'))}</dt><dd><a href="${href('biblioteca/')}#fonte-${src.id}">${esc(src.title)}</a>${d.sourceNote ? `. <em>${esc(d.sourceNote)}</em>` : ''}</dd></div>
  </dl>
</article>`;
    })
    .join('\n');
}

const statusSummary = (a) => {
  const ds = a.decisions ?? [];
  if (!ds.length) return _('Sem decisão eclesial documentada nesta edição');
  const last = [...ds].sort((x, y) => sortKey(y.date) - sortKey(x.date))[0];
  return _('{tipos}: {nivel}, {data}', { tipos: listAnd(last.kinds.map((k) => _(DECISION_KINDS[k]))), nivel: _(AUTHORITY_LEVELS[last.authorityLevel]), data: fmtDate(last.date, last.datePrecision) });
};

const filterItem = (attrs, inner) =>
  `<li class="item" data-item ${Object.entries(attrs).map(([k, v]) => `data-${k}="${esc(v)}"`).join(' ')}>${inner}</li>`;

const emptyState = (msg) => `<p class="vazio" data-vazio hidden>${esc(msg)}</p>`;
const countLine = (n) => `<p class="contagem" data-contagem role="status" aria-live="polite">${esc(_n('{n} registro(s)', n))}</p>`;
const resetBtn = (key = 'Limpar') => `<button type="reset" class="botao botao--sec">${esc(_(key))}</button>`;
const searchBox = (label = 'Buscar') => `<div><label for="q">${esc(_(label))}</label><input id="q" type="search" name="q" autocomplete="off"></div>`;
/** Nome de região do acervo ("Europa") no idioma da página; o valor do filtro continua sendo a chave em português. */
const macroKey = (m) => normalize(m ?? '').replace(/ /g, '-');

// ---------- páginas ----------
const words = (text) => wordsOf(text).map((w) => `<span class="pal"><span class="pal__i">${esc(w)}</span></span>`).join(JOIN);
const fundoCredito = (id) => {
  const im = imageById[id.split(':')[0]];
  return `<p class="fundo-credito">${_h('Fundo: detalhe de {autor}, {titulo}, {data}. {acervo}. {licenca}. <a href="{link}">Ver a obra inteira</a>', { autor: esc(_p(im.author)), titulo: esc(im.title), data: esc(imgDate(im.dateText)), acervo: esc(_(im.institution)), licenca: esc(_(im.license)), link: `${href('galeria/')}#${im.id}` })}</p>`;
};

// ---------- página inicial: um filme em atos ----------
// Cada ato é uma seção legível sem JavaScript; filme.js só acrescenta luz, enquadramento e ritmo.
const ROMANOS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];
const letras = (text) => `<span class="f-titulo__l" aria-hidden="true">${wordsOf(text).map((w) => `<span class="f-palavra">${[...w].map((c) => `<span class="f-letra">${esc(c)}</span>`).join('')}</span>`).join(JOIN)}</span>`;
const palavras = (text) => wordsOf(text).map((w) => `<span class="f-pal">${esc(w)}</span>`).join(JOIN);
const creditoCurto = (id) => { const im = imageById[id]; return `${esc(_p(im.author))}${im.institution ? ` · ${esc(_(im.institution).split(',')[0])}` : ''}`; };

function pageHome() {
  const lourdes = cat.apparitions.find((a) => a.slug === 'lourdes');
  const fatima = cat.apparitions.find((a) => a.slug === 'fatima');
  const chapters = cat.articles.filter((a) => a.category === 'vida').sort((a, b) => a.order - b.order);
  const ave = cat.prayers.find((p) => p.slug === 'ave-maria');
  const hero = imageById['obra-bellini-madona'];
  const memling = imageById['obra-memling-anunciacao'];
  const anunciacao = chapters.find((c) => c.slug === 'anunciacao');
  const refsOf = (c, n) => (c.scriptureRefs?.length ? bibleRefs(n ? c.scriptureRefs.slice(0, n) : c.scriptureRefs) : _('Tradição e ensino da Igreja'));

  const apar = (a, imgId, sizes) => {
    const im = imageById[imgId];
    return `<article class="apar" data-revela>
  <a class="cobre" href="${urlOf[a.id]}" tabindex="-1" aria-hidden="true"><div class="quadro" style="--ar:${MANIFEST[imgId].ratio};${focusStyle(imgId)}">${img(imgId, { sizes })}</div></a>
  <p class="legenda">${esc(im.caption)}<span class="legenda__credito">${esc(creditText(im))} ${originLink(im)}</span></p>
  <h3><a href="${urlOf[a.id]}">${esc(a.title)}</a></h3>
  <p>${esc(a.summary)}</p>
  <p class="apar__status"><span class="sr-only">${esc(_('Situação eclesial documentada: '))}</span>${esc(statusSummary(a))}</p>
</article>`;
  };

  // Ato II: película com os capítulos, cada fotograma com crédito
  const fotogramas = chapters.map((c, i) => {
    const id = MANIFEST[c.banner] ? c.banner : 'obra-bellini-madona';
    return `<li class="f-fotograma">
  <a href="${urlOf[c.id]}" class="f-fotograma__a">
    <span class="f-fotograma__num" aria-hidden="true">${ROMANOS[i]}</span>
    <span class="f-fotograma__janela" style="--ar:${MANIFEST[id].ratio}">${img(id, { sizes: '(min-width: 62rem) 22rem, 70vw', alt: '' })}</span>
    <span class="f-fotograma__titulo">${esc(c.title)}</span>
    <span class="f-fotograma__refs">${esc(refsOf(c, 2))}</span>
  </a>
  <p class="f-fotograma__cred">${creditoCurto(id)}</p>
</li>`;
  }).join('');

  // Ato IV: o mapa acende ponto a ponto
  const lugares = [...cat.titles, ...cat.shrines].filter((r) => r.place?.coordinates);
  const paises = new Set([...cat.titles, ...cat.shrines, ...cat.apparitions].map((r) => r.place?.iso).filter(Boolean));
  const pontos = lugares
    .map((r) => ({ r, xy: project(r.place.coordinates.lon, r.place.coordinates.lat) }))
    .sort((a, b) => a.xy[0] - b.xy[0])
    .map(({ r, xy }) => `<circle class="f-ponto" cx="${xy[0].toFixed(1)}" cy="${xy[1].toFixed(1)}" r="4.5"><title>${esc(r.title)}</title></circle>`).join('');

  // Créditos finais: as obras da própria página, como num filme
  const obrasDaPagina = [...new Set([hero.id, memling.id, ...chapters.map((c) => (MANIFEST[c.banner] ? c.banner : null)).filter(Boolean), 'img-gruta-lourdes', 'img-criancas-fatima', 'obra-david-descanso'])]
    .map((id) => imageById[id]).filter(Boolean);
  const creditos = obrasDaPagina.map((im) => {
    const inst = im.institution ? _(im.institution) : im.origin ? imgOrigin(im.origin) : '';
    return `<li><span class="f-cred__obra">${esc(im.title)}</span><span class="f-cred__autor">${esc(_p(im.author))}</span><span class="f-cred__acervo">${esc(inst)}${inst ? ' · ' : ''}${esc(_(im.license))}</span></li>`;
  }).join('');

  const tira = ['obra-reni-imaculada', 'obra-signorelli-assuncao', 'obra-rosario-misterios', 'obra-david-virgem-paisagem', 'obra-bellini-dormindo', 'obra-raphael-entronizada']
    .map((id) => `<a href="${href('galeria/')}#${id}" data-lightbox="${id}" class="f-montagem__item" style="--ar:${MANIFEST[id].ratio}"><span class="quadro" style="${focusStyle(id)}">${img(id, { sizes: '(min-width: 62rem) 24vw, 46vw', alt: imageById[id].caption })}</span><span class="f-montagem__cred">${esc(_p(imageById[id].author))}</span></a>`).join('');

  const body = `
<div class="f-progresso" aria-hidden="true"><span data-progresso></span></div>

<section class="f-prologo" data-prologo aria-labelledby="titulo-site">
  <canvas class="f-poeira" data-poeira aria-hidden="true"></canvas>
  <div class="f-prologo__aura" aria-hidden="true"></div>
  <div class="miolo f-prologo__grade">
    <div class="f-prologo__texto">
      <p class="f-sobre" data-f>${esc(_('Uma história contada em pinturas'))}</p>
      <h1 id="titulo-site" class="f-titulo" aria-label="Sancta Mater Dei" translate="no">${letras('Sancta Mater Dei')}</h1>
      <p class="f-sub" data-f>${esc(_('Santa Mãe de Deus'))}</p>
      <p class="f-intro" data-f>${esc(_('A vida de Maria segundo a Escritura, o seu lugar na fé católica, as aparições, os santuários e as orações. Cada fonte fica à vista.'))}</p>
      <p class="f-acoes" data-f>
        <a class="botao botao--luz" href="#ato-1">${esc(_('Começar'))}</a>
        <a class="botao botao--fio" href="#leitura">${esc(_('Pular apresentação'))}</a>
      </p>
    </div>
    <figure class="f-quadro f-quadro--heroi" data-prologo-quadro>
      <div class="f-quadro__moldura" style="--ar:${MANIFEST[hero.id].ratio};${focusStyle(hero.id)}">${img(hero.id, { sizes: '(min-width: 62rem) min(36vw, 32rem), (min-width: 48rem) 44vw, min(78vw, 34svh)', eager: true, alt: hero.alt })}<span class="f-quadro__luz" aria-hidden="true"></span></div>
      <figcaption class="f-legenda" data-f>${esc(hero.caption)} <span class="legenda__credito">${esc(creditText(hero))} ${originLink(hero)}</span> <a class="link-obra" href="${href('galeria/')}#${hero.id}" data-lightbox="${hero.id}">${seeWork()}</a></figcaption>
    </figure>
  </div>
  <a class="f-rolar" href="#ato-1" data-f><span>${esc(_('Role para começar'))}</span><i aria-hidden="true"></i></a>
</section>

<section class="f-cena" id="ato-1" data-cena aria-labelledby="cena-titulo">
  <div class="f-cena__palco" data-cena-palco>
    <div class="f-raios" data-raios aria-hidden="true"></div>
    <div class="miolo f-cena__grade">
      <figure class="f-quadro f-quadro--cena" data-cena-quadro>
        <div class="f-quadro__moldura" style="--ar:${MANIFEST[memling.id].ratio};${focusStyle(memling.id)}">${img(memling.id, { sizes: '(min-width: 62rem) 26rem, (min-width: 48rem) 40vw, 72vw', alt: memling.alt })}<span class="f-quadro__luz" aria-hidden="true"></span></div>
        <figcaption class="f-legenda">${esc(memling.caption)} <span class="legenda__credito">${esc(creditText(memling))} ${originLink(memling)}</span></figcaption>
      </figure>
      <div class="f-cena__texto">
        <p class="f-ato" data-linha><span>${esc(_('Ato I'))}</span> ${esc(_('Na Escritura'))} · ${esc(bibleRef('Lc 1,26-38'))}</p>
        <h2 id="cena-titulo" class="f-cena__titulo" data-linha>${esc(_('A Anunciação'))}</h2>
        <p class="f-cena__resumo" data-linha>${esc(anunciacao.summary)}</p>
        <p class="f-cena__nota" data-linha>${esc(_('Uma história que a arte convida a contemplar, e que a Escritura convida a conhecer.'))}</p>
        <p data-linha><a class="botao botao--fio" href="${urlOf[anunciacao.id]}">${esc(_('Ler este capítulo'))}</a></p>
      </div>
    </div>
  </div>
</section>

<section class="f-pelicula" id="ato-2" data-pelicula aria-labelledby="pelicula-titulo">
  <div class="miolo f-pelicula__cab">
    <p class="f-ato" data-revela><span>${esc(_('Ato II'))}</span> ${esc(_('Treze capítulos'))}</p>
    <h2 id="pelicula-titulo" data-revela>${esc(_('A vida de Maria'))}</h2>
    <p data-revela>${esc(_('Da Nazaré do século I à Igreja nascente. Em cada capítulo, o que diz a Escritura fica separado da doutrina e da tradição.'))}</p>
  </div>
  <div class="f-pelicula__janela" data-pelicula-janela role="region" aria-label="${esc(_('Capítulos da vida de Maria'))}" tabindex="0">
    <ol class="f-pelicula__trilho" data-pelicula-trilho>${fotogramas}</ol>
  </div>
  <p class="miolo f-pelicula__pe"><a href="${href('vida-de-maria/')}">${esc(_('Ver os capítulos em lista'))}</a></p>
</section>

<section class="f-manto" id="ato-3" data-manto aria-labelledby="oracao">
  <div class="f-manto__tecido" aria-hidden="true">${img('obra-bellini-madona:manto', { sizes: '100vw', alt: '' })}</div>
  <canvas class="f-estrelas" data-estrelas aria-hidden="true"></canvas>
  <div class="f-manto__veu" aria-hidden="true"></div>
  <div class="miolo f-manto__in">
    <p class="f-ato f-ato--claro" data-revela><span>${esc(_('Ato III'))}</span> ${esc(_('Uma oração'))}</p>
    <h2 id="oracao" class="sr-only">${esc(_('Uma oração'))}</h2>
    <figure class="f-oracao">
      ${ORNAMENTO}
      <blockquote aria-label="${esc(ave.title)}" data-ave lang="${L.lang}">${ave.text.slice(0, 2).map((l) => `<p>${palavras(l)}</p>`).join('')}</blockquote>
      <figcaption>${esc(_('{oracao}, na redação do Compêndio do Catecismo no sítio do Vaticano.', { oracao: ave.title }))}</figcaption>
      <p class="f-manto__acoes"><a class="botao botao--luz" href="${href('oracoes/rosario/')}">${esc(_('Rezar o Rosário'))}</a> <button class="botao botao--fio-claro" type="button" data-manto-pause aria-pressed="false" hidden>${esc(_('Pausar o céu estrelado'))}</button></p>
    </figure>
    ${fundoCredito('obra-bellini-madona')}
  </div>
</section>

<section class="f-mundo" id="ato-4" data-mundo aria-labelledby="mundo-titulo">
  <div class="miolo f-mundo__grade">
    <div class="f-mundo__texto">
      <p class="f-ato f-ato--claro" data-revela><span>${esc(_('Ato IV'))}</span> ${esc(_('Títulos, santuários, festas'))}</p>
      <h2 id="mundo-titulo" data-revela>${esc(_('Maria pelo mundo'))}</h2>
      <p data-revela>${esc(_('A mesma Maria, mãe de Jesus, honrada em línguas e culturas muito diferentes. Cada lugar do mapa tem página, fontes e o que a Igreja decidiu.'))}</p>
      <dl class="f-numeros" data-revela>
        <div><dt>${esc(_('títulos pesquisados'))}</dt><dd data-contar="${cat.titles.length}">${cat.titles.length}</dd></div>
        <div><dt>${esc(_('santuários'))}</dt><dd data-contar="${cat.shrines.length}">${cat.shrines.length}</dd></div>
        <div><dt>${esc(_('países'))}</dt><dd data-contar="${paises.size}">${paises.size}</dd></div>
      </dl>
      <p class="f-mundo__links" data-revela><a class="botao botao--luz" href="${href('maria-pelo-mundo/')}">${esc(_('Abrir o atlas'))}</a> <a class="botao botao--fio-claro" href="${href('santuarios/')}">${esc(_('Santuários'))}</a> <a class="botao botao--fio-claro" href="${href('calendario/')}">${esc(_('Calendário'))}</a></p>
    </div>
    <figure class="f-mundo__mapa">
      <svg viewBox="0 0 ${MAPA.w} ${MAPA.h}" role="img" aria-label="${esc(_n('Mapa-múndi com {n} lugares marianos pesquisados', lugares.length))}"><path class="f-mundo__terra" d="${MAPA.d}"/><g class="f-mundo__pontos" data-pontos>${pontos}</g></svg>
      <figcaption class="f-legenda">${esc(_('Amostra pesquisada, não o mundo inteiro. Terras: Natural Earth (domínio público). Coordenadas: Wikidata (CC0).'))}</figcaption>
    </figure>
  </div>
</section>

<section class="f-creditos" aria-labelledby="creditos-titulo" data-creditos>
  <div class="miolo f-creditos__in">
    <p class="f-ato f-ato--claro"><span>${esc(_('Fim da apresentação'))}</span></p>
    <h2 id="creditos-titulo">${esc(_('Créditos'))}</h2>
    <p class="f-creditos__intro">${esc(_('As obras que contaram esta história. Todas em domínio público ou CC0, com a origem registrada.'))}</p>
    <div class="f-creditos__janela" tabindex="0" role="region" aria-label="${esc(_('Lista de créditos das obras'))}"><ul class="f-creditos__rolo" data-creditos-rolo>${creditos}</ul></div>
    <p class="f-creditos__fim">${_h('Fontes, documentos e licenças completos na <a href="{link}">Biblioteca</a>.', { link: href('biblioteca/') })}</p>
  </div>
</section>

<section class="secao ambiente" aria-labelledby="leitura">
  <div class="ambiente__arte" aria-hidden="true" data-parallax>${img('obra-david-descanso:ceu', { sizes: '100vw', alt: '' })}</div>
  <div class="miolo guia">
    <div data-revela>
      <h2 id="leitura" tabindex="-1">${esc(_('Uma leitura guiada'))}</h2>
      <p>${esc(_n('{n} capítulos, na ordem da narrativa. Em cada um, o que a Bíblia diz fica separado da doutrina da Igreja e da tradição posterior.', chapters.length))}</p>
      <p><a href="${href('vida-de-maria/')}">${esc(_('Ver todos os capítulos'))}</a></p>
    </div>
    <ol class="indice" data-revela>${chapters.map((c) => `<li><div><a href="${urlOf[c.id]}">${esc(c.title)}</a><p>${esc(refsOf(c))}</p></div></li>`).join('')}</ol>
  </div>
  <div class="miolo">${fundoCredito('obra-david-descanso')}</div>
</section>

<section class="secao" aria-labelledby="aparicoes">
  <div class="miolo">
    <h2 id="aparicoes" data-revela>${esc(_('Aparições e a decisão da Igreja'))}</h2>
    <p data-revela>${esc(_('Cada aparição aparece com o lugar, as datas e o relato, e, em separado, a decisão eclesial: quem decidiu, quando e em qual documento.'))}</p>
    <div class="duo">
      ${apar(lourdes, 'img-gruta-lourdes', '(min-width: 62rem) 44rem, 94vw')}
      ${apar(fatima, 'img-criancas-fatima', '(min-width: 62rem) 26rem, 94vw')}
    </div>
    <p><a href="${href('aparicoes/')}">${esc(_('Ver o catálogo de aparições'))}</a></p>
  </div>
</section>

<section class="secao f-montagem" aria-labelledby="galeria">
  <div class="miolo">
    <h2 id="galeria" data-revela>${esc(_('Obras que conduzem a leitura'))}</h2>
    <p data-revela>${esc(_('Pinturas e gravuras dos séculos XV a XVII, cada uma com autoria, acervo e licença. Abra qualquer uma em tamanho ampliado.'))}</p>
    <div class="f-montagem__grade">${tira}</div>
    <p><a href="${href('galeria/')}">${esc(_('Ver toda a galeria'))}</a></p>
  </div>
</section>

<section class="secao" aria-labelledby="rigor">
  <div class="miolo">
    <h2 id="rigor" data-revela>${esc(_('Rigor antes de beleza'))}</h2>
    <p data-revela>${esc(_('Publicamos só o que foi lido na fonte. O que falta pesquisar fica visível como lacuna, e nenhuma decisão é chamada de "aprovada" sem dizer qual autoridade a tomou.'))}</p>
    <dl class="metodo" data-revela>
      <div><dt>${esc(_('Escritura'))}</dt><dd>${esc(_('O que os textos bíblicos dizem, com a referência.'))}</dd></div>
      <div><dt>${esc(_('Doutrina da Igreja'))}</dt><dd>${esc(_('O que o Magistério ensina, com o documento.'))}</dd></div>
      <div><dt>${esc(_('Tradição devocional'))}</dt><dd>${esc(_('Práticas e relatos posteriores, apresentados como tradição.'))}</dd></div>
      <div><dt>${esc(_('Revelação privada'))}</dt><dd>${esc(_('Relatos de aparições. Segundo o Catecismo, não pertencem ao depósito da fé.'))}</dd></div>
    </dl>
    <p>${_h('No acervo inicial, {milagres} registros de milagres e {devocoes} de promessas aguardam verificação e ficam fora do catálogo público. <a href="{link}">Conheça o método</a>.', { milagres: drafts.miracles, devocoes: drafts.devotions, link: href('sobre/') })}</p>
  </div>
</section>`;
  return layout({
    title: SITE, path: '', section: '', body, home: true, ogImage: 'obra-bellini-madona',
    description: _('Livro digital independente sobre Maria: a sua vida segundo a Escritura, a fé católica, aparições, santuários, devoções e orações, com as fontes e a autoridade de cada decisão.'),
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE, inLanguage: L.lang }
  });
}

function pageArticleIndex(category, intro) {
  const items = cat.articles.filter((a) => a.category === category).sort((a, b) => a.order - b.order);
  const dir = ART_DIR[category];
  const ordered = category === 'vida' || category === 'dossie';
  const label = _(CAT_LABEL[category]);
  const list = items.map((a, i) => `<li>${ordered ? `<span class="cap__n" aria-hidden="true">${i + 1}</span>` : ''}<div><h2 class="item-t"><a href="${urlOf[a.id]}">${esc(a.title)}</a></h2><p>${esc(a.summary)}</p>${a.scriptureRefs?.length ? `<p class="refs">${esc(_('Escritura: {refs}', { refs: bibleRefs(a.scriptureRefs) }))}</p>` : ''}</div></li>`).join('');
  const body = `<div class="miolo pagina">
${crumbs([[HOME(), ''], [label, `${dir}/`]])}
<h1>${esc(label)}</h1>
${intro}
<${ordered ? 'ol' : 'ul'} class="capitulos" data-reveal="fade">${list}</${ordered ? 'ol' : 'ul'}>
</div>`;
  return { items, dir, html: layout({ title: label, path: `${dir}/`, section: `${dir}/`, body, art: { id: category === 'vida' ? 'obra-david-virgem-paisagem' : 'obra-raphael-entronizada' }, description: _n('{cat}: {n} páginas com fontes identificadas.', items.length, { cat: label }) }) };
}

function pageArticle(a, siblings, dir) {
  const i = siblings.findIndex((x) => x.id === a.id);
  const prev = siblings[i - 1], next = siblings[i + 1];
  const seq = a.category === 'vida' || a.category === 'fe' || a.category === 'dossie';
  const pass = (x, dir2) => x
    ? `<a class="passagem passagem--${dir2}" href="${urlOf[x.id]}" rel="${dir2 === 'ant' ? 'prev' : 'next'}"><div class="passagem__arte" style="${focusStyle(x.banner)}">${img(x.banner, { sizes: '(min-width: 40rem) 36rem, 94vw', alt: '' })}</div><div class="passagem__texto"><span class="passagem__rotulo">${esc(dir2 === 'ant' ? _('Capítulo anterior') : _('Próximo capítulo'))}</span><span class="passagem__titulo">${esc(x.title)}</span></div></a>`
    : '<span></span>';
  const pn = seq ? `<nav class="passagens" aria-label="${esc(_('Navegação entre capítulos'))}" data-reveal="rise">${pass(prev, 'ant')}${pass(next, 'prox')}</nav>` : '';
  const refs = a.scriptureRefs?.length ? `<p class="refs">${_h('<strong>Referências bíblicas:</strong> {refs}', { refs: esc(bibleRefs(a.scriptureRefs)) })}</p>` : '';
  const rank = a.dogmaRank ? `<p class="refs">${_h('<strong>Natureza do ensino:</strong> {texto}', { texto: esc(a.dogmaRank) })}</p>` : '';
  const toc = tocOf(a.blocks);
  const side = `<aside class="leitura__lado" aria-label="${esc(_('Neste capítulo'))}"><details class="toc" open><summary>${esc(_('Neste capítulo'))}</summary><ol>${toc}</ol></details><script>if(!matchMedia('(min-width: 62rem)').matches){var t=document.querySelector('details.toc');if(t)t.removeAttribute('open')}</script>${seq ? `<p class="toc__vida"><a href="${href(dir + '/')}">${esc(_('Todos os capítulos'))}</a></p>` : ''}</aside>`;
  const catLabel = _(CAT_LABEL[a.category]);
  const body = `<div class="miolo leitura">
${side}
<article class="leitura__corpo">
${crumbs([[HOME(), ''], [catLabel, `${dir}/`], [a.title, '']])}
<header><p class="sobretitulo">${esc(seq ? _('{cat}, parte {i} de {n}', { cat: catLabel, i: i + 1, n: siblings.length }) : catLabel)}</p><h1>${words(a.title)}</h1><p class="lede" data-h>${esc(a.summary)}</p>${refs}${rank}</header>
<p class="leitura__acoes"><button type="button" class="botao botao--sec" data-leitura-toggle aria-pressed="false">${esc(_('Modo de leitura sem distrações'))}</button></p>
${renderBlocks(a.blocks, a.figures ?? [])}
${reviewLine(a.review)}
${pn}
${relatedBlock(a)}
</article>
</div>`;
  return layout({ title: a.title, path: `${dir}/${a.slug}/`, section: `${dir}/`, body, art: { id: a.banner }, description: a.summary });
}

const placeCountry = (a) => a.place.country;
function pageApparitions() {
  const countries = [...new Set(cat.apparitions.map(placeCountry))].sort(collator.compare);
  const items = cat.apparitions.map((a) => filterItem({
    text: normalize(`${a.title} ${a.summary} ${a.place.locality} ${a.people.map((p) => p.name).join(' ')}`),
    pais: normalize(a.place.country),
    decisao: a.decisions.flatMap((d) => d.kinds).join(' '),
    nivel: [...new Set(a.decisions.map((d) => d.authorityLevel))].join(' ')
  }, `<article><h2 class="item-t"><a href="${urlOf[a.id]}">${esc(a.title)}</a></h2>
<p class="meta">${esc(a.place.locality)}, ${esc(a.place.country)} · ${esc(fmtPeriod(a.period))}</p>
<p>${esc(a.summary)}</p>
<p class="apar__status"><span class="sr-only">${esc(_('Situação eclesial: '))}</span>${esc(statusSummary(a))}</p></article>`)).join('');
  const place = cat.apparitions.map((a) => `<li>${_h('{lugar}, {localidade} ({pais}), <a href="{link}">{titulo}</a>', { lugar: esc(a.place.name), localidade: esc(a.place.locality), pais: esc(a.place.country), link: urlOf[a.id], titulo: esc(a.title) })}</li>`).join('');
  const body = `<div class="miolo pagina">
${crumbs([[HOME(), ''], [_('Aparições'), 'aparicoes/']])}
<h1>${esc(_('Aparições'))}</h1>
<p class="lede">${esc(_('Relatos de aparições da Virgem Maria estudados pela Igreja. Para cada um, mostramos o local, o período, as pessoas envolvidas, a narrativa e, separadamente, a decisão eclesial: quem decidiu, quando, com qual alcance e em qual documento.'))}</p>
<aside class="aviso" role="note">${_h('<strong>Importante.</strong> Reconhecer uma aparição, autorizar o culto, dar nihil obstat e reconhecer um milagre são coisas diferentes. Aparições são "revelações privadas": não pertencem ao depósito da fé (<a href="{link}">saiba mais</a>).', { link: urlOf['fe-revelacoes-privadas'] })}</aside>
<form class="filtros" data-filter-form role="search" aria-label="${esc(_('Filtrar aparições'))}">
  ${searchBox()}
  <div><label for="pais">${esc(_('País'))}</label><select id="pais" data-field="pais"><option value="">${esc(_('Todos'))}</option>${countries.map((c) => `<option value="${esc(normalize(c))}">${esc(c)}</option>`).join('')}</select></div>
  <div><label for="decisao">${esc(_('Decisão documentada'))}</label><select id="decisao" data-field="decisao"><option value="">${esc(_('Todas'))}</option>${['reconhecimento-da-aparicao', 'autorizacao-de-culto', 'nihil-obstat'].map((k) => `<option value="${k}">${esc(_(DECISION_KINDS[k]))}</option>`).join('')}</select></div>
  <div><label for="nivel">${esc(_('Autoridade'))}</label><select id="nivel" data-field="nivel"><option value="">${esc(_('Todas'))}</option>${Object.entries(AUTHORITY_LEVELS).map(([k, v]) => `<option value="${k}">${esc(_(v))}</option>`).join('')}</select></div>
  ${resetBtn('Limpar filtros')}
</form>
${countLine(cat.apparitions.length)}
<ul class="catalogo" data-filter-list>${items}</ul>
${emptyState(_('Nenhuma aparição corresponde a esses filtros. Limpe os filtros ou tente outro termo. O acervo inicial é pequeno.'))}
<section class="secao-menor" aria-labelledby="locais">
  <h2 id="locais">${esc(_('Locais'))}</h2>
  <p>${esc(_('O mapa ainda não está disponível: as coordenadas precisam ser verificadas em fonte antes de serem mostradas, para não sugerir precisão que não temos. Enquanto isso, esta lista é a alternativa completa.'))}</p>
  <ul>${place}</ul>
</section>
<p class="nota-acervo">${esc(_('Em pesquisa, fora do catálogo: {n} registro(s) de aparições em rascunho.', { n: drafts.apparitions }))}</p>
</div>`;
  return layout({ title: _('Aparições'), path: 'aparicoes/', section: 'aparicoes/', body, art: { id: 'obra-david-descanso' }, description: _('Catálogo de aparições marianas com local, período, narrativa e a decisão eclesial documentada: autoridade, data, alcance e fonte.') });
}

function pageApparition(a) {
  const people = a.people.map((p) => `<li><strong>${esc(p.name)}</strong>: ${esc(p.role)}</li>`).join('');
  const plain = [...a.decisions].sort((x, y) => sortKey(x.date) - sortKey(y.date)).map((d) => `<p>${esc(d.plain)}</p>`).join('');
  const side = `<aside class="doc__lado" aria-label="${esc(_('Ficha do registro'))}">
<dl class="ficha">
  <div><dt>${esc(_('Local'))}</dt><dd>${esc(a.place.name)}, ${esc(a.place.locality)}${a.place.region ? ` (${esc(a.place.region)})` : ''}, ${esc(a.place.country)}</dd></div>
  <div><dt>${esc(_('Período relatado'))}</dt><dd>${esc(fmtPeriod(a.period))}</dd></div>
  <div><dt>${esc(_('Situação eclesial documentada'))}</dt><dd>${esc(statusSummary(a))}</dd></div>
  <div><dt>${esc(_('Pessoas envolvidas'))}</dt><dd><ul>${people}</ul></dd></div>
  <div><dt>${esc(_('Última verificação'))}</dt><dd><time datetime="${a.review.lastVerified}">${esc(fmtDate(a.review.lastVerified, 'dia'))}</time></dd></div>
</dl>
<nav aria-label="${esc(_('Nesta página'))}"><ol><li><a href="#resumo-claro">${esc(_('Em linguagem simples'))}</a></li>${tocOf(a.blocks)}<li><a href="#decisoes">${esc(_('Decisões eclesiais'))}</a></li><li><a href="#lacunas">${esc(_('O que falta pesquisar'))}</a></li></ol></nav>
</aside>`;
  const body = `<div class="miolo doc">
<article>
${crumbs([[HOME(), ''], [_('Aparições'), 'aparicoes/'], [a.title, '']])}
<header><p class="sobretitulo">${esc(_('Aparição, {pais}', { pais: a.place.country }))}</p><h1>${esc(a.title)}</h1><p class="lede">${esc(a.summary)}</p></header>
${a.imageIds?.[0] ? figure(a.imageIds[0], { cls: 'fig--leitura', sizes: '(min-width: 62rem) 46rem, 94vw' }) : ''}
<section class="resumo-claro" aria-labelledby="resumo-claro"><h2 id="resumo-claro">${esc(_('Em linguagem simples'))}</h2>${plain}<p class="nota-peq">${esc(_('Reconhecer uma aparição, autorizar o culto, dar nihil obstat e reconhecer um milagre são decisões diferentes. Aqui só constam as decisões listadas abaixo, com o documento de cada uma.'))}</p></section>
${renderBlocks(a.blocks)}
<section aria-labelledby="decisoes" class="decisoes"><h2 id="decisoes">${esc(_('Histórico de decisões eclesiais'))}</h2>
<p class="nota-peq">${esc(_('Cada decisão aparece com a sua autoridade, data, alcance e documento. Decisões anteriores a 2024 não são reclassificadas com a terminologia das normas de 2024.'))}</p>
${decisionTable(a)}</section>
<section aria-labelledby="lacunas" class="lacunas"><h2 id="lacunas">${esc(_('O que ainda falta pesquisar'))}</h2><ul>${a.gaps.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>
<p class="nota-peq">${esc(_('Não encontrar uma fonte não significa que a Igreja tenha rejeitado ou deixado de se pronunciar. Significa apenas que ela não foi lida nesta edição.'))}</p></section>
${reviewLine(a.review)}
${relatedBlock(a)}
</article>
${side}
</div>`;
  return layout({ title: a.title, path: `aparicoes/${a.slug}/`, section: 'aparicoes/', body, art: { id: a.banner, fina: true }, description: a.summary });
}

function pageMiracles() {
  const guide = cat.articles.filter((a) => a.category === 'milagres');
  const items = cat.miracles.map((m) => `<li class="item"><article><h2 class="item-t"><a href="${urlOf[m.id]}">${esc(m.title)}</a></h2><p>${esc(m.summary)}</p></article></li>`).join('');
  const body = `<div class="miolo pagina">
${crumbs([[HOME(), ''], [_('Milagres'), 'milagres/']])}
<h1>${esc(_('Milagres'))}</h1>
<p class="lede">${esc(_('Segundo a compreensão católica, um milagre é obra de Deus, atribuída à intercessão de Maria. Cada registro individual separa três coisas: o acontecimento relatado, a investigação médica e a decisão eclesiástica.'))}</p>
<aside class="aviso" role="note">${_h('<strong>Cuidado com a saúde.</strong> Nada aqui orienta a interromper tratamento médico. A oração pode acompanhar o cuidado profissional, nunca substituí-lo.')}</aside>
${cat.miracles.length
    ? `<ul class="catalogo">${items}</ul>`
    : `<section class="vazio-sec" aria-labelledby="vz"><h2 id="vz">${esc(_('Ainda não há fichas individuais publicadas'))}</h2>
<p>${_h('Nenhum caso atende hoje ao nosso critério mínimo para ser publicado como milagre reconhecido: <strong>autoridade, data e documento da decisão, lidos na fonte</strong>. Há {n} casos em rascunho (fora do catálogo) aguardando essa verificação.', { n: drafts.miracles })}</p>
<p>${esc(_('Enquanto isso, leia o que o santuário de Lourdes informa e o que ainda não conseguimos confirmar:'))}</p></section>`}
<p><a class="botao" href="${href('milagres/curas-reconhecidas-de-lourdes/')}">${esc(_n('Curas reconhecidas de Lourdes ({n} casos)', cat.curasLourdes.length))}</a></p>
<ul class="capitulos">${guide.map((a) => `<li><div><h2 class="item-t"><a href="${urlOf[a.id]}">${esc(a.title)}</a></h2><p>${esc(a.summary)}</p></div></li>`).join('')}</ul>
</div>`;
  return layout({ title: _('Milagres'), path: 'milagres/', section: 'milagres/', body, art: { id: 'obra-bellini-dormindo' }, description: _('Milagres atribuídos à intercessão de Maria, com separação entre o acontecimento relatado, a investigação médica e a decisão eclesiástica.') });
}

function pageLourdesCures() {
  const list = [...cat.curasLourdes].sort((a, b) => sortKey(a.recognitionDate) - sortKey(b.recognitionDate));
  const cnt = (c) => _(c.country);
  const countries = [...new Set(list.map(cnt))].sort(collator.compare);
  const decade = (c) => `${Math.floor(Number(c.recognitionDate.slice(0, 4)) / 10) * 10}`;
  const decades = [...new Set(list.map(decade))].sort();
  const items = list.map((c) => filterItem({ text: normalize(`${c.name} ${_p(c.place)} ${cnt(c)}`), pais: normalize(cnt(c)).replace(/ /g, '-'), decada: decade(c) },
    `<article><h3 class="item-t">${esc(c.name)}</h3><p class="meta">${esc(_('{lugar} ({pais}) · reconhecimento: {data}', { lugar: _p(c.place), pais: cnt(c), data: fmtDate(c.recognitionDate, c.datePrecision) }))}${c.healingDate ? esc(_(' · cura: {data}', { data: fmtDate(c.healingDate, 'dia') })) : ''}</p>${c.authority ? `<p class="nota-peq">${esc(_('Autoridade: {autoridade}', { autoridade: _(c.authority) }))}</p>` : ''}${sourcesLine([c.sourceId])}</article>`)).join('');
  const body = `<div class="miolo pagina">
${crumbs([[HOME(), ''], [_('Milagres'), 'milagres/'], [_('Curas reconhecidas de Lourdes'), '']])}
<h1>${esc(_('Curas reconhecidas de Lourdes'))}</h1>
<p class="lede">${esc(_('Lista de curas que a Igreja reconheceu como milagrosas depois do exame do Santuário de Lourdes. Cada linha traz o nome, a procedência e a data do reconhecimento, tal como na lista oficial.'))}</p>
<section class="bloco bloco--nota"><p class="bloco__rotulo">${esc(_('Nota editorial'))}</p>
<h2 class="bloco__titulo">${esc(_('O que este reconhecimento é, e o que não é'))}</h2>
<p>${_h('O caminho de cada caso tem três partes distintas. Primeiro, o Bureau médico de Lourdes examina se a doença foi grave e se a cura é real e duradoura. Depois, o Comitê Médico Internacional de Lourdes julga o caráter inexplicado da cura segundo critérios fixados. Por fim, quem reconhece publicamente a cura como milagre é o <strong>bispo da diocese da pessoa curada</strong>, e não o santuário nem os médicos.')}</p>
<p>${_h('Isso é descrito pela Igreja na França. Nesta edição <strong>não foram lidos os decretos individuais</strong>: por isso a lista não dá, caso a caso, o nome do bispo, o documento, a doença nem a data da cura. As datas de reconhecimento são as da lista do santuário.')}</p>
${sourcesLine(['egl-fr-enquete-lourdes'])}</section>
<p class="nota-peq">${esc(_('A lista oficial lida tinha 70 casos; o 71º (John Traynor, 2024) vem do Vatican News. A página do santuário e outras fontes falam em 72 casos em 2025; o 72º caso não foi lido aqui. Esta página não orienta a abandonar tratamento médico: o exame de Lourdes parte de casos tratados por médicos.'))}</p>
<form class="filtros" data-filter-form role="search" aria-label="${esc(_('Filtrar curas'))}">
  ${searchBox()}
  <div><label for="pais">${esc(_('País'))}</label><select id="pais" data-field="pais"><option value="">${esc(_('Todos'))}</option>${countries.map((c) => `<option value="${esc(normalize(c).replace(/ /g, '-'))}">${esc(c)}</option>`).join('')}</select></div>
  <div><label for="decada">${esc(_('Década do reconhecimento'))}</label><select id="decada" data-field="decada"><option value="">${esc(_('Todas'))}</option>${decades.map((d) => `<option value="${d}">${d}</option>`).join('')}</select></div>
  ${resetBtn()}
</form>
${countLine(list.length)}
<ul class="catalogo" data-filter-list>${items}</ul>
${emptyState(_('Nenhum caso encontrado.'))}
</div>`;
  return layout({ title: _('Curas reconhecidas de Lourdes'), path: 'milagres/curas-reconhecidas-de-lourdes/', section: 'milagres/', body, art: { id: 'obra-bellini-dormindo', fina: true }, description: _('Lista das curas reconhecidas pela Igreja em Lourdes, com data de reconhecimento, e a explicação de quem decide cada caso.') });
}

function pageMiracle(m) {
  const e = m.ecclesialDecision, md = m.medicalInvestigation;
  const body = `<article class="miolo pagina leitura-longa">
${crumbs([[HOME(), ''], [_('Milagres'), 'milagres/'], [m.title, '']])}
<header><p class="sobretitulo">${esc(_('Milagre'))}</p><h1>${esc(m.title)}</h1><p class="lede">${esc(m.summary)}</p></header>
<section class="bloco"><h2>${esc(_('1. Acontecimento relatado'))}</h2><p>${esc(_('{data}. {descricao}', { data: fmtDate(m.event.date, m.event.datePrecision), descricao: m.event.description }))}</p></section>
<section class="bloco"><h2>${esc(_('2. Investigação médica'))}</h2><p>${esc(md.summary ?? md.notDocumented)}</p>${sourcesLine(md.sources)}</section>
<section class="bloco"><h2>${esc(_('3. Decisão eclesiástica'))}</h2><dl class="ficha"><div><dt>${esc(_('Autoridade'))}</dt><dd>${esc(e.authority)}</dd></div><div><dt>${esc(_('Data'))}</dt><dd>${esc(fmtDate(e.date, e.datePrecision ?? 'dia'))}</dd></div><div><dt>${esc(_('Documento'))}</dt><dd>${esc(e.document)}</dd></div></dl>${sourcesLine(e.sources)}</section>
${renderBlocks(m.blocks)}
<aside class="aviso" role="note">${esc(_('Este site não orienta a interromper tratamentos médicos.'))}</aside>
${reviewLine(m.review)}
${relatedBlock(m)}
</article>`;
  return layout({ title: m.title, path: `milagres/${m.slug}/`, section: 'milagres/', body, art: { id: m.banner, fina: true }, description: m.summary });
}

// ---------- promessas e devoções ----------
const _t = (s) => (s ? _(s) : '');
const SEP = L.code === 'ja' ? '、' : L.code === 'zh' ? '，' : ', ';
const joinPlace = (parts) => parts.filter(Boolean).join(SEP);

function pagePromises() {
  const guide = cat.articles.filter((a) => a.category === 'promessas');
  const promises = cat.devotions.flatMap((d) => d.promises.map((p) => ({ d, p })));
  const list = cat.devotions.map((d) => `<li class="item"><article><h2 class="item-t"><a href="${urlOf[d.id]}">${esc(d.title)}</a></h2><p class="meta">${esc(d.nature === 'mensagem-atribuida' ? _('Mensagem atribuída (relato de vidente)') : _('Prática de oração'))}</p><p>${esc(d.summary)}</p></article></li>`).join('');
  const body = `<div class="miolo pagina">
${crumbs([[HOME(), ''], [_('Promessas e devoções'), 'promessas/']])}
<h1>${esc(_('Promessas e devoções'))}</h1>
<p class="lede">${esc(_('Práticas de oração e mensagens atribuídas a Maria, com a origem, quem as atribui, a fonte e os limites do que se pode afirmar.'))}</p>
<aside class="aviso" role="note">${_h('<strong>Sem garantias automáticas.</strong> Nenhuma prática aqui é apresentada como mecanismo que assegure cura, riqueza, proteção física ou salvação. A devoção é confiança em Deus e não fórmula.')}</aside>
<h2>${esc(_('Devoções registradas'))}</h2>
<ul class="catalogo">${list}</ul>
${promises.length ? '' : `<section class="vazio-sec"><h2>${esc(_('Promessas atribuídas'))}</h2><p>${esc(_n('Nenhuma promessa atribuída passou ainda pela verificação de origem e fonte. Há {n} registro(s) em rascunho, fora desta página. Prefira a ausência a uma promessa sem procedência.', drafts.devotions))}</p></section>`}
<ul class="capitulos">${guide.map((a) => `<li><div><h2 class="item-t"><a href="${urlOf[a.id]}">${esc(a.title)}</a></h2><p>${esc(a.summary)}</p></div></li>`).join('')}</ul>
</div>`;
  return layout({ title: _('Promessas e devoções'), path: 'promessas/', section: 'promessas/', body, art: { id: 'obra-rosario-misterios' }, description: _('Devoções marianas e promessas atribuídas, com origem, atribuição, fonte e limites documentais.') });
}

function pageDevotion(d) {
  const att = d.attribution
    ? `<section class="bloco bloco--nota"><p class="bloco__rotulo">${esc(_('Atribuição'))}</p><h2 class="bloco__titulo">${esc(_('Quem atribui, e com que limites'))}</h2><dl class="ficha"><div><dt>${esc(_('Natureza'))}</dt><dd>${esc(d.attribution.kind)}</dd></div><div><dt>${esc(_('Atribuída a'))}</dt><dd>${esc(d.attribution.who)}</dd></div><div><dt>${esc(_('Como chegou até nós'))}</dt><dd>${esc(d.attribution.how)}</dd></div><div><dt>${esc(_('Limites documentais'))}</dt><dd>${esc(d.attribution.limits)}</dd></div></dl></section>`
    : '';
  const promises = d.promises.length
    ? `<section><h2>${esc(_('Promessas atribuídas'))}</h2>${d.promises.map((p) => `<article class="bloco"><p>${esc(p.text)}</p><p class="nota-peq">${esc(_('Atribuída a: {quem} · Origem: {origem} · Natureza: {natureza}', { quem: p.attributedTo, origem: p.origin, natureza: p.natureOfAttribution }))}</p><p class="nota-peq">${esc(_('Limites: {limites}', { limites: p.limits }))}</p>${sourcesLine(p.sources)}</article>`).join('')}</section>`
    : '';
  const body = `<article class="miolo pagina leitura-longa">
${crumbs([[HOME(), ''], [_('Promessas e devoções'), 'promessas/'], [d.title, '']])}
<header><p class="sobretitulo">${esc(_('Devoção'))}</p><h1>${esc(d.title)}</h1><p class="lede">${esc(d.summary)}</p></header>
${d.slug === 'santo-rosario' ? `<p><a class="botao" href="${href('oracoes/rosario/')}">${esc(_('Rezar o Rosário (guia passo a passo)'))}</a></p>` : ''}
${renderBlocks(d.blocks)}
${att}
${promises}
<section class="lacunas"><h2>${esc(_('O que ainda falta pesquisar'))}</h2><ul>${d.gaps.map((g) => `<li>${esc(g)}</li>`).join('')}</ul></section>
${reviewLine(d.review)}
${relatedBlock(d)}
</article>`;
  return layout({ title: d.title, path: `devocoes/${d.slug}/`, section: 'promessas/', body, art: { id: d.banner, fina: true }, description: d.summary });
}

const miniatura = (id, sizes = '(min-width: 62rem) 12rem, 30vw') => id && MANIFEST[id]
  ? `<span class="mini" aria-hidden="true" style="--ar:${MANIFEST[id].ratio};${focusStyle(id)}">${img(id, { sizes, alt: '' })}</span>` : '';
const creditoLinha = (id) => { const im = imageById[id]; return `<span class="legenda__credito">${esc(creditText(im))} ${originLink(im)}</span>`; };
const licShort = (l) => _(l.split(' (')[0]);
const placeLine = (pl) => (pl ? esc(joinPlace([pl.locality, pl.region, pl.country])) : '');
const nameVariants = (t) => (t.names ?? []).map((n) => n.name).join(' ');
const regionOpts = `<option value="">${esc(_('Todas'))}</option>${MACRO_REGIONS.map((r) => `<option value="${esc(macroKey(r))}">${esc(_(r))}</option>`).join('')}`;
const macroLabel = (m) => (m ? _(m) : '');

// ---------- títulos ----------
function pageTitles() {
  const kindsUsed = [...new Set(cat.titles.flatMap((t) => t.titleKinds))];
  const items = cat.titles.map((t) => filterItem({ text: normalize(`${t.title} ${nameVariants(t)} ${t.summary} ${placeLine(t.place)}`), regiao: macroKey(t.place?.macro ?? 'transversal'), tipo: t.titleKinds.join(' ') },
    `<article><h2 class="item-t"><a href="${urlOf[t.id]}">${esc(t.title)}</a></h2><p class="meta">${t.titleKinds.map((k) => esc(_(TITLE_KINDS[k]))).join(' · ')}${t.place ? ` · ${placeLine(t.place)}` : ''}${t.period ? ` · ${esc(fmtDate(t.period.start, t.period.precision))}` : ''}</p><p>${esc(t.summary)}</p></article>`)).join('');
  const body = `<div class="miolo pagina">
${crumbs([[HOME(), ''], [_('Títulos marianos'), 'titulos/']])}
<h1>${esc(_('Títulos marianos'))}</h1>
<p class="lede">${_h('Nossa Senhora de Lourdes, de Aparecida, de Guadalupe, da China… Os títulos se referem à <strong>mesma Maria</strong>, mãe de Jesus. Cada um nomeia um lugar, uma história ou um aspecto da fé, e cada página diz o que é documentado, o que é tradição e o que a Igreja decidiu.')}</p>
<p class="nota-peq">${_h('Esta é uma amostra documentada, não um catálogo completo: há milhares de títulos e invocações no mundo. O que ainda não foi pesquisado está em <a href="{sobre}">Sobre e pendências</a>. Veja também o <a href="{atlas}">atlas Maria pelo mundo</a>.', { sobre: href('sobre/'), atlas: href('maria-pelo-mundo/') })}</p>
<form class="filtros" data-filter-form role="search" aria-label="${esc(_('Filtrar títulos'))}">
  ${searchBox('Buscar (aceita variantes do nome)')}
  <div><label for="regiao">${esc(_('Região'))}</label><select id="regiao" data-field="regiao">${regionOpts}<option value="transversal">${esc(_('Transversal (sem lugar)'))}</option></select></div>
  <div><label for="tipo">${esc(_('Natureza do título'))}</label><select id="tipo" data-field="tipo" data-partial><option value="">${esc(_('Todas'))}</option>${kindsUsed.map((k) => `<option value="${k}">${esc(_(TITLE_KINDS[k]))}</option>`).join('')}</select></div>
  ${resetBtn()}
</form>
${countLine(cat.titles.length)}
<ul class="catalogo" data-filter-list>${items}</ul>
${emptyState(_('Nenhum título encontrado para essa busca.'))}
</div>`;
  return layout({ title: _('Títulos marianos'), path: 'titulos/', section: 'titulos/', body, art: { id: 'obra-durer-virgem' }, description: _('Títulos de Maria com origem, história documentada, tradição e decisões eclesiais, cada um com suas fontes.') });
}

function feastLine(t) {
  if (!t.feast) return '';
  const f = t.feast;
  return `<div><dt>${esc(_('Festa'))}</dt><dd>${esc(f.text)} (${esc(_(SCOPE_LC[f.scope]))})${sourcesLine(f.sources)}</dd></div>`;
}

function symbolsBlock(t) {
  if (!t.symbols?.length) return '';
  return `<section class="bloco bloco--arte" aria-labelledby="simbolos"><p class="bloco__rotulo"><span class="sr-only">${esc(_('Tipo de conteúdo: '))}</span>${esc(_('Arte e iconografia'))}</p><h2 class="bloco__titulo" id="simbolos">${esc(_('Símbolos da imagem'))}</h2><dl class="simbolos">${t.symbols.map((y) => `<div><dt>${esc(y.name)}</dt><dd>${esc(y.text)}${sourcesLine(y.sources)}</dd></div>`).join('')}</dl></section>`;
}

function pageTitle(t) {
  const variants = (t.names ?? []).slice(1);
  const side = `<aside class="doc__lado" aria-label="${esc(_('Ficha do título'))}"><dl class="ficha">
  <div><dt>${esc(_('Natureza'))}</dt><dd>${t.titleKinds.map((k) => esc(_(TITLE_KINDS[k]))).join('; ')}</dd></div>
  ${t.place ? `<div><dt>${esc(_('Lugar'))}</dt><dd>${placeLine(t.place)} (${esc(macroLabel(t.place.macro))})</dd></div>` : ''}
  ${t.period ? `<div><dt>${esc(_('Período'))}</dt><dd>${esc(fmtPeriod(t.period))}</dd></div>` : ''}
  ${variants.length ? `<div><dt>${esc(_('Outras formas do nome'))}</dt><dd><ul>${variants.map((n) => `<li><span lang="${esc(n.lang ?? 'pt')}">${esc(n.name)}</span></li>`).join('')}</ul></dd></div>` : ''}
  ${feastLine(t)}
  ${t.decisions?.length ? `<div><dt>${esc(_('Situação eclesial documentada'))}</dt><dd>${esc(statusSummary(t))}</dd></div>` : ''}
  <div><dt>${esc(_('Última verificação'))}</dt><dd><time datetime="${t.review.lastVerified}">${esc(fmtDate(t.review.lastVerified, 'dia'))}</time></dd></div>
</dl>
<nav aria-label="${esc(_('Nesta página'))}"><ol>${tocOf(t.blocks)}${t.symbols?.length ? `<li><a href="#simbolos">${esc(_('Símbolos da imagem'))}</a></li>` : ''}${t.decisions?.length ? `<li><a href="#decisoes">${esc(_('Decisões eclesiais'))}</a></li>` : ''}${t.gaps?.length ? `<li><a href="#lacunas">${esc(_('O que falta pesquisar'))}</a></li>` : ''}</ol></nav>
</aside>`;
  const body = `<div class="miolo doc">
<article class="leitura-longa">
${crumbs([[HOME(), ''], [_('Títulos marianos'), 'titulos/'], [t.title, '']])}
<header><p class="sobretitulo">${t.titleKinds.map((k) => esc(_(TITLE_KINDS[k]))).join(' · ')}</p><h1>${esc(t.title)}</h1><p class="lede">${esc(t.summary)}</p></header>
${renderBlocks(t.blocks, t.figures ?? [])}
${symbolsBlock(t)}
${t.decisions?.length ? `<section aria-labelledby="decisoes" class="decisoes"><h2 id="decisoes">${esc(_('Histórico de decisões eclesiais'))}</h2><p class="nota-peq">${esc(_('Cada decisão aparece com a sua autoridade, data, alcance e documento. Decisões diferentes (reconhecer aparição, autorizar culto, coroar, elevar a basílica, proclamar padroeira) não se confundem.'))}</p>${decisionTable(t)}</section>` : ''}
${t.gaps?.length ? `<section aria-labelledby="lacunas" class="lacunas"><h2 id="lacunas">${esc(_('O que ainda falta pesquisar'))}</h2><ul>${t.gaps.map((g) => `<li>${esc(g)}</li>`).join('')}</ul></section>` : ''}
<aside class="aviso" role="note">${esc(_('Este título refere-se à mesma Maria, mãe de Jesus, honrada em todos os outros títulos.'))}</aside>
${reviewLine(t.review)}
${relatedBlock(t)}
</article>
${side}
</div>`;
  return layout({ title: t.title, path: `titulos/${t.slug}/`, section: 'titulos/', body, art: t.portrait ? { id: t.portrait, fina: true } : t.banner ? { id: t.banner, fina: true } : null, description: t.summary });
}

// ---------- santuários ----------
function retratoFig(id) {
  if (!id) return '';
  const im = imageById[id];
  return `<figure class="fig fig--leitura retrato-fig"><div class="quadro" style="--ar:${MANIFEST[id].ratio};${focusStyle(id)}">${img(id, { sizes: '(min-width: 62rem) 26rem, 80vw', alt: im.alt })}</div><figcaption class="legenda"><strong>${esc(_('A imagem venerada.'))}</strong> ${esc(im.caption)} ${creditoLinha(id)}</figcaption></figure>`;
}

function pageShrines() {
  const items = cat.shrines.map((sh) => filterItem({ text: normalize(`${sh.title} ${sh.summary} ${placeLine(sh.place)}`), regiao: macroKey(sh.place.macro) },
    `<article${sh.photo || sh.portrait ? ' class="com-mini"' : ''}>${miniatura(sh.photo ?? sh.portrait)}<div><h2 class="item-t"><a href="${urlOf[sh.id]}">${esc(sh.title)}</a></h2><p class="meta">${placeLine(sh.place)}</p><p>${esc(sh.summary)}</p>${sh.photo ? `<p class="mini__cred">${esc(_('Foto: {autor} · {licenca}', { autor: _p(imageById[sh.photo].author), licenca: licShort(imageById[sh.photo].license) }))}</p>` : ''}</div></article>`)).join('');
  const body = `<div class="miolo pagina">
${crumbs([[HOME(), ''], [_('Santuários'), 'santuarios/']])}
<h1>${esc(_('Santuários marianos'))}</h1>
<p class="lede">${esc(_('Lugares de peregrinação e oração. Cada página distingue o lugar, a imagem e o título, e registra o que a Igreja decidiu sobre o santuário.'))}</p>
<p class="nota-peq">${esc(_('Amostra documentada, não lista completa.'))}</p>
<form class="filtros" data-filter-form role="search" aria-label="${esc(_('Filtrar santuários'))}">
  ${searchBox()}
  <div><label for="regiao">${esc(_('Região'))}</label><select id="regiao" data-field="regiao">${regionOpts}</select></div>
  ${resetBtn()}
</form>
${countLine(cat.shrines.length)}
<ul class="catalogo" data-filter-list>${items}</ul>
${emptyState(_('Nenhum santuário encontrado.'))}
${cat.shrines.length === 0 ? `<p class="vazio">${esc(_('Nenhum santuário publicado ainda.'))}</p>` : ''}
</div>`;
  return layout({ title: _('Santuários marianos'), path: 'santuarios/', section: 'santuarios/', body, description: _('Santuários marianos com localização verificada, história e decisões eclesiais documentadas.') });
}

function pageShrine(sh) {
  const body = `<div class="miolo doc">
<article class="leitura-longa">
${crumbs([[HOME(), ''], [_('Santuários'), 'santuarios/'], [sh.title, '']])}
<header><p class="sobretitulo">${esc(_('Santuário, {pais}', { pais: sh.place.country }))}</p><h1>${esc(sh.title)}</h1><p class="lede">${esc(sh.summary)}</p></header>
${retratoFig(sh.portrait)}
${renderBlocks(sh.blocks)}
${sh.decisions?.length ? `<section aria-labelledby="decisoes" class="decisoes"><h2 id="decisoes">${esc(_('Histórico de decisões eclesiais'))}</h2>${decisionTable(sh)}</section>` : ''}
${sh.gaps?.length ? `<section aria-labelledby="lacunas" class="lacunas"><h2 id="lacunas">${esc(_('O que ainda falta pesquisar'))}</h2><ul>${sh.gaps.map((g) => `<li>${esc(g)}</li>`).join('')}</ul></section>` : ''}
${reviewLine(sh.review)}
${relatedBlock(sh)}
</article>
<aside class="doc__lado" aria-label="${esc(_('Ficha do santuário'))}"><dl class="ficha">
  <div><dt>${esc(_('Lugar'))}</dt><dd>${placeLine(sh.place)} (${esc(macroLabel(sh.place.macro))})</dd></div>
  ${sh.place.coordinates ? `<div><dt>${esc(_('Coordenadas'))}</dt><dd>${sh.place.coordinates.lat}, ${sh.place.coordinates.lon}<br><span class="nota-peq">${esc(sh.place.coordinates.precision)}</span></dd></div>` : ''}
  ${sh.officialUrl ? `<div><dt>${esc(_('Sítio oficial'))}</dt><dd><a href="${esc(sh.officialUrl)}" rel="noopener">${esc(sh.officialUrl.replace(/^https:\/\//, ''))}</a></dd></div>` : ''}
</dl></aside>
</div>`;
  return layout({ title: sh.title, path: `santuarios/${sh.slug}/`, section: 'santuarios/', body, art: sh.photo ? { id: sh.photo } : null, description: sh.summary });
}

// ---------- calendário ----------
function pageCalendar() {
  const fixed = cat.celebrations.filter((c) => !c.date.movable).sort((a, b) => a.date.month - b.date.month || a.date.day - b.date.day);
  const movable = cat.celebrations.filter((c) => c.date.movable);
  const li = (c, when) => {
    const rel = (c.relations.titles ?? []).filter((id) => pubById[id]);
    return `<li id="${c.id}" class="celeb"><p class="meta">${esc(_('{quando} · {grau} · {ambito}', { quando: when, grau: _(RANKS[c.rank]), ambito: _(SCOPE_L[c.scope]) }))}</p><h3>${esc(c.title)}</h3><p>${esc(c.summary)}</p>${c.note ? `<p class="nota-peq">${esc(c.note)}</p>` : ''}${sourcesLine(c.sources)}${rel.length ? `<p class="nota-peq">${_h('Ver: {lista}', { lista: rel.map((id) => `<a href="${urlOf[id]}">${esc(pubById[id].title)}</a>`).join('; ') })}</p>` : ''}</li>`;
  };
  const byMonth = Array.from({ length: 12 }, (_x, i) => {
    const list = fixed.filter((c) => c.date.month === i + 1);
    return list.length ? `<section aria-labelledby="m${i + 1}"><h2 id="m${i + 1}">${esc(monthHeading(i + 1))}</h2><ul class="lista-celeb">${list.map((c) => li(c, esc(fmtDayMonth(c.date.day, i + 1)))).join('')}</ul></section>` : '';
  }).join('');
  const body = `<div class="miolo pagina">
${crumbs([[HOME(), ''], [_('Calendário mariano'), 'calendario/']])}
<h1>${esc(_('Calendário mariano'))}</h1>
<p class="lede">${esc(_('Festas e memórias de Maria. Cada entrada informa o grau (solenidade, festa, memória), o âmbito (universal, nacional ou local) e a fonte.'))}</p>
<p class="nota-peq">${esc(_('O calendário muda com o tempo e varia por país e por diocese; confira sempre o calendário litúrgico do seu lugar. Amostra documentada, não lista completa.'))}</p>
${cat.celebrations.length ? byMonth : `<p class="vazio">${esc(_('Nenhuma celebração publicada ainda.'))}</p>`}
${movable.length ? `<section aria-labelledby="movel"><h2 id="movel">${esc(_('Datas móveis'))}</h2><ul class="lista-celeb">${movable.map((c) => li(c, esc(c.date.movable))).join('')}</ul></section>` : ''}
</div>`;
  return layout({ title: _('Calendário mariano'), path: 'calendario/', section: 'calendario/', body, description: _('Festas e memórias de Maria, com grau, âmbito e fonte de cada data.') });
}

// ---------- atlas ----------
const MAPA = JSON.parse(readFileSync(join(ROOT, 'src', 'assets', 'mapa', 'terra.json'), 'utf8'));
const PAISES = JSON.parse(readFileSync(join(ROOT, 'src', 'assets', 'mapa', 'paises.json'), 'utf8'));
function pageAtlas() {
  const tipoLabel = { aparicao: _('Aparição relatada'), titulo: _('Título'), santuario: _('Santuário') };
  const tituloAparicao = _('Título · aparição relatada');
  const recs = [
    ...cat.apparitions.filter((r) => r.place?.iso).map((r) => ({ r, tipo: 'aparicao' })),
    ...cat.titles.filter((r) => r.place?.iso).map((r) => ({ r, tipo: 'titulo' })),
    ...cat.shrines.filter((r) => r.place?.iso).map((r) => ({ r, tipo: 'santuario' }))
  ];
  const comRegistro = new Set(recs.map(({ r }) => r.place.iso));
  const nomePais = (iso) => countryName(iso, PAISES.find((p) => p.iso === iso)?.nome ?? iso);
  const countryOpts = [...comRegistro].sort((a, b) => collator.compare(nomePais(a), nomePais(b))).map((iso) => `<option value="${iso.toLowerCase()}">${esc(nomePais(iso))}</option>`).join('');
  const paisesSvg = PAISES.map((p) => comRegistro.has(p.iso)
    ? `<path class="pais pais--com" data-pais="${p.iso.toLowerCase()}" data-caixa="${p.caixa.join(' ')}" d="${p.d}"><title>${esc(nomePais(p.iso))}</title></path>`
    : `<path class="pais" d="${p.d}"/>`).join('');
  const isApar = (r, tipo) => tipo === 'titulo' && r.titleKinds?.includes('aparicao-relatada');
  // cada ponto: halo e núcleo num grupo que o script reescala no zoom, para o ponto manter o tamanho na tela
  const pontos = recs.filter(({ r }) => r.place.coordinates).map(({ r, tipo }) => {
    const [x, y] = project(r.place.coordinates.lon, r.place.coordinates.lat);
    const fig = r.portrait ?? r.photo ?? r.imageIds?.[0];
    const rotulo = isApar(r, tipo) ? tituloAparicao : tipoLabel[tipo];
    return `<a class="ponto ponto--${tipo}" data-ponto="${r.id}" data-pais-ponto="${r.place.iso.toLowerCase()}" data-regiao-ponto="${esc(macroKey(r.place.macro))}" data-nome="${esc(r.title)}" data-sub="${esc(`${rotulo} · ${joinPlace([r.place.locality, r.place.country])}`)}"${fig && MANIFEST[fig] ? ` data-img="${fileOf(fig, MANIFEST[fig].widths[0])}"` : ''} href="${urlOf[r.id]}" aria-label="${esc(`${r.title}, ${joinPlace([r.place.locality, r.place.region, r.place.country])}`)}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><g class="ponto__corpo"><circle class="ponto__halo" r="11"/><circle class="ponto__nucleo" r="4.6"/></g></a>`;
  }).join('');
  const items = recs.map(({ r, tipo }) => filterItem({ ref: r.id, text: normalize(`${r.title} ${nameVariants(r)} ${r.summary} ${placeLine(r.place)}`), regiao: macroKey(r.place.macro), tipo: isApar(r, tipo) ? 'titulo aparicao' : tipo, pais: r.place.iso.toLowerCase() },
    `<article${r.portrait || r.photo || r.imageIds?.[0] ? ' class="com-mini"' : ''}>${miniatura(r.portrait ?? r.photo ?? r.imageIds?.[0])}<div><h3 class="item-t"><a href="${urlOf[r.id]}">${esc(r.title)}</a></h3><p class="meta">${isApar(r, tipo) ? esc(tituloAparicao) : esc(tipoLabel[tipo])} · ${placeLine(r.place)}${r.period ? ` · ${esc(fmtPeriod(r.period))}` : ''}</p><p>${esc(r.summary)}</p></div></article>`)).join('');
  const semLugar = cat.titles.filter((t) => !t.place?.iso);
  // rostos de Maria: a imagem venerada em cada lugar, filtrada pelo mesmo país e região do mapa
  const comRetrato = [...cat.titles, ...cat.shrines].filter((r) => r.portrait && r.place?.iso);
  const rostos = comRetrato.length ? `<section class="rostos" aria-labelledby="rostos-t">
<h2 id="rostos-t">${_h('Rostos de Maria {rotulo}', { rotulo: `<span data-rostos-rotulo>${esc(_('pelo mundo'))}</span>` })}</h2>
<p class="nota-peq">${esc(_('A mesma Maria, venerada em cada lugar com uma imagem própria, na arte e no estilo daquele povo. Escolha um país ou uma região para ver só as imagens dali. Só entram imagens com licença livre conferida no Wikimedia Commons; onde não houve, o lugar fica sem retrato.'))}</p>
<ul class="rostos__lista">${comRetrato.map((r) => { const im = imageById[r.portrait]; return `<li data-retrato data-pais="${r.place.iso.toLowerCase()}" data-regiao="${esc(macroKey(r.place.macro))}"><figure><a class="rostos__quadro" href="${urlOf[r.id]}" style="--ar:${MANIFEST[r.portrait].ratio};${focusStyle(r.portrait)}">${img(r.portrait, { sizes: '(min-width: 62rem) 15rem, 44vw', alt: im.alt })}</a><figcaption><a href="${urlOf[r.id]}">${esc(r.title)}</a><span class="rostos__lugar">${placeLine(r.place)}</span><span class="rostos__cred">${esc(`${_p(im.author)} · ${licShort(im.license)}`)} · ${originLink(im)}</span></figcaption></figure></li>`; }).join('')}</ul>
<p class="vazio" data-rostos-vazio hidden>${esc(_('Ainda não há imagem com licença livre conferida para este lugar.'))}</p>
</section>` : '';
  const body = `<div class="miolo pagina atlas">
${crumbs([[HOME(), ''], [_('Maria pelo mundo'), 'maria-pelo-mundo/']])}
<h1>${esc(_('Maria pelo mundo'))}</h1>
<p class="lede">${esc(_('Escolha um país no mapa (ou na lista de países) para ver as aparições relatadas, os títulos e os santuários já pesquisados ali. A mesma Maria, mãe de Jesus, é honrada em culturas e línguas muito diferentes.'))}</p>
<p class="nota-peq">${esc(_('Os países destacados no mapa são só os que têm registro pesquisado ({n}); isso está longe de cobrir o mundo, e país sem destaque não significa ausência de devoção. Aparição relatada não é o mesmo que aparição reconhecida: cada página diz o que a autoridade eclesial decidiu. O mapa não representa disputas de fronteira.', { n: comRegistro.size }))}</p>
<form class="filtros" data-filter-form role="search" aria-label="${esc(_('Filtrar o atlas'))}">
  <div><label for="pais">${esc(_('País'))}</label><select id="pais" data-field="pais"><option value="">${esc(_('Todos'))}</option>${countryOpts}</select></div>
  ${searchBox('Buscar (aceita variantes: Donglu, Dong Lu, Donglü)')}
  <div><label for="regiao">${esc(_('Região'))}</label><select id="regiao" data-field="regiao">${regionOpts}</select></div>
  <div><label for="tipo">${esc(_('Tipo'))}</label><select id="tipo" data-field="tipo"><option value="">${esc(_('Todos'))}</option><option value="aparicao">${esc(_('Aparições relatadas'))}</option><option value="titulo">${esc(_('Títulos'))}</option><option value="santuario">${esc(_('Santuários'))}</option></select></div>
  ${resetBtn()}
</form>
<figure class="mapa mapa--cinema" data-mapa>
  <div class="mapa__atalhos" role="group" aria-label="${esc(_('Aproximar uma região do mapa'))}"><button type="button" data-ir-regiao="">${esc(_('Mundo'))}</button>${MACRO_REGIONS.map((r) => `<button type="button" data-ir-regiao="${esc(macroKey(r))}">${esc(_(r))}</button>`).join('')}</div>
  <div class="mapa__palco">
    <svg viewBox="0 0 ${MAPA.w} ${MAPA.h}" data-vb-inicial="0 0 ${MAPA.w} ${MAPA.h}" role="group" aria-label="${esc(_('Mapa-múndi. Países com registro são clicáveis; o seletor de país acima é equivalente'))}" focusable="false">
      <defs>
        <radialGradient id="mapa-oceano" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#1f2f66"/><stop offset=".6" stop-color="#131c42"/><stop offset="1" stop-color="#0a0f26"/></radialGradient>
        <linearGradient id="mapa-ouro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e3c27a"/><stop offset="1" stop-color="#9c6f24"/></linearGradient>
        <filter id="mapa-brilho" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path class="mapa__globo" d="${MAPA.contorno}"/>
      <path class="mapa__grade" d="${MAPA.grade}"/>
      <path class="mapa__terra" d="${MAPA.d}"/>
      <g class="mapa__paises">${paisesSvg}</g>
      <g class="mapa__pontos">${pontos}</g>
    </svg>
    <div class="mapa__ficha" data-mapa-ficha aria-hidden="true" hidden><span class="mapa__ficha-img"></span><span class="mapa__ficha-txt"><strong></strong><span></span></span></div>
    <button class="mapa__voltar" type="button" data-mapa-voltar hidden>${esc(_('Ver o mundo inteiro'))}</button>
  </div>
  <figcaption class="mapa__legenda">
    <ul class="mapa__chaves"><li><i class="chave chave--aparicao"></i> ${esc(_('Aparição relatada'))}</li><li><i class="chave chave--titulo"></i> ${esc(_('Título'))}</li><li><i class="chave chave--santuario"></i> ${esc(_('Santuário'))}</li><li><i class="chave chave--pais"></i> ${esc(_('País com registro'))}</li></ul>
    <span>${esc(_('Projeção Equal Earth. Terras e países: Natural Earth (domínio público). Pontos: coordenadas do Wikidata (CC0), precisão de um ponto no lugar. Clique num país para aproximar; clique de novo para voltar.'))}</span>
  </figcaption>
</figure>
${rostos}
<h2 id="resultados" tabindex="-1">${esc(_('Resultados'))} <span class="nota-peq" data-pais-rotulo></span></h2>
<p class="contagem" data-contagem role="status" aria-live="polite">${esc(_n('{n} resultado(s)', recs.length))}</p>
<ul class="catalogo" data-filter-list>${items}</ul>
${emptyState(_('Nenhum resultado. Tente outra grafia do nome ou limpe os filtros.'))}
${semLugar.length ? `<p class="nota-peq">${_h('Títulos sem lugar (doutrinais): {lista}.', { lista: semLugar.map((t) => `<a href="${urlOf[t.id]}">${esc(t.title)}</a>`).join('; ') })}</p>` : ''}
</div>`;
  return layout({ title: _('Maria pelo mundo'), path: 'maria-pelo-mundo/', section: 'maria-pelo-mundo/', body, description: _('Atlas de aparições, títulos e santuários marianos: escolha um país no mapa para ver o que há pesquisado ali.') });
}

// ---------- orações ----------
function pagePrayers() {
  const items = cat.prayers.map((p) => filterItem({ text: normalize(`${p.title} ${p.summary} ${p.text.join(' ')}`), grupo: p.marian ? 'mariana' : 'geral' },
    `<article><h2 class="item-t"><a href="${urlOf[p.id]}">${esc(p.title)}</a></h2><p>${esc(p.summary)}</p></article>`)).join('');
  const body = `<div class="miolo pagina">
${crumbs([[HOME(), ''], [_('Orações'), 'oracoes/']])}
<h1>${esc(_('Orações'))}</h1>
<p class="lede">${esc(_('Textos conferidos na fonte, com a procedência e a situação de direitos de cada um. Há um modo de leitura sem distrações em cada oração.'))}</p>
<p><a class="botao" href="${href('oracoes/rosario/')}">${esc(_('Guia do Rosário'))}</a></p>
<form class="filtros" data-filter-form role="search" aria-label="${esc(_('Filtrar orações'))}">
  ${searchBox()}
  <div><label for="grupo">${esc(_('Tipo'))}</label><select id="grupo" data-field="grupo"><option value="">${esc(_('Todas'))}</option><option value="mariana">${esc(_('Marianas'))}</option><option value="geral">${esc(_('Gerais'))}</option></select></div>
  ${resetBtn()}
</form>
${`<p class="contagem" data-contagem role="status" aria-live="polite">${esc(_n('{n} oração(ões)', cat.prayers.length))}</p>`}
<ul class="catalogo" data-filter-list>${items}</ul>
${emptyState(_('Nenhuma oração encontrada. Limpe os filtros.'))}
<p class="nota-acervo">${esc(_('Ainda não incluído: o Pai-Nosso (texto a conferir em fonte antes de publicar) e outras orações marianas tradicionais, como a Ladainha de Nossa Senhora.'))}</p>
</div>`;
  return layout({ title: _('Orações'), path: 'oracoes/', section: 'oracoes/', body, art: { id: 'img-virgem-em-oracao' }, description: _('Orações marianas com procedência e situação de direitos verificadas, e guia do Rosário.') });
}

function pagePrayer(p) {
  const body = `<article class="miolo pagina oracao">
${crumbs([[HOME(), ''], [_('Orações'), 'oracoes/'], [p.title, '']])}
<header><p class="sobretitulo">${esc(_('Oração'))}</p><h1>${esc(p.title)}</h1><p class="lede">${esc(p.summary)}</p>
<p class="oracao__acoes"><button type="button" class="botao botao--sec" data-leitura-toggle aria-pressed="false">${esc(_('Modo de leitura sem distrações'))}</button></p></header>
<div class="oracao__texto" lang="${L.lang}">${p.text.map((l) => `<p>${esc(l)}</p>`).join('')}</div>
<section class="oracao__proc"><h2>${esc(_('Procedência e direitos'))}</h2>
<dl class="ficha"><div><dt>${esc(_('Procedência'))}</dt><dd>${esc(p.provenance)}</dd></div><div><dt>${esc(_('Direitos'))}</dt><dd>${esc(p.rights)}</dd></div></dl>
${sourcesLine(p.sources)}${reviewLine(p.review)}</section>
${relatedBlock(p)}
</article>`;
  return layout({ title: p.title, path: `oracoes/${p.slug}/`, section: 'oracoes/', body, art: { id: p.banner, fina: true }, description: `${p.title}: ${p.summary}` });
}

function pageRosary() {
  const src = srcById[rosary.sourceId];
  const cycles = rosary.cycles.map((c) => `<section class="ciclo" aria-labelledby="c-${c.id}"><h3 id="c-${c.id}">${esc(c.name)}</h3><p class="meta">${esc(_('Tradicionalmente às {dias}.', { dias: c.days }))}</p><ol>${c.mysteries.map((m) => `<li>${esc(m.name)} <span class="refs">(${esc(bibleRef(m.ref))})</span></li>`).join('')}</ol></section>`).join('');
  const body = `<article class="miolo pagina oracao">
${crumbs([[HOME(), ''], [_('Orações'), 'oracoes/'], [_('Rosário'), '']])}
<header><p class="sobretitulo">${esc(_('Oração'))}</p><h1>${esc(_('Como rezar o Rosário'))}</h1><p class="lede">${esc(_('Uma oração simples que percorre, com Maria, os mistérios da vida de Jesus. Pode ser rezada devagar, em pouco ou muito tempo.'))}</p>
<p class="oracao__acoes"><button type="button" class="botao botao--sec" data-leitura-toggle aria-pressed="false">${esc(_('Modo de leitura sem distrações'))}</button></p></header>
<section><h2>${esc(_('Passo a passo'))}</h2><ol class="passos">${rosary.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
<p class="nota-peq">${esc(rosary.stepsNote)}</p></section>
<section><h2>${esc(_('Orações usadas'))}</h2><ul>${['ora-sinal-da-cruz', 'ora-ave-maria', 'ora-gloria', 'ora-salve-rainha'].map((id) => `<li><a href="${urlOf[id]}">${esc(pubById[id].title)}</a></li>`).join('')}<li>${esc(_('Pai-Nosso: texto ainda não incluído nesta edição (use o da sua comunidade).'))}</li></ul></section>
<section><h2>${esc(_('Os vinte mistérios'))}</h2><p>${esc(_('Segundo o sítio do Vaticano, distribuem-se assim: gozosos às segundas e sábados, luminosos às quintas, dolorosos às terças e sextas, gloriosos às quartas e domingos.'))}</p><div class="ciclos">${cycles}</div></section>
<aside class="aviso" role="note">${esc(_('O Rosário é meditação e confiança em Deus por intercessão de Maria, não um mecanismo que garanta resultados.'))}</aside>
<p class="bloco__fontes">${_h('Fonte: {fonte}.', { fonte: `<a href="${href('biblioteca/')}#fonte-${src.id}">${esc(src.title)}</a>` })}</p>
${reviewLine({ lastVerified: '2026-10-04', humanTheologicalReview: false })}
<p><a href="${urlOf['dev-rosario']}">${esc(_('Sobre a devoção do Rosário'))}</a></p>
</article>`;
  return layout({ title: _('Como rezar o Rosário'), path: 'oracoes/rosario/', section: 'oracoes/', body, art: { id: 'obra-rosario-misterios' }, description: _('Guia passo a passo do Santo Rosário com os vinte mistérios e as passagens bíblicas indicadas pelo Vaticano.') });
}

// ---------- cronologia ----------
function pageTimeline() {
  const ev = [];
  const add = (date, precision, label, id, kind) => ev.push({ date, precision, label, id, kind });
  add('0431', 'ano', _('Concílio de Éfeso proclama Maria "Mãe de Deus" (segundo o Catecismo)'), 'fe-maternidade-divina', _('Doutrina'));
  for (const a of cat.apparitions) {
    add(a.period.start, a.period.precision, _('Início do período das aparições: {titulo}', { titulo: a.title }), a.id, _('Relato de aparição'));
    for (const d of a.decisions) add(d.date, d.datePrecision, _('{autoridade}: {tipos} ({titulo})', { autoridade: d.authority, tipos: listAnd(d.kinds.map((k) => _(DECISION_KINDS[k]))), titulo: a.title }), a.id, _('Decisão eclesial'));
  }
  add('1854-12-08', 'dia', _('Pio IX define o dogma da Imaculada Conceição (Ineffabilis Deus)'), 'fe-imaculada-conceicao', _('Dogma'));
  add('1950-11-01', 'dia', _('Pio XII define o dogma da Assunção (Munificentissimus Deus)'), 'fe-assuncao', _('Dogma'));
  add('2024-05-17', 'dia', _('Dicastério para a Doutrina da Fé publica novas normas para o discernimento de fenômenos sobrenaturais (em vigor desde 19 de maio de 2024)'), 'fe-revelacoes-privadas', _('Norma'));
  ev.sort((x, y) => sortKey(x.date) - sortKey(y.date));
  const body = `<div class="miolo pagina leitura-longa">
${crumbs([[HOME(), ''], [_('Cronologia'), 'cronologia/']])}
<h1>${esc(_('Cronologia'))}</h1>
<p class="lede">${esc(_('Acontecimentos e decisões do acervo em ordem de data. A precisão de cada data é a da fonte: se só conhecemos o ano, mostramos só o ano.'))}</p>
<div class="cronologia-wrap" data-cron><div class="cronologia__fio" aria-hidden="true"></div><ol class="cronologia">${ev.map((e) => `<li><p class="cronologia__data"><time datetime="${e.date}">${esc(fmtDate(e.date, e.precision))}</time> <span class="cronologia__tipo">${esc(e.kind)}</span></p><p><a href="${urlOf[e.id]}">${esc(e.label)}</a></p></li>`).join('')}</ol></div>
</div>`;
  return layout({ title: _('Cronologia'), path: 'cronologia/', section: 'cronologia/', body, art: { id: 'obra-ram-visitacao' }, description: _('Linha do tempo de dogmas, aparições e decisões eclesiais do acervo, com a precisão das datas preservada.') });
}

// ---------- biblioteca ----------
const GLOSSARY = [
  ['Autoridade diocesana', 'Decisão do bispo da diocese onde o fato ocorreu. Não é o mesmo que uma decisão da Santa Sé.'],
  ['Dicastério para a Doutrina da Fé', 'Órgão da Cúria Romana que, entre outras tarefas, publica as normas para o discernimento de fenômenos sobrenaturais (2024).'],
  ['Nihil obstat', 'Um dos pronunciamentos previstos nas normas de 2024 (art. 18): reconhecem-se sinais da ação do Espírito Santo, sem garantir a sobrenaturalidade do fenômeno e sem tornar a fé neles obrigatória.'],
  ['"Digna de crédito"', 'Fórmula usada em decisões mais antigas (como a de Fátima, 1930). É um juízo do bispo sobre a credibilidade, preservado aqui como foi escrito, sem tradução para a terminologia de 2024.'],
  ['Autorização de culto', 'Permissão de culto ou peregrinação em um lugar. É distinta do reconhecimento de uma aparição.'],
  ['Revelação privada', 'Mensagem atribuída a uma pessoa depois do tempo dos apóstolos. Segundo o Catecismo (§ 67), não pertence ao depósito da fé.'],
  ['Cura inexplicada e milagre', 'Uma cura sem explicação médica atual não é automaticamente um milagre. O reconhecimento de milagre é uma decisão eclesiástica, posterior à investigação médica.'],
  ['Dogma', 'Verdade proposta pela Igreja de modo definitivo como revelada por Deus (por exemplo, a Imaculada Conceição e a Assunção).']
];
registerKeys(GLOSSARY.flat());

function pageLibrary() {
  const citedBy = {};
  const mark = (rec, id) => { if (!citedBy[id]) citedBy[id] = new Map(); citedBy[id].set(rec.id, rec); };
  for (const col of ['apparitions', 'miracles', 'devotions', 'titles', 'shrines', 'celebrations', 'prayers', 'articles']) {
    for (const r of cat[col]) {
      const ids = new Set([...(r.sources ?? []), ...(r.blocks ?? []).flatMap((b) => b.sources ?? []), ...(r.decisions ?? []).flatMap((d) => d.sources ?? [])]);
      ids.forEach((id) => mark(r, id));
    }
  }
  // o texto das afirmações que cada fonte sustenta segue em português, no idioma do original da pesquisa
  const supLang = L.code === DEFAULT_LOCALE ? '' : ' lang="pt"';
  const groups = Object.entries(SRC_TYPE).map(([type, label]) => {
    const list = cat.sources.filter((s) => s.type === type);
    const inner = list.length
      ? list.map((s) => `<article class="fonte" id="fonte-${s.id}"><h3>${esc(s.title)}</h3>
<dl class="ficha"><div><dt>${esc(_('Instituição'))}</dt><dd>${esc(_(s.institution))}</dd></div><div><dt>${esc(_('Endereço'))}</dt><dd><a href="${esc(s.url)}" rel="noopener">${esc(s.url)}</a></dd></div><div><dt>${esc(_('Data do documento'))}</dt><dd>${esc(s.documentDate ?? _('não informada na fonte'))}</dd></div><div><dt>${esc(_('Consultado em'))}</dt><dd>${esc(fmtDate(s.accessedDate, 'dia'))}</dd></div>${s.note ? `<div><dt>${esc(_('Observação'))}</dt><dd>${esc(s.note)}</dd></div>` : ''}<div><dt>${esc(_('Afirmações que sustenta'))}</dt><dd><ul>${s.supports.map((x) => `<li${supLang}>${esc(x)}</li>`).join('')}</ul></dd></div>${citedBy[s.id] ? `<div><dt>${esc(_('Usada em'))}</dt><dd><ul>${[...citedBy[s.id].values()].map((r) => `<li><a href="${urlOf[r.id]}">${esc(r.title)}</a></li>`).join('')}</ul></dd></div>` : ''}</dl></article>`).join('')
      : `<p class="vazio-sec">${esc(_('Nenhuma fonte desta categoria foi lida ainda. Estudos acadêmicos identificáveis são prioridade da próxima etapa de pesquisa.'))}</p>`;
    return `<section aria-labelledby="g-${type}"><h2 id="g-${type}">${esc(_(label))}</h2>${inner}</section>`;
  }).join('');
  const body = `<div class="miolo pagina">
${crumbs([[HOME(), ''], [_('Biblioteca'), 'biblioteca/']])}
<h1>${esc(_('Biblioteca'))}</h1>
<p class="lede">${esc(_('Todas as fontes usadas, organizadas por tipo. Para cada uma: instituição, endereço, data do documento, data de consulta e as afirmações exatas que ela sustenta no site.'))}</p>
${L.code === DEFAULT_LOCALE ? '' : `<p class="nota-peq">${esc(_('As afirmações que cada fonte sustenta estão no texto de referência, em português.'))}</p>`}
<section aria-labelledby="criterios"><h2 id="criterios">${esc(_('Critérios editoriais'))}</h2>
<ol>
<li>${esc(_('Prioridade: documentos da Santa Sé e do Dicastério; Catecismo, concílios e textos pontifícios; decretos e comunicações das dioceses; documentação de santuários oficiais; estudos históricos identificáveis.'))}</li>
<li>${esc(_('Toda alegação de reconhecimento indica a autoridade exata, a data e o documento. Uma decisão diocesana nunca é chamada de "reconhecida pelo Vaticano".'))}</li>
<li>${esc(_('Reconhecimento da aparição, autorização de culto, nihil obstat, reconhecimento de milagre e avaliação médica são tratados como coisas diferentes.'))}</li>
<li>${esc(_('Decisões antigas mantêm a terminologia da época; não são reclassificadas pelas normas de 2024.'))}</li>
<li>${esc(_('O que não foi lido é registrado como lacuna. A ausência de fonte encontrada não é prova de rejeição pela Igreja.'))}</li>
<li>${esc(_('Registros sem verificação ficam como rascunho, fora do catálogo, da busca e do sitemap.'))}</li>
</ol></section>
<section aria-labelledby="gloss"><h2 id="gloss">${esc(_('Termos eclesiais'))}</h2><p class="nota-peq">${esc(_('Definições editoriais simples; em caso de dúvida, vale o documento oficial.'))}</p><dl class="glossario">${GLOSSARY.map(([t, d]) => `<div><dt>${esc(_(t))}</dt><dd>${esc(_(d))}</dd></div>`).join('')}</dl></section>
${groups}
<section aria-labelledby="imagens"><h2 id="imagens">${esc(_('Imagens e créditos'))}</h2>
<p>${esc(_('As obras de museu vêm do acervo Open Access do The Metropolitan Museum of Art, com licença CC0 declarada pelo museu (lida em metmuseum.github.io; a API marca cada obra como domínio público). As demais imagens vêm do Wikimedia Commons, onde a página de cada arquivo declara domínio público. Em ambos os casos o projeto leu a declaração, mas não fez auditoria jurídica independente. As imagens de arte sacra ilustram o texto e não são evidência histórica dos acontecimentos. Os recortes usados como fundo derivam das mesmas obras e herdam o crédito delas.'))}</p>
<p>${esc(_('A textura de tela do fundo do site é um arquivo decorativo gerado proceduralmente pelo projeto (ruído sobre cor de umbra). Não reproduz nenhuma obra.'))}</p>
<div class="creditos">${cat.images.map((im) => `<article class="fonte" id="imagem-${im.id}"><div class="quadro" style="--ar:${MANIFEST[im.id].ratio};max-width:11rem">${img(im.id, { sizes: '11rem', alt: im.alt })}</div><div><h3>${esc(im.title)}</h3><dl class="ficha"><div><dt>${esc(_('Autoria'))}</dt><dd>${esc(_p(im.author))}</dd></div><div><dt>${esc(_('Data'))}</dt><dd>${esc(imgDate(im.dateText))}</dd></div>${im.medium ? `<div><dt>${esc(_('Técnica'))}</dt><dd>${esc(_(im.medium))}</dd></div>` : ''}<div><dt>${esc(_('Instituição'))}</dt><dd>${esc(_t(im.institution))}</dd></div>${im.accession ? `<div><dt>${esc(_('Número de acesso'))}</dt><dd>${esc(im.accession)}. ${esc(im.creditLine)}</dd></div>` : ''}<div><dt>${esc(_('Origem'))}</dt><dd>${esc(imgOrigin(im.origin))}. <a href="${esc(im.originUrl)}" rel="noopener">${esc(_('Página no acervo de origem'))}</a></dd></div><div><dt>${esc(_('Licença'))}</dt><dd>${esc(_(im.license))}${im.licenseUrl ? `. <a href="${esc(im.licenseUrl)}" rel="noopener">${esc(_('Texto da licença ou declaração'))}</a>` : ''}</dd></div><div><dt>${esc(_('Consultado em'))}</dt><dd>${esc(fmtDate(im.retrievedDate, 'dia'))}</dd></div><div><dt>${esc(_('Observação'))}</dt><dd>${esc(_(im.rightsNote))}</dd></div></dl></div></article>`).join('')}</div></section>
</div>`;
  return layout({ title: _('Biblioteca'), path: 'biblioteca/', section: 'biblioteca/', body, art: { id: 'obra-signorelli-assuncao', fina: true }, description: _('Fontes usadas pelo Sancta Mater Dei, organizadas por tipo, com critérios editoriais e explicação dos termos eclesiais.') });
}

// ---------- sobre ----------
function pageAbout() {
  const body = `<div class="miolo pagina leitura-longa">
${crumbs([[HOME(), ''], [_('Sobre'), 'sobre/']])}
<h1>${esc(_('Sobre o projeto e metodologia'))}</h1>
<p class="lede">${esc(_('{site} ({sub}) é um projeto pessoal de devoção a Nossa Senhora, público, gratuito e sem fins lucrativos.', { site: SITE, sub: _('Santa Mãe de Deus') }))}</p>
<section aria-labelledby="nao"><h2 id="nao">${esc(_('O que este site é e o que não é'))}</h2>
<p>${_h('É um esforço independente de reunir, com fontes, a história de Maria, o seu lugar na fé católica, as aparições, as devoções e os milagres atribuídos à sua intercessão. <strong>Não é um órgão oficial da Igreja Católica</strong>, não fala em nome de nenhuma diocese, santuário ou instituição e não tem vínculo institucional declarado. Também não tem anúncios, loja, assinaturas, comentários públicos, coleta de testemunhos médicos nem cadastro.')}</p></section>
<section aria-labelledby="dev"><h2 id="dev">${esc(_('Devoção a Maria e adoração a Deus'))}</h2>
<p>${_h('Seguimos o Catecismo: o culto à Virgem difere essencialmente da adoração, que se presta somente a Deus (§ 971). Maria não é "outra divindade"; os títulos de Maria nomeiam a mesma pessoa. <a href="{link}">Leia a explicação</a>.', { link: urlOf['fe-devocao-e-adoracao'] })}</p></section>
<section aria-labelledby="rev"><h2 id="rev">${esc(_('Revelações privadas'))}</h2>
<p>${_h('As aparições são tratadas como revelações privadas: ajudam a viver a fé, mas não pertencem ao depósito da fé (Catecismo § 67). <a href="{link}">Saiba mais e veja as normas vigentes</a>.', { link: urlOf['fe-revelacoes-privadas'] })}</p></section>
<section aria-labelledby="met"><h2 id="met">${esc(_('Metodologia'))}</h2>
<ul>
<li>${_h('Cada afirmação relevante é ligada a uma fonte da <a href="{link}">Biblioteca</a>, com a data de consulta.', { link: href('biblioteca/') })}</li>
<li>${esc(_('Cada bloco de texto indica sua natureza: Escritura, doutrina, contexto histórico, tradição devocional, revelação privada, relato ou nota editorial.'))}</li>
<li>${esc(_('Não são inventadas datas, falas de Maria, documentos, números ou decisões. O que não foi lido vira lacuna visível.'))}</li>
<li>${esc(_('Decisões eclesiais aparecem com autoridade, data, alcance e documento. Não há um selo único de "aprovado".'))}</li>
<li>${_h('O build do site valida o acervo e <strong>falha</strong> se um registro publicado como decisão eclesial ou milagre não tiver autoridade e fonte.')}</li>
<li>${esc(_('Rascunhos ficam fora do catálogo, da busca, da cronologia e do sitemap.'))}</li>
</ul>
<p class="nota-peq">${esc(_('As citações bíblicas em português vêm do sítio do Vaticano (páginas do Rosário). As demais passagens são citadas apenas pela referência e precisam de conferência na edição bíblica adotada.'))}</p></section>
<section aria-labelledby="lim"><h2 id="lim">${esc(_('Limites desta edição'))}</h2>
<ul>
<li>${_h('Foi feita pesquisa documental em fontes oficiais; <strong>não houve revisão teológica, canônica nem médica por especialistas</strong>.')}</li>
<li>${esc(_('O acervo é inicial: {aparicoes} aparições, {titulos} títulos, {oracoes} orações, {artigos} artigos e {fontes} fontes. Milagres e promessas aguardam verificação.', { aparicoes: cat.apparitions.length, titulos: cat.titles.length, oracoes: cat.prayers.length, artigos: cat.articles.length, fontes: cat.sources.length }))}</li>
<li>${esc(_('Sem imagens de obras de arte: a procedência e a licença ainda não foram verificadas. Os ornamentos são desenhos originais do projeto.'))}</li>
<li>${esc(_('O mapa interativo está adiado até haver coordenadas verificadas; a lista de locais e a cronologia são as alternativas.'))}</li>
${L.code === DEFAULT_LOCALE ? '' : `<li>${esc(_('As traduções para outros idiomas seguem o texto de referência em português e ainda não passaram por revisão de falantes nativos nem por revisão teológica.'))}</li>`}
</ul></section>
<section aria-labelledby="acess"><h2 id="acess">${esc(_('Acessibilidade'))}</h2>
<p>${_h('O site foi desenhado para celular, leitores idosos e pessoas com baixa visão: texto grande ajustável (A−, A, A+), alto contraste, navegação por teclado, foco visível, HTML semântico e respeito à preferência por menos movimento. A meta é conformidade com WCAG 2.2 AA; veja o relatório de verificação em <code>docs/VERIFICACAO.md</code> no repositório.')}</p></section>
<section aria-labelledby="correcoes"><h2 id="correcoes">${esc(_('Créditos e correções'))}</h2>
<p>${_h('Projeto pessoal, criado e mantido por uma pessoa. Não publicamos biografia, contatos nem vínculos institucionais. Correções são recebidas no repositório do projeto (abra um <em>issue</em>, quando o repositório for publicado) e seguem o processo descrito em <code>docs/POLITICA-EDITORIAL.md</code>: conferir a fonte, corrigir o registro, atualizar a data de verificação e registrar a mudança.')}</p></section>
</div>`;
  return layout({ title: _('Sobre e metodologia'), path: 'sobre/', section: 'sobre/', body, art: { id: 'obra-bellini-madona', fina: true }, description: _('Projeto independente, gratuito e sem fins lucrativos. Metodologia editorial, limites desta edição, acessibilidade e processo de correção.') });
}

// ---------- busca ----------
function pageSearch() {
  const all = [];
  const push = (r, type, label, extra = '') => all.push({ r, type, label, text: normalize(`${r.title} ${r.summary} ${extra}`) });
  const blocksText = (r) => (r.blocks ?? []).map((b) => b.text).join(' ');
  cat.apparitions.forEach((r) => push(r, 'aparicao', _(TYPE_LABEL.aparicao), blocksText(r)));
  cat.miracles.forEach((r) => push(r, 'milagre', _(TYPE_LABEL.milagre)));
  cat.devotions.forEach((r) => push(r, 'devocao', _(TYPE_LABEL.devocao), blocksText(r)));
  cat.titles.forEach((r) => push(r, 'titulo', _(TYPE_LABEL.titulo), `${nameVariants(r)} ${placeLine(r.place)} ${blocksText(r)}`));
  cat.shrines.forEach((r) => push(r, 'santuario', _(TYPE_LABEL.santuario), blocksText(r)));
  cat.celebrations.forEach((r) => push(r, 'celebracao', _(TYPE_LABEL.celebracao)));
  cat.prayers.forEach((r) => push(r, 'oracao', _(TYPE_LABEL.oracao), r.text.join(' ')));
  cat.articles.forEach((r) => push(r, 'artigo', _(CAT_LABEL[r.category]), blocksText(r)));
  const items = all.map(({ r, type, label, text }) => filterItem({ text, tipo: type }, `<article><p class="meta">${esc(label)}</p><h2 class="item-t"><a href="${urlOf[r.id]}">${esc(r.title)}</a></h2><p>${esc(r.summary)}</p></article>`)).join('');
  const kinds = { aparicao: 'Aparições', milagre: 'Milagres', devocao: 'Devoções', titulo: 'Títulos marianos', santuario: 'Santuários', celebracao: 'Celebrações', oracao: 'Orações', artigo: 'Artigos' };
  const body = `<div class="miolo pagina">
${crumbs([[HOME(), ''], [_('Busca'), 'busca/']])}
<h1>${esc(_('Busca'))}</h1>
<p class="lede">${esc(_('Procure em aparições, devoções, títulos, orações e artigos. A busca ignora acentos e maiúsculas; todas as palavras digitadas precisam aparecer. Rascunhos não entram na busca.'))}</p>
<form class="filtros" data-filter-form role="search" aria-label="${esc(_('Buscar no acervo'))}">
  ${searchBox()}
  <div><label for="tipo">${esc(_('Tipo de registro'))}</label><select id="tipo" data-field="tipo"><option value="">${esc(_('Todos'))}</option>${Object.entries(kinds).map(([k, v]) => `<option value="${k}">${esc(_(v))}</option>`).join('')}</select></div>
  ${resetBtn()}
</form>
<p class="contagem" data-contagem role="status" aria-live="polite">${esc(_n('{n} resultado(s)', all.length))}</p>
<ul class="catalogo" data-filter-list>${items}</ul>
${emptyState(_('Nenhum resultado. Tente menos palavras ou outro tipo de registro. O acervo é inicial e ainda não cobre todos os temas.'))}
</div>`;
  return layout({ title: _('Busca'), path: 'busca/', section: 'busca/', body, art: { id: 'obra-david-descanso', fina: true }, description: _('Busca no acervo do Sancta Mater Dei: aparições, devoções, títulos, orações e artigos.') });
}

// ---------- galeria ----------
const GALERIA_ORDEM = ['obra-bellini-madona', 'obra-memling-anunciacao', 'obra-ram-visitacao', 'obra-david-natividade', 'obra-flandes-cana', 'obra-david-crucificacao', 'obra-saraceni-dormicao', 'obra-reni-imaculada', 'obra-signorelli-assuncao', 'obra-durer-virgem', 'obra-david-virgem-paisagem', 'obra-raphael-entronizada', 'obra-david-descanso', 'obra-rosario-misterios', 'obra-bellini-dormindo', 'img-virgem-em-oracao'];
const galeriaPinturas = GALERIA_ORDEM.map((id) => imageById[id]);
const galeriaOutras = cat.images.filter((im) => im.kind === 'obra' && !GALERIA_ORDEM.includes(im.id));
const galeriaObras = [...galeriaPinturas, ...galeriaOutras];

function pageGallery() {
  const items = galeriaObras.map((im) => {
    const rel = (im.related ?? []).filter((id) => pubById[id]);
    return `<article class="obra" id="${im.id}" data-reveal="rise" aria-labelledby="${im.id}-t">
  <figure class="obra__arte">
    <a class="obra__abrir" href="${fileOf(im.id, MANIFEST[im.id].widths.at(-1))}" data-lightbox="${im.id}" aria-label="${esc(_('Ampliar a obra: {title}', { title: im.title }))}"><div class="quadro" style="--ar:${MANIFEST[im.id].ratio};${focusStyle(im.id)}">${img(im.id, { sizes: '(min-width: 62rem) 46rem, 94vw', alt: im.alt })}</div></a>
  </figure>
  <div class="obra__texto">
    <h2 id="${im.id}-t">${esc(im.title)}</h2>
    <p class="obra__meta">${esc(_('{autor}, {data}. {tecnica}. {instituicao}.', { autor: _p(im.author), data: imgDate(im.dateText), tecnica: _t(im.medium), instituicao: _t(im.institution) }))}</p>
    ${rel.length ? `<div class="obra__rel">${esc(_('Ligada a:'))}<ul>${rel.map((id) => `<li><a href="${urlOf[id]}">${esc(pubById[id].title)}</a></li>`).join('')}</ul></div>` : ''}
    <dl class="obra__cred">
      <div><dt>${esc(_('Licença: '))}</dt><dd>${esc(_(im.license)) + '.'}</dd></div>
      ${im.accession ? `<div><dt>${esc(_('Número de acesso: '))}</dt><dd>${esc(im.accession)}.</dd></div>` : ''}
      <div><dt>${esc(_('Origem: '))}</dt><dd><a href="${esc(im.originUrl)}" rel="noopener">${esc(imgOrigin(im.origin))}</a>.</dd></div>
    </dl>
  </div>
</article>`;
  }).join('');
  const body = `<div class="miolo pagina">
${crumbs([[HOME(), ''], [_('Galeria'), 'galeria/']])}
<h1>${words(_('Galeria de obras'))}</h1>
<p class="lede" data-h>${esc(_('Pinturas, esculturas e gravuras marianas dos séculos XV a XVII que acompanham o site, com autoria, acervo e licença à vista. Cada obra pode ser aberta em tamanho ampliado; o fechamento é por botão ou pela tecla Esc.'))}</p>
<p class="nota-peq">${_h('São obras de arte, não registros históricos: ilustram a leitura e não provam nem ilustram literalmente os acontecimentos relatados. Os créditos completos estão também na <a href="{link}">Biblioteca</a>.', { link: href('biblioteca/#imagens') })}</p>
<div class="obras">${items}</div>
</div>`;
  return layout({ title: _('Galeria de obras'), path: 'galeria/', section: 'galeria/', body, art: { id: 'obra-reni-imaculada' }, description: _('Galeria de pinturas marianas dos séculos XV a XVII, de acervos de museus com licença aberta, com autoria, instituição e crédito de cada obra.') });
}

// ---------- privacidade e 404 ----------
function pagePrivacy() {
  const body = `<div class="miolo pagina"><h1>${esc(_('Política de privacidade'))}</h1>
<p class="lede">${esc(_('O Sancta Mater Dei, no site e no aplicativo para Android, não coleta, não armazena e não compartilha dados pessoais.'))}</p>
<h2>${esc(_('O que não fazemos'))}</h2>
<p>${esc(_('Não há cadastro, login, anúncios, ferramentas de análise, rastreamento, cookies de terceiros nem formulários. O aplicativo não pede permissões do aparelho, como localização, câmera, contatos ou arquivos.'))}</p>
<h2>${esc(_('Preferências de leitura e idioma'))}</h2>
<p>${esc(_('O tamanho da fonte, a opção de ler sem animações e o idioma escolhido ficam guardados apenas no próprio aparelho, no armazenamento local do navegador ou do aplicativo. Esses dados nunca são enviados para nós. Para apagá-los, limpe os dados do site no navegador ou os dados do aplicativo nas configurações do Android.'))}</p>
<p>${esc(_('Para abrir o site no seu idioma, o navegador ou o aplicativo lê a lista de idiomas do próprio aparelho. Essa leitura acontece no aparelho: não usamos o seu endereço IP nem a sua localização para escolher o idioma.'))}</p>
<h2>${esc(_('Conteúdo e conexões'))}</h2>
<p>${esc(_('No aplicativo, todos os textos, imagens e fontes vêm dentro do pacote e funcionam sem internet. Ao tocar em um link externo, como a origem de uma obra no museu, a página abre no navegador do aparelho e passa a seguir a política daquele site. O site é hospedado na Cloudflare, que pode registrar dados técnicos de acesso, como endereço IP, para segurança e entrega das páginas, conforme a política dela.'))}</p>
<h2>${esc(_('Crianças'))}</h2>
<p>${esc(_('O conteúdo é adequado a todas as idades e nenhuma informação é coletada de ninguém, incluindo crianças.'))}</p>
<h2>${esc(_('Mudanças e contato'))}</h2>
<p>${_h('Se esta política mudar, a nova versão será publicada nesta página. Dúvidas e pedidos de correção seguem o caminho descrito em <a href="{link}">Sobre e metodologia</a>.', { link: href('sobre/#correcoes') })}</p>
<p class="refs">${esc(_('Última atualização: {data}.', { data: fmtDate('2026-10-06', 'dia') }))}</p></div>`;
  return layout({ title: _('Política de privacidade'), path: 'privacidade/', body, description: _('O Sancta Mater Dei não coleta dados pessoais. Política de privacidade do site e do aplicativo.') });
}

/** Página 404 única do site (a hospedagem serve esta para qualquer idioma): uma linha em cada idioma. */
const NOT_FOUND = {
  pt: ['Página não encontrada', 'O endereço não existe ou mudou.', 'Início', 'Busca'],
  en: ['Page not found', 'This address does not exist or has moved.', 'Home', 'Search'],
  es: ['Página no encontrada', 'La dirección no existe o ha cambiado.', 'Inicio', 'Buscar'],
  fr: ['Page introuvable', "Cette adresse n'existe pas ou a changé.", 'Accueil', 'Recherche'],
  it: ['Pagina non trovata', "L'indirizzo non esiste o è cambiato.", 'Home', 'Cerca'],
  de: ['Seite nicht gefunden', 'Diese Adresse existiert nicht oder wurde geändert.', 'Startseite', 'Suche'],
  ja: ['ページが見つかりません', 'このアドレスは存在しないか、移動しました。', 'ホーム', '検索'],
  zh: ['找不到页面', '该地址不存在或已更改。', '首页', '搜索']
};
function page404() {
  const body = `<div class="miolo pagina"><h1>${esc(NOT_FOUND.pt[0])}</h1>
${LOCALES.map((l) => { const [t, m, h, s] = NOT_FOUND[l.code]; return `<p lang="${l.lang}"${l.code === 'pt' ? ' class="lede"' : ''}><strong>${esc(t)}.</strong> ${esc(m)} <a href="${hrefIn(l.code, '')}">${esc(h)}</a> · <a href="${hrefIn(l.code, 'busca/')}">${esc(s)}</a></p>`; }).join('\n')}</div>`;
  return layout({ title: NOT_FOUND.pt[0], path: '404.html', body, description: NOT_FOUND.pt[0], alternates: false });
}

// ---------- geração ----------
const isDefault = L.code === DEFAULT_LOCALE;
if (isDefault) rmSync(OUT, { recursive: true, force: true });
else rmSync(join(OUT, PREFIX), { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
if (isDefault || !existsSync(join(OUT, 'assets'))) cpSync(join(ROOT, 'src', 'assets'), join(OUT, 'assets'), { recursive: true });

emit('', pageHome());
for (const [category, intro] of [
  ['vida', `<p class="lede">${esc(_('Uma leitura guiada em ordem narrativa, seguindo a Escritura. Em cada capítulo, o que a Bíblia diz fica separado da doutrina da Igreja, da tradição e das notas do projeto.'))}</p>`],
  ['fe', `<p class="lede">${esc(_('O que a Igreja Católica ensina sobre Maria, com os documentos de referência: o Catecismo e as definições dogmáticas. Também a diferença entre devoção e adoração e o lugar das revelações privadas.'))}</p>`],
  ['dossie', `<p class="lede">${esc(_('Pesquisa documental em 32 capítulos e 512 afirmações numeradas: vida de Maria, doutrina, oração, aparições, santuários, títulos e iconografia. Cada capítulo mantém suas fontes identificadas e distingue Escritura, doutrina, tradição e relato devocional.'))}</p>`]
]) {
  const { items, dir, html } = pageArticleIndex(category, intro);
  emit(`${dir}/`, html);
  for (const a of items) emit(`${dir}/${a.slug}/`, pageArticle(a, items, dir));
}
for (const category of ['milagres', 'promessas']) {
  for (const a of cat.articles.filter((x) => x.category === category)) emit(`${ART_DIR[category]}/${a.slug}/`, pageArticle(a, [a], ART_DIR[category]));
}
emit('aparicoes/', pageApparitions());
cat.apparitions.forEach((a) => emit(`aparicoes/${a.slug}/`, pageApparition(a)));
emit('milagres/', pageMiracles());
cat.miracles.forEach((m) => emit(`milagres/${m.slug}/`, pageMiracle(m)));
emit('milagres/curas-reconhecidas-de-lourdes/', pageLourdesCures());
emit('promessas/', pagePromises());
cat.devotions.forEach((d) => emit(`devocoes/${d.slug}/`, pageDevotion(d)));
emit('titulos/', pageTitles());
cat.titles.forEach((t) => emit(`titulos/${t.slug}/`, pageTitle(t)));
emit('santuarios/', pageShrines());
cat.shrines.forEach((sh) => emit(`santuarios/${sh.slug}/`, pageShrine(sh)));
emit('calendario/', pageCalendar());
emit('maria-pelo-mundo/', pageAtlas());
emit('oracoes/', pagePrayers());
cat.prayers.forEach((p) => emit(`oracoes/${p.slug}/`, pagePrayer(p)));
emit('oracoes/rosario/', pageRosary());
emit('cronologia/', pageTimeline());
emit('biblioteca/', pageLibrary());
emit('sobre/', pageAbout());
emit('busca/', pageSearch());
emit('galeria/', pageGallery());
emit('privacidade/', pagePrivacy());

// dados da visualização ampliada (um arquivo por idioma)
const obrasJson = JSON.stringify(galeriaObras.map((im) => ({ id: im.id, titulo: im.title, autor: _p(im.author), data: imgDate(im.dateText), tecnica: _t(im.medium), instituicao: _t(im.institution), acesso: im.accession ?? null, licenca: _(im.license), origem: imgOrigin(im.origin), url: im.originUrl, alt: im.alt, legenda: im.caption, srcset: srcsetOf(im.id), src: fileOf(im.id, MANIFEST[im.id].widths.at(-1)), w: MANIFEST[im.id].width, h: MANIFEST[im.id].height, galeria: href('galeria/') + '#' + im.id })));
mkdirSync(join(OUT, 'assets'), { recursive: true });
writeFileSync(join(OUT, 'assets', `obras.${L.code}.json`), obrasJson);
if (isDefault) {
  writeFileSync(join(OUT, 'assets', 'obras.json'), obrasJson);
  writeFileSync(join(OUT, '404.html'), page404());
}

finalizeSite({ OUT, BASE, SITE_URL, LOCALES, current: L.code, emitted });

if (APP && isDefault) {
  // remove variantes grandes que nenhum arquivo do app referencia (as imagens são as mesmas em todos os idiomas)
  const { readdirSync, statSync, unlinkSync } = await import('node:fs');
  const texts = [];
  const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (/\.(html|css|js|json)$/.test(f)) texts.push(readFileSync(p, 'utf8')); } };
  walk(OUT);
  const all = texts.join('\n');
  const dir = join(OUT, 'assets', 'img', 'obras');
  let removed = 0;
  for (const f of readdirSync(dir)) {
    const m = f.match(/-(\d+)\.webp$/);
    if (m && Number(m[1]) > APP_MAX_W && !all.includes(f)) { unlinkSync(join(dir, f)); removed++; }
  }
  console.log(`App: ${removed} imagens grandes removidas de ${OUT}.`);
}
if (!process.env.SITE_URL && !APP && isDefault) console.warn('Aviso: SITE_URL não definido; sitemap e canonical usam http://localhost:4173. Defina SITE_URL para produção.');
finishI18n();
console.log(`OK [${L.code}]: ${emitted.length} páginas em ${OUT.slice(ROOT.length + 1)}/${PREFIX} (aparições ${cat.apparitions.length}, milagres ${cat.miracles.length}, devoções ${cat.devotions.length}, títulos ${cat.titles.length}, orações ${cat.prayers.length}, artigos ${cat.articles.length}; rascunhos excluídos: ${Object.values(drafts).reduce((a, b) => a + b, 0)})`);
