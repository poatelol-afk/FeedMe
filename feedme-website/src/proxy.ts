// ═══════════════════════════════════════════════════════
//  Next.js 16 Proxy — session refresh + route protection
//  (renamed from middleware.ts → proxy.ts in Next.js 16)
// ═══════════════════════════════════════════════════════
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Skip static files and images
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
