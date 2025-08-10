import { NextResponse } from 'next/server';
import { withApiAuth } from '@/app/lib/security';
import { completeRequestSchema } from '@/app/lib/validation';
import store from '@/app/lib/store';
import * as bcrypt from 'bcryptjs';
import { generateCsrfToken } from '@/app/lib/security';

// Rate limit: 10 requests per hour per IP
export const maxDuration = 30; // 30 seconds

export const POST = withApiAuth(async (request: Request) => {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = completeRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { code: 'VALIDATION_ERROR', message: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { token, displayName, password, avatarUrl } = validation.data;
    
    // Find registration by token
    const registration = store.getPendingRegistrationByToken(token);
    
    if (!registration || !registration.email) {
      return NextResponse.json(
        { 
          code: 'INVALID_TOKEN', 
          message: 'Invalid or expired registration token. Please start over.' 
        },
        { status: 400 }
      );
    }

    // Check if user already exists (double-check)
    const existingUser = store.getUserByEmail(registration.email);
    if (existingUser) {
      return NextResponse.json(
        { 
          code: 'DUPLICATE_EMAIL', 
          message: 'An account with this email already exists. Please log in instead.' 
        },
        { status: 409 }
      );
    }

    // Hash the password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create the user
    const user = store.createUser({
      email: registration.email,
      displayName,
      passwordHash,
      avatarUrl: avatarUrl || null,
    });

    // Invalidate the registration token
    store.invalidateToken(token);

    // Generate new CSRF token for the response
    const { token: csrfToken } = generateCsrfToken();
    
    return NextResponse.json(
      { 
        userId: user.id,
        email: user.email,
        displayName: user.displayName,
        csrfToken,
      },
      { 
        status: 201,
        headers: {
          'Set-Cookie': `x-csrf-token=${csrfToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`,
        },
      }
    );
  } catch (error) {
    console.error('Registration completion error:', error);
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}, { requireCsrf: true });

// Add OPTIONS handler for CORS preflight
export const OPTIONS = async () => {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-csrf-token',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
};
