import React from "react";
import { getStorefrontBooks, getStorefrontCategories } from "@/lib/storefront";
import { HomeClient } from "./HomeClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ApexBooks — Premium Digital eBooks & Masterclass Guides",
  description:
    "Explore our premium collection of eBooks and unlock a world of knowledge with instant digital access and secure payments.",
};

export default async function HomePage() {
  const [books, categories] = await Promise.all([
    getStorefrontBooks(),
    getStorefrontCategories(),
  ]);

  return <HomeClient initialBooks={books} initialCategories={categories} />;
}
