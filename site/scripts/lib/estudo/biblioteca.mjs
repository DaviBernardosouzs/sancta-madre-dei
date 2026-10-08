// Biblioteca Mariana: documentos dos papas, dos concílios, dos Padres e dos santos, com ligação para os textos.
const V = 'https://www.vatican.va/content/';
const DOCS = [
  // concílios
  { cat: 'concilio', titulo: 'Lumen Gentium, capítulo VIII: «A bem-aventurada Virgem Maria, Mãe de Deus, no mistério de Cristo e da Igreja»', autor: 'Concílio Vaticano II', data: '21 de novembro de 1964', fonte: 'lumen-gentium-pt', tema: 'O texto central da mariologia atual: Maria no plano da salvação, na Igreja, o culto a Maria e Maria sinal de esperança.', onde: 'nn. 52-69' },
  { cat: 'concilio', titulo: 'Sacrosanctum Concilium, capítulo V, n. 103: Maria no ano litúrgico', autor: 'Concílio Vaticano II', data: '4 de dezembro de 1963', url: 'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19631204_sacrosanctum-concilium_po.html', tema: 'Como a liturgia honra Maria: «com amor especial a Mãe de Deus» e em ligação com a obra da salvação.', onde: 'n. 103' },
  { cat: 'concilio', titulo: 'Atos e cartas do Concílio de Éfeso (tradução inglesa)', autor: 'Concílio de Éfeso', data: '431', url: 'https://www.newadvent.org/fathers/3810.htm', tema: 'Os atos e as cartas de Cirilo, Nestório e Celestino.', onde: 'cartas e definição' },
  // papas
  { cat: 'papa', titulo: 'Ineffabilis Deus', autor: 'Pio IX', data: '8 de dezembro de 1854', fonte: 'ineffabilis-deus', tema: 'Definição do dogma da Imaculada Conceição.', onde: 'bula inteira' },
  { cat: 'papa', titulo: 'Munificentissimus Deus', autor: 'Pio XII', data: '1º de novembro de 1950', fonte: 'munificentissimus-deus-pt', tema: 'Definição do dogma da Assunção.', onde: 'nn. 44-45' },
  { cat: 'papa', titulo: 'Ad caeli reginam', autor: 'Pio XII', data: '11 de outubro de 1954', url: V + 'pius-xii/pt/encyclicals/documents/hf_p-xii_enc_11101954_ad-caeli-reginam.html', tema: 'Realeza de Maria e instituição da sua festa.', onde: 'encíclica inteira' },
  { cat: 'papa', titulo: 'Marialis Cultus', autor: 'Paulo VI', data: '2 de fevereiro de 1974', fonte: 'dossie-s10', tema: 'Orientações para o culto à Virgem Maria: bíblico, litúrgico, ecumênico e antropológico.', onde: 'exortação inteira' },
  { cat: 'papa', titulo: 'Redemptoris Mater', autor: 'João Paulo II', data: '25 de março de 1987', url: V + 'john-paul-ii/pt/encyclicals/documents/hf_jp-ii_enc_25031987_redemptoris-mater.html', tema: 'Maria na vida da Igreja peregrina; escrita para o Ano Mariano de 1987-88.', onde: 'três partes' },
  { cat: 'papa', titulo: 'Mulieris Dignitatem', autor: 'João Paulo II', data: '15 de agosto de 1988', url: V + 'john-paul-ii/pt/apost_letters/1988/documents/hf_jp-ii_apl_19880815_mulieris-dignitatem.html', tema: 'Dignidade e vocação da mulher, a partir de Maria.', onde: 'especialmente n. 3-5' },
  { cat: 'papa', titulo: 'Rosarium Virginis Mariae', autor: 'João Paulo II', data: '16 de outubro de 2002', fonte: 'dossie-s09', tema: 'O Rosário como oração contemplativa; instituição dos mistérios luminosos.', onde: 'carta inteira' },
  { cat: 'papa', titulo: 'Deus caritas est, n. 41-42: Maria', autor: 'Bento XVI', data: '25 de dezembro de 2005', url: V + 'benedict-xvi/pt/encyclicals/documents/hf_ben-xvi_enc_20051225_deus-caritas-est.html', tema: 'Maria como mulher que ama e modelo de caridade.', onde: 'nn. 41-42' },
  { cat: 'papa', titulo: 'Spe salvi, n. 49-50: Maria, estrela da esperança', autor: 'Bento XVI', data: '30 de novembro de 2007', url: V + 'benedict-xvi/pt/encyclicals/documents/hf_ben-xvi_enc_20071130_spe-salvi.html', tema: 'Maria como «estrela do mar» e figura da esperança.', onde: 'nn. 49-50' },
  { cat: 'papa', titulo: 'Evangelii Gaudium, nn. 284-288: Maria, mãe da evangelização', autor: 'Francisco', data: '24 de novembro de 2013', url: V + 'francesco/pt/apost_exhortations/documents/papa-francesco_esortazione-ap_20131124_evangelii-gaudium.html', tema: 'Maria como mãe da Igreja que evangeliza.', onde: 'nn. 284-288' },
  { cat: 'papa', titulo: 'Octobri mense', autor: 'Leão XIII', data: '22 de setembro de 1891', url: V + 'leo-xiii/la/encyclicals/documents/hf_l-xiii_enc_22091891_octobri-mense.html', tema: 'Uma das encíclicas de Leão XIII sobre o Rosário (em latim).', onde: 'encíclica inteira' },
  // dicastério e catecismo
  { cat: 'dicasterio', titulo: 'Mater Populi fidelis', autor: 'Dicastério para a Doutrina da Fé', data: '4 de novembro de 2025', fonte: 'dossie-s51', tema: 'Nota doutrinal sobre os títulos marianos ligados à cooperação de Maria na salvação.', onde: 'nota inteira' },
  { cat: 'dicasterio', titulo: 'Normas para o discernimento de presumidos fenômenos sobrenaturais', autor: 'Dicastério para a Doutrina da Fé', data: '17 de maio de 2024', fonte: 'ddf-normas-2024', tema: 'Os procedimentos da Igreja diante de aparições e fenômenos; em vigor desde maio de 2024.', onde: 'normas inteiras' },
  { cat: 'catecismo', titulo: 'Catecismo da Igreja Católica, nn. 484-511: Maria e Cristo', autor: 'Santa Sé', data: '1992', fonte: 'ccc-pt-422-682', tema: 'A Virgem Maria na fé: a maternidade divina, a virgindade e a Imaculada Conceição.', onde: 'nn. 484-511' },
  { cat: 'catecismo', titulo: 'Catecismo da Igreja Católica, nn. 963-975: Maria e a Igreja', autor: 'Santa Sé', data: '1992', fonte: 'ccc-pt-683-1065', tema: 'Maria, Mãe da Igreja, a Assunção, a mediação e o culto mariano.', onde: 'nn. 963-975' },
  // Padres
  { cat: 'padres', titulo: 'Contra as heresias, livro III, cap. 22 (tradução inglesa)', autor: 'Irineu de Lião', data: 'c. 180', url: 'https://www.newadvent.org/fathers/0103322.htm', tema: 'Maria como nova Eva: o nó de Eva desatado pela obediência de Maria.', onde: 'III,22,4' },
  { cat: 'padres', titulo: 'Sobre a natureza e a graça (tradução inglesa)', autor: 'Agostinho de Hipona', data: '415', url: 'https://www.newadvent.org/fathers/1503.htm', tema: 'A frase sobre Maria «excetuada» ao falar do pecado.', onde: 'n. 42' },
  { cat: 'padres', titulo: 'Contra Helvídio; Homilias sobre a Dormição; Cartas de Cirilo', autor: 'Jerônimo; João Damasceno; Cirilo de Alexandria', data: 'sécs. IV-VIII', url: null, tema: 'Textos clássicos sobre a virgindade perpétua, a Dormição e a maternidade divina.', onde: 'obras citadas na página dos Padres' },
  // santos e teólogos
  { cat: 'santos', titulo: 'Tratado da verdadeira devoção à Santíssima Virgem', autor: 'Luís Maria Grignion de Montfort', data: 'c. 1712 (publ. 1843)', url: null, tema: 'A consagração total a Jesus por Maria.', onde: 'obra inteira' },
  { cat: 'santos', titulo: 'As Glórias de Maria', autor: 'Afonso de Ligório', data: '1750', url: null, tema: 'Comentário da Salve Rainha e das festas de Maria.', onde: 'obra inteira' },
  { cat: 'santos', titulo: 'Homilias em louvor da Virgem Mãe (Super missus est)', autor: 'Bernardo de Claraval', data: 'c. 1120', url: null, tema: 'Meditação da Anunciação; a imagem da Estrela do mar.', onde: 'Homilia II' },
  // históricos
  { cat: 'historico', titulo: 'Protoevangelho de Tiago (tradução inglesa)', autor: 'Autor desconhecido', data: 'século II', fonte: 'proto-tiago', tema: 'Apócrifo que narra o nascimento e a infância de Maria, com os nomes de Joaquim e Ana. Não é Escritura.', onde: 'obra inteira' },
  { cat: 'historico', titulo: 'Evangelho do Pseudo-Mateus (tradução inglesa)', autor: 'Autor desconhecido', data: 'séculos VI-VII', fonte: 'pseudo-mateus', tema: 'Apócrifo medieval sobre a infância de Maria e a fuga para o Egito. Não é Escritura.', onde: 'obra inteira' },
  { cat: 'historico', titulo: 'Sub tuum praesidium (Papiro Rylands 470)', autor: 'Autor desconhecido', data: 'séculos III-IV', url: 'https://en.wikipedia.org/wiki/Sub_tuum_praesidium', tema: 'A mais antiga oração mariana conhecida.', onde: 'fragmento do papiro' },
  { cat: 'historico', titulo: 'Ladainha de Loreto', autor: 'Tradição do santuário de Loreto', data: 'documentada no século XVI', fonte: 'dossie-s11', tema: 'Os títulos e as invocações marianas da Ladainha.', onde: 'ladainha inteira' }
];

const CATS = [['concilio', 'Concílios'], ['papa', 'Papas'], ['dicasterio', 'Dicastério'], ['catecismo', 'Catecismo'], ['padres', 'Padres da Igreja'], ['santos', 'Santos e teólogos'], ['historico', 'Documentos históricos']];

export function biblioteca(c) {
  const { T, pagina, href, esc, srcById } = c;
  const linkDe = (d) => (d.fonte ? srcById[d.fonte]?.url : d.url);
  const itens = DOCS.map((d) => {
    const url = linkDe(d);
    return `<article class="doc" data-grupo="${d.cat}"><p class="doc__meta">${T(d.autor)} · ${T(d.data)}</p><h3 class="doc__t">${url ? `<a href="${esc(url)}" rel="noopener">${T(d.titulo)}</a>` : T(d.titulo)}</h3><p>${T(d.tema)}</p><p class="doc__onde"><span class="doc__rot">${T('Onde ler')}:</span> ${T(d.onde)}${url ? '' : ` · <em>${T('sem ligação gratuita verificada; procure uma edição confiável')}</em>`}</p></article>`;
  }).join('');
  return [pagina({
    path: 'biblioteca-mariana/', titulo: 'Biblioteca Mariana',
    lede: 'Os documentos que sustentam o que se diz de Maria: concílios, papas, Padres, santos e textos históricos. Cada título leva ao texto, quando há uma edição de acesso livre conferida.',
    descricao: 'Lumen Gentium cap. VIII, Redemptoris Mater, Marialis Cultus, Rosarium Virginis Mariae, Mater Populi fidelis, Padres da Igreja e documentos históricos sobre Maria, com ligação para os textos.',
    nota: 'Esta biblioteca reúne referências e não copia os documentos. As ligações levam ao texto original, no sítio do Vaticano ou em edições de domínio público. Documentos recentes têm direitos reservados e só aparecem como ligação.',
    corpo: `<section data-filtro aria-labelledby="bib-t"><h2 id="bib-t">${T('Documentos')}</h2>
<div class="filtros-chip" role="group" aria-label="${T('Filtrar por tipo')}" hidden><button type="button" data-f="" aria-pressed="true">${T('Todos')}</button>${CATS.map(([k, n]) => `<button type="button" data-f="${k}" aria-pressed="false">${T(n)}</button>`).join('')}</div>
<p class="contagem" role="status" aria-live="polite"><span data-contagem>${DOCS.length} / ${DOCS.length}</span></p>
<div class="docs">${itens}</div></section>
<section aria-labelledby="bm-t"><h2 id="bm-t">${T('Por onde começar')}</h2><ul class="lista-ctrv">
<li>${T('Para entender o conjunto: Lumen Gentium, capítulo VIII, e o Catecismo, nn. 484-511 e 963-975.')}</li>
<li>${T('Para a oração: Marialis Cultus e Rosarium Virginis Mariae.')}</li>
<li>${T('Para os títulos: Mater Populi fidelis (2025), a nota mais recente.')}</li></ul>
<p class="nota-peq">${T('A fonte de cada afirmação do site está listada em cada página e na Biblioteca de fontes e créditos.')} <a href="${href('biblioteca/')}">${T('Biblioteca de fontes e créditos')}</a> · <a href="${href('mariologia/')}">${T('Mariologia')}</a> · <a href="${href('latim/')}">${T('Textos em latim')}</a></p></section>`
  })];
}
