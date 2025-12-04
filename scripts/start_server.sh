#!/bin/bash

# Start Server Script
# Starts the Maintenance Request Management System

set -e

echo "Starting Maintenance Request Management System..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Creating..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install/update dependencies
echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Warning: .env file not found. Please create one from .env.example"
    echo "The application may not work correctly without environment variables."
    read -p "Continue anyway? (y/n): " CONTINUE
    if [ "$CONTINUE" != "y" ]; then
        exit 1
    fi
fi

# Load environment variables
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Start Flask application
echo "Starting Flask application..."
echo "Application will be available at http://localhost:5000"
echo "Admin login at http://localhost:5000/admin/login"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python app.py
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
