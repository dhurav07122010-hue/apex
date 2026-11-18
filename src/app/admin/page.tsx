"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ShieldAlert, Lock, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";

export default function AdminGatePage() {
  const authorizedAdmin = "dhurav07122010@gmail.com";

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
              Admin Gateway & Authorization
            </h1>
            <p className="text-xs text-zinc-500">
              Master Project Specification — Security Guardrails
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-semibold">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Authorized Administrator Email:</span>
          </div>
          <code className="block p-2 rounded-lg bg-zinc-200/60 dark:bg-zinc-800 font-mono text-blue-600 dark:text-blue-400 font-bold">
            {authorizedAdmin}
          </code>
        </div>

        <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            <span>
              <strong>Google OAuth Only:</strong> Passwords and email/password sessions are permanently rejected for administrator access.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            <span>
              <strong>Server-Side Verification:</strong> Every admin route and API endpoint cryptographically validates identity against the server database allowlist table.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <span>
              <strong>Zero Public Admin Registration:</strong> Public signups can never elevate privileges or modify site settings.
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            ← Return to Storefront
          </Link>
          <Link
            href="/auth/signin"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Google Login</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
