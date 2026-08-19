#!/bin/bash

echo "tsgo version:"
bunx @typescript/native-preview --version

echo "typechecking with the TypeScript 7 native compiler:"
bunx @typescript/native-preview --noEmit --pretty

echo "typecheck passed, running:"
bun run src/main.ts
