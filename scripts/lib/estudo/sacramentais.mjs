// Escapulários, medalhas e sacramentais: origem histórica, aprovação, significado e limites.
const ITENS = [
  {
    id: 'escapulario-carmo', nome: 'Escapulário de Nossa Senhora do Carmo', sub: 'O escapulário marrom',
    origem: 'O escapulário é originalmente uma peça do hábito dos carmelitas: uma faixa de pano que cobre ombros e costas. Os carmelitas o associaram a Maria e o estenderam a leigos, que o usam em dois pequenos quadrados de pano ligados por cordões.',
    tradicao: 'Segundo a tradição da ordem, Nossa Senhora teria aparecido a São Simão Stock, prior-geral dos carmelitas, em 16 de julho de 1251, em Aylesford, na Inglaterra, e lhe entregado o escapulário. Os documentos que registram essa visão aparecem mais de um século depois, e os historiadores a consideram incerta.',
    historia: 'A associação de leigos ao hábito carmelita é documentada desde o século XIV. A festa de Nossa Senhora do Carmo é celebrada em 16 de julho.',
    aprovacao: 'A Igreja aprova o uso do escapulário como sacramental. Em 1910, Pio X permitiu que uma medalha com a imagem do Sagrado Coração e de Nossa Senhora do Carmo o substituísse.',
    sentido: 'Sinal de pertença a Maria e de consagração à vida cristã sob a sua proteção. O Catecismo ensina que os sacramentais não dão a graça como os sacramentos, mas dispõem a recebê-la (n. 1670).',
    cuidado: 'A «promessa do escapulário», segundo a qual quem morrer com ele não sofrerá o fogo eterno, tem fonte devocional. A Igreja a entende como confiança na proteção de Maria para quem vive a fé, e não como garantia automática de salvação. O chamado «privilégio sabatino» (libertação do purgatório no sábado seguinte à morte) se apoia numa bula atribuída a João XXII em 1322 que os historiadores consideram não autêntica; em 1613, um decreto do Santo Ofício permitiu pregar essa devoção com ressalvas.',
    fontes: [{ titulo: 'Escapulário de Nossa Senhora do Carmo (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Scapular_of_Our_Lady_of_Mount_Carmel' }, { titulo: 'São Simão Stock (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Simon_Stock' }]
  },
  {
    id: 'medalha-milagrosa', nome: 'Medalha Milagrosa', sub: 'A medalha de Nossa Senhora das Graças',
    origem: 'A medalha nasceu em Paris. Catarina Labouré, noviça das Filhas da Caridade, relatou ter visto Nossa Senhora na capela da rua du Bac, em julho e novembro de 1830. Na aparição de 27 de novembro, disse ter visto Maria sobre o globo, com raios saindo das mãos, e ouvido o pedido de que se cunhasse uma medalha.',
    tradicao: 'As aparições são conhecidas pelo relato da própria Catarina, que o contou ao seu confessor e pediu discrição por toda a vida. As expressões «raios de graças» e outros detalhes vêm desse relato.',
    historia: 'A medalha foi cunhada a partir de 1832, com a autorização do arcebispo de Paris, Dom de Quélen, depois de um inquérito. O nome «Milagrosa» vem das numerosas graças atribuídas a ela durante a epidemia de cólera em Paris, em 1832. A inscrição diz: «Ó Maria concebida sem pecado, rogai por nós que recorremos a vós».',
    aprovacao: 'Catarina Labouré foi canonizada por Pio XII em 1947. A festa de Nossa Senhora das Graças, em 27 de novembro, foi concedida pelo papa Leão XIII em 1894 à Congregação da Missão e às Filhas da Caridade; hoje consta como memória facultativa em alguns calendários.',
    sentido: 'A inscrição expressa a Imaculada Conceição, definida em 1854, vinte e quatro anos depois da aparição relatada. O M e a cruz da frente, com doze estrelas, formam um resumo do mistério de Maria junto a Cristo.',
    cuidado: 'A medalha é um sacramental e não tem poder em si; a Igreja aprova seu uso como sinal de confiança em Maria. Convém desconfiar de apresentações que a tratam como amuleto ou prometem efeitos garantidos.',
    ver: ['dev-medalha-milagrosa', 'sh-rue-du-bac'],
    fontes: ['filhas-caridade-medalha', { titulo: 'Medalha Milagrosa (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Miraculous_Medal' }, { titulo: 'Santa Catarina Labouré (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Catherine_Labour%C3%A9' }]
  },
  {
    id: 'escapulario-azul', nome: 'Escapulário Azul da Imaculada', sub: 'O escapulário azul celeste',
    origem: 'Nasceu da devoção de Úrsula Benincasa (1547-1618), mística napolitana, fundadora das Teatinas Oblatas e Eremitas da Imaculada Conceição. Associou-se à devoção à Imaculada Conceição, e a Teatinos e Teatinas o difundiram.',
    tradicao: 'A tradição conta que Úrsula teria recebido revelações sobre o hábito azul; essas revelações são relatos devocionais, sem reconhecimento oficial.',
    historia: 'Foi aprovado pelo papa Clemente X em 1671 para a Ordem dos Teatinos, que o difundiram.',
    aprovacao: 'A Igreja aprova o escapulário como sacramental, como o do Carmo. Os de uso devocional são vários (azul, das Dores, vermelho da Paixão), cada um com a sua origem.',
    sentido: 'Sinal de devoção à Imaculada Conceição e de confiança em Maria.',
    cuidado: 'As indulgências ligadas a escapulários são regidas pelas normas da Igreja, que mudaram ao longo do tempo (em especial depois de 1967); consulte um sacerdote e os textos da Penitenciaria Apostólica, e não os folhetos populares.',
    fontes: [{ titulo: 'Escapulário Azul (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Blue_Scapular' }]
  },
  {
    id: 'rosario', nome: 'Terço e Rosário bento', sub: 'O Rosário como sacramental',
    origem: 'O terço é a terça parte do Rosário, com cinco dezenas de Ave-Marias. A prática foi se formando entre os séculos XII e XV, a partir da repetição de orações com contas, e foi aprovada e promovida por muitos papas.',
    tradicao: 'A história de que Maria entregou o Rosário a São Domingos é tradição devocional; os historiadores a consideram sem base documental. As quinze promessas atribuídas ao Rosário (de Alan de la Roche) também são de origem devocional.',
    historia: 'Os mistérios foram fixados no século XV e XVI. João Paulo II acrescentou os mistérios luminosos em 2002 (Rosarium Virginis Mariae).',
    aprovacao: 'Os papas recomendaram o Rosário repetidamente. A bênção de um terço o torna um sacramental, mas o essencial é a oração, e não o objeto.',
    sentido: 'Meditar a vida de Cristo com Maria. Paulo VI (Marialis Cultus) e João Paulo II o descrevem como «compêndio do Evangelho».',
    cuidado: 'As «promessas» atribuídas ao Rosário não fazem parte da doutrina da Igreja. O Rosário não é um mecanismo que garanta resultados; é oração.',
    ver: ['dev-rosario'],
    fontes: ['dossie-s09', 'dossie-s10', 'vaticano-misterios-rosario']
  }
];

export function sacramentais(c) {
  const { T, tags, fontes, pagina, href, ver, esc } = c;
  const cartoes = ITENS.map((i) => `<article class="cartao" id="${i.id}" aria-labelledby="${i.id}-t">
  <h2 id="${i.id}-t" class="cartao__nome">${T(i.nome)}</h2><p class="cartao__sub">${T(i.sub)}</p>
  ${tags([['historia', 'Origem documentada'], ['tradicao', 'Tradição devocional'], ['eclesial', 'Aprovação']])}
  <dl class="niveis">
    <div class="nivel nivel--historia"><dt>${T('Origem histórica')}</dt><dd>${T(i.origem)} ${T(i.historia)}</dd></div>
    <div class="nivel nivel--tradicao"><dt>${T('Tradição')}</dt><dd>${T(i.tradicao)}</dd></div>
    <div class="nivel nivel--eclesial"><dt>${T('Aprovação da Igreja')}</dt><dd>${T(i.aprovacao)}</dd></div>
    <div class="nivel nivel--sentido"><dt>${T('Significado')}</dt><dd>${T(i.sentido)}</dd></div>
  </dl>
  ${c.cuidado(i.cuidado)}
  ${i.ver ? `<p>${i.ver.map((v) => ver(v, v.startsWith('sh-') ? 'Santuário' : 'Devoção no acervo')).join(' · ')}</p>` : ''}
  ${fontes(i.fontes)}
</article>`).join('');
  return [pagina({
    path: 'sacramentais/', titulo: 'Escapulários, medalhas e sacramentais',
    lede: 'Objetos de devoção bentos pela Igreja, como o escapulário, a medalha e o terço: de onde vêm, o que a Igreja aprova, o que significam e o que não se deve esperar deles.',
    descricao: 'Escapulário do Carmo, Medalha Milagrosa, escapulário azul e terço: origem histórica, aprovação da Igreja, significado e os limites das promessas populares.',
    nota: 'Sacramentais não são sacramentos. O Concílio Vaticano II e o Catecismo os descrevem como sinais sagrados que preparam para receber a graça. A página não trata como doutrina oficial promessas populares sem fonte.',
    corpo: `<section aria-labelledby="que-t"><h2 id="que-t">${T('O que é um sacramental')}</h2>
<p>${T('Segundo o Concílio Vaticano II (Sacrosanctum Concilium 60) e o Catecismo (nn. 1667-1670), os sacramentais são sinais sagrados instituídos pela Igreja, que imitam os sacramentos e obtêm efeitos, sobretudo espirituais, pela intercessão da própria Igreja. Não dão a graça por si: dispõem a pessoa a recebê-la e a cooperar com ela.')}</p>
<p>${T('Por isso, um escapulário ou uma medalha não substitui os sacramentos, a oração nem uma vida cristã. Eles são lembrança e sinal de uma confiança.')}</p></section>
<nav class="indice-temas" aria-label="${T('Objetos')}"><ul>${ITENS.map((i) => `<li><a href="#${i.id}">${T(i.nome)}</a></li>`).join('')}</ul></nav>
<div class="cartoes">${cartoes}</div>
<section aria-labelledby="reg-t"><h2 id="reg-t">${T('Como ler uma promessa popular')}</h2><ul class="lista-ctrv">
<li>${T('Procure a fonte: quem a atribui, onde está escrita e quando surgiu. Muitas promessas aparecem séculos depois do suposto fato.')}</li>
<li>${T('Distinga o que a Igreja aprova (o uso do objeto, a oração) do que ela não afirma (que um objeto garanta cura, riqueza ou salvação).')}</li>
<li>${T('Em caso de dúvida, pergunte a um sacerdote e consulte o Catecismo.')}</li></ul>
<p>${T('Veja também: ')} ${ver('guia-promessas', 'Como ler as promessas atribuídas a Maria')} · <a href="${href('ordens/')}">${T('Ordens religiosas e Maria')}</a></p></section>
<section aria-labelledby="sf-t"><h2 id="sf-t">${T('Fontes')}</h2>${fontes([{ titulo: 'Concílio Vaticano II, Sacrosanctum Concilium (n. 60)', url: 'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19631204_sacrosanctum-concilium_po.html' }, 'ccc-pt-683-1065', 'ccc-pt-422-682'])}
<p class="nota-peq">${T('O Catecismo trata dos sacramentais nos nn. 1667-1679, na terceira parte («A vida em Cristo»); o texto dessa parte não está listado acima.')}</p></section>`
  })];
}
