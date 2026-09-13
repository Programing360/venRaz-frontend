"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Shirt,
  Smartphone,
  Home,
  Sparkles,
  ShoppingBasket,
  Tag,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug?: string;
  icon?: string;
  image?: string;
  description?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async () => {
      setLoading(true);
      try {
        if (!API_URL) {
          if (!cancelled) setError("API is not configured. Please set NEXT_PUBLIC_API_URL.");
          return;
        }

        const res = await fetch(`${API_URL}/categories`, { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Failed to load categories (${res.status})`);
        }

        const result = await res.json();
        const list = result?.data ?? result?.categories ?? [];

        if (!cancelled) {
          setCategories(Array.isArray(list) ? list : []);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load categories",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* =========================
          HERO SECTION
      ========================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fff5f3] via-white to-[#fff1ef] pb-20 pt-28">
        {/* Decorative shapes */}
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#ff594d]/5" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#ff594d]/5" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#ff594d]/10 px-4 py-2 text-sm font-semibold text-[#ff594d]">
              <ShoppingBasket className="h-4 w-4" />
              Explore Categories
            </div>

            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Find Everything
              <span className="block text-[#ff594d]">You Need</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Explore our wide range of categories and discover thousands of
              quality products from trusted sellers.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          CATEGORY SECTION
      ========================== */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-semibold uppercase tracking-wider text-[#ff594d]">
                Shop By Category
              </p>

              <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Browse Our Categories
              </h2>

              <p className="mt-3 max-w-2xl text-gray-500">
                Choose a category to find the products you&apos;re looking for.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-semibold text-[#ff594d] transition hover:gap-3"
            >
              View All Products
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-56 animate-pulse rounded-2xl border border-gray-100 bg-gray-50"
                />
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-20 text-center">
              <p className="text-sm text-slate-500">{error}</p>
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const res = await fetch(`${API_URL}/categories`, {
                      cache: "no-store",
                    });
                    const result = await res.json();
                    const list = result?.data ?? result?.categories ?? [];
                    setCategories(Array.isArray(list) ? list : []);
                    setError("");
                  } catch (err) {
                    setError(
                      err instanceof Error
                        ? err.message
                        : "Failed to load categories",
                    );
                  } finally {
                    setLoading(false);
                  }
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#ff594d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e94d43]"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && categories.length === 0 && (
            <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-20 text-center">
              <Tag className="h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">
                No categories available right now.
              </p>
            </div>
          )}

          {/* Categories Grid */}
          {!loading && !error && categories.length > 0 && (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/products?category=${encodeURIComponent(
                    category.name,
                  )}`}
                  className="group"
                >
                  <div className="h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#ff594d]/30 hover:shadow-xl">
                    {/* Icon */}
                    <div className="flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff594d]/10 transition duration-300 group-hover:bg-[#ff594d]">
                        {category.icon ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={category.icon}
                            alt=""
                            className="h-7 w-7"
                          />
                        ) : (
                          <Tag className="h-7 w-7 text-[#ff594d] transition group-hover:text-white" />
                        )}
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 transition group-hover:bg-[#ff594d]/10">
                        <ArrowRight className="h-4 w-4 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-[#ff594d]" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="mt-6 text-xl font-bold text-gray-900 transition group-hover:text-[#ff594d]">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================
          FEATURED CATEGORY CTA
      ========================== */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-[#ff594d]">
            <div className="grid items-center lg:grid-cols-2">
              {/* Content */}
              <div className="px-6 py-12 sm:px-12 lg:py-16">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>

                <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
                  Discover Something
                  <span className="block">New Today</span>
                </h2>

                <p className="mt-5 max-w-lg leading-7 text-white/90">
                  From fashion and electronics to home essentials and everyday
                  products, VenRaz has something for everyone.
                </p>

                <Link
                  href="/products"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-[#ff594d] transition hover:bg-gray-100"
                >
                  Explore Products
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              {/* Right Visual */}
              <div className="hidden h-full min-h-[350px] items-center justify-center bg-[#e94d43] lg:flex">
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white shadow-lg">
                    <Shirt className="h-14 w-14 text-[#ff594d]" />
                  </div>

                  <div className="mt-8 flex h-32 w-32 items-center justify-center rounded-3xl bg-white shadow-lg">
                    <Smartphone className="h-14 w-14 text-[#ff594d]" />
                  </div>

                  <div className="-mt-8 flex h-32 w-32 items-center justify-center rounded-3xl bg-white shadow-lg">
                    <Home className="h-14 w-14 text-[#ff594d]" />
                  </div>

                  <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white shadow-lg">
                    <ShoppingBasket className="h-14 w-14 text-[#ff594d]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          BOTTOM CTA
      ========================== */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Browse all our products and use filters or search to quickly find
            exactly what you need.
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#ff594d] px-7 py-3.5 font-semibold text-white shadow-lg shadow-[#ff594d]/20 transition hover:bg-[#e94d43]"
          >
            Browse All Products
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}