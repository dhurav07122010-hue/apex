// Automated verification test script for Phase 6: Digital Delivery & Vault Security
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
envContent.split("\n").forEach((line) => {
  const [k, ...v] = line.trim().split("=");
  if (k && v.length > 0) {
    process.env[k.trim()] = v.join("=").trim();
  }
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const adminDb = createClient(SUPABASE_URL, SERVICE_KEY);
const anonDb = createClient(SUPABASE_URL, ANON_KEY);

async function runTests() {
  console.log("==================================================");
  console.log("RUNNING PHASE 6 DIGITAL DELIVERY & VAULT TESTS");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  // Setup: Find or create a test product and purchase entitlement
  const { data: product } = await adminDb
    .from("products")
    .select("id, title, storage_path")
    .limit(1)
    .single();

  if (!product) {
    console.error("FAIL [Setup]: No product found");
    process.exit(1);
  }

  // Test 1: Verify direct public access to private 'ebooks' storage is blocked
  try {
    const { data: publicUrlData } = anonDb.storage.from("ebooks").getPublicUrl(product.storage_path || "sample-apexbook.pdf");
    const publicUrl = publicUrlData.publicUrl;

    // Fetch the public URL directly via fetch
    const publicRes = await fetch(publicUrl);
    // Because the bucket is private, Supabase returns 400 or 403 or error JSON
    if (publicRes.status >= 400) {
      console.log(`PASS [Test 1]: Direct public URL access to private bucket 'ebooks' is blocked (HTTP ${publicRes.status})`);
      passed++;
    } else {
      console.error(`FAIL [Test 1]: Private file was accessible publicly via ${publicUrl}`);
      failed++;
    }
  } catch (e) {
    console.log("PASS [Test 1]: Public access failed as expected:", e.message);
    passed++;
  }

  // Create isolated test order & entitlement for testing
  const testCustomerEmail = `audit_customer_${Date.now()}@example.com`;
  const { data: testOrder } = await adminDb
    .from("orders")
    .insert({
      order_number: `DELIVERY-TEST-${Date.now()}`,
      customer_email: testCustomerEmail,
      customer_name: "Delivery Tester",
      total_amount: 499,
      currency: "INR",
      status: "paid",
      payment_method: "demo",
    })
    .select("id")
    .single();

  const { data: entitlement, error: entErr } = await adminDb
    .from("purchase_entitlements")
    .insert({
      customer_email: testCustomerEmail,
      product_id: product.id,
      order_id: testOrder.id,
      is_active: true,
      download_count: 0,
      max_downloads: 3, // Set low quota for testing exhaustion
    })
    .select("id, download_count, max_downloads, customer_email")
    .single();

  if (entErr || !entitlement) {
    console.error("FAIL [Setup]: Could not create test entitlement", entErr);
    process.exit(1);
  }

  const {
    generateSecureDownloadUrl,
    generateDownloadToken,
    verifyDownloadToken,
  } = await import("../src/lib/delivery/vault.ts");

  // Test 2: Unauthorized Download (IDOR prevention)
  try {
    const unauthResult = await generateSecureDownloadUrl(
      entitlement.id,
      { email: "stranger_attacker@evil.com" }, // Non-owner
      { ip: "192.168.1.100", userAgent: "curl/7.68.0" }
    );

    if (!unauthResult.success && unauthResult.status === 403) {
      console.log("PASS [Test 2]: Unauthorized IDOR attempt rejected with HTTP 403 Forbidden");
      passed++;
    } else {
      console.error("FAIL [Test 2]: Unauthorized IDOR attempt was not blocked:", unauthResult);
      failed++;
    }
  } catch (e) {
    console.error("FAIL in Test 2:", e);
    failed++;
  }

  // Test 3: Authorized Download via Verified Email
  try {
    const authResult = await generateSecureDownloadUrl(
      entitlement.id,
      { email: testCustomerEmail },
      { ip: "203.0.113.45", userAgent: "Mozilla/5.0 TestBrowser" }
    );

    if (
      authResult.success &&
      authResult.status === 200 &&
      authResult.downloadUrl?.includes("/storage/v1/object/sign/ebooks/")
    ) {
      console.log("PASS [Test 3]: Authorized customer received short-lived cryptographically signed download URL");
      passed++;

      // Verify audit log was created in public.download_logs
      const { data: logs } = await adminDb
        .from("download_logs")
        .select("*")
        .eq("entitlement_id", entitlement.id);

      if (logs && logs.length === 1 && logs[0].customer_email === testCustomerEmail) {
        console.log("PASS [Test 4]: Tamper-evident download activity logged in 'download_logs' table");
        passed++;
      } else {
        console.error("FAIL [Test 4]: Audit log was not created:", logs);
        failed++;
      }

      // Verify download_count incremented in public.purchase_entitlements
      const { data: updatedEnt } = await adminDb
        .from("purchase_entitlements")
        .select("download_count")
        .eq("id", entitlement.id)
        .single();

      if (updatedEnt && updatedEnt.download_count === 1) {
        console.log("PASS [Test 5]: Entitlement download_count incremented correctly (1/3)");
        passed++;
      } else {
        console.error("FAIL [Test 5]: Download count was not incremented:", updatedEnt);
        failed++;
      }
    } else {
      console.error("FAIL [Test 3]: Authorized download failed:", authResult);
      failed++;
    }
  } catch (e) {
    console.error("FAIL in Test 3:", e);
    failed++;
  }

  // Test 6: Cryptographic Download Token & Tamper Resistance
  try {
    const token = generateDownloadToken(entitlement.id, testCustomerEmail, 24);
    const validCheck = verifyDownloadToken(token);

    // Tampered token test
    const tamperedToken = token.slice(0, -4) + "XXXX";
    const tamperedCheck = verifyDownloadToken(tamperedToken);

    if (validCheck.valid && !tamperedCheck.valid) {
      console.log("PASS [Test 6]: Cryptographic download token verifies authentic signatures and rejects tampered signatures");
      passed++;
    } else {
      console.error("FAIL [Test 6]: Token verification failed:", { validCheck, tamperedCheck });
      failed++;
    }
  } catch (e) {
    console.error("FAIL in Test 6:", e);
    failed++;
  }

  // Test 7: Download Quota Exhaustion & Rate Limiting
  try {
    // Max downloads is 3. We have performed 1. Let's perform 2 more to exhaust quota.
    await generateSecureDownloadUrl(entitlement.id, { email: testCustomerEmail });
    await generateSecureDownloadUrl(entitlement.id, { email: testCustomerEmail });

    // 4th attempt must be rejected with 429
    const overQuotaResult = await generateSecureDownloadUrl(
      entitlement.id,
      { email: testCustomerEmail }
    );

    if (!overQuotaResult.success && overQuotaResult.status === 429) {
      console.log("PASS [Test 7]: Download quota limit enforced; excess downloads rejected with HTTP 429");
      passed++;
    } else {
      console.error("FAIL [Test 7]: Quota limit was not enforced:", overQuotaResult);
      failed++;
    }
  } catch (e) {
    console.error("FAIL in Test 7:", e);
    failed++;
  }

  // Test 8: Revoked / Inactive Entitlement Protection
  try {
    // Deactivate entitlement
    await adminDb
      .from("purchase_entitlements")
      .update({ is_active: false })
      .eq("id", entitlement.id);

    const inactiveResult = await generateSecureDownloadUrl(
      entitlement.id,
      { email: testCustomerEmail }
    );

    if (!inactiveResult.success && inactiveResult.status === 403) {
      console.log("PASS [Test 8]: Revoked or inactive entitlement strictly blocked from digital delivery");
      passed++;
    } else {
      console.error("FAIL [Test 8]: Inactive entitlement was not blocked:", inactiveResult);
      failed++;
    }
  } catch (e) {
    console.error("FAIL in Test 8:", e);
    failed++;
  }

  console.log("==================================================");
  console.log(`PHASE 6 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runTests();
