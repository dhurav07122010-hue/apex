"use client";

import React, { useState } from "react";
import { Book } from "@/types";
import { X, BookOpen, ListOrdered, CheckCircle2, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site";

interface BookPreviewModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export function BookPreviewModal({ book, isOpen, onClose }: BookPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<"sample" | "toc" | "highlights">("sample");
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(book.id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-4 bg-zinc-50/70 dark:bg-zinc-950/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {book.categoryName}
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {book.format} • {book.fileSize}
              </span>
            </div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
              {book.title}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">By {book.author}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-5 bg-white dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => setActiveTab("sample")}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === "sample"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Sample Reading
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("toc")}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === "toc"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            Table of Contents ({book.tableOfContents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("highlights")}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === "highlights"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Key Takeaways
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === "sample" && (
            <div className="space-y-6">
              {book.previewChapters.map((chap, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-50 dark:bg-zinc-950/50 p-4 sm:p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800"
                >
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base mb-2">
                    {chap.title}
                  </h4>
                  <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-line italic">
                    "{chap.excerpt}"
                  </p>
                </div>
              ))}
              <div className="text-center p-4 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40">
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  This preview contains select excerpts. Purchase the full eBook to unlock all {book.pageCount} pages and lifetime updates.
                </p>
              </div>
            </div>
          )}

          {activeTab === "toc" && (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {book.tableOfContents.map((chapter, i) => (
                <div key={i} className="py-2.5 flex items-start gap-3">
                  <span className="text-xs font-mono font-bold text-zinc-400 w-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {chapter}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "highlights" && (
            <div className="space-y-3">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                What you will gain from this eBook:
              </p>
              <ul className="space-y-2.5">
                {book.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-800 dark:text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40 flex items-center justify-between gap-4">
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
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                addToCart(book);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-sm ${
                inCart
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {inCart ? (
                <>
                  <Check className="w-4 h-4" />
                  In Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
