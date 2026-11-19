/**
 * Administrator Ephemeral Session Token Utility
 *
 * Enforces a strict 240-second (4-minute) security lifecycle:
 * - HMAC-SHA256 tamper-proof signed payload
 * - Expiration checked on Edge Middleware, Server Layout, and Client Guard
 * - Upon expiration (240s), the session invalidates immediately and demands re-authentication
 */

export const ADMIN_SESSION_TTL_SECONDS = 240; // 4 minutes
export const ADMIN_SESSION_COOKIE_NAME = "apex_admin_session";
export const ADMIN_EXPIRES_COOKIE_NAME = "apex_admin_expires_at";

const SECRET_SALT =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "apex-admin-secure-session-salt-240s";

interface AdminSessionPayload {
  email: string;
  issuedAt: number;
  expiresAt: number;
  sessionId: string;
}

export interface AdminSessionVerifyResult {
  valid: boolean;
  email?: string;
  expiresAt?: number;
  remainingMs?: number;
  error?: string;
}

function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  let hexString = "";
  for (let i = 0; i < byteArray.byteLength; i++) {
    hexString += byteArray[i].toString(16).padStart(2, "0");
  }
  return hexString;
}

async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET_SALT),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toBase64Url(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf8").toString("base64url");
  }
  return btoa(encodeURIComponent(str))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(b64: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(b64, "base64url").toString("utf8");
  }
  let base64 = b64.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return decodeURIComponent(atob(base64));
}

/**
 * Creates a cryptographically signed 240-second admin session token.
 */
export async function createAdminSession(email: string): Promise<{
  token: string;
  expiresAt: number;
  maxAge: number;
}> {
  const now = Date.now();
  const expiresAt = now + ADMIN_SESSION_TTL_SECONDS * 1000;
  const sessionId = crypto.randomUUID ? crypto.randomUUID() : `sess_${now}_${Math.random()}`;

  const payload: AdminSessionPayload = {
    email: email.toLowerCase().trim(),
    issuedAt: now,
    expiresAt,
    sessionId,
  };

  const payloadString = JSON.stringify(payload);
  const key = await getHmacKey();
  const enc = new TextEncoder();
  const sigBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(payloadString));
  const signatureHex = bufferToHex(sigBuffer);
  const encodedPayload = toBase64Url(payloadString);

  const token = `${encodedPayload}.${signatureHex}`;

  return {
    token,
    expiresAt,
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  };
}

/**
 * Validates the admin session token against HMAC signature and 240s expiration.
 */
export async function verifyAdminSession(
  token?: string | null
): Promise<AdminSessionVerifyResult> {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return {
      valid: false,
      error: "Missing or malformed admin session token.",
    };
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 2) {
      return { valid: false, error: "Invalid token structure." };
    }

    const [encodedPayload, signatureHex] = parts;
    const payloadString = fromBase64Url(encodedPayload);
    const key = await getHmacKey();
    const enc = new TextEncoder();
    const expectedSigBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      enc.encode(payloadString)
    );
    const expectedSigHex = bufferToHex(expectedSigBuffer);

    if (signatureHex !== expectedSigHex) {
      return {
        valid: false,
        error: "Admin session signature mismatch or tampering detected.",
      };
    }

    const payload: AdminSessionPayload = JSON.parse(payloadString);
    const now = Date.now();

    if (now > payload.expiresAt) {
      return {
        valid: false,
        email: payload.email,
        expiresAt: payload.expiresAt,
        remainingMs: 0,
        error: "Admin session expired (240-second security window elapsed).",
      };
    }

    return {
      valid: true,
      email: payload.email,
      expiresAt: payload.expiresAt,
      remainingMs: payload.expiresAt - now,
    };
  } catch (err: any) {
    return {
      valid: false,
      error: err.message || "Failed to verify admin session token.",
    };
  }
}
