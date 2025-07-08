#!/bin/bash
# Restart the API server

# Kill any running server
pkill -f "pnpm run start:dev" || true

# Start the server in the background
cd server && pnpm run start:dev &
