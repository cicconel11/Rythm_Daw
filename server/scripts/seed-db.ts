import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seeding...');
  
  // Initialize Prisma Client at the function level
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');

    // Create admin user
    const adminEmail = 'admin@example.com';
    const adminPassword = await hash('Admin@123', 12);

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
  } catch (error) {
    console.error('❌ Error seeding database:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect().catch(console.error);
  }
}

main();
