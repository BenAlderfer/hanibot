# syntax=docker/dockerfile:1

# ---- build stage: compile TypeScript ----
FROM node:26-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run compile

# ---- runtime stage: production deps + compiled output only ----
FROM node:26-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/build ./build
USER node
# Healthy while the bot keeps refreshing its heartbeat file (see src/health.ts).
HEALTHCHECK --interval=60s --timeout=5s --start-period=60s --retries=3 \
  CMD node -e "process.exit(Date.now() - require('fs').statSync('/tmp/hanibot-healthy').mtimeMs < 120000 ? 0 : 1)"
CMD ["node", "build/index.js"]
