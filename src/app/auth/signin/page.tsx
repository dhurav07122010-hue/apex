"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site";
import { createClient } from "@/lib/supabase/client";
import {
  AlertCircle,
  ShieldCheck,
  Zap,
  Lock,
} from "lucide-react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/account";

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(searchParams.get("error") || "");
  const infoMessage = searchParams.get("message");

  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const siteUrl = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="relative h-12 w-48 mx-auto flex items-center justify-center mb-1">
          <Image
            src={siteConfig.logo}
            alt={siteConfig.name}
            width={180}
            height={48}
            priority
            className="object-contain"
          />
        </div>
        <h1 className="text-2xl font-black text-[#153D78] tracking-tight">
          Welcome to {siteConfig.name}
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
          Sign in with your Google account to access your digital bookshelf, purchased eBooks, and personal library.
        </p>
      </div>

      {/* Feedback Alerts */}
      {infoMessage && (
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-start gap-2.5 shadow-xs">
          <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span className="font-semibold">{infoMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5 shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Primary Google OAuth Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-2xl border-2 border-[#153D78] hover:bg-[#153D78] text-slate-800 hover:text-white text-sm font-bold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50 group"
        >
          {loading ? (
            <div className="flex items-center gap-2 text-[#153D78]">
              <div className="w-4 h-4 border-2 border-[#153D78] border-t-transparent rounded-full animate-spin" />
              <span>Connecting to Google...</span>
            </div>
          ) : (
            <>
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>
      </div>

      {/* Trust & Security Features */}
      <div className="pt-2 border-t border-slate-100 space-y-2.5">
        <div className="flex items-center gap-2.5 text-[11px] text-slate-500">
          <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Instant 1-click access to all your purchased eBooks</span>
        </div>
        <div className="flex items-center gap-2.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Authenticated securely by Google OAuth 2.0</span>
        </div>
        <div className="flex items-center gap-2.5 text-[11px] text-slate-500">
          <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>No passwords to remember or compromise</span>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="bg-[#F4F6FA] min-h-[85vh] py-16 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <Suspense
          fallback={
            <div className="p-8 text-center text-slate-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-[#153D78] border-t-transparent mb-2" />
              <p className="text-xs font-semibold text-[#153D78]">Loading sign-in...</p>
            </div>
          }
        >
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
