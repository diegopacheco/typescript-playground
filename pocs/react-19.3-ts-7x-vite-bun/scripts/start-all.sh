#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
if [ -f "$RUN/app.pid" ] && kill -0 "$(cat "$RUN/app.pid")" 2>/dev/null && [ "$(port_pid)" = "$(cat "$RUN/app.pid")" ]; then
  printf 'App already running on %s\n' "$APP"
  exit 0
fi
[ -z "$(port_pid)" ] || fail "Port $APP is occupied by another process"
nohup bun --bun ./node_modules/vite/bin/vite.js > "$RUN/logs/app.log" 2>&1 < /dev/null &
printf '%s\n' "$!" > "$RUN/app.pid"
for attempt in $(seq 1 30); do
  kill -0 "$(cat "$RUN/app.pid")" 2>/dev/null || fail "App exited; see .run/logs/app.log"
  if curl -fsS --max-time 1 "http://127.0.0.1:$APP/health" >/dev/null 2>&1; then
    printf 'App ready at http://127.0.0.1:%s\n' "$APP"
    exit 0
  fi
  sleep 1
done
kill "$(cat "$RUN/app.pid")" 2>/dev/null || true
rm -f "$RUN/app.pid"
fail 'App failed to start; see .run/logs/app.log'
