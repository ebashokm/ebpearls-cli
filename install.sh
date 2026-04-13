#!/bin/sh
set -e

REPO_URL="https://github.com/ebashokm/ebpearls-cli.git"
INSTALL_DIR="$HOME/.ebpearls-cli"

# Clone or update the repo
if [ -d "$INSTALL_DIR/.git" ]; then
  echo "Updating existing installation at $INSTALL_DIR..."
  git -C "$INSTALL_DIR" pull --quiet
else
  echo "Cloning EB Pearls CLI into $INSTALL_DIR..."
  git clone --quiet "$REPO_URL" "$INSTALL_DIR"
fi

# Ensure the entry point is executable
chmod +x "$INSTALL_DIR/index.js"

# Install dependencies and link the ebp command globally
cd "$INSTALL_DIR"

if command -v bun > /dev/null 2>&1; then
  bun install
  bun link
elif command -v pnpm > /dev/null 2>&1; then
  pnpm install
  pnpm link --global
elif command -v yarn > /dev/null 2>&1; then
  yarn install
  yarn link
elif command -v npm > /dev/null 2>&1; then
  npm install
  npm link
else
  echo "Error: no supported package manager found. Please install one of: bun, pnpm, yarn, npm" >&2
  exit 1
fi

echo "Installation complete. Run 'ebp' to start the CLI."
