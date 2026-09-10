#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
if [ ! -f "$RUN/app.pid" ]; then
  printf 'App already stopped\n'
  exit 0
fi
pid="$(cat "$RUN/app.pid")"
if kill -0 "$pid" 2>/dev/null; then
  command="$(ps -p "$pid" -o command=)"
  case "$command" in
    *node_modules/vite/bin/vite.js*) kill "$pid" ;;
    *) fail "PID $pid no longer belongs to this app" ;;
  esac
  for attempt in $(seq 1 30); do
    if ! kill -0 "$pid" 2>/dev/null; then break; fi
    sleep 1
  done
  if kill -0 "$pid" 2>/dev/null; then fail "App process $pid did not stop"; fi
fi
rm -f "$RUN/app.pid"
printf 'App stopped\n'
