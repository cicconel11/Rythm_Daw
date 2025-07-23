# ---------- builder stage ----------
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Copy server package files
COPY server/package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy server source code (excluding node_modules)
COPY server/src ./src
COPY server/prisma ./prisma
COPY server/tsconfig*.json ./
COPY server/nest-cli.json ./

# compile the API and fail if main.js is missing
RUN rm -rf dist/ && \
  npx tsc -p tsconfig.build.json && \
  cp -r src/public dist/ 2>/dev/null || true && \
  test -f dist/src/main.js

# ---------- runtime stage ----------
FROM node:20-slim AS runner
WORKDIR /app

# copy compiled output + runtime deps
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

# Create startup script
RUN echo '#!/bin/sh\nnpx prisma generate\nnode dist/src/main.js' > /app/start.sh && \
  chmod +x /app/start.sh

# run the compiled Nest app
CMD ["/app/start.sh"]
