#!/bin/bash

# Setup Script for Maintenance Request Management System
# This script properly sets up the virtual environment and installs dependencies

set -e

echo "========================================="
echo "Setting up Maintenance Request System..."
echo "========================================="
echo ""

# Get the directory where the script is located and cd to it
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "ERROR: python3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi

PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
echo "✓ Found Python $PYTHON_VERSION"

# Remove old venv if it exists and seems broken
if [ -d "venv" ]; then
    echo "Found existing virtual environment"
    # Check if venv is valid
    if [ ! -f "venv/bin/python" ]; then
        echo "  Virtual environment appears corrupted. Recreating..."
        rm -rf venv
    else
        echo "  Virtual environment exists"
    fi
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating new virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Using existing virtual environment"
fi

# Use relative path to venv pip to avoid issues with spaces in directory names
VENV_PIP="./venv/bin/pip"

if [ ! -f "$VENV_PIP" ]; then
    echo "ERROR: Virtual environment pip not found at $VENV_PIP"
    exit 1
fi

echo ""
echo "Using venv pip: $VENV_PIP"

# Upgrade pip first
echo ""
echo "Upgrading pip..."
"$VENV_PIP" install --upgrade pip --quiet

# Install dependencies
echo ""
echo "Installing Python dependencies from requirements.txt..."
"$VENV_PIP" install -r requirements.txt

echo ""
echo "========================================="
echo "✓ Setup completed successfully!"
echo "========================================="
echo ""
echo "To activate the virtual environment manually, run:"
echo "  source venv/bin/activate"
echo ""
echo "To start the application, run:"
echo "  python app.py"
echo ""
echo "Or use the provided script:"
echo "  ./scripts/start_server.sh"
echo ""
