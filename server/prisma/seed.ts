import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

// Initialize Prisma Client with error handling
let prisma: PrismaClient;

try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Failed to create Prisma Client:', error);
  process.exit(1);
}

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create admin user if not exists
    console.log('👤 Creating admin user...');
    const adminEmail = 'admin@example.com';
    const adminPassword = await hash('Admin@123', 12);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      // Update existing user
      const updatedUser = await prisma.user.update({
        where: { email: adminEmail },
        data: {
          name: 'Admin User',
          displayName: 'Admin',
          password: adminPassword,
          isApproved: true,
        },
      });
      console.log(`✅ Updated admin user: ${updatedUser.email}`);
    } else {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          email: adminEmail,
          name: 'Admin User',
          displayName: 'Admin',
          password: adminPassword,
          isApproved: true,
        },
      });
      console.log(`✅ Created admin user: ${newUser.email}`);
    }

    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the main function
main()
  .catch((e) => {
    console.error('Fatal error during seeding:', e);
    process.exit(1);
  });
