"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig, AUTHORIZED_ADMIN_EMAIL } from "@/config/site";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { createClient } from "@/lib/supabase/client";
import { ApexBooksLogo } from "./ApexBooksLogo";
import { CategoryIcon } from "./CategoryIcons";
import { MOCK_BOOKS } from "@/data/mock-books";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Zap,
  ArrowRight,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, setIsCartOpen } = useCart();
  const { totalWishlistItems } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [ebooksOpen, setEbooksOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
    setEbooksOpen(false);
    setIsSearchFocused(false);
  }, [pathname]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdmin = user?.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();

  const searchResults = searchQuery.trim()
    ? MOCK_BOOKS.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(`/books?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-xs">
      {/* ======================================================== */}
      {/* TIER 1: TOP ANNOUNCEMENT BAR (Deep Navy #0F2754)         */}
      {/* ======================================================== */}
      <div className="bg-[#0F2754] text-white text-[11px] sm:text-xs font-medium py-1.5 px-4 sm:px-6 lg:px-8 border-b border-[#0B1E40]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Offer text */}
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">🎁</span>
            <span>
              Get <strong className="text-amber-300 font-bold">50% OFF</strong> on your first eBook! Use Code:{" "}
              <strong className="text-amber-300 font-bold tracking-wider">FIRST50</strong>
            </span>
          </div>

          {/* Right: Trust badges */}
          <div className="hidden sm:flex items-center gap-4 text-slate-200 text-xs">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Download</span>
            </div>
            <span className="text-slate-500">|</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Secure Payments</span>
            </div>

            {isAdmin && (
              <>
                <span className="text-slate-500">|</span>
                <Link
                  href="/admin"
                  className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-[10px] uppercase hover:bg-amber-300 transition-colors"
                >
                  Admin Panel
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TIER 2: MAIN HEADER BAR (Pure White #FFFFFF)              */}
      {/* ======================================================== */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 sm:gap-8">
          {/* Logo */}
          <div className="shrink-0">
            <ApexBooksLogo size="md" />
          </div>

          {/* Central Search Bar */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search for eBooks..."
                className="w-full pl-5 pr-12 py-2.5 rounded-full border border-slate-300 focus:border-[#0F2754] focus:ring-2 focus:ring-[#0F2754]/10 text-sm text-[#0F1D36] placeholder:text-slate-400 bg-white shadow-inner transition-all outline-hidden"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1.5 w-9 h-9 rounded-full bg-[#0F2754] hover:bg-[#153D78] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Live Autocomplete dropdown */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Found {searchResults.length} matching eBooks</span>
                  <Link
                    href={`/books?q=${encodeURIComponent(searchQuery.trim())}`}
                    onClick={() => setIsSearchFocused(false)}
                    className="text-[#0F2754] font-bold hover:underline"
                  >
                    View All Results
                  </Link>
                </div>

                {searchResults.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {searchResults.map((book) => (
                      <Link
                        key={book.id}
                        href={`/books/${book.slug}`}
                        onClick={() => setIsSearchFocused(false)}
                        className="p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-10 h-14 bg-slate-100 rounded overflow-hidden shrink-0 flex items-center justify-center text-[8px] font-bold text-slate-700">
                          {book.format}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-[#0F1D36] truncate">{book.title}</p>
                          <p className="text-[11px] text-slate-500 truncate">By {book.author}</p>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {book.categoryName}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-[#0F1D36]">
                            {siteConfig.currency.symbol}
                            {book.price}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No books found matching &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Icons: User, Heart (Wishlist), Shopping Cart */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* User Profile */}
            <Link
              href={mounted && user ? "/account" : "/auth/signin"}
              className="p-2 sm:p-2.5 rounded-full hover:bg-slate-100 text-[#0F1D36] transition-colors"
              title={mounted && user ? "My Account" : "Sign In"}
              suppressHydrationWarning
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-2 sm:p-2.5 rounded-full hover:bg-slate-100 text-[#0F1D36] transition-colors relative"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5 text-slate-700 hover:text-rose-600 transition-colors" />
              {mounted && totalWishlistItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {totalWishlistItems}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="p-2 sm:p-2.5 rounded-full hover:bg-slate-100 text-[#0F1D36] transition-colors relative cursor-pointer"
              title="Shopping Cart"
              aria-label="Open Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {/* Circular Red Badge matching reference design */}
              <span
                suppressHydrationWarning
                className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs"
              >
                {mounted ? totalItems : 0}
              </span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for eBooks..."
              className="w-full pl-4 pr-11 py-2 rounded-full border border-slate-300 text-sm text-[#0F1D36] placeholder:text-slate-400 bg-white"
            />
            <button
              type="submit"
              className="absolute right-1 w-8 h-8 rounded-full bg-[#0F2754] text-white flex items-center justify-center"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TIER 3: SIGNATURE GOLDEN YELLOW NAVIGATION BAR (#FDB813) */}
      {/* ======================================================== */}
      <nav className="hidden md:block bg-[#FDB813] border-b border-[#E5A50A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 lg:space-x-2 py-1">
            {/* Home */}
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-md text-sm font-bold transition-colors ${
                pathname === "/"
                  ? "text-[#0F1D36] bg-amber-400/50"
                  : "text-[#0F1D36] hover:text-black hover:bg-amber-400/40"
              }`}
            >
              Home
            </Link>

            {/* All eBooks Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setEbooksOpen(true)}
              onMouseLeave={() => setEbooksOpen(false)}
            >
              <Link
                href="/books"
                className={`px-3.5 py-2 rounded-md text-sm font-bold flex items-center gap-1 transition-colors ${
                  pathname.startsWith("/books")
                    ? "text-[#0F1D36] bg-amber-400/50"
                    : "text-[#0F1D36] hover:text-black hover:bg-amber-400/40"
                }`}
              >
                <span>All eBooks</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </Link>

              {ebooksOpen && (
                <div className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link
                    href="/books"
                    className="block px-4 py-2 text-xs font-bold text-slate-800 hover:bg-amber-50 hover:text-[#0F2754]"
                  >
                    Browse All Titles
                  </Link>
                  <Link
                    href="/books?sort=bestseller"
                    className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-[#0F2754]"
                  >
                    Bestselling eBooks
                  </Link>
                  <Link
                    href="/books?sort=newest"
                    className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-[#0F2754]"
                  >
                    New Arrivals
                  </Link>
                  <Link
                    href="/books?filter=discount"
                    className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-[#0F2754]"
                  >
                    Special Deals &amp; Discounts
                  </Link>
                </div>
              )}
            </div>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <Link
                href="/categories"
                className={`px-3.5 py-2 rounded-md text-sm font-bold flex items-center gap-1 transition-colors ${
                  pathname.startsWith("/categories")
                    ? "text-[#0F1D36] bg-amber-400/50"
                    : "text-[#0F1D36] hover:text-black hover:bg-amber-400/40"
                }`}
              >
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </Link>

              {categoriesOpen && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 grid grid-cols-1 gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  {siteConfig.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-amber-50/70 transition-colors group"
                    >
                      <div className="w-7 h-7 shrink-0">
                        <CategoryIcon name={cat.slug} className="w-7 h-7" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-[#0F2754]">
                          {cat.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Bestsellers */}
            <Link
              href="/books?sort=bestseller"
              className="px-3.5 py-2 rounded-md text-sm font-bold text-[#0F1D36] hover:text-black hover:bg-amber-400/40 transition-colors"
            >
              Bestsellers
            </Link>

            {/* New Arrivals */}
            <Link
              href="/books?sort=newest"
              className="px-3.5 py-2 rounded-md text-sm font-bold text-[#0F1D36] hover:text-black hover:bg-amber-400/40 transition-colors"
            >
              New Arrivals
            </Link>

            {/* About Us */}
            <Link
              href="/about"
              className={`px-3.5 py-2 rounded-md text-sm font-bold transition-colors ${
                pathname === "/about"
                  ? "text-[#0F1D36] bg-amber-400/50"
                  : "text-[#0F1D36] hover:text-black hover:bg-amber-400/40"
              }`}
            >
              About Us
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              className={`px-3.5 py-2 rounded-md text-sm font-bold transition-colors ${
                pathname === "/contact"
                  ? "text-[#0F1D36] bg-amber-400/50"
                  : "text-[#0F1D36] hover:text-black hover:bg-amber-400/40"
              }`}
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* ======================================================== */}
      {/* MOBILE NAVIGATION DRAWER                                 */}
      {/* ======================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#0F2754] text-white">
              <ApexBooksLogo size="sm" inverted />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <div className="p-4 space-y-1 overflow-y-auto flex-1">
              <div className="pb-2 mb-2 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Navigation
              </div>

              {siteConfig.navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center justify-between p-2.5 rounded-lg text-sm font-bold text-slate-800 hover:bg-amber-50"
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              ))}

              <div className="pt-4 pb-2 mb-2 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Categories
              </div>

              {siteConfig.categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <CategoryIcon name={cat.slug} className="w-5 h-5" />
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
              <Link
                href={user ? "/account" : "/auth/signin"}
                className="w-full py-2.5 rounded-xl bg-[#0F2754] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
              >
                <User className="w-4 h-4" />
                <span>{user ? "My Account & Library" : "Sign In to Account"}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
