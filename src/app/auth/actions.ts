"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
  if (data.user?.email?.toLowerCase() === "dhurav07122010@gmail.com") {
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
        c.name.includes("supabase")
      ) {
        cookieStore.delete(c.name);
      }
    }
  } catch (err) {
    console.error("Error wiping cookies in signOut action:", err);
  }

  revalidatePath("/", "layout");
  redirect("/auth/signin");
}
