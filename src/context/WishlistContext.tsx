"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Book } from "@/types";

interface WishlistContextType {
  wishlist: Book[];
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: string) => void;
  toggleWishlist: (book: Book) => void;
  isInWishlist: (bookId: string) => boolean;
  totalWishlistItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "apexbooks_wishlist_v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Book[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const sanitized = parsed.filter((b: any) => b && typeof b === "object" && typeof b.id === "string");
          setWishlist(sanitized);
        }
      }
    } catch {
      // Ignore localStorage read errors
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // Ignore localStorage write errors
    }
  }, [wishlist, isHydrated]);

  const addToWishlist = (book: Book) => {
    if (!book || !book.id) return;
    setWishlist((prev) => {
      if (prev.some((b) => b?.id === book.id)) return prev;
      return [...prev, book];
    });
  };

  const removeFromWishlist = (bookId: string) => {
    setWishlist((prev) => prev.filter((b) => b?.id !== bookId));
  };

  const toggleWishlist = (book: Book) => {
    if (!book || !book.id) return;
    setWishlist((prev) => {
      const exists = prev.some((b) => b?.id === book.id);
      if (exists) {
        return prev.filter((b) => b?.id !== book.id);
      } else {
        return [...prev, book];
      }
    });
  };

  const isInWishlist = (bookId: string) => {
    return wishlist.some((b) => b?.id === bookId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        totalWishlistItems: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
