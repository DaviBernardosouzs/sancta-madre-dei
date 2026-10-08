// Padres da Igreja: como o pensamento mariano se formou, de Inácio de Antioquia a João Damasceno.
const ETAPAS = [
  { id: 'e1', t: 'Séculos I e II: Maria na regra de fé e a nova Eva', r: 'Os primeiros escritores falam de Maria para afirmar que Jesus nasceu de verdade e que Deus cumpriu o que prometeu. É nessa época que nasce o paralelo Eva-Maria.' },
  { id: 'e2', t: 'Séculos III e IV: virgindade e santidade', r: 'Com a vida monástica e o debate contra quem negava a virgindade, os Padres afirmam a virgindade perpétua e começam a falar da santidade de Maria. Cresce a oração e a poesia mariana.' },
  { id: 'e3', t: 'Séculos IV e V: a Mãe de Deus', r: 'A controvérsia sobre quem é Cristo faz do título Theotokos o centro do debate, até Éfeso (431) e Calcedônia (451).' },
  { id: 'e4', t: 'Século VIII: Dormição e glória', r: 'A reflexão sobre o fim da vida de Maria se organiza em torno das homilias sobre a Dormição.' }
];

const PADRES = [
  {
    nome: 'Inácio de Antioquia', anos: 'c. 35 a c. 107', regiao: 'Oriente', etapa: 'e1',
    tese: 'Jesus nasceu realmente de Maria, contra os que o tinham por aparência.',
    texto: ['Bispo de Antioquia, escreveu cartas a caminho do martírio em Roma. Em suas cartas, insiste que Jesus foi «realmente nascido de uma virgem» e concebido por Maria por obra do Espírito Santo, contra os que diziam que o corpo de Cristo era só aparência.', 'Chama a virgindade de Maria e o seu parto, junto com a morte do Senhor, de «mistérios de grito», que ficaram ocultos ao príncipe deste mundo (Aos Efésios 19).'],
    obras: 'Cartas aos Efésios, aos Trálios e aos Esmirniotas'
  },
  {
    nome: 'Justino Mártir', anos: 'c. 100 a c. 165', regiao: 'Oriente e Roma', etapa: 'e1',
    tese: 'Maria é a nova Eva: a obediência de uma desfaz a desobediência da outra.',
    texto: ['Filósofo convertido e mestre em Roma, foi martirizado. No Diálogo com Trifão (n. 100), compara Eva, virgem, que concebeu a palavra da serpente, com Maria, virgem, que acolheu a palavra do anjo e respondeu «faça-se em mim segundo a tua palavra».', 'É a primeira vez em que a comparação aparece escrita, e ela marcará toda a tradição.'],
    obras: 'Diálogo com Trifão; Primeira Apologia'
  },
  {
    nome: 'Irineu de Lião', anos: 'c. 130 a c. 202', regiao: 'Ocidente (Gália)', etapa: 'e1',
    tese: 'O «nó» da desobediência de Eva foi desatado pela obediência de Maria.',
    texto: ['Discípulo de Policarpo, que por sua vez conheceu o apóstolo João, Irineu desenvolve o paralelo em Contra as heresias (III,22,4): o que Eva atou pela incredulidade, Maria desatou pela fé. Chama Maria de «advogada» da virgem Eva (V,19,1).', 'A Lumen Gentium (n. 56) cita este texto. Para Irineu, Maria tem um papel na história da salvação porque Cristo recapitula nela e em Adão a humanidade.'],
    obras: 'Contra as heresias (livros III e V); Demonstração da pregação apostólica',
    link: { titulo: 'Contra as heresias, III,22 (New Advent, inglês)', url: 'https://www.newadvent.org/fathers/0103322.htm' }
  },
  {
    nome: 'Tertuliano', anos: 'c. 155 a c. 220', regiao: 'Ocidente (África)', etapa: 'e2',
    tese: 'Defende a concepção virginal, mas a tradição ainda não era uniforme sobre o parto.',
    texto: ['Primeiro grande escritor cristão em latim, também usa o paralelo Eva-Maria. Mas, ao combater quem negava a carne real de Cristo, sustenta que Maria foi virgem ao conceber e não no parto, e parece ler os «irmãos de Jesus» ao pé da letra.', 'Mostra que a doutrina da virgindade perpétua foi se firmando devagar. A Igreja posterior não seguiu essa opinião de Tertuliano.'],
    obras: 'Sobre a carne de Cristo; Contra Marcião'
  },
  {
    nome: 'Atanásio de Alexandria', anos: 'c. 296 a 373', regiao: 'Oriente (Egito)', etapa: 'e2',
    tese: 'Chama Maria «Mãe de Deus» e «sempre virgem» no combate ao arianismo.',
    texto: ['Defensor da divindade de Cristo em Niceia, usa «Mãe de Deus» (Theotokos) e «sempre virgem» (aeiparthenos) para dizer que o Filho que nasceu de Maria é o próprio Verbo eterno. Com ele, o título passa do culto para a doutrina.'],
    obras: 'Discursos contra os arianos; Carta a Epicteto'
  },
  {
    nome: 'Efrém, o Sírio', anos: 'c. 306 a 373', regiao: 'Oriente (Síria)', etapa: 'e2',
    tese: 'Canta Maria em hinos, como nova Eva e como a «toda bela».',
    texto: ['Diácono e poeta, escreveu hinos em siríaco que foram cantados nas liturgias. Em um deles, dirige-se a Cristo: «Tu e tua Mãe sois os únicos que sois belos de todos os modos; não há mancha em ti nem em tua Mãe» (Cantos de Nísibis 27).', 'Nos textos de Efrém, a santidade de Maria aparece em poesia e não em argumento. A tradição ortodoxa e a católica a leem de formas distintas.'],
    obras: 'Hinos sobre a Natividade; Cantos de Nísibis'
  },
  {
    nome: 'Ambrósio de Milão', anos: 'c. 340 a 397', regiao: 'Ocidente (Itália)', etapa: 'e2',
    tese: 'Maria é modelo das virgens e figura da Igreja.',
    texto: ['Bispo de Milão e mestre de Agostinho, apresenta Maria como exemplo de virgindade e de escuta. Foi ele quem desenvolveu a ideia de Maria como figura (typus) da Igreja, virgem e mãe (Exposição do Evangelho segundo Lucas II,7).', 'Defendeu a virgindade de Maria contra Joviniano, que a negava no parto, e um sínodo em Milão, em 393, condenou Joviniano.'],
    obras: 'Sobre as virgens; Sobre a instituição da virgem; Exposição do Evangelho segundo Lucas'
  },
  {
    nome: 'Jerônimo', anos: 'c. 347 a 420', regiao: 'Ocidente e Palestina', etapa: 'e2',
    tese: 'Defende a virgindade perpétua e lê os «irmãos de Jesus» como primos.',
    texto: ['Tradutor da Bíblia para o latim (a Vulgata), escreveu por volta de 383 o tratado Contra Helvídio, resposta a quem sustentava que Maria teve outros filhos depois de Jesus.', 'Argumenta que «irmãos» na Bíblia tem sentido amplo e que os de Jesus eram parentes próximos. Sua leitura influenciou o Ocidente latino por séculos.'],
    obras: 'Contra Helvídio; Vulgata'
  },
  {
    nome: 'Agostinho de Hipona', anos: '354 a 430', regiao: 'Ocidente (África)', etapa: 'e2',
    tese: 'Maria concebeu Cristo na fé antes de concebê-lo no corpo; é mãe dos membros de Cristo.',
    texto: ['Para Agostinho, Maria foi mais bem-aventurada por ter acolhido a fé em Cristo do que por ter concebido a carne de Cristo (Sobre a santa virgindade 3,3). Ensina que ela «cooperou com a caridade» para que nascessem os fiéis na Igreja, sendo «mãe segundo o espírito» dos membros de Cristo (Sobre a santa virgindade 6,6; texto citado na Lumen Gentium 53).', 'Ao tratar do pecado, escreveu que, por honra ao Senhor, «excetuada a santa Virgem Maria», não quer que se faça questão alguma quando se fala de pecados (Sobre a natureza e a graça 36,42). Esse texto é invocado nos debates sobre a Imaculada Conceição.'],
    obras: 'Sobre a santa virgindade; Sobre a natureza e a graça; Sermões',
    link: { titulo: 'Sobre a natureza e a graça (New Advent, inglês)', url: 'https://www.newadvent.org/fathers/1503.htm' }
  },
  {
    nome: 'Cirilo de Alexandria', anos: 'c. 376 a 444', regiao: 'Oriente (Egito)', etapa: 'e3',
    tese: 'Defende o título Theotokos como garantia da unidade de Cristo.',
    texto: ['Patriarca de Alexandria, foi o principal adversário de Nestório. Argumenta que, se o Filho de Maria não é o Filho de Deus, a encarnação perde o sentido. Presidiu o Concílio de Éfeso (431) e redigiu a carta que o concílio aprovou.', 'A Fórmula de União de 433 foi o acordo entre ele e João de Antioquia.'],
    obras: 'Cartas a Nestório; Homilias de Éfeso'
  },
  {
    nome: 'Proclo de Constantinopla', anos: 'c. 390 a 446', regiao: 'Oriente', etapa: 'e3',
    tese: 'Louva Maria como Mãe de Deus diante do próprio Nestório, em 429.',
    texto: ['Pregou uma homilia sobre Maria na igreja de Constantinopla em 429, na presença de Nestório. O sermão afirma a maternidade divina em linguagem de louvor e foi muito copiado. Mais tarde foi patriarca da cidade.'],
    obras: 'Homilia I sobre a Mãe de Deus'
  },
  {
    nome: 'Leão Magno', anos: 'c. 400 a 461', regiao: 'Ocidente (Roma)', etapa: 'e3',
    tese: 'Seu Tomo a Flaviano (449) inspirou a definição de Calcedônia.',
    texto: ['O papa Leão I escreveu ao patriarca Flaviano uma carta em que explica a união das duas naturezas em Cristo. Lida em Calcedônia (451), serviu de base à definição de fé, que diz que o Filho nasceu de Maria «Virgem e Mãe de Deus, segundo a humanidade».'],
    obras: 'Tomo a Flaviano; Sermões sobre o Natal'
  },
  {
    nome: 'João Damasceno', anos: 'c. 675 a 749', regiao: 'Oriente (Síria e Palestina)', etapa: 'e4',
    tese: 'Suas homilias sobre a Dormição fixaram a tradição oriental sobre o fim da vida de Maria.',
    texto: ['Monge perto de Jerusalém, último dos grandes Padres do Oriente, reúne a doutrina anterior em A fé ortodoxa, onde afirma que Maria é «propriamente Mãe de Deus» (III,12).', 'Escreveu três homilias sobre a Dormição de Maria. A Igreja do Ocidente as cita na liturgia e foram uma das fontes do dogma da Assunção definido em 1950.'],
    obras: 'A fé ortodoxa; Homilias sobre a Dormição'
  }
];

export function padres(c) {
  const { T, tags, fontes, pagina, href, paralelo, esc } = c;
  const etapas = ETAPAS.map((e) => `<section class="etapa-padres" aria-labelledby="${e.id}-t"><h2 id="${e.id}-t">${T(e.t)}</h2><p class="etapa-padres__r">${T(e.r)}</p>
  <div class="padres-grade">${PADRES.filter((p) => p.etapa === e.id).map((p) => `<article class="padre">
    <p class="padre__quando">${esc(p.anos)} · ${T(p.regiao)}</p>
    <h3 class="padre__nome">${T(p.nome)}</h3>
    <p class="padre__tese">${T(p.tese)}</p>
    ${p.texto.map((t) => `<p>${T(t)}</p>`).join('')}
    <p class="padre__obras"><strong>${T('Obras')}:</strong> ${T(p.obras)}${p.link ? ` · <a href="${esc(p.link.url)}" rel="noopener">${T(p.link.titulo)}</a>` : ''}</p>
  </article>`).join('')}</div></section>`).join('');
  return [pagina({
    path: 'padres/', titulo: 'Padres da Igreja e Maria',
    lede: 'Os Padres foram os primeiros a pensar e a rezar sobre Maria. Ler o que cada um disse, e quando, mostra como o pensamento mariano se formou: devagar, em debates sobre Cristo.',
    descricao: 'De Inácio de Antioquia a João Damasceno: como os Padres da Igreja pensaram Maria, da nova Eva ao título Theotokos e à Dormição.',
    nota: 'Os Padres não formam um bloco uniforme. Por isso a página indica a época de cada um e, quando preciso, em que ele diferia dos outros.',
    corpo: `${tags([['historia', 'Séculos II ao VIII'], ['tradicao', 'Pensamento patrístico'], ['ensino', 'Lumen Gentium 53-56']])}
<section class="sub-tuum" aria-labelledby="sub-t"><h2 id="sub-t">${T('A oração mais antiga')}</h2>
<p>${T('Um fragmento de papiro egípcio, conservado em Manchester (Rylands 470), contém em grego a oração Sub tuum praesidium, que invoca Maria como Theotokos. Os estudiosos o datam entre o século III e o IV, e é a menção mais antiga do título em oração. O texto abaixo é o da forma tradicional.')}</p>
${paralelo([['Ὑπὸ τὴν σὴν εὐσπλαγχνίαν καταφεύγομεν, Θεοτόκε· τὰς ἱκεσίας ἡμῶν μὴ παρίδῃς ἐν περιστάσει, ἀλλ᾽ ἐκ κινδύνου λύτρωσαι ἡμᾶς, μόνη ἁγνή, μόνη εὐλογημένη.', 'Sob a tua misericórdia nos refugiamos, Mãe de Deus; não desprezes as nossas súplicas na necessidade, mas livra-nos de todo perigo, só pura, só bendita.']], { lang: 'el', rotulo: 'Grego' })}
<p class="nota-peq">${T('Tradução do projeto, para estudo. Em português, a versão litúrgica é «À vossa proteção recorremos, Santa Mãe de Deus».')}</p></section>
${etapas}
<section aria-labelledby="pf-t"><h2 id="pf-t">${T('Ler e conferir')}</h2>${fontes(['lumen-gentium-pt', 'dossie-s08', { titulo: 'Contra as heresias III,22, de Irineu (New Advent, inglês)', url: 'https://www.newadvent.org/fathers/0103322.htm' }, { titulo: 'Sobre a natureza e a graça, de Agostinho (New Advent, inglês)', url: 'https://www.newadvent.org/fathers/1503.htm' }, { titulo: 'Atos e cartas do Concílio de Éfeso (New Advent, inglês)', url: 'https://www.newadvent.org/fathers/3810.htm' }])}
<p class="nota-peq">${T('As obras dos Padres são citadas pelos títulos usuais. As traduções das passagens são do projeto, de modo resumido: confira o texto e a numeração nas edições críticas e nas coleções de Padres.')} <a href="${href('escrituras/')}">${T('Maria nas Escrituras')}</a> · <a href="${href('concilios/efeso/')}">${T('Éfeso')}</a> · <a href="${href('dogmas/')}">${T('Os quatro dogmas')}</a></p></section>`
  })];
}
