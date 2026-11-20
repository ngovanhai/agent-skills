#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${1:-}"
INSTALL_DIR="${2:-$HOME/.agent-skills}"
PROFILES="${3:-all}"

if [ -z "$REPO_URL" ]; then
  echo "Usage: ./install.sh <git-repo-url> [install-dir] [profiles]"
  exit 1
fi

if [ -d "$INSTALL_DIR/.git" ]; then
  echo "Repo da ton tai tai $INSTALL_DIR -> git pull..."
  git -C "$INSTALL_DIR" pull --ff-only
else
  echo "Dang clone $REPO_URL -> $INSTALL_DIR..."
  git clone "$REPO_URL" "$INSTALL_DIR"
fi

chmod +x "$INSTALL_DIR/bin/skillhub.mjs"

if command -v npm >/dev/null 2>&1; then
  (cd "$INSTALL_DIR" && npm link >/dev/null 2>&1 || true)
fi

node "$INSTALL_DIR/bin/skillhub.mjs" init --profiles "$PROFILES" --harnesses auto
node "$INSTALL_DIR/bin/skillhub.mjs" sync
node "$INSTALL_DIR/bin/skillhub.mjs" doctor

echo ""
echo "Hoan tat! Dung 'skillhub update' de cap nhat chung."
