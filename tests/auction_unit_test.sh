#!/bin/bash

# Load environment variables from .env file
source ./load_env.sh

# Bring down any existing Docker containers
cd ../services/Auction
docker compose down
# Bring up Docker containers with the latest build
docker compose up -d --quiet-pull --build

# Wait for API readiness
cd ../../tests
api_host="https://localhost:5000/openapi.json"
sleep 3
./wait.sh $api_host

# Run Newman tests
cd collections
newman run AuctionTesting.postman_collection.json -e environment.postman_globals.json --insecure
NEWMAN_EXIT_CODE=$?

# Bring down Docker containers after tests
cd ../../services/Auction
docker compose down

# Return the same response code as Newman
exit $NEWMAN_EXIT_CODE
