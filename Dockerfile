FROM node:22-alpine AS builder

WORKDIR /app

# Copy all files
COPY package.json package-lock.json* tsconfig*.json ./
COPY tsconfig.server.json .
COPY prisma ./prisma
COPY src ./src

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Build server
RUN npx tsc --project tsconfig.server.json

# Build client
RUN cd src/client && rm -rf dist && npm install && npm run build

FROM node:22-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --production

# Copy built server
COPY --from=builder /app/dist ./dist

# Copy built client (use the latest client-dist created above)
COPY --from=builder /app/src/client/dist ./src/client/dist

# Copy prisma
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3000

# Start server
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/server/index.js"]
