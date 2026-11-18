// Automated verification test script for Phase 5: Checkout & Payments
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import crypto from "crypto";

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
    const key = k.trim();
    const val = v.join("=").trim();
    process.env[key] = val;
  }
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const adminDb = createClient(SUPABASE_URL, SERVICE_KEY);

async function runTests() {
  console.log("==================================================");
  console.log("RUNNING PHASE 5 CHECKOUT & PAYMENT INTEGRITY TESTS");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  // Test 1: Fetch a product from DB to test order creation
  const { data: testProduct, error: pErr } = await adminDb
    .from("products")
    .select("id, title, price, slug")
    .limit(1)
    .single();

  if (!testProduct || pErr) {
    console.error("FAIL [Setup]: Could not find a test product in DB", pErr);
    process.exit(1);
  }
  console.log(`PASS [Setup]: Found test product '${testProduct.title}' (₹${testProduct.price})`);

  // Test 2: Process a Demo Checkout order server-side via processDemoOrder logic
  const testCustomerEmail = `test_customer_${Date.now()}@example.com`;
  const { processDemoOrder } = await import("../src/lib/payments/demo.ts");

  try {
    // 2a. Reject empty items
    const emptyResult = await processDemoOrder({
      customerEmail: testCustomerEmail,
      items: [],
    });
    if (!emptyResult.success && emptyResult.error?.includes("empty")) {
      console.log("PASS [Test 1]: Demo checkout rejected empty cart as expected");
      passed++;
    } else {
      console.error("FAIL [Test 1]: Empty cart was not rejected properly:", emptyResult);
      failed++;
    }

    // 2b. Reject invalid email
    const invalidEmailResult = await processDemoOrder({
      customerEmail: "not-an-email",
      items: [{ id: testProduct.id }],
    });
    if (!invalidEmailResult.success && invalidEmailResult.error?.includes("email")) {
      console.log("PASS [Test 2]: Demo checkout rejected invalid email format");
      passed++;
    } else {
      console.error("FAIL [Test 2]: Invalid email was not rejected properly:", invalidEmailResult);
      failed++;
    }

    // 2c. Successful demo order creation with real DB price verification
    const validResult = await processDemoOrder({
      customerEmail: testCustomerEmail,
      customerName: "Jane Doe",
      items: [{ id: testProduct.id, slug: testProduct.slug }],
    });

    if (validResult.success && validResult.orderId && validResult.totalAmount === Number(testProduct.price)) {
      console.log(`PASS [Test 3]: Demo checkout created order #${validResult.orderNumber} with authoritative DB price ₹${validResult.totalAmount}`);
      passed++;

      // Verify order exists in DB with 'demo' payment method and 'paid' status
      const { data: dbOrder } = await adminDb
        .from("orders")
        .select("*")
        .eq("id", validResult.orderId)
        .single();

      if (dbOrder && dbOrder.payment_method === "demo" && dbOrder.status === "paid") {
        console.log("PASS [Test 4]: Order is recorded in Supabase DB with status 'paid' and isolated 'demo' method");
        passed++;
      } else {
        console.error("FAIL [Test 4]: Order record in DB did not match expected fields:", dbOrder);
        failed++;
      }

      // Verify purchase entitlement was granted to test customer
      const { data: entitlement } = await adminDb
        .from("purchase_entitlements")
        .select("*")
        .eq("customer_email", testCustomerEmail.toLowerCase().trim())
        .eq("product_id", testProduct.id)
        .single();

      if (entitlement && entitlement.is_active === true) {
        console.log("PASS [Test 5]: Purchase entitlement granted to customer in DB with is_active = true");
        passed++;
      } else {
        console.error("FAIL [Test 5]: Purchase entitlement was not found in DB:", entitlement);
        failed++;
      }
    } else {
      console.error("FAIL [Test 3]: Demo checkout failed:", validResult);
      failed++;
    }
  } catch (err) {
    console.error("FAIL in Demo Order tests:", err);
    failed++;
  }

  // Test 6: Razorpay Webhook Signature Verification
  try {
    const { verifyWebhookSignature } = await import("../src/lib/payments/razorpay.ts");

    const testWebhookSecret = "test_webhook_secret_key_12345";
    process.env.RAZORPAY_WEBHOOK_SECRET = testWebhookSecret;

    const sampleRawBody = JSON.stringify({
      entity: "event",
      account_id: "acc_test",
      event: "payment.captured",
      contains: ["payment"],
      payload: { payment: { entity: { id: "pay_test_999", amount: 49900 } } },
    });

    const validHmac = crypto
      .createHmac("sha256", testWebhookSecret)
      .update(sampleRawBody)
      .digest("hex");

    const isValid = verifyWebhookSignature(sampleRawBody, validHmac);
    const isFakeRejected = !verifyWebhookSignature(sampleRawBody, "fake_tampered_signature");

    if (isValid && isFakeRejected) {
      console.log("PASS [Test 6]: Razorpay webhook signature HMAC verification correctly approves genuine and rejects tampered signatures");
      passed++;
    } else {
      console.error("FAIL [Test 6]: Razorpay webhook signature verification failed:", { isValid, isFakeRejected });
      failed++;
    }
  } catch (err) {
    console.error("FAIL in Webhook Signature tests:", err);
    failed++;
  }

  // Test 7: Webhook Idempotency & Deduplication
  try {
    const { processIdempotentWebhookEvent } = await import("../src/lib/payments/razorpay.ts");

    const testEventId = `evt_test_${Date.now()}`;
    const payload = {
      event: "order.paid",
      id: testEventId,
    };

    // First time should process
    const res1 = await processIdempotentWebhookEvent(testEventId, "order.paid", payload);
    // Second time should detect duplicate
    const res2 = await processIdempotentWebhookEvent(testEventId, "order.paid", payload);

    if (res1.processed === true && res2.processed === false && res2.reason?.includes("Duplicate")) {
      console.log("PASS [Test 7]: Webhook event idempotency correctly deduplicated replay attempt");
      passed++;
    } else {
      console.error("FAIL [Test 7]: Webhook idempotency failed:", { res1, res2 });
      failed++;
    }
  } catch (err) {
    console.error("FAIL in Webhook Idempotency test:", err);
    failed++;
  }

  console.log("==================================================");
  console.log(`PHASE 5 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runTests();
