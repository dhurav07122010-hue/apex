import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { User } from "@supabase/supabase-js";

export const AUTHORIZED_ADMIN_EMAIL = "dhurav07122010@gmail.com";

export interface AdminValidationResult {
  authorized: boolean;
  error?: string;
  user?: User;
}

/**
 * Server-Side Admin Authorization Guard
 *
 * Strict Security Guarantees:
 * 1. Cryptographically validates session with Supabase Auth Server.
 * 2. Enforces exact email allowlist: dhurav07122010@gmail.com.
 * 3. Enforces Google OAuth only: permanently rejects password/email-only sessions.
 * 4. Validates active allowlist record in Postgres database table.
 * 5. Rejects any client-supplied role or header.
 */
export async function validateAdminSession(): Promise<AdminValidationResult> {
  try {
    const supabase = await createClient();

    // 1. Fetch user from server-side session (cryptographically verified by Supabase)
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

    const email = user.email?.toLowerCase().trim();

    // 2. Exact email allowlist check
    if (email !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      return {
        authorized: false,
        error: `Forbidden: Email '${email}' is not authorized for administrator access.`,
      };
    }

    // 3. Enforce Google OAuth only — permanently reject email/password login
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

    // 4. Server database allowlist verification
    const adminDb = createAdminClient();
    const { data: allowlistEntry, error: dbError } = await adminDb
      .from("admin_allowlist")
      .select("email, is_active")
      .eq("email", AUTHORIZED_ADMIN_EMAIL)
      .eq("is_active", true)
      .single();

    if (dbError || !allowlistEntry) {
      return {
        authorized: false,
        error:
          "Forbidden: Admin email is not registered or is deactivated in server allowlist database.",
      };
    }

    // All server checks passed
    return {
      authorized: true,
      user,
    };
  } catch (err: any) {
    return {
      authorized: false,
      error: `Internal authorization error: ${err.message}`,
    };
  }
}
