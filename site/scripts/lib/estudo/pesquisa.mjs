// Pesquisa documentada: 64 capítulos (1.024 frases) a partir de documentos oficiais da Santa Sé e de reportagens do Vatican News.
// O texto fica em content/pesquisa-documentada.txt e é sempre exibido em português; só a interface muda de idioma.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CAMINHOS } from '../caminhos.mjs';
import { L } from '../i18n.mjs';

const GRUPOS = [
  { id: 'vida', de: 1, ate: 16, nome: 'Vida de Maria e fundamentos bíblicos', resumo: 'A Trindade, as Escrituras de Israel, Nazaré, a Dormição e a oração da Igreja nascente.' },
  { id: 'lugares', de: 17, ate: 37, nome: 'Títulos e santuários', resumo: 'De Roma a La Vang: cada devoção com seu lugar, sua origem e o que a fonte afirma.' },
  { id: 'aparicoes', de: 38, ate: 44, nome: 'Aparições e alcance das decisões', resumo: 'Kibeho, Pontmain, La Salette, Knock, Banneux, Beauraing e Pellevoisin.' },
  { id: 'curas', de: 45, ate: 48, nome: 'Curas de Lourdes e Siracusa', resumo: 'Três curas reconhecidas e a leitura das lágrimas de Siracusa.' },
  { id: 'discernimento', de: 49, ate: 53, nome: 'Discernimentos recentes', resumo: 'Medjugorje, Montichiari, Chandavila, o Scoglio e Litmanová, entre 2024 e 2025.' },
  { id: 'vida-crista', de: 54, ate: 64, nome: 'Vida cristã, oração, arte e calendário', resumo: 'Aglona, a Medalha, o Carmelo, o Akathistos, o Rosário, Fátima, Montfort, o calendário, os títulos e os critérios.' }
];

const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

function carregar() {
  const linhas = readFileSync(join(CAMINHOS.conteudo, 'pesquisa-documentada.txt'), 'utf8').split('\n');
  const caps = [];
  let cur = null;
  for (let i = 0; i < linhas.length; i++) {
    const l = linhas[i];
    if (!l.trim()) continue;
    const h = l.match(/^(\d{2})\. (.+)$/);
    if (h && linhas[i + 1]?.startsWith('Fonte oficial ')) {
      const f = linhas[i + 1].match(/^Fonte oficial (F\d+): (.+)$/);
      cur = { n: Number(h[1]), titulo: h[2], fonteId: f[1], fonte: f[2], frases: [] };
      cur.slug = `${h[1]}-${slug(h[2])}`;
      caps.push(cur);
      i++;
    } else {
      const m = l.match(/^(\d+)\. (.+)$/);
      if (m && cur) cur.frases.push(m[2]);
    }
  }
  return caps;
}

const em = (arr, tam) => { const out = []; for (let i = 0; i < arr.length; i += tam) out.push(arr.slice(i, i + tam)); return out; };

export function pesquisa(c) {
  const { T, pagina, href, esc } = c;
  const pt = L.code === 'pt';
  const caps = carregar();
  const total = caps.reduce((a, x) => a + x.frases.length, 0);
  const grupoDe = (n) => GRUPOS.find((g) => n >= g.de && n <= g.ate);
  const crua = (x) => (pt ? esc(x) : `<span lang="pt-BR">${esc(x)}</span>`);
  const aviso = pt ? '' : `<p class="cuidado"><strong>${T('Cuidado')}:</strong> ${T('Os textos desta seção ainda estão só em português.')}</p>`;
  const notaCuras = (n) => (n >= 45 && n <= 47 ? `<p class="cuidado"><strong>${T('Cuidado')}:</strong> ${T('Este resumo se apoia em notícias oficiais que identificam decisões episcopais. Os decretos diocesanos completos ainda não foram anexados; até lá, esta é uma página de pesquisa documentada, não uma ficha definitiva.')}</p>` : '');

  const paginas = [];
  paginas.push(pagina({
    path: 'pesquisa/', titulo: 'Pesquisa documentada', cru: false,
    lede: 'Sessenta e quatro capítulos que ampliam o site: a vida de Maria, os santuários, as aparições e as decisões da Igreja. Cada capítulo mostra a fonte oficial em que se apoia.',
    descricao: 'Pesquisa documentada sobre Maria com base em documentos da Santa Sé e em reportagens do Vatican News: vida de Maria, santuários, aparições, curas de Lourdes e critérios de discernimento.',
    nota: 'Os textos são sínteses autorais, não transcrições dos documentos. Meditações pastorais aparecem como meditações, não como episódios da biografia de Maria.',
    corpo: `${aviso}
<section aria-labelledby="pq-fontes"><h2 id="pq-fontes">${T('Como ler as fontes')}</h2>
<p>${T('Foram usados documentos publicados em vatican.va, comunicados em press.vatican.va e reportagens do Vatican News, o portal oficial do Dicastério para a Comunicação. Isso identifica a procedência das fontes; não significa que este texto tenha aprovação eclesiástica nem que toda notícia seja um ato do Magistério.')}</p>
<p>${T('Cada capítulo separa ensinamento doutrinal, interpretação bíblica, tradição devocional, relato histórico e decisão da Igreja. Uma visita do papa, um santuário reconhecido ou uma reportagem oficial não autenticam uma aparição. Um nihil obstat também não declara, por si, a origem sobrenatural de um fenômeno.')}</p>
${tagsAviso(c)}
</section>
${GRUPOS.map((g, k) => `<section class="mov" aria-labelledby="pq-g${k}" data-mov><header class="mov__cab"><span class="mov__fio" aria-hidden="true"></span><h2 id="pq-g${k}">${T(g.nome)}</h2><p>${T(g.resumo)}</p></header><ol class="sumario sumario--simples">${caps.filter((x) => grupoDe(x.n) === g).map((x) => `<li class="sm"><a href="${href(`pesquisa/${x.slug}/`)}"><span class="sm__n" aria-hidden="true">${x.n}</span><span class="sm__txt"><span class="sm__t">${crua(x.titulo)}</span><span class="sm__r">${crua(x.fonte)}</span></span></a></li>`).join('')}</ol></section>`).join('\n')}
<p class="nota-peq">${T('Esta seleção não pretende catalogar todas as invocações nem todos os milagres atribuídos a Maria. Cada capítulo tem o alcance da fonte indicada; a ausência de um lugar aqui não é juízo negativo sobre a sua devoção.')} <strong>${total}</strong> ${T('frases em 64 capítulos.')}</p>`
  }));

  caps.forEach((x, i) => {
    const g = grupoDe(x.n);
    const ant = caps[i - 1], prox = caps[i + 1];
    const paras = em(x.frases, 4).map((p) => `<p>${crua(p.join(' '))}</p>`).join('');
    paginas.push(pagina({
      path: `pesquisa/${x.slug}/`, titulo: x.titulo, cru: true, trilha: [['Pesquisa documentada', 'pesquisa/']],
      descricao: `${x.titulo}. ${x.frases[0]} Fonte: ${x.fonte}.`,
      corpo: `${aviso}
<p class="doc__meta">${T(g.nome)} · ${x.n} / ${caps.length}</p>
<p class="pq-fonte"><strong>${T('Fonte oficial')}:</strong> ${crua(x.fonte)} <span class="pq-fonte__id" lang="und">(${x.fonteId})</span></p>
${notaCuras(x.n)}
<div class="pq-texto">${paras}</div>
<nav class="dogma-nav" aria-label="${T('Outros capítulos')}"><ul>${ant ? `<li><a href="${href(`pesquisa/${ant.slug}/`)}" rel="prev"><span aria-hidden="true">←</span> ${crua(ant.titulo)}</a></li>` : ''}${prox ? `<li><a href="${href(`pesquisa/${prox.slug}/`)}" rel="next">${crua(prox.titulo)} <span aria-hidden="true">→</span></a></li>` : ''}<li><a href="${href('pesquisa/')}">${T('Todos os capítulos')}</a></li></ul></nav>`
    }));
  });
  return paginas;
}

function tagsAviso(c) {
  const { T } = c;
  return `<p class="cuidado"><strong>${T('Cuidado')}:</strong> ${T('Sobre as curas de Lourdes: a contagem de 71 passou a 72 com o anúncio de abril de 2025 (Antonietta Raco). Sempre que o número aparecer, a data da atualização deve acompanhá-lo.')}</p>`;
}
