"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartPageSkeleton } from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems,
    shipping,
    total,
    isLoaded,
    clearCart,
  } = useCart();

  if (!isLoaded) {
    return <CartPageSkeleton />;
  }

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center bg-[#fcfdfd] py-16">
        <EmptyState
          type="cart"
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added any products to your cart yet. Explore our latest electronics and gadget deals!"
          actionText="Start Shopping"
          actionHref="/shop"
        />
      </main>
    );
  }

  const freeShippingThreshold = 100;
  const neededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <main className="min-h-screen bg-[#fcfdfd] py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Title */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              You have {totalItems} {totalItems === 1 ? "item" : "items"} in your cart.
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-semibold text-rose-500 hover:text-rose-700 hover:underline transition"
          >
            Clear Entire Cart
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="mb-8 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2 text-slate-700">
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#ff594d]" />
              {neededForFreeShipping > 0
                ? `Add $${neededForFreeShipping.toFixed(2)} more for FREE standard shipping!`
                : "🎉 Congratulations! You unlocked FREE shipping!"}
            </span>
            <span className="font-bold text-[#ff594d]">
              {shippingProgress.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-[#ff594d] h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        {/* Main Grid: Items List & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <section className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
              {items.map((item) => {
                const itemTotal = item.price * item.quantity;
                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:bg-slate-50/50"
                  >
                    {/* Image and Title */}
                    <div className="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
                      <Link
                        href={`/products/${item.id}`}
                        className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center p-2"
                      >
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-contain p-1"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <Link href={`/products/${item.id}`}>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 hover:text-[#ff594d] transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        {item.brand && (
                          <span className="text-xs text-slate-400 font-medium mt-0.5 block">
                            {item.brand}
                          </span>
                        )}
                        <p className="text-sm font-bold text-[#ff594d] mt-1 sm:hidden">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Price (Desktop) */}
                    <div className="hidden sm:block text-right w-24">
                      <span className="text-sm font-bold text-slate-900">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, "decrease")}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-9 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, "increase")}
                          disabled={!!item.stock && item.quantity >= item.stock}
                          className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right min-w-[70px]">
                        <span className="text-sm font-extrabold text-slate-900">
                          ${itemTotal.toFixed(2)}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Back to Shop Link */}
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#ff594d] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          </section>

          {/* Cart Summary Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24 space-y-6">
              <h2 className="text-lg font-bold text-slate-900">
                Order Summary
              </h2>

              <div className="space-y-3.5 border-t border-slate-100 pt-4 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-bold text-slate-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-bold">
                    {shipping === 0 ? (
                      <span className="text-emerald-600">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900">
                    Estimated Total
                  </span>
                  <span className="text-2xl font-black text-[#ff594d]">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-[#ff594d] hover:bg-black text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-red-500/20 transition-all duration-200"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Security badges */}
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>SSL Encrypted & Guaranteed Safe Checkout</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}