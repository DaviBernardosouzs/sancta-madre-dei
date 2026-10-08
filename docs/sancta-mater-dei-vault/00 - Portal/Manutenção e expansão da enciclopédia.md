---
id: manutencao
tipo: guia
titulo: Manutenção e expansão da enciclopédia
aliases: []
fontes_verificadas: false
estado_pesquisa: importado-sem-revalidacao
fontes: []
origens: []
tags:
- mariana/guia
modelos:
- '[[Template — Aparição]]'
- '[[Template — Título]]'
- '[[Template — Milagre]]'
- '[[Template — Vidente]]'
- '[[Template — Santo]]'
- '[[Template — Santuário]]'
- '[[Template — Dogma]]'
- '[[Template — Documento]]'
- '[[Template — Oração]]'
- '[[Template — Acontecimento histórico]]'
---

# Manutenção e expansão da enciclopédia

## Cadastrar uma aparição

Crie uma nota vazia e execute Templates → Inserir template → Template — Aparição. Substitua o id do modelo por um ID estável inédito, troque tipo de template para aparicao e remova tipo_modelado; o título é preenchido pelo Obsidian. Crie uma nota para a sequência e outra para o título. Leia a fonte integral, registre país, datas com precisão, protagonistas e autoridade. Use status_eclesial conforme a decisão, época e alcance. Separe cada relato individual apenas se tiver data, conteúdo e documentação próprios. Vincule fontes, título e pessoas; execute o validador.

## Adicionar um milagre

Use o template Milagre. Diferencie beneficiário e caso. Registre data da cura separada do reconhecimento; identifique decisão episcopal e parecer médico sem equipará-los. Quando houver apenas um catálogo, mantenha a ficha parcial. Não extrapole diagnósticos, autoridades ou decisões. Associe cada afirmação à sua fonte.

## Fontes e relações

Consulte primeiro o índice de fontes para evitar duplicatas por URL ou edição. Uma fonte primária, uma tradução reproduzida e uma notícia sobre ela são registros diferentes. Registre título, instituição, URL, data, acesso, escopo e lacunas. Use menciona para menção textual, protagonistas para participação explícita, beneficiario para pessoa do caso e fontes para documentação. Não use relacionado para sugerir causalidade. Configure essas propriedades no ExcaliBrain conforme o guia de plugins.

## Dicionário de propriedades

| Propriedade | Tipo e significado |
|---|---|
| id | Texto; identidade estável, independente do nome do arquivo. |
| tipo | Texto controlado: aparicao, titulo, milagre, santo, vidente, pessoa, santuario, dogma, documento, oracao, devocao, acontecimento, celebracao, estudo, iconografia, fonte; hub, portal, guia, pesquisa, template e inventario são auxiliares. |
| titulo / aliases | Nome principal e variantes; aliases não devem colidir com outras entidades. |
| pais / continente | Local associado à entidade, não nacionalidade presumida de uma pessoa. |
| ano | Inteiro; ano do início documentado. |
| data_inicio / data_fim | Texto ISO, permitindo precisão de ano ou mês. |
| data_cura / data_reconhecimento | Datas diferentes: evento clínico e ato de reconhecimento. |
| periodo_descricao | Datação textual sem precisão ISO; jamais convertida por suposição. |
| status_eclesial | Formulação circunscrita ao ato identificado; não usar nihil obstat como origem sobrenatural. |
| natureza_documentacao / natureza_fonte | Qualificação editorial e tipo da fonte; a natureza herdada é conservada, inclusive suas limitações. |
| fontes_verificadas | Booleano; true apenas com escopo_verificacao explícito. |
| estado_pesquisa / escopo_verificacao | Estado do trabalho e limite exato da conferência. |
| origens | Lista de arquivos e IDs de origem. |
| fontes | Lista de wikilinks bibliográficos. |
| protagonistas / beneficiario | Listas de participantes explicitamente identificados. |
| menciona / documentado_em | Menção textual e documento que dá contexto à pessoa. |
| titulo_associado / santuario_associado / local_associado | Relações de identidade e lugar, sem afirmar reconhecimento eclesial. |
| expressa_dogma / mensagem_relacionada_ao_dogma | Relação doutrinal específica entre invocação, relato e dogma. |
| documento_de_referencia / documento_contextual | Documento utilizado no desenvolvimento de um assunto. |
| catalogo / indices / aguarda_conferencia | Navegação e fila editorial; não relações históricas. |

Uma mesma dupla de notas pode ter mais de uma relação legítima. O manifest registra a evidência e distingue conexões documentais das de navegação. Não use backlinks como prova de causalidade.

## Mapas, preservação e sincronização

Atualize os Canvas com caminhos relativos reais e rótulos das relações; mantenha a paleta definida em [[Cores e leitura dos grafos]], compartilhada pelo Graph View e pelos Canvas. Não altere as cópias Originais. Faça backup da pasta inteira incluindo .obsidian e use controle de versões.

A importação é unidirecional: JSON/TXT do site → notas. O comando python scripts/vault-build.py compara hashes e aborta se notas geradas foram editadas. Antes de atualizar, faça backup e migre alterações editoriais para seus registros de origem ou para notas manuais. Não apague notas manuais. O manifest.json permite rastrear cada registro.

Futura integração: adotar IDs estáveis, separar o corpo Markdown do adaptador JSON e mapear os tipos editoriais existentes. Um exportador deverá validar datas, fontes, decisões e revisão humana, gerar JSON em área de staging e testar o site antes de qualquer publicação. Nesta entrega o site não recebe alterações nem lê o vault automaticamente.

## Executar a verificação

Na raiz do repositório: `python scripts/vault-validate.py`. Dependência: Python 3 com PyYAML 6; instale `scripts/requirements-vault.txt` em ambiente virtual próprio. O validador não acessa a rede. Examine os erros estruturais e as pendências documentais separadamente; nenhuma lacuna é corrigida inventando dados.

Para sincronizar novas edições: execute `python scripts/vault-inventory.py`, depois `python scripts/vault-build.py` e `python scripts/vault-validate.py`. O inventário guarda cada edição diferente por hash, sem apagar a anterior; manifest.edicoes_importadas registra a cópia utilizada. Se um arquivo do site desaparecer, sua cópia anterior continua preservada. Não tente contornar um conflito de edição apagando hashes: reconcilie a nota com a fonte e preserve uma cópia da contribuição manual.

## Relações e bibliografia

- **modelos:** [[Template — Aparição]], [[Template — Título]], [[Template — Milagre]], [[Template — Vidente]], [[Template — Santo]], [[Template — Santuário]], [[Template — Dogma]], [[Template — Documento]], [[Template — Oração]], [[Template — Acontecimento histórico]]
