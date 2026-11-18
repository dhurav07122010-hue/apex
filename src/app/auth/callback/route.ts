import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/account";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user is the designated admin
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && user.email?.toLowerCase() === "dhurav07122010@gmail.com") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Return to signin with error message
  return NextResponse.redirect(
    new URL("/auth/signin?error=Could not authenticate with Google", request.url)
  );
}
