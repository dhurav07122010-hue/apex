import React, { Suspense } from "react";
import { BooksClient } from "./BooksClient";
import { getStorefrontBooks, getStorefrontCategories } from "@/lib/storefront";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All eBooks & Curated Catalogue — ApexBooks",
  description:
    "Browse, filter and find premium digital eBooks across business, self-improvement, technology, programming, and competitive examinations.",
};

export default async function BooksPage() {
  const [books, categories] = await Promise.all([
    getStorefrontBooks(),
    getStorefrontCategories(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-slate-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-[#0F2754] border-t-transparent mb-4" />
          <p className="text-sm font-semibold text-[#0F2754]">Loading ApexBooks Catalogue...</p>
        </div>
      }
    >
      <BooksClient initialBooks={books} categories={categories} />
    </Suspense>
  );
}
