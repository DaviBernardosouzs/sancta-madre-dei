# Expansão editorial de 8 de outubro de 2026: matriz de trabalho e de evidências

Documento de desenvolvimento (não publicado). Registra o estado encontrado, o que mudou, em que fonte cada afirmação se apoia e o que ficou pendente. Todas as fontes abaixo foram abertas e lidas em 8/10/2026 (texto extraído da página ou do PDF; não foram usados resumos de busca como evidência). Os ids entre crases são os de `content/sources.json`.

## Skill de redação

Não há, entre as skills instaladas, uma skill de redação editorial ou de revisão de textos históricos e religiosos. Foram examinadas as do repositório (`.agents/skills/`, `.claude/skills/`: GSAP, Obsidian, design, defuddle) e as do usuário (`~/.claude/skills/synced/…`, plugins em `~/.claude/plugins/…`). A mais próxima, lida na íntegra e usada só nos princípios compatíveis (escrever para o leitor, começar pelo essencial, ligar em vez de duplicar), foi `engineering:documentation`, em `~/.claude/plugins/synced/d46f8aae-9abc-4f8d-b65c-d4dfd207d15b_dd6d1366-9d36-4ae7-a5cb-b4ebbc8f7a5a/2da0c8d9-1e96-4394-b0f4-3249613186f8/skills/documentation/SKILL.md`. Ela trata de documentação técnica; os critérios editoriais vieram do pedido e de `docs/POLITICA-EDITORIAL.md`.

## 1. Auditoria do estado encontrado e matriz de trabalho

| Conteúdo existente | Lacuna | Fonte disponível | Alteração | Critério de conclusão |
|---|---|---|---|---|
| Aparições: só Lourdes e Fátima | Kibeho, La Salette, Banneux, Knock e Champion existiam só como títulos | Decretos e páginas oficiais já cadastrados; boletim da Sala de Imprensa (Kibeho); sites dos santuários; documentos do DDF (2024-2025) | 10 fichas novas publicadas; 3 rascunhos | Decisão com autoridade, data, documento e fonte lida; narrativa só com o que a fonte diz |
| Títulos com histórico de decisões das cinco aparições | Texto duplicado entre título e futura ficha | Mesmas fontes | Título vira resumo com «página principal» (`mainRecord`) apontando para a ficha | Nenhuma tabela de decisões duplicada; ligação nos dois sentidos |
| Pesquisa de 64 capítulos em `/pesquisa/`, isolada | Sem ligação com as páginas do acervo | `content/pesquisa-documentada.txt` | `content/pesquisa-relacoes.json`: capítulo → página principal; ligação de volta em «Relacionados»; notas de conferência | Validador recusa ligação a rascunho ou id inexistente |
| Milagres: nenhuma ficha; 2 rascunhos | Traynor, Moriau e Raco só na pesquisa | Declaração do arcebispo de Liverpool (PDF); CEF (Moriau); santuário e SIR (Raco) | Traynor e Moriau publicados; Raco segue em rascunho com a falta exata | Ficha só com o texto da decisão do bispo lido |
| Lista de curas de Lourdes: 71 | 72º caso não registrado | Página oficial do santuário (contagem) e página de Raco | Raco acrescentado; contagem com data de conferência | 72 = número informado pelo santuário em 8/10/2026 |
| Orações: 7, sem Pai-Nosso e Ladainha | Texto com procedência não conferido | Vatican News (Pai-Nosso, pt); sítio do Vaticano (Ladainha, pt); carta de 2020 | 2 orações publicadas, com introdução e notas | Texto copiado sem alteração; procedência e direitos registrados |
| Mapa das aparições «adiado» | Coordenadas não verificadas | Wikidata (CC0), item a item | Mapa estático na página de aparições; coordenadas com `refersTo` | Cada ponto diz se é acontecimento, santuário ou localidade |
| Cronologia geral apenas | Sem cronologia por aparição | Fontes de cada ficha | Campo `timeline` e seção «Cronologia» na ficha | Relato, fato documentado e decisão com rótulos distintos |
| Lourdes abria com pintura de outro episódio (Descanso na fuga para o Egito) | Imagem sem relação com o assunto | `retrato-lourdes` (gruta de Massabielle, já no acervo, CC BY-SA 2.0) | Abertura de Lourdes e do catálogo trocada; Fátima abre com a primeira imagem | Imagem do próprio lugar, com crédito |

Estado verificado que divergia da inspeção anterior: o atlas `/maria-pelo-mundo/` já tinha coordenadas verificadas de títulos e santuários (Wikidata); os títulos eram 14 e os santuários 44, como informado.

## 2. Matriz de evidências por lote

### Lote A: aparições

| Afirmação | Fonte | Passagem / observação |
|---|---|---|
| Kibeho: fatos começam em 28/11/1981 no colégio | `kibeho-boletim-2001` | «ces phénomènes insolites ont commencé dans la journée du 28 Novembre 1981, au collège de Kibeho» |
| Kibeho: comissões desde abril de 1982 | `kibeho-boletim-2001` | «à pied d'oeuvre depuis Avril 1982» |
| Kibeho: culto público aprovado em 15/8/1988, por Dom Gahamanyi (Butare), sem juízo sobre as aparições | `kibeho-boletim-2001` | Corrige a lacuna anterior do título («documentos não lidos»): o boletim cita o ato |
| Kibeho: reconhecimento só das três primeiras videntes; «Nyina wa Jambo»; exclusão das aparições de Jesus; adesão livre | `kibeho-boletim-2001` | Pontos 1º a 5º citados no boletim |
| Kibeho: santuário de N. S. das Dores, pedra em 28/11/1992 | `kibeho-boletim-2001` | |
| La Salette: relato dos pastores, idades, descrição da Senhora | `lasalette-santuario-historia` | |
| La Salette: mandamento de 19/9/1851 | `lasalette-bruillard-1851`, `lasalette-santuario-historia` | Tradução inglesa; original não lido |
| La Salette: confirmação de 1855 por Dom Ginoulhiac | `lasalette-santuario-historia` | Documento não lido; prenome não consta da fonte e não foi acrescentado |
| La Salette: leitura de Francisco sobre as lágrimas (2021) | `francisco-angelus-2021-09-19` | Saudação; não é juízo |
| Banneux: oito aparições e frases atribuídas | `banneux-santuario-aparicoes` | Traduções nossas do inglês |
| Banneux: carta pastoral de 22/8/1949 e menções a 1942 e 1947 | `banneux-santuario-reconhecimento` | Substitui como fonte principal a compilação secundária (`banneux-kerkhofs-1949`) |
| Knock: relato, comissões de 1879 e 1935-36 | `knock-historia`, `knock-comissoes` | Linguagem «apareceu» é do santuário; a ficha a atribui |
| Knock: elevação a santuário internacional (2021) | `francisco-knock-2021` | Fonte da Santa Sé agora lida (antes só o santuário) |
| Champion: relato, palavras atribuídas, estudo dos especialistas, decreto de 8/12/2010 | `champion-decreto-2010` | Texto integral lido (reprodução em CatholicCulture.org) |
| Pellevoisin: narrativa, palavras atribuídas, consentimento ao nihil obstat (22/8/2024) | `ddf-pellevoisin-2024` | Lida em italiano; data da cura conferida em 4 línguas |
| Pellevoisin: nascimento, início em fevereiro de 1876, morte de Estelle | `vaticannews-pellevoisin-2024` | |
| Chandavila: 1945, Marcelina e Afra, consentimento ao nihil obstat | `ddf-chandavila-2024` | |
| Medjugorje: nihil obstat, alcance e limites; aprovação de 28/8/2024 | `ddf-medjugorje-2024` | Nota não nomeia os videntes nem dá a data inicial; a ficha usa a mensagem mais antiga citada (26/6/1981) |
| Litmanová: 1990-1995, mensagens excluídas, nihil obstat | `ddf-litmanova-2025` | A carta lida não traz «Ex audientia»; não se afirma aprovação pontifícia |
| Montichiari: juízo doutrinal; não é nihil obstat | `ddf-montichiari-2024` | Classificação própria: `juizo-doutrinal-2024` |
| Coordenadas | `wikidata` | Q1918916 (gruta de Massabielle, acontecimento), Q16592859 (Capelinha, santuário), Q182578/Q106583284 (Kibeho, santuário), Q68164698, Q1044403, Q2364438, Q1102719, Q96099192, Q6121538 (santuários), Q94950 e Q105256 (localidades), Q9392188 (monte Zvir, acontecimento) |

Retirado ou qualificado no ciclo de evidência: «uma estudante relatou» (Kibeho: a fonte não diz que as videntes eram estudantes nem que houve uma primeira); prenome completo de Dom Ginoulhiac; «pessoas do lugar» (Medjugorje: a nota fala em «presumidos videntes»); frase sobre o costume de rezar a Ladainha depois da Salve-Rainha (sem fonte); «perto de Liège» (substituído pela diocese, que a fonte nomeia).

### Lote B: milagres

| Caso | Acontecimento | Análise médica | Decisão eclesial | Situação |
|---|---|---|---|---|
| John Traynor | `lourdes-traynor-2024`: cura em 25/7/1923 | Bureau, 2/10/1926 (Dr. Vallet); revisão de 2023 (Dr. Moriarty); sem voto do CMIL nas fontes lidas | `traynor-declaracao-2024`: Dom Malcolm McMahon, 8/12/2024, texto integral | Publicado |
| Bernadette Moriau | `cef-moriau-2018`: 11/7/2008 | CMIL, 18-19/11/2016, unanimidade menos um voto | `cef-moriau-2018`: Dom Jacques Benoit-Gonnin, 11/2/2018, declaração em primeira pessoa reproduzida pela CEF | Publicado (reprodução possivelmente parcial: registrado na fonte) |
| Antonia Raco | `lourdes-raco-2025`: 2009 | Bureau 2010-2017; CMIL, novembro de 2024 | Autoridade e data lidas (santuário, SIR); **texto da decisão não lido em fonte da Igreja** | Rascunho; consta da lista de curas |

Contagem: página oficial `lourdes-curas` lida em 8/10/2026: «72 have so far been recognised as miraculous by the Church». A lista do projeto tem 72 registros.

Correção documental: a reportagem do Vatican News de abril de 2025 diz que «o santuário reconheceu» o 72º milagre; segundo o próprio santuário, quem proclama é o bispo da diocese da pessoa curada.

### Lote C: orações

| Oração | Texto | Procedência | Direitos |
|---|---|---|---|
| Pai-Nosso | `vaticannews-pai-nosso`, 11 linhas, sem alteração (inclusive maiúsculas e ausência de «Amém») | Vatican News em português (forma brasileira «nos Céus») | Página com «Copyright © 2017-2026 Dicasterium pro Communicatione»; sem parecer jurídico |
| Ladainha | `ladainha-vaticano-pt`, 67 linhas, sem alteração | Sítio do Vaticano, versão em português | Sem parecer jurídico |
| Introduções | `nv-mateus` (Mt 6,9-13), `nv-lucas` (Lc 11,2-4), `ladainha-carta-2020` | Passagens conferidas na Nova Vulgata | |

Diferença registrada: a versão portuguesa da Ladainha no sítio do Vaticano não traz «Rainha da família», presente na versão inglesa da mesma página, nem a oração final.

### Divergências encontradas na pesquisa de 64 capítulos

Registradas como «nota de conferência» na página do capítulo, sem reescrever o texto original:

- Capítulo 42, afirmação 660: «primogênita de onze filhos»; o santuário diz sete.
- Capítulo 46, afirmação 725: o relatório de 1926 é do Dr. Vallet, que examinou Traynor com os três médicos, e não dos três médicos.
- Capítulo 45: o caso continua em pesquisa (explicado na página).

## 3. Integração

- Ligações capítulo → página principal em 52 dos 64 capítulos (os demais tratam de lugares ou temas ainda sem página no site); as páginas principais mostram o capítulo em «Relacionados».
- Capítulos do dossiê de 32 capítulos sobre Fátima, Lourdes, La Salette, Knock, Banneux e Kibeho ligam às fichas.
- Filtros do catálogo de aparições: situação eclesial, país (agora por código ISO: o filtro por nome falhava com nomes compostos como «Estados Unidos»), decisão e autoridade.
- Atlas: título com página principal não repete ponto no mapa.

## 4. Pendências específicas

Ver `docs/PENDENCIAS.md`, seção «Expansão de 8/10/2026».
