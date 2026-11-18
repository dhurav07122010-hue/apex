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

  const [{ data: product }, { data: categories }] = await Promise.all([
    adminDb.from("products").select("*").eq("id", id).single(),
    adminDb.from("categories").select("id, name, slug").order("display_order", { ascending: true }),
  ]);

  if (!product) {
    notFound();
  }

  return <ProductForm initialData={product} categories={categories || []} />;
}
