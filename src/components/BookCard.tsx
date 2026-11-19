"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Book } from "@/types";
import { BookCover } from "./BookCover";
import { Star, Heart, Eye } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { siteConfig } from "@/config/site";
import { BookPreviewModal } from "./BookPreviewModal";

interface BookCardProps {
  book: Book;
  viewMode?: "grid" | "list";
}

export function BookCard({ book, viewMode = "grid" }: BookCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const inWishlist = mounted ? isInWishlist(book.id) : false;

  const discountPercent = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  // Badge styling
  const getBadgeStyle = (badge?: string) => {
    switch (badge?.toLowerCase()) {
      case "free demo":
      case "free":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 font-black";
      case "bestseller":
        return "bg-[#FEF08A] text-[#854D0E] border-[#FDE047]";
      case "featured":
        return "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]";
      case "new":
        return "bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]";
      default:
        return "bg-amber-100 text-amber-900 border-amber-200";
    }
  };

  if (viewMode === "list") {
    return (
      <>
        <div className="group bg-white border border-[#E2E8F0] hover:border-[#153D78] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 hover:shadow-lg transition-all duration-300">
          <Link href={`/books/${book.slug}`} className="shrink-0 flex justify-center">
            <BookCover book={book} size="md" />
          </Link>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {book.badge && (
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border uppercase tracking-wider ${getBadgeStyle(
                      book.badge
                    )}`}
                  >
                    {book.badge}
                  </span>
                )}
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {book.categoryName}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {book.format} • {book.fileSize}
                </span>
              </div>

              <Link href={`/books/${book.slug}`}>
                <h3 className="font-bold text-base sm:text-lg text-[#0F1D36] group-hover:text-[#153D78] transition-colors line-clamp-1">
                  {book.title}
                </h3>
              </Link>
              <p className="text-xs text-slate-500 mt-0.5">By {book.author}</p>

              {book.rating > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="ml-1 text-xs font-bold text-slate-800">
                      {book.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    ({book.reviewCount.toLocaleString()} reviews)
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[11px] text-slate-500">{book.pageCount} pages</span>
                </div>
              )}

              <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                {book.shortDescription}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-black ${book.price === 0 ? "text-emerald-600" : "text-[#0F1D36]"}`}>
                  {book.price === 0 ? "FREE" : `${siteConfig.currency.symbol}${book.price}`}
                </span>
                {book.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    {siteConfig.currency.symbol}
                    {book.originalPrice}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(book)}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    inWishlist
                      ? "bg-rose-50 border-rose-200 text-rose-600"
                      : "border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200"
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? "fill-rose-500" : ""}`} />
                </button>

                <Link
                  href={`/books/${book.slug}`}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#0F2754] hover:bg-[#153D78] text-white transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>

        <BookPreviewModal
          book={book}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
        />
      </>
    );
  }

  // Grid view (Exact layout from the reference image)
  return (
    <>
      <div className="group bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-2xl p-4 flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative">
        <div>
          {/* Top-left Badge (as seen in the reference image) */}
          <div className="h-6 flex items-center mb-2">
            {book.badge ? (
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border tracking-wide uppercase ${getBadgeStyle(
                  book.badge
                )}`}
              >
                {book.badge}
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded text-slate-400">
                &nbsp;
              </span>
            )}
          </div>

          {/* Book Cover Center Stage */}
          <div className="relative flex justify-center py-2 overflow-hidden mb-3">
            <Link
              href={`/books/${book.slug}`}
              className="block"
            >
              <BookCover book={book} size="md" />
            </Link>
          </div>

          {/* Title & Author */}
          <div className="space-y-0.5">
            <Link href={`/books/${book.slug}`}>
              <h3 className="font-bold text-sm text-[#0F1D36] group-hover:text-[#153D78] transition-colors line-clamp-1 leading-snug">
                {book.title}
              </h3>
            </Link>
            <p className="text-xs text-slate-500 line-clamp-1">{book.author}</p>
          </div>
        </div>

        {/* Pricing Row & Action Buttons */}
        <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] space-y-3">
          <div className="flex items-baseline gap-2">
            <span className={`text-lg font-black ${book.price === 0 ? "text-emerald-600" : "text-[#0F1D36]"}`}>
              {book.price === 0 ? "FREE" : `${siteConfig.currency.symbol}${book.price}`}
            </span>
            {book.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                {siteConfig.currency.symbol}
                {book.originalPrice}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Two Buttons: [ View Details ] + [ Heart ] (Exact match to reference image) */}
          <div className="flex items-center gap-2">
            <Link
              href={`/books/${book.slug}`}
              className="flex-1 py-2 px-3 rounded-lg text-center text-xs font-bold bg-[#0F2754] hover:bg-[#153D78] text-white transition-colors shadow-sm"
            >
              View Details
            </Link>

            <button
              type="button"
              onClick={() => toggleWishlist(book)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                inWishlist
                  ? "bg-rose-50 border-rose-300 text-rose-600"
                  : "border-slate-300 text-slate-500 hover:text-rose-600 hover:border-rose-300 bg-white"
              }`}
              title={inWishlist ? "Saved in Wishlist" : "Add to Wishlist"}
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${inWishlist ? "fill-rose-500" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <BookPreviewModal
        book={book}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}
