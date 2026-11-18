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
  placeholder = "Search books by title, author, or keyword...",
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
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
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
          className={`w-full pl-9 pr-9 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 transition-all outline-none ${inputClassName}`}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Floating Instant Dropdown Under Search Box */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="p-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="font-semibold uppercase tracking-wider">
              {matches.length > 0 ? `Matching eBooks (${totalMatchesCount})` : "Catalogue Search"}
            </span>
            <span className="text-[10px] hidden sm:inline">Use ↑↓ to navigate, Enter to select</span>
          </div>

          {/* Results List */}
          {matches.length > 0 ? (
            <div className="p-1 max-h-[360px] overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {matches.map((book, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => handleSelect(book)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-100"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    {/* Cover Thumbnail / Gradient Icon */}
                    <div
                      className="w-8 h-11 rounded-md shrink-0 flex items-center justify-center text-white shadow-sm font-black text-[9px] relative overflow-hidden"
                      style={{
                        background: book.coverGradient
                          ? `linear-gradient(135deg, ${book.coverGradient.from}, ${book.coverGradient.to})`
                          : "#2563eb",
                      }}
                    >
                      <BookOpen className="w-3.5 h-3.5 opacity-80" />
                    </div>

                    {/* Book Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100/70 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                          {book.categoryName}
                        </span>
                        {book.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                            {book.badge}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {book.title}
                      </h4>

                      <p className="text-[11px] text-zinc-400 truncate">
                        By {book.author}
                      </p>
                    </div>

                    {/* Price and Action */}
                    <div className="text-right shrink-0">
                      <div className="font-black text-xs text-zinc-900 dark:text-zinc-100">
                        {siteConfig.currency.symbol}{book.price}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        {book.format}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center space-y-2">
              <p className="text-xs text-zinc-500">
                No eBooks found matching <strong className="text-zinc-800 dark:text-zinc-200">&ldquo;{query}&rdquo;</strong>
              </p>
              <Link
                href="/books"
                onClick={() => setIsOpen(false)}
                className="text-xs text-blue-600 hover:underline font-bold inline-block"
              >
                Browse all catalogue titles →
              </Link>
            </div>
          )}

          {/* Bottom Footer View All CTA */}
          {matches.length > 0 && (
            <div className="p-2 bg-zinc-50 dark:bg-zinc-950/80 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleSubmitSearch}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all {totalMatchesCount} results in Storefront</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <span className="text-[10px] text-zinc-400 flex items-center gap-1 font-mono">
                Press <CornerDownLeft className="w-3 h-3" />
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
