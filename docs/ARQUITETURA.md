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
    img/                        obras (WebP e manifest.json), canvas.png e icone.svg
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
worker/                     back-end no Cloudflare: contador de visitas (/api/visitas); wrangler.jsonc na raiz
deploy/                     Dockerfile, docker-compose.yml e nginx.conf (site estático servido pelo nginx)
android/, capacitor.config.json, store/   aplicativo Android e Play Store
docs/                       decisões, auditorias, capturas e referencias-pessoais/ (não publicadas)
scripts/, tests/            só as ferramentas do vault Obsidian (vault-*.py) e o teste delas
dist/, dist-app/            saída do site e do aplicativo (ignoradas pelo git)
```

Docker: `docker compose -f deploy/docker-compose.yml up --build` gera o site dentro da imagem (o gerador não tem dependências npm) e o serve em http://localhost:8080, com a página 404 de cada idioma. O contador de visitas só existe no Cloudflare; no Docker o rodapé simplesmente não o mostra.

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
Adiado: nenhuma coordenada foi verificada em fonte. O modelo já aceita `place.coordinates`. A lista de locais e a cronologia são as alternativas acessíveis.
