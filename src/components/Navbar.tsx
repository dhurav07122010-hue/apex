"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import {
  BookOpen,
  Search,
  ShoppingCart,
  Menu,
  X,
  User,
  Sparkles,
  Layers,
  ShieldCheck,
} from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const { totalItems, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/books");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative h-10 w-36 sm:w-40 flex items-center">
              <Image
                src={siteConfig.logo}
                alt={`${siteConfig.name} - ${siteConfig.tagline}`}
                width={160}
                height={42}
                priority
                className="object-contain h-full w-auto"
              />
            </div>
          </Link>

          {/* Search bar (desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-4 relative"
          >
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books by title, author, or keyword..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 transition-all outline-none"
            />
          </form>

          {/* Nav links (desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions: Cart & Account */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              aria-label="Open shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Account / Sign In / Admin */}
            {user ? (
              <div className="flex items-center gap-2">
                {user.email?.toLowerCase() === "dhurav07122010@gmail.com" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-[11px] shadow-sm hover:bg-amber-300 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="hidden sm:inline">
                    {user.user_metadata?.full_name?.split(" ")[0] || "Account"}
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <User className="w-4 h-4 text-zinc-400" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar (below header on mobile) */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, topic..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-blue-500 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none"
            />
          </form>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-3">
          <div className="flex flex-col space-y-2">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                {link.name}
              </Link>
            ))}

            {user?.email?.toLowerCase() === "dhurav07122010@gmail.com" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Portal</span>
              </Link>
            )}

            {user && (
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>My Account & Bookshelf</span>
              </Link>
            )}
          </div>

          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <p className="px-3 text-xs font-semibold uppercase text-zinc-400 mb-2">Categories</p>
            <div className="grid grid-cols-2 gap-1.5">
              {siteConfig.categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/books?category=${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 truncate"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
