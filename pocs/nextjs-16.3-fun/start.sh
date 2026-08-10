#!/bin/bash
export NEXT_TELEMETRY_DISABLED=1
export PORT=3333
npm install
npm run build
nohup npm run start > app.log 2>&1 &
echo $! > app.pid
echo "Server started at http://localhost:3333"
