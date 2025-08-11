import NextAuth, { type NextAuthOptions, type User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { compare } from 'bcryptjs';

// Types
type Credentials = {
  email: string;
  password: string;
};

type UserSession = User & {
  id: string;
  email: string;
  name: string;
  image?: string;
};

// Mock user database - Replace with your actual database calls
const users: UserSession[] = [
  // Development/test user
  {
    id: '1',
    email: process.env.E2E_CREDENTIALS_EMAIL || 'test@example.com',
    name: 'Test User',
    password: process.env.E2E_CREDENTIALS_PASSWORD ? 
      await hash(process.env.E2E_CREDENTIALS_PASSWORD, 12) : 
      await hash('password', 12),
  },
];

async function hash(password: string, saltRounds: number): Promise<string> {
  const { hash } = await import('bcryptjs');
  return hash(password, saltRounds);
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const { compare } = await import('bcryptjs');
  return compare(password, hashedPassword);
}

export const authOptions: NextAuthOptions = {
  // Enable debug logs in development
  debug: process.env.NODE_ENV === 'development',
  
  // Configure authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        // In production, replace this with a database query
        const user = users.find((u) => u.email === credentials.email);
        
        if (!user) {
          throw new Error('Invalid email or password');
        }

        // Verify password
        const isValid = await verifyPassword(credentials.password, user.password);
        
        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        // Return user object without password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
  
  // Session configuration
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 60, // 30 minutes
  },
  
  // Callbacks
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      
      // Handle OAuth providers
      if (account?.provider === 'google') {
        // You can add custom logic here for Google OAuth users
      }
      
      if (account?.provider === 'apple') {
        // You can add custom logic here for Apple OAuth users
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string | undefined;
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
