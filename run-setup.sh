#!/bin/bash
export PATH="/home/rudra/.local/bin:$PATH"

echo "Tearing down existing devnet..."
docker compose down -v

echo "Starting Docker containers..."
docker compose up -d --wait

echo "Compiling smart contracts..."
npm run compile

echo "Deploying contract..."
npm run deploy
