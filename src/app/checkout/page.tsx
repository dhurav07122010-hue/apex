"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site";
import { createClient } from "@/lib/supabase/client";
import {
  ShieldCheck,
  Zap,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Download,
  BookOpen,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";

export default function CheckoutPage() {
  const { cart, subtotal, totalItems, clearCart } = useCart();
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [paymentMode, setPaymentMode] = useState<"demo" | "razorpay">("demo");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  const supabase = createClient();

  // Prefill customer email if logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setCustomerEmail(user.email || "");
        setCustomerName(
          user.user_metadata?.full_name || user.email?.split("@")[0] || ""
        );
      }
    });
  }, []);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsProcessing(true);

    try {
      if (paymentMode === "demo") {
        const response = await fetch("/api/checkout/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerEmail,
            customerName,
            items: cart.map((item) => ({ id: item.book.id, slug: item.book.slug })),
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          setErrorMessage(data.error || "Failed to process demo order.");
          setIsProcessing(false);
          return;
        }

        // Store completed order data for the confirmation screen
        setCompletedOrder({
          orderNumber: data.orderNumber,
          customerEmail,
          customerName,
          totalAmount: data.totalAmount,
          items: [...cart],
        });

        // Clear cart
        clearCart();
        setIsProcessing(false);
      } else {
        // Razorpay Test Mode
        setErrorMessage(
          "Razorpay Test Mode requires configuring your test API keys in .env.local. Please select Demo Mode to test order placement."
        );
        setIsProcessing(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  // Empty cart view (before order completed)
  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
          Your Cart is Empty
        </h2>
        <p className="text-xs text-zinc-500 max-w-xs mx-auto">
          Add eBooks from our catalogue to proceed with secure checkout.
        </p>
        <div className="pt-2">
          <Link
            href="/books"
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 transition-all inline-block"
          >
            Browse eBooks
          </Link>
        </div>
      </div>
    );
  }

  // --- ORDER CONFIRMED RECEIPT SCREEN ---
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8 animate-in fade-in duration-300">
        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
            Order Confirmed & Entitlements Ready!
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            Thank you, <strong className="text-zinc-900 dark:text-zinc-100">{completedOrder.customerName || "Reader"}</strong>. Your order has been registered in the database.
          </p>
        </div>

        {/* Order Receipt Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 gap-2">
            <div>
              <span className="text-[11px] text-zinc-400 uppercase tracking-widest font-mono">
                Order Reference
              </span>
              <p className="font-mono font-black text-base text-blue-600 dark:text-blue-400">
                {completedOrder.orderNumber}
              </p>
            </div>
            <div className="text-sm sm:text-right">
              <span className="text-[11px] text-zinc-400 uppercase tracking-widest font-mono">
                Payment Gateway
              </span>
              <p className="font-bold text-xs text-zinc-800 dark:text-zinc-200">
                Isolated Demo Sandbox
              </p>
            </div>
          </div>

          {/* Delivery & Entitlement Notice */}
          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 flex items-start gap-3">
            <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div className="text-xs text-zinc-700 dark:text-zinc-300 space-y-0.5">
              <p className="font-bold text-zinc-900 dark:text-zinc-100">
                Digital Rights Granted to: {completedOrder.customerEmail}
              </p>
              <p>
                Your purchase entitlement records have been recorded on Supabase. You have lifetime access to re-download these files.
              </p>
            </div>
          </div>

          {/* Purchased Books List with Download Links */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400">
              Purchased eBooks ({completedOrder.items.length})
            </h3>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
              {completedOrder.items.map((item: any) => (
                <div
                  key={item.book.id}
                  className="p-4 flex items-center justify-between gap-4 bg-zinc-50/40 dark:bg-zinc-950/30"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">
                      {item.book.categoryName}
                    </span>
                    <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                      {item.book.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      Format: {item.book.format} • By {item.book.author}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                      {siteConfig.currency.symbol}{item.book.price}
                    </span>
                    <Link
                      href="/account"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Receipt Total */}
          <div className="pt-2 flex justify-between items-baseline font-bold text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Total Paid (Demo Simulator)</span>
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
              {siteConfig.currency.symbol}{completedOrder.totalAmount}
            </span>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Link
              href="/account"
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all text-center"
            >
              <BookOpen className="w-4 h-4" />
              <span>Go to My Digital Bookshelf</span>
            </Link>

            <Link
              href="/books"
              className="py-3 px-5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-xs text-center transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- CHECKOUT FORM ---
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Cart</span>
      </Link>

      {/* Demo Sandbox Alert Ribbon */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-200 space-y-0.5">
          <p className="font-bold">Sandbox Demo Payment Simulator Active</p>
          <p className="text-amber-800 dark:text-amber-300">
            This checkout interface connects directly to your Supabase backend to generate real order records, purchase entitlements, and digital download access without charging any real money.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer Details & Gateway Selector */}
        <div className="md:col-span-7 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Customer Information & Delivery
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Your cryptographically verified eBook files will be tied to this email.
            </p>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Devendra Verma"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Email Address (Digital Delivery Destination) *
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="devendra@example.com"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Payment Gateway Options */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Payment Method
              </label>

              <div className="space-y-3">
                {/* 1. Demo Mode (Active) */}
                <label className="flex items-start gap-3 p-4 rounded-2xl border-2 border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 cursor-pointer transition-all">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="demo"
                    checked={paymentMode === "demo"}
                    onChange={() => setPaymentMode("demo")}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        Isolated Demo Payment Simulator
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                        READY TO TEST
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Simulate a completed order instantly. Writes to Supabase orders, payments, and entitlements tables.
                    </p>
                  </div>
                </label>

                {/* 2. Razorpay Test Mode */}
                <label className="flex items-start gap-3 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/30 cursor-pointer transition-all">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="razorpay"
                    checked={paymentMode === "razorpay"}
                    onChange={() => setPaymentMode("razorpay")}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        Razorpay Gateway (Test Mode)
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        TESTNET
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Enables UPI, NetBanking, and card testing using Razorpay Test API keys.
                    </p>
                  </div>
                </label>

                {/* 3. Razorpay Live Mode (Locked) */}
                <div className="flex items-start gap-3 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-100/50 dark:bg-zinc-900/20 opacity-60 cursor-not-allowed">
                  <input type="radio" disabled className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                        Razorpay Gateway (Live Mode)
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-200 text-zinc-600">
                        LOCKED
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Strict Guardrail: Live payments require explicit approval.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 space-y-3">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isProcessing
                    ? "Authorizing & Registering Order..."
                    : `Complete Demo Payment (${siteConfig.currency.symbol}${subtotal})`}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-Bit SSL Encrypted & Database-Backed Entitlement</span>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="md:col-span-5 bg-zinc-50 dark:bg-zinc-900/60 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-5">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-3">
            Cart Summary ({totalItems} {totalItems === 1 ? "item" : "items"})
          </h3>

          <div className="space-y-3 max-h-72 overflow-y-auto divide-y divide-zinc-200/60 dark:divide-zinc-800">
            {cart.map((item) => (
              <div key={item.book.id} className="pt-2.5 first:pt-0 flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 line-clamp-1">
                    {item.book.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    {item.book.format} • By {item.book.author}
                  </p>
                </div>
                <span className="font-black text-xs text-zinc-900 dark:text-zinc-100 shrink-0">
                  {siteConfig.currency.symbol}{item.book.price}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {siteConfig.currency.symbol}{subtotal}
              </span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Digital Delivery</span>
              <span className="text-emerald-600 font-semibold">FREE (Instant)</span>
            </div>
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between font-bold text-sm">
              <span className="text-zinc-900 dark:text-zinc-50">Total Payable</span>
              <span className="text-xl text-blue-600 dark:text-blue-400">
                {siteConfig.currency.symbol}{subtotal}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
