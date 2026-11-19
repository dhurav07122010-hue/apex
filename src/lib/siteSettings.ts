import { createAdminClient } from "@/lib/supabase/admin";
import { siteConfig } from "@/config/site";

export interface SiteBranding {
  brandName: string;
  tagline: string;
  supportEmail: string;
  logoUrl: string;
  faviconUrl: string;
}

export async function getSiteBranding(): Promise<SiteBranding> {
  try {
    const adminDb = createAdminClient();
    const { data: row } = await adminDb
      .from("site_settings")
      .select("value")
      .eq("key", "general")
      .maybeSingle();

    const val = row?.value || {};
    return {
      brandName: val.brand_name || siteConfig.name,
      tagline: val.tagline || siteConfig.tagline,
      supportEmail: val.support_email || siteConfig.supportEmail,
      logoUrl: val.logo_url || siteConfig.logo,
      faviconUrl: val.favicon_url || "/icon.svg",
    };
  } catch (err) {
    return {
      brandName: siteConfig.name,
      tagline: siteConfig.tagline,
      supportEmail: siteConfig.supportEmail,
      logoUrl: siteConfig.logo,
      faviconUrl: "/icon.svg",
    };
  }
}
