import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { getProducts, getCategories } from "@/lib/products/data";
import { SlidersHorizontal, Search } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  slug?: string;
  images?: string[];
  price: number;
  discount?: number;
  stock?: number;
  brand?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  flashSalePrice?: number;
}

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
}

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
  const params = await searchParams;

  const search = typeof params?.search === "string" ? params.search.trim() : "";
  const category =
    typeof params?.category === "string" ? params.category.trim() : "";
  const minPrice =
    typeof params?.minPrice === "string" ? params.minPrice.trim() : "";
  const maxPrice =
    typeof params?.maxPrice === "string" ? params.maxPrice.trim() : "";
  const sort = typeof params?.sort === "string" ? params.sort.trim() : "";

  // URL parameters dynamic handle
  const page = Math.max(1, parseInt(params?.page || "1", 10));
  const limit = 12; // Per page 12 products

  // Backend API Calls (server-side)
  const [categories, { products = [], totalPages = 1, totalProducts = 0 }] =
    await Promise.all([
      getCategories(),
      getProducts({
        page,
        limit,
        search,
        category,
        minPrice,
        maxPrice,
        sort,
      }),
    ]);

  // Display name for the selected category
  const selectedCategoryName =
    categories.find((c) => c._id === category || c.slug === category)?.name ||
    category;

  const isFiltered = Boolean(search || category || minPrice || maxPrice);

  // Build the shared query object for pagination links
  const buildQuery = (nextPage: number) => ({
    ...(search && { search }),
    ...(category && { category }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(sort && { sort }),
    page: nextPage,
  });

  // Dynamic 4-Page Window Calculation
  const maxButtons = 4;
  let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
  let endPage = startPage + maxButtons - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F7FAF8] mt-10">
      <main className="mx-auto w-full max-w-7xl px-4 py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#163B33] md:text-5xl">
            Our Products
          </h1>
          <p className="mt-3 text-base text-gray-500 md:text-lg">
            Explore our latest and popular products.
          </p>
        </div>

        {/* Search & Filter Form */}
        <form
          action="/products"
          method="GET"
          className="mb-10 rounded-3xl bg-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <input
              type="text"
              name="search"
              placeholder="Search product..."
              defaultValue={search}
              className="min-w-[200px] flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#205A44]"
            />

            {/* Category Select (from backend /categories) */}
            <select
              name="category"
              defaultValue={category}
              className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#205A44]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Price Range */}
            <input
              type="number"
              name="minPrice"
              min="0"
              placeholder="Min price ($)"
              defaultValue={minPrice}
              className="w-36 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#205A44]"
            />
            <input
              type="number"
              name="maxPrice"
              min="0"
              placeholder="Max price ($)"
              defaultValue={maxPrice}
              className="w-36 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#205A44]"
            />

            {/* Sort */}
            <select
              name="sort"
              defaultValue={sort}
              className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#205A44]"
            >
              <option value="">Sort: Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#ff594d] px-6 py-3 font-medium text-white transition-colors hover:bg-[#163B33]"
            >
              <Search className="h-4 w-4" />
              Search
            </button>

            {/* URL প্যারামিটার থাকলে URL রিসেট লিঙ্ক, অন্যথায় Client-side Input Clear বাটন */}
            {isFiltered ? (
              <Link
                href="/products"
                className="rounded-xl border border-gray-300 px-6 py-3 text-center font-medium text-gray-600 transition hover:bg-gray-100"
              >
                Clear
              </Link>
            ) : null}
          </div>

          {isFiltered && (
            <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters applied — refine your search anytime.
            </p>
          )}
        </form>

        {/* Product Count Info */}
        {products.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-[#163B33]">
              {selectedCategoryName || search || "All Products"}
            </h2>

            <span className="text-sm text-gray-500">
              Showing {products.length} of {totalProducts} products
            </span>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product: Product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {/* Previous Button */}
                <Link
                  href={{
                    pathname: "/products",
                    query: buildQuery(page > 1 ? page - 1 : 1),
                  }}
                  className={`rounded-xl border px-4 py-2 font-medium transition ${
                    page <= 1
                      ? "pointer-events-none opacity-40 border-gray-200 bg-gray-100 text-gray-400"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Prev
                </Link>

                {/* Maximum 4 Page Numbers Display */}
                {visiblePages.map((pNum) => (
                  <Link
                    key={pNum}
                    href={{
                      pathname: "/products",
                      query: buildQuery(pNum),
                    }}
                    className={`rounded-xl px-4 py-2 font-medium transition ${
                      pNum === page
                        ? "bg-[#ff594d] text-white shadow-md"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pNum}
                  </Link>
                ))}

                {/* Next Button */}
                <Link
                  href={{
                    pathname: "/products",
                    query: buildQuery(
                      page < totalPages ? page + 1 : totalPages,
                    ),
                  }}
                  className={`rounded-xl border px-4 py-2 font-medium transition ${
                    page >= totalPages
                      ? "pointer-events-none opacity-40 border-gray-200 bg-gray-100 text-gray-400"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </Link>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="rounded-3xl bg-white p-20 text-center shadow-2xl">
            <div className="mb-4 text-6xl">🛍️</div>

            <h2 className="text-2xl font-bold text-gray-700">
              {isFiltered ? "No Products Found" : "No Products Available"}
            </h2>

            <p className="mt-2 text-gray-500">
              {search
                ? `No products matched "${search}". Try another search.`
                : selectedCategoryName
                  ? `No products found in "${selectedCategoryName}".`
                  : isFiltered
                    ? "No products match the selected filters."
                    : "Products will appear here when available."}
            </p>

            <Link
              href="/products"
              className="mt-6 inline-block rounded-xl bg-[#ff594d] px-6 py-3 font-medium text-white transition hover:bg-[#163B33]"
            >
              View All Products
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductsPage;