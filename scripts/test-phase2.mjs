// Automated verification test script for Phase 2: Supabase Integration & RLS
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
const ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !ANON_KEY || !SERVICE_KEY) {
  console.error("FAIL: Missing Supabase keys in .env.local");
  process.exit(1);
}

const anonClient = createClient(SUPABASE_URL, ANON_KEY);
const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);

async function runTests() {
  console.log("==================================================");
  console.log("RUNNING PHASE 2 DATABASE & RLS VERIFICATION TESTS");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  // 1. Categories Query
  try {
    const { data, error } = await anonClient.from("categories").select("*");
    if (!error && data && data.length === 10) {
      console.log(`PASS: Categories table verified (${data.length} categories found)`);
      passed++;
    } else {
      console.error(`FAIL: Categories table error:`, error?.message || `Got ${data?.length} rows`);
      failed++;
    }
  } catch (e) {
    console.error(`ERROR in categories test: ${e.message}`);
    failed++;
  }

  // 2. Published Products Query
  try {
    const { data, error } = await anonClient.from("products").select("title, slug, price, format");
    if (!error && data && data.length > 0) {
      console.log(`PASS: Products table verified (${data.length} published products accessible via public RLS)`);
      passed++;
    } else {
      console.error(`FAIL: Products query error:`, error?.message);
      failed++;
    }
  } catch (e) {
    console.error(`ERROR in products test: ${e.message}`);
    failed++;
  }

  // 3. Admin Allowlist RLS Protection (Public Anonymous Access must be BLOCKED)
  try {
    const { data, error } = await anonClient.from("admin_allowlist").select("*");
    if (data && data.length === 0) {
      console.log("PASS: RLS Security verified: Anonymous public cannot read admin_allowlist (0 rows returned)");
      passed++;
    } else if (error) {
      console.log(`PASS: RLS Security verified: Anonymous query rejected with error: ${error.message}`);
      passed++;
    } else {
      console.error(`FAIL: RLS Security violation: Anonymous public was able to read admin_allowlist!`, data);
      failed++;
    }
  } catch (e) {
    console.error(`ERROR in RLS test: ${e.message}`);
    failed++;
  }

  // 4. Admin Allowlist Service Verification (Privileged access finds dhurav07122010@gmail.com)
  try {
    const { data, error } = await adminClient
      .from("admin_allowlist")
      .select("*")
      .eq("email", "dhurav07122010@gmail.com")
      .single();

    if (!error && data && data.email === "dhurav07122010@gmail.com" && data.is_active === true) {
      console.log(`PASS: Admin Allowlist verified: '${data.email}' is actively registered`);
      passed++;
    } else {
      console.error(`FAIL: Admin email allowlist verification failed:`, error?.message);
      failed++;
    }
  } catch (e) {
    console.error(`ERROR in admin allowlist test: ${e.message}`);
    failed++;
  }

  // 5. Site Settings Query
  try {
    const { data, error } = await anonClient.from("site_settings").select("*");
    if (!error && data && data.length >= 3) {
      console.log(`PASS: Site settings verified (${data.length} configuration blocks active)`);
      passed++;
    } else {
      console.error(`FAIL: Site settings query error:`, error?.message);
      failed++;
    }
  } catch (e) {
    console.error(`ERROR in site settings test: ${e.message}`);
    failed++;
  }

  console.log("==================================================");
  console.log(`TOTAL TESTS: 5 | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
