"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  image?: string;
  images?: string[];
  category?: string;
  brand?: string;
  stock?: number;
  rating?: number;
  reviews?: number;
};

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 16 এ params Promise
  const { id } = use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

 useEffect(() => {
  const fetchProduct = async () => {
    try {
      setLoading(true);

      console.log("Product ID:", id);
      console.log(
        "API URL:",
        `${API_URL}/api/v1/products/${id}`
      );

      const response = await fetch(
        `${API_URL}/api/v1/products/${id}`
      );

      const data = await response.json();

      console.log("Product API Response:", data);

      if (!response.ok) {
        throw new Error(
          data?.message || "Product not found"
        );
      }

      const productData = data?.data || data;

      setProduct(productData);
    } catch (error) {
      console.error("Product fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchProduct();
  }
}, [id, API_URL]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">
          Product Not Found
        </h1>

        <Link
          href="/products"
          className="mt-5 rounded-lg bg-[#ff594d] px-6 py-3 text-white"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 rounded-2xl bg-white p-6 shadow-sm md:p-10 lg:grid-cols-2">

          {/* Product Image */}
          <div className="flex min-h-[450px] items-center justify-center rounded-xl bg-gray-50 p-6">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={600}
                className="max-h-[450px] w-full object-contain"
              />
            ) : (
              <p>No Image</p>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">

            {product.category && (
              <p className="mb-3 font-semibold text-[#ff594d]">
                {product.category}
              </p>
            )}

            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-yellow-500">
                ⭐⭐⭐⭐⭐
              </span>

              <span className="text-sm text-gray-500">
                ({product.reviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-3xl font-bold text-[#ff594d]">
                ৳{product.discountPrice || product.price}
              </span>

              {product.discountPrice && (
                <span className="text-xl text-gray-400 line-through">
                  ৳{product.price}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mt-6 border-t pt-6">
              <h2 className="mb-3 text-xl font-semibold">
                Description
              </h2>

              <p className="leading-7 text-gray-600">
                {product.description ||
                  "No description available."}
              </p>
            </div>

            {/* Brand */}
            {product.brand && (
              <p className="mt-5">
                <strong>Brand:</strong> {product.brand}
              </p>
            )}

            {/* Stock */}
            <p className="mt-3">
              <strong>Stock:</strong>{" "}
              {product.stock && product.stock > 0 ? (
                <span className="text-green-600">
                  In Stock ({product.stock})
                </span>
              ) : (
                <span className="text-red-500">
                  Out of Stock
                </span>
              )}
            </p>

            {/* Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                disabled={!product.stock}
                className="rounded-xl bg-[#ff594d] px-7 py-4 font-semibold text-white transition hover:bg-[#e94b40] disabled:bg-gray-300"
              >
                Add to Cart
              </button>

              <Link
                href="/product"
                className="rounded-xl border-2 border-[#ff594d] px-7 py-4 font-semibold text-[#ff594d] transition hover:bg-[#ff594d] hover:text-white"
              >
                Continue Shopping
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

