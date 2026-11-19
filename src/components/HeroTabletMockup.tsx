"use client";

import React from "react";

export function HeroTabletMockup() {
  return (
    <div className="relative w-full max-w-[460px] mx-auto select-none">
      {/* Playful Yellow Sparkles Doodle (Top right of tablet) */}
      <div className="absolute -top-5 -right-3 z-30 pointer-events-none animate-pulse">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          {/* Main sparkle */}
          <path
            d="M24 4L26.5 16L38.5 18.5L26.5 21L24 33L21.5 21L9.5 18.5L21.5 16L24 4Z"
            fill="#FBBF24"
          />
          {/* Accent strokes */}
          <path
            d="M36 10L42 6 M38 28L44 32 M6 10L12 14"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Decorative Study Desk Ambient Elements */}
      {/* 1. Stacked Books (Bottom right under tablet) */}
      <div className="absolute -bottom-4 -right-6 w-44 h-16 pointer-events-none hidden sm:block opacity-90 drop-shadow-md">
        <svg viewBox="0 0 160 60" fill="none" className="w-full h-full">
          {/* Bottom book */}
          <rect x="10" y="36" width="140" height="18" rx="3" fill="#1E293B" />
          <rect x="25" y="39" width="120" height="12" fill="#F8FAFC" />
          <rect x="15" y="36" width="10" height="18" fill="#0F172A" />
          {/* Top book */}
          <rect x="20" y="20" width="125" height="16" rx="3" fill="#D97706" />
          <rect x="35" y="23" width="105" height="10" fill="#FEF3C7" />
          <rect x="25" y="20" width="10" height="16" fill="#B45309" />
        </svg>
      </div>

      {/* 2. Cozy Green Plant (Bottom left) */}
      <div className="absolute -bottom-2 -left-6 w-20 h-24 pointer-events-none hidden sm:block opacity-90 drop-shadow-md">
        <svg viewBox="0 0 80 100" fill="none" className="w-full h-full">
          {/* Clay Pot */}
          <path d="M25 65L30 92H50L55 65H25Z" fill="#D97706" />
          <rect x="22" y="60" width="36" height="6" rx="2" fill="#B45309" />
          {/* Succulent Leaves */}
          <ellipse cx="40" cy="50" rx="10" ry="18" fill="#16A34A" />
          <ellipse cx="30" cy="54" rx="8" ry="14" fill="#22C55E" transform="rotate(-25 30 54)" />
          <ellipse cx="50" cy="54" rx="8" ry="14" fill="#15803D" transform="rotate(25 50 54)" />
          <circle cx="40" cy="46" r="3" fill="#86EFAC" />
        </svg>
      </div>

      {/* Tablet Outer Shell (iPad Pro Aesthetic) */}
      <div
        className="relative z-10 bg-[#1E293B] p-3 sm:p-4 rounded-[28px] sm:rounded-[36px] shadow-2xl border border-slate-700/60"
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(15, 39, 84, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
        }}
      >
        {/* Subtle top front camera notch */}
        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700/50 mx-auto mb-2.5 opacity-80" />

        {/* Screen Bezel & Display */}
        <div className="relative rounded-[20px] sm:rounded-[26px] overflow-hidden aspect-[3/4.2] shadow-inner bg-gradient-to-b from-[#1C1844] via-[#6B2D5C] to-[#E36940]">
          {/* Screen Light Gloss Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none z-20" />

          {/* Majestic Mountain Sunrise Artwork */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 select-none z-10">
            {/* Top Sun Rays SVG */}
            <div className="absolute top-0 inset-x-0 h-48 opacity-40 pointer-events-none">
              <svg viewBox="0 0 300 200" fill="none" className="w-full h-full">
                <circle cx="150" cy="40" r="50" fill="#FDE047" opacity="0.8" />
                <path d="M150 40L60 200 M150 40L100 200 M150 40L150 200 M150 40L200 200 M150 40L240 200" stroke="#FEF08A" strokeWidth="12" opacity="0.3" />
              </svg>
            </div>

            {/* Glowing Sun */}
            <div className="relative mx-auto mt-4 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-amber-200 to-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.8)] mx-auto flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-100" />
              </div>
            </div>

            {/* Center Book Title: "Dream Learn Grow" */}
            <div className="relative text-center my-auto py-4">
              <h2 className="font-serif italic text-white/95 text-2xl sm:text-3xl lg:text-4xl font-normal tracking-wide drop-shadow-md">
                Dream
              </h2>
              <h1 className="font-serif font-black text-amber-200 text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-none drop-shadow-lg my-1">
                Learn
              </h1>
              <h2 className="font-serif italic text-white/95 text-2xl sm:text-3xl lg:text-4xl font-normal tracking-wide drop-shadow-md">
                Grow
              </h2>

              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span className="text-[10px] sm:text-xs font-semibold text-white/95 tracking-wider uppercase">
                  ApexBooks Digital Edition
                </span>
              </div>
            </div>

            {/* Bottom Mountain Silhouettes SVG */}
            <div className="relative -mx-8 -mb-8">
              <svg viewBox="0 0 320 120" fill="none" className="w-full h-auto">
                {/* Back Mountain Range */}
                <polygon points="0,120 70,50 160,110 240,40 320,120" fill="#4A1942" />
                {/* Middle Mountain Range */}
                <polygon points="0,120 110,60 190,120 280,70 320,120" fill="#2C0F2C" />
                {/* Front Mountain Silhouettes */}
                <polygon points="0,120 50,85 140,120 220,80 320,120" fill="#130517" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tablet Bottom Bezel Bar */}
        <div className="w-20 h-1 bg-slate-600/70 rounded-full mx-auto mt-2.5" />
      </div>
    </div>
  );
}
