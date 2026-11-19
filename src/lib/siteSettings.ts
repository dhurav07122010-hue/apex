import { createAdminClient } from "@/lib/supabase/admin";
import { siteConfig } from "@/config/site";

export interface SiteBranding {
  brandName: string;
  tagline: string;
  supportEmail: string;
  logoUrl: string;
  faviconUrl: string;
}

let cachedBranding: SiteBranding | null = null;
let cacheExpiry = 0;

export async function getSiteBranding(): Promise<SiteBranding> {
  const now = Date.now();
  if (cachedBranding && now < cacheExpiry) {
    return cachedBranding;
  }

  try {
    const adminDb = createAdminClient();
    const { data: row } = await adminDb
      .from("site_settings")
      .select("value")
      .eq("key", "general")
      .maybeSingle();

    const val = row?.value || {};
    const result: SiteBranding = {
      brandName: val.brand_name || siteConfig.name,
      tagline: val.tagline || siteConfig.tagline,
      supportEmail: val.support_email || siteConfig.supportEmail,
      logoUrl: val.logo_url || siteConfig.logo,
      faviconUrl: val.favicon_url || "/icon.svg",
    };

    cachedBranding = result;
    cacheExpiry = now + 30000; // 30-second cache
    return result;
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

export function clearBrandingCache() {
  cachedBranding = null;
  cacheExpiry = 0;
}
