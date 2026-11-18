"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, FileText, Image as ImageIcon, AlertCircle, CheckCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { saveProduct } from "./actions";

interface ProductFormProps {
  initialData?: any;
  categories: any[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || "");
  const [author, setAuthor] = useState(initialData?.author || "");
  const [authorBio, setAuthorBio] = useState(initialData?.author_bio || "");
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "programming");
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : "499");
  const [originalPrice, setOriginalPrice] = useState(
    initialData?.original_price ? String(initialData.original_price) : "1299"
  );
  const [format, setFormat] = useState(initialData?.format || "PDF");
  const [pageCount, setPageCount] = useState(initialData?.page_count ? String(initialData.page_count) : "350");
  const [fileSize, setFileSize] = useState(initialData?.file_size || "12.5 MB");
  const [language, setLanguage] = useState(initialData?.language || "English");
  const [isbn, setIsbn] = useState(initialData?.isbn || "");
  const [badge, setBadge] = useState(initialData?.badge || "New");
  const [shortDescription, setShortDescription] = useState(initialData?.short_description || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [isPublished, setIsPublished] = useState(initialData ? initialData.is_published : true);
  const [isFeatured, setIsFeatured] = useState(initialData ? initialData.is_featured : false);
  const [isBestseller, setIsBestseller] = useState(initialData ? initialData.is_bestseller : false);

  const [ebookFile, setEbookFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    if (initialData?.id) {
      formData.append("id", initialData.id);
    }
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("subtitle", subtitle);
    formData.append("author", author);
    formData.append("authorBio", authorBio);
    formData.append("categoryId", categoryId);
    formData.append("price", price);
    if (originalPrice) formData.append("originalPrice", originalPrice);
    formData.append("format", format);
    formData.append("pageCount", pageCount);
    formData.append("fileSize", fileSize);
    formData.append("language", language);
    formData.append("isbn", isbn);
    formData.append("badge", badge);
    formData.append("shortDescription", shortDescription);
    formData.append("description", description);
    formData.append("isPublished", String(isPublished));
    formData.append("isFeatured", String(isFeatured));
    formData.append("isBestseller", String(isBestseller));

    if (initialData?.storage_path) {
      formData.append("existingStoragePath", initialData.storage_path);
    }
    if (initialData?.cover_image_url) {
      formData.append("existingCoverImageUrl", initialData.cover_image_url);
    }

    if (ebookFile) {
      formData.append("ebookFile", ebookFile);
    }
    if (coverFile) {
      formData.append("coverFile", coverFile);
    }

    const res = await saveProduct(formData);
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/admin/products");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
              {initialData ? "Edit eBook Product" : "Add New eBook"}
            </h1>
            <p className="text-xs text-zinc-500">
              {initialData ? `Updating ${initialData.title}` : "Upload digital file to private storage vault and publish."}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "Saving..." : "Save eBook"}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Column: Essential Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Book Information
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                eBook Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Full-Stack TypeScript & Next.js"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="full-stack-typescript-and-nextjs"
                className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Subtitle / Tagline
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Designing Fault-Tolerant, Globally Scalable Microservices"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Author Name *
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Arjun Venkataraman"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Author Biography
              </label>
              <textarea
                rows={2}
                value={authorBio}
                onChange={(e) => setAuthorBio(e.target.value)}
                placeholder="Author credentials, achievements, and background..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Short Description (Catalogue preview) *
              </label>
              <textarea
                rows={2}
                required
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Concise 1-2 sentence overview shown on catalog cards..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Full Book Synopsis & Description *
              </label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Complete book synopsis, curriculum details, and takeaways..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Digital Vault File Uploads */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Digital File Uploads</span>
            </h3>

            <div className="space-y-4">
              {/* PDF Upload */}
              <div className="p-4 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-blue-500 transition-colors">
                <label className="block cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                        eBook Digital File (PDF / EPUB)
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Uploaded directly to Supabase Private Storage (`ebooks` vault)
                      </p>
                      {initialData?.storage_path && (
                        <p className="text-[10px] font-mono text-emerald-600 mt-0.5">
                          Current vault path: {initialData.storage_path}
                        </p>
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.epub"
                    onChange={(e) => setEbookFile(e.target.files?.[0] || null)}
                    className="mt-3 text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </label>
              </div>

              {/* Cover Image Upload */}
              <div className="p-4 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-blue-500 transition-colors">
                <label className="block cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                        Custom Book Cover Image (Optional)
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        PNG, JPG, or WebP. If omitted, the default stylish 3D CSS gradient cover is rendered.
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                    className="mt-3 text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Specifications, & Publishing Controls */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Pricing & Discounts
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Selling Price ({siteConfig.currency.symbol}) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="499"
                className="w-full px-3.5 py-2.5 text-xs font-black rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 outline-none text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Original Price (for discount strikethrough)
              </label>
              <input
                type="number"
                step="0.01"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="1299"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Technical Specs Card */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Specifications
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                >
                  <option value="PDF">PDF</option>
                  <option value="EPUB">EPUB</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Page Count
                </label>
                <input
                  type="number"
                  value={pageCount}
                  onChange={(e) => setPageCount(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  File Size
                </label>
                <input
                  type="text"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Language
                </label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                ISBN
              </label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="978-0-13-597444-5"
                className="w-full p-2 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Badge / Tag (e.g. Bestseller)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Bestseller, Hot, Editor's Pick"
                className="w-full p-2 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </div>

          {/* Publishing Controls */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Visibility & Publishing
            </h3>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Published on Storefront
              </span>
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Featured on Homepage
              </span>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Mark as Bestseller
              </span>
              <input
                type="checkbox"
                checked={isBestseller}
                onChange={(e) => setIsBestseller(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
