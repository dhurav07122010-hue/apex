import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Terms & Conditions — ApexBooks",
  description: "Terms and conditions governing the purchase and reading of digital eBooks on ApexBooks.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-white">
      <div className="border-b border-[#E2E8F0] pb-6 mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2878D0]">
          Legal & Compliance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0F1D36] tracking-tight mt-1">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Last updated: January 2026 • Governs all digital eBook transactions on ApexBooks.
        </p>
      </div>

      <div className="prose prose-slate max-w-none space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0F1D36]">1. Digital eBook Licensing</h2>
          <p>
            When you purchase an eBook on ApexBooks, you are granted a personal, non-exclusive, non-transferable perpetual digital reading license. You may read the book on any personal device (e-reader, iPad, Android tablet, smartphone, laptop).
          </p>
          <p>
            You may not redistribute, resell, re-host, upload to public torrent repositories, or commercially syndicate purchased eBooks without explicit written authorization from the copyright holder.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0F1D36]">2. Digital Delivery & Quotas</h2>
          <p>
            Digital eBook download links are cryptographically signed and expire after 1 hour to prevent unauthorized link sharing. You may re-generate fresh download links from your account bookshelf anytime, subject to our standard fair-use quota of 50 downloads per title.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0F1D36]">3. Payment & Pricing</h2>
          <p>
            All prices are quoted in Indian Rupees (INR ₹). Payment is executed through Razorpay. Once an order is confirmed, digital access is provisioned immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0F1D36]">4. Governing Law</h2>
          <p>
            These terms are governed by the laws of India. Any disputes arising from transactions on this platform shall be subject to the jurisdiction of courts in India.
          </p>
        </section>
      </div>
    </div>
  );
}
