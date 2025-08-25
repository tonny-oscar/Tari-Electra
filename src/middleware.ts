import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define which routes are public
const publicRoutes = ['/', '/login', '/signup', '/api']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('authToken') // Or however you store auth

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // If user is not authenticated, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
