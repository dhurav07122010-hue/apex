"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import {
  ShieldCheck,
  Zap,
  Lock,
  Mail,
  Headphones,
  CreditCard,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#153D78] text-slate-300 text-xs border-t border-[#0D264C]">
      {/* Trust & Guarantee Strip */}
      <div className="border-b border-white/10 py-8 bg-[#0D264C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-white/10 text-amber-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Instant Delivery</h4>
                <p className="text-slate-400 text-xs mt-0.5">
                  Cryptographically signed download URLs generated immediately upon payment.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-white/10 text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Verified Book Files</h4>
                <p className="text-slate-400 text-xs mt-0.5">
                  High-fidelity PDF formats scanned for pristine readability and text search.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-white/10 text-blue-300 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Private Storage Vault</h4>
                <p className="text-slate-400 text-xs mt-0.5">
                  Stored in private Supabase cloud vaults with tokenized access quotas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-white/10 text-amber-400 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Razorpay Secured</h4>
                <p className="text-slate-400 text-xs mt-0.5">
                  Authorize with UPI, RuPay, Visa, Mastercard, and NetBanking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Column 1: Brand & Publishing Mission */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative h-10 w-44 flex items-center">
                <Image
                  src={siteConfig.logo}
                  alt={siteConfig.name}
                  width={176}
                  height={44}
                  className="object-contain brightness-0 invert"
                />
              </div>
            </Link>

            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              ApexBooks is India&apos;s premier digital bookstore and knowledge publisher. Dedicated to empowering readers, engineering students, competitive examination aspirants, and entrepreneurs with authentic, DRM-free digital books.
            </p>

            <div className="pt-2 text-xs space-y-1.5 text-slate-300">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>support@apexbooks.demo</span>
              </p>
              <p className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Support Hours: Mon – Sat, 9:00 AM – 6:00 PM IST</span>
              </p>
            </div>
          </div>

          {/* Column 2: Quick Shop Links */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="font-bold text-sm text-white uppercase tracking-wider text-[11px]">
              Explore Bookstore
            </h5>
            <ul className="space-y-2">
              <li>
                <Link href="/books" className="hover:text-white transition-colors">
                  All eBooks
                </Link>
              </li>
              <li>
                <Link href="/books?sort=bestseller" className="hover:text-white transition-colors">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link href="/books?sort=newest" className="hover:text-white transition-colors">
                  New Releases
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition-colors">
                  Browse by Category
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Curated Disciplines */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="font-bold text-sm text-white uppercase tracking-wider text-[11px]">
              Top Categories
            </h5>
            <ul className="space-y-2">
              {siteConfig.categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/books?category=${cat.slug}`}
                    className="hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span>{cat.name}</span>
                    <ArrowRight className="w-3 h-3 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Customer Care & Legal Policies */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="font-bold text-sm text-white uppercase tracking-wider text-[11px]">
              Support & Policies
            </h5>
            <ul className="space-y-2">
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  My Account & Bookshelf
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About ApexBooks
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Customer Care & Inquiries
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-white transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Compliance */}
      <div className="border-t border-white/10 py-6 bg-[#0B203F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© 2026 ApexBooks Digital Publishing. All rights reserved.</p>

          <div className="flex items-center gap-4 text-slate-300">
            <span>Powered by Razorpay Payments</span>
            <span>•</span>
            <span>256-Bit SSL Encrypted</span>
            <span>•</span>
            <span>Indian Digital Commerce</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
