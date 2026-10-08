// Iconografia mariana: símbolos, o que a Escritura e o ensino da Igreja dizem de cada um e o que é convenção da arte.
// Emblemas desenhados pelo projeto (SVG próprio, sem licença de terceiros).
const star = (cx, cy, R, r = R * 0.42, n = 5, rot = -90) => {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const a = ((rot + (i * 180) / n) * Math.PI) / 180, rad = i % 2 ? r : R;
    d += (i ? 'L' : 'M') + (cx + rad * Math.cos(a)).toFixed(1) + ' ' + (cy + rad * Math.sin(a)).toFixed(1);
  }
  return d + 'Z';
};
const anel = (n, raio, tam, off = 0) => Array.from({ length: n }, (_, i) => {
  const a = (-90 + off + (i * 360) / n) * Math.PI / 180;
  return star(raio * Math.cos(a), raio * Math.sin(a), tam, tam * 0.45, 5, -90 + (i * 360) / n + 90).replace(/Z$/, 'Z');
}).join('');
const raios = (n, r1, r2) => Array.from({ length: n }, (_, i) => {
  const a = (i * 360) / n * Math.PI / 180;
  return `M${(r1 * Math.cos(a)).toFixed(1)} ${(r1 * Math.sin(a)).toFixed(1)}L${(r2 * Math.cos(a)).toFixed(1)} ${(r2 * Math.sin(a)).toFixed(1)}`;
}).join('');
const espadas = Array.from({ length: 7 }, (_, i) => {
  const ang = -90 + (i - 3) * 22, a = ang * Math.PI / 180, b = (ang + 90) * Math.PI / 180;
  const P = (r, off = 0) => `${(r * Math.cos(a) + off * Math.cos(b)).toFixed(1)} ${(r * Math.sin(a) + off * Math.sin(b)).toFixed(1)}`;
  return `M${P(10)}L${P(29)}M${P(24, -4.5)}L${P(24, 4.5)}`;
}).join('');

// cada emblema é desenhado numa caixa de -32 a 32; "o" é contorno em ouro, "p" é preenchimento
export const EMBLEMAS = {
  estrelas: `<path class="e-p" d="${anel(12, 23, 4.6)}"/><path class="e-p" d="${star(0, 0, 9, 4)}"/>`,
  lua: `<path class="e-p" d="M6 -26A26 26 0 1 0 6 26A40 40 0 0 1 6 -26Z"/>`,
  serpente: `<path class="e-o e-g" d="M-22 22C-22 6 4 14 4 -2S-16 -10 -6 -20C0 -25 10 -24 14 -18"/><path class="e-p" d="M12 -24L26 -17L13 -10Z"/><circle class="e-v" cx="17" cy="-18" r="1.3"/>`,
  coroa: `<path class="e-p" d="M-24 14L-28 -14L-13 -3L0 -22L13 -3L28 -14L24 14Z"/><path class="e-o" d="M-24 21H24"/><circle class="e-p" cx="-28" cy="-16" r="2.6"/><circle class="e-p" cx="0" cy="-25" r="2.6"/><circle class="e-p" cx="28" cy="-16" r="2.6"/>`,
  rosas: `<g class="e-o">${[0, 72, 144, 216, 288].map((a) => `<circle cx="${(14 * Math.cos(((a - 90) * Math.PI) / 180)).toFixed(1)}" cy="${(14 * Math.sin(((a - 90) * Math.PI) / 180)).toFixed(1)}" r="10"/>`).join('')}<circle r="11"/><circle r="6"/><circle r="2" class="e-p"/></g>`,
  'manto-azul': `<path class="e-azul" d="M0 -27C-11 -27 -15 -17 -15 -9C-15 3 -27 13 -29 27L29 27C27 13 15 3 15 -9C15 -17 11 -27 0 -27Z"/><path class="e-o" d="M0 -27C-6 -19 -7 -10 -4 -2C-1 6 -2 17 -9 27M0 -27C6 -19 7 -10 4 -2C1 6 2 17 9 27"/>`,
  sol: `<circle class="e-p" r="11"/><path class="e-o e-g" d="${raios(16, 15, 29)}"/>`,
  lirios: `<path class="e-o e-g" d="M0 28V-1M0 18C-8 16 -12 10 -12 4M0 14C8 12 12 8 12 2"/><path class="e-p" d="M0 -1C-13 -3 -16 -17 -8 -27C-3 -21 0 -12 0 -1Z"/><path class="e-p" d="M0 -1C13 -3 16 -17 8 -27C3 -21 0 -12 0 -1Z"/><path class="e-p e-claro" d="M0 -1C-7 -11 -5 -23 0 -30C5 -23 7 -11 0 -1Z"/>`,
  coracao: `<path class="e-p" d="M0 24C-30 6 -26 -16 -12 -16C-5 -16 0 -11 0 -7C0 -11 5 -16 12 -16C26 -16 30 6 0 24Z"/><path class="e-o" d="M0 -17C-5 -23 -1 -27 -1 -31C6 -27 4 -21 0 -17Z"/>`,
  'sete-espadas': `<path class="e-o e-g" d="${espadas}"/><path class="e-p" d="M0 14C-16 4 -14 -8 -7 -8C-3 -8 0 -5 0 -3C0 -5 3 -8 7 -8C14 -8 16 4 0 14Z"/>`
};
export const emblema = (id, cls = '') => `<svg class="emblema ${cls}" viewBox="-34 -34 68 68" aria-hidden="true" focusable="false">${EMBLEMAS[id]}</svg>`;

/** O quadro central: a mulher de Ap 12,1 como um conjunto de símbolos que levam a cada seção. */
export const apocalipse = (t, esc) => {
  const alvo = (id, rotulo, corpo, extra = '') => `<a class="ap__parte ap__parte--${id}" href="#${id}" aria-label="${esc(rotulo)}"${extra}><title>${esc(rotulo)}</title>${corpo}</a>`;
  return `<svg class="ap" viewBox="0 0 420 470" role="group" aria-label="${esc(t('A mulher vestida de sol, de Apocalipse 12,1, como conjunto de símbolos: sol, lua, doze estrelas e serpente'))}" focusable="false">
  <defs>
    <radialGradient id="ap-sol" cx="50%" cy="46%" r="55%"><stop offset="0" stop-color="#f6e7bd"/><stop offset=".55" stop-color="#e3c27a"/><stop offset="1" stop-color="#b8893a" stop-opacity="0"/></radialGradient>
    <linearGradient id="ap-mandorla" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3a86"/><stop offset="1" stop-color="#16225a"/></linearGradient>
  </defs>
  ${alvo('sol', t('Sol'), `<g transform="translate(210 232)"><circle r="150" fill="url(#ap-sol)" opacity=".85"/><path class="ap__raios" d="${raios(36, 104, 150)}"/></g>`)}
  <path class="ap__mandorla" d="M210 82C282 150 292 282 210 392C128 282 138 150 210 82Z"/>
  <path class="ap__mandorla-fio" d="M210 102C268 160 276 278 210 372C144 278 152 160 210 102Z"/>
  <text class="ap__monograma" x="210" y="262" text-anchor="middle">M</text>
  ${alvo('estrelas', t('Doze estrelas'), `<g transform="translate(210 232)"><path class="ap__estrelas" d="${anel(12, 168, 12, 15)}"/></g>`)}
  ${alvo('coroa', t('Coroa'), `<g transform="translate(210 84) scale(.62)">${EMBLEMAS.coroa}</g>`)}
  ${alvo('lua', t('Lua sob os pés'), `<g transform="translate(210 424) rotate(-90) scale(1.1)">${EMBLEMAS.lua}</g>`)}
  ${alvo('serpente', t('Serpente'), `<g transform="translate(334 418) scale(1.5)">${EMBLEMAS.serpente}</g>`)}
</svg>`;
};

/**
 * Símbolos. `base` diz de onde vem cada leitura: escritura, ensino (Magistério e liturgia), tradicao ou arte.
 * Tudo em português; o build passa cada frase por `_()`.
 */
export const SIMBOLOS = [
  {
    id: 'estrelas', nome: 'Estrelas', latim: 'Stella Maris', resumo: 'Doze estrelas na cabeça, ou uma estrela sobre o ombro: a coroa da mulher do Apocalipse e a guia dos navegantes.',
    base: [['escritura', 'Ap 12,1'], ['tradicao', 'Estrela do mar, hino Ave maris stella e Bernardo de Claraval']],
    texto: [
      'A fonte é Apocalipse 12,1: «uma mulher vestida de sol, com a lua debaixo dos pés e uma coroa de doze estrelas na cabeça». As doze estrelas lembram as doze tribos de Israel e os doze apóstolos; é a leitura mais comum, mas o texto não a explica.',
      'A «estrela do mar» é outra tradição, mais devocional que bíblica. O nome vem de uma etimologia medieval de Maria («stella maris»), que os estudiosos hoje não consideram segura. Mesmo assim, o hino Ave maris stella, do primeiro milênio, e a pregação de Bernardo de Claraval («olha a estrela, invoca Maria») fixaram a imagem da guia na tempestade.'
    ],
    cuidado: 'O número doze e o sentido de cada estrela são interpretação da tradição e da arte, não declaração do Evangelho.',
    imagem: null
  },
  {
    id: 'lua', nome: 'Lua', latim: 'Luna sub pedibus', resumo: 'A lua crescente sob os pés, típica das imagens da Imaculada Conceição.',
    base: [['escritura', 'Ap 12,1'], ['arte', 'Imaculada espanhola do século XVII']],
    texto: [
      'Também vem de Apocalipse 12,1. Na arte, a lua sob os pés se tornou quase uma assinatura da Imaculada Conceição, sobretudo na Espanha do século XVII, quando o pintor e teórico Francisco Pacheco recomendou a composição em seu tratado sobre a arte da pintura (1649).',
      'O sentido corrente é o domínio sobre o que muda e passa; há quem veja nela também uma alusão à castidade. São leituras da tradição artística, e nenhuma delas é decisão da Igreja.'
    ],
    cuidado: 'Na pintura da Imaculada, a lua crescente remete a Ap 12,1 e não a outra religião.',
    imagem: ['obra-reni-imaculada', 'Maria sobre a lua crescente, entre nuvens e anjos: a composição clássica da Imaculada.']
  },
  {
    id: 'serpente', nome: 'Serpente', latim: 'Serpens', resumo: 'A serpente esmagada sob o pé de Maria, de Gênesis 3,15 e de Apocalipse 12.',
    base: [['escritura', 'Gn 3,15; Ap 12,9'], ['ensino', 'Ineffabilis Deus (Pio IX, 1854)']],
    texto: [
      'Em Gênesis 3,15, Deus diz à serpente que haverá inimizade entre ela e a mulher, entre a sua descendência e a dela. A tradição cristã leu aí o primeiro anúncio da salvação e, em Maria, a nova Eva. A bula Ineffabilis Deus, que definiu a Imaculada Conceição em 1854, recorre a esse texto.',
      'Há uma nuance de tradução que explica a imagem: a Vulgata latina traz «ela [ipsa] esmagará a tua cabeça», e foi essa leitura que levou os artistas a pôr a serpente sob o pé de Maria. O hebraico e o grego trazem «ele», referindo-se à descendência, isto é, a Cristo. Em Apocalipse 12,9, o dragão é identificado com «a antiga serpente».'
    ],
    cuidado: 'Que Maria esmaga a serpente em pessoa é leitura da Vulgata; o sentido seguro é que a vitória sobre o mal vem de Cristo, de quem Maria participa.',
    imagem: null
  },
  {
    id: 'coroa', nome: 'Coroa', latim: 'Regina caeli', resumo: 'Maria coroada como Rainha, no céu e nas imagens de devoção.',
    base: [['escritura', 'Ap 12,1; Sl 45,10'], ['ensino', 'Lumen Gentium 59; Ad caeli reginam (Pio XII, 1954)'], ['arte', 'Coroação da Virgem']],
    texto: [
      'A Igreja ensina que Maria, ao fim da vida terrena, foi levada em corpo e alma à glória do céu e exaltada como Rainha do universo (Lumen Gentium 59). O título de Rainha tem apoio no Salmo 45,10, onde a rainha está à direita do rei, e na coroa de Apocalipse 12,1. Em 1954, a encíclica Ad caeli reginam de Pio XII instituiu a festa litúrgica da Realeza de Maria.',
      'A coroação da Virgem por Cristo ou pela Trindade, no céu, é um tema da arte medieval. A realeza de Maria é participação na de Cristo, e não poder próprio.'
    ],
    cuidado: 'O rito de coroar imagens é devoção aprovada em muitos lugares, mas a coroa que se vê na pintura é convenção artística.',
    imagem: ['durer-assuncao-coroacao', 'A coroação de Maria entre nuvens, acima dos apóstolos em volta do sepulcro vazio.']
  },
  {
    id: 'rosas', nome: 'Rosas', latim: 'Rosa mystica', resumo: 'A rosa mística da Ladainha de Loreto e as rosas do Rosário e de Guadalupe.',
    base: [['escritura', 'Eclo 24,14-18'], ['ensino', 'Ladainha de Loreto'], ['tradicao', 'Rosas de Guadalupe; «rosário» como jardim de rosas']],
    texto: [
      '«Rosa mística» é uma das invocações da Ladainha de Loreto, documentada no santuário de Loreto em meados do século XVI e aprovada por Sisto V em 1587. A liturgia aplica a Maria o elogio da Sabedoria em Eclesiástico 24, que fala de «roseiras em Jericó» (a numeração do versículo varia conforme a edição).',
      'A palavra «rosário» significa literalmente jardim de rosas, e a ideia de oferecer a Maria uma coroa de rosas em forma de orações é antiga na devoção. A rosa branca, a vermelha e a dourada costumam ser lidas, respectivamente, como alegria, dor e glória, em alusão aos mistérios; é uma leitura devocional.',
      'Na tradição de Guadalupe, rosas colhidas por Juan Diego fora de época são um elemento central do relato. É tradição devocional recolhida em relatos dos séculos XVI e XVII, não documento histórico do evento.'
    ],
    cuidado: 'Cada cor de rosa tem leituras variadas conforme o artista e a época; não há código oficial.',
    imagem: null
  },
  {
    id: 'manto-azul', nome: 'Manto azul', latim: 'Pallium caeruleum', resumo: 'O azul de Maria: céu, humildade e, sobretudo, o pigmento mais caro da pintura.',
    base: [['arte', 'Convenção da arte bizantina e ocidental']],
    texto: [
      'Nenhum texto bíblico diz que Maria usava azul. A cor vem da arte: a arte bizantina já vestia Maria de azul-escuro e púrpura, e no Ocidente medieval o azul se firmou como a cor dela.',
      'Um motivo bem documentado é material. O azul ultramarino era feito de lápis-lazúli importado de longe e estava entre os pigmentos mais caros; contratos de pintores especificavam por vezes a quantidade que devia cobrir o manto da Virgem. Usar o melhor pigmento na figura mais honrada era também uma forma de homenagem. Ao azul se somam leituras simbólicas, como o céu e a humildade.'
    ],
    cuidado: 'O azul como «cor da pureza» é explicação posterior. Em outras imagens, como o manto vermelho de Dürer ou o dourado da Pietà, Maria não veste azul.',
    imagem: ['obra-memling-anunciacao', 'Maria de manto azul sobre vestido vermelho, ajoelhada diante de um livro, na Anunciação de Memling.']
  },
  {
    id: 'sol', nome: 'Sol', latim: 'Amicta sole', resumo: 'A mulher «vestida de sol» e a «aurora» do Cântico dos Cânticos.',
    base: [['escritura', 'Ap 12,1; Ct 6,10'], ['tradicao', 'Maria, aurora que anuncia o Sol']],
    texto: [
      'O sol é a roupa da mulher de Apocalipse 12,1; nas imagens aparece como raios de ouro em volta de toda a figura. O Cântico dos Cânticos 6,10 pergunta quem é aquela que surge «como a aurora, bela como a lua, fulgurante como o sol», versículo que a liturgia e os Padres aplicaram a Maria.',
      'Nessa leitura, Maria é a aurora que anuncia o sol que é Cristo. A imagem faz de Maria o reflexo de uma luz que não é dela.'
    ],
    cuidado: 'Apocalipse 12 é lido também como o povo de Deus e a Igreja; a leitura de Maria é mais um dos seus níveis de sentido.',
    imagem: null
  },
  {
    id: 'lirios', nome: 'Lírios', latim: 'Lilium inter spinas', resumo: 'O lírio da Anunciação: virgindade e pureza.',
    base: [['escritura', 'Ct 2,2'], ['arte', 'Anunciação, a partir do fim da Idade Média']],
    texto: [
      'O Cântico dos Cânticos 2,2 diz: «como o lírio entre os espinhos, assim é a minha amada entre as jovens». A tradição aplicou a frase a Maria. Nas Anunciações, o lírio costuma aparecer na mão do anjo Gabriel ou num vaso entre os dois, como sinal da virgindade de Maria.',
      'O lírio branco é, portanto, convenção da arte para dizer o que a Escritura afirma sem flores: Maria era virgem quando o anjo a saudou (Lc 1,27).'
    ],
    cuidado: 'Nem toda Anunciação tem lírios; quando faltam, outros sinais ocupam o lugar, como o livro aberto ou o quarto fechado.',
    imagem: null
  },
  {
    id: 'coracao', nome: 'Coração', latim: 'Cor Immaculatum', resumo: 'O Imaculado Coração: Maria que guardava tudo no coração, hoje em chamas e rosas.',
    base: [['escritura', 'Lc 2,19.51'], ['ensino', 'Festa do Imaculado Coração de Maria'], ['tradicao', 'João Eudes e Fátima']],
    texto: [
      'Duas vezes o Evangelho de Lucas diz que Maria «conservava todas essas coisas, meditando-as no seu coração» (Lc 2,19.51). Daí nasceu a devoção ao coração de Maria, entendido como o centro da pessoa: a sua escuta, o seu amor e a sua fé.',
      'No século XVII, São João Eudes promoveu o culto litúrgico dos corações de Jesus e de Maria. A devoção ganhou força no século XX com as aparições de Fátima, relatadas pelos videntes em 1917, e com a consagração do mundo ao Imaculado Coração feita por Pio XII em 1942. Em 1944, Pio XII estendeu a festa à Igreja inteira; no calendário atual, é memória no sábado seguinte à solenidade do Sagrado Coração.',
      'A imagem do coração em chamas, cercado de rosas ou lírios e traspassado por uma espada, junta Lc 2,35 à devoção moderna.'
    ],
    cuidado: 'A aprovação eclesial refere-se ao culto e à festa; os detalhes de Fátima são relatos dos videntes, e o reconhecimento diz respeito ao culto no local.',
    imagem: null
  },
  {
    id: 'sete-espadas', nome: 'Sete espadas', latim: 'Mater Dolorosa', resumo: 'As sete dores de Maria, de Simeão ao sepulcro, em sete espadas no coração.',
    base: [['escritura', 'Lc 2,35; Jo 19,25-27'], ['tradicao', 'Ordem dos Servos de Maria e as sete dores'], ['ensino', 'Festa de Nossa Senhora das Dores, 15 de setembro']],
    texto: [
      'Em Lucas 2,35, Simeão diz a Maria que «uma espada traspassará a tua alma». O texto fala de uma só espada e do que Maria sofreria. Junto à cruz, o Evangelho de João a mostra de pé (Jo 19,25).',
      'As sete dores, de que vêm as sete espadas, são uma lista da tradição: a profecia de Simeão, a fuga para o Egito, a perda do menino no Templo, o encontro com Jesus no caminho do Calvário, a crucifixão, a descida da cruz e o sepultamento. A devoção foi difundida sobretudo pelos Servos de Maria (servitas), ordem fundada no século XIII. A festa de Nossa Senhora das Dores foi estendida à Igreja universal em 1814.',
      'O número sete, na Bíblia, indica plenitude: sete espadas dizem uma dor completa, não sete golpes contáveis. A arte que mostra as espadas, comum nos séculos XV e XVI, é imagem de devoção.'
    ],
    cuidado: 'A lista das sete dores não é fixada pela Escritura; algumas versões trocam itens. As promessas atribuídas a quem reza as sete dores são de origem devocional e não têm aprovação como doutrina.',
    imagem: ['obra-pieta-alema', 'A Pietà: Maria com o corpo de Cristo morto no colo, a dor que a devoção das sete espadas contempla.']
  }
];

export const OUTROS = [
  ['Jardim fechado', 'Hortus conclusus', 'Ct 4,12', 'Aplicado a Maria pela tradição para dizer que ela é inteiramente de Deus; aparece em pinturas do fim da Idade Média, com Maria sentada num jardim cercado.'],
  ['Torre de Davi e torre de marfim', 'Turris Davidica, Turris eburnea', 'Ct 4,4; 7,5', 'Invocações da Ladainha de Loreto, tiradas do Cântico dos Cânticos: imagem de firmeza e de beleza.'],
  ['Arca da Aliança', 'Foederis arca', 'Lc 1,35', 'Invocação da Ladainha de Loreto. Maria é a arca porque leva em si o Filho de Deus, como a Arca levava a presença de Deus entre o povo.'],
  ['Livro aberto', 'Liber apertus', 'Lc 1,26-38', 'Nas Anunciações, mostra Maria lendo ou meditando a Escritura antes da visita do anjo. O texto de Lucas não menciona nenhum livro: é convenção da arte.'],
  ['Pomba', 'Columba', 'Lc 1,35', 'O Espírito Santo, que vem sobre Maria na Anunciação e sobre os apóstolos em Pentecostes, aparece como pomba nas imagens de ambas as cenas.']
];
