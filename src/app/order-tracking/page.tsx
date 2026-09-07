"use client";

import Link from "next/link";
import {
  Search,
  Package,
  Check,
  Clock,
  Truck,
  MapPin,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";

/* =========================================================
   TYPES
========================================================= */

type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

type TrackingStep = {
  status: OrderStatus;
  title: string;
  description: string;
  date?: string;
};

/* =========================================================
   STATUS ORDER
========================================================= */

const statusOrder: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

/* =========================================================
   DEMO ORDER
========================================================= */

const demoOrder = {
  trackingId: "TRK-2026-00125",
  orderId: "#ORD-00125",
  status: "Shipped" as OrderStatus,
  estimatedDelivery: "September 06, 2026",
  placedAt: "September 02, 2026",
};

/* =========================================================
   TRACKING STEPS
========================================================= */

const trackingSteps: TrackingStep[] = [
  {
    status: "Pending",
    title: "Order Placed",
    description:
      "Your order has been placed successfully.",
    date: "Sep 02, 2026 • 10:30 AM",
  },
  {
    status: "Confirmed",
    title: "Confirmed",
    description:
      "Your order has been confirmed by the seller.",
    date: "Sep 02, 2026 • 11:15 AM",
  },
  {
    status: "Processing",
    title: "Processing",
    description:
      "Your order is being prepared for shipment.",
    date: "Sep 03, 2026 • 09:20 AM",
  },
  {
    status: "Shipped",
    title: "Shipped",
    description:
      "Your package has left the seller facility.",
    date: "Sep 04, 2026 • 02:45 PM",
  },
  {
    status: "Out for Delivery",
    title: "Out for Delivery",
    description:
      "Your package is on the way to your address.",
  },
  {
    status: "Delivered",
    title: "Delivered",
    description:
      "Your order has been delivered successfully.",
  },
];

/* =========================================================
   ICON
========================================================= */

function getStatusIcon(
  status: OrderStatus,
) {
  switch (status) {
    case "Pending":
      return <Clock size={18} />;

    case "Confirmed":
      return <Check size={18} />;

    case "Processing":
      return <Package size={18} />;

    case "Shipped":
      return <Truck size={18} />;

    case "Out for Delivery":
      return <MapPin size={18} />;

    case "Delivered":
      return <Check size={18} />;

    case "Cancelled":
      return <XCircle size={18} />;

    default:
      return <Package size={18} />;
  }
}

/* =========================================================
   PAGE
========================================================= */

export default function OrderTrackingPage() {
  const [trackingId, setTrackingId] =
    useState("");

  const [searchedId, setSearchedId] =
    useState("");

  const [error, setError] =
    useState("");

  /* =======================================================
     TRACK ORDER
  ======================================================= */

  function handleTrackOrder(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const value =
      trackingId.trim().toUpperCase();

    if (!value) {
      setError(
        "Please enter your tracking ID.",
      );
      setSearchedId("");
      return;
    }

    if (
      value !==
      demoOrder.trackingId
    ) {
      setError(
        "No order found with this tracking ID.",
      );
      setSearchedId("");
      return;
    }

    setError("");
    setSearchedId(value);
  }

  /* =======================================================
     STATUS INDEX
  ======================================================= */

  const currentStatusIndex =
    statusOrder.indexOf(
      demoOrder.status,
    );

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <main className="min-h-screen bg-white py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-5">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mx-auto max-w-2xl text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1ef]">
            <Package
              size={30}
              className="text-[#ff594d]"
            />
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Track Your Order
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Enter your tracking ID below to
            check the current status of your
            order.
          </p>

        </div>

        {/* =================================================
            TRACKING SEARCH
        ================================================= */}

        <div className="mx-auto mt-8 max-w-2xl">

          <form
            onSubmit={
              handleTrackOrder
            }
            className="flex flex-col gap-3 sm:flex-row"
          >

            <div className="relative flex-1">

              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={trackingId}
                onChange={(event) => {
                  setTrackingId(
                    event.target.value,
                  );
                  setError("");
                }}
                placeholder="Enter tracking ID"
                className="w-full rounded-lg border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#ff594d] focus:ring-1 focus:ring-[#ff594d]"
              />

            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#ff594d] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-black"
            >
              <Search size={17} />
              Track Order
            </button>

          </form>

          {error && (
            <p className="mt-3 text-center text-sm text-red-500">
              {error}
            </p>
          )}

          <p className="mt-3 text-center text-xs text-gray-400">
            Demo tracking ID:{" "}
            <button
              type="button"
              onClick={() =>
                setTrackingId(
                  demoOrder.trackingId,
                )
              }
              className="font-semibold text-[#ff594d] hover:underline"
            >
              {demoOrder.trackingId}
            </button>
          </p>

        </div>

        {/* =================================================
            ORDER RESULT
        ================================================= */}

        {searchedId && (
          <div className="mt-12">

            {/* ORDER INFO */}

            <div className="rounded-xl border border-gray-200 bg-white p-6">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    Tracking ID
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-gray-900">
                    {demoOrder.trackingId}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Order {demoOrder.orderId}
                  </p>

                </div>

                <div className="text-left sm:text-right">

                  <p className="text-xs text-gray-400">
                    Current Status
                  </p>

                  <span className="mt-2 inline-flex rounded-full bg-[#fff1ef] px-4 py-1.5 text-xs font-semibold text-[#ff594d]">
                    {demoOrder.status}
                  </span>

                </div>

              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2">

                <div>
                  <p className="text-xs text-gray-400">
                    Order Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {demoOrder.placedAt}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Estimated Delivery
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {demoOrder.estimatedDelivery}
                  </p>
                </div>

              </div>

            </div>

            {/* =================================================
                STATUS TIMELINE
            ================================================= */}

            <div className="mt-8 rounded-xl border border-gray-200 p-6 md:p-8">

              <h2 className="text-xl font-bold text-gray-900">
                Order Status
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Follow your order's progress
                below.
              </p>

              <div className="mt-8">

                {trackingSteps.map(
                  (step, index) => {
                    const stepIndex =
                      statusOrder.indexOf(
                        step.status,
                      );

                    const isCompleted =
                      stepIndex <=
                      currentStatusIndex;

                    const isCurrent =
                      step.status ===
                      demoOrder.status;

                    const isLast =
                      index ===
                      trackingSteps.length -
                        1;

                    return (
                      <div
                        key={step.status}
                        className="relative flex gap-4"
                      >

                        {/* CONNECTOR */}

                        {!isLast && (
                          <div
                            className={`absolute left-5 top-11 h-[calc(100%-20px)] w-px ${
                              stepIndex <
                              currentStatusIndex
                                ? "bg-[#ff594d]"
                                : "bg-gray-200"
                            }`}
                          />
                        )}

                        {/* ICON */}

                        <div
                          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                            isCompleted
                              ? "border-[#ff594d] bg-[#ff594d] text-white"
                              : "border-gray-200 bg-white text-gray-400"
                          } ${
                            isCurrent
                              ? "ring-4 ring-[#fff1ef]"
                              : ""
                          }`}
                        >
                          {getStatusIcon(
                            step.status,
                          )}
                        </div>

                        {/* CONTENT */}

                        <div
                          className={`min-w-0 flex-1 ${
                            isLast
                              ? "pb-0"
                              : "pb-9"
                          }`}
                        >

                          <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">

                            <div>

                              <h3
                                className={`text-sm font-semibold ${
                                  isCompleted
                                    ? "text-gray-900"
                                    : "text-gray-400"
                                }`}
                              >
                                {step.title}
                              </h3>

                              <p
                                className={`mt-1 text-sm leading-5 ${
                                  isCompleted
                                    ? "text-gray-500"
                                    : "text-gray-400"
                                }`}
                              >
                                {
                                  step.description
                                }
                              </p>

                            </div>

                            {step.date && (
                              <span className="shrink-0 text-xs text-gray-400">
                                {step.date}
                              </span>
                            )}

                          </div>

                          {isCurrent && (
                            <span className="mt-3 inline-flex rounded-full bg-[#fff1ef] px-3 py-1 text-xs font-medium text-[#ff594d]">
                              Current Status
                            </span>
                          )}

                        </div>

                      </div>
                    );
                  },
                )}

              </div>

            </div>

            {/* =================================================
                BOTTOM
            ================================================= */}

            <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl bg-gray-50 p-5 sm:flex-row">

              <p className="text-sm text-gray-600">
                Need help with your order?
              </p>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#ff594d] transition hover:text-black"
              >
                <ArrowLeft size={16} />
                Continue Shopping
              </Link>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}