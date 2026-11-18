"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MOCK_BOOKS } from "@/data/mock-books";
import { siteConfig } from "@/config/site";
import { BookCard } from "@/components/BookCard";
import { Book, BookFormat } from "@/types";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
  Filter,
  Star,
  RefreshCw,
} from "lucide-react";

export function BooksClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter States initialized from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [priceRange, setPriceRange] = useState<string>(searchParams.get("price") || "all");
  const [minRating, setMinRating] = useState<number>(Number(searchParams.get("rating")) || 0);
  const [selectedFormat, setSelectedFormat] = useState<string>(searchParams.get("format") || "all");
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sort") || "popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null && q !== searchQuery) setSearchQuery(q);

    const cat = searchParams.get("category");
    if (cat !== null && cat !== selectedCategory) setSelectedCategory(cat);

    const sort = searchParams.get("sort");
    if (sort !== null && sort !== sortBy) setSortBy(sort);
  }, [searchParams]);

  // Update URL parameters cleanly
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

  // Filtered & Sorted books calculation
  const filteredBooks = useMemo(() => {
    return MOCK_BOOKS.filter((book) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = book.title.toLowerCase().includes(query);
        const matchesAuthor = book.author.toLowerCase().includes(query);
        const matchesCat = book.categoryName.toLowerCase().includes(query);
        const matchesDesc = book.shortDescription.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAuthor && !matchesCat && !matchesDesc) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== "all" && book.category !== selectedCategory) {
        return false;
      }

      // Price filter
      if (priceRange === "free" && book.price > 0) return false;
      if (priceRange === "under-300" && book.price >= 300) return false;
      if (priceRange === "300-500" && (book.price < 300 || book.price > 500)) return false;
      if (priceRange === "above-500" && book.price <= 500) return false;

      // Rating filter
      if (minRating > 0 && book.rating < minRating) return false;

      // Format filter
      if (selectedFormat !== "all" && book.format !== selectedFormat) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return b.publishedYear - a.publishedYear;
      // Default: popularity / bestsellers first
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return b.reviewCount - a.reviewCount;
    });
  }, [searchQuery, selectedCategory, priceRange, minRating, selectedFormat, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange("all");
    setMinRating(0);
    setSelectedFormat("all");
    setSortBy("popular");
    router.replace("/books", { scroll: false });
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    priceRange !== "all" ||
    minRating > 0 ||
    selectedFormat !== "all";

  return (
    <div>
      {/* Top Controls Bar: Search, Sort, View Switcher */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              updateParams({ q: e.target.value });
            }}
            placeholder="Search by title, author, keyword..."
            className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                updateParams({ q: "" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right side controls: Mobile Filter Trigger, Sort Dropdown, Grid/List view */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-blue-600" />
            )}
          </button>

          {/* Sort By */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                updateParams({ sort: e.target.value });
              }}
              aria-label="Sort eBooks"
              className="px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 outline-none focus:border-blue-500"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Publication Date</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-xl p-0.5 bg-zinc-50 dark:bg-zinc-950">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
          <span className="text-zinc-400 font-medium">Active filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium">
              Keyword: "{searchQuery}"
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  updateParams({ q: "" });
                }}
              >
                <X className="w-3 h-3 hover:text-blue-900" />
              </button>
            </span>
          )}
          {selectedCategory !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium">
              Category: {siteConfig.categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  updateParams({ category: "all" });
                }}
              >
                <X className="w-3 h-3 hover:text-blue-900" />
              </button>
            </span>
          )}
          {priceRange !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium">
              Price: {priceRange}
              <button
                type="button"
                onClick={() => {
                  setPriceRange("all");
                  updateParams({ price: "all" });
                }}
              >
                <X className="w-3 h-3 hover:text-blue-900" />
              </button>
            </span>
          )}
          {minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium">
              Rating: {minRating}+ ★
              <button
                type="button"
                onClick={() => {
                  setMinRating(0);
                  updateParams({ rating: "0" });
                }}
              >
                <X className="w-3 h-3 hover:text-blue-900" />
              </button>
            </span>
          )}
          {selectedFormat !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium">
              Format: {selectedFormat}
              <button
                type="button"
                onClick={() => {
                  setSelectedFormat("all");
                  updateParams({ format: "all" });
                }}
              >
                <X className="w-3 h-3 hover:text-blue-900" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline ml-1 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Content Layout: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                Filter Catalogue
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[11px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                Categories
              </h4>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    updateParams({ category: "all" });
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === "all"
                      ? "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-bold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[11px] text-zinc-400">{MOCK_BOOKS.length}</span>
                </button>
                {siteConfig.categories.map((cat) => {
                  const count = MOCK_BOOKS.filter((b) => b.category === cat.slug).length;
                  const isSelected = selectedCategory === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        updateParams({ category: cat.slug });
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-bold"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[11px] text-zinc-400">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Ranges */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                Price Range
              </h4>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: "all", label: "All Prices" },
                  { id: "under-300", label: "Under ₹300" },
                  { id: "300-500", label: "₹300 - ₹500" },
                  { id: "above-500", label: "Above ₹500" },
                ].map((range) => (
                  <label
                    key={range.id}
                    className="flex items-center gap-2 cursor-pointer text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange === range.id}
                      onChange={() => {
                        setPriceRange(range.id);
                        updateParams({ price: range.id });
                      }}
                      className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                Minimum Rating
              </h4>
              <div className="space-y-1.5 text-xs">
                {[
                  { value: 0, label: "All Ratings" },
                  { value: 4.8, label: "4.8 & Above ★" },
                  { value: 4.5, label: "4.5 & Above ★" },
                ].map((item) => (
                  <label
                    key={item.value}
                    className="flex items-center gap-2 cursor-pointer text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  >
                    <input
                      type="radio"
                      name="minRating"
                      checked={minRating === item.value}
                      onChange={() => {
                        setMinRating(item.value);
                        updateParams({ rating: String(item.value) });
                      }}
                      className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                    />
                    <div className="flex items-center gap-1">
                      {item.value > 0 && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
                      <span>{item.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Format Filter */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                Format
              </h4>
              <div className="flex flex-wrap gap-2">
                {["all", "PDF", "EPUB"].map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => {
                      setSelectedFormat(fmt);
                      updateParams({ format: fmt });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selectedFormat === fmt
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200"
                    }`}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid / Results */}
        <main className="col-span-1 md:col-span-3">
          <div className="flex items-center justify-between mb-4 text-xs text-zinc-500">
            <span>
              Showing <strong className="text-zinc-900 dark:text-zinc-100">{filteredBooks.length}</strong> of {MOCK_BOOKS.length} eBooks
            </span>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-1">
                No eBooks found
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-6">
                We couldn't find any books matching your selected criteria. Try adjusting keywords or clearing category filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} viewMode="list" />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white dark:bg-zinc-900 p-5 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Filters</h3>
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Category</h4>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("all");
                      updateParams({ category: "all" });
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs ${
                      selectedCategory === "all" ? "bg-blue-600 text-white font-bold" : "text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    All Categories
                  </button>
                  {siteConfig.categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        updateParams({ category: cat.slug });
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs truncate ${
                        selectedCategory === cat.slug ? "bg-blue-600 text-white font-bold" : "text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply / Close button */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Apply Filters ({filteredBooks.length} results)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
