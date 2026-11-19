"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site";
import { BookCover } from "@/components/BookCover";
import {
  X,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Zap,
  Check,
  Plus,
  Minus,
} from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();
  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedCouponName, setAppliedCouponName] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === "FIRST50") {
      const discount = Math.round(subtotal * 0.5);
      setAppliedDiscount(discount);
      setAppliedCouponName("FIRST50 (50% OFF)");
      setCouponSuccess("Success! 50% discount has been applied to your cart.");
    } else if (code === "APEX20" || code === "LEARN20") {
      const discount = Math.round(subtotal * 0.2);
      setAppliedDiscount(discount);
      setAppliedCouponName("APEX20 (20% OFF)");
      setCouponSuccess("Success! 20% discount has been applied to your cart.");
    } else {
      setCouponError("Invalid coupon code. Try 'FIRST50' or 'APEX20'.");
    }
  };

  const finalTotal = Math.max(0, subtotal - appliedDiscount);

  if (!mounted || cart.length === 0) {
    if (!mounted) {
      return (
        <div className="bg-white min-h-[70vh] py-16 flex items-center justify-center">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 animate-pulse mx-auto mb-4" />
            <div className="h-6 w-48 bg-slate-100 animate-pulse mx-auto mb-2 rounded" />
            <div className="h-4 w-64 bg-slate-100 animate-pulse mx-auto rounded" />
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white min-h-[70vh] py-16 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-[#0F2754] mx-auto mb-6 shadow-sm">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-[#0F1D36] mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed">
            You haven&apos;t added any eBooks to your shopping cart yet. Browse our curated collection to start learning.
          </p>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0F2754] hover:bg-[#153D78] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            <span>Explore eBooks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#0F2754]">
            Home
          </Link>
          <span>&gt;</span>
          <span className="font-bold text-[#0F1D36]">Shopping Cart</span>
        </nav>

        {/* Heading matching reference image: "Your Cart (X Items)" */}
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F1D36] tracking-tight">
            Your Cart ({totalItems} {totalItems === 1 ? "Item" : "Items"})
          </h1>
        </div>

        {/* Cart Items List */}
        <div className="divide-y divide-slate-200 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          {cart.map((item) => (
            <div
              key={item.book.id}
              className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <Link href={`/books/${item.book.slug}`} className="shrink-0">
                  <BookCover book={item.book} size="sm" showBadge={false} />
                </Link>

                <div className="space-y-1">
                  <Link href={`/books/${item.book.slug}`}>
                    <h3 className="font-bold text-sm sm:text-base text-[#0F1D36] hover:text-[#153D78] transition-colors">
                      {item.book.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500">{item.book.author}</p>
                  <p className="text-xs font-bold text-[#0F1D36] pt-1">
                    {siteConfig.currency.symbol}
                    {item.book.price}
                  </p>
                </div>
              </div>

              {/* Quantity Controls & Line Item Total & Remove */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0">
                {/* Quantity Controls [-] 1 [+] */}
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.book.id, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                    className="p-1.5 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-[#0F1D36]">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                    className="p-1.5 hover:bg-slate-200 text-slate-600 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Total Line Price */}
                <span className="text-base font-black text-[#0F1D36]">
                  {siteConfig.currency.symbol}
                  {item.book.price * item.quantity}
                </span>

                {/* Remove 'X' Button */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.book.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Remove from cart"
                  aria-label="Remove item"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon Code Section */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
          <form onSubmit={handleApplyCoupon} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Apply Coupon (e.g. FIRST50)"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-[#0F1D36] placeholder:text-slate-400 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0F2754]"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0F2754] hover:bg-[#153D78] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Apply
            </button>
          </form>

          {couponSuccess && (
            <p className="mt-2 text-xs font-bold text-emerald-700 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>{couponSuccess}</span>
            </p>
          )}
          {couponError && (
            <p className="mt-2 text-xs font-bold text-rose-600">
              {couponError}
            </p>
          )}
        </div>

        {/* Order Summary Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="space-y-2.5 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-[#0F1D36]">
                {siteConfig.currency.symbol}
                {subtotal}
              </span>
            </div>

            {appliedDiscount > 0 ? (
              <div className="flex items-center justify-between text-emerald-700 font-bold">
                <span>Discount ({appliedCouponName})</span>
                <span>
                  -{siteConfig.currency.symbol}
                  {appliedDiscount}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span>Discount</span>
                <span>-₹0</span>
              </div>
            )}

            <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-base sm:text-lg font-black text-[#0F1D36]">
              <span>Total</span>
              <span>
                {siteConfig.currency.symbol}
                {finalTotal}
              </span>
            </div>
          </div>

          {/* Golden Yellow Button: "Proceed to Checkout →" */}
          <Link
            href={`/checkout${appliedDiscount > 0 ? `?coupon=${couponCode.toUpperCase()}` : ""}`}
            className="w-full py-3.5 px-6 rounded-xl bg-[#FDB813] hover:bg-amber-400 text-[#0F1D36] text-center font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all block"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Continue Shopping Link */}
          <div className="text-center pt-2">
            <Link
              href="/books"
              className="text-xs font-bold text-[#153D78] hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
