"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowUpRight, Star, Flame } from "lucide-react";
import { motion } from "framer-motion";

export default function BentoPromoSection() {
  return (
    <section className="w-full bg-[#f4f5f0] py-12 transition-colors duration-300 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          {/* ================= CARD 1: MORE PRODUCTS ================= */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="relative flex flex-col justify-between overflow-hidden rounded-[28px] bg-[#f9faf6] p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:bg-slate-900 md:col-span-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  More Products
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                  460 plus items.
                </p>
              </div>

              {/* Heart Badge */}
              <button
                type="button"
                aria-label="Favorite"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-transform active:scale-95 dark:bg-slate-800"
              >
                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
              </button>
            </div>

            {/* Product Thumbnails */}
            <div className="mt-8 flex items-center justify-between gap-3">
              {[
                {
                  id: 1,
                  src: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=300&q=80",
                  alt: "Audio Device",
                },
                {
                  id: 2,
                  src: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=300&q=80",
                  alt: "Earbuds",
                },
                {
                  id: 3,
                  src: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=300&q=80",
                  alt: "Smart Headset",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="relative flex aspect-square flex-1 items-center justify-center overflow-hidden rounded-2xl bg-slate-200/60 dark:bg-slate-800"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* ================= CARD 2: DOWNLOADS & REVIEWS ================= */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="relative flex flex-col items-center justify-between rounded-[28px] bg-[#f9faf6] p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:bg-slate-900 md:col-span-3"
          >
            {/* User Avatars */}
            <div className="flex -space-x-2 overflow-hidden">
              <Image
                width={48}
                height={48}
                className="inline-block h-12 w-12 rounded-full border-2 border-white object-cover dark:border-slate-900"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="User 1"
              />
              <Image
                width={48}
                height={48}
                className="inline-block h-12 w-12 rounded-full border-2 border-white object-cover dark:border-slate-900"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="User 2"
              />
              <Image
                width={48}
                height={48}
                className="inline-block h-12 w-12 rounded-full border-2 border-white object-cover dark:border-slate-900"
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
                alt="User 3"
              />
            </div>

            {/* Blue Stats Circle */}
            <div className="my-5 flex h-28 w-28 flex-col items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/20">
              <span className="text-2xl font-black leading-tight">5m+</span>
              <span className="text-[11px] font-medium opacity-90">
                Downloads
              </span>
            </div>

            {/* Review Badge */}
            <div className="flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 shadow-sm dark:bg-slate-800">
              <Star className="h-4 w-4 fill-lime-400 text-lime-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                4.6 reviews
              </span>
            </div>
          </motion.div>

          {/* ================= CARD 3: FEATURED BANNER ================= */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="relative flex min-h-[220px] overflow-hidden rounded-[28px] bg-[#f9faf6] p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:bg-slate-900 md:col-span-5"
          >
            {/* Left Column Content */}
            <div className="z-10 flex w-1/2 flex-col justify-between">
              <div>
                {/* Popular Pill */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
                  <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Popular
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-bold leading-snug tracking-tight text-slate-900 dark:text-white">
                  Listening Has Been Released
                </h3>
              </div>

              {/* Overlapping Audio Avatars */}
              <div className="mt-4 flex -space-x-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white dark:border-slate-900">
                  <Image
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80"
                    alt="Audio Gear"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white dark:border-slate-900">
                  <Image
                    src="https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=150&q=80"
                    alt="Headphones"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Column Image & Overlay Action */}
            <div className="relative w-1/2">
              <Image
                src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80"
                alt="Product in Hand"
                fill
                className="scale-110 object-cover object-center transition-transform duration-500 hover:scale-105"
              />

              {/* Arrow Button */}
              <Link
                href="/shop"
                aria-label="Explore Product"
                className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 shadow-md transition-transform hover:scale-110 active:scale-95 dark:bg-slate-800 dark:text-white"
              >
                <ArrowUpRight className="h-5 w-5" />
              </Link>

              {/* Rating Chip */}
              <div className="absolute bottom-1 right-1 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 backdrop-blur-md shadow-sm dark:bg-slate-800/90">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  4.7
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
