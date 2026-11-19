"use client";

import React from "react";

export function StackedBooks3D({ className = "w-44 h-32" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 200 140" fill="none" className="w-full h-full drop-shadow-2xl">
        {/* Glow ambient */}
        <ellipse cx="100" cy="115" rx="80" ry="20" fill="#3B82F6" opacity="0.25" />

        {/* BOOK 1 (Bottom book, dark navy & gold pages) */}
        {/* Shadow */}
        <polygon points="20,110 160,110 180,125 40,125" fill="#030712" opacity="0.6" />
        {/* Book cover bottom */}
        <polygon points="25,95 155,85 175,100 45,110" fill="#0F172A" />
        {/* Pages (Golden/Cream) */}
        <polygon points="45,108 173,99 173,106 45,115" fill="#FDE68A" />
        <polygon points="45,115 173,106 170,114 42,122" fill="#F59E0B" />
        {/* Top Cover */}
        <polygon points="25,95 155,85 150,91 20,101" fill="#1E3A8A" />
        <polygon points="20,101 150,91 168,103 38,113" fill="#1E40AF" />
        {/* Gold Ribbon bookmark */}
        <path d="M120,93 L125,120 L132,114 L139,120 L135,93 Z" fill="#FBBF24" />

        {/* BOOK 2 (Middle book, royal blue & gold pages) */}
        <polygon points="35,75 145,67 165,80 55,88" fill="#1D4ED8" />
        {/* Pages */}
        <polygon points="55,86 163,79 163,84 55,91" fill="#FEF3C7" />
        <polygon points="55,91 163,84 160,90 52,97" fill="#FCD34D" />
        {/* Spine */}
        <polygon points="35,75 30,81 50,93 55,87" fill="#1E3A8A" />
        {/* Top Cover */}
        <polygon points="30,81 140,73 158,85 48,93" fill="#2563EB" />

        {/* BOOK 3 (Top book, golden amber cover) */}
        <polygon points="45,55 135,48 155,60 65,67" fill="#B45309" />
        {/* Pages */}
        <polygon points="65,66 153,59 153,63 65,70" fill="#FFFBEB" />
        {/* Spine */}
        <polygon points="45,55 40,60 60,71 65,66" fill="#92400E" />
        {/* Top Cover */}
        <polygon points="40,60 130,53 148,64 58,71" fill="#F59E0B" />
        {/* Embossed title bar on top book */}
        <polygon points="60,61 115,56 120,60 65,65" fill="#FEF3C7" opacity="0.6" />

        {/* Sparkles */}
        <circle cx="160" cy="45" r="2" fill="#FDE68A" />
        <circle cx="35" cy="50" r="1.5" fill="#FDE68A" />
        <path d="M165,35 L167,40 L172,42 L167,44 L165,49 L163,44 L158,42 L163,40 Z" fill="#FDE68A" />
      </svg>
    </div>
  );
}
