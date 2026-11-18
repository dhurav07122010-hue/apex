"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site";
import { BookCover } from "@/components/BookCover";
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Zap,
  Lock,
  Tag,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    if (!couponCode.trim()) return;

    if (couponCode.toUpperCase() === "APEX20" || couponCode.toUpperCase() === "LEARN20") {
      const discount = Math.round(subtotal * 0.2);
      setAppliedDiscount(discount);
      setCouponSuccess(`Coupon "${couponCode.toUpperCase()}" applied! 20% discount.`);
    } else {
      setCouponError("Invalid coupon code. Try 'APEX20'.");
    }
  };

  const finalTotal = Math.max(0, subtotal - appliedDiscount);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 mb-2">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-sm text-zinc-500 max-w-md mx-auto mb-8 leading-relaxed">
          You haven't selected any eBooks yet. Browse our curated library across technology, business, competitive exams, and more to begin reading.
        </p>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all"
        >
          <span>Browse Storefront</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
            Shopping Cart
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Review your digital selections ({totalItems} {totalItems === 1 ? "item" : "items"})
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden shadow-sm">
            {cart.map((item) => (
              <div key={item.book.id} className="p-5 flex flex-col sm:flex-row gap-5 items-start">
                <Link href={`/books/${item.book.slug}`} className="shrink-0 mx-auto sm:mx-0">
                  <BookCover book={item.book} size="sm" showBadge={false} />
                </Link>

                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        {item.book.categoryName}
                      </span>
                      <Link href={`/books/${item.book.slug}`}>
                        <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 hover:text-blue-600 transition-colors">
                          {item.book.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-zinc-500 mt-0.5">By {item.book.author}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.book.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Remove eBook"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-xs text-zinc-400 font-mono">
                      {item.book.format} • {item.book.fileSize} • Instant Delivery
                    </span>
                    <span className="text-lg font-black text-zinc-900 dark:text-zinc-50">
                      {siteConfig.currency.symbol}
                      {item.book.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 flex items-start gap-3">
            <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div className="text-xs text-zinc-600 dark:text-zinc-300">
              <strong className="text-zinc-900 dark:text-zinc-100">Zero Delivery Friction:</strong>{" "}
              Instant access links will be rendered immediately on the order confirmation screen and delivered to your registered email address.
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout Action */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-5">
            <h2 className="font-bold text-base text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              Order Summary
            </h2>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Items Subtotal ({totalItems})</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {siteConfig.currency.symbol}
                  {subtotal}
                </span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Promotional Coupon Discount</span>
                  <span className="font-semibold">
                    -{siteConfig.currency.symbol}
                    {appliedDiscount}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Instant Digital Delivery</span>
                <span className="text-emerald-600 font-semibold">FREE</span>
              </div>

              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>GST / Taxes</span>
                <span className="font-medium">Included</span>
              </div>

              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-baseline">
                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
                  Total Payable
                </span>
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {siteConfig.currency.symbol}
                  {finalTotal}
                </span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="pt-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code (try APEX20)"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 uppercase tracking-wider outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-900 text-white dark:bg-zinc-200 dark:text-zinc-950 text-xs font-semibold cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponSuccess && (
                <p className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {couponSuccess}
                </p>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {couponError}
                </p>
              )}
            </form>

            {/* Checkout Action */}
            <div className="pt-3 space-y-3">
              <Link
                href="/checkout"
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all text-center"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>SSL Secured • Razorpay / Demo Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
