import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect root to login if not authenticated
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow public routes
  if (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};