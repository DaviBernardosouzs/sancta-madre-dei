# Arquitetura

## Visão geral
Gerador estático em Node, sem dependências de execução. Conteúdo em JSON versionado, validado a cada build. Saída em HTML semântico; JavaScript e GSAP são melhoria progressiva.

Atualização visual (05/10/2026): `src/assets/cinematic.css` complementa o sistema original; `app.js` concentra a preferência de movimento, as timelines e sua limpeza. Playwright, axe e Lighthouse são apenas dependências de desenvolvimento para as auditorias reproduzíveis em `scripts/*-audit.mjs`. `prepare-images.mjs --only-derived` atualiza os recortes e o manifesto sem remover as variantes completas. Notas Obsidian foram consultadas; a atualização desta execução é mantida em `docs/` no repositório.

```
content/            acervo em JSON (fontes, aparições, milagres, devoções, títulos, orações, artigos, imagens, rosário)
scripts/lib/        content.mjs (carga e validação), format.mjs (datas com precisão, normalização)
scripts/build.mjs   validação, páginas, galeria, obras.json, sitemap, robots
scripts/fetch-art.mjs      baixa os originais das obras (Met: só se isPublicDomain)
scripts/prepare-images.mjs gera variantes WebP responsivas, bruma e recortes (requer ImageMagick)
scripts/make-painel.mjs    gera docs/painel-de-referencias.html
scripts/validate.mjs, check-links.mjs, serve.mjs
src/assets/         style.css, app.js, filtro.js, canvas.png, fontes, vendor (GSAP), img/obras (WebP)
tests/              node:test
art-originals/      originais baixados (ignorado pelo git)
dist/               saída (ignorada pelo git)
```

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
| GSAP copiado para `src/assets/vendor/` | Sem CDN; versão fixa; licença anexada |
| `filtro.js` (UMD) | A mesma lógica de busca roda no navegador e nos testes |
| Sem banco, auth ou painel | Nenhuma necessidade concreta |

## Páginas geradas
`/`, `/vida-de-maria/…`, `/fe-catolica/…`, `/aparicoes/…`, `/milagres/…`, `/promessas/` e `/devocoes/…`, `/titulos/…`, `/oracoes/…` (inclui `/oracoes/rosario/`), `/galeria/`, `/cronologia/`, `/biblioteca/`, `/sobre/`, `/busca/`, `/404.html`, `sitemap.xml`, `robots.txt`, `assets/obras.json` (dados da visualização ampliada, carregado só ao abrir uma obra).

## Mapa
Adiado: nenhuma coordenada foi verificada em fonte. O modelo já aceita `place.coordinates`. A lista de locais e a cronologia são as alternativas acessíveis.
