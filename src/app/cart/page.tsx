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
  ChevronRight,
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
      <div className="bg-[#F4F6FA] min-h-[70vh] py-16 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-3xl bg-[#EAF3FF] flex items-center justify-center text-[#153D78] mx-auto mb-6 shadow-sm">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-[#153D78] mb-2">
            Your Shopping Cart is Empty
          </h1>
          <p className="text-sm text-slate-600 max-w-sm mx-auto mb-8 leading-relaxed">
            You haven't selected any books yet. Explore our curated collections across programming, business, exams, and more.
          </p>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#153D78] hover:bg-[#2878D0] text-white font-bold text-sm shadow-md transition-all"
          >
            <span>Explore Bookstore</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F6FA] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-[#153D78] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/books" className="hover:text-[#153D78] transition-colors">
            Books
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#153D78] font-bold">Shopping Cart</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#153D78] tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review your selections ({totalItems} {totalItems === 1 ? "item" : "items"})
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] divide-y divide-[#E2E8F0] overflow-hidden shadow-sm">
              {cart.map((item) => (
                <div key={item.book.id} className="p-5 flex flex-col sm:flex-row gap-5 items-start">
                  <Link href={`/books/${item.book.slug}`} className="shrink-0 mx-auto sm:mx-0">
                    <BookCover book={item.book} size="sm" showBadge={false} />
                  </Link>

                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-[#2878D0] uppercase tracking-wider">
                          {item.book.categoryName}
                        </span>
                        <Link href={`/books/${item.book.slug}`}>
                          <h3 className="font-bold text-base text-[#0F1D36] hover:text-[#2878D0] transition-colors">
                            {item.book.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-slate-500 mt-0.5">By {item.book.author}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.book.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove book"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#F4F6FA] flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-mono">
                        {item.book.format} • {item.book.fileSize} • Instant Delivery
                      </span>
                      <span className="text-lg font-black text-[#153D78]">
                        {siteConfig.currency.symbol}
                        {item.book.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl border border-[#2878D0]/30 bg-[#EAF3FF] flex items-start gap-3">
              <Zap className="w-5 h-5 text-[#153D78] mt-0.5 shrink-0" />
              <div className="text-xs text-[#0F1D36]">
                <strong className="text-[#153D78]">Zero Delivery Friction:</strong>{" "}
                Instant access links will be delivered immediately on the order confirmation screen and saved to your personal bookshelf for lifetime downloads.
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-5">
              <h2 className="font-bold text-base text-[#153D78] border-b border-[#E2E8F0] pb-3">
                Order Summary
              </h2>

              {/* Price Calculations */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Items Subtotal ({totalItems})</span>
                  <span className="font-bold text-[#0F1D36]">
                    {siteConfig.currency.symbol}
                    {subtotal}
                  </span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Promotional Coupon Discount</span>
                    <span>
                      -{siteConfig.currency.symbol}
                      {appliedDiscount}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Instant Digital Delivery</span>
                  <span className="text-emerald-700 font-bold">FREE</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>GST / Indian Taxes</span>
                  <span className="font-semibold text-slate-700">Included</span>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex justify-between items-baseline">
                  <span className="font-bold text-sm text-[#0F1D36]">
                    Total Payable
                  </span>
                  <span className="text-2xl font-black text-[#153D78]">
                    {siteConfig.currency.symbol}
                    {finalTotal}
                  </span>
                </div>
              </div>

              {/* Coupon Code Input */}
              <form onSubmit={handleApplyCoupon} className="pt-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon code (e.g. APEX20)"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F4F6FA] border border-[#E2E8F0] uppercase tracking-wider outline-none focus:border-[#2878D0]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#153D78] hover:bg-[#2878D0] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponSuccess && (
                  <p className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1.5 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {couponSuccess}
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1.5 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {couponError}
                  </p>
                )}
              </form>

              {/* Checkout Action */}
              <div className="pt-3 space-y-3">
                <Link
                  href="/checkout"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#153D78] hover:bg-[#2878D0] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all text-center"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SSL Secured • Razorpay / Demo Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
