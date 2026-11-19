import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { CategoriesClient } from "./CategoriesClient";

export const metadata = {
  title: "Categories & Genres — Admin Portal",
};

export default async function AdminCategoriesPage() {
  const adminDb = createAdminClient();
  const [{ data: categories }, { data: products }] = await Promise.all([
    adminDb.from("categories").select("*").order("display_order", { ascending: true }),
    adminDb.from("products").select("category_id"),
  ]);

  return (
    <CategoriesClient
      initialCategories={categories || []}
      initialProducts={products || []}
    />
  );
}
