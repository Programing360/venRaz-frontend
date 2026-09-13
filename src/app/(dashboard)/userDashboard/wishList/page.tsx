"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  Zap,
  Loader2,
  ArrowUpRight,
  PackageX,
} from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const loadWishlist = useCallback(async () => {
    if (!token) {
      setWishlist([]);
      return;
    }

    setLoading(true);

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
    if (!token) {
      const timeoutId = window.setTimeout(() => {
        setWishlist([]);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    const timeoutId = window.setTimeout(() => {
      void loadWishlist();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [token, loadWishlist]);

  const handleRemove = async (productId: string) => {
    if (!token || removingId) return;

    const previous = wishlist;

    setRemovingId(productId);

    // Optimistic update
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

    success("Item added to your cart.", "Added to Cart");
  };

  const finalPrice = (product: WishlistProduct): number => {
    if (
      product.isFlashSale &&
      typeof product.flashSalePrice === "number"
    ) {
      return product.flashSalePrice;
    }

    return product.price;
  };

  const inStock = (product: WishlistProduct): boolean =>
    typeof product.stock === "number" ? product.stock > 0 : true;

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              <Heart className="h-4 w-4" />
              Saved Products
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              My Wishlist
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Products you&apos;ve saved for later.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-600">
            <Heart className="h-4 w-4 text-slate-500" />

            {loading
              ? "Loading..."
              : `${wishlist.length} ${
                  wishlist.length === 1 ? "saved item" : "saved items"
                }`}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-20 shadow-sm">
            <Loader2 className="h-7 w-7 animate-spin text-slate-400" />

            <p className="mt-3 text-sm text-slate-500">
              Loading your wishlist...
            </p>
          </div>
        )}

        {/* Products */}
        {!loading && wishlist.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((item) => {
              const price = finalPrice(item);
              const available = inStock(item);

              const hasDiscount =
                typeof item.discount === "number" && item.discount > 0;

              const hasFlashSale =
                item.isFlashSale &&
                typeof item.flashSalePrice === "number";

              return (
                <article
                  key={item._id}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md"
                >
                  {/* Product Image */}
                  <div className="relative">
                    <Link
                      href={`/products/${item._id}`}
                      className="relative block h-64 overflow-hidden bg-slate-50"
                    >
                      {item.images?.[0] ? (
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <PackageX className="h-10 w-10 text-slate-300" />
                        </div>
                      )}

                      {/* Stock */}
                      <div className="absolute left-3 top-3">
                        {available ? (
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                            Sold Out
                          </span>
                        )}
                      </div>

                      {/* Discount */}
                      {hasDiscount && (
                        <span className="absolute bottom-3 left-3 rounded-md bg-slate-900 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                          -{item.discount}% OFF
                        </span>
                      )}

                      {/* Flash Sale */}
                      {hasFlashSale && (
                        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md border border-amber-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 shadow-sm">
                          <Zap className="h-3 w-3 fill-current" />
                          Flash Sale
                        </span>
                      )}
                    </Link>

                    {/* Remove Button */}
                    <button
                      type="button"
                      aria-label="Remove from wishlist"
                      onClick={() => void handleRemove(item._id)}
                      disabled={removingId === item._id}
                      className="absolute right-3 bottom-3 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {removingId === item._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      )}
                    </button>
                  </div>

                  {/* Product Information */}
                  <div className="p-4">
                    <div className="mb-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                        {item.brand || "VenRaz"}
                      </p>
                    </div>

                    <Link href={`/products/${item._id}`}>
                      <h2 className="line-clamp-2 min-h-[42px] text-sm font-semibold leading-5 text-slate-900 transition-colors hover:text-slate-600">
                        {item.name}
                      </h2>
                    </Link>

                    {/* Price */}
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xl font-bold tracking-tight text-slate-950">
                          ${price.toFixed(2)}
                        </p>

                        {(hasDiscount || hasFlashSale) && (
                          <p className="mt-0.5 text-xs text-slate-400 line-through">
                            ${item.price.toFixed(2)}
                          </p>
                        )}
                      </div>

                      <span className="text-[10px] font-medium text-slate-400">
                        Free shipping
                      </span>
                    </div>

                    {/* Action */}
                    <button
                      type="button"
                      disabled={!available}
                      onClick={() => handleAddToCart(item)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <ShoppingCart className="h-4 w-4" />

                      {available ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && wishlist.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Heart className="h-7 w-7 text-slate-400" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-950">
              Your wishlist is empty
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Save products you love and come back to them whenever you&apos;re
              ready.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Browse Products
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
