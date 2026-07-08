#!/bin/bash
cd "$(dirname "$0")"
PORT=${PORT:-3007}
node server.js > server.log 2>&1 &
echo $! > server.pid
for i in $(seq 1 30); do
  if curl -s "http://localhost:$PORT" > /dev/null; then
    echo "Started on http://localhost:$PORT (pid $(cat server.pid))"
    exit 0
  fi
  sleep 1
done
echo "Failed to start"
exit 1
