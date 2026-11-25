#!/usr/bin/env bash
set -euo pipefail
. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
cd "$ROOT"

pid="$(port_pid "$API")"
if [ -n "$pid" ]; then
  echo "api  port=$API  UP    pid=$pid  $(service_url "$API")"
else
  echo "api  port=$API  DOWN"
fi
