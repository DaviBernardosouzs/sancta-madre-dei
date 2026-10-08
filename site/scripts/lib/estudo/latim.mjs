// Orações e documentos marianos em latim, com tradução em paralelo. Os textos latinos são litúrgicos ou de documentos
// históricos; as traduções são do projeto, literais, feitas para estudo (não são as versões litúrgicas oficiais).
const ORACOES = [
  {
    id: 'ave-maria', nome: 'Ave Maria', latim: 'Ave Maria', uso: 'Rosário e Angelus', ver: 'ora-ave-maria',
    fonte: 'Saudação do anjo (Lc 1,28) e de Isabel (Lc 1,42); a segunda parte aparece no século XV-XVI.',
    versos: [
      ['Ave, Maria, gratia plena, Dominus tecum.', 'Ave, Maria, cheia de graça, o Senhor é contigo.'],
      ['Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus.', 'Bendita és tu entre as mulheres, e bendito é o fruto do teu ventre, Jesus.'],
      ['Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.', 'Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora da nossa morte. Amém.']
    ]
  },
  {
    id: 'salve-regina', nome: 'Salve Regina', latim: 'Salve Regina', uso: 'Depois das Completas; fim do Rosário', ver: 'ora-salve-rainha',
    fonte: 'Antífona mariana medieval, do século XI; a atribuição a Hermano Contrato é tradicional e incerta.',
    versos: [
      ['Salve, Regina, Mater misericordiae,', 'Salve, Rainha, Mãe de misericórdia,'],
      ['vita, dulcedo et spes nostra, salve.', 'vida, doçura e esperança nossa, salve.'],
      ['Ad te clamamus, exsules filii Hevae.', 'A ti clamamos, os degredados filhos de Eva.'],
      ['Ad te suspiramus, gementes et flentes in hac lacrimarum valle.', 'A ti suspiramos, gemendo e chorando neste vale de lágrimas.'],
      ['Eia ergo, advocata nostra, illos tuos misericordes oculos ad nos converte.', 'Eia, pois, advogada nossa, volta para nós esses teus olhos misericordiosos.'],
      ['Et Iesum, benedictum fructum ventris tui, nobis post hoc exsilium ostende.', 'E, depois deste exílio, mostra-nos Jesus, bendito fruto do teu ventre.'],
      ['O clemens, o pia, o dulcis Virgo Maria.', 'Ó clemente, ó piedosa, ó doce Virgem Maria.']
    ]
  },
  {
    id: 'sub-tuum', nome: 'Sub tuum praesidium', latim: 'Sub tuum praesidium', uso: 'Oração de proteção', ver: 'ora-sob-a-vossa-protecao',
    fonte: 'A mais antiga oração mariana conhecida: o original grego aparece num papiro egípcio dos séculos III-IV.',
    versos: [
      ['Sub tuum praesidium confugimus, sancta Dei Genetrix;', 'Sob a tua proteção nos refugiamos, santa Mãe de Deus;'],
      ['nostras deprecationes ne despicias in necessitatibus,', 'não desprezes as nossas súplicas nas necessidades,'],
      ['sed a periculis cunctis libera nos semper, Virgo gloriosa et benedicta.', 'mas livra-nos sempre de todos os perigos, Virgem gloriosa e bendita.']
    ]
  },
  {
    id: 'memorare', nome: 'Memorare', latim: 'Memorare', uso: 'Oração de confiança', ver: null,
    fonte: 'Texto derivado de uma oração do século XV e difundido no século XVII; a atribuição a São Bernardo, comum, é incorreta.',
    versos: [
      ['Memorare, o piissima Virgo Maria, non esse auditum a saeculo, quemquam ad tua currentem praesidia, tua implorantem auxilia, tua petentem suffragia, esse derelictum.', 'Lembra-te, ó piíssima Virgem Maria, que jamais se ouviu dizer que alguém que recorreu à tua proteção, implorou o teu auxílio, pediu o teu amparo tenha sido abandonado.'],
      ['Ego tali animatus confidentia, ad te, Virgo Virginum, Mater, curro, ad te venio, coram te gemens peccator assisto.', 'Animado por tal confiança, a ti, Virgem das virgens, Mãe, corro, a ti venho, diante de ti me apresento, gemendo, pecador.'],
      ['Noli, Mater Verbi, verba mea despicere; sed audi propitia et exaudi. Amen.', 'Não desprezes, Mãe do Verbo, as minhas palavras; mas ouve-as benigna e atende-as. Amém.']
    ]
  },
  {
    id: 'angelus', nome: 'Angelus', latim: 'Angelus Domini', uso: 'De manhã, ao meio-dia e à tarde', ver: 'ora-angelus',
    fonte: 'Devoção medieval que se firmou entre os séculos XIII e XVI, em torno dos sinos da manhã, do meio-dia e da noite.',
    versos: [
      ['V. Angelus Domini nuntiavit Mariae. R. Et concepit de Spiritu Sancto.', 'V. O anjo do Senhor anunciou a Maria. R. E ela concebeu do Espírito Santo.'],
      ['V. Ecce ancilla Domini. R. Fiat mihi secundum verbum tuum.', 'V. Eis a serva do Senhor. R. Faça-se em mim segundo a tua palavra.'],
      ['V. Et Verbum caro factum est. R. Et habitavit in nobis.', 'V. E o Verbo se fez carne. R. E habitou entre nós.'],
      ['V. Ora pro nobis, sancta Dei Genetrix. R. Ut digni efficiamur promissionibus Christi.', 'V. Rogai por nós, santa Mãe de Deus. R. Para que sejamos dignos das promessas de Cristo.'],
      ['Oremus. Gratiam tuam, quaesumus, Domine, mentibus nostris infunde; ut qui, angelo nuntiante, Christi Filii tui incarnationem cognovimus, per passionem eius et crucem ad resurrectionis gloriam perducamur. Per eumdem Christum Dominum nostrum. Amen.', 'Oremos. Infunde, Senhor, a tua graça em nossas almas, para que nós, que conhecemos pelo anúncio do anjo a encarnação de Cristo, teu Filho, cheguemos, por sua paixão e cruz, à glória da ressurreição. Pelo mesmo Cristo, nosso Senhor. Amém.']
    ]
  },
  {
    id: 'regina-caeli', nome: 'Regina caeli', latim: 'Regina caeli', uso: 'Tempo pascal, no lugar do Angelus', ver: null,
    fonte: 'Antífona mariana antiga, de autoria e data incertas, usada em Roma desde a Idade Média.',
    versos: [
      ['Regina caeli, laetare, alleluia,', 'Rainha do céu, alegra-te, aleluia,'],
      ['quia quem meruisti portare, alleluia,', 'porque aquele que merecestes trazer em teu seio, aleluia,'],
      ['resurrexit, sicut dixit, alleluia;', 'ressuscitou, como disse, aleluia;'],
      ['ora pro nobis Deum, alleluia.', 'rogai por nós a Deus, aleluia.']
    ]
  },
  {
    id: 'magnificat', nome: 'Magnificat', latim: 'Magnificat', uso: 'Vésperas', ver: 'ora-magnificat',
    fonte: 'Lc 1,46-55, na tradução da Vulgata.',
    versos: [
      ['Magnificat anima mea Dominum,', 'A minha alma engrandece o Senhor,'],
      ['et exsultavit spiritus meus in Deo salutari meo,', 'e o meu espírito exulta em Deus, meu Salvador,'],
      ['quia respexit humilitatem ancillae suae.', 'porque olhou para a humildade da sua serva.'],
      ['Ecce enim ex hoc beatam me dicent omnes generationes,', 'Eis que, de agora em diante, todas as gerações me chamarão bem-aventurada,'],
      ['quia fecit mihi magna qui potens est, et sanctum nomen eius,', 'porque fez em mim maravilhas aquele que é poderoso, e santo é o seu nome,'],
      ['et misericordia eius a progenie in progenies timentibus eum.', 'e a sua misericórdia vai de geração em geração para os que o temem.'],
      ['Fecit potentiam in brachio suo, dispersit superbos mente cordis sui.', 'Realizou proezas com o seu braço, dispersou os soberbos de coração.'],
      ['Deposuit potentes de sede et exaltavit humiles.', 'Depôs os poderosos de seus tronos e exaltou os humildes.'],
      ['Esurientes implevit bonis et divites dimisit inanes.', 'Encheu de bens os famintos e despediu os ricos de mãos vazias.'],
      ['Suscepit Israel puerum suum, recordatus misericordiae suae,', 'Acolheu Israel, seu servo, lembrando-se da sua misericórdia,'],
      ['sicut locutus est ad patres nostros, Abraham et semini eius in saecula.', 'como havia prometido a nossos pais, a Abraão e à sua descendência para sempre.']
    ]
  },
  {
    id: 'alma-redemptoris', nome: 'Alma Redemptoris Mater', latim: 'Alma Redemptoris Mater', uso: 'Advento e Natal, depois das Completas', ver: null,
    fonte: 'Antífona atribuída tradicionalmente a Hermano Contrato (século XI); a atribuição é incerta.',
    versos: [
      ['Alma Redemptoris Mater, quae pervia caeli porta manes, et stella maris,', 'Mãe santa do Redentor, que permaneces porta aberta do céu e estrela do mar,'],
      ['succurre cadenti, surgere qui curat, populo:', 'socorre o povo que cai e deseja levantar-se:'],
      ['tu quae genuisti, natura mirante, tuum sanctum Genitorem,', 'tu que geraste, para espanto da natureza, o teu santo Criador,'],
      ['Virgo prius ac posterius, Gabrielis ab ore sumens illud Ave, peccatorum miserere.', 'Virgem antes e depois, recebendo aquele «Ave» da boca de Gabriel, tem piedade dos pecadores.']
    ]
  },
  {
    id: 'ave-regina', nome: 'Ave Regina caelorum', latim: 'Ave Regina caelorum', uso: 'Quaresma, depois das Completas', ver: null,
    fonte: 'Antífona mariana medieval, dos séculos XII-XIII.',
    versos: [
      ['Ave, Regina caelorum, ave, Domina angelorum:', 'Salve, Rainha dos céus, salve, Senhora dos anjos:'],
      ['salve, radix, salve, porta, ex qua mundo lux est orta.', 'salve, raiz, salve, porta, de onde a luz surgiu para o mundo.'],
      ['Gaude, Virgo gloriosa, super omnes speciosa,', 'Alegra-te, Virgem gloriosa, mais bela que todas,'],
      ['vale, o valde decora, et pro nobis Christum exora.', 'adeus, ó muito formosa, e intercede por nós junto a Cristo.']
    ]
  },
  {
    id: 'ave-maris-stella', nome: 'Ave maris stella', latim: 'Ave maris stella', uso: 'Hino das Vésperas de Maria', ver: null,
    fonte: 'Hino do primeiro milênio, atestado em manuscritos a partir do século IX; autoria desconhecida.',
    versos: [
      ['Ave, maris stella, Dei Mater alma, atque semper Virgo, felix caeli porta.', 'Salve, estrela do mar, Mãe nutriz de Deus, e sempre Virgem, feliz porta do céu.'],
      ['Sumens illud Ave Gabrielis ore, funda nos in pace, mutans Hevae nomen.', 'Recebendo aquele «Ave» da boca de Gabriel, firma-nos na paz, mudando o nome de Eva.'],
      ['Solve vincla reis, profer lumen caecis, mala nostra pelle, bona cuncta posce.', 'Solta as cadeias dos réus, dá luz aos cegos, afasta os nossos males, pede para nós todos os bens.'],
      ['Monstra te esse matrem, sumat per te preces qui pro nobis natus tulit esse tuus.', 'Mostra que és mãe: que por ti receba as nossas preces aquele que, nascido por nós, quis ser teu.'],
      ['Virgo singularis, inter omnes mitis, nos culpis solutos mites fac et castos.', 'Virgem singular, mais mansa que todas, faze-nos, livres de culpas, mansos e castos.'],
      ['Vitam praesta puram, iter para tutum, ut videntes Iesum semper collaetemur.', 'Dá-nos vida pura, prepara um caminho seguro, para que, vendo Jesus, nos alegremos para sempre.'],
      ['Sit laus Deo Patri, summo Christo decus, Spiritui Sancto, tribus honor unus. Amen.', 'Louvor a Deus Pai, glória a Cristo, ao Espírito Santo: aos três, uma só honra. Amém.']
    ]
  }
];

const DOCUMENTOS = [
  {
    id: 'ineffabilis', nome: 'Definição da Imaculada Conceição', quando: '8 de dezembro de 1854', autor: 'Pio IX, bula Ineffabilis Deus', fonte: 'ineffabilis-deus', pagina: 'dogmas/imaculada-conceicao/',
    versos: [['…declaramus, pronuntiamus et definimus doctrinam, quae tenet beatissimam Virginem Mariam in primo instanti suae conceptionis fuisse singulari omnipotentis Dei gratia et privilegio, intuitu meritorum Christi Iesu Salvatoris humani generis, ab omni originalis culpae labe praeservatam immunem, esse a Deo revelatam atque ideirco ab omnibus fidelibus firmiter constanterque credendam.', '…declaramos, pronunciamos e definimos que a doutrina que sustenta que a beatíssima Virgem Maria, no primeiro instante da sua conceição, por singular graça e privilégio de Deus onipotente, em vista dos méritos de Cristo Jesus, Salvador do gênero humano, foi preservada imune de toda mancha de culpa original, é revelada por Deus e, por isso, deve ser crida firme e constantemente por todos os fiéis.']]
  },
  {
    id: 'munificentissimus', nome: 'Definição da Assunção', quando: '1º de novembro de 1950', autor: 'Pio XII, constituição Munificentissimus Deus', fonte: 'munificentissimus-deus', pagina: 'dogmas/assuncao/',
    versos: [['…pronuntiamus, declaramus et definimus divinitus revelatum dogma esse: Immaculatam Deiparam semper Virginem Mariam, expleto terrestris vitae cursu, fuisse corpore et anima ad caelestem gloriam assumptam.', '…pronunciamos, declaramos e definimos ser dogma divinamente revelado: que a Imaculada Mãe de Deus, sempre Virgem Maria, terminado o curso da vida terrestre, foi elevada em corpo e alma à glória celeste.']]
  },
  {
    id: 'calcedonia', nome: 'Definição de Calcedônia, trecho', quando: '451', autor: 'Concílio de Calcedônia', fonte: null, pagina: 'dogmas/mae-de-deus/',
    versos: [['…ante saecula quidem de Patre genitum secundum divinitatem, in novissimis autem diebus eundem propter nos et propter nostram salutem ex Maria virgine Dei genetrice secundum humanitatem…', '…gerado do Pai antes dos séculos segundo a divindade, e nos últimos dias, por nós e por nossa salvação, nascido de Maria, Virgem e Mãe de Deus, segundo a humanidade…']]
  },
  {
    id: 'latrao', nome: 'Latrão, 649: cânon 3, trecho', quando: '649', autor: 'Sínodo de Latrão, sob Martinho I', fonte: null, pagina: 'dogmas/virgindade-perpetua/',
    versos: [['…Dei genitricem sanctam semperque virginem et immaculatam Mariam…', '…Maria, santa Mãe de Deus, sempre virgem e imaculada…']]
  }
];

export function latim(c) {
  const { T, fontes, pagina, href, ver, paralelo, esc } = c;
  const lista = (itens, doc) => itens.map((o) => `<article class="oracao-la" id="${o.id}" aria-labelledby="${o.id}-t">
  <header><h3 id="${o.id}-t" class="oracao-la__t">${T(o.nome)}${doc ? '' : ` <span class="oracao-la__lat" lang="la">${esc(o.latim)}</span>`}</h3>
  <p class="oracao-la__meta">${doc ? `${T(o.autor)} · ${T(o.quando)}` : `${T('Uso')}: ${T(o.uso)}`}</p></header>
  ${paralelo(o.versos)}
  <p class="nota-peq">${doc ? '' : `${T(o.fonte)} `}${o.ver ? ver(o.ver, 'Ver a oração em português no acervo') : ''}${doc ? `<a href="${href(o.pagina)}">${T('Ver o dogma')}</a>${o.fonte ? ' · ' : ''}` : ''}${doc && o.fonte ? `<a href="${esc(c.srcById[o.fonte].url)}" rel="noopener">${T('Documento na fonte oficial')}</a>` : ''}</p>
</article>`).join('');
  return [pagina({
    path: 'latim/', titulo: 'Orações e documentos em latim',
    lede: 'As orações marianas mais antigas da Igreja no latim em que foram cantadas por séculos, e as definições dogmáticas, cada uma com tradução em português, verso a verso.',
    descricao: 'Ave Maria, Salve Regina, Sub tuum praesidium, Memorare, Angelus, Regina caeli, Magnificat e outras orações marianas em latim e português em paralelo, mais as definições dogmáticas.',
    nota: 'O latim é o texto litúrgico tradicional. A tradução em português é do projeto, literal, feita para estudar o latim; não é a versão litúrgica oficial, que está nas orações do acervo.',
    corpo: `<nav class="indice-temas" aria-label="${T('Textos')}"><ul>${[...ORACOES, ...DOCUMENTOS].map((o) => `<li><a href="#${o.id}">${T(o.nome)}</a></li>`).join('')}</ul></nav>
<section aria-labelledby="or-t"><h2 id="or-t">${T('Orações')}</h2>${lista(ORACOES, false)}</section>
<section aria-labelledby="do-t"><h2 id="do-t">${T('Documentos')}</h2>
<p>${T('Os trechos abaixo são as fórmulas de definição. Para o documento inteiro, use a ligação para a fonte oficial.')}</p>${lista(DOCUMENTOS, true)}</section>
<section aria-labelledby="ln-t"><h2 id="ln-t">${T('Ler e conferir')}</h2>${fontes(['compendio-ccc-oracoes', 'ineffabilis-deus', 'munificentissimus-deus', 'lumen-gentium-pt'])}
<p class="nota-peq">${T('Conferi os textos latinos com a tradição litúrgica; há pequenas variantes de pontuação e de grafia entre edições. Para o texto crítico, consulte o Breviário e o Missal.')} <a href="${href('oracoes/')}">${T('Orações')}</a> · <a href="${href('biblioteca-mariana/')}">${T('Biblioteca Mariana')}</a></p></section>`
  })];
}
