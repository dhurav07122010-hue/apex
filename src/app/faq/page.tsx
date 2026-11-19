"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How do I receive my eBook after purchasing?",
      a: "Immediately upon successful payment, your eBook is automatically delivered into your personal ApexBooks account under 'My Library'. You will also receive an instant email containing a secure, cryptographically signed download link for offline reading on any device.",
    },
    {
      q: "What file formats are the eBooks provided in?",
      a: "All our eBooks are delivered in pristine, high-resolution PDF format with searchable text, interactive table of contents, and responsive typographic scaling suitable for iPads, Kindles, Android tablets, laptops, and mobile readers.",
    },
    {
      q: "Can I download my eBooks again in the future?",
      a: "Yes! You have lifetime access to your digital bookshelf. Simply sign in to your ApexBooks account at any time and re-download your books or read them directly within our in-browser digital reader.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We support all major Indian payment methods through Razorpay, including UPI (Google Pay, PhonePe, Paytm, BHIM), RuPay, Visa, Mastercard, and Net Banking across 50+ Indian banks.",
    },
    {
      q: "What is your refund policy for eBooks?",
      a: "Because eBooks are instant digital deliveries, purchases are generally final once the download link is accessed. However, if you experience any technical corruption or receive the wrong edition, contact our 24/7 support within 48 hours and we will promptly replace or refund your purchase.",
    },
    {
      q: "How does the FIRST50 coupon code work?",
      a: "Use code FIRST50 during checkout on your first purchase to receive an instant 50% discount on any eBook in our catalog. Simply enter FIRST50 in the coupon box on the Cart or Checkout page and click Apply.",
    },
  ];

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#0F2754]">
            Home
          </Link>
          <span>&gt;</span>
          <span className="font-bold text-[#0F1D36]">Frequently Asked Questions</span>
        </nav>

        {/* Heading */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-[#FDB813]" />
            <h1 className="text-3xl sm:text-4xl font-black text-[#0F1D36] tracking-tight">
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Everything you need to know about purchasing, accessing, and reading digital eBooks on ApexBooks.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="p-5 sm:p-6 transition-colors hover:bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-[#0F1D36]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#0F2754]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed animate-in fade-in duration-150">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions card */}
        <div className="bg-[#FAF9F5] p-6 sm:p-8 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-[#0F1D36]">
              Still have questions?
            </h3>
            <p className="text-xs text-slate-500">
              Our dedicated customer support team is available 24/7 to assist you.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-2.5 rounded-full bg-[#0F2754] hover:bg-[#153D78] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <span>Contact Support</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
