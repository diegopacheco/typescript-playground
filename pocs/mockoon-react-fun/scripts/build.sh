#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

install_deps
build_mock

log "typechecking with typescript 7"
(cd "$ROOT_DIR/web" && bun run typecheck)

log "building the web bundle"
(cd "$ROOT_DIR/web" && bun run build)

log "build complete: web/dist"
