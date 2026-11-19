import React from "react";
import { Book } from "@/types";
import { BookOpen } from "lucide-react";

interface BookCoverProps {
  book: Pick<Book, "title" | "author" | "categoryName" | "coverGradient" | "format" | "badge">;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showBadge?: boolean;
}

export function BookCover({
  book,
  size = "md",
  className = "",
  showBadge = true,
}: BookCoverProps) {
  const sizeClasses = {
    sm: "w-24 h-36 text-[10px]",
    md: "w-36 h-52 text-xs",
    lg: "w-48 h-70 text-sm",
    xl: "w-64 h-92 text-base",
  }[size];

  const { from, to, accent } = book.coverGradient;

  return (
    <div
      className={`relative rounded-md overflow-hidden transition-transform duration-300 flex flex-col justify-between p-3 select-none ${sizeClasses} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        boxShadow: "0 12px 24px -6px rgba(21, 61, 120, 0.35), 0 6px 12px -4px rgba(21, 61, 120, 0.2)",
      }}
    >
      {/* 3D Book spine lighting and left hinge */}
      <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 left-3 w-0.5 bg-black/20 pointer-events-none" />

      {/* Subtle paper gloss sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none" />

      {/* Top Header: Category Tag & Badge */}
      <div className="relative z-10 flex items-start justify-between gap-1">
        <span
          className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold tracking-wider uppercase text-white/95 backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        >
          {book.categoryName}
        </span>
        {showBadge && book.badge && size !== "sm" && (
          <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm">
            {book.badge}
          </span>
        )}
      </div>

      {/* Middle: Title & Accent Rule */}
      <div className="relative z-10 my-auto py-2">
        <div
          className="w-7 h-0.5 mb-1.5 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <h4 className="font-black text-white tracking-tight leading-tight line-clamp-3 drop-shadow-md">
          {book.title}
        </h4>
      </div>

      {/* Bottom: Author & Format */}
      <div className="relative z-10 pt-2 border-t border-white/20 flex items-end justify-between">
        <div className="overflow-hidden">
          <p className="text-[9px] text-white/70 uppercase tracking-widest font-mono">Apex Publishing</p>
          <p className="font-semibold text-white/95 truncate text-[10px] sm:text-[11px] drop-shadow-sm">
            {book.author}
          </p>
        </div>
        <div className="flex items-center gap-1 text-[8px] sm:text-[9px] font-mono font-bold text-white/90 bg-black/40 px-1.5 py-0.5 rounded">
          <BookOpen className="w-2.5 h-2.5" />
          <span>{book.format}</span>
        </div>
      </div>
    </div>
  );
}
