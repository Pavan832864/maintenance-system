# How to Get SonarQube Token - Step by Step

## Option 1: SonarCloud (FREE - Recommended)

SonarCloud is the **free cloud version** of SonarQube. It's easier to set up and perfect for your project.

### Step 1: Sign Up for SonarCloud

1. Go to: **https://sonarcloud.io**
2. Click **"Log in"** button (top right)
3. Click **"Log in with GitHub"**
4. Authorize SonarCloud to access your GitHub account
5. You'll be redirected to SonarCloud dashboard

### Step 2: Create Organization (First Time Only)

1. If this is your first time, you'll be asked to create an organization
2. Click **"Create Organization"**
3. Choose **"Free Plan"** (it's free!)
4. Enter organization name (e.g., `Pavan832864` or `maintenance-system`)
5. Click **"Create"**

### Step 3: Create/Import Project

1. Click **"+"** button (top right) or **"Add Project"**
2. Click **"Analyze new project"**
3. Select **"Import from GitHub"**
4. You'll see your GitHub repositories
5. Find and select **"maintenance-system"** (or your repo name)
6. Click **"Set up"**

### Step 4: Get Your SonarCloud Token

1. Click on your **profile picture** (top right corner)
2. Click **"My Account"**
3. Go to **"Security"** tab
4. Under **"Generate Tokens"** section:
   - **Token name:** Enter `maintenance-system-token`
   - Click **"Generate"**
5. **IMPORTANT:** Copy the token NOW (you won't see it again!)
   - It looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0`

6. **Share with me:**
   - SonarCloud Token: `_____________`

### Step 5: Get Project Key and Organization Key

1. Go back to your project in SonarCloud
2. Click on your project name
3. Go to **"Project Information"** or **"Settings"**
4. You'll see:
   - **Project Key:** (e.g., `Pavan832864_maintenance-system`)
   - **Organization Key:** (e.g., `Pavan832864`)

5. **Share with me:**
   - Project Key: `_____________`
   - Organization Key: `_____________`

### Step 6: Update sonar-project.properties

I'll update the `sonar-project.properties` file with your keys once you share them.

---

## Option 2: Self-Hosted SonarQube (Advanced - Skip if not needed)

If your professor specifically requires self-hosted SonarQube (not SonarCloud), you'll need to:

1. Install SonarQube on a server
2. Access it via URL (e.g., `http://your-server:9000`)
3. Log in with default credentials (`admin`/`admin`)
4. Generate token from **Administration → Security → Users → Tokens**

**For your project, I recommend SonarCloud (Option 1) - it's free and easier!**

---

## What to Share with Me

Once you complete the steps above, share:

```
✅ SonarCloud Token: _____________
✅ Project Key: _____________
✅ Organization Key: _____________
✅ SonarCloud URL: https://sonarcloud.io
```

---

## If You Can't Find Something

**Can't find "My Account"?**
- Click your profile picture → "My Account" or "Account"

**Can't find "Security" tab?**
- Look for "Security" in the left menu or top tabs

**Token not generating?**
- Make sure you're logged in
- Try refreshing the page
- Check if you have permission to generate tokens

**Can't see your GitHub repo?**
- Make sure you authorized SonarCloud to access GitHub
- Check if the repo is public or you've given SonarCloud access

---

**Start with Step 1 and let me know when you get the token!**

