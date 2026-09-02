
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";

type Product = {
  _id: string;
  name: string;
  images?: string[];
  price: number;
  discount?: number;
  rating?: number;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: {
    featured: Product[];
    flashSale: Product[];
    topRated: Product[];
    mostSelling: Product[];
    newArrivals: Product[];
  };
};

/* =========================================================
   PRODUCT IMAGE HELPER
   ========================================================= */

const getProductImage = (images?: string[]) => {
  const image = images?.[0];

  // No image
  if (!image) {
    return "/assets/product/product_3_2.png";
  }

  // Dummy/example image
  if (image.includes("example.com")) {
    return "/assets/product/product_3_2.png";
  }

  return image;
};

/* =========================================================
   RATING STARS
   ========================================================= */

const getRatingStars = (rating = 0) => {
  const roundedRating = Math.round(rating);

  return Array.from({ length: 5 }, (_, index) =>
    index < roundedRating ? "★" : "☆"
  ).join("");
};

/* =========================================================
   COMPONENT
   ========================================================= */

export default function FeaturedProducts() {
  const swiperRef = useRef<SwiperType | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     FETCH FEATURED PRODUCTS
     ======================================================= */

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not configured in .env.local"
          );
        }

        const response = await fetch(
          `${apiUrl}/api/v1/products/home-sections`,
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
            `Failed to fetch products. Status: ${response.status}`
          );
        }

        const result: ApiResponse = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Failed to load featured products."
          );
        }

        setProducts(result.data?.featured || []);
      } catch (error) {
        console.error("Featured Products Error:", error);

        setError("Failed to load featured products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <section
        id="shop-sec"
        className="w-full overflow-hidden bg-[#f8fbff] py-10 md:py-14"
      >
        <div className="mx-auto w-full max-w-[1800px] px-7 md:px-10">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="inline-block px-0.5 pt-1 text-[30px] font-bold leading-[1.15] text-[#292929] md:text-[40px]">
                Featured Products
              </h2>

              <div className="h-[2px] w-[172px] bg-red-500" />
            </div>

            <Link
              href="/shop"
              className="mb-3 hidden text-[18px] font-medium text-black transition-colors hover:text-red-500 md:block md:text-[23px]"
            >
              Explore All
            </Link>
          </div>

          <div className="h-[2px] w-full bg-[#dce4eb]" />

          <div className="flex min-h-[500px] items-center justify-center">
            <p className="text-lg text-gray-500">
              Loading products...
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* =======================================================
     MAIN RETURN
     ======================================================= */

  return (
    <section
      id="shop-sec"
      className="w-full overflow-hidden bg-[#f8fbff] py-10 md:py-14"
    >
      <div className="mx-auto w-full max-w-[1800px] px-7 md:px-10">
        {/* =================================================
            HEADER
            ================================================= */}

        <div className="flex items-end justify-between">
          <div>
            <h2 className="inline-block px-0.5 pt-1 text-[30px] font-bold leading-[1.15] text-[#292929] md:text-[40px]">
              Featured Products
            </h2>

            <div className="h-[2px] w-[172px] bg-red-500" />
          </div>

          <Link
            href="/shop"
            className="mb-3 hidden text-[18px] font-medium text-black transition-colors hover:text-red-500 md:block md:text-[23px]"
          >
            Explore All
          </Link>
        </div>

        {/* Gray Header Line */}

        <div className="h-[2px] w-full bg-[#dce4eb]" />

        {/* =================================================
            ERROR
            ================================================= */}

        {error && (
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-red-500">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-md bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-red-500"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* =================================================
            EMPTY
            ================================================= */}

        {!error && products.length === 0 && (
          <div className="flex min-h-[500px] items-center justify-center">
            <p className="text-lg text-gray-500">
              No featured products found.
            </p>
          </div>
        )}

        {/* =================================================
            SLIDER
            ================================================= */}

        {!error && products.length > 0 && (
          <div className="relative mt-8">
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              slidesPerView={1}
              spaceBetween={24}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },

                768: {
                  slidesPerView: 1,
                },

                1200: {
                  slidesPerView: 2,
                },
              }}
            >
              {products.map((product) => {
                const rating = product.rating ?? 0;
                const imageUrl = getProductImage(product.images);

                return (
                  <SwiperSlide key={product._id}>
                    {/* =========================================
                        PRODUCT CARD
                        ========================================= */}

                    <div className="flex min-h-[500px] w-full items-center rounded-[7px] border border-[#dbe4ec] bg-[#f8fbff] p-6 md:p-[25px]">
                      {/* =====================================
                          IMAGE
                          ===================================== */}

                      <div className="relative h-[380px] w-[53%] shrink-0 overflow-hidden rounded-[7px] bg-[#dce7f1] md:h-[450px]">
                        <Image
                          src={imageUrl}
                          alt={product.name || "Product image"}
                          fill
                          sizes="(max-width: 767px) 53vw, (max-width: 1199px) 53vw, 450px"
                          className="object-contain transition-transform duration-500 hover:scale-105"
                          priority={false}
                        />
                      </div>

                      {/* =====================================
                          CONTENT
                          ===================================== */}

                      <div className="flex flex-1 flex-col justify-center pl-7 md:pl-10">
                        {/* Product Name */}

                        <h3 className="max-w-[350px] text-[19px] font-semibold leading-[1.45] text-[#171717] md:text-[23px]">
                          <Link
                            href={`/shop-details/${product._id}`}
                            className="transition-colors hover:text-red-500"
                          >
                            {product.name}
                          </Link>
                        </h3>

                        {/* =================================
                            RATING
                            ================================= */}

                        <div className="mt-3 flex flex-wrap items-center gap-3 md:gap-4">
                          <span
                            className="whitespace-nowrap text-[18px] tracking-[1px] text-[#ff5b4f] md:text-[20px]"
                            aria-label={`Rated ${rating} out of 5`}
                          >
                            {getRatingStars(rating)}
                          </span>

                          <span className="whitespace-nowrap text-[13px] text-gray-500 md:text-[14px]">
                            ({rating} rating)
                          </span>
                        </div>

                        {/* =================================
                            PRICE
                            ================================= */}

                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[19px] font-bold text-[#17243a] md:text-[21px]">
                            ${Number(product.price || 0).toFixed(2)}
                          </span>

                          {product.discount &&
                            product.discount > 0 && (
                              <del className="text-[13px] text-[#999] md:text-[14px]">
                                $
                                {(
                                  product.price /
                                  (1 - product.discount / 100)
                                ).toFixed(2)}
                              </del>
                            )}
                        </div>

                        {/* =================================
                            ADD TO CART
                            ================================= */}

                        <Link
                          href="/cart"
                          className="mt-8 flex h-[51px] w-fit items-center justify-center rounded-[7px] bg-[#171717] px-6 text-[14px] font-bold text-white transition-all duration-300 hover:bg-red-500 md:px-7"
                        >
                          ADD TO CART
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* =============================================
                PREVIOUS BUTTON
                ============================================= */}

            <button
              type="button"
              aria-label="Previous product"
              onClick={() => swiperRef.current?.slidePrev()}
              className="group absolute left-[-20px] top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#dce4eb] bg-white shadow-md transition-all duration-300 hover:bg-black md:flex"
            >
              <ChevronLeft
                size={28}
                strokeWidth={2}
                className="text-black transition-colors group-hover:text-white"
              />
            </button>

            {/* =============================================
                NEXT BUTTON
                ============================================= */}

            <button
              type="button"
              aria-label="Next product"
              onClick={() => swiperRef.current?.slideNext()}
              className="group absolute right-[-20px] top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#dce4eb] bg-white shadow-md transition-all duration-300 hover:bg-black md:flex"
            >
              <ChevronRight
                size={28}
                strokeWidth={2}
                className="text-black transition-colors group-hover:text-white"
              />
            </button>
          </div>
        )}

        {/* =================================================
            MOBILE EXPLORE
            ================================================= */}

        <div className="mt-6 text-center md:hidden">
          <Link
            href="/shop"
            className="text-lg font-semibold text-black hover:text-red-500"
          >
            Explore All
          </Link>
        </div>
      </div>
    </section>
  );
}

