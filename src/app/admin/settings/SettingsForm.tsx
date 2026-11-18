"use client";

import React, { useState } from "react";
import { Save, ShieldCheck, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { siteConfig, AUTHORIZED_ADMIN_EMAIL } from "@/config/site";
import { updateStoreSettings } from "./actions";

interface SettingsFormProps {
  settings: Record<string, any>;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const general = settings.general || {};
  const delivery = settings.delivery || {};

  const [brandName, setBrandName] = useState(general.brand_name || siteConfig.name);
  const [tagline, setTagline] = useState(general.tagline || siteConfig.tagline);
  const [supportEmail, setSupportEmail] = useState(general.support_email || siteConfig.supportEmail);
  const [signedUrlExpiry, setSignedUrlExpiry] = useState(
    delivery.signed_url_expiry_seconds ? String(delivery.signed_url_expiry_seconds) : "3600"
  );
  const [maxDownloadLimit, setMaxDownloadLimit] = useState(
    delivery.max_download_limit ? String(delivery.max_download_limit) : "50"
  );

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    const formData = new FormData();
    formData.append("brandName", brandName);
    formData.append("tagline", tagline);
    formData.append("supportEmail", supportEmail);
    formData.append("signedUrlExpiry", signedUrlExpiry);
    formData.append("maxDownloadLimit", maxDownloadLimit);

    const res = await updateStoreSettings(formData);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(res.error || "Failed to update settings");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
            Store & Security Settings
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure branding, delivery TTLs, and gateway rules.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Settings successfully updated and saved to Supabase!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* General Settings */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          General Storefront Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Store Brand Name
            </label>
            <input
              type="text"
              required
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Tagline / Motto
            </label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Customer Support Email
          </label>
          <input
            type="email"
            required
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Digital Vault Delivery TTL */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          Digital Delivery & Anti-Abuse Controls
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Signed URL Expiry (Seconds)
            </label>
            <input
              type="number"
              required
              value={signedUrlExpiry}
              onChange={(e) => setSignedUrlExpiry(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Default: 3600 seconds (1 hour). Prevents link sharing.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Max Download Quota (per entitlement)
            </label>
            <input
              type="number"
              required
              value={maxDownloadLimit}
              onChange={(e) => setMaxDownloadLimit(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Maximum re-downloads allowed per customer purchase entitlement.
            </p>
          </div>
        </div>
      </div>

      {/* Admin Authorization Allowlist Status */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm">
        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Active Admin Allowlist Configuration</span>
        </h3>

        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              Verified Administrator
            </span>
            <p className="text-zinc-500 font-mono">{AUTHORIZED_ADMIN_EMAIL}</p>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            ACTIVE & ENFORCED
          </span>
        </div>
      </div>
    </form>
  );
}
