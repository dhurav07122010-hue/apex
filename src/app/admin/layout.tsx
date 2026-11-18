import React from "react";
import Link from "next/link";
import Image from "next/image";
import { validateAdminSession, AUTHORIZED_ADMIN_EMAIL } from "@/lib/auth/admin";
import { AdminGoogleLoginButton } from "@/components/AdminGoogleLoginButton";
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
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { signOut } from "@/app/auth/actions";

export const metadata = {
  title: "Admin Portal — ApexBooks",
  description: "Secure Administrative Management System",
};

const navItems = [
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

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authResult = await validateAdminSession();

  // If not authorized as admin, render strict rejection
  if (!authResult.authorized) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-400">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
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

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
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
    <div className="min-h-screen bg-zinc-100/60 dark:bg-zinc-950 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shrink-0">
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
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-400 text-slate-950">
                ADMIN
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Google OAuth Verified</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  <Icon className="w-4 h-4 text-zinc-500" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="text-[11px] text-zinc-400 truncate">
            <p className="font-semibold text-zinc-700 dark:text-zinc-300">Admin Account</p>
            <p className="font-mono truncate">{authResult.user?.email}</p>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <Link
              href="/books"
              target="_blank"
              className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Live Store</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <form action={signOut}>
              <button
                type="submit"
                className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  );
}
