"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  SlidersHorizontal,
  Star,
  Check,
  X,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ProductGridSkeleton } from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import { MOCK_PRODUCTS, CatalogProduct } from "@/lib/products/mockCatalog";

const PRODUCTS_PER_PAGE = 12;

export default function ShopPage() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Categories list
  const categories = useMemo(() => {
    const cats = Array.from(new Set(MOCK_PRODUCTS.map((p) => p.category)));
    return ["All", ...cats];
  }, []);

  // Fetch or load catalog
  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      try {
        setLoading(true);

        if (API_URL) {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);

          const params = new URLSearchParams();
          if (search.trim()) params.set("search", search.trim());
          if (selectedCategory !== "All") params.set("category", selectedCategory);
          if (minPrice) params.set("minPrice", minPrice);
          if (maxPrice) params.set("maxPrice", maxPrice);
          if (minRating) params.set("minRating", minRating);
          params.set("sort", sortBy);

          const res = await fetch(`${API_URL}/api/v1/products?${params.toString()}`, {
            signal: controller.signal,
          }).finally(() => clearTimeout(timeoutId));

          if (res.ok) {
            const data = await res.json();
            const fetched = data?.data?.products || data?.products;
            if (Array.isArray(fetched) && fetched.length > 0 && !cancelled) {
              setProducts(fetched);
              return;
            }
          }
        }

        // Resilient Fallback to rich Mock Catalog
        let filtered = [...MOCK_PRODUCTS];

        if (search.trim()) {
          const q = search.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.brand.toLowerCase().includes(q) ||
              p.category.toLowerCase().includes(q)
          );
        }

        if (selectedCategory !== "All") {
          filtered = filtered.filter((p) => p.category === selectedCategory);
        }

        if (minPrice) {
          filtered = filtered.filter((p) => p.price >= Number(minPrice));
        }

        if (maxPrice) {
          filtered = filtered.filter((p) => p.price <= Number(maxPrice));
        }

        if (minRating) {
          filtered = filtered.filter((p) => p.rating >= Number(minRating));
        }

        if (sortBy === "price") {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-desc") {
          filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === "rating") {
          filtered.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === "popularity") {
          filtered.sort((a, b) => b.soldCount - a.soldCount);
        } else {
          // latest
          filtered.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }

        if (!cancelled) {
          setProducts(filtered);
        }
      } catch (err) {
        console.warn("Shop backend API fallback triggered:", err);
        if (!cancelled) {
          setProducts(MOCK_PRODUCTS);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      cancelled = true;
    };
  }, [API_URL, search, selectedCategory, minPrice, maxPrice, minRating, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSortBy("latest");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setCurrentPage(1);
  };

  const handleAddToCart = (e: React.MouseEvent, product: CatalogProduct) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product._id]: false }));
    }, 1500);
  };

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <main className="min-h-screen bg-[#fcfdfd] py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header & Controls Bar */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              All Products & Deals
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore our curated electronics catalog with instant price filters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search products..."
                className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 bg-white outline-none focus:border-[#ff594d] focus:ring-1 focus:ring-[#ff594d]"
              />
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 lg:hidden hover:bg-slate-50"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#ff594d]" />
              Filters
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Sort products"
              className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 outline-none focus:border-[#ff594d]"
            >
              <option value="latest">Sort by: Newest</option>
              <option value="popularity">Sort by: Most Popular</option>
              <option value="rating">Sort by: Top Rated</option>
              <option value="price">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 bg-white border border-slate-200 rounded-2xl p-5 sticky top-24 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Filters</h3>
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-[#ff594d] hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Category
              </h4>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-lg transition ${
                      selectedCategory === cat
                        ? "bg-[#ff594d] text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Price Range ($)
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Min"
                  className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 outline-none focus:border-[#ff594d]"
                />
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Max"
                  className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 outline-none focus:border-[#ff594d]"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Minimum Rating
              </h4>
              <div className="space-y-2">
                {[4, 3, 2].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="minRating"
                      checked={minRating === String(rating)}
                      onChange={() => {
                        setMinRating(String(rating));
                        setCurrentPage(1);
                      }}
                      className="accent-[#ff594d]"
                    />
                    <span className="flex items-center text-amber-500 font-bold">
                      {"★".repeat(rating)}
                      <span className="text-slate-300 font-normal">
                        {"☆".repeat(5 - rating)}
                      </span>
                    </span>
                    <span>& up</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <ProductGridSkeleton count={8} />
            ) : paginatedProducts.length === 0 ? (
              <EmptyState
                type="search"
                title="No Products Found"
                description="We couldn't find any products matching your selected search terms or price filters."
                actionText="Clear All Filters"
                onAction={clearFilters}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => {
                    const isAdded = !!addedIds[product._id];
                    return (
                      <div
                        key={product._id}
                        className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
                      >
                        {/* Image */}
                        <Link
                          href={`/products/${product._id}`}
                          className="relative h-56 bg-slate-50 flex items-center justify-center p-4 overflow-hidden"
                        >
                          <Image
                            src={product.images[0] || "/assets/product/product_3_2.png"}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.discount && product.discount > 0 && (
                            <span className="absolute top-3 left-3 bg-[#ff594d] text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                              -{product.discount}%
                            </span>
                          )}
                        </Link>

                        {/* Card Info */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400 font-medium">
                                {product.brand}
                              </span>
                              <div className="flex items-center gap-1 text-amber-500 font-bold">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                {product.rating}
                              </div>
                            </div>
                            <Link href={`/products/${product._id}`}>
                              <h3 className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-[#ff594d] transition-colors">
                                {product.name}
                              </h3>
                            </Link>
                          </div>

                          {/* Price and Cart Button */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                            <div>
                              <span className="text-lg font-black text-slate-900">
                                ${(product.flashSalePrice || product.price).toFixed(2)}
                              </span>
                              {product.discount && (
                                <span className="text-xs text-slate-400 line-through block">
                                  ${product.price.toFixed(2)}
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleAddToCart(e, product)}
                              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                                isAdded
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-900 hover:bg-[#ff594d] text-white"
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Added</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  <span>Add</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                            currentPage === pageNum
                              ? "bg-[#ff594d] text-white shadow-md"
                              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-900 text-base">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Category
                </h4>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-lg transition ${
                        selectedCategory === cat
                          ? "bg-[#ff594d] text-white"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Price ($)
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Min"
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none"
                  />
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Max"
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-[#ff594d] text-white py-3 rounded-xl font-bold text-xs"
              >
                Apply Filters ({products.length} Products)
              </button>
              <button
                type="button"
                onClick={() => {
                  clearFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full bg-slate-100 text-slate-700 py-2.5 rounded-xl font-semibold text-xs"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}