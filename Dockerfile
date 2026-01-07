# Multi-stage Dockerfile for Next.js application with Drizzle

# Stage 1: Dependencies (install all deps for build)
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files and lockfiles first to leverage Docker layer caching
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install all dependencies (needed for build steps like prisma generation)
RUN if [ -f pnpm-lock.yaml ]; then \
      corepack enable pnpm && pnpm install --frozen-lockfile --reporter=silent; \
    elif [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund --silent; \
    else \
      npm install --no-audit --no-fund --silent; \
    fi

# Stage 2: Builder
FROM node:24-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy dependencies from deps stage and only necessary project files to minimize context
COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml* package-lock.json* next.config.* tsconfig.json ./
# Copy rest of files (this keeps layer caching effective)
COPY . .

# Build Next.js application
# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1
RUN if [ -f pnpm-lock.yaml ]; then \
      corepack enable pnpm && pnpm build; \
    else \
      npm run build; \
    fi

# Stage 3: Runner (Production)
FROM node:24-alpine AS runner
WORKDIR /app

# Create non-root user (single layer)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs

# Set environment to production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy necessary files from builder
# Next.js standalone output includes server.js and minimal dependencies
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone .
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy runtime-only modules that are not part of the standalone bundle
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@google ./node_modules/@google

# Copy locales and other static assets
COPY --from=builder --chown=nextjs:nodejs /app/locales ./locales
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

# Start the application using the bundled server (standalone)
CMD ["node", "server.js"]
