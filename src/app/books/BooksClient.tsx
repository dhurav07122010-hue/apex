"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MOCK_BOOKS } from "@/data/mock-books";
import { siteConfig } from "@/config/site";
import { BookCard } from "@/components/BookCard";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
} from "lucide-react";
import Link from "next/link";

import { Book } from "@/types";

interface BooksClientProps {
  initialBooks?: Book[];
  categories?: any[];
}

export function BooksClient({
  initialBooks,
  categories: dynamicCategories,
}: BooksClientProps = {}) {
  const books = initialBooks || MOCK_BOOKS;
  const categoriesList = dynamicCategories || siteConfig.categories;

  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [priceRange, setPriceRange] = useState<string>(searchParams.get("price") || "all");
  const [language, setLanguage] = useState<string>(searchParams.get("lang") || "all");
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sort") || "featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null && q !== searchQuery) setSearchQuery(q);

    const cat = searchParams.get("category");
    if (cat !== null && cat !== selectedCategory) setSelectedCategory(cat);

    const sort = searchParams.get("sort");
    if (sort !== null && sort !== sortBy) setSortBy(sort);

    const price = searchParams.get("price");
    if (price !== null && price !== priceRange) setPriceRange(price);

    const lang = searchParams.get("lang");
    if (lang !== null && lang !== language) setLanguage(lang);
  }, [searchParams]);

  const updateParams = (newParams: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(newParams).forEach(([k, v]) => {
      if (!v || v === "all" || v === "0") {
        current.delete(k);
      } else {
        current.set(k, v);
      }
    });
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`/books${query}`, { scroll: false });
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setPriceRange("all");
    setLanguage("all");
    setSearchQuery("");
    setSortBy("featured");
    setCurrentPage(1);
    router.replace("/books", { scroll: false });
  };

  // Filtered & Sorted books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches =
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.categoryName.toLowerCase().includes(query);
        if (!matches) return false;
      }

      if (selectedCategory !== "all" && book.category !== selectedCategory) {
        return false;
      }

      if (priceRange === "under-100" && book.price >= 100) return false;
      if (priceRange === "100-300" && (book.price < 100 || book.price > 300)) return false;
      if (priceRange === "300-500" && (book.price < 300 || book.price > 500)) return false;
      if (priceRange === "above-500" && book.price <= 500) return false;

      if (language !== "all" && book.language.toLowerCase() !== language.toLowerCase()) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "featured") return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      if (sortBy === "bestseller") return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return b.publishedYear - a.publishedYear;
      return 0;
    });
  }, [searchQuery, selectedCategory, priceRange, language, sortBy]);

  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / pageSize));
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const visibleCategories = showAllCategories
    ? categoriesList
    : categoriesList.slice(0, 5);

  return (
    <div className="bg-white min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-[#153D78]">
            Home
          </Link>
          <span>/</span>
          <span className="font-bold text-[#0F1D36]">All eBooks</span>
          {selectedCategory !== "all" && (
            <>
              <span>/</span>
              <span className="font-bold text-[#153D78]">
                {categoriesList.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
              </span>
            </>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex md:hidden items-center justify-between pb-3 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 text-[#0F1D36] text-xs font-bold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter eBooks</span>
          </button>
          <span className="text-xs text-slate-500">
            {filteredBooks.length} eBooks
          </span>
        </div>

        {/* Desktop Layout: Sidebar + 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* ======================================================== */}
          {/* LEFT SIDEBAR FILTERS (Matching Reference Image)          */}
          {/* ======================================================== */}
          <aside className="hidden md:block md:col-span-3 space-y-6 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs sticky top-28">
            {/* Header: Filters + Clear All */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-black text-sm text-[#0F1D36] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#0F2754]" />
                <span>Filters</span>
              </h3>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold text-[#2563EB] hover:text-[#0F2754] cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Category Checkboxes */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0F1D36]">
                Category
              </h4>
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer hover:text-[#0F2754]">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === "all"}
                      onChange={() => {
                        setSelectedCategory("all");
                        updateParams({ category: "all" });
                      }}
                      className="w-4 h-4 text-[#0F2754] focus:ring-[#0F2754]"
                    />
                    <span>All Categories</span>
                  </div>
                  <span className="text-[11px] text-slate-400">({books.length})</span>
                </label>

                {visibleCategories.map((cat) => {
                  const count = books.filter((b) => b.category === cat.slug).length;
                  const isChecked = selectedCategory === cat.slug;
                  return (
                    <label
                      key={cat.id}
                      className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer hover:text-[#0F2754]"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="category"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedCategory(cat.slug);
                            updateParams({ category: cat.slug });
                          }}
                          className="w-4 h-4 text-[#0F2754] focus:ring-[#0F2754]"
                        />
                        <span className={isChecked ? "font-bold text-[#0F2754]" : ""}>
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">({count > 0 ? count : 12})</span>
                    </label>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="text-xs font-bold text-[#2563EB] hover:underline pt-1 block cursor-pointer"
                >
                  {showAllCategories ? "- Show Less" : "+ Show More"}
                </button>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0F1D36]">
                Price Range
              </h4>
              <div className="space-y-2 text-xs font-medium text-slate-700">
                {[
                  { id: "all", label: "All Prices" },
                  { id: "under-100", label: "Under ₹100" },
                  { id: "100-300", label: "₹100 – ₹300" },
                  { id: "300-500", label: "₹300 – ₹500" },
                  { id: "above-500", label: "Above ₹500" },
                ].map((range) => (
                  <label
                    key={range.id}
                    className="flex items-center gap-2 cursor-pointer hover:text-[#0F2754]"
                  >
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === range.id}
                      onChange={() => {
                        setPriceRange(range.id);
                        updateParams({ price: range.id });
                      }}
                      className="w-4 h-4 text-[#0F2754] focus:ring-[#0F2754]"
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Language Filter */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0F1D36]">
                Language
              </h4>
              <div className="space-y-2 text-xs font-medium text-slate-700">
                {[
                  { id: "all", label: "All Languages", count: 60 },
                  { id: "english", label: "English", count: 58 },
                  { id: "hindi", label: "Hindi", count: 12 },
                ].map((lang) => (
                  <label
                    key={lang.id}
                    className="flex items-center justify-between cursor-pointer hover:text-[#0F2754]"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="language"
                        checked={language === lang.id}
                        onChange={() => {
                          setLanguage(lang.id);
                          updateParams({ lang: lang.id });
                        }}
                        className="w-4 h-4 text-[#0F2754] focus:ring-[#0F2754]"
                      />
                      <span>{lang.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">({lang.count})</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* ======================================================== */}
          {/* MAIN PRODUCT AREA (4 Columns in Desktop)                 */}
          {/* ======================================================== */}
          <main className="md:col-span-9 space-y-6">
            {/* Top Toolbar: Result Count & Sort Dropdown */}
            <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
              <p className="text-xs sm:text-sm font-semibold text-slate-600">
                Showing{" "}
                <strong className="text-[#0F1D36] font-bold">
                  {paginatedBooks.length > 0 ? `1–${paginatedBooks.length}` : 0}
                </strong>{" "}
                of <strong className="text-[#0F1D36] font-bold">{filteredBooks.length}</strong> eBooks
              </p>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 hidden sm:inline">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      updateParams({ sort: e.target.value });
                    }}
                    className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-[#0F1D36] bg-white hover:border-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#0F2754] cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="bestseller">Bestseller</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 4-Column Product Grid */}
            {paginatedBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {paginatedBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
                <h3 className="text-lg font-black text-[#0F1D36]">No eBooks Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  We couldn&apos;t find any eBooks matching your current filters. Try resetting the filters or searching for something else.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-full bg-[#0F2754] text-white text-xs font-bold hover:bg-[#153D78] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls (< 1 2 3 ... >) */}
            {totalPages > 1 && (
              <div className="pt-6 flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-lg text-xs font-black transition-colors ${
                        isActive
                          ? "bg-[#0F2754] text-white shadow-xs"
                          : "border border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Drawer Filter */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="relative w-80 max-w-[85vw] bg-white h-full p-5 shadow-2xl flex flex-col justify-between overflow-y-auto z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-black text-sm text-[#0F1D36]">Filter eBooks</h3>
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase">Category</h4>
                {categoriesList.map((cat: any) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      updateParams({ category: cat.slug });
                      setShowMobileFilters(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs font-semibold ${
                      selectedCategory === cat.slug
                        ? "bg-[#0F2754] text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  setShowMobileFilters(false);
                }}
                className="w-full py-2.5 rounded-xl border border-rose-300 text-rose-600 font-bold text-xs"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
