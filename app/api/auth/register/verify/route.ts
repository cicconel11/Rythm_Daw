import { NextResponse } from 'next/server';
import { withApiAuth } from '@/app/lib/security';
import { verifyRequestSchema } from '@/app/lib/validation';
import store from '@/app/lib/store';
import { generateCsrfToken } from '@/app/lib/security';

// Rate limit: 5 attempts per 15 minutes per email+IP
export const maxDuration = 30; // 30 seconds

export const POST = withApiAuth(async (request: Request) => {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = verifyRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { code: 'VALIDATION_ERROR', message: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { email, requestId, code } = validation.data;
    
    // Verify the code
    const { valid, registration } = store.verifyPendingRegistration(email, code);
    
    if (!valid || !registration) {
      return NextResponse.json(
        { 
          code: 'INVALID_CODE', 
          message: 'Invalid or expired verification code. Please try again.' 
        },
        { status: 400 }
      );
    }

    if (registration.id !== requestId) {
      return NextResponse.json(
        { code: 'INVALID_REQUEST', message: 'Invalid registration request' },
        { status: 400 }
      );
    }

    if (!registration.token || !registration.tokenExpiresAt) {
      return NextResponse.json(
        { code: 'TOKEN_GENERATION_FAILED', message: 'Failed to generate verification token' },
        { status: 500 }
      );
    }

    // Generate new CSRF token for the response
    const { token: csrfToken } = generateCsrfToken();
    
    return NextResponse.json(
      { 
        token: registration.token,
        expiresAt: registration.tokenExpiresAt.toISOString(),
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
    console.error('Verification error:', error);
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
