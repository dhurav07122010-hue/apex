"use client";

import React, { useState } from "react";
import {
  Save,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Upload,
  UserPlus,
  Trash2,
  Users,
  Lock,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import {
  updateStoreSettings,
  addAdminUser,
  toggleAdminUser,
  deleteAdminUser,
} from "./actions";

interface AdminUser {
  id: string;
  email: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

interface SettingsFormProps {
  settings: Record<string, any>;
  adminUsers: AdminUser[];
}

export function SettingsForm({ settings, adminUsers: initialAdminUsers }: SettingsFormProps) {
  const general = settings.general || {};
  const delivery = settings.delivery || {};

  // Form State
  const [brandName, setBrandName] = useState(general.brand_name || siteConfig.name);
  const [tagline, setTagline] = useState(general.tagline || siteConfig.tagline);
  const [supportEmail, setSupportEmail] = useState(general.support_email || siteConfig.supportEmail);
  const [signedUrlExpiry, setSignedUrlExpiry] = useState(
    delivery.signed_url_expiry_seconds ? String(delivery.signed_url_expiry_seconds) : "3600"
  );
  const [maxDownloadLimit, setMaxDownloadLimit] = useState(
    delivery.max_download_limit ? String(delivery.max_download_limit) : "50"
  );

  // Logo & Favicon State
  const [logoUrl, setLogoUrl] = useState(general.logo_url || "");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(general.logo_url || siteConfig.logo);

  const [faviconUrl, setFaviconUrl] = useState(general.favicon_url || "");
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(
    general.favicon_url || "/icon.svg"
  );

  // Admin Team Management State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(initialAdminUsers);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("");
  const [adminActionLoading, setAdminActionLoading] = useState(false);
  const [adminActionError, setAdminActionError] = useState<string | null>(null);
  const [adminActionSuccess, setAdminActionSuccess] = useState<string | null>(null);

  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  const handleLogoFileChange = (file: File | null) => {
    setLogoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconFileChange = (file: File | null) => {
    setFaviconFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFaviconPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);
    setSettingsError(null);

    const formData = new FormData();
    formData.append("brandName", brandName);
    formData.append("tagline", tagline);
    formData.append("supportEmail", supportEmail);
    formData.append("signedUrlExpiry", signedUrlExpiry);
    formData.append("maxDownloadLimit", maxDownloadLimit);
    if (logoUrl) formData.append("logoUrl", logoUrl);
    if (logoFile) formData.append("logoFile", logoFile);
    if (faviconUrl) formData.append("faviconUrl", faviconUrl);
    if (faviconFile) formData.append("faviconFile", faviconFile);

    const res = await updateStoreSettings(formData);
    if (res.success) {
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } else {
      setSettingsError(res.error || "Failed to save settings");
    }
    setSavingSettings(false);
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;

    setAdminActionLoading(true);
    setAdminActionError(null);
    setAdminActionSuccess(null);

    const formData = new FormData();
    formData.append("email", newAdminEmail);
    formData.append("description", newAdminRole || "Store Administrator");

    const res = await addAdminUser(formData);
    if (res.error) {
      setAdminActionError(res.error);
    } else {
      setAdminActionSuccess(`Administrator account successfully authorized!`);
      setAdminUsers((prev) => [
        ...prev,
        {
          id: `temp_${Date.now()}`,
          email: newAdminEmail.toLowerCase().trim(),
          description: newAdminRole || "Store Administrator",
          is_active: true,
          created_at: new Date().toISOString(),
        },
      ]);
      setNewAdminEmail("");
      setNewAdminRole("");
      setTimeout(() => setAdminActionSuccess(null), 3000);
    }
    setAdminActionLoading(false);
  };

  const handleToggleAdmin = async (id: string, currentStatus: boolean) => {
    const res = await toggleAdminUser(id, currentStatus);
    if (res.success) {
      setAdminUsers((prev) =>
        prev.map((adm) => (adm.id === id ? { ...adm, is_active: !currentStatus } : adm))
      );
    } else {
      alert(res.error || "Failed to update admin status");
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm("Are you sure you want to remove administrator privileges for this account?")) {
      return;
    }
    const res = await deleteAdminUser(id);
    if (res.success) {
      setAdminUsers((prev) => prev.filter((adm) => adm.id !== id));
    } else {
      alert(res.error || "Failed to remove administrator");
    }
  };

  // Mask email for security: e.g. "dh***@gmail.com"
  const maskEmail = (email: string) => {
    const parts = email.split("@");
    if (parts.length !== 2) return "******";
    const user = parts[0];
    const domain = parts[1];
    const maskedUser =
      user.length > 3 ? `${user.substring(0, 2)}***${user.substring(user.length - 1)}` : `${user}***`;
    return `${maskedUser}@${domain}`;
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
            Store & Security Settings
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure branding, logo, favicon, digital vaults, and administrator access.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={savingSettings}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{savingSettings ? "Saving Settings..." : "Save All Settings"}</span>
        </button>
      </div>

      {settingsSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Store settings successfully updated and saved!</span>
        </div>
      )}

      {settingsError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{settingsError}</span>
        </div>
      )}

      {/* SECTION 1: Visual Identity & Branding (Logo & Favicon) */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span>Store Logo & Favicon Customization</span>
          </h3>
          <span className="text-[11px] text-zinc-400">Update store visual branding</span>
        </div>

        {/* Store Logo */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
            Store Logo Image
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* Live Preview */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center gap-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Current Logo</span>
              <div className="h-10 flex items-center justify-center">
                <img
                  src={logoPreview || siteConfig.logo}
                  alt="Store Logo"
                  className="max-h-9 max-w-[140px] object-contain"
                />
              </div>
            </div>

            {/* Inputs: Upload or URL */}
            <div className="sm:col-span-2 space-y-2">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>Upload Logo (PNG, WebP, SVG)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleLogoFileChange(e.target.files?.[0] || null)}
                  className="w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-950 dark:file:text-blue-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Or Direct Logo URL
                </label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => {
                    setLogoUrl(e.target.value);
                    if (!logoFile && e.target.value) setLogoPreview(e.target.value);
                  }}
                  placeholder="https://example.com/assets/logo.png"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Store Favicon */}
        <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
            Store Browser Favicon
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* Live Preview */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center gap-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Favicon Icon</span>
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1">
                <img
                  src={faviconPreview || "/icon.svg"}
                  alt="Favicon"
                  className="w-6 h-6 object-contain"
                />
              </div>
            </div>

            {/* Inputs: Upload or URL */}
            <div className="sm:col-span-2 space-y-2">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>Upload Favicon (.ico, .png, .svg)</span>
                </label>
                <input
                  type="file"
                  accept=".ico,.png,.svg,image/*"
                  onChange={(e) => handleFaviconFileChange(e.target.files?.[0] || null)}
                  className="w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-950 dark:file:text-blue-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Or Direct Favicon URL
                </label>
                <input
                  type="url"
                  value={faviconUrl}
                  onChange={(e) => {
                    setFaviconUrl(e.target.value);
                    if (!faviconFile && e.target.value) setFaviconPreview(e.target.value);
                  }}
                  placeholder="https://example.com/favicon.ico"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: General Storefront Configuration */}
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

      {/* SECTION 3: Digital Vault Delivery TTL */}
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

      {/* SECTION 4: Administrator Team Management */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Administrator Accounts & Permissions</span>
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Authorize team members to access the administrative control panel via Google OAuth.
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {adminUsers.filter((a) => a.is_active).length} Active Admins
          </span>
        </div>

        {adminActionSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{adminActionSuccess}</span>
          </div>
        )}

        {adminActionError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{adminActionError}</span>
          </div>
        )}

        {/* Add Administrator Form */}
        <form onSubmit={handleAddAdmin} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <UserPlus className="w-3.5 h-3.5 text-blue-600" />
            <span>Add New Administrator Google Account</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Google Account (Gmail) *
              </label>
              <input
                type="email"
                required
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="colleague@gmail.com"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Role / Title
              </label>
              <input
                type="text"
                value={newAdminRole}
                onChange={(e) => setNewAdminRole(e.target.value)}
                placeholder="e.g. Operations Lead, Store Manager"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={adminActionLoading}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{adminActionLoading ? "Authorizing..." : "Add Administrator"}</span>
            </button>
          </div>
        </form>

        {/* Existing Authorized Admins List */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            Current Authorized Administrators
          </span>

          <div className="space-y-2">
            {adminUsers.map((admin) => (
              <div
                key={admin.id}
                className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <span>{admin.description || "Administrator"}</span>
                      <span className="font-mono text-[11px] font-normal text-zinc-400">
                        ({maskEmail(admin.email)})
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      Added: {new Date(admin.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleAdmin(admin.id, admin.is_active)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                      admin.is_active
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {admin.is_active ? "ACTIVE" : "INACTIVE"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteAdmin(admin.id)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    title="Remove Administrator"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
