---
id: guia-visual-grafos
tipo: guia
titulo: Cores e leitura dos grafos
fontes_verificadas: false
cssclasses:
  - smd-graph-legend
---

# Cores e leitura dos grafos

[[Sancta Mater Dei - Enciclopédia Mariana|Voltar à enciclopédia]]

A mesma paleta identifica os conteúdos no Graph View e nos cinco Canvas. A categoria também aparece escrita: a navegação não depende apenas da cor.

| Categoria | Cor | Propriedades tipo |
|---|---|---|
| Aparições | `#4C9FE8` | `aparicao` |
| Títulos marianos | `#D6A64B` | `titulo` |
| Milagres e curas | `#E27373` | `milagre` |
| Santos, videntes e pessoas | `#69B887` | `santo`, `vidente`, `pessoa` |
| Dogmas e doutrina | `#AF8CE0` | `dogma` |
| Documentos da Igreja | `#798DE1` | `documento` |
| Orações e devoções | `#42B8AD` | `oracao`, `devocao` |
| Santuários | `#DB8B50` | `santuario` |
| História e estudos | `#72BED1` | `estudo`, `acontecimento`, `celebracao` |
| Iconografia | `#CF8CB7` | `iconografia` |
| Fontes e bibliografia | `#929AA6` | `fonte` |
| Navegação e pesquisa | `#A7A59E` | `hub`, `portal`, `guia`, `pesquisa`, `inventario`, `relatorio`, `template` |

## Explorar o grafo

Abra Graph View e expanda **Grupos** para ver as buscas associadas às cores. Os grupos classificam as notas pelo campo tipo, mesmo que você mova seus arquivos. Para uma leitura mais limpa, acrescente ao filtro `-[tipo:hub] -[tipo:portal] -[tipo:guia] -[tipo:pesquisa] -[tipo:relatorio] -[tipo:inventario]`. Para concentrar-se nos assuntos, acrescente também `-[tipo:fonte]`; remova esse filtro quando quiser explorar a bibliografia.

No grafo local, comece com profundidade 1 e aumente para 2 quando precisar de contexto. As cores indicam assunto, não confiabilidade, reconhecimento eclesial ou ordem cronológica. Consulte fontes_verificadas, status_eclesial e as fontes de cada nota.

## Mapas temáticos

Cada Canvas tem título, contagem de notas e relações, legenda e grupos com nomes legíveis. As conexões usam a cor da categoria de origem. Cartões e categorias foram organizados com espaçamento consistente.

- [[13 - Mapas de Conhecimento/História de Maria.canvas|História de Maria]]
- [[13 - Mapas de Conhecimento/Aparições no mundo.canvas|Aparições no mundo]]
- [[13 - Mapas de Conhecimento/Dogmas e doutrina.canvas|Dogmas e doutrina]]
- [[13 - Mapas de Conhecimento/Milagres documentados.canvas|Milagres documentados]]
- [[13 - Mapas de Conhecimento/Relações entre santos e devoções.canvas|Relações entre santos e devoções]]

## Aparência

O snippet sancta-mater-dei está preparado em .obsidian/snippets. Se o vault já estava aberto, confira **Configurações → Aparência → CSS snippets → Recarregar → sancta-mater-dei**. Ele suaviza os cartões e apresenta as categorias coloridas na legenda e nas pastas; funciona em temas claro e escuro. Se os grupos antigos persistirem, feche e reabra o vault.

A configuração de cores dos plugins comunitários pode variar. Esta entrega aplica a paleta ao Graph View nativo e ao Canvas; não declara configuradas interfaces de plugins ausentes.
