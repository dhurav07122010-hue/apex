"use server";

import { validateAdminSession } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function addCategory(formData: FormData) {
  const auth = await validateAdminSession();
  if (!auth.authorized) {
    return { error: "Unauthorized: Admin session required." };
  }

  const name = (formData.get("name") as string)?.trim();
  if (!name) {
    return { error: "Category name is required." };
  }

  const rawSlug = (formData.get("slug") as string)?.trim() || name;
  const slug = rawSlug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const description = (formData.get("description") as string)?.trim() || "";
  let imageUrl = (formData.get("imageUrl") as string)?.trim() || "";

  const adminDb = createAdminClient();

  // Handle uploaded image file if provided
  const imageFile = formData.get("imageFile") as File | null;
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop() || "png";
    const filePath = `categories/${slug}-${Date.now()}.${fileExt}`;
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadErr } = await adminDb.storage
      .from("covers")
      .upload(filePath, buffer, {
        contentType: imageFile.type || "image/png",
        upsert: true,
      });

    if (!uploadErr) {
      const { data: pubUrl } = adminDb.storage.from("covers").getPublicUrl(filePath);
      imageUrl = pubUrl.publicUrl;
    } else {
      console.error("Category image upload error:", uploadErr);
    }
  }

  // Determine display_order
  const { data: existing } = await adminDb
    .from("categories")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);

  const nextOrder = (existing?.[0]?.display_order || 0) + 1;

  const payload = {
    id: slug,
    name,
    slug,
    description,
    image_url: imageUrl || null,
    display_order: nextOrder,
    created_at: new Date().toISOString(),
  };

  const { error } = await adminDb.from("categories").upsert(payload, { onConflict: "slug" });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/books");
  return { success: true };
}

export async function deleteCategory(slug: string) {
  const auth = await validateAdminSession();
  if (!auth.authorized) {
    return { error: "Unauthorized: Admin session required." };
  }

  const adminDb = createAdminClient();
  const { error } = await adminDb.from("categories").delete().eq("slug", slug);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/books");
  return { success: true };
}
