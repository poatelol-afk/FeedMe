// ═══════════════════════════════════════════════════════
//  Next.js 16 Proxy — promotional showcase redirector
// ═══════════════════════════════════════════════════════
import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const legacyPrefixes = ['/dashboard', '/log', '/profile', '/shop', '/workout', '/auth', '/api'];
  if (legacyPrefixes.some((p) => pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip static files and images
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
