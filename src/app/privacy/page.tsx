import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — ApexBooks",
  description: "Learn how ApexBooks protects your data, digital library rights, and transaction details.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-white">
      <div className="border-b border-[#E2E8F0] pb-6 mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2878D0]">
          Legal & Compliance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0F1D36] tracking-tight mt-1">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Last updated: January 2026 • Effective for all ApexBooks purchases and user sessions.
        </p>
      </div>

      <div className="prose prose-slate max-w-none space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0F1D36]">1. Information We Collect</h2>
          <p>
            When you purchase digital eBooks, create an account, or contact support on ApexBooks, we collect essential transactional data:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Customer Contact Details:</strong> Name and email address required for generating digital download entitlements.</li>
            <li><strong>Transactional Records:</strong> Order amounts, currency (INR), payment IDs, and timestamps. (We never store raw credit card numbers or UPI PINs; all payments are processed through Razorpay).</li>
            <li><strong>Download Security Telemetry:</strong> IP addresses and user agents recorded in our <code>download_logs</code> table to prevent link enumeration and enforce bandwidth quotas.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0F1D36]">2. How We Protect Your Data</h2>
          <p>
            We implement strict technical and database security measures:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Database Row-Level Security (RLS):</strong> Customer purchase entitlements and order details are strictly isolated in Supabase PostgreSQL with verified user authorization.</li>
            <li><strong>Private Storage Vaults:</strong> All eBook assets are kept in non-public storage buckets. Digital delivery occurs exclusively through cryptographically signed URLs valid for 60 minutes.</li>
            <li><strong>256-Bit SSL/TLS Encryption:</strong> Every browser connection is encrypted in transit.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0F1D36]">3. Payment Processing & Third Parties</h2>
          <p>
            Payments on ApexBooks are securely handled by <strong>Razorpay</strong>, India&apos;s leading RBI-authorized payment aggregator. We do not sell, rent, or monetize reader data with third-party advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0F1D36]">4. Your Privacy Rights</h2>
          <p>
            You have the right to request access to your purchased book records, request data deletion, or update your registered account email by contacting <a href="mailto:support@apexbooks.demo" className="text-[#2878D0] underline font-semibold">support@apexbooks.demo</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
