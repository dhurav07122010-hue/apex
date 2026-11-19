"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen, ArrowRight, CornerDownLeft } from "lucide-react";
import { MOCK_BOOKS } from "@/data/mock-books";
import { filterBooksRelative } from "@/lib/search";
import { siteConfig } from "@/config/site";
import { Book } from "@/types";

interface SearchAutocompleteProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  onSelectBook?: () => void;
}

export function SearchAutocomplete({
  placeholder = "Search books by title, author, keyword, or ISBN...",
  className = "",
  inputClassName = "",
  autoFocus = false,
  onSelectBook,
}: SearchAutocompleteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Compute relative matches dynamically
  const matches = useMemo(() => {
    if (!query.trim()) return [];
    return filterBooksRelative(MOCK_BOOKS, query).slice(0, 6);
  }, [query]);

  const totalMatchesCount = useMemo(() => {
    if (!query.trim()) return 0;
    return filterBooksRelative(MOCK_BOOKS, query).length;
  }, [query]);

  // Click outside to dismiss dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || matches.length === 0) {
      if (e.key === "Enter" && query.trim()) {
        e.preventDefault();
        handleSubmitSearch();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < matches.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : matches.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < matches.length) {
        handleSelect(matches[selectedIndex]);
      } else {
        handleSubmitSearch();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSubmitSearch = () => {
    setIsOpen(false);
    if (onSelectBook) onSelectBook();
    if (query.trim()) {
      router.push(`/books?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/books");
    }
  };

  const handleSelect = (book: Book) => {
    setIsOpen(false);
    setQuery("");
    if (onSelectBook) onSelectBook();
    router.push(`/books/${book.slug}`);
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitSearch();
        }}
        className="relative flex items-center w-full"
      >
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            autoFocus={autoFocus}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => {
              if (query.trim()) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-l-xl bg-[#F4F6FA] border border-[#CBD5E1] border-r-0 focus:border-[#2878D0] focus:bg-white text-slate-900 placeholder-slate-400 transition-all outline-none ${inputClassName}`}
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Search Button (Deep Navy #153D78) */}
        <button
          type="submit"
          className="px-4 py-2.5 sm:py-3 rounded-r-xl bg-[#153D78] hover:bg-[#1B5EB0] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-xs"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {/* Floating Instant Dropdown Under Search Bar */}
      {isOpen && query.trim() && (
        <div
          className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#CBD5E1] rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-[#E2E8F0] animate-in fade-in-50 duration-150"
          style={{ maxHeight: "420px" }}
        >
          {matches.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No books found matching &quot;{query}&quot;</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Try searching by author name, subject keyword, or exam category.
              </p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-80 divide-y divide-slate-100">
              {matches.map((book, idx) => {
                const isSelected = idx === selectedIndex;
                const { from, to } = book.coverGradient;

                return (
                  <div
                    key={book.id}
                    onClick={() => handleSelect(book)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-3 flex items-center gap-3.5 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#EAF3FF] text-[#153D78]"
                        : "hover:bg-[#F4F6FA] text-slate-800"
                    }`}
                  >
                    {/* Book Thumbnail */}
                    <div
                      className="w-10 h-14 rounded shrink-0 shadow-sm flex flex-col justify-between p-1 text-[7px] text-white overflow-hidden relative select-none"
                      style={{
                        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
                      }}
                    >
                      <span className="truncate opacity-80 uppercase text-[6px]">
                        {book.categoryName}
                      </span>
                      <span className="font-bold line-clamp-2 leading-tight">
                        {book.title}
                      </span>
                    </div>

                    {/* Book Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF3FF] text-[#153D78] truncate max-w-[150px]">
                          {book.categoryName}
                        </span>
                        {book.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase bg-amber-100 text-amber-800">
                            {book.badge}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {book.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        By {book.author}
                      </p>
                    </div>

                    {/* Price & Action Badge */}
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-[#153D78]">
                        {siteConfig.currency.symbol}
                        {book.price}
                      </div>
                      {book.originalPrice && (
                        <div className="text-[10px] text-slate-400 line-through">
                          {siteConfig.currency.symbol}
                          {book.originalPrice}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer of Dropdown */}
          {matches.length > 0 && (
            <div className="p-2.5 bg-[#F4F6FA] flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-medium">
                Found {totalMatchesCount} {totalMatchesCount === 1 ? "match" : "matches"}
              </span>

              <button
                type="button"
                onClick={handleSubmitSearch}
                className="text-[11px] font-bold text-[#2878D0] hover:text-[#153D78] flex items-center gap-1 cursor-pointer"
              >
                <span>View all results</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
