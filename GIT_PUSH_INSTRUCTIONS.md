# How to Push Your Code to GitHub

This guide will help you push your Maintenance Request Management System to GitHub.

## ⚠️ Important Security Notes

Before pushing, make sure these sensitive files are **NEVER** committed:
- `.env` file (contains AWS keys, passwords, secrets)
- `*.pem` files (SSH keys)
- Any files with credentials or passwords
- Flask session files
- AWS CLI installation files

All these are already in `.gitignore`, but **double-check before pushing!**

---

## Step-by-Step: Push to GitHub

### Step 1: Check Your Current Git Status

```bash
cd "/home/anas/Downloads/code (1)"
git status
```

This shows what files will be committed. Make sure `.env` and other sensitive files are NOT listed!

---

### Step 2: Initialize Git Repository (if not already done)

```bash
# Check if git is already initialized
ls -la .git

# If .git folder doesn't exist, initialize it:
git init
```

---

### Step 3: Add Files to Git

```bash
# Add all files (respecting .gitignore)
git add .
```

**Verify sensitive files are NOT included:**
```bash
git status
```

You should NOT see:
- `.env`
- `*.pem` files
- `venv/` folder
- `flask_session/` folder
- `aws/` folder

---

### Step 4: Create Your First Commit

```bash
git commit -m "Initial commit: Maintenance Request Management System

- Flask backend with DynamoDB integration
- Admin authentication system
- AWS IAM role support
- CI/CD pipeline with GitHub Actions
- Security scanning (Bandit, Pylint, Safety)
- Next.js frontend
- Complete documentation"
```

---

### Step 5: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click **"+"** → **"New repository"**
3. Repository name: `maintenance-system` (or your preferred name)
4. Description: "Maintenance Request Management System with AWS Integration"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

---

### Step 6: Add Remote Repository

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/maintenance-system.git
```

Or if you already have a remote:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/maintenance-system.git
```

**Example:**
```bash
git remote add origin https://github.com/Pavan832864/maintenance-system.git
```

---

### Step 7: Set Main Branch

```bash
git branch -M main
```

---

### Step 8: Push to GitHub

```bash
git push -u origin main
```

You'll be prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your GitHub password)

**How to create Personal Access Token:**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name it (e.g., "maintenance-system-push")
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)
7. Use this token as your password when pushing

---

## Quick Setup Script (Alternative)

You can also use the provided script:

```bash
bash scripts/setup_github.sh
```

This script will:
1. Initialize git (if needed)
2. Add all files
3. Create initial commit
4. Set up remote
5. Push to GitHub

---

## After Pushing: Configure GitHub Secrets

Your CI/CD pipeline needs secrets. Go to your repository:

1. **Repository → Settings → Secrets and variables → Actions**
2. Click **"New repository secret"**
3. Add these secrets:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | Your AWS access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret key | `...` |
| `AWS_REGION` | AWS region | `eu-north-1` |
| `EC2_HOST` | EC2 instance IP/domain | `16.171.31.224` |
| `EC2_USER` | EC2 SSH user | `ubuntu` or `ec2-user` |
| `EC2_SSH_KEY` | Private SSH key content | Content of `.pem` file |
| `SONAR_TOKEN` | SonarQube token (optional) | `...` |
| `SONAR_HOST_URL` | SonarQube URL (optional) | `https://sonarcloud.io` |

---

## Verify Everything is Working

1. **Check GitHub repository**: Go to your repo on GitHub
2. **Check CI/CD**: Go to **Actions** tab - your workflow should run automatically
3. **Check files**: Verify `.env` and sensitive files are NOT visible on GitHub

---

## Common Issues & Solutions

### Issue: "Permission denied (publickey)"

**Solution:** Use HTTPS instead of SSH:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/maintenance-system.git
```

### Issue: "Authentication failed"

**Solution:** Use Personal Access Token instead of password

### Issue: "Large files" error

**Solution:** Remove large files (already in .gitignore):
- `aws/` folder
- `venv/` folder
- `*.zip` files

### Issue: Accidentally committed `.env` file

**Solution:**
```bash
# Remove from git (but keep local file)
git rm --cached .env

# Add to .gitignore (already done)
# Commit the change
git commit -m "Remove .env from tracking"

# Push
git push
```

---

## Next Steps

After pushing:

1. ✅ Set up GitHub Secrets (for CI/CD)
2. ✅ Wait for CI/CD pipeline to run
3. ✅ Check Actions tab for build status
4. ✅ Deploy to EC2 (automatic if configured)

---

## Quick Reference Commands

```bash
# Check status
git status

# Add files
git add .

# Commit
git commit -m "Your commit message"

# Push
git push -u origin main

# Check remote
git remote -v

# View commit history
git log --oneline
```

---

**Remember: Never commit sensitive files like `.env`, `*.pem`, or credentials!**

