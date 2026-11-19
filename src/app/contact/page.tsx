"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  Mail,
  Headphones,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  FileText,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [subject, setSubject] = useState("Order Support");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#EAF3FF] to-white py-12 sm:py-16 border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#BFDBFE] text-[#153D78] text-xs font-bold shadow-xs">
            <Headphones className="w-3.5 h-3.5 text-[#2878D0]" />
            <span>Dedicated Customer Care</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#0F1D36] tracking-tight">
            How Can We Assist You?
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Have questions about digital downloads, payment receipts, or author submissions? Our support team is here to help.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Information & FAQs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#F4F6FA] border border-[#E2E8F0] space-y-4">
              <h3 className="font-bold text-base text-[#0F1D36]">
                Customer Support Channels
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white text-[#153D78] shadow-xs shrink-0">
                    <Mail className="w-4 h-4 text-[#2878D0]" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">Email Inquiries</h5>
                    <p className="text-slate-500 font-mono mt-0.5">{siteConfig.supportEmail}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Average response: Under 4 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white text-[#153D78] shadow-xs shrink-0">
                    <Clock className="w-4 h-4 text-[#2878D0]" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">Operating Hours</h5>
                    <p className="text-slate-600 mt-0.5">Monday – Saturday: 9:00 AM – 6:00 PM IST</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Sunday: Digital deliveries operate 24/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white text-[#153D78] shadow-xs shrink-0">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">Instant Download Guarantee</h5>
                    <p className="text-slate-500 mt-0.5">
                      Check your order confirmation page or <Link href="/account" className="text-[#2878D0] underline font-semibold">My Bookshelf</Link> for immediate link regeneration.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick FAQ links */}
            <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] space-y-3">
              <h4 className="font-bold text-sm text-[#0F1D36]">
                Frequently Asked Inquiries
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span>How long are download links valid?</span>
                  <span className="font-semibold text-[#153D78]">1 hour (auto-renews)</span>
                </li>
                <li className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span>Can I read on my Kindle or iPad?</span>
                  <span className="font-semibold text-emerald-600">Yes, 100% compatible</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Need an invoice for business GST?</span>
                  <span className="font-semibold text-[#153D78]">Included on checkout</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#0F1D36]">
                  Inquiry Received Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out, {name}. A support ticket has been created and our team will follow up at <strong className="text-slate-900">{email}</strong> within 4 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#153D78] text-white text-xs font-bold"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-bold text-lg text-[#0F1D36]">
                  Send a Direct Message
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in your details below and our customer support team will assist you promptly.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F4F6FA] border border-[#CBD5E1] outline-none focus:border-[#2878D0] text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F4F6FA] border border-[#CBD5E1] outline-none focus:border-[#2878D0] text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Order Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="e.g. DEMO-ORD-..."
                      className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-[#F4F6FA] border border-[#CBD5E1] outline-none focus:border-[#2878D0] text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F4F6FA] border border-[#CBD5E1] outline-none focus:border-[#2878D0] text-slate-900"
                    >
                      <option value="Order Support">Order & Download Support</option>
                      <option value="Payment Inquiry">Payment & Razorpay Inquiry</option>
                      <option value="Book Inquiry">Book Format & Content Inquiry</option>
                      <option value="Author Submission">Author & Publishing Proposal</option>
                      <option value="Other">Other Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe how we can assist you..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F4F6FA] border border-[#CBD5E1] outline-none focus:border-[#2878D0] text-slate-900 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#153D78] hover:bg-[#1B5EB0] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
