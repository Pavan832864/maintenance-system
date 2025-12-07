# 🧪 How to Test - Local & Public Server

## ✅ Pipeline Status: SUCCESS!

Your CI/CD pipeline completed successfully! 🎉

---

## 🏠 Testing on Localhost

### Step 1: Start the Application

```bash
# Navigate to project directory
cd "/home/anas/Music/code (1) (1)/code (1)"

# Activate virtual environment
source venv/bin/activate

# Install dependencies (if not done)
pip install -r requirements.txt
pnpm install

# Start the application
python app.py
```

### Step 2: Access the Application

**User Interface:**
- URL: http://localhost:5000
- What to test:
  - ✅ View all maintenance requests
  - ✅ Create new request
  - ✅ Search and filter requests
  - ✅ Update request status

**Admin Dashboard:**
- URL: http://localhost:5000/admin/login
- **Credentials:**
  - Username: `admin`
  - Password: `admin123`
- What to test:
  - ✅ Login with admin credentials
  - ✅ View statistics dashboard
  - ✅ Manage all requests
  - ✅ Logout functionality

### Step 3: Test API Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# Get all requests
curl http://localhost:5000/api/requests

# Create a request
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Request",
    "description": "This is a test maintenance request",
    "priority": "High",
    "created_by": "Test User"
  }'
```

---

## 🌐 Testing on Public Server (EC2)

### Step 1: Check if Application is Running

**Option A: Check via Browser**
- **User Interface:** http://16.171.31.224:5000
- **Admin Login:** http://16.171.31.224:5000/admin/login
  - Username: `admin`
  - Password: `admin123`

**Option B: Check via SSH**
```bash
# SSH into EC2
ssh -i "maintenance-key (2).pem" ubuntu@16.171.31.224

# Check if app is running
ps aux | grep "python.*app.py"

# Check logs
tail -f ~/maintenance-system.log

# Test health endpoint
curl http://localhost:5000/api/health
```

### Step 2: Test Public Access

**From Your Browser:**
1. Open: http://16.171.31.224:5000
2. Test all features:
   - ✅ Create requests
   - ✅ View requests
   - ✅ Admin login
   - ✅ Admin dashboard

**From Terminal:**
```bash
# Health check
curl http://16.171.31.224:5000/api/health

# Get all requests
curl http://16.171.31.224:5000/api/requests
```

### Step 3: If Application Not Running

**Manual Start:**
```bash
# SSH into EC2
ssh -i "maintenance-key (2).pem" ubuntu@16.171.31.224

# Navigate to app directory
cd /opt/maintenance-system

# Activate virtual environment
source venv/bin/activate

# Start application
nohup python app.py > ~/maintenance-system.log 2>&1 &

# Check if running
ps aux | grep "python.*app.py"
```

---

## 🔍 Troubleshooting

### Localhost Issues:

**Port 5000 already in use:**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Or change port in app.py
# APP_PORT=5001
```

**Module not found:**
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

**Database connection error:**
- Check `.env` file has correct AWS credentials
- Verify DynamoDB table exists: `maintenance_requests`

### Public Server Issues:

**Can't access website:**
1. Check EC2 security group allows port 5000
2. Check if app is running: `ps aux | grep python`
3. Check logs: `tail -f ~/maintenance-system.log`

**Connection timeout:**
- Verify EC2 instance is running
- Check security group rules
- Verify public IP: `16.171.31.224`

**App not starting:**
```bash
# Check errors in log
cat ~/maintenance-system.log

# Check .env file exists
ls -la /opt/maintenance-system/.env

# Restart manually
cd /opt/maintenance-system
source venv/bin/activate
python app.py
```

---

## ✅ Test Checklist

### Localhost:
- [ ] Application starts without errors
- [ ] User interface loads at http://localhost:5000
- [ ] Can create maintenance requests
- [ ] Can view all requests
- [ ] Admin login works at http://localhost:5000/admin/login
- [ ] Admin dashboard shows statistics
- [ ] Logout works

### Public Server:
- [ ] Website accessible at http://16.171.31.224:5000
- [ ] User interface loads correctly
- [ ] Can create requests
- [ ] Admin login works
- [ ] Admin dashboard accessible
- [ ] API endpoints respond

---

## 🎯 Quick Test Commands

### Local:
```bash
# Start app
python app.py

# Test in browser
# http://localhost:5000
# http://localhost:5000/admin/login (admin/admin123)
```

### Public:
```bash
# Test from browser
# http://16.171.31.224:5000
# http://16.171.31.224:5000/admin/login (admin/admin123)

# Or test via curl
curl http://16.171.31.224:5000/api/health
```

---

## 📊 What to Test

### User Features:
1. ✅ Create maintenance request
2. ✅ View all requests
3. ✅ Search requests
4. ✅ Filter by priority/status
5. ✅ Update request status

### Admin Features:
1. ✅ Login with credentials
2. ✅ View statistics dashboard
3. ✅ See all requests
4. ✅ Edit requests
5. ✅ Delete requests
6. ✅ Logout

### API Features:
1. ✅ GET /api/requests
2. ✅ POST /api/requests
3. ✅ GET /api/requests/{id}
4. ✅ PUT /api/requests/{id}
5. ✅ DELETE /api/requests/{id}
6. ✅ GET /api/health
7. ✅ GET /api/admin/stats (protected)

---

**Start testing! Everything should work! 🚀**

