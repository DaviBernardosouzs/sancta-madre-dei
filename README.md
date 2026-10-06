# Sancta Mater Dei (Santa Mãe de Deus)

Livro digital independente, gratuito e sem fins lucrativos sobre Maria: a vida segundo a Escritura, o lugar dela na fé católica, aparições, devoções, orações e milagres atribuídos à sua intercessão. Cada afirmação relevante aponta para uma fonte, e cada decisão eclesial indica a autoridade que a tomou.

**Este projeto não é um órgão oficial da Igreja Católica.** O conteúdo passou por pesquisa documental, mas **não por revisão teológica, canônica ou médica humana**.

## Escopo da edição atual
Início, leitura guiada, fundamentos da fé, **dossiê documental com 32 capítulos e 512 afirmações numeradas**, aparições (Lourdes e Fátima), milagres (estado vazio honesto e guia), devoções (Rosário e mensagem de Lourdes), títulos marianos, orações (7) com guia do Rosário e modo de leitura, galeria de arte com visualização ampliada, cronologia, biblioteca de fontes e créditos de imagens, sobre e metodologia, busca e filtros. Direção de arte inspirada na pintura sacra renascentista, com movimento em GSAP como camada opcional.

Fora do escopo, por decisão: anúncios, assinaturas, loja, comentários, coleta de testemunhos médicos, cadastro, banco de dados, autenticação e painel administrativo.

## Executar
Requer Node 20 ou superior. Build e servidor usam apenas Node. Para as auditorias de navegador, instale as dependências de desenvolvimento com `npm ci` e o Chromium com `npx playwright install chromium`.

```bash
npm run build      # valida o acervo e gera dist/
npm run serve      # http://localhost:4173
npm run check      # validate + testes + build + verificação de links, imagens e metadados
npm test           # testes (acervo, filtros, imagens, saída do site)
npm run fetch-art       # baixa os originais das obras para art-originals/ (Met: confere domínio público)
npm run prepare-images  # gera as variantes WebP e a bruma (requer ImageMagick: comando "magick")
npm run painel          # gera docs/painel-de-referencias.html
npm run import:dossie -- /caminho/arquivo.md # reimporta o dossiê de pesquisa
npm run audit:visual       # Chromium + axe, capturas em celular/tablet/desktop
npm run audit:interactions # teclado, filtros, movimento e alternativas estáticas
npm run audit:performance  # Lighthouse, simulação de celular
```

As auditorias usam `http://localhost:4183` por padrão: inicie `PORT=4183 npm run serve` em outro terminal, ou informe `PREVIEW_URL`. Os resultados ficam em `docs/capturas/`. Elas não publicam o site.

A apresentação tem entrada em GSAP, enquadramentos ligados à rolagem nativa, manto estrelado com pausa e uma passagem para Maria pelo mundo. “Ler sem animações” vale para todas as páginas e persiste no navegador; a preferência de movimento reduzido do sistema sempre prevalece. Conteúdo, obras e navegação permanecem visíveis sem JavaScript. “Pular apresentação” leva diretamente aos capítulos.

As variantes WebP em `src/assets/img/obras/` já estão versionadas, então **construir o site não exige ImageMagick nem rede**. Os originais (`art-originals/`) ficam fora do git e só são necessários para regerar imagens.

Para produção, defina `SITE_URL` (sitemap e canonical) e, se o site ficar em subcaminho, `BASE_PATH`:

```bash
SITE_URL=https://seu-dominio.exemplo BASE_PATH=/ npm run build
```

## Hospedar
`dist/` é um site estático. Serve em qualquer hospedagem estática (GitHub Pages, Cloudflare Pages, Netlify, servidor próprio). O build **não publica nada** em serviço externo. Páginas de erro: `dist/404.html`.

## Documentação
- [Plano e decisões](docs/PLANO.md)
- [Arquitetura](docs/ARQUITETURA.md)
- [Modelo de conteúdo](docs/MODELO-DE-CONTEUDO.md)
- [Política editorial e como adicionar/revisar registros](docs/POLITICA-EDITORIAL.md)
- [Direção visual, obras e movimento](docs/DIRECAO-VISUAL.md)
- [Storyboard da transformação cinematográfica](docs/STORYBOARD.md)
- [Auditoria das 41 reproduções](docs/AUDITORIA-VISUAL.md)
- [Revisão renderizada e resultados atuais](docs/REVISAO-CINEMATOGRAFICA.md)
- [Painel de referências visuais](docs/painel-de-referencias.html) (abrir no navegador)
- [Verificação realizada](docs/VERIFICACAO.md)
- [Limitações e pendências](docs/PENDENCIAS.md)

## Licenças
Código: uso próprio do autor (sem licença pública definida; definir antes de publicar o repositório). Fontes tipográficas: SIL Open Font License 1.1 (`src/assets/fonts/`). GSAP 3.15: "Standard no charge license" (`src/assets/vendor/GSAP-LICENSE.txt`); confira a licença antes de qualquer uso comercial. Imagens: acervo Open Access do Met (CC0 declarado pelo museu) e Wikimedia Commons (domínio público conforme declarado), com créditos em `content/images.json`, junto a cada imagem e na página Biblioteca. A pasta `public/` contém referências pessoais sem procedência verificada e **não** é publicada.
