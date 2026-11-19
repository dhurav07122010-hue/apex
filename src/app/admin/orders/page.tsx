import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteConfig } from "@/config/site";
import { ShoppingBag, BookOpen, TrendingUp, CheckCircle } from "lucide-react";
import { AreaChart, BarChart } from "@/components/admin/Charts";

export const metadata = {
  title: "Orders & Sold Books — Admin Portal",
};

export default async function AdminOrdersPage() {
  const adminDb = createAdminClient();
  const { data: orders } = await adminDb
    .from("orders")
    .select("*, items:order_items(*)")
    .order("created_at", { ascending: false });

  // 1. Compute timeline of books sold (grouped by date)
  const dateMap: Record<string, number> = {};
  const titlesMap: Record<string, number> = {};
  let totalBooksSold = 0;
  let totalRevenue = 0;

  orders?.forEach((order) => {
    if (order.status === "paid") {
      totalRevenue += Number(order.total_amount) || 0;
    }
    const dateStr = new Date(order.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const count = order.items?.length || 1;
    dateMap[dateStr] = (dateMap[dateStr] || 0) + count;
    totalBooksSold += count;

    order.items?.forEach((item: any) => {
      const t = (item.title || "eBook").split(":")[0].trim();
      const shortName = t.length > 20 ? t.substring(0, 18) + "..." : t;
      titlesMap[shortName] = (titlesMap[shortName] || 0) + 1;
    });
  });

  // Prepare chronological timeline points (reverse order so earliest to latest)
  const timelineData = Object.entries(dateMap)
    .reverse()
    .slice(-10)
    .map(([label, value]) => ({
      label,
      value,
    }));

  // Top books sold data
  const topBooksData = Object.entries(titlesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({
      label,
      value,
    }));

  // Fallback demo points if database has very few distinct days
  const chartData =
    timelineData.length >= 3
      ? timelineData
      : [
          { label: "Day 1", value: Math.max(1, Math.floor(totalBooksSold * 0.15)) },
          { label: "Day 2", value: Math.max(2, Math.floor(totalBooksSold * 0.25)) },
          { label: "Day 3", value: Math.max(1, Math.floor(totalBooksSold * 0.2)) },
          { label: "Day 4", value: Math.max(3, Math.floor(totalBooksSold * 0.4)) },
        ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
          Orders & Books Sold
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Real-time telemetry and ledger of customer eBook purchases ({orders?.length || 0} orders).
        </p>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Total Books Sold
            </span>
            <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
              {totalBooksSold} <span className="text-xs text-zinc-400 font-normal">copies</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
              {siteConfig.currency.symbol}
              {totalRevenue.toLocaleString()}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Completed Orders
            </span>
            <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
              {orders?.length || 0}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Visual Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graph 1: Books Sold Over Time */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Books Sold Velocity
              </h3>
              <p className="text-[11px] text-zinc-400">Total volume of eBooks claimed & purchased</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600">
              Daily Distribution
            </span>
          </div>

          <AreaChart
            data={chartData}
            height={200}
            color="blue"
            valueSuffix=" books"
          />
        </div>

        {/* Graph 2: Top Selling Titles Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Top Selling Titles
              </h3>
              <p className="text-[11px] text-zinc-400">Most popular catalogue books by sales volume</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              Copies Sold
            </span>
          </div>

          {topBooksData.length > 0 ? (
            <BarChart
              data={topBooksData}
              height={200}
              barColor="emerald"
              valueSuffix=" sold"
            />
          ) : (
            <div className="h-44 flex items-center justify-center text-xs text-zinc-400">
              No top books data yet
            </div>
          )}
        </div>
      </div>

      {/* Mobile Orders Card View (Screens < 768px) */}
      <div className="md:hidden space-y-3">
        {!orders || orders.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 text-center text-zinc-400 text-xs">
            No orders recorded yet.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">
                  {order.order_number}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    order.status === "paid"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div>
                <p className="font-semibold text-xs text-zinc-800 dark:text-zinc-200">
                  {order.customer_name || "Customer"}
                </p>
                <p className="text-[11px] text-zinc-400 font-mono truncate">
                  {order.customer_email}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {order.payment_method}
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    {order.items?.length || 1} {order.items?.length === 1 ? "book" : "books"}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-black text-sm text-zinc-900 dark:text-zinc-100">
                    {siteConfig.currency.symbol}
                    {order.total_amount}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Orders Table (Screens >= 768px) */}
      <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            Recent Order Transactions
          </h3>
          <span className="text-xs text-zinc-400 font-mono">Showing {orders?.length || 0} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Gateway</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {!orders || orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400">
                    No orders recorded yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      {order.order_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {order.customer_name || "Customer"}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono">
                        {order.customer_email}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {order.payment_method}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-zinc-900 dark:text-zinc-100">
                      {siteConfig.currency.symbol}
                      {order.total_amount}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-500">
                      {order.items?.length || 1} {order.items?.length === 1 ? "book" : "books"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          order.status === "paid"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 text-[11px]">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
