# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments para variáveis de ambiente
ARG GEMINI_API_KEY

# Variáveis de ambiente para o build
ENV GEMINI_API_KEY=$GEMINI_API_KEY

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copia package.json para instalar dependências de produção
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist

# Instala apenas vite para o preview (mais leve que serve)
RUN npm install -g vite

# Expõe porta 4322
EXPOSE 4322

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4322/ || exit 1

# Serve os arquivos estáticos usando vite preview na porta 4322
CMD ["vite", "preview", "--host", "0.0.0.0", "--port", "4322"]

