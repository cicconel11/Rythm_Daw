# ---------- builder stage ----------
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# Copy website package files
COPY website/package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# shared libs (cache-friendly layers)
COPY ui-kit        /app/ui-kit
COPY lovable-src   /app/lovable-src
# then Website code
COPY website       /app/website
COPY website/src ./src
COPY website/pages ./pages
COPY website/tsconfig.json ./
COPY website/next-env.d.ts ./
COPY website/jest.setup.js ./

# build the Next.js site
RUN npm run build

# ---------- runtime stage ----------
FROM node:20-slim AS runner
WORKDIR /app

# copy built output + node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# start Next.js
CMD ["npm", "run", "start"] 