"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  Check,
  Flame,
  Heart,
  ArrowLeftRight,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

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
  flashSalePrice?: number;
};

type HomeSectionsData = {
  featured?: Product[];
  flashSale?: Product[];
  topRated?: Product[];
  mostSelling?: Product[];
  newArrivals?: Product[];
};

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: HomeSectionsData | Product[];
};

/* =========================================================
   FALLBACK IMAGE
   ========================================================= */

const FALLBACK_IMAGE = "/placeholder.svg";

/* =========================================================
   PRODUCT IMAGE HELPER (FIXED)
   ========================================================= */

function getProductImage(images?: string[]): string {
  const image = images?.[0];

  if (!image) {
    return FALLBACK_IMAGE;
  }

  if (
    image.includes("example.com") ||
    image.includes("placehold.co") ||
    image.includes("placeholder")
  ) {
    return FALLBACK_IMAGE;
  }

  return image;
}

/* =========================================================
   COUNTDOWN
   ========================================================= */

const saleEnd = new Date("2026-12-12T23:59:59");

function getCountdown() {
  const difference = saleEnd.getTime() - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

/* =========================================================
   OLD PRICE
   ========================================================= */

function getOldPrice(price: number, discount?: number) {
  if (!discount || discount <= 0 || discount >= 100) {
    return price;
  }

  return price / (1 - discount / 100);
}

/* =========================================================
   RATING
   ========================================================= */

function getRatingStars(rating = 0) {
  const roundedRating = Math.round(rating);

  return Array.from({ length: 5 }, (_, index) =>
    index < roundedRating ? "★" : "☆",
  );
}

/* =========================================================
   PRODUCT CARD (FIXED IMAGE SRC)
   ========================================================= */

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const rating = Number(product.rating ?? 0);
  const stock = Number(product.stock ?? 0);
const price = Number(product.flashSalePrice ?? product.price ?? 0);

  const oldPrice =
    product.flashSalePrice !== undefined && product.flashSalePrice !== null
      ? Number(product.price ?? 0)
      : getOldPrice(price, product.discount);
  // Directly returns primary string image path
  const image = getProductImage(product.images);

  const handleAddToCart = async () => {
    if (adding || added) return;
    setAdding(true);
    await addToCart(product, 1);
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative h-full overflow-hidden rounded-lg border border-[#dce5ee] bg-transparent">
      {/* IMAGE */}
      <div className="relative mx-2 mt-2 flex h-[243px] items-center justify-center overflow-hidden rounded-lg bg-[#e3ebf4]">
        <Image
          src={image} // FIX: image variable is already a string
          alt={product.name || "Product image"}
          width={230}
          height={230}
          className="h-[190px] w-[230px] object-contain transition-transform duration-300 group-hover:scale-105"
          unoptimized={
            image.startsWith("http://") || image.startsWith("https://")
          }
        />

        {/* DISCOUNT */}
        {product.discount !== undefined && product.discount > 0 && (
          <span className="absolute left-0 top-0 rounded-br-[16px] rounded-tl-[7px] bg-[#ed2939] px-3 py-1 text-[14px] font-bold text-white">
            -{product.discount}%
          </span>
        )}

        {/* ACTIONS */}
        <div className="absolute right-3 top-3 flex translate-x-10 flex-col gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <Link
            href="/wishlist"
            aria-label="Add to wishlist"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition-colors hover:bg-[#ed2939] hover:text-white"
          >
            <Heart size={17} />
          </Link>

          <Link
            href="/compare"
            aria-label="Compare product"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition-colors hover:bg-[#ed2939] hover:text-white"
          >
            <ArrowLeftRight size={17} />
          </Link>

          <button
            type="button"
            aria-label="Quick view"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition-colors hover:bg-[#ed2939] hover:text-white"
          >
            <Eye size={17} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex min-h-[255px] flex-col px-6 pb-6 pt-5">
        <h3 className="min-h-[52px] text-[16px] font-semibold leading-[1.45] text-[#111]">
          <Link
            href={`/shop-details/${product._id}`}
            className="transition-colors hover:text-[#ed2939]"
          >
            {product.name}
          </Link>
        </h3>

        {/* RATING */}
        <div className="mt-2 flex items-center gap-5">
          <div
            className="flex gap-[1px] text-[19px] leading-none text-[#ff594d]"
            aria-label={`Rated ${rating} out of 5`}
          >
            {getRatingStars(rating).map((star, index) => (
              <span key={index}>{star}</span>
            ))}
          </div>

          <span className="text-[13px] text-[#999]">({rating})</span>
        </div>

        {/* PRICE */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[17px] font-bold text-[#111]">
            ${price.toFixed(2)}
          </span>

          {product.discount !== undefined && product.discount > 0 && (
            <del className="text-[14px] text-[#999]">
              ${oldPrice.toFixed(2)}
            </del>
          )}
        </div>

        {/* STOCK */}
        <div className="mt-5 flex items-center gap-1.5 text-[13px]">
          <Check
            size={15}
            strokeWidth={1.8}
            className={stock > 0 ? "text-[#18b875]" : "text-red-500"}
          />

          <span className={stock > 0 ? "text-[#18b875]" : "text-red-500"}>
            {stock > 0 ? "In Stock" : "Out of Stock"}
          </span>

          {stock > 0 && <span className="text-[#111]">{stock} Products</span>}
        </div>

        {/* ADD TO CART */}
        <button
          type="button"
          disabled={stock <= 0 || adding}
          onClick={handleAddToCart}
          className={`mt-auto flex h-[48px] w-full items-center justify-center rounded-lg border bg-transparent text-[15px] font-semibold uppercase transition-all duration-300 ${
            stock <= 0
              ? "cursor-not-allowed border-gray-300 text-gray-400"
              : added
                ? "border-[#18b875] bg-[#18b875] text-white"
                : "border-[#dce5ee] text-[#111] hover:border-[#ed2939] hover:bg-[#ed2939] hover:text-white"
          }`}
        >
          {adding ? (
            <Loader2 size={18} className="animate-spin" />
          ) : added ? (
            <>
              <Check size={18} className="mr-1.5" />
              Added
            </>
          ) : stock <= 0 ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingBag size={18} className="mr-1.5" />
              Add To Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function FlashSale() {
  const swiperRef = useRef<SwiperType | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  /* FETCH FLASH SALE PRODUCTS (FIXED PAYLOAD EXTRACTION) */
  useEffect(() => {
    const fetchFlashSaleProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("NEXT_PUBLIC_API_URL is not configured");
        }

        const response = await fetch(`${apiUrl}/products/flash-sale`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const result: ApiResponse = await response.json();
        console.log(response);
        if (!result.success) {
          throw new Error(
            result.message || "Failed to load flash sale products",
          );
        }

        const data = result.data;

        // FIX: Extract dynamic array safely
        let flashSaleProducts: Product[] = [];
        if (Array.isArray(data)) {
          flashSaleProducts = data;
        } else if (data && typeof data === "object") {
          flashSaleProducts = data.flashSale ?? [];
        }

        setProducts(flashSaleProducts);
      } catch (err: unknown) {
        console.warn("Flash Sale API call issue, checking data flow:", err);
        setError("Could not load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSaleProducts();
  }, []);

  /* COUNTDOWN */
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      setTime(getCountdown());
    }, 0);

    const interval = window.setInterval(() => {
      setTime(getCountdown());
    }, 1000);

    return () => {
      clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <section className="overflow-hidden bg-[#f7faff] py-[60px] md:py-[70px]">
      <div className="mx-auto w-full max-w-[1860px] px-5 lg:px-8">
        {/* HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-7 xl:flex-row xl:items-center">
          <div>
            <h2 className="text-[30px] font-bold leading-none text-[#111] sm:text-[34px] md:text-[38px]">
              Flash Sale Today
            </h2>
            <div className="relative mt-5 h-[2px] w-[250px] bg-[#dce5ee] sm:w-[308px]">
              <span className="absolute left-0 top-0 h-[2px] w-[150px] bg-[#ff594d] sm:w-[172px]" />
            </div>
          </div>

          {/* TIMER & EXPLORE */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <Flame
                size={27}
                strokeWidth={2.5}
                className="fill-[#ed2939] text-[#ed2939] sm:h-[30px] sm:w-[30px]"
              />
              <span className="text-[15px] font-semibold text-[#ed2939] sm:text-[18px]">
                Hurry up! Sale end in:
              </span>
            </div>

            <div className="flex h-[52px] w-[57px] flex-col items-center justify-center rounded-lg bg-[#ed2939] text-white">
              <span className="text-[17px] font-bold leading-none">
                {mounted ? String(time.days).padStart(2, "0") : "00"}
              </span>
              <span className="mt-1 text-[12px]">Days</span>
            </div>

            <div className="flex h-[52px] w-[57px] flex-col items-center justify-center rounded-lg bg-[#ed2939] text-white">
              <span className="text-[17px] font-bold leading-none">
                {mounted ? String(time.hours).padStart(2, "0") : "00"}
              </span>
              <span className="mt-1 text-[12px]">Hours</span>
            </div>

            <div className="flex h-[52px] w-[57px] flex-col items-center justify-center rounded-lg bg-[#ed2939] text-white">
              <span className="text-[17px] font-bold leading-none">
                {mounted ? String(time.minutes).padStart(2, "0") : "00"}
              </span>
              <span className="mt-1 text-[12px]">Mins</span>
            </div>

            <div className="flex h-[52px] w-[57px] flex-col items-center justify-center rounded-lg bg-[#ed2939] text-white">
              <span className="text-[17px] font-bold leading-none">
                {mounted ? String(time.seconds).padStart(2, "0") : "00"}
              </span>
              <span className="mt-1 text-[12px]">Secs</span>
            </div>

            <Link
              href="/shop"
              className="ml-1 text-[16px] font-semibold text-[#111] transition-colors hover:text-[#ed2939] sm:text-[18px]"
            >
              Explore All
            </Link>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-lg text-gray-500">
              Loading flash sale products...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-red-500">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-md bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-[#ed2939]"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && products.length === 0 && (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-lg text-gray-500">
              No flash sale products found.
            </p>
          </div>
        )}

        {/* PRODUCT SLIDER */}
        {!loading && !error && products.length > 0 && (
          <div className="relative mt-8">
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              slidesPerView={1}
              spaceBetween={16}
              loop={products.length > 4}
              speed={600}
              breakpoints={{
                0: { slidesPerView: 1, spaceBetween: 16 },
                480: { slidesPerView: 1, spaceBetween: 18 },
                640: { slidesPerView: 2, spaceBetween: 18 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 22 },
                1280: { slidesPerView: 5, spaceBetween: 22 },
                1536: { slidesPerView: 6, spaceBetween: 24 },
              }}
            >
              {products.map((product) => (
                <SwiperSlide key={product._id} className="h-auto">
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* PREVIOUS ARROW */}
            <button
              type="button"
              aria-label="Previous products"
              onClick={() => swiperRef.current?.slidePrev()}
              className="group absolute left-[-18px] top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#dce5ee] bg-white shadow-md transition-all duration-300 hover:bg-black md:flex lg:left-[-22px]"
            >
              <ChevronLeft
                size={26}
                strokeWidth={2}
                className="text-black transition-colors group-hover:text-white"
              />
            </button>

            {/* NEXT ARROW */}
            <button
              type="button"
              aria-label="Next products"
              onClick={() => swiperRef.current?.slideNext()}
              className="group absolute right-[-18px] top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#dce5ee] bg-white shadow-md transition-all duration-300 hover:bg-black md:flex lg:right-[-22px]"
            >
              <ChevronRight
                size={26}
                strokeWidth={2}
                className="text-black transition-colors group-hover:text-white"
              />
            </button>
          </div>
        )}

        {/* MOBILE EXPLORE */}
        <div className="mt-7 text-center md:hidden">
          <Link
            href="/shop"
            className="text-[17px] font-semibold text-black transition-colors hover:text-[#ed2939]"
          >
            Explore All
          </Link>
        </div>
      </div>
    </section>
  );
}
