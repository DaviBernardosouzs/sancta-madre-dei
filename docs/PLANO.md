# Plano e decisões — Sancta Mater Dei

Registrado em 2026-10-04, antes da implementação.

## Ambiente inspecionado
- Repositório vazio (git sem commits). Sem README, sem instruções de agentes.
- Vault Obsidian em `~/Documentos/Obsidian Vault` (sem índice; notas de estudo de outras áreas). Será criada uma pasta `Sancta Mater Dei` com nota-índice ligada aos conceitos.
- Skills de design (ex.: taste/design-taste-frontend) **não** estavam instaladas no repositório no momento da execução; princípios de acessibilidade e identidade visual foram aplicados manualmente (ver `POLITICA-EDITORIAL.md` e `ARQUITETURA.md`).
- Pesquisa web disponível (WebFetch). Fontes foram abertas e lidas; resumos de busca não foram usados como única evidência.

## Decisões de arquitetura (reversíveis)
| Decisão | Escolha | Motivo |
|---|---|---|
| Geração | Gerador estático próprio em Node (zero dependências) | Hospedagem gratuita, indexável, sem banco/auth/painel; sem cadeia de dependências a manter |
| Conteúdo | JSON versionado em `content/` | Diffs revisáveis; validação por esquema próprio |
| Busca/filtros | Índice JSON gerado no build + JS leve; funciona sem JS como lista | Acessibilidade e robustez |
| Fontes tipográficas | Pilha serifada do sistema | Sem requisições externas, sem rastreamento, rápido |
| Imagens | Nenhuma obra de terceiros nesta versão | Licenças não verificadas; ornamento SVG original |
| Mapa | **Adiado** (coordenadas não verificadas); lista e cronologia acessíveis entregues | Evitar falsa precisão |

## Ciclos
1. Modelo de dados + validação + testes.
2. Conteúdo verificado (somente o que foi lido na fonte).
3. Gerador, páginas, CSS, busca.
4. Verificação visual, acessibilidade, build, testes.
5. Documentação e vault.
