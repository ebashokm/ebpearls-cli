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

cd "$INSTALL_DIR"

warn_path() {
  BIN_DIR="$1"
  case ":$PATH:" in
    *":$BIN_DIR:"*) ;;
    *)
      echo ""
      echo "⚠️  '$BIN_DIR' is not in your PATH."
      echo "Add this line to your shell profile (~/.zshrc or ~/.bashrc):"
      echo ""
      echo "  export PATH=\"\$PATH:$BIN_DIR\""
      echo ""
      echo "Then run:  source ~/.zshrc  (or restart your terminal)"
      ;;
  esac
}

# Install dependencies and link globally
if command -v bun > /dev/null 2>&1; then
  bun install
  bun link
  warn_path "$HOME/.bun/bin"
elif command -v pnpm > /dev/null 2>&1; then
  pnpm install
  if [ -z "$PNPM_HOME" ]; then
    pnpm setup 2>/dev/null || true
    PNPM_HOME="$(grep 'export PNPM_HOME=' "$HOME/.zshrc" "$HOME/.bashrc" 2>/dev/null | head -1 | sed 's/.*export PNPM_HOME="//' | sed 's/".*//')"
    export PNPM_HOME
    export PATH="$PNPM_HOME:$PATH"
  fi
  pnpm link --global
  warn_path "$PNPM_HOME"
elif command -v yarn > /dev/null 2>&1; then
  YARN_MAJOR="$(yarn --version 2>/dev/null | cut -d. -f1)"
  yarn install
  if [ "$YARN_MAJOR" = "1" ]; then
    YARN_BIN="$(yarn global bin 2>/dev/null)"
    mkdir -p "$YARN_BIN"
    yarn link
    warn_path "$YARN_BIN"
  else
    # Yarn Berry (v2+/v4) has no global link — fall back to npm link
    npm link
    NPM_BIN="$(npm prefix -g)/bin"
    warn_path "$NPM_BIN"
  fi
elif command -v npm > /dev/null 2>&1; then
  npm install
  npm link
  NPM_BIN="$(npm prefix -g)/bin"
  warn_path "$NPM_BIN"
else
  echo "Error: no supported package manager found. Please install one of: bun, pnpm, yarn, npm" >&2
  exit 1
fi

echo "Installation complete. Run 'ebp' to start the CLI."
