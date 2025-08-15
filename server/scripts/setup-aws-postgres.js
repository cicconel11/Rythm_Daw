const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// AWS PostgreSQL configuration
const AWS_POSTGRES_CONFIG = {
  // These should be set from GitHub secrets or environment variables
  DATABASE_URL: process.env.DATABASE_URL || process.env.AWS_POSTGRES_URL,
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  S3_BUCKET: process.env.S3_BUCKET || 'rhythm-file-storage',
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production'
};

async function setupAwsPostgres() {
  console.log('🚀 Setting up AWS PostgreSQL Environment...\n');
  
  // Check environment variables
  console.log('📋 Environment Configuration:');
  console.log(`  DATABASE_URL: ${AWS_POSTGRES_CONFIG.DATABASE_URL ? '✅ Set' : '❌ Not set'}`);
  console.log(`  AWS_REGION: ${AWS_POSTGRES_CONFIG.AWS_REGION}`);
  console.log(`  AWS_ACCESS_KEY_ID: ${AWS_POSTGRES_CONFIG.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Not set'}`);
  console.log(`  AWS_SECRET_ACCESS_KEY: ${AWS_POSTGRES_CONFIG.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Not set'}`);
  console.log(`  S3_BUCKET: ${AWS_POSTGRES_CONFIG.S3_BUCKET}`);
  console.log(`  JWT_SECRET: ${AWS_POSTGRES_CONFIG.JWT_SECRET ? '✅ Set' : '❌ Not set'}`);
  console.log(`  JWT_REFRESH_SECRET: ${AWS_POSTGRES_CONFIG.JWT_REFRESH_SECRET ? '✅ Set' : '❌ Not set'}\n`);

  if (!AWS_POSTGRES_CONFIG.DATABASE_URL) {
    console.log('❌ DATABASE_URL not set. Please set it to your AWS PostgreSQL connection string.');
    console.log('   Example: postgresql://username:password@your-aws-postgres-endpoint:5432/database');
    console.log('   You can set this as a GitHub secret or environment variable.\n');
    return false;
  }

  // Test database connection
  console.log('🔌 Testing AWS PostgreSQL Connection...');
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: AWS_POSTGRES_CONFIG.DATABASE_URL
      }
    }
  });

  try {
    await prisma.$connect();
    console.log('✅ Successfully connected to AWS PostgreSQL database');
    
    // Test database operations
    console.log('\n🧪 Testing Database Operations...');
    
    // Check if tables exist
    const tableCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log(`  Tables found: ${tableCount[0].count}`);
    
    // Test user creation
    console.log('\n👤 Testing User Authentication...');
    
    // Create a test user
    const testUserEmail = 'test-aws-postgres@example.com';
    const testUserPassword = 'Test123!';
    const hashedPassword = await bcrypt.hash(testUserPassword, 12);
    
    // Check if user exists
    let existingUser = await prisma.user.findUnique({
      where: { email: testUserEmail }
    });
    
    if (!existingUser) {
      console.log('  Creating test user...');
      existingUser = await prisma.user.create({
        data: {
          email: testUserEmail,
          name: 'AWS PostgreSQL Test User',
          password: hashedPassword,
          isApproved: true
        }
      });
      console.log('  ✅ Test user created successfully');
    } else {
      console.log('  ✅ Test user already exists');
    }
    
    // Test user authentication
    console.log('  Testing password verification...');
    const isPasswordValid = await bcrypt.compare(testUserPassword, existingUser.password);
    console.log(`  Password verification: ${isPasswordValid ? '✅ Success' : '❌ Failed'}`);
    
    // Test user lookup
    console.log('  Testing user lookup...');
    const foundUser = await prisma.user.findUnique({
      where: { email: testUserEmail },
      select: { id: true, email: true, name: true, isApproved: true }
    });
    console.log(`  User lookup: ${foundUser ? '✅ Success' : '❌ Failed'}`);
    
    if (foundUser) {
      console.log(`    User ID: ${foundUser.id}`);
      console.log(`    Email: ${foundUser.email}`);
      console.log(`    Name: ${foundUser.name}`);
      console.log(`    Approved: ${foundUser.isApproved}`);
    }
    
    // Test file transfer operations
    console.log('\n📁 Testing File Transfer Operations...');
    
    // Create a test file transfer
    const testTransfer = await prisma.fileTransfer.create({
      data: {
        fileName: 'test-aws-postgres-file.wav',
        fileSize: 1024,
        mimeType: 'audio/wav',
        fromUserId: existingUser.id,
        toUserId: existingUser.id, // Self-transfer for testing
        status: 'PENDING',
        progress: 0
      }
    });
    console.log('  ✅ Test file transfer created');
    console.log(`    Transfer ID: ${testTransfer.id}`);
    console.log(`    File: ${testTransfer.fileName}`);
    console.log(`    Status: ${testTransfer.status}`);
    
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await prisma.fileTransfer.delete({
      where: { id: testTransfer.id }
    });
    console.log('  ✅ Test file transfer cleaned up');
    
    console.log('\n🎉 AWS PostgreSQL setup and testing completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('  1. Set up your GitHub secrets with AWS credentials');
    console.log('  2. Update your .env file with the AWS PostgreSQL URL');
    console.log('  3. Run the authentication tests');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error connecting to AWS PostgreSQL:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('  1. Check your DATABASE_URL format');
    console.log('  2. Verify AWS PostgreSQL is running and accessible');
    console.log('  3. Check your network/firewall settings');
    console.log('  4. Verify your AWS credentials are correct');
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupAwsPostgres().then(success => {
  process.exit(success ? 0 : 1);
});
