"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

const FALLBACK_IMAGE =
  "/assets/category/category_1_1.png";

/* =========================================================
   IMAGE HELPER
========================================================= */

const getCategoryImage = (image?: string) => {
  if (!image) {
    return FALLBACK_IMAGE;
  }

  // Dummy image হলে fallback
  if (image.includes("example.com")) {
    return FALLBACK_IMAGE;
  }

  return image;
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Category() {
  const [categories, setCategories] =
    useState<CategoryItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     FETCH CATEGORIES
  ======================================================= */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not configured"
          );
        }

        /*
         * IMPORTANT:
         *
         * Home-sections API তে categories নেই।
         * তাই আলাদা categories endpoint ব্যবহার করছি।
         */

        const response = await fetch(
          `${apiUrl}/api/v1/categories`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch categories: ${response.status}`
          );
        }

        const result: CategoryApiResponse =
          await response.json();

        console.log(
          "Categories API Response:",
          result
        );

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to load categories"
          );
        }

        /* =================================================
           NORMALIZE API DATA
        ================================================= */

        let categoryData: CategoryItem[] = [];

        /*
         * Case 1:
         *
         * {
         *   success: true,
         *   data: [...]
         * }
         */

        if (Array.isArray(result.data)) {
          categoryData = result.data;
        }

        /*
         * Case 2:
         *
         * {
         *   success: true,
         *   data: {
         *     categories: [...]
         *   }
         * }
         */

        else if (
          result.data &&
          "categories" in result.data &&
          Array.isArray(
            result.data.categories
          )
        ) {
          categoryData =
            result.data.categories;
        }

        /*
         * Case 3:
         *
         * {
         *   success: true,
         *   data: {
         *     category: [...]
         *   }
         * }
         */

        else if (
          result.data &&
          "category" in result.data &&
          Array.isArray(
            result.data.category
          )
        ) {
          categoryData =
            result.data.category;
        }

        /*
         * Case 4:
         *
         * {
         *   success: true,
         *   data: {
         *     data: [...]
         *   }
         * }
         */

        else if (
          result.data &&
          "data" in result.data &&
          Array.isArray(
            result.data.data
          )
        ) {
          categoryData =
            result.data.data;
        }

        console.log(
          "Final Categories:",
          categoryData
        );

        setCategories(categoryData);
      } catch (error) {
        console.error(
          "Category API Error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load categories."
        );

        setCategories([]);
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

          {/* Header */}

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

          {/* Loading */}

          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-gray-500">
              Loading categories...
            </p>
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

          {/* TITLE */}

          <div className="relative">

            <h2 className="pb-4 text-[32px] font-bold leading-none text-black">
              Shop by Categories
            </h2>

            <span className="absolute bottom-[-1px] left-0 h-[2px] w-[174px] bg-[#ff4b4b]" />

          </div>

          {/* EXPLORE */}

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

              <p className="text-lg text-red-500">
                {error}
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Please check the categories API.
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
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

        {!error &&
          categories.length === 0 && (
            <div className="flex min-h-[300px] items-center justify-center">

              <div className="text-center">

                <p className="text-lg text-gray-500">
                  No categories found.
                </p>

                <p className="mt-2 text-sm text-gray-400">
                  Please check the categories API response.
                </p>

              </div>

            </div>
          )}

        {/* =================================================
            CATEGORY GRID
        ================================================= */}

        {!error &&
          categories.length > 0 && (
            <div className="mt-8 grid grid-cols-1 border-l border-t border-[#d7e0ea] sm:grid-cols-2 lg:grid-cols-5">

              {categories.map(
                (category, index) => {

                  /* Product Count */

                  const productCount =
                    category.productsCount ??
                    category.productCount ??
                    (Array.isArray(
                      category.products
                    )
                      ? category.products.length
                      : 0);

                  /* Category ID */

                  const categoryId =
                    category._id ||
                    String(index);

                  return (
                    <Link
                      key={categoryId}
                      href={`/shop?category=${categoryId}`}
                      className="group flex min-h-[160px] items-center gap-4 border-b border-r border-[#d7e0ea] bg-white px-6 transition-all duration-300 hover:bg-gray-50 sm:px-8"
                    >

                      {/* IMAGE */}

                      <div className="flex h-[84px] w-[84px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#e7edf4]">

                        <Image
                          src={getCategoryImage(
                            category.image
                          )}
                          alt={
                            category.name ||
                            "Category"
                          }
                          width={84}
                          height={84}
                          className="h-[84px] w-[84px] object-contain transition duration-300 group-hover:scale-105"
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
                }
              )}

            </div>
          )}

      </div>

    </section>
  );
}