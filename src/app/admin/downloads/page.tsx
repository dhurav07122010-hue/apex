import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { Download, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Download Logs — Admin Portal",
};

export default async function AdminDownloadsPage() {
  const adminDb = createAdminClient();
  const { data: logs } = await adminDb
    .from("download_logs")
    .select("*, product:products(title, format)")
    .order("downloaded_at", { ascending: false });

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
          Download Activity Logs
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Tamper-evident logs of every signed digital eBook delivery for audit & rate-limiting.
        </p>
      </div>

      {/* Mobile Download Logs View (Screens < 768px) */}
      <div className="md:hidden space-y-3">
        {!logs || logs.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 text-center text-zinc-400 text-xs">
            No download activity recorded yet.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-xs space-y-2.5 text-xs"
            >
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1">
                {log.product?.title || "eBook File"}
              </h3>

              <div className="space-y-1 text-[11px] text-zinc-500">
                <p className="font-mono text-zinc-700 dark:text-zinc-300 truncate">
                  User: {log.customer_email}
                </p>
                <p className="font-mono text-zinc-400">
                  IP: {log.ip_address || "127.0.0.1"}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400">
                <span className="truncate max-w-[150px]">
                  {log.user_agent ? log.user_agent.split(" ")[0] : "Browser"}
                </span>
                <span>{new Date(log.downloaded_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Download Logs Table (Screens >= 768px) */}
      <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">eBook Delivered</th>
                <th className="py-3.5 px-4">Customer Email</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">User Agent</th>
                <th className="py-3.5 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {!logs || logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-400">
                    No download activity recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/50">
                    <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                      {log.product?.title || "eBook File"}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-500">{log.customer_email}</td>
                    <td className="py-3.5 px-4 font-mono text-zinc-400 text-[11px]">
                      {log.ip_address || "127.0.0.1"}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 text-[11px] truncate max-w-xs">
                      {log.user_agent || "Browser Client"}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 text-[11px]">
                      {new Date(log.downloaded_at).toLocaleString()}
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
