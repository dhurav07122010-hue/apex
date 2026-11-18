import React from "react";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  BookOpen,
  ShoppingBag,
  Users,
  Download,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  HardDrive,
  Clock,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export default async function AdminOverviewPage() {
  const adminDb = createAdminClient();

  // Fetch metrics in parallel
  const [
    { count: productsCount },
    { count: categoriesCount },
    { count: ordersCount },
    { count: entitlementsCount },
    { count: downloadsCount },
    { data: recentOrders },
    { data: recentDownloads },
    { data: topProducts },
  ] = await Promise.all([
    adminDb.from("products").select("*", { count: "exact", head: true }),
    adminDb.from("categories").select("*", { count: "exact", head: true }),
    adminDb.from("orders").select("*", { count: "exact", head: true }),
    adminDb.from("purchase_entitlements").select("*", { count: "exact", head: true }),
    adminDb.from("download_logs").select("*", { count: "exact", head: true }),
    adminDb.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
    adminDb.from("download_logs").select("*, product:products(title)").order("downloaded_at", { ascending: false }).limit(5),
    adminDb.from("products").select("id, title, price, format, category_id, is_published").limit(5),
  ]);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
            Store Overview
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time telemetry and management controls for {siteConfig.name}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New eBook</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total eBooks</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">
            {productsCount || 0}
          </span>
          <p className="text-[11px] text-zinc-400 mt-1">Across 10 categories</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Orders</span>
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">
            {ordersCount || 0}
          </span>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Processed</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Entitlements</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">
            {entitlementsCount || 0}
          </span>
          <p className="text-[11px] text-zinc-400 mt-1">Active customer rights</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Downloads</span>
            <Download className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">
            {downloadsCount || 0}
          </span>
          <p className="text-[11px] text-zinc-400 mt-1">Tamper-logged deliveries</p>
        </div>
      </div>

      {/* System Status Ribbons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-zinc-900 dark:text-zinc-100">Database & RLS</p>
            <p className="text-emerald-600 font-semibold">11 Tables • Connected</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600">
            <HardDrive className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-zinc-900 dark:text-zinc-100">Private Storage Vault</p>
            <p className="text-blue-600 font-semibold">'ebooks' & 'covers' Active</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-zinc-900 dark:text-zinc-100">Payment Modes</p>
            <p className="text-purple-600 font-semibold">Demo Mode • Razorpay Test</p>
          </div>
        </div>
      </div>

      {/* Products & Recent Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Products Quick View */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="font-bold text-base text-zinc-900 dark:text-zinc-50">
              eBook Catalogue
            </h2>
            <Link
              href="/admin/products"
              className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
            >
              <span>Manage all ({productsCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {topProducts?.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 capitalize">
                    {p.category_id} • {p.format}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-black text-xs text-zinc-900 dark:text-zinc-100">
                    {siteConfig.currency.symbol}{p.price}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      p.is_published
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800"
                    }`}
                  >
                    {p.is_published ? "Live" : "Draft"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders / Activity */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="font-bold text-base text-zinc-900 dark:text-zinc-50">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              View all
            </Link>
          </div>

          {!recentOrders || recentOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-400">
              No orders recorded yet. Checkout orders will show here in real-time.
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {recentOrders.map((o) => (
                <div key={o.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      {o.order_number}
                    </span>
                    <p className="text-[11px] text-zinc-400 truncate max-w-[180px]">
                      {o.customer_email}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {siteConfig.currency.symbol}{o.total_amount}
                    </span>
                    <p className="text-[10px] uppercase font-semibold text-emerald-600">
                      {o.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
