// Automated verification test script for Phase 4: Admin Panel & Storage Vaults
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
const ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const adminDb = createClient(SUPABASE_URL, SERVICE_KEY);
const anonDb = createClient(SUPABASE_URL, ANON_KEY);

async function runTests() {
  console.log("==================================================");
  console.log("RUNNING PHASE 4 ADMIN PANEL & STORAGE VAULT TESTS");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  // Test 1: Verify Private Storage Bucket 'ebooks' exists and is strictly PRIVATE
  try {
    const { data: buckets, error } = await adminDb.storage.listBuckets();
    const ebooksBucket = buckets?.find((b) => b.id === "ebooks");

    if (ebooksBucket && ebooksBucket.public === false) {
      console.log("PASS [Test 1]: Storage vault 'ebooks' exists and is strictly PRIVATE (public = false)");
      passed++;
    } else {
      console.error("FAIL [Test 1]: 'ebooks' bucket verification failed:", ebooksBucket, error);
      failed++;
    }
  } catch (e) {
    console.error(`ERROR in Test 1: ${e.message}`);
    failed++;
  }

  // Test 2: Verify Public Storage Bucket 'covers' exists and is PUBLIC
  try {
    const { data: buckets } = await adminDb.storage.listBuckets();
    const coversBucket = buckets?.find((b) => b.id === "covers");

    if (coversBucket && coversBucket.public === true) {
      console.log("PASS [Test 2]: Public covers storage bucket exists and is PUBLIC (public = true)");
      passed++;
    } else {
      console.error("FAIL [Test 2]: 'covers' bucket verification failed:", coversBucket);
      failed++;
    }
  } catch (e) {
    console.error(`ERROR in Test 2: ${e.message}`);
    failed++;
  }

  // Test 3: Unauthenticated / Anonymous user cannot write to 'products' table directly via Supabase API (RLS)
  try {
    const { data, error } = await anonDb.from("products").insert({
      title: "Malicious Hack Book",
      slug: "malicious-hack-book",
      author: "Attacker",
      category_id: "programming",
      price: 0,
      short_description: "Exploit attempt",
      description: "Exploit attempt",
    });

    if (error) {
      console.log(`PASS [Test 3]: Anonymous direct product creation blocked by RLS: ${error.message}`);
      passed++;
    } else {
      console.error("FAIL [Test 3]: Anonymous user was able to insert a product into database!", data);
      failed++;
    }
  } catch (e) {
    console.error(`ERROR in Test 3: ${e.message}`);
    failed++;
  }

  // Test 4: Unauthenticated / Anonymous user cannot write to 'categories' table directly (RLS)
  try {
    const { data, error } = await anonDb.from("categories").insert({
      id: "fake-cat",
      name: "Fake Category",
      slug: "fake-cat",
    });

    if (error) {
      console.log(`PASS [Test 4]: Anonymous category injection blocked by RLS: ${error.message}`);
      passed++;
    } else {
      console.error("FAIL [Test 4]: Anonymous user was able to inject category!", data);
      failed++;
    }
  } catch (e) {
    console.error(`ERROR in Test 4: ${e.message}`);
    failed++;
  }

  // Test 5: Verify Admin Database querying capabilities for admin dashboard metrics
  try {
    const [{ count: productsCount }, { count: categoriesCount }, { count: allowlistCount }] =
      await Promise.all([
        adminDb.from("products").select("*", { count: "exact", head: true }),
        adminDb.from("categories").select("*", { count: "exact", head: true }),
        adminDb.from("admin_allowlist").select("*", { count: "exact", head: true }),
      ]);

    if (productsCount >= 6 && categoriesCount === 10 && allowlistCount === 1) {
      console.log(
        `PASS [Test 5]: Admin telemetry operational: ${productsCount} books, ${categoriesCount} categories, ${allowlistCount} allowlisted admin`
      );
      passed++;
    } else {
      console.error("FAIL [Test 5]: Metric counts unexpected:", {
        productsCount,
        categoriesCount,
        allowlistCount,
      });
      failed++;
    }
  } catch (e) {
    console.error(`ERROR in Test 5: ${e.message}`);
    failed++;
  }

  console.log("==================================================");
  console.log(`PHASE 4 TOTAL: 5 | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
