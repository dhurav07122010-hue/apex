import React from "react";
import { redirect } from "next/navigation";
import { validateAdminSession, AUTHORIZED_ADMIN_EMAIL } from "@/lib/auth/admin";
import { AdminNav } from "@/components/admin/AdminNav";

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

  // If not authorized as admin, redirect to sign-in immediately
  if (!authResult.authorized) {
    redirect(
      "/auth/signin?redirect=/admin&error=" +
        encodeURIComponent(
          authResult.error || "Please sign in with your authorized Gmail to access the admin panel."
        )
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
