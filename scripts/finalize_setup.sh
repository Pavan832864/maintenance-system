#!/bin/bash

# Final Setup Script
# This script helps finalize the configuration

set -e

echo "=========================================="
echo "Final Setup Script"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << 'ENVEOF'
# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9

# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=IntYH4zRtdUuN70BYlnMkUSltiJ9MjDbTFKjU8SkR1E

# AWS Configuration
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=AKIAY5FIHQ6BOQKQXGNU
AWS_SECRET_ACCESS_KEY=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

# AWS IAM Role
IAM_ROLE_ARN=arn:aws:iam::612385654658:role/maintenance-system-role
IAM_SESSION_DURATION=3600

# DynamoDB Configuration
DYNAMODB_TABLE_NAME=maintenance_requests

# Application Configuration
APP_HOST=0.0.0.0
APP_PORT=5000
ENVEOF
    echo "✅ .env file created!"
else
    echo "⚠️  .env file already exists. Please update it manually with the credentials."
fi

echo ""
echo "=========================================="
echo "Configuration Summary"
echo "=========================================="
echo ""
echo "✅ AWS Account ID: 612385654658"
echo "✅ AWS Region: eu-north-1"
echo "✅ EC2 Instance: 16.171.31.224"
echo "✅ DynamoDB Table: maintenance_requests"
echo "✅ GitHub Repo: https://github.com/Pavan832864/maintenance-system.git"
echo "✅ SonarQube: Pavan832864_maintenance-system"
echo ""
echo "=========================================="
echo "Next Steps:"
echo "=========================================="
echo ""
echo "1. Update .env file with AWS credentials (if not done)"
echo "2. Configure GitHub Secrets (see GITHUB_SECRETS_SETUP.md)"
echo "3. Push code to GitHub:"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'Complete implementation'"
echo "   git remote add origin https://github.com/Pavan832864/maintenance-system.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Test locally: python app.py"
echo "5. Check CI/CD pipeline in GitHub Actions"
echo ""
echo "See FINAL_SETUP_CHECKLIST.md for complete instructions"
echo ""

