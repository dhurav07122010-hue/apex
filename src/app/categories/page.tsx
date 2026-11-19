import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { MOCK_BOOKS } from "@/data/mock-books";
import { CategoryIcon } from "@/components/CategoryIcons";
import { ArrowRight, BookOpen } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Categories — ApexBooks",
  description: "Browse all curated knowledge tracks across fiction, business, self-improvement, technology, programming, and competitive examinations.",
};

export default function CategoriesPage() {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#0F2754]">
            Home
          </Link>
          <span>&gt;</span>
          <span className="font-bold text-[#0F1D36]">Categories</span>
        </nav>

        {/* Heading */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-[#FDB813]" />
            <h1 className="text-3xl sm:text-4xl font-black text-[#0F1D36] tracking-tight">
              Explore by Category
            </h1>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Select from our 8 curated literary and professional disciplines. Each collection is vetted for editorial depth, accuracy, and formatting excellence.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.categories.map((cat) => {
            const matchingBooks = MOCK_BOOKS.filter((b) => b.category === cat.slug);
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group p-6 rounded-3xl border border-slate-200/90 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
                style={{ backgroundColor: cat.bgColor }}
              >
                <div>
                  <div className="w-16 h-16 mb-4 transition-transform duration-300 group-hover:scale-110">
                    <CategoryIcon name={cat.slug} className="w-16 h-16" />
                  </div>

                  <h2 className="text-lg font-black text-[#0F1D36] group-hover:text-[#153D78] transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0F1D36]">
                    {matchingBooks.length} {matchingBooks.length === 1 ? "eBook" : "eBooks"}
                  </span>
                  <span className="font-bold text-[#153D78] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
