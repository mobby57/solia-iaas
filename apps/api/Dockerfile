# Use official Node.js LTS image as base
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies including devDependencies for build
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code if applicable
RUN npm run build

# Expose the port the app runs on
EXPOSE 3001

# Start the application
CMD ["node", "dist/index.js"]
