#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

stop_pidfile web
stop_pidfile mockoon
stop_port vite "$WEB_PORT"
stop_port mockoon "$MOCK_PORT"
log "everything stopped"
