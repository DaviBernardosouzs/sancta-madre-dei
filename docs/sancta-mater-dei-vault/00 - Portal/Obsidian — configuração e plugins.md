---
id: plugins
tipo: guia
titulo: Obsidian — configuração e plugins
aliases: []
fontes_verificadas: false
estado_pesquisa: importado-sem-revalidacao
fontes: []
origens: []
tags:
- mariana/guia
---

# Obsidian — configuração e plugins

## Abrir o vault e ativar nativos

No Obsidian, escolha **Abrir pasta como vault** e selecione sancta-mater-dei-vault. Abra o portal principal. Em **Configurações → Plugins nativos**, confirme Graph View, Bases, Backlinks, Canvas, Properties View e Templates. A configuração foi preparada nos arquivos .obsidian; a ativação efetiva depende da versão instalada. Em Templates, a pasta é 15 - Templates.

Teste Graph View pelo comando Abrir visualização de grafo; selecione Lourdes e confira seus vínculos. Abra uma Base e um Canvas para conferir a renderização na aplicação. O validador estrutural não substitui esse teste visual.

## Instalação comunitária pelo catálogo oficial

Não há uma instância em execução nem sessão automatizável confirmada do Obsidian. Nenhum plugin comunitário foi copiado ou declarado funcional. Procedimento manual autorizado pelo escopo desta entrega:

1. Configurações → Plugins comunitários → Ativar plugins comunitários, se estiver em modo restrito.
2. Procurar/Browse → **Excalidraw** → confira o autor Zsolt Viczian e o [repositório](https://github.com/zsviczian/obsidian-excalidraw-plugin) → Instalar → Ativar.
3. Procurar → **Dataview** → confira [blacksmithgu/obsidian-dataview](https://github.com/blacksmithgu/obsidian-dataview) → Instalar → Ativar.
4. Procurar → **ExcaliBrain** → confira [zsviczian/excalibrain](https://github.com/zsviczian/excalibrain) → Instalar → Ativar. Excalidraw e Dataview devem estar ativos antes.
5. Procurar → **Base Graph** → confira a entrada do [catálogo](https://community.obsidian.md/plugins/base-graph) → Instalar → Ativar. Se não aparecer, atualize a versão do Obsidian e confirme sua disponibilidade no catálogo; não substitua por arquivos remotos arbitrários.
6. Reabra o vault, confira os plugins ativos e registre as versões exibidas. Execute os testes abaixo.

## ExcaliBrain e teste de funcionamento

Em Configurações → ExcaliBrain, localize os campos de relações ontológicas (pais, filhos e amigos) da versão instalada. Mapeie **fontes**, **documentado_em** e **documento_contextual** como contexto documental; **protagonistas**, **beneficiario**, **titulo_associado**, **menciona**, **santuario_associado** e **estudos_relacionados** como relações laterais/amigos. Uma menção não constitui descendência histórica. Não troque os campos YAML do acervo por nomes internos de uma versão do plugin. Se a interface pedir campos por linha, informe os nomes separados conforme a ajuda daquela versão.

Abra Aparições de Lourdes (1858) no ExcaliBrain e confira Santa Bernadette Soubirous, Imaculada Conceição e Santuário de Nossa Senhora de Lourdes. Confira que fontes bibliográficas não são tratadas como aparições. No Dataview, faça uma consulta TABLE tipo, pais FROM "02 - Aparições Marianas". No Excalidraw, crie um desenho de teste e reabra. No Base Graph, abra a Base Aparições e escolha a visualização de grafo conforme a documentação instalada. Registre versão, resultado e eventuais erros. Não marque os plugins como funcionais sem executar esses testes.
