"use server";

import { validateAdminSession } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateStoreSettings(formData: FormData) {
  const auth = await validateAdminSession();
  if (!auth.authorized) {
    return { error: "Unauthorized: Admin session required." };
  }

  const adminDb = createAdminClient();

  const brandName = (formData.get("brandName") as string) || "ApexBooks";
  const tagline = (formData.get("tagline") as string) || "Read • Learn • Grow";
  const supportEmail = (formData.get("supportEmail") as string) || "support@apexbooks.demo";
  const signedUrlExpiry = parseInt(formData.get("signedUrlExpiry") as string) || 3600;
  const maxDownloadLimit = parseInt(formData.get("maxDownloadLimit") as string) || 50;

  // Update general settings
  await adminDb.from("site_settings").upsert({
    key: "general",
    value: { brand_name: brandName, tagline, support_email: supportEmail, currency: "INR" },
    updated_at: new Date().toISOString(),
  });

  // Update delivery settings
  await adminDb.from("site_settings").upsert({
    key: "delivery",
    value: { signed_url_expiry_seconds: signedUrlExpiry, max_download_limit: maxDownloadLimit },
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: true };
}
