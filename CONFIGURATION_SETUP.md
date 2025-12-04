# Configuration Setup Guide
## Maintenance Request Management System

**Version:** 2.0  
**Date:** December 2025  
**Project:** Cloud DevOpsSec Management System

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Configuration](#environment-configuration)
4. [AWS IAM Setup](#aws-iam-setup)
5. [GitHub Repository Setup](#github-repository-setup)
6. [CI/CD Pipeline Configuration](#cicd-pipeline-configuration)
7. [Security Tools Configuration](#security-tools-configuration)
8. [Deployment Configuration](#deployment-configuration)
9. [Troubleshooting](#troubleshooting)

---

## Overview

This document provides step-by-step instructions for configuring the Maintenance Request Management System with:
- Admin authentication (ID and password)
- AWS IAM integration for enhanced security
- GitHub repository and CI/CD pipeline
- SonarQube and OWASP ZAP security scanning
- Automated deployment to AWS EC2

---

## Prerequisites

### Required Software
- Python 3.11+
- Node.js 18+
- Git
- AWS CLI v2
- PostgreSQL client (optional, for local development)

### AWS Account Requirements
- AWS Account with appropriate permissions
- EC2 instance access
- DynamoDB access
- IAM permissions to create roles/policies
- S3 bucket for artifacts (optional)

### GitHub Account
- GitHub account with repository access
- Personal Access Token (for CI/CD)

### Security Tools
- SonarQube server (cloud or self-hosted)
- OWASP ZAP (integrated via GitHub Actions)

---

## Environment Configuration

### Step 1: Create Environment File

Create a `.env` file in the project root:

```bash
# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=your-very-secure-secret-key-minimum-32-characters

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=sha256-hash-of-your-password

# AWS Configuration
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key

# AWS IAM Configuration (Optional - for enhanced security)
IAM_ROLE_ARN=arn:aws:iam::YOUR_ACCOUNT_ID:role/maintenance-system-role
IAM_SESSION_DURATION=3600

# DynamoDB Configuration
DYNAMODB_TABLE_NAME=maintenance_requests

# Application Configuration
APP_HOST=0.0.0.0
APP_PORT=5000
```

### Step 2: Generate Admin Password Hash

```python
import hashlib
password = "your-secure-password"
password_hash = hashlib.sha256(password.encode()).hexdigest()
print(password_hash)
```

Add the hash to `ADMIN_PASSWORD_HASH` in your `.env` file.

### Step 3: Generate Secret Key

```python
import secrets
secret_key = secrets.token_urlsafe(32)
print(secret_key)
```

Add to `SECRET_KEY` in your `.env` file.

---

## AWS IAM Setup

### Step 1: Create IAM Role for Application

1. Navigate to AWS IAM Console: https://console.aws.amazon.com/iam/

2. Create a new role:
   - Click "Roles" → "Create role"
   - Trust entity: "AWS service"
   - Use case: "EC2"
   - Click "Next"

3. Attach policies:
   - `AmazonDynamoDBFullAccess` (or create custom policy with minimal permissions)
   - `CloudWatchLogsFullAccess` (for logging)
   - Click "Next"

4. Name the role: `maintenance-system-role`
   - Click "Create role"

5. Note the Role ARN (format: `arn:aws:iam::ACCOUNT_ID:role/maintenance-system-role`)

### Step 2: Create Custom IAM Policy (Optional - Recommended)

For better security, create a custom policy with minimal required permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:Scan",
                "dynamodb:Query"
            ],
            "Resource": "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/maintenance_requests"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:REGION:ACCOUNT_ID:*"
        }
    ]
}
```

### Step 3: Attach Role to EC2 Instance

1. Go to EC2 Console
2. Select your instance
3. Click "Actions" → "Security" → "Modify IAM role"
4. Select `maintenance-system-role`
5. Click "Update IAM role"

### Step 4: Update Environment Variables

Add to your `.env` file:
```
IAM_ROLE_ARN=arn:aws:iam::YOUR_ACCOUNT_ID:role/maintenance-system-role
```

---

## GitHub Repository Setup

### Step 1: Create GitHub Repository

1. Log in to GitHub: https://github.com
2. Click "New repository"
3. Repository name: `maintenance-system` (or your preferred name)
4. Description: "Maintenance Request Management System - Cloud DevOpsSec Project"
5. Visibility: Private (recommended) or Public
6. Initialize with README: No (we have existing code)
7. Click "Create repository"

### Step 2: Initialize Git and Push Code

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Maintenance Request Management System with Admin Auth, AWS IAM, CI/CD"

# Add remote repository
git remote add origin https://github.com/Pavan832864/maintenance-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Configure GitHub Secrets

Go to your repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

1. **AWS_ACCESS_KEY_ID**: Your AWS access key
2. **AWS_SECRET_ACCESS_KEY**: Your AWS secret key
3. **AWS_REGION**: `eu-north-1` (or your preferred region)
4. **EC2_HOST**: Your EC2 instance public IP or domain
5. **EC2_USER**: `ubuntu` (or your EC2 username)
6. **EC2_SSH_KEY**: Your EC2 private key (PEM file content)
7. **SONAR_TOKEN**: Your SonarQube token (if using SonarQube)
8. **SONAR_HOST_URL**: Your SonarQube server URL (e.g., https://sonarcloud.io)

---

## CI/CD Pipeline Configuration

### GitHub Actions Workflow

The CI/CD pipeline is configured in `.github/workflows/ci-cd.yml` and includes:

1. **Build and Test**: Python and Node.js build, security scanning (Bandit, Pylint, Safety)
2. **SonarQube Analysis**: Code quality and security analysis
3. **OWASP ZAP Scanning**: Security vulnerability scanning
4. **Deployment**: Automated deployment to EC2 on main branch

### Pipeline Triggers

- Push to `main` or `master` branch
- Pull requests to `main` or `master` branch

### Manual Pipeline Execution

You can manually trigger the pipeline:
1. Go to Actions tab in GitHub
2. Select "CI/CD Pipeline with Security Scanning"
3. Click "Run workflow"

---

## Security Tools Configuration

### SonarQube Setup

#### Option 1: SonarCloud (Cloud-based, Free for public repos)

1. Sign up at https://sonarcloud.io
2. Create a new project
3. Generate a token
4. Add token to GitHub Secrets as `SONAR_TOKEN`
5. Add SonarCloud URL to GitHub Secrets as `SONAR_HOST_URL`

#### Option 2: Self-hosted SonarQube

1. Install SonarQube server
2. Configure in `sonar-project.properties`
3. Add server URL and token to GitHub Secrets

### OWASP ZAP Configuration

OWASP ZAP is automatically configured in the GitHub Actions workflow. No additional setup required.

The scan runs against:
- Baseline scan: Quick security check
- Full scan: Comprehensive security analysis

Results are uploaded as artifacts.

---

## Deployment Configuration

### Local Development

```bash
# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pnpm install

# Set environment variables
export FLASK_ENV=development
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD_HASH=your-hash

# Run application
python app.py
```

Access at: http://localhost:5000

### Production Deployment on EC2

#### Step 1: Prepare EC2 Instance

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install dependencies
sudo apt-get update
sudo apt-get install -y python3-pip python3-venv git nginx

# Clone repository
cd /opt
sudo git clone https://github.com/Pavan832864/maintenance-system.git
cd maintenance-system

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Step 2: Configure Environment

```bash
# Create .env file
nano .env
# Add all environment variables from Configuration section
```

#### Step 3: Create Systemd Service

```bash
sudo nano /etc/systemd/system/maintenance-system.service
```

Add:
```ini
[Unit]
Description=Maintenance Request Management System
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/maintenance-system
Environment="PATH=/opt/maintenance-system/venv/bin"
ExecStart=/opt/maintenance-system/venv/bin/python app.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable maintenance-system
sudo systemctl start maintenance-system
```

#### Step 4: Configure Nginx (Optional)

```bash
sudo nano /etc/nginx/sites-available/maintenance-system
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/maintenance-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Troubleshooting

### Admin Login Issues

- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` in `.env`
- Check password hash generation
- Clear browser cookies/session

### AWS IAM Issues

- Verify IAM role ARN is correct
- Check EC2 instance has IAM role attached
- Verify IAM policies have correct permissions
- Check CloudWatch logs for errors

### CI/CD Pipeline Failures

- Check GitHub Secrets are configured correctly
- Verify AWS credentials are valid
- Check EC2 SSH key format (should be PEM)
- Review GitHub Actions logs

### SonarQube Issues

- Verify `SONAR_TOKEN` and `SONAR_HOST_URL` in GitHub Secrets
- Check SonarQube server is accessible
- Verify project key matches in `sonar-project.properties`

### OWASP ZAP Issues

- Ensure application is running before ZAP scan
- Check application is accessible on `http://localhost:5000`
- Review ZAP scan logs in GitHub Actions

---

## Security Best Practices

1. **Never commit `.env` file** - Use `.env.example` as template
2. **Use strong passwords** - Minimum 16 characters for admin
3. **Rotate credentials regularly** - Every 90 days
4. **Use IAM roles** - Instead of access keys when possible
5. **Enable MFA** - For AWS and GitHub accounts
6. **Regular security scans** - Run SonarQube and OWASP ZAP regularly
7. **Keep dependencies updated** - Run `safety check` regularly
8. **Monitor logs** - Check CloudWatch and application logs regularly

---

## Support and Documentation

- **Project Repository**: https://github.com/Pavan832864/maintenance-system
- **AWS Documentation**: https://docs.aws.amazon.com/
- **Flask Documentation**: https://flask.palletsprojects.com/
- **SonarQube Documentation**: https://docs.sonarqube.org/
- **OWASP ZAP Documentation**: https://www.zaproxy.org/docs/

---

**Last Updated:** December 2025  
**Version:** 2.0  
**Maintained by:** Development Team

