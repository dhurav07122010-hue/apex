"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Book } from "@/types";
import { BookCover } from "./BookCover";
import { BookPreviewModal } from "./BookPreviewModal";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { siteConfig } from "@/config/site";
import {
  Star,
  ShoppingCart,
  Zap,
  BookOpen,
  Heart,
  ChevronLeft,
  ChevronRight,
  Check,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface FeaturedHeroSliderProps {
  books: Book[];
}

export function FeaturedHeroSlider({ books }: FeaturedHeroSliderProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const { addToCart, isInCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Guard against empty books array
  if (!books || books.length === 0) return null;

  const currentBook = books[currentIndex] || books[0];
  const inCart = isInCart(currentBook.id);
  const inWishlist = isInWishlist(currentBook.id);

  const discountPercent = currentBook.originalPrice
    ? Math.round(
        ((currentBook.originalPrice - currentBook.price) /
          currentBook.originalPrice) *
          100
      )
    : 0;

  // Auto-rotation every 6.5s unless paused by user hover
  useEffect(() => {
    if (isPaused || books.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % books.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused, books.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % books.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + books.length) % books.length);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(currentBook);
    setIsCartOpen(true);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inCart) {
      addToCart(currentBook);
    }
    router.push("/checkout");
  };

  return (
    <>
      <section
        className="relative overflow-hidden bg-gradient-to-b from-[#FBFBFA] via-[#F4F6F9] to-white border-b border-slate-200/80 pt-8 sm:pt-10 pb-8 sm:pb-12"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-label="Featured eBooks Showcase"
      >
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#FDB813]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 translate-y-1/3 w-80 h-80 bg-[#0F2754]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Section Header Pill */}
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#FDB813] animate-pulse" />
              <span className="text-xs sm:text-sm font-extrabold tracking-wider text-[#0F2754] uppercase">
                Featured eBooks Spotlight • Books That Inspire You
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Book {currentIndex + 1} of {books.length}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-full border border-slate-300 hover:border-[#0F2754] bg-white text-slate-700 hover:text-[#0F2754] flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                  aria-label="Previous featured eBook"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-8 h-8 rounded-full border border-slate-300 hover:border-[#0F2754] bg-white text-slate-700 hover:text-[#0F2754] flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                  aria-label="Next featured eBook"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Slide Grid: Left Info & Right Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[460px]">
            {/* Left Column: Comprehensive Book Metadata & CTAs (7 Cols) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left order-2 lg:order-1">
              {/* Badges row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {currentBook.badge && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-[#FEF08A] text-[#854D0E] border border-[#FDE047] shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 fill-[#854D0E]" />
                    {currentBook.badge}
                  </span>
                )}
                <Link
                  href={`/categories/${currentBook.category}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 hover:bg-blue-100 text-[#153D78] border border-blue-200 transition-colors"
                >
                  {currentBook.categoryName}
                </Link>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Zap className="w-3 h-3 text-emerald-600" />
                  Instant PDF Access
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F1D36] tracking-tight leading-[1.12]">
                  <Link
                    href={`/books/${currentBook.slug}`}
                    className="hover:text-[#153D78] transition-colors"
                  >
                    {currentBook.title}
                  </Link>
                </h1>
                {currentBook.subtitle && (
                  <p className="text-base sm:text-lg font-medium text-[#153D78] mt-2 line-clamp-1">
                    {currentBook.subtitle}
                  </p>
                )}
              </div>

              {/* Author and Social Proof Rating */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-sm">
                <span className="font-bold text-slate-800">
                  By{" "}
                  <span className="text-[#0F2754] underline decoration-slate-300 underline-offset-2">
                    {currentBook.author}
                  </span>
                </span>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5">
                  <div className="flex text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(currentBook.rating)
                            ? "fill-[#F59E0B]"
                            : "fill-slate-200 text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-black text-slate-900">
                    {currentBook.rating}
                  </span>
                  <span className="text-slate-500 text-xs">
                    ({currentBook.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
              </div>

              {/* Synopsis / Description */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 line-clamp-3">
                {currentBook.shortDescription || currentBook.description}
              </p>

              {/* Key Features / Bullet points */}
              {currentBook.features && currentBook.features.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs sm:text-sm text-slate-700 max-w-xl mx-auto lg:mx-0 text-left">
                  {currentBook.features.slice(0, 2).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Pricing Box */}
              <div className="flex items-baseline justify-center lg:justify-start gap-3 pt-1">
                <span className="text-3xl sm:text-4xl font-black text-[#0F1D36]">
                  {siteConfig.currency.symbol}
                  {currentBook.price}
                </span>
                {currentBook.originalPrice && (
                  <>
                    <span className="text-lg sm:text-xl text-slate-400 line-through">
                      {siteConfig.currency.symbol}
                      {currentBook.originalPrice}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
                <span className="text-xs text-slate-500 font-medium">
                  • Digital Edition (PDF)
                </span>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                {/* Add to Cart button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="px-6 py-3.5 rounded-xl bg-[#FDB813] hover:bg-[#E5A50F] text-[#0F1D36] font-black text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{inCart ? "In Cart (Add More)" : "Add to Cart"}</span>
                </button>

                {/* Buy Now button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="px-6 py-3.5 rounded-xl bg-[#0F2754] hover:bg-[#153D78] text-white font-bold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Preview Sample button */}
                <button
                  type="button"
                  onClick={() => setPreviewBook(currentBook)}
                  className="px-4 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-300 hover:border-slate-400 flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <BookOpen className="w-4 h-4 text-[#153D78]" />
                  <span>Read Sample</span>
                </button>

                {/* Wishlist toggle button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(currentBook)}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    inWishlist
                      ? "bg-rose-50 border-rose-300 text-rose-600"
                      : "bg-white border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-800"
                  }`}
                  aria-label={
                    inWishlist ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <Heart
                    className={`w-5 h-5 ${
                      inWishlist ? "fill-rose-500 text-rose-500" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Security & Access assurances */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  100% Genuine PDF
                </span>
                <span>•</span>
                <span>Lifetime Cloud Library Access</span>
                <span>•</span>
                <span>Verified Razorpay Checkout</span>
              </div>
            </div>

            {/* Right Column: Heroic 3D Book Visual with Podium (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center order-1 lg:order-2">
              <div className="relative group cursor-pointer" onClick={() => setPreviewBook(currentBook)}>
                {/* Ambient glow behind book */}
                <div className="absolute inset-0 bg-[#FDB813]/25 rounded-full blur-2xl transform scale-110 -z-10 group-hover:scale-125 transition-transform duration-500" />

                {/* Large 3D Book Cover with responsive size */}
                <div className="relative transform group-hover:-translate-y-2 transition-transform duration-300 shadow-2xl rounded-lg">
                  <div className="hidden sm:block">
                    <BookCover book={currentBook} size="lg" />
                  </div>
                  <div className="sm:hidden">
                    <BookCover book={currentBook} size="md" />
                  </div>

                  {/* Floating overlay prompt on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-white/95 text-[#0F2754] text-xs font-bold shadow-lg flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#FDB813]" />
                      Click to Preview
                    </span>
                  </div>
                </div>

                {/* Floating Discount Pill on Book */}
                {discountPercent > 0 && (
                  <div className="absolute -top-3 -right-3 z-30 bg-[#FDB813] text-[#0F1D36] text-xs font-black px-3 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1">
                    <span>{discountPercent}% OFF</span>
                  </div>
                )}

                {/* Subtle reflective podium base */}
                <div className="w-36 sm:w-56 h-3 sm:h-4 bg-gradient-to-r from-transparent via-slate-400/30 to-transparent blur-xs mx-auto mt-2 rounded-full" />
              </div>

              {/* View Full Product Details link */}
              <Link
                href={`/books/${currentBook.slug}`}
                className="mt-4 text-xs font-bold text-[#153D78] hover:text-[#0F2754] flex items-center gap-1.5 group"
              >
                <span>View Full Details & Chapters</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* ======================================================== */}
          {/* Bottom Thumbnail Selector Strip (All 5 Featured Books)   */}
          {/* ======================================================== */}
          <div className="mt-8 sm:mt-10 pt-6 border-t border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Explore All Featured Titles:
              </span>
              <div className="flex items-center gap-1">
                {books.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx
                        ? "w-6 bg-[#0F2754]"
                        : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Horizontal thumbnail selector grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {books.map((book, idx) => {
                const isActive = currentIndex === idx;
                return (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                      isActive
                        ? "bg-white border-[#FDB813] ring-2 ring-[#FDB813]/40 shadow-md transform -translate-y-0.5"
                        : "bg-white/70 hover:bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                    }`}
                  >
                    <div className="shrink-0">
                      <BookCover book={book} size="xs" showBadge={false} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-bold truncate ${
                          isActive ? "text-[#0F2754]" : "text-slate-800"
                        }`}
                      >
                        {book.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {book.author}
                      </p>
                      <p className="text-xs font-extrabold text-[#0F2754] mt-0.5">
                        {siteConfig.currency.symbol}
                        {book.price}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Book Preview Modal */}
      {previewBook && (
        <BookPreviewModal
          book={previewBook}
          isOpen={!!previewBook}
          onClose={() => setPreviewBook(null)}
        />
      )}
    </>
  );
}
