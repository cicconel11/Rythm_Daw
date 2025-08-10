import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import LRUCache from 'lru-cache';

// CSRF Token Management
const CSRF_TOKEN_NAME = 'x-csrf-token';
const CSRF_SECRET = process.env.CSRF_SECRET || 'default-secret-change-me';
const CSRF_MAX_AGE = 60 * 60 * 24; // 24 hours

export function generateCsrfToken(): { token: string; cookie: string } {
  const token = randomBytes(32).toString('hex');
  const cookie = `${CSRF_TOKEN_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${CSRF_MAX_AGE}`;
  return { token, cookie };
}

export function validateCsrfToken(request: NextRequest): boolean {
  const cookieToken = request.cookies.get(CSRF_TOKEN_NAME)?.value;
  const headerToken = request.headers.get('x-csrf-token');
  
  if (!cookieToken || !headerToken) {
    return false;
  }
  
  return cookieToken === headerToken;
}

// Rate Limiting
interface RateLimitOptions {
  uniqueTokenPerInterval?: number;
  interval?: number;
}

const rateLimit = (options?: RateLimitOptions) => {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (limit: number, token: string) => {
      const tokenCount = (tokenCache.get(token) as number[]) || [0];
      if (tokenCount[0] === 0) {
        tokenCache.set(token, [1]);
      } else {
        tokenCount[0] += 1;
        tokenCache.set(token, tokenCount);
      }
      const currentUsage = tokenCount[0];
      const isRateLimited = currentUsage >= limit;
      return {
        isRateLimited,
        limit,
        remaining: isRateLimited ? 0 : limit - currentUsage,
      };
    },
  };
};

// Rate limiters for different endpoints
const limiter = {
  init: rateLimit({
    uniqueTokenPerInterval: 1000, // Max users per interval
    interval: 60 * 60 * 1000, // 1 hour
  }),
  verify: rateLimit({
    uniqueTokenPerInterval: 1000,
    interval: 15 * 60 * 1000, // 15 minutes
  }),
};

export async function applyRateLimit(
  request: NextRequest,
  endpoint: keyof typeof limiter,
  identifier: string
) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const key = `${endpoint}:${ip}:${identifier}`;
  
  const limit = endpoint === 'init' ? 10 : 5; // 10 requests/hour for init, 5/15min for verify
  
  const { isRateLimited, limit: requestLimit, remaining } = 
    limiter[endpoint].check(limit, key);
  
  const response = isRateLimited
    ? new NextResponse(
        JSON.stringify({
          code: 'RATE_LIMITED',
          message: 'Too many requests, please try again later',
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    : null;

  if (response) {
    response.headers.set('X-RateLimit-Limit', requestLimit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', '60'); // 1 minute
  }

  return { isRateLimited, response };
}

// Middleware for protected API routes
export async function withApiAuth(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options?: { requireCsrf?: boolean }
) {
  return async function (request: NextRequest) {
    // CSRF protection for non-GET requests
    if (options?.requireCsrf !== false && request.method !== 'GET') {
      const csrfValid = validateCsrfToken(request);
      if (!csrfValid) {
        return new NextResponse(
          JSON.stringify({ code: 'INVALID_CSRF_TOKEN', message: 'Invalid CSRF token' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    return handler(request);
  };
}

// Utility to set CSRF cookie in API responses
export function setCsrfCookie() {
  const { token, cookie } = generateCsrfToken();
  
  // Using Next.js 13+ cookies API
  const response = new NextResponse();
  response.cookies.set({
    name: CSRF_TOKEN_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: CSRF_MAX_AGE,
    path: '/',
  });
  
  return { token, response };
}
