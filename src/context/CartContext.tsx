"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Book, CartItem } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book, redirectUrl?: string) => boolean;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (bookId: string) => boolean;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toggleCart: () => void;
  user: any;
  isAuthenticated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "apexbooks_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Monitor Supabase Auth state
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const sanitized: CartItem[] = parsed
            .map((item: any) => {
              if (item && item.book && typeof item.book === "object" && item.book.id) {
                return {
                  book: item.book,
                  quantity: typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1,
                };
              }
              // Handle flat/legacy cart items
              if (item && item.id && typeof item.id === "string") {
                return {
                  book: item,
                  quantity: typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1,
                };
              }
              return null;
            })
            .filter((i): i is CartItem => i !== null);
          setCart(sanitized);
        }
      }
    } catch {
      // Ignore localStorage errors
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore localStorage write errors
    }
  }, [cart, isHydrated]);

  const addToCart = (book: Book, redirectUrl?: string): boolean => {
    if (!book || !book.id) return false;

    // Strict Enforcement: User must be signed in before adding items to cart
    if (!user) {
      const currentPath =
        redirectUrl ||
        (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/books");
      const signinUrl = `/auth/signin?redirect=${encodeURIComponent(
        currentPath
      )}&message=${encodeURIComponent("Please sign in first to add eBooks to your cart.")}`;

      if (typeof window !== "undefined") {
        window.location.href = signinUrl;
      }
      return false;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item?.book?.id === book.id);
      if (existing) {
        return prev;
      }
      return [...prev, { book, quantity: 1 }];
    });
    setIsCartOpen(true);
    return true;
  };

  const removeFromCart = (bookId: string) => {
    setCart((prev) => prev.filter((item) => item?.book?.id !== bookId));
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item?.book?.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (bookId: string) => {
    return cart.some((item) => item?.book?.id === bookId);
  };

  const totalItems = cart.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  const subtotal = cart.reduce((sum, item) => sum + (item?.book?.price || 0) * (item?.quantity || 1), 0);

  const toggleCart = () => setIsCartOpen((prev) => !prev);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        toggleCart,
        user,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
