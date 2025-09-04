#!/bin/bash

# Get the port from environment variable or default to 8000
PORT=${PORT:-8000}

echo "Starting Document Processing System on port $PORT"
echo "Environment: $FLASK_ENV"
echo "Debug: $FLASK_DEBUG"

# Wait a moment for the system to stabilize
sleep 2

# Start Gunicorn with the correct port and single worker for stability
exec gunicorn --bind 0.0.0.0:$PORT --workers 1 --timeout 120 --preload --log-level info app:app
