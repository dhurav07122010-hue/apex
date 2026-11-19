"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site";
import { createClient } from "@/lib/supabase/client";
import { BookCover } from "@/components/BookCover";
import {
  ShieldCheck,
  Zap,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  CreditCard,
  Smartphone,
  Building,
  Wallet,
} from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const couponParam = searchParams.get("coupon");

  const { cart, subtotal, totalItems, clearCart, setIsCartOpen } = useCart();
  const [mounted, setMounted] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "wallet">("upi");
  const [gatewayMode, setGatewayMode] = useState<"demo" | "razorpay">("demo");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    setIsCartOpen(false);
  }, [setIsCartOpen]);

  // Discount calculation
  const discountAmount = couponParam === "FIRST50"
    ? Math.round(subtotal * 0.5)
    : couponParam === "APEX20"
    ? Math.round(subtotal * 0.2)
    : 0;

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setCustomerEmail(user.email || "");
        setCustomerName(user.user_metadata?.full_name || user.email?.split("@")[0] || "");
      } else {
        router.push(
          "/auth/signin?redirect=/checkout&message=" +
            encodeURIComponent("Please sign in first to complete your checkout.")
        );
      }
    });
  }, [router, supabase]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerEmail || !customerName) {
      setErrorMessage("Please fill in your name and email address.");
      return;
    }

    setIsProcessing(true);

    try {
      if (gatewayMode === "demo") {
        const response = await fetch("/api/checkout/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerEmail,
            customerName,
            customerPhone,
            paymentMethod,
            items: cart.map((item) => ({ id: item.book.id, slug: item.book.slug })),
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          setErrorMessage(data.error || "Failed to process order.");
          setIsProcessing(false);
          return;
        }

        setCompletedOrder({
          orderNumber: data.orderNumber,
          customerEmail,
          customerName,
          totalAmount: finalTotal,
          items: [...cart],
        });

        clearCart();
        setIsProcessing(false);
      } else {
        // Razorpay Gateway Flow
        setErrorMessage(
          "Razorpay live/test keys must be configured in environment variables. Switched to secure Demo Sandbox mode."
        );
        setGatewayMode("demo");
        setIsProcessing(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  // ORDER SUCCESS CONFIRMATION SCREEN
  if (completedOrder) {
    return (
      <div className="bg-white min-h-[80vh] py-16 flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 w-full">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F1D36]">
                Order Confirmed!
              </h1>
              <p className="text-xs text-slate-500">
                Order ID: <strong className="text-[#0F1D36]">{completedOrder.orderNumber}</strong>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Thank you, <strong className="text-[#0F1D36]">{completedOrder.customerName}</strong>! Your eBooks have been added to your digital bookshelf and instant download links have been sent to{" "}
              <strong className="text-[#0F1D36]">{completedOrder.customerEmail}</strong>.
            </p>

            {/* Purchased Items List */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-3">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Purchased Books
              </p>
              {completedOrder.items.map((item: any) => (
                <div key={item.book.id} className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-[#0F1D36] truncate">{item.book.title}</span>
                  <span className="font-mono text-slate-600 shrink-0">
                    {siteConfig.currency.symbol}{item.book.price}
                  </span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-xs font-black text-[#0F1D36]">
                <span>Total Paid</span>
                <span>{siteConfig.currency.symbol}{completedOrder.totalAmount}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/account"
                className="flex-1 py-3 px-6 rounded-xl bg-[#0F2754] hover:bg-[#153D78] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md text-center"
              >
                Go to My Library
              </Link>
              <Link
                href="/books"
                className="flex-1 py-3 px-6 rounded-xl border border-slate-300 hover:bg-slate-50 text-[#0F1D36] font-bold text-xs uppercase tracking-wider transition-colors text-center"
              >
                Continue Browsing
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!mounted || cart.length === 0) {
    if (!mounted) {
      return (
        <div className="bg-white min-h-[70vh] py-16 flex items-center justify-center">
          <div className="max-w-md mx-auto px-4 text-center space-y-4">
            <div className="h-8 w-48 bg-slate-100 animate-pulse mx-auto rounded" />
            <div className="h-4 w-64 bg-slate-100 animate-pulse mx-auto rounded" />
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white min-h-[70vh] py-16 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl font-black text-[#0F1D36]">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500">
            Please select at least one eBook before proceeding to checkout.
          </p>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F2754] text-white font-bold text-xs uppercase"
          >
            Explore Books
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
          <Link href="/cart" className="hover:text-[#0F2754]">
            Cart
          </Link>
          <span>&gt;</span>
          <span className="font-bold text-[#0F1D36]">Checkout</span>
        </nav>

        {/* Stepper (Matching Reference Image: 1. Shipping -> 2. Payment -> 3. Review) */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-center gap-3 sm:gap-8 text-xs font-bold">
            <div className="flex items-center gap-2 text-[#0F2754]">
              <div className="w-6 h-6 rounded-full bg-[#0F2754] text-white flex items-center justify-center text-[11px]">
                1
              </div>
              <span>Details</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-300" />
            <div className="flex items-center gap-2 text-[#0F2754]">
              <div className="w-6 h-6 rounded-full bg-[#FDB813] text-[#0F1D36] flex items-center justify-center text-[11px] font-black">
                2
              </div>
              <span>Payment</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-300" />
            <div className="flex items-center gap-2 text-slate-400">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[11px]">
                3
              </div>
              <span>Instant Access</span>
            </div>
          </div>
        </div>

        {/* Checkout Form & Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Customer Info & Payment Methods */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Customer Information Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-black text-sm text-[#0F1D36] uppercase tracking-wider">
                  Customer Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-[#0F1D36] placeholder:text-slate-400 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0F2754]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-[#0F1D36] placeholder:text-slate-400 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0F2754]"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      eBook download link and library access will be sent here.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-[#0F1D36] placeholder:text-slate-400 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0F2754]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector (Matching Reference Design) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-black text-sm text-[#0F1D36] uppercase tracking-wider">
                  Payment Method
                </h3>

                <div className="space-y-2.5">
                  {/* UPI */}
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === "upi"
                        ? "border-[#0F2754] bg-blue-50/40"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "upi"}
                        onChange={() => setPaymentMethod("upi")}
                        className="w-4 h-4 text-[#0F2754]"
                      />
                      <Smartphone className="w-4 h-4 text-[#0F2754]" />
                      <span className="text-xs font-bold text-[#0F1D36]">
                        UPI (Google Pay, PhonePe, Paytm, BHIM)
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Instant
                    </span>
                  </label>

                  {/* Cards */}
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === "card"
                        ? "border-[#0F2754] bg-blue-50/40"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="w-4 h-4 text-[#0F2754]"
                      />
                      <CreditCard className="w-4 h-4 text-[#0F2754]" />
                      <span className="text-xs font-bold text-[#0F1D36]">
                        Credit / Debit Card (Visa, Mastercard, RuPay)
                      </span>
                    </div>
                  </label>

                  {/* Net Banking */}
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === "netbanking"
                        ? "border-[#0F2754] bg-blue-50/40"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "netbanking"}
                        onChange={() => setPaymentMethod("netbanking")}
                        className="w-4 h-4 text-[#0F2754]"
                      />
                      <Building className="w-4 h-4 text-[#0F2754]" />
                      <span className="text-xs font-bold text-[#0F1D36]">
                        Net Banking (All Indian Banks)
                      </span>
                    </div>
                  </label>

                  {/* Wallets */}
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === "wallet"
                        ? "border-[#0F2754] bg-blue-50/40"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "wallet"}
                        onChange={() => setPaymentMethod("wallet")}
                        className="w-4 h-4 text-[#0F2754]"
                      />
                      <Wallet className="w-4 h-4 text-[#0F2754]" />
                      <span className="text-xs font-bold text-[#0F1D36]">
                        Wallets &amp; Others
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Gateway Sandbox Mode Indicator */}
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center justify-between">
                <span>
                  Payment Mode: <strong>{finalTotal === 0 ? "Free Claim / Instant Grant" : "Razorpay Demo Sandbox"}</strong> ({finalTotal === 0 ? "Complimentary" : "Zero Real Charge"})
                </span>
                <span className="font-bold text-amber-800">Verified</span>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                  {errorMessage}
                </div>
              )}

              {/* Navy Blue CTA: "Pay Now" or "Get Free Demo eBook" */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 px-6 rounded-xl bg-[#0F2754] hover:bg-[#153D78] text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isProcessing
                  ? "Processing Secure Order..."
                  : finalTotal === 0
                  ? "Get Free Demo eBook • Free"
                  : `Pay Now • ${siteConfig.currency.symbol}${finalTotal}`}
              </button>

              {/* Security note matching reference image */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Your payment is secure and encrypted</span>
              </div>
            </form>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-black text-sm text-[#0F1D36] uppercase tracking-wider pb-3 border-b border-slate-200">
              Order Summary ({totalItems} {totalItems === 1 ? "Item" : "Items"})
            </h3>

            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.book.id} className="py-3 flex items-center gap-3">
                  <BookCover book={item.book} size="xs" showBadge={false} />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-[#0F1D36] truncate">
                      {item.book.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-xs text-[#0F1D36]">
                    {item.book.price === 0 ? (
                      <span className="text-emerald-600 font-black">FREE</span>
                    ) : (
                      `${siteConfig.currency.symbol}${item.book.price * item.quantity}`
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-slate-200 pt-3 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#0F1D36]">
                  {subtotal === 0 ? "FREE" : `${siteConfig.currency.symbol}${subtotal}`}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-bold">
                  <span>Discount ({couponParam})</span>
                  <span>-{siteConfig.currency.symbol}{discountAmount}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Taxes (GST)</span>
                <span>Included</span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-base font-black text-[#0F1D36]">
                <span>Total Amount</span>
                <span>{siteConfig.currency.symbol}{finalTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
