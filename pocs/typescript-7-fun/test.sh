#!/bin/bash
cd "$(dirname "$0")"
PORT=${PORT:-3007}
./start.sh
FAIL=0
check() {
  if curl -s "http://localhost:$PORT$1" | grep -q "$2"; then
    echo "PASS $1 contains '$2'"
  else
    echo "FAIL $1 missing '$2'"
    FAIL=1
  fi
}
check "/" "TypeScript"
check "/" "playground"
check "/playground.js" "transpileModule"
check "/styles.css" "editor-wrap"
./stop.sh
exit $FAIL
