# ── Stage 1: Install prod deps ────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
 
# ── Stage 2: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# ARG injected by docker build --build-arg SERVICE=order-service
ARG SERVICE
RUN npm run build ${SERVICE}
 
# ── Stage 3: Runtime (smallest possible) ──────────────────────────────────────
FROM node:20-alpine AS runtime
WORKDIR /app
 
ARG SERVICE
ARG BUILD_DATE
ARG GIT_SHA
 
ENV NODE_ENV=production
ENV SERVICE_NAME=${SERVICE}
 
LABEL org.opencontainers.image.created="${BUILD_DATE}"
LABEL org.opencontainers.image.revision="${GIT_SHA}"
LABEL org.opencontainers.image.source="https://github.com/sethava/nest-monorepo-ecommerce"
 
# Copy only what's needed
COPY --from=deps  /app/node_modules        ./node_modules
COPY --from=build /app/dist/apps/${SERVICE} ./dist
# Prisma schema (needed for runtime query engine)
COPY --from=build /app/apps/${SERVICE}/prisma ./prisma
COPY --from=build /app/apps/${SERVICE}/generated ./generated
 
# Health check — uses the /health/live endpoint built in @nestjs/terminus
HEALTHCHECK --interval=15s --timeout=5s --start-period=25s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-3001}/health/live || exit 1
 
EXPOSE ${PORT:-3001}
USER node
CMD ["node", "dist/main"]