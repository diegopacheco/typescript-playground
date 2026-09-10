#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
source "$ROOT/scripts/ports.env"
RUN="$ROOT/.run"
mkdir -p "$RUN/logs"
port_pid() {
  lsof -ti "tcp:$APP" -sTCP:LISTEN 2>/dev/null | head -1 || true
}
fail() {
  printf '%s\n' "$*" >&2
  exit 1
}
