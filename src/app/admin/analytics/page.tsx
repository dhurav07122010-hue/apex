import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteConfig } from "@/config/site";
import { BarChart3, TrendingUp, BookOpen, ShoppingBag, DollarSign } from "lucide-react";

export const metadata = {
  title: "Analytics — Admin Portal",
};

export default async function AdminAnalyticsPage() {
  const adminDb = createAdminClient();
  const [{ data: products }, { data: orders }, { data: categories }] = await Promise.all([
    adminDb.from("products").select("category_id, price, review_count, rating"),
    adminDb.from("orders").select("total_amount, status, created_at"),
    adminDb.from("categories").select("slug, name"),
  ]);

  const totalRevenue =
    orders
      ?.filter((o) => o.status === "paid")
      .reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;

  const paidOrders = orders?.filter((o) => o.status === "paid").length || 0;
  const avgOrderValue = paidOrders > 0 ? Math.round(totalRevenue / paidOrders) : 0;

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
          Store Analytics & Telemetry
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Performance metrics, revenue projections, and catalogue distribution.
        </p>
      </div>

      {/* Primary Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Gross Revenue
          </span>
          <div className="mt-2 text-3xl font-black text-zinc-900 dark:text-zinc-100">
            {siteConfig.currency.symbol}{totalRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold">Captured via Gateways</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Paid Orders
          </span>
          <div className="mt-2 text-3xl font-black text-zinc-900 dark:text-zinc-100">
            {paidOrders}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Confirmed transactions</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Average Order Value (AOV)
          </span>
          <div className="mt-2 text-3xl font-black text-zinc-900 dark:text-zinc-100">
            {siteConfig.currency.symbol}{avgOrderValue}
          </div>
          <p className="text-[11px] text-blue-600 mt-1 font-semibold">Per checkout transaction</p>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
          Knowledge Tracks Inventory Distribution
        </h3>

        <div className="space-y-3">
          {categories?.map((cat) => {
            const count = products?.filter((p) => p.category_id === cat.slug).length || 0;
            const percent = products?.length ? Math.round((count / products.length) * 100) : 0;

            return (
              <div key={cat.slug} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-800 dark:text-zinc-200">{cat.name}</span>
                  <span className="text-zinc-500">
                    {count} titles ({percent}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
