import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const [k, ...v] = line.trim().split("=");
  if (k && v.length > 0) env[k.trim()] = v.join("=").trim();
});

const adminDb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function runTests() {
  console.log("=== PHASE 9 TEST: Checkout Error Fix & Free Demo eBook ===\n");
  let passed = 0;
  let failed = 0;

  // TEST 1: Verify Free Demo eBook exists in DB and is active
  try {
    const { data: freeBook, error: fErr } = await adminDb
      .from("products")
      .select("*")
      .eq("slug", "apex-free-demo-guide")
      .single();

    if (!fErr && freeBook && Number(freeBook.price) === 0) {
      console.log(`PASS [Test 1]: Free Demo eBook '${freeBook.title}' verified in DB (Price: ₹${freeBook.price}).`);
      passed++;
    } else {
      console.error("FAIL [Test 1]: Free Demo eBook not found in DB or price != 0:", fErr || freeBook);
      failed++;
    }
  } catch (err) {
    console.error("FAIL [Test 1]:", err.message);
    failed++;
  }

  // TEST 2: Verify Atomic Habits exists in DB (the exact book from user screenshot)
  try {
    const { data: atomicBook, error: aErr } = await adminDb
      .from("products")
      .select("*")
      .eq("slug", "atomic-habits")
      .single();

    if (!aErr && atomicBook && Number(atomicBook.price) === 199) {
      console.log(`PASS [Test 2]: Atomic Habits verified in DB with price ₹${atomicBook.price} (id: ${atomicBook.id}).`);
      passed++;
    } else {
      console.error("FAIL [Test 2]: Atomic Habits missing in DB:", aErr || atomicBook);
      failed++;
    }
  } catch (err) {
    console.error("FAIL [Test 2]:", err.message);
    failed++;
  }

  // TEST 3: Test Demo Checkout with Atomic Habits (was previously failing with 'not found in catalogue')
  try {
    const res = await fetch("http://localhost:3000/api/checkout/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerEmail: "reader.test@example.com",
        customerName: "Test Reader",
        items: [{ id: "b101-atomic-habits", slug: "atomic-habits" }],
      }),
    });

    const data = await res.json();
    if (res.ok && data.success && data.orderNumber) {
      console.log(`PASS [Test 3]: Demo checkout for Atomic Habits succeeded! Order #${data.orderNumber}, total: ₹${data.totalAmount}`);
      passed++;
    } else {
      console.error("FAIL [Test 3]: Demo checkout failed:", data);
      failed++;
    }
  } catch (err) {
    console.error("FAIL [Test 3]: Request error:", err.message);
    failed++;
  }

  // TEST 4: Test Claiming the Free Demo eBook (₹0 Checkout)
  try {
    const res = await fetch("http://localhost:3000/api/checkout/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerEmail: "freereader@example.com",
        customerName: "Free Demo User",
        items: [{ id: "b100-free-demo-guide", slug: "apex-free-demo-guide" }],
      }),
    });

    const data = await res.json();
    if (res.ok && data.success && data.totalAmount === 0) {
      console.log(`PASS [Test 4]: Free demo eBook claim checkout succeeded! Order #${data.orderNumber}, total: ₹${data.totalAmount}`);
      passed++;
    } else {
      console.error("FAIL [Test 4]: Free demo claim failed:", data);
      failed++;
    }
  } catch (err) {
    console.error("FAIL [Test 4]: Request error:", err.message);
    failed++;
  }

  // TEST 5: Verify Entitlement Granted for Free Demo User
  try {
    const { data: ent, error: entErr } = await adminDb
      .from("purchase_entitlements")
      .select("*, product:products(title, slug)")
      .eq("customer_email", "freereader@example.com")
      .single();

    if (!entErr && ent && ent.product?.slug === "apex-free-demo-guide" && ent.is_active) {
      console.log(`PASS [Test 5]: Purchase entitlement verified for Free Demo eBook: '${ent.product.title}'.`);
      passed++;
    } else {
      console.error("FAIL [Test 5]: Entitlement missing or inactive:", entErr || ent);
      failed++;
    }
  } catch (err) {
    console.error("FAIL [Test 5]:", err.message);
    failed++;
  }

  console.log(`\nSummary: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTests();
