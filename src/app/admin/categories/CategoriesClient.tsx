"use client";

import React, { useState } from "react";
import { Plus, Image as ImageIcon, Trash2, Layers, CheckCircle2, AlertCircle, Upload, X } from "lucide-react";
import { addCategory, deleteCategory } from "./actions";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string | null;
  display_order: number;
}

interface CategoriesClientProps {
  initialCategories: Category[];
  initialProducts: { category_id: string }[];
}

export function CategoriesClient({
  initialCategories,
  initialProducts,
}: CategoriesClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  };

  const handleFileChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    if (imageUrl) formData.append("imageUrl", imageUrl);
    if (imageFile) formData.append("imageFile", imageFile);

    const res = await addCategory(formData);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(`Category "${name}" added successfully!`);
      // Optimistic update
      setCategories((prev) => [
        ...prev,
        {
          id: slug,
          name,
          slug,
          description,
          image_url: imagePreview || imageUrl || null,
          display_order: prev.length + 1,
        },
      ]);
      setName("");
      setSlug("");
      setDescription("");
      setImageUrl("");
      setImageFile(null);
      setImagePreview(null);
      setShowAddForm(false);
      setTimeout(() => setSuccess(null), 3000);
    }
    setLoading(false);
  };

  const handleDelete = async (catSlug: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    setDeletingSlug(catSlug);
    const res = await deleteCategory(catSlug);
    if (res.error) {
      alert(res.error);
    } else {
      setCategories((prev) => prev.filter((c) => c.slug !== catSlug));
    }
    setDeletingSlug(null);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
            Categories & Genres
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage catalogue genres and tracks ({categories.length} total categories).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showAddForm ? "Cancel" : "Add New Category"}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Category Form (Collapsible) */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-blue-200 dark:border-blue-900/60 shadow-md space-y-4 animate-in fade-in-50 duration-200"
        >
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Add New Store Category</span>
            </h3>
            <span className="text-[11px] text-zinc-400">Provide category name and image</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Science & Astrophysics"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Category URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="science-and-astrophysics"
                className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Short Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Books exploring quantum mechanics, space exploration, and cosmology..."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Image: File Upload OR Direct URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Upload Category Image (File)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                className="w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-950 dark:file:text-blue-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                <span>Or Image Web URL (Optional)</span>
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  if (!imageFile) setImagePreview(e.target.value);
                }}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Image Preview Box */}
          {(imagePreview || imageUrl) && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 w-fit">
              <img
                src={imagePreview || imageUrl}
                alt="Category Preview"
                className="w-16 h-12 object-cover rounded-lg border border-zinc-200 dark:border-zinc-800"
              />
              <div>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Image Preview</p>
                <p className="text-[10px] text-zinc-400">Ready to save with category</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Adding..." : "Add Category"}
            </button>
          </div>
        </form>
      )}

      {/* Categories Grid (with Image Thumbnails) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, idx) => {
          const count =
            initialProducts?.filter((p) => p.category_id === cat.slug).length || 0;

          return (
            <div
              key={cat.slug}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
            >
              {/* Category Image Header */}
              <div className="relative h-28 w-full bg-linear-to-r from-blue-900 to-indigo-950 flex items-center justify-center overflow-hidden">
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-white/70">
                    <Layers className="w-8 h-8 text-amber-400" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">
                      {cat.name}
                    </span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white shadow-xs">
                    {count} {count === 1 ? "book" : "books"}
                  </span>
                </div>
              </div>

              {/* Category Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] font-mono font-bold text-zinc-400">
                      #{idx + 1}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                    /{cat.slug}
                  </p>
                  {cat.description && (
                    <p className="text-xs text-zinc-500 mt-2 line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400">
                    Order: {cat.display_order}
                  </span>
                  <button
                    type="button"
                    disabled={deletingSlug === cat.slug}
                    onClick={() => handleDelete(cat.slug, cat.name)}
                    className="text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer"
                    title={`Delete ${cat.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
