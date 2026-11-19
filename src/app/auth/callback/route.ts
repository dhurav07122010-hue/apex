import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isAuthorizedAdminEmail } from "@/config/site";
import {
  createAdminSession,
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_EXPIRES_COOKIE_NAME,
  ADMIN_SESSION_TTL_SECONDS,
} from "@/lib/auth/adminSession";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const cookieStore = await cookies();
    const cookiesToSetArray: { name: string; value: string; options: any }[] = [];

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
              cookiesToSetArray.push({ name, value, options });
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const user = data.user;
      const isAdmin = isAuthorizedAdminEmail(user.email);

      // Determine target destination strictly based on authorization
      let targetUrl: string;
      if (isAdmin) {
        // Admin login -> directly to admin dashboard
        targetUrl = `${origin}/admin`;
      } else {
        // Normal customer -> if destination requested was /admin, divert to /account
        const safeNext = next.startsWith("/admin") ? "/account" : next;
        targetUrl = `${origin}${safeNext}`;
      }

      const redirectResponse = NextResponse.redirect(targetUrl);

      // Explicitly set all Supabase session cookies
      cookiesToSetArray.forEach(({ name, value, options }) => {
        redirectResponse.cookies.set(name, value, options);
      });

      if (isAdmin && user.email) {
        // Issue strict 240-second (4-minute) admin session
        const sessionData = await createAdminSession(user.email);

        redirectResponse.cookies.set(
          ADMIN_SESSION_COOKIE_NAME,
          sessionData.token,
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: ADMIN_SESSION_TTL_SECONDS,
            path: "/",
          }
        );

        redirectResponse.cookies.set(
          ADMIN_EXPIRES_COOKIE_NAME,
          sessionData.expiresAt.toString(),
          {
            httpOnly: false, // Accessible to client timer for live countdown
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: ADMIN_SESSION_TTL_SECONDS,
            path: "/",
          }
        );
      } else {
        // Normal customer: ensure any stale admin cookies are scrubbed
        redirectResponse.cookies.delete(ADMIN_SESSION_COOKIE_NAME);
        redirectResponse.cookies.delete(ADMIN_EXPIRES_COOKIE_NAME);
      }

      return redirectResponse;
    }
  }

  // Return to sign in with error message if exchange failed
  return NextResponse.redirect(
    `${origin}/auth/signin?error=Could not authenticate session. Please try again.`
  );
}
