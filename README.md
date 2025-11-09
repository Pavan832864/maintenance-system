# Maintenance Request Management System - Cloud DevOpsSec

A production-ready, cloud-based maintenance request management system built with Python Flask, AWS DynamoDB, and deployed on AWS EC2 with a complete CI/CD pipeline.

## Features

- **Full CRUD Operations**: Create, Read, Update, and Delete maintenance requests
- **User-Friendly Interface**: Clean, responsive HTML/CSS/JavaScript frontend
- **Input Validation**: Comprehensive validation on both frontend and backend
- **Status Tracking**: Track request status (Pending, In Progress, Resolved, Closed)
- **Priority Levels**: Assign priority levels (Low, Medium, High, Critical)
- **Search & Filter**: Search requests by title and filter by status
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Security**: Input sanitization, XSS protection, CORS enabled
- **Static Code Analysis**: Integrated Bandit, Pylint, and Safety checks
- **CI/CD Pipeline**: Automated build, test, and deployment with AWS CodePipeline
- **Cloud Deployment**: Hosted on AWS EC2 with DynamoDB backend
- **Monitoring**: CloudWatch integration for logging and monitoring

## Tech Stack

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **Database**: AWS DynamoDB (NoSQL)
- **Hosting**: AWS EC2
- **CI/CD**: AWS CodePipeline, CodeBuild, CodeDeploy
- **Code Analysis**: Bandit, Pylint, Safety
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
   cp .env.example .env
   # Edit .env with your AWS credentials:
   # AWS_ACCESS_KEY_ID=your_key
   # AWS_SECRET_ACCESS_KEY=your_secret
   # AWS_REGION=eu-north-1
   \`\`\`

5. **Run Application**
   \`\`\`bash
   python app.py
   \`\`\`

6. **Access Application**
   Open browser: `http://localhost:5000`

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

### AWS CodePipeline (CI/CD)

1. Create GitHub repository
2. Set up AWS CodePipeline with:
   - Source: GitHub
   - Build: CodeBuild (uses buildspec.yml)
   - Deploy: CodeDeploy (uses appspec.yml)

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

## Static Code Analysis

\`\`\`bash
# Security vulnerabilities
bandit -r . -f json -o bandit-report.json

# Code quality
pylint app.py --output-format=json > pylint-report.json

# Dependency vulnerabilities
safety check --json > safety-report.json
\`\`\`

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

- Input validation and sanitization
- XSS protection with HTML escaping
- CORS properly configured
- DynamoDB access controlled via IAM
- Environment variables for sensitive data
- Comprehensive error handling
- Security scanning in CI/CD pipeline

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

## Support

For issues or questions:
- Open a GitHub Issue
- Check the troubleshooting section above
- Review CloudWatch logs for errors

## Author

Cloud DevOpsSec Team

## Acknowledgments

- Flask: https://flask.palletsprojects.com/
- AWS: https://aws.amazon.com/
- DynamoDB: https://aws.amazon.com/dynamodb/
- Boto3: https://boto3.amazonaws.com/

---

**Version**: 2.0 (DynamoDB Edition)  
**Last Updated**: 2025  
**Status**: Production Ready  
**Database**: AWS DynamoDB  
**Hosting**: AWS EC2  
**Region**: eu-north-1
