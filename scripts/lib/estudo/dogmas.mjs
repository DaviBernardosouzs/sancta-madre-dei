// Os quatro dogmas marianos, cada um numa página própria: contexto, texto definido, debate e fontes.
const DOGMAS = [
  {
    slug: 'mae-de-deus', nome: 'Mãe de Deus', grego: 'Θεοτόκος · Dei Genetrix', data: '431', art: 'obra-raphael-entronizada', romano: 'I',
    frase: 'Maria é verdadeiramente Mãe de Deus, porque o Filho que ela gerou na humanidade é o próprio Filho eterno de Deus.',
    quem: 'Concílio ecumênico de Éfeso (431), confirmado em Calcedônia (451).',
    tipo: [['dogma', 'Éfeso, 431'], ['escritura', 'Lc 1,43; Gl 4,4; Jo 1,14'], ['historia', 'Controvérsia nestoriana, 428-433']],
    linha: [
      { ano: 'séc. III', titulo: 'O título aparece na oração e no culto', texto: 'O título Theotokos já circula entre os cristãos de língua grega, e a oração Sub tuum praesidium, em grego, a invoca como Mãe de Deus. O uso é anterior à controvérsia.', tipo: 'marco' },
      { ano: '428', titulo: 'Nestório rejeita o título', texto: 'Nestório, patriarca de Constantinopla, teme que «Mãe de Deus» sugira que a divindade teve origem em Maria. Prefere «Mãe de Cristo» (Christotokos).' },
      { ano: '430', titulo: 'Cirilo e o papa Celestino respondem', texto: 'Cirilo de Alexandria escreve a Nestório; um sínodo em Roma, sob Celestino I, condena os ensinos de Nestório.' },
      { ano: '431', titulo: 'O Concílio de Éfeso', texto: 'Reunido na igreja de Maria, em Éfeso, o concílio aprova a carta de Cirilo, afirma que o Filho nascido de Maria é o Verbo de Deus encarnado e depõe Nestório.', tipo: 'marco' },
      { ano: '433', titulo: 'A Fórmula de União', texto: 'Cirilo e João de Antioquia chegam a um acordo que inclui chamar a Virgem Theotokos. A paz entre as escolas dura pouco, mas o título está firme.' },
      { ano: '451', titulo: 'Calcedônia', texto: 'A definição de fé afirma um só Cristo em duas naturezas, e diz que ele nasceu «de Maria, Virgem e Mãe de Deus, segundo a humanidade».', tipo: 'marco' }
    ],
    texto: [
      ['Texto da Definição de Calcedônia (451), trecho', [
        ['…ante saecula quidem de Patre genitum secundum divinitatem, in novissimis autem diebus eundem propter nos et propter nostram salutem ex Maria virgine Dei genetrice secundum humanitatem…', '…gerado do Pai antes dos séculos segundo a divindade, e nos últimos dias, por nós e por nossa salvação, nascido de Maria, Virgem e Mãe de Deus, segundo a humanidade…']
      ], 'A definição foi escrita em grego; o latim é uma versão tradicional e as versões variam em detalhes. A tradução para o português é do projeto, para estudo.']
    ],
    contexto: [
      'O debate não era sobre Maria, e sim sobre quem é Jesus. Nas escolas de Antioquia, a ênfase estava na distinção entre a natureza divina e a humana; na escola de Alexandria, na unidade da pessoa. Nestório, saído da tradição antioquena, receava que atribuir a Maria o título «Mãe de Deus» confundisse as duas naturezas.',
      'Cirilo respondeu que o Verbo de Deus assumiu a carne e nasceu de Maria: se o Filho de Maria não fosse o próprio Filho de Deus, haveria dois sujeitos em Cristo, e Deus não teria vindo realmente ao encontro dos homens.'
    ],
    controversias: [
      'Se Nestório ensinava de fato o que se lhe atribuiu: a pesquisa histórica discute até que ponto ele defendia duas pessoas em Cristo. A Igreja Assíria do Oriente, que o venera, e a Igreja Católica assinaram em 1994 uma declaração cristológica comum que reconhece Maria como Mãe de Cristo nosso Deus e Salvador.',
      'O modo de ser formulado: o concílio foi marcado por disputas de procedimento, com dois sínodos rivais em Éfeso, antes do acordo de 433.'
    ],
    ler: [['fe-maternidade-divina', 'Artigo: Maternidade divina'], ['concilios/efeso/', 'Éfeso, passo a passo']],
    fontes: ['dossie-s08', 'lumen-gentium-pt', { titulo: 'Concílio de Éfeso (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Council_of_Ephesus' }, { titulo: 'Atos e cartas do Concílio de Éfeso (tradução inglesa, New Advent)', url: 'https://www.newadvent.org/fathers/3810.htm' }]
  },
  {
    slug: 'virgindade-perpetua', nome: 'Virgindade perpétua', grego: 'Ἀειπάρθενος · Semper Virgo', data: '649', art: 'obra-memling-anunciacao', romano: 'II',
    frase: 'Maria concebeu Jesus virginalmente, por obra do Espírito Santo, e permaneceu virgem antes, durante e depois do parto.',
    quem: 'Concílio de Constantinopla II (553) e Sínodo de Latrão (649); reafirmada pelo Vaticano II e pelo Catecismo.',
    tipo: [['dogma', 'Latrão, 649'], ['escritura', 'Mt 1,18-25; Lc 1,26-38'], ['historia', 'Debate de Helvídio e Jerônimo, c. 383']],
    linha: [
      { ano: 'séc. I-II', titulo: 'A concepção virginal nos Evangelhos', texto: 'Mateus e Lucas contam que Jesus foi concebido sem intervenção de José. Inácio de Antioquia, no início do século II, já lista o parto virginal entre os «mistérios de grito» da vida de Cristo.', tipo: 'marco' },
      { ano: 'séc. II', titulo: 'O Protoevangelho de Tiago', texto: 'Escrito apócrifo que descreve a virgindade de Maria antes, durante e depois do parto e apresenta os «irmãos» de Jesus como filhos de um primeiro casamento de José. Não é Escritura, mas influenciou a tradição.' },
      { ano: 'c. 383', titulo: 'Helvídio e Jerônimo', texto: 'Helvídio defende que Maria teve outros filhos depois de Jesus. Jerônimo responde com o tratado Contra Helvídio, mantendo a virgindade perpétua e os «irmãos» como primos.', tipo: 'marco' },
      { ano: '553', titulo: 'Constantinopla II', texto: 'O concílio chama Maria de «gloriosa sempre virgem Maria, Mãe de Deus» e faz dessa fórmula parte da profissão de fé.' },
      { ano: '649', titulo: 'Sínodo de Latrão', texto: 'Sob o papa Martinho I, o sínodo condena quem não confessar que Maria concebeu do Espírito Santo, deu à luz sem corrupção e permaneceu virgem depois do parto.', tipo: 'marco' },
      { ano: '1964', titulo: 'Vaticano II', texto: 'A Lumen Gentium (n. 57) diz que o nascimento de Cristo «não diminuiu, mas consagrou» a integridade virginal de sua mãe.' }
    ],
    texto: [
      ['Fórmula de Constantinopla II (553) e de Latrão (649), trecho', [
        ['…Dei genitricem sanctam semperque virginem et immaculatam Mariam…', '…Maria, santa Mãe de Deus, sempre virgem e imaculada…']
      ], 'Trecho do cânon 3 do Sínodo de Latrão (649). Para o texto inteiro, consulte as coleções de documentos dos concílios. A tradução é do projeto.']
    ],
    contexto: [
      'Há três afirmações distintas, que costumam ser confundidas: a concepção virginal de Jesus (sem pai humano), a virgindade de Maria no parto e a virgindade dela depois do parto. A primeira está nos Evangelhos; as outras duas são ensinadas pela Tradição.',
      'O Catecismo (nn. 496-507) apresenta a virgindade como sinal da iniciativa de Deus: Jesus tem Deus por Pai e nasce de Maria como filho verdadeiro.'
    ],
    controversias: [
      'Os «irmãos e irmãs de Jesus» (Mc 6,3; Mt 13,55): a palavra grega adelphoi tem sentido amplo. Há três leituras antigas: filhos de um primeiro casamento de José (tradição oriental), primos (Jerônimo) ou irmãos de sangue (Helvídio, e depois muitos cristãos protestantes).',
      'O sentido da virgindade «no parto» é discutido entre os teólogos: se é um dado físico ou um sinal do mistério. A Igreja afirma a integridade virginal sem definir o modo.',
      'Muitos reformadores do século XVI, como Lutero e Zwinglio, aceitavam a virgindade perpétua; hoje a maioria das comunidades protestantes não a ensina.'
    ],
    ler: [['fe-virgindade-perpetua', 'Artigo: Virgindade perpétua'], ['escrituras/', 'Maria nas Escrituras']],
    fontes: ['dossie-s08', 'lumen-gentium-pt', 'proto-tiago', { titulo: 'Perpetual virginity of Mary (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Perpetual_virginity_of_Mary' }]
  },
  {
    slug: 'imaculada-conceicao', nome: 'Imaculada Conceição', grego: 'Immaculata Conceptio', data: '1854', art: 'obra-reni-imaculada', romano: 'III',
    frase: 'Maria foi preservada de toda mancha do pecado original desde o primeiro instante da sua conceição, por singular graça de Deus e em vista dos méritos de Cristo.',
    quem: 'Papa Pio IX, bula Ineffabilis Deus, 8 de dezembro de 1854.',
    tipo: [['dogma', 'Pio IX, 1854'], ['escritura', 'Lc 1,28; Gn 3,15'], ['historia', 'Debate medieval, de Bernardo a Escoto']],
    linha: [
      { ano: 'séc. II-IV', titulo: 'Maria, nova Eva, e «toda santa»', texto: 'Justino e Irineu veem em Maria a nova Eva. No Oriente, os Padres a chamam de «toda santa» e «imaculada».' },
      { ano: 'c. 1140', titulo: 'Bernardo e a festa da Conceição', texto: 'Bernardo de Claraval escreve aos cônegos de Lião contra a nova festa da Conceição de Maria: temia que se afirmasse algo que a tradição não havia ensinado.' },
      { ano: 'séc. XIII', titulo: 'Tomás de Aquino', texto: 'Tomás sustenta que Maria foi santificada depois de concebida, mas antes de nascer, para salvaguardar a universalidade da redenção em Cristo.' },
      { ano: 'c. 1300', titulo: 'Escoto e a redenção preservativa', texto: 'João Duns Escoto, franciscano, responde que Cristo pode redimir de dois modos: libertando do pecado ou preservando dele. Maria foi a mais redimida, por preservação.', tipo: 'marco' },
      { ano: '1476', titulo: 'Sisto IV', texto: 'O papa aprova a festa da Conceição de Maria e, em 1483, proíbe que se acuse de heresia quem a defenda ou a negue, enquanto a Igreja não decidir.' },
      { ano: '1546', titulo: 'Concílio de Trento', texto: 'No decreto sobre o pecado original, o concílio declara que não pretende incluir nele a «bem-aventurada e imaculada Virgem Maria».' },
      { ano: '1854', titulo: 'Ineffabilis Deus', texto: 'Depois de consultar o episcopado, Pio IX define o dogma em 8 de dezembro.', tipo: 'marco' },
      { ano: '1858', titulo: 'Lourdes', texto: 'Quatro anos depois, Bernadette relata que a Senhora das aparições disse «Eu sou a Imaculada Conceição». A Igreja reconheceu as aparições de Lourdes em 1862, sem que isso acrescente ao dogma.' }
    ],
    texto: [
      ['Definição de Pio IX (1854), trecho', [
        ['…beatissimam Virginem Mariam in primo instanti suae conceptionis fuisse singulari omnipotentis Dei gratia et privilegio, intuitu meritorum Christi Iesu Salvatoris humani generis, ab omni originalis culpae labe praeservatam immunem…', '…a beatíssima Virgem Maria, no primeiro instante da sua conceição, por singular graça e privilégio de Deus onipotente, em vista dos méritos de Cristo Jesus, Salvador do gênero humano, foi preservada imune de toda mancha de culpa original…']
      ], 'Trecho da definição na bula Ineffabilis Deus. A tradução é do projeto, para estudo; leia o documento inteiro na fonte oficial.']
    ],
    contexto: [
      'O dogma é frequentemente confundido com a concepção virginal de Jesus. São coisas diferentes: a Imaculada Conceição trata do início da vida de Maria, concebida pelos seus pais Joaquim e Ana; a concepção virginal trata de Jesus.',
      'A Igreja não afirma que Maria não precisasse de salvação. Ela foi redimida por Cristo, de modo antecipado, pela graça que lhe foi dada em vista dos méritos do Filho.'
    ],
    controversias: [
      'Por que grandes santos teólogos tiveram dúvidas: a preocupação era a universalidade da redenção em Cristo. A solução franciscana, de Escoto, tornou possível defender a doutrina sem negar isso.',
      'O Concílio de Basileia (1439) declarou a doutrina, mas depois de se tornar cismático; a Igreja não conta essa decisão como definitiva.',
      'A teologia ortodoxa honra Maria como toda santa, mas entende o pecado original de modo diferente do latino e não aceita o dogma como foi proclamado por um papa sozinho.'
    ],
    ler: [['fe-imaculada-conceicao', 'Artigo: Imaculada Conceição'], ['dossie-13', 'Dossiê: os dogmas marianos']],
    fontes: ['ineffabilis-deus', 'dossie-s08', 'lumen-gentium-pt', { titulo: 'Immaculate Conception (Enciclopédia Católica, 1910)', url: 'https://www.newadvent.org/cathen/07674d.htm' }, { titulo: 'Immaculate Conception (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Immaculate_Conception' }]
  },
  {
    slug: 'assuncao', nome: 'Assunção', grego: 'Κοίμησις · Assumptio', data: '1950', art: 'obra-signorelli-assuncao', romano: 'IV',
    frase: 'A Imaculada Mãe de Deus, sempre Virgem Maria, terminado o curso da vida terrena, foi elevada em corpo e alma à glória celeste.',
    quem: 'Papa Pio XII, constituição apostólica Munificentissimus Deus, 1º de novembro de 1950.',
    tipo: [['dogma', 'Pio XII, 1950'], ['escritura', 'Ap 12,1; 1Cor 15,20-23'], ['historia', 'Narrativas do «trânsito» e festa de 15 de agosto'], ['tradicao', 'Dormição no Oriente']],
    linha: [
      { ano: 'séc. V', titulo: 'Memória de Maria em Jerusalém', texto: 'Uma festa de Maria é celebrada em Jerusalém, em agosto; é a origem da festa da Dormição.' },
      { ano: 'séc. V-VI', titulo: 'Narrativas do «trânsito»', texto: 'Aparecem os relatos apócrifos do fim da vida de Maria (Transitus). Contam fatos que a Igreja não tem como história, mas mostram a fé na glória de Maria.' },
      { ano: 'c. 600', titulo: 'Festa de 15 de agosto no Império', texto: 'O imperador bizantino Maurício, segundo a tradição, fixa a festa da Dormição em 15 de agosto.' },
      { ano: 'séc. VII-VIII', titulo: 'Roma celebra a Assunção', texto: 'O papa Sérgio I (687-701) institui uma procissão na festa; a Igreja de Roma passa a chamar a festa de Assunção.' },
      { ano: 'séc. VIII', titulo: 'João Damasceno', texto: 'Escreve homilias sobre a Dormição que se tornaram referência para toda a tradição.', tipo: 'marco' },
      { ano: '1946', titulo: 'Consulta ao episcopado', texto: 'Pio XII pergunta aos bispos de todo o mundo se a definição é oportuna e se o clero e os fiéis a desejam. A resposta é esmagadoramente afirmativa.' },
      { ano: '1950', titulo: 'Munificentissimus Deus', texto: 'Em 1º de novembro, na Praça de São Pedro, Pio XII define o dogma. É a única vez, desde a definição da infalibilidade papal em 1870, em que um papa usou expressamente essa forma solene de definição.', tipo: 'marco' }
    ],
    texto: [
      ['Definição de Pio XII (1950), trecho', [
        ['…pronuntiamus, declaramus et definimus divinitus revelatum dogma esse: Immaculatam Deiparam semper Virginem Mariam, expleto terrestris vitae cursu, fuisse corpore et anima ad caelestem gloriam assumptam.', '…pronunciamos, declaramos e definimos ser dogma divinamente revelado: que a Imaculada Mãe de Deus, sempre Virgem Maria, terminado o curso da vida terrestre, foi elevada em corpo e alma à glória celeste.']
      ], 'Trecho da definição na constituição Munificentissimus Deus. A tradução é do projeto, para estudo.']
    ],
    contexto: [
      'O Novo Testamento não conta o fim da vida de Maria. O dogma não nasce de um relato histórico, e sim da fé da Igreja, expressa na liturgia e na teologia, de que a mãe do Senhor participa já da ressurreição que todos esperam.',
      'A fórmula «terminado o curso da vida terrena» foi escolhida de propósito: ela não decide se Maria morreu antes de ser elevada. Por isso, no Oriente, a festa se chama Dormição, e no Ocidente, Assunção; as duas tradições convivem.'
    ],
    controversias: [
      'A falta de apoio bíblico direto, que é o motivo de a doutrina ser rejeitada por quem só aceita o que está na Escritura. A Igreja católica responde que a Tradição, e não só a Escritura, é fonte de revelação.',
      'Se Maria morreu ou não: Pio XII deixou a questão em aberto.',
      'A questão de onde Maria viveu e foi sepultada (Jerusalém ou Éfeso) não é objeto de definição; veja a página sobre relíquias e tradições.'
    ],
    ler: [['fe-assuncao', 'Artigo: Assunção'], ['vida-12-dormicao-e-assuncao', 'A vida de Maria: Dormição e Assunção'], ['reliquias/', 'Relíquias e tradições marianas']],
    fontes: ['munificentissimus-deus-pt', 'dossie-s07', 'lumen-gentium-pt', { titulo: 'Assumption of Mary (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Assumption_of_Mary' }]
  }
];

export function dogmas(c) {
  const { T, tags, paras, ver, fontes, pagina, esc, href, paralelo, linha } = c;
  const paginas = DOGMAS.map((d) => pagina({
    path: `dogmas/${d.slug}/`, titulo: d.nome, trilha: [['Os quatro dogmas', 'dogmas/']], art: { id: d.art },
    lede: d.frase,
    descricao: `${d.nome}: contexto histórico, texto da definição, controvérsias e fontes. ${d.quem}`,
    corpo: `<p class="dogma-quem"><strong>${T('Quem definiu')}:</strong> ${T(d.quem)}</p>${tags(d.tipo)}
<section aria-labelledby="ctx-t"><h2 id="ctx-t">${T('Contexto')}</h2>${paras(d.contexto)}</section>
<section aria-labelledby="lt-t"><h2 id="lt-t">${T('Como chegou à definição')}</h2>${linha(d.linha)}</section>
<section aria-labelledby="tx-t"><h2 id="tx-t">${T('O texto definido')}</h2>${d.texto.map(([titulo, trecho, nota]) => `<h3>${T(titulo)}</h3>${paralelo(trecho)}<p class="nota-peq">${T(nota)}</p>`).join('')}</section>
<section aria-labelledby="co-t"><h2 id="co-t">${T('Controvérsias e pontos em aberto')}</h2><ul class="lista-ctrv">${d.controversias.map((x) => `<li>${T(x)}</li>`).join('')}</ul></section>
<section aria-labelledby="lr-t"><h2 id="lr-t">${T('Ler e conferir')}</h2><p>${d.ler.map(([m, r]) => (m.endsWith('/') ? `<a href="${href(m)}">${T(r)}</a>` : ver(m, r))).join(' · ')}</p>${fontes(d.fontes)}</section>
<nav class="dogma-nav" aria-label="${T('Outros dogmas')}"><ul>${DOGMAS.filter((o) => o.slug !== d.slug).map((o) => `<li><a href="${href(`dogmas/${o.slug}/`)}">${T(o.nome)} <span>${o.data}</span></a></li>`).join('')}</ul></nav>`
  }));
  const indice = pagina({
    path: 'dogmas/', titulo: 'Os quatro dogmas marianos',
    lede: 'Quatro verdades sobre Maria que a Igreja definiu solenemente. Cada uma tem a sua história: um debate, um momento de decisão e um texto que se pode ler.',
    descricao: 'Mãe de Deus, Virgindade perpétua, Imaculada Conceição e Assunção: contexto histórico, texto da definição e controvérsias de cada dogma mariano.',
    nota: 'Dogma é uma verdade proposta de modo solene e definitivo. Os dogmas marianos não tratam de devoções, e sim de quem é Cristo e do que a graça fez em Maria.',
    corpo: `<ol class="dogmas-lista">${DOGMAS.map((d) => `<li><a href="${href(`dogmas/${d.slug}/`)}"><span class="dg__ano">${d.data}</span><span class="dg__n">${d.romano}</span><span class="dg__t">${T(d.nome)}</span><span class="dg__gr" lang="${d.grego.includes('Θ') || d.grego.includes('Ἀ') || d.grego.includes('Κ') ? 'el' : 'la'}">${esc(d.grego)}</span><span class="dg__f">${T(d.frase)}</span></a></li>`).join('')}</ol>
<section aria-labelledby="niv-t"><h2 id="niv-t">${T('Dogma, doutrina e devoção')}</h2><p>${T('Nem tudo o que se diz de Maria é dogma. Há quatro dogmas marianos; há doutrina ensinada pelo Magistério, como Maria Mãe da Igreja; há devoções aprovadas, como o Rosário; e há opiniões teológicas livres. A página de Mariologia mostra a diferença.')} <a href="${href('mariologia/')}">${T('Mariologia')}</a> · <a href="${href('concilios/')}">${T('Concílios')}</a> · <a href="${href('latim/')}">${T('Textos em latim')}</a></p></section>`
  });
  return [indice, ...paginas];
}
