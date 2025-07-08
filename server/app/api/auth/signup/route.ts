import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

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

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return jsonResponse(
        { message: 'Email and password are required' }, 
        400
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return jsonResponse(
        { message: 'User already exists' },
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await prisma.user.create({
      data: { 
        email,
        name: name || email.split('@')[0], // Use email prefix as name if not provided
        password: hashedPassword,
        isApproved: true
      },
      select: { 
        id: true, 
        email: true,
        name: true
      }
    });

    return jsonResponse(user, 201);
  } catch (error) {
    console.error('Signup error:', error);
    return jsonResponse(
      { message: 'Internal server error' },
      500
    );
  }
}
