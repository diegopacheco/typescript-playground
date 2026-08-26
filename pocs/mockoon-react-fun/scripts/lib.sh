set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_DIR="$ROOT_DIR/.run"
MOCK_PORT="${MOCK_PORT:-3001}"
MOCK_PREFIX="${MOCK_PREFIX:-api}"
WEB_PORT="${WEB_PORT:-5173}"
MOCK_URL="http://localhost:$MOCK_PORT/$MOCK_PREFIX"
MOCKOON_CLI="$ROOT_DIR/node_modules/.bin/mockoon-cli"

log() {
  echo "[$(date +%H:%M:%S)] $*"
}

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

require_bun() {
  command -v bun >/dev/null 2>&1 || fail "bun is not installed. See https://bun.sh"
}

install_deps() {
  require_bun
  [ -d "$ROOT_DIR/node_modules" ] || (cd "$ROOT_DIR" && bun install)
  [ -d "$ROOT_DIR/web/node_modules" ] || (cd "$ROOT_DIR/web" && bun install)
}

build_mock() {
  log "generating the mock from spec/*.yaml"
  (cd "$ROOT_DIR" && MOCK_PORT="$MOCK_PORT" MOCK_PREFIX="$MOCK_PREFIX" bun run mock/build-mock.ts)
}

port_pid() {
  lsof -ti "tcp:$1" 2>/dev/null || true
}

stop_pidfile() {
  local name="$1"
  local file="$RUN_DIR/$name.pid"
  [ -f "$file" ] || return 0
  local pid
  pid="$(cat "$file")"
  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid" 2>/dev/null || true
    for _ in $(seq 1 20); do
      kill -0 "$pid" 2>/dev/null || break
      sleep 1
    done
    kill -9 "$pid" 2>/dev/null || true
    log "stopped $name (pid $pid)"
  fi
  rm -f "$file"
}

stop_port() {
  local name="$1"
  local port="$2"
  local pid
  pid="$(port_pid "$port")"
  [ -n "$pid" ] || return 0
  kill $pid 2>/dev/null || true
  for _ in $(seq 1 20); do
    [ -z "$(port_pid "$port")" ] && break
    sleep 1
  done
  pid="$(port_pid "$port")"
  [ -n "$pid" ] && kill -9 $pid 2>/dev/null || true
  log "freed port $port ($name)"
}

wait_for_http() {
  local url="$1"
  local name="$2"
  for _ in $(seq 1 45); do
    if bun --eval "fetch('$url').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done
  fail "$name did not come up at $url"
}

start_mock() {
  mkdir -p "$RUN_DIR"
  [ -f "$ROOT_DIR/mock/mockoon-env.json" ] || build_mock
  stop_port mockoon "$MOCK_PORT"
  log "starting mockoon on port $MOCK_PORT"
  (cd "$ROOT_DIR" && nohup "$MOCKOON_CLI" start --data mock/mockoon-env.json --port "$MOCK_PORT" \
    </dev/null >"$RUN_DIR/mockoon.log" 2>&1 & echo $! >"$RUN_DIR/mockoon.pid")
  wait_for_http "$MOCK_URL/books" mockoon
  log "mock API ready at $MOCK_URL"
}
