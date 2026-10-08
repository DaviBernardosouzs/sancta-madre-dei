// Área de estudo: páginas de aprofundamento (mariologia, dogmas, concílios, Padres, santos, ordens, sacramentais,
// relíquias, Escrituras, orações em latim e Biblioteca Mariana). Os dados ficam em scripts/lib/estudo/*.mjs;
// este módulo oferece os componentes comuns e reúne as páginas.
import { mariologia } from './estudo/mariologia.mjs';
import { dogmas } from './estudo/dogmas.mjs';
import { concilios } from './estudo/concilios.mjs';
import { padres } from './estudo/padres.mjs';
import { escrituras } from './estudo/escrituras.mjs';
import { santos } from './estudo/santos.mjs';
import { ordens } from './estudo/ordens.mjs';
import { sacramentais } from './estudo/sacramentais.mjs';
import { reliquias } from './estudo/reliquias.mjs';
import { latim } from './estudo/latim.mjs';
import { biblioteca } from './estudo/biblioteca.mjs';

const TIPOS = {
  escritura: 'Escritura', ensino: 'Ensino da Igreja', tradicao: 'Tradição devocional', arte: 'Convenção da arte',
  historia: 'Documentação histórica', eclesial: 'Reconhecimento eclesial', dogma: 'Dogma definido', doutrina: 'Doutrina do Magistério',
  opiniao: 'Opinião teológica', liturgia: 'Liturgia'
};

export function paginasEstudo(ctx) {
  const { _, _h, esc, href, layout, crumbs, HOME, bibleRef, img, figure, urlOf, srcById, MANIFEST, imageById, focusStyle, creditText, originLink } = ctx;
  const T = (s, v) => esc(_(s, v));

  const c = {
    ...ctx, T,
    paras: (arr) => arr.map((p) => `<p>${T(p)}</p>`).join(''),
    tags: (lista) => `<ul class="bases">${lista.map(([tipo, txt]) => `<li class="base base--${tipo}"><span class="base__t">${T(TIPOS[tipo])}</span>${txt ? ` <span class="base__x">${esc(tipo === 'escritura' ? bibleRef(txt) : _(txt))}</span>` : ''}</li>`).join('')}</ul>`,
    cuidado: (txt) => `<p class="cuidado"><strong>${T('Cuidado')}:</strong> ${T(txt)}</p>`,
    refs: (s) => esc(bibleRef(s)),
    /** Lista de fontes: ids do registro do projeto ou {titulo, url}. */
    fontes: (lista) => `<ul class="fontes-lista">${lista.map((f) => {
      const s = typeof f === 'string' ? srcById[f] : f;
      if (!s) return '';
      return `<li><a href="${esc(s.url)}" rel="noopener">${esc(s.title ?? s.titulo)}</a></li>`;
    }).join('')}</ul>`,
    linha: (itens) => `<div class="lt" data-lt><span class="lt__fio" aria-hidden="true"></span><ol class="linha-tempo">${itens.map(({ ano, titulo, texto, tipo }) => `<li${tipo ? ` class="lt--${tipo}"` : ''}><span class="lt__ano">${esc(ano)}</span><div class="lt__corpo"><h3 class="lt__t">${T(titulo)}</h3>${texto ? `<p>${T(texto)}</p>` : ''}</div></li>`).join('')}</ol></div>`,
    /** Link para página já existente do acervo, se publicada. */
    ver: (id, rotulo) => (urlOf[id] ? `<a href="${urlOf[id]}">${T(rotulo)}</a>` : T(rotulo)),
    /** Figura com crédito e descrição, a partir do acervo de imagens. */
    fig: (id, legenda, cls = '') => `<figure class="fig-estudo ${cls}"><div class="quadro" style="--ar:${MANIFEST[id].ratio};${focusStyle(id)}">${img(id, { sizes: '(min-width: 62rem) 22rem, (min-width: 40rem) 40vw, 90vw' })}</div><figcaption class="legenda">${legenda ? T(legenda) : esc(imageById[id].caption)}<span class="legenda__credito">${esc(imageById[id].caption)} ${esc(creditText(imageById[id]))} ${originLink(imageById[id])}</span></figcaption></figure>`,
    /** Texto em dois idiomas, lado a lado. `trecho` = [[latim, português], ...] (um par por verso ou frase). */
    paralelo: (trecho, { cls = '', lang = 'la', rotulo = 'Latim' } = {}) => `<div class="paralelo ${cls}" data-paralelo><div class="paralelo__barra" role="group" aria-label="${T('Modo de leitura')}" hidden><button type="button" data-modo="paralelo" aria-pressed="true">${T('Lado a lado')}</button><button type="button" data-modo="la" aria-pressed="false">${T(rotulo)}</button><button type="button" data-modo="pt" aria-pressed="false">${T('Português')}</button></div>${trecho.map(([la, pt]) => `<div class="paralelo__par"><p class="paralelo__la" lang="${lang}">${esc(la)}</p><p class="paralelo__pt">${T(pt)}</p></div>`).join('')}</div>`,
    pagina({ path, titulo, lede, nota, corpo, art = null, descricao, trilha = [], section = 'aprofundar/', js = [], css = [] }) {
      const migalhas = path === 'aprofundar/' ? [[HOME(), ''], [_('Aprofundar'), path]] : [[HOME(), ''], [_('Aprofundar'), 'aprofundar/'], ...trilha.map(([l, p]) => [_(l), p]), [_(titulo), path]];
      const body = `<div class="miolo pagina estudo">
${crumbs(migalhas)}
<header>
<h1>${T(titulo)}</h1>
${lede ? `<p class="lede">${T(lede)}</p>` : ''}
</header>
${nota ? `<p class="nota-peq">${T(nota)}</p>` : ''}
${corpo}
<p class="nota-peq nota-rev">${T('Texto de pesquisa, ainda sem revisão teológica humana. Confira as datas e as citações nos documentos de origem, listados em cada página.')}</p>
</div>`;
      return { path, html: layout({ title: _(titulo), path, section, body, art, css: ['estudo.css', ...css], js: ['estudo.js', ...js], description: _(descricao) }) };
    }
  };

  const areas = [
    ...mariologia(c), ...dogmas(c), ...concilios(c), ...padres(c), ...escrituras(c), ...santos(c),
    ...ordens(c), ...sacramentais(c), ...reliquias(c), ...latim(c), ...biblioteca(c)
  ];

  // índice: três movimentos, cada caminho com a obra que o acompanha
  const cartoes = [
    ['mariologia/', 'Mariologia', 'O estudo ordenado do que a fé diz sobre Maria: níveis de ensino, os grandes temas e o vocabulário.', 'I', 'obra-bellini-madona'],
    ['dogmas/', 'Os quatro dogmas', 'Mãe de Deus, Virgindade perpétua, Imaculada Conceição e Assunção: contexto, texto definido e controvérsias.', 'II', 'obra-reni-imaculada'],
    ['concilios/', 'Concílios e Éfeso', 'O que cada concílio disse de Maria, e uma viagem visual por Éfeso e pelo título Theotokos.', 'III', 'obra-raphael-entronizada'],
    ['padres/', 'Padres da Igreja', 'De Inácio a João Damasceno: como o pensamento sobre Maria se formou.', 'IV', 'durer-glorificacao'],
    ['escrituras/', 'Maria nas Escrituras', 'As passagens do Antigo e do Novo Testamento, com leitura patrística e referências cruzadas.', 'V', 'obra-memling-anunciacao'],
    ['iconografia/', 'Iconografia mariana', 'Estrelas, lua, serpente, coroa, rosas, manto azul: o que cada símbolo diz e de onde vem.', 'VI', 'durer-madona-crescente'],
    ['sagrada-familia/', 'Peregrinação da Sagrada Família', 'Mapa e relato das viagens de Maria, José e Jesus nos Evangelhos.', 'VII', 'durer-fuga-egito'],
    ['santos/', 'Maria e os santos', 'Montfort, Kolbe, João Paulo II, Afonso de Ligório, Bernardo, Teresinha e João Bosco.', 'VIII', 'obra-signorelli-assuncao'],
    ['ordens/', 'Ordens religiosas e Maria', 'Carmelitas, franciscanos, dominicanos, servitas, salesianos, marianistas e outros.', 'IX', 'obra-rosario-misterios'],
    ['sacramentais/', 'Escapulários, medalhas e sacramentais', 'Origem histórica, aprovação e significado, sem tratar promessas populares como doutrina.', 'X', 'img-virgem-em-oracao'],
    ['reliquias/', 'Relíquias e tradições marianas', 'Loreto, Chartres, Prato, Éfeso e outras: o que é tradição, o que está documentado e o que a Igreja reconhece.', 'XI', 'foto-loreto'],
    ['latim/', 'Orações e documentos em latim', 'Textos marianos em latim com tradução em paralelo, e as definições dogmáticas.', 'XII', 'durer-anunciacao'],
    ['biblioteca-mariana/', 'Biblioteca Mariana', 'Documentos dos papas, dos concílios, dos Padres e dos santos, com ligação para os textos.', 'XIII', 'obra-ram-visitacao']
  ];
  const movimentos = [
    ['A doutrina', 'O que a Igreja ensina sobre Maria, e de onde vem.', cartoes.slice(0, 5)],
    ['Imagem e caminho', 'Como a fé em Maria virou arte, viagem e vida.', cartoes.slice(5, 9)],
    ['Devoção e documentos', 'Os objetos, os lugares e os textos, com o que se sabe de cada um.', cartoes.slice(9)]
  ];
  const linhaSum = ([p, t, r, n, obra]) => `<li class="sm"><a href="${href(p)}"><span class="sm__n" aria-hidden="true">${n}</span><span class="sm__txt"><span class="sm__t">${T(t)}</span><span class="sm__r">${T(r)}</span></span><span class="sm__obra" style="${focusStyle(obra)}" aria-hidden="true">${img(obra, { sizes: '(min-width: 48rem) 9rem, 5.5rem', alt: '' })}</span><span class="sm__seta" aria-hidden="true"></span></a></li>`;
  const creditos = cartoes.map((c) => imageById[c[4]]).filter(Boolean).map((im) => `${esc(im.caption)} ${esc(creditText(im))}`).join(' ');
  const indice = c.pagina({
    path: 'aprofundar/', titulo: 'Aprofundar', section: 'aprofundar/',
    lede: 'Treze caminhos de estudo sobre Maria. Em todos, o que é Escritura, doutrina, história, tradição e devoção aparece separado e com a fonte indicada.',
    descricao: 'Mariologia, dogmas, concílios, Padres da Igreja, Escrituras, iconografia, santos, ordens, sacramentais, relíquias, orações em latim e a Biblioteca Mariana.',
    trilha: [],
    corpo: `${movimentos.map(([t, r, itens], k) => `<section class="mov" aria-labelledby="mov-${k}" data-mov><header class="mov__cab"><span class="mov__fio" aria-hidden="true"></span><h2 id="mov-${k}">${T(t)}</h2><p>${T(r)}</p></header><ol class="sumario">${itens.map(linhaSum).join('')}</ol></section>`).join('')}
<details class="mov__creditos"><summary>${T('Obras nesta página')}</summary><p>${creditos}</p></details>`
  });
  return [indice, ...areas];
}
