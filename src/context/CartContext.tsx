"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useSession } from "@/lib/auth-client";
import { useToast } from "./ToastContext";

export interface CartItem {
  id: string; // Product ID
  name: string;
  price: number;
  discount?: number;
  image: string;
  quantity: number;
  stock?: number;
  brand?: string;
}

export interface ProductInput {
  _id?: string;
  id?: string;
  name?: string;
  price?: number;
  flashSalePrice?: number;
  discount?: number;
  image?: string;
  images?: string[];
  brand?: string;
  stock?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: ProductInput, quantity?: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, type: "increase" | "decrease") => Promise<void>;
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

const mergeCartItems = (
  serverItems: CartItem[],
  guestItems: CartItem[],
): CartItem[] => {
  const merged = [...serverItems];
  for (const guest of guestItems) {
    const existing = merged.find((item) => item.id === guest.id);
    if (existing) {
      const maxStock = existing.stock ?? guest.stock ?? 99;
      merged[merged.indexOf(existing)] = {
        ...existing,
        quantity: Math.min(existing.quantity + guest.quantity, maxStock),
      };
    } else {
      merged.push(guest);
    }
  }
  return merged;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { data: session } = useSession(); // Authenticated user check
  const { success, info } = useToast();

  const isAuthenticated = !!session?.user;

  // Tracks whether the current items came from a successful server fetch.
  // Only persist to localStorage when the cart is NOT sourced from the server,
  // so a reachable backend stays the source of truth and offline carts survive reloads.
  const fromServerRef = useRef(false);

  // Helper function to build headers
  const getAuthHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    return headers;
  }, []);

  // 1. Fetch Cart from Backend or LocalStorage
  const loadCart = useCallback(async () => {
    try {
      if (isAuthenticated) {
        // Logged-in User: Fetch from API
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
          headers: getAuthHeaders(),
          credentials: "include", // Cookie/Session পাঠানোর জন্য
        });

        if (res.ok) {
          const responseData = await res.json();
          const serverItems =
            responseData?.data?.items || responseData?.data || [];

          // Map backend schema to frontend CartItem standard
          const formattedItems: CartItem[] = serverItems.map(
            (raw: unknown): CartItem => {
              const item = raw as Record<string, unknown>;
              const product =
                typeof item.productId === "object" && item.productId !== null
                  ? (item.productId as Record<string, unknown>)
                  : {};
              const images = product.images;
              const firstImage = Array.isArray(images) ? images[0] : undefined;
              return {
                id: String(
                  product._id ?? product.id ?? item.productId ?? item.id ?? "",
                ),
                name: String(product.name ?? item.name ?? "Product"),
                price: Number(
                  product.flashSalePrice ?? product.price ?? item.price ?? 0,
                ),
                image: String(
                  firstImage ??
                    product.image ??
                    item.image ??
                    "/placeholder.svg",
                ),
                quantity: Number(item.quantity ?? 1),
                stock: Number(product.stock ?? item.stock ?? 99),
                brand: String(product.brand ?? item.brand ?? ""),
              };
            },
          );

          // Local storage cart synchronization on login
          const localSaved = localStorage.getItem(CART_STORAGE_KEY);
          const guestItems: CartItem[] = localSaved
            ? JSON.parse(localSaved)
            : [];
          if (guestItems.length > 0) {
            try {
              for (const guestItem of guestItems) {
                const syncRes = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/cart`,
                  {
                    method: "POST",
                    headers: getAuthHeaders(),
                    credentials: "include",
                    body: JSON.stringify({
                      productId: guestItem.id,
                      quantity: guestItem.quantity,
                    }),
                  },
                );
                if (!syncRes.ok) throw new Error("Guest cart sync failed");
              }
              localStorage.removeItem(CART_STORAGE_KEY);
              fromServerRef.current = true;
              setItems(mergeCartItems(formattedItems, guestItems));
            } catch {
              fromServerRef.current = false;
              setItems(guestItems);
            }
          } else {
            fromServerRef.current = true;
            setItems(formattedItems);
          }
        } else {
          // Server cart unavailable (unauthenticated by backend, offline, etc.)
          // Fall back to the local/guest cart so the user keeps their items.
          fromServerRef.current = false;
          const saved = localStorage.getItem(CART_STORAGE_KEY);
          if (saved) {
            setItems(JSON.parse(saved));
          } else {
            setItems([]);
          }
        }
      } else {
        // Guest User: Fetch from LocalStorage
        fromServerRef.current = false;
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
          setItems(JSON.parse(saved));
        } else {
          setItems([]);
        }
      }
    } catch (err) {
      console.error("Cart loading failed:", err);
      fromServerRef.current = false;
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } finally {
      setIsLoaded(true);
    }
  }, [isAuthenticated, getAuthHeaders]);

  useEffect(() => {
    let cancelled = false;

    async function initializeCart() {
      if (!cancelled) {
        await loadCart();
      }
    }

    initializeCart();

    return () => {
      cancelled = true;
    };
  }, [loadCart]);

  // Save to LocalStorage when the cart is not sourced from the server,
  // so offline/fallback carts survive page reloads for all users.
  useEffect(() => {
    if (isLoaded && !fromServerRef.current) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  // Shared local (guest-style) add logic, used by both guests and as a
  // fallback when the backend cart API is unavailable.
  const applyLocalAdd = useCallback((item: CartItem, addedQty: number) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(
          updated[existingIndex].quantity + addedQty,
          item.stock ?? 99,
        );
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      }
      return [...prev, item];
    });
  }, []);

  // 2. Add To Cart
  const addToCart = useCallback(
    async (product: ProductInput, quantity: number = 1) => {
      const productId = String(product._id || product.id);
      const name = product.name || "Product";
      const price = Number(product.flashSalePrice || product.price || 0);
      const image = product.images?.[0] || product.image || "/placeholder.svg";
      const brand = product.brand || "";
      const stock = typeof product.stock === "number" ? product.stock : 99;

      const localItem: CartItem = {
        id: productId,
        name,
        price,
        discount: product.discount,
        image,
        quantity: Math.min(quantity, stock),
        stock,
        brand,
      };

      let syncedToServer = false;

      if (isAuthenticated) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
            method: "POST",
            headers: getAuthHeaders(),
            credentials: "include",
            body: JSON.stringify({ productId, quantity }),
          });
          if (res.ok) {
            syncedToServer = true;
            await loadCart(); // Refetch database items
          }
        } catch {
          // Fall through to local fallback below
        }
      }

      if (isAuthenticated && !syncedToServer) {
        fromServerRef.current = false;
        applyLocalAdd(localItem, quantity);
        info("Account sync unavailable — item saved to this device.", "Cart");
      } else if (!isAuthenticated) {
        applyLocalAdd(localItem, quantity);
      }

      success(`Added "${name}" to your shopping cart!`, "Added to Cart");
    },
    [isAuthenticated, loadCart, getAuthHeaders, applyLocalAdd, success, info],
  );

  // 3. Remove From Cart
  const removeFromCart = useCallback(
    async (id: string) => {
      const itemToRemove = items.find((item) => item.id === id);

      if (isAuthenticated) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/cart/${id}`,
            {
              method: "DELETE",
              headers: getAuthHeaders(),
              credentials: "include",
            },
          );

          if (res.ok) {
            await loadCart();
          } else {
            fromServerRef.current = false;
            setItems((prev) => prev.filter((item) => item.id !== id));
          }
        } catch {
          fromServerRef.current = false;
          setItems((prev) => prev.filter((item) => item.id !== id));
        }
      } else {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }

      if (itemToRemove) {
        info(`Removed "${itemToRemove.name}" from cart.`, "Cart Updated");
      }
    },
    [isAuthenticated, items, loadCart, getAuthHeaders, info],
  );

  // 4. Update Quantity
  const updateQuantity = useCallback(
    async (id: string, type: "increase" | "decrease") => {
      const targetItem = items.find((item) => item.id === id);
      if (!targetItem) return;

      const maxStock = targetItem.stock || 99;
      const newQuantity =
        type === "increase"
          ? Math.min(targetItem.quantity + 1, maxStock)
          : Math.max(targetItem.quantity - 1, 1);

      if (targetItem.quantity === newQuantity) return;

      const applyLocalUpdate = () =>
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item,
          ),
        );

      if (isAuthenticated) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/cart/${id}`,
            {
              method: "PATCH",
              headers: getAuthHeaders(),
              credentials: "include",
              body: JSON.stringify({ quantity: newQuantity }),
            },
          );

          if (res.ok) {
            await loadCart();
          } else {
            fromServerRef.current = false;
            applyLocalUpdate();
          }
        } catch {
          fromServerRef.current = false;
          applyLocalUpdate();
        }
      } else {
        applyLocalUpdate();
      }
    },
    [isAuthenticated, items, loadCart, getAuthHeaders],
  );

  // 5. Clear Cart
  const clearCart = useCallback(() => {
    setItems([]);
    if (!isAuthenticated) {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [isAuthenticated]);

  // Calculations
  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const shipping = useMemo(() => {
    if (items.length === 0) return 0;
    return subtotal > 100 ? 0 : 15;
  }, [items.length, subtotal]);

  const discountAmount = useMemo(() => 0, []);

  const total = useMemo(
    () => Math.max(0, subtotal + shipping - discountAmount),
    [subtotal, shipping, discountAmount],
  );

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
