import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Always allow these public routes
  if (
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/contact') ||
    pathname.startsWith('/products') ||
    pathname.startsWith('/faq') ||
    pathname.startsWith('/blog') ||
    pathname.startsWith('/api/')
  ) {
    return NextResponse.next();
  }

  // 🔒 Example protected routes (customize to your needs)
  const token = request.cookies.get('token')?.value;

  if (!token && (pathname.startsWith('/admin') || pathname.startsWith('/customer'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
