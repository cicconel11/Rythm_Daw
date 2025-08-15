const { PrismaClient } = require('@prisma/client');

async function debugAuth() {
  console.log('🔍 Debugging Authentication...\n');
  
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Check all users
    console.log('\n📋 All users in database:');
    const allUsers = await prisma.user.findMany({
      select: { id: true, email: true, name: true, createdAt: true }
    });
    
    allUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ID: ${user.id}, Email: ${user.email}, Name: ${user.name}, Created: ${user.createdAt}`);
    });
    
    // Test specific user lookup
    console.log('\n🔍 Testing user lookup for testuser@example.com:');
    const testUser = await prisma.user.findUnique({
      where: { email: 'testuser@example.com' }
    });
    
    if (testUser) {
      console.log('✅ User found:');
      console.log(`  ID: ${testUser.id}`);
      console.log(`  Email: ${testUser.email}`);
      console.log(`  Name: ${testUser.name}`);
      console.log(`  Created: ${testUser.createdAt}`);
    } else {
      console.log('❌ User not found');
    }
    
    // Test login flow
    console.log('\n🔐 Testing login flow:');
    
    // First, try to register the user
    console.log('1. Attempting to register testuser@example.com...');
    try {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('Test123!', 12);
      
      const newUser = await prisma.user.create({
        data: {
          email: 'testuser@example.com',
          name: 'Test User',
          password: hashedPassword,
          isApproved: true
        }
      });
      
      console.log('✅ User registered successfully:');
      console.log(`  ID: ${newUser.id}`);
      console.log(`  Email: ${newUser.email}`);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log('ℹ️  User already exists');
      } else {
        console.log('❌ Registration failed:', error.message);
      }
    }
    
    // Now test login
    console.log('\n2. Testing login...');
    const loginUser = await prisma.user.findUnique({
      where: { email: 'testuser@example.com' }
    });
    
    if (loginUser) {
      console.log('✅ User found for login:');
      console.log(`  ID: ${loginUser.id}`);
      console.log(`  Email: ${loginUser.email}`);
      console.log(`  Name: ${loginUser.name}`);
      
      // Test password verification
      const bcrypt = require('bcryptjs');
      const isPasswordValid = await bcrypt.compare('Test123!', loginUser.password);
      console.log(`  Password valid: ${isPasswordValid ? '✅' : '❌'}`);
    } else {
      console.log('❌ User not found for login');
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n✅ Database disconnected');
  }
}

debugAuth();
