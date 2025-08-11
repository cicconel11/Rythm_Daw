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
      
      if (step1Data?.value !== 'true') {
        // If step 1 is not completed, redirect to credentials
        return NextResponse.redirect(new URL('/register/credentials', request.url))
      }
    }
  }

  // Dashboard protection - redirect to registration if not completed
  if (pathname === '/dashboard') {
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
  ],
}
