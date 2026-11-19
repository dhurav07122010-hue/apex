"use client";

import React from "react";

interface CategoryIconProps {
  name: string;
  className?: string;
}

export function CategoryIcon({ name, className = "w-10 h-10" }: CategoryIconProps) {
  switch (name) {
    case "fiction-literature":
    case "fiction":
      return (
        <div className={`flex items-center justify-center ${className}`}>
          {/* 3D Blue Open Book */}
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm">
            <rect width="64" height="64" rx="16" fill="#EBF5FF" />
            <path
              d="M18 20C24 18 30 20 32 24C34 20 40 18 46 20V44C40 42 34 44 32 48C30 44 24 42 18 44V20Z"
              fill="#2563EB"
            />
            <path
              d="M32 24V48"
              stroke="#1D4ED8"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M22 26C25 25 28 26 30 28"
              stroke="#93C5FD"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M34 28C36 26 39 25 42 26"
              stroke="#93C5FD"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M22 32C25 31 28 32 30 34"
              stroke="#93C5FD"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M34 34C36 32 39 31 42 32"
              stroke="#93C5FD"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );

    case "business-finance":
    case "business":
    case "finance":
      return (
        <div className={`flex items-center justify-center ${className}`}>
          {/* 3D Warm Tan Briefcase */}
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm">
            <rect width="64" height="64" rx="16" fill="#FFF3EB" />
            {/* Handle */}
            <path
              d="M26 22C26 19.8 27.8 18 30 18H34C36.2 18 38 19.8 38 22V24H26V22Z"
              fill="#9A5B32"
            />
            {/* Bag Body */}
            <rect x="16" y="24" width="32" height="22" rx="4" fill="#C27A45" />
            {/* Bag bottom flap / shadow */}
            <path
              d="M16 28C24 33 40 33 48 28V42C48 44.2 46.2 46 44 46H20C17.8 46 16 44.2 16 42V28Z"
              fill="#A7612E"
            />
            {/* Gold Latches */}
            <rect x="23" y="29" width="3" height="5" rx="1" fill="#FBBF24" />
            <rect x="38" y="29" width="3" height="5" rx="1" fill="#FBBF24" />
          </svg>
        </div>
      );

    case "self-improvement":
      return (
        <div className={`flex items-center justify-center ${className}`}>
          {/* 3D Green Sprout Plant */}
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm">
            <rect width="64" height="64" rx="16" fill="#EBF9F1" />
            {/* Soil */}
            <ellipse cx="32" cy="46" rx="14" ry="4" fill="#8D5B4C" />
            {/* Stem */}
            <path
              d="M32 46V30"
              stroke="#15803D"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Left Leaf */}
            <path
              d="M32 36C24 36 21 28 22 24C28 24 32 30 32 36Z"
              fill="#22C55E"
            />
            {/* Right Leaf */}
            <path
              d="M32 31C40 31 43 23 42 19C36 19 32 25 32 31Z"
              fill="#16A34A"
            />
            {/* Droplet */}
            <circle cx="28" cy="22" r="1.5" fill="#86EFAC" />
          </svg>
        </div>
      );

    case "education-learning":
    case "education":
      return (
        <div className={`flex items-center justify-center ${className}`}>
          {/* 3D Purple Graduation Cap */}
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm">
            <rect width="64" height="64" rx="16" fill="#F3E8FF" />
            {/* Cap base skull */}
            <path
              d="M22 34V41C22 44.5 26.5 47 32 47C37.5 47 42 44.5 42 41V34"
              fill="#6B21A8"
            />
            {/* Mortarboard Diamond */}
            <path
              d="M32 19L50 27L32 35L14 27L32 19Z"
              fill="#7E22CE"
            />
            {/* Diamond top facet */}
            <path
              d="M32 19L50 27L32 29L14 27L32 19Z"
              fill="#9333EA"
            />
            {/* Gold Tassel */}
            <path
              d="M44 28V38"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="44" cy="39" r="2" fill="#F59E0B" />
            <circle cx="32" cy="27" r="2" fill="#FBBF24" />
          </svg>
        </div>
      );

    case "technology":
      return (
        <div className={`flex items-center justify-center ${className}`}>
          {/* 3D Cyan Modern Laptop */}
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm">
            <rect width="64" height="64" rx="16" fill="#E6F7FF" />
            {/* Laptop Screen */}
            <rect x="18" y="20" width="28" height="19" rx="2.5" fill="#0284C7" />
            {/* Screen Glass */}
            <rect x="20" y="22" width="24" height="15" rx="1.5" fill="#0369A1" />
            {/* Glowing Code inside screen */}
            <path
              d="M24 28L22 30L24 32 M28 32L30 30L28 28 M33 26L38 26 M33 30L41 30 M33 34L37 34"
              stroke="#BAE6FD"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Laptop Base */}
            <path
              d="M13 41C13 40 14 39 15 39H49C50 39 51 40 51 41L49 45C49 45.5 48.5 46 48 46H16C15.5 46 15 45.5 15 45L13 41Z"
              fill="#94A3B8"
            />
            {/* Trackpad notch */}
            <rect x="29" y="40" width="6" height="1.5" rx="0.5" fill="#64748B" />
          </svg>
        </div>
      );

    case "competitive-exams":
    case "competitive-examinations":
      return (
        <div className={`flex items-center justify-center ${className}`}>
          {/* 3D Golden Trophy Cup */}
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm">
            <rect width="64" height="64" rx="16" fill="#FEF9E7" />
            {/* Trophy Pedestal */}
            <rect x="25" y="44" width="14" height="4" rx="1.5" fill="#78350F" />
            <rect x="28" y="40" width="8" height="4" fill="#D97706" />
            {/* Trophy Handles */}
            <path
              d="M22 24C17 24 17 33 22 33H24 M42 24C47 24 47 33 42 33H40"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Trophy Cup */}
            <path
              d="M22 20H42V29C42 35 37.5 39 32 39C26.5 39 22 35 22 29V20Z"
              fill="#FBBF24"
            />
            <ellipse cx="32" cy="20" rx="10" ry="2" fill="#FDE68A" />
            {/* Star badge */}
            <circle cx="32" cy="28" r="3.5" fill="#FFFFFF" />
            <path
              d="M32 26L32.8 27.6L34.5 27.8L33.2 29L33.6 30.7L32 29.8L30.4 30.7L30.8 29L29.5 27.8L31.2 27.6L32 26Z"
              fill="#F59E0B"
            />
          </svg>
        </div>
      );

    case "children-young-readers":
      return (
        <div className={`flex items-center justify-center ${className}`}>
          {/* 3D Colorful Storybooks & Whimsical Character */}
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm">
            <rect width="64" height="64" rx="16" fill="#FFF5E6" />
            {/* Stacked bright storybooks */}
            <rect x="18" y="38" width="28" height="7" rx="2" fill="#F97316" />
            <rect x="20" y="31" width="24" height="7" rx="2" fill="#10B981" />
            <rect x="22" y="24" width="20" height="7" rx="2" fill="#EC4899" />
            {/* Sparkles / Magic Stars */}
            <circle cx="45" cy="20" r="2" fill="#FBBF24" />
            <circle cx="18" cy="22" r="1.5" fill="#F59E0B" />
            <path
              d="M32 16L33 18.5L35.5 19.5L33 20.5L32 23L31 20.5L28.5 19.5L31 18.5L32 16Z"
              fill="#FBBF24"
            />
          </svg>
        </div>
      );

    case "programming":
    default:
      return (
        <div className={`flex items-center justify-center ${className}`}>
          {/* 3D Emerald Code Terminal */}
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm">
            <rect width="64" height="64" rx="16" fill="#ECFDF5" />
            <rect x="16" y="20" width="32" height="24" rx="4" fill="#047857" />
            <circle cx="21" cy="24" r="1.5" fill="#EF4444" />
            <circle cx="25" cy="24" r="1.5" fill="#FBBF24" />
            <circle cx="29" cy="24" r="1.5" fill="#10B981" />
            <path
              d="M22 32L26 35L22 38 M29 38H36"
              stroke="#A7F3D0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
  }
}
