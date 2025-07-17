"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = require("bcryptjs");
let prisma;
try {
    prisma = new client_1.PrismaClient();
}
catch (error) {
    console.error('Failed to create Prisma Client:', error);
    process.exit(1);
}
async function main() {
    console.log('🌱 Starting database seeding...');
    try {
        console.log('👤 Creating admin user...');
        const adminEmail = 'admin@example.com';
        const adminPassword = await (0, bcryptjs_1.hash)('Admin@123', 12);
        const existingUser = await prisma.user.findUnique({
            where: { email: adminEmail },
        });
        if (existingUser) {
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
        }
        else {
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
    }
    catch (error) {
        console.error('Error during seeding:', error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
main()
    .catch((e) => {
    console.error('Fatal error during seeding:', e);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map