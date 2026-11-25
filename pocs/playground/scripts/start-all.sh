#!/usr/bin/env bash
set -euo pipefail
. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
cd "$ROOT"

require_bun
if is_up "$API"; then
  echo "api already running on port $API"
else
  if [ ! -f web/dist/index.html ]; then
    (cd web && bun run build) > "$LOG_DIR/web-build.log" 2>&1 || { echo "web build failed, see $LOG_DIR/web-build.log" >&2; exit 1; }
  fi
  PORT="$API" nohup bun server/src/main.ts > "$LOG_DIR/api.log" 2>&1 &
  echo $! > "$RUN_DIR/api.pid"
  if ! wait_for_port "$API"; then
    echo "api failed to start, see $LOG_DIR/api.log" >&2
    tail -n 20 "$LOG_DIR/api.log" >&2 || true
    exit 1
  fi
fi
echo "TypeScript Playground UI  $(service_url "$API")"
echo "TypeScript Playground API $(service_url "$API")/api"
