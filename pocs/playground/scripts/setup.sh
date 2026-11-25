#!/usr/bin/env bash
set -euo pipefail
. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
cd "$ROOT"

require_bun
echo "bun $(bun --version)"
(cd server && bun install)
(cd web && bun install && bun run build)
(cd electron && bun install && { [ -d node_modules/electron/dist ] || bun node_modules/electron/install.js; })
echo "setup done"
