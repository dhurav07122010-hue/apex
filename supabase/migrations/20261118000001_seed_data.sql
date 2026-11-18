-- =============================================================================
-- SEED DATA: 10 REQUIRED KNOWLEDGE CATEGORIES & FEATURED EBOOKS
-- =============================================================================

INSERT INTO public.categories (id, name, slug, description, icon_name, color, display_order)
VALUES
    ('education', 'Education', 'education', 'Academic textbooks, pedagogy, and research-backed learning guides.', 'GraduationCap', 'from-blue-500 to-indigo-600', 1),
    ('technology', 'Technology', 'technology', 'Cloud computing, AI, cybersecurity, and emerging tech paradigms.', 'Cpu', 'from-cyan-500 to-blue-600', 2),
    ('programming', 'Programming', 'programming', 'Software engineering, web development, algorithms, and frameworks.', 'Code', 'from-emerald-500 to-teal-700', 3),
    ('business', 'Business', 'business', 'Entrepreneurship, strategy, marketing, leadership, and startup playbooks.', 'Briefcase', 'from-amber-500 to-orange-600', 4),
    ('finance', 'Finance', 'finance', 'Personal wealth, investing, capital markets, and cryptocurrency.', 'TrendingUp', 'from-green-500 to-emerald-700', 5),
    ('self-improvement', 'Self-improvement', 'self-improvement', 'Productivity, mental models, habits, and psychology for high performers.', 'Sparkles', 'from-purple-500 to-indigo-600', 6),
    ('fiction', 'Fiction', 'fiction', 'Gripping sci-fi, mysteries, thrillers, and contemporary narratives.', 'BookOpen', 'from-rose-500 to-pink-600', 7),
    ('non-fiction', 'Non-fiction', 'non-fiction', 'Biographies, history, philosophy, and real-world investigations.', 'Compass', 'from-violet-500 to-purple-700', 8),
    ('competitive-examinations', 'Competitive examinations', 'competitive-examinations', 'Comprehensive guides, mock tests, and syllabus notes for exam mastery.', 'Award', 'from-red-500 to-orange-600', 9),
    ('other-digital-books', 'Other digital books', 'other-digital-books', 'Art & design portfolios, music theory, recipes, and niche digital manuals.', 'Layers', 'from-slate-500 to-zinc-700', 10)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon_name = EXCLUDED.icon_name,
    color = EXCLUDED.color,
    display_order = EXCLUDED.display_order;

-- Seed initial products
INSERT INTO public.products (
    slug, title, subtitle, author, author_bio, category_id,
    price, original_price, rating, review_count, published_year, page_count,
    file_size, language, format, isbn, badge, short_description, description,
    features, table_of_contents, is_published, is_featured, is_bestseller
)
VALUES
(
    'full-stack-typescript-and-nextjs-mastery',
    'Full-Stack TypeScript & Next.js: Zero to Production',
    'Architect resilient, modern web platforms with Server Components & Edge Computing',
    'Arjun Venkataraman',
    'Principal Architect with 14+ years scaling high-throughput distributed systems in Silicon Valley and Bangalore.',
    'programming',
    499.00, 1299.00, 4.9, 342, 2026, 420,
    '14.8 MB', 'English', 'PDF', '978-0-13-597444-5', 'Bestseller',
    'A practical, production-grade guide to mastering Next.js App Router, TypeScript 5, React Server Components, and Supabase.',
    'Master modern web development from the ground up with this exhaustive, hands-on architectural handbook.',
    '["React Server Components Deep Dive", "Production Supabase Postgres Integration", "Automated CI/CD Pipelines"]'::jsonb,
    '["Chapter 1: The Modern Web Paradigm", "Chapter 2: Strict TypeScript Patterns", "Chapter 3: Next.js App Router"]'::jsonb,
    true, true, true
),
(
    'quantitative-aptitude-and-reasoning-mastery-2026',
    'Mastering Quantitative Aptitude & Logical Reasoning (2026 Edition)',
    'Speed Math, Data Interpretation, and Verbal Logic with 2,500+ Solved Shortcuts',
    'Prof. Vikramaditya Sen',
    'Senior Faculty & Exam Trainer who has mentored over 50,000 aspirants for CAT, UPSC, SSC, and Banking exams.',
    'competitive-examinations',
    449.00, 1199.00, 4.9, 924, 2026, 680,
    '31.5 MB', 'English', 'PDF', '978-8-19-482200-1', 'Must Have for Aspirants',
    'The definitive compendium for CAT, UPSC CSAT, GATE, SSC-CGL, and Banking examinations with Vedic math speed shortcuts.',
    'Competitive exams are not tests of your intelligence; they are speed and pattern-recognition trials under extreme time pressure.',
    '["2,500+ Solved Previous Questions", "Vedic Math Arithmetic Tricks", "Advanced DI Puzzles"]'::jsonb,
    '["Module 1: Vedic Speed Math", "Module 2: Profit & Loss", "Module 3: Permutations & Probability"]'::jsonb,
    true, true, true
)
ON CONFLICT (slug) DO NOTHING;
