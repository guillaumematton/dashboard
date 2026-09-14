FROM node:20-slim AS builder

COPY . /app

WORKDIR /app

RUN npm ci

RUN npm run build

FROM node:20-slim AS runner

WORKDIR /app

COPY --from=builder /app/build/standalone /app

COPY --from=builder /app/public /app/public

COPY --from=builder /app/build/static /app/build/static

RUN groupadd -g 1001 appgroup && \
    useradd --no-log-init -u 1001 -g appgroup -m -s /usr/sbin/nologin appuser

USER appuser

ENTRYPOINT ["node", "/app/server.js"]