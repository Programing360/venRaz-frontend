"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Smartphone,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";

type CartItem = {
  id: string;
  name: string;
  brand?: string;
  image: string;
  price: number;
  quantity: number;
};

const cartItems: CartItem[] = [
  {
    id: "1",
    name: "Resistance Loop Workout Bands",
    brand: "FlexFit",
    image: "/assets/img/product/product_1_1.png",
    price: 14.99,
    quantity: 2,
  },
  {
    id: "2",
    name: "High-Speed Electric Kitchen Blender",
    brand: "Aura Home",
    image: "/assets/img/product/product_2_1.png",
    price: 79.99,
    quantity: 1,
  },
  {
    id: "3",
    name: "Men Casual Slim-Fit Chino Pants",
    brand: "Urban Edge",
    image: "/assets/img/product/product_3_1.png",
    price: 42,
    quantity: 1,
  },
];

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  const [coupon, setCoupon] = useState("");

  const [couponApplied, setCouponApplied] =
    useState(false);

  const [placed, setPlaced] =
    useState(false);

  /* =========================================
     CALCULATIONS
  ========================================= */

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0,
    );
  }, []);

  const shipping = subtotal >= 100 ? 0 : 10;

  const discount = couponApplied
    ? subtotal * 0.1
    : 0;

  const total =
    subtotal + shipping - discount;

  /* =========================================
     COUPON
  ========================================= */

  function applyCoupon() {
    if (
      coupon.trim().toUpperCase() ===
      "SAVE10"
    ) {
      setCouponApplied(true);
    }
  }

  /* =========================================
     PLACE ORDER
  ========================================= */

  function handlePlaceOrder(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setPlaced(true);
  }

  /* =========================================
     SUCCESS
  ========================================= */

  if (placed) {
    return (
      <main className="min-h-screen bg-white py-20">
        <div className="mx-auto flex max-w-7xl justify-center px-5">
          <div className="max-w-md text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-3xl text-green-600">
              ✓
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Order Placed Successfully
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Thank you for your order.
              We have received your order
              and will process it shortly.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-flex rounded-lg bg-[#ff594d] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-black"
            >
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
            Checkout
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Complete your order by providing
            your shipping and payment details.
          </p>
        </div>

        <form
          onSubmit={handlePlaceOrder}
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">

            {/* =================================
                LEFT
            ================================= */}

            <div className="space-y-8">

              {/* SHIPPING ADDRESS */}

              <section className="rounded-xl border border-gray-200 p-6">

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1ef]">
                    <MapPin
                      size={19}
                      className="text-[#ff594d]"
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Shipping Address
                    </h2>

                    <p className="text-xs text-gray-500">
                      Where should we deliver
                      your order?
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">

                  {/* FIRST NAME */}

                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      placeholder="Enter first name"
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#ff594d] focus:ring-1 focus:ring-[#ff594d]"
                    />
                  </div>

                  {/* LAST NAME */}

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      placeholder="Enter last name"
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#ff594d] focus:ring-1 focus:ring-[#ff594d]"
                    />
                  </div>

                  {/* EMAIL */}

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#ff594d] focus:ring-1 focus:ring-[#ff594d]"
                    />
                  </div>

                  {/* PHONE */}

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+880 1XXXXXXXXX"
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#ff594d] focus:ring-1 focus:ring-[#ff594d]"
                    />
                  </div>

                  {/* ADDRESS */}

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="address"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Street Address
                    </label>

                    <input
                      id="address"
                      name="address"
                      type="text"
                      required
                      placeholder="House number, street name"
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#ff594d] focus:ring-1 focus:ring-[#ff594d]"
                    />
                  </div>

                  {/* CITY */}

                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      placeholder="Enter city"
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#ff594d] focus:ring-1 focus:ring-[#ff594d]"
                    />
                  </div>

                  {/* POSTAL CODE */}

                  <div>
                    <label
                      htmlFor="postalCode"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Postal Code
                    </label>

                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      required
                      placeholder="Enter postal code"
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#ff594d] focus:ring-1 focus:ring-[#ff594d]"
                    />
                  </div>

                </div>
              </section>

              {/* PAYMENT METHOD */}

              <section className="rounded-xl border border-gray-200 p-6">

                <h2 className="text-lg font-bold text-gray-900">
                  Payment Method
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Choose how you want to pay.
                </p>

                <div className="mt-6 space-y-3">

                  {/* COD */}

                  <label
                    className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition ${
                      paymentMethod === "cod"
                        ? "border-[#ff594d] bg-[#fff8f7]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={
                        paymentMethod ===
                        "cod"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value,
                        )
                      }
                      className="accent-[#ff594d]"
                    />

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                      <Wallet size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Cash on Delivery
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Pay when your order
                        arrives.
                      </p>
                    </div>
                  </label>

                  {/* CARD */}

                  <label
                    className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition ${
                      paymentMethod === "card"
                        ? "border-[#ff594d] bg-[#fff8f7]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={
                        paymentMethod ===
                        "card"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value,
                        )
                      }
                      className="accent-[#ff594d]"
                    />

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                      <CreditCard
                        size={19}
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Credit / Debit Card
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Pay securely using
                        your card.
                      </p>
                    </div>
                  </label>

                  {/* MOBILE BANKING */}

                  <label
                    className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition ${
                      paymentMethod ===
                      "mobile"
                        ? "border-[#ff594d] bg-[#fff8f7]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="mobile"
                      checked={
                        paymentMethod ===
                        "mobile"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value,
                        )
                      }
                      className="accent-[#ff594d]"
                    />

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                      <Smartphone
                        size={19}
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Mobile Banking
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Pay using your mobile
                        banking service.
                      </p>
                    </div>
                  </label>

                </div>
              </section>

            </div>

            {/* =================================
                RIGHT
            ================================= */}

            <aside>
              <div className="rounded-xl border border-gray-200 p-6 lg:sticky lg:top-24">

                <h2 className="text-xl font-bold text-gray-900">
                  Order Summary
                </h2>

                {/* PRODUCTS */}

                <div className="mt-6 space-y-4">

                  {cartItems.map(
                    (item) => (
                      <div
                        key={item.id}
                        className="flex gap-3"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#f5f6f8]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-contain p-1"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 text-sm font-medium text-gray-900">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-xs text-gray-500">
                            Qty:{" "}
                            {item.quantity}
                          </p>
                        </div>

                        <p className="text-sm font-semibold text-gray-900">
                          $
                          {(
                            item.price *
                            item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    ),
                  )}

                </div>

                {/* COUPON */}

                <div className="mt-6 border-t border-gray-200 pt-6">

                  <label
                    htmlFor="coupon"
                    className="text-sm font-semibold text-gray-800"
                  >
                    Coupon Code
                  </label>

                  <div className="mt-2 flex">

                    <input
                      id="coupon"
                      type="text"
                      value={coupon}
                      onChange={(e) =>
                        setCoupon(
                          e.target.value,
                        )
                      }
                      placeholder="Enter coupon"
                      className="min-w-0 flex-1 rounded-l-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-[#ff594d]"
                    />

                    <button
                      type="button"
                      onClick={
                        applyCoupon
                      }
                      className="rounded-r-lg bg-[#ff594d] px-4 text-sm font-semibold text-white transition hover:bg-black"
                    >
                      Apply
                    </button>

                  </div>

                  {couponApplied && (
                    <p className="mt-2 text-xs text-green-600">
                      Coupon applied —
                      10% discount added.
                    </p>
                  )}

                  {!couponApplied && (
                    <p className="mt-2 text-xs text-gray-400">
                      Try SAVE10 for 10%
                      off.
                    </p>
                  )}

                </div>

                {/* TOTALS */}

                <div className="mt-6 space-y-4 border-t border-gray-200 pt-6">

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span className="font-medium text-gray-900">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
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

                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">
                        Discount
                      </span>

                      <span className="font-medium text-green-600">
                        -$
                        {discount.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">
                        Total
                      </span>

                      <span className="text-2xl font-bold text-gray-900">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                </div>

                {/* PLACE ORDER */}

                <button
                  type="submit"
                  className="mt-7 w-full rounded-lg bg-[#ff594d] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-black"
                >
                  Place Order
                </button>

                {/* BACK TO CART */}

                <Link
                  href="/cart"
                  className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#ff594d]"
                >
                  <ArrowLeft size={16} />
                  Back to Cart
                </Link>

              </div>
            </aside>

          </div>
        </form>
      </div>
    </main>
  );
}