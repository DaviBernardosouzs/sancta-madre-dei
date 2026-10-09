# ==========================================
# Base
# ==========================================

FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./


# ==========================================
# Development
# ==========================================

FROM base AS development

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


# ==========================================
# Build
# ==========================================

FROM base AS builder

RUN npm ci

COPY . .

RUN npm run build


# ==========================================
# Preview / Serve
# ==========================================

FROM builder AS preview

EXPOSE 4173

CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0"]


# ==========================================
# Production
# ==========================================

FROM nginx:alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

COPY --from=builder /app/art-originals /usr/share/nginx/html/art-originals

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]