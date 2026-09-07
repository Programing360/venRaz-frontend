
"use client";

import Link from "next/link";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  Heart,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">

      {/* =========================
          HERO SECTION
      ========================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fff5f3] via-white to-[#fff1ef] pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Left Content */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#ff594d]/10 px-4 py-2 text-sm font-semibold text-[#ff594d]">
                <ShoppingBag className="h-4 w-4" />
                About VenRaz
              </div>

              <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Shopping Made
                <span className="block text-[#ff594d]">
                  Simple & Enjoyable
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
                Welcome to VenRaz, your trusted online shopping destination.
                We bring quality products, trusted sellers, and a smooth
                shopping experience together in one place.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#ff594d] px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-[#e94d43]"
                >
                  Start Shopping
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <Link
                  href="/contact"
                  className="rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-semibold text-gray-700 transition hover:border-[#ff594d] hover:text-[#ff594d]"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="relative mx-auto max-w-md">

                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[#ff594d]/10" />
                <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-orange-100" />

                <div className="relative rounded-[2rem] bg-[#ff594d] p-8 shadow-2xl">
                  <div className="rounded-3xl bg-white p-8">

                    <ShoppingBag className="mx-auto h-24 w-24 text-[#ff594d]" />

                    <h3 className="mt-6 text-center text-2xl font-bold text-gray-900">
                      Your Trusted
                    </h3>

                    <p className="mt-2 text-center text-gray-500">
                      Online Shopping Partner
                    </p>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-gray-50 p-4 text-center">
                        <p className="text-2xl font-bold text-[#ff594d]">
                          10K+
                        </p>
                        <p className="text-sm text-gray-500">
                          Products
                        </p>
                      </div>

                      <div className="rounded-2xl bg-gray-50 p-4 text-center">
                        <p className="text-2xl font-bold text-[#ff594d]">
                          5K+
                        </p>
                        <p className="text-sm text-gray-500">
                          Customers
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================
          OUR STORY
      ========================== */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Visual */}
            <div className="relative order-2 lg:order-1">
              <div className="rounded-3xl bg-gray-100 p-8 sm:p-12">

                <div className="grid grid-cols-2 gap-5">

                  <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <ShieldCheck className="h-9 w-9 text-[#ff594d]" />
                    <h3 className="mt-4 font-bold text-gray-900">
                      Trusted
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Safe & reliable shopping
                    </p>
                  </div>

                  <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                    <Truck className="h-9 w-9 text-[#ff594d]" />
                    <h3 className="mt-4 font-bold text-gray-900">
                      Fast Delivery
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Quick doorstep delivery
                    </p>
                  </div>

                  <div className="-mt-4 rounded-2xl bg-white p-6 shadow-sm">
                    <Heart className="h-9 w-9 text-[#ff594d]" />
                    <h3 className="mt-4 font-bold text-gray-900">
                      Customer First
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Your satisfaction matters
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <Award className="h-9 w-9 text-[#ff594d]" />
                    <h3 className="mt-4 font-bold text-gray-900">
                      Quality
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Quality products
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">

              <p className="font-semibold uppercase tracking-wider text-[#ff594d]">
                Our Story
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Making Online Shopping
                <span className="text-[#ff594d]"> Better</span>
              </h2>

              <p className="mt-6 leading-7 text-gray-600">
                VenRaz was created with a simple goal — to make online
                shopping easier, safer, and more enjoyable for everyone.
              </p>

              <p className="mt-4 leading-7 text-gray-600">
                We connect customers with trusted sellers and a wide range
                of products. From everyday essentials to the latest
                products, our platform is designed to help you find what
                you need quickly and conveniently.
              </p>

              <div className="mt-7 space-y-4">

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#ff594d]" />
                  <span className="text-gray-700">
                    Quality products from trusted sellers
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#ff594d]" />
                  <span className="text-gray-700">
                    Secure and convenient shopping
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#ff594d]" />
                  <span className="text-gray-700">
                    Fast and reliable delivery
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#ff594d]" />
                  <span className="text-gray-700">
                    Customer-focused support
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================
          WHY CHOOSE US
      ========================== */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold uppercase tracking-wider text-[#ff594d]">
              Why VenRaz
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Us?
            </h2>

            <p className="mt-4 text-gray-600">
              We focus on providing a simple, secure, and enjoyable
              shopping experience for every customer.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {/* Card 1 */}
            <div className="rounded-2xl bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff594d]/10">
                <ShoppingBag className="h-7 w-7 text-[#ff594d]" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Wide Selection
              </h3>

              <p className="mt-3 leading-6 text-gray-500">
                Explore a wide range of products and discover something
                perfect for you.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff594d]/10">
                <ShieldCheck className="h-7 w-7 text-[#ff594d]" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Secure Shopping
              </h3>

              <p className="mt-3 leading-6 text-gray-500">
                Your privacy and security are important to us at every
                step of your shopping journey.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff594d]/10">
                <Truck className="h-7 w-7 text-[#ff594d]" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Fast Delivery
              </h3>

              <p className="mt-3 leading-6 text-gray-500">
                We work to get your favorite products delivered to your
                doorstep quickly.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff594d]/10">
                <Users className="h-7 w-7 text-[#ff594d]" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Customer First
              </h3>

              <p className="mt-3 leading-6 text-gray-500">
                Our customers are at the heart of everything we do.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================
          MISSION SECTION
      ========================== */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">

          <div className="rounded-3xl bg-[#ff594d] px-6 py-14 text-white shadow-xl sm:px-12">

            <Heart className="mx-auto h-12 w-12" />

            <h2 className="mt-6 text-3xl font-extrabold sm:text-4xl">
              Our Mission
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/90">
              Our mission is to create a trusted marketplace where
              customers can discover quality products, shop with
              confidence, and enjoy a seamless online shopping experience.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-[#ff594d] transition hover:bg-gray-100"
            >
              Explore Products
              <ArrowRight className="h-5 w-5" />
            </Link>

          </div>
        </div>
      </section>

      {/* =========================
          CTA
      ========================== */}
      <section className="border-t border-gray-100 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">

          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Ready to Start Shopping?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            Discover amazing products and enjoy a better way to shop with
            VenRaz.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="rounded-xl bg-[#ff594d] px-7 py-3.5 font-semibold text-white shadow-md transition hover:bg-[#e94d43]"
            >
              Shop Now
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-gray-200 px-7 py-3.5 font-semibold text-gray-700 transition hover:border-[#ff594d] hover:text-[#ff594d]"
            >
              Get in Touch
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}

