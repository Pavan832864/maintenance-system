# GitHub Setup Instructions

## Quick Setup Guide

### Step 1: Generate Secrets

```bash
# Generate SECRET_KEY and ADMIN_PASSWORD_HASH
python scripts/generate_secrets.py your-admin-password
```

Copy the output to your `.env` file.

### Step 2: Create .env File

Create a `.env` file in the project root:

```bash
# Copy from the output of generate_secrets.py
SECRET_KEY=<generated-secret-key>
ADMIN_PASSWORD_HASH=<generated-password-hash>

# Admin username
ADMIN_USERNAME=admin

# AWS Configuration
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=<your-aws-access-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>

# Optional: AWS IAM Role
IAM_ROLE_ARN=<your-iam-role-arn>
IAM_SESSION_DURATION=3600
```

### Step 3: Push to GitHub

**Option A: Using the setup script (Recommended)**

```bash
bash scripts/setup_github.sh
```

**Option B: Manual setup**

```bash
# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Maintenance Request Management System with Admin Auth, AWS IAM, CI/CD"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/Pavan832864/maintenance-system.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

**GitHub Credentials:**
- Username: `Pavan832864`
- Password: `Pavansai@12345`

### Step 4: Configure GitHub Secrets

1. Go to your repository: https://github.com/Pavan832864/maintenance-system
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

   **Required:**
   - `AWS_ACCESS_KEY_ID` - Your AWS access key
   - `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
   - `AWS_REGION` - `eu-north-1` (or your region)
   - `EC2_HOST` - Your EC2 instance IP or domain
   - `EC2_USER` - `ubuntu` (or your EC2 username)
   - `EC2_SSH_KEY` - Your EC2 private key (PEM file content)

   **Optional (for SonarQube):**
   - `SONAR_TOKEN` - Your SonarQube token
   - `SONAR_HOST_URL` - Your SonarQube server URL

### Step 5: Verify CI/CD Pipeline

1. After pushing, go to **Actions** tab in GitHub
2. You should see the CI/CD pipeline running
3. The pipeline will:
   - Build and test the application
   - Run SonarQube analysis (if configured)
   - Run OWASP ZAP security scan
   - Deploy to EC2 (on main branch)

### Step 6: Test the Application

**Local:**
```bash
bash scripts/start_server.sh
# Access at http://localhost:5000
# Admin login at http://localhost:5000/admin/login
```

**Server:**
- After deployment, access your EC2 instance
- Admin login: http://your-ec2-ip/admin/login

---

## Troubleshooting

### Git Push Issues

**Authentication Error:**
- Use Personal Access Token instead of password
- Generate token: GitHub → Settings → Developer settings → Personal access tokens

**Permission Denied:**
- Check repository permissions
- Verify you have write access

### CI/CD Pipeline Failures

**Build Failures:**
- Check GitHub Actions logs
- Verify all dependencies are in requirements.txt

**Deployment Failures:**
- Verify EC2_SSH_KEY format (should be PEM)
- Check EC2 security group allows SSH
- Verify EC2_HOST is correct

**SonarQube Failures:**
- Verify SONAR_TOKEN and SONAR_HOST_URL are set
- Check SonarQube server is accessible
- SonarQube is optional - pipeline will continue if it fails

---

## Next Steps

1. ✅ Code pushed to GitHub
2. ✅ GitHub Secrets configured
3. ⬜ Set up AWS IAM role (see CONFIGURATION_SETUP.md)
4. ⬜ Configure SonarQube (optional, see CONFIGURATION_SETUP.md)
5. ⬜ Test admin login
6. ⬜ Verify CI/CD pipeline runs successfully

---

For detailed configuration, see `CONFIGURATION_SETUP.md`

