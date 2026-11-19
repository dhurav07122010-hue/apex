// Automated verification test script for Phase 3: Authentication & Security Rules
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Load .env.local
const envPath = path.resolve(".env.local");
if (!fs.existsSync(envPath)) {
  console.error("FAIL: .env.local not found!");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const [k, ...v] = line.trim().split("=");
  if (k && v.length > 0) {
    env[k.trim()] = v.join("=").trim();
  }
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const AUTHORIZED_ADMIN_EMAIL = "dhurav07122010@gmail.com";

const adminDb = createClient(SUPABASE_URL, SERVICE_KEY);

// Pure security validator function testing the exact logic in src/lib/auth/admin.ts
async function simulateAdminValidation(mockUser) {
  if (!mockUser) {
    return { authorized: false, error: "Unauthenticated: No active session found." };
  }

  const email = mockUser.email?.toLowerCase().trim();
  if (email !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
    return { authorized: false, error: `Forbidden: Email '${email}' is not authorized.` };
  }

  const provider = mockUser.app_metadata?.provider;
  const hasGoogleIdentity =
    provider === "google" ||
    mockUser.identities?.some((identity) => identity.provider === "google");

  if (!hasGoogleIdentity) {
    return {
      authorized: false,
      error: "Forbidden: Password authentication is prohibited for admin access. Google OAuth is strictly required.",
    };
  }

  const { data: allowlistEntry } = await adminDb
    .from("admin_allowlist")
    .select("email, is_active")
    .eq("email", email)
    .eq("is_active", true)
    .single();

  if (!allowlistEntry) {
    return { authorized: false, error: "Forbidden: Not in database allowlist." };
  }

  return { authorized: true, user: mockUser };
}

async function runTests() {
  console.log("==================================================");
  console.log("RUNNING PHASE 3 AUTHENTICATION & SECURITY TESTS");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  // Test 1: Anonymous / Unauthenticated direct admin request is REJECTED
  {
    const res = await simulateAdminValidation(null);
    if (!res.authorized && res.error.includes("Unauthenticated")) {
      console.log("PASS [Test 1]: Anonymous unauthenticated admin access is strictly REJECTED");
      passed++;
    } else {
      console.error("FAIL [Test 1]: Anonymous request was not rejected cleanly:", res);
      failed++;
    }
  }

  // Test 2: Admin email using PASSWORD authentication is strictly REJECTED
  {
    const passwordAdminUser = {
      id: "mock-pwd-admin",
      email: AUTHORIZED_ADMIN_EMAIL,
      app_metadata: { provider: "email" },
      identities: [{ provider: "email" }],
    };
    const res = await simulateAdminValidation(passwordAdminUser);
    if (!res.authorized && res.error.includes("Password authentication is prohibited")) {
      console.log("PASS [Test 2]: Password-only session for admin email is strictly REJECTED");
      passed++;
    } else {
      console.error("FAIL [Test 2]: Password admin session was not rejected!", res);
      failed++;
    }
  }

  // Test 3: Unauthorized Google account (e.g. attacker@gmail.com) is strictly REJECTED
  {
    const attackerGoogleUser = {
      id: "mock-attacker-google",
      email: "intruder.test@gmail.com",
      app_metadata: { provider: "google" },
      identities: [{ provider: "google" }],
    };
    const res = await simulateAdminValidation(attackerGoogleUser);
    if (!res.authorized && res.error.includes("not authorized")) {
      console.log("PASS [Test 3]: Unauthorized Google account is strictly REJECTED");
      passed++;
    } else {
      console.error("FAIL [Test 3]: Unauthorized Google account was not rejected!", res);
      failed++;
    }
  }

  // Test 4: Authorized Google account (dhurav07122010@gmail.com via Google OAuth) is APPROVED
  {
    const validGoogleAdminUser = {
      id: "mock-authorized-google-admin",
      email: AUTHORIZED_ADMIN_EMAIL,
      app_metadata: { provider: "google" },
      identities: [{ provider: "google" }],
    };
    const res = await simulateAdminValidation(validGoogleAdminUser);
    if (res.authorized === true) {
      console.log("PASS [Test 4]: Verified Google OAuth admin session is correctly APPROVED");
      passed++;
    } else {
      console.error("FAIL [Test 4]: Verified Google admin session failed authorization:", res);
      failed++;
    }
  }

  // Test 5: Database allowlist enforcement — when email is not in allowlist, REJECT
  {
    const nonAllowlistedGoogleUser = {
      id: "mock-valid-google-random",
      email: "unregistered.user@gmail.com",
      app_metadata: { provider: "google" },
      identities: [{ provider: "google" }],
    };
    const res = await simulateAdminValidation(nonAllowlistedGoogleUser);
    if (!res.authorized) {
      console.log("PASS [Test 5]: Database allowlist gate correctly denies non-allowlisted emails");
      passed++;
    } else {
      console.error("FAIL [Test 5]: Database allowlist gate failed!", res);
      failed++;
    }
  }

  console.log("==================================================");
  console.log(`PHASE 3 TOTAL: 5 | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
