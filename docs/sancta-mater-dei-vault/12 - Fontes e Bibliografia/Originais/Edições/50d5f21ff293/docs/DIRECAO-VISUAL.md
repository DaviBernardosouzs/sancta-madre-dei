# Direção visual

## Atualização cinematográfica de 05/10/2026

A implementação atual está em `src/assets/cinematic.css` (composição) e `src/assets/app.js` (movimento). Veja [storyboard](STORYBOARD.md), [curadoria](AUDITORIA-VISUAL.md) e [revisão renderizada](REVISAO-CINEMATOGRAFICA.md). As seções abaixo registram a direção anterior e permanecem como histórico.

As duas skills de design agora estão instaladas em `.agents/skills/` para Codex, sem duplicar GSAP. O percurso usa a abertura de Bellini, a Anunciação de Memling, o manto e a paisagem de Gerard David. A navegação abre por `details` nativo em qualquer largura. A primeira dobra deixa a obra inteira; celular, tablet e desktop têm composições próprias.

Não existem mais estilos iniciais que escondam texto. A entrada parte de conteúdo visível; nenhuma navegação ou botão espera uma timeline. A leitura e os catálogos não recebem revelações generalizadas. A escolha persistente “Ler sem animações” e a preferência do sistema removem parallax, coreografias e movimento contínuo. O manto tem pausa própria, IntersectionObserver e pausa por visibilidade da aba. `pagehide` reverte contextos e triggers; `pageshow` restaura a camada opcional na volta pelo histórico.

Créditos de imagens têm mínimo de 14 px. Passagens entre capítulos mostram as imagens inteiras em miniaturas verticais. A lista inicial usa a contagem real de capítulos. O recorte decorativo de David foi corrigido porque a versão anterior continha parte do rosto, apesar da descrição de “paisagem”. Os originais permanecem intactos.

## Área de estudo (Aprofundar), 07/10/2026

Leitura de design: redesenho que preserva a marca, para público amplo; dials variância 6, movimento 6, densidade 4. Skills aplicadas: `design-taste-frontend`, `high-end-visual-design` (filtrada pelo briefing: sem vidro, sem pílulas sobre imagens) e GSAP.

- **Índice:** os 13 caminhos deixaram a grade de cartões iguais e viraram um sumário em três movimentos (A doutrina, Imagem e caminho, Devoção e documentos). Cabeçalho do movimento fixo à esquerda no desktop; cada caminho é uma linha com numeral, título, resumo e a obra que o acompanha. Créditos das obras num `details` ao fim.
- **Componentes:** linha do tempo com fio de ouro separado (`.lt__fio`) e marcos que acendem; níveis (tradição, história, reconhecimento) em tríptico no desktop; dogmas em grade 2 × 2 com varredura de luz no foco; santos e ordens em linhas editoriais com filete que se desenha.
- **Movimento (`estudo.js`, `window.SMDEstudoFilme`):** chamado por `filme.js` dentro do `gsap.matchMedia()`, então é revertido junto com o resto. Cascatas por ordem de leitura, obras do índice reveladas por máscara, fio da linha do tempo em scrub, tríptico que abre da esquerda para a direita, latim antes da tradução, rotas de Éfeso que se traçam. Troca de modo do texto em paralelo e dos filtros assenta o conteúdo com um fade curto. Sem movimento reduzido ou com "Ler sem animações", nada disso roda e todo o conteúdo fica visível.

## Peregrinação da Sagrada Família, 07/10/2026

Leitura de design: redesenho que preserva a marca; dials variância 6, movimento 7, densidade 3. Skills aplicadas: `design-taste-frontend` (protocolo de redesenho, movimento motivado), `high-end-visual-design` (filtrada pelo briefing: sem vidro, sem pílulas sobre imagens) e GSAP (`gsap-timeline`, `gsap-scrolltrigger`, `gsap-performance`).

- **Palco:** a seção "As cinco etapas" virou um palco noturno de largura total (ultramar, textura de tela a 5%). O mapa fica fixo (`position: sticky`, sem pin do ScrollTrigger) dentro de uma moldura de iluminura: filete duplo de ouro e cantos com losango. As etapas rolam ao lado como folhas de pergaminho, com numeral romano, a gravura de Dürer e capitular em madder (exceto em japonês e chinês). No celular, o palco ocupa a metade de cima da tela e as folhas passam por baixo.
- **Estado (`peregrinacao.js`):** um IntersectionObserver escolhe a etapa que cruza o meio da tela. Daí saem a vista do mapa (Terra Santa ampliada para as etapas I, II e V; mapa geral para III e IV), a cartela no canto do mapa, os numerais da navegação e o estado das rotas (andadas em ouro baixo, a da vez acesa, as que vêm recuadas). A última folha, "O caminho inteiro", acende todas as rotas e traz a legenda. No palco, o mapa geral usa um enquadramento próprio (`data-vb-palco`, do Cairo à Terra Santa).
- **Movimento (`window.SMDPeregrinacaoFilme`, chamado por `filme.js` dentro do `gsap.matchMedia()`):** cada rota se traça em scrub enquanto a folha atravessa a tela, e uma estrela de oito pontas (o viajante) segue a ponta do traço. Na troca de vista, um corte de câmera: aproxima ao entrar na Terra Santa e afasta ao voltar ao mapa geral, com uma faixa de luz que passa pela moldura. Na entrada do palco, a terra se acende, os lugares se marcam e os nomes assentam. As folhas sobem como páginas viradas e a gravura se revela por máscara.
- **Sem movimento** (preferência do sistema ou "Ler sem animações"): o palco fixo e a troca de estado continuam, mas sem traço, viajante nem transições. **Sem JavaScript:** os dois mapas com todas as rotas e as folhas em sequência, com o texto ao lado da gravura.

**Conceito:** uma pintura mariana que se desdobra em história, contemplação e descoberta. A referência é a pintura sacra renascentista: cores de pigmentos, luz pictórica, tecidos, paisagens e composição harmoniosa. O site é lido como um livro de arte sacra bem editado.

## Leitura do briefing e das skills
Skills lidas por inteiro antes de implementar: `design-taste-frontend` (base) e `high-end-visual-design` (refinamento), na instalação Starta; e, no escopo deste projeto, `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger` e `gsap-performance` (instaladas com `npx skills add https://github.com/greensock/gsap-skills`; `gsap-react` não foi instalada porque o projeto não usa React). Arquivos em `.agents/skills/` (com ligação em `.claude/skills/`) e `skills-lock.json`.

Design Read: referência editorial devocional para público amplo, incluindo idosos e baixa visão; linguagem sacro-editorial pictórica; CSS nativo com serifa e GSAP somente na camada de movimento.

### Conflitos resolvidos em favor do briefing, da acessibilidade e da leitura
- `design-taste-frontend` desencoraja serifa e a paleta marfim/ouro como padrão; o briefing exige ambas e a skill admite o caso editorial e de herança.
- `high-end-visual-design` sugere vidro, blur, pílulas, "double-bezel", barra flutuante e entradas por rolagem em tudo. O briefing proíbe glassmorphism e efeito decorativo. Nada disso foi adotado.
- Tailwind, Motion, bibliotecas de ícones e outras dependências: não adicionados. A única biblioteca de animação é o GSAP, como o briefing autoriza.
- Regras adotadas das skills: sem travessões no texto visível, sem faixas decorativas, sem selos sobre imagens, eyebrows com moderação, tema com modo escuro, estados vazios compostos, movimento sempre motivado, `matchMedia` para redução de movimento e celular, ScrollTrigger só em animações de topo, animar apenas transform e opacity.

## Paleta (extraída das obras)
Amostras medidas nas imagens (ver `docs/painel-de-referencias.html`): manto de Bellini (#161424 a #1A1A32 nas sombras), cortina madder (#952A0C), ocres e dourados (#B89764, #B8935D), céus de Gerard David (#789EAC), verde de paisagem (#545136), umbra (#582B22). Tokens finais, ajustados para contraste, em `src/assets/style.css`:

| Token | Valor | Uso |
|---|---|---|
| `--papel` | #f8f1e1 | marfim luminoso, fundo (com textura de tela a 2,4% de opacidade média) |
| `--ultramar` / `--noite` | #1d3a8c / #111a3d | títulos, links, rodapé |
| `--madder` | #8f3524 | reservado para acentos pontuais |
| `--tinta` | #231a17 | umbra, cor do texto |
| `--ouro` / `--ouro-filete` | #7a5712 / #b8893a | texto dourado (5,8:1) / só filetes |
| `--ceu`, `--verde` | #8fa7b3, #55613f | atmosferas |

Modo escuro automático: azul-noite (#0f1530) com ouro claro (#e0bd6a).

## Tipografia
Cormorant Garamond 500/600/500 itálico (títulos, citações bíblicas e orações) e Atkinson Hyperlegible 400/700 (texto e interface; desenhada para baixa visão). Ambas SIL OFL 1.1, auto-hospedadas em `src/assets/fonts/`. Corpo 19 px, entrelinha 1,7, coluna de 62 caracteres, numerais alinhados nos títulos de bloco.

## Ambientes e fundos
Nenhum fundo sólido repetido. Cada tela tem um ambiente derivado das obras:
- **Abertura da página inicial:** céu e nuvens da janela da Madona de Bellini (recorte da própria pintura), dissolvido por máscara para o marfim; a pintura inteira ao lado, com ponto focal para o celular.
- **Abertura de páginas:** a obra inteira ao lado do título, sobre uma **bruma**: versão minúscula e suavizada (80 px, gerada no build de imagens) da própria pintura, esticada pelo navegador. É atmosfera de cor sem filtros CSS pesados.
- **Leitura guiada:** paisagem de Gerard David (árvores e céu), com máscara que a dissolve nas bordas. Sem rostos e sem pintura detalhada atrás de parágrafos.
- **Faixa de oração:** o manto azul de Bellini (recorte), sobre azul-noite, com transição longa de alfa para o marfim.
- **Textura de tela:** arquivo decorativo gerado proceduralmente pelo projeto (ruído sobre cor de umbra), identificado como tal nos créditos.
- Áreas de leitura longa ficam sobre marfim calmo.

## Obras e procedência
Quinze pinturas do acervo Open Access do The Metropolitan Museum of Art (CC0 declarado pelo museu) e uma do Wikimedia Commons, mais duas imagens documentais do Commons (gruta de Lourdes, crianças de Fátima). Registro completo em `content/images.json` e na página Biblioteca. Nenhuma imagem gerada por IA. Recortes e bruma herdam o crédito da obra de origem. Nenhum filtro sépia; a única correção de cor é +12% de saturação na bruma minúscula.

Enquadramento: cada obra tem ponto focal para desktop e celular (`focus`), e as aberturas mostram a pintura **inteira** (sem cortar rosto, mãos ou o Menino). A visualização ampliada abre a imagem maior com legenda e crédito.

## Movimento (GSAP 3.15, copiado sem modificação para `src/assets/vendor/`)
Tudo é camada opcional: o HTML é legível sem JavaScript, com GSAP indisponível ou com movimento reduzido.
- **Abertura da página inicial (timeline):** a pintura já está na página; aproximação lenta (escala 1,07 para 1), o céu entra, o título sobe palavra por palavra de dentro de uma máscara, depois subtítulo, texto e botões em grupos, e por fim a navegação.
- **Abertura de capítulos:** bruma, obra e texto em sequência, título por palavras.
- **Revelações por função:** `rise` (blocos de texto, sobem 28 px), `fade` (listas e citações), `frame` (obras, ligeira aproximação); filetes dos ornamentos abrem do centro.
- **Paralaxe** de pequena amplitude (4%), só no desktop e só em transform, nas faixas e no céu.
- **Cronologia:** o fio dourado se preenche conforme a leitura e os marcos se acendem; datas e textos nunca dependem disso.
- **Galeria e visualização ampliada:** diálogo nativo `<dialog>` com troca suave entre obra, legenda e crédito, navegação por setas e botões, fechamento por botão, Esc ou clique fora, e retorno do foco.
- **Entre páginas:** View Transitions entre documentos (CSS), onde o navegador suporta, ligando a obra de uma página à da seguinte.
- **Interações simples** (links, botões, filtros, foco) são CSS.
- Sem sequestro de rolagem, sem trechos fixos longos, sem animações decorativas contínuas.
- Redução de movimento: o cabeçalho não ativa `.anim`, nada é escondido, não há parallax nem deslocamentos. Se o GSAP falhar, um temporizador adiciona `.anim-off` e o conteúdo aparece.
