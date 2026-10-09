# Arquitetura

## Visão geral
Gerador estático em Node, sem dependências de execução. Conteúdo em JSON versionado, validado a cada build. Saída em HTML semântico; JavaScript e GSAP são melhoria progressiva.

Atualização visual (05/10/2026): `site/src/assets/css/cinematic.css` complementa o sistema original; `site/src/assets/js/app.js` concentra a preferência de movimento, as timelines e sua limpeza. Playwright, axe e Lighthouse são apenas dependências de desenvolvimento para as auditorias reproduzíveis em `site/scripts/verificacao/*-audit.mjs`. `prepare-images.mjs --only-derived` atualiza os recortes e o manifesto sem remover as variantes completas. Notas Obsidian foram consultadas; a atualização desta execução é mantida em `docs/` no repositório.

Reorganização das pastas (07/10/2026): tudo o que vira o site fica em `site/`; documentação, implantação, aplicativo e back-end ficam fora. Na raiz ficam só o que serve ao repositório inteiro: `package.json`, `package-lock.json` e `node_modules/` (site, Worker e aplicativo usam as mesmas ferramentas, e o Cloudflare e o CI rodam a partir da raiz), `wrangler.jsonc` (configuração do Worker), `capacitor.config.json` (precisa ficar ao lado de `android/`) e `content/` (o vault lê daqui). Os caminhos vêm de `site/scripts/lib/caminhos.mjs` (`ROOT` é a raiz do repositório, `SITE` é `site/`): para mover uma pasta, basta mudar essa tabela. Dados de build não são publicados.

```
site/                       o site (front-end): tudo o que o gerador usa para montar dist/
  src/assets/                 copiado para dist/assets/
    css/                        style, cinematic, filme e um arquivo por área (estudo, iconografia, peregrinacao)
    js/                         app, filme, filtro, visitas e um arquivo por área (estudo, peregrinacao)
    fonts/  vendor/             fontes OFL e GSAP (sem CDN)
    img/                        obras (WebP e manifest.json), canvas.png e favicons/ (ícones do site e do aplicativo instalável)
  scripts/
    build.mjs, build-all.mjs    gerador (um idioma; todos os idiomas)
    lib/                        módulos do gerador; caminhos.mjs diz onde fica cada pasta
    ferramentas/                fetch-art, prepare-images, make-map, make-painel, import-dossie, i18n, serve
    verificacao/                validate, check-links e as auditorias visual, de interação e de desempenho
  i18n/                       dicionários da interface (ui/), traduções do conteúdo (content/), lista de chaves
  data/                       dados usados só no build (ver site/data/LEIA-ME.md)
    natural-earth/              contornos do Natural Earth (domínio público)
    mapa/                       mapa-múndi do atlas, gerado por npm run mapa
    peregrinacao/               rota e pontos da Sagrada Família (caminhos declarados em content/pilgrimage.json)
  tests/                      node:test
  art-originals/              originais das obras, baixados por npm run fetch-art (ignorado pelo git)
content/                    acervo editorial em JSON e a pesquisa documentada (na raiz: o vault lê daqui)
functions/api/              Pages Function: no Cloudflare Pages, repassa /api/* ao Worker (Service binding API)
worker/                     back-end no Cloudflare: contador de visitas (/api/visitas) e mural de pedidos de oração (/api/pedidos); wrangler.jsonc na raiz
deploy/                     Dockerfile, docker-compose.yml e nginx.conf (site estático servido pelo nginx)
android/, capacitor.config.json, store/   aplicativo Android e Play Store
docs/                       decisões, auditorias, capturas e referencias-pessoais/ (não publicadas)
scripts/, tests/            só as ferramentas do vault Obsidian (vault-*.py) e o teste delas
dist/, dist-app/            saída do site e do aplicativo (ignoradas pelo git)
```

Docker: `docker compose -f deploy/docker-compose.yml up --build` gera o site dentro da imagem (o gerador não tem dependências npm) e o serve em http://localhost:8080, com a página 404 de cada idioma. O contador de visitas só existe no Cloudflare; no Docker o rodapé simplesmente não o mostra.

## Pedidos de oração (08/10/2026)
A página `/pedidos-de-oracao/` tem o formulário (nome e necessidade) e o mural da semana. O botão "Pedir oração" fica no cabeçalho de todas as páginas, no menu, no rodapé, no ato III e no índice do fim da página inicial, e na página de orações.

- **Onde fica:** `worker/pedidos.js` (Durable Object com SQLite), `worker/regras-pedidos.js` (limites e validação, testados em `site/tests/pedidos.test.mjs`) e `worker/semana.js` (domingo às 19:30, America/Sao_Paulo). No navegador, `site/src/assets/js/pedidos.js`.
- **Reset:** um alarme do Durable Object apaga pedidos, denúncias e o sal da semana no domingo às 19:30 de Brasília, mesmo sem visitas; cada leitura confere a semana de novo.
- **Proteções:** só aceita envio das próprias páginas (cabeçalho Origin) e de navegadores; campo escondido contra robôs; sem links; 1 a 60 caracteres no nome e 3 a 600 no pedido; 5 pedidos por pessoa e 400 no total por semana; com 3 denúncias de pessoas diferentes o pedido sai do mural. A pessoa é reconhecida por um resumo de (sal da semana + IP + navegador), nunca pelo IP.
- **Moderação:** defina a senha com `npx wrangler secret put PEDIDOS_TOKEN` e remova um pedido com `curl -X DELETE -H "Authorization: Bearer SENHA" https://SEU-SITE/api/pedidos/ID` (o ID aparece em `GET /api/pedidos`). Sem a senha definida, ninguém consegue remover.
- **Fora do Cloudflare** (aplicativo, Docker, servidor local) não há API: o formulário fica escondido e a página explica que o mural só funciona no site publicado.
- **Site no Cloudflare Pages (`*.pages.dev`):** o Pages só serve arquivos estáticos. `functions/api/[[rota]].js` (Pages Function, na raiz do repositório porque é onde o Pages a procura) repassa `/api/*` ao Worker por um *Service binding* chamado `API`. Sem esse binding, a API responde 503 e a página mostra "O mural de pedidos está fora do ar no momento". Configuração, uma vez só:
  1. Publicar o Worker com os Durable Objects: `npx wrangler login` e depois `npx wrangler deploy` (ou o workflow de deploy do GitHub).
  2. No painel do Cloudflare, em **Workers & Pages → projeto do Pages → Settings → Bindings → Add → Service binding**: nome da variável `API`, serviço `sancta-madre-dei` (o Worker do passo 1). Repetir em Preview, se quiser testar lá.
  3. Fazer um novo deploy do Pages (um push na `main` ou **Retry deployment**), para que a Function e o binding entrem no ar.
  O Worker não tem endereço público (`workers_dev: false` e `preview_urls: false` em `wrangler.jsonc`): quem visita só vê o endereço do Pages, e o Worker só responde pelo binding. Para um endereço mais bonito que `pages.dev`, ligue um domínio próprio ao projeto do Pages em **Custom domains**; o mural continua funcionando sem mudar nada no código.
  Se o Cloudflare recusar o nome do Worker por já existir um projeto do Pages com o mesmo nome, troque `name` em `wrangler.jsonc` (por exemplo, `sancta-madre-dei-api`) e use esse nome no binding.

## Aplicativo instalável (PWA, 8/10/2026)
O site pode ser instalado na tela inicial do Android e do iPhone. Nada disso entra no build do aplicativo Android (`--app`), que já é nativo.

- **Manifesto:** um por idioma (`manifest.<idioma>.webmanifest`, gerado em `build.mjs`), todos com o mesmo `id`, para que instalar em qualquer idioma seja o mesmo aplicativo. `start_url` é o início do idioma; `scope` é o site inteiro. Ícones em `site/src/assets/img/favicons/` (pacote entregue pelo autor: PNGs de 16 a 512 px, `favicon.ico` com seis tamanhos, `apple-touch-icon.png` de 180 px e `icon-maskable-512x512.png` com fundo marfim; as instruções originais do pacote ficam em `docs/favicons/`). O build copia o `favicon.ico` também para a raiz da saída.
- **Service worker:** modelo em `site/src/pwa/sw.js`; o build grava `dist/sw.js` com a versão (data do build), a base e a lista de pré-cache (estilos, scripts, fontes, ícones e as páginas `/offline/` de cada idioma). Páginas: rede primeiro, depois a cópia guardada, depois a página offline do idioma. Arquivos de `/assets/`: cópia guardada na hora e atualização em segundo plano. `/api/` (mural e contador) nunca é guardado. Limites: 60 páginas e 220 arquivos; versões antigas do cache são apagadas na ativação.
- **Página `/instalar/`:** seletor de aparelho (dois rádios nativos dentro de `fieldset`, estilizados como cartões em `instalar.css`), passo a passo para Android (Chrome e Samsung Internet) e iPhone/iPad (Safari, menu Compartilhar), botão «Instalar agora» quando o navegador oferece o convite (`beforeinstallprompt`, só Android), e orientação para remover. `site/src/assets/js/pwa.js` registra o service worker, detecta o aparelho (preseleção, sem esconder a outra opção), aceita `#android` e `#ios` no endereço e avisa quando o site já está instalado. Sem JavaScript, o painel muda pelo rádio com `:has()`; em navegadores sem `:has()`, as duas orientações aparecem.
- **Servidores:** `deploy/nginx.conf` serve `sw.js` e os manifestos sem cache e com o tipo `application/manifest+json`; `serve.mjs` também usa esse tipo. No Cloudflare, o padrão de arquivos estáticos já revalida a cada acesso.

## Decisões
| Decisão | Motivo |
|---|---|
| Gerador próprio | Hospedagem gratuita, manutenção mínima, sem cadeia de dependências |
| Conteúdo em JSON | Diffs revisáveis; a validação protege as regras editoriais |
| Validação falha o build | Nenhum registro reconhecido sem autoridade, data, documento e fonte; nenhuma imagem sem crédito completo e variantes geradas |
| Rascunhos fora do público | `status: draft` nunca entra em páginas, busca, cronologia, sitemap nem relações |
| Imagens: originais fora do git, variantes versionadas | Repositório enxuto e builds sem ImageMagick; `fetch-art` + `prepare-images` reproduzem tudo |
| WebP responsivo (480/800/1280/1800) com `srcset` | Desempenho; AVIF não estava disponível no ImageMagick local |
| Ponto focal por obra e `object-fit` | Enquadramento seguro de rostos em qualquer formato |
| Bruma (80 px) em vez de `filter: blur` | Atmosfera de cor sem custo de pintura |
| GSAP copiado para `site/src/assets/vendor/` | Sem CDN; versão fixa; licença anexada |
| `filtro.js` (UMD) | A mesma lógica de busca roda no navegador e nos testes |
| Sem banco, auth ou painel | Nenhuma necessidade concreta |

## Páginas geradas
`/`, `/vida-de-maria/…`, `/fe-catolica/…`, `/aparicoes/…`, `/milagres/…`, `/promessas/` e `/devocoes/…`, `/titulos/…`, `/oracoes/…` (inclui `/oracoes/rosario/`), `/galeria/`, `/cronologia/`, `/biblioteca/`, `/sobre/`, `/busca/`, `/404.html`, `sitemap.xml`, `robots.txt`, `assets/obras.json` (dados da visualização ampliada, carregado só ao abrir uma obra).

## Mapa
Atlas `/maria-pelo-mundo/` (interativo) e, desde 8/10/2026, mapa estático em `/aparicoes/` (mesmos contornos e projeção, `apparitionsMap()` em `build.mjs`). Só entram coordenadas conferidas no Wikidata, e cada ponto diz se marca o acontecimento, o santuário ou a localidade (`refersTo`). A lista de locais com coordenadas e a cronologia são as alternativas em texto.
