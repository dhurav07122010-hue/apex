import { MOCK_BOOKS } from "../src/data/mock-books.ts";
import { filterBooksRelative, matchBookRelative } from "../src/lib/search.ts";

console.log("==================================================");
console.log("TESTING RELATIVE SEARCH & AUTOCOMPLETE MATCHING");
console.log("==================================================");

let passed = 0;
let failed = 0;

// Test 1: Single letter 'm' returns books containing 'm'
const mResults = filterBooksRelative(MOCK_BOOKS, "m");
if (mResults.length > 0 && mResults.every(b => (b.title + b.author + b.shortDescription).toLowerCase().includes("m"))) {
  console.log(`PASS [Test 1]: Query 'm' relative search matched ${mResults.length} books containing 'm'`);
  passed++;
} else {
  console.error("FAIL [Test 1]: Query 'm' failed:", mResults.length);
  failed++;
}

// Test 2: Query 'html' returns '5 HTML Ways'
const htmlResults = filterBooksRelative(MOCK_BOOKS, "html");
const has5HtmlWays = htmlResults.some(b => b.title.includes("5 HTML Ways"));
if (has5HtmlWays) {
  console.log(`PASS [Test 2]: Query 'html' relative search matched '${htmlResults[0].title}'`);
  passed++;
} else {
  console.error("FAIL [Test 2]: Query 'html' did not match 5 HTML Ways:", htmlResults);
  failed++;
}

// Test 3: Query 'html, 5 html ways' (comma separated relative multi-word)
const multiResults = filterBooksRelative(MOCK_BOOKS, "html, 5 html ways");
if (multiResults.length > 0 && multiResults[0].title.includes("5 HTML Ways")) {
  console.log(`PASS [Test 3]: Query 'html, 5 html ways' ranked '${multiResults[0].title}' as #1 match`);
  passed++;
} else {
  console.error("FAIL [Test 3]: Query 'html, 5 html ways' failed:", multiResults);
  failed++;
}

// Test 4: Query '5 html ways'
const exactResults = filterBooksRelative(MOCK_BOOKS, "5 html ways");
if (exactResults.length > 0 && exactResults[0].title.includes("5 HTML Ways")) {
  console.log(`PASS [Test 4]: Query '5 html ways' returned '${exactResults[0].title}'`);
  passed++;
} else {
  console.error("FAIL [Test 4]: Query '5 html ways' failed:", exactResults);
  failed++;
}

// Test 5: Query 'next production' (relative keywords)
const nextResults = filterBooksRelative(MOCK_BOOKS, "next production");
if (nextResults.length > 0 && nextResults[0].title.includes("Next.js")) {
  console.log(`PASS [Test 5]: Relative query 'next production' matched '${nextResults[0].title}'`);
  passed++;
} else {
  console.error("FAIL [Test 5]: Query 'next production' failed:", nextResults);
  failed++;
}

console.log("==================================================");
console.log(`SEARCH TESTS SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================");

if (failed > 0) process.exit(1);
