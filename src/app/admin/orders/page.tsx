import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteConfig } from "@/config/site";
import { ShoppingBag, ArrowDownRight } from "lucide-react";

export const metadata = {
  title: "Orders — Admin Portal",
};

export default async function AdminOrdersPage() {
  const adminDb = createAdminClient();
  const { data: orders } = await adminDb
    .from("orders")
    .select("*, items:order_items(*)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
          Orders & Transactions
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Complete ledger of customer eBook purchases ({orders?.length || 0} orders).
        </p>
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
                    {siteConfig.currency.symbol}{order.total_amount}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Orders Table (Screens >= 768px) */}
      <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
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
                      {siteConfig.currency.symbol}{order.total_amount}
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
