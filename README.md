# Maintenance Request Management System - Cloud DevOpsSec

A production-ready, cloud-based maintenance request management system built with Python Flask, Next.js, AWS DynamoDB, and deployed on AWS EC2 with a complete CI/CD pipeline including SonarQube and OWASP ZAP security scanning.

## Features

- **Full CRUD Operations**: Create, Read, Update, and Delete maintenance requests
- **Admin Authentication**: Secure admin login with ID and password
- **User-Friendly Interface**: Modern Next.js frontend with responsive design
- **Input Validation**: Comprehensive validation on both frontend and backend
- **Status Tracking**: Track request status (Pending, In Progress, Resolved, Closed)
- **Priority Levels**: Assign priority levels (Low, Medium, High, Critical)
- **Search & Filter**: Search requests by title and filter by status/priority
- **Admin Dashboard**: Comprehensive statistics and request management
- **AWS IAM Integration**: Enhanced security with IAM roles and policies
- **Security Scanning**: SonarQube and OWASP ZAP integration
- **CI/CD Pipeline**: Automated build, test, security scan, and deployment via GitHub Actions
- **Cloud Deployment**: Hosted on AWS EC2 with DynamoDB backend
- **Monitoring**: CloudWatch integration for logging and monitoring

## Tech Stack

- **Backend**: Python Flask 3.0.0
- **Frontend**: Next.js 15.5.6, React 19.2.0, TypeScript, Tailwind CSS
- **Database**: AWS DynamoDB (NoSQL)
- **Hosting**: AWS EC2
- **Security**: AWS IAM, Session-based Authentication
- **CI/CD**: GitHub Actions (with SonarQube and OWASP ZAP)
- **Code Analysis**: SonarQube, OWASP ZAP, Bandit, Pylint, Safety
- **Version Control**: GitHub
- **Process Manager**: Gunicorn
- **Reverse Proxy**: Nginx

## Quick Start

### Prerequisites
- Python 3.8+
- AWS Account with credentials
- GitHub Account
- Git

### Local Development

1. **Clone Repository**
   \`\`\`bash
   git clone https://github.com/anasaqeeel/maintenance-system.git
   cd maintenance-system
   \`\`\`

2. **Create Virtual Environment**
   \`\`\`bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   \`\`\`

3. **Install Dependencies**
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. **Configure Environment**
   \`\`\`bash
   # Create .env file (see CONFIGURATION_SETUP.md for details)
   # Required variables:
   # - ADMIN_USERNAME=admin
   # - ADMIN_PASSWORD_HASH=(generate with: python -c "import hashlib; print(hashlib.sha256('your-password'.encode()).hexdigest())")
   # - AWS_ACCESS_KEY_ID=your_key
   # - AWS_SECRET_ACCESS_KEY=your_secret
   # - AWS_REGION=eu-north-1
   # - SECRET_KEY=(generate secure key)
   \`\`\`

5. **Run Application**
   \`\`\`bash
   python app.py
   \`\`\`

5. **Install Node.js Dependencies**
   \`\`\`bash
   npm install -g pnpm
   pnpm install
   \`\`\`

6. **Run Application**
   \`\`\`bash
   # Option 1: Use the start script
   bash scripts/start_server.sh
   
   # Option 2: Run manually
   python app.py
   \`\`\`

7. **Access Application**
   - User Interface: `http://localhost:5000`
   - Admin Login: `http://localhost:5000/admin/login`
     - Default credentials: admin / (password set in .env)

## API Endpoints

### Get All Requests
\`\`\`
GET /api/requests
Response: [{ id, title, description, status, priority, created_by, created_at, updated_at }]
\`\`\`

### Create Request
\`\`\`
POST /api/requests
Content-Type: application/json

{
  "title": "AC not working",
  "description": "The air conditioning in room 101 is not functioning properly",
  "priority": "High",
  "created_by": "John Doe"
}
\`\`\`

### Get Specific Request
\`\`\`
GET /api/requests/{id}
Response: { id, title, description, status, priority, created_by, created_at, updated_at }
\`\`\`

### Update Request
\`\`\`
PUT /api/requests/{id}
Content-Type: application/json

{
  "status": "In Progress",
  "priority": "Medium"
}
\`\`\`

### Delete Request
\`\`\`
DELETE /api/requests/{id}
Response: { message: "Request deleted successfully" }
\`\`\`

### Admin Login
\`\`\`
POST /admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your-password"
}
\`\`\`

### Admin Logout
\`\`\`
POST /admin/logout
\`\`\`

### Get Admin Statistics (Protected)
\`\`\`
GET /api/admin/stats
Response: { total, pending, in_progress, resolved, closed, critical, high, medium, low }
\`\`\`

### Verify IAM (Protected)
\`\`\`
GET /api/iam/verify
Response: { status, iam_user/iam_arn, iam_enabled, region }
\`\`\`

### Get IAM Permissions (Protected)
\`\`\`
GET /api/iam/permissions
Response: { status, permissions: [{ type, name, arn }], count }
\`\`\`

### Health Check
\`\`\`
GET /api/health
Response: { status: "healthy", timestamp, database: "DynamoDB", region: "eu-north-1" }
\`\`\`

## Project Structure

\`\`\`
maintenance-system/
├── app.py                      # Flask application with DynamoDB integration
├── requirements.txt            # Python dependencies (includes boto3)
├── .env.example               # Environment variables template
├── .env                       # Environment variables (your credentials)
├── buildspec.yml              # AWS CodeBuild configuration
├── appspec.yml                # AWS CodeDeploy configuration
├── scripts/
│   ├── before_install.sh      # EC2 pre-installation setup
│   ├── start_server.sh        # Start Gunicorn server
│   └── stop_server.sh         # Stop Gunicorn server
├── templates/
│   └── index.html             # Main HTML interface
├── static/
│   ├── style.css              # CSS styling
│   └── script.js              # JavaScript CRUD operations
└── README.md                  # This file
\`\`\`

## Deployment

### AWS EC2 (Manual Deployment)

1. **SSH into EC2**
   \`\`\`bash
   ssh -i maintenance-key.pem ec2-user@13.51.206.149
   \`\`\`

2. **Setup Application**
   \`\`\`bash
   cd /home/ec2-user
   git clone https://github.com/anasaqeeel/maintenance-system.git
   cd maintenance-system
   bash scripts/before_install.sh
   bash scripts/start_server.sh
   \`\`\`

3. **Setup Nginx**
   \`\`\`bash
   sudo yum install -y nginx
   sudo systemctl start nginx
   sudo systemctl enable nginx
   
   # Configure reverse proxy
   sudo tee /etc/nginx/conf.d/maintenance.conf << 'EOF'
   server {
       listen 80;
       server_name _;
       
       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   EOF
   
   sudo systemctl reload nginx
   \`\`\`

4. **Access Application**
   Open browser: `http://13.51.206.149`

### GitHub Repository Setup

1. **Initialize and Push to GitHub**
   \`\`\`bash
   bash scripts/setup_github.sh
   \`\`\`
   
   Or manually:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/Pavan832864/maintenance-system.git
   git branch -M main
   git push -u origin main
   \`\`\`

2. **Configure GitHub Secrets**
   Go to Repository → Settings → Secrets and variables → Actions
   Add the following secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `EC2_HOST`
   - `EC2_USER`
   - `EC2_SSH_KEY`
   - `SONAR_TOKEN` (optional, for SonarQube)
   - `SONAR_HOST_URL` (optional, for SonarQube)

3. **CI/CD Pipeline**
   The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) will automatically:
   - Build and test the application
   - Run SonarQube analysis
   - Run OWASP ZAP security scan
   - Deploy to EC2 on main branch push

## Testing

### Manual API Testing

\`\`\`bash
# Health check
curl http://13.51.206.149/api/health

# Create request
curl -X POST http://13.51.206.149/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Request",
    "description": "This is a test maintenance request",
    "priority": "High",
    "created_by": "Tester"
  }'

# Get all requests
curl http://13.51.206.149/api/requests

# Get specific request
curl http://13.51.206.149/api/requests/{id}

# Update request
curl -X PUT http://13.51.206.149/api/requests/{id} \
  -H "Content-Type: application/json" \
  -d '{"status": "In Progress"}'

# Delete request
curl -X DELETE http://13.51.206.149/api/requests/{id}
\`\`\`

## Security Scanning

### Automated (via CI/CD)
- **SonarQube**: Code quality and security analysis (runs on every push)
- **OWASP ZAP**: Web application security vulnerability scanning
- **Bandit**: Python security linting
- **Pylint**: Code quality analysis
- **Safety**: Dependency vulnerability checking

### Manual Execution

\`\`\`bash
# Security vulnerabilities
bandit -r . -f json -o bandit-report.json

# Code quality
pylint app.py --output-format=json > pylint-report.json

# Dependency vulnerabilities
safety check --json > safety-report.json
\`\`\`

See `CONFIGURATION_SETUP.md` for detailed security tool setup.

## Monitoring

CloudWatch logs are available at:
\`\`\`
/aws/ec2/maintenance-system
\`\`\`

View logs:
\`\`\`bash
aws logs tail /aws/ec2/maintenance-system --follow
\`\`\`

## Troubleshooting

### Application not starting
\`\`\`bash
# Check logs
tail -f /home/ec2-user/maintenance-system/app.log

# Restart
pkill -f gunicorn
cd /home/ec2-user/maintenance-system
bash scripts/start_server.sh
\`\`\`

### DynamoDB connection error
\`\`\`bash
# Verify credentials
cat .env

# Check IAM role permissions
aws iam get-role --role-name maintenance-system-role
\`\`\`

### Nginx issues
\`\`\`bash
# Check Nginx config
sudo nginx -t

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
\`\`\`

## Security

- **Admin Authentication**: Secure login with password hashing
- **AWS IAM Integration**: Role-based access control with temporary credentials
- **Session Management**: Secure Flask sessions with signed cookies
- **Input Validation**: Comprehensive validation on both frontend and backend
- **XSS Protection**: HTML escaping and input sanitization
- **CORS**: Properly configured for cross-origin requests
- **DynamoDB Access**: Controlled via IAM roles and policies
- **Environment Variables**: Sensitive data stored securely
- **Security Scanning**: Automated SonarQube and OWASP ZAP scanning
- **Dependency Checks**: Regular Safety checks for vulnerable packages
- **Code Analysis**: Bandit and Pylint for security and quality
- **Error Handling**: Comprehensive without information leakage

## Performance Optimization

- DynamoDB on-demand billing (pay per request)
- Gunicorn with 4 workers for concurrent requests
- Nginx reverse proxy caching
- Browser caching enabled
- Code minification in production

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Create Pull Request

## License

This project is licensed under the MIT License.

## Documentation

- **Configuration Setup**: See `CONFIGURATION_SETUP.md` for detailed setup instructions
- **Project Report**: See `PROJECT_REPORT.md` for comprehensive project documentation
- **Setup Guide**: See `SETUP_GUIDE.md` for deployment guide

## Support

For issues or questions:
- Open a GitHub Issue: https://github.com/Pavan832864/maintenance-system/issues
- Check the troubleshooting section above
- Review CloudWatch logs for errors
- See `CONFIGURATION_SETUP.md` for configuration help

## Author

Cloud DevOpsSec Team

## Acknowledgments

- Flask: https://flask.palletsprojects.com/
- AWS: https://aws.amazon.com/
- DynamoDB: https://aws.amazon.com/dynamodb/
- Boto3: https://boto3.amazonaws.com/

---

**Version**: 2.0  
**Last Updated**: December 2025  
**Status**: Production Ready  
**Database**: AWS DynamoDB  
**Hosting**: AWS EC2  
**Region**: eu-north-1  
**GitHub**: https://github.com/Pavan832864/maintenance-system

## Recent Updates (v2.0)

✅ Admin authentication with ID and password  
✅ AWS IAM integration for enhanced security  
✅ GitHub Actions CI/CD pipeline  
✅ SonarQube code quality and security analysis  
✅ OWASP ZAP security vulnerability scanning  
✅ Comprehensive documentation (Configuration Setup & Project Report)  
✅ Enhanced deployment scripts  
✅ Local and server deployment support
