#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

log "tests started"

require bun
bun run typecheck || fail "typecheck failed"
bun run test || fail "unit tests failed"
bun run test:e2e || fail "e2e tests failed"

log "tests passed"
