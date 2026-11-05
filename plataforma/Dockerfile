# Imagem de produção. O banco é Postgres: informe DATABASE_URL (veja docker-compose.yml).
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN NEXT_TELEMETRY_DISABLED=1 npm run build

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000
# TRUSTED_PROXY_HOPS não tem valor padrão de propósito: informe no docker run (-e TRUSTED_PROXY_HOPS=1)
# e deixe a porta 3000 acessível só pelo proxy.
COPY --from=build /app ./
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["npx", "next", "start", "-p", "3000"]
