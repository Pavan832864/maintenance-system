# How to Set Admin Username and Password

## What This Means

The admin username and password are used to **log in to the admin dashboard** of your application.

- **Admin Username:** The ID/username you'll use to log in (e.g., `admin`, `pavan`, `student123`)
- **Admin Password:** The password you'll use to log in (e.g., `admin123`, `Pavansai@123`)

**These are NOT AWS or GitHub credentials - they're for YOUR APPLICATION only!**

---

## Step-by-Step: Set Admin Credentials

### Step 1: Decide Your Admin Credentials

Choose:
- **Admin Username:** `admin` (or any username you want)
- **Admin Password:** `admin123` (or any password you want - make it strong!)

**Example:**
- Username: `admin`
- Password: `admin123`

---

### Step 2: Generate Password Hash

Your application stores passwords as **hashes** (not plain text) for security.

1. Open terminal in your project directory
2. Run this command:

```bash
python scripts/generate_secrets.py admin123
```

Replace `admin123` with your actual password.

**Example output:**
```
==================================================
Secret Generation Helper
==================================================

1. SECRET_KEY (for Flask sessions):
   xK9mP2qR5sT8vW1yZ4aB7cD0eF3gH6iJ9kL2mN5pQ8rS1tU4vW7xY0zA3bC6dE9fG

2. ADMIN_PASSWORD_HASH:
   a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3

3. Add to your .env file:
   SECRET_KEY=xK9mP2qR5sT8vW1yZ4aB7cD0eF3gH6iJ9kL2mN5pQ8rS1tU4vW7xY0zA3bC6dE9fG
   ADMIN_PASSWORD_HASH=a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3
==================================================
```

---

### Step 3: Create .env File

1. In your project root directory, create a file named `.env`
2. Add these lines:

```bash
# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3

# Flask Secret Key (from script output)
SECRET_KEY=xK9mP2qR5sT8vW1yZ4aB7cD0eF3gH6iJ9kL2mN5pQ8rS1tU4vW7xY0zA3bC6dE9fG

# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=False
```

**Replace the values with:**
- `ADMIN_USERNAME` = Your chosen username (e.g., `admin`)
- `ADMIN_PASSWORD_HASH` = The hash from Step 2
- `SECRET_KEY` = The secret key from Step 2

---

### Step 4: Test Login

1. Start your application:
   ```bash
   python app.py
   ```

2. Open browser: `http://localhost:5000/admin/login`

3. Enter:
   - **Username:** `admin` (or whatever you set)
   - **Password:** `admin123` (or whatever you set)

4. Click **"Login"**

5. You should be redirected to the admin dashboard!

---

## Example: Complete .env File

Here's a complete example `.env` file:

```bash
# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3

# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=xK9mP2qR5sT8vW1yZ4aB7cD0eF3gH6iJ9kL2mN5pQ8rS1tU4vW7xY0zA3bC6dE9fG

# AWS Configuration (you'll add these later)
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

# DynamoDB
DYNAMODB_TABLE_NAME=maintenance_requests
```

---

## Quick Setup Script

I can create a script that does everything automatically. Would you like me to create it?

**For now, just run:**
```bash
python scripts/generate_secrets.py admin123
```

Then copy the output to your `.env` file.

---

## Important Notes

1. **Never commit `.env` file to Git!** (It's already in `.gitignore`)

2. **Password Hash vs Password:**
   - You store the **HASH** in `.env` file
   - You enter the **PASSWORD** when logging in
   - The app hashes your entered password and compares it

3. **Change Password:**
   - Run the script again with new password
   - Update `ADMIN_PASSWORD_HASH` in `.env`

4. **Multiple Admins:**
   - Currently supports one admin
   - Can be extended later if needed

---

## What to Share with Me

After you set it up, just confirm:

```
✅ Admin Username: admin
✅ Admin Password: admin123 (or whatever you chose)
✅ .env file created: Yes
✅ Can login to admin dashboard: Yes/No
```

---

**Try it now and let me know if you can log in!**

