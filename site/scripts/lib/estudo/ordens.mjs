// Ordens e congregações religiosas e a sua ligação com Maria.
const ORDENS = [
  {
    slug: 'carmelitas', nome: 'Carmelitas', sigla: 'O.Carm. e O.C.D.', origem: 'Monte Carmelo, século XII',
    resumo: 'A «Ordem dos Irmãos da Bem-aventurada Virgem Maria do Monte Carmelo».',
    texto: ['Os carmelitas nasceram de ermitães que se reuniram no Monte Carmelo, na Terra Santa, no fim do século XII, e pediram a Alberto, patriarca de Jerusalém, uma regra de vida (a Regra do Carmelo, de 1206-1214, aprovada em 1226). Construíram uma capela dedicada a Maria e passaram a se chamar «irmãos da Bem-aventurada Virgem Maria».', 'A festa de Nossa Senhora do Monte Carmelo, em 16 de julho, nasceu na ordem e se tornou universal no século XVIII. O escapulário marrom é parte do hábito carmelita, e foi estendido a leigos. Entre os santos carmelitas de espiritualidade mariana estão Teresa de Ávila, João da Cruz e Teresinha.'],
    tradicao: 'A tradição carmelita liga o escapulário a uma visão de São Simão Stock, em 1251; os registros escritos dela são muito posteriores, e a historiografia a considera incerta. Veja a página sobre escapulários.',
    fonte: { titulo: 'Carmelitas (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Carmelites' }
  },
  {
    slug: 'franciscanos', nome: 'Franciscanos', sigla: 'O.F.M.', origem: 'Assis, 1209',
    resumo: 'Da Porciúncula, Santa Maria dos Anjos, à defesa da Imaculada.',
    texto: ['Francisco de Assis restaurou a pequena igreja de Santa Maria dos Anjos, a Porciúncula, onde nasceu a ordem. Compôs uma saudação a Maria («Ave, Senhora, santa Rainha, santa Mãe de Deus…») e a chamava de «esposa do Espírito Santo».', 'Os franciscanos tornaram-se os mais firmes defensores da Imaculada Conceição na teologia medieval, com João Duns Escoto (c. 1266-1308). A fórmula «Deus podia, convinha, logo o fez» costuma ser ligada à escola franciscana. A Coroa Franciscana, devoção dos sete gozos de Maria, é tradição da ordem, atestada desde o século XV.'],
    tradicao: 'A origem da Coroa Franciscana é narrada em relatos devocionais; a prática é aprovada, mas as histórias de sua origem não são documentadas como fatos.',
    fonte: { titulo: 'Defesa da Imaculada pela escola franciscana: Imaculada Conceição (Enciclopédia Católica)', url: 'https://www.newadvent.org/cathen/07674d.htm' }
  },
  {
    slug: 'dominicanos', nome: 'Dominicanos', sigla: 'O.P.', origem: 'Toulouse, 1216',
    resumo: 'A Salve Rainha e a grande história do Rosário.',
    texto: ['Os dominicanos cantam a Salve Rainha ao fim de cada dia, depois das Completas, desde a Idade Média. Ligaram-se ao Rosário de modo especial: as confrarias do Rosário, a partir do século XV, foram impulsionadas por pregadores dominicanos, como Alain de la Roche, e a de Colônia (1475) se tornou modelo.', 'A vitória cristã de Lepanto, em 7 de outubro de 1571, foi atribuída por Pio V, ele mesmo dominicano, à intercessão de Maria invocada com o Rosário. Gregório XIII a transformou na festa de Nossa Senhora do Rosário. Em 1883, Leão XIII dedicou outubro ao Rosário.'],
    tradicao: 'A tradição diz que Maria entregou o Rosário a São Domingos por volta de 1208. Os historiadores consideram que a forma atual do Rosário se desenvolveu bem depois, entre os séculos XII e XV; a Igreja aprova o Rosário sem endossar a história da entrega.',
    fonte: 'dossie-s09'
  },
  {
    slug: 'servitas', nome: 'Servitas', sigla: 'O.S.M.', origem: 'Florença, 1233',
    resumo: 'Os «Servos de Maria» e a devoção às sete dores.',
    texto: ['Sete mercadores de Florença se retiraram, em 1233, para o Monte Senário e fundaram a Ordem dos Servos de Maria. Foram aprovados em 1304. Sua espiritualidade gira em torno de Maria junto à cruz.', 'Os servitas difundiram a devoção às sete dores de Maria (veja a página de iconografia, nas «sete espadas») e a Coroa das Sete Dores. A festa de Nossa Senhora das Dores foi estendida à Igreja universal em 1814.'],
    tradicao: 'A lista das sete dores é de tradição devocional; as promessas atribuídas a quem reza a coroa não têm aprovação como doutrina.',
    fonte: { titulo: 'Ordem dos Servos de Maria (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Servite_Order' }
  },
  {
    slug: 'salesianos', nome: 'Salesianos', sigla: 'S.D.B.', origem: 'Turim, 1859',
    resumo: 'Dom Bosco e Maria Auxiliadora.',
    texto: ['A Sociedade Salesiana foi fundada por Dom Bosco em 1859 e aprovada em 1874. Dom Bosco tinha a devoção a Maria Auxiliadora como parte do seu método educativo e construiu a basílica de Valdocco, consagrada em 1868.', 'Com Maria Mazzarello, fundou em 1872 as Filhas de Maria Auxiliadora. A festa de Maria Auxiliadora é celebrada em 24 de maio.'],
    tradicao: 'O sonho de Dom Bosco, aos nove anos, em que a Senhora lhe indica a missão, é relato dele mesmo, escrito décadas depois.',
    fonte: { titulo: 'Salesianos de Dom Bosco (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Salesians_of_Don_Bosco' }
  },
  {
    slug: 'marianistas', nome: 'Marianistas', sigla: 'S.M.', origem: 'Bordéus, 1817',
    resumo: 'A Sociedade de Maria, para a missão com Maria.',
    texto: ['O padre Guilherme José Chaminade fundou, em Bordéus, em 1817, a Sociedade de Maria, e, com Adèle de Batz de Trenquelléon, as Filhas de Maria Imaculada (1816). Sua intuição: Maria como modelo e companheira de uma Igreja missionária, num tempo marcado pela Revolução Francesa.', 'Os marianistas se dedicam sobretudo à educação. Chaminade foi beatificado por João Paulo II em 2000.'],
    tradicao: null,
    fonte: { titulo: 'Sociedade de Maria (marianistas) (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Society_of_Mary_(Marianists)' }
  },
  {
    slug: 'jesuitas', nome: 'Jesuítas e as Congregações Marianas', sigla: 'S.J.', origem: 'Roma, 1540 e 1563',
    resumo: 'Inácio em Montserrat e as Congregações Marianas.',
    texto: ['Inácio de Loyola, antes de fundar a Companhia de Jesus, fez em março de 1522 uma vigília de armas diante de Nossa Senhora em Montserrat, e deixou ali a espada e o punhal. Em 1563, o jesuíta João Leunis fundou no Colégio Romano a primeira Congregação Mariana, associação de leigos que unia vida de oração, estudo e apostolado, e que se espalhou pelo mundo.', 'Em 1748, o papa Bento XIV reconheceu a congregação do Colégio Romano como «Prima Primaria», à qual as outras podiam se agregar. Delas descende a atual Comunidade de Vida Cristã.'],
    tradicao: null,
    fonte: { titulo: 'Sodalidade de Nossa Senhora, as Congregações Marianas (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Sodality_of_Our_Lady' }
  },
  {
    slug: 'cistercienses', nome: 'Cistercienses', sigla: 'O.Cist.', origem: 'Cister, 1098',
    resumo: 'Todas as abadias cistercienses são dedicadas a Maria.',
    texto: ['A Ordem de Cister, nascida no fim do século XI, estabeleceu cedo que todas as suas igrejas seriam dedicadas à Virgem Maria. Bernardo de Claraval deu à ordem o seu perfil mariano.', 'Entre os cistercienses, e depois entre os trapistas, o canto da Salve Rainha ao fim do dia é prática central. Muitas abadias levam o nome de Maria (Nossa Senhora de…).'],
    tradicao: null,
    fonte: { titulo: 'Bernardo de Claraval (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Bernard_of_Clairvaux' }
  }
];

export function ordens(c) {
  const { T, tags, fontes, pagina, href, esc } = c;
  const lista = ORDENS.map((o) => `<article class="ordem" id="${o.slug}" aria-labelledby="${o.slug}-t">
  <header><p class="ordem__sigla">${esc(o.sigla)} · ${T(o.origem)}</p><h2 id="${o.slug}-t" class="ordem__t">${T(o.nome)}</h2><p class="ordem__r">${T(o.resumo)}</p></header>
  ${tags([['historia', o.origem]])}
  ${o.texto.map((p) => `<p>${T(p)}</p>`).join('')}
  ${o.tradicao ? c.cuidado(o.tradicao) : ''}
  ${fontes([o.fonte])}
</article>`).join('');
  return [pagina({
    path: 'ordens/', titulo: 'Ordens religiosas e Maria',
    lede: 'Muitas ordens e congregações nasceram sob o nome ou a proteção de Maria. Cada uma deixou à devoção mariana uma prática, uma festa ou um modo de pensar.',
    descricao: 'Carmelitas, franciscanos, dominicanos, servitas, salesianos, marianistas, jesuítas e cistercienses: o que cada ordem religiosa deixou à devoção mariana.',
    nota: 'As datas e os fatos de fundação estão documentados. As histórias de origem de devoções, como a entrega do Rosário, são tradição e vêm assinaladas.',
    corpo: `<nav class="indice-temas" aria-label="${T('Ordens')}"><ul>${ORDENS.map((o) => `<li><a href="#${o.slug}">${T(o.nome)}</a></li>`).join('')}</ul></nav>${lista}
<p class="nota-peq">${T('Há muitas outras ordens com forte ligação a Maria, como os beneditinos, os agostinianos e os monfortinos. A seleção reúne as mais pedidas e as de maior impacto na devoção.')} <a href="${href('santos/')}">${T('Maria e os santos')}</a> · <a href="${href('sacramentais/')}">${T('Escapulários e medalhas')}</a></p>`
  })];
}
