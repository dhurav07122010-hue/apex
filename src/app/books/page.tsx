import React, { Suspense } from "react";
import { BooksClient } from "./BooksClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "eBook Storefront & Catalogue — Browse All Categories",
  description: "Browse, filter and find top-tier eBooks across programming, business, exams, science, finance and literature.",
};

export default function BooksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header is SSR rendered for SEO & immediate display */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
          eBook Storefront
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Explore our curated catalogue with instant cryptographic digital delivery.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="py-16 text-center text-zinc-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4" />
            <p className="text-sm">Filtering and loading eBook catalogue...</p>
          </div>
        }
      >
        <BooksClient />
      </Suspense>
    </div>
  );
}
