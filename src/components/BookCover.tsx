"use client";

import React from "react";
import { Book } from "@/types";
import { BookCoverVisual } from "./BookCoverVisual";

interface BookCoverProps {
  book: Pick<Book, "slug" | "title" | "author" | "categoryName" | "coverGradient" | "format" | "badge">;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showBadge?: boolean;
}

export function BookCover({
  book,
  size = "md",
  className = "",
  showBadge = true,
}: BookCoverProps) {
  return (
    <BookCoverVisual
      slug={book.slug}
      book={book}
      size={size}
      className={className}
      showBadge={showBadge}
    />
  );
}
