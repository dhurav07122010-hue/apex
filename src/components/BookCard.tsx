"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Book } from "@/types";
import { BookCover } from "./BookCover";
import { Star, ShoppingCart, Check, Eye, Heart, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { siteConfig } from "@/config/site";
import { BookPreviewModal } from "./BookPreviewModal";

interface BookCardProps {
  book: Book;
  viewMode?: "grid" | "list";
}

export function BookCard({ book, viewMode = "grid" }: BookCardProps) {
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const inCart = isInCart(book.id);
  const inWishlist = isInWishlist(book.id);

  const discountPercent = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  if (viewMode === "list") {
    return (
      <>
        <div className="group bg-white border border-[#E2E8F0] hover:border-[#2878D0] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 hover:shadow-md transition-all">
          <Link href={`/books/${book.slug}`} className="shrink-0 flex justify-center">
            <BookCover book={book} size="md" />
          </Link>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EAF3FF] text-[#153D78]">
                  {book.categoryName}
                </span>
                {book.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wide">
                    {book.badge}
                  </span>
                )}
                <span className="text-[11px] text-slate-500 font-mono">
                  {book.format} • {book.fileSize}
                </span>
              </div>

              <Link href={`/books/${book.slug}`}>
                <h3 className="font-bold text-base sm:text-lg text-[#0F1D36] group-hover:text-[#2878D0] transition-colors line-clamp-1">
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
                  <span className="text-[11px] text-slate-400">({book.reviewCount} verified reviews)</span>
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
                <span className="text-2xl font-black text-[#153D78]">
                  {siteConfig.currency.symbol}
                  {book.price}
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
                  onClick={() => toggleWishlist(book)}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    inWishlist
                      ? "bg-rose-50 border-rose-200 text-rose-600"
                      : "border-[#E2E8F0] text-slate-400 hover:text-rose-600 hover:bg-[#F4F6FA]"
                  }`}
                  title={inWishlist ? "Remove from Wishlist" : "Save to Wishlist"}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? "fill-rose-500" : ""}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-[#CBD5E1] hover:bg-[#F4F6FA] text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <Link
                  href={`/books/${book.slug}`}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl border border-[#153D78] text-[#153D78] hover:bg-[#EAF3FF] transition-colors"
                >
                  View Details
                </Link>

                <button
                  type="button"
                  onClick={() => addToCart(book)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    inCart
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-[#153D78] hover:bg-[#1B5EB0] text-white"
                  }`}
                >
                  {inCart ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>In Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
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

  // Grid view (Standard Editorial Card)
  return (
    <>
      <div className="group bg-white border border-[#E2E8F0] hover:border-[#2878D0] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative">
        {/* Wishlist Floating Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(book)}
          className={`absolute top-5 right-5 z-20 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-xs ${
            inWishlist
              ? "bg-rose-50 text-rose-600 border border-rose-200"
              : "bg-white/90 text-slate-400 hover:text-rose-600 hover:bg-white border border-slate-200/80"
          }`}
          title={inWishlist ? "Saved in Wishlist" : "Add to Wishlist"}
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? "fill-rose-500" : ""}`} />
        </button>

        <div>
          {/* Cover Container with bookstore podium */}
          <div className="relative flex justify-center py-4 bg-[#F4F6FA] rounded-xl overflow-hidden mb-3 border border-slate-100">
            <Link
              href={`/books/${book.slug}`}
              className="transition-transform duration-300 group-hover:scale-105"
            >
              <BookCover book={book} size="md" />
            </Link>

            {/* Quick Sample Preview Eye Button */}
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-slate-700 hover:text-[#153D78] text-[11px] font-semibold shadow-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer border border-slate-200"
              title="Quick sample preview"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          {/* Book Info */}
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-1 text-[11px]">
              <span className="font-bold text-[#153D78] uppercase tracking-wider truncate text-[10px] bg-[#EAF3FF] px-2 py-0.5 rounded-full">
                {book.categoryName}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {book.format}
              </span>
            </div>

            <Link href={`/books/${book.slug}`}>
              <h3 className="font-bold text-sm text-[#0F1D36] group-hover:text-[#2878D0] transition-colors line-clamp-2 leading-snug mt-1.5">
                {book.title}
              </h3>
            </Link>

            <p className="text-xs text-slate-500 line-clamp-1">
              By {book.author}
            </p>

            {/* Rating (Only shown when genuine rating data exists) */}
            {book.rating > 0 ? (
              <div className="flex items-center gap-1.5 pt-0.5 text-xs">
                <div className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="ml-1 font-bold text-slate-800 text-[11px]">
                    {book.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  ({book.reviewCount})
                </span>
              </div>
            ) : (
              <div className="h-4" />
            )}
          </div>
        </div>

        {/* Pricing & CTA Controls */}
        <div className="mt-3.5 pt-3 border-t border-[#E2E8F0] space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-[#153D78]">
                {siteConfig.currency.symbol}
                {book.price}
              </span>
              {book.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {siteConfig.currency.symbol}
                  {book.originalPrice}
                </span>
              )}
            </div>

            {discountPercent > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Action Buttons: View Details & Add to Cart */}
          <div className="grid grid-cols-2 gap-1.5">
            <Link
              href={`/books/${book.slug}`}
              className="py-2 px-2 rounded-xl text-center text-xs font-bold border border-[#CBD5E1] text-slate-700 hover:bg-[#F4F6FA] hover:text-[#153D78] transition-colors"
            >
              Details
            </Link>

            <button
              type="button"
              onClick={() => addToCart(book)}
              className={`py-2 px-2 rounded-xl text-center text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs ${
                inCart
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-[#153D78] hover:bg-[#1B5EB0] text-white"
              }`}
            >
              {inCart ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
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
