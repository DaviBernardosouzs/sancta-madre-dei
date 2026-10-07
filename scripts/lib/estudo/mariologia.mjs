// Mariologia: a área acadêmica. Níveis de ensino, grandes temas e glossário.
const NIVEIS = [
  ['dogma', 'Dogma definido', 'Verdade proposta pela Igreja de modo solene e definitivo, que os fiéis devem crer com fé. Os quatro dogmas marianos são desse tipo.', 'Maternidade divina (Éfeso, 431); virgindade perpétua (Latrão, 649); Imaculada Conceição (1854); Assunção (1950).'],
  ['doutrina', 'Doutrina do Magistério', 'Ensino da Igreja em concílios e documentos papais que pede assentimento religioso, sem ser definição solene.', 'Maria, Mãe da Igreja; sua cooperação na salvação e a sua mediação em Cristo (Lumen Gentium, cap. VIII).'],
  ['liturgia', 'Liturgia e devoção aprovada', 'Festas, títulos, orações e práticas que a Igreja acolhe e celebra, sem que cada detalhe seja doutrina.', 'Rosário, Ladainha de Loreto, festa de Nossa Senhora das Dores, escapulários.'],
  ['opiniao', 'Opinião teológica', 'Ideias que teólogos defendem e discutem em liberdade, dentro da fé, sem decisão da Igreja.', 'Como articular «mediadora» e «corredentora» com a única mediação de Cristo; detalhes do «trânsito» de Maria.']
];

const TEMAS = [
  {
    id: 'theotokos', nome: 'Theotokos, Mãe de Deus', grego: 'Θεοτόκος', nivel: ['dogma', 'Éfeso, 431'],
    afirma: 'Maria é Mãe de Deus porque aquele a quem ela deu à luz, segundo a humanidade, é o Filho eterno de Deus: uma só pessoa, verdadeiro Deus e verdadeiro homem.',
    fundamento: [['escritura', 'Lc 1,43; Gl 4,4'], ['ensino', 'Concílio de Éfeso (431); Calcedônia (451)']],
    texto: ['O título protege a fé em Cristo antes de dizer algo sobre Maria. Se o Filho que nasceu dela não fosse o mesmo Filho de Deus, Maria seria mãe de um homem unido a Deus, e a encarnação seria menos que real.', 'Não significa que Maria deu origem à divindade: o Filho nasce eternamente do Pai, e nasce de Maria na humanidade, no tempo.'],
    debate: 'Se «Mãe de Deus» devia ser dito sem acréscimo (Cirilo de Alexandria) ou só «Mãe de Cristo» (preferência de Nestório). A Declaração Cristológica Comum de 1994, entre João Paulo II e o patriarca da Igreja Assíria do Oriente, reconhece como fé comum que Maria é «Mãe de Cristo nosso Deus e Salvador».',
    mais: [['dogmas/mae-de-deus/', 'O dogma da Mãe de Deus'], ['concilios/efeso/', 'Éfeso, passo a passo']]
  },
  {
    id: 'virgindade', nome: 'Virgindade perpétua', grego: 'Ἀειπάρθενος', nivel: ['dogma', 'Latrão, 649'],
    afirma: 'Maria concebeu virginalmente por obra do Espírito Santo e permaneceu virgem antes, durante e depois do parto.',
    fundamento: [['escritura', 'Mt 1,18-25; Lc 1,34-35'], ['ensino', 'Constantinopla II (553); Latrão (649); Lumen Gentium 57']],
    texto: ['A concepção virginal de Jesus está nos Evangelhos de Mateus e de Lucas. A virgindade «depois do parto» e «no parto» vem da Tradição e foi afirmada pelos Padres e, depois, pelos concílios.', 'Os «irmãos de Jesus» dos Evangelhos são lidos pela tradição católica como parentes próximos, por causa do uso amplo da palavra «irmão» em hebraico e aramaico, ou como filhos de José de um casamento anterior, segundo antigas tradições orientais.'],
    debate: 'O sentido exato de «virgindade no parto» é discutido; o Catecismo (n. 499) cita Lumen Gentium 57 para dizer que o nascimento de Cristo «não diminuiu, mas consagrou» a integridade virginal de Maria. Muitas igrejas da Reforma, que no início aceitavam a perpétua virgindade, hoje não a ensinam.',
    mais: [['dogmas/virgindade-perpetua/', 'O dogma da Virgindade perpétua']]
  },
  {
    id: 'imaculada', nome: 'Imaculada Conceição', grego: 'Πανάγια', nivel: ['dogma', 'Pio IX, 1854'],
    afirma: 'Maria foi preservada de toda mancha do pecado original desde o primeiro instante da sua existência, em vista dos méritos de Cristo.',
    fundamento: [['escritura', 'Lc 1,28; Gn 3,15'], ['ensino', 'Ineffabilis Deus (1854); Lumen Gentium 56']],
    texto: ['É a doutrina sobre a concepção de Maria, não sobre a de Jesus. Maria foi redimida como todos, mas de modo antecipado: a graça de Cristo agiu nela desde o início, e não depois do pecado.', 'O fundamento bíblico é indireto: a saudação do anjo (Lc 1,28), traduzida tradicionalmente por «cheia de graça», e a oposição entre a mulher e a serpente (Gn 3,15).'],
    debate: 'Grandes teólogos medievais, como Bernardo de Claraval e Tomás de Aquino, tiveram dúvidas por temerem que isso tirasse de Cristo a universalidade da redenção. João Duns Escoto abriu a saída com a ideia de redenção preservativa. As Igrejas ortodoxas honram Maria como «toda santa», mas não aceitam o dogma como foi definido.',
    mais: [['dogmas/imaculada-conceicao/', 'O dogma da Imaculada Conceição']]
  },
  {
    id: 'assuncao', nome: 'Assunção', grego: 'Κοίμησις', nivel: ['dogma', 'Pio XII, 1950'],
    afirma: 'Terminado o curso da vida terrena, Maria foi elevada em corpo e alma à glória do céu.',
    fundamento: [['escritura', 'Ap 12,1; Lc 1,28; 1Cor 15,20-23'], ['ensino', 'Munificentissimus Deus (1950); Lumen Gentium 59'], ['tradicao', 'Narrativas antigas do «trânsito» de Maria']],
    texto: ['O Novo Testamento não conta o fim da vida de Maria. O dogma nasce da fé da Igreja em sua unidade com Cristo e da liturgia, que celebra a festa em 15 de agosto desde a Antiguidade.', 'A definição de 1950 não diz se Maria morreu antes de ser elevada; fala do «curso da vida terrena». Na tradição oriental, a festa se chama Dormição.'],
    debate: 'Se Maria morreu ou foi elevada sem passar pela morte; a ausência de testemunho bíblico direto; a relação com a esperança da ressurreição de todos. A definição deixa aberto o que a Escritura e a tradição não esclarecem.',
    mais: [['dogmas/assuncao/', 'O dogma da Assunção']]
  },
  {
    id: 'maternidade-espiritual', nome: 'Maternidade espiritual', grego: null, nivel: ['doutrina', 'Lumen Gentium 53 e 61-62'],
    afirma: 'Maria é, na ordem da graça, mãe dos discípulos de Cristo e da Igreja.',
    fundamento: [['escritura', 'Jo 19,25-27; Ap 12,17'], ['ensino', 'Lumen Gentium 53; Paulo VI (1964); Mater Ecclesiae (decreto de 2018)']],
    texto: ['A cena junto à cruz, em que Jesus entrega Maria ao discípulo amado e o discípulo a ela, é a base mais citada. A tradição lê nela uma maternidade que se estende a todos os que seguem o Filho.', 'Paulo VI proclamou Maria «Mãe da Igreja» no encerramento da terceira sessão do Concílio Vaticano II, em 21 de novembro de 1964. Em 2018, a Santa Sé inscreveu no Calendário Romano Geral a memória de Maria, Mãe da Igreja, na segunda-feira depois de Pentecostes.'],
    debate: 'Como entender essa maternidade sem diminuir a de Cristo como único Mediador. O Concílio responde que ela «não obscurece nem diminui» a mediação de Cristo, mas mostra a sua eficácia (Lumen Gentium 60).',
    mais: [['fe-mae-da-igreja', 'Artigo: Maria, Mãe da Igreja']]
  },
  {
    id: 'mediacao', nome: 'Mediação e cooperação', grego: null, nivel: ['doutrina', 'Lumen Gentium 60-62'],
    afirma: 'Cristo é o único Mediador; Maria coopera com Ele de modo subordinado, intercedendo pelos fiéis.',
    fundamento: [['escritura', '1Tm 2,5; Jo 2,1-12'], ['ensino', 'Lumen Gentium 62; Catecismo 969'], ['opiniao', 'Títulos «Mediadora de todas as graças» e «Corredentora»']],
    texto: ['O Vaticano II usa o título «Medianeira» entre outros (advogada, auxiliadora, socorro), com a ressalva de que nada acrescenta nem tira da dignidade de Cristo.', 'A nota Mater Populi fidelis, do Dicastério para a Doutrina da Fé (4 de novembro de 2025), examina os títulos ligados à cooperação de Maria na salvação a partir da singularidade de Cristo como Mediador e Redentor.'],
    debate: 'Se títulos como «Corredentora» e «Mediadora de todas as graças» são úteis ou criam mal-entendidos. Convém ler o documento de 2025 para ver o que a Igreja afirma hoje sobre cada um.',
    mais: [['biblioteca-mariana/', 'Biblioteca Mariana']]
  },
  {
    id: 'tipologia', nome: 'Tipologia bíblica', grego: null, nivel: ['doutrina', 'Padres e Lumen Gentium 55-56'],
    afirma: 'Os Padres e a liturgia leem Maria à luz de figuras do Antigo Testamento: a nova Eva, a Arca da Aliança, a Filha de Sião.',
    fundamento: [['escritura', 'Gn 3,15; 2Sm 6,2-15; Sf 3,14-17'], ['historia', 'Justino, Irineu e os Padres']],
    texto: ['Tipologia é a leitura que vê em pessoas e fatos do Antigo Testamento figuras que se cumprem em Cristo e em Maria. Eva, mãe dos viventes, e Maria, que acolhe a Palavra, formam o par que Justino e Irineu desenvolveram no século II.', 'Lucas constrói a cena da Visitação com ecos do episódio em que Davi leva a Arca a Jerusalém, o que levou os Padres a ver Maria como a nova Arca, portadora da presença de Deus.'],
    debate: 'A tipologia é leitura de fé, que parte do texto e vai além do sentido literal; por isso a Igreja a distingue da afirmação histórica ou doutrinal do próprio texto.',
    mais: [['escrituras/', 'Maria nas Escrituras'], ['padres/', 'Padres da Igreja']]
  }
];

const GLOSSARIO = [
  ['Theotokos', 'Grego «que deu à luz Deus»: Mãe de Deus. Deipara é a forma latina de origem grega.'],
  ['Aeiparthenos', 'Grego «sempre virgem»: título atestado em textos do século IV e usado no Concílio de Constantinopla II (553).'],
  ['Panagia', 'Grego «toda santa»: título oriental que exprime a santidade de Maria.'],
  ['Kecharitomene', 'Palavra grega de Lc 1,28, traduzida por «cheia de graça» ou «agraciada».'],
  ['Protoevangelho', 'Nome tradicional de Gn 3,15, lido como o primeiro anúncio da salvação. Também é o título de um apócrifo do século II, o Protoevangelho de Tiago.'],
  ['Filha de Sião', 'Figura profética de Israel como esposa de Deus (Sf 3,14; Zc 2,14); Lucas ecoa esses textos na saudação do anjo.'],
  ['Hiperdulia', 'Veneração especial devida a Maria, acima da dulia (honra aos santos) e abaixo da latria (adoração, só a Deus).'],
  ['Mediadora', 'Título de Maria no Vaticano II (LG 62), sempre subordinado à mediação única de Cristo.'],
  ['Corredentora', 'Título discutido; a Igreja não o definiu. Veja a nota Mater Populi fidelis (2025).'],
  ['Concepção ativa e passiva', 'Ativa é o ato dos pais que gera; passiva é a pessoa gerada. A Imaculada Conceição trata da concepção passiva de Maria.'],
  ['Transitus e Dormitio', 'Nomes das narrativas antigas e da festa oriental sobre o fim da vida de Maria.']
];

export function mariologia(c) {
  const { T, tags, paras, ver, fontes, pagina, esc, href } = c;
  const niveis = NIVEIS.map(([k, nome, def, ex]) => `<div class="nivel nivel--${k === 'dogma' ? 'eclesial' : k === 'doutrina' ? 'historia' : k === 'liturgia' ? 'sentido' : 'tradicao'}"><dt>${T(nome)}</dt><dd>${T(def)} <em>${T('Exemplos')}: ${T(ex)}</em></dd></div>`).join('');
  const lista = TEMAS.map((x) => `<section class="tema" id="${x.id}" aria-labelledby="${x.id}-t">
  <h3 id="${x.id}-t" class="tema__t">${T(x.nome)}${x.grego ? ` <span class="tema__gr" lang="el">${esc(x.grego)}</span>` : ''}</h3>
  ${tags([[x.nivel[0], x.nivel[1]], ...x.fundamento])}
  <p class="tema__afirma"><strong>${T('O que se afirma')}:</strong> ${T(x.afirma)}</p>
  ${paras(x.texto)}
  <p><strong>${T('Pontos em debate')}:</strong> ${T(x.debate)}</p>
  <p class="tema__mais">${x.mais.map(([m, r]) => (m.endsWith('/') ? `<a href="${href(m)}">${T(r)}</a>` : ver(m, r))).join(' · ')}</p>
</section>`).join('');
  const glos = GLOSSARIO.map(([t, d]) => `<div><dt>${T(t)}</dt><dd>${T(d)}</dd></div>`).join('');
  return [pagina({
    path: 'mariologia/', titulo: 'Mariologia',
    lede: 'O estudo ordenado do que a fé católica diz sobre Maria: o que é dogma, o que é doutrina, o que é devoção e o que ainda é discutido entre teólogos.',
    nota: 'Mariologia não é devoção. É teologia: parte da Escritura e da Tradição, usa a razão e reconhece a diferença entre o que a Igreja definiu e o que ensina com menos força.',
    descricao: 'Níveis de ensino da Igreja sobre Maria e sete grandes temas da mariologia: Theotokos, virgindade, Imaculada, Assunção, maternidade espiritual, mediação e tipologia.',
    corpo: `<section aria-labelledby="niveis-t"><h2 id="niveis-t">${T('Quatro níveis de ensino')}</h2>
<p>${T('Antes de ler sobre qualquer tema, convém saber de que peso é a afirmação. A mesma página pode tratar de um dogma e de uma opinião de escola.')}</p>
<dl class="niveis">${niveis}</dl></section>
<h2>${T('Os grandes temas')}</h2>
<nav class="indice-temas" aria-label="${T('Temas')}"><ul>${TEMAS.map((x) => `<li><a href="#${x.id}">${T(x.nome)}</a></li>`).join('')}</ul></nav>
${lista}
<section aria-labelledby="glos-t"><h2 id="glos-t">${T('Vocabulário')}</h2><dl class="glossario">${glos}</dl></section>
<section aria-labelledby="mf-t"><h2 id="mf-t">${T('Para ler')}</h2>${fontes(['ccc-pt-422-682', 'ccc-pt-683-1065', 'lumen-gentium-pt', 'dossie-s51', 'dossie-s09', 'dossie-s10'])}
<p class="nota-peq">${T('Catecismo, nn. 484-511 (Maria e Cristo) e 963-975 (Maria e a Igreja); Lumen Gentium, cap. VIII (nn. 52-69).')} <a href="${href('biblioteca-mariana/')}">${T('Biblioteca Mariana')}</a> · <a href="${href('dogmas/')}">${T('Os quatro dogmas')}</a></p></section>`
  })];
}
