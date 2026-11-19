import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Download, Zap } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Product Policy — ApexBooks",
  description: "Information regarding eBook licensing, delivery, access limits, and intellectual property rights on ApexBooks.",
};

export default function DigitalProductPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#0F2754]">
            Home
          </Link>
          <span>&gt;</span>
          <span className="font-bold text-[#0F1D36]">Digital Product Policy</span>
        </nav>

        {/* Heading */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-[#FDB813]" />
            <h1 className="text-3xl sm:text-4xl font-black text-[#0F1D36] tracking-tight">
              Digital Product Policy
            </h1>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Last Updated: November 2026 • Effective for all digital content purchases on ApexBooks.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-8 text-slate-700">
          <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
            <h2 className="text-base font-black text-[#0F1D36] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#153D78]" />
              1. Nature of Digital Delivery
            </h2>
            <p>
              All products sold on ApexBooks are purely digital eBooks provided in high-quality PDF format. No physical paperbacks or hardcovers are shipped unless explicitly indicated in special pre-order collections. Upon successful payment confirmation, instant digital delivery is granted to your registered account library.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-black text-[#0F1D36] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#153D78]" />
              2. Single-User License &amp; Copyright
            </h2>
            <p>
              When you purchase an eBook on ApexBooks, you are granted a non-exclusive, non-transferable, revocable single-user personal reading license. You may read the file on your personal computers, e-readers, smartphones, or tablets.
            </p>
            <p>
              You are strictly prohibited from redistributing, publicly uploading, reselling, sublicensing, or sharing purchased files on file-sharing networks, social media, or public forums. Unauthorized distribution violates the Indian Copyright Act (1957) and international intellectual property treaties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-black text-[#0F1D36] flex items-center gap-2">
              <Download className="w-4 h-4 text-[#153D78]" />
              3. Download Limits &amp; Security Quotas
            </h2>
            <p>
              To protect copyright holders against automated scraping and illegal file syndication, digital download links are cryptographically signed with time-limited tokens (valid for 1 hour). Each purchased title allows up to 50 lifetime downloads per customer account, which is more than sufficient for multi-device sync and personal backup.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-black text-[#0F1D36] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#153D78]" />
              4. Technical Support &amp; Corrupted Files
            </h2>
            <p>
              All eBook files are digitally scanned and verified for layout accuracy and virus-free integrity before publication. If you ever encounter an interrupted download or file corruption, simply refresh the download link from your ApexBooks account bookshelf or contact our support team at support@apexbooks.in.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
