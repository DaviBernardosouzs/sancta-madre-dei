# Modelo de conteúdo

Todo registro tem `id` estável (ex.: `apar-lourdes-1858`), `slug`, `status` (`published` ou `draft`), `title`, `summary`, `review` e relações por id. Os campos obrigatórios por tipo são impostos por `site/scripts/lib/content.mjs`.

## Fontes (`sources.json`)
`id`, `type` (magisterio, catecismo, escritura, decreto-diocesano, santuario, estudo), `title`, `institution`, `url` (https), `documentDate`, `accessedDate`, `note`, `supports` (as afirmações exatas que a fonte sustenta).

## Blocos de texto
Cada bloco tem `kind` (escritura, doutrina, historia, tradicao, revelacao-privada, relato, nota), `heading`, `text` e `sources`. Só `nota` (nota editorial) pode ficar sem fonte. O rótulo do tipo aparece sempre em texto na página.

## Aparições
`place` (nome, localidade, região, país, `coordinates` ou `null`), `period` com `precision` (dia, mes, ano), `people`, `blocks`, `decisions[]`, `gaps[]`, `relations`, `imageIds`.
`ecclesialCategory` (obrigatória): `aparicao-reconhecida`, `inquerito-sem-declaracao`, `nihil-obstat-2024` ou `juizo-doutrinal-2024`; o validador exige decisões compatíveis e recusa «reconhecimento de aparição» depois de 17/5/2024 e «nihil obstat» antes dessa data. `place.macro` obrigatório; `place.coordinates.refersTo` (`acontecimento`, `santuario`, `localidade`). `timeline[]` (opcional): `date`, `precision`, `kind` (`relato`, `historia`, `devocao`), `text`, `sources` (obrigatórias); as decisões entram sozinhas na cronologia da ficha.
Cada decisão: `id`, `date` + `datePrecision`, `authority`, `authorityLevel` (diocesano, conferencia-episcopal, santa-se, papal), `kinds[]` (reconhecimento-da-aparicao, autorizacao-de-culto, nihil-obstat, reconhecimento-de-milagre, avaliacao-medica, outra), `scope` (alcance e limites), `document`, `documentSourceId`, `quote`, `plain` (explicação em linguagem simples), `sources`.

## Milagres
Três camadas separadas: `event` (acontecimento relatado, com `sources` obrigatórias), `medicalInvestigation`, `ecclesialDecision` (autoridade, data, documento, fontes). Um milagre só pode ser `published` com a decisão completa e fonte. Texto que oriente a interromper tratamento médico reprova o build.

## Devoções e promessas
`nature` (pratica-de-oracao, mensagem-atribuida, promessa-atribuida), `attribution` (quem, como, limites) e `promises[]`. Cada promessa exige texto, `attributedTo`, `origin`, `natureOfAttribution`, `limits` e fonte, e rejeita linguagem de garantia automática.

## Orações
`text[]` (cópia literal da fonte), `provenance`, `rights`, `sources` e, opcionalmente, `blocks[]` com introdução e notas (onde ficam as melhorias editoriais; o texto da oração não é editado).

## Títulos com página principal
`mainRecord`: id do registro publicado que é a página principal do assunto (por exemplo, a ficha da aparição). O título vira resumo, sem duplicar o histórico de decisões, e mostra a situação eclesial da página principal.

## Pesquisa documentada (`pesquisa-relacoes.json`)
`capitulos.<n>.registros[]`: páginas principais do assunto de cada capítulo (só publicados); `capitulos.<n>.conferencia[]`: divergências encontradas ao reler as fontes (`texto`, `fontes`). As ligações aparecem no capítulo e, de volta, em «Relacionados».

## Imagens (`images.json`)
Estrutura `{ images: [...], derived: [...] }`. Cada imagem: `id`, `slug`, `kind` (`obra` ou `documento`), `title`, `titleOriginal`, `author`, `dateText`, `medium`, `dimensions`, `institution`, `accession` e `creditLine` (obras do Met), `origin`, `originUrl`, `license`, `licenseUrl`, `retrievedDate`, `rightsNote`, `alt`, `caption`, `source` (`{type: "met", objectId}` ou `{type: "url", url, file}`), `process` (`trim`, `inset`, `shave`), `focus` (`desktop` e `mobile`, em %), `related` (ids de registros) e `usedFor`. Os recortes em `derived` (`id`, `from`, `crop`, `widths`, `alt`) herdam o crédito da obra de origem.

Registros usam `banner` (id da imagem de abertura) e, nas aparições, `imageIds` (imagens documentais). O build recusa: crédito incompleto, ponto focal ausente, arquivo ou variante inexistente, banner inexistente, obra do Met sem número de acesso.
