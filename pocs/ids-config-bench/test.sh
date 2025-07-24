#!/bin/bash

VALID_ID="72d18cca-d207-49db-ae43-3c5700de8995"
INVALID_ID="00000000-0000-0000-0000-000000000000"

echo "Testing valid ID:"
curl -s "http://localhost:3000/check/$VALID_ID"
echo

echo "Testing invalid ID:"
curl -s "http://localhost:3000/check/$INVALID_ID"
echo