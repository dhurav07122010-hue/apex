import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

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
      c.name.includes("supabase")
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

  revalidatePath("/", "layout");
  return response;
}
