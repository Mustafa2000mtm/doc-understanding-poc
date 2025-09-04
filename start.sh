#!/bin/bash

# Get the port from environment variable or default to 8000
PORT=${PORT:-8000}

echo "Starting Document Processing System on port $PORT"

# Start Gunicorn with the correct port
exec gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120
