"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig, AUTHORIZED_ADMIN_EMAIL } from "@/config/site";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { createClient } from "@/lib/supabase/client";
import { SearchAutocomplete } from "./SearchAutocomplete";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ShieldCheck,
  Headphones,
  BookOpen,
  Sparkles,
  ChevronDown,
  ExternalLink,
  Layers,
  ArrowRight,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { totalItems, subtotal, setIsCartOpen } = useCart();
  const { totalWishlistItems } = useWishlist();
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

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isAdmin = user?.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs">
      {/* ======================================================== */}
      {/* TIER 1: TOP ANNOUNCEMENT BAR (Deep Navy #153D78)         */}
      {/* ======================================================== */}
      <div className="bg-[#153D78] text-white text-[11px] sm:text-xs font-medium border-b border-[#0D264C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-4">
          {/* Announcement text */}
          <div className="flex items-center gap-2 truncate">
            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-bold uppercase text-[9px] tracking-wider shrink-0">
              OFFER
            </span>
            <span className="truncate text-slate-100">
              ⚡ Instant Digital Delivery on all eBooks • 100% Genuine Verified Files • Free Sample Previews
            </span>
          </div>

          {/* Quick Support & Currency & Admin Link */}
          <div className="hidden sm:flex items-center gap-4 shrink-0 text-slate-200">
            <Link
              href="/contact"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Headphones className="w-3 h-3 text-amber-400" />
              <span>Help & Support</span>
            </Link>

            <span className="text-slate-500">•</span>

            <span className="font-semibold text-slate-100 flex items-center gap-1">
              <span>Currency:</span>
              <span className="text-amber-400 font-bold">INR (₹)</span>
            </span>

            {isAdmin && (
              <>
                <span className="text-slate-500">•</span>
                <Link
                  href="/admin"
                  className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-[10px] uppercase hover:bg-amber-300 transition-colors flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin Panel</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TIER 2: MAIN BRANDING & SEARCH BAR (#FFFFFF)              */}
      {/* ======================================================== */}
      <div className="border-b border-[#E2E8F0] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 sm:gap-8">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-10 w-36 sm:w-44 flex items-center">
                <Image
                  src={siteConfig.logo}
                  alt={`${siteConfig.name} - ${siteConfig.tagline}`}
                  width={176}
                  height={44}
                  priority
                  className="object-contain h-full w-auto"
                />
              </div>
            </Link>
          </div>

          {/* Central Bookstore Search Bar with Autocomplete */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <SearchAutocomplete
              className="w-full"
              placeholder="Search by title, author, subject, or ISBN..."
            />
          </div>

          {/* User Actions: Account, Wishlist, Cart */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Account Link */}
            <Link
              href={user ? "/account" : "/auth/signin"}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-[#F4F6FA] text-[#0F1D36] transition-colors"
              title={user ? "My Account" : "Sign In"}
            >
              <div className="w-8 h-8 rounded-full bg-[#EAF3FF] text-[#153D78] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden xl:block text-left text-xs leading-tight">
                <span className="text-[10px] text-slate-500 block">
                  {user ? "Welcome back" : "Hello, Reader"}
                </span>
                <span className="font-bold text-[#153D78] truncate max-w-[120px] block">
                  {user ? (user.user_metadata?.full_name || "My Account") : "Sign In"}
                </span>
              </div>
            </Link>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-2 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-[#F4F6FA] text-[#0F1D36] transition-colors flex items-center gap-2"
              title="My Wishlist"
            >
              <div className="relative">
                <Heart className="w-5 h-5 text-slate-600 hover:text-rose-600 transition-colors" />
                {totalWishlistItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {totalWishlistItems}
                  </span>
                )}
              </div>
              <span className="hidden xl:inline text-xs font-semibold text-slate-700">
                Wishlist
              </span>
            </Link>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#EAF3FF] hover:bg-[#DBEAFE] text-[#153D78] transition-colors cursor-pointer border border-[#BFDBFE]"
              aria-label="Open Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-[#153D78]" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#2878D0] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left text-xs leading-tight">
                <span className="text-[10px] text-slate-500 block">Cart</span>
                <span className="font-extrabold text-[#153D78]">
                  {siteConfig.currency.symbol}{subtotal.toLocaleString()}
                </span>
              </div>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-[#F4F6FA] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Below logo on small screens) */}
        <div className="md:hidden px-4 pb-3">
          <SearchAutocomplete placeholder="Search eBooks, authors, exams..." />
        </div>
      </div>

      {/* ======================================================== */}
      {/* TIER 3: EDITORIAL NAVIGATION BAR (#FFFFFF / #F4F6FA)     */}
      {/* ======================================================== */}
      <nav className="hidden md:block bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Primary Nav Links */}
            <div className="flex items-center gap-1 lg:gap-2 py-1">
              {siteConfig.navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href.split("?")[0]);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                      isActive
                        ? "text-[#153D78] bg-[#EAF3FF] font-extrabold"
                        : "text-slate-600 hover:text-[#153D78] hover:bg-[#F4F6FA]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right highlight pill: Verified Storefront badge */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Razorpay Verified Merchant</span>
            </div>
          </div>
        </div>
      </nav>

      {/* ======================================================== */}
      {/* MOBILE NAVIGATION DRAWER                                 */}
      {/* ======================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Menu */}
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
            {/* Top header of drawer */}
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#153D78] text-white">
              <div className="flex items-center gap-2">
                <div className="relative h-7 w-28 flex items-center">
                  <Image
                    src={siteConfig.logo}
                    alt={siteConfig.name}
                    width={112}
                    height={28}
                    className="object-contain brightness-0 invert"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav list */}
            <div className="p-4 space-y-1 overflow-y-auto flex-1">
              <div className="pb-2 mb-2 border-b border-[#E2E8F0] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Bookstore Menu
              </div>

              {siteConfig.navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href.split("?")[0]);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-[#EAF3FF] text-[#153D78] font-bold"
                        : "text-slate-700 hover:bg-[#F4F6FA] hover:text-[#153D78]"
                    }`}
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                );
              })}

              <div className="pt-4 pb-2 mt-4 border-t border-[#E2E8F0] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Popular Categories
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {siteConfig.categories.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/books?category=${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg bg-[#F4F6FA] hover:bg-[#EAF3FF] text-[11px] font-medium text-slate-700 hover:text-[#153D78] truncate"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Account & Wishlist footer in drawer */}
            <div className="p-4 border-t border-[#E2E8F0] bg-[#F4F6FA] space-y-2">
              <div className="flex items-center justify-between">
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-rose-600"
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Wishlist ({totalWishlistItems})</span>
                </Link>

                <Link
                  href={user ? "/account" : "/auth/signin"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold text-[#153D78] hover:underline"
                >
                  {user ? "My Bookshelf" : "Sign In"}
                </Link>
              </div>

              {isAdmin && (
                <div className="pt-2 border-t border-[#E2E8F0]">
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Administrator Console</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
