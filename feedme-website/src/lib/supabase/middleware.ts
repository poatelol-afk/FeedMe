// =================================================================
//  Supabase Middleware Helper -- session refresh + route protection
//
//  DEV MODE: Set DEV_BYPASS_AUTH=true in .env.local to skip all
//  auth redirects during local development without logging in.
//  WARNING: Never set this in production!
// =================================================================
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isDevBypass =
    process.env.NODE_ENV === 'development' && process.env.DEV_BYPASS_AUTH === 'true';

  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname.startsWith('/auth');
  const isProtected = ['/dashboard', '/log', '/workout', '/shop', '/profile'].some(
    p => pathname === p || pathname.startsWith(p + '/'),
  );

  // If Supabase credentials are not provided or dev bypass is enabled in development,
  // allow the request through safely without throwing.
  if (!supabaseUrl || !supabaseKey || isDevBypass) {
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
    await supabase.auth.getUser();

    if (isProtected || isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch (err) {
    console.warn('[Middleware] Supabase check error:', err);
    if (isProtected || isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }
}
