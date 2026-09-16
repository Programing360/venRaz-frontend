"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import bannerImg from "../../../public/assets/download (4).jpg";

/* =========================================================
   TYPES
========================================================= */

type CategoryItem = {
  _id: string;
  name: string;
  image?: string;
  productsCount?: number;
  productCount?: number;
  products?: unknown[];
};

type CategoryApiResponse = {
  success: boolean;
  message?: string;
  data?:
    | CategoryItem[]
    | {
        categories?: CategoryItem[];
        category?: CategoryItem[];
        data?: CategoryItem[];
      };
};

/* =========================================================
   FALLBACK IMAGE
========================================================= */

const FALLBACK_IMAGE = "/placeholder.svg";

/* =========================================================
   IMAGE HELPER
========================================================= */

const getCategoryImage = (image?: string) => {
  if (!image) {
    return FALLBACK_IMAGE;
  }

  if (image.includes("example.com")) {
    return FALLBACK_IMAGE;
  }

  return image;
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Category() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     FETCH CATEGORIES
  ======================================================= */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("NEXT_PUBLIC_API_URL is not configured");
        }

        const response = await fetch(`${apiUrl}/categories`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }

        const result: CategoryApiResponse = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to load categories");
        }

        /* =================================================
           NORMALIZE API DATA
        ================================================= */

        let categoryData: CategoryItem[] = [];

        if (Array.isArray(result.data)) {
          categoryData = result.data;
        } else if (
          result.data &&
          "categories" in result.data &&
          Array.isArray(result.data.categories)
        ) {
          categoryData = result.data.categories;
        } else if (
          result.data &&
          "category" in result.data &&
          Array.isArray(result.data.category)
        ) {
          categoryData = result.data.category;
        } else if (
          result.data &&
          "data" in result.data &&
          Array.isArray(result.data.data)
        ) {
          categoryData = result.data.data;
        }

        setCategories(categoryData);
      } catch (error) {
        console.warn("Category API offline, using fallback categories:", error);

        setCategories([
          { _id: "cat-1", name: "Smart Watches", image: "/placeholder.svg" },
          {
            _id: "cat-2",
            name: "Headphones & Audio",
            image: "/placeholder.svg",
          },
          { _id: "cat-3", name: "Action Cameras", image: "/placeholder.svg" },
          { _id: "cat-4", name: "Gaming Keyboards", image: "/placeholder.svg" },
          { _id: "cat-5", name: "Wireless Mice", image: "/placeholder.svg" },
          {
            _id: "cat-6",
            name: "Bluetooth Speakers",
            image: "/placeholder.svg",
          },
        ]);

        setError("");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <section className="w-full bg-[#f6f9fd] py-12">
        <div className="mx-auto max-w-[1800px] px-5">
          <div className="flex items-center justify-between border-b border-[#d7e0ea]">
            <div className="relative">
              <h2 className="pb-4 text-[32px] font-bold leading-none text-black">
                Shop by Categories
              </h2>
              <span className="absolute bottom-[-1px] left-0 h-[2px] w-[174px] bg-[#ff4b4b]" />
            </div>

            <Link
              href="/shop"
              className="mb-4 text-[18px] font-medium text-black transition hover:text-[#ff4b4b]"
            >
              Explore All
            </Link>
          </div>

          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-gray-500">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <section className="w-full bg-[#f6f9fd] py-12">
      <div className="mx-auto max-w-[1800px] px-5">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between border-b border-[#d7e0ea]">
          <div className="relative">
            <h2 className="pb-4 text-[32px] font-bold leading-none text-black">
              Shop by Categories
            </h2>
            <span className="absolute bottom-[-1px] left-0 h-[2px] w-[174px] bg-[#ff4b4b]" />
          </div>

          <Link
            href="/shop"
            className="mb-4 text-[18px] font-medium text-black transition hover:text-[#ff4b4b]"
          >
            Explore All
          </Link>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-red-500">{error}</p>
              <p className="mt-2 text-sm text-gray-400">
                Please check the categories API.
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-md bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-[#ff4b4b]"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!error && categories.length === 0 && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-gray-500">No categories found.</p>
              <p className="mt-2 text-sm text-gray-400">
                Please check the categories API response.
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            LAYOUT: LEFT BANNER + RIGHT CATEGORY GRID
        ================================================= */}

        {!error && categories.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* LEFT SIDE BANNER */}
            <div className="relative overflow-hidden rounded-xl bg-black min-h-[320px] lg:min-h-[auto] flex flex-col justify-end p-8 text-white group">
              <Image
                src={bannerImg} // আপনার ব্যানারের সঠিক ইমেজের পাথ দিন
                alt="Special Offer Banner"
                width={600}
                height={600}
                className="object-cover opacity-75 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="relative z-10">
                <span className="inline-block rounded-full bg-[#ff4b4b] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                  Special Offer
                </span>
                <h3 className="mt-3 text-2xl font-bold leading-tight">
                  Upgrade Your Tech Setup
                </h3>
                <p className="mt-2 text-sm text-gray-200">
                  Get up to 30% off on top tech electronics categories.
                </p>
                <Link
                  href="/shop"
                  className="mt-5 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#ff4b4b] hover:text-white"
                >
                  Shop Now
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE CATEGORY GRID */}
            <div className="grid grid-cols-1 border-l border-t border-[#d7e0ea] sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
              {categories.slice(0, 6).map((category, index) => {
                const productCount =
                  category.productsCount ??
                  category.productCount ??
                  (Array.isArray(category.products)
                    ? category.products.length
                    : 0);

                const categoryId = category._id || String(index);

                return (
                  <Link
                    key={categoryId}
                    href={`/shop?category=${categoryId}`}
                    className="group flex min-h-[160px] items-center gap-4 border-b border-r border-[#d7e0ea] bg-white px-6 transition-all duration-300 hover:bg-gray-50 sm:px-8"
                  >
                    {/* IMAGE */}
                    <div className="flex h-[84px] w-[84px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#e7edf4]">
                      <Image
                        src={getCategoryImage(category.image)}
                        alt={category.name || "Category"}
                        width={400}
                        height={400}
                        className="h-[84px] w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="min-w-0">
                      <h3 className="text-[16px] font-semibold leading-6 text-black transition-colors group-hover:text-[#ff4b4b]">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-[14px] text-[#536273]">
                        {productCount} Products
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
