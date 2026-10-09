// =================================================================
//  Supabase Middleware Helper -- session refresh + route protection
//
//  DEV MODE: Set DEV_BYPASS_AUTH=true in .env.local to skip all
//  auth redirects so you can test every page without logging in.
//  WARNING: Never set this in production!
// =================================================================
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase credentials are not provided or dev bypass is enabled,
  // allow the request through safely without throwing.
  if (!supabaseUrl || !supabaseKey || process.env.DEV_BYPASS_AUTH === 'true') {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // Refresh session -- do NOT remove this
    const { data: { user } } = await supabase.auth.getUser();

    // Protected routes: redirect to login if not authenticated
    // Note: '/' is the public Promotional Showcase Landing Page, so it is NOT protected!
    const { pathname } = request.nextUrl;
    const isAuthRoute = pathname.startsWith('/auth');
    const isProtected = ['/dashboard', '/log', '/workout', '/shop', '/profile'].some(
      p => pathname === p || pathname.startsWith(p + '/'),
    );

    if (!user && isProtected && !isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }

    if (user && isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch (err) {
    console.warn('[Middleware] Supabase auth check error:', err);
    return NextResponse.next({ request });
  }
}
