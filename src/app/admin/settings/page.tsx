import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { SettingsForm } from "./SettingsForm";

export const metadata = {
  title: "Store Settings — Admin Portal",
};

export default async function AdminSettingsPage() {
  const adminDb = createAdminClient();
  const { data: rows } = await adminDb.from("site_settings").select("*");

  const settings: Record<string, any> = {};
  rows?.forEach((r) => {
    settings[r.key] = r.value;
  });

  return <SettingsForm settings={settings} />;
}
