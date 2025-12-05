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

COPY --from=builder /app/dist ./dist

# Instala servidor estático leve
RUN npm install -g serve

EXPOSE 4322

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4322/ || exit 1

CMD ["serve", "-s", "dist", "-l", "4322"]
