#!/bin/bash
# Post-installation script for AWS CodeDeploy

set -e

cd /var/www/maintenance-system

echo "Creating Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Setting permissions..."
chown -R ec2-user:ec2-user /var/www/maintenance-system

echo "Post-installation completed"
