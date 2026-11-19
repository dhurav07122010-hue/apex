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
  
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("button")).map((b, i) => ({
      index: i,
      type: b.type,
      text: b.innerText,
      className: b.className,
    }));
  });
  console.log("Buttons on checkout page:", buttons);
  await browser.close();
}
run();
