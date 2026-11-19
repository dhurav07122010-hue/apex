"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ApexBooksLogo } from "./ApexBooksLogo";
import {
  ShieldCheck,
  Zap,
  Lock,
  Mail,
  Headphones,
  CreditCard,
  Infinity as InfinityIcon,
  CheckCircle,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0A1931] text-slate-300 text-xs border-t border-[#0F2754]">
      {/* Trust & Guarantee Strip */}
      <div className="border-b border-white/10 py-8 bg-[#0F2754]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-white/10 text-amber-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Instant Delivery</h4>
                <p className="text-slate-300 text-xs mt-0.5">
                  High-speed, cryptographically signed download links generated instantly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-white/10 text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Razorpay Protected</h4>
                <p className="text-slate-300 text-xs mt-0.5">
                  100% secure payment processing with UPI, RuPay, Cards, and NetBanking.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-white/10 text-blue-300 shrink-0">
                <InfinityIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Lifetime Library Access</h4>
                <p className="text-slate-300 text-xs mt-0.5">
                  Read online or re-download your purchased eBooks anytime, anywhere.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-white/10 text-amber-400 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Customer Support</h4>
                <p className="text-slate-300 text-xs mt-0.5">
                  Our dedicated support team is always here to assist your reading journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-4 space-y-4">
            <ApexBooksLogo size="lg" inverted />
            <p className="text-slate-400 leading-relaxed text-xs">
              ApexBooks is India&apos;s premier digital bookstore, delivering inspiring and educational eBooks directly to your digital library with verified authenticity, instant access, and secure checkout.
            </p>
            <div className="pt-2 text-slate-400 space-y-1">
              <p className="font-semibold text-white">Need Assistance?</p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>support@apexbooks.in</span>
              </p>
            </div>
          </div>

          {/* Column 2: Popular Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">
              Categories
            </h3>
            <ul className="space-y-2">
              {siteConfig.categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-slate-400 hover:text-white hover:underline transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/books" className="text-slate-400 hover:text-white transition-colors">
                  All eBooks
                </Link>
              </li>
              <li>
                <Link
                  href="/books?sort=bestseller"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link
                  href="/books?sort=newest"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-slate-400 hover:text-white transition-colors">
                  My Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Policies & Payment Security */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">
              Policies &amp; Trust
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-slate-400 hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/digital-product-policy"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Digital Product Policy
                </Link>
              </li>
            </ul>

            <div className="pt-4 border-t border-white/10">
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                Supported Payment Methods
              </p>
              <div className="flex flex-wrap items-center gap-2 text-slate-400 text-[10px] font-semibold">
                <span className="px-2 py-1 rounded bg-white/10 text-white">UPI / GPay / PhonePe</span>
                <span className="px-2 py-1 rounded bg-white/10 text-white">RuPay</span>
                <span className="px-2 py-1 rounded bg-white/10 text-white">Visa &amp; Mastercard</span>
                <span className="px-2 py-1 rounded bg-white/10 text-white">NetBanking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
          <p>© {new Date().getFullYear()} ApexBooks India. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Razorpay Secured SSL 256-bit Encryption</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
