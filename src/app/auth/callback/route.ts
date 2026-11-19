import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isAuthorizedAdminEmail } from "@/config/site";

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

      const targetUrl = isAdmin ? `${origin}/admin` : `${origin}${next}`;
      const redirectResponse = NextResponse.redirect(targetUrl);

      // Explicitly set all session cookies on the redirect response
      cookiesToSetArray.forEach(({ name, value, options }) => {
        redirectResponse.cookies.set(name, value, options);
      });

      return redirectResponse;
    }
  }

  // Return to sign in with error message if exchange failed
  return NextResponse.redirect(
    `${origin}/auth/signin?error=Could not authenticate session. Please try again.`
  );
}
