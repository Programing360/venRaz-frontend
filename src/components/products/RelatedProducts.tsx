"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { MOCK_PRODUCTS } from "@/lib/products/mockCatalog";

interface RelatedProductsProps {
  productId: string;
  categoryId?: string;
  categoryName?: string;
}

interface RelatedProduct {
  _id: string;
  name: string;
  slug?: string;
  images?: string[];
  price: number;
  discount?: number;
  stock?: number;
  brand?: string;
  rating?: number;
  totalReviews?: number;
  soldCount?: number;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  flashSalePrice?: number;
  category?: string | { _id?: string; name?: string };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RelatedProducts({
  productId,
  categoryId,
  categoryName,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchRelated = async () => {
      setLoading(true);
      try {
        const category = categoryId || categoryName || "";
        let list: RelatedProduct[] = [];

        if (API_URL && category) {
          const res = await fetch(
            `${API_URL}/products?category=${encodeURIComponent(category)}&limit=9`,
            { cache: "no-store" },
          );
          if (res.ok) {
            const result = await res.json();
            list = result?.data?.products || result?.products || [];
          }
        }

        if (cancelled) return;

        // Fallback: match mock catalog by category label
        if (!list.length && categoryName) {
          list = MOCK_PRODUCTS.filter(
            (p) => p.category?.toLowerCase() === categoryName.toLowerCase(),
          );
        }

        setProducts(list.filter((p) => String(p._id) !== String(productId)));
      } catch (err) {
        console.error("Related products fetch error:", err);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRelated();

    return () => {
      cancelled = true;
    };
  }, [productId, categoryId, categoryName]);

  return (
    <section className="mt-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Related Products
          </h2>
          {categoryName && (
            <p className="text-sm text-slate-500 mt-1">
              You might also like these
            </p>
          )}
        </div>
        <Link
          href={`/products?category=${encodeURIComponent(categoryName || "")}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#ff594d] hover:text-black transition-colors shrink-0"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-80 bg-slate-100 rounded-3xl animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-slate-200 rounded-3xl">
          <Loader2 className="w-8 h-8 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">
            No related products found right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}