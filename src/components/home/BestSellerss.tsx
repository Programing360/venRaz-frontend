"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  data?: HomeSectionsData;
};

type Category = {
  id: string;
  name: string;
  products: Product[];
};

/* =========================================================
   FALLBACK IMAGE
   ========================================================= */

const FALLBACK_IMAGE = "/assets/product/product_3_2.png";

/* =========================================================
   PRODUCT IMAGE HELPER
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
   PRODUCT CARD
   ========================================================= */

function ProductCard({
  product,
}: {
  product: Product;
}) {
  const price = Number(product.price || 0);
  const rating = Number(product.rating || 0);

  const oldPrice = getOldPrice(
    price,
    product.discount
  );

  const image = getProductImage(product.images);

  return (
    <div className="group flex min-h-[190px] items-center gap-4 rounded-lg border border-[#dce5ee] bg-transparent px-4 py-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:gap-6 md:gap-8">

      {/* =================================================
          IMAGE
          ================================================= */}

      <div className="flex h-[130px] w-[120px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#e2eaf3] sm:h-[145px] sm:w-[145px] md:h-[156px] md:w-[168px]">

        <Image
          src={image}
          alt={product.name || "Product image"}
          width={150}
          height={150}
          className="h-[105px] w-[105px] object-contain transition-transform duration-300 group-hover:scale-105 sm:h-[120px] sm:w-[120px] md:h-[125px] md:w-[125px]"
        />

      </div>

      {/* =================================================
          CONTENT
          ================================================= */}

      <div className="flex min-w-0 flex-1 flex-col justify-center">

        {/* PRODUCT NAME */}

        <h3 className="line-clamp-2 max-w-[330px] text-[14px] font-semibold leading-[1.55] text-[#080808] sm:text-[15px]">

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

        <div className="mt-2 flex items-center gap-3 sm:gap-5">

          <div
            className="flex items-center text-[17px] leading-none text-[#ff574d] sm:text-[20px]"
            aria-label={`Rated ${rating} out of 5`}
          >
            {Array.from(
              { length: 5 },
              (_, index) => (
                <span key={index}>
                  {index < Math.round(rating)
                    ? "★"
                    : "☆"}
                </span>
              )
            )}
          </div>

          <span className="text-[12px] text-[#8c98a5] sm:text-[14px]">
            ({rating})
          </span>

        </div>

        {/* =================================================
            PRICE
            ================================================= */}

        <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-5">

          <span className="text-[17px] font-bold text-[#080808] sm:text-[20px]">
            ${price.toFixed(2)}
          </span>

          {product.discount &&
            product.discount > 0 && (
              <del className="text-[13px] text-[#929292] sm:text-[14px]">
                ${oldPrice.toFixed(2)}
              </del>
            )}

        </div>

        {/* =================================================
            STOCK
            ================================================= */}

        <div className="mt-2 text-[12px] text-[#4dcc9a] sm:mt-3 sm:text-[13px]">

          {product.stock && product.stock > 0
            ? `In Stock • ${product.stock} Products`
            : "Out of Stock"}

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function BestSellers() {

  /* =======================================================
     STATES
     ======================================================= */

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [activeTab, setActiveTab] =
    useState("best-deals");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     FETCH API
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

        const result: ApiResponse =
          await response.json();

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to load products"
          );
        }

        const data = result.data || {};

        /* =================================================
           MAP API DATA TO TABS
           ================================================= */

        const dynamicCategories: Category[] = [
          {
            id: "best-deals",
            name: "Best Deals",
            products:
              data.featured || [],
          },

          {
            id: "phones",
            name: "Phones & Tablets",
            products:
              data.mostSelling || [],
          },

          {
            id: "laptops",
            name: "Laptops & Computers",
            products:
              data.newArrivals || [],
          },

          {
            id: "video",
            name: "Video & Audios",
            products:
              data.topRated || [],
          },

          {
            id: "accessories",
            name: "Accessories",
            products:
              data.flashSale || [],
          },

          {
            id: "cameras",
            name: "Cameras",
            products:
              data.featured || [],
          },
        ];

        setCategories(
          dynamicCategories
        );

      } catch (error) {

        console.error(
          "Best Sellers Error:",
          error
        );

        setError(
          "Failed to load products."
        );

        setCategories([]);

      } finally {

        setLoading(false);

      }
    };

    fetchProducts();

  }, []);

  /* =======================================================
     ACTIVE CATEGORY
     ======================================================= */

  const activeCategory =
    categories.find(
      (category) =>
        category.id === activeTab
    ) || categories[0];

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <section className="w-full bg-[#f7faff] py-12 lg:py-14">

        <div className="mx-auto max-w-[1860px] px-4 sm:px-6 lg:px-8">

          <h2 className="text-[36px] font-bold text-[#080808] sm:text-[40px]">
            Best Sellers
          </h2>

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
      <section className="w-full bg-[#f7faff] py-12 lg:py-14">

        <div className="mx-auto max-w-[1860px] px-4 sm:px-6 lg:px-8">

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
     MAIN
     ======================================================= */

  return (
    <section className="w-full overflow-hidden bg-[#f7faff] py-12 lg:py-14">

      <div className="mx-auto max-w-[1860px] px-4 sm:px-6 lg:px-8">

        {/* =================================================
            HEADER
            ================================================= */}

        <div className="mb-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

          {/* TITLE */}

          <div className="relative shrink-0">

            <h2 className="text-[36px] font-bold leading-tight tracking-[-0.5px] text-[#080808] sm:text-[40px]">
              Best Sellers
            </h2>

            <div className="relative mt-4 h-[2px] w-[237px] bg-[#dbe3ec]">

              <span className="absolute left-0 top-0 h-[2px] w-[173px] bg-[#ff574d]" />

            </div>

          </div>

          {/* =================================================
              TABS
              ================================================= */}

          <div className="flex flex-wrap items-center justify-start gap-3 xl:justify-end">

            {categories.map(
              (category) => {

                const isActive =
                  activeTab ===
                  category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        category.id
                      )
                    }
                    className={`rounded-lg border px-3 py-2.5 text-[14px] font-semibold whitespace-nowrap transition-all duration-200 sm:px-4 sm:text-[16px] ${
                      isActive
                        ? "border-[#ff574d] bg-[#ff574d] text-white"
                        : "border-[#dbe3ec] bg-transparent text-[#080808] hover:border-[#ff574d] hover:text-[#ff574d]"
                    }`}
                  >
                    {category.name}
                  </button>
                );
              }
            )}

          </div>

        </div>

        {/* =================================================
            EMPTY
            ================================================= */}

        {!activeCategory ||
        activeCategory.products.length === 0 ? (

          <div className="flex min-h-[300px] items-center justify-center">

            <p className="text-gray-500">
              No products found.
            </p>

          </div>

        ) : (

          /* =================================================
             PRODUCTS - MAX 6
             ================================================= */

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 2xl:grid-cols-3">

            {activeCategory.products
              .slice(0, 6)
              .map((product) => (

                <ProductCard
                  key={product._id}
                  product={product}
                />

              ))}

          </div>

        )}

      </div>

    </section>
  );
}