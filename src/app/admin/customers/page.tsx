import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { Users, Mail, BookOpen } from "lucide-react";

export const metadata = {
  title: "Customers — Admin Portal",
};

export default async function AdminCustomersPage() {
  const adminDb = createAdminClient();
  const [{ data: profiles }, { data: entitlements }] = await Promise.all([
    adminDb.from("profiles").select("*").order("created_at", { ascending: false }),
    adminDb.from("purchase_entitlements").select("customer_email"),
  ]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
          Customers & Readers
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Registered customer accounts and digital entitlement counts.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4 text-center">eBooks Owned</th>
                <th className="py-3.5 px-4">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {!profiles || profiles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-zinc-400">
                    No customer accounts registered yet.
                  </td>
                </tr>
              ) : (
                profiles.map((user) => {
                  const ownedCount =
                    entitlements?.filter(
                      (e) =>
                        e.customer_email &&
                        user.email &&
                        e.customer_email.toLowerCase() === user.email.toLowerCase()
                    ).length || 0;

                  return (
                    <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/50">
                      <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                        {user.full_name || "Reader"}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-zinc-500">{user.email}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {ownedCount} books
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
