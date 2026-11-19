import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, BookOpen } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed — ApexBooks",
  description: "Your digital eBook purchase has been confirmed. Access your new titles now.",
};

export default function OrderSuccessPage() {
  return (
    <div className="bg-white min-h-[75vh] py-16 flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F1D36]">
            Payment Successful!
          </h1>
          <p className="text-xs text-slate-500">
            Your eBooks have been unlocked and added to your personal library.
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
          An email receipt along with direct secure download links has been dispatched to your email address. You can also start reading immediately online.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-3">
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
            Browse More Books
          </Link>
        </div>
      </div>
    </div>
  );
}
