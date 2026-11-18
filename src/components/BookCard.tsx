"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Book } from "@/types";
import { BookCover } from "./BookCover";
import { Star, ShoppingCart, Check, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site";
import { BookPreviewModal } from "./BookPreviewModal";

interface BookCardProps {
  book: Book;
  viewMode?: "grid" | "list";
}

export function BookCard({ book, viewMode = "grid" }: BookCardProps) {
  const { addToCart, isInCart } = useCart();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const inCart = isInCart(book.id);

  const discountPercent = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  if (viewMode === "list") {
    return (
      <>
        <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 md:p-5 flex flex-col sm:flex-row gap-5 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
          <Link href={`/books/${book.slug}`} className="shrink-0 flex justify-center">
            <BookCover book={book} size="md" />
          </Link>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                  {book.categoryName}
                </span>
                {book.badge && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    {book.badge}
                  </span>
                )}
                <span className="text-xs text-zinc-500 font-mono">
                  {book.format} • {book.fileSize}
                </span>
              </div>

              <Link href={`/books/${book.slug}`}>
                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {book.title}
                </h3>
              </Link>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">By {book.author}</p>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="ml-1 text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    {book.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-xs text-zinc-400">({book.reviewCount} reviews)</span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span className="text-xs text-zinc-500">{book.pageCount} pages</span>
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2">
                {book.shortDescription}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
                  {siteConfig.currency.symbol}
                  {book.price}
                </span>
                {book.originalPrice && (
                  <span className="text-sm text-zinc-400 line-through">
                    {siteConfig.currency.symbol}
                    {book.originalPrice}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="px-3 py-2 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Sample Preview
                </button>
                <button
                  type="button"
                  onClick={() => addToCart(book)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    inCart
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  }`}
                >
                  {inCart ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      In Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add to Cart
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

  // Grid view
  return (
    <>
      <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col justify-between hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
        <div>
          {/* Cover Container */}
          <div className="relative flex justify-center py-2 bg-gradient-to-b from-zinc-50 to-zinc-100/50 dark:from-zinc-950 dark:to-zinc-900/40 rounded-lg overflow-hidden mb-3">
            <Link href={`/books/${book.slug}`} className="transition-transform group-hover:scale-105 duration-300">
              <BookCover book={book} size="md" />
            </Link>
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Preview sample chapter"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Book Info */}
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-1 text-[11px]">
              <span className="font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider truncate">
                {book.categoryName}
              </span>
              <span className="text-zinc-400 font-mono shrink-0">{book.format}</span>
            </div>

            <Link href={`/books/${book.slug}`}>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                {book.title}
              </h3>
            </Link>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">By {book.author}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="ml-1 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                {book.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-[11px] text-zinc-400">({book.reviewCount})</span>
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-zinc-900 dark:text-zinc-50">
                {siteConfig.currency.symbol}
                {book.price}
              </span>
              {book.originalPrice && (
                <span className="text-[11px] text-zinc-400 line-through">
                  {siteConfig.currency.symbol}
                  {book.originalPrice}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => addToCart(book)}
            className={`p-2.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              inCart
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            }`}
            title={inCart ? "Already in cart" : "Add to cart"}
          >
            {inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
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
