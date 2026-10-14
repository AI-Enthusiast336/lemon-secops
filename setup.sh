#!/usr/bin/env bash

set -e

echo "Configuring Lemon SecOps..."

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

mkdir -p data/memory
mkdir -p docs/screenshots
mkdir -p logs

touch data/memory/memories.jsonl
touch logs/tool-calls.jsonl

if [ ! -f .env ]; then
  cp .env.example .env
  echo ".env created from .env.example"
else
  echo ".env already exists"
fi

cat > .mcp.json <<EOF
{
  "mcpServers": {
    "memory": {
      "command": "bun",
      "args": [
        "$ROOT_DIR/servers/memory-mcp/src/index.ts"
      ]
    },
    "repo-search": {
      "command": "bun",
      "args": [
        "$ROOT_DIR/servers/repo-search-mcp/src/index.ts"
      ]
    },
    "sentinel": {
      "command": "bun",
      "args": [
        "$ROOT_DIR/servers/sentinel-mcp/src/index.ts"
      ]
    }
  }
}
EOF

echo ".mcp.json created successfully."
echo "Lemon setup complete."
