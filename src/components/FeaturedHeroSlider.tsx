"use client";

import React, { useState, useEffect } from "react";
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

  // Auto-advance every 6.5s unless paused
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
        className="relative overflow-hidden bg-gradient-to-b from-[#FBFBFA] via-[#F4F6F9] to-white border-b border-slate-200/80 w-full flex flex-col justify-between py-2 sm:py-3 lg:py-4 px-3 sm:px-6 lg:px-8 h-auto lg:h-[calc(100vh-140px)] lg:max-h-[760px] lg:min-h-[560px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-label="Featured eBooks Showcase"
      >
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-1/4 -translate-y-1/2 w-80 h-80 bg-[#FDB813]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 translate-y-1/3 w-72 h-72 bg-[#0F2754]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-between relative z-10">
          {/* ======================================================== */}
          {/* 1. TOP HEADER STRIP                                      */}
          {/* ======================================================== */}
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 shrink-0">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#FDB813] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-extrabold tracking-wider text-[#0F2754] uppercase">
                Featured eBooks Spotlight • Books That Inspire You
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                Book {currentIndex + 1} of {books.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-300 hover:border-[#0F2754] bg-white text-slate-700 hover:text-[#0F2754] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                  aria-label="Previous featured eBook"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-300 hover:border-[#0F2754] bg-white text-slate-700 hover:text-[#0F2754] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                  aria-label="Next featured eBook"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. MAIN ACTIVE BOOK SHOWCASE                             */}
          {/* ======================================================== */}
          <div className="my-auto py-2 sm:py-3">
            {/* DESKTOP LAYOUT (lg & above): 2 Columns */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Metadata & CTAs (7 Cols) */}
              <div className="lg:col-span-7 space-y-3 text-left">
                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-2">
                  {currentBook.badge && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wide bg-[#FEF08A] text-[#854D0E] border border-[#FDE047]">
                      <Sparkles className="w-3 h-3 fill-[#854D0E]" />
                      {currentBook.badge}
                    </span>
                  )}
                  <Link
                    href={`/categories/${currentBook.category}`}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 hover:bg-blue-100 text-[#153D78] border border-blue-200 transition-colors"
                  >
                    {currentBook.categoryName}
                  </Link>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Zap className="w-2.5 h-2.5 text-emerald-600" />
                    Instant PDF Access
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h1 className="text-3xl xl:text-4xl font-black text-[#0F1D36] tracking-tight leading-tight">
                    <Link
                      href={`/books/${currentBook.slug}`}
                      className="hover:text-[#153D78] transition-colors"
                    >
                      {currentBook.title}
                    </Link>
                  </h1>
                  {currentBook.subtitle && (
                    <p className="text-sm xl:text-base font-medium text-[#153D78] mt-1 line-clamp-1">
                      {currentBook.subtitle}
                    </p>
                  )}
                </div>

                {/* Author and Social Proof Rating */}
                <div className="flex items-center gap-3 text-xs sm:text-sm">
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
                          className={`w-3.5 h-3.5 ${
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

                {/* Synopsis */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl line-clamp-2">
                  {currentBook.shortDescription || currentBook.description}
                </p>

                {/* Key Features / Bullet points */}
                {currentBook.features && currentBook.features.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 max-w-lg">
                    {currentBook.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </div>
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pricing Box */}
                <div className="flex items-baseline gap-3 pt-0.5">
                  <span className="text-2xl xl:text-3xl font-black text-[#0F1D36]">
                    {siteConfig.currency.symbol}
                    {currentBook.price}
                  </span>
                  {currentBook.originalPrice && (
                    <>
                      <span className="text-base text-slate-400 line-through">
                        {siteConfig.currency.symbol}
                        {currentBook.originalPrice}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}
                  <span className="text-[11px] text-slate-500 font-medium">
                    • Digital Edition (PDF)
                  </span>
                </div>

                {/* Action Buttons Row */}
                <div className="pt-1 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="px-5 py-2.5 rounded-xl bg-[#FDB813] hover:bg-[#E5A50F] text-[#0F1D36] font-black text-xs flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{inCart ? "In Cart (Add More)" : "Add to Cart"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="px-5 py-2.5 rounded-xl bg-[#0F2754] hover:bg-[#153D78] text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <span>Buy Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewBook(currentBook)}
                    className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-300 hover:border-slate-400 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#153D78]" />
                    <span>Read Sample</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(currentBook)}
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                      inWishlist
                        ? "bg-rose-50 border-rose-300 text-rose-600"
                        : "bg-white border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-800"
                    }`}
                    aria-label={
                      inWishlist ? "Remove from wishlist" : "Add to wishlist"
                    }
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        inWishlist ? "fill-rose-500 text-rose-500" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Assurances line */}
                <div className="pt-0.5 flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    100% Genuine PDF
                  </span>
                  <span>•</span>
                  <span>Lifetime Access</span>
                  <span>•</span>
                  <span>Razorpay Secured</span>
                </div>
              </div>

              {/* Right Column: 3D Book Cover on Podium (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => setPreviewBook(currentBook)}
                >
                  <div className="absolute inset-0 bg-[#FDB813]/25 rounded-full blur-2xl transform scale-110 -z-10 group-hover:scale-125 transition-transform duration-500" />

                  <div className="relative transform group-hover:-translate-y-1.5 transition-transform duration-300 shadow-2xl rounded-lg">
                    <BookCover book={currentBook} size="md" />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-full bg-white/95 text-[#0F2754] text-[11px] font-bold shadow-lg flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-[#FDB813]" />
                        Read Sample
                      </span>
                    </div>
                  </div>

                  {discountPercent > 0 && (
                    <div className="absolute -top-2.5 -right-2.5 z-30 bg-[#FDB813] text-[#0F1D36] text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg border border-white flex items-center gap-0.5">
                      <span>{discountPercent}% OFF</span>
                    </div>
                  )}

                  <div className="w-36 h-3 bg-gradient-to-r from-transparent via-slate-400/30 to-transparent blur-xs mx-auto mt-2 rounded-full" />
                </div>

                <Link
                  href={`/books/${currentBook.slug}`}
                  className="mt-2.5 text-[11px] font-bold text-[#153D78] hover:text-[#0F2754] flex items-center gap-1 group"
                >
                  <span>View Details & Chapters</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* MOBILE LAYOUT (< lg): Compact, screen-optimized side-by-side card */}
            <div className="lg:hidden space-y-2.5">
              {/* Upper row: Book cover on left + Essential metadata on right */}
              <div className="flex items-center gap-3.5 bg-white/80 border border-slate-200/90 rounded-2xl p-3 shadow-xs">
                {/* Book Cover thumbnail with discount badge */}
                <div
                  className="relative shrink-0 cursor-pointer"
                  onClick={() => setPreviewBook(currentBook)}
                >
                  <BookCover book={currentBook} size="sm" />
                  {discountPercent > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#FDB813] text-[#0F1D36] text-[9px] font-black px-1.5 py-0.5 rounded-full border border-white shadow-xs">
                      {discountPercent}%
                    </span>
                  )}
                </div>

                {/* Right side info */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5">
                    {currentBook.badge && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#FEF08A] text-[#854D0E]">
                        {currentBook.badge}
                      </span>
                    )}
                    <span className="text-[10px] text-blue-700 font-bold truncate">
                      {currentBook.categoryName}
                    </span>
                  </div>

                  <h2 className="text-base font-black text-[#0F1D36] leading-tight truncate">
                    <Link href={`/books/${currentBook.slug}`}>
                      {currentBook.title}
                    </Link>
                  </h2>

                  <p className="text-xs text-slate-600 truncate">
                    By {currentBook.author}
                  </p>

                  <div className="flex items-center gap-1 text-[11px]">
                    <div className="flex text-[#F59E0B]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(currentBook.rating)
                              ? "fill-[#F59E0B]"
                              : "fill-slate-200 text-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-slate-800">
                      {currentBook.rating}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-lg font-black text-[#0F1D36]">
                      {siteConfig.currency.symbol}
                      {currentBook.price}
                    </span>
                    {currentBook.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        {siteConfig.currency.symbol}
                        {currentBook.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Middle synopsis (1-2 lines) */}
              <p className="text-[11px] text-slate-600 line-clamp-2 px-1">
                {currentBook.shortDescription || currentBook.description}
              </p>

              {/* Mobile Actions: Add to Cart & Read Sample & Wishlist */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#FDB813] hover:bg-[#E5A50F] text-[#0F1D36] font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{inCart ? "In Cart" : "Add to Cart"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewBook(currentBook)}
                  className="py-2.5 px-3 rounded-xl bg-white text-slate-700 font-bold text-xs border border-slate-300 flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#153D78]" />
                  <span>Sample</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(currentBook)}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    inWishlist
                      ? "bg-rose-50 border-rose-300 text-rose-600"
                      : "bg-white border-slate-300 text-slate-500"
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      inWishlist ? "fill-rose-500 text-rose-500" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. EXPLORE ALL FEATURED TITLES (100% visible on screen)  */}
          {/* ======================================================== */}
          <div className="pt-2 sm:pt-2.5 border-t border-slate-200/80 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                Explore All Featured Titles:
              </span>
              <div className="flex items-center gap-1">
                {books.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx
                        ? "w-5 bg-[#0F2754]"
                        : "w-1.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail cards: responsive horizontal scroll on mobile, 5-col grid on desktop */}
            <div className="flex lg:grid lg:grid-cols-5 gap-2 overflow-x-auto pb-1 no-scrollbar">
              {books.map((book, idx) => {
                const isActive = currentIndex === idx;
                return (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex items-center gap-2 p-1.5 sm:p-2 rounded-xl text-left transition-all cursor-pointer border shrink-0 w-44 lg:w-auto ${
                      isActive
                        ? "bg-white border-[#FDB813] ring-2 ring-[#FDB813]/40 shadow-sm"
                        : "bg-white/80 hover:bg-white border-slate-200/80 shadow-2xs"
                    }`}
                  >
                    <div className="shrink-0">
                      <BookCover book={book} size="xs" showBadge={false} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[11px] sm:text-xs font-bold truncate ${
                          isActive ? "text-[#0F2754]" : "text-slate-800"
                        }`}
                      >
                        {book.title}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {book.author}
                      </p>
                      <p className="text-[11px] font-extrabold text-[#0F2754] mt-0.5">
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
