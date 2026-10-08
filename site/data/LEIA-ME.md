# Dados de apoio do build

Nada desta pasta é publicado: o gerador lê estes arquivos para desenhar os mapas, e o resultado vai para o HTML.

- `natural-earth/`: `ne_110m_land.geojson` e `ne_110m_admin_0_countries.geojson`, contorno simplificado das terras emersas (escala 1:110 milhões) do projeto **Natural Earth** (https://www.naturalearthdata.com/), obtido em 5 de outubro de 2026 no repositório `nvkelso/natural-earth-vector`. Natural Earth está em **domínio público**; a atribuição é opcional e mantida aqui por cortesia.
- `mapa/`: `terra.json` e `paises.json`, o mapa-múndi do atlas (projeção Equal Earth), gerados a partir do Natural Earth por `npm run mapa` (`site/scripts/ferramentas/make-map.mjs`). O mapa não identifica fronteiras políticas.
- `peregrinacao/`: rota e pontos da peregrinação da Sagrada Família. Os caminhos destes arquivos são declarados em `content/pilgrimage.json` (`map.routeFile` e `map.waypointsFile`), e é de lá que o gerador os lê.
