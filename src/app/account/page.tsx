import React from "react";
import { createClient } from "@/lib/supabase/server";
import { MOCK_BOOKS } from "@/data/mock-books";
import { AccountDashboardClient } from "./AccountDashboardClient";

export const metadata = {
  title: "My Account & Library — ApexBooks",
  description: "View your purchased eBooks, read online, and manage your ApexBooks library.",
};

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Selected books matching reference image: Atomic Habits, Deep Work, Ikigai, Think Like a Monk
  const librarySlugs = ["atomic-habits", "deep-work", "ikigai", "think-like-a-monk"];
  const libraryBooks = librarySlugs
    .map((slug) => MOCK_BOOKS.find((b) => b.slug === slug))
    .filter(Boolean) as typeof MOCK_BOOKS;

  return (
    <AccountDashboardClient
      initialUser={user || { email: "reader@apexbooks.in", full_name: "Happy Reader" }}
      initialBooks={libraryBooks}
    />
  );
}
