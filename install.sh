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

# Ensure the entry point is executable
chmod +x "$INSTALL_DIR/index.js"

cd "$INSTALL_DIR"

# Install dependencies and link globally
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

  # Ensure npm global bin is on PATH
  NPM_BIN="$(npm bin -g 2>/dev/null || npm prefix -g)/bin"
  case ":$PATH:" in
    *":$NPM_BIN:"*) ;;
    *)
      echo ""
      echo "⚠️  '$NPM_BIN' is not in your PATH."
      echo "Add the following line to your shell profile (~/.bashrc, ~/.zshrc, etc.):"
      echo ""
      echo "  export PATH=\"\$PATH:$NPM_BIN\""
      echo ""
      echo "Then run:  source ~/.zshrc  (or restart your terminal)"
      echo ""
      ;;
  esac
else
  echo "Error: no supported package manager found. Please install one of: bun, pnpm, yarn, npm" >&2
  exit 1
fi

echo "Installation complete. Run 'ebp' to start the CLI."
