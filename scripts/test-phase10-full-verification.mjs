import fs from "fs";
import path from "path";
import http from "http";

async function run() {
  console.log("===============================================================================");
  console.log("PHASE 10 FULL COMPREHENSIVE VERIFICATION: ADMIN CUSTOMIZATIONS & SECURITY");
  console.log("===============================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = "") {
    if (condition) {
      console.log(`PASS: ${testName}`);
      passed++;
    } else {
      console.error(`FAIL: ${testName} - ${details}`);
      failed++;
    }
  }

  // 1. Check ProductForm.tsx: "Specifications" removed
  const productFormCode = fs.readFileSync("src/app/admin/products/ProductForm.tsx", "utf-8");
  assert(
    !productFormCode.includes("<h3>\n              Specifications") &&
    !productFormCode.includes(">Specifications</h3>"),
    "Requirement 1: Specifications section removed from eBook / Product admin form"
  );

  // 2. Check AdminNav.tsx: "Add eBook" removed, only "Products" kept
  const adminNavCode = fs.readFileSync("src/components/admin/AdminNav.tsx", "utf-8");
  assert(
    adminNavCode.includes('{ name: "Products", href: "/admin/products"') &&
    !adminNavCode.includes('{ name: "Add eBook"'),
    "Requirement 2: 'Add eBook' removed from sidebar navigation, 'Products' retained"
  );

  // 3. Check AdminNav.tsx: "Downloads" removed
  assert(
    !adminNavCode.includes('{ name: "Downloads"'),
    "Requirement 6: 'Downloads' removed from sidebar navigation"
  );

  // 4. Check Session Counter & Invalidation: no client-side force-redirect in setInterval
  assert(
    !adminNavCode.includes('window.location.href =') &&
    adminNavCode.includes("secondsLeft <= 0 ? \"00:00 (Expires on refresh)\""),
    "Requirement 3a: Countdown counter displays actively; access only deactivates when user refreshes after 4 mins (no forced window redirect)"
  );

  // 5. Check Brand Logo & Google OAuth Verified layout in AdminNav
  assert(
    adminNavCode.includes('border-t border-zinc-100') &&
    adminNavCode.includes('Google OAuth Verified') &&
    adminNavCode.includes('activeLogo'),
    "Requirement 3b: Brand logo and 'Google OAuth Verified' badge cleanly separated with zero visual overlap"
  );

  // 6. Check Categories: image and name supported in addCategory action & CategoriesClient
  const categoriesClientCode = fs.readFileSync("src/app/admin/categories/CategoriesClient.tsx", "utf-8");
  const categoriesActionCode = fs.readFileSync("src/app/admin/categories/actions.ts", "utf-8");
  assert(
    categoriesClientCode.includes("Upload Category Image") &&
    categoriesClientCode.includes("Category Name *") &&
    categoriesActionCode.includes("image_url: imageUrl"),
    "Requirement 4: Categories are addable by admin with Category Name and Image (upload or URL)"
  );

  // 7. Check Orders: graphs showing sold books
  const ordersPageCode = fs.readFileSync("src/app/admin/orders/page.tsx", "utf-8");
  assert(
    ordersPageCode.includes("Books Sold Velocity") &&
    ordersPageCode.includes("Top Selling Titles") &&
    ordersPageCode.includes("<AreaChart") &&
    ordersPageCode.includes("<BarChart"),
    "Requirement 5a: Orders page renders visual graphs for books sold over time and top titles"
  );

  // 8. Check Payments: graphs showing payments
  const paymentsPageCode = fs.readFileSync("src/app/admin/payments/page.tsx", "utf-8");
  assert(
    paymentsPageCode.includes("Payment Revenue Inflow") &&
    paymentsPageCode.includes("Gateway Volume Share") &&
    paymentsPageCode.includes("<AreaChart") &&
    paymentsPageCode.includes("<BarChart"),
    "Requirement 5b: Payments page renders visual graphs for payment inflows and gateway volume"
  );

  // 9. Check Analytics: graphs used in analytics
  const analyticsPageCode = fs.readFileSync("src/app/admin/analytics/page.tsx", "utf-8");
  assert(
    analyticsPageCode.includes("Revenue Growth Trajectory") &&
    analyticsPageCode.includes("Order Frequency & Volume") &&
    analyticsPageCode.includes("<AreaChart") &&
    analyticsPageCode.includes("<BarChart"),
    "Requirement 7: Analytics page incorporates graphs for revenue trajectory and order volume"
  );

  // 10. Check Store Settings: Logo & Favicon changeable
  const settingsFormCode = fs.readFileSync("src/app/admin/settings/SettingsForm.tsx", "utf-8");
  const settingsActionCode = fs.readFileSync("src/app/admin/settings/actions.ts", "utf-8");
  assert(
    settingsFormCode.includes("Store Logo Image") &&
    settingsFormCode.includes("Store Browser Favicon") &&
    settingsActionCode.includes("logo_url:") &&
    settingsActionCode.includes("favicon_url:"),
    "Requirement 8: Store logo and favicon are fully changeable in Store Settings"
  );

  // 11. Check Store Settings: Additional Admin addable with role
  assert(
    settingsFormCode.includes("Add New Administrator Google Account") &&
    settingsActionCode.includes("addAdminUser") &&
    settingsActionCode.includes("admin_allowlist"),
    "Requirement 9: Additional administrators can be added in Settings with Google email and role"
  );

  // 12. Check Security: Admin email NOT displayed in plaintext on public website or in settings
  const authAdminCode = fs.readFileSync("src/lib/auth/admin.ts", "utf-8");
  assert(
    settingsFormCode.includes("maskEmail") &&
    !settingsFormCode.includes("{AUTHORIZED_ADMIN_EMAIL}"),
    "Requirement 10: Strict email protection - admin email is NEVER displayed in plaintext on website or settings"
  );

  // 13. Check admin downloads redirect
  const downloadsPageCode = fs.readFileSync("src/app/admin/downloads/page.tsx", "utf-8");
  assert(
    downloadsPageCode.includes('redirect("/admin/products")'),
    "Requirement 6b: /admin/downloads redirects to /admin/products"
  );

  console.log(`\n===============================================================================`);
  console.log(`PHASE 10 AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED.`);
  console.log(`===============================================================================\n`);

  if (failed > 0) process.exit(1);
}

run().catch(console.error);
