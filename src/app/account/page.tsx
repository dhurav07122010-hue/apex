import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  User,
  BookOpen,
  ShoppingBag,
  Download,
  LogOut,
  ShieldCheck,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { AdminSignOutButton } from "@/components/AdminSignOutButton";

export const metadata = {
  title: "My Account & Bookshelf — ApexBooks",
  description: "Manage your account, order history, and download purchased eBooks.",
};

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin?redirect=/account");
  }

  // Fetch customer purchase entitlements with product details
  const { data: entitlements } = await supabase
    .from("purchase_entitlements")
    .select(`
      id,
      download_count,
      max_downloads,
      created_at,
      product:products (
        id,
        slug,
        title,
        author,
        format,
        file_size,
        cover_gradient,
        badge,
        category_id
      )
    `)
    .eq("is_active", true);

  // Fetch customer orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const isAdmin = user.email?.toLowerCase() === "dhurav07122010@gmail.com";
  const isGoogleAuth = user.app_metadata?.provider === "google";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Account Header */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
            {user.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-50">
                {user.user_metadata?.full_name || user.email?.split("@")[0]}
              </h1>
              {isAdmin && isGoogleAuth && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  ADMINISTRATOR
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-zinc-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                Member since {new Date(user.created_at).toLocaleDateString()}
              </span>
              <span>•</span>
              <span className="capitalize">
                Auth via {user.app_metadata?.provider || "email"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          <AdminSignOutButton className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold" />
        </div>
      </div>

      {/* Main Account Tabs: Bookshelf & Order History */}
      <div className="space-y-6">
        {/* Bookshelf Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                My Purchased eBooks ({entitlements?.length || 0})
              </h2>
            </div>
            <Link
              href="/books"
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Browse Storefront →
            </Link>
          </div>

          {!entitlements || entitlements.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Your bookshelf is empty
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Purchased digital books will appear here immediately with secure, signed download links.
              </p>
              <div className="pt-2">
                <Link
                  href="/books"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                >
                  Explore eBooks
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {entitlements.map((item: any) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="font-semibold text-blue-600 uppercase">
                        {item.product?.category_id}
                      </span>
                      <span className="text-zinc-400 font-mono">
                        {item.product?.format} • {item.product?.file_size}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2">
                      {item.product?.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">By {item.product?.author}</p>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400">
                      Downloads: {item.download_count} / {item.max_downloads}
                    </span>
                    <a
                      href={`/api/downloads/${item.id}?redirect=true`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order History Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Order History
            </h2>
          </div>

          {!orders || orders.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-center text-xs text-zinc-500">
              No orders recorded yet.
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden">
              {orders.map((order: any) => (
                <div
                  key={order.id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      {order.order_number}
                    </span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString()} • {order.payment_method.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-sm text-zinc-900 dark:text-zinc-100">
                      {siteConfig.currency.symbol}
                      {order.total_amount}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === "paid"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {order.status}
                    </span>
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
