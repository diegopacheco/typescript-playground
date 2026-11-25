#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_DIR="$ROOT/.run"
LOG_DIR="$RUN_DIR/logs"
export PATH="$PATH:$HOME/.bun/bin:/opt/homebrew/bin:/usr/local/bin"

mkdir -p "$LOG_DIR"
set -a
. "$ROOT/scripts/ports.env"
set +a

service_url() {
  echo "http://localhost:$1"
}

port_pid() {
  lsof -nP -iTCP:"$1" -sTCP:LISTEN -t 2>/dev/null | head -n 1 || true
}

is_up() {
  [ -n "$(port_pid "$1")" ]
}

wait_for_port() {
  local port="$1"
  local tries=0
  while ! is_up "$port"; do
    tries=$((tries + 1))
    if [ "$tries" -ge 60 ]; then
      echo "port $port did not open in 60s" >&2
      return 1
    fi
    sleep 1
  done
}

wait_for_port_free() {
  local port="$1"
  local tries=0
  while is_up "$port"; do
    tries=$((tries + 1))
    if [ "$tries" -ge 30 ]; then
      return 1
    fi
    sleep 1
  done
}

require_bun() {
  if ! command -v bun >/dev/null 2>&1; then
    echo "bun not found in PATH" >&2
    exit 1
  fi
}
