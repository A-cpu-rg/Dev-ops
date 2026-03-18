#!/usr/bin/env bash
# setup.sh — Idempotent project setup script.
# Safe to run multiple times: each step checks state before acting.
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log() { echo "[setup] $*"; }

# ── 1. Check Node.js version ──────────────────────────────────────────────────
REQUIRED_NODE_MAJOR=18
CURRENT_NODE_MAJOR=$(node -e "process.stdout.write(process.versions.node.split('.')[0])" 2>/dev/null || echo "0")
if [ "$CURRENT_NODE_MAJOR" -lt "$REQUIRED_NODE_MAJOR" ]; then
  echo "ERROR: Node.js >= ${REQUIRED_NODE_MAJOR} is required (found ${CURRENT_NODE_MAJOR})." >&2
  exit 1
fi
log "Node.js version OK ($(node --version))"

# ── 2. Install root dependencies ──────────────────────────────────────────────
log "Installing root dependencies..."
cd "$PROJECT_ROOT"
npm install --silent

# ── 3. Install client dependencies ───────────────────────────────────────────
log "Installing client dependencies..."
cd "$PROJECT_ROOT/client"
npm install --silent

# ── 4. Install server dependencies ───────────────────────────────────────────
log "Installing server dependencies..."
cd "$PROJECT_ROOT/server"
npm install --silent

# ── 5. Create .env files if they do not already exist ────────────────────────
SERVER_ENV="$PROJECT_ROOT/server/.env"
if [ ! -f "$SERVER_ENV" ]; then
  log "Creating server/.env from template..."
  cat > "$SERVER_ENV" <<'EOF'
PORT=5001
NODE_ENV=development
EOF
else
  log "server/.env already exists — skipping."
fi

CLIENT_ENV="$PROJECT_ROOT/client/.env"
if [ ! -f "$CLIENT_ENV" ]; then
  log "Creating client/.env from template..."
  cat > "$CLIENT_ENV" <<'EOF'
VITE_API_URL=http://localhost:5001
EOF
else
  log "client/.env already exists — skipping."
fi

# ── 6. Return to project root ─────────────────────────────────────────────────
cd "$PROJECT_ROOT"
log "Setup complete. Start the app with:"
log "  cd server && npm run dev   (backend on port 5001)"
log "  cd client && npm run dev   (frontend on port 5173)"
