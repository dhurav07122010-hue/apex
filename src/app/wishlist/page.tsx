"use client";

import React from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { BookCard } from "@/components/BookCard";
import { Heart, ShoppingCart, ArrowLeft, ArrowRight, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveAllToCart = () => {
    wishlist.forEach((book) => {
      addToCart(book);
      removeFromWishlist(book.id);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2878D0] mb-1">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Saved Titles</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F1D36]">
            My Wishlist ({wishlist.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Books saved to read later or purchase together.
          </p>
        </div>

        {wishlist.length > 0 && (
          <button
            type="button"
            onClick={handleMoveAllToCart}
            className="px-5 py-2.5 rounded-xl bg-[#153D78] hover:bg-[#1B5EB0] text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Move All to Cart</span>
          </button>
        )}
      </div>

      {/* Content */}
      {wishlist.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#EAF3FF] text-[#153D78] flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-[#2878D0]" />
          </div>

          <h3 className="text-xl font-bold text-[#0F1D36]">
            Your Wishlist is Empty
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Explore our curated catalogue across technology, software architecture, business, and competitive examinations to save books you love.
          </p>

          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#153D78] hover:bg-[#1B5EB0] text-white font-bold text-xs transition-colors"
          >
            <span>Explore Bookstore</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-8">
          {wishlist.map((book) => (
            <div key={book.id} className="relative group">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
