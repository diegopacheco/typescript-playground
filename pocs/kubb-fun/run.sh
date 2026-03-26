#!/bin/bash

npm install
npx kubb generate
npx ts-node src/index.ts
