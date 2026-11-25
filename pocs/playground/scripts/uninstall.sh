#!/usr/bin/env bash
set -euo pipefail
. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
cd "$ROOT"

APP_NAME="TypeScript Playground"
if pgrep -f "$APP_NAME.app/Contents/MacOS" >/dev/null 2>&1; then
  osascript -e "quit app \"$APP_NAME\"" >/dev/null 2>&1 || true
  tries=0
  while pgrep -f "$APP_NAME.app/Contents/MacOS" >/dev/null 2>&1; do
    tries=$((tries + 1))
    if [ "$tries" -ge 20 ]; then
      pkill -f "$APP_NAME.app/Contents/MacOS" || true
      break
    fi
    sleep 1
  done
fi
"$ROOT/scripts/stop-all.sh" >/dev/null
for dir in /Applications ~/Applications; do
  find "$dir" -maxdepth 1 -name "$APP_NAME*.app" -type d -exec rm -rf {} + 2>/dev/null || true
done
echo "uninstalled $APP_NAME"
