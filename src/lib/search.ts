import { Book } from "@/types";

export interface SearchMatchResult<T> {
  item: T;
  score: number;
}

/**
 * Relative Fuzzy & Substring Search Matcher
 *
 * Requirements satisfied:
 * 1. "type 'm' -> any book that contains that letter appears"
 * 2. "always relative not absolute: '5 html ways' appears if user types 'html', or 'html, 5 html ways'"
 * 3. Tokenizes query by spaces, commas, and punctuation so multiple keywords match relatively.
 * 4. Ranks results by relevance:
 *    - Full exact substring match in title (Highest)
 *    - Full exact substring match anywhere
 *    - Token matches in title / author
 *    - Relative partial token matches in category or description
 */
export function matchBookRelative(
  book: {
    title: string;
    subtitle?: string;
    author: string;
    category?: string;
    categoryName?: string;
    shortDescription?: string;
    description?: string;
    isbn?: string;
  },
  searchQuery: string
): { matches: boolean; score: number } {
  if (!searchQuery || !searchQuery.trim()) {
    return { matches: true, score: 1 };
  }

  const query = searchQuery.toLowerCase().trim();
  const titleLower = (book.title || "").toLowerCase();
  const authorLower = (book.author || "").toLowerCase();
  const catLower = (book.categoryName || book.category || "").toLowerCase();
  const subLower = (book.subtitle || "").toLowerCase();
  const descLower = (book.shortDescription || book.description || "").toLowerCase();
  const isbnLower = (book.isbn || "").toLowerCase();

  const searchableText = `${titleLower} ${subLower} ${authorLower} ${catLower} ${descLower} ${isbnLower}`;

  // 1. Direct exact phrase match (highest score)
  if (searchableText.includes(query)) {
    let score = 50;
    if (titleLower.startsWith(query)) score += 100;
    else if (titleLower.includes(query)) score += 70;
    if (authorLower.includes(query)) score += 40;
    return { matches: true, score };
  }

  // 2. Tokenized relative matching:
  // Split on commas, spaces, plus, pipes, dashes, and periods
  const tokens = query
    .split(/[\s,+/|&_\-]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  if (tokens.length === 0) {
    return { matches: true, score: 1 };
  }

  let matchedTokenCount = 0;
  let score = 0;

  for (const token of tokens) {
    let tokenMatched = false;

    if (titleLower.includes(token)) {
      score += 30;
      tokenMatched = true;
    }
    if (subLower.includes(token)) {
      score += 15;
      tokenMatched = true;
    }
    if (authorLower.includes(token)) {
      score += 20;
      tokenMatched = true;
    }
    if (catLower.includes(token)) {
      score += 15;
      tokenMatched = true;
    }
    if (descLower.includes(token)) {
      score += 10;
      tokenMatched = true;
    }
    if (isbnLower.includes(token)) {
      score += 10;
      tokenMatched = true;
    }

    if (tokenMatched) {
      matchedTokenCount++;
    }
  }

  // If ANY token matched, this is a valid relative match!
  if (matchedTokenCount > 0) {
    // Bonus for matching more tokens
    score += (matchedTokenCount / tokens.length) * 40;
    return { matches: true, score };
  }

  return { matches: false, score: 0 };
}

/**
 * Filter and rank books using relative matching
 */
export function filterBooksRelative(books: Book[], query: string): Book[] {
  if (!query || !query.trim()) return books;

  const results: SearchMatchResult<Book>[] = [];

  for (const book of books) {
    const { matches, score } = matchBookRelative(book, query);
    if (matches) {
      results.push({ item: book, score });
    }
  }

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);

  return results.map((r) => r.item);
}
