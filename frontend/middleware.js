import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Allow the root route
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Allow static files (images, fonts, etc.) that might not be caught by matcher
  if (pathname.includes('.')) {
     return NextResponse.next();
  }

  // Redirect everything else to homepage
  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: [
    // Apply middleware to all routes except api, _next/static, _next/image, and favicon.ico
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
