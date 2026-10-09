# Verificação realizada (4 de outubro de 2026)

Este relatório lista só o que foi executado. O que não foi feito está na seção final.

## Automatizado no repositório (`npm run check`)
- **Validação do acervo:** passou. Cobre fontes, blocos com fonte, decisões com autoridade/data/documento/fonte, milagres, promessas, orações, relações, slugs e ids únicos, expressões proibidas, e agora também **imagens**: crédito completo, número de acesso nas obras do Met, ponto focal, variantes geradas, banners existentes.
- **Testes (`node --test`):** 39 testes, 39 passaram. Incluem recusa de publicação (aparição sem decisão, decisão sem autoridade, milagre sem decisão, promessa sem fonte, linguagem de garantia, orientação para interromper tratamento, crédito de imagem incompleto ou inexistente), busca e filtros (acentos, termos múltiplos, filtros combinados, resultado vazio), saída do site (rascunhos fora de sitemap, catálogos e busca; estado vazio de milagres; autoridade/alcance/documento nas páginas de aparição), galeria e `obras.json`, crédito junto a cada obra, dimensões e `srcset` das imagens, GSAP local sem CDN, e que nenhum estado inicial de animação esconde conteúdo sem depender da classe `.anim`.
- **Build:** 43 páginas, sem erros.
- **Verificador de saída (`site/scripts/verificacao/check-links.mjs`):** 44 arquivos HTML. Links internos e âncoras, arquivos de `srcset`, `alt` (vazio só em contêineres decorativos), `width`/`height`, um único `h1`, `lang`, título e descrição, nenhum travessão no texto visível, nenhum rascunho vazou.

## Em navegador real (Chromium via Playwright, scripts fora do repositório): 91 verificações, todas passaram
- Filtros e busca (texto, acento, filtros combinados, estado vazio, limpar, `?q=`) e **estado dos filtros refletido e restaurado pela URL**.
- **Visualizador ampliado:** Enter abre, foco vai ao botão Fechar, seta direita troca a obra, crédito e licença visíveis, Esc fecha, o foco volta ao gatilho, botão Fechar fecha a partir da abertura.
- **Recuos:** com os scripts do GSAP bloqueados, `.anim-off` entra e nenhum conteúdo permanece invisível; com JavaScript desligado, título, resumo, blocos e obra aparecem; com `prefers-reduced-motion`, não há classe `.anim`, nenhuma animação em curso e a composição é completa e estática.
- Modo de leitura, A-/A/A+ com persistência, skip link, foco visível de 3 px, menu no celular, alvos de toque de pelo menos 44 px.
- Sem rolagem horizontal com o texto no máximo do controle do site (160%) em 7 páginas, e com reflow a 320 px com texto a 150% em 7 páginas.
- **axe-core** (wcag2a, wcag2aa, wcag21aa, wcag22aa, boas práticas) em 19 páginas nos temas claro e escuro, após a animação terminar: sem violações.
- Console sem erros ou avisos.
- **Capturas inspecionadas por mim** em celular estreito (360 px), celular maior (414 px), tablet (820 px) e desktop (1366 px), em tema claro e escuro: início, capítulo, aparição, galeria, cronologia, Rosário, oração, painel de referências. Problemas concretos encontrados e corrigidos nesses ciclos: título da abertura invisível (herança de `translateY` pelo GSAP), pintura escondida até o JavaScript rodar (contra o briefing), rosto da Virgem cortado atrás da lista de capítulos, rostos cortados em faixas largas (trocadas por abertura com a obra inteira), tira de obras desequilibrada, legenda do celular esmaecida por camada sobreposta, título coberto pela moldura no celular, véu insuficiente sobre bruma escura (Sassoferrato), faixa vermelha da cortina entrando no céu, borda preta dos painéis do Met, textura de tela áspera, transição turva da faixa de oração, estouro horizontal por URL longa, deslocamento de layout do menu.
- **Desempenho (simulação):** CLS 0 nas quatro páginas medidas, no desktop e no celular. No desktop (localhost) o LCP ficou entre 0,28 s e 0,57 s. No celular com rede simulada de 1,6 Mbps e 150 ms, a obra principal chega em cerca de 1,2 s (galeria) e 1,6 s (início). Uma primeira medição da galeria no celular deu 9 s por falha na configuração da simulação de rede; foi refeita e a medição inicial descartada. Peso no início: cerca de 680 KB de imagens (já com as obras abaixo da dobra), 131 KB de JavaScript (GSAP + ScrollTrigger + app), 40 KB de CSS e cerca de 100 KB de fontes.

## O que NÃO foi feito
- Revisão teológica, canônica ou médica humana.
- Teste com leitores de tela (NVDA, VoiceOver, TalkBack) ou com pessoas idosas. O axe detecta só parte dos critérios do WCAG 2.2 AA; **não** se declara conformidade completa.
- Lighthouse, medição em dispositivos físicos, Safari e Firefox (só Chromium).
- Inspeção quadro a quadro das animações de rolagem (revelações, paralaxe, fio da cronologia) e das **transições entre páginas** (View Transitions): foram implementadas e executam sem erros, mas só a sequência de abertura da página inicial foi capturada em quadros (120, 700, 1500 e 3200 ms) e inspecionada. A galeria e o visualizador foram testados funcionalmente, não avaliados esteticamente em movimento.
- Parecer jurídico sobre licenças de imagens, traduções de orações e do GSAP.
- Publicação em qualquer serviço externo.

## Versão cinematográfica da página inicial (5 de outubro de 2026, noite)
- `npm run check`: validação, 41 testes, build de 143 páginas e verificador de links sem problemas. O teste de estados escondidos agora cobre também `cinematic.css` e `filme.css`.
- `site/scripts/verificacao/visual-audit.mjs` (axe WCAG 2.2 A/AA, estouro horizontal) em 25 combinações de página, dispositivo e tema: 0 falhas, depois de tornar focável a lista de créditos.
- `site/scripts/verificacao/interaction-audit.mjs`: 28 verificações passaram (entrada, ScrollTriggers, enquadramento responde à rolagem, Ler sem animações e persistência, céu estrelado cintila, pausa e para fora da tela, troca dinâmica de `prefers-reduced-motion` sem duplicar triggers, histórico, Pular apresentação, galeria por teclado, busca, menu móvel, reflow a 320 px com 150%, recuos sem JS, sem GSAP e sem localStorage com título e obra totalmente opacos). CLS 0,0016; LCP local 460 ms.
- Lighthouse (celular simulado): início desempenho 0,81, acessibilidade 1, boas práticas 1, SEO 0,92, LCP 4,4 s; capítulo da Anunciação desempenho 0,90. O LCP do início piorou em relação à versão anterior por causa do peso da página e da entrada; não foi otimizado além de manter a pintura pintada desde o primeiro quadro.
- Capturas inspecionadas: prólogo em 250, 1100, 2200 e 4200 ms; cada ato no início, meio e fim da rolagem, em 1440×900 e 390×844; modo sem movimento; tema escuro. Corrigidos nesses ciclos: película com fundo marfim que quebrava a sequência escura, quadros cortados na película fixada, títulos azuis sobre fundo escuro, faixa clara no topo do manto, ponto duplo nas legendas.
- Não feito: leitor de tela, Safari e Firefox, dispositivos físicos, inspeção quadro a quadro das transições entre páginas.
- Extensão a todas as páginas: `npm run check` (41 testes, 143 páginas, links), visual-audit (25 combinações, 0 falhas), interaction-audit (28 verificações, CLS 0, LCP local 392 ms) e axe em 11 páginas internas × 2 temas × 2 larguras (44 combinações): sem violações nem estouro horizontal. Capturas em 300 ms, 2,5 s e após rolagem, em 12 páginas, desktop e celular.

## Fotos de santuários e rostos de Maria (6 de outubro de 2026)
- 66 imagens novas do Wikimedia Commons: 41 fotografias de santuários (imagem principal do item no Wikidata) e 25 imagens de Maria veneradas em cada lugar. Só entraram licenças lidas na página do arquivo: domínio público, CC0, CC BY e CC BY-SA (nenhuma NC ou ND). Cada imagem tem autor, licença, link de origem e data de consulta junto da imagem e no registro (`content/images.json`).
- Todas as 66 foram vistas numa folha de contato antes da publicação; os textos alternativos foram reescritos conforme o que aparece. Descartada: a reprodução em cera de Altötting (a foto mostrava lembranças à venda) e a da Virgem do Pilar (manto de papel dobrado). Legendas avisam quando a foto é de réplica ou de outro lugar (Luján, Kibeho, Vailankanni, Pompeia, Suyapa).
- Sem foto livre encontrada: santuário de Donglü e basílica de Suyapa (a de Suyapa tem só o retrato). Sem retrato: China (Sheshan), Argélia, Austrália, Irlanda (Knock), Estados Unidos, Canadá, Israel, Turquia, Costa do Marfim, Bolívia, Paraguai, Brasil (Belém), Itália (Loreto, Siracusa).
- `npm run check` (41 testes), visual-audit (25 combinações, 0 falhas), interaction-audit (28 verificações, CLS 0, LCP local 344 ms), axe em páginas de santuários, títulos e atlas (sem violações). No navegador: filtro de região mostra só os rostos da região (América Latina: 6), clique num país mostra os daquele país, país sem retrato mostra aviso.
- Fotografias de esculturas e edifícios modernos dependem da regra de liberdade de panorama de cada país; a situação foi aceita conforme declarada no Commons, sem auditoria jurídica.

## Mapa do atlas redesenhado (6 de outubro de 2026)
Oceano azul-noite com paralelos, meridianos e contorno do globo (Equal Earth); países com registro em bronze, país escolhido em ouro com brilho; pontos com halo que pulsa (só com movimento ativo) e cor por tipo, com legenda; ficha ao passar o mouse ou focar um ponto (nome, tipo, lugar, imagem); aproximação suave ao escolher país, região ou atalho de região (GSAP; sem movimento, salta direto); botão "Ver o mundo inteiro". `npm run check`, interaction-audit (28) e axe nos temas claro e escuro e no celular: sem falhas nem estouro horizontal.

## Expansão editorial (8 de outubro de 2026)
- `npm run check`: validação do acervo, 55 testes (55 passaram), build dos 8 idiomas (250 páginas por idioma) e verificador de saída em 2008 páginas: sem problemas.
- Testes novos: classificação eclesial coerente com as decisões (nihil obstat não pode virar «aparição reconhecida»; inquérito não vira reconhecimento; juízo doutrinal não vira nihil obstat), terminologia de 2024 não aplicada a decisões antigas nem a antiga a decisões novas, cronologia com data e fonte, ligação da pesquisa a rascunho recusada, `mainRecord` só para registro publicado, fonte obrigatória do acontecimento nos milagres, rascunhos fora de atlas, títulos, lista de curas e capítulos da pesquisa.
- Navegador (Chromium via Playwright, script fora do repositório): 26 páginas novas ou alteradas em celular (390 px), desktop (1440 px), desktop escuro com movimento reduzido e 320 px: axe (WCAG 2.0 a 2.2 A/AA) sem violações, sem rolagem horizontal, sem erros de console. Capturas inspecionadas por mim: catálogo de aparições (cartões, legenda de categorias, mapa e lista), ficha de Kibeho no celular, ficha de Traynor, título de Kibeho.
- Corrigidos nesses ciclos: a revelação linha a linha das orações levava cerca de 10 s na Ladainha (67 linhas) e o axe acusava contraste nas linhas ainda esmaecidas; a cascata agora cabe em 1,4 s. A seção «Acontecimento relatado» dos milagres não mostrava fonte (campo `event.sources` criado e exigido).
- `audit:visual` e `audit:interactions` do projeto: as únicas falhas (contraste do seletor de idioma e reflow a 320 px/150% na página inicial) se repetem no build do commit anterior; não foram introduzidas nesta etapa e estão em `PENDENCIAS.md`.
- Não feito: leitor de tela, Safari e Firefox, revisão teológica, canônica ou médica humana.

## Aplicativo instalável (PWA, 8 de outubro de 2026)
- Chromium via Playwright (script fora do repositório), servidor local: `Page.getAppManifest` sem erros e `Page.getInstallabilityErrors` vazio (o Chrome considera o site instalável); o service worker assume a página; sem conexão, uma página já visitada abre normalmente e uma não visitada mostra «Sem conexão».
- `/instalar/`: com agente de usuário de Android, Android vem marcado e só o painel dele aparece; de iPhone, o iPhone; no computador, Android e aviso de computador. Pelo teclado, a seta troca a opção, o painel e o endereço (`#ios`). Sem JavaScript, o clique no cartão troca o painel (`:has()`). axe sem violações em celular, celular escuro, 320 px e desktop; sem rolagem horizontal; sem erros de console. Capturas inspecionadas (claro e escuro).
- O build `--app` não contém manifesto, `sw.js`, `pwa.js` nem a página de instalação.
- `npm run check`: 56 testes (um novo, do PWA), 2024 páginas no verificador, sem problemas.
- Não testado: instalação real em aparelho Android e iPhone (só emulação de navegador), Safari e Firefox.

## Responsividade (9 de outubro de 2026)

Verificações, causas, páginas, larguras e capturas registradas em [RESPONSIVIDADE.md](RESPONSIVIDADE.md). Matriz: 936 estados geométricos, 109 casos adicionais de idiomas/interações e seis páginas com zoom real de 200%, sem falhas na execução final. `npm run check`: 56 testes passaram, oito idiomas, 2.032 páginas verificadas.
