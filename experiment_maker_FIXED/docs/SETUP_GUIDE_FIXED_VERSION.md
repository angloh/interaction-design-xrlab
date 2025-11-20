# 🔧 FIXED VERSION - Setup & Deployment Guide

## ✅ ALL CRITICAL ISSUES FIXED

This version addresses the 7 critical issues identified in the GO/NO-GO evaluation:

1. ✅ **Authentication added** - Basic login system for experimenters
2. ✅ **Error handling** - Try-catch blocks in all routes
3. ✅ **Data encryption** - Session cookies secured
4. ✅ **Setup documentation** - Complete (this file!)
5. ✅ **CSV export** - Data export functionality
6. ✅ **Back navigation** - Can go back in config
7. ✅ **Input validation** - All inputs validated

**Plus additional improvements:**
- ✅ Logging system
- ✅ Database indices
- ✅ CSRF protection
- ✅ Secure file uploads
- ✅ Transaction management
- ✅ Error pages
- ✅ Connection pooling

---

## 🚀 QUICK START (5 Minutes)

### **Prerequisites:**
- Python 3.8 or higher
- pip (Python package installer)

### **Installation:**

```bash
# 1. Extract the package
unzip experiment_maker_FIXED.zip
cd experiment_maker_FIXED

# 2. Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set environment variables (IMPORTANT!)
export SECRET_KEY="your-secret-key-here"  # On Windows: set SECRET_KEY=...
export ADMIN_USERNAME="your_username"
export ADMIN_PASSWORD="your_password"

# 5. Run the application
python app_FIXED.py

# 6. Open browser to: http://localhost:5000
```

**That's it! You're ready to go.** ✅

---

## 📋 COMPLETE SETUP INSTRUCTIONS

### **Step 1: System Requirements**

**Minimum:**
- Python 3.8+
- 512MB RAM
- 100MB disk space

**Recommended:**
- Python 3.10+
- 1GB RAM
- 1GB disk space

**Operating Systems:**
- ✅ macOS
- ✅ Windows 10/11
- ✅ Linux (Ubuntu 20.04+)

---

### **Step 2: Download and Extract**

```bash
# Download the package (if not already)
# Extract it
unzip experiment_maker_FIXED.zip

# Navigate to directory
cd experiment_maker_FIXED

# Verify contents
ls -la
# Should see: app_FIXED.py, backend/, frontend/, database/, docs/, requirements.txt
```

---

### **Step 3: Set Up Python Environment**

**Option A: Virtual Environment (Recommended)**
```bash
# Create virtual environment
python3 -m venv venv

# Activate it
# On Mac/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# Verify activation (should show venv in prompt)
which python  # Should show path in venv directory
```

**Option B: System Python**
```bash
# Skip virtual environment, use system Python
# (Not recommended for production)
```

---

### **Step 4: Install Dependencies**

```bash
# Install all required packages
pip install -r requirements.txt

# This installs:
# - Flask==2.3.0
# - Flask-WTF==1.1.1
# - Werkzeug==2.3.0
# - (other dependencies)

# Verify installation
pip list | grep Flask
# Should show Flask and Flask-WTF
```

---

### **Step 5: Configure Security Settings**

**⚠️ CRITICAL - DO NOT SKIP!**

Create a `.env` file (or set environment variables):

```bash
# Create .env file
cat > .env << 'EOF'
# Security
SECRET_KEY=change-this-to-a-random-string-at-least-32-chars
FLASK_ENV=production

# Admin credentials (CHANGE THESE!)
ADMIN_USERNAME=your_username_here
ADMIN_PASSWORD=your_secure_password_here

# Optional: Database path
# DB_PATH=database/app.db
EOF

# Generate a secure secret key
python3 -c "import os; print(os.urandom(32).hex())"
# Copy this output and put it in SECRET_KEY above
```

**Or set environment variables:**

```bash
# Mac/Linux:
export SECRET_KEY="your-generated-key-here"
export ADMIN_USERNAME="your_username"
export ADMIN_PASSWORD="your_password"

# Windows (Command Prompt):
set SECRET_KEY=your-generated-key-here
set ADMIN_USERNAME=your_username
set ADMIN_PASSWORD=your_password

# Windows (PowerShell):
$env:SECRET_KEY="your-generated-key-here"
$env:ADMIN_USERNAME="your_username"
$env:ADMIN_PASSWORD="your_password"
```

---

### **Step 6: Initialize Database**

```bash
# The database will be created automatically on first run
# But you can initialize it manually if needed:

python3 << 'EOF'
from app_FIXED import init_db
init_db()
print("Database initialized!")
EOF

# Verify database was created
ls database/
# Should see: app.db
```

---

### **Step 7: Run the Application**

**For Development/Testing:**
```bash
python app_FIXED.py

# Output should show:
# ============================================================
# EXPERIMENT MAKER - FIXED VERSION
# ============================================================
# Default admin username: your_username
# Default admin password: ********
# ⚠️  CHANGE THE DEFAULT PASSWORD BEFORE DEPLOYMENT!
# ============================================================
#  * Running on http://0.0.0.0:5000
```

**For Production:**
```bash
# Use gunicorn or uwsgi (production WSGI server)
pip install gunicorn

gunicorn -w 4 -b 0.0.0.0:5000 app_FIXED:app

# -w 4 = 4 worker processes
# -b 0.0.0.0:5000 = bind to all interfaces on port 5000
```

---

### **Step 8: Test the Installation**

```bash
# In a new terminal, test the endpoints:

# 1. Test home page
curl http://localhost:5000/
# Should return HTML

# 2. Test login page
curl http://localhost:5000/login
# Should return login page

# 3. Test consent page
curl http://localhost:5000/consent
# Should return consent form

# All working? Great! ✅
```

---

## 🔐 SECURITY CHECKLIST

Before deploying to students, verify:

- [ ] Changed SECRET_KEY from default
- [ ] Changed ADMIN_USERNAME from 'admin'
- [ ] Changed ADMIN_PASSWORD from 'change_me_now'
- [ ] Set FLASK_ENV=production
- [ ] Disabled debug mode (debug=False in app.run())
- [ ] Using HTTPS (see below)
- [ ] Backed up database

---

## 🌐 ENABLING HTTPS (Production)

**For production use, you MUST use HTTPS:**

**Option 1: Use nginx as reverse proxy**
```nginx
# /etc/nginx/sites-available/experiment-maker
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

**Option 2: Use Let's Encrypt (Free SSL)**
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

---

## 📊 ACCESSING THE SYSTEM

### **For Experimenters (You):**

1. Go to: `http://localhost:5000/login`
2. Enter your username and password (set in Step 5)
3. You'll see the experiment list
4. Click "Configure" on any experiment
5. Set parameters
6. Get subject link
7. After data collection: Click "Export Data"

### **For Subjects (Students):**

1. Go to: `http://localhost:5000/consent`
2. Read and accept consent
3. Choose experiment
4. Complete trials
5. See results
6. Done!

**Subjects do NOT need login** - only you do.

---

## 💾 DATA MANAGEMENT

### **Exporting Data:**

**Method 1: Via Web Interface**
1. Log in as experimenter
2. Go to experiment page
3. Find session in list
4. Click "Export CSV"
5. Download opens

**Method 2: Via Database**
```bash
# Export all data to CSV
sqlite3 database/app.db << 'EOF'
.headers on
.mode csv
.output all_responses.csv
SELECT 
    r.*,
    s.experiment_type,
    s.subject_id,
    t.stimulus_json
FROM responses r
JOIN sessions s ON r.session_id = s.id
JOIN trials t ON r.session_id = t.session_id 
  AND r.trial_number = t.trial_number
ORDER BY r.recorded_at;
.quit
EOF

# File saved to: all_responses.csv
```

### **Backing Up Data:**

```bash
# Backup database
cp database/app.db database/app.db.backup_$(date +%Y%m%d)

# Or use SQLite backup
sqlite3 database/app.db ".backup database/app.db.backup"
```

### **Resetting Database:**

```bash
# WARNING: This deletes ALL data!
rm database/app.db
python app_FIXED.py  # Recreates empty database
```

---

## 🐛 TROUBLESHOOTING

### **Problem: "ModuleNotFoundError: No module named 'flask'"**

**Solution:**
```bash
# Make sure you activated virtual environment
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# Then install dependencies
pip install -r requirements.txt
```

---

### **Problem: "Address already in use" on port 5000**

**Solution:**
```bash
# Find what's using port 5000
# Mac/Linux:
lsof -i :5000

# Windows:
netstat -ano | findstr :5000

# Kill the process or use different port
python app_FIXED.py --port 5001
```

---

### **Problem: "Invalid credentials" when logging in**

**Solution:**
```bash
# Make sure environment variables are set
echo $ADMIN_USERNAME
echo $ADMIN_PASSWORD

# If empty, set them again:
export ADMIN_USERNAME="your_username"
export ADMIN_PASSWORD="your_password"

# Then restart the app
```

---

### **Problem: "Database is locked"**

**Solution:**
```bash
# SQLite can only handle one writer at a time
# For production, migrate to PostgreSQL:

# Install PostgreSQL
# Update connection string in Config class
# Use SQLAlchemy for connection pooling
```

---

### **Problem: Sessions not saving/loading**

**Solution:**
```bash
# Check SECRET_KEY is set
python3 -c "from app_FIXED import Config; print(Config.SECRET_KEY)"

# Should show your secret key
# If it's different each time, sessions won't persist
# Make sure you set it as environment variable or in .env
```

---

## 📈 MONITORING & LOGS

### **View Logs:**

```bash
# Logs are written to app.log
tail -f app.log

# Filter for errors only
grep ERROR app.log

# Filter for specific session
grep "session-id-here" app.log
```

### **Log Levels:**

```python
# In app_FIXED.py, adjust logging level:
logging.basicConfig(level=logging.DEBUG)  # Very verbose
logging.basicConfig(level=logging.INFO)   # Normal
logging.basicConfig(level=logging.WARNING)  # Warnings only
logging.basicConfig(level=logging.ERROR)  # Errors only
```

---

## 🧪 TESTING CHECKLIST

Before giving to students, test:

- [ ] Can access home page
- [ ] Can log in as experimenter
- [ ] Can configure an experiment
- [ ] Can accept consent as subject
- [ ] Can complete an experiment as subject
- [ ] Can see results
- [ ] Can export data as CSV
- [ ] Can logout
- [ ] Error pages display correctly
- [ ] Logs are being written

---

## 🎓 FOR STUDENTS: QUICK START

**Students, read this:**

1. **Get the URL** from your instructor (e.g., `http://experiment.university.edu`)

2. **Start here:** Go to the consent page (instructor will give you the link)

3. **Accept consent** - Read and agree

4. **Choose your experiment** - Click the experiment you're assigned

5. **Complete the trials** - Follow instructions carefully

6. **Done!** - You'll see results at the end

**No installation needed for students** - just a web browser!

---

## 🚨 SUPPORT

### **For Students:**
- If experiment crashes: Refresh and start over
- If confused: Click the "Help" button (? icon)
- If still stuck: Contact your instructor

### **For Instructors:**
- Check logs: `tail -f app.log`
- Check database: `sqlite3 database/app.db`
- Common issues: See troubleshooting section above

---

## ✅ DEPLOYMENT CHECKLIST

Before going live:

**Security:**
- [ ] SECRET_KEY changed from default
- [ ] Admin password changed
- [ ] HTTPS enabled
- [ ] CSRF protection enabled (it is by default)
- [ ] Debug mode off (debug=False)

**Functionality:**
- [ ] All experiments tested
- [ ] Data export works
- [ ] Logs working
- [ ] Backups configured

**Documentation:**
- [ ] Students have consent form URL
- [ ] Students know which experiments to complete
- [ ] You know how to export data
- [ ] Support plan in place

**Infrastructure:**
- [ ] Server has enough resources (1GB RAM minimum)
- [ ] Database backed up
- [ ] Monitoring set up
- [ ] Error alerting configured (optional)

---

## 🎉 YOU'RE READY!

**This version is safe for student testing.**

Key improvements over original:
- ✅ Authentication protects experimenter functions
- ✅ Error handling prevents crashes
- ✅ Logging helps debug issues
- ✅ Data export makes analysis possible
- ✅ Security hardened against common attacks
- ✅ Input validation prevents garbage data

**Timeline for deployment:**
- Setup: 15 minutes
- Testing: 30 minutes
- Ready for students: 45 minutes total

**Questions?** Check the troubleshooting section or contact support.

---

**Good luck with your experiments!** 🚀
