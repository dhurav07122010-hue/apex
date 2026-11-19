import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_EXPIRES_COOKIE_NAME,
} from "@/lib/auth/adminSession";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return handleSignOut(request);
}

export async function POST(request: NextRequest) {
  return handleSignOut(request);
}

async function handleSignOut(request: NextRequest) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut({ scope: "local" });
  } catch (err) {
    console.error("Supabase signOut error in route handler:", err);
  }

  const cookieStore = await cookies();
  const all = cookieStore.getAll();
  const redirectUrl = new URL("/auth/signin", request.url);
  const response = NextResponse.redirect(redirectUrl);

  for (const c of all) {
    if (
      c.name.startsWith("sb-") ||
      c.name.includes("auth-token") ||
      c.name.includes("supabase") ||
      c.name === ADMIN_SESSION_COOKIE_NAME ||
      c.name === ADMIN_EXPIRES_COOKIE_NAME
    ) {
      try {
        cookieStore.delete(c.name);
      } catch {}
      response.cookies.delete(c.name);
      response.cookies.set(c.name, "", {
        path: "/",
        maxAge: 0,
        expires: new Date(0),
      });
    }
  }

  response.cookies.delete(ADMIN_SESSION_COOKIE_NAME);
  response.cookies.delete(ADMIN_EXPIRES_COOKIE_NAME);
  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  response.cookies.set(ADMIN_EXPIRES_COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  revalidatePath("/", "layout");
  return response;
}
