# Secure eBook Marketplace (ApexBooks)

A production-grade, highly secure digital eBook marketplace platform engineered with **Next.js App Router**, **TypeScript**, and **Tailwind CSS**. Designed for world-class eBooks across technology, programming, business, competitive examinations, finance, education, and fiction.

---

## 🚀 Phase 1 Implementation Summary (Completed)

- [x] **Global Brand Configuration (`src/config/site.ts`)**:
  - Global branding properties: brand name, taglines, support email, currency symbol (`₹`), and category definitions.
  - Branding can be altered globally across all pages and components by editing this single file.
- [x] **Complete Storefront & Navigation (`src/components/Navbar.tsx`, `Footer.tsx`)**:
  - Responsive header with instant search bar, category navigation, real-time cart indicator, and customer sign-in link.
  - Mobile responsive drawer navigation.
  - Informative footer with trust ribbons, category links, author support, and admin entry gateway.
- [x] **10 Required Knowledge Categories**:
  - Education
  - Technology
  - Programming
  - Business
  - Finance
  - Self-improvement
  - Fiction
  - Non-fiction
  - Competitive examinations
  - Other digital books
- [x] **Product Catalogue & Storefront (`/books`, `/categories`)**:
  - Real-time search by title, author, category, or description keywords.
  - Multi-faceted filters: Category, Price Range (Under ₹300, ₹300-₹500, Above ₹500), Minimum Rating (4.8+ ★, 4.5+ ★), Format (PDF, EPUB).
  - Sorting by Popularity, Rating, Price (Low to High, High to Low), and Publication Date.
  - Dual view modes: Responsive Grid view and detailed List view.
  - Active filter chips with one-click clear button and empty-state reset.
- [x] **Book Detail Pages (`/books/[slug]`)**:
  - Dynamic App Router routing with static generation and SEO metadata.
  - Pure CSS 3D/flat eBook cover renderer with lighting gradients, category pills, and format badges.
  - Full metadata strip: Page count, file size, publication year, ISBN, language, author biography.
  - Content tabs: Overview & Key Takeaways checklist, Full Table of Contents, and Chapter Preview snippets.
  - Interactive "Read Free Sample" full-screen reader modal.
  - Instant "Buy Now" and "Add to Cart" with instant state synchronization.
  - Related books showcase in matching category.
- [x] **Shopping Cart & Checkout Simulator (`/cart`, `/checkout`)**:
  - Persistent shopping cart backed by `localStorage` and React Context.
  - Mini slide-over cart drawer opening upon item addition or clicking the header cart badge.
  - Dedicated cart page with item removal, clear cart, subtotal calculation, and promotional coupon code input (`APEX20`).
  - Checkout screen with customer delivery email input and isolated Demo Payment gateway simulator.
- [x] **Admin Security Gate Preview (`/admin`)**:
  - Explicitly states Google OAuth only requirement.
  - Hardened email allowlist verification for `dhurav07122010@gmail.com`.
  - Rejection of email/password-only sessions and prohibition of public admin signups.

---

## 🛠️ Tech Stack & Directory Structure

```
ebook-marketplace/
├── src/
│   ├── app/
│   │   ├── admin/             # Admin gateway preview
│   │   ├── auth/signin/       # Customer authentication preview
│   │   ├── books/             # Storefront catalogue with search & filters
│   │   │   └── [slug]/        # Individual book detail pages
│   │   ├── cart/              # Full shopping cart page
│   │   ├── categories/        # Category directory
│   │   ├── checkout/          # Checkout flow simulator
│   │   ├── layout.tsx         # Root layout with CartProvider & Navbar/Footer
│   │   ├── page.tsx           # Home landing page with hero & bestsellers
│   │   └── globals.css        # Tailwind CSS styles
│   ├── components/
│   │   ├── BookCard.tsx       # Grid & List book card component
│   │   ├── BookCover.tsx      # CSS gradient & embossed cover mockup
│   │   ├── BookPreviewModal.tsx # Sample reading & table of contents modal
│   │   ├── CartDrawer.tsx     # Slide-over quick cart drawer
│   │   ├── Footer.tsx         # Site footer with trust badges
│   │   └── Navbar.tsx         # Navigation header with search & cart badge
│   ├── config/
│   │   └── site.ts            # Central brand & category configuration
│   ├── context/
│   │   └── CartContext.tsx    # Global cart state provider & local storage hook
│   ├── data/
│   │   └── mock-books.ts      # Comprehensive mock catalogue across 10 genres
│   └── types/
│       └── index.ts           # TypeScript interfaces for Books, Cart, Filters
├── scripts/
│   └── test-phase1.mjs        # Automated endpoint & content verification test
├── .env.example               # Environment variables template
└── package.json
```

---

## 💻 Running the Project (Windows Commands)

Run commands using `npm.cmd` or `cmd /c npm ...` in Windows PowerShell:

1. **Install Dependencies**:
   ```powershell
   npm.cmd install
   ```

2. **Run Development Server**:
   ```powershell
   npm.cmd run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

3. **Build Production Application**:
   ```powershell
   npm.cmd run build
   ```

4. **Start Production Server**:
   ```powershell
   npm.cmd run start
   ```

5. **Run Automated Tests**:
   ```powershell
   npm.cmd test
   ```

---

## 🛡️ Next Development Phases

- **Phase 2**: Backend — Supabase PostgreSQL schema, migrations, RLS policies, tables (`profiles`, `products`, `categories`, `orders`, `order_items`, `payments`, `purchase_entitlements`, `download_logs`, `webhook_events`, `admin_allowlist`, `site_settings`).
- **Phase 3**: Authentication — Customer Google OAuth & email/password, strict Admin Google OAuth only allowlist for `dhurav07122010@gmail.com`.
- **Phase 4**: Admin Dashboard — Upload eBooks to private storage, manage prices, edit books, review orders and download analytics.
- **Phase 5**: Payment Gateway — Razorpay Test Mode integration, isolated Demo payment flow, webhook signature validation, idempotency.
- **Phase 6**: Digital Delivery — Protected private storage, short-lived cryptographically signed download URLs, rate-limiting, and download audit logs.
- **Phase 7**: Automated Security Testing — IDOR vulnerability tests, fake payment injection tests, duplicate webhook tests, expired link tests.
