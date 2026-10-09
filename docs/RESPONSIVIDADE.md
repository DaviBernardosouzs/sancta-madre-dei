# Revisão de responsividade — 9/10/2026

## Preparação e skill

Árvore de trabalho inicialmente limpa. README, arquitetura, direção visual, verificação, checkpoint e pendências consultados; não há AGENTS.md no projeto nem nos diretórios ancestrais consultados. Stack: gerador estático Node.js, HTML, CSS, JavaScript e GSAP como melhoria progressiva; Chromium via Playwright para reprodução local em http://localhost:4173. Nenhuma skill de redação instalada foi encontrada; não foram alterados textos religiosos, históricos nem traduções.

Instalação solicitada: `npx skills add https://github.com/wshobson/agents --skill responsive-design --agent codex --yes`. Caminho real utilizado: `/home/davi/Documentos/sancta-madre-dei/.agents/skills/responsive-design/SKILL.md`. Lidos SKILL.md e as referências `details.md`, `breakpoint-strategies.md`, `container-queries.md` e `fluid-layouts.md`. Instalação registrada em `skills-lock.json`. As correções usam fluxo mobile-first, grades intrínsecas, quebra de controles e mínimos encolhíveis; container queries não foram necessárias para os problemas reproduzidos.

## Causas e correções

| Reprodução | Causa concreta | Correção |
|---|---|---|
| Início, 320 px, menu aberto e fonte 100%/160%; controles sobre a pintura e itens cortados | Cabeçalho absoluto sem reserva da altura dinâmica; regras de três colunas em conflito com utilidades em duas colunas; marca e ação competindo pelo mínimo de conteúdo | Cabeçalho no fluxo; idiomas, fonte e movimento dentro do menu nativo de abertura explícita; ação de oração quebra para outra linha com rótulo completo |
| Menu e idiomas abertos em telas estreitas | Painéis absolutos, seletor com largura mínima em rem e ancoragem móvel indefinida; regras de summary do menu principal também aplicadas ao seletor | Painéis no fluxo, grade auto-fit com mínimo limitado ao espaço disponível; seletor sem ícone de menu herdado; sem reduzir rótulos |
| Início, 320–390 px, fonte 160%, Anunciação | Identificador do ato com nowrap e filhos da grade que não encolhiam; overflow clip da cena mascarava o texto fora do palco | Quebra do identificador e min-width: 0 nos filhos; texto permanece dentro da composição |
| Início em alemão, 320 px, fonte 160% | Grades implícitas dos créditos e da metodologia tomavam mínimos de palavras longas | Trilhas minmax(0, 1fr) e filhos encolhíveis; as palavras continuam completas |
| Atlas, atalhos de regiões no celular | Flex sem quebra com controles fora da primeira área visível | Atalhos reorganizados em linhas com alvos de 44 px |
| Peregrinação, 320/360/992/1024/1183/1184 px, fonte 160% | Cabeçalho de etapa flex sem quebra e mínimos de filhos de grid; navegação sem quebra excedia a coluna do mapa | Cabeçalhos e controles quebram linha; filhos encolhem; botões têm mínimo de 44 px; setas disponíveis também no celular |
| Peregrinação em orientação horizontal | Mapa sticky ocupava grande parte da altura útil | Em altura até 30rem, mapa retorna ao fluxo; as etapas podem ser lidas sem uma camada fixa à frente |
| Visualizador, fonte 160%, celular e orientação horizontal | Grade de altura fixa disputada por legenda, imagem e navegação; botões sem quebra | Diálogo em 100dvh; fluxo vertical rolável em telas baixas/estreitas, imagem proporcional, legenda integral e controles que quebram; composição lateral mantida onde há espaço |
| Modal sem identidade visual no celular; regras posteriores de rodapé/idiomas não aplicadas | Uma chave de fechamento ausente na media query de `.doc` em `style.css` mantinha todas as regras posteriores dentro de min-width: 62rem | Fechamento da media query restaurado; estilos compartilhados voltam a aplicar no celular. Auditoria passa a exigir grid do modal, padding correto e alvo de toque do botão Fechar |
| Início, 320/360 px e fonte 160%, convite de oração do índice | Três colunas com ícone, texto e seta, mais padding em rem, excediam a largura útil | Convite em sequência vertical no celular; três colunas com texto encolhível onde há espaço |
| Idiomas abertos, rótulos de aparições e corpo de leitura com fonte 160% | Mínimos do painel em rem, inline-block sem limite e largura intrínseca do corpo de leitura | Painel limitado a 100%, classificação com quebra e corpo de leitura com largura máxima |
| Título da Anunciação com fonte 160% | Wrappers de palavras da animação ultrapassavam a largura e eram cortados pelo palco | Wrappers limitados a 100%, com quebra de palavras longas e altura automática |
| Oração em modo de leitura | Controle fixed podia cobrir texto ou exceder a largura com fonte maior | Controle sticky dentro do fluxo, com largura limitada à disponível |

Foram registradas capturas anteriores do cabeçalho da página inicial (320, 390, 768, 1440 px; menu, idiomas e fonte ampliada), da Biblioteca a 320 px e do modal sem estilos a 768×360. Os outros problemas adicionais foram encontrados na matriz posterior. As imagens foram excluídas a pedido do autor depois da validação; os relatórios foram preservados.

## Arquivos

- `site/scripts/build.mjs`: painel compartilhado, relações aria-controls e CSS no pré-cache da PWA.
- `site/src/assets/css/responsive.css`: reflow compartilhado, mantendo pigmentos, fontes, imagens e camada opcional de movimento.
- `site/src/assets/css/style.css`: chave de fechamento da media query documental, restaurando os estilos móveis posteriores.
- `site/src/assets/js/app.js`: estado aria-expanded; Escape fecha primeiro idiomas, depois menu; retorno do foco; menu não fecha inesperadamente numa mudança de breakpoint.
- `site/scripts/verificacao/{responsive-audit,responsive-states,responsive-zoom}.mjs`: matrizes reproduzíveis e zoom real pelo chrome.tabs.setZoom de uma extensão temporária local.
- Auditorias visual e de interação: controles agora acessados pelo menu; capturas novas separadas das históricas.
- `package.json`, README, arquitetura, pendências e esta documentação: comandos e contexto.

## Validação realizada

### Matriz geométrica: 936 casos, zero falhas

13 páginas: início, Biblioteca, busca, galeria, aparições, atlas, Anunciação, Pai-Nosso, Aprofundar, Peregrinação da Sagrada Família, iconografia, instalação e pedidos de oração.

18 larguras: **320, 360, 375, 390, 430, 639, 640, 767, 768, 991, 992, 1024, 1183, 1184, 1279, 1280, 1440, 1920 px**. Altura 900 px, exceto 768×360 para orientação horizontal. Estados: fechado, menu aberto, idiomas abertos e fonte 160% com menu aberto. Nesta matriz, estados são preparados programaticamente; a interação real é coberta separadamente abaixo.

Mede overflow global, interseção entre controles do cabeçalho e limites horizontais dos textos/controles. A película horizontal intencional é excluída da verificação de elementos fora da janela; seu conteúdo é acessível pela rolagem local, sem overflow global. Resultado: `capturas/responsividade/depois/resultados.json`.

### Estados e interação: 109 casos, zero falhas

- Oito idiomas (pt, en, es, fr, it, de, ja, zh), em 320/390/768/1024/1440 px, fonte máxima **obtida pelos seis toques no A+**, menu e idiomas abertos e fechados.
- Escape fecha idiomas sem fechar o menu, depois fecha o menu e devolve foco; Tab não entra no painel fechado.
- Visualizador em 320/360/375/390/430/768/1024/1280/1440/1920 px, fonte 160%; abertura por Enter, anterior/próxima por toque, Escape e retorno do foco. Estilos computados, alvo de toque de Fechar e ausência de interseção entre imagem, legenda e navegação também verificados. A imagem recebe dimensões explícitas do quadro com object-fit: contain para não invadir outras trilhas da grade.
- Conteúdo da Biblioteca (créditos e links longos), busca preenchida, Peregrinação, iconografia, Aprofundar e modo de leitura do Pai-Nosso em 320 px com fonte máxima.
- Preferência do sistema por movimento reduzido, animações ativas e modo sem animações; cenas da página inicial roladas e capturadas. Resultado: `capturas/responsividade/estados/resultados.json`.

### Zoom real de 200%: seis páginas, zero overflow

Chromium completo, janela 1280 px, zoom confirmado pela API do navegador em 2; largura CSS efetiva 640 px e DPR 2. Início, Biblioteca, busca, galeria, atlas e Peregrinação; menu e idiomas abertos. Não se usou transform CSS para simular zoom. Resultado em `capturas/responsividade/zoom/resultados.json`; imagens excluídas a pedido do autor.

### Regressão e verificações técnicas

- Auditoria visual do projeto: 25 combinações, zero violações axe, overflow ou erros de JavaScript (celular 390, tablet 820, desktop 1440 e temas claro/escuro com movimento reduzido).
- Auditoria de interação do projeto: 28 verificações passaram; cobre preferências e limpeza das animações, busca, galeria por teclado, reflow, recuos sem JavaScript, sem GSAP e sem localStorage. CLS 0 nesta execução local; não é uma medição de produção.
- `npm run check`: validação editorial, **56 testes passaram**, build dos oito idiomas (252 páginas por idioma), **2.032 páginas** verificadas nos links/metadados.
- `node --check` dos scripts alterados e `git diff --check`: passaram. Não há comandos de lint ou tipos configurados nesta stack JavaScript.
- Avisos de frases ainda sem tradução e SITE_URL local permanecem, já documentados antes desta tarefa.

## Evidências visuais

As capturas de tela desta revisão foram excluídas a pedido do autor após a inspeção visual. Permanecem os relatórios JSON e o log de verificação técnica em `docs/capturas/responsividade/`.

A inspeção visual cobriu capturas selecionadas de cada causa: cabeçalho antes/depois em 320 px, fonte máxima, idiomas abertos, menu desktop, Biblioteca e links longos, Anunciação com texto maior, metodologia em alemão, Peregrinação e modais em retrato/horizontal/desktop; cenas com movimento e sem movimento. A matriz automatizada complementa essas inspeções; não significa inspeção manual de cada um dos 936 estados. Os scripts permitem gerar novas capturas localmente.

## Como repetir

1. `npm run check`.
2. `npm run serve` em outro terminal.
3. `npm run audit:responsive` (Chromium do Playwright instalado).
4. `PREVIEW_URL=http://localhost:4173 npm run audit:visual` e `PREVIEW_URL=http://localhost:4173 npm run audit:interactions`.

Os scripts usam navegador real automatizado, que pode exigir permissão fora de um sandbox restritivo. Os relatórios contêm as páginas e estados efetivamente executados. Nenhum push ou deploy foi realizado.

## Limites concretos

Não executado em Safari, Firefox, aparelho físico ou leitor de tela. O mural de oração depende de API Cloudflare e fica indisponível no servidor local; validou-se a interface local, sem enviar pedidos. Traduções editoriais pendentes continuam em português nos demais idiomas. Não se declara conformidade WCAG completa nem revisão visual de todas as 2.032 páginas.
