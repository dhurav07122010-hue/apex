import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { MOCK_BOOKS } from "@/data/mock-books";
import { BookCard } from "@/components/BookCard";
import { BookCover } from "@/components/BookCover";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Cpu,
  Code,
  Briefcase,
  TrendingUp,
  Sparkles,
  Compass,
  Award,
  Layers,
  ShieldCheck,
  Zap,
  Download,
  Star,
  CheckCircle,
} from "lucide-react";

// Map category icons
const iconMap: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  Code: <Code className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
};

export default function HomePage() {
  const featuredBooks = MOCK_BOOKS.filter((b) => b.isFeatured);
  const bestSellers = MOCK_BOOKS.filter((b) => b.isBestseller);
  const examPrepBooks = MOCK_BOOKS.filter(
    (b) => b.category === "competitive-examinations" || b.category === "education"
  );

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-white dark:from-zinc-900/60 dark:via-zinc-950 dark:to-zinc-950 pt-12 pb-20 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and Call-to-actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Secure Digital Publishing</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.15]">
                Instant Knowledge. <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  World-Class eBooks.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {siteConfig.description}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/books"
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all cursor-pointer"
                >
                  <span>Explore All eBooks</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/categories"
                  className="px-6 py-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-semibold text-sm transition-all"
                >
                  Browse Categories
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>Instant Signed Download</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Encrypted Storage Vault</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-purple-600" />
                  <span>Universal PDF & EPUB</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Cover Stack */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm flex items-center justify-center">
                {/* Background decorative glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl -z-10" />

                {/* Overlapping book cards */}
                <div className="relative flex items-center justify-center">
                  {/* Left book tilted */}
                  <div className="transform -rotate-12 translate-x-4 translate-y-3 opacity-90 transition-transform hover:rotate-0 hover:z-20">
                    <BookCover
                      book={MOCK_BOOKS[1]}
                      size="lg"
                    />
                  </div>

                  {/* Middle primary book */}
                  <div className="z-10 transform hover:scale-105 transition-transform duration-300">
                    <BookCover
                      book={MOCK_BOOKS[0]}
                      size="xl"
                    />
                  </div>

                  {/* Right book tilted */}
                  <div className="transform rotate-12 -translate-x-4 translate-y-4 opacity-90 transition-transform hover:rotate-0 hover:z-20">
                    <BookCover
                      book={MOCK_BOOKS[2]}
                      size="lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
              Browse by Category
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Find exactly what you need across our 10 comprehensive knowledge tracks.
            </p>
          </div>
          <Link
            href="/categories"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {siteConfig.categories.map((cat) => {
            const count = MOCK_BOOKS.filter((b) => b.category === cat.slug).length;
            return (
              <Link
                key={cat.id}
                href={`/books?category=${cat.slug}`}
                className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors mb-3">
                    {iconMap[cat.iconName] || <BookOpen className="w-5 h-5" />}
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>{count} titles</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured eBooks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Curated Selection
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 mt-1">
              Featured eBooks
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Hand-picked bestsellers and critical releases in software, architecture, and business.
            </p>
          </div>

          <Link
            href="/books"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View Full Storefront</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Competitive Examinations & Prep Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-red-900 via-orange-950 to-zinc-900 text-white p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Aspirant Special</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Competitive Exam Master Compendiums
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Crack CAT, UPSC CSAT, Banking PO, SSC-CGL and Graduate tests with rigorous Vedic shortcuts, 2,500+ solved previous year papers, and complete time-tested formula handbooks.
            </p>
            <div className="pt-2">
              <Link
                href="/books?category=competitive-examinations"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all"
              >
                <span>Browse Exam Preparation Guides</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Top Rated by Readers
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 mt-1">
              All-Time Bestsellers
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              The highest rated digital publications on our platform this year.
            </p>
          </div>

          <Link
            href="/books?sort=popular"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>See All Bestsellers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestSellers.slice(0, 4).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Why Choose Platform Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
              Why Readers Trust {siteConfig.name}
            </h2>
            <p className="text-sm text-zinc-500 mt-2">
              Every aspect of our store is built around zero friction, digital preservation, and cryptographically verified delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {siteConfig.features.map((feature, i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
