import React from "react";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProductForm } from "../../ProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit eBook — Admin Portal",
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const adminDb = createAdminClient();

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const productQuery = isUuid
    ? adminDb.from("products").select("*").eq("id", id).single()
    : adminDb.from("products").select("*").eq("slug", id).single();

  const [{ data: product }, { data: categories }] = await Promise.all([
    productQuery,
    adminDb.from("categories").select("id, name, slug").order("display_order", { ascending: true }),
  ]);

  if (!product) {
    notFound();
  }

  return <ProductForm initialData={product} categories={categories || []} />;
}
