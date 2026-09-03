"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { useMemo, useState } from "react";

type CartItem = {
  id: string;
  name: string;
  brand?: string;
  image: string;
  price: number;
  quantity: number;
  stock?: number;
};

const initialCart: CartItem[] = [
  {
    id: "1",
    name: "Resistance Loop Workout Bands",
    brand: "FlexFit",
    image: "/assets/img/product/product_1_1.png",
    price: 14.99,
    quantity: 2,
    stock: 50,
  },
  {
    id: "2",
    name: "High-Speed Electric Kitchen Blender",
    brand: "Aura Home",
    image: "/assets/img/product/product_2_1.png",
    price: 79.99,
    quantity: 1,
    stock: 30,
  },
  {
    id: "3",
    name: "Men Casual Slim-Fit Chino Pants",
    brand: "Urban Edge",
    image: "/assets/img/product/product_3_1.png",
    price: 42,
    quantity: 1,
    stock: 50,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] =
    useState<CartItem[]>(initialCart);

  /* =========================================
     QUANTITY
  ========================================= */

  function updateQuantity(
    id: string,
    type: "increase" | "decrease",
  ) {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id !== id) {
          return item;
        }

        if (
          type === "increase" &&
          item.stock &&
          item.quantity >= item.stock
        ) {
          return item;
        }

        return {
          ...item,
          quantity:
            type === "increase"
              ? item.quantity + 1
              : Math.max(
                  1,
                  item.quantity - 1,
                ),
        };
      }),
    );
  }

  /* =========================================
     REMOVE PRODUCT
  ========================================= */

  function removeItem(id: string) {
    setCartItems((items) =>
      items.filter(
        (item) => item.id !== id,
      ),
    );
  }

  /* =========================================
     CART CALCULATIONS
  ========================================= */

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0,
    );
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0,
    );
  }, [cartItems]);

  const shipping =
    subtotal >= 100 || subtotal === 0
      ? 0
      : 10;

  const total = subtotal + shipping;

  /* =========================================
     EMPTY CART
  ========================================= */

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-white py-20">
        <div className="mx-auto flex max-w-7xl justify-center px-5">
          <div className="max-w-md text-center">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#fff1ef]">
              <ShoppingBag
                size={42}
                className="text-[#ff594d]"
              />
            </div>

            <h1 className="mt-7 text-3xl font-bold text-gray-900">
              Your Cart is Empty
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              You haven't added any
              products to your cart yet.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#ff594d] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-black"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </Link>

          </div>
        </div>
      </main>
    );
  }

  /* =========================================
     MAIN
  ========================================= */

  return (
    <main className="min-h-screen bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5">

        {/* HEADER */}

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Shopping Cart
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {totalItems}{" "}
            {totalItems === 1
              ? "item"
              : "items"}{" "}
            in your cart
          </p>
        </div>

        {/* CONTENT */}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">

          {/* ===================================
              CART ITEMS
          =================================== */}

          <section>

            {/* TABLE HEADER */}

            <div className="hidden border-y border-gray-200 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 md:grid md:grid-cols-[1fr_100px_140px_100px] md:gap-5">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span className="text-right">
                Total
              </span>
            </div>

            {/* CART ITEMS */}

            <div className="divide-y divide-gray-200">

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="py-6"
                >
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_100px_140px_100px] md:items-center md:gap-5">

                    {/* PRODUCT */}

                    <div className="flex min-w-0 items-center gap-4">

                      <Link
                        href={`/products/${item.id}`}
                        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#f5f6f8]"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-contain p-2"
                        />
                      </Link>

                      <div className="min-w-0">

                        <Link
                          href={`/products/${item.id}`}
                        >
                          <h2 className="line-clamp-2 text-sm font-semibold text-gray-900 transition hover:text-[#ff594d] md:text-base">
                            {item.name}
                          </h2>
                        </Link>

                        {item.brand && (
                          <p className="mt-1 text-sm text-gray-500">
                            {item.brand}
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(
                              item.id,
                            )
                          }
                          className="mt-3 flex items-center gap-1 text-xs text-red-500 hover:text-red-700 md:hidden"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>

                      </div>
                    </div>

                    {/* PRICE */}

                    <div>
                      <span className="mb-1 block text-xs text-gray-400 md:hidden">
                        Price
                      </span>

                      <p className="font-semibold text-gray-900">
                        $
                        {item.price.toFixed(
                          2,
                        )}
                      </p>
                    </div>

                    {/* QUANTITY */}

                    <div>
                      <span className="mb-1 block text-xs text-gray-400 md:hidden">
                        Quantity
                      </span>

                      <div className="flex h-10 w-fit items-center overflow-hidden rounded-lg border border-gray-200">

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              "decrease",
                            )
                          }
                          disabled={
                            item.quantity <= 1
                          }
                          className="flex h-full w-10 items-center justify-center transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Minus size={15} />
                        </button>

                        <span className="flex h-full min-w-10 items-center justify-center border-x border-gray-200 text-sm font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              "increase",
                            )
                          }
                          disabled={
                            !!item.stock &&
                            item.quantity >=
                              item.stock
                          }
                          className="flex h-full w-10 items-center justify-center transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus size={15} />
                        </button>

                      </div>
                    </div>

                    {/* ITEM TOTAL */}

                    <div className="flex items-center justify-between md:block md:text-right">

                      <span className="text-xs text-gray-400 md:hidden">
                        Total
                      </span>

                      <p className="font-bold text-gray-900">
                        $
                        {(
                          item.price *
                          item.quantity
                        ).toFixed(2)}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(
                            item.id,
                          )
                        }
                        className="mt-2 hidden items-center justify-end gap-1 text-xs text-red-500 hover:text-red-700 md:flex"
                      >
                        <Trash2 size={13} />
                        Remove
                      </button>

                    </div>

                  </div>
                </div>
              ))}

            </div>

            {/* CONTINUE SHOPPING */}

            <div className="mt-6">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-[#ff594d]"
              >
                <ArrowLeft size={17} />
                Continue Shopping
              </Link>
            </div>

          </section>

          {/* ===================================
              CART SUMMARY
          =================================== */}

          <aside>

            <div className="rounded-xl border border-gray-200 bg-white p-6 lg:sticky lg:top-24">

              <h2 className="text-xl font-bold text-gray-900">
                Cart Summary
              </h2>

              {/* SUMMARY */}

              <div className="mt-6 space-y-4 border-t border-gray-200 pt-6">

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Items
                  </span>

                  <span className="font-medium text-gray-900">
                    {totalItems}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Shipping
                  </span>

                  <span className="font-medium text-gray-900">
                    {shipping === 0
                      ? "Free"
                      : `$${shipping.toFixed(
                          2,
                        )}`}
                  </span>
                </div>

                {/* TOTAL */}

                <div className="border-t border-gray-200 pt-5">

                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-900">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                </div>

              </div>

              {/* CHECKOUT */}

              <Link
                href="/checkout"
                className="mt-7 flex w-full items-center justify-center rounded-lg bg-[#ff594d] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-black"
              >
                Proceed To Checkout
              </Link>

            </div>

          </aside>

        </div>
      </div>
    </main>
  );
}