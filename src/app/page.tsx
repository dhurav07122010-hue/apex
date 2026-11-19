"use client";

import React, { useState, useRef } from "react";
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
  CreditCard,
  Clock,
  ChevronLeft,
  ChevronRight,
  Mail,
  Check,
  Headphones,
  Lock,
} from "lucide-react";

// Category Icon Mapping
const categoryIcons: Record<string, React.ReactNode> = {
  education: <GraduationCap className="w-6 h-6 text-[#153D78]" />,
  technology: <Cpu className="w-6 h-6 text-[#153D78]" />,
  programming: <Code className="w-6 h-6 text-[#153D78]" />,
  business: <Briefcase className="w-6 h-6 text-[#153D78]" />,
  finance: <TrendingUp className="w-6 h-6 text-[#153D78]" />,
  "self-improvement": <Sparkles className="w-6 h-6 text-[#153D78]" />,
  fiction: <BookOpen className="w-6 h-6 text-[#153D78]" />,
  "non-fiction": <Compass className="w-6 h-6 text-[#153D78]" />,
  "competitive-examinations": <Award className="w-6 h-6 text-[#153D78]" />,
  "other-digital-books": <Layers className="w-6 h-6 text-[#153D78]" />,
};

export default function HomePage() {
  const featuredBooks = MOCK_BOOKS.filter((b) => b.isFeatured);
  const bestSellers = MOCK_BOOKS.filter((b) => b.isBestseller);
  const newArrivals = [...MOCK_BOOKS].reverse().slice(0, 8);

  const bestsellersRef = useRef<HTMLDivElement>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const scrollBestsellers = (direction: "left" | "right") => {
    if (bestsellersRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      bestsellersRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
    }
  };

  // Hero Spotlight Books
  const heroBooks = MOCK_BOOKS.slice(0, 3);

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-20 bg-white">
      {/* ======================================================== */}
      {/* SECTION A: BOOKSTORE HERO SECTION                        */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF3FF]/70 via-[#F4F6FA]/50 to-white pt-10 sm:pt-16 pb-16 sm:pb-20 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Headline & Call to Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF3FF] border border-[#BFDBFE] text-[#153D78] text-xs font-bold tracking-wide">
                <Sparkles className="w-4 h-4 text-[#2878D0]" />
                <span>Premier Indian Online Bookstore — Instant Knowledge & Digital Reading</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F1D36] leading-[1.15]">
                Discover Your <br />
                <span className="text-[#153D78]">Next Great Read.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Explore an authoritative collection of world-class eBooks across Technology, Software Engineering, Competitive Examinations, Business, and Finance — instantly accessible on all devices.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/books"
                  className="px-7 py-3.5 rounded-xl bg-[#153D78] hover:bg-[#1B5EB0] text-white font-bold text-sm flex items-center gap-2.5 shadow-md shadow-[#153D78]/20 transition-all cursor-pointer"
                >
                  <span>Explore Books</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/categories"
                  className="px-7 py-3.5 rounded-xl border-2 border-[#153D78] text-[#153D78] hover:bg-[#EAF3FF] font-bold text-sm transition-all"
                >
                  Browse Categories
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-[#E2E8F0] grid grid-cols-3 gap-4 text-left">
                <div className="flex items-start gap-2.5">
                  <Zap className="w-5 h-5 text-[#2878D0] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">Instant Delivery</h5>
                    <p className="text-[11px] text-slate-500">Immediate download links</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">Verified Files</h5>
                    <p className="text-[11px] text-slate-500">100% Genuine PDFs</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CreditCard className="w-5 h-5 text-[#153D78] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">Razorpay Protected</h5>
                    <p className="text-[11px] text-slate-500">UPI, Cards, NetBanking</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Book Composition with realistic 3D layers */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-md h-80 sm:h-96 flex items-center justify-center">
                {/* Background podium card */}
                <div className="absolute inset-x-4 inset-y-2 bg-[#EAF3FF] rounded-3xl border border-[#BFDBFE] -rotate-2 shadow-xs" />

                {/* Layered book covers with Pinwheel editorial styling */}
                <div className="relative z-10 flex items-center justify-center -space-x-12 sm:-space-x-16 hover:space-x-2 transition-all duration-500">
                  {heroBooks.map((book, idx) => (
                    <Link
                      key={book.id}
                      href={`/books/${book.slug}`}
                      className={`transform transition-all duration-300 hover:scale-110 hover:z-30 cursor-pointer ${
                        idx === 0
                          ? "-rotate-6 translate-y-3"
                          : idx === 1
                          ? "z-20 -translate-y-2 scale-105"
                          : "rotate-6 translate-y-3"
                      }`}
                    >
                      <BookCover book={book} size={idx === 1 ? "lg" : "md"} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION B: SHOP BY CATEGORY (Pinwheel Publications Grid) */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2878D0] mb-1">
              <span>Knowledge Tracks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F1D36] tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Curated reading disciplines designed for students, developers, professionals, and avid readers.
            </p>
          </div>

          <Link
            href="/categories"
            className="text-xs font-bold text-[#153D78] hover:text-[#2878D0] flex items-center gap-1 shrink-0"
          >
            <span>View All 10 Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Tiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {siteConfig.categories.map((cat) => {
            const count = MOCK_BOOKS.filter((b) => b.category === cat.slug).length;

            return (
              <Link
                key={cat.id}
                href={`/books?category=${cat.slug}`}
                className="group p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#2878D0] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#EAF3FF] group-hover:bg-[#153D78] transition-colors flex items-center justify-center mb-3">
                    <span className="group-hover:text-white transition-colors">
                      {categoryIcons[cat.slug] || <BookOpen className="w-6 h-6 text-[#153D78]" />}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#0F1D36] group-hover:text-[#2878D0] transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-[#153D78]">
                  <span>{count} {count === 1 ? "Book" : "Books"}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION C: FEATURED BOOKS                                */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2878D0] mb-1">
              <span>Editor&apos;s Selection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F1D36] tracking-tight">
              Featured Books
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Hand-picked bestsellers and architectural masterpieces with comprehensive reading previews.
            </p>
          </div>

          <Link
            href="/books"
            className="text-xs font-bold text-[#153D78] hover:text-[#2878D0] flex items-center gap-1 shrink-0"
          >
            <span>Explore All eBooks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredBooks.slice(0, 4).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION D: BESTSELLERS SCROLLING SHELF                   */}
      {/* ======================================================== */}
      <section className="bg-[#F4F6FA] py-12 sm:py-16 border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
                <span>Reader Favorites</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F1D36] tracking-tight">
                Top Bestsellers
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Most purchased and highly rated titles across the marketplace.
              </p>
            </div>

            {/* Scroll Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollBestsellers("left")}
                className="p-2.5 rounded-xl bg-white border border-[#CBD5E1] text-slate-700 hover:bg-[#EAF3FF] hover:text-[#153D78] transition-colors shadow-xs cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollBestsellers("right")}
                className="p-2.5 rounded-xl bg-white border border-[#CBD5E1] text-slate-700 hover:bg-[#EAF3FF] hover:text-[#153D78] transition-colors shadow-xs cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Horizontally Scrollable Product Container */}
          <div
            ref={bestsellersRef}
            className="flex gap-5 overflow-x-auto pb-4 scroll-smooth no-scrollbar"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {bestSellers.map((book) => (
              <div
                key={book.id}
                className="w-72 sm:w-80 shrink-0"
                style={{ scrollSnapAlign: "start" }}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION E: NEW ARRIVALS                                  */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              <span>Fresh Off The Press</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F1D36] tracking-tight">
              New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Recently added eBook publications including &quot;5 HTML Ways&quot; and competitive exam updates.
            </p>
          </div>

          <Link
            href="/books?sort=newest"
            className="text-xs font-bold text-[#153D78] hover:text-[#2878D0] flex items-center gap-1 shrink-0"
          >
            <span>View All New Releases</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {newArrivals.slice(0, 4).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION F: PROMOTIONAL SPOTLIGHT BANNER                  */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-[#153D78] text-white p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-radial from-[#2878D0]/30 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
              Special Knowledge Spotlight
            </span>

            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Master Full-Stack Architecture & Exam Prep in 2026.
            </h3>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Equip yourself with comprehensive handbooks on Modern TypeScript, Next.js, Cloud-Native Systems, and Quantitative Aptitude. Verified DRM-free files with lifetime re-downloads.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/books?category=programming"
                className="px-6 py-3 rounded-xl bg-white text-[#153D78] hover:bg-[#EAF3FF] font-bold text-xs sm:text-sm transition-all"
              >
                Shop Tech Books
              </Link>
              <Link
                href="/books?category=competitive-examinations"
                className="px-6 py-3 rounded-xl border border-white/40 hover:bg-white/10 text-white font-bold text-xs sm:text-sm transition-all"
              >
                Shop Exam Prep
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION G: WHY CHOOSE APEXBOOKS                          */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2878D0] mb-1">
            <span>Guaranteed Trust</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F1D36] tracking-tight">
            Why Choose ApexBooks?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Built on transparent engineering standards, verified file delivery, and sovereign customer ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#153D78] flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5 text-[#153D78]" />
            </div>
            <h4 className="font-bold text-sm text-[#0F1D36]">Razorpay Payments</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Encrypted authorization with UPI, NetBanking, and credit/debit cards.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#153D78] flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 text-[#2878D0]" />
            </div>
            <h4 className="font-bold text-sm text-[#0F1D36]">Instant Digital Delivery</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Cryptographically signed download URLs generated immediately upon payment.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#153D78] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-bold text-sm text-[#0F1D36]">Lifetime Access</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Re-download your purchased eBooks anytime from your personal account bookshelf.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#153D78] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="font-bold text-sm text-[#0F1D36]">Verified Book Files</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pristine, malware-scanned PDF files formatted for Kindle, iPad, and desktop.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#153D78] flex items-center justify-center font-bold">
              <Headphones className="w-5 h-5 text-amber-600" />
            </div>
            <h4 className="font-bold text-sm text-[#0F1D36]">Dedicated Support</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Prompt customer service resolution for all order and download inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION H: CUSTOMER REVIEWS                              */}
      {/* ======================================================== */}
      <section className="bg-[#F4F6FA] py-12 sm:py-16 border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2878D0] mb-1">
              <span>Reader Testimonials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F1D36] tracking-tight">
              Trusted by Students & Professionals
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Verified experiences from readers who purchased and read our digital titles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                &quot;The Full-Stack TypeScript handbook was instrumental in our team&apos;s migration to Next.js App Router. The instant signed download worked flawlessly within 2 seconds of payment.&quot;
              </p>
              <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs text-[#0F1D36]">Rohan Sharma</h5>
                  <p className="text-[10px] text-slate-400">Software Engineer, Bengaluru</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Verified Purchase
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                &quot;Mastering Quantitative Aptitude (2026 Edition) is the most comprehensive exam preparation guide I have studied. Clean typography and searchable solutions on my iPad.&quot;
              </p>
              <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs text-[#0F1D36]">Priya Venkatesh</h5>
                  <p className="text-[10px] text-slate-400">Aspirant, UPSC & Banking</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Verified Purchase
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                &quot;I appreciate being able to re-download my purchased books anytime from my bookshelf without restrictive proprietary reader apps. Genuine DRM-free publishing at its finest.&quot;
              </p>
              <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs text-[#0F1D36]">Anand Deshmukh</h5>
                  <p className="text-[10px] text-slate-400">Founder & Investor, Mumbai</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Verified Purchase
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION I: FUNCTIONAL NEWSLETTER                         */}
      {/* ======================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#EAF3FF] border border-[#BFDBFE] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#153D78] text-white flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>

          <h3 className="text-2xl font-black text-[#0F1D36]">
            Subscribe to the ApexBooks Gazette
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Receive monthly curated reading digests, new book releases, author interviews, and subscriber-exclusive discount codes.
          </p>

          {newsletterSubscribed ? (
            <div className="p-4 rounded-xl bg-emerald-100 text-emerald-800 font-semibold text-xs flex items-center justify-center gap-2 max-w-md mx-auto">
              <CheckCircle className="w-4 h-4" />
              <span>Thank you for subscribing! Check your inbox for your 10% welcome voucher.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#CBD5E1] text-xs sm:text-sm outline-none focus:border-[#2878D0] text-slate-800"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#153D78] hover:bg-[#1B5EB0] text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[11px] text-slate-400">
            We respect your privacy. No spam, ever. Unsubscribe with 1 click anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
