import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ShieldCheck, HelpCircle, Mail } from "lucide-react";

export const metadata = {
  title: "Refund & Cancellation Policy — ApexBooks",
  description: "Learn about our fair 7-day digital refund guarantee for corrupted or inaccessible files.",
};

export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-white">
      <div className="border-b border-[#E2E8F0] pb-6 mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2878D0]">
          Customer Satisfaction
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0F1D36] tracking-tight mt-1">
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Last updated: January 2026 • 7-day digital guarantee for technical defects.
        </p>
      </div>

      <div className="prose prose-slate max-w-none space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <div className="p-5 rounded-2xl bg-[#EAF3FF] border border-[#BFDBFE] space-y-2">
          <div className="flex items-center gap-2 text-[#153D78] font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-[#2878D0]" />
            <span>Our 7-Day Digital Defect Guarantee</span>
          </div>
          <p className="text-xs text-slate-700">
            Because digital eBooks are fulfilled instantly, standard return policies do not apply once a file is downloaded. However, if any purchased file is corrupt, incomplete, inaccessible, or differs substantially from its description, we provide a full refund or immediate replacement within 7 calendar days.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0F1D36]">1. Eligible Refund Scenarios</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Technical Corruption:</strong> The downloaded PDF or ePub file cannot be opened by standard reader software.</li>
            <li><strong>Duplicate Charges:</strong> An inadvertent duplicate payment for the same title.</li>
            <li><strong>Incomplete Publication:</strong> Missing chapters or corrupted typography unreadable due to formatting errors.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0F1D36]">2. Ineligible Refund Scenarios</h2>
          <p>
            Refunds cannot be issued for simple change of mind after the file has been successfully downloaded and consumed, or due to third-party software incompatibilities where universal PDF standards are otherwise intact.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0F1D36]">3. How to Request a Refund</h2>
          <p>
            Email our support desk at <a href="mailto:support@apexbooks.demo" className="text-[#2878D0] underline font-semibold">{siteConfig.supportEmail}</a> with:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your Order Number (e.g. <code>ORD-...</code> or <code>DEMO-ORD-...</code>)</li>
            <li>The registered customer email used during checkout</li>
            <li>A brief description or screenshot of the defect</li>
          </ul>
          <p className="text-xs text-slate-500 mt-2">
            Approved refunds are credited back to the original payment source (UPI account or card) within 5–7 business days via Razorpay.
          </p>
        </section>
      </div>
    </div>
  );
}
