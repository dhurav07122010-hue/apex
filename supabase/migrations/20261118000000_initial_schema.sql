-- =============================================================================
-- APEXBOOKS SECURE EBOOK MARKETPLACE — INITIAL SCHEMA MIGRATION
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. ADMIN ALLOWLIST TABLE
-- Exact verified email allowlist required for administrative operations
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.admin_allowlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed authorized administrator email
INSERT INTO public.admin_allowlist (email, description, is_active)
VALUES ('dhurav07122010@gmail.com', 'Primary Store Administrator', true)
ON CONFLICT (email) DO NOTHING;

-- Helper function to check if current authenticated user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.admin_allowlist
        WHERE email = LOWER(auth.jwt() ->> 'email')
          AND is_active = true
    );
$$;

-- =============================================================================
-- 2. PROFILES TABLE
-- Extends Supabase auth.users with public profile metadata
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Automatic profile sync trigger on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
        COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
        updated_at = now();
    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 3. CATEGORIES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon_name TEXT,
    color TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 4. PRODUCTS TABLE (eBooks)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    author TEXT NOT NULL,
    author_bio TEXT,
    category_id TEXT NOT NULL REFERENCES public.categories(slug) ON DELETE RESTRICT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),
    original_price NUMERIC(10, 2) CHECK (original_price IS NULL OR original_price >= price),
    rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
    review_count INT NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    published_year INT NOT NULL DEFAULT 2026,
    page_count INT NOT NULL DEFAULT 100 CHECK (page_count > 0),
    file_size TEXT NOT NULL DEFAULT '10 MB',
    language TEXT NOT NULL DEFAULT 'English',
    format TEXT NOT NULL DEFAULT 'PDF',
    isbn TEXT,
    badge TEXT,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    table_of_contents JSONB NOT NULL DEFAULT '[]'::jsonb,
    preview_chapters JSONB NOT NULL DEFAULT '[]'::jsonb,
    storage_path TEXT, -- private vault path e.g. "ebooks/rust-mastery.pdf"
    cover_image_url TEXT,
    cover_gradient JSONB DEFAULT '{"from": "#0f172a", "to": "#0284c7", "accent": "#38bdf8"}'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_bestseller BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 5. ORDERS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
    payment_method TEXT NOT NULL DEFAULT 'demo' CHECK (payment_method IN ('demo', 'razorpay')),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 6. ORDER ITEMS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 7. PAYMENTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    gateway TEXT NOT NULL CHECK (gateway IN ('demo', 'razorpay')),
    gateway_order_id TEXT,
    gateway_payment_id TEXT,
    gateway_signature TEXT,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL CHECK (status IN ('created', 'captured', 'failed', 'refunded')),
    raw_response JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 8. PURCHASE ENTITLEMENTS TABLE
-- Digital rights verification tying verified customers to purchased eBooks
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.purchase_entitlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_email TEXT NOT NULL,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    download_count INT NOT NULL DEFAULT 0 CHECK (download_count >= 0),
    max_downloads INT NOT NULL DEFAULT 50 CHECK (max_downloads > 0),
    last_downloaded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_customer_product_entitlement UNIQUE (customer_email, product_id)
);

-- =============================================================================
-- 9. DOWNLOAD LOGS TABLE
-- Tamper-evident download activity logs for audit & anti-abuse rate limits
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.download_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entitlement_id UUID NOT NULL REFERENCES public.purchase_entitlements(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_email TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    downloaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 10. WEBHOOK EVENTS TABLE
-- Idempotent event ledger preventing replay attacks and duplicate processing
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gateway TEXT NOT NULL DEFAULT 'razorpay',
    event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT false,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 11. SITE SETTINGS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed initial site settings
INSERT INTO public.site_settings (key, value, description)
VALUES 
    ('general', '{"brand_name": "ApexBooks", "tagline": "Read • Learn • Grow", "support_email": "support@apexbooks.demo", "currency": "INR"}'::jsonb, 'General branding'),
    ('payment', '{"allow_demo_checkout": true, "razorpay_test_enabled": true, "razorpay_live_enabled": false}'::jsonb, 'Payment modes'),
    ('delivery', '{"signed_url_expiry_seconds": 3600, "max_download_limit": 50}'::jsonb, 'Security & delivery settings')
ON CONFLICT (key) DO NOTHING;

-- =============================================================================
-- INDEXES FOR PERFORMANCE & HIGH THROUGHPUT
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_published ON public.products(is_published);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON public.products(rating);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_entitlements_lookup ON public.purchase_entitlements(customer_email, product_id, is_active);
CREATE INDEX IF NOT EXISTS idx_download_logs_entitlement ON public.download_logs(entitlement_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_idempotency ON public.webhook_events(event_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS across all tables
ALTER TABLE public.admin_allowlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 1. admin_allowlist
CREATE POLICY "Admin allowlist viewable only by admins"
    ON public.admin_allowlist FOR SELECT
    USING (public.is_admin());

-- 2. profiles
CREATE POLICY "Public profiles are readable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 3. categories
CREATE POLICY "Categories are readable by everyone"
    ON public.categories FOR SELECT
    USING (true);

CREATE POLICY "Categories editable only by admin"
    ON public.categories FOR ALL
    USING (public.is_admin());

-- 4. products
CREATE POLICY "Published products are readable by everyone"
    ON public.products FOR SELECT
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Products managed only by admin"
    ON public.products FOR ALL
    USING (public.is_admin());

-- 5. orders
CREATE POLICY "Customers can view own orders"
    ON public.orders FOR SELECT
    USING (
        auth.uid() = user_id OR
        LOWER(customer_email) = LOWER(auth.jwt() ->> 'email') OR
        public.is_admin()
    );

CREATE POLICY "Admins can manage all orders"
    ON public.orders FOR ALL
    USING (public.is_admin());

-- 6. order_items
CREATE POLICY "Customers can view items of own orders"
    ON public.order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
              AND (orders.user_id = auth.uid() OR LOWER(orders.customer_email) = LOWER(auth.jwt() ->> 'email') OR public.is_admin())
        )
    );

-- 7. payments
CREATE POLICY "Payments viewable by customer order owner or admin"
    ON public.payments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = payments.order_id
              AND (orders.user_id = auth.uid() OR LOWER(orders.customer_email) = LOWER(auth.jwt() ->> 'email') OR public.is_admin())
        )
    );

-- 8. purchase_entitlements
CREATE POLICY "Customers can view own entitlements"
    ON public.purchase_entitlements FOR SELECT
    USING (
        auth.uid() = user_id OR
        LOWER(customer_email) = LOWER(auth.jwt() ->> 'email') OR
        public.is_admin()
    );

CREATE POLICY "Entitlements managed by admin"
    ON public.purchase_entitlements FOR ALL
    USING (public.is_admin());

-- 9. download_logs
CREATE POLICY "Customers can view own download logs"
    ON public.download_logs FOR SELECT
    USING (
        LOWER(customer_email) = LOWER(auth.jwt() ->> 'email') OR
        public.is_admin()
    );

-- 10. webhook_events
CREATE POLICY "Webhook events managed only by admin or service role"
    ON public.webhook_events FOR ALL
    USING (public.is_admin());

-- 11. site_settings
CREATE POLICY "Public can view general site settings"
    ON public.site_settings FOR SELECT
    USING (true);

CREATE POLICY "Site settings managed only by admin"
    ON public.site_settings FOR ALL
    USING (public.is_admin());
