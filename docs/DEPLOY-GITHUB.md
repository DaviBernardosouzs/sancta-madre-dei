# Deploy do site pelo GitHub

O workflow `.github/workflows/deploy.yml` publica o Worker `sancta-madre-dei` em pushes na `main` que alterem o site, conteúdo ou configuração de deploy. Também permite execução manual em **Actions → Deploy do site → Run workflow**. Alterações apenas no vault não disparam publicação.

## Configuração inicial

1. No Cloudflare, em **My Profile → API Tokens → Create Token**, use o modelo **Edit Cloudflare Workers**, limitado à conta que contém o Worker. Use o token gerado; não use a Global API Key.
2. Copie o **Account ID** da conta Cloudflare.
3. No [repositório GitHub](https://github.com/DaviBernardosouzs/sancta-madre-dei/settings/secrets/actions), abra **Settings → Secrets and variables → Actions → New repository secret** e cadastre:
   - `CLOUDFLARE_API_TOKEN`: token do passo 1.
   - `CLOUDFLARE_ACCOUNT_ID`: identificador do passo 2.
4. Na aba **Variables**, cadastre opcionalmente `SITE_URL` com a URL pública completa (`https://...`). Sem ela, o workflow usa a URL retornada pelo Wrangler.
5. Em **Settings → Actions → General**, confirme que GitHub Actions e as actions `actions/*` e `cloudflare/wrangler-action` estão permitidas.
6. Publique o workflow e as alterações da estrutura `site/` na branch `main`. Depois execute o workflow manualmente ou envie uma alteração do site.

O job utiliza o ambiente `production`, que o GitHub cria automaticamente se ainda não existir. Seu status e URL aparecem nos deployments do repositório. É possível configurar regras adicionais em **Settings → Environments → production**.

## Build e acompanhamento

O workflow instala as dependências, valida o conteúdo e executa os testes antes de publicar. O `wrangler deploy` executa `npm run build` através de `wrangler.jsonc`, gera `dist/` e publica os arquivos estáticos junto com o Worker e seus Durable Objects.

Veja logs em **Actions → Deploy do site** e o histórico em **Deployments**. A execução só indica sucesso depois que o Wrangler conclui a publicação; isso não substitui uma verificação funcional do site publicado.

Se o mesmo Worker já tiver deploy automático no Cloudflare Workers Builds, desative esse gatilho ao adotar este workflow para evitar duas publicações por push.

Nunca salve tokens em arquivos ou commits. Para usar a CLI local do GitHub, autentique com `gh auth login`; isso não substitui os secrets exigidos pelo workflow.

Referências: [Wrangler Action](https://github.com/cloudflare/wrangler-action), [ambientes do GitHub](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment).
