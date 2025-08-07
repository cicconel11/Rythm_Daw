import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_PATHS = [
  '/landing',
  '/auth',
  '/api/auth',
  '/_next',
  '/static',
  '/favicon.ico',
  '/images',
  '/fonts',
  '/robots.txt',
];

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  // Exclude public and static paths
  if (PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path + '/'))) {
    return NextResponse.next();
  }

  // Protect these routes
  const protectedRoutes = ['/files', '/friends', '/history', '/chat', '/settings'];
  if (protectedRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const nextParam = encodeURIComponent(pathname + (search || ''));
      const nextUrl = `/auth/login?next=${nextParam}`;
      return NextResponse.redirect(new URL(nextUrl, req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/files/:path*',
    '/friends/:path*',
    '/history/:path*',
    '/chat/:path*',
    '/settings/:path*',
    '/dashboard/:path*',
  ],
};
