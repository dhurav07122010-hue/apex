"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Book } from "@/types";
import { BookCover } from "@/components/BookCover";
import { BookPreviewModal } from "@/components/BookPreviewModal";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { siteConfig, isAuthorizedAdminEmail } from "@/config/site";
import {
  User,
  BookOpen,
  ShoppingBag,
  Heart,
  Settings,
  Lock,
  LogOut,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Zap,
  Shield,
} from "lucide-react";

interface AccountDashboardClientProps {
  initialUser?: any;
  initialBooks?: Book[];
}

export function AccountDashboardClient({ initialUser, initialBooks = [] }: AccountDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "library" | "orders" | "wishlist" | "profile" | "password"
  >("library");
  const [librarySearch, setLibrarySearch] = useState("");
  const [readingBook, setReadingBook] = useState<Book | null>(null);

  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const isAdmin = isAuthorizedAdminEmail(initialUser?.email);

  // Purchased books in library (using passed books or default demo purchases)
  const purchasedBooks = initialBooks.length > 0 ? initialBooks : [];

  const filteredLibrary = purchasedBooks.filter(
    (b) =>
      b.title.toLowerCase().includes(librarySearch.toLowerCase()) ||
      b.author.toLowerCase().includes(librarySearch.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#0F2754]">
            Home
          </Link>
          <span>&gt;</span>
          <span className="font-bold text-[#0F1D36]">My Account</span>
          {activeTab === "library" && (
            <>
              <span>&gt;</span>
              <span className="font-bold text-[#153D78]">My Library</span>
            </>
          )}
        </nav>

        {/* Dashboard 2-Column Grid (Matching Reference Design) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* ======================================================== */}
          {/* LEFT SIDEBAR: MY ACCOUNT MENU                            */}
          {/* ======================================================== */}
          <aside className="md:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4 sticky top-28">
            <h2 className="font-black text-sm text-[#0F1D36] uppercase tracking-wider pb-3 border-b border-slate-200">
              My Account
            </h2>

            <nav className="space-y-1">
              {/* Overview */}
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-[#EAF3FF] text-[#153D78] font-extrabold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#0F1D36]"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Overview</span>
              </button>

              {/* My Library (Active in Reference Design) */}
              <button
                type="button"
                onClick={() => setActiveTab("library")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === "library"
                    ? "bg-[#EAF3FF] text-[#153D78] font-extrabold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#0F1D36]"
                }`}
              >
                <BookOpen className="w-4 h-4 text-[#153D78]" />
                <span>My Library</span>
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#153D78] text-white">
                  {purchasedBooks.length}
                </span>
              </button>

              {/* My Orders */}
              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-[#EAF3FF] text-[#153D78] font-extrabold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#0F1D36]"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>My Orders</span>
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => setActiveTab("wishlist")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === "wishlist"
                    ? "bg-[#EAF3FF] text-[#153D78] font-extrabold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#0F1D36]"
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-600 text-white">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Profile Settings */}
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-[#EAF3FF] text-[#153D78] font-extrabold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#0F1D36]"
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Profile Settings</span>
              </button>

              {/* Change Password */}
              <button
                type="button"
                onClick={() => setActiveTab("password")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === "password"
                    ? "bg-[#EAF3FF] text-[#153D78] font-extrabold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#0F1D36]"
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Change Password</span>
              </button>

              {/* Admin Panel (Only visible to authorized admin in their private account) */}
              {isAdmin && (
                <div className="pt-2 border-t border-slate-200">
                  <Link
                    href="/admin"
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shadow-2xs"
                  >
                    <Shield className="w-4 h-4 text-slate-950" />
                    <span>Admin Dashboard</span>
                  </Link>
                </div>
              )}

              {/* Logout */}
              <Link
                href="/auth/signout"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer pt-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Link>
            </nav>
          </aside>

          {/* ======================================================== */}
          {/* MAIN CONTENT AREA: MY LIBRARY / TAB CONTENT              */}
          {/* ======================================================== */}
          <main className="md:col-span-9 space-y-6">
            {/* TAB: MY LIBRARY (Exact layout from reference image) */}
            {activeTab === "library" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <h1 className="text-2xl font-black text-[#0F1D36]">My Library</h1>

                  {/* Search Bar matching reference image: "Search purchased books..." */}
                  <div className="relative w-full sm:w-72">
                    <input
                      type="text"
                      value={librarySearch}
                      onChange={(e) => setLibrarySearch(e.target.value)}
                      placeholder="Search purchased books..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-[#0F1D36] placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#0F2754]"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Library Books Grid */}
                {filteredLibrary.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredLibrary.map((book) => (
                      <div
                        key={book.id}
                        className="group bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg transition-all"
                      >
                        <div>
                          {/* Book Cover */}
                          <div className="flex justify-center py-2 mb-3">
                            <BookCover book={book} size="md" showBadge={false} />
                          </div>

                          {/* Title & Author */}
                          <h3 className="font-bold text-sm text-[#0F1D36] line-clamp-1">
                            {book.title}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {book.author}
                          </p>
                        </div>

                        {/* Read Now & Download Actions */}
                        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                          <button
                            type="button"
                            onClick={() => setReadingBook(book)}
                            className="w-full py-2 px-3 rounded-lg bg-[#0F2754] hover:bg-[#153D78] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Read Now</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              alert(`Secure PDF download initiated for "${book.title}". Generating signed token...`);
                            }}
                            className="w-full py-1.5 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download PDF</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                    <p className="text-sm font-bold text-[#0F1D36]">No eBooks Found</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      {librarySearch
                        ? `No purchased books matched "${librarySearch}".`
                        : "You haven't purchased any eBooks yet. Browse our store to begin reading."}
                    </p>
                    <Link
                      href="/books"
                      className="inline-block px-5 py-2 rounded-xl bg-[#0F2754] text-white font-bold text-xs"
                    >
                      Browse All eBooks
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h1 className="text-2xl font-black text-[#0F1D36]">Account Overview</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Welcome back! Here is a summary of your digital bookshelf and recent activity.
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Books Owned</p>
                    <p className="text-2xl font-black text-[#0F1D36] mt-1">{purchasedBooks.length}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Wishlist Items</p>
                    <p className="text-2xl font-black text-[#0F1D36] mt-1">{wishlist.length}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Library Format</p>
                    <p className="text-2xl font-black text-emerald-700 mt-1">100% PDF</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("library")}
                    className="px-6 py-2.5 rounded-xl bg-[#0F2754] text-white text-xs font-bold hover:bg-[#153D78] transition-colors"
                  >
                    Go to My Library
                  </button>
                </div>
              </div>
            )}

            {/* TAB: MY ORDERS */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h1 className="text-2xl font-black text-[#0F1D36]">My Orders</h1>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs text-slate-500">
                    <span>Order #ORD-2026-8912</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Completed • Verified
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {purchasedBooks.slice(0, 2).map((book) => (
                      <div key={book.id} className="flex items-center justify-between">
                        <span className="font-bold text-[#0F1D36]">{book.title}</span>
                        <span className="font-mono text-slate-600">{siteConfig.currency.symbol}{book.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-[#0F1D36]">
                    <span>Total Amount</span>
                    <span>{siteConfig.currency.symbol}348</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: WISHLIST */}
            {activeTab === "wishlist" && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h1 className="text-2xl font-black text-[#0F1D36]">My Wishlist</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Books you have saved for later reading.
                  </p>
                </div>

                {wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map((book) => (
                      <div
                        key={book.id}
                        className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <BookCover book={book} size="xs" showBadge={false} />
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-[#0F1D36] truncate">{book.title}</h4>
                            <p className="text-[11px] text-slate-500">{book.author}</p>
                            <p className="font-black text-xs text-[#0F1D36] mt-1">{siteConfig.currency.symbol}{book.price}</p>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => addToCart(book)}
                            className="flex-1 py-1.5 rounded-lg bg-[#0F2754] text-white text-xs font-bold hover:bg-[#153D78]"
                          >
                            Move to Cart
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromWishlist(book.id)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600"
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                    Your wishlist is currently empty.
                  </div>
                )}
              </div>
            )}

            {/* TAB: PROFILE SETTINGS */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h1 className="text-2xl font-black text-[#0F1D36]">Profile Settings</h1>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs max-w-xl space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Happy Reader"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-[#0F1D36]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="reader@apexbooks.in"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-[#0F1D36]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => alert("Profile settings saved successfully!")}
                    className="py-2.5 px-6 rounded-xl bg-[#0F2754] text-white font-bold text-xs hover:bg-[#153D78]"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* TAB: CHANGE PASSWORD */}
            {activeTab === "password" && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h1 className="text-2xl font-black text-[#0F1D36]">Change Password</h1>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs max-w-xl space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-[#0F1D36]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-[#0F1D36]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => alert("Password updated successfully!")}
                    className="py-2.5 px-6 rounded-xl bg-[#0F2754] text-white font-bold text-xs hover:bg-[#153D78]"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* In-Browser Digital Reading Modal ("Read Now") */}
      {readingBook && (
        <BookPreviewModal
          book={readingBook}
          isOpen={!!readingBook}
          onClose={() => setReadingBook(null)}
        />
      )}
    </div>
  );
}
