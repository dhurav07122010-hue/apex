import React from "react";
import Link from "next/link";
import { validateAdminSession, AUTHORIZED_ADMIN_EMAIL } from "@/lib/auth/admin";
import { AdminGoogleLoginButton } from "@/components/AdminGoogleLoginButton";
import { AdminNav } from "@/components/admin/AdminNav";
import { ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Portal — ApexBooks",
  description: "Secure Administrative Management System",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authResult = await validateAdminSession();

  // If not authorized as admin, render strict rejection
  if (!authResult.authorized) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-400">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
                Admin Authorization Required
              </h1>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-0.5">
                Strict Server-Side Protection
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300">
            <strong>Access Denied:</strong> {authResult.error}
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
            <span className="text-zinc-600 dark:text-zinc-300 font-bold">
              Administrator Security Standards:
            </span>
            <ul className="space-y-1.5 list-disc list-inside text-zinc-500">
              <li>
                <strong>Google OAuth Only:</strong> Passwords and email/password sessions are permanently rejected.
              </li>
              <li>
                <strong>Exact Allowlist:</strong> Only verified email{" "}
                <code className="text-blue-600 font-mono font-bold">
                  {AUTHORIZED_ADMIN_EMAIL}
                </code>{" "}
                can access administrative operations.
              </li>
              <li>
                <strong>Zero Trust:</strong> All database mutations and storage reads verify authorization server-side.
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link
              href="/"
              className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              ← Return to Storefront
            </Link>

            <AdminGoogleLoginButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/80 dark:bg-zinc-950 flex flex-col md:flex-row">
      {/* Responsive Navigation: Mobile Top Bar + Drawer & Desktop Sticky Sidebar */}
      <AdminNav adminEmail={authResult.user?.email} />

      {/* Main Admin Content Body */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 min-w-0 max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
