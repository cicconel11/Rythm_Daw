import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';
import { hash } from 'bcryptjs';

// Types
interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  avatar?: string;
  captchaToken: string;
}

// In-memory store for development - replace with your database
const users: any[] = [];

/**
 * Verify reCAPTCHA token with Google's API
 */
async function verifyRecaptcha(token: string): Promise<boolean> {
  if (process.env.NODE_ENV === 'development') return true;
  
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY!,
        response: token,
      }),
    });
    
    const data = await response.json();
    return data.success === true && data.score > 0.5;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
}

/**
 * Validate user input
 */
function validateInput(data: RegisterRequest): { valid: boolean; message?: string } {
  if (!data.email || !data.password || !data.displayName || !data.captchaToken) {
    return { valid: false, message: 'All fields are required' };
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, message: 'Invalid email format' };
  }

  // Password validation
  if (data.password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }

  return { valid: true };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    // Check if user is already authenticated
    const session = await getServerSession(req, res, authOptions);
    if (session) {
      return res.status(400).json({ 
        success: false,
        message: 'Already authenticated' 
      });
    }

    const data = req.body as RegisterRequest;

    // Validate input
    const validation = validateInput(data);
    if (!validation.valid) {
      return res.status(400).json({ 
        success: false,
        message: validation.message 
      });
    }

    // Verify reCAPTCHA
    const isHuman = await verifyRecaptcha(data.captchaToken);
    if (!isHuman) {
      return res.status(400).json({ 
        success: false,
        message: 'reCAPTCHA verification failed' 
      });
    }

    // Check if user already exists
    const userExists = users.some(user => user.email === data.email);
    if (userExists) {
      return res.status(409).json({ 
        success: false,
        message: 'Email already in use' 
      });
    }

    // Hash password
    const hashedPassword = await hash(data.password, 12);

    // Create user (in-memory for this example)
    const user = {
      id: `user_${Date.now()}`,
      email: data.email,
      password: hashedPassword,
      name: data.displayName,
      image: data.avatar,
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // In a real app, save to database:
    // const user = await prisma.user.create({
    //   data: {
    //     email: data.email,
    //     password: hashedPassword,
    //     name: data.displayName,
    //     image: data.avatar,
    //     emailVerified: new Date(),
    //   },
    // });
    
    // For demo purposes, add to in-memory array
    users.push(user);

    // Return success response without sensitive data
    const { password, ...userWithoutPassword } = user;
    
    return res.status(201).json({ 
      success: true,
      message: 'Registration successful',
      user: userWithoutPassword
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle specific error types
    if (error.code === 'P2002') { // Prisma unique constraint violation
      return res.status(409).json({ 
        success: false,
        message: 'Email already in use' 
      });
    }
    
    // Generic error response
    return res.status(500).json({ 
      success: false,
      message: 'An error occurred during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
