"use client";

import Link from "next/link";
import {
  ArrowRight,
  Shirt,
  Smartphone,
  Home,
  Sparkles,
  Dumbbell,
  BookOpen,
  Baby,
  ShoppingBasket,
  Headphones,
  Watch,
  Laptop,
  Gamepad2,
} from "lucide-react";

const categories = [
  {
    name: "Fashion",
    description: "Trendy clothing and accessories",
    icon: Shirt,
    items: "1,250+ Products",
  },
  {
    name: "Electronics",
    description: "Latest gadgets and technology",
    icon: Smartphone,
    items: "980+ Products",
  },
  {
    name: "Home & Living",
    description: "Everything for your beautiful home",
    icon: Home,
    items: "1,100+ Products",
  },
  {
    name: "Beauty",
    description: "Beauty and personal care products",
    icon: Sparkles,
    items: "750+ Products",
  },
  {
    name: "Sports",
    description: "Sports gear and fitness essentials",
    icon: Dumbbell,
    items: "620+ Products",
  },
  {
    name: "Books",
    description: "Books for learning and entertainment",
    icon: BookOpen,
    items: "890+ Products",
  },
  {
    name: "Baby & Kids",
    description: "Products for babies and children",
    icon: Baby,
    items: "540+ Products",
  },
  {
    name: "Grocery",
    description: "Daily essentials and groceries",
    icon: ShoppingBasket,
    items: "1,500+ Products",
  },
  {
    name: "Audio",
    description: "Headphones, speakers and more",
    icon: Headphones,
    items: "430+ Products",
  },
  {
    name: "Watches",
    description: "Stylish watches for every occasion",
    icon: Watch,
    items: "320+ Products",
  },
  {
    name: "Computers",
    description: "Laptops, PCs and accessories",
    icon: Laptop,
    items: "680+ Products",
  },
  {
    name: "Gaming",
    description: "Gaming consoles and accessories",
    icon: Gamepad2,
    items: "390+ Products",
  },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* =========================
          HERO SECTION
      ========================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fff5f3] via-white to-[#fff1ef] pb-20 pt-28">

        {/* Decorative shapes */}
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#ff594d]/5" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#ff594d]/5" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-3xl text-center">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#ff594d]/10 px-4 py-2 text-sm font-semibold text-[#ff594d]">
              <ShoppingBasket className="h-4 w-4" />
              Explore Categories
            </div>

            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Find Everything
              <span className="block text-[#ff594d]">
                You Need
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Explore our wide range of categories and discover thousands
              of quality products from trusted sellers.
            </p>

          </div>
        </div>
      </section>

      {/* =========================
          CATEGORY SECTION
      ========================== */}
      <section className="py-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>
              <p className="font-semibold uppercase tracking-wider text-[#ff594d]">
                Shop By Category
              </p>

              <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Browse Our Categories
              </h2>

              <p className="mt-3 max-w-2xl text-gray-500">
                Choose a category to find the products you&apos;re looking
                for.
              </p>
            </div>

            <Link
              href="/product"
              className="inline-flex items-center gap-2 font-semibold text-[#ff594d] transition hover:gap-3"
            >
              View All Products
              <ArrowRight className="h-5 w-5" />
            </Link>

          </div>

          {/* Categories Grid */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  href={`/product?category=${encodeURIComponent(
                    category.name
                  )}`}
                  className="group"
                >
                  <div className="h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#ff594d]/30 hover:shadow-xl">

                    {/* Icon */}
                    <div className="flex items-center justify-between">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff594d]/10 transition duration-300 group-hover:bg-[#ff594d]">
                        <Icon className="h-7 w-7 text-[#ff594d] transition group-hover:text-white" />
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 transition group-hover:bg-[#ff594d]/10">
                        <ArrowRight className="h-4 w-4 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-[#ff594d]" />
                      </div>

                    </div>

                    {/* Content */}
                    <h3 className="mt-6 text-xl font-bold text-gray-900 transition group-hover:text-[#ff594d]">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {category.description}
                    </p>

                    <p className="mt-4 text-sm font-semibold text-[#ff594d]">
                      {category.items}
                    </p>

                  </div>
                </Link>
              );
            })}

          </div>
        </div>
      </section>

      {/* =========================
          FEATURED CATEGORY CTA
      ========================== */}
      <section className="bg-gray-50 py-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="overflow-hidden rounded-3xl bg-[#ff594d]">

            <div className="grid items-center lg:grid-cols-2">

              {/* Content */}
              <div className="px-6 py-12 sm:px-12 lg:py-16">

                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>

                <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
                  Discover Something
                  <span className="block">New Today</span>
                </h2>

                <p className="mt-5 max-w-lg leading-7 text-white/90">
                  From fashion and electronics to home essentials and
                  everyday products, VenRaz has something for everyone.
                </p>

                <Link
                  href="/product"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-[#ff594d] transition hover:bg-gray-100"
                >
                  Explore Products
                  <ArrowRight className="h-5 w-5" />
                </Link>

              </div>

              {/* Right Visual */}
              <div className="hidden h-full min-h-[350px] items-center justify-center bg-[#e94d43] lg:flex">

                <div className="grid grid-cols-2 gap-5">

                  <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white shadow-lg">
                    <Shirt className="h-14 w-14 text-[#ff594d]" />
                  </div>

                  <div className="mt-8 flex h-32 w-32 items-center justify-center rounded-3xl bg-white shadow-lg">
                    <Smartphone className="h-14 w-14 text-[#ff594d]" />
                  </div>

                  <div className="-mt-8 flex h-32 w-32 items-center justify-center rounded-3xl bg-white shadow-lg">
                    <Home className="h-14 w-14 text-[#ff594d]" />
                  </div>

                  <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white shadow-lg">
                    <ShoppingBasket className="h-14 w-14 text-[#ff594d]" />
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================
          BOTTOM CTA
      ========================== */}
      <section className="py-20">

        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">

          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Browse all our products and use filters or search to quickly
            find exactly what you need.
          </p>

          <Link
            href="/product"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#ff594d] px-7 py-3.5 font-semibold text-white shadow-lg shadow-[#ff594d]/20 transition hover:bg-[#e94d43]"
          >
            Browse All Products
            <ArrowRight className="h-5 w-5" />
          </Link>

        </div>
      </section>

    </main>
  );
}