#!/bin/bash

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Kill any processes using port 3000
echo "🔴 Stopping any processes on port 3000..."
lsof -ti :3000 | xargs kill -9 2>/dev/null || true

# Start the server in the background
echo "🚀 Starting Rythm server..."
cd "$SCRIPT_DIR/server" && pnpm run start:dev &

# Wait a moment for the server to start
sleep 3

# Start the UI dev server on port 3001
echo "💻 Starting Rythm UI development server on port 3001..."
cd "$SCRIPT_DIR/ui-dev" && PORT=3001 pnpm run dev

# Keep the script running until both processes are done
wait
