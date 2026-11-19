import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { MOCK_BOOKS } from "@/data/mock-books";
import {
  GraduationCap,
  Cpu,
  Code,
  Briefcase,
  TrendingUp,
  Sparkles,
  BookOpen,
  Compass,
  Award,
  Layers,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Categories & Genres — ApexBooks",
  description: "Explore all knowledge tracks from education, programming, technology, finance, fiction to competitive examinations.",
};

const iconMap: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="w-6 h-6" />,
  Cpu: <Cpu className="w-6 h-6" />,
  Code: <Code className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  TrendingUp: <TrendingUp className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  BookOpen: <BookOpen className="w-6 h-6" />,
  Compass: <Compass className="w-6 h-6" />,
  Award: <Award className="w-6 h-6" />,
  Layers: <Layers className="w-6 h-6" />,
};

export default function CategoriesPage() {
  return (
    <div className="bg-[#F4F6FA] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-[#153D78] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#153D78] font-bold">Categories</span>
        </nav>

        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF3FF] border border-[#2878D0]/30 text-[#153D78] text-xs font-bold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Editorial Genre Index</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#153D78] tracking-tight">
            Browse Bookstore Categories
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Select from our 10 curated literary and professional domains. Each collection is vetted for editorial depth, accuracy, and format fidelity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.categories.map((cat) => {
            const matchingBooks = MOCK_BOOKS.filter((b) => b.category === cat.slug);
            return (
              <Link
                key={cat.id}
                href={`/books?category=${cat.slug}`}
                className="group p-6 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#2878D0] hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#EAF3FF] text-[#153D78] flex items-center justify-center group-hover:bg-[#153D78] group-hover:text-white transition-all mb-5">
                    {iconMap[cat.iconName] || <BookOpen className="w-6 h-6" />}
                  </div>

                  <h3 className="text-lg font-bold text-[#0F1D36] group-hover:text-[#2878D0] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600">
                    {matchingBooks.length} Available {matchingBooks.length === 1 ? "Title" : "Titles"}
                  </span>
                  <span className="text-[#153D78] group-hover:text-[#2878D0] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
