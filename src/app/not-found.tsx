import React from "react";
import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mx-auto">
        <BookOpen className="w-8 h-8" />
      </div>
      <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600">
        404 — Not Found
      </span>
      <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
        Page or eBook Not Found
      </h1>
      <p className="text-xs text-zinc-500 max-w-xs mx-auto">
        The eBook or page you requested does not exist or has been relocated.
      </p>
      <div className="pt-2">
        <Link
          href="/books"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Storefront</span>
        </Link>
      </div>
    </div>
  );
}
