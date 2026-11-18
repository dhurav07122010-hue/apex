# ApexBooks — Institutional Security Architecture & Audit Matrix

This document provides a comprehensive technical audit of the security controls, Row-Level Security (RLS) policies, authentication invariants, and cryptographic guarantees implemented across the ApexBooks platform.

---

## 1. Authentication & Authorization Invariants

| Security Control | Implementation | Verification Status |
| :--- | :--- | :--- |
| **Strict Admin Email Allowlist** | Server-side allowlist check against `dhurav07122010@gmail.com` and `public.admin_allowlist` database table. | **PASS** (Phase 3 & 7 verified) |
| **Google OAuth Enforced for Admin** | Permanently rejects email/password sessions for administrator routes, even if using the allowlisted email. | **PASS** (Phase 3 & 7 verified) |
| **Zero Client-Side Trust** | Client-supplied roles, claims, or headers are never trusted. Every admin operation re-verifies session on the server. | **PASS** (Phase 3 & 7 verified) |
| **No Public Admin Signups** | Admin registration endpoint does not exist. Public signups can only create standard customer accounts. | **PASS** (Phase 3 & 7 verified) |
| **Customer Authentication** | Supports Google OAuth and email/password for customers. | **PASS** (Phase 3 verified) |

---

## 2. Row-Level Security (RLS) Database Matrix

All tables in the Supabase PostgreSQL database have Row-Level Security (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) actively enforced:

| Database Table | Anonymous Access | Authenticated Customer Access | Administrator Access |
| :--- | :--- | :--- | :--- |
| `public.admin_allowlist` | **NONE** (0 rows visible) | **NONE** (0 rows visible) | Read-only / Server function |
| `public.profiles` | Public read for display | Update own profile only (`auth.uid() = id`) | Full administrative view |
| `public.categories` | Read-only | Read-only | Full CRUD |
| `public.products` | Read published only (`is_published = true`) | Read published only | Full CRUD |
| `public.orders` | **BLOCKED** | Read own orders only (`auth.uid() = user_id`) | Full administrative view |
| `public.order_items` | **BLOCKED** | Read own order items | Full administrative view |
| `public.payments` | **BLOCKED** | Read own payment records | Full administrative view |
| `public.purchase_entitlements` | **BLOCKED** | Read own entitlements (`auth.uid() = user_id` OR `email`) | Full administrative view |
| `public.download_logs` | **BLOCKED** | **BLOCKED** | Full administrative view |
| `public.webhook_events` | **BLOCKED** | **BLOCKED** | Full administrative view |
| `public.site_settings` | Read-only | Read-only | Update settings (`is_admin()`) |

---

## 3. Digital Delivery Vault & Anti-Piracy Architecture

1. **Private Storage Isolation**:
   - The `ebooks` Supabase Storage bucket is configured with `public = false`.
   - Direct requests to the public URL return `HTTP 400 Bad Request` or `HTTP 403 Forbidden`.
2. **Short-Lived Cryptographically Signed URLs**:
   - Downloads are served exclusively through URLs signed by the Supabase Storage HMAC secret.
   - Time-to-Live (TTL) is strictly bounded (default: 3600 seconds / 1 hour).
   - Once expired, the signed URL becomes completely invalid.
3. **IDOR (Insecure Direct Object Reference) Prevention**:
   - Requesting a download by guessing an `entitlementId` is strictly blocked.
   - The server verifies that the session `user.id` or `user.email` matches `entitlement.customer_email` or that a cryptographically signed HMAC token matches.
4. **Download Quotas & Rate Limiting**:
   - Each purchase entitlement has a hard `max_downloads` quota (default: 50).
   - Repeated download attempts exceeding the quota are blocked with `HTTP 429 Too Many Requests`.
5. **Tamper-Evident Audit Logging**:
   - Every download event records the caller's IP address, user agent, customer email, product ID, and exact timestamp in `public.download_logs`.
6. **Revocation Enforcement**:
   - If an order is refunded or an entitlement is deactivated (`is_active = false`), download access is immediately blocked with `HTTP 403 Forbidden`.

---

## 4. Payment Gateway Security & Integrity

1. **Authoritative Server-Side Pricing**:
   - Total order amount is **never** accepted from the client browser.
   - The server queries `public.products` directly to calculate `verifiedTotal`.
   - Client attempts to submit altered prices (e.g., ₹1 for a ₹499 eBook) are completely ignored.
2. **Cryptographic Signature Verification**:
   - Razorpay payment success is verified server-side using HMAC-SHA256:
     $$\text{HMAC-SHA256}(\text{order\_id} \parallel "|" \parallel \text{payment\_id}, \text{secret}) == \text{signature}$$
   - Forged or altered signatures are rejected with `HTTP 401 Unauthorized`.
3. **Webhook Idempotency & Replay Protection**:
   - Every incoming webhook event ID is recorded in `public.webhook_events` with a unique constraint.
   - Duplicate or replayed webhook events are detected and safely deduplicated without duplicate entitlement creation.
4. **Strict Isolation of Demo Mode**:
   - Demo checkout orders are explicitly prefixed with `DEMO-ORD-...` and tagged with `payment_method: 'demo'`.
   - Demo checkout can be disabled globally from the administrator dashboard with a single toggle.

---

## 5. Automated Security Test Evidence

All 11 security vectors were tested against the live server and database with 100% pass rate:

```
PASS [Vector 1]: Unauthorized & IDOR downloads strictly rejected with HTTP 403
PASS [Vector 2]: Fake payment direct insert rejected by database RLS
PASS [Vector 3]: Direct order ID enumeration and access blocked by database RLS
PASS [Vector 4]: Server-side authoritative pricing enforced (client price tampering impossible)
PASS [Vector 5]: Purchase entitlements table protected from cross-customer leakage by RLS
PASS [Vector 6]: Admin gate strictly enforces Google OAuth + exact allowlisted email
PASS [Vector 7]: Direct admin table manipulation blocked by RLS policies
PASS [Vector 8]: Webhook replay attack detected and deduplicated via webhook_events ledger
PASS [Vector 9]: Forged payment signature rejected by cryptographic HMAC-SHA256 validator
PASS [Vector 10]: Expired digital download token correctly invalidated
PASS [Vector 11]: Excessive download requests over quota strictly blocked with HTTP 429
```
