import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to login page
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }
  
  // Check for auth session cookie
  const session = request.cookies.get('auth_session');
  
  // If no valid session, redirect to login
  if (!session || session.value !== 'authenticated') {
    const url = new URL('/admin/login', request.url);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
