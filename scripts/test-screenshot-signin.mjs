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
  await page.setViewport({ width: 1280, height: 850 });

  console.log("Navigating to http://localhost:3000/auth/signin...");
  await page.goto("http://localhost:3000/auth/signin", { waitUntil: "networkidle2" });

  const bodyText = await page.evaluate(() => document.body.innerText);
  const containsDhurav = bodyText.includes("dhurav");
  const containsDhuruv = bodyText.includes("dhuruv");

  console.log("Admin email found on page:", { containsDhurav, containsDhuruv });

  const outputPath = path.join(artifactDir, "signin-redacted-clean.png");
  await page.screenshot({ path: outputPath, fullPage: true });
  console.log("Screenshot saved to:", outputPath);

  await browser.close();

  if (containsDhurav || containsDhuruv) {
    console.error("FAIL: Admin email still visible on signin page!");
    process.exit(1);
  } else {
    console.log("SUCCESS: Confirmed zero admin email leakage on signin page!");
  }
}

run().catch((err) => {
  console.error("Error running test:", err);
  process.exit(1);
});
