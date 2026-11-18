import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { Layers, Plus, BookOpen } from "lucide-react";

export const metadata = {
  title: "Categories — Admin Portal",
};

export default async function AdminCategoriesPage() {
  const adminDb = createAdminClient();
  const [{ data: categories }, { data: products }] = await Promise.all([
    adminDb.from("categories").select("*").order("display_order", { ascending: true }),
    adminDb.from("products").select("category_id"),
  ]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
            Categories & Genres
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            10 primary knowledge tracks configured for {categories?.length || 10} categories.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3.5 px-4 w-12 text-center">#</th>
              <th className="py-3.5 px-4">Category Name</th>
              <th className="py-3.5 px-4">Slug</th>
              <th className="py-3.5 px-4">Description</th>
              <th className="py-3.5 px-4 text-center">Active eBooks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {categories?.map((cat, idx) => {
              const count = products?.filter((p) => p.category_id === cat.slug).length || 0;
              return (
                <tr key={cat.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/50">
                  <td className="py-3.5 px-4 text-center font-mono text-zinc-400 font-bold">
                    {idx + 1}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                    {cat.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-500">{cat.slug}</td>
                  <td className="py-3.5 px-4 text-zinc-500 max-w-sm truncate">
                    {cat.description}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {count} titles
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
