import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  User,
  BookOpen,
  ShoppingBag,
  Download,
  ShieldCheck,
  Calendar,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { AdminSignOutButton } from "@/components/AdminSignOutButton";

export const metadata = {
  title: "My Account & Bookshelf — ApexBooks",
  description: "Manage your account, order history, and download purchased books.",
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
    <div className="bg-[#F4F6FA] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-[#153D78] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#153D78] font-bold">My Account</span>
        </nav>

        {/* Account Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#153D78] text-white flex items-center justify-center font-bold text-xl shadow-md">
              {user.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-[#153D78]">
                  {user.user_metadata?.full_name || user.email?.split("@")[0]}
                </h1>
                {isAdmin && isGoogleAuth && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF3FF] text-[#153D78] border border-[#2878D0]/30">
                    ADMINISTRATOR
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
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
                className="px-4 py-2 rounded-xl bg-[#153D78] hover:bg-[#2878D0] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}

            <AdminSignOutButton className="px-4 py-2 rounded-xl border border-[#E2E8F0] hover:bg-[#F4F6FA] text-rose-600 text-xs font-bold" />
          </div>
        </div>

        {/* Main Account Tabs: Bookshelf & Order History */}
        <div className="space-y-8">
          {/* Bookshelf Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#153D78]" />
                <h2 className="text-xl font-bold text-[#153D78]">
                  My Purchased Books ({entitlements?.length || 0})
                </h2>
              </div>
              <Link
                href="/books"
                className="text-xs text-[#2878D0] hover:underline font-bold"
              >
                Browse Storefront →
              </Link>
            </div>

            {!entitlements || entitlements.length === 0 ? (
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF3FF] text-[#153D78] flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-[#0F1D36]">
                  Your bookshelf is empty
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Purchased digital books will appear here immediately with secure, signed download links.
                </p>
                <div className="pt-2">
                  <Link
                    href="/books"
                    className="px-4 py-2 rounded-xl bg-[#153D78] text-white text-xs font-bold hover:bg-[#2878D0] transition-colors"
                  >
                    Explore Books
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {entitlements.map((item: any) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl border border-[#E2E8F0] bg-white flex flex-col justify-between space-y-4 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-2">
                        <span className="font-bold text-[#2878D0] uppercase">
                          {item.product?.category_id}
                        </span>
                        <span className="text-slate-400 font-mono">
                          {item.product?.format} • {item.product?.file_size}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-[#0F1D36] line-clamp-2">
                        {item.product?.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">By {item.product?.author}</p>
                    </div>

                    <div className="pt-3 border-t border-[#F4F6FA] flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        Downloads: {item.download_count} / {item.max_downloads}
                      </span>
                      <a
                        href={`/api/downloads/${item.id}?redirect=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-[#153D78] hover:bg-[#2878D0] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
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
              <ShoppingBag className="w-5 h-5 text-[#153D78]" />
              <h2 className="text-xl font-bold text-[#153D78]">
                Order History
              </h2>
            </div>

            {!orders || orders.length === 0 ? (
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 text-center text-xs text-slate-500">
                No previous orders recorded for this account.
              </div>
            ) : (
              <div className="bg-white border border-[#E2E8F0] rounded-2xl divide-y divide-[#E2E8F0] overflow-hidden shadow-sm">
                {orders.map((ord: any) => (
                  <div key={ord.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#153D78]">
                          {ord.order_number}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 capitalize">
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {new Date(ord.created_at).toLocaleString()} • {ord.payment_method || "Online"}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-[#153D78]">
                        {siteConfig.currency.symbol}{ord.total_amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
