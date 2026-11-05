# Imagem de produção. O banco SQLite fica em /dados (monte um volume).
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN NEXT_TELEMETRY_DISABLED=1 DATABASE_PATH=/tmp/build.db npm run build

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 DATABASE_PATH=/dados/app.db PORT=3000
# TRUSTED_PROXY_HOPS não tem valor padrão de propósito: informe no docker run (-e TRUSTED_PROXY_HOPS=1)
# e deixe a porta 3000 acessível só pelo proxy.
COPY --from=build /app ./
VOLUME ["/dados"]
EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
