#!/usr/bin/env bash
# Boots Server (:8000) and Client (:3000) together for local dev.
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

for side in Server Client; do
	if [ ! -f "$ROOT_DIR/$side/.env" ]; then
		echo "warning: $side/.env is missing — the app will likely fail to start." >&2
	fi
	if [ ! -d "$ROOT_DIR/$side/node_modules" ]; then
		echo "Installing $side dependencies..."
		(cd "$ROOT_DIR/$side" && npm install)
	fi
done

cleanup() {
	echo "Stopping..."
	kill "$SERVER_PID" "$CLIENT_PID" 2>/dev/null
}
trap cleanup EXIT INT TERM

echo "Starting backend  -> http://localhost:8000"
(cd "$ROOT_DIR/Server" && npm run dev) &
SERVER_PID=$!

echo "Starting frontend -> http://localhost:3000"
(cd "$ROOT_DIR/Client" && npm run dev) &
CLIENT_PID=$!

wait
