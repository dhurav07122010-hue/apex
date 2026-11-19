"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Layers,
  ShoppingBag,
  Users,
  CreditCard,
  Download,
  BarChart3,
  Settings,
  ShieldCheck,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  Clock,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { AdminSignOutButton } from "@/components/AdminSignOutButton";

export const adminNavItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: BookOpen },
  { name: "Add eBook", href: "/admin/products/new", icon: PlusCircle },
  { name: "Categories", href: "/admin/categories", icon: Layers },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Downloads", href: "/admin/downloads", icon: Download },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Store Settings", href: "/admin/settings", icon: Settings },
];

interface AdminNavProps {
  initialRemainingMs?: number;
}

export function AdminNav({ initialRemainingMs }: AdminNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 240-second Ephemeral Session Countdown Timer
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    if (initialRemainingMs && initialRemainingMs > 0) {
      return Math.min(240, Math.floor(initialRemainingMs / 1000));
    }
    return 240;
  });

  useEffect(() => {
    // Synchronize with cookie timestamp if present
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/apex_admin_expires_at=(\d+)/);
      if (match && match[1]) {
        const exp = parseInt(match[1], 10);
        const rem = Math.floor((exp - Date.now()) / 1000);
        if (rem >= 0) {
          setSecondsLeft(Math.min(240, rem));
        }
      }
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Invalidate and prompt re-authentication when 240 seconds elapse
          window.location.href =
            "/auth/signin?redirect=/admin&error=" +
            encodeURIComponent(
              "Your admin session has expired (4-minute security window). Please sign in again."
            );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const currentItem = adminNavItems.find((item) =>
    item.href === "/admin"
      ? pathname === "/admin"
      : pathname === item.href || pathname?.startsWith(`${item.href}/`)
  );

  return (
    <>
      {/* ======================================================== */}
      {/* 1. MOBILE TOP APP BAR (Screens < 768px)                    */}
      {/* ======================================================== */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Logo & Admin Badge */}
          <Link href="/admin" className="flex items-center gap-2">
            <div className="relative h-7 w-28">
              <Image
                src={siteConfig.logo}
                alt={siteConfig.name}
                width={112}
                height={28}
                priority
                className="object-contain"
              />
            </div>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-400 text-slate-950 tracking-wider">
              ADMIN
            </span>
          </Link>

          {/* Right Mobile Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/books"
              target="_blank"
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="View Live Storefront"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Current Section Subheader Bar */}
        <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-950/80 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-zinc-400">Portal</span>
            <ChevronRight className="w-3 h-3 text-zinc-400" />
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {currentItem?.name || "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Live 240s countdown badge */}
            <div
              className={`flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded-full ${
                secondsLeft <= 60
                  ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 animate-pulse"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
              }`}
              title="Active Admin Session Window (240s Security TTL)"
            >
              <Clock className="w-3 h-3" />
              <span>{formatTime(secondsLeft)}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>OAuth</span>
            </div>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MOBILE DRAWER OVERLAY (Screens < 768px)                */}
      {/* ======================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Drawer */}
          <div className="relative w-72 max-w-[85vw] bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative h-7 w-28">
                  <Image
                    src={siteConfig.logo}
                    alt={siteConfig.name}
                    width={112}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-400 text-slate-950">
                  ADMIN
                </span>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav list */}
            <nav className="p-3 space-y-1 overflow-y-auto flex-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname === item.href || pathname?.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-zinc-400 group-hover:text-zinc-600"
                      }`}
                    />
                    <span className="flex-1">{item.name}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 space-y-3">
              <div className="text-[11px] text-zinc-500">
                <p className="font-bold text-zinc-700 dark:text-zinc-300">Authorized Admin</p>
                <p className="text-[10px] text-zinc-400">Strict 240s Active Session</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <Link
                  href="/books"
                  target="_blank"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Live Store</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <AdminSignOutButton className="text-xs" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. DESKTOP PERMANENT SIDEBAR (Screens >= 768px)          */}
      {/* ======================================================== */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 min-h-screen sticky top-0 h-screen justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-32">
                <Image
                  src={siteConfig.logo}
                  alt={siteConfig.name}
                  width={130}
                  height={32}
                  priority
                  className="object-contain"
                />
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-400 text-slate-950 tracking-wider">
                ADMIN
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Google OAuth Verified</span>
            </div>

            {/* 240-Second Ephemeral Session Countdown */}
            <div
              className={`mt-2 flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-[11px] ${
                secondsLeft <= 60
                  ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 animate-pulse"
                  : "bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-300"
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Session:</span>
              </div>
              <span className="font-mono font-bold tracking-wider">
                {formatTime(secondsLeft)}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href || pathname?.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-zinc-400"
                    }`}
                  />
                  <span className="flex-1">{item.name}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3 bg-zinc-50/50 dark:bg-zinc-950/30">
          <div className="text-[11px] text-zinc-400 truncate">
            <p className="font-semibold text-zinc-700 dark:text-zinc-300">Authorized Admin</p>
            <p className="text-[10px] text-zinc-400">Strict 240s Active Session</p>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <Link
              href="/books"
              target="_blank"
              className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Live Store</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <AdminSignOutButton className="text-[11px]" />
          </div>
        </div>
      </aside>
    </>
  );
}
