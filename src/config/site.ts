export const AUTHORIZED_ADMIN_EMAIL = "dhurav07122010@gmail.com";

export interface CategoryConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  color: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  logo: string;
  url: string;
  supportEmail: string;
  currency: {
    code: string;
    symbol: string;
    exchangeRateToINR: number;
  };
  categories: CategoryConfig[];
  navLinks: {
    name: string;
    href: string;
  }[];
  announcement?: string;
  policyLinks?: {
    name: string;
    href: string;
  }[];
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export const siteConfig: SiteConfig = {
  name: "ApexBooks",
  shortName: "ApexBooks",
  tagline: "Read • Learn • Grow",
  description:
    "Explore, read, and instantly download premium eBooks across technology, business, competitive examinations, fiction, and more with secure digital access.",
  logo: "/logo.png",
  url: "http://localhost:3000",
  supportEmail: "support@apexbooks.demo",
  currency: {
    code: "INR",
    symbol: "₹",
    exchangeRateToINR: 1,
  },
  categories: [
    {
      id: "education",
      name: "Education",
      slug: "education",
      description: "Academic textbooks, pedagogy, and research-backed learning guides.",
      iconName: "GraduationCap",
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: "technology",
      name: "Technology",
      slug: "technology",
      description: "Cloud computing, AI, cybersecurity, and emerging tech paradigms.",
      iconName: "Cpu",
      color: "from-cyan-500 to-blue-600",
    },
    {
      id: "programming",
      name: "Programming",
      slug: "programming",
      description: "Software engineering, web development, algorithms, and frameworks.",
      iconName: "Code",
      color: "from-emerald-500 to-teal-700",
    },
    {
      id: "business",
      name: "Business",
      slug: "business",
      description: "Entrepreneurship, strategy, marketing, leadership, and startup playbooks.",
      iconName: "Briefcase",
      color: "from-amber-500 to-orange-600",
    },
    {
      id: "finance",
      name: "Finance",
      slug: "finance",
      description: "Personal wealth, investing, capital markets, and cryptocurrency.",
      iconName: "TrendingUp",
      color: "from-green-500 to-emerald-700",
    },
    {
      id: "self-improvement",
      name: "Self-improvement",
      slug: "self-improvement",
      description: "Productivity, mental models, habits, and psychology for high performers.",
      iconName: "Sparkles",
      color: "from-purple-500 to-indigo-600",
    },
    {
      id: "fiction",
      name: "Fiction",
      slug: "fiction",
      description: "Gripping sci-fi, mysteries, thrillers, and contemporary narratives.",
      iconName: "BookOpen",
      color: "from-rose-500 to-pink-600",
    },
    {
      id: "non-fiction",
      name: "Non-fiction",
      slug: "non-fiction",
      description: "Biographies, history, philosophy, and real-world investigations.",
      iconName: "Compass",
      color: "from-violet-500 to-purple-700",
    },
    {
      id: "competitive-examinations",
      name: "Competitive examinations",
      slug: "competitive-examinations",
      description: "Comprehensive guides, mock tests, and syllabus notes for exam mastery.",
      iconName: "Award",
      color: "from-red-500 to-orange-600",
    },
    {
      id: "other-digital-books",
      name: "Other digital books",
      slug: "other-digital-books",
      description: "Art & design portfolios, music theory, recipes, and niche digital manuals.",
      iconName: "Layers",
      color: "from-slate-500 to-zinc-700",
    },
  ],
  navLinks: [
    { name: "Home", href: "/" },
    { name: "eBooks", href: "/books" },
    { name: "Physical Books", href: "/books?format=physical" },
    { name: "Categories", href: "/categories" },
    { name: "Bestsellers", href: "/books?sort=bestseller" },
    { name: "New Arrivals", href: "/books?sort=newest" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  announcement: "⚡ Instant Digital Delivery on all eBooks • 100% Verified Files • Free Sample Previews",
  policyLinks: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Refund Policy", href: "/refund" },
  ],
  features: [
    {
      title: "Instant Digital Delivery",
      description: "Receive high-speed, cryptographically signed download links instantly upon order confirmation.",
      icon: "Zap",
    },
    {
      title: "Universal DRM-Free Formats",
      description: "Read smoothly on Kindle, iPad, Android, desktop, or e-readers with clean PDF & EPUB files.",
      icon: "ShieldCheck",
    },
    {
      title: "Lifetime Library Access",
      description: "Re-download your purchased eBooks anytime from your personal account bookshelf.",
      icon: "CloudDownload",
    },
    {
      title: "Verified Content Quality",
      description: "Professionally formatted typography, searchable text, and high-resolution diagrams.",
      icon: "CheckCircle",
    },
  ],
};
