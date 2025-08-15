# AWS PostgreSQL Setup Guide

This guide will help you set up AWS PostgreSQL authentication testing with GitHub secrets.

## 🔧 Required GitHub Secrets

Set these secrets in your GitHub repository (Settings > Secrets and variables > Actions):

### Database Configuration
- `AWS_POSTGRES_URL` - Your AWS PostgreSQL connection string
  - Format: `postgresql://username:password@your-aws-postgres-endpoint:5432/database_name`
  - Example: `postgresql://rhythm_user:password123@rhythm-db.cluster-xyz.us-east-1.rds.amazonaws.com:5432/rhythm_db`

### AWS Configuration
- `AWS_REGION` - Your AWS region (e.g., `us-east-1`)
- `AWS_ACCESS_KEY_ID` - Your AWS access key ID
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret access key

### S3 Configuration
- `S3_BUCKET` - Your S3 bucket name for file storage

### JWT Configuration
- `JWT_SECRET` - Your JWT secret key (generate a strong random string)
- `JWT_REFRESH_SECRET` - Your JWT refresh secret key (generate a different strong random string)

## 🚀 Local Development Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Update your `.env` file with AWS PostgreSQL configuration:**
   ```env
   DATABASE_URL="postgresql://username:password@your-aws-postgres-endpoint:5432/database_name"
   AWS_REGION="us-east-1"
   AWS_ACCESS_KEY_ID="your-aws-access-key-id"
   AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
   S3_BUCKET="your-s3-bucket-name"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
   PORT=4000
   USE_WS=true
   ```

3. **Test the AWS PostgreSQL connection:**
   ```bash
   node scripts/setup-aws-postgres.js
   ```

4. **Run database migrations:**
   ```bash
   npx prisma migrate deploy
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

## 🧪 Running Authentication Tests

### Local Testing
```bash
# Run AWS PostgreSQL authentication tests
npm run test:e2e auth-aws-postgres.spec.ts

# Run S3 integration tests
npm run test:e2e file-share-s3.spec.ts

# Run all tests
npm run test:e2e
```

### GitHub Actions Testing
The GitHub Actions workflow will automatically:
1. Set up the AWS PostgreSQL environment
2. Run database migrations
3. Start the server
4. Run comprehensive authentication tests
5. Test S3 integration
6. Upload test results and reports

## 📋 Test Coverage

The authentication tests cover:

### ✅ User Authentication Flow
- User registration
- User login
- JWT token generation
- Authentication state management
- Logout functionality

### ✅ API Authentication
- Protected endpoint access
- Token validation
- Refresh token handling
- Error handling for invalid tokens

### ✅ Database Operations
- User creation and lookup
- Password hashing and verification
- File transfer operations
- Database connectivity

### ✅ Error Handling
- Invalid credentials
- Malformed emails
- Weak passwords
- Network errors
- Database connection issues

### ✅ S3 Integration
- File upload presigning
- S3 bucket connectivity
- File transfer workflow
- Real-time WebSocket communication

## 🔍 Troubleshooting

### Database Connection Issues
1. Verify your `DATABASE_URL` format
2. Check AWS PostgreSQL security groups
3. Ensure your IP is whitelisted
4. Verify database credentials

### AWS Credentials Issues
1. Check AWS access key permissions
2. Verify AWS region configuration
3. Ensure S3 bucket exists and is accessible
4. Check IAM policies for required permissions

### JWT Issues
1. Verify JWT secrets are set
2. Check JWT token expiration
3. Ensure consistent JWT configuration across services

### Test Failures
1. Check server logs for errors
2. Verify all environment variables are set
3. Ensure database migrations are up to date
4. Check network connectivity

## 📊 Monitoring and Logs

### Health Check Endpoint
```bash
curl http://localhost:4000/healthz
```

### Database Status
```bash
curl http://localhost:4000/api/ping
```

### Authentication Status
```bash
# Test with valid token
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/api/files/transfers
```

## 🎯 Next Steps

1. **Set up GitHub secrets** with your AWS credentials
2. **Configure your AWS PostgreSQL database** with proper security groups
3. **Create an S3 bucket** for file storage
4. **Run the authentication tests** to verify everything works
5. **Deploy to production** with confidence

## 🔐 Security Best Practices

1. **Use strong JWT secrets** - Generate random strings for production
2. **Rotate AWS credentials** regularly
3. **Use IAM roles** instead of access keys when possible
4. **Enable database encryption** for sensitive data
5. **Set up proper network security** with VPC and security groups
6. **Monitor access logs** for suspicious activity
7. **Use HTTPS** for all API communications
8. **Implement rate limiting** to prevent abuse
