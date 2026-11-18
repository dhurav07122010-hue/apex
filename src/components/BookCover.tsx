import React from "react";
import { Book } from "@/types";
import { BookOpen } from "lucide-react";

interface BookCoverProps {
  book: Pick<Book, "title" | "author" | "categoryName" | "coverGradient" | "format" | "badge">;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showBadge?: boolean;
}

export function BookCover({ book, size = "md", className = "", showBadge = true }: BookCoverProps) {
  const sizeClasses = {
    sm: "w-24 h-36 text-[10px]",
    md: "w-36 h-52 text-xs",
    lg: "w-48 h-68 text-sm",
    xl: "w-64 h-92 text-base",
  }[size];

  const { from, to, accent } = book.coverGradient;

  return (
    <div
      className={`relative rounded-md overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] flex flex-col justify-between p-3 select-none ${sizeClasses} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Book spine lighting overlay */}
      <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />
      {/* Subtle glossy sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none" />

      {/* Top Header: Category Tag & Badge */}
      <div className="relative z-10 flex items-start justify-between gap-1">
        <span
          className="px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wider uppercase text-white/90 backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.35)" }}
        >
          {book.categoryName}
        </span>
        {showBadge && book.badge && size !== "sm" && (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm">
            {book.badge}
          </span>
        )}
      </div>

      {/* Middle: Title & Subtitle */}
      <div className="relative z-10 my-auto py-2">
        <div
          className="w-6 h-0.5 mb-1.5 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <h4 className="font-extrabold text-white tracking-tight leading-tight line-clamp-3 drop-shadow-md">
          {book.title}
        </h4>
      </div>

      {/* Bottom: Author & Format */}
      <div className="relative z-10 pt-2 border-t border-white/15 flex items-end justify-between">
        <div className="overflow-hidden">
          <p className="text-[10px] text-white/60 uppercase tracking-widest font-mono">Author</p>
          <p className="font-medium text-white/90 truncate text-[11px] drop-shadow-sm">
            {book.author}
          </p>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-mono text-white/80 bg-black/30 px-1 py-0.5 rounded">
          <BookOpen className="w-2.5 h-2.5" />
          <span>{book.format}</span>
        </div>
      </div>
    </div>
  );
}
