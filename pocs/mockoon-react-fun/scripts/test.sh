#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

STARTED_MOCK=0

cleanup() {
  [ "$STARTED_MOCK" -eq 1 ] && stop_pidfile mockoon
  return 0
}
trap cleanup EXIT

install_deps

log "validating specs and regenerating the mock"
build_mock

log "typechecking with typescript 7"
(cd "$ROOT_DIR/web" && bun run typecheck)

if [ -z "$(port_pid "$MOCK_PORT")" ]; then
  start_mock
  STARTED_MOCK=1
else
  log "reusing the mock already listening on port $MOCK_PORT"
fi

log "running the API checks"
(cd "$ROOT_DIR" && MOCK_URL="$MOCK_URL" bun run scripts/api-check.ts)

log "building the web bundle"
(cd "$ROOT_DIR/web" && bun run build >/dev/null)

log "all checks passed"
