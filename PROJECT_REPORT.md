# Maintenance Request Management System
## Project Report

**Project Name:** Maintenance Request Management System  
**Version:** 2.0  
**Date:** December 2025  
**Project Type:** Cloud DevOpsSec Application  
**GitHub Repository:** https://github.com/Pavan832864/maintenance-system

---

## Executive Summary

The Maintenance Request Management System is a comprehensive cloud-based application designed to manage and track maintenance requests efficiently. The system has been enhanced with enterprise-grade security features, automated CI/CD pipelines, and comprehensive security scanning capabilities.

---

## 1. Project Overview

### 1.1 Purpose
The system provides a centralized platform for:
- Submitting maintenance requests
- Tracking request status and priority
- Admin dashboard for request management
- Real-time statistics and reporting
- Secure authentication and authorization

### 1.2 Technology Stack

**Backend:**
- Python 3.11
- Flask 3.0.0
- DynamoDB (AWS)
- Boto3 (AWS SDK)

**Frontend:**
- Next.js 15.5.6
- React 19.2.0
- TypeScript
- Tailwind CSS

**Infrastructure:**
- AWS EC2 (Application Hosting)
- AWS DynamoDB (Database)
- AWS IAM (Security)
- GitHub Actions (CI/CD)

**Security Tools:**
- SonarQube (Code Quality & Security)
- OWASP ZAP (Security Vulnerability Scanning)
- Bandit (Python Security Linter)
- Pylint (Code Quality)
- Safety (Dependency Vulnerability Check)

---

## 2. Features Implemented

### 2.1 Core Features

1. **Request Management**
   - Create maintenance requests
   - View all requests with filtering
   - Update request status and priority
   - Delete requests
   - Search functionality

2. **Admin Dashboard**
   - Comprehensive statistics overview
   - Priority breakdown visualization
   - Request management interface
   - Real-time data updates

3. **Authentication System**
   - Admin login with ID and password
   - Session-based authentication
   - Secure password hashing (SHA-256)
   - Logout functionality

### 2.2 Security Features

1. **AWS IAM Integration**
   - IAM role-based access control
   - Temporary credentials via STS
   - Least privilege principle
   - Role assumption for enhanced security

2. **Security Scanning**
   - Automated SonarQube analysis
   - OWASP ZAP vulnerability scanning
   - Bandit security linting
   - Dependency vulnerability checks

3. **Best Practices**
   - Environment variable configuration
   - Secure session management
   - Input validation and sanitization
   - Error handling and logging

### 2.3 DevOps Features

1. **CI/CD Pipeline**
   - Automated build and test
   - Security scanning integration
   - Automated deployment to EC2
   - Health check validation

2. **Code Quality**
   - Automated code analysis
   - Security vulnerability detection
   - Dependency management
   - Code coverage reporting

---

## 3. Architecture

### 3.1 System Architecture

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Flask API     │
│   (Backend)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   AWS DynamoDB  │
│   (Database)    │
└─────────────────┘

┌─────────────────┐
│   AWS IAM       │
│   (Security)    │
└─────────────────┘
```

### 3.2 Deployment Architecture

```
GitHub Repository
       │
       ▼
GitHub Actions (CI/CD)
       │
       ├──► Build & Test
       ├──► SonarQube Analysis
       ├──► OWASP ZAP Scan
       └──► Deploy to EC2
              │
              ▼
         AWS EC2 Instance
              │
              ├──► Flask Application
              └──► Nginx (Reverse Proxy)
```

---

## 4. Implementation Details

### 4.1 Admin Authentication

**Implementation:**
- Session-based authentication using Flask-Session
- Password hashing with SHA-256
- Protected admin routes with decorator
- Login/logout endpoints

**Security Measures:**
- Secure session management
- Password hashing (not plain text)
- Session timeout
- CSRF protection ready

### 4.2 AWS IAM Integration

**Implementation:**
- IAM role assumption via STS
- Temporary credential management
- Fallback to access keys if role unavailable
- IAM permission verification endpoints

**Benefits:**
- Enhanced security through role-based access
- Temporary credentials (reduced risk)
- Centralized permission management
- Audit trail via CloudTrail

### 4.3 CI/CD Pipeline

**Pipeline Stages:**

1. **Build and Test**
   - Python and Node.js setup
   - Dependency installation
   - Application build
   - Security scanning (Bandit, Pylint, Safety)

2. **SonarQube Analysis**
   - Code quality analysis
   - Security vulnerability detection
   - Code coverage reporting
   - Technical debt tracking

3. **OWASP ZAP Scanning**
   - Baseline security scan
   - Full security scan
   - Vulnerability reporting
   - Security best practices validation

4. **Deployment**
   - Automated EC2 deployment
   - Health check validation
   - Rollback capability

---

## 5. Security Measures

### 5.1 Authentication & Authorization

- Admin login with secure password hashing
- Session-based authentication
- Protected API endpoints
- IAM role-based access control

### 5.2 Code Security

- Static code analysis (SonarQube)
- Dynamic security scanning (OWASP ZAP)
- Dependency vulnerability checks (Safety)
- Python security linting (Bandit)

### 5.3 Infrastructure Security

- AWS IAM roles and policies
- Secure credential management
- Environment variable configuration
- Network security (Security Groups)

### 5.4 Data Security

- DynamoDB encryption at rest
- Secure data transmission (HTTPS ready)
- Input validation and sanitization
- Error handling without information leakage

---

## 6. Testing & Quality Assurance

### 6.1 Automated Testing

- Unit tests (framework ready)
- Integration tests
- Security tests (OWASP ZAP)
- Code quality tests (SonarQube)

### 6.2 Security Testing

- **SonarQube**: Code quality and security analysis
- **OWASP ZAP**: Web application security testing
- **Bandit**: Python security linting
- **Safety**: Dependency vulnerability scanning

### 6.3 Code Quality Metrics

- Code coverage tracking
- Technical debt monitoring
- Code duplication detection
- Maintainability index

---

## 7. Deployment

### 7.1 Local Development

```bash
# Setup
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pnpm install

# Run
python app.py
# Access at http://localhost:5000
```

### 7.2 Production Deployment

- Automated via GitHub Actions
- Deployed to AWS EC2
- Health checks implemented
- Rollback capability

### 7.3 Environment Configuration

- Environment variables for configuration
- Separate configs for dev/prod
- Secure credential management
- AWS IAM integration

---

## 8. Monitoring & Logging

### 8.1 Application Logging

- Structured logging with Python logging
- Error tracking and reporting
- Request/response logging
- Performance monitoring

### 8.2 AWS CloudWatch

- Application logs
- Error tracking
- Performance metrics
- Cost monitoring

---

## 9. Future Enhancements

1. **Additional Features**
   - User registration and authentication
   - Email notifications
   - File attachments for requests
   - Advanced reporting and analytics

2. **Security Enhancements**
   - Multi-factor authentication (MFA)
   - OAuth integration
   - API rate limiting
   - Advanced threat detection

3. **Performance Improvements**
   - Caching layer (Redis)
   - CDN integration
   - Database optimization
   - Load balancing

4. **DevOps Enhancements**
   - Blue-green deployments
   - Automated rollback
   - Performance testing
   - Chaos engineering

---

## 10. Conclusion

The Maintenance Request Management System has been successfully enhanced with:
- ✅ Admin authentication (ID and password)
- ✅ AWS IAM integration for security
- ✅ GitHub repository setup
- ✅ Automated CI/CD pipeline
- ✅ SonarQube integration
- ✅ OWASP ZAP integration
- ✅ Comprehensive documentation
- ✅ Local and server deployment support

The system is production-ready with enterprise-grade security features and automated deployment capabilities.

---

## 11. References

- **AWS Documentation**: https://docs.aws.amazon.com/
- **Flask Documentation**: https://flask.palletsprojects.com/
- **Next.js Documentation**: https://nextjs.org/docs
- **SonarQube Documentation**: https://docs.sonarqube.org/
- **OWASP ZAP Documentation**: https://www.zaproxy.org/docs/
- **GitHub Actions Documentation**: https://docs.github.com/en/actions

---

## 12. Appendix

### A. Environment Variables

See `CONFIGURATION_SETUP.md` for complete environment variable list.

### B. API Endpoints

- `GET /` - Home page
- `GET /admin/login` - Admin login page
- `POST /admin/login` - Admin login
- `POST /admin/logout` - Admin logout
- `GET /admin` - Admin dashboard (protected)
- `GET /api/requests` - Get all requests
- `POST /api/requests` - Create request
- `GET /api/requests/<id>` - Get specific request
- `PUT /api/requests/<id>` - Update request
- `DELETE /api/requests/<id>` - Delete request
- `GET /api/admin/stats` - Get statistics (protected)
- `GET /api/iam/verify` - Verify IAM (protected)
- `GET /api/iam/permissions` - Get IAM permissions (protected)
- `GET /api/health` - Health check

### C. GitHub Repository

**URL:** https://github.com/Pavan832864/maintenance-system

**Branches:**
- `main` - Production branch
- `develop` - Development branch

---

**Report Prepared By:** Development Team  
**Date:** December 2025  
**Version:** 2.0

