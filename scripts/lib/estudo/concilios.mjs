// Concílios e Éfeso: visão geral do que cada concílio disse sobre Maria e uma experiência visual por Éfeso.
import { projetar, caminhoTerra, arco } from '../mapa-regional.mjs';

const CONCILIOS = [
  { ano: '381', nome: 'Constantinopla I', tipo: 'Ecumênico', maria: 'O Credo professa que Jesus «se encarnou do Espírito Santo e da Virgem Maria». É a primeira vez que Maria entra num credo ecumênico.', grupo: 'cristologia' },
  { ano: '431', nome: 'Éfeso', tipo: 'Ecumênico', maria: 'Confirma que Maria é Theotokos, Mãe de Deus, como consequência da unidade da pessoa de Cristo.', grupo: 'cristologia', pagina: 'concilios/efeso/' },
  { ano: '451', nome: 'Calcedônia', tipo: 'Ecumênico', maria: 'A definição de fé diz que Cristo nasceu «de Maria, Virgem e Mãe de Deus, segundo a humanidade», e afirma as duas naturezas numa só pessoa.', grupo: 'cristologia' },
  { ano: '553', nome: 'Constantinopla II', tipo: 'Ecumênico', maria: 'Chama Maria de «gloriosa sempre virgem, Mãe de Deus»; é a base conciliar da virgindade perpétua.', grupo: 'virgindade' },
  { ano: '649', nome: 'Sínodo de Latrão', tipo: 'Sínodo romano', maria: 'Condena quem negar que Maria é santa Mãe de Deus, sempre virgem e imaculada, e que concebeu e deu à luz sem corrupção. Não é um concílio ecumênico, mas foi acolhido pela tradição.', grupo: 'virgindade' },
  { ano: '787', nome: 'Niceia II', tipo: 'Ecumênico', maria: 'Defende o culto das imagens sagradas, entre elas as da Mãe de Deus. Distingue a veneração da adoração, que só se dá a Deus.', grupo: 'culto' },
  { ano: '1215', nome: 'Latrão IV', tipo: 'Ecumênico', maria: 'A profissão de fé diz que o Filho de Deus se encarnou «da Virgem Maria sempre virgem, com a cooperação do Espírito Santo».', grupo: 'virgindade' },
  { ano: '1546', nome: 'Trento', tipo: 'Ecumênico', maria: 'No decreto sobre o pecado original, diz que não pretende incluir nele «a bem-aventurada e imaculada Virgem Maria»; regula a invocação e as imagens dos santos.', grupo: 'culto' },
  { ano: '1964', nome: 'Vaticano II', tipo: 'Ecumênico', maria: 'Dedica à Virgem o capítulo VIII da Lumen Gentium (nn. 52-69), inserindo a mariologia dentro do mistério de Cristo e da Igreja.', grupo: 'igreja', pagina: 'biblioteca-mariana/' }
];

const PASSOS = [
  { quando: 'Século III em diante', t: 'O título circula', txt: 'Os cristãos de língua grega chamam Maria de Theotokos, «a que deu à luz Deus». É uso do culto, não de teoria.', destaca: '', estado: 'todos' },
  { quando: 'Natal de 428', t: 'Nestório recusa «Mãe de Deus»', txt: 'O patriarca de Constantinopla teme que o título mistura as naturezas de Cristo e prefere «Mãe de Cristo». Seu zelo é distinguir o divino do humano.', destaca: 'nestorio', estado: 'nestorio' },
  { quando: '429-430', t: 'Cirilo de Alexandria responde', txt: 'Cirilo escreve a Nestório e ao papa Celestino I. Em Roma, um sínodo de agosto de 430 apoia Cirilo. A tese: se o Filho de Maria não fosse o Filho de Deus, haveria dois sujeitos em Cristo.', destaca: 'cirilo roma', estado: 'cirilo' },
  { quando: 'Novembro de 430', t: 'O imperador convoca o concílio', txt: 'Teodósio II chama os bispos para Éfeso, para o Pentecostes de 431.', destaca: 'cirilo nestorio joao roma', estado: 'cirilo' },
  { quando: '22 de junho de 431', t: 'Abre-se o Concílio', txt: 'Cirilo preside antes de os bispos de Antioquia chegarem. Cerca de duzentos bispos se reúnem na igreja de Maria. Nestório não comparece; a carta de Cirilo é aprovada e Nestório é deposto no mesmo dia.', destaca: 'cirilo nestorio', estado: 'concilio' },
  { quando: 'Fim de junho de 431', t: 'João de Antioquia chega e reage', txt: 'João e os bispos orientais, chegados depois, reúnem outro sínodo, que depõe Cirilo. O imperador, dividido, mantém todos sob vigilância.', destaca: 'joao', estado: 'rival' },
  { quando: 'Julho de 431', t: 'Chegam os legados de Roma', txt: 'Os enviados do papa Celestino confirmam a condenação de Nestório e a doutrina de Cirilo.', destaca: 'roma', estado: 'concilio' },
  { quando: '433', t: 'Fórmula de União', txt: 'Cirilo e João chegam a um acordo: reconhecem um só Cristo, Deus perfeito e homem perfeito, e chamam a Virgem Theotokos. O título está firme.', destaca: 'cirilo joao', estado: 'uniao' }
];

function mapa(esc, t) {
  const v = projetar({ lat: [29.0, 45.5], lng: [9.0, 41.5], w: 780 });
  const { p } = v;
  const pts = {
    alexandria: [p(31.2, 29.92), 'Alexandria'], antioquia: [p(36.20, 36.16), 'Antioquia'], constantinopla: [p(41.01, 28.98), 'Constantinopla'],
    efeso: [p(37.94, 27.34), 'Éfeso'], roma: [p(41.90, 12.50), 'Roma']
  };
  const ef = pts.efeso[0];
  const rotas = [
    ['cirilo', pts.alexandria[0], 1, 'Cirilo e os bispos do Egito'], ['nestorio', pts.constantinopla[0], -1, 'Nestório'],
    ['joao', pts.antioquia[0], -1, 'João e os bispos orientais'], ['roma', pts.roma[0], 1, 'Legados do papa Celestino I']
  ];
  const linhas = rotas.map(([ator, de, lado, rotulo]) => {
    const a = arco(de, ef, lado, 0.2);
    return `<g class="ef-rota" data-ator="${ator}"><path class="ef-rota__fundo" d="${a.d}"/><path class="ef-rota__linha" d="${a.d}"/><title>${esc(t(rotulo))}</title></g>`;
  }).join('');
  const cidades = Object.entries(pts).map(([id, [[x, y], nome]]) => {
    const dx = id === 'efeso' ? -12 : id === 'roma' ? 0 : 12, dy = id === 'roma' ? -12 : id === 'efeso' ? 22 : 5, an = id === 'efeso' ? 'end' : id === 'roma' ? 'middle' : 'start';
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})" class="ef-cidade${id === 'efeso' ? ' ef-cidade--efeso' : ''}"><circle class="ef-cidade__halo" r="${id === 'efeso' ? 13 : 9}"/><circle class="ef-cidade__ponto" r="${id === 'efeso' ? 6 : 4.2}"/><text x="${dx}" y="${dy}" text-anchor="${an}">${esc(t(nome))}</text></g>`;
  }).join('');
  return `<svg class="ef-mapa" viewBox="0 0 ${v.w} ${v.h}" role="img" aria-label="${esc(t('Mapa do Mediterrâneo oriental: de Alexandria, Antioquia, Constantinopla e Roma, as delegações convergem para Éfeso'))}" focusable="false">
  <defs><radialGradient id="ef-mar" cx="55%" cy="50%" r="80%"><stop offset="0" stop-color="#1b2b66"/><stop offset="1" stop-color="#0a1030"/></radialGradient></defs>
  <rect width="${v.w}" height="${v.h}" fill="url(#ef-mar)"/>
  <path class="ef-terra" d="${caminhoTerra(v)}"/>
  ${linhas}${cidades}
</svg>`;
}

export function concilios(c) {
  const { T, tags, paras, ver, fontes, pagina, esc, href, _, linha } = c;
  const lista = CONCILIOS.map((x) => `<li class="conc" data-grupo="${x.grupo}"><span class="conc__ano">${x.ano}</span><div class="conc__corpo"><h3 class="conc__t">${x.pagina ? `<a href="${href(x.pagina)}">${T(x.nome)}</a>` : T(x.nome)} <span class="conc__tipo">${T(x.tipo)}</span></h3><p>${T(x.maria)}</p></div></li>`).join('');
  const passos = PASSOS.map((s, i) => `<li class="passo" data-estado="${s.estado}" data-destaca="${s.destaca}"><span class="passo__quando">${T(s.quando)}</span><h3 class="passo__t">${T(s.t)}</h3><p>${T(s.txt)}</p></li>`).join('');
  const indice = pagina({
    path: 'concilios/', titulo: 'Concílios e Maria',
    lede: 'Os concílios não fizeram um tratado sobre Maria. Falaram dela para proteger o que diziam de Cristo. É por isso que cada decisão mariana é, antes, uma decisão sobre quem é Jesus.',
    descricao: 'O que os concílios, de Constantinopla I ao Vaticano II, afirmaram sobre Maria, com destaque para o Concílio de Éfeso e o título Theotokos.',
    corpo: `<p class="cta-efeso"><a class="botao" href="${href('concilios/efeso/')}">${T('Viagem visual por Éfeso (431)')}</a></p>
<ol class="conc-lista">${lista}</ol>
<section aria-labelledby="ler-c"><h2 id="ler-c">${T('Ler e conferir')}</h2>${fontes(['dossie-s08', 'lumen-gentium-pt', { titulo: 'Concílio de Éfeso (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Council_of_Ephesus' }, { titulo: 'Atos e cartas do Concílio de Éfeso (tradução inglesa, New Advent)', url: 'https://www.newadvent.org/fathers/3810.htm' }])}
<p class="nota-peq">${T('As citações dos concílios resumem o conteúdo; para o texto inteiro, consulte as coleções de documentos conciliares.')} <a href="${href('dogmas/')}">${T('Os quatro dogmas')}</a> · <a href="${href('biblioteca-mariana/')}">${T('Biblioteca Mariana')}</a></p></section>`
  });
  const efeso = pagina({
    path: 'concilios/efeso/', titulo: 'Éfeso e o título Theotokos', trilha: [['Concílios', 'concilios/']], art: { id: 'obra-raphael-entronizada' },
    lede: 'Em 431, numa igreja dedicada a Maria, cerca de duzentos bispos decidiram uma pergunta que parecia de palavras e era de fé: quem nasceu de Maria?',
    descricao: 'Viagem visual pelo Concílio de Éfeso: mapa, linha do tempo passo a passo e o diagrama dos dois modos de dizer o título Theotokos, Mãe de Deus.',
    nota: 'Passo a passo: use os botões para percorrer os acontecimentos. O mapa mostra de onde vinha cada delegação, e o quadro, as duas formas de entender o título.',
    corpo: `${tags([['dogma', 'Éfeso, 431'], ['historia', 'Atos do concílio e cartas de Cirilo'], ['escritura', 'Lc 1,43; Jo 1,14']])}
<section class="efeso" aria-labelledby="ef-t">
  <h2 id="ef-t">${T('Passo a passo')}</h2>
  <div class="efeso__grade">
    <div class="efeso__visual" id="efeso-visual" data-estado="todos">
      <figure class="ef-mapa-fig">${mapa(esc, _)}</figure>
    </div>
    <div class="passos" data-passos data-alvo="efeso-visual dm">
      <div class="passos__controles" hidden><button type="button" class="pbotao pbotao--ouro" data-auto aria-pressed="false">${T('Percorrer')}</button><button type="button" class="pbotao" data-ant>${T('Anterior')}</button><button type="button" class="pbotao" data-prox>${T('Próximo')}</button><button type="button" class="pbotao" data-todos>${T('Mostrar tudo')}</button></div>
      <ol class="passos__lista">${passos}</ol>
    </div>
  </div>
</section>
<section aria-labelledby="dm-t">
  <h2 id="dm-t">${T('Dois modos de dizer')}</h2>
  <p>${T('A discussão não era se Maria é importante, mas como falar do que ela deu à luz. O quadro compara as duas posições de 428-431. Escolha um passo acima para ver o que cada lado enfatiza.')}</p>
  <div class="dm" id="dm" data-estado="todos">
    <figure class="dm__lado dm__lado--n"><figcaption><strong>${T('Mãe de Cristo')}</strong> <span>${T('preocupação de Nestório')}</span></figcaption>
      <div class="dm__pilha"><div class="dm__caixa dm__caixa--verbo">${T('O Verbo, Filho eterno de Deus')}</div><div class="dm__liga">${T('unidos')}</div><div class="dm__caixa dm__caixa--homem">${T('O homem Jesus')}</div></div>
      <div class="dm__maria dm__maria--baixo">${T('Maria')}<i></i></div>
      <p>${T('Distingue com cuidado o que é divino e o que é humano em Cristo. Teme que dizer «Mãe de Deus» faça pensar que a divindade começou em Maria.')}</p></figure>
    <figure class="dm__lado dm__lado--c"><figcaption><strong>${T('Mãe de Deus')}</strong> <span>${T('tese de Cirilo, confirmada em Éfeso')}</span></figcaption>
      <div class="dm__pilha"><div class="dm__caixa dm__caixa--uno"><span>${T('O Filho eterno, o Verbo feito carne')}</span><em>${T('natureza divina')}</em><em>${T('natureza humana')}</em></div></div>
      <div class="dm__maria dm__maria--uno">${T('Maria')}<i></i></div>
      <p>${T('Há uma só pessoa. O mesmo Filho que nasce eternamente do Pai nasce de Maria, na humanidade. Maria não gera a divindade: gera a pessoa do Filho, que é Deus.')}</p></figure>
  </div>
</section>
<section aria-labelledby="dc-t"><h2 id="dc-t">${T('O que Éfeso decidiu e o que não decidiu')}</h2>
<ul class="lista-ctrv">
<li>${T('Decidiu que o Filho nascido de Maria é o Verbo de Deus encarnado, e por isso Maria é Theotokos. Aprovou a segunda carta de Cirilo a Nestório e depôs Nestório.')}</li>
<li>${T('Não definiu uma doutrina geral sobre Maria. A decisão é cristológica; o que se diz de Maria vem dela como consequência.')}</li>
<li>${T('Não encerrou a querela: a Fórmula de União (433) e o Concílio de Calcedônia (451) continuaram o trabalho. Parte dos cristãos do Oriente, que não aceitou Éfeso, formou a Igreja Assíria do Oriente.')}</li>
</ul></section>
<section aria-labelledby="eh-t"><h2 id="eh-t">${T('Éfeso hoje')}</h2>
${paras(['Em Éfeso, restam as ruínas da grande igreja de Maria, onde o concílio se reuniu. A poucos quilômetros fica a Casa de Maria, lugar de peregrinação cuja ligação com a vida de Maria não é provada; a Igreja não se pronunciou sobre isso.', 'Em 1994, João Paulo II e o patriarca da Igreja Assíria do Oriente assinaram uma declaração cristológica comum, que reconhece Maria como «Mãe de Cristo nosso Deus e Salvador».'])}
<p>${ver('sh-efeso', 'Ver o santuário da Casa de Maria, em Éfeso')} · <a href="${href('dogmas/mae-de-deus/')}">${T('O dogma da Mãe de Deus')}</a> · <a href="${href('padres/')}">${T('Padres da Igreja')}</a></p></section>
<section aria-labelledby="fo-t"><h2 id="fo-t">${T('Fontes')}</h2>${fontes(['dossie-s08', 'bento-xvi-efeso-2006', { titulo: 'Atos e cartas do Concílio de Éfeso (tradução inglesa, New Advent)', url: 'https://www.newadvent.org/fathers/3810.htm' }, { titulo: 'Concílio de Éfeso (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Council_of_Ephesus' }])}</section>`
  });
  return [indice, efeso];
}
