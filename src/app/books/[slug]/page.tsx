import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getStorefrontBookBySlug, getStorefrontBooks } from "@/lib/storefront";
import { BookDetailClient } from "./BookDetailClient";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = await getStorefrontBookBySlug(slug);
  if (!book) {
    return {
      title: "Book Not Found — ApexBooks",
    };
  }

  return {
    title: `${book.title} — eBook by ${book.author}`,
    description: book.shortDescription,
  };
}

export default async function BookDetailPage({ params }: Props) {
  const { slug } = await params;
  const book = await getStorefrontBookBySlug(slug);

  if (!book) {
    notFound();
  }

  const allBooks = await getStorefrontBooks();
  const relatedBooks = allBooks
    .filter((b) => b.category === book.category && b.id !== book.id)
    .slice(0, 3);

  return <BookDetailClient book={book} relatedBooks={relatedBooks} />;
}
