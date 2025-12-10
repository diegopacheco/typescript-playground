#!/bin/bash
bun install
bun run server/index.ts &
SERVER_PID=$!
while ! curl -s http://localhost:3000/api/pizzas > /dev/null; do
  sleep 0.5
done
echo "Server started on http://localhost:3000"
bunx vite &
VITE_PID=$!
while ! curl -s http://localhost:5173 > /dev/null 2>&1; do
  sleep 0.5
done
echo "Client started on http://localhost:5173"
echo "Press Ctrl+C to stop"
trap "kill $SERVER_PID $VITE_PID 2>/dev/null" EXIT
wait
