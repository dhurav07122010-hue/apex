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
  Heart,
  CreditCard,
  Clock,
  Layers,
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
  const [activeTab, setActiveTab] = useState<"overview" | "toc" | "specs">("overview");
  const [selectedFormat, setSelectedFormat] = useState<"ebook" | "physical">("ebook");
  const [copiedLink, setCopiedLink] = useState(false);

  const inCart = isInCart(book.id);
  const inWishlist = isInWishlist(book.id);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 bg-white">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
        <Link href="/" className="hover:text-[#153D78] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/books" className="hover:text-[#153D78] transition-colors">
          Bookstore
        </Link>
        <span>/</span>
        <Link
          href={`/books?category=${book.category}`}
          className="hover:text-[#153D78] transition-colors font-semibold"
        >
          {book.categoryName}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-bold truncate max-w-xs">{book.title}</span>
      </nav>

      {/* Primary Product Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Book Cover Display */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#F4F6FA] border border-[#E2E8F0] w-full flex flex-col items-center justify-center relative shadow-xs">
            {/* Wishlist Top Right Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(book)}
              className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-xs ${
                inWishlist
                  ? "bg-rose-50 text-rose-600 border border-rose-200"
                  : "bg-white text-slate-400 hover:text-rose-600 border border-slate-200"
              }`}
              title={inWishlist ? "Saved in Wishlist" : "Save to Wishlist"}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? "fill-rose-500" : ""}`} />
            </button>

            {/* Hardcover Book 3D Component */}
            <BookCover book={book} size="xl" className="shadow-2xl" />

            {/* Quick Actions Below Cover */}
            <div className="mt-8 flex items-center gap-3 w-full max-w-xs">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="flex-1 py-2.5 px-3 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#EAF3FF] hover:border-[#2878D0] text-xs font-bold text-[#153D78] flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#2878D0]" />
                <span>Read Free Sample</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#EAF3FF] text-slate-600 transition-colors cursor-pointer"
                title="Share eBook"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
            {copiedLink && (
              <span className="text-[11px] text-emerald-600 mt-2 font-medium">
                Link copied to clipboard!
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Title, Metadata, Pricing, Format Selector, CTAs */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <Link
                href={`/books?category=${book.category}`}
                className="text-xs font-bold px-3 py-0.5 rounded-full bg-[#EAF3FF] text-[#153D78] uppercase tracking-wider"
              >
                {book.categoryName}
              </Link>
              {book.badge && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {book.badge}
                </span>
              )}
              <span className="text-xs text-slate-500 font-mono">
                {book.format} Edition • {book.fileSize}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#0F1D36] tracking-tight leading-tight">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
                {book.subtitle}
              </p>
            )}

            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              By <strong className="text-slate-900">{book.author}</strong> • Published by{" "}
              <span className="font-semibold text-[#153D78]">Apex Digital Publishing</span>
            </p>

            {/* Ratings */}
            {book.rating > 0 && (
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="ml-1.5 text-sm font-bold text-slate-900">
                    {book.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-xs text-slate-400">({book.reviewCount} verified reader ratings)</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  100% In Stock
                </span>
              </div>
            )}
          </div>

          {/* Format Selector: Digital vs Physical Edition */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Book Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedFormat("ebook")}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedFormat === "ebook"
                    ? "border-[#153D78] bg-[#EAF3FF] ring-2 ring-[#153D78]/20"
                    : "border-[#E2E8F0] bg-white hover:bg-[#F4F6FA]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#0F1D36]">Digital eBook (PDF)</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    Instant
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Read immediately on any device</p>
                <div className="mt-2 text-sm font-black text-[#153D78]">
                  {siteConfig.currency.symbol}{book.price}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormat("physical")}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedFormat === "physical"
                    ? "border-[#153D78] bg-[#EAF3FF] ring-2 ring-[#153D78]/20"
                    : "border-[#E2E8F0] bg-white hover:bg-[#F4F6FA]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#0F1D36]">Physical Print</span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                    Pre-Order
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Collector&apos;s hardcover edition</p>
                <div className="mt-2 text-sm font-bold text-slate-500">
                  {book.originalPrice ? `${siteConfig.currency.symbol}${book.originalPrice}` : "₹999"}
                </div>
              </button>
            </div>
          </div>

          {/* Pricing & Checkout Box */}
          <div className="p-6 rounded-3xl bg-[#F4F6FA] border border-[#E2E8F0] space-y-4">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-[#153D78]">
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
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              <div className="text-right text-[11px] text-slate-500">
                <span>Inclusive of all digital GST</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => addToCart(book)}
                className={`py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                  inCart
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-[#153D78] hover:bg-[#1B5EB0] text-white"
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

              <button
                type="button"
                onClick={handleBuyNow}
                className="py-3.5 px-4 rounded-xl text-xs font-bold bg-[#2878D0] hover:bg-[#1B5EB0] text-white flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now (Instant Checkout)</span>
              </button>
            </div>

            {/* Instant Delivery Guarantee Strip */}
            <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Instant Download Link on Payment</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <ShieldCheck className="w-4 h-4 text-[#2878D0]" />
                <span>Razorpay 256-Bit SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Book Overview, Table of Contents, Specifications */}
      <div className="border-t border-[#E2E8F0] pt-10">
        <div className="flex items-center gap-4 border-b border-[#E2E8F0] pb-3 text-sm font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`pb-2 transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "text-[#153D78] border-b-2 border-[#153D78]"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            Book Synopsis & Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("toc")}
            className={`pb-2 transition-colors cursor-pointer ${
              activeTab === "toc"
                ? "text-[#153D78] border-b-2 border-[#153D78]"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            Table of Contents ({book.tableOfContents.length} Chapters)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("specs")}
            className={`pb-2 transition-colors cursor-pointer ${
              activeTab === "specs"
                ? "text-[#153D78] border-b-2 border-[#153D78]"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            Publishing Specifications
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-8 space-y-4">
                <h3 className="font-bold text-lg text-[#0F1D36]">About this Publication</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {book.description}
                </p>

                {book.authorBio && (
                  <div className="mt-6 p-5 rounded-2xl bg-[#F4F6FA] border border-[#E2E8F0] space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                      About the Author
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {book.authorBio}
                    </p>
                  </div>
                )}
              </div>

              {/* Highlights sidebar */}
              <div className="md:col-span-4 p-5 rounded-2xl bg-[#EAF3FF] border border-[#BFDBFE] space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#153D78]">
                  What You Will Learn
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2878D0] shrink-0 mt-0.5" />
                    <span>Real-world practical paradigms and production code patterns.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2878D0] shrink-0 mt-0.5" />
                    <span>Architectural trade-offs, benchmarks, and best practices.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2878D0] shrink-0 mt-0.5" />
                    <span>Verified self-assessment problems and interview syllabus guides.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "toc" && (
            <div className="space-y-3 max-w-3xl">
              <h3 className="font-bold text-lg text-[#0F1D36]">Curriculum & Chapter Outline</h3>
              <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-2xl bg-white overflow-hidden">
                {book.tableOfContents.map((chapter, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-[#F4F6FA]">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#EAF3FF] text-[#153D78] font-bold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800">{chapter}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Chapter {idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-2xl bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
              <table className="w-full text-left text-xs">
                <tbody className="divide-y divide-[#E2E8F0]">
                  <tr className="hover:bg-[#F4F6FA]">
                    <td className="py-3 px-4 font-bold text-slate-600 w-1/3">Digital Format</td>
                    <td className="py-3 px-4 font-mono text-slate-800">{book.format} (DRM-Free Universal)</td>
                  </tr>
                  <tr className="hover:bg-[#F4F6FA]">
                    <td className="py-3 px-4 font-bold text-slate-600">File Size</td>
                    <td className="py-3 px-4 font-mono text-slate-800">{book.fileSize}</td>
                  </tr>
                  <tr className="hover:bg-[#F4F6FA]">
                    <td className="py-3 px-4 font-bold text-slate-600">Print Length</td>
                    <td className="py-3 px-4 text-slate-800">{book.pageCount} Pages</td>
                  </tr>
                  <tr className="hover:bg-[#F4F6FA]">
                    <td className="py-3 px-4 font-bold text-slate-600">Language</td>
                    <td className="py-3 px-4 text-slate-800">{book.language}</td>
                  </tr>
                  <tr className="hover:bg-[#F4F6FA]">
                    <td className="py-3 px-4 font-bold text-slate-600">ISBN-13</td>
                    <td className="py-3 px-4 font-mono text-slate-800">{book.isbn}</td>
                  </tr>
                  <tr className="hover:bg-[#F4F6FA]">
                    <td className="py-3 px-4 font-bold text-slate-600">Publication Year</td>
                    <td className="py-3 px-4 text-slate-800">{book.publishedYear}</td>
                  </tr>
                  <tr className="hover:bg-[#F4F6FA]">
                    <td className="py-3 px-4 font-bold text-slate-600">Digital Delivery</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">Instant Signed Download via Private Vault</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Related Books in Discipline */}
      {relatedBooks.length > 0 && (
        <div className="pt-12 border-t border-[#E2E8F0] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#0F1D36]">
                More Books in {book.categoryName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Readers who explored this title also recommended:
              </p>
            </div>

            <Link
              href={`/books?category=${book.category}`}
              className="text-xs font-bold text-[#153D78] hover:text-[#2878D0] flex items-center gap-1"
            >
              <span>View category</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedBooks.map((related) => (
              <BookCard key={related.id} book={related} />
            ))}
          </div>
        </div>
      )}

      {/* Free Sample Preview Modal */}
      <BookPreviewModal
        book={book}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
