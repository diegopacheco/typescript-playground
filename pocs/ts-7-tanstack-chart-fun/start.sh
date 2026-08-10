#!/bin/bash
npm run build
node server.cjs > app.log 2>&1 &
echo $! > app.pid
while ! curl -s http://localhost:3000 > /dev/null; do
  sleep 1
done

echo "Server is running at: http://localhost:3000"
