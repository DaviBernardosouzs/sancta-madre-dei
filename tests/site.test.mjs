import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, loadContent } from '../scripts/lib/content.mjs';

execFileSync('node', ['scripts/build.mjs'], { cwd: ROOT, stdio: 'pipe' });
const read = (p) => readFileSync(join(ROOT, 'dist', p), 'utf8');
const data = loadContent();
const drafts = ['apparitions', 'miracles', 'devotions', 'titles', 'prayers', 'articles'].flatMap((c) => data[c].filter((r) => r.status !== 'published'));
const published = ['apparitions', 'devotions', 'titles', 'prayers'].flatMap((c) => data[c].filter((r) => r.status === 'published'));

test('páginas essenciais existem', () => {
  for (const p of ['index.html', 'vida-de-maria/index.html', 'fe-catolica/index.html', 'dossie/index.html', 'aparicoes/index.html', 'milagres/index.html', 'promessas/index.html', 'titulos/index.html', 'oracoes/index.html', 'oracoes/rosario/index.html', 'biblioteca/index.html', 'sobre/index.html', 'busca/index.html', 'cronologia/index.html', 'sitemap.xml', 'robots.txt', '404.html']) {
    assert.ok(existsSync(join(ROOT, 'dist', p)), p);
  }
});
test('dossiê preserva os 32 capítulos e as 512 afirmações numeradas', () => {
  const chapters = data.articles.filter((article) => article.category === 'dossie');
  assert.equal(chapters.length, 32);
  assert.equal(chapters.reduce((total, chapter) => total + chapter.blocks[0].text.split(/\n\n/).length, 0), 512);
  for (const chapter of chapters) assert.ok(existsSync(join(ROOT, 'dist', 'dossie', chapter.slug, 'index.html')), chapter.slug);
});
test('todo registro publicado tem página e consta no sitemap', () => {
  const sitemap = read('sitemap.xml');
  for (const a of data.apparitions) assert.ok(sitemap.includes(`/aparicoes/${a.slug}/`));
  for (const t of data.titles) assert.ok(sitemap.includes(`/titulos/${t.slug}/`));
  for (const p of data.prayers) assert.ok(sitemap.includes(`/oracoes/${p.slug}/`));
  assert.ok(published.length > 0);
});
test('rascunhos não aparecem em sitemap, catálogos nem busca', () => {
  const surfaces = [read('sitemap.xml'), read('aparicoes/index.html'), read('milagres/index.html'), read('promessas/index.html'), read('busca/index.html'), read('cronologia/index.html')].join('\n');
  for (const d of drafts) {
    assert.ok(!surfaces.includes(d.id), d.id);
    assert.ok(!surfaces.includes(`/${d.slug}/`), d.slug);
  }
  assert.ok(!existsSync(join(ROOT, 'dist', 'milagres', 'catherine-latapie')));
  assert.ok(!existsSync(join(ROOT, 'dist', 'devocoes', 'promessas-do-rosario')));
});
test('milagres sem registros publicados mostram estado vazio honesto', () => {
  const html = read('milagres/index.html');
  assert.ok(html.includes('Ainda não há fichas individuais publicadas'));
  assert.ok(html.includes('Nada aqui orienta a interromper tratamento médico'));
});
test('a página de cada aparição mostra autoridade, data, alcance e documento da decisão', () => {
  for (const a of data.apparitions) {
    const html = read(`aparicoes/${a.slug}/index.html`);
    for (const d of a.decisions) {
      assert.ok(html.includes(d.authority.replace(/&/g, '&amp;')), 'autoridade');
      assert.ok(html.includes(d.document), 'documento');
      assert.ok(html.includes('Alcance e limites'));
    }
    assert.ok(html.includes('Bispo diocesano'));
    assert.ok(!/reconhecid[oa]s? pelo vaticano/i.test(html));
  }
});
test('imagens exibem autoria e licença junto à figura', () => {
  const html = read('aparicoes/lourdes/index.html');
  assert.ok(html.includes('Autoria:') && html.includes('Licença:'));
});
test('busca estática lista os registros públicos e tem estado vazio', () => {
  const html = read('busca/index.html');
  assert.ok(html.includes('data-vazio'));
  assert.ok((html.match(/data-item/g) ?? []).length >= published.length);
});

test('galeria lista todas as obras com crédito, e obras.json corresponde à galeria', () => {
  const html = read('galeria/index.html');
  const obras = JSON.parse(read('assets/obras.json'));
  assert.ok(obras.length >= 10);
  for (const o of obras) {
    assert.ok(html.includes(`id="${o.id}"`), `galeria sem ${o.id}`);
    assert.ok(o.licenca && o.url && o.acesso !== undefined && o.alt && o.srcset);
  }
  assert.equal((html.match(/class="obra"/g) ?? []).length, obras.length);
});

test('toda página com abertura mostra crédito (autoria e licença) e link "Ver a obra inteira"', () => {
  for (const p of ['vida-de-maria/anunciacao/', 'fe-catolica/imaculada-conceicao/', 'aparicoes/', 'aparicoes/lourdes/', 'oracoes/rosario/', 'cronologia/', 'galeria/', 'titulos/']) {
    const html = read(`${p}index.html`);
    assert.ok(/Autoria: [^<]+\. Acervo:/.test(html) || /Autoria: /.test(html), `${p}: sem autoria`);
    assert.ok(html.includes('Licença: '), `${p}: sem licença`);
    assert.ok(html.includes('data-lightbox'), `${p}: sem acesso à obra ampliada`);
  }
});

test('imagens do capítulo têm dimensões declaradas, srcset e carregamento adequado', () => {
  const html = read('vida-de-maria/anunciacao/index.html');
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]).filter((t) => !t.includes('data-lb-img'));
  assert.ok(imgs.length >= 3);
  for (const t of imgs) assert.ok(/width="\d+"/.test(t) && /height="\d+"/.test(t) && /srcset="/.test(t), t.slice(0, 80));
  assert.ok(imgs.some((t) => t.includes('fetchpriority="high"')), 'imagem principal sem prioridade');
  assert.ok(imgs.some((t) => t.includes('loading="lazy"')), 'imagens abaixo da dobra sem carregamento adiado');
});

test('conteúdo não depende de JavaScript: nenhum texto fica escondido no HTML servido', () => {
  const html = read('index.html');
  assert.ok(!/<[^>]+style="[^"]*(opacity:\s*0|visibility:\s*hidden)/.test(html), 'estilo inline esconde conteúdo');
  const css = ['style.css', 'cinematic.css', 'filme.css'].map((f) => readFileSync(join(ROOT, 'dist', 'assets', f), 'utf8'))
    .join('\n').replace(/@keyframes[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  // todo estado inicial de animação exige .anim, que só o JavaScript adiciona
  const regras = css.match(/[^{}]*\{[^{}]*opacity:\s*0(?![.\d])[^{}]*\}/g) ?? [];
  for (const r of regras) {
    if (/^\s*@/.test(r)) continue;
    const seletor = r.split('{')[0];
    if (/\.anim:not\(\.anim-off\)|\.item\[hidden\]|\[data-vazio\]/.test(seletor) || /hidden/.test(seletor)) continue;
    assert.fail(`regra esconde conteúdo sem depender de .anim: ${seletor.trim()}`);
  }
});

test('GSAP e ScrollTrigger vêm do próprio site, sem CDN', () => {
  const html = read('index.html');
  assert.ok(html.includes('assets/vendor/gsap.min.js') && html.includes('assets/vendor/ScrollTrigger.min.js'));
  assert.ok(!/https?:\/\/[^"']*(cdn|unpkg|jsdelivr|googleapis)/i.test(html));
  assert.ok(existsSync(join(ROOT, 'dist', 'assets', 'vendor', 'GSAP-LICENSE.txt')));
});

test('atlas: cada país com registro tem caminho clicável e itens com data-pais correspondente; sem rascunhos', async () => {
  const { readFileSync } = await import('node:fs');
  const html = readFileSync(new URL('../dist/maria-pelo-mundo/index.html', import.meta.url), 'utf8');
  const clicaveis = [...html.matchAll(/class="pais pais--com" data-pais="([a-z]{2})"/g)].map((m) => m[1]);
  const itens = new Set([...html.matchAll(/data-item[^>]*data-pais="([a-z]{2})"/g)].map((m) => m[1]));
  assert.ok(clicaveis.length >= 5);
  for (const iso of clicaveis) assert.ok(itens.has(iso), `país ${iso} clicável sem itens`);
  for (const iso of itens) assert.ok(clicaveis.includes(iso), `itens de ${iso} sem país no mapa`);
  assert.ok(/<option value="cn">/.test(html));
});
