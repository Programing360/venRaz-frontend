"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Tag,
  Wallet,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import EmptyState from "@/components/common/EmptyState";

export default function CheckoutPage() {
  const { items, subtotal, shipping, clearCart } = useCart();
  const { success, error, warning } = useToast();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [coupon, setCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<{
    orderId: string;
    trackingId: string;
    total: number;
    paymentMethod: string;
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "Dhaka",
    postalCode: "",
    notes: "",
  });

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, subtotal + shipping - discountAmount);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCoupon = coupon.trim().toUpperCase();
    if (!cleanCoupon) {
      warning("Please enter a coupon code first.");
      return;
    }

    if (cleanCoupon === "SAVE10" || cleanCoupon === "VENRAZ10") {
      setDiscountPercent(10);
      success("🎉 Coupon 'SAVE10' applied! 10% discount added to your order.");
    } else if (cleanCoupon === "VIP20") {
      setDiscountPercent(20);
      success("🔥 VIP Promo applied! 20% discount added to your order.");
    } else {
      error("Invalid or expired coupon code. Try 'SAVE10' or 'VIP20'.");
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address) {
      error("Please fill in your Full Name, Phone Number, and Address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const generatedOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const generatedTrackingId = `TRK-${Date.now().toString().slice(-6)}`;

      const orderPayload = {
        orderId: generatedOrderId,
        trackingId: generatedTrackingId,
        customer: formData,
        items,
        subtotal,
        shipping,
        discount: discountAmount,
        total: finalTotal,
        paymentMethod,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      // Attempt to send to Backend API
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (API_URL) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);
          await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderPayload),
            signal: controller.signal,
          }).finally(() => clearTimeout(timeoutId));
        } catch (apiErr) {
          console.warn("Backend order API not reachable, saved locally.", apiErr);
        }
      }

      // Save order to localStorage for tracking verification
      try {
        const existingOrders = JSON.parse(
          localStorage.getItem("venraz_orders") || "[]"
        );
        existingOrders.unshift(orderPayload);
        localStorage.setItem("venraz_orders", JSON.stringify(existingOrders));
      } catch (err) {
        console.error("Failed to store order in localStorage", err);
      }

      setPlacedOrder({
        orderId: generatedOrderId,
        trackingId: generatedTrackingId,
        total: finalTotal,
        paymentMethod,
      });

      clearCart();
      success(`Order placed successfully! Tracking ID: ${generatedTrackingId}`);
    } catch (err) {
      console.error("Checkout order error:", err);
      error("Something went wrong while placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Success Screen
  if (placedOrder) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center bg-[#fcfdfd] py-16 px-4">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Thank you for shopping with VenRaz. Your order has been placed and is currently being processed.
          </p>

          {/* Tracking Details Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left space-y-3 mb-8 text-xs sm:text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Order ID</span>
              <span className="font-bold text-slate-900">{placedOrder.orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Tracking Number</span>
              <span className="font-mono font-bold text-[#ff594d] bg-red-50 px-2 py-0.5 rounded">
                {placedOrder.trackingId}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Payment Method</span>
              <span className="font-medium text-slate-900 uppercase">
                {placedOrder.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : placedOrder.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-2.5">
              <span className="font-bold text-slate-900">Total Paid</span>
              <span className="text-base font-extrabold text-slate-900">
                ${placedOrder.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/order-tracking?id=${placedOrder.trackingId}`}
              className="flex-1 bg-[#ff594d] hover:bg-black text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-red-500/20 transition-all duration-200 text-sm"
            >
              Track Order Live
            </Link>
            <Link
              href="/shop"
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 px-6 rounded-xl transition text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Empty Cart Guard
  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center bg-[#fcfdfd] py-16">
        <EmptyState
          type="cart"
          title="Your Cart is Empty"
          description="You cannot proceed to checkout with an empty cart. Please add some products to your cart first!"
          actionText="Explore Shop"
          actionHref="/shop"
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfdfd] py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#ff594d] transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Checkout & Payment
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Shipping Form & Payment Selection */}
          <section className="lg:col-span-7 space-y-6">
            <form onSubmit={handlePlaceOrder} className="space-y-6" id="checkout-form">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="p-2 rounded-lg bg-red-50 text-[#ff594d]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Shipping Information
                    </h2>
                    <p className="text-xs text-slate-500">
                      Where should we deliver your package?
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Tanvir Hasan"
                      className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff594d] focus:ring-1 focus:ring-[#ff594d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +880 1712 345678"
                      className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff594d] focus:ring-1 focus:ring-[#ff594d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff594d] focus:ring-1 focus:ring-[#ff594d]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="House, Road, Area, Ward"
                      className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff594d] focus:ring-1 focus:ring-[#ff594d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      City / Region
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff594d] focus:ring-1 focus:ring-[#ff594d] bg-white"
                    >
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barisal">Barisal</option>
                      <option value="Rangpur">Rangpur</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="e.g. 1216"
                      className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff594d] focus:ring-1 focus:ring-[#ff594d]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Payment Method
                    </h2>
                    <p className="text-xs text-slate-500">
                      Select your preferred way to pay
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-center gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition ${
                      paymentMethod === "cod"
                        ? "border-[#ff594d] bg-red-50/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#ff594d]"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900">
                        Cash on Delivery
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Pay upon receiving package
                      </p>
                    </div>
                  </label>

                  {/* Online / Card Payment */}
                  <label
                    className={`flex items-center gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition ${
                      paymentMethod === "card"
                        ? "border-[#ff594d] bg-red-50/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#ff594d]"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900">
                        Card / Mobile Banking
                      </p>
                      <p className="text-[11px] text-slate-500">
                        bKash, Nagad, Visa, Mastercard
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </section>

          {/* Order Summary & Coupon */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24 space-y-5">
              <h2 className="text-lg font-bold text-slate-900">
                Your Order ({items.length} {items.length === 1 ? "item" : "items"})
              </h2>

              {/* Order Items Preview */}
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 shrink-0 overflow-hidden flex items-center justify-center p-1">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-slate-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="pt-4 border-t border-slate-100">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Coupon (try 'SAVE10')"
                      className="w-full text-xs border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-[#ff594d]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-[#ff594d] text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </form>

              {/* Price Breakdown */}
              <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-bold">
                    {shipping === 0 ? <span className="text-emerald-600">FREE</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                  <span className="text-base font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-black text-[#ff594d]">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Place Order Submit Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full bg-[#ff594d] hover:bg-black text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-red-500/20 transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>Place Order (${finalTotal.toFixed(2)})</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Encrypted 256-bit SSL Payment Protection</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}