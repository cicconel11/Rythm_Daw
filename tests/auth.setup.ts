// This file sets up the credentials user for E2E/CI testing.
// Make sure E2E_CREDENTIALS_EMAIL and E2E_CREDENTIALS_PASSWORD are set in your .env file.

export const E2E_USER = {
  email: process.env.E2E_CREDENTIALS_EMAIL || "testuser@e2e.com",
  password: process.env.E2E_CREDENTIALS_PASSWORD || "e2epassword",
};

// If you use a DB, you could seed the user here.
// For stateless NextAuth CredentialsProvider, just ensure env vars are set.

// Example for Prisma:
// import { prisma } from '../web/lib/prisma';
// beforeAll(async () => {
//   await prisma.user.upsert({
//     where: { email: E2E_USER.email },
//     update: {},
//     create: { email: E2E_USER.email, password: await hash(E2E_USER.password, 12) },
//   });
// });
