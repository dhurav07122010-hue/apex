export type BookFormat = "PDF" | "EPUB" | "MOBI";

export interface PreviewChapter {
  title: string;
  excerpt: string;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  authorBio: string;
  category: string; // matches CategoryConfig.slug
  categoryName: string;
  price: number; // in INR
  originalPrice?: number; // for discount display
  rating: number; // e.g. 4.8
  reviewCount: number;
  publishedYear: number;
  pageCount: number;
  fileSize: string;
  language: string;
  format: BookFormat;
  isbn: string;
  coverGradient: {
    from: string;
    to: string;
    accent: string;
  };
  coverImage?: string;
  badge?: string; // e.g. "Bestseller", "New", "Editor's Pick"
  shortDescription: string;
  description: string;
  features: string[];
  tableOfContents: string[];
  previewChapters: PreviewChapter[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  samplePdfUrl?: string; // publicly previewable sample
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  priceRange: "all" | "free" | "under-200" | "200-500" | "above-500";
  minRating: number;
  format: "all" | BookFormat;
  sortBy: "popular" | "price-asc" | "price-desc" | "rating" | "newest";
}
