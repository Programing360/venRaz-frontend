export const dynamic = "force-dynamic";

import ProductCard from "@/components/products/ProductCard";
import { getHomeSections } from "@/lib/products/data";

interface Product {
  _id: string;
  name: string;
  slug?: string;
  images?: string[];
  price: number;
  discount?: number;
  stock?: number;
  brand?: string;
  rating?: number;
  reviews?: number;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  flashSalePrice?: number;
}

interface HomeSectionsData {
  featured?: Product[];
  flashSale?: Product[];
  topRated?: Product[];
  mostSelling?: Product[];
  newArrivals?: Product[];
}

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

const ProductsPage = async ({
  searchParams,
}: ProductsPageProps) => {
  const params = await searchParams;

  const search =
    typeof params?.search === "string"
      ? params.search.trim()
      : "";

  const data: HomeSectionsData = await getHomeSections();
  const products: Product[] = [
    ...(data?.featured ?? []),
    ...(data?.flashSale ?? []),
    ...(data?.topRated ?? []),
    ...(data?.mostSelling ?? []),
    ...(data?.newArrivals ?? []),
  ];

  // Search filter
  const filteredProducts = search
    ? products.filter((product) =>
        product.name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      )
    : products;

  // Duplicate products remove
  const uniqueProducts = Array.from(
    new Map(
      filteredProducts.map((product) => [
        product._id,
        product,
      ])
    ).values()
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F7FAF8]">
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

        {/* Search */}
        <form
          action="/products"
          method="GET"
          className="mb-10 rounded-3xl border bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-4 md:flex-row">
            <input
              type="text"
              name="search"
              placeholder="Search product..."
              defaultValue={search}
              className="flex-1 rounded-xl border bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#205A44]"
            />

            <button
              type="submit"
              className="rounded-xl bg-[#132573] px-6 py-3 font-medium text-white transition-colors hover:bg-[#184433]"
            >
              Search
            </button>

            {search && (
              <a
                href="/product"
                className="rounded-xl border border-gray-300 px-6 py-3 text-center font-medium text-gray-600 transition hover:bg-gray-100"
              >
                Clear
              </a>
            )}
          </div>
        </form>

        {/* Product Count */}
        {uniqueProducts.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#163B33]">
              All Products
            </h2>

            <span className="text-sm text-gray-500">
              {uniqueProducts.length}{" "}
              {uniqueProducts.length === 1
                ? "product"
                : "products"}{" "}
              found
            </span>
          </div>
        )}

        {/* Products */}
        {uniqueProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {uniqueProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border bg-white p-20 text-center">
            <div className="mb-4 text-6xl">
              🛍️
            </div>

            <h2 className="text-2xl font-bold text-gray-700">
              {search
                ? "No Products Found"
                : "No Products Available"}
            </h2>

            <p className="mt-2 text-gray-500">
              {search
                ? `No products matched "${search}". Try another search.`
                : "Products will appear here when available."}
            </p>

            {search && (
              <a
                href="/products"
                className="mt-6 inline-block rounded-xl bg-[#132573] px-6 py-3 font-medium text-white transition hover:bg-[#184433]"
              >
                View All Products
              </a>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductsPage;

