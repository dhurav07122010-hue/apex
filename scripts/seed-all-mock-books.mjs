import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const [k, ...v] = line.trim().split("=");
  if (k && v.length > 0) env[k.trim()] = v.join("=").trim();
});

const adminDb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Import mock books definitions
const rawMock = fs.readFileSync("./src/data/mock-books.ts", "utf-8");

// Parse books from file
const bookBlocks = rawMock.split(/{\s+id:\s+"b/g).slice(1);

console.log(`Found ${bookBlocks.length} book definitions in mock-books.ts`);

const books = [];

for (const block of bookBlocks) {
  const fullBlock = `{ id: "b` + block;
  
  const getField = (fieldName) => {
    const match = fullBlock.match(new RegExp(`${fieldName}:\\s*"([^"]+)"`));
    return match ? match[1] : "";
  };

  const getNumField = (fieldName, defaultVal = 0) => {
    const match = fullBlock.match(new RegExp(`${fieldName}:\\s*([0-9.]+)`));
    return match ? parseFloat(match[1]) : defaultVal;
  };

  const id = getField("id");
  const slug = getField("slug");
  const title = getField("title");
  const subtitle = getField("subtitle");
  const author = getField("author");
  const author_bio = getField("authorBio");
  let category_id = getField("category") || "other-digital-books";
  const price = getNumField("price", 0);
  const original_price = getNumField("originalPrice", price > 0 ? price * 2 : 299);
  const rating = getNumField("rating", 4.8);
  const review_count = Math.floor(getNumField("reviewCount", 100));
  const published_year = Math.floor(getNumField("publishedYear", 2024));
  const page_count = Math.floor(getNumField("pageCount", 200));
  const file_size = getField("fileSize") || "5 MB";
  const language = getField("language") || "English";
  const format = getField("format") || "PDF";
  const isbn = getField("isbn") || "978-0-00-000000-0";
  const badge = getField("badge") || "";
  const short_description = getField("shortDescription") || title;
  
  // Normalize category_id to valid foreign key in public.categories
  const validCategories = [
    "education",
    "technology",
    "programming",
    "business",
    "finance",
    "self-improvement",
    "fiction",
    "non-fiction",
    "competitive-examinations",
    "other-digital-books",
  ];

  if (!validCategories.includes(category_id)) {
    if (category_id === "fiction-literature") category_id = "fiction";
    else if (category_id === "business-finance") category_id = "business";
    else if (category_id === "education-learning") category_id = "education";
    else if (category_id === "competitive-exams") category_id = "competitive-examinations";
    else category_id = "other-digital-books";
  }

  if (slug && title) {
    books.push({
      slug,
      title,
      subtitle,
      author,
      author_bio,
      category_id,
      price,
      original_price,
      rating,
      review_count,
      published_year,
      page_count,
      file_size,
      language,
      format,
      isbn,
      badge,
      short_description,
      description: short_description,
      storage_path: "sample-apexbook.pdf",
      is_published: true,
      is_featured: badge.toLowerCase().includes("featured") || price === 0,
      is_bestseller: badge.toLowerCase().includes("bestseller"),
    });
  }
}

console.log(`Parsed ${books.length} valid books to upsert.`);

async function seed() {
  let seededCount = 0;
  for (const book of books) {
    const { data, error } = await adminDb
      .from("products")
      .upsert(book, { onConflict: "slug" })
      .select("id, slug, title, price");

    if (error) {
      console.error(`Failed to upsert ${book.slug}:`, error.message);
    } else {
      console.log(`Seeded [${book.slug}]: ₹${book.price} -> ${data[0]?.id}`);
      seededCount++;
    }
  }

  console.log(`\nSuccessfully seeded/upserted ${seededCount} books into Supabase products table!`);
}

seed();
