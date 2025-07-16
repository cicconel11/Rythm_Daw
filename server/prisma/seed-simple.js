"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = require("bcryptjs");
async function seed() {
    console.log('🌱 Starting database seeding...');
    const prisma = new client_1.PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    });
    try {
        await prisma.$connect();
        console.log('✅ Successfully connected to the database');
        const adminEmail = 'admin@example.com';
        const adminPassword = await (0, bcryptjs_1.hash)('Admin@123', 12);
        await prisma.$executeRaw `
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
    }
    catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
seed();
//# sourceMappingURL=seed-simple.js.map