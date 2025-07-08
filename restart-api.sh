#!/usr/bin/env bash
# Restart only the Rhythm API dev server.
# Looks for the command that contains "pnpm run start:dev"
# (adjust the pattern if your dev script name differs).

set -euo pipefail

PATTERN="pnpm run start:dev"   # <-- edit if your server script is different

# Find PID of the running API dev server
PID=$(pgrep -fl "$PATTERN" | awk '{print $1}' || true)

if [[ -n "${PID:-}" ]]; then
  echo "🔄  Killing old API dev server (pid $PID)…"
  kill "$PID"
  sleep 1
fi

echo "🚀  Starting API dev server…"
# Run in background to give the shell back to Windsurf
pnpm --filter server run start:dev &

echo "✅  API restarted"
