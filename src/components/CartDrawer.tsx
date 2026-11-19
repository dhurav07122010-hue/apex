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
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0F2754]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-[#0F1D36] text-base">
                  Your Cart
                </h2>
                <span className="text-[11px] text-slate-500">
                  {totalItems} {totalItems === 1 ? "eBook" : "eBooks"} selected
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-[#0F2754]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-[#0F1D36] text-base">
                  Your cart is empty
                </h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Explore our curated catalogue of books and add your next great read to your digital library.
                </p>
                <Link
                  href="/books"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 text-xs font-bold rounded-full bg-[#0F2754] hover:bg-[#153D78] text-white transition-colors"
                >
                  Explore eBooks
                </Link>
              </div>
            ) : (
              cart
                .filter((item) => item?.book?.id)
                .map((item) => (
                <div key={item.book.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-start">
                  <Link
                    href={`/books/${item.book.slug}`}
                    onClick={() => setIsCartOpen(false)}
                    className="shrink-0"
                  >
                    <BookCover book={item.book} size="sm" showBadge={false} />
                  </Link>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <span className="text-[10px] font-bold text-[#153D78] uppercase tracking-wider">
                      {item.book.categoryName}
                    </span>
                    <Link
                      href={`/books/${item.book.slug}`}
                      onClick={() => setIsCartOpen(false)}
                    >
                      <h4 className="font-bold text-sm text-[#0F1D36] line-clamp-1 hover:text-[#153D78] transition-colors">
                        {item.book.title}
                      </h4>
                    </Link>
                    <p className="text-xs text-slate-500 truncate">By {item.book.author}</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {item.book.format} • Instant Delivery
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-black text-sm text-[#0F1D36]">
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
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3.5">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? "eBook" : "eBooks"})</span>
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
                <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline font-bold text-sm text-[#0F1D36]">
                  <span>Total Amount</span>
                  <span className="text-xl font-black text-[#0F1D36]">
                    {siteConfig.currency.symbol}
                    {subtotal}
                  </span>
                </div>
              </div>

              <div className="pt-1 space-y-2">
                {/* Golden Yellow Proceed to Checkout CTA */}
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#FDB813] hover:bg-amber-400 text-[#0F1D36] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all text-center"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center transition-colors text-center"
                >
                  View Full Cart &amp; Apply Coupons
                </Link>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted &amp; Instant Delivery</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
