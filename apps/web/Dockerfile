# Multi-stage Dockerfile for monorepo apps/web

# Step 1: builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy entire monorepo
COPY package.json package-lock.json ./
COPY apps/api /app/apps/api
COPY apps/web /app/apps/web



# Install dependencies at root
RUN npm install

# Build apps/web
WORKDIR /app/apps/web
RUN npm run build


# Step 2: nginx static server
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built React app from builder
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
