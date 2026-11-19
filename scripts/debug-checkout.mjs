import { createRequire } from "module";
const require = createRequire("C:/Users/Moni Singh/Documents/websites/ds-studios/package.json");
const puppeteer = require("puppeteer-core");

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function run() {
  const browser = await puppeteer.launch({ executablePath: edgePath, headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.goto("http://localhost:3000/books/atomic-habits", { waitUntil: "networkidle2" });
  await page.evaluate(() => {
    Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("Buy Now")).click();
  });
  await new Promise(r => setTimeout(r, 2000));

  const nameInput = await page.$("input[placeholder*='Rahul']");
  await nameInput.type("Aarav Sharma", { delay: 50 });

  const emailInput = await page.$("input[placeholder*='rahul@']");
  await emailInput.type("aarav.verified@gmail.com", { delay: 50 });

  // Check form values in DOM
  const vals = await page.evaluate(() => {
    const n = document.querySelector("input[placeholder*='Rahul']")?.value;
    const e = document.querySelector("input[placeholder*='rahul@']")?.value;
    return { n, e };
  });
  console.log("DOM input values:", vals);

  // Click submit button directly via mouse click on element
  const payBtn = await page.$("button[type='submit']:not(.absolute)");
  console.log("Pay button text:", await page.evaluate(b => b.innerText, payBtn));
  await payBtn.click();

  // Wait 4 seconds and check what happened
  await new Promise(r => setTimeout(r, 4000));
  const fullText = await page.evaluate(() => document.body.innerText);
  console.log("FULL PAGE TEXT AFTER 4 SECONDS:\n-------------------");
  console.log(fullText);
  console.log("-------------------");
  await browser.close();
}
run();
