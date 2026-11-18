import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MOCK_BOOKS } from "@/data/mock-books";
import { BookDetailClient } from "./BookDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = MOCK_BOOKS.find((b) => b.slug === slug);
  if (!book) {
    return {
      title: "Book Not Found",
    };
  }

  return {
    title: `${book.title} — eBook by ${book.author}`,
    description: book.shortDescription,
  };
}

export async function generateStaticParams() {
  return MOCK_BOOKS.map((book) => ({
    slug: book.slug,
  }));
}

export default async function BookDetailPage({ params }: Props) {
  const { slug } = await params;
  const book = MOCK_BOOKS.find((b) => b.slug === slug);

  if (!book) {
    notFound();
  }

  const relatedBooks = MOCK_BOOKS.filter(
    (b) => b.category === book.category && b.id !== book.id
  ).slice(0, 3);

  return <BookDetailClient book={book} relatedBooks={relatedBooks} />;
}
