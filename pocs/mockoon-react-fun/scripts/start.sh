#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

install_deps
build_mock
start_mock

stop_port vite "$WEB_PORT"
log "starting vite on port $WEB_PORT"
(cd "$ROOT_DIR/web" && VITE_API_BASE="$MOCK_URL" nohup bun run dev --port "$WEB_PORT" \
  </dev/null >"$RUN_DIR/web.log" 2>&1 & echo $! >"$RUN_DIR/web.pid")
wait_for_http "http://localhost:$WEB_PORT" vite

echo
log "web  http://localhost:$WEB_PORT"
log "mock $MOCK_URL"
log "logs $RUN_DIR"
log "stop ./scripts/stop.sh"
