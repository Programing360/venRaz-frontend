"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Heart,
  ArrowLeftRight,
  Eye,
  Check,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

/* =========================================================
   TYPES
   ========================================================= */

type Product = {
  _id: string;
  name: string;
  images?: string[];
  price: number;
  discount?: number;
  rating?: number;
  stock?: number;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  statusCode?: number;
  data: {
    featured: Product[];
    flashSale: Product[];
    topRated: Product[];
    mostSelling: Product[];
    newArrivals: Product[];
  };
};

/* =========================================================
   FALLBACK IMAGE
   ========================================================= */

const FALLBACK_IMAGE =
  "/assets/product/product_2_1.png";

/* =========================================================
   IMAGE HELPER
   ========================================================= */

const getProductImage = (image?: string) => {
  if (!image) {
    return FALLBACK_IMAGE;
  }

  if (
    image.includes("example.com") ||
    image.trim() === ""
  ) {
    return FALLBACK_IMAGE;
  }

  return image;
};

/* =========================================================
   OLD PRICE CALCULATION
   ========================================================= */

const getOldPrice = (
  price: number,
  discount?: number
) => {
  if (!discount || discount <= 0) {
    return null;
  }

  return price / (1 - discount / 100);
};

/* =========================================================
   PRODUCT CARD
   ========================================================= */

function ProductCard({
  product,
}: {
  product: Product;
}) {
  const image = getProductImage(
    product.images?.[0]
  );

  const oldPrice = getOldPrice(
    Number(product.price),
    product.discount
  );

  const rating = Number(product.rating || 0);

  const stock = Number(product.stock || 0);

  return (
    <div className="group relative overflow-hidden rounded-[8px] border border-[#e0e8f0] bg-[#f8fbff] p-3.5 transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      {/* =====================================================
          IMAGE
          ===================================================== */}

      <div className="relative flex h-[245px] items-center justify-center overflow-hidden rounded-[5px] bg-[#e3ebf4]">

        <Image
          src={image}
          alt={product.name}
          width={300}
          height={300}
          sizes="(max-width: 575px) 90vw, (max-width: 767px) 45vw, (max-width: 1023px) 30vw, (max-width: 1279px) 23vw, 16vw)"
          className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105"
        />

        {/* =================================================
            DISCOUNT
            ================================================= */}

        {product.discount &&
          product.discount > 0 && (
            <span className="absolute left-0 top-0 rounded-br-[16px] bg-[#ee3347] px-4 py-1.5 text-sm font-semibold text-white">
              -{product.discount}%
            </span>
          )}

        {/* =================================================
            ACTION BUTTONS
            ================================================= */}

        <div className="absolute right-3 top-3 flex translate-x-10 flex-col gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">

          {/* Wishlist */}

          <Link
            href="/wishlist"
            aria-label="Add to wishlist"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition hover:bg-red-500 hover:text-white"
          >
            <Heart size={17} />
          </Link>

          {/* Compare */}

          <Link
            href="/compare"
            aria-label="Compare product"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition hover:bg-red-500 hover:text-white"
          >
            <ArrowLeftRight size={17} />
          </Link>

          {/* Quick View */}

          <Link
            href={`/shop-details/${product._id}`}
            aria-label="View product"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition hover:bg-red-500 hover:text-white"
          >
            <Eye size={17} />
          </Link>

        </div>
      </div>

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div className="px-1.5 pb-2 pt-5">

        {/* Product Name */}

        <h3 className="min-h-[48px] text-[16px] font-semibold leading-[23px] text-[#252525]">

          <Link
            href={`/shop-details/${product._id}`}
            className="transition hover:text-red-500"
          >
            {product.name}
          </Link>

        </h3>

        {/* =================================================
            RATING
            ================================================= */}

        <div className="mt-2 flex items-center gap-2">

          <div
            className="flex items-center gap-[1px] text-[18px] leading-none text-[#ff5a4f]"
            aria-label={`Rating ${rating} out of 5`}
          >
            {"★★★★★"}
          </div>

          <span className="ml-auto text-sm text-gray-400">
            ({rating})
          </span>

        </div>

        {/* =================================================
            PRICE
            ================================================= */}

        <div className="mt-2 flex items-center gap-2">

          <span className="text-[17px] font-bold text-[#171717]">
            ${Number(product.price).toFixed(2)}
          </span>

          {oldPrice !== null && (
            <del className="text-[14px] text-gray-400">
              ${oldPrice.toFixed(2)}
            </del>
          )}

        </div>

        {/* =================================================
            STOCK
            ================================================= */}

        <div className="mt-6 flex items-center gap-1.5 text-[13px]">

          <Check
            size={17}
            strokeWidth={2}
            className="text-[#4dcc9a]"
          />

          <span className="text-[#4dcc9a]">
            {stock > 0
              ? "In Stock"
              : "Out of Stock"}
          </span>

          {stock > 0 && (
            <span className="text-[#292929]">
              {stock} Products
            </span>
          )}

        </div>

        {/* =================================================
            ADD TO CART
            ================================================= */}

        <Link
          href={`/cart?product=${product._id}`}
          className="mt-7 flex h-[48px] w-full items-center justify-center rounded-[8px] border border-[#e0e8f0] bg-transparent text-[15px] font-semibold uppercase text-[#252525] transition duration-300 hover:border-black hover:bg-black hover:text-white"
        >
          Add To Cart
        </Link>

      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     FETCH DATA
     ======================================================= */

  useEffect(() => {
    const fetchTrendingProducts =
      async () => {
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

          const response = await fetch(
            `${apiUrl}/api/v1/products/home-sections`,
            {
              method: "GET",
              headers: {
                "Content-Type":
                  "application/json",
              },
              cache: "no-store",
            }
          );

          if (!response.ok) {
            throw new Error(
              `Failed to fetch products: ${response.status}`
            );
          }

          const result: ApiResponse =
            await response.json();

          console.log(
            "Trending Products API:",
            result
          );

          if (!result.success) {
            throw new Error(
              result.message ||
                "Failed to load products"
            );
          }

          /* ===============================================
             MOST SELLING = TRENDING PRODUCTS
             =============================================== */

          setProducts(
            result.data?.mostSelling || []
          );
        } catch (error) {
          console.error(
            "Trending Products Error:",
            error
          );

          setError(
            "Failed to load trending products."
          );

          setProducts([]);
        } finally {
          setLoading(false);
        }
      };

    fetchTrendingProducts();
  }, []);

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <section className="w-full overflow-hidden bg-[#f8fbff] py-10 md:py-12">

      <div className="mx-auto w-full max-w-[1810px] px-5 md:px-8">

        {/* =================================================
            HEADER
            ================================================= */}

        <div className="flex items-center justify-between">

          <div>

            <h2 className="inline-block border-b-2 border-red-500 pb-3 text-[30px] font-bold leading-none text-[#292929] md:text-[38px]">
              Trending Products
            </h2>

          </div>

          <Link
            href="/shop"
            className="hidden text-[18px] font-semibold text-black transition hover:text-red-500 md:block"
          >
            Explore All
          </Link>

        </div>

        {/* Bottom Line */}

        <div className="mt-[-2px] h-[2px] w-full bg-[#e1e8ef]" />

        {/* =================================================
            LOADING
            ================================================= */}

        {loading && (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-gray-500">
              Loading trending products...
            </p>
          </div>
        )}

        {/* =================================================
            ERROR
            ================================================= */}

        {!loading && error && (
          <div className="flex min-h-[400px] flex-col items-center justify-center">

            <p className="text-red-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-4 rounded-md bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Try Again
            </button>

          </div>
        )}

        {/* =================================================
            EMPTY
            ================================================= */}

        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="flex min-h-[400px] items-center justify-center">

              <p className="text-gray-500">
                No trending products found.
              </p>

            </div>
          )}

        {/* =================================================
            SLIDER
            ================================================= */}

        {!loading &&
          !error &&
          products.length > 0 && (
            <div className="mt-8">

              <Swiper
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  576: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },

                  768: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },

                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 22,
                  },

                  1280: {
                    slidesPerView: 5,
                    spaceBetween: 24,
                  },

                  1536: {
                    slidesPerView: 6,
                    spaceBetween: 24,
                  },
                }}
              >

                {products.map(
                  (product) => (
                    <SwiperSlide
                      key={product._id}
                    >
                      <ProductCard
                        product={product}
                      />
                    </SwiperSlide>
                  )
                )}

              </Swiper>

            </div>
          )}

        {/* =================================================
            MOBILE EXPLORE
            ================================================= */}

        <div className="mt-6 text-center md:hidden">

          <Link
            href="/shop"
            className="text-[17px] font-semibold text-black hover:text-red-500"
          >
            Explore All
          </Link>

        </div>

      </div>

    </section>
  );
}