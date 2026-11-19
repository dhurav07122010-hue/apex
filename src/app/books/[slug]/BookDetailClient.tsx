"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Book } from "@/types";
import { BookCover } from "@/components/BookCover";
import { BookCard } from "@/components/BookCard";
import { BookPreviewModal } from "@/components/BookPreviewModal";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { siteConfig } from "@/config/site";
import {
  Star,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Eye,
  Heart,
  Check,
  BookOpen,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface BookDetailClientProps {
  book: Book;
  relatedBooks: Book[];
}

export function BookDetailClient({ book, relatedBooks }: BookDetailClientProps) {
  const router = useRouter();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "learn" | "specs" | "reviews">("description");
  const [activeThumbnail, setActiveThumbnail] = useState(0);

  const inCart = isInCart(book.id);
  const inWishlist = isInWishlist(book.id);

  const discountPercent = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  const handleBuyNow = () => {
    if (!inCart) {
      addToCart(book);
    }
    router.push("/checkout");
  };

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* ======================================================== */}
        {/* BREADCRUMB NAVIGATION (Home > Category > Title)          */}
        {/* ======================================================== */}
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#0F2754]">
            Home
          </Link>
          <span>&gt;</span>
          <Link
            href={`/categories/${book.category}`}
            className="hover:text-[#0F2754] text-slate-600"
          >
            {book.categoryName}
          </Link>
          <span>&gt;</span>
          <span className="font-bold text-[#0F1D36] truncate">{book.title}</span>
        </nav>

        {/* ======================================================== */}
        {/* PRODUCT DETAIL CONTAINER                                 */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT COLUMN: Large Cover + Thumbnails + Sample Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Podium Surface */}
            <div className="w-full bg-[#FAF9F5] rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center border border-slate-200/90 shadow-xs relative">
              <BookCover book={book} size="xl" className="shadow-2xl" />
            </div>

            {/* 3 Thumbnails Underneath (Matching reference image) */}
            <div className="flex items-center gap-3 mt-4">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveThumbnail(idx)}
                  className={`w-16 h-20 rounded-lg p-1 border-2 transition-all cursor-pointer overflow-hidden flex items-center justify-center bg-[#FAF9F5] ${
                    activeThumbnail === idx
                      ? "border-[#0F2754] shadow-sm"
                      : "border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100"
                  }`}
                >
                  <BookCover book={book} size="xs" showBadge={false} />
                </button>
              ))}
            </div>

            {/* Preview Sample Button */}
            <div className="mt-4 w-full">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Eye className="w-4 h-4 text-slate-600" />
                <span>Preview Sample</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Title, Pricing, Actions, Trust Indicators */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#0F1D36] tracking-tight">
                {book.title}
              </h1>
              <p className="text-sm font-semibold text-slate-500 mt-1">
                {book.author}
              </p>

              {/* Star Rating & Verified Count */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-black text-[#0F1D36]">{book.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-400">
                  ({book.reviewCount.toLocaleString()} reviews)
                </span>
              </div>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-black text-[#0F1D36]">
                {siteConfig.currency.symbol}
                {book.price}
              </span>
              {book.originalPrice && (
                <span className="text-base text-slate-400 line-through">
                  {siteConfig.currency.symbol}
                  {book.originalPrice}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Description Summary */}
            <p className="text-sm text-slate-600 leading-relaxed border-t border-b border-slate-100 py-3">
              {book.shortDescription}
            </p>

            {/* Primary Action Buttons: Add to Cart & Buy Now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Add to Cart (Navy Blue) */}
              <button
                type="button"
                onClick={() => addToCart(book)}
                className={`py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  inCart
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-[#0F2754] text-white hover:bg-[#153D78]"
                }`}
              >
                {inCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>In Shopping Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              {/* Buy Now (Golden Yellow) */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="py-3.5 px-6 rounded-xl font-black text-xs sm:text-sm bg-[#FDB813] hover:bg-amber-400 text-[#0F1D36] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Add to Wishlist Full-width Outline Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(book)}
              className={`w-full py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                inWishlist
                  ? "bg-rose-50 border-rose-300 text-rose-600"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
              }`}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? "fill-rose-500" : ""}`} />
              <span>{inWishlist ? "Saved in Wishlist" : "Add to Wishlist"}</span>
            </button>

            {/* Trust Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#153D78] flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-[#2563EB]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0F1D36]">Instant Delivery</h4>
                  <p className="text-[11px] text-slate-500">Get your eBook instantly</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#153D78] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0F1D36]">Secure Payment</h4>
                  <p className="text-[11px] text-slate-500">100% secure checkout</p>
                </div>
              </div>
            </div>

            {/* Content Tabs: Description | What You'll Learn | Specifications | Reviews */}
            <div className="pt-6 border-t border-slate-200">
              <div className="flex items-center gap-4 sm:gap-8 border-b border-slate-200 text-xs font-bold overflow-x-auto pb-px">
                <button
                  type="button"
                  onClick={() => setActiveTab("description")}
                  className={`pb-2.5 whitespace-nowrap cursor-pointer transition-colors border-b-2 ${
                    activeTab === "description"
                      ? "border-[#0F2754] text-[#0F2754]"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Description
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("learn")}
                  className={`pb-2.5 whitespace-nowrap cursor-pointer transition-colors border-b-2 ${
                    activeTab === "learn"
                      ? "border-[#0F2754] text-[#0F2754]"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  What You&apos;ll Learn
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("specs")}
                  className={`pb-2.5 whitespace-nowrap cursor-pointer transition-colors border-b-2 ${
                    activeTab === "specs"
                      ? "border-[#0F2754] text-[#0F2754]"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Specifications
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("reviews")}
                  className={`pb-2.5 whitespace-nowrap cursor-pointer transition-colors border-b-2 ${
                    activeTab === "reviews"
                      ? "border-[#0F2754] text-[#0F2754]"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Reviews ({book.reviewCount.toLocaleString()})
                </button>
              </div>

              {/* Tab Contents */}
              <div className="pt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeTab === "description" && (
                  <div className="space-y-3">
                    <p className="whitespace-pre-line">{book.description}</p>
                  </div>
                )}

                {activeTab === "learn" && (
                  <ul className="space-y-2">
                    {book.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === "specs" && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <p className="text-slate-400 font-semibold">Format</p>
                      <p className="font-bold text-[#0F1D36]">{book.format} (Digital)</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold">Pages</p>
                      <p className="font-bold text-[#0F1D36]">{book.pageCount} Pages</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold">File Size</p>
                      <p className="font-bold text-[#0F1D36]">{book.fileSize}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold">Language</p>
                      <p className="font-bold text-[#0F1D36]">{book.language}</p>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-amber-50/60 p-4 rounded-xl border border-amber-200/60">
                      <div className="text-2xl font-black text-[#0F1D36]">{book.rating.toFixed(1)}</div>
                      <div>
                        <div className="flex items-center text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Based on {book.reviewCount.toLocaleString()} verified reader ratings
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1">
                      <p className="font-bold text-xs text-[#0F1D36]">Verified Customer</p>
                      <p className="text-xs text-slate-500 italic">
                        &ldquo;Incredible read! The digital PDF was crystal clear on my tablet, and the insights are immediately actionable.&rdquo;
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RELATED PRODUCTS SECTION                                 */}
        {/* ======================================================== */}
        {relatedBooks.length > 0 && (
          <div className="pt-10 border-t border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 rounded-full bg-[#FDB813]" />
                <h3 className="text-xl sm:text-2xl font-black text-[#0F1D36]">
                  Readers Also Bought
                </h3>
              </div>
              <Link
                href="/books"
                className="text-xs sm:text-sm font-bold text-[#153D78] hover:underline"
              >
                Explore More
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedBooks.slice(0, 4).map((related) => (
                <BookCard key={related.id} book={related} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Free Sample Preview Modal */}
      <BookPreviewModal
        book={book}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
