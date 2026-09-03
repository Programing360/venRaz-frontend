"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Heart,
  ShoppingBag,
  Shuffle,
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type Product = {
  _id: string;
  name: string;
  slug?: string;
  description?: string;

  images?: string[];

  price: number;
  discount?: number;

  stock?: number;

  category?: unknown;
  categoryId?: string;

  shop?: unknown;
  shopId?: string;

  seller?: unknown;
  sellerId?: string;

  brand?: string;

  rating?: number;
  reviews?: number;

  isFeatured?: boolean;
  isFlashSale?: boolean;

  flashSalePrice?: number;

  createdAt?: string;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  data?: {
    products?: Product[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

/* =========================================================
   CONSTANTS
========================================================= */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

const PRODUCTS_PER_PAGE = 15;

const FALLBACK_IMAGE =
  "/assets/img/product/product_1_1.png";

/* =========================================================
   IMAGE
========================================================= */

function getProductImage(
  product: Product,
) {
  const image = product.images?.[0];

  if (
    !image ||
    image.includes("example.com")
  ) {
    return FALLBACK_IMAGE;
  }

  return image;
}

/* =========================================================
   PRICE
========================================================= */

function getProductPrice(
  product: Product,
) {
  if (
    product.isFlashSale &&
    typeof product.flashSalePrice ===
      "number"
  ) {
    return product.flashSalePrice;
  }

  if (
    typeof product.discount ===
      "number" &&
    product.discount > 0
  ) {
    return (
      product.price -
      (product.price *
        product.discount) /
        100
    );
  }

  return product.price;
}

/* =========================================================
   PAGE
========================================================= */

export default function ShopPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* SEARCH */

  const [search, setSearch] =
    useState("");

  /* SORT */

  const [sortBy, setSortBy] =
    useState("latest");

  /* PAGE */

  const [currentPage, setCurrentPage] =
    useState(1);

  /* PAGINATION */

  const [totalProducts, setTotalProducts] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(0);

  /* FILTER */

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [minRating, setMinRating] =
    useState("");

  const [mobileFilterOpen, setMobileFilterOpen] =
    useState(false);

  /* =======================================================
     FETCH PRODUCTS
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        if (!API_URL) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not configured.",
          );
        }

        const params =
          new URLSearchParams();

        params.set(
          "page",
          String(currentPage),
        );

        params.set(
          "limit",
          String(PRODUCTS_PER_PAGE),
        );

        if (search.trim()) {
          params.set(
            "search",
            search.trim(),
          );
        }

        if (minPrice) {
          params.set(
            "minPrice",
            minPrice,
          );
        }

        if (maxPrice) {
          params.set(
            "maxPrice",
            maxPrice,
          );
        }

        if (minRating) {
          params.set(
            "minRating",
            minRating,
          );
        }

        params.set("sort", sortBy);

        const response = await fetch(
          `${API_URL}/api/v1/products?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Accept:
                "application/json",
            },
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch products: ${response.status}`,
          );
        }

        const result: ApiResponse =
          await response.json();

        if (result.success === false) {
          throw new Error(
            result.message ||
              "Failed to load products.",
          );
        }

        const productData =
          result.data?.products ?? [];

        if (!cancelled) {
          setProducts(productData);

          setTotalProducts(
            result.data?.pagination
              ?.total ?? 0,
          );

          setTotalPages(
            result.data?.pagination
              ?.totalPages ?? 0,
          );
        }
      } catch (err) {
        console.error(
          "Product API Error:",
          err,
        );

        if (!cancelled) {
          setProducts([]);

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load products.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [
    currentPage,
    search,
    sortBy,
    minPrice,
    maxPrice,
    minRating,
  ]);

  /* =======================================================
     SEARCH
  ======================================================= */

  function handleSearch(
    value: string,
  ) {
    setSearch(value);
    setCurrentPage(1);
  }

  /* =======================================================
     SORT
  ======================================================= */

  function handleSort(
    value: string,
  ) {
    setSortBy(value);
    setCurrentPage(1);
  }

  /* =======================================================
     CLEAR FILTER
  ======================================================= */

  function clearFilters() {
    setSearch("");
    setSortBy("latest");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setCurrentPage(1);
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <section className="min-h-screen bg-white py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({
              length: 8,
            }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse"
              >
                <div className="aspect-square rounded-xl bg-gray-200" />

                <div className="mt-5 h-4 w-20 rounded bg-gray-200" />

                <div className="mt-3 h-5 w-3/4 rounded bg-gray-200" />

                <div className="mt-3 h-5 w-24 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <section className="min-h-screen bg-white py-20">
        <div className="mx-auto flex min-h-[400px] max-w-7xl items-center justify-center px-5">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl text-red-500">
              !
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Failed to load products
            </h2>

            <p className="mt-3 text-sm text-red-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 rounded-lg bg-[#ff594d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <main className="min-h-screen bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* SEARCH */}

          <div className="relative w-full lg:max-w-md">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                handleSearch(
                  event.target.value,
                )
              }
              placeholder="Search products..."
              className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#ff594d] focus:ring-1 focus:ring-[#ff594d]"
            />
          </div>

          <div className="flex gap-3">
            {/* MOBILE FILTER */}

            <button
              type="button"
              onClick={() =>
                setMobileFilterOpen(true)
              }
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm lg:hidden"
            >
              <SlidersHorizontal
                size={18}
              />
              Filter
            </button>

            {/* SORT */}

            <select
              value={sortBy}
              onChange={(event) =>
                handleSort(
                  event.target.value,
                )
              }
              aria-label="Sort products"
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#ff594d]"
            >
              <option value="latest">
                Sort By Latest
              </option>

              <option value="popularity">
                Sort by popularity
              </option>

              <option value="rating">
                Sort by average rating
              </option>

              <option value="price">
                Price: low to high
              </option>

              <option value="price-desc">
                Price: high to low
              </option>
            </select>
          </div>
        </div>

        {/* CONTENT */}

        <div className="flex gap-8">

          {/* DESKTOP FILTER */}

          <aside className="hidden w-64 shrink-0 lg:block">

            <div className="sticky top-24 rounded-xl border border-gray-200 p-5">

              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  Filters
                </h3>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-[#ff594d]"
                >
                  Clear All
                </button>
              </div>

              {/* PRICE */}

              <div className="mt-7">
                <h4 className="text-sm font-semibold">
                  Price
                </h4>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(
                        e.target.value,
                      );
                      setCurrentPage(1);
                    }}
                    placeholder="Min"
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#ff594d]"
                  />

                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(
                        e.target.value,
                      );
                      setCurrentPage(1);
                    }}
                    placeholder="Max"
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#ff594d]"
                  />
                </div>
              </div>

              {/* RATING */}

              <div className="mt-7">
                <h4 className="text-sm font-semibold">
                  Rating
                </h4>

                <div className="mt-3 space-y-2">
                  {[4, 3, 2, 1].map(
                    (rating) => (
                      <label
                        key={rating}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <input
                          type="radio"
                          name="rating"
                          checked={
                            minRating ===
                            String(rating)
                          }
                          onChange={() => {
                            setMinRating(
                              String(
                                rating,
                              ),
                            );
                            setCurrentPage(
                              1,
                            );
                          }}
                        />

                        <span className="text-[#ffb400]">
                          {"★".repeat(
                            rating,
                          )}
                          {"☆".repeat(
                            5 - rating,
                          )}
                        </span>

                        <span className="text-gray-500">
                          & up
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* PRODUCTS */}

          <div className="min-w-0 flex-1">

            {/* RESULT BAR */}

            <div className="mb-8 flex flex-col gap-2 border-y border-gray-200 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600">
                Showing{" "}
                {totalProducts === 0
                  ? 0
                  : (currentPage - 1) *
                      PRODUCTS_PER_PAGE +
                    1}
                -
                {Math.min(
                  currentPage *
                    PRODUCTS_PER_PAGE,
                  totalProducts,
                )}{" "}
                of {totalProducts} products
              </p>

              {totalPages > 0 && (
                <p className="text-sm text-gray-500">
                  Page {currentPage} of{" "}
                  {totalPages}
                </p>
              )}
            </div>

            {/* EMPTY */}

            {products.length === 0 && (
              <div className="flex min-h-[350px] items-center justify-center">
                <div className="text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <Search
                      size={25}
                      className="text-gray-400"
                    />
                  </div>

                  <h2 className="mt-5 text-xl font-bold text-gray-800">
                    No products found
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Try changing your search
                    or filters.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-lg bg-[#ff594d] px-5 py-2.5 text-sm font-medium text-white"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}

            {/* GRID */}

            {products.length > 0 && (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">

                {products.map(
                  (product) => {
                    const finalPrice =
                      getProductPrice(
                        product,
                      );

                    const hasDiscount =
                      finalPrice <
                      product.price;

                    return (
                      <article
                        key={
                          product._id
                        }
                        className="group"
                      >
                        {/* IMAGE */}

                        <div className="relative overflow-hidden rounded-xl bg-[#f5f6f8]">

                          <Link
                            href={`/products/${product._id}`}
                            className="block"
                          >
                            <div className="relative aspect-square w-full">
                              <Image
                                src={getProductImage(
                                  product,
                                )}
                                alt={
                                  product.name ||
                                  "Product"
                                }
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                className="object-contain p-5 transition duration-500 group-hover:scale-105"
                              />
                            </div>
                          </Link>

                          {/* SALE */}

                          {(product.isFlashSale ||
                            (product.discount ??
                              0) >
                              0) && (
                            <span className="absolute left-4 top-4 rounded-md bg-[#ff594d] px-3 py-1 text-xs font-semibold text-white">
                              {product.isFlashSale
                                ? "On Sale"
                                : `${product.discount}% OFF`}
                            </span>
                          )}

                          {/* WISHLIST */}

                          <button
                            type="button"
                            aria-label="Add to wishlist"
                            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition hover:bg-[#ff594d] hover:text-white"
                          >
                            <Heart
                              size={18}
                            />
                          </button>

                          {/* ACTIONS */}

                          <div className="absolute bottom-4 left-1/2 flex w-[90%] -translate-x-1/2 translate-y-4 flex-col overflow-hidden rounded-lg bg-white shadow-xl opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">

                            <button
                              type="button"
                              className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-100"
                            >
                              <span>
                                Add To Wishlist
                              </span>

                              <Heart
                                size={17}
                              />
                            </button>

                            <button
                              type="button"
                              disabled={
                                product.stock ===
                                0
                              }
                              className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <span>
                                Add To Cart
                              </span>

                              <ShoppingBag
                                size={17}
                              />
                            </button>

                            <button
                              type="button"
                              className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-100"
                            >
                              <span>
                                Compare
                              </span>

                              <Shuffle
                                size={17}
                              />
                            </button>
                          </div>
                        </div>

                        {/* INFO */}

                        <div className="pt-5">

                          {/* RATING */}

                          <div className="flex items-center gap-2">
                            <div className="text-sm tracking-wide text-[#ffb400]">
                              {Array.from(
                                {
                                  length: 5,
                                },
                                (
                                  _,
                                  index,
                                ) =>
                                  index <
                                  Math.round(
                                    product.rating ??
                                      0,
                                  )
                                    ? "★"
                                    : "☆",
                              ).join("")}
                            </div>

                            <span className="text-xs text-gray-500">
                              (
                              {product.reviews ??
                                0}{" "}
                              reviews)
                            </span>
                          </div>

                          {/* NAME */}

                          <Link
                            href={`/products/${product._id}`}
                          >
                            <h2 className="mt-2 line-clamp-1 text-lg font-semibold text-gray-900 transition hover:text-[#ff594d]">
                              {
                                product.name
                              }
                            </h2>
                          </Link>

                          {/* BRAND */}

                          {product.brand && (
                            <p className="mt-1 text-sm text-gray-500">
                              {
                                product.brand
                              }
                            </p>
                          )}

                          {/* PRICE */}

                          <div className="mt-3 flex items-center gap-2">
                            {hasDiscount && (
                              <del className="text-sm text-gray-400">
                                $
                                {product.price.toFixed(
                                  2,
                                )}
                              </del>
                            )}

                            <span className="text-base font-bold text-gray-900">
                              $
                              {finalPrice.toFixed(
                                2,
                              )}
                            </span>
                          </div>

                          {/* STOCK */}

                          {typeof product.stock ===
                            "number" && (
                            <p
                              className={`mt-2 text-xs ${
                                product.stock >
                                0
                                  ? "text-green-600"
                                  : "text-red-500"
                              }`}
                            >
                              {product.stock >
                              0
                                ? `${product.stock} in stock`
                                : "Out of stock"}
                            </p>
                          )}
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            )}

            {/* PAGINATION */}

            {totalPages > 1 && (
              <nav
                className="mt-14 flex flex-wrap items-center justify-center gap-2"
                aria-label="Product pagination"
              >
                {/* PREVIOUS */}

                <button
                  type="button"
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          1,
                          page - 1,
                        ),
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 transition hover:bg-[#ff594d] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft
                    size={18}
                  />
                </button>

                {/* NUMBERS */}

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) =>
                    index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() =>
                      setCurrentPage(
                        page,
                      )
                    }
                    className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm ${
                      currentPage ===
                      page
                        ? "border-[#ff594d] bg-[#ff594d] text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-[#ff594d] hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* NEXT */}

                <button
                  type="button"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          totalPages,
                          page + 1,
                        ),
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 transition hover:bg-[#ff594d] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight
                    size={18}
                  />
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE FILTER
      ===================================================== */}

      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() =>
              setMobileFilterOpen(false)
            }
          />

          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-white p-5 shadow-xl">

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Filters
              </h3>

              <button
                type="button"
                onClick={() =>
                  setMobileFilterOpen(
                    false,
                  )
                }
              >
                <X size={22} />
              </button>
            </div>

            {/* PRICE */}

            <div className="mt-8">
              <h4 className="text-sm font-semibold">
                Price
              </h4>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(
                      e.target.value,
                    );
                    setCurrentPage(1);
                  }}
                  placeholder="Min"
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm outline-none"
                />

                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(
                      e.target.value,
                    );
                    setCurrentPage(1);
                  }}
                  placeholder="Max"
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>

            {/* RATING */}

            <div className="mt-8">
              <h4 className="text-sm font-semibold">
                Rating
              </h4>

              <div className="mt-3 space-y-3">
                {[4, 3, 2, 1].map(
                  (rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="radio"
                        name="mobile-rating"
                        checked={
                          minRating ===
                          String(
                            rating,
                          )
                        }
                        onChange={() => {
                          setMinRating(
                            String(
                              rating,
                            ),
                          );
                          setCurrentPage(
                            1,
                          );
                        }}
                      />

                      <span className="text-[#ffb400]">
                        {"★".repeat(
                          rating,
                        )}
                        {"☆".repeat(
                          5 - rating,
                        )}
                      </span>
                    </label>
                  ),
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                clearFilters();
                setMobileFilterOpen(
                  false,
                );
              }}
              className="mt-10 w-full rounded-lg bg-[#ff594d] py-3 text-sm font-semibold text-white"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </main>
  );
}