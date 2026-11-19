import { createRequire } from "module";
import path from "path";
import fs from "fs";

const require = createRequire("C:/Users/Moni Singh/Documents/websites/ds-studios/package.json");
const puppeteer = require("puppeteer-core");

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const artifactDir = "C:\\Users\\Moni Singh\\.gemini\\antigravity\\brain\\786d7a2a-3977-46cd-90d8-e38ae5f18edc\\screenshots";

if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // ---------------------------------------------------------------
  // FLOW 1: Regular Book (Atomic Habits ₹199) Checkout
  // ---------------------------------------------------------------
  console.log("=== FLOW 1: Testing Atomic Habits ₹199 Checkout ===");
  await page.goto("http://localhost:3000/books/atomic-habits", { waitUntil: "networkidle2" });
  await page.evaluate(() => {
    Array.from(document.querySelectorAll("button")).find((b) => b.innerText.includes("Buy Now")).click();
  });
  await new Promise((r) => setTimeout(r, 2000));

  const nameInput = await page.$("input[placeholder*='Rahul']");
  await nameInput.type("Aarav Sharma", { delay: 30 });

  const emailInput = await page.$("input[placeholder*='rahul@']");
  await emailInput.type("aarav.verified@gmail.com", { delay: 30 });

  const payBtn = await page.$("button[type='submit']:not(.absolute)");
  console.log("Submitting order with button:", await page.evaluate((b) => b.innerText, payBtn));
  await payBtn.click();

  await new Promise((r) => setTimeout(r, 3500));
  const pageText1 = await page.evaluate(() => document.body.innerText);
  const isConfirmed1 = pageText1.includes("Order Confirmed!");
  console.log("Atomic Habits order confirmed?", isConfirmed1);

  const screenshot1 = path.join(artifactDir, "checkout-atomic-habits-confirmed.png");
  await page.screenshot({ path: screenshot1, fullPage: true });
  console.log("Saved Flow 1 screenshot:", screenshot1);

  // ---------------------------------------------------------------
  // FLOW 2: Free Demo eBook (₹0 Checkout)
  // ---------------------------------------------------------------
  console.log("\n=== FLOW 2: Testing Free Demo eBook (₹0) Checkout ===");
  await page.goto("http://localhost:3000/books/apex-free-demo-guide", { waitUntil: "networkidle2" });

  const freeDemoDetailScreenshot = path.join(artifactDir, "free-demo-ebook-detail.png");
  await page.screenshot({ path: freeDemoDetailScreenshot, fullPage: true });
  console.log("Saved Free Demo eBook detail screenshot:", freeDemoDetailScreenshot);

  await page.evaluate(() => {
    Array.from(document.querySelectorAll("button")).find((b) => b.innerText.includes("Get Free Demo")).click();
  });
  await new Promise((r) => setTimeout(r, 2000));

  const nameInput2 = await page.$("input[placeholder*='Rahul']");
  if (nameInput2) await nameInput2.type("Priya Patel", { delay: 30 });

  const emailInput2 = await page.$("input[placeholder*='rahul@']");
  if (emailInput2) await emailInput2.type("priya.patel@gmail.com", { delay: 30 });

  const freeClaimBtn = await page.$("button[type='submit']:not(.absolute)");
  console.log("Free claim button text:", await page.evaluate((b) => b.innerText, freeClaimBtn));
  await freeClaimBtn.click();

  await new Promise((r) => setTimeout(r, 3500));
  const pageText2 = await page.evaluate(() => document.body.innerText);
  const isConfirmed2 = pageText2.includes("Order Confirmed!");
  console.log("Free Demo claim order confirmed?", isConfirmed2);

  const screenshot2 = path.join(artifactDir, "checkout-free-demo-confirmed.png");
  await page.screenshot({ path: screenshot2, fullPage: true });
  console.log("Saved Flow 2 screenshot:", screenshot2);

  await browser.close();

  if (isConfirmed1 && isConfirmed2) {
    console.log("\nSUCCESS: All checkout flows verified end-to-end with zero errors!");
  } else {
    console.error("FAIL: One or more checkout flows failed confirmation.");
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("E2E Test Error:", err);
  process.exit(1);
});
