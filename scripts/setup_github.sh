#!/bin/bash

# GitHub Repository Setup Script
# This script helps set up the GitHub repository and push the code

set -e

echo "=========================================="
echo "GitHub Repository Setup Script"
echo "=========================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: Git is not installed. Please install Git first."
    exit 1
fi

# Get repository URL
read -p "Enter your GitHub repository URL (e.g., https://github.com/Pavan832864/maintenance-system.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "Error: Repository URL is required."
    exit 1
fi

# Check if .git already exists
if [ -d ".git" ]; then
    echo "Git repository already initialized."
    read -p "Do you want to continue? (y/n): " CONTINUE
    if [ "$CONTINUE" != "y" ]; then
        exit 0
    fi
else
    # Initialize git repository
    echo "Initializing git repository..."
    git init
fi

# Add all files
echo "Adding files to git..."
git add .

# Create initial commit
echo "Creating initial commit..."
git commit -m "Initial commit: Maintenance Request Management System with Admin Auth, AWS IAM, CI/CD"

# Set main branch
echo "Setting main branch..."
git branch -M main

# Add remote repository
echo "Adding remote repository..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

# Push to GitHub
echo "Pushing to GitHub..."
echo "You will be prompted for your GitHub credentials."
git push -u origin main

echo ""
echo "=========================================="
echo "Setup completed successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Go to your GitHub repository: $REPO_URL"
echo "2. Go to Settings > Secrets and variables > Actions"
echo "3. Add the following secrets:"
echo "   - AWS_ACCESS_KEY_ID"
echo "   - AWS_SECRET_ACCESS_KEY"
echo "   - AWS_REGION"
echo "   - EC2_HOST"
echo "   - EC2_USER"
echo "   - EC2_SSH_KEY"
echo "   - SONAR_TOKEN (if using SonarQube)"
echo "   - SONAR_HOST_URL (if using SonarQube)"
echo ""
echo "4. The CI/CD pipeline will run automatically on push"
echo ""

