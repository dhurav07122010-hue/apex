"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { MOCK_BOOKS } from "@/data/mock-books";
import { BookCard } from "@/components/BookCard";
import { BookCover } from "@/components/BookCover";
import { CategoryIcon } from "@/components/CategoryIcons";
import { FeaturedHeroSlider } from "@/components/FeaturedHeroSlider";
import { StackedBooks3D } from "@/components/StackedBooks3D";
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Infinity as InfinityIcon,
  Headphones,
  Check,
  Send,
  Star,
  BookOpen,
} from "lucide-react";

export default function HomePage() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [testimonialSlide, setTestimonialSlide] = useState(0);

  // Top Featured eBooks for Hero Showcase Slider
  const featuredSlugs = [
    "apex-free-demo-guide",
    "atomic-habits",
    "the-psychology-of-money",
    "rich-dad-poor-dad",
    "ikigai",
    "deep-work",
  ];
  const featuredBooks = featuredSlugs
    .map((slug) => MOCK_BOOKS.find((b) => b.slug === slug))
    .filter(Boolean) as typeof MOCK_BOOKS;

  // Handpicked for you (includes the Free Demo eBook)
  const handpickedSlugs = [
    "apex-free-demo-guide",
    "atomic-habits",
    "the-psychology-of-money",
    "rich-dad-poor-dad",
  ];
  const handpickedBooks = handpickedSlugs
    .map((slug) => MOCK_BOOKS.find((b) => b.slug === slug))
    .filter(Boolean) as typeof MOCK_BOOKS;

  // Bestsellers ranked 1 to 4 (Exact 4 books from reference image)
  const bestsellerRankSlugs = [
    "atomic-habits",
    "the-5-am-club",
    "deep-work",
    "do-epic-shit",
  ];
  const bestsellerBooks = bestsellerRankSlugs
    .map((slug) => MOCK_BOOKS.find((b) => b.slug === slug))
    .filter(Boolean) as typeof MOCK_BOOKS;

  // 7 Categories matching the reference image homepage grid
  const homeCategorySlugs = [
    "fiction-literature",
    "business-finance",
    "self-improvement",
    "education-learning",
    "technology",
    "competitive-exams",
    "children-young-readers",
  ];
  const homeCategories = homeCategorySlugs
    .map((slug) => siteConfig.categories.find((c) => c.slug === slug))
    .filter(Boolean) as typeof siteConfig.categories;

  const testimonials = [
    {
      quote:
        "Amazing collection! The platform is super easy to use and the books are great quality.",
      author: "Happy Reader",
      role: "Verified Purchaser",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    {
      quote:
        "Instant PDF delivery right to my library! No waiting, no DRM hassles. The reading experience on iPad is pure perfection.",
      author: "Priya Sharma",
      role: "Engineering Student",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
      quote:
        "The best curated selection of business and personal development books in India. Seamless Razorpay checkout with UPI.",
      author: "Rahul Verma",
      role: "Startup Founder",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
    }
  };

  return (
    <div className="flex flex-col bg-white">
      {/* ======================================================== */}
      {/* 1. FEATURED EBOOKS HERO SHOWCASE SLIDER                   */}
      {/* ======================================================== */}
      <FeaturedHeroSlider books={featuredBooks} />

      {/* ======================================================== */}
      {/* 2. TRUST INDICATORS (4 Items)                            */}
      {/* ======================================================== */}
      <section className="py-6 sm:py-8 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* 1: Instant Digital Delivery */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#153D78] flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#0F1D36]">
                  Instant Digital Delivery
                </h4>
              </div>
            </div>

            {/* 2: Secure Razorpay Payments */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#153D78] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#0F1D36]">
                  Secure Razorpay Payments
                </h4>
              </div>
            </div>

            {/* 3: Lifetime Library Access */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#153D78] flex items-center justify-center shrink-0">
                <InfinityIcon className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#0F1D36]">
                  Lifetime Library Access
                </h4>
              </div>
            </div>

            {/* 4: Customer Support Always Here */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#153D78] flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#0F1D36]">
                  Customer Support Always Here
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. SHOP BY CATEGORY                                      */}
      {/* ======================================================== */}
      <section className="py-12 sm:py-16 bg-[#FBFBFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F1D36]">
              Shop by Category
            </h2>
            <Link
              href="/categories"
              className="text-xs sm:text-sm font-bold text-[#153D78] hover:text-[#0F2754] flex items-center gap-1 group"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* 7 Category Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {homeCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group p-4 rounded-2xl flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-slate-200/80"
                style={{ backgroundColor: category.bgColor }}
              >
                <div className="w-14 h-14 mb-3 transition-transform duration-300 group-hover:scale-110">
                  <CategoryIcon name={category.slug} className="w-14 h-14" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#0F1D36] leading-tight line-clamp-2">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Free Demo Spotlight Banner */}
      <section className="py-4 bg-[#FBFBFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#064E3B] via-[#065F46] to-[#047857] text-white shadow-xl relative overflow-hidden">
            <div className="space-y-2 text-center md:text-left z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-200 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                100% Free Demo Edition
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Test Our Instant Reading &amp; Delivery System
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
                Claim your complimentary copy of the <em>ApexBooks QuickStart &amp; Reading Guide</em>. Test checkout, explore the format, and access your digital bookshelf with zero payment required.
              </p>
            </div>
            <Link
              href="/books/apex-free-demo-guide"
              className="z-10 py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0"
            >
              <span>Get Free Demo eBook</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. HANDPICKED FOR YOU                                    */}
      {/* ======================================================== */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Signature Yellow Accent Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-[#FDB813]" />
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F1D36]">
                Handpicked For You
              </h2>
            </div>
            <Link
              href="/books"
              className="text-xs sm:text-sm font-bold text-[#153D78] hover:text-[#0F2754] flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* 4 Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {handpickedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. PROMOTIONAL BANNER                                    */}
      {/* ======================================================== */}
      <section className="py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#0A1931] via-[#0F2754] to-[#153D78] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Background Glow */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Left Content */}
            <div className="relative z-10 space-y-3 text-center md:text-left max-w-xl">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                Knowledge Is Just One Click Away.
              </h3>
              <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed">
                Explore our collection of carefully curated digital books.
              </p>
              <div className="pt-2">
                <Link
                  href="/books"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FDB813] hover:bg-amber-400 text-[#0F1D36] text-xs sm:text-sm font-extrabold shadow-md transition-all"
                >
                  <span>Start Reading Today</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Graphic: 3D Stacked Books with Golden Pages */}
            <div className="relative z-10 shrink-0">
              <StackedBooks3D className="w-56 h-40 sm:w-64 sm:h-44" />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. BESTSELLERS (Ranked 1 to 4)                           */}
      {/* ======================================================== */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Signature Yellow Accent Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-[#FDB813]" />
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F1D36]">
                Bestsellers
              </h2>
            </div>
            <Link
              href="/books?sort=bestseller"
              className="text-xs sm:text-sm font-bold text-[#153D78] hover:text-[#0F2754] flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* 4 Ranked Bestseller Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellerBooks.map((book, index) => (
              <Link
                key={book.id}
                href={`/books/${book.slug}`}
                className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
              >
                {/* Gold Rank Number Circle */}
                <div className="w-9 h-9 rounded-full bg-[#FDB813] text-[#0F1D36] font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                  {index + 1}
                </div>

                {/* Book Thumbnail */}
                <div className="shrink-0">
                  <BookCover book={book} size="xs" showBadge={false} />
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-[#0F1D36] group-hover:text-[#153D78] transition-colors truncate">
                    {book.title}
                  </h4>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {book.author}
                  </p>
                  <p className="font-black text-sm text-[#0F1D36] mt-1.5">
                    {siteConfig.currency.symbol}
                    {book.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. WHY CHOOSE APEXBOOKS & WHAT OUR READERS SAY           */}
      {/* ======================================================== */}
      <section className="py-12 sm:py-16 bg-[#FBFBFC] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Why Choose ApexBooks (4 Cards) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-7 rounded-full bg-[#153D78]" />
                <h2 className="text-2xl sm:text-3xl font-black text-[#0F1D36]">
                  Why Choose ApexBooks?
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Feature 1 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#153D78] flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <h3 className="text-sm font-black text-[#0F1D36]">Instant Access</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Start reading immediately with high-speed digital delivery.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#153D78] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <h3 className="text-sm font-black text-[#0F1D36]">Secure Checkout</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Shop with confidence via Razorpay UPI and cards.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#153D78] flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <h3 className="text-sm font-black text-[#0F1D36]">Curated Collection</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Handpicked for you by master editors and authors.
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#153D78] flex items-center justify-center">
                    <InfinityIcon className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <h3 className="text-sm font-black text-[#0F1D36]">Your Personal Library</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Access anytime, anywhere with lifetime cloud backup.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: What Our Readers Say */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F1D36]">
                What Our Readers Say
              </h2>

              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-md space-y-4 relative">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-slate-700 italic leading-relaxed">
                  &ldquo;{testimonials[testimonialSlide].quote}&rdquo;
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 border-2 border-[#FDB813] shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={testimonials[testimonialSlide].avatar}
                      alt={testimonials[testimonialSlide].author}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#0F1D36]">
                      {testimonials[testimonialSlide].author}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {testimonials[testimonialSlide].role}
                    </p>
                  </div>
                </div>

                {/* Carousel Dots */}
                <div className="pt-2 flex items-center gap-1.5">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTestimonialSlide(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        testimonialSlide === idx
                          ? "w-6 bg-[#153D78]"
                          : "w-2 bg-slate-300 hover:bg-slate-400"
                      }`}
                      aria-label={`Testimonial ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. NEWSLETTER SUBSCRIPTION BAR                           */}
      {/* ======================================================== */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#0F2754] p-8 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Header */}
            <div className="flex items-start gap-4 max-w-xl text-center lg:text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-[#FDB813] flex items-center justify-center shrink-0 hidden sm:flex">
                <Send className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Stay Updated with Our Latest Books &amp; Offers
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Subscribe to our newsletter and never miss a deal!
                </p>
              </div>
            </div>

            {/* Center / Right: Form & Illustration */}
            <div className="w-full lg:w-auto flex-1 max-w-md">
              {newsletterSubscribed ? (
                <div className="p-3.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Thank you for subscribing to ApexBooks!</span>
                </div>
              ) : (
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="flex flex-col sm:flex-row items-center gap-2 bg-white/10 p-1.5 rounded-full border border-white/20 backdrop-blur-sm"
                >
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-5 py-2.5 rounded-full text-xs text-white placeholder:text-slate-300 bg-transparent outline-hidden"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#FDB813] hover:bg-amber-400 text-[#0F1D36] text-xs font-extrabold uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            {/* 3D Stack Graphic */}
            <div className="hidden xl:block shrink-0">
              <StackedBooks3D className="w-32 h-24" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
