"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "./ToastContext";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image: string;
  quantity: number;
  stock?: number;
  brand?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, type: "increase" | "decrease") => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shipping: number;
  discountAmount: number;
  total: number;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "venraz_cart_items";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { success, info } = useToast();

  // Load cart from LocalStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to LocalStorage on update
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [items, isLoaded]);

  const addToCart = useCallback(
    (product: any, quantity: number = 1) => {
      const productId = String(product._id || product.id);
      const name = product.name || "Product";
      const price = Number(product.flashSalePrice || product.price || 0);
      const image =
        product.images?.[0] || product.image || "/default-product.jpg";
      const brand = product.brand || "";
      const stock = typeof product.stock === "number" ? product.stock : 99;

      setItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === productId);
        if (existingIndex > -1) {
          const updated = [...prev];
          const newQty = Math.min(updated[existingIndex].quantity + quantity, stock);
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              id: productId,
              name,
              price,
              discount: product.discount,
              image,
              quantity: Math.min(quantity, stock),
              stock,
              brand,
            },
          ];
        }
      });

      success(`Added "${name}" to your shopping cart!`, "Added to Cart");
    },
    [success]
  );

  const removeFromCart = useCallback(
    (id: string) => {
      setItems((prev) => {
        const itemToRemove = prev.find((item) => item.id === id);
        if (itemToRemove) {
          info(`Removed "${itemToRemove.name}" from cart.`, "Cart Updated");
        }
        return prev.filter((item) => item.id !== id);
      });
    },
    [info]
  );

  const updateQuantity = useCallback(
    (id: string, type: "increase" | "decrease") => {
      setItems((prev) =>
        prev
          .map((item) => {
            if (item.id === id) {
              const maxStock = item.stock || 99;
              if (type === "increase") {
                const newQty = Math.min(item.quantity + 1, maxStock);
                return { ...item, quantity: newQty };
              } else {
                const newQty = Math.max(item.quantity - 1, 1);
                return { ...item, quantity: newQty };
              }
            }
            return item;
          })
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const shipping = useMemo(() => {
    if (items.length === 0) return 0;
    return subtotal > 100 ? 0 : 15; // Free shipping over $100
  }, [items.length, subtotal]);

  const discountAmount = useMemo(() => {
    return 0; // Can be enhanced with coupon codes
  }, []);

  const total = useMemo(() => {
    return Math.max(0, subtotal + shipping - discountAmount);
  }, [subtotal, shipping, discountAmount]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shipping,
        discountAmount,
        total,
        isLoaded,
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
