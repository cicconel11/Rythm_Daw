import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { NextAuthOptions, Session, User } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import EmailProvider from 'next-auth/providers/email';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

// Device code store (in production, use Redis or database)
const deviceCodeStore = new Map<string, {
  userCode: string;
  deviceCode: string;
  userId?: string;
  expiresAt: Date;
  scope?: string[];
}>();

// Helper to generate random strings
const generateRandomString = (length: number): string => {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID || '',
      clientSecret: process.env.APPLE_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }): Promise<Session> {
      if (token) {
        session.user.id = token.sub || '';
        session.user.email = token.email || '';
        session.user.name = token.name || '';
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
  },
};

// Initialize NextAuth
export default NextAuth(authOptions);

// Device code endpoints
export async function handleDeviceCodeRequest(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { client_id, scope } = req.body;
    const userCode = generateRandomString(8).toUpperCase();
    const deviceCode = generateRandomString(40);
    
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes expiry

    deviceCodeStore.set(deviceCode, {
      userCode,
      deviceCode,
      expiresAt,
      scope: scope ? scope.split(' ') : [],
    });

    return res.status(200).json({
      device_code: deviceCode,
      user_code: userCode,
      verification_uri: `${process.env.NEXTAUTH_URL}/device`,
      expires_in: 900, // 15 minutes
      interval: 5, // polling interval in seconds
    });
  } catch (error) {
    console.error('Device code request error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function handleDeviceToken(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { device_code, client_id } = req.body;
    
    if (!device_code) {
      return res.status(400).json({ error: 'device_code is required' });
    }

    const deviceData = deviceCodeStore.get(device_code);
    
    if (!deviceData) {
      return res.status(400).json({ error: 'Invalid device code' });
    }

    if (new Date() > deviceData.expiresAt) {
      deviceCodeStore.delete(device_code);
      return res.status(400).json({ error: 'Device code expired' });
    }

    if (!deviceData.userId) {
      return res.status(400).json({ error: 'authorization_pending' });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: deviceData.userId },
    });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Clean up
    deviceCodeStore.delete(device_code);

    // Here you would typically create a proper access token
    // This is a simplified example
    return res.status(200).json({
      access_token: generateRandomString(40),
      token_type: 'bearer',
      expires_in: 3600, // 1 hour
      refresh_token: generateRandomString(40),
    });
  } catch (error) {
    console.error('Device token error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
