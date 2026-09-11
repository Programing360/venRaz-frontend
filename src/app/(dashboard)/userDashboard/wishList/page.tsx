"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2, Heart, Zap, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

interface WishlistProduct {
  _id: string;
  name: string;
  images?: string[];
  price: number;
  discount?: number;
  flashSalePrice?: number;
  isFlashSale?: boolean;
  stock?: number;
  brand?: string;
}

const getAuthHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export default function WishlistPage() {
  const { data: session } = useSession();
  const token = session?.session?.token;
  const { addToCart } = useCart();
  const { success, error } = useToast();

  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const loadWishlist = useCallback(async () => {
    if (!token) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) {
        throw new Error("API URL is not configured");
      }

      const res = await fetch(`${API_URL}/wishlist`, {
        headers: getAuthHeaders(token),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to load wishlist: ${res.status}`);
      }

      const json = await res.json();
      const products = Array.isArray(json?.data?.productIds)
        ? json.data.productIds
        : [];

      setWishlist(products);
    } catch (err) {
      console.error("Wishlist loading failed:", err);
      error("Could not load your wishlist. Please try again.", "Error");
    } finally {
      setLoading(false);
    }
  }, [token, error]);

  useEffect(() => {
    if (token) {
      setLoading(true);
      loadWishlist();
    } else {
      setLoading(false);
    }
  }, [token, loadWishlist]);

  const handleRemove = async (productId: string) => {
    if (!token || removingId) return;

    const previous = wishlist;
    setRemovingId(productId);
    setWishlist((prev) => prev.filter((item) => item._id !== productId));

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) {
        throw new Error("API URL is not configured");
      }

      const res = await fetch(`${API_URL}/wishlist/${productId}`, {
        method: "DELETE",
        headers: getAuthHeaders(token),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to remove item: ${res.status}`);
      }

      success("Item removed from your wishlist.", "Wishlist Updated");
    } catch (err) {
      console.error("Wishlist remove failed:", err);
      setWishlist(previous);
      error("Could not remove the item. Please try again.", "Error");
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = (product: WishlistProduct) => {
    addToCart(
      {
        _id: product._id,
        name: product.name,
        price: product.price,
        flashSalePrice: product.flashSalePrice,
        discount: product.discount,
        stock: product.stock,
        images: product.images,
        brand: product.brand,
      },
      1,
    );
  };

  const finalPrice = (product: WishlistProduct): number => {
    if (product.isFlashSale && typeof product.flashSalePrice === "number") {
      return product.flashSalePrice;
    }
    return product.price;
  };

  const inStock = (product: WishlistProduct): boolean =>
    typeof product.stock === "number" ? product.stock > 0 : true;

  return (
    <div className="min-h-screen space-y-8 bg-background">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Heart className="h-3.5 w-3.5 fill-current" />
            YOUR FAVORITES
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            My Wishlist
            <span className="ml-2 text-primary">.</span>
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            The stuff you&apos;re going to love.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          {loading ? "..." : `${wishlist.length} saved items`}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-muted/30 p-16 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-semibold">Loading your wishlist...</p>
        </div>
      )}

      {/* Products */}
      {!loading && wishlist.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {wishlist.map((item) => {
            const price = finalPrice(item);
            const hasDiscount =
              typeof item.discount === "number" && item.discount > 0;
            const available = inStock(item);

            return (
              <div
                key={item._id}
                className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="relative p-4">
                  {/* Image */}
                  <Link
                    href={`/products/${item._id}`}
                    className="relative mb-4 block flex h-44 items-center justify-center overflow-hidden rounded-xl bg-muted"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

                    {item.images?.[0] ? (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <span className="text-xs font-medium text-muted-foreground transition-transform duration-500 group-hover:scale-110">
                        Product Image
                      </span>
                    )}

                    {/* Remove */}
                    <button
                      type="button"
                      aria-label="Remove from wishlist"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        void handleRemove(item._id);
                      }}
                      disabled={removingId === item._id}
                      className="absolute right-3 top-3 z-10 rounded-full border bg-background/80 p-2 backdrop-blur transition-all hover:scale-110 hover:bg-rose-500 hover:text-white disabled:opacity-50"
                    >
                      {removingId === item._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Heart className="h-4 w-4 fill-rose-500 text-rose-500 hover:fill-white hover:text-white" />
                      )}
                    </button>

                    {/* Stock Badge */}
                    <div className="absolute left-3 top-3">
                      {available ? (
                        <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg shadow-emerald-500/20">
                          In Stock
                        </span>
                      ) : (
                        <span className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
                          Sold Out
                        </span>
                      )}
                    </div>

                    {/* Discount Badge */}
                    {hasDiscount && (
                      <span className="absolute bottom-3 left-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                        -{item.discount}% OFF
                      </span>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      {item.brand || "VenRaz"}
                    </p>

                    <Link
                      href={`/products/${item._id}`}
                      className="block"
                    >
                      <h3 className="text-lg font-bold tracking-tight transition-colors group-hover:text-primary">
                        {item.name}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-black text-primary">
                          ${price.toFixed(2)}
                        </p>
                        {hasDiscount && (
                          <p className="text-xs text-muted-foreground line-through">
                            ${item.price.toFixed(2)}
                          </p>
                        )}
                      </div>

                      <span className="text-xs font-medium text-muted-foreground">
                        Free shipping
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      disabled={!available}
                      onClick={() => handleAddToCart(item)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {available ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && wishlist.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border bg-muted/30 p-16 text-center">
          <Heart className="h-10 w-10 text-muted-foreground/50" />
          <p className="text-base font-bold">Your wishlist is empty.</p>
          <p className="text-sm text-muted-foreground">
            Got your eye on something? Save it here and it will show up below.
          </p>

          <Link
            href="/shop"
            className="mt-4 rounded-xl bg-foreground px-5 py-2.5 text-xs font-bold text-background transition-all hover:scale-105"
          >
            Continue Shopping →
          </Link>
        </div>
      )}
    </div>
  );
}