# ==================================================
# STAGE 1: Build Stage
# ==================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code and configuration files
COPY tsconfig*.json ./
COPY openapi.yaml ./
COPY src ./src

# Set placeholder DATABASE_URL for Prisma Client generation during build
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public"

# Generate Prisma Client & compile TypeScript
RUN npx prisma generate
RUN npm run build

# Prune devDependencies to keep image size small
RUN npm prune --production

# ==================================================
# STAGE 2: Production Runtime Stage
# ==================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Security: Run as non-root user
USER node

# Copy built artifacts, openapi spec, and production dependencies from builder stage
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node --from=builder /app/openapi.yaml ./openapi.yaml

EXPOSE 5000

# Execute database migrations on startup then launch HTTP server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
