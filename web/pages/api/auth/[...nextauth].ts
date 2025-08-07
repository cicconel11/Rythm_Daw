import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { encode, decode } from 'next-auth/jwt';
// If using PrismaAdapter, import it and your prisma instance
// import { PrismaAdapter } from '@next-auth/prisma-adapter';
// import { prisma } from '../../../lib/prisma';

const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
];

if (process.env.NODE_ENV !== 'production') {
  providers.push(
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (
          credentials?.email === process.env.E2E_CREDENTIALS_EMAIL &&
          credentials?.password === process.env.E2E_CREDENTIALS_PASSWORD
        ) {
          return {
            id: 'e2e-user',
            email: credentials.email,
            name: 'E2E User',
          };
        }
        return null;
      },
    })
  );
}

export const authOptions: NextAuthOptions = {
  // Uncomment if you use Prisma:
  // adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 60, // 30 minutes
    encode: async ({ token, secret }) => {
      return encode({
        token,
        secret,
        maxAge: 30 * 60,
        // algorithm: 'HS256', // Remove if not supported by type
      });
    },
    decode: async ({ token, secret }) => {
      return decode({ token, secret /*, algorithms: ['HS256']*/ }); // Remove algorithms if not supported by type
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        // These assignments may require type assertion if session.user is not indexable
        (session.user as any).id = token.id;
        (session.user as any).email = token.email;
        (session.user as any).name = token.name;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
