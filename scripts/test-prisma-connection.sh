#!/bin/sh
# Script to test Prisma connection to MongoDB inside the api container

echo "Running Prisma connection test inside the api container..."

docker exec -it solia-api npx ts-node /app/testConnection.ts

echo "Prisma connection test completed."
