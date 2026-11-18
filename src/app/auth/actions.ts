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

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/signin");
}
