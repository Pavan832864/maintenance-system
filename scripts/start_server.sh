#!/bin/bash
set -e

echo "[v0] Starting maintenance system application..."

cd /home/ec2-user/maintenance-system

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Start application with Gunicorn in background
nohup gunicorn --workers 4 --bind 0.0.0.0:5000 --timeout 120 app:app > app.log 2>&1 &

echo "[v0] Application started successfully on port 5000"
