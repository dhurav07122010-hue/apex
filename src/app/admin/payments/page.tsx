import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteConfig } from "@/config/site";
import { CreditCard, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Payments — Admin Portal",
};

export default async function AdminPaymentsPage() {
  const adminDb = createAdminClient();
  const { data: payments } = await adminDb
    .from("payments")
    .select("*, order:orders(order_number, customer_email)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
          Payment Transactions
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Gateway authorization logs, captured states, and verification signatures.
        </p>
      </div>

      {/* Mobile Payments Card View (Screens < 768px) */}
      <div className="md:hidden space-y-3">
        {!payments || payments.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 text-center text-zinc-400 text-xs">
            No payment transactions recorded yet.
          </div>
        ) : (
          payments.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">
                  {p.order?.order_number || "Direct Payment"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    p.status === "captured"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div className="text-xs space-y-1">
                <p className="font-mono text-zinc-500 text-[11px] truncate">
                  ID: {p.gateway_payment_id || "demo_simulated"}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {p.gateway}
                </span>

                <span className="font-black text-sm text-zinc-900 dark:text-zinc-100">
                  {siteConfig.currency.symbol}{p.amount}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Payments Table (Screens >= 768px) */}
      <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Gateway</th>
                <th className="py-3.5 px-4">Gateway Payment ID</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {!payments || payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400">
                    No payment transactions recorded yet.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      {p.order?.order_number || "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {p.gateway}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-500 text-[11px]">
                      {p.gateway_payment_id || "demo_simulated"}
                    </td>
                    <td className="py-3.5 px-4 font-black text-zinc-900 dark:text-zinc-100">
                      {siteConfig.currency.symbol}{p.amount}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.status === "captured"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 text-[11px]">
                      {new Date(p.created_at).toLocaleDateString()}
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
