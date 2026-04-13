#!/bin/sh
set -e

REPO_URL="https://github.com/eb-pearls/cli.git"
INSTALL_DIR="$HOME/.ebpearls-cli"

# Clone or update the repo
if [ -d "$INSTALL_DIR/.git" ]; then
  echo "Updating existing installation at $INSTALL_DIR..."
  git -C "$INSTALL_DIR" pull --quiet
else
  echo "Cloning EB Pearls CLI into $INSTALL_DIR..."
  git clone --quiet "$REPO_URL" "$INSTALL_DIR"
fi

# Detect package manager and install globally from local path
if command -v bun > /dev/null 2>&1; then
  bun add -g "$INSTALL_DIR"
elif command -v pnpm > /dev/null 2>&1; then
  pnpm add -g "$INSTALL_DIR"
elif command -v yarn > /dev/null 2>&1; then
  yarn global add "$INSTALL_DIR"
elif command -v npm > /dev/null 2>&1; then
  npm install -g "$INSTALL_DIR"
else
  echo "Error: no supported package manager found. Please install one of: bun, pnpm, yarn, npm" >&2
  exit 1
fi

echo "Installation complete. Run 'ebp' to start the CLI."
