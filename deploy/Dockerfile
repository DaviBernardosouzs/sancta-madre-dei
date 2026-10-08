# Imagem do site estático: o Node gera dist/ (sem dependências npm) e o nginx serve.
# Contexto do build: a raiz do repositório (ver docker-compose.yml).
#   docker build -f deploy/Dockerfile -t sancta-mater-dei .

# ==========================================
# Build: gera o site nos 8 idiomas
# ==========================================

FROM node:22-alpine AS build

WORKDIR /app

# só o que o gerador lê: o código do site e o acervo
COPY site ./site
COPY content ./content

# endereço público usado no sitemap, no canonical e nos hreflang
ARG SITE_URL=http://localhost:8080
ENV SITE_URL=$SITE_URL

RUN node site/scripts/build-all.mjs


# ==========================================
# Produção: nginx servindo dist/
# ==========================================

FROM nginx:alpine AS production

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
