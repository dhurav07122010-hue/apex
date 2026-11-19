import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { MOCK_BOOKS } from "@/data/mock-books";
import { BookCard } from "@/components/BookCard";
import { CategoryIcon } from "@/components/CategoryIcons";
import { ArrowLeft, Filter } from "lucide-react";
import { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return siteConfig.categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = siteConfig.categories.find((c) => c.slug === slug);
  if (!category) return { title: "Category Not Found — ApexBooks" };

  return {
    title: `${category.name} eBooks — ApexBooks`,
    description: category.description,
  };
}

export default async function IndividualCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = siteConfig.categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryBooks = MOCK_BOOKS.filter((b) => b.category === slug);

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#0F2754]">
            Home
          </Link>
          <span>&gt;</span>
          <Link href="/categories" className="hover:text-[#0F2754]">
            Categories
          </Link>
          <span>&gt;</span>
          <span className="font-bold text-[#0F1D36]">{category.name}</span>
        </nav>

        {/* Category Hero Banner */}
        <div
          className="rounded-3xl p-8 sm:p-12 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm"
          style={{ backgroundColor: category.bgColor }}
        >
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-black uppercase tracking-wider text-[#153D78] bg-white/80 px-3 py-1 rounded-full border border-black/5">
              Curated Category
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0F1D36] tracking-tight">
              {category.name}
            </h1>
            <p className="text-sm text-slate-700 leading-relaxed">
              {category.description}
            </p>
            <p className="text-xs font-bold text-slate-500 pt-1">
              Showing {categoryBooks.length} Available {categoryBooks.length === 1 ? "eBook" : "eBooks"}
            </p>
          </div>

          <div className="w-24 h-24 shrink-0 hidden sm:block">
            <CategoryIcon name={category.slug} className="w-24 h-24" />
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#0F1D36]">
              {category.name} Collection
            </h2>
            <Link
              href="/books"
              className="text-xs font-bold text-[#153D78] hover:underline"
            >
              Browse All Categories
            </Link>
          </div>

          {categoryBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoryBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <h3 className="text-lg font-black text-[#0F1D36]">
                New Titles Coming Soon
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                We are curating more high-quality eBooks for {category.name}. Check back soon or explore our other collections.
              </p>
              <Link
                href="/books"
                className="inline-block px-6 py-2.5 rounded-full bg-[#0F2754] text-white text-xs font-bold"
              >
                Browse All Books
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
