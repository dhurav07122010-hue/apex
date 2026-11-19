import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const envContent = fs.readFileSync(".env.local", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const [k, ...v] = line.trim().split("=");
  if (k && v.length > 0) env[k.trim()] = v.join("=").trim();
});

const adminDb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data: categories } = await adminDb.from("categories").select("id, slug, name");
  console.log("DB Categories:", categories);
  const { data: products, error: pErr } = await adminDb.from("products").select("id, slug, title, price, category_id");
  console.log("DB Products count:", products?.length, pErr || "");
  console.log(JSON.stringify(products, null, 2));
}

main();
