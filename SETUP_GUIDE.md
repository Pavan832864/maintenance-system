# Maintenance Request Management System - Complete Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [AWS Infrastructure Setup](#aws-infrastructure-setup)
4. [CI/CD Pipeline Configuration](#cicd-pipeline-configuration)
5. [Deployment](#deployment)
6. [Testing](#testing)
7. [Monitoring](#monitoring)

---

## Prerequisites

### Required Software
- Python 3.9+
- Git
- PostgreSQL client tools
- AWS CLI v2
- VS Code (or your preferred editor)

### AWS Account Requirements
- AWS Account with appropriate permissions
- EC2 access
- RDS (PostgreSQL) access
- CodePipeline, CodeBuild, CodeDeploy access
- S3 bucket for artifacts
- IAM permissions to create roles/policies

### GitHub Account
- Private repository created
- Personal access token generated

---

## Local Development Setup

### Step 1: Clone Repository
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/maintenance-system.git
cd maintenance-system
\`\`\`

### Step 2: Create Virtual Environment
\`\`\`bash
# On Linux/Mac
python3 -m venv venv
source venv/bin/activate

# On Windows
python -m venv venv
venv\Scripts\activate
\`\`\`

### Step 3: Install Dependencies
\`\`\`bash
pip install --upgrade pip
pip install -r requirements.txt
\`\`\`

### Step 4: Configure Environment Variables
\`\`\`bash
# Copy example file
cp .env.example .env

# Edit .env with your database credentials
nano .env
\`\`\`

**Example .env file:**
\`\`\`
DB_HOST=localhost
DB_PORT=5432
DB_NAME=maintenance_db
DB_USER=admin
DB_PASSWORD=your_secure_password
FLASK_ENV=development
FLASK_DEBUG=True
\`\`\`

### Step 5: Setup Local PostgreSQL Database

#### Option A: Using Docker (Recommended)
\`\`\`bash
# Run PostgreSQL container
docker run --name maintenance-db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=your_secure_password \
  -e POSTGRES_DB=maintenance_db \
  -p 5432:5432 \
  -d postgres:15
\`\`\`

#### Option B: Using Local PostgreSQL
\`\`\`bash
# Create database
createdb -U postgres maintenance_db

# Create user
psql -U postgres -d maintenance_db -c "CREATE USER admin WITH PASSWORD 'your_secure_password';"
psql -U postgres -d maintenance_db -c "ALTER ROLE admin WITH CREATEDB;"
\`\`\`

### Step 6: Run Application Locally
\`\`\`bash
# Activate virtual environment
source venv/bin/activate

# Run Flask app
python app.py
\`\`\`

**Expected output:**
\`\`\`
 * Running on http://0.0.0.0:5000
 * Debug mode: on
\`\`\`

### Step 7: Access Application
Open browser and navigate to: `http://localhost:5000`

---

## AWS Infrastructure Setup

### Step 1: Create RDS PostgreSQL Database

1. **Go to AWS RDS Console**
   - Navigate to: https://console.aws.amazon.com/rds/

2. **Create Database**
   - Click "Create database"
   - Engine: PostgreSQL
   - Version: 15.x
   - DB instance class: db.t3.micro (free tier eligible)
   - Storage: 20 GB
   - DB instance identifier: `maintenance-db`
   - Master username: `admin`
   - Master password: (generate strong password)
   - Public accessibility: Yes
   - VPC security group: Create new (allow inbound on port 5432)

3. **Save Connection Details**
   - Endpoint: (e.g., `maintenance-db.xxxxx.eu-west-1.rds.amazonaws.com`)
   - Port: 5432
   - Database: maintenance_db
   - Username: admin
   - Password: (your password)

### Step 2: Create EC2 Instance for Application

1. **Launch EC2 Instance**
   - AMI: Ubuntu 22.04 LTS
   - Instance type: t3.micro (free tier eligible)
   - Security group: Allow HTTP (80), HTTPS (443), SSH (22)

2. **Connect to Instance**
   \`\`\`bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   \`\`\`

3. **Install Required Software**
   \`\`\`bash
   sudo apt-get update
   sudo apt-get install -y python3-pip python3-venv postgresql-client git
   \`\`\`

### Step 3: Create S3 Bucket for Artifacts

\`\`\`bash
aws s3 mb s3://maintenance-system-artifacts-$(date +%s) --region eu-west-1
\`\`\`

### Step 4: Create IAM Role for CodeDeploy

1. **Create Role**
   - Service: CodeDeploy
   - Attach policy: `AmazonEC2RoleforAWSCodeDeploy`

2. **Attach to EC2 Instance**
   - Modify instance IAM role

---

## CI/CD Pipeline Configuration

### Option A: AWS CodePipeline (Recommended for AWS)

#### Step 1: Create CodePipeline

1. **Go to AWS CodePipeline Console**
   - Navigate to: https://console.aws.amazon.com/codesuite/codepipeline/

2. **Create Pipeline**
   - Pipeline name: `maintenance-system-pipeline`
   - Service role: Create new role
   - Artifact store: S3 bucket created earlier

#### Step 2: Add Source Stage

- Source provider: GitHub
- Repository: your-repo
- Branch: main
- Change detection: GitHub webhooks

#### Step 3: Add Build Stage

- Build provider: AWS CodeBuild
- Create new build project:
  - Project name: `maintenance-system-build`
  - Environment: Managed image (Ubuntu)
  - Runtime: Python 3.11
  - Buildspec: Use buildspec.yml from repo

#### Step 4: Add Deploy Stage

- Deploy provider: CodeDeploy
- Application name: `maintenance-system`
- Deployment group: `maintenance-system-group`

### Option B: GitHub Actions (Alternative)

The `.github/workflows/ci-cd.yml` file is already configured. Just push to GitHub:

\`\`\`bash
git add .
git commit -m "Initial commit with CI/CD pipeline"
git push origin main
\`\`\`

---

## Deployment

### Step 1: Deploy to AWS Elastic Beanstalk

\`\`\`bash
# Install EB CLI
pip install awsebcli

# Initialize EB application
eb init -p python-3.11 maintenance-system --region eu-west-1

# Create environment
eb create maintenance-system-env

# Deploy application
eb deploy
\`\`\`

### Step 2: Configure Environment Variables on EB

\`\`\`bash
# Set environment variables
eb setenv \
  DB_HOST=your-rds-endpoint \
  DB_PORT=5432 \
  DB_NAME=maintenance_db \
  DB_USER=admin \
  DB_PASSWORD=your_password \
  FLASK_ENV=production

# Deploy with new variables
eb deploy
\`\`\`

### Step 3: Get Application URL

\`\`\`bash
eb open
\`\`\`

---

## Testing

### Local Testing

\`\`\`bash
# Test API endpoints
curl http://localhost:5000/api/health

# Create test request
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Request",
    "description": "This is a test maintenance request",
    "priority": "High",
    "created_by": "Test User"
  }'

# Get all requests
curl http://localhost:5000/api/requests
\`\`\`

### Static Code Analysis

\`\`\`bash
# Run Bandit (security analysis)
bandit -r . -f json -o bandit-report.json

# Run Pylint (code quality)
pylint app.py --output-format=json > pylint-report.json

# Run Safety (dependency vulnerabilities)
safety check --json > safety-report.json
\`\`\`

---

## Monitoring

### CloudWatch Logs

\`\`\`bash
# View logs
aws logs tail /aws/elasticbeanstalk/maintenance-system-env/var/log/eb-activity.log --follow
\`\`\`

### Health Check

\`\`\`bash
# Check application health
curl https://your-app-url/api/health
\`\`\`

---

## Troubleshooting

### Database Connection Issues
\`\`\`bash
# Test connection
psql -h your-rds-endpoint -U admin -d maintenance_db -c "SELECT 1;"
\`\`\`

### Application Won't Start
\`\`\`bash
# Check logs
eb logs

# SSH into instance
eb ssh

# Check Flask app
python app.py
\`\`\`

### CI/CD Pipeline Failures
- Check CodeBuild logs in AWS Console
- Verify buildspec.yml syntax
- Ensure IAM roles have correct permissions

---

## Security Best Practices

1. **Never commit .env file** - Use .env.example
2. **Use strong passwords** - Minimum 16 characters
3. **Enable RDS encryption** - At rest and in transit
4. **Use VPC security groups** - Restrict access
5. **Enable CloudTrail** - Audit AWS API calls
6. **Rotate credentials regularly** - Every 90 days
7. **Use IAM roles** - Instead of access keys when possible

---

## Next Steps

1. Customize the application for your specific use case
2. Add more CRUD operations if needed
3. Implement authentication if required
4. Add database backups and disaster recovery
5. Setup monitoring and alerting
6. Document your deployment process

---

## Support

For issues or questions:
- Check AWS documentation: https://docs.aws.amazon.com/
- Review Flask documentation: https://flask.palletsprojects.com/
- Check PostgreSQL documentation: https://www.postgresql.org/docs/

---

**Last Updated:** October 2025
**Version:** 1.0
