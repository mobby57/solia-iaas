#!/bin/sh
# Script to test MongoDB connection inside the mongo container

echo "Connecting to MongoDB container and running basic commands..."

# Use mongosh shell from the container image path
docker exec -it solia-mongo mongosh --eval "printjson(db.adminCommand('ping'))"

echo "MongoDB connection test completed."
