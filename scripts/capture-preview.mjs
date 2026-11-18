import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';

const require = createRequire('C:/Users/Moni Singh/Documents/websites/ds-studios/package.json');
const puppeteer = require('puppeteer-core');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Moni Singh\\.gemini\\antigravity\\brain\\5c500d14-4045-4c8b-b6a0-e468e9017651';

if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

const pagesToCapture = [
  {
    name: 'homepage',
    url: 'http://localhost:3000/',
    output: path.join(artifactDir, 'homepage.png'),
  },
  {
    name: 'storefront',
    url: 'http://localhost:3000/books',
    output: path.join(artifactDir, 'storefront.png'),
  },
  {
    name: 'book-detail',
    url: 'http://localhost:3000/books/full-stack-typescript-and-nextjs-mastery',
    output: path.join(artifactDir, 'book-detail.png'),
  },
  {
    name: 'cart',
    url: 'http://localhost:3000/cart',
    output: path.join(artifactDir, 'cart.png'),
  },
];

async function run() {
  console.log('Launching Edge for live website capture...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1 });

  for (const item of pagesToCapture) {
    console.log(`Capturing ${item.name} from ${item.url}...`);
    await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({ path: item.output, fullPage: false });
    console.log(`Saved screenshot to ${item.output}`);
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch((err) => {
  console.error('Screenshot error:', err);
  process.exit(1);
});
