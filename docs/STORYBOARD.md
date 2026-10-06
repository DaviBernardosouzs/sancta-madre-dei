# Percurso pictórico — 5 de outubro de 2026

Registrado antes da implementação. Renovação visual com preservação de rotas, conteúdo documental, fontes, filtros e navegação. Não foi encontrado AGENTS.md no projeto nem nos diretórios ascendentes. README, documentação editorial e notas de `Obsidian Vault/Sancta Mater Dei` foram lidos.

## Direção e auditoria inicial

Livro de arte sacra para leitores de diferentes idades. CSS nativo e GSAP local. Cormorant Garamond e Atkinson Hyperlegible permanecem. Variância 6, movimento 5, densidade 3. As skills de design foram instaladas para Codex neste projeto; as quatro skills oficiais de GSAP já existiam. Todas foram lidas integralmente. Sem React, portanto sem gsap-react.

Conflitos resolvidos pelo briefing: preservar pinturas reais e créditos, usar marfim/ouro e serifa, permitir a passagem deliberada pelo manto azul; evitar vidro, ícones e dependências redundantes, texto minúsculo, animações generalizadas e imagens sintéticas. Não reescrever fontes religiosas para atender preferências estilísticas das skills.

Captura inicial: `capturas/antes-desktop.png`. Problemas observados: pintura ultrapassa a largura da coluna, navegação quebra em mais linhas, fundo de céu muito ampliado perde definição. No código: navegação e textos escondidos durante a introdução, corte de pintura no celular, ausência de controle de movimento persistente e de limpeza de animações. Lista da home anuncia seis capítulos embora o acervo tenha treze.

## Storyboard

| Cena | Conteúdo e obra | Enquadramento inicial → final | Movimento e transição | Texto e destino | Celular e alternativa estática |
|---|---|---|---|---|---|
| Acolhimento | Maria e o Menino, Giovanni Bellini, Met 435641 | Pintura completa a 98% → 100%, dentro da moldura | Entrada de 2 s; título com deslocamento de 12 px. Navegação sempre visível | Sancta Mater Dei; conhecer Maria; acervo | Pintura inteira acima do título, largura e altura limitadas pela tela. Sem sobrepor texto às figuras. Sem movimento: estado final |
| Contemplação | A mesma pintura, já apresentada | Quadro completo → aproximação de apenas 2%; detalhes continuam íntegros | A rolagem aproxima a moldura inteira, sem recortar nem separar figuras | Apresentação breve e acesso direto aos capítulos | Sem parallax; conteúdo e quadro no fluxo |
| Anunciação | Hans Memling, Met 437490 | Quadro inteiro, escala 96% → 100% | Timeline por rolagem: quadro se aproxima, luz decorativa diminui; texto permanece legível | Resumo do capítulo já publicado e ligação para a Anunciação | Quadro acima do texto; mesma informação estática, sem fixação |
| Manto | Recorte do tecido de Bellini e estrelas SVG originais | Tecido ampliado como textura, sem figuras | Ondulação de luz de até 2% com ciclo de 18 s; estrelas não piscam. Margens fazem transição com a página | Trecho existente da Ave-Maria e acesso ao Rosário | Sem movimento no modo reduzido. Controle de pausa; efeitos pausam fora da tela e com aba oculta |
| Maria pelo mundo | Paisagem de Gerard David, Met 436101 | Recorte já existente do céu e das árvores | Deslocamento de até 16 px na paisagem; véu dissolve em marfim | Atlas, santuários e calendário existentes | Paisagem de fundo leve; texto protegido por superfície opaca |
| Acervo | Lista guiada, aparições e obras existentes | Obras inteiras | Sem revelações obrigatórias; navegação nativa | Todos os capítulos, filtros, galeria e fontes | Conteúdo completo sem JS, sem GSAP e sem animações |

Nenhuma cena exige espera, fixação ou roda do mouse interceptada. “Pular apresentação” leva a `#leitura`; ligações para capítulos ficam disponíveis desde o início.

## Tokens

Pigmentos existentes: marfim #f8f1e1, azul profundo #111a3d, ultramar #1d3a8c, umbra #231a17, ouro de texto #7a5712, ouro decorativo #b8893a, vermelho #8f3524 e verde #55613f. No manto, marfim #fbf4e2 e ouro claro #e3c27a sobre #111a3d. Leitura com 62ch e entrelinha 1,7. Interações 180–250 ms; entrada 0,8–2 s; tecido 18 s. Camadas: ambiente -1, composição 0, menu 30, modo de leitura 40, skip 100; diálogo na top layer nativa.

## Curadoria

41 imagens existentes, variantes WebP, manifest com dimensões e crédito estruturado. Originais e variantes preservados. Bellini tem definição suficiente para a abertura; Memling alongado pede `contain`; paisagens são usadas apenas como ambientação, não como registro de localidades. Fotografias de Lourdes/Fátima são documentais e ficam nas respectivas fichas. Gravuras de Dürer permanecem no acervo e na leitura. Sassoferrato/Commons conserva a ressalva de procedência já documentada. Referências pessoais em `public/` continuam fora da publicação.

Consultados novamente em 05/10/2026: [Bellini](https://www.metmuseum.org/art/collection/search/435641), [Memling](https://www.metmuseum.org/art/collection/search/437490) e [Open Access do Met](https://www.metmuseum.org/hubs/open-access). As páginas das obras indicam Public Domain; a política declara CC0 para imagens Open Access. Registro integral de autoria, origem e licença em `content/images.json`. Não foram inventados novos créditos nem alterados os fatos religiosos.

## Versão cinematográfica (5 de outubro de 2026, noite)

A página inicial passou a ser montada como um filme em atos (`scripts/build.mjs` › `pageHome`, `src/assets/filme.css`, `src/assets/filme.js`). O movimento continua opcional e reversível: tudo nasce dentro do `gsap.matchMedia()` de `app.js`, e "Ler sem animações", `prefers-reduced-motion`, falta de GSAP ou de JavaScript deixam a composição estática completa.

| Ato | Obra | Movimento (desktop) | Celular / estático |
|---|---|---|---|
| Prólogo | Bellini (Met 435641) | Poeira dourada em canvas; aura; título letra a letra com desfoque que se dissolve; a pintura sai do escuro (brilho 6% → 100%, escala 94% → 100%, sempre inteira); reflexo de luz atravessa o vidro do quadro; ao rolar, a câmera recua | Mesmo prólogo, pintura acima do título; estático: tudo visível |
| I · Anunciação | Memling (Met 437490) | Cena fixada por 130% da tela: raios de luz entram, o quadro se aproxima saindo da penumbra, as linhas do texto aparecem em sequência | Sem fixação; revelação simples |
| II · A vida de Maria | Banners dos 13 capítulos | Película com perfurações; a rolagem vertical desliza o filme na horizontal; cada fotograma se acende ao passar pelo centro; foco por teclado leva a rolagem até o fotograma | Rolagem horizontal nativa com encaixe |
| III · Uma oração | Recorte do manto de Bellini | Céu de estrelas em canvas (cintilar de 4 a 11 s, nunca piscar), pausável e parado fora da tela; Ave-Maria se esclarece palavra por palavra com a rolagem | Estático: texto inteiro nítido |
| IV · Maria pelo mundo | Mapa Natural Earth | Pontos acendem do oeste para o leste; alguns respiram; contadores sobem | Igual, sem fixação |
| Créditos | Lista das obras da página | Créditos sobem com a rolagem; no fim a página clareia para o marfim do livro | Lista rolável, focável |

Global: grão de película animado (decorativo), fio de progresso dourado, transição entre páginas por desfoque e fade, abertura das páginas internas como cartela de título (palavras sobem de uma máscara, a obra sai da penumbra). Figuras sagradas nunca são animadas isoladamente; nenhuma pintura é recortada.

### Todas as páginas (extensão)
- **Entrada:** fade a partir do preto (0,9 s) na primeira carga de cada página; só com movimento ativo.
- **Cartela de título:** páginas sem obra própria (santuários, calendário, atlas, títulos sem obra, 404) abrem com fundo noturno estrelado (canvas), fio de ouro e um feixe de luz que atravessa a cena. Páginas com obra mantêm a abertura em marfim, agora com a bruma da pintura se assentando, a obra saindo da penumbra e o título subindo palavra por palavra por uma máscara.
- **Rolagem:** a cena de abertura recua (texto sobe e esmaece); títulos de seção entram com corte da esquerda; listas, blocos, fichas, decisões, fontes e lacunas entram em cascata; imagens no texto se acendem como num projetor; orações aparecem linha a linha como legendas; no atlas, países e pontos se acendem; o rodapé entra como créditos.
- Filtros e buscas recalculam as posições (`ScrollTrigger.refresh`) para nenhum item ficar sem revelar.
