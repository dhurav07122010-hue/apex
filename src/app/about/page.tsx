import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  BookOpen,
  ShieldCheck,
  Zap,
  Award,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "About Us — ApexBooks Digital Publishing",
  description: "Learn about the mission, engineering standards, and publishing philosophy of ApexBooks.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#EAF3FF] to-white py-12 sm:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#BFDBFE] text-[#153D78] text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-[#2878D0]" />
            <span>Read • Learn • Grow</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0F1D36] tracking-tight">
            Publishing Digital Knowledge for Modern Readers
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            ApexBooks was founded with a singular conviction: accessing authoritative, world-class knowledge should be instant, affordable, and free from restrictive proprietary formats.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-[#0F1D36]">
              Our Editorial Philosophy
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We curate and publish specialized handbooks across Software Engineering, Distributed Systems, Cloud Architecture, Quantitative Aptitude, Finance, and Literature.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every title is professionally formatted with high-resolution vector diagrams, searchable monospace code samples, and comprehensive indexes formatted specifically for tablets, e-readers, and desktop screens.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#F4F6FA] border border-[#E2E8F0] space-y-4">
            <h4 className="font-bold text-sm text-[#153D78] uppercase tracking-wide">
              The Apex Quality Standard
            </h4>
            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2878D0] shrink-0 mt-0.5" />
                <span>Strict technical and pedagogical peer review prior to publication.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2878D0] shrink-0 mt-0.5" />
                <span>Universal PDF and ePub editions with zero DRM friction.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2878D0] shrink-0 mt-0.5" />
                <span>Permanent re-download access through your personal customer account.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2878D0] shrink-0 mt-0.5" />
                <span>Encrypted digital delivery powered by private Supabase cloud vaults.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#E2E8F0]">
          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#153D78] flex items-center justify-center font-bold">
              <Award className="w-5 h-5 text-[#153D78]" />
            </div>
            <h4 className="font-bold text-sm text-[#0F1D36]">Curated Rigor</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every handbook is crafted by industry specialists, experienced researchers, and educators.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#153D78] flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 text-[#2878D0]" />
            </div>
            <h4 className="font-bold text-sm text-[#0F1D36]">Instant Fulfillment</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              No delivery lag or shipping delays. Complete payment and begin reading within seconds.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#153D78] flex items-center justify-center font-bold">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="font-bold text-sm text-[#0F1D36]">Reader-First Service</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Transparent digital policies, fair INR pricing, and dedicated human customer support.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#153D78] text-white text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-black">
            Ready to expand your intellectual horizons?
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 max-w-md mx-auto">
            Browse our complete catalogue of 10 knowledge disciplines and start reading today.
          </p>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#153D78] hover:bg-[#EAF3FF] font-bold text-xs transition-colors"
          >
            <span>Explore Bookstore</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
