# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=$GEMINI_API_KEY

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copia somente o necessário para produção
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist

# Instala apenas dependências de produção, caso existam
RUN npm install --production

# Instala vite globalmente
RUN npm install -g vite

EXPOSE 4322

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4322/ || exit 1

CMD ["vite", "preview", "--host", "0.0.0.0", "--port", "4322"]
