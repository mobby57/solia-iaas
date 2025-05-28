# Étape build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN npm run build

# Étape production
FROM node:18-alpine AS prod

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/index.js"]
