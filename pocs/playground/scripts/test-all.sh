#!/usr/bin/env bash
set -euo pipefail
. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
cd "$ROOT"

require_bun
echo "server: typecheck"
(cd server && bun run typecheck)
echo "server: tests"
(cd server && bun test)
echo "web: typecheck"
(cd web && bun run typecheck)
echo "web: tests"
(cd web && bun test test)
echo "electron: tests"
(cd electron && bun test test)
echo "all tests passed"
