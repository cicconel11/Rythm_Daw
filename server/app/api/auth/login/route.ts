import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

// Helper function to send JSON responses
const jsonResponse = (data: any, status: number) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return jsonResponse(
        { message: 'Email and password are required' }, 
        400
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return jsonResponse(
        { message: 'Invalid credentials' },
        401
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return jsonResponse(
        { message: 'Invalid credentials' },
        401
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    
    return jsonResponse(
      { 
        token,
        user: userWithoutPassword
      },
      200
    );
    
  } catch (error) {
    console.error('Login error:', error);
    return jsonResponse(
      { message: 'Internal server error' },
      500
    );
  }
}
