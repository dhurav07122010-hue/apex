import React from "react";
import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-white min-h-[70vh] flex items-center justify-center py-20">
      <div className="max-w-md mx-auto px-4 text-center space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-[#EAF3FF] flex items-center justify-center text-[#0F2754] mx-auto shadow-sm">
          <BookOpen className="w-10 h-10" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#FDB813] bg-[#0F2754] px-3 py-1 rounded-full">
            404 Error
          </span>
          <h1 className="text-3xl font-black text-[#0F1D36] tracking-tight mt-3">
            Page or eBook Not Found
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
          The page or digital book you are looking for does not exist or may have been moved.
        </p>
        <div className="pt-3">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F2754] hover:bg-[#153D78] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Bookstore</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
