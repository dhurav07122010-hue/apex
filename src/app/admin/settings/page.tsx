import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { SettingsForm } from "./SettingsForm";

export const metadata = {
  title: "Store Settings & Security — Admin Portal",
};

export default async function AdminSettingsPage() {
  const adminDb = createAdminClient();
  const [{ data: rows }, { data: adminUsers }] = await Promise.all([
    adminDb.from("site_settings").select("*"),
    adminDb.from("admin_allowlist").select("*").order("created_at", { ascending: true }),
  ]);

  const settings: Record<string, any> = {};
  rows?.forEach((r) => {
    settings[r.key] = r.value;
  });

  return <SettingsForm settings={settings} adminUsers={adminUsers || []} />;
}
