"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import {
  BookOpen,
  ShieldCheck,
  Zap,
  Lock,
  Mail,
  Heart,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 text-xs">
      {/* Value Proposition Ribbon */}
      <div className="border-b border-zinc-200 dark:border-zinc-850 py-8 bg-white dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                  Instant Delivery
                </h4>
                <p className="text-zinc-500 mt-0.5">
                  Secure download links generated automatically upon payment.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                  Verified Clean Files
                </h4>
                <p className="text-zinc-500 mt-0.5">
                  High-fidelity PDF and EPUB formats checked for digital integrity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                  Encrypted Storage
                </h4>
                <p className="text-zinc-500 mt-0.5">
                  Books stored in private vaults with short-lived signed URLs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                  Author Support
                </h4>
                <p className="text-zinc-500 mt-0.5">
                  Direct support and errata updates for every purchased title.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-3">
              <div className="relative h-9 w-36">
                <Image
                  src={siteConfig.logo}
                  alt={siteConfig.name}
                  width={150}
                  height={38}
                  className="object-contain h-full w-auto"
                />
              </div>
            </Link>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mb-4">
              {siteConfig.description}
            </p>
            <p className="text-xs text-zinc-400">
              Need assistance? Reach us at{" "}
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {siteConfig.supportEmail}
              </a>
            </p>
          </div>

          {/* Categories Column 1 */}
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-zinc-200 text-xs uppercase tracking-wider mb-3">
              Popular Genres
            </h4>
            <ul className="space-y-2">
              {siteConfig.categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/books?category=${cat.slug}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Column 2 */}
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-zinc-200 text-xs uppercase tracking-wider mb-3">
              More Genres
            </h4>
            <ul className="space-y-2">
              {siteConfig.categories.slice(5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/books?category=${cat.slug}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform & Admin */}
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-zinc-200 text-xs uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/books"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  All eBooks
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/signin"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Customer Login
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © 2026 {siteConfig.name}. All digital rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-zinc-400">
              Payment ready: Razorpay Test / Demo Mode
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
