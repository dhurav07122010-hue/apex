"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site";
import {
  ShieldCheck,
  Zap,
  Lock,
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function CheckoutPage() {
  const { cart, subtotal, totalItems } = useCart();
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [paymentMode, setPaymentMode] = useState<"demo" | "razorpay">("demo");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // In Phase 5, this will call the server order creation and Razorpay / isolated demo handler
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
    }, 1200);
  };

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold mb-2">No items to checkout</h2>
        <p className="text-xs text-zinc-500 mb-4">Please add eBooks to your cart before proceeding.</p>
        <Link
          href="/books"
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
        >
          Browse eBooks
        </Link>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
          Order Confirmed!
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
          Thank you, <strong className="text-zinc-900 dark:text-zinc-100">{customerName || "Reader"}</strong>. Your order has been placed successfully in <strong className="text-blue-600">Demo Mode</strong>.
        </p>

        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-left max-w-md mx-auto space-y-3">
          <div className="flex justify-between text-xs text-zinc-500 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <span>Customer Email</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{customerEmail}</span>
          </div>
          <div className="flex justify-between text-xs text-zinc-500 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <span>Payment Method</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {paymentMode === "demo" ? "Isolated Demo Simulator" : "Razorpay Test"}
            </span>
          </div>
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Digital Delivery Status</span>
            <span className="font-bold text-emerald-600">Entitlement Ready</span>
          </div>
        </div>

        <div className="pt-4 flex justify-center gap-4">
          <Link
            href="/books"
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold"
          >
            Back to Storefront
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Cart</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Checkout Form */}
        <div className="md:col-span-7 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Customer Details & Delivery
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Your cryptographically signed eBook download links will be tied to this verified identity.
            </p>
          </div>

          <form onSubmit={handleSubmitOrder} className="space-y-4">
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
                Email Address (For eBook Delivery)
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

            {/* Payment Mode Selector */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Select Payment Gateway
              </label>

              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-blue-500/50 bg-blue-50/30 dark:bg-blue-950/20 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="demo"
                    checked={paymentMode === "demo"}
                    onChange={() => setPaymentMode("demo")}
                    className="mt-0.5 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        Demo Payment Simulator
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        SANDBOX
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Test order placement instantly without requiring credit card or real funds.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="razorpay"
                    checked={paymentMode === "razorpay"}
                    onChange={() => setPaymentMode("razorpay")}
                    className="mt-0.5 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        Razorpay Gateway (Test Mode)
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        TESTNET
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Supports UPI, Cards, NetBanking via Razorpay Test API Keys (Configured in Phase 5).
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isProcessing
                    ? "Authorizing Transaction..."
                    : `Pay ${siteConfig.currency.symbol}${subtotal} & Download Instantly`}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Order Items Preview */}
        <div className="md:col-span-5 bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
            Order Items ({totalItems})
          </h3>
          <div className="space-y-3 max-h-72 overflow-y-auto divide-y divide-zinc-200/60 dark:divide-zinc-800">
            {cart.map((item) => (
              <div key={item.book.id} className="pt-2 first:pt-0 flex justify-between items-start gap-2">
                <div>
                  <p className="font-bold text-xs text-zinc-900 dark:text-zinc-100 line-clamp-1">
                    {item.book.title}
                  </p>
                  <p className="text-[11px] text-zinc-500">{item.book.format} • By {item.book.author}</p>
                </div>
                <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                  {siteConfig.currency.symbol}
                  {item.book.price}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal</span>
              <span>
                {siteConfig.currency.symbol}
                {subtotal}
              </span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Delivery</span>
              <span className="text-emerald-600 font-semibold">FREE (Instant)</span>
            </div>
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between font-bold text-sm text-zinc-900 dark:text-zinc-50">
              <span>Total</span>
              <span className="text-blue-600 dark:text-blue-400">
                {siteConfig.currency.symbol}
                {subtotal}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
