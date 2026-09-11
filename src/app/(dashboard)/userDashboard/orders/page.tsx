"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Package,
  Clock3,
  CheckCircle2,
  ArrowUpRight,
  ShoppingBag,
  Loader2,
  RefreshCw,
  PackageX,
  AlertCircle,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { useSession } from "@/lib/auth-client";

interface OrderItem {
  product?: {
    _id: string;
    name?: string;
    price?: number;
    images?: string[];
    brand?: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  trackingId: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod?: string;
  status: string;
  isCancelled?: boolean;
  createdAt: string;
}

type FetchState = "loading" | "error" | "ready";

const statusLabel = (status: string) =>
  status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const statusTone = (status: string) => {
  const s = status.toLowerCase();
  if (s === "delivered") {
    return {
      badge: "bg-emerald-500/10 text-emerald-500",
      dot: "bg-emerald-500",
      pulse: false,
    };
  }
  if (s === "cancelled") {
    return {
      badge: "bg-rose-500/10 text-rose-500",
      dot: "bg-rose-500",
      pulse: false,
    };
  }
  if (s === "shipped" || s === "out_for_delivery") {
    return {
      badge: "bg-blue-500/10 text-blue-500",
      dot: "bg-blue-500",
      pulse: true,
    };
  }
  return {
    badge: "bg-amber-500/10 text-amber-500",
    dot: "bg-amber-500",
    pulse: true,
  };
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const orderItemCount = (items: OrderItem[]) =>
  items.reduce((sum, item) => sum + (item.quantity || 1), 0);

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [state, setState] = useState<FetchState>("loading");
  const [refreshKey, setRefreshKey] = useState(0);
  // const { data: session } = useSession();
  orders;
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders`,
          {
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          },
        );
        const json = res.ok ? await res.json() : null;
        if (!active) return;

        if (json && Array.isArray(json.data)) {
          setOrders(json.data as Order[]);
          setState("ready");
        } else {
          throw new Error("Invalid response");
        }
      } catch {
        if (active) setState("error");
      }
    })();

    return () => {
      active = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [refreshKey]);

  const retry = useCallback(() => {
    setState("loading");
    setRefreshKey((key) => key + 1);
  }, []);

  const delivered = orders.filter((o) => o.status === "delivered").length;
  const pending = orders.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled",
  ).length;

  return (
    <div className="min-h-screen space-y-7 bg-background">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
            <ShoppingBag className="h-3.5 w-3.5" />
            Purchase History
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            My Orders<span className="text-primary">.</span>
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Track and manage all your purchases.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Package className="h-4 w-4 text-primary" />
          {state === "ready" ? `${orders.length} total orders` : "Loading..."}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total */}
        <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
          <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-primary/10 blur-2xl transition-all group-hover:bg-primary/20" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Total Orders
              </p>
              <p className="mt-2 text-3xl font-black">
                {state === "ready" ? orders.length : "—"}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Package className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Delivered */}
        <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5">
          <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-emerald-500/10 blur-2xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Delivered
              </p>
              <p className="mt-2 text-3xl font-black">
                {state === "ready" ? delivered : "—"}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5">
          <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-amber-500/10 blur-2xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Active Orders
              </p>
              <p className="mt-2 text-3xl font-black">
                {state === "ready" ? pending : "—"}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Clock3 className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b p-5 sm:p-6">
          <div>
            <h2 className="font-bold">Recent Orders</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Your latest purchases
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShoppingBag className="h-4 w-4" />
          </div>
        </div>

        {/* Error State */}
        {state === "error" && (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
              <AlertCircle className="h-7 w-7" />
            </div>
            <div>
              <p className="font-bold">Couldn&apos;t load your orders</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Please try again or check your connection.
              </p>
            </div>
            <button
              onClick={retry}
              className="inline-flex items-center gap-2 rounded-xl border bg-background px-4 py-2 text-xs font-bold text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {state === "ready" && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <PackageX className="h-10 w-10" />
            </div>
            <h3 className="mt-5 text-xl font-black">No orders yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              You haven&apos;t placed any orders. Explore our products and make
              your first purchase today.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
            >
              Start Shopping
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Loading State */}
        {state === "loading" && (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Fetching your orders...
            </p>
          </div>
        )}

        {/* Desktop Table */}
        {state === "ready" && orders.length > 0 && (
          <div className="hidden md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/30 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {orders.map((order) => {
                  const tone = statusTone(order.status);
                  const items = orderItemCount(order.items);

                  return (
                    <tr
                      key={order._id}
                      className="group transition-all duration-200 hover:bg-muted/20"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                            <Package className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="font-mono text-sm font-bold">
                              {order.trackingId}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {order.items[0]?.product?.name || "Purchase"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold">
                          {items} {items === 1 ? "Item" : "Items"}
                        </span>
                      </td>

                      <td className="px-6 py-5 font-black">
                        ${order.totalAmount.toFixed(2)}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${tone.badge}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${tone.dot} ${
                              tone.pulse ? "animate-pulse" : ""
                            }`}
                          />
                          {statusLabel(order.status)}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/userDashboard/orders/${order._id}`}
                          className="group/link inline-flex items-center gap-2 rounded-xl border bg-background px-3.5 py-2 text-xs font-bold transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                          <ArrowUpRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Cards */}
        {state === "ready" && orders.length > 0 && (
          <div className="divide-y md:hidden">
            {orders.map((order) => {
              const tone = statusTone(order.status);
              const items = orderItemCount(order.items);

              return (
                <div
                  key={order._id}
                  className="p-4 transition-colors hover:bg-muted/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Package className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-sm font-black">
                            {order.trackingId}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${tone.badge}`}
                        >
                          {statusLabel(order.status)}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Total
                          </p>
                          <p className="font-black">
                            ${order.totalAmount.toFixed(2)}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Items
                          </p>
                          <p className="font-bold">{items}</p>
                        </div>

                        <Link
                          href={`/userDashboard/orders/${order._id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        {state === "ready" && orders.length > 0 && (
          <div className="border-t bg-muted/20 px-5 py-4">
            <p className="text-center text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-bold text-foreground">{orders.length}</span>{" "}
              recent orders
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
