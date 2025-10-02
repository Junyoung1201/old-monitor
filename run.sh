#!/bin/bash

PORT=1201

if command -v serve &> /dev/null; then
    serve -l $PORT .
elif command -v npx &> /dev/null; then
    npx serve -l $PORT .
fi