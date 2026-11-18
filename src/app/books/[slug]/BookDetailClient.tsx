"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Book } from "@/types";
import { BookCover } from "@/components/BookCover";
import { BookCard } from "@/components/BookCard";
import { BookPreviewModal } from "@/components/BookPreviewModal";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site";
import {
  Star,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Download,
  BookOpen,
  Calendar,
  FileText,
  Globe,
  Hash,
  CheckCircle2,
  Check,
  Eye,
  ArrowLeft,
  Share2,
} from "lucide-react";

interface BookDetailClientProps {
  book: Book;
  relatedBooks: Book[];
}

export function BookDetailClient({ book, relatedBooks }: BookDetailClientProps) {
  const router = useRouter();
  const { addToCart, isInCart } = useCart();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "toc" | "sample">("overview");
  const [copiedLink, setCopiedLink] = useState(false);

  const inCart = isInCart(book.id);

  const discountPercent = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  const handleBuyNow = () => {
    if (!inCart) {
      addToCart(book);
    }
    router.push("/cart");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/books" className="hover:text-blue-600 transition-colors">
          Storefront
        </Link>
        <span>/</span>
        <Link
          href={`/books?category=${book.category}`}
          className="hover:text-blue-600 transition-colors"
        >
          {book.categoryName}
        </Link>
        <span>/</span>
        <span className="text-zinc-800 dark:text-zinc-200 truncate max-w-xs">{book.title}</span>
      </nav>

      {/* Primary Product Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Book Cover Display */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900/60 dark:to-zinc-950 border border-zinc-200/80 dark:border-zinc-800 w-full flex flex-col items-center justify-center relative shadow-inner">
            <BookCover book={book} size="xl" className="shadow-2xl" />

            <div className="mt-8 flex items-center gap-3 w-full max-w-xs">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="flex-1 py-2.5 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4 text-blue-600" />
                <span>Read Free Sample</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
                title="Share eBook"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
            {copiedLink && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                Link copied to clipboard!
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Title, Metadata, Pricing, Purchase CTAs */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Link
                href={`/books?category=${book.category}`}
                className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 uppercase tracking-wider"
              >
                {book.categoryName}
              </Link>
              {book.badge && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                  {book.badge}
                </span>
              )}
              <span className="text-xs text-zinc-500 font-mono">
                {book.format} Edition • {book.fileSize}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="text-base text-zinc-600 dark:text-zinc-400 mt-2 font-medium">
                {book.subtitle}
              </p>
            )}

            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              Written by <strong className="text-zinc-900 dark:text-zinc-100">{book.author}</strong>
            </p>

            {/* Ratings */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="ml-1.5 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {book.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-zinc-400">({book.reviewCount} verified reader ratings)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50">
                {siteConfig.currency.symbol}
                {book.price}
              </span>
              {book.originalPrice && (
                <span className="text-base text-zinc-400 line-through">
                  {siteConfig.currency.symbol}
                  {book.originalPrice}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                  Save {discountPercent}% Today
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-500">
              One-time purchase. Includes DRM-clean {book.format} download and all future revisions.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Instant Buy Now</span>
              </button>

              <button
                type="button"
                onClick={() => addToCart(book)}
                className={`py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  inCart
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                }`}
              >
                {inCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>In Your Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-zinc-200/80 dark:border-zinc-800 text-[11px] text-zinc-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant Signed URL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Download className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Lifetime Downloads</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Print & Tablet Ready</span>
              </div>
            </div>
          </div>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs">
            <div>
              <p className="text-zinc-400 text-[11px]">Format</p>
              <p className="font-bold text-zinc-800 dark:text-zinc-200">{book.format}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-[11px]">Pages</p>
              <p className="font-bold text-zinc-800 dark:text-zinc-200">{book.pageCount} pages</p>
            </div>
            <div>
              <p className="text-zinc-400 text-[11px]">File Size</p>
              <p className="font-bold text-zinc-800 dark:text-zinc-200">{book.fileSize}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-[11px]">Language</p>
              <p className="font-bold text-zinc-800 dark:text-zinc-200">{book.language}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs: Overview, Table of Contents, Sample Reading */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-8">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Overview & Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("toc")}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "toc"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Table of Contents ({book.tableOfContents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sample")}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "sample"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Free Sample Reading
          </button>
        </div>

        <div className="py-6">
          {activeTab === "overview" && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                  About This eBook
                </h3>
                <p className="text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {book.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                  What You Will Learn & Key Takeaways
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {book.features.map((feat, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Author Bio Box */}
              <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  About the Author
                </h4>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {book.author}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  {book.authorBio}
                </p>
              </div>
            </div>
          )}

          {activeTab === "toc" && (
            <div className="max-w-3xl space-y-2">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                Full Curriculum & Contents
              </h3>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 p-4">
                {book.tableOfContents.map((chapter, i) => (
                  <div key={i} className="py-3 flex items-center gap-4">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 w-8">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      {chapter}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "sample" && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Sample Chapter Excerpts
                </h3>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Full Screen Reader</span>
                </button>
              </div>

              {book.previewChapters.map((chap, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3"
                >
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                    {chap.title}
                  </h4>
                  <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed italic whitespace-pre-line">
                    "{chap.excerpt}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-10">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 mb-6">
            More in {book.categoryName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBooks.map((relBook) => (
              <BookCard key={relBook.id} book={relBook} />
            ))}
          </div>
        </div>
      )}

      {/* Modal reader */}
      <BookPreviewModal
        book={book}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
