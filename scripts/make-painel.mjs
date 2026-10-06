#!/usr/bin/env node
// Gera docs/painel-de-referencias.html: painel local de curadoria (obras, procedência, paleta).
// Abra o arquivo no navegador. Não faz parte do site publicado.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './lib/content.mjs';
import { esc } from './lib/format.mjs';

const { images } = JSON.parse(readFileSync(join(ROOT, 'content', 'images.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(ROOT, 'src', 'assets', 'img', 'obras', 'manifest.json'), 'utf8'));

const PALETA = [
  ['Marfim', '#f8f1e1', 'Luz das carnações e do véu; papel do site'],
  ['Ultramar', '#1d3a8c', 'Manto de Maria na Madona de Bellini, nas zonas iluminadas'],
  ['Noite', '#111a3d', 'Mesmo manto, nas sombras (amostra #161424 a #1A1A32, levemente azulada para contraste)'],
  ['Madder', '#8f3524', 'Cortina vermelha de Bellini (amostra #952A0C) e vestes de Memling (#883528), suavizada'],
  ['Umbra', '#231a17', 'Sombras quentes de Memling (#582B22) e Gerard David (#14120D), usada como cor do texto'],
  ['Ouro envelhecido', '#b8893a', 'Dourados de Bellini (#B89764) e Reni (#B8935D); só em filetes'],
  ['Ouro para texto', '#7a5712', 'Versão escurecida do ouro, para contraste de 5,8:1 sobre marfim'],
  ['Céu', '#8fa7b3', 'Céus de Gerard David (#789EAC) e Bellini (#7A8291)'],
  ['Verde de paisagem', '#55613f', 'Paisagem de Gerard David (#545136)']
];

const cards = images.map((im) => `<article>
  <img src="../src/assets/img/obras/${im.id}-${manifest[im.id].widths[0]}.webp" alt="${esc(im.alt)}" width="${Math.round(240 * manifest[im.id].ratio >= 240 ? 240 : 240 * manifest[im.id].ratio)}">
  <div><h3>${esc(im.title)}</h3>
  <p>${esc(im.author)}, ${esc(im.dateText)}. ${esc(im.medium ?? '')}.</p>
  <p><strong>Instituição:</strong> ${esc(im.institution)}${im.accession ? `. <strong>Acesso:</strong> ${esc(im.accession)}` : ''}</p>
  <p><strong>Licença:</strong> ${esc(im.license)}</p>
  <p><a href="${esc(im.originUrl)}">${esc(im.originUrl)}</a></p>
  <p class="n">Foco desktop ${im.focus.desktop.join('% / ')}%, celular ${im.focus.mobile.join('% / ')}%. Uso: ${esc(im.usedFor ?? '')}</p></div>
</article>`).join('\n');

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Painel de referências visuais | Sancta Mater Dei</title>
<style>
body{font:16px/1.55 system-ui,sans-serif;margin:0;padding:2rem;background:#f8f1e1;color:#231a17;max-width:76rem;margin-inline:auto}
h1,h2,h3{font-family:Georgia,serif;color:#1d3a8c} h1{margin-top:0}
.pal{display:grid;grid-template-columns:repeat(auto-fill,minmax(14rem,1fr));gap:.75rem;margin:1rem 0 2rem}
.pal div{border:1px solid #d9ccaa;background:#fffaf0} .pal i{display:block;height:3.5rem} .pal p{margin:.4rem .6rem;font-size:.85rem}
article{display:grid;grid-template-columns:15rem 1fr;gap:1.2rem;border-top:1px solid #d9ccaa;padding:1.2rem 0}
article img{max-width:15rem;height:auto;border:1px solid #b8893a} article p{margin:.25rem 0;font-size:.9rem} .n{color:#5a4a41}
a{color:#1d3a8c;overflow-wrap:anywhere} .aviso{border-left:3px solid #b8893a;background:#efe4cb;padding:.7rem 1rem}
@media(max-width:40rem){article{grid-template-columns:1fr}}
</style></head><body>
<h1>Painel de referências visuais</h1>
<p>Curadoria local da direção de arte: obras escolhidas, procedência e licença, e a paleta extraída delas. Gerado por <code>scripts/make-painel.mjs</code> a partir de <code>content/images.json</code>. Consulta feita em 4 de outubro de 2026.</p>
<div class="aviso"><strong>Referências pessoais não publicadas.</strong> A pasta <code>public/</code> contém três cartões devocionais (<code>madre.jpg</code>, <code>mae.jpg</code>, <code>Dong Lug.jpg</code>) sem procedência nem licença informadas. Serviram só como referência de gosto (azul, vermelho terroso, dourado, luz suave) e <strong>não</strong> são copiados para o site nem usados no código.</div>
<h2>Paleta</h2>
<div class="pal">${PALETA.map(([n, h, o]) => `<div><i style="background:${h}"></i><p><strong>${n}</strong> ${h}<br>${esc(o)}</p></div>`).join('')}</div>
<p>Tipografia: Cormorant Garamond (títulos) e Atkinson Hyperlegible (texto e interface), ambas SIL OFL 1.1, auto-hospedadas.</p>
<h2>Obras (${images.length})</h2>
${cards}
</body></html>`;
writeFileSync(join(ROOT, 'docs', 'painel-de-referencias.html'), html);
console.log('docs/painel-de-referencias.html gerado');
