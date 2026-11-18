import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProductForm } from "../ProductForm";

export const metadata = {
  title: "Add New eBook — Admin Portal",
};

export default async function NewProductPage() {
  const adminDb = createAdminClient();
  const { data: categories } = await adminDb
    .from("categories")
    .select("id, name, slug")
    .order("display_order", { ascending: true });

  return <ProductForm categories={categories || []} />;
}
