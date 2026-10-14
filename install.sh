#!/usr/bin/env bash

set -e

echo "Installing Lemon SecOps dependencies..."

echo "Installing Memory MCP dependencies..."
cd servers/memory-mcp
bun install

echo "Installing Repo Search MCP dependencies..."
cd ../repo-search-mcp
bun install

echo "Installing Sentinel MCP dependencies..."
cd ../sentinel-mcp
bun install

cd ../../

echo "Starting Qdrant..."
sudo docker compose up -d

echo "Checking Ollama..."
if ! command -v ollama >/dev/null 2>&1; then
  echo "Ollama is not installed."
  echo "Install it from https://ollama.com"
else
  echo "Pulling embedding model..."
  ollama pull nomic-embed-text
fi

echo "Lemon installation complete."
