#!/bin/bash

# Load environment variables from .env file
source ./load_env.sh

# Bring down any existing Docker containers + volumes
cd ../../
docker compose down -v
# Bring up Docker containers with the latest build
docker compose up -d --quiet-pull --build

# Wait for API readiness
cd docs/tests
api_host="https://localhost:5000/openapi.json"
sleep 3
./wait.sh $api_host

# Run Newman tests
cd collections
newman run AuctionIntegrationTesting.postman_collection.json -e environment.postman_globals.json --insecure
NEWMAN_EXIT_CODE=$?

# Bring down Docker containers after tests
cd ../../../
docker compose down -v

# Return the same response code as Newman
exit $NEWMAN_EXIT_CODE
