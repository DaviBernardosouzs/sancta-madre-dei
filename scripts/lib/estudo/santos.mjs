// Maria e os santos: sete santos e a sua relação com a devoção mariana.
const SANTOS = [
  {
    slug: 'luis-de-montfort', nome: 'São Luís Maria Grignion de Montfort', anos: '1673 a 1716', pais: 'França', titulo: 'Sacerdote e missionário',
    canon: 'Canonizado por Pio XII em 1947',
    resumo: 'Mestre da «consagração total» a Jesus por Maria.',
    relacao: ['Pregador de missões populares no oeste da França, Montfort escreveu o Tratado da verdadeira devoção à Santíssima Virgem e O segredo de Maria, que propõem a consagração total a Jesus Cristo pelas mãos de Maria: entregar-lhe tudo o que se é e se faz, para pertencer mais inteiramente a Cristo.', 'A espiritualidade de Montfort é cristocêntrica: Maria é o caminho mais curto e seguro para Jesus. Fundou a Companhia de Maria (missionários) e as Filhas da Sabedoria.'],
    marcos: [['1673', 'Nasce em Montfort-la-Cane, na Bretanha.'], ['1700', 'Ordenado padre; passa a pregar missões populares.'], ['c. 1712', 'Escreve o Tratado da verdadeira devoção, que ficará esquecido por mais de um século.'], ['1716', 'Morre em Saint-Laurent-sur-Sèvre.'], ['1842', 'O manuscrito do Tratado é encontrado e é publicado no ano seguinte.'], ['1947', 'É canonizado por Pio XII.']],
    legado: 'João Paulo II tomou como lema o Totus Tuus, que vem da consagração de Montfort. Em Dom e mistério (1996) contou que a leitura do Tratado foi um ponto de virada em sua vida, e em Redemptoris Mater (n. 48) cita Montfort.',
    cuidado: 'Montfort usa a imagem do «escravo de amor» de Maria, que hoje muitos preferem exprimir como «entrega» ou «consagração»; a Igreja aprova a consagração como prática piedosa, mas não a exige de ninguém.',
    fontes: [{ titulo: 'São Luís Maria de Montfort (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Louis_de_Montfort' }, { titulo: 'João Paulo II, Redemptoris Mater, n. 48', url: 'https://www.vatican.va/content/john-paul-ii/pt/encyclicals/documents/hf_jp-ii_enc_25031987_redemptoris-mater.html' }]
  },
  {
    slug: 'maximiliano-kolbe', nome: 'São Maximiliano Maria Kolbe', anos: '1894 a 1941', pais: 'Polônia', titulo: 'Frade franciscano conventual e mártir',
    canon: 'Beatificado por Paulo VI em 1971 e canonizado por João Paulo II em 1982',
    resumo: 'Fundador da Milícia da Imaculada; deu a vida em Auschwitz.',
    relacao: ['Kolbe fundou, em Roma, em 16 de outubro de 1917, a Milícia da Imaculada, associação que propõe a consagração à Imaculada como instrumento de evangelização. Em 1922 começou a revista O Cavaleiro da Imaculada e, em 1927, a «cidade» de Niepokalanów, perto de Varsóvia, com uma grande editora.', 'Foi missionário no Japão, em Nagasaki, a partir de 1930. Preso pelos nazistas, foi levado para Auschwitz. Em agosto de 1941, ofereceu-se para morrer no lugar de um companheiro condenado, e foi morto em 14 de agosto, véspera da festa da Assunção.'],
    marcos: [['1917', 'Funda a Milícia da Imaculada em Roma.'], ['1927', 'Funda Niepokalanów, na Polônia.'], ['1930', 'Parte para o Japão e funda uma missão em Nagasaki.'], ['1941', 'É preso e levado a Auschwitz; morre em 14 de agosto.'], ['1971', 'Beatificado por Paulo VI.'], ['1982', 'Canonizado por João Paulo II, como «mártir da caridade».']],
    legado: 'A Milícia da Imaculada continua ativa em muitos países e inspira a devoção à Imaculada como missão.',
    cuidado: 'A fama de Kolbe como «santo de Auschwitz» e a sua devoção à Imaculada devem ser lidas juntas, mas a Igreja reconheceu o martírio por caridade, e não uma doutrina própria dele.',
    fontes: [{ titulo: 'São Maximiliano Kolbe (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Maximilian_Kolbe' }]
  },
  {
    slug: 'joao-paulo-ii', nome: 'São João Paulo II', anos: '1920 a 2005', pais: 'Polônia', titulo: 'Papa de 1978 a 2005',
    canon: 'Beatificado em 2011 e canonizado em 2014',
    resumo: 'O papa do Totus Tuus, de Redemptoris Mater e dos mistérios luminosos.',
    relacao: ['O lema do seu pontificado, Totus Tuus, vem da consagração de Montfort. Na formação em Cracóvia, a leitura do Tratado de Montfort o ajudou a compreender que a devoção a Maria é cristocêntrica. O M do seu brasão lembra a cruz com Maria ao pé.', 'Escreveu a encíclica Redemptoris Mater (1987), para o Ano Mariano de 1987-88, e a carta apostólica Rosarium Virginis Mariae (2002), em que acrescentou ao Rosário os cinco mistérios luminosos e declarou o Ano do Rosário (outubro de 2002 a outubro de 2003).'],
    marcos: [['1978', 'Eleito papa; Totus Tuus no brasão.'], ['1981', 'Sofre um atentado em 13 de maio, dia da primeira aparição de Fátima; atribuiu depois a sua vida a Nossa Senhora de Fátima.'], ['1984', 'Em 25 de março, em Roma, faz o ato de entrega do mundo ao Imaculado Coração de Maria, em união com os bispos.'], ['1987', 'Publica Redemptoris Mater.'], ['2002', 'Publica Rosarium Virginis Mariae e institui os mistérios luminosos.'], ['2014', 'É canonizado.']],
    legado: 'Muitas das peregrinações marianas de seu pontificado (Fátima, Guadalupe, Aparecida, Częstochowa) ficaram como marcos para a devoção mariana contemporânea.',
    cuidado: 'Os mistérios luminosos são uma proposta do papa, não uma obrigação. A relação entre o atentado de 1981 e Fátima foi interpretada pelo próprio papa como graça pessoal; não é doutrina.',
    fontes: [{ titulo: 'João Paulo II, Redemptoris Mater', url: 'https://www.vatican.va/content/john-paul-ii/pt/encyclicals/documents/hf_jp-ii_enc_25031987_redemptoris-mater.html' }, { titulo: 'João Paulo II, Rosarium Virginis Mariae', url: 'https://www.vatican.va/content/john-paul-ii/pt/apost_letters/2002/documents/hf_jp-ii_apl_20021016_rosarium-virginis-mariae.html' }, { titulo: 'João Paulo II (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Pope_John_Paul_II' }]
  },
  {
    slug: 'afonso-de-ligorio', nome: 'Santo Afonso Maria de Ligório', anos: '1696 a 1787', pais: 'Itália', titulo: 'Bispo, fundador e doutor da Igreja',
    canon: 'Canonizado em 1839 e proclamado doutor da Igreja por Pio IX em 1871',
    resumo: 'Autor de As Glórias de Maria e fundador dos redentoristas.',
    relacao: ['Jurista que se tornou padre, Afonso fundou em 1732 a Congregação do Santíssimo Redentor, os redentoristas, para evangelizar os pobres do campo napolitano. Escreveu as Glórias de Maria (1750), comentário da Salve Rainha e das festas de Maria, e as Visitas ao Santíssimo Sacramento e a Maria Santíssima.', 'Seu estilo é afetuoso e popular. As Glórias de Maria difundiram a ideia de que Maria é a medianeira por quem passam as graças, e a prática do Rosário e do escapulário.'],
    marcos: [['1696', 'Nasce em Marianella, perto de Nápoles.'], ['1732', 'Funda os redentoristas.'], ['1750', 'Publica as Glórias de Maria.'], ['1762', 'Torna-se bispo de Sant\'Agata dei Goti.'], ['1787', 'Morre em Pagani.'], ['1871', 'É proclamado doutor da Igreja.']],
    legado: 'Seus escritos fixaram, para o catolicismo popular, o vocabulário afetivo da devoção mariana e a prática da oração à Mãe de Deus.',
    cuidado: 'A fórmula de Afonso de que «todas as graças passam por Maria» é uma opinião teológica dele, retomada por outros, e não um dogma. A nota Mater Populi fidelis (2025) pede cautela com os títulos que dela derivam.',
    fontes: [{ titulo: 'Santo Afonso de Ligório (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Alphonsus_Liguori' }, 'dossie-s51']
  },
  {
    slug: 'bernardo-de-claraval', nome: 'São Bernardo de Claraval', anos: '1090 a 1153', pais: 'França', titulo: 'Abade cisterciense e doutor da Igreja',
    canon: 'Canonizado em 1174 e proclamado doutor da Igreja em 1830',
    resumo: 'O «cantor de Maria» da Idade Média e da Estrela do mar.',
    relacao: ['Abade de Claraval, Bernardo escreveu homilias sobre o anjo Gabriel (Louvores da Virgem Mãe, sobre Super missus est), onde meditou a Anunciação e o «sim» de Maria. A sua exortação «olha a estrela, invoca Maria» tornou-se clássica: nos perigos do mar da vida, Maria é a estrela que guia.', 'É figura do pensamento mariano medieval. Na Divina comédia, Dante o escolhe como guia para a visão final, e é Bernardo quem reza a Maria no último canto do Paraíso.'],
    marcos: [['1090', 'Nasce perto de Dijon.'], ['1115', 'Funda a abadia de Claraval.'], ['c. 1140', 'Escreve contra a festa da Conceição de Maria.'], ['1153', 'Morre em Claraval.'], ['1830', 'É proclamado doutor da Igreja.']],
    legado: 'Os cistercienses consagraram a Maria todas as suas abadias, e Bernardo foi apelidado «o cantor de Maria».',
    cuidado: 'Duas atribuições comuns são falsas ou incertas: o Memorare não é de Bernardo (é de data muito posterior) e o fim da Salve Rainha («ó clemente, ó piedosa, ó doce Virgem Maria») ligado a ele é lenda. Bernardo também se opôs à festa da Imaculada Conceição.',
    fontes: [{ titulo: 'São Bernardo de Claraval (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Bernard_of_Clairvaux' }]
  },
  {
    slug: 'teresinha', nome: 'Santa Teresinha do Menino Jesus', anos: '1873 a 1897', pais: 'França', titulo: 'Carmelita e doutora da Igreja',
    canon: 'Canonizada em 1925 e proclamada doutora da Igreja por João Paulo II em 1997',
    resumo: 'A Maria «mais mãe que rainha» do pequeno caminho.',
    relacao: ['Aos nove anos, em 13 de maio de 1883, doente, Teresa disse ter visto a imagem de Nossa Senhora sorrir para ela e se curou. No Carmelo de Lisieux, escreveu poemas, entre eles «Por que te amo, ó Maria», de maio de 1897, um dos seus últimos.', 'Nas últimas conversas, disse que, se fosse sacerdote, falaria de Maria mostrando que ela é «mais mãe do que rainha», imitável em sua vida simples. É uma Maria próxima, que vive a fé na penumbra, como todos.'],
    marcos: [['1873', 'Nasce em Alençon.'], ['1883', 'Cura atribuída ao sorriso da Virgem.'], ['1888', 'Entra no Carmelo de Lisieux.'], ['1897', 'Escreve «Por que te amo, ó Maria»; morre em 30 de setembro.'], ['1925', 'É canonizada.'], ['1997', 'É proclamada doutora da Igreja.']],
    legado: 'Seu modo de falar de Maria, simples e sem triunfalismo, influenciou a espiritualidade do século XX e a atual do Vaticano II.',
    cuidado: 'A cura de 1883 é relato da própria Teresa; não foi examinada como milagre. Ela nunca disse «mais mãe que rainha» em texto escrito; a fórmula vem das conversas finais, transmitidas pela comunidade.',
    fontes: [{ titulo: 'Santa Teresa de Lisieux (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Th%C3%A9r%C3%A8se_of_Lisieux' }]
  },
  {
    slug: 'joao-bosco', nome: 'São João Bosco', anos: '1815 a 1888', pais: 'Itália', titulo: 'Sacerdote e fundador dos salesianos',
    canon: 'Canonizado por Pio XI em 1934',
    resumo: 'Apóstolo da juventude e propagador de Maria Auxiliadora.',
    relacao: ['Dom Bosco conta, nas Memórias do Oratório, um sonho que teve aos nove anos, em que uma mulher de aspecto majestoso lhe indicava a missão entre os meninos. Mais tarde, deu a Maria o título de Auxiliadora e construiu em Turim, entre 1863 e 1868, a basílica de Maria Auxiliadora, em Valdocco.', 'Fundou os salesianos (aprovados em 1874) e, com Maria Mazzarello, as Filhas de Maria Auxiliadora (1872). Considerava a devoção a Maria um dos pilares da sua pedagogia, ao lado da Eucaristia e da confissão.'],
    marcos: [['1815', 'Nasce em Castelnuovo.'], ['1859', 'Funda a Sociedade Salesiana.'], ['1868', 'Consagra a basílica de Maria Auxiliadora em Turim.'], ['1872', 'Funda com Maria Mazzarello as Filhas de Maria Auxiliadora.'], ['1888', 'Morre em Turim.'], ['1934', 'É canonizado.']],
    legado: 'A devoção a Maria Auxiliadora tornou-se uma das mais populares do mundo salesiano, e muitos santuários levam esse título.',
    cuidado: 'O sonho dos nove anos é relato do próprio Dom Bosco, escrito décadas depois; a Igreja o toma como parte da sua história espiritual, e não como fato comprovado.',
    fontes: [{ titulo: 'Salesianos de Dom Bosco (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Salesians_of_Don_Bosco' }, { titulo: 'São João Bosco (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/John_Bosco' }]
  }
];

export function santos(c) {
  const { T, tags, fontes, pagina, href, esc, ver } = c;
  const paginas = SANTOS.map((s) => pagina({
    path: `santos/${s.slug}/`, titulo: s.nome, trilha: [['Maria e os santos', 'santos/']],
    lede: s.resumo,
    descricao: `${s.nome} e a devoção mariana: ${s.resumo}`,
    corpo: `${tags([['historia', s.anos], ['eclesial', s.canon]])}
<dl class="ficha-dl"><dt>${T('Vida')}</dt><dd>${esc(s.anos)}, ${T(s.pais)}</dd><dt>${T('Quem foi')}</dt><dd>${T(s.titulo)}</dd><dt>${T('Reconhecimento')}</dt><dd>${T(s.canon)}</dd></dl>
<section aria-labelledby="rel-t"><h2 id="rel-t">${T('A relação com Maria')}</h2>${s.relacao.map((p) => `<p>${T(p)}</p>`).join('')}</section>
<section aria-labelledby="mar-t"><h2 id="mar-t">${T('Marcos')}</h2><ol class="linha-tempo">${s.marcos.map(([a, t]) => `<li><span class="lt__ano">${esc(a)}</span><div class="lt__corpo"><p>${T(t)}</p></div></li>`).join('')}</ol></section>
<section aria-labelledby="leg-t"><h2 id="leg-t">${T('Legado')}</h2><p>${T(s.legado)}</p>${c.cuidado(s.cuidado)}</section>
<section aria-labelledby="fon-t"><h2 id="fon-t">${T('Fontes')}</h2>${fontes(s.fontes)}</section>
<nav class="dogma-nav" aria-label="${T('Outros santos')}"><ul>${SANTOS.filter((o) => o.slug !== s.slug).map((o) => `<li><a href="${href(`santos/${o.slug}/`)}">${T(o.nome.replace(/^(São|Santo|Santa) /, ''))}</a></li>`).join('')}</ul></nav>`
  }));
  const indice = pagina({
    path: 'santos/', titulo: 'Maria e os santos',
    lede: 'Sete santos que fizeram da devoção a Maria um caminho para Cristo. Cada página diz o que o santo escreveu e viveu, o que a Igreja reconheceu e o que é relato ou opinião.',
    descricao: 'Montfort, Kolbe, João Paulo II, Afonso de Ligório, Bernardo de Claraval, Teresinha e João Bosco: a relação de cada santo com a devoção mariana.',
    nota: 'Há centenas de santos devotos de Maria. A seleção reúne os mais pedidos e os que deixaram escritos ou obras que moldaram a devoção.',
    corpo: `<ul class="grade-cartoes">${SANTOS.map((s) => `<li><a href="${href(`santos/${s.slug}/`)}"><span class="gc__m">${esc(s.anos)}</span><span class="gc__t">${T(s.nome)}</span><span class="gc__r">${T(s.resumo)}</span></a></li>`).join('')}</ul>
<p class="nota-peq">${T('Os títulos «santo», «doutor da Igreja» e «mártir» têm sentidos distintos: veja a data de canonização de cada um. As consagrações propostas por eles são práticas piedosas, não obrigações.')} <a href="${href('ordens/')}">${T('Ordens religiosas e Maria')}</a> · <a href="${href('biblioteca-mariana/')}">${T('Biblioteca Mariana')}</a></p>`
  });
  return [indice, ...paginas];
}
