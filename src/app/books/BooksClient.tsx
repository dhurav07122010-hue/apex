"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MOCK_BOOKS } from "@/data/mock-books";
import { siteConfig } from "@/config/site";
import { BookCard } from "@/components/BookCard";
import { matchBookRelative } from "@/lib/search";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
  Filter,
  Star,
  RefreshCw,
  BookOpen,
  Package,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

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

    const fmt = searchParams.get("format");
    if (fmt !== null && fmt !== selectedFormat) setSelectedFormat(fmt);

    const price = searchParams.get("price");
    if (price !== null && price !== priceRange) setPriceRange(price);
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

  // Filtered & Sorted books calculation with relative matching
  const filteredBooks = useMemo(() => {
    return MOCK_BOOKS.filter((book) => {
      // Relative search query matching
      if (searchQuery.trim()) {
        const { matches } = matchBookRelative(book, searchQuery);
        if (!matches) {
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
      if (selectedFormat === "pdf" && book.format.toUpperCase() !== "PDF") return false;
      if (selectedFormat === "epub" && book.format.toUpperCase() !== "EPUB") return false;
      // If "ebook" is selected, match all digital formats (PDF/EPUB)
      if (selectedFormat === "ebook") return true;
      // If "physical" is selected, all books are available in physical print pre-order
      if (selectedFormat === "physical") return true;

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
      {/* Physical Format Notice Banner if selected */}
      {selectedFormat === "physical" && (
        <div className="mb-6 p-4 rounded-2xl bg-[#EAF3FF] border border-[#2878D0]/30 flex items-start gap-3">
          <Package className="w-5 h-5 text-[#153D78] mt-0.5 shrink-0" />
          <div className="text-xs text-[#0F1D36]">
            <p className="font-bold text-[#153D78] text-sm mb-0.5">
              Physical Hardcover Collector's Editions
            </p>
            <p className="text-slate-600">
              Each book in our catalog is available for Hardcover Collector's print pre-orders with premium foil-stamped spines, or you can switch to instant Digital eBook delivery anytime.
            </p>
          </div>
        </div>
      )}

      {/* Top Controls Bar: Search, Sort, View Switcher */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-[#153D78] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              updateParams({ q: e.target.value });
            }}
            placeholder="Search titles, authors, topics (e.g. 'html', 'python')..."
            className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-[#F4F6FA] border border-[#E2E8F0] focus:border-[#2878D0] focus:bg-white text-[#0F1D36] placeholder-slate-400 outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                updateParams({ q: "" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right side controls: Mobile Filter Trigger, Sort Dropdown, Grid/List view */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl border border-[#E2E8F0] bg-white text-[#153D78] hover:bg-[#EAF3FF] transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#2878D0]" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#2878D0]" />
            )}
          </button>

          {/* Sort By */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                updateParams({ sort: e.target.value });
              }}
              aria-label="Sort books"
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-[#F4F6FA] border border-[#E2E8F0] text-[#0F1D36] outline-none focus:border-[#2878D0] cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Publication Date</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-[#E2E8F0] rounded-xl p-0.5 bg-[#F4F6FA]">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-[#153D78] shadow-sm font-bold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-[#153D78] shadow-sm font-bold"
                  : "text-slate-400 hover:text-slate-600"
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
          <span className="text-slate-500 font-semibold">Active filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#153D78] font-semibold border border-[#2878D0]/30">
              Query: "{searchQuery}"
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  updateParams({ q: "" });
                }}
                className="hover:text-rose-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {selectedCategory !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#153D78] font-semibold border border-[#2878D0]/30">
              Category: {siteConfig.categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  updateParams({ category: "all" });
                }}
                className="hover:text-rose-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {selectedFormat !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#153D78] font-semibold border border-[#2878D0]/30 capitalize">
              Format: {selectedFormat === "physical" ? "Physical Print" : selectedFormat.toUpperCase()}
              <button
                type="button"
                onClick={() => {
                  setSelectedFormat("all");
                  updateParams({ format: "all" });
                }}
                className="hover:text-rose-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {priceRange !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#153D78] font-semibold border border-[#2878D0]/30">
              Price: {priceRange}
              <button
                type="button"
                onClick={() => {
                  setPriceRange("all");
                  updateParams({ price: "all" });
                }}
                className="hover:text-rose-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {minRating > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#153D78] font-semibold border border-[#2878D0]/30">
              Rating: {minRating}+ ★
              <button
                type="button"
                onClick={() => {
                  setMinRating(0);
                  updateParams({ rating: "0" });
                }}
                className="hover:text-rose-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-rose-600 hover:text-rose-700 font-bold underline ml-1 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Content Layout: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] space-y-6 shadow-sm sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <span className="font-bold text-sm text-[#0F1D36] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#153D78]" />
                Filter Books
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[11px] font-semibold text-[#2878D0] hover:text-[#153D78] cursor-pointer"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Format Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Product Format
              </h4>
              <div className="flex flex-col gap-1.5">
                {[
                  { id: "all", label: "All Formats" },
                  { id: "ebook", label: "Digital eBook (PDF/ePub)" },
                  { id: "physical", label: "Physical Print (Hardcover)" },
                ].map((fmt) => {
                  const isSelected = selectedFormat === fmt.id;
                  return (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => {
                        setSelectedFormat(fmt.id);
                        updateParams({ format: fmt.id });
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-[#153D78] text-white shadow-sm"
                          : "text-slate-700 hover:bg-[#F4F6FA]"
                      }`}
                    >
                      <span>{fmt.label}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Categories */}
            <div className="pt-4 border-t border-[#E2E8F0]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Categories
              </h4>
              <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    updateParams({ category: "all" });
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCategory === "all"
                      ? "bg-[#EAF3FF] text-[#153D78] font-bold"
                      : "text-slate-600 hover:bg-[#F4F6FA]"
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[11px] text-slate-400">{MOCK_BOOKS.length}</span>
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
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-[#EAF3FF] text-[#153D78] font-bold"
                          : "text-slate-600 hover:bg-[#F4F6FA]"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[11px] text-slate-400">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Ranges */}
            <div className="pt-4 border-t border-[#E2E8F0]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
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
                    className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-[#153D78] font-medium"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange === range.id}
                      onChange={() => {
                        setPriceRange(range.id);
                        updateParams({ price: range.id });
                      }}
                      className="text-[#153D78] focus:ring-[#2878D0] h-3.5 w-3.5"
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="pt-4 border-t border-[#E2E8F0]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
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
                    className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-[#153D78] font-medium"
                  >
                    <input
                      type="radio"
                      name="minRating"
                      checked={minRating === item.value}
                      onChange={() => {
                        setMinRating(item.value);
                        updateParams({ rating: String(item.value) });
                      }}
                      className="text-[#153D78] focus:ring-[#2878D0] h-3.5 w-3.5"
                    />
                    <div className="flex items-center gap-1">
                      {item.value > 0 && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
                      <span>{item.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid / Results */}
        <main className="col-span-1 md:col-span-3">
          <div className="flex items-center justify-between mb-4 text-xs text-slate-500">
            <span>
              Showing <strong className="text-[#0F1D36] font-bold">{filteredBooks.length}</strong> of {MOCK_BOOKS.length} Titles
            </span>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#EAF3FF] flex items-center justify-center text-[#153D78] mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-[#0F1D36] mb-1">
                No Books Found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                We couldn't find any titles matching your selected filters. Try broadening keywords or clearing category filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-[#153D78] hover:bg-[#2878D0] text-white font-bold text-xs inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
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
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white p-5 overflow-y-auto space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <h3 className="font-bold text-base text-[#0F1D36]">Filters</h3>
                  <button
                    type="button"
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Format */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Format</h4>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { id: "all", label: "All Formats" },
                      { id: "ebook", label: "Digital eBook" },
                      { id: "physical", label: "Physical Print" },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => {
                          setSelectedFormat(fmt.id);
                          updateParams({ format: fmt.id });
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                          selectedFormat === fmt.id ? "bg-[#153D78] text-white" : "text-slate-700 bg-[#F4F6FA]"
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Category */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Category</h4>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory("all");
                        updateParams({ category: "all" });
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        selectedCategory === "all" ? "bg-[#153D78] text-white" : "text-slate-700"
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
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold truncate ${
                          selectedCategory === cat.slug ? "bg-[#153D78] text-white" : "text-slate-700"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Apply / Close button */}
              <div className="pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 rounded-xl bg-[#153D78] text-white text-xs font-bold shadow-md hover:bg-[#2878D0] transition-colors"
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
