---
id: relatorio-entrega
tipo: relatorio
titulo: Relatório de entrega
fontes_verificadas: false
---

# Relatório de entrega

Atualização visual: o vault agora tem **786 notas**, incluindo [[Cores e leitura dos grafos]]. O Graph View e os cinco Canvas compartilham 12 famílias de cores. Os mapas receberam legendas, títulos legíveis, contagens e grupos mais compactos. Três testes adicionais confirmam cobertura das categorias, equivalência da paleta e preservação das conexões. A renderização continua sujeita à conferência na aplicação.

O vault reúne o conteúdo existente do Sancta Mater Dei como biblioteca histórica, teológica e mariológica. Abra esta pasta no Obsidian e comece por [[Sancta Mater Dei - Enciclopédia Mariana]]. Os dados e o código do site não foram alterados por esta construção; a integração editorial permanece uma proposta documentada.

## Escopo analisado e preservação

Foram examinados **94 arquivos distintos**, incluindo conteúdo, traduções, referências e registros editoriais ou de auditoria do repositório. Foram preservadas **105 cópias arquivísticas**, porque 11 arquivos receberam uma edição diferente durante a execução. As primeiras 91 cópias não foram substituídas. O inventário registra os caminhos, os tamanhos e o SHA-256 de cada edição; o manifest registra a edição usada na importação.

A importação processou **560 registros**: **496 registros JSON** e **64 capítulos TXT**. Os 32 capítulos do dossiê estão incluídos nos 54 artigos JSON. Portanto, foram preservados **96 capítulos**, com **512 afirmações do dossiê** e **1.024 da pesquisa adicional**. O Markdown externo que originou o dossiê não estava disponível; sua redação incorporada no JSON foi preservada.

As traduções foram arquivadas como versões linguísticas, sem criar uma identidade histórica por tradução. Todos os textos de blocos, orações, decisões, limites de fontes e lacunas foram conservados; as cópias originais permitem recuperar todos os campos do registro, inclusive os usados apenas pelo site.

O repositório também recebeu uma reorganização concorrente durante o trabalho. Esta entrega não executou essas mudanças de arquivos ou código. O vault corresponde às edições identificadas em manifest.edicoes_importadas; diferenças posteriores nas fontes do site aparecem no validador como necessidade de sincronização, sem apagar o acervo congelado.

## Notas e relações

São **785 notas de trabalho**: 783 notas geradas, o inventário inicial e este relatório. As cópias Markdown arquivísticas não entram nessa contagem. A biblioteca contém 17 notas de sequências ou discernimentos de aparições, 45 títulos, 72 casos de cura, 44 santuários, 14 documentos, quatro dogmas, santos, videntes, orações, estudos e iconografia. As 72 fichas de cura resultam da união dos registros do catálogo com os rascunhos existentes; essa contagem editorial não é uma nova confirmação médica ou eclesial de 72 casos.

O manifest conserva **3.124 registros de relações com evidência**, correspondentes a **3.093 relações distintas qualificadas**. Destas, **1.380 são relações documentais ou entre assuntos**; as restantes são catálogo, acesso por índices, modelos ou fila de conferência. Não se contabilizou cada backlink automático como uma descoberta histórica. Uma mesma relação pode possuir evidências de mais de um registro.

As notas distinguem o título mariano, o acontecimento relatado, a pessoa e o caso de cura. Variantes nominais aparecem como aliases sem colidir com outras entidades. A Imaculada Conceição como dogma tem nota distinta da invocação Nossa Senhora da Imaculada Conceição. Lourdes e Fátima têm notas próprias de suas sequências.

Há **oito Bases**, **cinco Canvas**, **dez templates** e índices por país, continente, época e tipo. Os mapas possuem grupos por categoria, cores consistentes e arestas derivadas das relações documentadas.

## Bibliografia e confiabilidade

As **167 referências originais** de sources.json foram integralmente preservadas. Referências à mesma URL foram reunidas na identidade bibliográfica correspondente, mantendo todos os IDs de origem no manifest. Também foram preservados os **64 códigos F01–F64** do TXT e as seis referências textuais da peregrinação que não tinham identificador bibliográfico.

Foram conferidas pontualmente a identidade e as sínteses de quatro fontes: as normas de discernimento de 2024, Mater Populi fidelis, a carta sobre Litmanová de 2025 e a notícia institucional sobre Antonietta Raco. As notas dizem exatamente o que foi verificado. Essa conferência não equivale à revisão integral das afirmações associadas nem à autenticação dos decretos ou dos prontuários médicos.

Continuam pendentes:

- Reconsulta integral das referências herdadas; 229 notas bibliográficas permanecem sem conferência integral nesta execução.
- Identificação precisa de edição e URL dos códigos F01–F64; quatro possuem correspondência documental conferida, e os demais 60 exigem pesquisa específica.
- Textos originais dos decretos individuais, processos de cura, diagnósticos e autoridades de cada caso.
- Substituição das fontes terciárias de santuários por documentação oficial quando disponível.
- Revisão histórica, teológica, canônica e médica, conforme o assunto.
- Lacunas originais sobre tradições, cronologias, direitos de traduções e iconografia.

Os 71 nomes do catálogo original não foram artificialmente transformados em um catálogo atualizado. O rascunho de Raco e o capítulo sobre o reconhecimento de 2025 foram associados, com a divergência nominal Antonia/Antonietta explicitada. A antiga contagem de 71 e a informação posterior sobre a 72ª cura ficam datadas e contextualizadas.

O nihil obstat é tratado como juízo pastoral no alcance das normas de 2024, sem equipará-lo a certeza da origem sobrenatural. Visita papal, título de basílica, canonização de um vidente e aprovação de devoção também não foram convertidos em reconhecimento de uma aparição.

Veja [[Pendências documentais e divergências]] e as fontes vinculadas a cada entidade.

## Skills e plugins

As seis skills solicitadas foram instaladas e lidas no escopo local do Codex: obsidian-markdown, obsidian-bases, json-canvas, obsidian-cli, defuddle e knap. Estão em `.agents/skills/`, sem duplicação global. A procedência é kepano/obsidian-skills, revisão `3ccff5338ea700537839b21900aa5358a0402c98`, usando a CLI skills 1.7.0 já existente e inspecionada. O lock registra o repositório oficial; [[Skills — instalação e versões]] contém os caminhos absolutos, os hashes e o motivo da alternativa ao npx.

Os plugins nativos Graph View, Bases, Backlinks, Canvas, Properties View e Templates têm configuração preparada em `.obsidian`. **Nenhum plugin comunitário foi instalado ou declarado funcional.** Sem uma instância automatizável do Obsidian em execução, foi preparado o procedimento exato pelo catálogo oficial: Excalidraw, Dataview, ExcaliBrain e Base Graph. Excalidraw e Dataview precedem ExcaliBrain.

[[Obsidian — configuração e plugins]] contém instalação, ativação e testes de funcionamento. Os executáveis Knap e Defuddle não foram instalados globalmente; as respectivas skills são instruções disponíveis ao agente. O funcionamento do Obsidian CLI também exige a aplicação aberta e a CLI habilitada.

## Testes e resultados

O validador offline aprovou a estrutura sem erros corrigíveis: links quebrados ou ambíguos, IDs duplicados, propriedades inválidas, YAML, datas, bibliografia ausente sem pendência explícita, entidades inexistentes, nós isolados, Bases, Canvas e integridade arquivística. Os blocos originais e todas as afirmações dos capítulos são comparados com sua edição preservada.

**19 testes do vault passaram**, incluindo fixtures com falhas reais e um teste de reimportação que confirma idempotência, preservação de edição manual e recusa de fontes alteradas sem cópia arquivada. **41 testes existentes do site passaram**. A primeira tentativa dos testes do site encontrou EPERM no sandbox ao criar um subprocesso; a execução autorizada fora do sandbox passou.

Comandos repetíveis na raiz do repositório:

```bash
python scripts/vault-inventory.py
python scripts/vault-build.py
python scripts/vault-validate.py
PYTHONDONTWRITEBYTECODE=1 python -m unittest discover -s tests -p 'vault_integrity_test.py' -v
npm test
git diff --check
```

Os resultados estruturais completos ficam em `00 - Portal/validacao.json`. O funcionamento visual de Bases, Canvas, Properties e plugins comunitários **ainda precisa ser testado dentro do Obsidian**. Aprovação estrutural não foi apresentada como teste de renderização.

## Manutenção

[[Manutenção e expansão da enciclopédia]] explica cadastro de aparições e milagres, fontes, relações, mapas, backups, preservação de edições e sincronização unidirecional. O importador protege notas e recursos gerados contra sobrescrita de alterações manuais. Nenhum exportador para produção nem alteração arquitetural do site foi implementado.
