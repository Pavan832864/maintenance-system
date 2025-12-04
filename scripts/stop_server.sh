#!/bin/bash
echo "[v0] Stopping maintenance system application..."

# Kill Gunicorn processes
pkill -f gunicorn || true
sleep 2

# Kill any remaining Python processes from our app
pkill -f "python app.py" || true

echo "[v0] Application stopped"
