// Relíquias e tradições marianas: cada item separa tradição, documentação histórica e reconhecimento eclesial.
const ITENS = [
  {
    id: 'loreto', nome: 'A Santa Casa de Loreto', lugar: 'Loreto, Itália', santuario: 'sh-loreto',
    tradicao: 'A casa de Maria em Nazaré teria sido levada por anjos, em 1291, para Tersatto (hoje Rijeka, na Croácia) e, em 1294, para Loreto.',
    historia: 'O santuário de Loreto é documentado como centro de peregrinação a partir dos séculos XIV e XV. O primeiro relato escrito da translação é de 1472, quase dois séculos depois do suposto fato. A Santa Casa é um conjunto de três muros de pedra, sem o quarto lado, encerrado numa grande basílica; escavações no século XX estudaram suas fundações e a origem dos blocos, com conclusões discutidas.',
    eclesial: 'Papas aprovaram o santuário e as peregrinações, e a festa de 10 de dezembro consta do calendário próprio do lugar. Em 1920, Bento XV declarou Nossa Senhora de Loreto padroeira dos aviadores. A Igreja não ensina como fé que a casa foi transportada por anjos.',
    fontes: ['wp-sh-loreto']
  },
  {
    id: 'chartres', nome: 'A Santa Túnica de Chartres (Sancta Camisa)', lugar: 'Chartres, França', santuario: 'sh-chartres',
    tradicao: 'Um tecido que seria a veste (ou o véu) usada por Maria no nascimento de Jesus. Segundo a tradição, foi dado à igreja de Chartres por Carlos, o Calvo, em 876.',
    historia: 'A relíquia é venerada em Chartres desde a Idade Média, e a catedral gótica foi construída em parte por causa dela. Em 1194, um incêndio destruiu a igreja antiga, e a relíquia, que se julgava perdida, foi encontrada intacta na cripta, o que impulsionou a reconstrução. O tecido foi estudado no século XX, sem que isso resolva a questão de sua origem.',
    eclesial: 'O culto é aprovado e o santuário é um dos mais antigos da França. A Igreja não decidiu sobre a autenticidade do tecido como veste de Maria.',
    fontes: ['wp-sh-chartres']
  },
  {
    id: 'prato', nome: 'A Santa Cintura (Sacra Cintola) de Prato', lugar: 'Prato, Itália', santuario: null,
    tradicao: 'Segundo a tradição, Maria teria deixado cair a sua cintura ao ser elevada ao céu, para que o apóstolo Tomé a recebesse como sinal.',
    historia: 'A relíquia está em Prato, na Toscana, desde o século XII, segundo a tradição trazida de Jerusalém por um cidadão de Prato por volta de 1141. É um cordão de lã com fio de ouro. É exposta em poucas ocasiões do ano.',
    eclesial: 'O culto é aprovado e popular na região; a Igreja não decidiu sobre a origem do objeto. Como a doutrina da Assunção ensina que o corpo de Maria foi elevado ao céu, não existem relíquias do corpo de Maria, e as chamadas relíquias marianas são objetos que, segundo a tradição, estiveram em contato com ela.',
    fontes: [{ titulo: 'Sacra Cintola (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Sacra_Cintola' }]
  },
  {
    id: 'efeso', nome: 'A Casa de Maria em Éfeso', lugar: 'Éfeso (Turquia)', santuario: 'sh-efeso',
    tradicao: 'Segundo uma tradição local, Maria teria passado os últimos anos de vida numa casa nas colinas perto de Éfeso, com o apóstolo João.',
    historia: 'A casa foi identificada em 1891 por sacerdotes de Esmirna, a partir das visões de Anna Katharina Emmerick (1774-1824) registradas por Clemens Brentano. As ruínas encontradas têm estrutura dos séculos VI-VII, sobre fundações mais antigas; nenhuma prova liga o lugar à vida de Maria.',
    eclesial: 'A Igreja não se pronunciou sobre a autenticidade. Paulo VI (1967), João Paulo II (1979) e Bento XVI (2006) visitaram o lugar como santuário mariano; Bento XVI falou ali da fé na Mãe de Deus. A Igreja deixa em aberto onde Maria viveu e foi sepultada.',
    fontes: ['wp-sh-efeso', 'bento-xvi-efeso-2006']
  },
  {
    id: 'tumba', nome: 'O Túmulo de Maria em Jerusalém', lugar: 'Vale do Cedron, Jerusalém', santuario: 'sh-tumba-maria',
    tradicao: 'Maria teria sido sepultada em Jerusalém, no vale do Cedron, perto de Getsêmani, de onde foi elevada ao céu.',
    historia: 'Há um lugar venerado como sepulcro de Maria desde a Antiguidade tardia; a igreja que o guarda tem estrutura de origem bizantina e cruzada, e hoje pertence à Igreja ortodoxa grega e à armênia. As narrativas antigas do «trânsito» de Maria não são história: mostram a fé na sua glória. O túmulo está vazio, segundo a tradição.',
    eclesial: 'O dogma da Assunção (1950) não decide onde Maria viveu, onde foi sepultada, nem se morreu antes da Assunção.',
    fontes: ['wp-sh-tumba-maria', 'ce-tumba-maria']
  },
  {
    id: 'pilar', nome: 'Nossa Senhora do Pilar', lugar: 'Saragoça, Espanha', santuario: 'sh-pilar',
    tradicao: 'Maria teria aparecido ao apóstolo Tiago, em Saragoça, no ano 40, sobre um pilar de jaspe, pedindo que se construísse ali uma capela.',
    historia: 'As fontes escritas que mencionam a aparição são medievais, muito depois do século I. O pilar é venerado numa basílica barroca, que é um dos grandes santuários marianos da Espanha. Não há documentação contemporânea da aparição.',
    eclesial: 'O culto é aprovado e o santuário tem o título de basílica. A Igreja não ensina como fé que a aparição ocorreu em 40 d.C.',
    fontes: ['wp-sh-pilar', { titulo: 'Nossa Senhora do Pilar (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Our_Lady_of_the_Pillar' }]
  },
  {
    id: 'leite', nome: 'A Gruta do Leite', lugar: 'Belém, Terra Santa', santuario: null,
    tradicao: 'Maria teria amamentado Jesus numa gruta, e uma gota de leite teria caído na pedra, que ficou branca.',
    historia: 'Há uma gruta venerada em Belém desde a época bizantina, hoje cuidada pela Custódia da Terra Santa. As mães, cristãs e muçulmanas, a visitam. O pó da gruta é usado em devoção.',
    eclesial: 'A Igreja acolhe a devoção como tradição local; não decide sobre a origem da gruta. A Custódia a apresenta como lugar de oração e de memória.',
    fontes: [{ titulo: 'Gruta do Leite (Wikipédia em inglês)', url: 'https://en.wikipedia.org/wiki/Milk_Grotto' }, 'custodia-belem']
  }
];

export function reliquias(c) {
  const { T, tags, fontes, pagina, href, ver } = c;
  const cartoes = ITENS.map((i) => `<article class="cartao" id="${i.id}" aria-labelledby="${i.id}-t">
  <h2 id="${i.id}-t" class="cartao__nome">${T(i.nome)}</h2><p class="cartao__sub">${T(i.lugar)}</p>
  <dl class="niveis">
    <div class="nivel nivel--tradicao"><dt>${T('Tradição')}</dt><dd>${T(i.tradicao)}</dd></div>
    <div class="nivel nivel--historia"><dt>${T('Documentação histórica')}</dt><dd>${T(i.historia)}</dd></div>
    <div class="nivel nivel--eclesial"><dt>${T('Reconhecimento eclesial')}</dt><dd>${T(i.eclesial)}</dd></div>
  </dl>
  ${i.santuario ? `<p>${ver(i.santuario, 'Ver a página do santuário')}</p>` : ''}
  ${fontes(i.fontes)}
</article>`).join('');
  return [pagina({
    path: 'reliquias/', titulo: 'Relíquias e tradições marianas',
    lede: 'Lugares e objetos ligados a Maria pela tradição. Em cada um, três perguntas separadas: o que a tradição conta, o que os documentos mostram e o que a Igreja reconhece.',
    descricao: 'Santa Casa de Loreto, Santa Túnica de Chartres, Santa Cintura de Prato, Casa de Maria em Éfeso, Túmulo de Maria, Pilar de Saragoça e Gruta do Leite: tradição, história e reconhecimento da Igreja.',
    nota: 'Uma tradição pode ser antiga e amada sem estar documentada, e pode ter culto aprovado sem que a Igreja afirme os fatos que a tradição conta. A página separa as três coisas em cada caso.',
    corpo: `<section aria-labelledby="tres-t"><h2 id="tres-t">${T('Três perguntas')}</h2>
<dl class="niveis">
<div class="nivel nivel--tradicao"><dt>${T('Tradição')}</dt><dd>${T('O que a memória de um lugar ou de um povo conta, muitas vezes por séculos. Pode ter um núcleo histórico, mas a tradição, por si só, não o prova.')}</dd></div>
<div class="nivel nivel--historia"><dt>${T('Documentação histórica')}</dt><dd>${T('O que as fontes escritas e a arqueologia permitem afirmar, e a partir de quando. É a pergunta dos historiadores.')}</dd></div>
<div class="nivel nivel--eclesial"><dt>${T('Reconhecimento eclesial')}</dt><dd>${T('O que a Igreja aprovou: o culto, o santuário, a festa. Aprovar o culto não é declarar que os fatos narrados aconteceram.')}</dd></div></dl>
<p>${T('Não há relíquias do corpo de Maria. A fé católica ensina que ela foi elevada ao céu em corpo e alma (dogma da Assunção). Por isso, as «relíquias marianas» são objetos, ou lugares, que a tradição ligou a ela.')}</p></section>
<nav class="indice-temas" aria-label="${T('Itens')}"><ul>${ITENS.map((i) => `<li><a href="#${i.id}">${T(i.nome)}</a></li>`).join('')}</ul></nav>
<div class="cartoes">${cartoes}</div>
<p class="nota-peq">${T('Este é um recorte. Muitos santuários marianos têm imagens e objetos venerados; veja a página dos santuários, onde cada um é tratado com o seu grau de documentação.')} <a href="${href('santuarios/')}">${T('Santuários')}</a> · <a href="${href('dogmas/assuncao/')}">${T('O dogma da Assunção')}</a> · <a href="${href('maria-pelo-mundo/')}">${T('Maria pelo mundo')}</a></p>`
  })];
}
