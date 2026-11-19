"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site";
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Zap } from "lucide-react";
import { BookCover } from "./BookCover";

export function CartDrawer() {
  const { cart, removeFromCart, isCartOpen, setIsCartOpen, subtotal, totalItems } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E2E8F0] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] flex items-center justify-center text-[#153D78]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-[#153D78] text-base">
                  Your Shopping Cart
                </h2>
                <span className="text-[11px] text-slate-500">
                  {totalItems} {totalItems === 1 ? "book" : "books"} selected
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-[#F4F6FA] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-[#E2E8F0]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-[#EAF3FF] flex items-center justify-center text-[#153D78] mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-[#0F1D36] text-base mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mb-6 leading-relaxed">
                  Explore our curated catalogue of books and add your next great read to your digital library.
                </p>
                <Link
                  href="/books"
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold rounded-xl bg-[#153D78] hover:bg-[#2878D0] text-white transition-colors"
                >
                  Browse Storefront
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.book.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-start">
                  <Link
                    href={`/books/${item.book.slug}`}
                    onClick={() => setIsCartOpen(false)}
                    className="shrink-0"
                  >
                    <BookCover book={item.book} size="sm" showBadge={false} />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#2878D0] uppercase tracking-wider">
                      {item.book.categoryName}
                    </span>
                    <Link
                      href={`/books/${item.book.slug}`}
                      onClick={() => setIsCartOpen(false)}
                    >
                      <h4 className="font-bold text-sm text-[#0F1D36] line-clamp-1 hover:text-[#2878D0] transition-colors">
                        {item.book.title}
                      </h4>
                    </Link>
                    <p className="text-xs text-slate-500 truncate mt-0.5">By {item.book.author}</p>
                    <p className="text-[11px] text-slate-400 mt-1 font-mono">
                      {item.book.format} • Instant PDF Download
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-1 border-t border-[#F4F6FA]">
                      <span className="font-bold text-sm text-[#153D78]">
                        {siteConfig.currency.symbol}
                        {item.book.price}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.book.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove book"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#E2E8F0] bg-[#F4F6FA] space-y-3.5">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? "Book" : "Books"})</span>
                  <span className="font-bold text-[#0F1D36]">
                    {siteConfig.currency.symbol}
                    {subtotal}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-600" />
                    Digital Delivery
                  </span>
                  <span className="text-emerald-700 font-bold">FREE Instant</span>
                </div>
                <div className="border-t border-[#E2E8F0] pt-2 flex justify-between items-baseline font-bold text-sm text-[#0F1D36]">
                  <span>Total Amount</span>
                  <span className="text-xl font-black text-[#153D78]">
                    {siteConfig.currency.symbol}
                    {subtotal}
                  </span>
                </div>
              </div>

              <div className="pt-1 space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 px-4 rounded-xl bg-[#153D78] hover:bg-[#2878D0] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all text-center"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2 px-4 rounded-xl border border-[#E2E8F0] hover:bg-white text-slate-700 font-semibold text-xs flex items-center justify-center transition-colors text-center"
                >
                  View Full Cart & Apply Coupons
                </Link>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted & Instant Delivery</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
