# Checkpoint de trabalho (para retomar sem perder contexto)

Atualizado em 5 de outubro de 2026.

## Estado
- **Lote 1, concluído:** auditoria; fontes novas (Nova Vulgata, apócrifos, Lumen Gentium, Munificentissimus Deus em português, calendário, Custódia, Enciclopédia Católica, Liebieghaus); tipos de bloco novos (apócrifo, devocional, liturgia, arte, decisão, questão em aberto); **jornada da vida de Maria em 13 capítulos** (`content/articles.json`, categoria `vida`) com 20 gravuras de Dürer (série A Vida da Virgem), Fra Carnevale e Pietà do Cloisters; página «Maria, Mãe da Igreja».
- **Lote 2, pendente:** pesquisa e páginas aprofundadas de Aparecida, Guadalupe (México) e Donglü.
- **Lote 3, pendente:** ampliação geográfica (títulos por região), santuários, calendário mariano, atlas com mapa.
- **Lote 4, pendente:** catálogo de milagres e lacrimações (Lourdes, Siracusa, Akita).
- **Lote 5, pendente:** manto estrelado animado, scrollytelling, busca com variantes.

## Como retomar
1. `npm run check` (valida, testa, gera, confere links).
2. Veja `docs/INVENTARIO-PESQUISA.md` para o estado de cada item.
3. Pesquise com os scripts de leitura de fonte (baixar página, extrair texto, conferir a afirmação antes de redigir).
4. Registre cada fonte em `content/sources.json` com `supports` exato; só depois escreva o registro.


## 5 de outubro de 2026
- Atlas `/maria-pelo-mundo/`: mapa com países clicáveis (Natural Earth), seletor de país equivalente por teclado, filtros por região e tipo, busca por variantes do nome. `place.iso` agora é obrigatório.
- Novos modelos: títulos v2, `shrines`, `celebrations`; novas fontes e 9 títulos. Ver `docs/INVENTARIO-PESQUISA.md`.
- Falta: CSS final do atlas (o front será refeito por outra ferramenta), milagres, orações, calendário completo, manto estrelado, introdução animada, capturas em navegador do atlas em celular, documentação final.
