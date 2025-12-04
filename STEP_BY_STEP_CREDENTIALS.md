# Step-by-Step Guide to Obtain All Required Credentials

Follow these steps **ONE BY ONE** and share each credential with me as you get it.

---

## 🔐 STEP 1: AWS Account Information

### 1.1 Get AWS Account ID

1. Log in to AWS Console: https://console.aws.amazon.com/
   - Email: `pavan84343@gmail.com`
   - Password: `Pavansai@123456`

2. Click on your **username** (top right corner)

3. You'll see your **Account ID** (12-digit number)

4. **Share with me:** Your AWS Account ID: `_____________`

---

### 1.2 Check Default Region

1. Look at the **top right corner** of AWS Console
2. You'll see the region (e.g., `eu-north-1`, `us-east-1`, etc.)

3. **Share with me:** Your AWS Region: `_____________`

---

## 🔑 STEP 2: Create IAM User for CI/CD (GitHub Actions)

### 2.1 Create IAM User

1. In AWS Console, search for **"IAM"** in the search bar
2. Click **"IAM"** service
3. Click **"Users"** in the left menu
4. Click **"Create user"** button
5. **User name:** Enter `github-actions-user` (or any name you prefer)
6. Click **"Next"**
7. **DO NOT** select "Provide user access to the AWS Management Console"
8. Click **"Next"**

### 2.2 Attach Policies

1. Click **"Attach policies directly"**
2. Search and select these policies:
   - ✅ `AmazonEC2FullAccess`
   - ✅ `AmazonDynamoDBFullAccess`
   - ✅ `CloudWatchLogsFullAccess`
   - ✅ `IAMReadOnlyAccess` (optional, for verification)
3. Click **"Next"**
4. Click **"Create user"**

### 2.3 Create Access Keys

1. Click on the user you just created (`github-actions-user`)
2. Click **"Security credentials"** tab
3. Scroll down to **"Access keys"** section
4. Click **"Create access key"**
5. Select **"Application running outside AWS"**
6. Click **"Next"**
7. Click **"Create access key"**
8. **IMPORTANT:** Copy both values NOW (you won't see them again):
   - **Access key ID:** `_____________`
   - **Secret access key:** `_____________`

9. **Share with me:**
   - Access Key ID: `_____________`
   - Secret Access Key: `_____________`

---

## 🛡️ STEP 3: Create IAM Role for EC2 Instance

### 3.1 Create IAM Role

1. In AWS Console, go to **IAM** → **Roles**
2. Click **"Create role"**
3. **Trusted entity type:** Select **"AWS service"**
4. **Use case:** Select **"EC2"**
5. Click **"Next"**

### 3.2 Attach Policies to Role

1. Search and select:
   - ✅ `AmazonDynamoDBFullAccess`
   - ✅ `CloudWatchLogsFullAccess`
2. Click **"Next"**

### 3.3 Name the Role

1. **Role name:** Enter `maintenance-system-role`
2. **Description:** "Role for Maintenance System EC2 instance"
3. Click **"Create role"**

### 3.4 Get Role ARN

1. Click on the role you just created (`maintenance-system-role`)
2. Copy the **ARN** (looks like: `arn:aws:iam::123456789012:role/maintenance-system-role`)

3. **Share with me:** IAM Role ARN: `_____________`

---

## 🖥️ STEP 4: Get EC2 Instance Information

### 4.1 Find Your EC2 Instance

1. In AWS Console, search for **"EC2"**
2. Click **"EC2"** service
3. Click **"Instances"** in the left menu
4. You should see your EC2 instance(s)

### 4.2 Get EC2 Details

1. Click on your EC2 instance
2. Look at the **Details** tab below
3. Find these values:

   **a) Public IPv4 address:**
   - Look for **"Public IPv4 address"**
   - **Share with me:** EC2 Public IP: `_____________`

   **b) Instance type:**
   - Look for **"Instance type"** (e.g., `t3.micro`)
   - **Share with me:** Instance Type: `_____________`

   **c) Key pair name:**
   - Look for **"Key pair name"**
   - **Share with me:** Key Pair Name: `_____________`

   **d) Security group:**
   - Click on the **Security group** link
   - Check **Inbound rules:**
     - Port 22 (SSH) should be open
     - Port 80 (HTTP) should be open
     - Port 5000 (if you want direct access) should be open
   - **Share with me:** Security Group allows SSH (22) and HTTP (80): `Yes/No`

### 4.3 Get SSH Key

1. Go back to EC2 Dashboard
2. Click **"Key Pairs"** in the left menu
3. Find the key pair name you noted above
4. **If you have the `.pem` file:**
   - Open it in a text editor
   - Copy the entire content (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`)
   - **Share with me:** I have the .pem file: `Yes/No`

5. **If you DON'T have the .pem file:**
   - You'll need to create a new key pair or download it
   - **Share with me:** I need to create/download key pair: `Yes/No`

### 4.4 Get EC2 Username

1. Check your EC2 instance **AMI** (Amazon Machine Image)
2. Look at the instance details for **"AMI ID"**
3. Common usernames:
   - **Ubuntu:** `ubuntu`
   - **Amazon Linux:** `ec2-user`
   - **Debian:** `admin`

4. **Share with me:** EC2 Username: `_____________`

---

## 💾 STEP 5: DynamoDB Table Information

### 5.1 Check DynamoDB Table

1. In AWS Console, search for **"DynamoDB"**
2. Click **"DynamoDB"** service
3. Click **"Tables"** in the left menu
4. Check if you have a table named `maintenance_requests`

### 5.2 If Table Exists

1. Click on the table
2. Note the **Table name**
3. Note the **Region**
4. **Share with me:**
   - Table Name: `_____________`
   - Table Region: `_____________`

### 5.3 If Table Does NOT Exist

1. Click **"Create table"**
2. **Table name:** `maintenance_requests`
3. **Partition key:** `id` (type: String)
4. Click **"Create table"**
5. Wait for table to be created
6. **Share with me:** Table created: `Yes`

---

## 📦 STEP 6: GitHub Repository Setup

### 6.1 Create GitHub Repository

1. Go to GitHub: https://github.com
2. Log in with:
   - Username: `Pavan832864`
   - Password: `Pavansai@12345`

3. Click the **"+"** icon (top right) → **"New repository"**

4. **Repository name:** `maintenance-system` (or any name you prefer)

5. **Description:** "Maintenance Request Management System - Cloud DevOpsSec Project"

6. **Visibility:** 
   - Choose **Private** (recommended) or **Public**

7. **DO NOT** check "Initialize with README" (we already have code)

8. Click **"Create repository"**

9. **Share with me:** GitHub Repository URL: `_____________`

### 6.2 Get GitHub Personal Access Token (for pushing code)

1. Click your **profile picture** (top right) → **"Settings"**
2. Scroll down → Click **"Developer settings"** (left sidebar)
3. Click **"Personal access tokens"** → **"Tokens (classic)"**
4. Click **"Generate new token"** → **"Generate new token (classic)"**
5. **Note:** Enter `maintenance-system-token`
6. **Expiration:** Choose `90 days` or `No expiration`
7. **Select scopes:** Check these:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
8. Click **"Generate token"**
9. **IMPORTANT:** Copy the token NOW (you won't see it again)
10. **Share with me:** GitHub Token: `_____________` (I'll help you use it securely)

---

## 🔍 STEP 7: SonarQube Setup (Optional - if professor requires it)

### 7.1 Option A: SonarCloud (Free for public repos)

1. Go to: https://sonarcloud.io
2. Click **"Log in"** → **"Log in with GitHub"**
3. Authorize SonarCloud
4. Click **"+"** → **"Analyze new project"**
5. Select your GitHub repository
6. Click **"Set up"**
7. Copy the **Project Key** and **Organization Key**
8. Go to **"My Account"** → **"Security"**
9. Generate a new token
10. **Share with me:**
    - SonarCloud URL: `https://sonarcloud.io`
    - SonarCloud Token: `_____________`
    - Project Key: `_____________`

### 7.2 Option B: Skip SonarQube (if not required)

- **Share with me:** Skip SonarQube: `Yes`

---

## ✅ STEP 8: Generate Application Secrets

### 8.1 Generate Admin Password Hash

1. Decide on an **admin username** (e.g., `admin` or student ID)
2. Decide on an **admin password** (strong password)
3. Run this command in your project directory:

```bash
python scripts/generate_secrets.py your-chosen-password
```

4. **Share with me:**
   - Admin Username: `_____________`
   - Admin Password Hash: `_____________` (from script output)
   - Secret Key: `_____________` (from script output)

---

## 📋 SUMMARY CHECKLIST

Once you have all the information, share it in this format:

```
✅ AWS Account ID: _____________
✅ AWS Region: _____________
✅ IAM Access Key ID: _____________
✅ IAM Secret Access Key: _____________
✅ IAM Role ARN: _____________
✅ EC2 Public IP: _____________
✅ EC2 Username: _____________
✅ EC2 Key Pair Name: _____________
✅ EC2 .pem file: Yes/No
✅ DynamoDB Table Name: _____________
✅ GitHub Repository URL: _____________
✅ GitHub Token: _____________
✅ SonarQube: Yes/No (if yes, share token and URL)
✅ Admin Username: _____________
✅ Admin Password Hash: _____________
✅ Secret Key: _____________
```

---

## 🚨 IMPORTANT SECURITY NOTES

1. **NEVER** share credentials in public chats or commit them to code
2. **NEVER** commit `.env` file to Git
3. Store credentials in:
   - `.env` file (local, for app)
   - GitHub Secrets (for CI/CD)
4. After sharing, I'll help you configure everything securely

---

**Start with STEP 1 and share each credential as you get it!**

