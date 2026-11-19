"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isAuthorizedAdminEmail } from "@/config/site";

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const returnTo = (formData.get("returnTo") as string) || "/account";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Check if admin
  if (isAuthorizedAdminEmail(data.user?.email)) {
    // Alert that password logins cannot access admin
    return {
      success: true,
      redirectTo: "/account",
      warning:
        "Signed in as customer. Note: Administrator privileges require Google OAuth sign-in.",
    };
  }

  return { success: true, redirectTo: returnTo };
}

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || "",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: true,
    message:
      "Account created! Please check your email inbox to confirm your address.",
  };
}

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_EXPIRES_COOKIE_NAME,
} from "@/lib/auth/adminSession";

export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut({ scope: "local" });
  } catch (err) {
    console.error("Supabase signOut error in server action:", err);
  }

  try {
    const cookieStore = await cookies();
    const all = cookieStore.getAll();
    for (const c of all) {
      if (
        c.name.startsWith("sb-") ||
        c.name.includes("auth-token") ||
        c.name.includes("supabase") ||
        c.name === ADMIN_SESSION_COOKIE_NAME ||
        c.name === ADMIN_EXPIRES_COOKIE_NAME
      ) {
        cookieStore.delete(c.name);
      }
    }
    cookieStore.delete(ADMIN_SESSION_COOKIE_NAME);
    cookieStore.delete(ADMIN_EXPIRES_COOKIE_NAME);
  } catch (err) {
    console.error("Error wiping cookies in signOut action:", err);
  }

  revalidatePath("/", "layout");
  redirect("/auth/signin");
}
