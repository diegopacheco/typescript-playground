#!/usr/bin/env bash
set -euo pipefail
. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
cd "$ROOT"

if [ -f "$RUN_DIR/api.pid" ]; then
  kill "$(cat "$RUN_DIR/api.pid")" 2>/dev/null || true
  rm -f "$RUN_DIR/api.pid"
fi
pid="$(port_pid "$API")"
if [ -n "$pid" ]; then
  kill "$pid" 2>/dev/null || true
fi
if ! wait_for_port_free "$API"; then
  pid="$(port_pid "$API")"
  if [ -n "$pid" ]; then
    kill -9 "$pid" 2>/dev/null || true
  fi
  wait_for_port_free "$API" || true
fi
if is_up "$API"; then
  echo "port $API still in use" >&2
  exit 1
fi
echo "api stopped"
