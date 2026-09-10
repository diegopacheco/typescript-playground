#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
pid="$(port_pid)"
if [ -n "$pid" ]; then
  printf 'App port %s UP pid %s\n' "$APP" "$pid"
else
  printf 'App port %s DOWN pid -\n' "$APP"
fi
