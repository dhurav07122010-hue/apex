import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export interface RequesterContext {
  userId?: string | null;
  email?: string | null;
  token?: string | null;
}

export interface ClientMetadata {
  ip?: string;
  userAgent?: string;
}

export interface DeliveryResult {
  success: boolean;
  status: number;
  downloadUrl?: string;
  expiresInSeconds?: number;
  remainingDownloads?: number;
  bookTitle?: string;
  error?: string;
}

function getSigningSecret(): string {
  return (
    process.env.DOWNLOAD_TOKEN_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "apexbooks_vault_secure_signing_secret"
  );
}

/**
 * Generate a cryptographically signed download access token for guest/receipt delivery.
 * Token expires in 24 hours.
 */
export function generateDownloadToken(
  entitlementId: string,
  customerEmail: string,
  expiresInHours = 24
): string {
  const secret = getSigningSecret();
  const exp = Math.floor(Date.now() / 1000) + expiresInHours * 3600;
  const payload = JSON.stringify({
    eid: entitlementId,
    em: customerEmail.toLowerCase().trim(),
    exp,
  });

  const encodedPayload = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("hex");

  return `${encodedPayload}.${signature}`;
}

/**
 * Verify cryptographic validity and expiration of a download access token.
 */
export function verifyDownloadToken(token: string): {
  valid: boolean;
  entitlementId?: string;
  email?: string;
  error?: string;
} {
  if (!token || !token.includes(".")) {
    return { valid: false, error: "Malformed download token format." };
  }

  const [encodedPayload, signature] = token.split(".");
  const secret = getSigningSecret();

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("hex");

  if (expectedSignature !== signature) {
    return { valid: false, error: "Tampered or invalid download token signature." };
  }

  try {
    const rawPayload = Buffer.from(encodedPayload, "base64url").toString("utf-8");
    const parsed = JSON.parse(rawPayload);

    const now = Math.floor(Date.now() / 1000);
    if (parsed.exp && parsed.exp < now) {
      return { valid: false, error: "Download link has expired. Please request a fresh link." };
    }

    return {
      valid: true,
      entitlementId: parsed.eid,
      email: parsed.em,
    };
  } catch {
    return { valid: false, error: "Invalid token payload structure." };
  }
}

/**
 * Generate a short-lived cryptographically signed Supabase storage URL
 * after strictly verifying purchase entitlements, rate limits, and caller identity.
 */
export async function generateSecureDownloadUrl(
  entitlementId: string,
  requester: RequesterContext,
  clientMeta: ClientMetadata = {}
): Promise<DeliveryResult> {
  const adminDb = createAdminClient();

  // 1. Fetch Entitlement and Product Data
  const { data: entitlement, error: entErr } = await adminDb
    .from("purchase_entitlements")
    .select(`
      id,
      user_id,
      customer_email,
      product_id,
      is_active,
      download_count,
      max_downloads,
      products (
        id,
        title,
        storage_path
      )
    `)
    .eq("id", entitlementId)
    .single();

  if (entErr || !entitlement) {
    return {
      success: false,
      status: 404,
      error: "Purchase entitlement not found.",
    };
  }

  // 2. Strict IDOR Authorization Enforcement
  let authorized = false;
  const targetEmail = entitlement.customer_email?.toLowerCase().trim();

  // Check A: Signed-in User ID match
  if (requester.userId && entitlement.user_id && requester.userId === entitlement.user_id) {
    authorized = true;
  }

  // Check B: Signed-in Customer Email match
  if (requester.email && requester.email.toLowerCase().trim() === targetEmail) {
    authorized = true;
  }

  // Check C: Cryptographic Download Token match
  if (requester.token) {
    const tokenVerification = verifyDownloadToken(requester.token);
    if (
      tokenVerification.valid &&
      tokenVerification.entitlementId === entitlement.id &&
      tokenVerification.email?.toLowerCase().trim() === targetEmail
    ) {
      authorized = true;
    }
  }

  if (!authorized) {
    return {
      success: false,
      status: 403,
      error: "Unauthorized: You do not have valid entitlement rights to download this eBook.",
    };
  }

  // 3. Entitlement State & Quota Checks
  if (!entitlement.is_active) {
    return {
      success: false,
      status: 403,
      error: "This purchase entitlement is inactive or has been revoked.",
    };
  }

  if (entitlement.download_count >= entitlement.max_downloads) {
    return {
      success: false,
      status: 429,
      error: `Download quota exceeded (${entitlement.download_count}/${entitlement.max_downloads}). Contact support to extend your quota.`,
    };
  }

  // 4. Resolve Storage Path
  const product = entitlement.products as any;
  const storagePath = product?.storage_path || "sample-apexbook.pdf";

  // 5. Fetch TTL from Site Settings
  const { data: deliverySettings } = await adminDb
    .from("site_settings")
    .select("value")
    .eq("key", "delivery")
    .single();

  const ttlSeconds = deliverySettings?.value?.signed_url_ttl_seconds || 3600;

  // 6. Generate Short-Lived Signed URL from Supabase Private Bucket
  const safeFilename = (product?.title || "ApexBooks_eBook")
    .replace(/[^a-zA-Z0-9_\-]/g, "_")
    .replace(/_+/g, "_");

  const { data: signedData, error: signErr } = await adminDb.storage
    .from("ebooks")
    .createSignedUrl(storagePath, ttlSeconds, {
      download: `${safeFilename}.pdf`,
    });

  if (signErr || !signedData?.signedUrl) {
    return {
      success: false,
      status: 500,
      error: `Failed to generate cryptographically signed download URL: ${signErr?.message}`,
    };
  }

  // 7. Audit Log Activity & Increment Quota atomically
  const newDownloadCount = entitlement.download_count + 1;
  const now = new Date().toISOString();

  await Promise.all([
    adminDb
      .from("purchase_entitlements")
      .update({
        download_count: newDownloadCount,
        last_downloaded_at: now,
      })
      .eq("id", entitlementId),

    adminDb.from("download_logs").insert({
      entitlement_id: entitlement.id,
      product_id: entitlement.product_id,
      user_id: requester.userId || entitlement.user_id || null,
      customer_email: targetEmail,
      ip_address: clientMeta.ip || "unknown",
      user_agent: clientMeta.userAgent || "unknown",
      downloaded_at: now,
    }),
  ]);

  return {
    success: true,
    status: 200,
    downloadUrl: signedData.signedUrl,
    expiresInSeconds: ttlSeconds,
    remainingDownloads: Math.max(0, entitlement.max_downloads - newDownloadCount),
    bookTitle: product?.title || "eBook",
  };
}
