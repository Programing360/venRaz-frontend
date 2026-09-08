"use client";

import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Star,
  Minus,
  Plus,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { MOCK_PRODUCTS } from "@/lib/products/mockCatalog";
import EmptyState from "@/components/common/EmptyState";

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  discount?: number;
  image?: string;
  images?: string[];
  category?: string;
  brand?: string;
  stock?: number;
  rating?: number;
  reviews?: number;
  totalReviews?: number;
};

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [added, setAdded] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        if (API_URL) {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);

          const res = await fetch(`${API_URL}/api/v1/products/${id}`, {
            signal: controller.signal,
          }).finally(() => clearTimeout(timeoutId));

          if (res.ok) {
            const data = await res.json();
            const productData = data?.data || data;
            if (productData && productData._id) {
              setProduct(productData);
              const img =
                productData.images?.[0] ||
                productData.image ||
                "/assets/product/product_3_2.png";
              setSelectedImage(img);
              return;
            }
          }
        }

        // Fallback to mock catalog
        const found =
          MOCK_PRODUCTS.find((p) => p._id === id || p.slug === id) ||
          MOCK_PRODUCTS[0]; // Graceful fallback
        if (found) {
          setProduct({
            _id: found._id,
            name: found.name,
            description: found.description,
            price: found.price,
            discount: found.discount,
            images: found.images,
            category: found.category,
            brand: found.brand,
            stock: found.stock,
            rating: found.rating,
            reviews: found.totalReviews,
          });
          setSelectedImage(found.images[0]);
        }
      } catch (err) {
        console.error("Product fetch error:", err);
        const found = MOCK_PRODUCTS.find((p) => p._id === id) || MOCK_PRODUCTS[0];
        if (found) {
          setProduct(found);
          setSelectedImage(found.images[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, API_URL]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fcfdfd] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
            <div className="h-[450px] bg-slate-200 rounded-3xl" />
            <div className="space-y-6">
              <div className="h-8 bg-slate-200 rounded w-3/4" />
              <div className="h-6 bg-slate-200 rounded w-1/3" />
              <div className="h-24 bg-slate-200 rounded w-full" />
              <div className="h-12 bg-slate-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white py-20">
        <EmptyState
          type="general"
          title="Product Not Found"
          description="The product you are looking for might have been removed or is temporarily unavailable."
          actionText="Back to Products"
          actionHref="/products"
        />
      </main>
    );
  }

  const finalPrice = product.discountPrice || product.price;
  const isOutOfStock = product.stock === 0;

  return (
    <main className="min-h-screen bg-[#fcfdfd] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Back Link */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#ff594d] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
          {/* Gallery Image */}
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-square max-h-[500px] bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center p-8">
              <Image
                src={selectedImage || "/assets/product/product_3_2.png"}
                alt={product.name}
                fill
                priority
                className="object-contain p-6 hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Brand */}
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {product.brand || "VenRaz Original"}
                </span>
                <div className="flex items-center gap-1.5 text-amber-500 text-sm font-semibold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.rating || 4.8}</span>
                  <span className="text-slate-400 text-xs">
                    ({product.reviews || product.totalReviews || 42} reviews)
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-3xl sm:text-4xl font-black text-[#ff594d]">
                  ${finalPrice.toFixed(2)}
                </span>
                {product.discount && product.discount > 0 && (
                  <span className="text-lg text-slate-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    isOutOfStock
                      ? "bg-red-50 text-red-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {isOutOfStock ? "Out of Stock" : "In Stock"}
                </span>
              </div>

              {/* Description */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 border-t border-slate-100 pt-6">
                {product.description ||
                  "Premium quality product built with high-grade components, delivering long-lasting performance and modern ergonomic aesthetics."}
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 py-5 border-y border-slate-100 text-center mb-8">
                <div className="flex flex-col items-center">
                  <Truck className="w-5 h-5 text-slate-700 mb-1" />
                  <span className="text-[11px] font-medium text-slate-600">
                    Fast Delivery
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-5 h-5 text-slate-700 mb-1" />
                  <span className="text-[11px] font-medium text-slate-600">
                    Authentic Guarantee
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-5 h-5 text-slate-700 mb-1" />
                  <span className="text-[11px] font-medium text-slate-600">
                    7 Days Return
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Quantity Control */}
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-3.5 hover:bg-slate-200 transition disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4 text-slate-700" />
                  </button>
                  <span className="px-5 font-bold text-slate-900 text-sm">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={isOutOfStock}
                    className="p-3.5 hover:bg-slate-200 transition disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4 text-slate-700" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-4 px-8 rounded-xl font-bold text-sm shadow-lg transition-all duration-200 ${
                    added
                      ? "bg-emerald-600 text-white shadow-emerald-500/20"
                      : "bg-[#ff594d] hover:bg-black text-white shadow-red-500/20"
                  } disabled:bg-gray-300 disabled:cursor-not-allowed`}
                >
                  {added ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add to Cart (${(finalPrice * quantity).toFixed(2)})</span>
                    </>
                  )}
                </button>
              </div>

              {added && (
                <div className="pt-2">
                  <Link
                    href="/cart"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline"
                  >
                    View Shopping Cart & Checkout &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
