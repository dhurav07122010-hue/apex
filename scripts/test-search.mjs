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

// Test 2: Query 'atomic' returns 'Atomic Habits'
const atomicResults = filterBooksRelative(MOCK_BOOKS, "atomic");
const hasAtomicHabits = atomicResults.some(b => b.title.includes("Atomic Habits"));
if (hasAtomicHabits) {
  console.log(`PASS [Test 2]: Query 'atomic' relative search matched '${atomicResults[0].title}'`);
  passed++;
} else {
  console.error("FAIL [Test 2]: Query 'atomic' did not match Atomic Habits:", atomicResults);
  failed++;
}

// Test 3: Query 'habits, atomic habits' (comma separated relative multi-word)
const multiResults = filterBooksRelative(MOCK_BOOKS, "habits, atomic habits");
if (multiResults.length > 0 && multiResults[0].title.includes("Atomic Habits")) {
  console.log(`PASS [Test 3]: Query 'habits, atomic habits' ranked '${multiResults[0].title}' as #1 match`);
  passed++;
} else {
  console.error("FAIL [Test 3]: Query 'habits, atomic habits' failed:", multiResults);
  failed++;
}

// Test 4: Query 'psychology of money'
const exactResults = filterBooksRelative(MOCK_BOOKS, "psychology of money");
if (exactResults.length > 0 && exactResults[0].title.includes("The Psychology of Money")) {
  console.log(`PASS [Test 4]: Query 'psychology of money' returned '${exactResults[0].title}'`);
  passed++;
} else {
  console.error("FAIL [Test 4]: Query 'psychology of money' failed:", exactResults);
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
