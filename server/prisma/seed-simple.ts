import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

async function seed() {
  console.log('🌱 Starting database seeding...');
  
  // Initialize Prisma Client with explicit options
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  try {
    // Test the connection
    await prisma.$connect();
    console.log('✅ Successfully connected to the database');
    
    // Create admin user
    const adminEmail = 'admin@example.com';
    const adminPassword = await hash('Admin@123', 12);
    
    // Use raw SQL to insert or update the admin user
    await prisma.$executeRaw`
      INSERT INTO "User" (email, name, "displayName", password, "isApproved", "createdAt", "updatedAt")
      VALUES (${adminEmail}, 'Admin User', 'Admin', ${adminPassword}, true, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE
      SET 
        name = EXCLUDED.name,
        "displayName" = EXCLUDED."displayName",
        password = EXCLUDED.password,
        "isApproved" = EXCLUDED."isApproved",
        "updatedAt" = NOW()
      RETURNING *;
    `;
    
    console.log(`✅ Created/Updated admin user: ${adminEmail}`);
    console.log('🎉 Database seeded successfully!');
    
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
