import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";
import { User } from "@supabase/supabase-js";
import { AUTHORIZED_ADMIN_EMAIL, AUTHORIZED_ADMIN_EMAILS, isAuthorizedAdminEmail } from "@/config/site";
import {
  verifyAdminSession,
  ADMIN_SESSION_COOKIE_NAME,
} from "./adminSession";

export { AUTHORIZED_ADMIN_EMAIL, AUTHORIZED_ADMIN_EMAILS, isAuthorizedAdminEmail };

export interface AdminValidationResult {
  authorized: boolean;
  error?: string;
  user?: User;
  remainingMs?: number;
}

/**
 * Server-Side Admin Authorization Guard
 *
 * Strict Security Guarantees:
 * 1. Cryptographically validates session with Supabase Auth Server.
 * 2. Enforces exact email allowlist.
 * 3. Enforces Google OAuth only: permanently rejects password/email-only sessions.
 * 4. Validates active allowlist record in Postgres database table.
 * 5. Enforces 240-second (4-minute) strict session TTL.
 */
export async function validateAdminUser(
  user: Partial<User> | null
): Promise<AdminValidationResult> {
  if (!user) {
    return {
      authorized: false,
      error: "Unauthenticated: No active session found.",
    };
  }

  const email = user.email?.toLowerCase().trim();

  // 1. Exact email allowlist check
  if (!isAuthorizedAdminEmail(email)) {
    return {
      authorized: false,
      error: "Forbidden: This account is not authorized for administrator access.",
    };
  }

  // 2. Enforce Google OAuth only — permanently reject email/password login
  const provider = user.app_metadata?.provider;
  const hasGoogleIdentity =
    provider === "google" ||
    user.identities?.some((identity) => identity.provider === "google");

  if (!hasGoogleIdentity) {
    return {
      authorized: false,
      error:
        "Forbidden: Password authentication is prohibited for admin access. Google OAuth is strictly required.",
    };
  }

  // 3. Server database allowlist verification
  const adminDb = createAdminClient();
  const { data: allowlistEntry, error: dbError } = await adminDb
    .from("admin_allowlist")
    .select("email, is_active")
    .eq("email", email!)
    .eq("is_active", true)
    .maybeSingle();

  if (dbError || !allowlistEntry) {
    return {
      authorized: false,
      error: "Forbidden: Administrator privileges are inactive or not registered in the database allowlist.",
    };
  }

  // All server checks passed
  return {
    authorized: true,
    user: user as User,
  };
}

export async function validateAdminSession(): Promise<AdminValidationResult> {
  try {
    // 1. Check strict 240s session token
    let sessionToken: string | undefined;
    try {
      const cookieStore = await cookies();
      sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
    } catch {
      // Cookies may be unavailable in some mock contexts
    }

    const sessionCheck = await verifyAdminSession(sessionToken);
    if (!sessionCheck.valid) {
      return {
        authorized: false,
        error:
          sessionCheck.error ||
          "Admin session expired (4-minute security window). Please sign in again.",
      };
    }

    // 2. Fetch user from server-side session (cryptographically verified by Supabase)
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        authorized: false,
        error: "Unauthenticated: No active session found.",
      };
    }

    const userValidation = await validateAdminUser(user);
    if (!userValidation.authorized) {
      return userValidation;
    }

    return {
      ...userValidation,
      remainingMs: sessionCheck.remainingMs,
    };
  } catch (err: any) {
    return {
      authorized: false,
      error: `Internal authorization error: ${err.message}`,
    };
  }
}
