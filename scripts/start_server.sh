#!/bin/bash

# Start Server Script
# Starts the Maintenance Request Management System

set -e

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"
cd "$PROJECT_DIR"

echo "Starting Maintenance Request Management System..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Creating..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Verify we're using venv pip
VENV_PIP="venv/bin/pip"
if [ ! -f "$VENV_PIP" ]; then
    echo "ERROR: Virtual environment pip not found!"
    exit 1
fi

# Install/update dependencies using venv pip directly
echo "Installing dependencies..."
$VENV_PIP install --upgrade pip --quiet
$VENV_PIP install -r requirements.txt

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

# Use venv python to ensure correct environment
venv/bin/python app.py
