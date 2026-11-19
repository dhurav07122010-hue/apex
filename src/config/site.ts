export const AUTHORIZED_ADMIN_EMAILS = [
  "dhurav07122010@gmail.com",
  "dhuruv07122010@gmail.com",
];

export const AUTHORIZED_ADMIN_EMAIL = "dhurav07122010@gmail.com";

export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return AUTHORIZED_ADMIN_EMAILS.some((adm) => adm.toLowerCase().trim() === normalized);
}

export interface CategoryConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  bgColor: string;
  textColor: string;
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
    hasDropdown?: boolean;
  }[];
  announcement: {
    offer: string;
    code: string;
    rightText1: string;
    rightText2: string;
  };
  policyLinks: {
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
  tagline: "Discover Books That Inspire You",
  description:
    "Explore our premium collection of eBooks and unlock a world of knowledge with instant digital access and secure payments.",
  logo: "/logo.png",
  url: "http://localhost:3000",
  supportEmail: "support@apexbooks.in",
  currency: {
    code: "INR",
    symbol: "₹",
    exchangeRateToINR: 1,
  },
  categories: [
    {
      id: "fiction-literature",
      name: "Fiction & Literature",
      slug: "fiction-literature",
      description: "Classic literature, compelling novels, contemporary drama, and timeless narratives.",
      iconName: "fiction-literature",
      bgColor: "#EBF5FF",
      textColor: "#1E40AF",
    },
    {
      id: "business-finance",
      name: "Business & Finance",
      slug: "business-finance",
      description: "Wealth building, entrepreneurship, investing, economic strategy, and leadership.",
      iconName: "business-finance",
      bgColor: "#FFF3EB",
      textColor: "#9A5B32",
    },
    {
      id: "self-improvement",
      name: "Self Improvement",
      slug: "self-improvement",
      description: "Habit formation, personal growth, psychology, mental clarity, and peak focus.",
      iconName: "self-improvement",
      bgColor: "#EBF9F1",
      textColor: "#15803D",
    },
    {
      id: "education-learning",
      name: "Education & Learning",
      slug: "education-learning",
      description: "Academic guides, learning science, pedagogy, and research-backed study systems.",
      iconName: "education-learning",
      bgColor: "#F3E8FF",
      textColor: "#6B21A8",
    },
    {
      id: "technology",
      name: "Technology",
      slug: "technology",
      description: "Cloud architecture, artificial intelligence, cybersecurity, and modern systems.",
      iconName: "technology",
      bgColor: "#E6F7FF",
      textColor: "#0369A1",
    },
    {
      id: "programming",
      name: "Programming",
      slug: "programming",
      description: "Full-stack web development, TypeScript, algorithms, architecture, and dev tools.",
      iconName: "programming",
      bgColor: "#ECFDF5",
      textColor: "#047857",
    },
    {
      id: "competitive-exams",
      name: "Competitive Exams",
      slug: "competitive-exams",
      description: "Quantitative aptitude, reasoning, UPSC, SSC, Banking, and exam master guides.",
      iconName: "competitive-exams",
      bgColor: "#FEF9E7",
      textColor: "#B45309",
    },
    {
      id: "children-young-readers",
      name: "Children & Young Readers",
      slug: "children-young-readers",
      description: "Engaging stories, illustrated tales, moral fables, and young imagination builders.",
      iconName: "children-young-readers",
      bgColor: "#FFF5E6",
      textColor: "#C2410C",
    },
  ],
  navLinks: [
    { name: "Home", href: "/" },
    { name: "All eBooks", href: "/books", hasDropdown: true },
    { name: "Categories", href: "/categories", hasDropdown: true },
    { name: "Bestsellers", href: "/books?sort=bestseller" },
    { name: "New Arrivals", href: "/books?sort=newest" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  announcement: {
    offer: "Get 50% OFF on your first eBook!",
    code: "FIRST50",
    rightText1: "Instant Download",
    rightText2: "Secure Payments",
  },
  policyLinks: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms and Conditions", href: "/terms" },
    { name: "Refund Policy", href: "/refund" },
    { name: "Digital Product Policy", href: "/digital-product-policy" },
  ],
  features: [
    {
      title: "Instant Access",
      description: "Start reading immediately upon payment confirmation with zero wait time.",
      icon: "Zap",
    },
    {
      title: "Secure Checkout",
      description: "Shop with confidence using encrypted Razorpay, UPI, Cards, and NetBanking.",
      icon: "ShieldCheck",
    },
    {
      title: "Curated Collection",
      description: "Handpicked for you by master editors, authors, and subject specialists.",
      icon: "BookOpen",
    },
    {
      title: "Your Personal Library",
      description: "Access anytime, anywhere across desktop, tablet, and mobile devices.",
      icon: "Infinity",
    },
  ],
};
