import React, { Suspense } from "react";
import { BooksClient } from "./BooksClient";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Book Storefront & Catalogue — ApexBooks",
  description: "Browse, filter and find top-tier eBooks and physical books across programming, business, exams, science, finance and literature.",
};

export default function BooksPage() {
  return (
    <div className="bg-[#F4F6FA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-[#153D78] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#153D78] font-bold">Books & Catalogue</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2878D0] mb-1.5">
            <BookOpen className="w-4 h-4 text-[#153D78]" />
            <span>eBook Storefront & Curated Catalogue</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#153D78] tracking-tight">
            Bookstore Catalogue
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Explore authentic, handpicked publications with verified digital PDF delivery and physical collector's edition pre-orders.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="py-20 text-center text-slate-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-[#153D78] border-t-transparent mb-4" />
              <p className="text-sm font-semibold text-[#153D78]">Filtering and loading bookstore catalogue...</p>
            </div>
          }
        >
          <BooksClient />
        </Suspense>
      </div>
    </div>
  );
}
