import { NextResponse } from 'next/server';
import { withApiAuth } from '@/app/lib/security';
import { initRequestSchema } from '@/app/lib/validation';
import store from '@/app/lib/store';
import { generateCsrfToken } from '@/app/lib/security';

// Rate limit: 10 requests per hour per IP
export const maxDuration = 30; // 30 seconds

export const POST = withApiAuth(async (request: Request) => {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = initRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { code: 'VALIDATION_ERROR', message: 'Invalid email format' },
        { status: 400 }
      );
    }

    const { email } = validation.data;
    
    // Check if user already exists
    const existingUser = store.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { 
          code: 'DUPLICATE_EMAIL', 
          message: 'An account with this email already exists. Please log in instead.' 
        },
        { status: 409 }
      );
    }

    // Create pending registration
    const registration = store.createPendingRegistration(email);
    
    // In a real app, you would send an email with the verification code here
    console.log(`Verification code for ${email}: ${registration.code}`);
    
    // Generate new CSRF token for the response
    const { token: csrfToken } = generateCsrfToken();
    
    return NextResponse.json(
      { 
        requestId: registration.id,
        csrfToken,
      },
      { 
        status: 200,
        headers: {
          'Set-Cookie': `x-csrf-token=${csrfToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`,
        },
      }
    );
  } catch (error) {
    console.error('Registration init error:', error);
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}, { requireCsrf: true });

// Add OPTIONS handler for CORS preflight
// This is important for API routes that are called from the client-side
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
