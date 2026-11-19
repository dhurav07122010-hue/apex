import { createAdminClient } from "@/lib/supabase/admin";
import { Book } from "@/types";
import { MOCK_BOOKS } from "@/data/mock-books";
import { siteConfig } from "@/config/site";

// Category slug to readable name mapping fallback
const CATEGORY_NAMES: Record<string, string> = {
  "fiction-literature": "Fiction & Literature",
  "business-finance": "Business & Finance",
  "self-improvement": "Self Improvement",
  "education-learning": "Education & Learning",
  "technology": "Technology",
  "programming": "Programming",
  "competitive-exams": "Competitive Exams",
  "children-young-readers": "Children & Young Readers",
  "science": "Science",
  "arts-photography": "Arts & Photography",
};

export function mapDbProductToBook(row: any): Book {
  // If row matches an existing mock book, use its gradient and rich metadata as baseline
  const matchingMock = MOCK_BOOKS.find((b) => b.slug === row.slug || b.id === row.id);

  let coverGradient = matchingMock?.coverGradient || {
    from: "#0F2754",
    to: "#1E40AF",
    accent: "#3B82F6",
  };

  if (row.cover_gradient && typeof row.cover_gradient === "object") {
    coverGradient = row.cover_gradient;
  }

  const categoryName =
    CATEGORY_NAMES[row.category_id] ||
    matchingMock?.categoryName ||
    row.category_id?.replace(/-/g, " ") ||
    "General";

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle || matchingMock?.subtitle || "",
    author: row.author,
    authorBio: row.author_bio || matchingMock?.authorBio || "Distinguished author and specialist.",
    category: row.category_id,
    categoryName,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : matchingMock?.originalPrice,
    rating: row.rating ? Number(row.rating) : (matchingMock?.rating || 4.8),
    reviewCount: row.review_count ? Number(row.review_count) : (matchingMock?.reviewCount || 120),
    publishedYear: row.published_year ? Number(row.published_year) : (matchingMock?.publishedYear || 2024),
    pageCount: row.page_count ? Number(row.page_count) : (matchingMock?.pageCount || 280),
    fileSize: row.file_size || matchingMock?.fileSize || "12.5 MB",
    language: row.language || matchingMock?.language || "English",
    format: (row.format as any) || matchingMock?.format || "PDF",
    isbn: row.isbn || matchingMock?.isbn || "978-0-13-597444-5",
    coverGradient,
    coverImage: row.cover_image_url || matchingMock?.coverImage,
    badge: row.badge !== undefined && row.badge !== null ? row.badge : matchingMock?.badge,
    shortDescription: row.short_description || matchingMock?.shortDescription || "",
    description: row.description || matchingMock?.description || "",
    features: Array.isArray(row.features) && row.features.length > 0
      ? row.features
      : (matchingMock?.features || [
          "Complete digital access in DRM-free standard PDF format",
          "Comprehensive exercises, takeaways, and chapter summaries",
          "Permanent digital bookshelf access with re-download entitlement",
        ]),
    tableOfContents: Array.isArray(row.table_of_contents) && row.table_of_contents.length > 0
      ? row.table_of_contents
      : (matchingMock?.tableOfContents || [
          "Part 1: Foundational Frameworks & Core Principles",
          "Part 2: Tactical Execution & Real-World Application",
          "Part 3: Advanced Optimization & Future Strategies",
        ]),
    previewChapters: Array.isArray(row.preview_chapters) && row.preview_chapters.length > 0
      ? row.preview_chapters
      : (matchingMock?.previewChapters || [
          {
            title: "Chapter 1: The Architectural Blueprint",
            excerpt: "Mastering complex systems begins with understanding foundational mechanics...",
          },
        ]),
    isFeatured: Boolean(row.is_featured !== undefined ? row.is_featured : matchingMock?.isFeatured),
    isBestseller: Boolean(row.is_bestseller !== undefined ? row.is_bestseller : matchingMock?.isBestseller),
    samplePdfUrl: "/sample-apexbook.pdf",
  };
}

/**
 * Loads all active published products from Supabase database.
 * Falls back to mock books if database is unreachable, with database records taking full precedence.
 */
export async function getStorefrontBooks(): Promise<Book[]> {
  try {
    const adminDb = createAdminClient();
    const { data: dbProducts, error } = await adminDb
      .from("products")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (!error && dbProducts && dbProducts.length > 0) {
      const dbBooks = dbProducts.map(mapDbProductToBook);
      const dbSlugs = new Set(dbBooks.map((b) => b.slug));

      // Append any mock books that aren't yet in the database
      const nonOverriddenMocks = MOCK_BOOKS.filter((b) => !dbSlugs.has(b.slug));
      return [...dbBooks, ...nonOverriddenMocks];
    }
  } catch (err) {
    console.error("Error fetching storefront books from Supabase:", err);
  }

  return MOCK_BOOKS;
}

/**
 * Loads a single book by slug from Supabase, falling back to mock catalog.
 */
export async function getStorefrontBookBySlug(slug: string): Promise<Book | null> {
  try {
    const adminDb = createAdminClient();
    const { data: row, error } = await adminDb
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (!error && row) {
      return mapDbProductToBook(row);
    }
  } catch (err) {
    console.error(`Error fetching book slug "${slug}" from Supabase:`, err);
  }

  const mock = MOCK_BOOKS.find((b) => b.slug === slug);
  return mock || null;
}

/**
 * Loads store categories dynamically from Supabase database.
 */
export async function getStorefrontCategories(): Promise<any[]> {
  try {
    const adminDb = createAdminClient();
    const { data: rows, error } = await adminDb
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && rows && rows.length > 0) {
      return rows.map((r) => ({
        id: r.slug || r.id,
        name: r.name,
        slug: r.slug,
        description: r.description || "",
        imageUrl: r.image_url || null,
        iconName: r.icon_name || r.slug,
        bgColor: r.color?.includes("from-") ? "#EBF5FF" : (r.color || "#EBF5FF"),
        textColor: "#1E40AF",
      }));
    }
  } catch (err) {
    console.error("Error fetching categories from Supabase:", err);
  }

  return siteConfig.categories;
}
