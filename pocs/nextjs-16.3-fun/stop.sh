#!/bin/bash
[ -f app.pid ] && kill $(cat app.pid) && rm app.pid || true
