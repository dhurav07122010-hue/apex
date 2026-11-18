import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProductListClient } from "./ProductListClient";

export const metadata = {
  title: "Products & eBooks — Admin Portal",
};

export default async function AdminProductsPage() {
  const adminDb = createAdminClient();
  const { data: products } = await adminDb
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return <ProductListClient initialProducts={products || []} />;
}
