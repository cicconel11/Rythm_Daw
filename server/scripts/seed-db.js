require('dotenv').config({ path: '../../.env' });
const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

// Initialize Prisma Client with minimal configuration
const prisma = new PrismaClient({
  log: ['error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('✅ Connected to database');

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = await hash(process.env.ADMIN_PASSWORD || 'Admin@123', 12);

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
    } else {
      // Create admin user
      const admin = await prisma.user.create({
        data: {
          email: adminEmail,
          name: 'Admin User',
          displayName: 'Admin',
          password: adminPassword,
          isApproved: true,
        },
      });
      console.log(`✅ Created admin user: ${admin.email}`);
    }

    console.log('🎉 Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error seeding database:');
    console.error(error);
    throw error;
  } finally {
    await prisma.$disconnect().catch(console.error);
  }
}

// Run the main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error during seeding:', error);
    process.exit(1);
  });
