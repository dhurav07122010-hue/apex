"use server";

import { validateAdminSession } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { clearBrandingCache } from "@/lib/siteSettings";

export async function updateStoreSettings(formData: FormData) {
  const auth = await validateAdminSession();
  if (!auth.authorized) {
    return { error: "Unauthorized: Admin session required." };
  }

  const adminDb = createAdminClient();

  const brandName = (formData.get("brandName") as string)?.trim() || "ApexBooks";
  const tagline = (formData.get("tagline") as string)?.trim() || "Read • Learn • Grow";
  const supportEmail = (formData.get("supportEmail") as string)?.trim() || "support@apexbooks.demo";
  const signedUrlExpiry = parseInt(formData.get("signedUrlExpiry") as string) || 3600;
  const maxDownloadLimit = parseInt(formData.get("maxDownloadLimit") as string) || 50;

  let logoUrl = (formData.get("logoUrl") as string)?.trim() || "";
  let faviconUrl = (formData.get("faviconUrl") as string)?.trim() || "";

  // 1. Handle uploaded Logo file if provided
  const logoFile = formData.get("logoFile") as File | null;
  if (logoFile && logoFile.size > 0) {
    const fileExt = logoFile.name.split(".").pop() || "png";
    const filePath = `branding/logo-${Date.now()}.${fileExt}`;
    const arrayBuffer = await logoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadErr } = await adminDb.storage
      .from("covers")
      .upload(filePath, buffer, {
        contentType: logoFile.type || "image/png",
        upsert: true,
      });

    if (!uploadErr) {
      const { data: pubUrl } = adminDb.storage.from("covers").getPublicUrl(filePath);
      logoUrl = pubUrl.publicUrl;
    }
  }

  // 2. Handle uploaded Favicon file if provided
  const faviconFile = formData.get("faviconFile") as File | null;
  if (faviconFile && faviconFile.size > 0) {
    const fileExt = faviconFile.name.split(".").pop() || "ico";
    const filePath = `branding/favicon-${Date.now()}.${fileExt}`;
    const arrayBuffer = await faviconFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: favUploadErr } = await adminDb.storage
      .from("covers")
      .upload(filePath, buffer, {
        contentType: faviconFile.type || "image/x-icon",
        upsert: true,
      });

    if (!favUploadErr) {
      const { data: pubUrl } = adminDb.storage.from("covers").getPublicUrl(filePath);
      faviconUrl = pubUrl.publicUrl;
    }
  }

  // Fetch current general settings to preserve other keys if not overridden
  const { data: currentGeneralRow } = await adminDb
    .from("site_settings")
    .select("value")
    .eq("key", "general")
    .maybeSingle();

  const currentGeneral = currentGeneralRow?.value || {};

  const updatedGeneral = {
    ...currentGeneral,
    brand_name: brandName,
    tagline,
    support_email: supportEmail,
    logo_url: logoUrl || currentGeneral.logo_url || null,
    favicon_url: faviconUrl || currentGeneral.favicon_url || null,
    currency: "INR",
  };

  // Update general settings
  const { error: genErr } = await adminDb.from("site_settings").upsert({
    key: "general",
    value: updatedGeneral,
    updated_at: new Date().toISOString(),
  });

  if (genErr) {
    return { error: `Failed to update general settings: ${genErr.message}` };
  }

  // Update delivery settings
  await adminDb.from("site_settings").upsert({
    key: "delivery",
    value: { signed_url_expiry_seconds: signedUrlExpiry, max_download_limit: maxDownloadLimit },
    updated_at: new Date().toISOString(),
  });

  clearBrandingCache();
  revalidatePath("/admin/settings");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/books");
  return { success: true, logoUrl: updatedGeneral.logo_url, faviconUrl: updatedGeneral.favicon_url };
}

export async function addAdminUser(formData: FormData) {
  const auth = await validateAdminSession();
  if (!auth.authorized) {
    return { error: "Unauthorized: Admin session required." };
  }

  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const description = (formData.get("description") as string)?.trim() || "Administrator";

  if (!email || !email.includes("@")) {
    return { error: "A valid administrator Google account (Gmail) email address is required." };
  }

  const adminDb = createAdminClient();

  const payload = {
    email,
    description,
    is_active: true,
    updated_at: new Date().toISOString(),
  };

  const { error } = await adminDb.from("admin_allowlist").upsert(payload, { onConflict: "email" });

  if (error) {
    return { error: `Failed to add administrator: ${error.message}` };
  }

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function toggleAdminUser(id: string, currentStatus: boolean) {
  const auth = await validateAdminSession();
  if (!auth.authorized) {
    return { error: "Unauthorized: Admin session required." };
  }

  const adminDb = createAdminClient();
  const { error } = await adminDb
    .from("admin_allowlist")
    .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function deleteAdminUser(id: string) {
  const auth = await validateAdminSession();
  if (!auth.authorized) {
    return { error: "Unauthorized: Admin session required." };
  }

  const adminDb = createAdminClient();
  const { error } = await adminDb.from("admin_allowlist").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/settings");
  return { success: true };
}
