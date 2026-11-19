"use client";

import React from "react";
import { Book } from "@/types";

interface BookCoverVisualProps {
  slug?: string;
  book?: Pick<Book, "slug" | "title" | "author" | "categoryName" | "coverGradient" | "format" | "badge">;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showBadge?: boolean;
}

export function BookCoverVisual({
  slug,
  book,
  size = "md",
  className = "",
  showBadge = true,
}: BookCoverVisualProps) {
  const bookSlug = slug || book?.slug || "";

  // Dimensions
  const dimensions = {
    xs: { width: 48, height: 68, textScale: "text-[8px]" },
    sm: { width: 80, height: 114, textScale: "text-[10px]" },
    md: { width: 140, height: 200, textScale: "text-xs" },
    lg: { width: 220, height: 310, textScale: "text-sm" },
    xl: { width: 300, height: 420, textScale: "text-base" },
  }[size];

  // Specific high-fidelity covers matching reference image
  if (bookSlug === "atomic-habits") {
    return (
      <div
        className={`relative rounded-md overflow-hidden shadow-lg select-none flex flex-col justify-between transition-all duration-300 ${className}`}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          backgroundColor: "#FAF7F2",
          border: "1px solid #EAE4D9",
        }}
      >
        {/* Book spine highlight */}
        <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/25 via-white/20 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 left-2.5 w-[1px] bg-black/10 pointer-events-none z-20" />

        {/* Top header */}
        <div className="relative z-10 pt-3 px-3 text-center">
          <p className="text-[7px] sm:text-[8px] font-bold tracking-[0.2em] text-[#9A7B38] uppercase">
            #1 NEW YORK TIMES BESTSELLER
          </p>
        </div>

        {/* Center: Title & Golden Particle Swarm */}
        <div className="relative z-10 my-auto text-center px-2 py-1">
          <div className="relative inline-block w-full">
            {/* Golden stippling dots SVG */}
            <svg
              className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
              viewBox="0 0 100 60"
              fill="#D4A017"
            >
              <circle cx="20" cy="15" r="1.5" />
              <circle cx="35" cy="22" r="1" />
              <circle cx="50" cy="18" r="1.8" />
              <circle cx="65" cy="25" r="1.2" />
              <circle cx="80" cy="14" r="1.5" />
              <circle cx="28" cy="38" r="1.2" />
              <circle cx="45" cy="42" r="1.6" />
              <circle cx="58" cy="35" r="1.4" />
              <circle cx="72" cy="40" r="1" />
              <circle cx="38" cy="12" r="0.8" />
              <circle cx="62" cy="48" r="1.2" />
            </svg>
            <h3 className="font-extrabold text-[#1A1A1A] tracking-tight leading-none text-base sm:text-lg lg:text-xl">
              Atomic
            </h3>
            <h3 className="font-extrabold text-[#1A1A1A] tracking-tight leading-none text-base sm:text-lg lg:text-xl mt-0.5">
              Habits
            </h3>
            <p className="text-[7px] sm:text-[8px] text-slate-600 mt-1 font-medium leading-tight">
              An Easy &amp; Proven Way to Build Good Habits &amp; Break Bad Ones
            </p>
          </div>
        </div>

        {/* Bottom: Author */}
        <div className="relative z-10 pb-3 px-3 text-center border-t border-[#EAE4D9]/60 pt-1.5">
          <p className="font-bold text-[#1A1A1A] tracking-wide text-[9px] sm:text-[11px]">
            James Clear
          </p>
        </div>
      </div>
    );
  }

  if (bookSlug === "the-psychology-of-money") {
    return (
      <div
        className={`relative rounded-md overflow-hidden shadow-lg select-none flex flex-col justify-between transition-all duration-300 ${className}`}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
        }}
      >
        <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/25 via-white/20 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 left-2.5 w-[1px] bg-black/10 pointer-events-none z-20" />

        <div className="relative z-10 pt-3 px-3 text-center">
          <p className="text-[7px] sm:text-[8px] font-semibold tracking-widest text-slate-500 uppercase">
            INTERNATIONAL BESTSELLER
          </p>
        </div>

        {/* Center: Title & Labyrinth graphic */}
        <div className="relative z-10 my-auto text-center px-3">
          <h3 className="font-serif font-black text-[#0F172A] tracking-tight leading-tight text-xs sm:text-sm lg:text-base">
            The Psychology
          </h3>
          <p className="font-serif italic text-[#0F172A] text-[10px] sm:text-xs">
            of
          </p>
          <h3 className="font-serif font-black text-[#0F172A] tracking-tight leading-tight text-sm sm:text-base lg:text-lg">
            Money
          </h3>

          {/* Labyrinth / Maze Brain SVG */}
          <div className="my-1.5 flex justify-center">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-slate-800"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            >
              <circle cx="50" cy="50" r="42" strokeDasharray="6 3" />
              <circle cx="50" cy="50" r="32" />
              <circle cx="50" cy="50" r="22" strokeDasharray="4 2" />
              <circle cx="50" cy="50" r="12" />
              <path d="M50 8 V28 M50 72 V92 M8 50 H28 M72 50 H92" />
            </svg>
          </div>

          <p className="text-[7px] sm:text-[8px] text-slate-500 leading-tight">
            Timeless lessons on wealth, greed, and happiness
          </p>
        </div>

        <div className="relative z-10 pb-3 px-3 text-center border-t border-slate-100 pt-1.5">
          <p className="font-bold text-[#0F172A] tracking-wide text-[9px] sm:text-[11px]">
            Morgan Housel
          </p>
        </div>
      </div>
    );
  }

  if (bookSlug === "rich-dad-poor-dad") {
    return (
      <div
        className={`relative rounded-md overflow-hidden shadow-lg select-none flex flex-col justify-between transition-all duration-300 ${className}`}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          background: "linear-gradient(145deg, #2D143D 0%, #170724 100%)",
          border: "1px solid #4A2863",
        }}
      >
        <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/50 via-white/10 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 left-2.5 w-[1px] bg-black/30 pointer-events-none z-20" />

        <div className="relative z-10 pt-3 px-3 text-center">
          <p className="text-[7px] sm:text-[8px] font-bold tracking-wider text-amber-300/90 uppercase">
            25TH ANNIVERSARY EDITION
          </p>
        </div>

        {/* Center: Bold Golden Embossed Title */}
        <div className="relative z-10 my-auto text-center px-2">
          <h3 className="font-black text-amber-400 tracking-tight leading-none text-sm sm:text-base lg:text-lg drop-shadow-md">
            RICH DAD
          </h3>
          <h3 className="font-black text-amber-300 tracking-tight leading-none text-sm sm:text-base lg:text-lg mt-0.5 drop-shadow-md">
            POOR DAD
          </h3>

          {/* Golden Medallion Crest */}
          <div className="my-1.5 flex justify-center">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-amber-400/60 bg-amber-500/20 flex items-center justify-center">
              <span className="text-[9px] font-black text-amber-300">#1</span>
            </div>
          </div>

          <p className="text-[7px] sm:text-[8px] text-amber-100/80 leading-tight px-1">
            What The Rich Teach Their Kids About Money
          </p>
        </div>

        <div className="relative z-10 pb-3 px-3 text-center border-t border-purple-800/40 pt-1.5">
          <p className="font-bold text-white tracking-wide text-[9px] sm:text-[11px]">
            Robert T. Kiyosaki
          </p>
        </div>
      </div>
    );
  }

  if (bookSlug === "ikigai") {
    return (
      <div
        className={`relative rounded-md overflow-hidden shadow-lg select-none flex flex-col justify-between transition-all duration-300 ${className}`}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          backgroundColor: "#EBF5FA",
          border: "1px solid #D1E5F0",
        }}
      >
        <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/20 via-white/30 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 left-2.5 w-[1px] bg-black/10 pointer-events-none z-20" />

        <div className="relative z-10 pt-3 px-3 text-center">
          <p className="text-[7px] sm:text-[8px] font-medium tracking-[0.25em] text-slate-500 uppercase">
            JAPANESE WISDOM
          </p>
        </div>

        {/* Center: Minimalist Branch Artwork & IKIGAI */}
        <div className="relative z-10 my-auto text-center px-3">
          {/* Minimalist branch line-art */}
          <div className="my-1 flex justify-center">
            <svg
              className="w-10 h-7 text-sky-700"
              viewBox="0 0 100 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M10 25 Q35 15 50 25 T90 20" strokeLinecap="round" />
              <path d="M30 20 Q40 5 45 15" strokeLinecap="round" />
              <path d="M65 24 Q75 10 80 18" strokeLinecap="round" />
              <circle cx="45" cy="14" r="2.5" fill="#F43F5E" />
              <circle cx="80" cy="17" r="2.5" fill="#F43F5E" />
            </svg>
          </div>

          <h3 className="font-extrabold text-[#0B2545] tracking-[0.2em] leading-tight text-sm sm:text-base lg:text-lg">
            IKIGAI
          </h3>
          <p className="text-[7px] sm:text-[8px] text-slate-600 mt-1 leading-tight">
            The Japanese Secret to a Long and Happy Life
          </p>
        </div>

        <div className="relative z-10 pb-3 px-3 text-center border-t border-sky-200/50 pt-1.5">
          <p className="font-semibold text-slate-800 tracking-wide text-[9px] sm:text-[10px]">
            Héctor García
          </p>
        </div>
      </div>
    );
  }

  if (bookSlug === "the-5-am-club") {
    return (
      <div
        className={`relative rounded-md overflow-hidden shadow-lg select-none flex flex-col justify-between transition-all duration-300 ${className}`}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          backgroundColor: "#FFF9F2",
          border: "1px solid #F5E5D3",
        }}
      >
        <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/20 via-white/20 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 left-2.5 w-[1px] bg-black/10 pointer-events-none z-20" />

        <div className="relative z-10 pt-3 px-3 text-center">
          <p className="text-[7px] sm:text-[8px] font-bold tracking-widest text-amber-700 uppercase">
            GLOBAL BESTSELLER
          </p>
        </div>

        {/* Center: Radiant Sunrise Emblem */}
        <div className="relative z-10 my-auto text-center px-3">
          <div className="my-1 flex justify-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-amber-500 to-rose-400 p-0.5 shadow-sm">
              <div className="w-full h-full rounded-full bg-[#FFF9F2] flex items-center justify-center">
                <span className="text-[10px] font-extrabold text-amber-600">5 AM</span>
              </div>
            </div>
          </div>

          <h3 className="font-black text-[#261303] tracking-tight leading-tight text-xs sm:text-sm lg:text-base">
            The 5 AM Club
          </h3>
          <p className="text-[7px] sm:text-[8px] text-amber-900/70 mt-0.5 leading-tight">
            Own Your Morning. Elevate Your Life.
          </p>
        </div>

        <div className="relative z-10 pb-3 px-3 text-center border-t border-amber-200/50 pt-1.5">
          <p className="font-bold text-[#261303] tracking-wide text-[9px] sm:text-[11px]">
            Robin Sharma
          </p>
        </div>
      </div>
    );
  }

  if (bookSlug === "deep-work") {
    return (
      <div
        className={`relative rounded-md overflow-hidden shadow-lg select-none flex flex-col justify-between transition-all duration-300 ${className}`}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          backgroundColor: "#FFD200",
          border: "1px solid #E6BD00",
        }}
      >
        <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/30 via-white/20 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 left-2.5 w-[1px] bg-black/10 pointer-events-none z-20" />

        <div className="relative z-10 pt-3 px-3 text-center">
          <p className="text-[7px] sm:text-[8px] font-black tracking-widest text-black/80 uppercase">
            WALL STREET JOURNAL BESTSELLER
          </p>
        </div>

        {/* Center: Iconic Heavy Condensed Black Typography */}
        <div className="relative z-10 my-auto text-center px-2">
          <h3 className="font-black text-black tracking-tighter leading-none text-base sm:text-lg lg:text-xl uppercase">
            DEEP
          </h3>
          <h3 className="font-black text-black tracking-tighter leading-none text-base sm:text-lg lg:text-xl uppercase mt-0.5">
            WORK
          </h3>
          <p className="text-[7px] sm:text-[8px] font-bold text-black/80 mt-1 leading-tight px-1">
            Rules for Focused Success in a Distracted World
          </p>
        </div>

        <div className="relative z-10 pb-3 px-3 text-center border-t border-black/15 pt-1.5">
          <p className="font-black text-black tracking-wide text-[9px] sm:text-[11px]">
            Cal Newport
          </p>
        </div>
      </div>
    );
  }

  if (bookSlug === "think-like-a-monk") {
    return (
      <div
        className={`relative rounded-md overflow-hidden shadow-lg select-none flex flex-col justify-between transition-all duration-300 ${className}`}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          background: "linear-gradient(145deg, #0C2340 0%, #061120 100%)",
          border: "1px solid #1C3B66",
        }}
      >
        <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/50 via-white/10 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 left-2.5 w-[1px] bg-black/20 pointer-events-none z-20" />

        <div className="relative z-10 pt-3 px-3 text-center">
          <p className="text-[7px] sm:text-[8px] font-bold tracking-widest text-amber-300 uppercase">
            #1 SUNDAY TIMES BESTSELLER
          </p>
        </div>

        {/* Center: Elegant Golden Serif */}
        <div className="relative z-10 my-auto text-center px-2">
          <h3 className="font-serif font-black text-amber-300 tracking-tight leading-tight text-xs sm:text-sm lg:text-base">
            THINK LIKE
          </h3>
          <h3 className="font-serif font-black text-amber-300 tracking-tight leading-tight text-xs sm:text-sm lg:text-base mt-0.5">
            A MONK
          </h3>

          <div className="my-1 flex justify-center">
            <div className="w-5 h-0.5 bg-amber-400/80 rounded-full" />
          </div>

          <p className="text-[7px] sm:text-[8px] text-amber-100/70 leading-tight">
            Train Your Mind for Peace and Purpose Every Day
          </p>
        </div>

        <div className="relative z-10 pb-3 px-3 text-center border-t border-blue-900/40 pt-1.5">
          <p className="font-bold text-white tracking-wide text-[9px] sm:text-[11px]">
            Jay Shetty
          </p>
        </div>
      </div>
    );
  }

  if (bookSlug === "do-epic-shit") {
    return (
      <div
        className={`relative rounded-md overflow-hidden shadow-lg select-none flex flex-col justify-between transition-all duration-300 ${className}`}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          backgroundColor: "#18181B",
          border: "1px solid #27272A",
        }}
      >
        <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/60 via-white/10 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 left-2.5 w-[1px] bg-black/30 pointer-events-none z-20" />

        <div className="relative z-10 pt-3 px-3 text-center">
          <p className="text-[7px] sm:text-[8px] font-bold tracking-widest text-yellow-400 uppercase">
            BESTSELLER
          </p>
        </div>

        {/* Center: High-energy Golden Stencil */}
        <div className="relative z-10 my-auto text-center px-2">
          <h3 className="font-black text-yellow-400 tracking-tight leading-tight text-xs sm:text-sm lg:text-base">
            DO
          </h3>
          <h3 className="font-black text-yellow-400 tracking-tight leading-tight text-sm sm:text-base lg:text-lg">
            EPIC
          </h3>
          <h3 className="font-black text-yellow-400 tracking-tight leading-tight text-xs sm:text-sm lg:text-base">
            SHIT
          </h3>
        </div>

        <div className="relative z-10 pb-3 px-3 text-center border-t border-zinc-800 pt-1.5">
          <p className="font-bold text-white tracking-wide text-[9px] sm:text-[11px]">
            Ankur Warikoo
          </p>
        </div>
      </div>
    );
  }

  // Fallback for custom books or other titles
  const gradient = book?.coverGradient || {
    from: "#0F2754",
    to: "#1E5BB0",
    accent: "#FDB813",
  };

  return (
    <div
      className={`relative rounded-md overflow-hidden shadow-lg select-none flex flex-col justify-between transition-all duration-300 p-3 ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
        boxShadow: "0 8px 18px -4px rgba(15, 39, 84, 0.35)",
      }}
    >
      <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none z-20" />
      <div className="absolute inset-y-0 left-2.5 w-[1px] bg-black/20 pointer-events-none z-20" />

      <div className="relative z-10 flex items-start justify-between">
        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase text-white/90 bg-black/30">
          {book?.categoryName || "eBook"}
        </span>
      </div>

      <div className="relative z-10 my-auto py-1">
        <div
          className="w-5 h-0.5 mb-1 rounded-full"
          style={{ backgroundColor: gradient.accent || "#FDB813" }}
        />
        <h4 className="font-bold text-white tracking-tight leading-tight line-clamp-3 text-xs sm:text-sm drop-shadow-md">
          {book?.title || "ApexBooks"}
        </h4>
      </div>

      <div className="relative z-10 pt-1 border-t border-white/20 flex items-center justify-between">
        <p className="font-medium text-white/90 truncate text-[9px] sm:text-[10px]">
          {book?.author || "ApexBooks"}
        </p>
        <span className="text-[8px] font-bold text-white/70">PDF</span>
      </div>
    </div>
  );
}
