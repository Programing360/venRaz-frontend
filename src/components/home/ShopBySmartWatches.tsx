"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Heart,
  ArrowLeftRight,
  Eye,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

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

type HomeSectionsResponse = {
  success: boolean;
  message?: string;
  data?: {
    featured?: Product[];
    flashSale?: Product[];
    topRated?: Product[];
    mostSelling?: Product[];
    newArrivals?: Product[];
  };
};

/* =========================================================
   FALLBACK IMAGE
========================================================= */

const FALLBACK_IMAGE = "/assets/product/product_5_1.png";

/* =========================================================
   GET PRODUCT IMAGE
========================================================= */

function getProductImage(images?: string[]) {
  const image = images?.[0];

  if (!image) {
    return FALLBACK_IMAGE;
  }

  if (image.includes("example.com")) {
    return FALLBACK_IMAGE;
  }

  return image;
}

/* =========================================================
   OLD PRICE
========================================================= */

function getOldPrice(price: number, discount?: number) {
  if (
    !discount ||
    discount <= 0 ||
    discount >= 100
  ) {
    return price;
  }

  return price / (1 - discount / 100);
}

/* =========================================================
   RATING
========================================================= */

function getRatingStars(rating = 0) {
  const rounded = Math.round(rating);

  return Array.from(
    { length: 5 },
    (_, index) => (index < rounded ? "★" : "☆")
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({
  product,
}: {
  product: Product;
}) {
  const rating = product.rating ?? 0;
  const stock = product.stock ?? 0;

  const price = Number(product.price || 0);

  const oldPrice = getOldPrice(
    price,
    product.discount
  );

  const image = getProductImage(
    product.images
  );

  return (
    <div className="group overflow-hidden">

      {/* =================================================
          IMAGE
      ================================================= */}

      <div className="relative flex h-[245px] items-center justify-center overflow-hidden rounded-lg bg-[#f3f6f9]">

        <Image
          src={image}
          alt={product.name || "Product image"}
          width={250}
          height={250}
          className="h-[210px] w-[210px] object-contain transition-transform duration-500 group-hover:scale-105"
        />

        {/* DISCOUNT */}

        {product.discount !== undefined &&
          product.discount > 0 && (
            <span className="absolute left-0 top-0 rounded-br-xl bg-[#ff574d] px-3 py-1 text-sm font-semibold text-white">
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
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition hover:bg-[#ff574d] hover:text-white"
          >
            <Heart size={17} />
          </Link>

          {/* Compare */}

          <Link
            href="/compare"
            aria-label="Compare product"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition hover:bg-[#ff574d] hover:text-white"
          >
            <ArrowLeftRight size={17} />
          </Link>

          {/* Quick View */}

          <button
            type="button"
            aria-label="Quick view"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition hover:bg-[#ff574d] hover:text-white"
          >
            <Eye size={17} />
          </button>
        </div>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="pt-5">

        {/* PRODUCT NAME */}

        <h3 className="min-h-[48px] text-[15px] font-semibold leading-6 text-[#111]">

          <Link
            href={`/shop-details/${product._id}`}
            className="transition-colors hover:text-[#ff574d]"
          >
            {product.name}
          </Link>

        </h3>

        {/* =================================================
            RATING
        ================================================= */}

        <div className="mt-2 flex items-center gap-4">

          <div
            className="flex gap-[1px] text-[18px] leading-none text-[#ff574d]"
            aria-label={`Rated ${rating} out of 5`}
          >
            {getRatingStars(rating).map(
              (star, index) => (
                <span key={index}>
                  {star}
                </span>
              )
            )}
          </div>

          <span className="text-[13px] text-gray-400">
            ({rating})
          </span>

        </div>

        {/* =================================================
            PRICE
        ================================================= */}

        <div className="mt-3 flex items-center gap-2">

          <span className="text-[17px] font-bold text-[#111]">
            ${price.toFixed(2)}
          </span>

          {product.discount !== undefined &&
            product.discount > 0 && (
              <del className="text-[13px] text-gray-400">
                ${oldPrice.toFixed(2)}
              </del>
            )}

        </div>

        {/* =================================================
            STOCK
        ================================================= */}

        <div className="mt-3 flex items-center gap-1.5 text-[13px]">

          <Check
            size={15}
            strokeWidth={2}
            className={
              stock > 0
                ? "text-[#17b978]"
                : "text-red-500"
            }
          />

          <span
            className={
              stock > 0
                ? "text-[#17b978]"
                : "text-red-500"
            }
          >
            {stock > 0
              ? "In Stock"
              : "Out of Stock"}
          </span>

          {stock > 0 && (
            <span className="text-[#111]">
              {stock} Products
            </span>
          )}

        </div>

        {/* =================================================
            ADD TO CART
        ================================================= */}

        <Link
          href={`/cart?product=${product._id}`}
          className="mt-6 flex h-11 w-full items-center justify-center overflow-hidden rounded-md bg-[#111] text-[14px] font-semibold uppercase text-white transition-all duration-300 hover:bg-[#ff574d]"
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

export default function SmartWatches() {

  /* =======================================================
     STATES
  ======================================================= */

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     SWIPER REF
  ======================================================= */

  const swiperRef =
    useRef<SwiperType | null>(null);

  /* =======================================================
     FETCH PRODUCTS
  ======================================================= */

  useEffect(() => {
    const fetchProducts = async () => {
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

        const result: HomeSectionsResponse =
          await response.json();

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to load products"
          );
        }

      

        const featuredProducts =
          result.data?.featured ?? [];

        setProducts(
          featuredProducts
        );

      } catch (err) {
        console.error(
          "Smart Watches Error:",
          err
        );

        setError(
          "Failed to load smart watch products."
        );

        setProducts([]);

      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <section className="overflow-hidden bg-white pb-16">
        <div className="mx-auto max-w-[1860px] px-5 lg:px-8">

          <div className="flex items-center justify-between">

            <h2 className="text-[30px] font-bold text-[#111] sm:text-[34px]">
              Shop By Smart Watches
            </h2>

            <Link
              href="/shop"
              className="border-b-2 border-[#111] pb-1 text-[15px] font-semibold"
            >
              Explore All
            </Link>

          </div>

          <div className="mt-10 flex min-h-[300px] items-center justify-center">

            <p className="text-gray-500">
              Loading products...
            </p>

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
      <section className="overflow-hidden bg-white pb-16">
        <div className="mx-auto max-w-[1860px] px-5 lg:px-8">

          <div className="flex items-center justify-between">

            <h2 className="text-[30px] font-bold text-[#111] sm:text-[34px]">
              Shop By Smart Watches
            </h2>

            <Link
              href="/shop"
              className="border-b-2 border-[#111] pb-1 text-[15px] font-semibold"
            >
              Explore All
            </Link>

          </div>

          <div className="flex min-h-[300px] items-center justify-center">

            <div className="text-center">

              <p className="text-red-500">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="mt-4 rounded-md bg-black px-5 py-2 text-sm font-medium text-white hover:bg-[#ff574d]"
              >
                Try Again
              </button>

            </div>

          </div>

        </div>
      </section>
    );
  }

  /* =======================================================
     EMPTY
  ======================================================= */

  if (products.length === 0) {
    return (
      <section className="overflow-hidden bg-white pb-16">
        <div className="mx-auto max-w-[1860px] px-5 lg:px-8">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            <h2 className="text-center text-[30px] font-bold text-[#111] sm:text-left sm:text-[34px]">
              Shop By Smart Watches
            </h2>

            <Link
              href="/shop"
              className="text-center text-[15px] font-semibold sm:text-right"
            >
              Explore All
            </Link>

          </div>

          <div className="mt-10 flex min-h-[300px] items-center justify-center">

            <p className="text-gray-500">
              No products found.
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
    <section className="overflow-hidden bg-white pb-16">

      <div className="mx-auto max-w-[1860px] px-5 lg:px-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          {/* TITLE */}

          <div>
            <h2 className="text-center text-[30px] font-bold leading-tight text-[#111] sm:text-left sm:text-[34px]">
              Shop By Smart Watches
            </h2>
          </div>

          {/* EXPLORE */}

          <div className="text-center sm:text-right">

            <Link
              href="/shop"
              className="inline-block border-b-2 border-[#111] pb-1 text-[15px] font-semibold text-[#111] transition hover:border-[#ff574d] hover:text-[#ff574d]"
            >
              Explore All
            </Link>

          </div>

        </div>

        {/* BOTTOM LINE */}

        <div className="mt-5 h-px w-full bg-[#e1e7ed]" />

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="mt-10 grid grid-cols-1 gap-8 xl:grid-cols-12">

          {/* =================================================
              PRODUCT SLIDER
          ================================================= */}

          <div className="min-w-0 xl:col-span-9 2xl:col-span-10">

            <div className="relative">

              {/* PREVIOUS BUTTON */}

              <button
                type="button"
                onClick={() =>
                  swiperRef.current?.slidePrev()
                }
                aria-label="Previous products"
                className="absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full border border-[#dce5ee] bg-white text-[#111] shadow-md transition hover:bg-[#ff574d] hover:text-white"
              >
                <ChevronLeft size={20} />
              </button>

              {/* NEXT BUTTON */}

              <button
                type="button"
                onClick={() =>
                  swiperRef.current?.slideNext()
                }
                aria-label="Next products"
                className="absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-[#dce5ee] bg-white text-[#111] shadow-md transition hover:bg-[#ff574d] hover:text-white"
              >
                <ChevronRight size={20} />
              </button>

              {/* =================================================
                  SWIPER
              ================================================= */}

              <Swiper
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                spaceBetween={20}
                slidesPerView={1}
                loop={products.length > 5}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 16,
                  },

                  480: {
                    slidesPerView: 1,
                    spaceBetween: 16,
                  },

                  640: {
                    slidesPerView: 2,
                    spaceBetween: 18,
                  },

                  768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },

                  992: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },

                  1200: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },

                  1300: {
                    slidesPerView: 4,
                    spaceBetween: 22,
                  },

                  /*
                   * Desktop = 5 products
                   */

                  1500: {
                    slidesPerView: 5,
                    spaceBetween: 24,
                  },
                }}
                className="!pb-2"
              >

                {products.map((product) => (
                  <SwiperSlide
                    key={product._id}
                  >
                    <ProductCard
                      product={product}
                    />
                  </SwiperSlide>
                ))}

              </Swiper>

            </div>

          </div>

          {/* =================================================
              COLLECTION BANNER
          ================================================= */}

          <div className="xl:col-span-3 2xl:col-span-2">

            <div className="group relative h-full min-h-[450px] overflow-hidden rounded-lg bg-[#f3f6f9]">

              {/* IMAGE */}

              <Image
                src="/assets/collection_1_4.jpg"
                alt="Apple Watch Series 9"
                fill
                sizes="(max-width: 1280px) 100vw, 20vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* OVERLAY */}

              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />

              {/* CONTENT */}

              <div className="absolute left-6 top-7 z-10">

                <h3 className="max-w-[220px] text-[22px] font-bold leading-7 text-white">
                  Apple Watch Series 9 GPS 41mm
                </h3>

                <h4 className="mt-3 text-[20px] font-bold text-[#ff574d]">
                  30% Off
                </h4>

                <Link
                  href="/shop"
                  className="mt-5 inline-block border-b-2 border-white pb-1 text-sm font-semibold text-white transition hover:border-[#ff574d] hover:text-[#ff574d]"
                >
                  Shop now
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}