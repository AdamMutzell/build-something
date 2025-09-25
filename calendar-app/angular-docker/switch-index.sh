#!/bin/sh
# Usage: ./switch-index.sh local|prod
set -e
MODE="$1"
SRC_DIR="$(dirname "$0")/src"
if [ "$MODE" = "local" ]; then
  cp "$SRC_DIR/index.local.html" "$SRC_DIR/index.html"
  echo "Switched to local index.html"
elif [ "$MODE" = "prod" ]; then
  cp "$SRC_DIR/index.prod.html" "$SRC_DIR/index.html"
  echo "Switched to prod index.html"
else
  echo "Usage: $0 local|prod"
  exit 1
fi
