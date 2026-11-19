"use server";

import { validateAdminSession } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function toggleProductPublish(productId: string, currentStatus: boolean) {
  const auth = await validateAdminSession();
  if (!auth.authorized) {
    return { error: "Unauthorized: Admin session required." };
  }

  const adminDb = createAdminClient();
  const { error } = await adminDb
    .from("products")
    .update({ is_published: !currentStatus, updated_at: new Date().toISOString() })
    .eq("id", productId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/books");
  revalidatePath("/categories");
  return { success: true };
}

export async function deleteProduct(productId: string) {
  const auth = await validateAdminSession();
  if (!auth.authorized) {
    return { error: "Unauthorized: Admin session required." };
  }

  const adminDb = createAdminClient();
  const { error } = await adminDb.from("products").delete().eq("id", productId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/books");
  revalidatePath("/categories");
  return { success: true };
}

export async function saveProduct(formData: FormData) {
  const auth = await validateAdminSession();
  if (!auth.authorized) {
    return { error: "Unauthorized: Admin session required." };
  }

  const adminDb = createAdminClient();

  const id = formData.get("id") as string | null;
  const title = formData.get("title") as string;
  const slug = (formData.get("slug") as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const subtitle = (formData.get("subtitle") as string) || "";
  const author = formData.get("author") as string;
  const authorBio = (formData.get("authorBio") as string) || "";
  const categoryId = formData.get("categoryId") as string;
  const price = parseFloat(formData.get("price") as string) || 0;
  const originalPrice = formData.get("originalPrice") ? parseFloat(formData.get("originalPrice") as string) : null;
  const format = (formData.get("format") as string) || "PDF";
  const pageCount = parseInt(formData.get("pageCount") as string) || 100;
  const fileSize = (formData.get("fileSize") as string) || "10 MB";
  const language = (formData.get("language") as string) || "English";
  const isbn = (formData.get("isbn") as string) || "";
  const badge = (formData.get("badge") as string) || "";
  const shortDescription = formData.get("shortDescription") as string;
  const description = formData.get("description") as string;
  const isPublished = formData.get("isPublished") === "true";
  const isFeatured = formData.get("isFeatured") === "true";
  const isBestseller = formData.get("isBestseller") === "true";

  let storagePath: string | null = (formData.get("existingStoragePath") as string) || null;
  let coverImageUrl: string | null = (formData.get("existingCoverImageUrl") as string) || null;

  // Handle PDF file upload if provided
  const ebookFile = formData.get("ebookFile") as File | null;
  if (ebookFile && ebookFile.size > 0) {
    const fileExt = ebookFile.name.split(".").pop();
    const filePath = `vault/${slug}-${Date.now()}.${fileExt}`;
    const arrayBuffer = await ebookFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadErr } = await adminDb.storage
      .from("ebooks")
      .upload(filePath, buffer, {
        contentType: ebookFile.type || "application/pdf",
        upsert: true,
      });

    if (uploadErr) {
      return { error: `PDF upload failed: ${uploadErr.message}` };
    }
    storagePath = filePath;
  }

  // Handle Cover image upload if provided
  const coverFile = formData.get("coverFile") as File | null;
  if (coverFile && coverFile.size > 0) {
    const fileExt = coverFile.name.split(".").pop();
    const filePath = `covers/${slug}-${Date.now()}.${fileExt}`;
    const arrayBuffer = await coverFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: coverUploadErr } = await adminDb.storage
      .from("covers")
      .upload(filePath, buffer, {
        contentType: coverFile.type || "image/png",
        upsert: true,
      });

    if (!coverUploadErr) {
      const { data: pubUrl } = adminDb.storage.from("covers").getPublicUrl(filePath);
      coverImageUrl = pubUrl.publicUrl;
    }
  }

  const payload: any = {
    title,
    slug,
    subtitle,
    author,
    author_bio: authorBio,
    category_id: categoryId,
    price,
    original_price: originalPrice,
    format,
    page_count: pageCount,
    file_size: fileSize,
    language,
    isbn,
    badge,
    short_description: shortDescription,
    description,
    is_published: isPublished,
    is_featured: isFeatured,
    is_bestseller: isBestseller,
    storage_path: storagePath,
    cover_image_url: coverImageUrl,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    // Update existing
    const { error } = await adminDb.from("products").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    // Insert new
    const { error } = await adminDb.from("products").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/books");
  revalidatePath(`/books/${slug}`);
  revalidatePath("/categories");
  return { success: true };
}
