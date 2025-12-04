# GitHub Secrets Configuration

## ✅ All Secrets to Add

Go to: https://github.com/Pavan832864/maintenance-system/settings/secrets/actions

Click **"New repository secret"** for each one:

### 1. AWS_ACCESS_KEY_ID
**Value:** `AKIAY5FIHQ6BOQKQXGNU`

### 2. AWS_SECRET_ACCESS_KEY
**Value:** `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`

### 3. AWS_REGION
**Value:** `eu-north-1`

### 4. EC2_HOST
**Value:** `16.171.31.224`
(Or use: `ec2-16-171-31-224.eu-north-1.compute.amazonaws.com`)

### 5. EC2_USER
**Value:** `ubuntu`

### 6. EC2_SSH_KEY
**Value:** (Your EC2 .pem file content - paste the entire file including BEGIN/END lines)

### 7. SONAR_TOKEN
**Value:** `f5c5f40cb551b2f9e62078b2a7a2f9542ab41732`

### 8. SONAR_HOST_URL
**Value:** `https://sonarcloud.io`

---

## Quick Setup Script

After adding all secrets, the CI/CD pipeline will automatically:
- ✅ Build and test
- ✅ Run SonarQube analysis
- ✅ Run OWASP ZAP scan
- ✅ Deploy to EC2

---

## Note About EC2_SSH_KEY

You need to provide your EC2 private key (.pem file). If you don't have it:
1. Go to EC2 → Key Pairs
2. Download the key pair used for your instance
3. Copy the entire content (including -----BEGIN and -----END lines)
4. Paste as EC2_SSH_KEY secret

