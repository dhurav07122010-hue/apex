import React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Unsuccessful — ApexBooks",
  description: "Your payment could not be processed. Please try again or choose another payment method.",
};

export default function PaymentFailedPage() {
  return (
    <div className="bg-white min-h-[75vh] py-16 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F1D36]">
            Payment Failed
          </h1>
          <p className="text-xs text-slate-500">
            We were unable to complete your transaction with Razorpay.
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
          No charges were deducted from your account. This could happen due to a network timeout, insufficient bank balance, or an issue with your payment gateway.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <Link
            href="/checkout"
            className="flex-1 py-3 px-6 rounded-xl bg-[#0F2754] hover:bg-[#153D78] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md text-center flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Link>
          <Link
            href="/cart"
            className="flex-1 py-3 px-6 rounded-xl border border-slate-300 hover:bg-slate-50 text-[#0F1D36] font-bold text-xs uppercase tracking-wider transition-colors text-center"
          >
            Review Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
