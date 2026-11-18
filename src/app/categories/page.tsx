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
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse eBook Categories — All Genres",
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mb-12">
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
          Browse Knowledge Categories
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 mt-2 leading-relaxed">
          Select from our 10 curated eBook domains. Each collection is vetted for instructional depth, accuracy, and format fidelity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {siteConfig.categories.map((cat) => {
          const matchingBooks = MOCK_BOOKS.filter((b) => b.category === cat.slug);
          return (
            <Link
              key={cat.id}
              href={`/books?category=${cat.slug}`}
              className="group p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all mb-4">
                  {iconMap[cat.iconName] || <BookOpen className="w-6 h-6" />}
                </div>

                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-600 dark:text-zinc-400">
                  {matchingBooks.length} Available {matchingBooks.length === 1 ? "Title" : "Titles"}
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
