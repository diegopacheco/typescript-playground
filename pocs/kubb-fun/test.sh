#!/bin/bash

npm install
npx kubb generate
npx jest --verbose
