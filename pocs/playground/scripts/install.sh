#!/usr/bin/env bash
set -euo pipefail
. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
cd "$ROOT"

APP_NAME="TypeScript Playground"
TARGET="/Applications/$APP_NAME.app"

require_bun
"$ROOT/scripts/uninstall.sh"
(cd web && bun install && bun run build) > "$LOG_DIR/web-build.log" 2>&1 || { echo "web build failed, see $LOG_DIR/web-build.log" >&2; exit 1; }
cd "$ROOT/electron"
bun install
[ -d node_modules/electron/dist ] || bun node_modules/electron/install.js
BUN_DIR="$(dirname "$(command -v bun)")"
printf '{"root":"%s","pathExtra":"%s"}\n' "$ROOT" "$BUN_DIR" > app-config.json
rm -rf out
bun node_modules/@electron/packager/bin/electron-packager.mjs . "$APP_NAME" --platform=darwin --arch="$(uname -m | sed 's/x86_64/x64/')" --icon=icon.icns --out=out --overwrite --ignore='^/out' --ignore='^/test' --app-bundle-id=com.tsplayground.app > /dev/null
BUILT="$(find out -maxdepth 2 -name "$APP_NAME.app" -type d | head -n 1)"
if [ -z "$BUILT" ]; then
  echo "packaging failed" >&2
  exit 1
fi
cp -R "$BUILT" "$TARGET"
rm -rf out
count="$(find /Applications ~/Applications -maxdepth 1 -name "$APP_NAME*.app" 2>/dev/null | wc -l | tr -d ' ')"
if [ "$count" != "1" ]; then
  echo "expected exactly one installed copy, found $count" >&2
  exit 1
fi
echo "installed $TARGET"
