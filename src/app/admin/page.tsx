import React from "react";
import Link from "next/link";
import { validateAdminSession, AUTHORIZED_ADMIN_EMAIL } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  ArrowRight,
  BookOpen,
  ShoppingBag,
  Users,
  DollarSign,
  Download,
  Settings,
  Layers,
  LogOut,
  Plus,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { signOut } from "@/app/auth/actions";

export const metadata = {
  title: "Admin Dashboard — ApexBooks",
  description: "Administrative control center for digital eBooks, categories, and orders.",
};

export default async function AdminPage() {
  const authResult = await validateAdminSession();

  // If not authorized as admin, render strict security rejection view
  if (!authResult.authorized) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
                Admin Access Restricted
              </h1>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                Server-Side Security Enforcement Active
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300">
            <strong>Rejection Reason:</strong> {authResult.error}
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
            <span className="text-zinc-500 font-semibold">
              Strict Admin Specifications:
            </span>
            <ul className="space-y-1.5 list-disc list-inside text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>Google OAuth Only:</strong> Passwords and email/password sessions are permanently rejected.
              </li>
              <li>
                <strong>Exact Allowlist:</strong> Only verified email{" "}
                <code className="text-blue-600 font-mono font-bold">
                  {AUTHORIZED_ADMIN_EMAIL}
                </code>{" "}
                is granted administrative authorization.
              </li>
              <li>
                <strong>Zero Trust:</strong> All database mutations and storage reads verify authorization server-side.
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <Link
              href="/"
              className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              ← Return to Storefront
            </Link>

            <Link
              href="/auth/signin?redirect=/admin"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Sign in with Google</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- AUTHORIZED ADMIN DASHBOARD ---
  const adminDb = createAdminClient();

  // Fetch quick metrics
  const [{ count: productsCount }, { count: categoriesCount }, { count: ordersCount }, { count: entitlementsCount }] =
    await Promise.all([
      adminDb.from("products").select("*", { count: "exact", head: true }),
      adminDb.from("categories").select("*", { count: "exact", head: true }),
      adminDb.from("orders").select("*", { count: "exact", head: true }),
      adminDb.from("purchase_entitlements").select("*", { count: "exact", head: true }),
    ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              AUTHENTICATED VIA GOOGLE OAUTH
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 mt-1">
            Admin Management Console
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5 font-mono">
            Signed in as: {authResult.user?.email}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/books"
            className="px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            View Storefront
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-900 text-white dark:bg-zinc-200 dark:text-zinc-950 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total eBooks</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {productsCount || 0}
          </span>
          <p className="text-[11px] text-zinc-400 mt-1">Active in catalogue</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Categories</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {categoriesCount || 0}
          </span>
          <p className="text-[11px] text-zinc-400 mt-1">Knowledge genres</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Orders</span>
            <ShoppingBag className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {ordersCount || 0}
          </span>
          <p className="text-[11px] text-zinc-400 mt-1">Recorded transactions</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Entitlements</span>
            <Download className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {entitlementsCount || 0}
          </span>
          <p className="text-[11px] text-zinc-400 mt-1">Digital access tokens</p>
        </div>
      </div>

      {/* Admin Modules Quick Launch */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Admin Management Modules (Phase 4)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Products & eBooks
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Add, edit pricing, upload covers, and manage PDF private storage files.
              </p>
            </div>
            <span className="inline-block text-[11px] font-semibold text-blue-600">
              Module configured for Phase 4
            </span>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Orders & Payments
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Review transactions, payment signatures, and customer entitlements.
              </p>
            </div>
            <span className="inline-block text-[11px] font-semibold text-purple-600">
              Module configured for Phase 4 & 5
            </span>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Digital Vault & Audit Logs
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Inspect download logs, rate limits, and short-lived signed URLs.
              </p>
            </div>
            <span className="inline-block text-[11px] font-semibold text-emerald-600">
              Module configured for Phase 6
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
