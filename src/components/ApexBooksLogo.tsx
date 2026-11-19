"use client";

import React from "react";
import Link from "next/link";

interface ApexBooksLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
  logoUrl?: string;
}

export function ApexBooksLogo({
  className = "",
  size = "md",
  inverted = false,
  logoUrl,
}: ApexBooksLogoProps) {
  if (logoUrl && logoUrl !== "/logo.png") {
    const imgHeight = {
      sm: "h-7",
      md: "h-9",
      lg: "h-11",
    }[size];
    return (
      <Link href="/" className={`inline-flex items-center group select-none ${className}`}>
        <img
          src={logoUrl}
          alt="ApexBooks"
          className={`${imgHeight} w-auto object-contain block`}
        />
      </Link>
    );
  }
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  }[size];

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  }[size];

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* 3D Blue Book Icon matching reference image */}
      <div className={`relative ${iconSizes} shrink-0`}>
        <svg viewBox="0 0 44 44" fill="none" className="w-full h-full drop-shadow-sm">
          {/* Left page layer */}
          <path
            d="M22 12C14 9 7 11 5 13V33C7 31 14 29 22 32V12Z"
            fill="#1E40AF"
          />
          {/* Left page face */}
          <path
            d="M22 10C14 7 7 9 5 11V31C7 29 14 27 22 30V10Z"
            fill="#2563EB"
          />
          {/* Right page layer */}
          <path
            d="M22 12C30 9 37 11 39 13V33C37 31 30 29 22 32V12Z"
            fill="#1D4ED8"
          />
          {/* Right page face */}
          <path
            d="M22 10C30 7 37 9 39 11V31C37 29 30 27 22 30V10Z"
            fill="#3B82F6"
          />
          {/* Spine & Center fold */}
          <path
            d="M22 10V32"
            stroke="#1E3A8A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Gold Bookmark ribbon */}
          <path
            d="M22 10V22L24.5 19.5L27 22V10"
            fill="#FBBF24"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex items-baseline">
        <span
          className={`font-black tracking-tight ${textSizes} ${
            inverted ? "text-white" : "text-[#0F2754]"
          }`}
        >
          Apex
        </span>
        <span
          className={`font-extrabold tracking-tight ${textSizes} ${
            inverted ? "text-amber-400" : "text-[#153D78]"
          }`}
        >
          Books
        </span>
      </div>
    </Link>
  );
}
