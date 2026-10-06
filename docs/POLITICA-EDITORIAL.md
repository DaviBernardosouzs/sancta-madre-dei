# Política editorial

## Regras inegociáveis
1. Separar Escritura, doutrina, contexto histórico, tradição devocional, revelação privada, milagre reconhecido e relato sem reconhecimento.
2. Não inventar datas, falas de Maria, documentos, números, pareceres médicos nem decisões eclesiais.
3. Nomear a autoridade exata. Decisão de bispo diocesano não é "reconhecida pelo Vaticano" (o validador bloqueia essa expressão).
4. Não confundir: reconhecimento de aparição, autorização de culto, nihil obstat, reconhecimento de milagre específico, avaliação médica de cura inexplicada.
5. Decisões anteriores às normas de 2024 (Dicastério para a Doutrina da Fé) mantêm a terminologia da época.
6. Milagres: obras de Deus atribuídas à intercessão de Maria, segundo a compreensão católica. Nenhuma orientação para interromper tratamento médico.
7. Promessas: origem, atribuição, fonte e limites. Nenhuma prática como mecanismo que garanta cura, riqueza, proteção física ou salvação.
8. Lacuna é registrada como lacuna (`gaps`). Ausência de fonte encontrada não é prova de rejeição pela Igreja.
9. Imagens: só com autoria, instituição, origem, licença e data de consulta registradas. Reproduzir uma pintura antiga não a torna livre por si só: a licença vem da declaração do acervo (Open Access do Met, CC0) ou da página do arquivo no Wikimedia Commons, lida e registrada. Imagem de arte sacra não é evidência histórica; legendas dizem isso. Nenhuma imagem gerada por IA entra como registro histórico. Figuras sacras nunca são animadas (nada de olhos, expressões ou membros em movimento); o movimento está na apresentação da obra.

## Adicionar um registro
1. Abra e leia a fonte (não use resumos de busca como única evidência). Registre-a em `content/sources.json` com `supports` exato.
2. Crie o registro com `"status": "draft"` no arquivo do tipo.
3. Preencha campos, blocos (com fontes) e `gaps`.
4. `npm run validate` até passar. Rascunhos passam por regras mais leves e continuam fora do site.
5. Peça revisão humana (teológica/canônica, e médica para curas). Registre em `review`.
6. Troque para `"status": "published"`, atualize `review.lastVerified` e rode `npm run check`.

## Adicionar uma obra
1. Escolha no acervo de um museu com declaração de uso aberta e confirme `isPublicDomain` e a licença.
2. Acrescente a entrada em `content/images.json` (crédito completo, `alt` descritivo, `focus`, `related`).
3. `npm run fetch-art` e `npm run prepare-images` (requer ImageMagick); confira o enquadramento no navegador.
4. Use em `banner` do registro e inclua o id em `GALERIA_ORDEM` (em `scripts/build.mjs`) para entrar na galeria.
5. `npm run painel` atualiza o painel de referências; `npm run check` valida.

## Corrigir um registro
Confira a fonte, altere o texto, atualize `lastVerified`, rode `npm run check` e registre a mudança no commit (Conventional Commits).

## Revisão
`review.humanTheologicalReview` é `false` em todos os registros desta edição. Só marque `true` quando uma revisão real tiver ocorrido, e anote quem e quando em `review`.
