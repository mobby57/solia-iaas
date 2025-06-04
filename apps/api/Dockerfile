# Multi-stage Dockerfile for monorepo apps/api

# Step 1: builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only the necessary files for building apps/api
COPY package.json package-lock.json ./
COPY apps/api apps/api

# Install dependencies at root
RUN npm install

# Build apps/api
WORKDIR /app/apps/api
RUN npm run build

# Step 2: runner
FROM node:20-alpine

WORKDIR /app

# Copy only build output and package.json from builder
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json

# Install production dependencies only
RUN npm install --omit=dev

EXPOSE 3001

CMD ["node", "dist/index.js"]
