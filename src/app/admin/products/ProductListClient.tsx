"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  ExternalLink,
  Plus,
  BookOpen,
  Search,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { toggleProductPublish, deleteProduct } from "./actions";

interface ProductListClientProps {
  initialProducts: any[];
}

export function ProductListClient({ initialProducts }: ProductListClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filtered = products.filter(
    (p) =>
      (p.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (p.author?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (p.category_id?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setActionLoading(id);
    const res = await toggleProductPublish(id, currentStatus);
    if (res.success) {
      setProducts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_published: !currentStatus } : item))
      );
    } else {
      alert(res.error || "Failed to update publish state");
    }
    setActionLoading(null);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setActionLoading(id);
    const res = await deleteProduct(id);
    if (res.success) {
      setProducts((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert(res.error || "Failed to delete product");
    }
    setActionLoading(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
            Products
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage catalogue titles, digital storage vaults, and publishing states.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by title, author, or category..."
          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 outline-none focus:border-blue-500"
        />
      </div>

      {/* Mobile Product Cards View (Visible on screens < 768px) */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 text-center text-zinc-400 text-xs">
            No eBooks match your filter.
          </div>
        ) : (
          filtered.map((book) => (
            <div
              key={book.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 capitalize truncate max-w-[180px]">
                  {book.category_id}
                </span>

                <button
                  type="button"
                  disabled={actionLoading === book.id}
                  onClick={() => handleTogglePublish(book.id, book.is_published)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer shrink-0 ${
                    book.is_published
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800"
                  }`}
                >
                  {book.is_published ? "Published" : "Draft"}
                </button>
              </div>

              <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">By {book.author}</p>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <span className="font-mono text-zinc-400 text-[11px] block">
                    {book.format} • {book.file_size || "Digital"}
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-black text-sm text-zinc-900 dark:text-zinc-100">
                      {siteConfig.currency.symbol}{book.price}
                    </span>
                    {book.original_price && (
                      <span className="text-[10px] text-zinc-400 line-through">
                        {siteConfig.currency.symbol}{book.original_price}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/books/${book.slug}`}
                    target="_blank"
                    className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:text-blue-600 bg-zinc-100 dark:bg-zinc-800 transition-colors"
                    title="View"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <Link
                    href={`/admin/products/${book.id}/edit`}
                    className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:text-blue-600 bg-zinc-100 dark:bg-zinc-800 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    disabled={actionLoading === book.id}
                    onClick={() => handleDelete(book.id, book.title)}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 bg-zinc-100 dark:bg-zinc-800 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Products Table (Visible on screens >= 768px) */}
      <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">eBook Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Format</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Private Vault</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400">
                    No eBooks found.
                  </td>
                </tr>
              ) : (
                filtered.map((book) => (
                  <tr
                    key={book.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-950/50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 max-w-xs">
                        {book.title}
                      </div>
                      <div className="text-[11px] text-zinc-400">By {book.author}</div>
                    </td>

                    <td className="py-3.5 px-4 capitalize">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {book.category_id}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-zinc-500">
                      {book.format} • {book.file_size}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-black text-zinc-900 dark:text-zinc-100">
                        {siteConfig.currency.symbol}{book.price}
                      </span>
                      {book.original_price && (
                        <span className="ml-1.5 text-[11px] text-zinc-400 line-through">
                          {siteConfig.currency.symbol}{book.original_price}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {book.storage_path ? (
                        <span className="text-[11px] text-emerald-600 font-mono font-medium truncate max-w-[120px] block">
                          ✓ Protected
                        </span>
                      ) : (
                        <span className="text-[11px] text-zinc-400 italic">No PDF uploaded</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        disabled={actionLoading === book.id}
                        onClick={() => handleTogglePublish(book.id, book.is_published)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          book.is_published
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800"
                        }`}
                      >
                        {book.is_published ? "Published" : "Draft"}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/books/${book.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <Link
                          href={`/admin/products/${book.id}/edit`}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          title="Edit Details"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          disabled={actionLoading === book.id}
                          onClick={() => handleDelete(book.id, book.title)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
