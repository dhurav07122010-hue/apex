"use client";

import React, { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { signOut } from "@/app/auth/actions";

interface AdminSignOutButtonProps {
  className?: string;
  showIcon?: boolean;
  label?: string;
}

export function AdminSignOutButton({
  className = "",
  showIcon = true,
  label = "Sign Out",
}: AdminSignOutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      // 1. Wipe client-side storage keys related to Supabase
      if (typeof window !== "undefined") {
        try {
          Object.keys(window.localStorage || {}).forEach((key) => {
            if (key.startsWith("sb-") || key.includes("supabase") || key.includes("auth-token")) {
              window.localStorage.removeItem(key);
            }
          });
          Object.keys(window.sessionStorage || {}).forEach((key) => {
            if (key.startsWith("sb-") || key.includes("supabase") || key.includes("auth-token")) {
              window.sessionStorage.removeItem(key);
            }
          });
        } catch {
          // Ignore storage permission errors
        }
      }

      // Fallback timer: if server action hangs or redirects slowly on mobile network, force direct redirect
      const fallbackTimer = setTimeout(() => {
        window.location.href = "/auth/signout";
      }, 1500);

      // 2. Execute server action
      await signOut();
      clearTimeout(fallbackTimer);
    } catch {
      // 3. Guaranteed fallback: navigate to direct signout route
      window.location.href = "/auth/signout";
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      type="button"
      className={`inline-flex items-center gap-1.5 font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-60 transition-colors cursor-pointer ${className}`}
      title="Securely Sign Out"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        showIcon && <LogOut className="w-3.5 h-3.5" />
      )}
      <span>{loading ? "Signing out..." : label}</span>
    </button>
  );
}
