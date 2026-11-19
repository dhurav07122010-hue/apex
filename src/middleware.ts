import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  verifyAdminSession,
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_EXPIRES_COOKIE_NAME,
} from "@/lib/auth/adminSession";
import { isAuthorizedAdminEmail } from "@/config/site";

export async function middleware(request: NextRequest) {
  // Check if any supabase auth cookie exists
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some((c) =>
    c.name.startsWith("sb-") && (c.name.includes("-auth-token") || c.name.includes("token"))
  );

  const pathname = request.nextUrl.pathname;
  const isProtectedPath =
    pathname.startsWith("/account") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout");

  // Strict Protection for /admin: Unauthenticated users are immediately redirected to signin
  if (pathname.startsWith("/admin") && !hasAuthCookie) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("redirect", "/admin");
    return NextResponse.redirect(signInUrl);
  }

  // Fast-path: If visitor has no auth session and is on public routes,
  // bypass Supabase network roundtrip completely for instant TTFB.
  if (!hasAuthCookie && !isProtectedPath) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // If accessing /admin, enforce both 240s session TTL and authorized admin identity
  if (pathname.startsWith("/admin")) {
    // 1. Strict 240-second Ephemeral Session Verification
    const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
    const sessionCheck = await verifyAdminSession(sessionToken);

    if (!sessionCheck.valid) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("redirect", "/admin");
      signInUrl.searchParams.set(
        "error",
        "Admin session expired (4-minute security window). Please sign in again."
      );
      const redirectResponse = NextResponse.redirect(signInUrl);
      redirectResponse.cookies.delete(ADMIN_SESSION_COOKIE_NAME);
      redirectResponse.cookies.delete(ADMIN_EXPIRES_COOKIE_NAME);
      return redirectResponse;
    }

    // 2. Cryptographic Supabase User Verification
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userEmail = user?.email?.toLowerCase().trim();
    if (!user || !userEmail || !isAuthorizedAdminEmail(userEmail)) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("redirect", "/admin");
      signInUrl.searchParams.set(
        "error",
        "Admin access requires signing in with an authorized administrator account."
      );
      const redirectResponse = NextResponse.redirect(signInUrl);
      redirectResponse.cookies.delete(ADMIN_SESSION_COOKIE_NAME);
      redirectResponse.cookies.delete(ADMIN_EXPIRES_COOKIE_NAME);
      return redirectResponse;
    }
  } else if (hasAuthCookie || isProtectedPath) {
    await supabase.auth.getUser();
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public image assets (png, jpg, jpeg, svg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
