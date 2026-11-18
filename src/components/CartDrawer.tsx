"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site";
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { BookCover } from "./BookCover";

export function CartDrawer() {
  const { cart, removeFromCart, isCartOpen, setIsCartOpen, subtotal, totalItems } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="font-bold text-zinc-900 dark:text-zinc-50 text-base">
                Your Shopping Cart
              </h2>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {totalItems}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-zinc-100 dark:divide-zinc-800">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs mb-6">
                  Explore our curated catalogue of eBooks and add titles to your digital bookshelf.
                </p>
                <Link
                  href="/books"
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  Explore Storefront
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
                    <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {item.book.categoryName}
                    </span>
                    <Link
                      href={`/books/${item.book.slug}`}
                      onClick={() => setIsCartOpen(false)}
                    >
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {item.book.title}
                      </h4>
                    </Link>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">By {item.book.author}</p>
                    <p className="text-[11px] font-mono text-zinc-400 mt-1">
                      {item.book.format} • Digital Download
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1">
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {siteConfig.currency.symbol}
                        {item.book.price}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.book.id)}
                        className="p-1 rounded text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Remove item"
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
            <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? "eBook" : "eBooks"})</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {siteConfig.currency.symbol}
                    {subtotal}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Digital Delivery & Handling</span>
                  <span className="text-emerald-600 font-semibold">FREE (Instant)</span>
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2 flex justify-between font-bold text-sm text-zinc-900 dark:text-zinc-50">
                  <span>Total Amount</span>
                  <span className="text-base text-blue-600 dark:text-blue-400">
                    {siteConfig.currency.symbol}
                    {subtotal}
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Go to Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
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
