"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { siteConfig, isAuthorizedAdminEmail } from "@/config/site";
import { createClient } from "@/lib/supabase/client";
import {
  Mail,
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/account";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(searchParams.get("error") || "");
  const [successMessage, setSuccessMessage] = useState("");

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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }

        if (isAuthorizedAdminEmail(data.user?.email)) {
          setSuccessMessage(
            "Signed in as customer. Note: Admin panel access requires Google OAuth login."
          );
          setTimeout(() => router.push("/account"), 1500);
        } else {
          router.push(redirectPath);
        }
      } else {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) {
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          router.push(redirectPath);
        } else {
          setSuccessMessage(
            "Account created successfully! Check your email to confirm your account."
          );
          setLoading(false);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Authentication failed.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-xl space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="relative h-12 w-44 mx-auto flex items-center justify-center mb-2">
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
          {mode === "signin" ? "Welcome Back" : "Create Customer Account"}
        </h1>
        <p className="text-xs text-slate-500">
          {mode === "signin"
            ? "Sign in to access your purchased books and digital bookshelf."
            : "Register to purchase and securely download digital titles."}
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-[#F4F6FA] text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setErrorMessage("");
            setSuccessMessage("");
          }}
          className={`py-2 rounded-lg transition-all cursor-pointer ${
            mode === "signin"
              ? "bg-[#153D78] text-white shadow-sm font-bold"
              : "text-slate-600 hover:text-[#153D78]"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setErrorMessage("");
            setSuccessMessage("");
          }}
          className={`py-2 rounded-lg transition-all cursor-pointer ${
            mode === "signup"
              ? "bg-[#153D78] text-white shadow-sm font-bold"
              : "text-slate-600 hover:text-[#153D78]"
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full py-3 px-4 rounded-xl border border-[#E2E8F0] hover:bg-[#F4F6FA] text-xs font-bold text-slate-800 flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
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
      </button>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-[#E2E8F0] w-full" />
        <span className="bg-white px-3 text-[11px] text-slate-400 uppercase tracking-widest absolute">
          Or with email
        </span>
      </div>

      {/* Feedback Alerts */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Email & Password Form */}
      <form onSubmit={handleEmailAuth} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Devendra Verma"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-[#F4F6FA] border border-[#E2E8F0] focus:border-[#2878D0] outline-none text-[#0F1D36]"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-[#F4F6FA] border border-[#E2E8F0] focus:border-[#2878D0] outline-none text-[#0F1D36]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-[#F4F6FA] border border-[#E2E8F0] focus:border-[#2878D0] outline-none text-[#0F1D36]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-[#153D78] hover:bg-[#2878D0] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          <span>
            {loading
              ? "Processing..."
              : mode === "signin"
              ? "Sign In to Account"
              : "Create Account"}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Security Rule Ribbon */}
      <div className="pt-2 p-3 rounded-2xl bg-[#EAF3FF] border border-[#2878D0]/30 text-[11px] text-slate-600 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-[#153D78]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#153D78]" />
          <span>Administrator Security Rule:</span>
        </div>
        <p>
          Admin access is strictly gated by Google OAuth for verified email{" "}
          <code className="text-[#153D78] font-mono font-bold">
            dhurav07122010@gmail.com
          </code>{" "}
          /{" "}
          <code className="text-[#153D78] font-mono font-bold">
            dhuruv07122010@gmail.com
          </code>
          . Passwords cannot unlock admin access.
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="bg-[#F4F6FA] min-h-screen py-16 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <Suspense
          fallback={
            <div className="p-8 text-center text-slate-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-[#153D78] border-t-transparent mb-2" />
              <p className="text-xs font-semibold text-[#153D78]">Loading sign-in form...</p>
            </div>
          }
        >
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
