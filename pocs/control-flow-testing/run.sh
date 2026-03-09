#!/bin/bash
bun install
bun run server/server.ts &
bun run dev
