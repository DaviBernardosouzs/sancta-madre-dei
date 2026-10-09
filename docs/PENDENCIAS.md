# Limitações e pendências verificáveis

## Revisão humana (obrigatória antes de divulgar como referência)
- Revisão teológica e canônica de todo o texto.
- Revisão médica antes de qualquer ficha de milagre.
- Conferir citações bíblicas (apenas Lc 1,26-27; 1,39-42; 2,1-7; Jo 2,1-5 e Lc 1,48-49 foram lidas, no sítio do Vaticano; as demais passagens são referências) na edição adotada.

## Pesquisa pendente
- Texto integral do mandamento de Mons. Laurence (18/01/1862) e da carta pastoral de Leiria (13/10/1930) no original em português (a versão consultada é tradução inglesa em site de terceiros).
- Atos posteriores da Santa Sé sobre Lourdes e Fátima.
- Casos de Lourdes (Catherine Latapie, Antonia Raco): autoridade, data e documentos de reconhecimento. As consultas à página do santuário trouxeram datas divergentes para o caso mais recente.
- Milagres ligados à canonização de Francisco e Jacinta Marto (não pesquisados).
- Mensagens atribuídas às aparições de Fátima e promessas devocionais (Rosário e outras): origem e fonte primária.
- Contexto histórico de Nazaré e do século I, por estudos acadêmicos identificáveis; origem histórica do Rosário; textos extrabíblicos sobre a família de Maria e a Dormição.
- Pai-Nosso e outras orações (Ladainha de Nossa Senhora, Memorare): texto com fonte verificada.
- Direitos autorais das traduções em português das orações (parecer jurídico não feito).
- Estudos históricos e acadêmicos: a categoria da Biblioteca está vazia.

## Arte e imagens
- Parecer jurídico independente sobre as declarações de licença (CC0 do Met; domínio público no Commons). A página de política do Met respondeu HTTP 429 e foi lida apenas a declaração em metmuseum.github.io.
- Obra de Sassoferrato vem do Commons; a instituição de guarda é inferida do nome do arquivo. Prefira reprodução direta de museu com licença aberta.
- Não há pintura sobre Lourdes ou Fátima: as aparições usam estampa e fotografia documentais e uma paisagem de abertura que ilustra o clima, não o lugar. Registrar a pendência de material visual adequado.
- Sem AVIF (ImageMagick local sem suporte): WebP apenas.
- Visualizador ampliado: sem zoom por gesto de pinça próprio (o navegador amplia a página normalmente).
- Textos de legenda das obras limitam-se aos dados do acervo; contexto iconográfico e histórico das obras não foi pesquisado.
- Cartões de `docs/referencias-pessoais/`: avaliar procedência e licença se o autor quiser usá-los.

## Produto
- Mapa interativo: adiado até haver coordenadas verificadas.
- Mais aparições, títulos e milagres: crescer só com registros verificados.
- Licença do código e do repositório a definir antes de publicar.
- Domínio e hospedagem a escolher; definir `SITE_URL` no build.

## Expansão de 8/10/2026: pendências específicas
Detalhes e evidências em `docs/MATRIZ-EVIDENCIAS-2026-10-08.md`.

- **Antonia Raco (milagre, rascunho):** falta o texto da decisão do bispo de Tursi-Lagonegro em fonte da diocese ou da Igreja. O site da diocese não respondeu; a agência SIR só cita trechos; o texto completo apareceu apenas em imprensa local (MateraNews).
- **Beauraing (aparição, rascunho):** o santuário fala em decreto de Roma de 16/5/1943; outras fontes em autorização de 2/2/1943. Ler a decisão de 2/7/1949 (diocese de Namur) e esclarecer o ato de 1943.
- **Pontmain (aparição, rascunho):** ler o mandamento de Dom Wicart (2/2/1872) em fonte oficial; o site do santuário não respondeu.
- **Madonna dello Scoglio (rascunho):** a carta do Dicastério não nomeia a pessoa nem data a experiência; falta fonte oficial para a narrativa e o decreto do bispo de Locri-Gerace.
- **Decretos diocesanos posteriores às cartas do Dicastério:** Pellevoisin (Bourges), Chandavila (Mérida-Badajoz), Medjugorje (Mostar-Duvno), Litmanová (Prešov) e Montichiari (Brescia) não foram lidos.
- **Originais não lidos:** mandamento de La Salette (1851, francês), ato de 1855; carta pastoral de Banneux (1949, francês) e atos de 1942 e 1947; texto integral da declaração de Kibeho (23 páginas) e ato de 1988; relatórios das comissões de Knock; decreto de 2021 do Pontifício Conselho sobre Knock; designação de Champion como santuário nacional (2016).
- **Moriau:** confirmar se a reprodução da Conferência dos Bispos da França é a íntegra da declaração; localizar o original na diocese de Beauvais.
- **Imagens:** Knock, Champion, Pellevoisin, Chandavila, Medjugorje, Litmanová e Montichiari estão sem imagem própria com licença livre conferida; as fichas abrem sem imagem em vez de usar obra de outro tema.
- **Traduções:** as fichas, orações e textos novos aparecem em português nas versões em outros idiomas (o build registra as frases sem tradução); traduzir em `site/i18n/`.
- **Orações:** Lembrai-vos (Memorare) e Rainha do Céu ainda não incluídas; nenhuma tradução de oração teve parecer jurídico sobre reprodução.
- **Mapa:** na escala do mapa-múndi, os pontos europeus ficam próximos; não há aproximação por região na página de aparições (o atlas tem).
- **Fora do escopo editorial, anteriores a esta etapa:** a auditoria de interação acusa estouro horizontal na página inicial a 320 px com texto a 150%, e a auditoria visual acusa contraste insuficiente no rótulo do seletor de idioma da página inicial. Os dois problemas já existiam no commit b27516e (conferido num build separado). O teste `tests/vault_integrity_test.py` depende de `scripts/vault-validate.py`, que não está no repositório.

## Aplicativo instalável (PWA)
- Testar a instalação em aparelhos reais (Android com Chrome e Samsung Internet; iPhone com Safari), inclusive o comportamento offline.
- Traduzir os textos da página `/instalar/` e da página offline (hoje em português nos outros idiomas).
- O iPhone não oferece botão de instalação automática; a orientação pelo menu Compartilhar depende da versão do iOS, e os nomes das opções podem mudar.
- **Coroa das Almas:** não há texto oficial da coroa (as formas populares variam e nenhuma tem original em latim conhecido). Por decisão do autor (8/10/2026), publicou-se só a oração com texto oficial, «Dai-lhes, Senhor, o eterno descanso / Requiem aeternam» (Compêndio do Catecismo, em português e latim), com nota sobre a devoção. Se o autor indicar uma fonte própria da coroa (livreto ou paróquia), conferir e publicar com essa procedência.
