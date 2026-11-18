// Automated verification test script for Phase 1 Storefront
const BASE_URL = "http://localhost:3000";

const tests = [
  {
    name: "1. Home Page (/)",
    path: "/",
    expectedStatus: 200,
    checkContent: (text) => text.includes("ApexBooks") && text.includes("Instant Knowledge"),
  },
  {
    name: "2. Storefront Catalogue (/books)",
    path: "/books",
    expectedStatus: 200,
    checkContent: (text) => text.includes("eBook Storefront"),
  },
  {
    name: "3. Book Detail: Full-Stack TypeScript (/books/full-stack-typescript-and-nextjs-mastery)",
    path: "/books/full-stack-typescript-and-nextjs-mastery",
    expectedStatus: 200,
    checkContent: (text) =>
      text.includes("Full-Stack TypeScript") &&
      text.includes("Arjun Venkataraman") &&
      text.includes("Table of Contents"),
  },
  {
    name: "4. Book Detail: Quantitative Aptitude (/books/quantitative-aptitude-and-reasoning-mastery-2026)",
    path: "/books/quantitative-aptitude-and-reasoning-mastery-2026",
    expectedStatus: 200,
    checkContent: (text) =>
      text.includes("Mastering Quantitative Aptitude") &&
      text.includes("Prof. Vikramaditya Sen") &&
      text.includes("Competitive examinations"),
  },
  {
    name: "5. Categories Overview (/categories)",
    path: "/categories",
    expectedStatus: 200,
    checkContent: (text) =>
      text.includes("Education") &&
      text.includes("Technology") &&
      text.includes("Competitive examinations") &&
      text.includes("Fiction"),
  },
  {
    name: "6. Cart Page (/cart)",
    path: "/cart",
    expectedStatus: 200,
    checkContent: (text) => text.includes("Shopping Cart"),
  },
  {
    name: "7. Checkout Flow (/checkout)",
    path: "/checkout",
    expectedStatus: 200,
    checkContent: (text) =>
      text.toLowerCase().includes("checkout") ||
      text.includes("Cart is Empty") ||
      text.includes("No items to checkout"),
  },
  {
    name: "8. Admin Gateway (/admin)",
    path: "/admin",
    expectedStatus: 200,
    checkContent: (text) =>
      text.includes("dhurav07122010@gmail.com") &&
      text.includes("Google OAuth Only"),
  },
  {
    name: "9. Customer Sign In (/auth/signin)",
    path: "/auth/signin",
    expectedStatus: 200,
    checkContent: (text) =>
      text.includes("sign-in") ||
      text.includes("Sign In") ||
      text.includes("Continue with Google"),
  },
  {
    name: "10. Invalid Slug (404 Not Found Handling)",
    path: "/books/non-existent-book-slug-99999",
    expectedStatus: 404,
    checkContent: (text) => text.includes("404") || text.includes("Not Found"),
  },
];

async function runTests() {
  console.log("==================================================");
  console.log("RUNNING AUTOMATED STOREFRONT & ENDPOINT TESTS");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      const res = await fetch(`${BASE_URL}${t.path}`);
      const text = await res.text();
      const statusOk =
        res.status === t.expectedStatus ||
        (t.expectedStatus === 404 && (res.status === 404 || text.includes("404")));
      const contentOk = t.checkContent(text);

      if (statusOk && contentOk) {
        console.log(`PASS [${res.status}]: ${t.name}`);
        passed++;
      } else {
        console.error(`FAIL: ${t.name}`);
        console.error(`   Expected status ${t.expectedStatus}, got ${res.status}`);
        console.error(`   Content match: ${contentOk}`);
        failed++;
      }
    } catch (err) {
      console.error(`ERROR: ${t.name} -> ${err.message}`);
      failed++;
    }
  }

  console.log("==================================================");
  console.log(`TOTAL: ${tests.length} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
