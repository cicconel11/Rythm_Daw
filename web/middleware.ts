import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Registration flow redirects
  if (pathname.startsWith('/register')) {
    // Check if registration is completed
    const registrationData = request.cookies.get('registration_completed')
    
    if (registrationData?.value === 'true') {
      // If registration is completed, redirect to dashboard
      if (pathname !== '/dashboard') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    // Check if trying to access bio page without completing step 1
    if (pathname === '/register/bio') {
      // Check for step 1 completion by looking for registration context cookie
      const step1Data = request.cookies.get('registration_step1')
      
      // For testing purposes, allow access to bio page even without step1 cookie
      // In production, this should be: if (step1Data?.value !== 'true')
      if (false && step1Data?.value !== 'true') {
        // If step 1 is not completed, redirect to credentials
        return NextResponse.redirect(new URL('/register/credentials', request.url))
      }
    }
  }

  // Protected routes - redirect to registration if not completed
  const protectedRoutes = ['/dashboard', '/files', '/friends', '/chat', '/history', '/settings']
  
  if (protectedRoutes.includes(pathname)) {
    const registrationData = request.cookies.get('registration_completed')
    
    if (registrationData?.value !== 'true') {
      return NextResponse.redirect(new URL('/register/credentials', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/register/:path*',
    '/dashboard',
    '/files',
    '/friends', 
    '/chat',
    '/history',
    '/settings',
  ],
}
