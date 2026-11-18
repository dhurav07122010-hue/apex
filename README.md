# ApexBooks — Production-Grade Secure eBook Marketplace

A complete, professional, highly secure digital eBook marketplace platform engineered with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **Supabase PostgreSQL & Auth**, **Private Storage Vaults**, and **Razorpay Payment Gateway**.

---

## 🌟 Executive Architectural Overview

ApexBooks is built from the ground up to satisfy institutional-grade security standards for digital content delivery while delivering a lightning-fast customer experience:

1. **Zero-Trust Admin Security**:
   - Strictly reserved for `dhurav07122010@gmail.com`.
   - Requires Google OAuth session validation server-side on every protected operation.
   - Permanently rejects email/password accounts and non-allowlisted Google accounts.
   - Public administrator registration is strictly prohibited.
2. **Private Digital Storage Vault (`ebooks` bucket `public = false`)**:
   - Original eBook PDFs are stored strictly in private Supabase storage.
   - Direct public access is physically blocked.
   - Downloads are served exclusively through short-lived (1-hour) cryptographically signed URLs.
3. **Tamper-Evident Digital Delivery & Audit Logs**:
   - Server-side purchase entitlement verification prevents IDOR (Insecure Direct Object Reference).
   - Per-entitlement download quotas and rate limiting (default 50 downloads per item).
   - Real-time logging of customer IP, user agent, and timestamp into `public.download_logs`.
4. **Dual Payment Gateways**:
   - **Isolated Demo Sandbox**: Safe simulator for testing orders and entitlement granting with real database price verification.
   - **Razorpay Test Mode**: Full server-side order generation, HMAC-SHA256 signature verification, and idempotent webhook processing.
   - **Razorpay Live Mode**: Strictly locked until explicit owner authorization.

---

## 📂 Project Structure

```
ebook-marketplace/
├── src/
│   ├── app/
│   │   ├── admin/                    # Admin Portal (Protected by server-side Google OAuth guard)
│   │   │   ├── analytics/            # Revenue, AOV, and category metrics
│   │   │   ├── categories/           # Category catalog manager
│   │   │   ├── customers/            # Customer accounts & books owned
│   │   │   ├── downloads/            # Real-time tamper-evident audit logs
│   │   │   ├── orders/               # Orders ledger & financial records
│   │   │   ├── payments/             # Gateway transaction records
│   │   │   ├── products/             # Add, edit, publish/draft, PDF vault upload
│   │   │   └── settings/             # Store configuration & download TTL
│   │   ├── api/
│   │   │   ├── checkout/demo/        # Demo order placement API
│   │   │   ├── downloads/[entitlementId]/ # Secure signed download delivery
│   │   │   └── webhooks/razorpay/    # Idempotent webhook handler with HMAC verification
│   │   ├── auth/
│   │   │   ├── callback/             # OAuth code exchange route
│   │   │   └── signin/               # Google OAuth & Email authentication
│   │   ├── account/                  # Customer bookshelf & download links
│   │   ├── books/                    # Storefront catalogue with search & filters
│   │   │   └── [slug]/               # Dynamic book detail pages with sample reader
│   │   ├── cart/                     # Cart review & coupon validation
│   │   ├── categories/               # 10 knowledge category tracks
│   │   ├── checkout/                 # Secure checkout & instant receipt screen
│   │   └── page.tsx                  # High-conversion homepage
│   ├── components/                   # Reusable UI components (Navbar, BookCard, Cover, etc.)
│   ├── config/site.ts                # Global brand configuration & allowlist constant
│   ├── context/CartContext.tsx       # Shopping cart context with local persistence
│   ├── data/mock-books.ts            # Seeded eBook catalogue (12 books across 10 categories)
│   └── lib/
│       ├── auth/admin.ts             # Server-side admin authorization guard
│       ├── delivery/vault.ts         # Secure signed download URL & token generation
│       ├── payments/demo.ts          # Isolated demo payment simulator
│       ├── payments/razorpay.ts      # Razorpay order, HMAC signature & webhook deduplication
│       └── supabase/                 # Supabase client, server, admin & database types
├── supabase/migrations/              # Production database migrations & RLS policies
├── scripts/                          # Automated test suites (Phases 1-7)
├── SETUP_GUIDE.md                    # Windows-friendly step-by-step setup guide
├── SECURITY_CHECKLIST.md             # Security verification matrix
└── DEPLOYMENT_GUIDE.md               # Vercel deployment walkthrough
```

---

## 🧪 Automated Test Suite (51/51 Tests Passing)

ApexBooks features comprehensive automated regression and security test suites covering all 7 phases:

```bash
# Run all automated tests (Phases 1 through 7)
npm test

# Run individual test suites:
npm run test:phase1     # Storefront & Routing (10/10 PASS)
npm run test:phase2     # Database Schema & RLS (5/5 PASS)
npm run test:phase3     # Authentication & Admin Guard (5/5 PASS)
npm run test:phase4     # Admin Panel & Storage Buckets (5/5 PASS)
npm run test:phase5     # Checkout & Payment Integrity (7/7 PASS)
npm run test:phase6     # Digital Delivery & Vault Security (8/8 PASS)
npm run test:security   # 11 Penetration Attack Vectors (11/11 PASS)
```

---

## ⚡ Quick Start for Development

### 1. Prerequisites
- **Node.js** (v20+ recommended)
- **Git**
- A Supabase project (Free tier)

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd ebook-marketplace

# Install dependencies
npm.cmd install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local` and configure your credentials:
```bash
copy .env.example .env.local
```

### 4. Run Development Server
```bash
npm.cmd run dev
```
Visit `http://localhost:3000` to browse the store.

### 5. Build for Production
```bash
npm.cmd run build
npm.cmd run start
```
